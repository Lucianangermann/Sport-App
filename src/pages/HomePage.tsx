import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { SPORTS } from '../data/sports';
import { CLUBS } from '../data/clubs';
import { SportCard } from '../components/SportCard';
import { ClubCard } from '../components/ClubCard';
import { greeting, getRecommendedSports, getSportById, xpForLevel } from '../utils/helpers';

export const HomePage = () => {
  const profile = useAppStore((s) => s.profile);
  const lastSportId = useAppStore((s) => s.lastSportId);
  const favorites = useAppStore((s) => s.favorites);
  const lastSport = lastSportId ? getSportById(lastSportId) : null;
  const recommendations = getRecommendedSports(profile.onboarding, 6);
  const trending = [...SPORTS].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  const nearby = [...CLUBS].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);
  const { level, progress } = xpForLevel(profile.xp);

  return (
    <div>
      <header className="bg-ink-900 px-5 pt-8 pb-10 text-white rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60">{greeting(profile.name)}</p>
            <h1 className="font-display text-2xl font-bold">Bereit für mehr Bewegung?</h1>
          </div>
          <Link to="/profile" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">
            {profile.avatarEmoji}
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/10 p-3">
            <div className="text-[11px] uppercase text-white/60">Level</div>
            <div className="font-display text-xl font-bold">{level}</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <div className="text-[11px] uppercase text-white/60">XP</div>
            <div className="font-display text-xl font-bold">{profile.xp}</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <div className="text-[11px] uppercase text-white/60">Streak</div>
            <div className="font-display text-xl font-bold">{profile.streakDays} 🔥</div>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </header>

      <div className="space-y-7 px-5 pt-7">
        {lastSport && (
          <section>
            <h2 className="mb-2 font-display text-lg font-bold">Weitermachen</h2>
            <Link
              to={`/sport/${lastSport.id}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
                style={{ background: `${lastSport.color}20` }}
              >
                {lastSport.emoji}
              </div>
              <div className="flex-1">
                <div className="font-display text-base font-bold">{lastSport.name}</div>
                <div className="text-xs text-slate-500">Zurück zum Training →</div>
              </div>
            </Link>
          </section>
        )}

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Empfohlen für dich</h2>
            <Link to="/discover" className="text-xs font-semibold text-slate-500">
              Alle →
            </Link>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto -mx-5 px-5 pb-1">
            {recommendations.map((s) => (
              <div key={s.id} className="w-40 shrink-0">
                <SportCard sport={s} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold">Trending diese Woche 📈</h2>
          <div className="no-scrollbar flex gap-3 overflow-x-auto -mx-5 px-5 pb-1">
            {trending.map((s) => (
              <div key={s.id} className="w-36 shrink-0">
                <SportCard sport={s} size="sm" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Vereine in deiner Nähe</h2>
            <Link to="/clubs" className="text-xs font-semibold text-slate-500">
              Karte →
            </Link>
          </div>
          <div className="space-y-2">
            {nearby.map((c) => (
              <ClubCard key={c.id} club={c} />
            ))}
          </div>
        </section>

        {favorites.length > 0 && (
          <section className="pb-4">
            <h2 className="mb-2 font-display text-lg font-bold">Deine Favoriten ❤️</h2>
            <div className="grid grid-cols-2 gap-3">
              {favorites.slice(0, 4).map((id) => {
                const s = getSportById(id);
                return s ? <SportCard key={id} sport={s} size="sm" /> : null;
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
