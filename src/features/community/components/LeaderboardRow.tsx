import type { LeaderboardEntry } from '../../../data/community';

interface Props {
  entry: LeaderboardEntry;
  isUser?: boolean;
  target?: number;
}

const rankEmoji = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return rank.toString();
};

export const LeaderboardRow = ({ entry, isUser, target }: Props) => {
  const progressPct = target ? Math.min(100, Math.round((entry.progress / target) * 100)) : 0;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3 ${
        isUser
          ? 'bg-violet-50 dark:bg-violet-900/20'
          : 'bg-slate-50 dark:bg-ink-700/50'
      }`}
    >
      <div className="w-8 text-center text-lg font-bold text-ink-900 dark:text-white">
        {rankEmoji(entry.rank)}
      </div>
      <img
        src={entry.avatar}
        alt=""
        className="h-9 w-9 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-semibold text-ink-900 dark:text-white">
          {entry.name}
          {isUser && (
            <span className="ml-1 text-xs font-normal text-violet-600 dark:text-violet-400">(Du)</span>
          )}
        </div>
        {target !== undefined && (
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-ink-600">
            <div
              className="h-full rounded-full bg-violet-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>
      <div className="text-sm font-bold text-ink-900 dark:text-white">{entry.progress}</div>
    </div>
  );
};
