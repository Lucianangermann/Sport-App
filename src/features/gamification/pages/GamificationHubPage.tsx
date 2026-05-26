import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useXpStore } from '../store/xpStore';
import { useBadgeStore } from '../store/badgeStore';
import { useQuestStore } from '../store/questStore';
import { useDuelStore } from '../store/duelStore';
import { useSeasonStore } from '../store/seasonStore';
import { useLootStore } from '../store/lootStore';
import { PageHeader } from '../../../components/PageHeader';
import { slideUp, staggerContainer, bounceIn, fadeIn } from '../utils/animations';

function getDaysUntil(isoDate: string): number {
  const end = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((end - now) / 86400000));
}

function getTimeRemaining(isoDate: string): string {
  const end = new Date(isoDate).getTime();
  const diff = Math.max(0, end - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}T ${hours}h`;
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}

export function GamificationHubPage() {
  const xp = useXpStore((s) => s.xp);
  const level = useXpStore((s) => s.level);
  const levelTitle = useXpStore((s) => s.levelTitle);
  const xpProgress = useXpStore((s) => s.xpProgress);
  const xpToNextLevel = useXpStore((s) => s.xpToNextLevel);

  const unlockedBadges = useBadgeStore((s) => s.unlockedBadges);

  const dailyQuests = useQuestStore((s) => s.dailyQuests);

  const duels = useDuelStore((s) => s.duels);
  const activeDuels = duels.filter((d) => d.status === 'active');
  const firstDuel = activeDuels[0];

  const seasonName = useSeasonStore((s) => s.seasonName);
  const seasonTheme = useSeasonStore((s) => s.seasonTheme);
  const seasonEndDate = useSeasonStore((s) => s.seasonEndDate);
  const userRank = useSeasonStore((s) => s.userRank);
  const seasonLevel = useSeasonStore((s) => s.seasonLevel);

  const availableCrates = useLootStore((s) => s.availableCrates);

  const claimedCount = dailyQuests.filter((q) => q.claimed).length;
  const previewQuests = dailyQuests.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950 pb-24">
      <PageHeader
        title="Gamification"
        right={
          <Link to="/gamification/quests" className="text-sm text-violet-500">
            Quests
          </Link>
        }
      />

      <div className="space-y-4 px-4 pt-4">
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <img
                src="https://i.pravatar.cc/150?u=me"
                alt="Avatar"
                className="h-16 w-16 rounded-full border-2 border-white/30 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white font-display text-sm font-bold text-violet-700 shadow">
                {level}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl font-bold leading-tight">Level {level}</p>
              <p className="text-sm text-white/70">{levelTitle}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.3 }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-white/70">
              <span>{xpProgress.toFixed(0)}% bis Level {level + 1}</span>
              <span className="tabular-nums">
                {xp.toLocaleString('de-DE')} / {(xp + xpToNextLevel).toLocaleString('de-DE')} XP
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-4 gap-2"
        >
          {(
            [
              { icon: '🔥', value: '12', label: 'Streak' },
              { icon: '🏆', value: String(unlockedBadges.length), label: 'Badges' },
              { icon: '🛂', value: '8', label: 'Passport' },
              { icon: '⚔️', value: String(activeDuels.length), label: 'Duelle' },
            ] as const
          ).map((stat) => (
            <motion.div
              key={stat.label}
              variants={bounceIn}
              className="rounded-2xl bg-white p-2 text-center shadow-card dark:bg-ink-800 dark:shadow-card-dark"
            >
              <p className="text-lg leading-tight">{stat.icon}</p>
              <p className="font-display text-base font-bold text-ink-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-base font-bold text-ink-900 dark:text-white">Tägliche Quests</p>
            <Link to="/gamification/quests" className="text-sm text-violet-500">
              Alle ansehen →
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-card dark:bg-ink-800 dark:shadow-card-dark">
            {previewQuests.length === 0 ? (
              <p className="px-4 py-4 text-sm text-slate-400 dark:text-slate-500">
                Keine Quests verfügbar
              </p>
            ) : (
              <div>
                {previewQuests.map((quest, i) => (
                  <div
                    key={quest.id}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      i < previewQuests.length - 1
                        ? 'border-b border-slate-50 dark:border-ink-700'
                        : ''
                    }`}
                  >
                    <span className="text-lg">{quest.icon}</span>
                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink-900 dark:text-white">
                      {quest.title}
                    </p>
                    <span className="flex-shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                      {quest.xp} XP
                    </span>
                    <div className="w-12 flex-shrink-0">
                      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-ink-700">
                        <div
                          className="h-full rounded-full bg-violet-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((quest.progress / quest.target) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-slate-50 px-4 py-2 dark:border-ink-700">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {claimedCount}/{dailyQuests.length} erledigt
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-base font-bold text-ink-900 dark:text-white">Aktives Duell</p>
          </div>
          {firstDuel ? (
            <div className="overflow-hidden rounded-2xl bg-white shadow-card dark:bg-ink-800 dark:shadow-card-dark">
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-2xl">{firstDuel.challenger.avatar}</span>
                  <p className="text-xs font-semibold text-ink-900 dark:text-white">
                    {firstDuel.challenger.name}
                  </p>
                  <p className="font-display text-2xl font-bold text-violet-600">
                    {firstDuel.challenger.score}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">{firstDuel.sportEmoji}</span>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500">VS</p>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    {getTimeRemaining(firstDuel.endsAt)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-2xl">{firstDuel.opponent.avatar}</span>
                  <p className="text-xs font-semibold text-ink-900 dark:text-white">
                    {firstDuel.opponent.name}
                  </p>
                  <p className="font-display text-2xl font-bold text-slate-500">
                    {firstDuel.opponent.score}
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-50 px-4 py-2.5 dark:border-ink-700">
                <Link to="/gamification/duels" className="text-sm font-semibold text-violet-500">
                  Zum Duell →
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-4 py-6 shadow-card dark:bg-ink-800 dark:shadow-card-dark">
              <p className="text-sm text-slate-400 dark:text-slate-500">Kein aktives Duell</p>
              <Link
                to="/gamification/duels"
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Duell starten
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-base font-bold text-ink-900 dark:text-white">Sport-Passport</p>
          </div>
          <div className="rounded-2xl bg-[#2d5a27] p-4 text-white shadow-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Sportify Passport
                </p>
                <p className="mt-1 font-display text-lg font-bold">8 / 30 Stempel</p>
                <p className="mt-0.5 text-sm">🏃🏊⚽🚴🧘🥊🎾🏀</p>
              </div>
              <Link
                to="/gamification/passport"
                className="flex-shrink-0 rounded-xl bg-white/20 px-3 py-1.5 text-sm font-semibold"
              >
                Öffnen →
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-base font-bold text-ink-900 dark:text-white">Aktuelle Saison</p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 p-4 text-white shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                  {seasonTheme}
                </p>
                <p className="mt-0.5 truncate font-display text-base font-bold leading-tight">
                  {seasonName}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                    Rang #{userRank}
                  </span>
                  <span className="text-xs text-white/70">
                    Noch {getDaysUntil(seasonEndDate)} Tage
                  </span>
                </div>
                <div className="mt-3">
                  <p className="mb-1 text-[11px] text-white/70">
                    Saison-Level {seasonLevel}/30
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${Math.round((seasonLevel / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <Link
                to="/gamification/season"
                className="flex-shrink-0 rounded-xl bg-white/20 px-3 py-1.5 text-sm font-semibold"
              >
                Details →
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-base font-bold text-ink-900 dark:text-white">Loot Box</p>
          </div>
          {availableCrates > 0 ? (
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(124,58,237,0)',
                  '0 0 16px 4px rgba(124,58,237,0.35)',
                  '0 0 0 0 rgba(124,58,237,0)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-card dark:bg-ink-800 dark:shadow-card-dark"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <p className="font-semibold text-ink-900 dark:text-white">
                  {availableCrates}x Loot Box verfügbar
                </p>
              </div>
              <Link
                to="/gamification/lootbox"
                className="rounded-xl bg-violet-600 px-3 py-1.5 text-sm font-bold text-white"
              >
                Öffnen
              </Link>
            </motion.div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-card dark:bg-ink-800 dark:shadow-card-dark">
              <span className="text-xl opacity-40">📦</span>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Nächste Loot Box in 3 Tagen
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
