import { Link, Navigate, useParams } from 'react-router-dom';
import { findClubById, getSportById, formatDistance } from '../utils/helpers';
import { emojiForClub } from '../utils/clubVisuals';
import { PageHeader } from '../components/PageHeader';

export const ClubDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const clubId = id ? decodeURIComponent(id) : '';
  const club = clubId ? findClubById(clubId) : undefined;
  if (!club) return <Navigate to="/clubs" replace />;
  const sport = getSportById(club.sportId);
  const accent = sport?.color ?? '#0B0F14';
  const emoji = emojiForClub(club, sport);

  const stats: Array<{ label: string; value: string }> = [
    { label: 'Entfernung', value: formatDistance(club.distanceKm) },
  ];
  if (club.rating != null) stats.push({ label: 'Bewertung', value: `⭐ ${club.rating.toFixed(1)}` });
  if (club.memberCount != null) stats.push({ label: 'Mitglieder', value: `${club.memberCount}` });
  if (stats.length === 1 && club.source === 'osm') {
    stats.push({ label: 'Quelle', value: 'OSM' });
  }

  const phoneHref = club.contactPhone ? `tel:${club.contactPhone.replace(/\s+/g, '')}` : undefined;
  const emailHref = club.contactEmail ? `mailto:${club.contactEmail}` : undefined;
  const mapsHref = club.lat != null && club.lon != null
    ? `https://www.openstreetmap.org/?mlat=${club.lat}&mlon=${club.lon}#map=17/${club.lat}/${club.lon}`
    : club.address
      ? `https://www.openstreetmap.org/search?query=${encodeURIComponent(club.address)}`
      : undefined;

  return (
    <div>
      <PageHeader title={club.name} subtitle={sport?.name} back />

      <div className="px-5">
        <div
          className="flex h-40 items-center justify-center rounded-2xl text-6xl"
          style={{ background: `${accent}1a`, color: accent }}
        >
          {emoji}
        </div>

        <div
          className={`mt-4 grid gap-2 ${
            stats.length >= 3 ? 'grid-cols-3' : stats.length === 2 ? 'grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>

        {club.description && (
          <section className="mt-5">
            <h2 className="mb-1 font-display text-base font-bold text-ink-900 dark:text-white">Über den Verein</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{club.description}</p>
          </section>
        )}

        {club.trainingTimes && club.trainingTimes.length > 0 && (
          <section className="mt-5">
            <h2 className="mb-2 font-display text-base font-bold text-ink-900 dark:text-white">Trainingszeiten</h2>
            <ul className="space-y-1.5">
              {club.trainingTimes.map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-ink-900 shadow-card dark:bg-ink-800 dark:text-white dark:shadow-card-dark"
                >
                  <span>🗓️</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {club.openingHours && !club.trainingTimes?.length && (
          <section className="mt-5">
            <h2 className="mb-2 font-display text-base font-bold text-ink-900 dark:text-white">Öffnungszeiten</h2>
            <div className="rounded-xl bg-white px-3 py-2 text-sm text-ink-900 shadow-card dark:bg-ink-800 dark:text-white dark:shadow-card-dark">
              {club.openingHours}
            </div>
          </section>
        )}

        <section className="mt-5">
          <h2 className="mb-2 font-display text-base font-bold text-ink-900 dark:text-white">Kontakt & Anfahrt</h2>
          <div className="space-y-2 rounded-2xl bg-white p-3 text-sm text-ink-900 shadow-card dark:bg-ink-800 dark:text-white dark:shadow-card-dark">
            {club.address && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 py-1 underline-offset-2 hover:underline"
              >
                📍 <span>{club.address}</span>
              </a>
            )}
            {emailHref && (
              <a href={emailHref} className="flex items-center gap-2 py-1 underline-offset-2 hover:underline">
                ✉️ {club.contactEmail}
              </a>
            )}
            {phoneHref && (
              <a href={phoneHref} className="flex items-center gap-2 py-1 underline-offset-2 hover:underline">
                📞 {club.contactPhone}
              </a>
            )}
            {club.website && (
              <a
                href={club.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 py-1 underline-offset-2 hover:underline"
              >
                🌐 {club.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            )}
            {!club.address && !emailHref && !phoneHref && !club.website && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Keine Kontaktdaten in OpenStreetMap hinterlegt.
              </div>
            )}
          </div>
        </section>

        <div className="mb-3 mt-5">
          <Link
            to={`/club/${encodeURIComponent(club.id)}/community`}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-violet-100 py-3.5 text-center font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
          >
            👥 Vereins-Community
          </Link>
        </div>

        <div className="my-3">
          {club.trialAvailable ? (
            <Link
              to={`/club/${encodeURIComponent(club.id)}/contact`}
              className="block w-full rounded-2xl bg-ink-900 py-4 text-center font-semibold text-white dark:bg-white dark:text-ink-900"
            >
              🤝 Probetraining anfragen
            </Link>
          ) : club.contactEmail ? (
            <Link
              to={`/club/${encodeURIComponent(club.id)}/contact`}
              className="block w-full rounded-2xl bg-ink-900 py-4 text-center font-semibold text-white dark:bg-white dark:text-ink-900"
            >
              ✉️ Anfrage senden
            </Link>
          ) : club.website ? (
            <a
              href={club.website}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-2xl bg-ink-900 py-4 text-center font-semibold text-white dark:bg-white dark:text-ink-900"
            >
              🌐 Zur Vereinswebsite
            </a>
          ) : (
            <button
              disabled
              className="block w-full rounded-2xl bg-slate-200 py-4 text-center font-semibold text-slate-500 dark:bg-ink-700 dark:text-slate-500"
            >
              Kein Online-Kontakt verfügbar
            </button>
          )}
        </div>

        {club.source === 'osm' && (
          <p className="pb-6 text-center text-[11px] text-slate-400 dark:text-slate-500">
            Daten von OpenStreetMap-Mitwirkenden
          </p>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-white p-3 text-center shadow-card dark:bg-ink-800 dark:shadow-card-dark">
    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {label}
    </div>
    <div className="font-display text-base font-bold text-ink-900 dark:text-white">{value}</div>
  </div>
);
