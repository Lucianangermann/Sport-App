interface Props {
  sportId: string;
  level?: string;
  small?: boolean;
}

const sportEmojiMap: Record<string, string> = {
  fussball: '⚽',
  basketball: '🏀',
  laufen: '🏃',
  yoga: '🧘',
  schwimmen: '🏊',
  radfahren: '🚴',
  klettern: '🧗',
  tennis: '🎾',
  krafttraining: '🏋️',
  tanzen: '💃',
  handball: '🤾',
  boxen: '🥊',
  judo: '🥋',
  ski: '⛷️',
  golf: '⛳',
  volleyball: '🏐',
  tischtennis: '🏓',
  badminton: '🏸',
  rugby: '🏉',
  hockey: '🏑',
};

const sportColorMap: Record<string, string> = {
  fussball: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  basketball: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  laufen: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  yoga: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  schwimmen: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  radfahren: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  klettern: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  tennis: 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300',
  krafttraining: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  tanzen: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  handball: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  boxen: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  judo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  ski: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  golf: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
};

const levelMap: Record<string, string> = {
  anfaenger: 'Anfänger',
  fortgeschritten: 'Fortgeschritten',
  profi: 'Profi',
};

export const SportBadge = ({ sportId, level, small }: Props) => {
  const emoji = sportEmojiMap[sportId] ?? '🏅';
  const colorClass = sportColorMap[sportId] ?? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
  const levelLabel = level ? levelMap[level] ?? level : null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${colorClass} ${
        small ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
    >
      <span>{emoji}</span>
      {levelLabel && <span>{levelLabel}</span>}
    </span>
  );
};
