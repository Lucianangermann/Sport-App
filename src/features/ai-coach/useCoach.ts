import { useCallback, useEffect, useRef, useState } from 'react';
import { streamClaude, type ChatMessage } from '../../lib/claude';
import type { SkillLevel, Sport, TrainingModule } from '../../types';

const MAX_HISTORY = 30;
const STORAGE_KEY = (sportId: string) => `coach_history_${sportId}`;

const loadHistory = (sportId: string): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(sportId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-MAX_HISTORY);
  } catch {
    return [];
  }
};

const saveHistory = (sportId: string, history: ChatMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEY(sportId), JSON.stringify(history.slice(-MAX_HISTORY)));
  } catch {
    // Storage full or disabled — ignore.
  }
};

interface UseCoachArgs {
  sport: Sport;
  level: SkillLevel;
  completedModules: TrainingModule[];
}

const LEVEL_DE: Record<SkillLevel, string> = {
  anfaenger: 'Anfänger',
  fortgeschritten: 'Fortgeschritten',
  profi: 'Profi',
};

export function useCoach({ sport, level, completedModules }: UseCoachArgs) {
  const [history, setHistory] = useState<ChatMessage[]>(() => loadHistory(sport.id));
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Re-load history when sport changes
  useEffect(() => {
    setHistory(loadHistory(sport.id));
    setStreamingText('');
    setError(null);
  }, [sport.id]);

  const buildSystem = useCallback(() => {
    const moduleList = completedModules.length
      ? completedModules.map((m) => `- ${m.title}`).join('\n')
      : '(noch keine Module abgeschlossen)';
    return `Du bist ein erfahrener ${sport.name}-Trainer und persönlicher Coach.

Der Nutzer ist auf Level ${LEVEL_DE[level]} und hat folgende Module abgeschlossen:
${moduleList}

Antworte immer auf Deutsch, kurz und motivierend. Maximal 3 Sätze pro Antwort. Beziehe dich, wenn passend, auf den Trainingsstand des Nutzers.`;
  }, [sport, level, completedModules]);

  const send = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = { role: 'user', content: text.trim() };
      if (!userMsg.content) return;

      const next = [...history, userMsg].slice(-MAX_HISTORY);
      setHistory(next);
      saveHistory(sport.id, next);
      setStreamingText('');
      setError(null);
      setStreaming(true);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const full = await streamClaude(
          {
            system: buildSystem(),
            messages: next,
            maxTokens: 400,
          },
          {
            onDelta: (chunk) => setStreamingText((cur) => cur + chunk),
            signal: ctrl.signal,
          },
        );
        if (!ctrl.signal.aborted && full) {
          const finalHistory = [...next, { role: 'assistant' as const, content: full }].slice(-MAX_HISTORY);
          setHistory(finalHistory);
          saveHistory(sport.id, finalHistory);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      } finally {
        setStreaming(false);
        setStreamingText('');
        abortRef.current = null;
      }
    },
    [history, sport.id, buildSystem],
  );

  const retry = useCallback(() => {
    if (!history.length) return;
    // Resend last user message
    const lastUser = [...history].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    // Drop trailing assistant turns (if any) and user, then resend
    const trimmed = (() => {
      const idx = history.findIndex((m) => m === lastUser);
      return history.slice(0, idx);
    })();
    setHistory(trimmed);
    saveHistory(sport.id, trimmed);
    void send(lastUser.content);
  }, [history, send, sport.id]);

  const clear = useCallback(() => {
    setHistory([]);
    saveHistory(sport.id, []);
    setError(null);
  }, [sport.id]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { history, streaming, streamingText, error, send, retry, clear, abort };
}
