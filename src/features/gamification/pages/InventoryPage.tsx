import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLootStore } from '../store/lootStore';
import type { LootItem } from '../store/lootStore';
import { PageHeader } from '../../../components/PageHeader';
import { staggerContainer, fadeIn } from '../utils/animations';

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

type FilterType = 'all' | LootItem['type'];

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'xp_boost', label: 'XP-Boost' },
  { key: 'profile_frame', label: 'Rahmen' },
  { key: 'passport_skin', label: 'Passport-Skin' },
  { key: 'title', label: 'Titel' },
  { key: 'reaction', label: 'Reaktion' },
  { key: 'badge_fragment', label: 'Badge-Fragment' },
];

function ItemCard({ item }: { item: LootItem }) {
  const { equipItem, unequipItem } = useLootStore();
  const colors = RARITY_COLORS[item.rarity];

  return (
    <motion.div
      variants={fadeIn}
      className="rounded-2xl p-3 text-center bg-white dark:bg-ink-800 shadow-card dark:shadow-card-dark flex flex-col items-center gap-2"
      style={{ border: `2px solid ${colors.border}` }}
    >
      <span className="text-3xl">{item.icon}</span>
      <span className="text-xs font-bold text-ink-900 dark:text-white leading-tight text-center line-clamp-2">
        {item.name}
      </span>
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ color: colors.text, backgroundColor: `${colors.border}40` }}
      >
        {colors.label}
      </span>
      <span className="text-[10px] text-slate-400">{TYPE_LABELS[item.type]}</span>
      {item.equipped ? (
        <>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full w-full text-center">
            Ausgerüstet ✓
          </span>
          <button
            onClick={() => unequipItem(item.id)}
            className="text-[10px] font-semibold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-ink-700 px-2 py-1 rounded-xl w-full"
          >
            Ablegen
          </button>
        </>
      ) : (
        <button
          onClick={() => equipItem(item.id)}
          className="text-[10px] font-bold text-white px-2 py-1 rounded-xl w-full"
          style={{ backgroundColor: colors.text }}
        >
          Ausrüsten
        </button>
      )}
    </motion.div>
  );
}

export const InventoryPage = () => {
  const { inventory } = useLootStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredItems =
    activeFilter === 'all'
      ? inventory
      : inventory.filter((item) => item.type === activeFilter);

  const usedFilters = FILTER_OPTIONS.filter(
    (f) =>
      f.key === 'all' || inventory.some((item) => item.type === f.key)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-900 pb-24">
      <PageHeader title="Inventar" back />

      <div className="flex gap-2 px-5 mt-2 mb-4 overflow-x-auto pb-1">
        {usedFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeFilter === f.key
                ? 'bg-ink-900 dark:bg-white text-white dark:text-ink-900'
                : 'bg-white dark:bg-ink-800 text-slate-500 dark:text-slate-300 shadow-card'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center py-20 px-5 text-center"
        >
          <div className="text-6xl mb-3 opacity-30">🎒</div>
          <p className="font-display font-bold text-ink-900 dark:text-white text-lg mb-1">
            {activeFilter === 'all' ? 'Inventar leer' : 'Keine Items dieser Art'}
          </p>
          <p className="text-sm text-slate-400">
            {activeFilter === 'all'
              ? 'Öffne Loot Boxen, um Items zu erhalten!'
              : 'Wechsle den Filter oder öffne mehr Loot Boxen.'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-3 px-5"
        >
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </motion.div>
      )}
    </div>
  );
};
