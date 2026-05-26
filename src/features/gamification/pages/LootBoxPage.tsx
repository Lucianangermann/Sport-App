import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLootStore } from '../store/lootStore';
import type { LootItem } from '../store/lootStore';
import { bounceIn, fadeIn, shakeX } from '../utils/animations';
import { triggerConfetti } from '../utils/confetti';

type Phase = 'idle' | 'bouncing' | 'shaking' | 'flashing' | 'revealing' | 'shown';

const RARITY_COLORS: Record<
  LootItem['rarity'],
  { text: string; bg: string; label: string; border: string }
> = {
  common: { text: '#94a3b8', bg: '#f1f5f9', label: 'Gewöhnlich', border: '#cbd5e1' },
  uncommon: { text: '#22c55e', bg: '#f0fdf4', label: 'Ungewöhnlich', border: '#86efac' },
  rare: { text: '#3b82f6', bg: '#eff6ff', label: 'Selten', border: '#93c5fd' },
  epic: { text: '#a855f7', bg: '#faf5ff', label: 'Episch', border: '#d8b4fe' },
  legendary: { text: '#f59e0b', bg: '#fffbeb', label: 'Legendär', border: '#fcd34d' },
};

const TYPE_LABELS: Record<LootItem['type'], string> = {
  xp_boost: 'XP-Boost',
  profile_frame: 'Rahmen',
  passport_skin: 'Passport-Skin',
  title: 'Titel',
  reaction: 'Reaktion',
  badge_fragment: 'Badge-Fragment',
};

function LegendaryShimmer() {
  return (
    <motion.div
      className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, transparent 20%, rgba(245,158,11,0.3) 50%, transparent 80%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPositionX: ['200%', '-200%'] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}

function RevealCard({ item, onOk }: { item: LootItem; onOk: () => void }) {
  const colors = RARITY_COLORS[item.rarity];
  const isLegendary = item.rarity === 'legendary';
  const isEpic = item.rarity === 'epic';

  return (
    <motion.div
      variants={bounceIn}
      initial="hidden"
      animate="visible"
      className="relative mx-5 rounded-3xl p-6 text-center overflow-hidden"
      style={{
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        boxShadow: `0 0 32px 4px ${colors.border}80`,
      }}
    >
      {isLegendary && <LegendaryShimmer />}

      <div className="relative z-10">
        <div className="text-5xl mb-3">{item.icon}</div>

        <span
          className="inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3"
          style={{ color: colors.text, backgroundColor: `${colors.border}40` }}
        >
          {colors.label}
        </span>

        <h2
          className="font-display text-xl font-bold mb-2"
          style={{ color: '#0B0F14' }}
        >
          {item.name}
        </h2>
        <p className="text-sm mb-3" style={{ color: '#64748b' }}>
          {item.description}
        </p>

        <div className="flex items-center justify-center gap-2 mb-4">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ color: colors.text, backgroundColor: `${colors.border}30` }}
          >
            {TYPE_LABELS[item.type]}
          </span>
          {item.value !== undefined && (
            <span className="text-xs font-semibold text-slate-500">
              +{item.value}{item.type === 'xp_boost' ? '% XP' : ''}
            </span>
          )}
          {isLegendary && (
            <span className="text-xs font-bold text-amber-600">✨ Legendär</span>
          )}
          {isEpic && (
            <span className="text-xs font-bold text-purple-600">💫 Episch</span>
          )}
        </div>

        <button
          onClick={onOk}
          className="w-full py-3 rounded-2xl font-display font-bold text-white"
          style={{ backgroundColor: colors.text }}
        >
          Einlösen ✓
        </button>
      </div>
    </motion.div>
  );
}

