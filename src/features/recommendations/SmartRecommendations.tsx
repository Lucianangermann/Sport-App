import { Link } from 'react-router-dom';
import { useRecommendations } from './useRecommendations';
import { SPORTS } from '../../data/sports';

const matchSportId = (name: string): string | null => {
  const lower = name.toLowerCase().trim();
  const found = SPORTS.find(
    (s) => s.name.toLowerCase() === lower || s.id === lower || s.name.toLowerCase().includes(lower),
  );
  return found?.id ?? null;
};

export const SmartRecommendations = () => {
  const { rec, dismissed, loading, error, dismiss } = useRecommendations();

  if (dismissed || error) return null;
  if (loading && !rec) return null; // silent on first load — appears once ready
  if (!rec) return null;

  const sportId = matchSportId(rec.sport);
  const sport = sportId ? SPORTS.find((s) => s.id === sportId) : null;
  const accent = sport?.color ?? '#0B0F14';

  const body = (
    <div
      className="flex animate-slide-up items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-card dark:shadow-card-dark"
      style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
    >
      <div className="text-2xl">{rec.emoji || sport?.emoji || '✨'}</div>
      <div className="min-w-0 flex-1">
        <div className="font-display text-sm font-bold leading-tight">{rec.sport}</div>
        <p className="line-clamp-2 text-xs text-white/85">{rec.reason}</p>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dismiss();
        }}
        className="shrink-0 rounded-full bg-white/20 p-1.5 text-xs text-white/90 backdrop-blur"
        aria-label="Empfehlung schließen"
      >
        ✕
      </button>
    </div>
  );

  return sportId ? (
    <Link to={`/sport/${sportId}`} className="block">
      {body}
    </Link>
  ) : (
    body
  );
};
