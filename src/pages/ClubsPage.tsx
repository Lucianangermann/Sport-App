import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { ClubCard } from '../components/ClubCard';
import { EmptyState } from '../components/EmptyState';
import { useAppStore } from '../store/useAppStore';
import { getSportById } from '../utils/helpers';
import { useNearbyClubs } from '../hooks/useNearbyClubs';
import { isNicheSport } from '../lib/overpass';
import { SPORTS } from '../data/sports';

const LoadingDots = () => (
  <span className="inline-flex gap-1">
    <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
  </span>
);

const RADII = [
  { id: 2, label: '2 km' },
  { id: 5, label: '5 km' },
  { id: 10, label: '10 km' },
  { id: 25, label: '25 km' },
];

export const ClubsPage = () => {
  const { id: sportIdFromRoute } = useParams<{ id?: string }>();
  const settings = useAppStore((s) => s.profile.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const favorites = useAppStore((s) => s.favorites);
  const [radiusKm, setRadiusKm] = useState(5);
  const [selectedSportId, setSelectedSportId] = useState<string | null>(
    sportIdFromRoute ?? favorites[0] ?? 'fussball',
  );
  const sport = selectedSportId ? getSportById(selectedSportId) : undefined;

  const { clubs, loading, error, position, effectiveRadiusKm, requestedRadiusKm, refresh } = useNearbyClubs({
    sportId: selectedSportId,
    radiusKm,
  });
  const expanded = effectiveRadiusKm > requestedRadiusKm;
  const isNiche = selectedSportId ? isNicheSport(selectedSportId) : false;

  const popularSports = useMemo(
    () => [...SPORTS].sort((a, b) => b.popularity - a.popularity).slice(0, 12),
    [],
  );

  return (
    <div>
      <PageHeader
        title={sport ? `${sport.name} in der Nähe` : 'Vereine in der Nähe'}
        subtitle={
          loading
            ? 'wird geladen…'
            : expanded
              ? `${clubs.length} Treffer im erweiterten Umkreis von ${effectiveRadiusKm} km`
              : `${clubs.length} Treffer im Umkreis von ${requestedRadiusKm} km`
        }
        back={!!sportIdFromRoute}
      />

      <div className="space-y-3 px-5 pb-3">
        {!settings.locationEnabled && (
          <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
            <span className="text-xl">📍</span>
            <div className="flex-1">
              <div className="font-semibold text-amber-900 dark:text-amber-200">Standort aktivieren</div>
              <div className="text-xs text-amber-800 dark:text-amber-200/80">
                Ohne Standort suchen wir rund um München. Erlaube uns deinen Standort für echte Treffer in deiner Nähe.
              </div>
            </div>
            <button
              onClick={() => updateSettings({ locationEnabled: true })}
              className="shrink-0 rounded-full bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-amber-300 dark:text-amber-900"
            >
              Erlauben
            </button>
          </div>
        )}

        {settings.locationEnabled && position?.source === 'fallback' && (
          <div className="rounded-2xl bg-slate-100 p-3 text-xs text-slate-600 dark:bg-ink-800 dark:text-slate-300">
            Standort konnte nicht ermittelt werden — Ergebnisse zeigen den Bereich um München.
          </div>
        )}

        {!sportIdFromRoute && (
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
            {popularSports.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSportId(s.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  selectedSportId === s.id
                    ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                    : 'bg-white text-slate-700 shadow-card dark:bg-ink-800 dark:text-slate-300 dark:shadow-card-dark'
                }`}
              >
                <span>{s.emoji}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {RADII.map((r) => (
            <button
              key={r.id}
              onClick={() => setRadiusKm(r.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                radiusKm === r.id
                  ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                  : 'bg-white text-slate-700 shadow-card dark:bg-ink-800 dark:text-slate-300 dark:shadow-card-dark'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 px-5 pb-6">
        {loading && (
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-card dark:bg-ink-800 dark:text-slate-400 dark:shadow-card-dark">
            <LoadingDots />
            <span>OpenStreetMap wird durchsucht…</span>
          </div>
        )}

        {error && !loading && (
          <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/15 dark:text-rose-300">
            <div>Suche fehlgeschlagen: {error}</div>
            <button
              onClick={refresh}
              className="rounded-full bg-rose-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-rose-300 dark:text-rose-900"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {!loading && expanded && clubs.length > 0 && (
          <div className="rounded-2xl bg-violet-50 p-3 text-xs text-violet-900 dark:bg-violet-900/15 dark:text-violet-200">
            Im Umkreis von {requestedRadiusKm} km gab es keine Treffer — wir zeigen die nächsten bis {effectiveRadiusKm} km.
          </div>
        )}

        {!loading && !error && clubs.length === 0 && (
          <EmptyState
            emoji="📍"
            title="Keine Vereine im Umkreis"
            body={
              isNiche
                ? `${sport?.name ?? 'Diese Sportart'} wird selten als Verein in OpenStreetMap erfasst. Probier es mit Mehrsparten-Vereinen oder Sportzentren in der Nähe.`
                : effectiveRadiusKm >= 50
                  ? 'Auch im 50-km-Radius wurden keine passenden POIs gefunden. Möglicherweise ist die Region in OSM noch nicht erfasst.'
                  : 'Erweitere den Radius oder probiere einen anderen Sport.'
            }
          />
        )}

        {!loading && clubs.map((c) => <ClubCard key={c.id} club={c} />)}

        {!loading && clubs.length > 0 && (
          <p className="pt-4 text-center text-[11px] text-slate-400 dark:text-slate-500">
            Daten von OpenStreetMap-Mitwirkenden
          </p>
        )}
      </div>
    </div>
  );
};
