import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getSportById, getClubsForSport, moduleKey } from '../utils/helpers';
import { useAppStore } from '../store/useAppStore';
import { CURRICULA, LEVEL_LABELS } from '../data/modules';
import type { SkillLevel } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { ClubCard } from '../components/ClubCard';

const LEVELS: SkillLevel[] = ['anfaenger', 'fortgeschritten', 'profi'];

export const SportDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const sport = id ? getSportById(id) : undefined;
  const setLastSport = useAppStore((s) => s.setLastSport);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const progress = useAppStore((s) => s.progress);

  useEffect(() => {
    if (id && sport) setLastSport(id);
  }, [id, sport, setLastSport]);

  if (!sport) return <Navigate to="/discover" replace />;

  const curriculum = CURRICULA[sport.id];
  const isFav = favorites.includes(sport.id);
  const clubs = getClubsForSport(sport.id);

  const levelProgress = (level: SkillLevel) => {
    const modules = curriculum[level];
    const done = modules.filter((m) => progress[moduleKey(sport.id, level, m.id)]).length;
    return { done, total: modules.length, ratio: done / modules.length };
  };

  return (
    <div>
      <header
        className="relative rounded-b-3xl px-5 pt-8 pb-7 text-white"
        style={{ background: `linear-gradient(135deg, ${sport.color}, ${sport.color}cc)` }}
      >
        <div className="flex items-start justify-between">
          <Link to="/discover" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            ←
          </Link>
          <button
            onClick={() => toggleFavorite(sport.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur"
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="mt-6 text-6xl">{sport.emoji}</div>
        <h1 className="mt-2 font-display text-3xl font-bold">{sport.name}</h1>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
            {sport.category}
          </span>
          {sport.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-3 text-sm text-white/90">{sport.description}</p>
      </header>

      <section className="px-5 pt-6">
        <h2 className="mb-3 font-display text-lg font-bold text-ink-900 dark:text-white">Dein Lernpfad</h2>
        <div className="space-y-3">
          {LEVELS.map((lvl) => {
            const meta = LEVEL_LABELS[lvl];
            const { done, total, ratio } = levelProgress(lvl);
            return (
              <Link
                key={lvl}
                to={`/sport/${sport.id}/${lvl}`}
                className="block rounded-2xl bg-white p-4 shadow-card dark:bg-ink-800 dark:shadow-card-dark"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{meta.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-display text-base font-bold text-ink-900 dark:text-white">
                        {meta.label}
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {done}/{total}
                      </span>
                    </div>
                    <div className="mb-2 text-xs text-slate-500 dark:text-slate-400">{meta.subtitle}</div>
                    <ProgressBar value={ratio} color={sport.color} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {clubs.length > 0 && (
        <section className="px-5 pt-7 pb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">Vereine in deiner Nähe</h2>
            <Link to={`/sport/${sport.id}/clubs`} className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Alle →
            </Link>
          </div>
          <div className="space-y-2">
            {clubs.slice(0, 3).map((c) => (
              <ClubCard key={c.id} club={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
