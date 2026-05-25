import { Link } from 'react-router-dom';
import type { Club } from '../types';
import { getSportById, formatDistance } from '../utils/helpers';
import { emojiForClub } from '../utils/clubVisuals';

interface Props {
  club: Club;
}

export const ClubCard = ({ club }: Props) => {
  const sport = getSportById(club.sportId);
  const emoji = emojiForClub(club, sport);
  return (
    <Link
      to={`/club/${encodeURIComponent(club.id)}`}
      className="block rounded-2xl bg-white p-4 shadow-card transition active:scale-[0.99] dark:bg-ink-800 dark:shadow-card-dark"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl"
          style={{ background: `${sport?.color ?? '#0B0F14'}1a` }}
        >
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-display text-base font-bold text-ink-900 dark:text-white">
              {club.name}
            </h3>
            {club.rating != null && (
              <span className="shrink-0 text-xs font-semibold text-slate-700 dark:text-slate-300">
                ⭐ {club.rating.toFixed(1)}
              </span>
            )}
          </div>
          {club.address && (
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{club.address}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-ink-700 dark:text-slate-300">
              {formatDistance(club.distanceKm)}
            </span>
            {club.kind && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-ink-700 dark:text-slate-300">
                {club.kind}
              </span>
            )}
            {club.multiSport && (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                Mehrsparten
              </span>
            )}
            {club.memberCount != null && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-ink-700 dark:text-slate-300">
                {club.memberCount} Mitglieder
              </span>
            )}
            {club.trialAvailable && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                Probetraining
              </span>
            )}
            {club.source === 'osm' && (club.website || club.contactPhone) && (
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                Kontakt
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
