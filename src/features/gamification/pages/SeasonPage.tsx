import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSeasonStore } from '../store/seasonStore';
import type { SeasonReward, SeasonPlayer } from '../store/seasonStore';
import { slideUp, fadeIn, staggerContainer } from '../utils/animations';

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

interface RewardSheetProps {
  reward: SeasonReward;
  seasonLevel: number;
  isPremium: boolean;
  onClaim: () => void;
  onClose: () => void;
}

function RewardSheet({ reward, seasonLevel, isPremium, onClaim, onClose }: RewardSheetProps) {
  const eligible = seasonLevel >= reward.level && (!reward.isPremium || isPremium);
  const alreadyUnlocked = reward.unlocked;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative bg-white dark:bg-ink-800 rounded-t-3xl p-6 pb-10"
      >
        <div className="w-10 h-1 bg-slate-200 dark:bg-ink-600 rounded-full mx-auto mb-5" />
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">{reward.icon}</div>
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-1">
            {reward.label}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-slate-400">Level {reward.level}</span>
            {reward.isPremium && (
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                👑 Premium
              </span>
            )}
          </div>
        </div>
        {alreadyUnlocked ? (
          <div className="w-full py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold text-center">
            Bereits eingelöst ✓
          </div>
        ) : eligible ? (
          <button
            onClick={() => { onClaim(); onClose(); }}
            className="w-full py-4 rounded-2xl bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-display font-bold text-lg"
          >
            Einlösen 🎁
          </button>
        ) : (
          <div className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-ink-700 text-slate-400 font-bold text-center">
            {reward.isPremium && !isPremium
              ? 'Premium erforderlich 👑'
              : `Level ${reward.level} erforderlich`}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function PodiumBlock({
  player,
  medal,
  size,
}: {
  player: SeasonPlayer;
  medal: string;
  size: 'large' | 'medium' | 'small';
}) {
  const heightClass =
    size === 'large' ? 'h-24' : size === 'medium' ? 'h-18' : 'h-14';
  const avatarClass = size === 'large' ? 'text-4xl' : 'text-3xl';
  const nameClass = size === 'large' ? 'text-sm font-bold' : 'text-xs font-semibold';

  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className={avatarClass}>{player.avatar}</div>
      <p className={`${nameClass} text-ink-900 dark:text-white text-center truncate w-full px-1`}>
        {player.name}
      </p>
      <p className="text-xs text-slate-400 font-medium">{player.xp.toLocaleString()} XP</p>
      <div
        className={`${heightClass} w-full rounded-t-2xl flex items-end justify-center pb-2 ${
          size === 'large'
            ? 'bg-amber-400 dark:bg-amber-500'
            : size === 'medium'
            ? 'bg-slate-300 dark:bg-slate-500'
            : 'bg-amber-700 dark:bg-amber-800'
        }`}
      >
        <span className="text-2xl">{medal}</span>
      </div>
    </div>
  );
}

export const SeasonPage = () => {
  const {
    seasonName,
    seasonTheme,
    seasonEndDate,
    userSeasonXp,
    userRank,
    totalParticipants,
    seasonLevel,
    rewards,
    leaderboard,
    isPremium,
    togglePremium,
    claimReward,
  } = useSeasonStore();

  const [selectedReward, setSelectedReward] = useState<SeasonReward | null>(null);
  const daysLeft = daysUntil(seasonEndDate);

  const rewardLevels = Array.from(new Set(rewards.map((r) => r.level))).sort(
    (a, b) => a - b
  );

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.filter((p) => p.rank > 3 && p.rank <= 20);
  const currentUserRow = leaderboard.find((p) => p.isCurrentUser && p.rank > 20);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-900 pb-24">
      <header className="sticky top-0 z-10 bg-slate-50/90 dark:bg-ink-900/90 backdrop-blur px-5 pt-5 pb-3">
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Saison 🌸</h1>
      </header>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="mx-5 mt-4 bg-gradient-to-br from-rose-400 via-violet-500 to-indigo-600 rounded-3xl p-6 text-white"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white/80">{seasonTheme}</p>
            <h2 className="font-display text-xl font-bold">{seasonName}</h2>
          </div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            Noch {daysLeft} Tage
          </span>
        </div>
        <div className="mt-4">
          <p className="text-4xl font-display font-black">Rang #{userRank}</p>
          <p className="text-white/70 text-sm mt-1">
            von {totalParticipants.toLocaleString()} Teilnehmern
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2"
                style={{ width: `${Math.min(100, (userSeasonXp / 5000) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-white/80">{userSeasonXp.toLocaleString()} XP</span>
          </div>
        </div>
      </motion.div>

      <div className="mx-5 mt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">
            Battle Pass
          </h2>
          <div className="flex items-center gap-2">
            {!isPremium && (
              <button
                onClick={togglePremium}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full"
              >
                👑 Premium freischalten
              </button>
            )}
            {isPremium && (
              <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full">
                👑 Premium aktiv
              </span>
            )}
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-0"
        >
          {rewardLevels.map((level) => {
            const freeReward = rewards.find((r) => r.level === level && !r.isPremium);
            const premiumReward = rewards.find((r) => r.level === level && r.isPremium);
            const isCompleted = seasonLevel > level;
            const isCurrent = seasonLevel === level;

            return (
              <motion.div
                key={level}
                variants={fadeIn}
                className="flex items-center gap-2 py-2"
              >
                <button
                  onClick={() => freeReward && setSelectedReward(freeReward)}
                  className={`flex-1 flex items-center gap-2 p-3 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700'
                      : 'bg-white dark:bg-ink-800 border-slate-100 dark:border-ink-700'
                  }`}
                >
                  {freeReward ? (
                    <>
                      <span className="text-xl">{freeReward.icon}</span>
                      <span
                        className={`text-xs font-semibold flex-1 text-left truncate ${
                          isCompleted
                            ? 'text-violet-700 dark:text-violet-300'
                            : 'text-ink-900 dark:text-white'
                        }`}
                      >
                        {freeReward.label}
                      </span>
                      {isCompleted && (
                        <span className="text-violet-500 text-xs font-black">✓</span>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </button>

                <div className="flex flex-col items-center gap-0.5 w-12">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                      isCompleted
                        ? 'bg-violet-500 text-white'
                        : isCurrent
                        ? 'bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300 animate-pulse'
                        : 'bg-slate-100 dark:bg-ink-700 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓' : level}
                  </div>
                </div>

                <button
                  onClick={() => premiumReward && setSelectedReward(premiumReward)}
                  className={`flex-1 flex items-center gap-2 p-3 rounded-2xl border transition-all relative overflow-hidden ${
                    isCompleted && isPremium
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
                      : 'bg-white dark:bg-ink-800 border-slate-100 dark:border-ink-700'
                  } ${!isPremium ? 'opacity-60' : ''}`}
                >
                  {premiumReward ? (
                    <>
                      <span className="text-xl">{premiumReward.icon}</span>
                      <span
                        className={`text-xs font-semibold flex-1 text-left truncate ${
                          isCompleted && isPremium
                            ? 'text-amber-700 dark:text-amber-300'
                            : 'text-ink-900 dark:text-white'
                        }`}
                      >
                        {premiumReward.label}
                      </span>
                      {!isPremium && (
                        <span className="text-amber-400 text-xs">👑</span>
                      )}
                      {isCompleted && isPremium && (
                        <span className="text-amber-500 text-xs font-black">✓</span>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mx-5 mt-8 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">Rangliste</h2>
          <span className="text-xs text-slate-400">{totalParticipants.toLocaleString()} Teilnehmer</span>
        </div>

        {top3.length >= 3 && (
          <div className="flex items-end gap-2 mb-6 px-2">
            <PodiumBlock player={top3[1]} medal="🥈" size="medium" />
            <PodiumBlock player={top3[0]} medal="🥇" size="large" />
            <PodiumBlock player={top3[2]} medal="🥉" size="small" />
          </div>
        )}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2"
        >
          {rest.map((player) => (
            <motion.div
              key={player.rank}
              variants={fadeIn}
              className={`flex items-center gap-3 bg-white dark:bg-ink-800 rounded-2xl shadow-card dark:shadow-card-dark px-4 py-3 ${
                player.isCurrentUser
                  ? 'ring-2 ring-violet-400 dark:ring-violet-500'
                  : ''
              }`}
            >
              <span className="w-7 text-center text-sm font-bold text-slate-400">
                {player.rank}
              </span>
              <span className="text-xl">{player.avatar}</span>
              <span className="flex-1 text-sm font-semibold text-ink-900 dark:text-white truncate">
                {player.name}
                {player.isCurrentUser && (
                  <span className="ml-1 text-violet-500 text-xs">(Du)</span>
                )}
              </span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-300">
                {player.xp.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {currentUserRow && (
          <div className="mt-3 flex items-center gap-3 bg-violet-50 dark:bg-violet-900/20 rounded-2xl px-4 py-3 ring-2 ring-violet-400 dark:ring-violet-500">
            <span className="w-7 text-center text-sm font-bold text-violet-500">
              {currentUserRow.rank}
            </span>
            <span className="text-xl">{currentUserRow.avatar}</span>
            <span className="flex-1 text-sm font-semibold text-violet-700 dark:text-violet-300 truncate">
              Du · Rang #{userRank}
            </span>
            <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
              {userSeasonXp.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedReward && (
          <RewardSheet
            reward={selectedReward}
            seasonLevel={seasonLevel}
            isPremium={isPremium}
            onClaim={() => claimReward(selectedReward.level)}
            onClose={() => setSelectedReward(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
