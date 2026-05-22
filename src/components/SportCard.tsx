import { Link } from 'react-router-dom';
import type { Sport } from '../types';
import { useAppStore } from '../store/useAppStore';

interface Props {
  sport: Sport;
  size?: 'sm' | 'md' | 'lg';
  hideFavorite?: boolean;
}

export const SportCard = ({ sport, size = 'md', hideFavorite }: Props) => {
  const isFav = useAppStore((s) => s.favorites.includes(sport.id));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const sizeCls = size === 'lg' ? 'h-44' : size === 'sm' ? 'h-28' : 'h-36';

  return (
    <Link
      to={`/sport/${sport.id}`}
      className={`group relative block ${sizeCls} overflow-hidden rounded-2xl p-4 text-white shadow-card transition-transform active:scale-[0.98]`}
      style={{ background: `linear-gradient(135deg, ${sport.color}, ${sport.color}cc 80%)` }}
    >
      <div className="absolute -right-4 -bottom-4 text-7xl opacity-30 transition-transform group-hover:scale-110">
        {sport.emoji}
      </div>
      {!hideFavorite && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(sport.id);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-base backdrop-blur transition hover:bg-white/30"
          aria-label="Favorit umschalten"
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      )}
      <div className="relative z-[1] flex h-full flex-col justify-between">
        <span className="text-3xl">{sport.emoji}</span>
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-white/80">
            {sport.category}
          </div>
          <div className="font-display text-lg font-bold">{sport.name}</div>
        </div>
      </div>
    </Link>
  );
};
