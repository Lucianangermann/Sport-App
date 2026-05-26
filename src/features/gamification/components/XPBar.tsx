import { motion, AnimatePresence } from 'framer-motion';
import { useXpStore } from '../store/xpStore';
import { LevelUpModal } from './LevelUpModal';

export { LevelUpModal } from './LevelUpModal';

export function XPBar() {
  const xp = useXpStore((s) => s.xp);
  const level = useXpStore((s) => s.level);
  const levelTitle = useXpStore((s) => s.levelTitle);
  const xpToNextLevel = useXpStore((s) => s.xpToNextLevel);
  const xpProgress = useXpStore((s) => s.xpProgress);
  const recentXpGains = useXpStore((s) => s.recentXpGains);
  const clearRecentGain = useXpStore((s) => s.clearRecentGain);
  const pendingLevelUp = useXpStore((s) => s.pendingLevelUp);

  const totalXpForNextLevel = xp + xpToNextLevel;

  return (
    <>
      <div className="relative bg-white dark:bg-ink-800 rounded-2xl shadow-card dark:shadow-card-dark p-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-ink-900 text-white text-xs font-bold rounded-full px-2.5 py-1 leading-none">
            Lv.{level}
          </div>

          <div className="flex-1 min-w-0">
            <div className="h-2 bg-slate-100 dark:bg-ink-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full"
                layoutId="xp-progress-fill"
                style={{ width: `${xpProgress}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          <div className="flex-shrink-0 text-xs text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
            {xp.toLocaleString('de-DE')} / {totalXpForNextLevel.toLocaleString('de-DE')} XP
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
          {levelTitle}
        </p>

        <AnimatePresence>
          {recentXpGains.map((gain) => (
            <motion.div
              key={gain.id}
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none text-emerald-500 font-bold text-sm whitespace-nowrap"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -60, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              onAnimationComplete={() => clearRecentGain(gain.id)}
            >
              +{gain.amount} XP
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {pendingLevelUp !== null && <LevelUpModal />}
    </>
  );
}