export const LootBoxPage = () => {
  const nav = useNavigate();
  const { availableCrates, inventory, openCrate, addCrate, recentOpening, clearRecentOpening } =
    useLootStore();
  const [phase, setPhase] = useState<Phase>('idle');
  const [revealedItem, setRevealedItem] = useState<LootItem | null>(null);

  const handleOpen = () => {
    if (availableCrates < 1 || phase !== 'idle') return;
    setPhase('bouncing');
  };

  useEffect(() => {
    if (phase === 'bouncing') {
      const t = setTimeout(() => setPhase('shaking'), 500);
      return () => clearTimeout(t);
    }
    if (phase === 'shaking') {
      const t = setTimeout(() => setPhase('flashing'), 1500);
      return () => clearTimeout(t);
    }
    if (phase === 'flashing') {
      const t = setTimeout(() => {
        openCrate();
        setPhase('revealing');
      }, 1800);
      return () => clearTimeout(t);
    }
    if (phase === 'revealing') {
      if (recentOpening) {
        setRevealedItem(recentOpening);
        if (recentOpening.rarity === 'epic') triggerConfetti('medium');
        if (recentOpening.rarity === 'legendary') triggerConfetti('large');
      }
      const t = setTimeout(() => setPhase('shown'), 2500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase, recentOpening, openCrate]);

  const handleDone = () => {
    clearRecentOpening();
    setRevealedItem(null);
    setPhase('idle');
  };

  const recentInventory = [...inventory].reverse().slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-900 pb-24">
      <header className="sticky top-0 z-10 bg-slate-50/90 dark:bg-ink-900/90 backdrop-blur px-5 pt-5 pb-3">
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Loot Box 📦</h1>
      </header>

      <div className="flex flex-col items-center justify-center px-5 py-10 min-h-[50vh]">
        <AnimatePresence mode="wait">
          {phase === 'idle' && availableCrates === 0 && (
            <motion.div
              key="empty"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <div className="text-[6rem] opacity-30 mb-4">📦</div>
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white mb-2">
                Keine Loot Boxen verfügbar
              </h2>
              <p className="text-slate-400 text-sm mb-6">Nächste Box in: 3 Tagen</p>
              <button
                onClick={() => addCrate()}
                className="bg-slate-100 dark:bg-ink-700 text-ink-900 dark:text-white text-sm font-semibold px-5 py-3 rounded-2xl"
              >
                Demo: Box hinzufügen 🎁
              </button>
            </motion.div>
          )}

          {phase === 'idle' && availableCrates > 0 && (
            <motion.div
              key="ready"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <span className="inline-flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
                📦 {availableCrates}x Loot Box
              </span>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="text-[8rem] mb-6 cursor-pointer select-none rounded-full shadow-[0_0_40px_10px_rgba(245,158,11,0.4)]"
                onClick={handleOpen}
              >
                📦
              </motion.div>

              <button
                onClick={handleOpen}
                className="bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-display font-bold text-xl px-10 py-4 rounded-3xl shadow-xl"
              >
                Öffnen!
              </button>
            </motion.div>
          )}

          {(phase === 'bouncing' || phase === 'shaking' || phase === 'flashing') && (
            <motion.div
              key="opening"
              className="flex flex-col items-center"
              exit={{ opacity: 0 }}
            >
              <AnimatePresence mode="wait">
                {phase === 'bouncing' && (
                  <motion.div
                    key="bounce"
                    className="text-[8rem] select-none"
                    animate={{ scale: [0.8, 1.2, 1, 1.1, 1] }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    📦
                  </motion.div>
                )}
                {phase === 'shaking' && (
                  <motion.div
                    key="shake"
                    className="text-[8rem] select-none"
                    variants={shakeX}
                    animate="animate"
                  >
                    📦
                  </motion.div>
                )}
                {phase === 'flashing' && (
                  <motion.div
                    key="flash"
                    className="fixed inset-0 bg-white z-50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {(phase === 'revealing' || phase === 'shown') && revealedItem && (
            <motion.div
              key="reveal"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <RevealCard item={revealedItem} onOk={handleDone} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-5 mt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-bold text-ink-900 dark:text-white">
            Inventar ({inventory.length})
          </h2>
          <button
            onClick={() => nav('/gamification/inventory')}
            className="text-xs font-semibold text-violet-600 dark:text-violet-400"
          >
            Alle anzeigen →
          </button>
        </div>

        {recentInventory.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">
            Noch keine Items. Öffne deine erste Loot Box!
          </p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentInventory.map((item) => {
              const colors = RARITY_COLORS[item.rarity];
              return (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-16 flex flex-col items-center p-2 rounded-2xl bg-white dark:bg-ink-800 shadow-card"
                  style={{ border: `2px solid ${colors.border}` }}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span
                    className="text-[9px] font-bold text-center leading-tight truncate w-full text-center"
                    style={{ color: colors.text }}
                  >
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
