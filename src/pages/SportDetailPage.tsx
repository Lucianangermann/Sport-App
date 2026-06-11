import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getSportById, moduleKey } from '../utils/helpers';
import { useNearbyClubs } from '../hooks/useNearbyClubs';
import { useAppStore } from '../store/useAppStore';
import { CURRICULA, LEVEL_LABELS } from '../data/modules';
import type { SkillLevel, Sport } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { ClubCard } from '../components/ClubCard';
import { SportCoach } from '../features/ai-coach/SportCoach';

const LEVELS: SkillLevel[] = ['anfaenger', 'fortgeschritten', 'profi'];

export const SportDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const sport = id ? getSportById(id) : undefined;
  // Guard here, before any feature hooks, so the content component can call all
  // its hooks unconditionally with a guaranteed `sport`.
  if (!sport) return <Navigate to="/discover" replace />;
  return <SportDetailContent sport={sport} />;
};

const SportDetailContent = ({ sport }: { sport: Sport }) => {
  const setLastSport = useAppStore((s) => s.setLastSport);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const progress = useAppStore((s) => s.progress);
  const [coachOpen, setCoachOpen] = useState(false);

  useEffect(() => {
    setLastSport(sport.id);
  }, [sport.id, setLastSport]);

  // Derive active level + completed modules for coach context
  const { activeLevel, completedModules } = useMemo(() => {
    const c = CURRICULA[sport.id];
    const allCompleted = (['anfaenger', 'fortgeschritten', 'profi'] as const).flatMap((lvl) =>
      c[lvl].filter((m) => progress[moduleKey(sport.id, lvl, m.id)]),
    );
    // Active level = furthest level with any progress; default Anfänger
    let lvl: SkillLevel = 'anfaenger';
    if (c.profi.some((m) => progress[moduleKey(sport.id, 'profi', m.id)])) lvl = 'profi';
    else if (c.fortgeschritten.some((m) => progress[moduleKey(sport.id, 'fortgeschritten', m.id)]))
      lvl = 'fortgeschritten';
    return { activeLevel: lvl, completedModules: allCompleted };
  }, [sport, progress]);

  const curriculum = CURRICULA[sport.id];
  const isFav = favorites.includes(sport.id);
  const { clubs, loading: clubsLoading } = useNearbyClubs({ sportId: sport.id, radiusKm: 10 });

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
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setCoachOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-white p-3 text-left shadow-card dark:bg-ink-800 dark:shadow-card-dark"
          >
            <div className="text-2xl">💬</div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">KI-Chat</div>
              <div className="truncate font-display text-sm font-bold text-ink-900 dark:text-white">
                Coach fragen
              </div>
            </div>
          </button>
          <Link
            to={`/sport/${sport.id}/plan`}
            className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-card dark:bg-ink-800 dark:shadow-card-dark"
          >
            <div className="text-2xl">📅</div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">KI-Plan</div>
              <div className="truncate font-display text-sm font-bold text-ink-900 dark:text-white">
                Trainingsplan
              </div>
            </div>
          </Link>
        </div>
      </section>

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

      <section className="px-5 pt-7 pb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">Vereine in deiner Nähe</h2>
          <Link to={`/sport/${sport.id}/clubs`} className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Alle →
          </Link>
        </div>
        <div className="space-y-2">
          {clubsLoading && clubs.length === 0 && (
            <div className="rounded-2xl bg-white p-4 text-xs text-slate-500 shadow-card dark:bg-ink-800 dark:text-slate-400 dark:shadow-card-dark">
              Suche nach Vereinen läuft…
            </div>
          )}
          {!clubsLoading && clubs.length === 0 && (
            <Link
              to={`/sport/${sport.id}/clubs`}
              className="block rounded-2xl bg-white p-4 text-xs text-slate-500 shadow-card dark:bg-ink-800 dark:text-slate-400 dark:shadow-card-dark"
            >
              Keine Vereine im 10-km-Radius — Tippen, um den Radius zu erweitern.
            </Link>
          )}
          {clubs.slice(0, 3).map((c) => (
            <ClubCard key={c.id} club={c} />
          ))}
        </div>
      </section>

      <SportCoach
        sport={sport}
        level={activeLevel}
        completedModules={completedModules}
        open={coachOpen}
        onClose={() => setCoachOpen(false)}
      />
    </div>
  );
};
