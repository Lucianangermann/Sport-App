import { Link, Navigate, useParams } from 'react-router-dom';
import { CLUBS } from '../data/clubs';
import { getSportById, formatDistance } from '../utils/helpers';
import { PageHeader } from '../components/PageHeader';

export const ClubDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const club = CLUBS.find((c) => c.id === id);
  if (!club) return <Navigate to="/clubs" replace />;
  const sport = getSportById(club.sportId);
  const accent = sport?.color ?? '#0B0F14';

  return (
    <div>
      <PageHeader title={club.name} subtitle={sport?.name} back />

      <div className="px-5">
        <div
          className="flex h-40 items-center justify-center rounded-2xl text-6xl"
          style={{ background: `${accent}1a`, color: accent }}
        >
          {sport?.emoji ?? '🏅'}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="Entfernung" value={formatDistance(club.distanceKm)} />
          <Stat label="Bewertung" value={`⭐ ${club.rating.toFixed(1)}`} />
          <Stat label="Mitglieder" value={`${club.memberCount}`} />
        </div>

        <section className="mt-5">
          <h2 className="mb-1 font-display text-base font-bold">Über den Verein</h2>
          <p className="text-sm text-slate-600">{club.description}</p>
        </section>

        <section className="mt-5">
          <h2 className="mb-2 font-display text-base font-bold">Trainingszeiten</h2>
          <ul className="space-y-1.5">
            {club.trainingTimes.map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm shadow-card">
                <span>🗓️</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5">
          <h2 className="mb-2 font-display text-base font-bold">Kontakt</h2>
          <div className="rounded-2xl bg-white p-3 text-sm shadow-card">
            <div className="flex items-center gap-2 py-1">📍 {club.address}</div>
            <div className="flex items-center gap-2 py-1">✉️ {club.contactEmail}</div>
            <div className="flex items-center gap-2 py-1">📞 {club.contactPhone}</div>
          </div>
        </section>

        <div className="my-6">
          {club.trialAvailable ? (
            <Link
              to={`/club/${club.id}/contact`}
              className="block w-full rounded-2xl bg-ink-900 py-4 text-center font-semibold text-white"
            >
              🤝 Probetraining anfragen
            </Link>
          ) : (
            <button
              disabled
              className="block w-full rounded-2xl bg-slate-200 py-4 text-center font-semibold text-slate-500"
            >
              Kein Probetraining verfügbar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-white p-3 text-center shadow-card">
    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
    <div className="font-display text-base font-bold">{value}</div>
  </div>
);
