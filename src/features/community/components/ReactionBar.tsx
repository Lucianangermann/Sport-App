import { useState } from 'react';

interface Props {
  reactions: { fire: number; muscle: number; clap: number };
  userReaction?: 'fire' | 'muscle' | 'clap';
  onReact: (r: 'fire' | 'muscle' | 'clap') => void;
}

type ReactionKey = 'fire' | 'muscle' | 'clap';

const reactionConfig: { key: ReactionKey; emoji: string }[] = [
  { key: 'fire', emoji: '🔥' },
  { key: 'muscle', emoji: '💪' },
  { key: 'clap', emoji: '👏' },
];

export const ReactionBar = ({ reactions, userReaction, onReact }: Props) => {
  const [animating, setAnimating] = useState<ReactionKey | null>(null);

  const handleReact = (key: ReactionKey) => {
    setAnimating(key);
    setTimeout(() => setAnimating(null), 300);
    onReact(key);
  };

  return (
    <div className="flex gap-1">
      {reactionConfig.map(({ key, emoji }) => {
        const isActive = userReaction === key;
        const isAnimating = animating === key;
        return (
          <button
            key={key}
            onClick={() => handleReact(key)}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
              isActive
                ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                : 'bg-slate-100 text-slate-700 dark:bg-ink-700 dark:text-slate-300'
            } ${isAnimating ? 'scale-125' : 'scale-100'}`}
          >
            <span>{emoji}</span>
            <span>{reactions[key]}</span>
          </button>
        );
      })}
    </div>
  );
};
