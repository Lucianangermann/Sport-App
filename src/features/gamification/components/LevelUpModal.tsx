import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXpStore, calcLevel } from '../store/xpStore';
import { triggerConfetti } from '../utils/confetti';
import { scaleIn, fadeIn } from '../utils/animations';

const getUnlockedFeature = (level: number): string => {
  if (level >= 25) return '🌟 Champion-Status erreicht';
  if (level >= 15) return '📦 Loot-Boxen freigeschaltet';
  if (level >= 10) return '⚔️ Duell-Modus freigeschaltet';
  if (level >= 5) return '🗺️ Sport-Passport freigeschaltet';
  return '✨ Neue Herausforderungen warten';
};

export function LevelUpModal() {
  const pendingLevelUp = useXpStore((s) => s.pendingLevelUp);
  const clearLevelUp = useXpStore((s) => s.clearLevelUp);
  const xp = useXpStore((s) => s.xp);

  useEffect(() => {
    if (pendingLevelUp !== null) {
      triggerConfetti('large');
    }
  }, [pendingLevelUp]);

  const levelInfo = pendingLevelUp !== null ? calcLevel(xp) : null;

  return (
    <AnimatePresence>
      {pendingLevelUp !== null && levelInfo !== null && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-ink-900 rounded-3xl p-8 mx-6 text-center w-full max-w-sm"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="text-8xl font-display font-black text-white mb-2 leading-none"
              style={{ filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.8))' }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
            >
              {pendingLevelUp}
            </motion.div>

            <motion.p
              className="text-violet-400 text-2xl font-display font-bold tracking-widest uppercase mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              LEVEL UP!
            </motion.p>

            <motion.p
              className="text-white text-lg font-semibold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Du bist jetzt ein {levelInfo.levelTitle}!
            </motion.p>

            <motion.div
              className="bg-ink-800 rounded-2xl px-4 py-3 mb-6 text-left"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
                Freigeschaltet
              </p>
              <p className="text-white text-sm font-medium">
                {getUnlockedFeature(pendingLevelUp)}
              </p>
            </motion.div>

            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400 text-xs">Level {pendingLevelUp}</span>
                <span className="text-slate-400 text-xs">Level {pendingLevelUp + 1}</span>
              </div>
              <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-violet-500 rounded-full" />
              </div>
              <p className="text-slate-500 text-xs mt-1 text-center">0% zum nächsten Level</p>
            </motion.div>

            <motion.button
              className="bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white rounded-2xl px-8 py-3 font-semibold text-base w-full transition-colors"
              onClick={clearLevelUp}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              whileTap={{ scale: 0.97 }}
            >
              Weiter
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
