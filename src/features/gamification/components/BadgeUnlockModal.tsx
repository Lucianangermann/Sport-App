import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadgeStore } from '../store/badgeStore';
import { useXpStore } from '../store/xpStore';
import { slideUp } from '../utils/animations';
import { triggerConfetti } from '../utils/confetti';

const TIER_STYLES: Record<string, string> = {
  bronze: 'bg-amber-800/30 text-amber-600 border border-amber-700/40',
  silber: 'bg-slate-400/20 text-slate-300 border border-slate-400/40',
  gold: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
};

const TIER_LABELS: Record<string, string> = {
  bronze: 'Bronze',
  silber: 'Silber',
  gold: 'Gold',
};

export function BadgeUnlockModal() {
  const pendingBadge = useBadgeStore((s) => s.pendingBadge);
  const clearPendingBadge = useBadgeStore((s) => s.clearPendingBadge);
  const addXP = useXpStore((s) => s.addXP);

  useEffect(() => {
    if (!pendingBadge) return;

    triggerConfetti('medium');

    const timer = setTimeout(() => {
      addXP(pendingBadge.xpReward, 'badge_unlock');
      clearPendingBadge();
    }, 4000);

    return () => clearTimeout(timer);
  }, [pendingBadge, clearPendingBadge, addXP]);

  const handleDismiss = () => {
    if (!pendingBadge) return;
    addXP(pendingBadge.xpReward, 'badge_unlock');
    clearPendingBadge();
  };

  return (
    <AnimatePresence>
      {pendingBadge && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            className="relative w-full max-w-sm mx-4 mb-6 bg-ink-900 rounded-3xl p-6 text-center shadow-2xl"
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div
                className={`relative flex items-center justify-center w-20 h-20 rounded-full bg-ink-800 animate-pulse ring-4 ring-yellow-400`}
              >
                <span className="text-4xl">{pendingBadge.icon}</span>
              </div>
            </div>

            <p className="text-yellow-500 font-bold text-sm uppercase tracking-widest mb-2">
              Neuer Badge freigeschaltet!
            </p>

            <p className="text-white text-xl font-bold mb-1">{pendingBadge.name}</p>

            <p className="text-slate-400 text-sm mb-4">{pendingBadge.description}</p>

            <p className="text-slate-500 text-xs mb-3">
              Nur {pendingBadge.rarity}% der Nutzer haben diesen Badge
            </p>

            <div className="flex items-center justify-center gap-3 mb-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TIER_STYLES[pendingBadge.tier]}`}
              >
                {TIER_LABELS[pendingBadge.tier]}
              </span>
            </div>

            <p className="text-emerald-500 font-bold text-base">
              +{pendingBadge.xpReward} XP
            </p>

            <button
              className="mt-4 text-slate-500 text-xs underline"
              onClick={handleDismiss}
            >
              Schließen
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
