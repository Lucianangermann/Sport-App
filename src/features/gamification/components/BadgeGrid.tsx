import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Badge } from '../data/badges';
import { BADGES } from '../data/badges';
import { useBadgeStore } from '../store/badgeStore';
import { slideUp } from '../utils/animations';

type Category = 'alle' | 'ausdauer' | 'entdecker' | 'social' | 'level' | 'geheim';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'ausdauer', label: 'Ausdauer' },
  { id: 'entdecker', label: 'Entdecker' },
  { id: 'social', label: 'Social' },
  { id: 'level', label: 'Level' },
  { id: 'geheim', label: 'Geheim' },
];

const TIER_BORDER: Record<string, string> = {
  bronze: 'border-[#CD7F32]',
  silber: 'border-[#C0C0C0]',
  gold: 'border-[#FFD700]',
};

const TIER_LABEL_STYLE: Record<string, string> = {
  bronze: 'bg-amber-800/30 text-amber-600 border border-amber-700/40',
  silber: 'bg-slate-400/20 text-slate-300 border border-slate-400/40',
  gold: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
};

const TIER_LABELS: Record<string, string> = {
  bronze: 'Bronze',
  silber: 'Silber',
  gold: 'Gold',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface DetailSheetProps {
  badge: Badge;
  isUnlocked: boolean;
  unlockedAt?: string;
  onClose: () => void;
}

function BadgeDetailSheet({ badge, isUnlocked, unlockedAt, onClose }: DetailSheetProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        className="relative w-full max-w-sm mx-4 mb-4 bg-white dark:bg-ink-900 rounded-3xl p-6 shadow-2xl"
        variants={slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div
            className={`flex items-center justify-center w-24 h-24 rounded-2xl border-4 ${TIER_BORDER[badge.tier]} ${
              isUnlocked ? 'bg-white dark:bg-ink-800' : 'bg-slate-100 dark:bg-ink-700'
            }`}
          >
            <span className={`text-5xl ${isUnlocked ? '' : 'opacity-30'}`}>
              {isUnlocked ? badge.icon : '🔒'}
            </span>
          </div>
        </div>

        <p className="text-center text-xl font-bold text-slate-900 dark:text-white mb-1">
          {badge.name}
        </p>

        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_LABEL_STYLE[badge.tier]}`}
          >
            {TIER_LABELS[badge.tier]}
          </span>
          <span className="text-xs text-slate-400 capitalize">{badge.category}</span>
        </div>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">
          {badge.description}
        </p>

        <div className="bg-slate-50 dark:bg-ink-800 rounded-xl p-3 mb-3">
          <p className="text-xs text-slate-400 font-medium mb-1">Wie freischalten:</p>
          <p className="text-sm text-slate-700 dark:text-slate-200">{badge.condition}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-400">
            Seltenheit: nur {badge.rarity}% der Nutzer
          </p>
          <p className="text-sm font-bold text-emerald-500">+{badge.xpReward} XP</p>
        </div>

        {isUnlocked && unlockedAt && (
          <p className="text-center text-xs text-slate-400 mb-4">
            Freigeschaltet am {formatDate(unlockedAt)}
          </p>
        )}

        <button
          className="w-full bg-slate-100 dark:bg-ink-700 text-slate-700 dark:text-white rounded-2xl py-3 font-semibold text-sm"
          onClick={onClose}
        >
          Schließen
        </button>
      </motion.div>
    </motion.div>
  );
}

export function BadgeGrid() {
  const [activeCategory, setActiveCategory] = useState<Category>('alle');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const unlockedBadges = useBadgeStore((s) => s.unlockedBadges);

  const isUnlocked = (id: string) => unlockedBadges.includes(id);

  const filteredBadges = BADGES.filter(
    (b) => activeCategory === 'alle' || b.category === activeCategory
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-violet-600 text-white'
                : 'bg-slate-100 dark:bg-ink-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filteredBadges.map((badge) => {
          const unlocked = isUnlocked(badge.id);
          const isSecret = badge.isSecret && !unlocked;

          if (isSecret) {
            return (
              <div
                key={badge.id}
                className="bg-ink-900 rounded-2xl p-3 flex flex-col items-center gap-1.5 aspect-square justify-center"
              >
                <span className="text-3xl opacity-40">❓</span>
                <p className="text-slate-600 text-xs font-medium">???</p>
              </div>
            );
          }

          if (!unlocked) {
            return (
              <button
                key={badge.id}
                className="bg-slate-50 dark:bg-ink-700 rounded-2xl p-3 flex flex-col items-center gap-1.5 aspect-square justify-center"
                onClick={() => setSelectedBadge(badge)}
              >
                <span className="text-3xl opacity-30">{badge.icon}</span>
                <p className="text-slate-400 text-xs font-medium truncate w-full text-center">
                  Gesperrt
                </p>
                <p className="text-slate-500 text-[10px]">{badge.rarity}% Rarity</p>
              </button>
            );
          }

          return (
            <button
              key={badge.id}
              className={`bg-white dark:bg-ink-800 border-2 ${TIER_BORDER[badge.tier]} rounded-2xl p-3 flex flex-col items-center gap-1.5 aspect-square justify-center shadow-card`}
              onClick={() => setSelectedBadge(badge)}
            >
              <span className="text-3xl">{badge.icon}</span>
              <p className="text-slate-700 dark:text-slate-200 text-xs font-semibold truncate w-full text-center">
                {badge.name}
              </p>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetailSheet
            badge={selectedBadge}
            isUnlocked={isUnlocked(selectedBadge.id)}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
