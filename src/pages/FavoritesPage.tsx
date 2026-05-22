import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SportCard } from '../components/SportCard';
import { EmptyState } from '../components/EmptyState';
import { useAppStore } from '../store/useAppStore';
import { getSportById } from '../utils/helpers';

export const FavoritesPage = () => {
  const favorites = useAppStore((s) => s.favorites);
  const sports = favorites.map((id) => getSportById(id)).filter(Boolean);

  return (
    <div>
      <PageHeader title="Favoriten" subtitle={`${sports.length} gespeichert`} />
      <div className="px-5 pb-6">
        {sports.length === 0 ? (
          <EmptyState
            emoji="❤️"
            title="Noch keine Favoriten"
            body="Tippe auf das Herz bei jeder Sportart, um sie zu speichern."
            cta={
              <Link
                to="/discover"
                className="mt-2 rounded-full bg-ink-900 px-5 py-2 text-sm font-semibold text-white"
              >
                Sportarten entdecken
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sports.map((s) => s && <SportCard key={s.id} sport={s} />)}
          </div>
        )}
      </div>
    </div>
  );
};
