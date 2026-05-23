/**
 * Shared Claude API helper.
 *
 * The API key is injected by a proxy — we POST to api.anthropic.com directly
 * with no Authorization header. The proxy handles auth.
 */

const ENDPOINT = 'https://api.anthropic.com/v1/messages';
export const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

export type ChatRole = 'user' | 'assistant';
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ClaudeOptions {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

const baseHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'anthropic-version': '2023-06-01',
  // Required for direct browser calls when no Authorization header is sent.
  // The proxy still injects the API key server-side.
  'anthropic-dangerous-direct-browser-access': 'true',
});

const buildBody = ({ system, messages, maxTokens = 1024, temperature }: ClaudeOptions) => ({
  model: CLAUDE_MODEL,
  max_tokens: maxTokens,
  system,
  messages,
  ...(temperature !== undefined ? { temperature } : {}),
});

/**
 * One-shot Claude call. Returns the assistant text.
 */
export async function callClaude(opts: ClaudeOptions): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: baseHeaders(),
    body: JSON.stringify(buildBody(opts)),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Claude API ${res.status}: ${errText || res.statusText}`);
  }

  const data = await res.json();
  const text = (data?.content ?? [])
    .filter((b: { type?: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('');
  return text;
}

/**
 * Convenience helper: ask Claude for JSON and parse it.
 * Strips ```json fences if Claude adds them anyway.
 */
export async function callClaudeJSON<T = unknown>(opts: ClaudeOptions): Promise<T> {
  const raw = await callClaude(opts);
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    throw new Error(`Claude returned non-JSON output: ${cleaned.slice(0, 200)}…`);
  }
}

export interface StreamHandlers {
  /** Called for each token/chunk of text */
  onDelta?: (text: string) => void;
  /** Called once when the stream completes */
  onDone?: (fullText: string) => void;
  /** Called on error */
  onError?: (err: Error) => void;
  /** AbortSignal to cancel the stream */
  signal?: AbortSignal;
}

/**
 * Streaming Claude call. Parses SSE and emits token deltas.
 *
 * Returns the full assembled text on completion.
 */
export async function streamClaude(opts: ClaudeOptions, handlers: StreamHandlers = {}): Promise<string> {
  const { onDelta, onDone, onError, signal } = handlers;

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: baseHeaders(),
      body: JSON.stringify({ ...buildBody(opts), stream: true }),
      signal,
    });
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    onError?.(e);
    throw e;
  }

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => '');
    const e = new Error(`Claude API ${res.status}: ${errText || res.statusText}`);
    onError?.(e);
    throw e;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE: events separated by \n\n. Each event has "event: type\ndata: {...}" lines.
      let sepIdx: number;
      while ((sepIdx = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, sepIdx);
        buffer = buffer.slice(sepIdx + 2);

        const dataLine = rawEvent
          .split('\n')
          .find((l) => l.startsWith('data: '));
        if (!dataLine) continue;
        const payload = dataLine.slice(6);
        if (payload === '[DONE]') continue;

        try {
          const evt = JSON.parse(payload);
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
            const chunk: string = evt.delta.text ?? '';
            if (chunk) {
              fullText += chunk;
              onDelta?.(chunk);
            }
          }
          // Other events (message_start, content_block_start, message_delta, message_stop)
          // are ignored — we only care about text content.
        } catch {
          // Malformed JSON chunk — skip silently.
        }
      }
    }
  } catch (err) {
    if (signal?.aborted) {
      // Caller cancelled — not an error.
      return fullText;
    }
    const e = err instanceof Error ? err : new Error(String(err));
    onError?.(e);
    throw e;
  }

  onDone?.(fullText);
  return fullText;
}
