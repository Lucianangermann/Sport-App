import { useEffect, useRef, useState } from 'react';
import { useCoach } from './useCoach';
import type { SkillLevel, Sport, TrainingModule } from '../../types';

interface Props {
  sport: Sport;
  level: SkillLevel;
  completedModules: TrainingModule[];
  open: boolean;
  onClose: () => void;
}

const LoadingDots = () => (
  <div className="flex items-center gap-1.5">
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
  </div>
);

export const SportCoach = ({ sport, level, completedModules, open, onClose }: Props) => {
  const { history, streaming, streamingText, error, send, retry, clear, abort } = useCoach({
    sport,
    level,
    completedModules,
  });
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history, streamingText, open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (streaming || !input.trim()) return;
    void send(input);
    setInput('');
  };

  return (
    <>
      {/* Backdrop */}
      <button
        onClick={onClose}
        aria-label="Schließen"
        className="fixed inset-0 z-40 animate-fade-in bg-black/40"
      />
      {/* Bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[85vh] w-full max-w-[480px] animate-slide-up flex-col rounded-t-3xl bg-slate-50 shadow-2xl dark:bg-ink-900">
        <header
          className="flex shrink-0 items-center justify-between rounded-t-3xl px-5 py-4 text-white"
          style={{ background: `linear-gradient(135deg, ${sport.color}, ${sport.color}cc)` }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-xl backdrop-blur">
              {sport.emoji}
            </div>
            <div>
              <div className="font-display text-base font-bold leading-tight">
                Dein {sport.name}-Coach
              </div>
              <div className="text-[11px] text-white/80">KI-gestützt · auf Deutsch</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Chatverlauf löschen?')) clear();
                }}
                className="text-[11px] font-semibold text-white/80 underline-offset-2 hover:underline"
              >
                Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg backdrop-blur"
              aria-label="Schließen"
            >
              ✕
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          {history.length === 0 && !streaming && !error && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-500 dark:text-slate-400">
              <div className="text-4xl">{sport.emoji}</div>
              <p className="text-sm">
                Frag mich alles zu {sport.name} — Technik, Training, Wettkampf, Ernährung.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {['Wie verbessere ich meine Technik?', 'Was sollte ich heute trainieren?', 'Tipps für mehr Motivation?'].map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink-900 shadow-card dark:bg-ink-800 dark:text-white dark:shadow-card-dark"
                    >
                      {s}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {history.map((msg, i) => (
              <div
                key={i}
                className={`flex animate-slide-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                      : 'bg-white text-ink-900 shadow-card dark:bg-ink-800 dark:text-white dark:shadow-card-dark'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {streaming && (
              <div className="flex animate-slide-up justify-start">
                <div className="max-w-[80%] rounded-2xl bg-white px-4 py-2.5 text-sm leading-relaxed text-ink-900 shadow-card dark:bg-ink-800 dark:text-white dark:shadow-card-dark">
                  {streamingText ? (
                    streamingText
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <LoadingDots />
                    </span>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/15 dark:text-rose-300">
                <div className="font-semibold">Coach ist kurz offline.</div>
                <div className="mb-2 opacity-80">{error}</div>
                <button
                  onClick={retry}
                  className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white"
                >
                  Nochmal versuchen
                </button>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="shrink-0 border-t border-slate-200 bg-white p-3 dark:border-ink-700 dark:bg-ink-800"
        >
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Frag deinen ${sport.name}-Coach…`}
              disabled={streaming}
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-ink-900 disabled:opacity-60 dark:border-ink-700 dark:bg-ink-700 dark:text-white dark:focus:border-white"
            />
            {streaming ? (
              <button
                type="button"
                onClick={abort}
                className="shrink-0 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="shrink-0 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-40 dark:bg-white dark:text-ink-900"
              >
                Senden
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
