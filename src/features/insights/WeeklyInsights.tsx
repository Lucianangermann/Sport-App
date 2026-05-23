import { useInsights } from './useInsights';

const LoadingDots = () => (
  <div className="flex items-center gap-1.5">
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
  </div>
);

const InsightCardView = ({
  icon,
  title,
  text,
  index,
}: {
  icon: string;
  title: string;
  text: string;
  index: number;
}) => (
  <div
    style={{ animationDelay: `${index * 120}ms` }}
    className="animate-slide-up flex gap-3 rounded-2xl bg-white p-4 shadow-card dark:bg-ink-800 dark:shadow-card-dark"
  >
    <div className="text-2xl">{icon}</div>
    <div className="min-w-0 flex-1">
      <div className="font-display text-sm font-bold text-ink-900 dark:text-white">{title}</div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  </div>
);

export const WeeklyInsights = () => {
  const { insights, prognose, stats, loading, error, generate } = useInsights();
  const hasInsights = insights.length > 0;
  const isMonday = new Date().getDay() === 1;
  const noData = stats?.modulesThisWeek === 0 && stats?.totalCompleted === 0;

  if (noData) return null;

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">
          Wochen-Insights {isMonday && '✨'}
        </h2>
        {!hasInsights && !loading && (
          <button
            onClick={() => void generate()}
            className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-ink-900"
          >
            Insights generieren
          </button>
        )}
        {hasInsights && !loading && (
          <button
            onClick={() => void generate()}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            Neu generieren
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-card dark:bg-ink-800 dark:text-slate-400 dark:shadow-card-dark">
          <LoadingDots />
          <span>Die KI analysiert deine Woche…</span>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/15 dark:text-rose-300">
          <div className="font-semibold">Insights kurz offline.</div>
          <button
            onClick={() => void generate()}
            className="mt-2 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white"
          >
            Nochmal versuchen
          </button>
        </div>
      )}

      {(hasInsights || prognose) && !loading && (
        <div className="space-y-2">
          {insights.map((card, i) => (
            <InsightCardView key={i} {...card} index={i} />
          ))}
          {prognose && <InsightCardView {...prognose} index={insights.length} />}
        </div>
      )}
    </section>
  );
};
