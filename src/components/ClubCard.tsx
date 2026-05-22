import { Link } from 'react-router-dom';
import type { Club } from '../types';
import { getSportById, formatDistance } from '../utils/helpers';

interface Props {
  club: Club;
}

export const ClubCard = ({ club }: Props) => {
  const sport = getSportById(club.sportId);
  return (
    <Link
      to={`/club/${club.id}`}
      className="block rounded-2xl bg-white p-4 shadow-card transition active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl"
          style={{ background: `${sport?.color ?? '#0B0F14'}1a` }}
        >
          {sport?.emoji ?? '🏅'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-display text-base font-bold">{club.name}</h3>
            <span className="shrink-0 text-xs font-semibold text-slate-700">
              ⭐ {club.rating.toFixed(1)}
            </span>
          </div>
          <p className="truncate text-xs text-slate-500">{club.address}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
              {formatDistance(club.distanceKm)}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
              {club.memberCount} Mitglieder
            </span>
            {club.trialAvailable && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                Probetraining
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
