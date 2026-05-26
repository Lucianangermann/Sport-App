import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { SPORTS } from '../data/sports';
import { SportCard } from '../components/SportCard';
import { ClubCard } from '../components/ClubCard';
import { greeting, getRecommendedSports, getSportById } from '../utils/helpers';
import { SmartRecommendations } from '../features/recommendations/SmartRecommendations';
import { WeeklyInsights } from '../features/insights/WeeklyInsights';
import { useNearbyClubs } from '../hooks/useNearbyClubs';
import { useXpStore } from '../features/gamification/store/xpStore';
import { useBadgeStore } from '../features/gamification/store/badgeStore';
import { useQuestStore } from '../features/gamification/store/questStore';
import { useLootStore } from '../features/gamification/store/lootStore';

export const HomePage = () => {
  const profile = useAppStore((s) => s.profile);
  const lastSportId = useAppStore((s) => s.lastSportId);
  const favorites = useAppStore((s) => s.favorites);
  const lastSport = lastSportId ? getSportById(lastSportId) : null;
  const recommendations = getRecommendedSports(profile.onboarding, 6);
  const trending = [...SPORTS].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  const previewSportId = favorites[0] ?? lastSportId ?? 'fussball';
  const { clubs: nearbyAll, loading: nearbyLoading } = useNearbyClubs({
    sportId: previewSportId,
    radiusKm: 5,
  });
  const nearby = nearbyAll.slice(0, 3);
  const level = useXpStore((s) => s.level);
  const xp = useXpStore((s) => s.xp);
  const xpProgress = useXpStore((s) => s.xpProgress);
  const levelTitle = useXpStore((s) => s.levelTitle);
  const unlockedBadges = useBadgeStore((s) => s.unlockedBadges);
  const dailyQuests = useQuestStore((s) => s.dailyQuests);
  const completedQuests = dailyQuests.filter((q) => q.completed).length;
  const availableCrates = useLootStore((s) => s.availableCrates);

  return (
    <div>
      <header className="rounded-b-3xl bg-ink-900 px-5 pt-8 pb-10 text-white dark:bg-ink-800">
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
          <Link to="/gamification" className="rounded-2xl bg-white/10 p-3 active:bg-white/20">
            <div className="text-[11px] uppercase text-white/60">Level</div>
            <div className="font-display text-xl font-bold">{level}</div>
            <div className="text-[10px] text-white/50">{levelTitle}</div>
          </Link>
          <div className="rounded-2xl bg-white/10 p-3">
            <div className="text-[11px] uppercase text-white/60">XP</div>
            <div className="font-display text-xl font-bold">{xp.toLocaleString('de-DE')}</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <div className="text-[11px] uppercase text-white/60">Streak</div>
            <div className="font-display text-xl font-bold">{profile.streakDays} 🔥</div>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${Math.round(xpProgress)}%` }}
          />
        </div>
      </header>

      <div className="space-y-7 px-5 pt-7">
        <SmartRecommendations />

        <Link
          to="/quiz"
          className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 p-4 text-white shadow-card dark:shadow-card-dark"
        >
          <div className="text-3xl">🎯</div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-bold">Sport-Match Quiz</div>
            <div className="text-xs text-white/85">Finde deinen perfekten Sport — 8 Fragen, 2 Minuten.</div>
          </div>
          <span className="text-white/80">→</span>
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/gamification"
            className="flex flex-col rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 p-4 text-white shadow-card"
          >
            <div className="text-2xl">🏆</div>
            <div className="mt-1 font-display text-sm font-bold">Achievements</div>
            <div className="mt-0.5 text-[11px] text-white/70">{unlockedBadges.length} Badges</div>
          </Link>
          <Link
            to="/gamification/quests"
            className="flex flex-col rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-white shadow-card"
          >
            <div className="text-2xl">📋</div>
            <div className="mt-1 font-display text-sm font-bold">Quests</div>
            <div className="mt-0.5 text-[11px] text-white/70">{completedQuests}/3 heute{availableCrates > 0 ? ' · 📦' : ''}</div>
          </Link>
        </div>

        <WeeklyInsights />

        {lastSport && (
          <section>
            <h2 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-white">Weitermachen</h2>
            <Link
              to={`/sport/${lastSport.id}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card dark:bg-ink-800 dark:shadow-card-dark"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
                style={{ background: `${lastSport.color}20` }}
              >
                {lastSport.emoji}
              </div>
              <div className="flex-1">
                <div className="font-display text-base font-bold text-ink-900 dark:text-white">{lastSport.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Zurück zum Training →</div>
              </div>
            </Link>
          </section>
        )}

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">Empfohlen für dich</h2>
            <Link to="/discover" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Alle →
            </Link>
          </div>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {recommendations.map((s) => (
              <div key={s.id} className="w-40 shrink-0">
                <SportCard sport={s} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-white">Trending diese Woche 📈</h2>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {trending.map((s) => (
              <div key={s.id} className="w-36 shrink-0">
                <SportCard sport={s} size="sm" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">Vereine in deiner Nähe</h2>
            <Link to="/clubs" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Alle →
            </Link>
          </div>
          <div className="space-y-2">
            {nearbyLoading && nearby.length === 0 && (
              <div className="rounded-2xl bg-white p-4 text-xs text-slate-500 shadow-card dark:bg-ink-800 dark:text-slate-400 dark:shadow-card-dark">
                Suche nach Vereinen läuft…
              </div>
            )}
            {!nearbyLoading && nearby.length === 0 && (
              <Link
                to="/clubs"
                className="block rounded-2xl bg-white p-4 text-xs text-slate-500 shadow-card dark:bg-ink-800 dark:text-slate-400 dark:shadow-card-dark"
              >
                Keine Vereine im 5-km-Radius gefunden — Tippen, um den Radius zu erweitern.
              </Link>
            )}
            {nearby.map((c) => (
              <ClubCard key={c.id} club={c} />
            ))}
          </div>
        </section>

        {favorites.length > 0 && (
          <section className="pb-4">
            <h2 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-white">Deine Favoriten ❤️</h2>
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
