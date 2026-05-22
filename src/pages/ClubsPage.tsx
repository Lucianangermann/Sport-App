import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { CLUBS } from '../data/clubs';
import { ClubCard } from '../components/ClubCard';
import { EmptyState } from '../components/EmptyState';
import { useAppStore } from '../store/useAppStore';
import { getSportById } from '../utils/helpers';

const DISTANCES = [
  { id: 1, label: '< 1 km' },
  { id: 5, label: '< 5 km' },
  { id: 10, label: '< 10 km' },
  { id: -1, label: 'Alle' },
];

export const ClubsPage = () => {
  const { id: sportId } = useParams<{ id?: string }>();
  const settings = useAppStore((s) => s.profile.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [distance, setDistance] = useState(5);
  const sport = sportId ? getSportById(sportId) : undefined;

  const clubs = useMemo(() => {
    let list = CLUBS;
    if (sportId) list = list.filter((c) => c.sportId === sportId);
    if (distance > 0) list = list.filter((c) => c.distanceKm <= distance);
    return [...list].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [sportId, distance]);

  return (
    <div>
      <PageHeader
        title={sport ? `${sport.name} Vereine` : 'Vereine in der Nähe'}
        subtitle={`${clubs.length} Treffer`}
        back={!!sportId}
      />

      <div className="px-5 pb-3">
        {!settings.locationEnabled && (
          <div className="mb-3 flex items-start gap-3 rounded-2xl bg-amber-50 p-3 text-sm dark:bg-amber-900/20">
            <span className="text-xl">📍</span>
            <div className="flex-1">
              <div className="font-semibold text-amber-900 dark:text-amber-200">Standort aktivieren</div>
              <div className="text-xs text-amber-800 dark:text-amber-200/80">
                Für noch genauere Empfehlungen in deiner Nähe.
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
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {DISTANCES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDistance(d.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                distance === d.id
                  ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                  : 'bg-white text-slate-700 shadow-card dark:bg-ink-800 dark:text-slate-300 dark:shadow-card-dark'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 px-5 pb-6">
        {clubs.length === 0 ? (
          <EmptyState
            emoji="📍"
            title="Keine Vereine im Umkreis"
            body="Erweitere den Radius oder probiere einen anderen Sport."
          />
        ) : (
          clubs.map((c) => <ClubCard key={c.id} club={c} />)
        )}
      </div>
    </div>
  );
};
