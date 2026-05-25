interface Props {
  score: number;
}

export const MatchScoreBadge = ({ score }: Props) => {
  const isHigh = score >= 80;
  const isMid = score >= 60 && score < 80;

  const colorClass = isHigh
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    : isMid
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400';

  const icon = isHigh ? '🔥' : isMid ? '⚡' : '👋';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${colorClass}`}>
      <span>{icon}</span>
      <span>{score}%</span>
    </span>
  );
};
