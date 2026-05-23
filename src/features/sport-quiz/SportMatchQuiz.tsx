import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from './useQuiz';
import { SPORTS } from '../../data/sports';

const LoadingDots = () => (
  <div className="flex items-center justify-center gap-1.5">
    <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
  </div>
);

const matchSportId = (name: string): string | null => {
  const lower = name.toLowerCase().trim();
  const found = SPORTS.find(
    (s) => s.name.toLowerCase() === lower || s.id === lower || s.name.toLowerCase().includes(lower),
  );
  return found?.id ?? null;
};

const MatchArc = ({ value }: { value: number }) => {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 50);
    return () => clearTimeout(t);
  }, [value]);
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (animated / 100) * circumference;
  return (
    <div className="relative h-16 w-16">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold">
        {Math.round(animated)}%
      </div>
    </div>
  );
};

export const SportMatchQuiz = () => {
  const nav = useNavigate();
  const {
    step,
    currentIdx,
    totalQuestions,
    currentQuestion,
    recommendations,
    isLoadingQuestion,
    error,
    start,
    submitAnswer,
    reset,
    retry,
  } = useQuiz();

  // Re-trigger animations on question change
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [currentIdx]);

  return (
    <div className="app-shell">
      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-8">
        {/* Header / progress */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => nav(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-900 shadow-card dark:bg-ink-700 dark:text-white dark:shadow-card-dark"
            aria-label="Zurück"
          >
            ←
          </button>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {step === 'questions' ? `${currentIdx + 1} / ${totalQuestions}` : step === 'intro' ? 'Sport-Match' : ''}
          </span>
        </div>

        {/* Progress bar */}
        {step === 'questions' && (
          <div className="mb-8 flex gap-1.5">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition ${
                  i <= currentIdx ? 'bg-ink-900 dark:bg-white' : 'bg-slate-200 dark:bg-ink-700'
                }`}
              />
            ))}
          </div>
        )}

        {step === 'intro' && (
          <div className="animate-fade-in space-y-6 pt-4">
            <div className="text-6xl">🎯</div>
            <h1 className="font-display text-3xl font-bold leading-tight text-ink-900 dark:text-white">
              Finde deinen perfekten Sport
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              8 kurze Fragen — und unsere KI empfiehlt dir die fünf Sportarten, die am besten zu dir passen. Dauer: ca. 2
              Minuten.
            </p>
            <div className="space-y-2 rounded-2xl bg-white p-4 text-sm shadow-card dark:bg-ink-800 dark:shadow-card-dark">
              <div className="flex gap-3">
                <span>✨</span>
                <span className="text-slate-700 dark:text-slate-200">3 Basis-Fragen zu deinen Vorlieben</span>
              </div>
              <div className="flex gap-3">
                <span>🤖</span>
                <span className="text-slate-700 dark:text-slate-200">5 dynamische Fragen, von der KI generiert</span>
              </div>
              <div className="flex gap-3">
                <span>📊</span>
                <span className="text-slate-700 dark:text-slate-200">Top-5 Sportarten mit Match-%</span>
              </div>
            </div>
            <button
              onClick={start}
              className="w-full rounded-2xl bg-ink-900 py-4 font-semibold text-white dark:bg-white dark:text-ink-900"
            >
              Quiz starten 🚀
            </button>
          </div>
        )}

        {step === 'questions' && currentQuestion && (
          <div key={animKey} className="animate-slide-up space-y-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Frage {currentIdx + 1}
              {currentIdx >= 3 && <span className="ml-2 text-rose-500">· KI-generiert</span>}
            </div>
            <h2 className="font-display text-2xl font-bold leading-tight text-ink-900 dark:text-white">
              {currentQuestion.question}
            </h2>
            <div className="space-y-2.5 pt-2">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => submitAnswer(opt)}
                  disabled={isLoadingQuestion}
                  className="block w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-left font-medium text-ink-900 transition active:scale-[0.98] disabled:opacity-50 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
                >
                  {opt}
                </button>
              ))}
            </div>
            {isLoadingQuestion && (
              <div className="flex items-center justify-center gap-2 pt-4 text-xs text-slate-500 dark:text-slate-400">
                <LoadingDots />
                <span>Nächste Frage wird generiert…</span>
              </div>
            )}
          </div>
        )}

        {step === 'loading' && (
          <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-ink-900 dark:text-white">
            <div className="text-5xl">🤖</div>
            <h2 className="font-display text-2xl font-bold">Wir analysieren deine Antworten…</h2>
            <LoadingDots />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Die KI berechnet deine Top-5 Sportarten.
            </p>
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-4">
            <div className="text-4xl">🎉</div>
            <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
              Deine Top-5 Sportarten
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Basierend auf deinen Antworten — sortiert nach Passung.
            </p>
            <div className="space-y-3 pt-2">
              {recommendations.map((rec, i) => {
                const sportId = matchSportId(rec.sport);
                const sport = sportId ? SPORTS.find((s) => s.id === sportId) : null;
                return (
                  <div
                    key={i}
                    style={{ animationDelay: `${i * 300}ms` }}
                    className="animate-slide-up rounded-2xl bg-white p-4 shadow-card dark:bg-ink-800 dark:shadow-card-dark"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl"
                        style={{ background: `${sport?.color ?? '#0B0F14'}1a` }}
                      >
                        {sport?.emoji ?? '🏅'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-base font-bold text-ink-900 dark:text-white">
                          {sport?.name ?? rec.sport}
                        </div>
                        <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{rec.reason}</p>
                      </div>
                      <div style={{ color: sport?.color ?? '#0B0F14' }}>
                        <MatchArc value={rec.match} />
                      </div>
                    </div>
                    {sportId && (
                      <Link
                        to={`/sport/${sportId}`}
                        className="mt-3 block rounded-xl bg-ink-900 py-2.5 text-center text-sm font-semibold text-white dark:bg-white dark:text-ink-900"
                      >
                        Mehr erfahren →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              onClick={reset}
              className="mt-4 w-full rounded-2xl bg-slate-100 py-3.5 text-sm font-semibold text-ink-900 dark:bg-ink-700 dark:text-white"
            >
              Quiz wiederholen
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="space-y-4 pt-8">
            <div className="text-5xl">😅</div>
            <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white">
              Quiz-Berater ist kurz offline
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
            <button
              onClick={retry}
              className="w-full rounded-2xl bg-ink-900 py-3.5 font-semibold text-white dark:bg-white dark:text-ink-900"
            >
              Nochmal versuchen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
