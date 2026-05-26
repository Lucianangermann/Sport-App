import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBadgeStore } from '../store/badgeStore';
import { getBadgeById, BADGES } from '../data/badges';
import { slideUp } from '../utils/animations';

const TIER_BORDER: Record<string, string> = {
  bronze: 'border-[#CD7F32]',
  silber: 'border-[#C0C0C0]',
  gold: 'border-[#FFD700]',
};

export function BadgeShowcase() {
  const showcaseBadges = useBadgeStore((s) => s.showcaseBadges);
  const setShowcase = useBadgeStore((s) => s.setShowcase);
  const unlockedBadges = useBadgeStore((s) => s.unlockedBadges);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<0 | 1 | 2>(0);

  const handleSlotTap = (slot: 0 | 1 | 2) => {
    setEditingSlot(slot);
    setModalOpen(true);
  };

  const handleSelectBadge = (badgeId: string) => {
    const updated = [...showcaseBadges] as [string, string, string];
    updated[editingSlot] = badgeId;
    setShowcase(updated);
    setModalOpen(false);
  };

  const handleClear = () => {
    const updated = [...showcaseBadges] as [string, string, string];
    updated[editingSlot] = '';
    setShowcase(updated);
    setModalOpen(false);
  };

  const unlockedBadgeObjects = BADGES.filter((b) => unlockedBadges.includes(b.id));

  return (
    <>
      <div className="flex gap-3 justify-center">
        {([0, 1, 2] as const).map((slot) => {
          const badgeId = showcaseBadges[slot];
          const badge = badgeId ? getBadgeById(badgeId) : undefined;

          if (badge) {
            return (
              <button
                key={slot}
                onClick={() => handleSlotTap(slot)}
                className={`relative flex flex-col items-center gap-1.5 h-20 w-20 rounded-2xl border-2 ${TIER_BORDER[badge.tier]} bg-white dark:bg-ink-800 shadow-card justify-center`}
              >
                <span className="text-3xl">{badge.icon}</span>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate w-full text-center px-1 leading-tight">
                  {badge.name}
                </p>
              </button>
            );
          }

          return (
            <button
              key={slot}
              onClick={() => handleSlotTap(slot)}
              className="flex flex-col items-center justify-center h-20 w-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-ink-600 bg-white dark:bg-ink-800 gap-1"
            >
              <span className="text-xl text-slate-300 dark:text-slate-600">+</span>
              <p className="text-[10px] text-slate-400 font-medium">Wählen</p>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[85] flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              className="relative w-full max-w-sm mx-4 mb-4 bg-white dark:bg-ink-900 rounded-3xl p-5 shadow-2xl"
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  Badge-Showcase
                </p>
                <button
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
                  onClick={handleClear}
                >
                  Leeren
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-3">
                Wähle einen Badge für Slot {editingSlot + 1}
              </p>

              <div className="grid grid-cols-3 gap-3 max-h-72 overflow-y-auto">
                {unlockedBadgeObjects.map((badge) => {
                  const isSelected = showcaseBadges[editingSlot] === badge.id;
                  return (
                    <button
                      key={badge.id}
                      onClick={() => handleSelectBadge(badge.id)}
                      className={`relative flex flex-col items-center gap-1.5 rounded-2xl border-2 ${TIER_BORDER[badge.tier]} p-2.5 aspect-square justify-center transition-all ${
                        isSelected
                          ? 'bg-violet-50 dark:bg-violet-900/30 ring-2 ring-violet-500'
                          : 'bg-white dark:bg-ink-800'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px] leading-none">✓</span>
                        </div>
                      )}
                      <span className="text-2xl">{badge.icon}</span>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate w-full text-center">
                        {badge.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              <button
                className="mt-4 w-full bg-violet-600 hover:bg-violet-500 text-white rounded-2xl py-3 font-semibold text-sm transition-colors"
                onClick={() => setModalOpen(false)}
              >
                Fertig
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
