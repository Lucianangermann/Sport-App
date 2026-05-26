import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LootItem {
  id: string;
  name: string;
  description: string;
  type: 'xp_boost' | 'profile_frame' | 'passport_skin' | 'title' | 'reaction' | 'badge_fragment';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  value?: number;
  equipped?: boolean;
}

export const LOOT_POOL: LootItem[] = [
  {
    id: 'xp_boost_25_24h',
    name: '+25% XP 24h',
    description: 'Erhalte 25% mehr XP für 24 Stunden',
    type: 'xp_boost',
    rarity: 'common',
    icon: '⚡',
    value: 25,
  },
  {
    id: 'xp_boost_30_12h',
    name: '+30% XP 12h',
    description: 'Erhalte 30% mehr XP für 12 Stunden',
    type: 'xp_boost',
    rarity: 'common',
    icon: '⚡',
    value: 30,
  },
  {
    id: 'xp_boost_50_24h',
    name: '+50% XP 24h',
    description: 'Erhalte 50% mehr XP für 24 Stunden',
    type: 'xp_boost',
    rarity: 'uncommon',
    icon: '⚡',
    value: 50,
  },
  {
    id: 'xp_boost_75_36h',
    name: '+75% XP 36h',
    description: 'Erhalte 75% mehr XP für 36 Stunden',
    type: 'xp_boost',
    rarity: 'uncommon',
    icon: '⚡',
    value: 75,
  },
  {
    id: 'xp_boost_100_24h',
    name: '+100% XP 24h',
    description: 'Erhalte doppelte XP für 24 Stunden',
    type: 'xp_boost',
    rarity: 'rare',
    icon: '⚡',
    value: 100,
  },
  {
    id: 'xp_boost_150_72h',
    name: '+150% XP 72h',
    description: 'Erhalte 150% mehr XP für 72 Stunden',
    type: 'xp_boost',
    rarity: 'rare',
    icon: '⚡',
    value: 150,
  },
  {
    id: 'xp_boost_200_48h',
    name: '+200% XP 48h',
    description: 'Erhalte dreifache XP für 48 Stunden',
    type: 'xp_boost',
    rarity: 'epic',
    icon: '⚡',
    value: 200,
  },
  {
    id: 'xp_boost_500_week',
    name: '+500% XP 1 Woche',
    description: 'Erhalte 500% mehr XP für eine ganze Woche',
    type: 'xp_boost',
    rarity: 'legendary',
    icon: '⚡',
    value: 500,
  },
  {
    id: 'frame_silver',
    name: 'Silber-Rahmen',
    description: 'Ein eleganter Silber-Rahmen für dein Profil',
    type: 'profile_frame',
    rarity: 'uncommon',
    icon: '🪟',
  },
  {
    id: 'frame_ice',
    name: 'Eis-Rahmen',
    description: 'Ein eiskalter Rahmen für dein Profil',
    type: 'profile_frame',
    rarity: 'uncommon',
    icon: '❄️',
  },
  {
    id: 'frame_gold',
    name: 'Gold-Rahmen',
    description: 'Ein glänzender Gold-Rahmen für dein Profil',
    type: 'profile_frame',
    rarity: 'rare',
    icon: '✨',
  },
  {
    id: 'frame_fire',
    name: 'Feuer-Rahmen',
    description: 'Ein feuriger Rahmen für dein Profil',
    type: 'profile_frame',
    rarity: 'rare',
    icon: '🔥',
  },
  {
    id: 'frame_rainbow',
    name: 'Regenbogen-Rahmen',
    description: 'Ein schillernder Regenbogen-Rahmen für dein Profil',
    type: 'profile_frame',
    rarity: 'epic',
    icon: '🌈',
  },
  {
    id: 'frame_legendary',
    name: 'Legendärer Rahmen',
    description: 'Der seltenste Rahmen im gesamten Spiel',
    type: 'profile_frame',
    rarity: 'legendary',
    icon: '👑',
  },
  {
    id: 'passport_ocean',
    name: 'Ozean-Pass',
    description: 'Ein ozeanblauer Sport-Passport',
    type: 'passport_skin',
    rarity: 'uncommon',
    icon: '🌊',
  },
  {
    id: 'passport_night',
    name: 'Nacht-Pass',
    description: 'Ein nächtlich dunkler Sport-Passport',
    type: 'passport_skin',
    rarity: 'rare',
    icon: '🌙',
  },
  {
    id: 'passport_fire',
    name: 'Feuer-Pass',
    description: 'Ein feuriger Sport-Passport',
    type: 'passport_skin',
    rarity: 'rare',
    icon: '🔥',
  },
  {
    id: 'passport_crystal',
    name: 'Kristall-Pass',
    description: 'Ein kristallklarer Sport-Passport',
    type: 'passport_skin',
    rarity: 'epic',
    icon: '💎',
  },
  {
    id: 'passport_golden',
    name: 'Goldener Pass',
    description: 'Der legendäre goldene Sport-Passport',
    type: 'passport_skin',
    rarity: 'legendary',
    icon: '🏆',
  },
  {
    id: 'title_anfaenger',
    name: 'Anfänger',
    description: 'Der Titel "Anfänger" für dein Profil',
    type: 'title',
    rarity: 'common',
    icon: '🏷️',
  },
  {
    id: 'title_kaempfer',
    name: 'Kämpfer',
    description: 'Der Titel "Kämpfer" für dein Profil',
    type: 'title',
    rarity: 'uncommon',
    icon: '🏷️',
  },
  {
    id: 'title_meister',
    name: 'Meister',
    description: 'Der Titel "Meister" für dein Profil',
    type: 'title',
    rarity: 'rare',
    icon: '🏷️',
  },
  {
    id: 'title_legende',
    name: 'Legende',
    description: 'Der legendäre Titel "Legende" für dein Profil',
    type: 'title',
    rarity: 'legendary',
    icon: '🏷️',
  },
  {
    id: 'reaction_fire',
    name: 'Feuer-Reaktion ✨',
    description: 'Eine spezielle Feuer-Reaktion für Community-Posts',
    type: 'reaction',
    rarity: 'uncommon',
    icon: '🔥',
  },
  {
    id: 'reaction_heart',
    name: 'Herz-Reaktion 💖',
    description: 'Eine besondere Herz-Reaktion für Community-Posts',
    type: 'reaction',
    rarity: 'uncommon',
    icon: '💖',
  },
  {
    id: 'reaction_lightning',
    name: 'Blitz-Reaktion ⚡',
    description: 'Eine blitzschnelle Reaktion für Community-Posts',
    type: 'reaction',
    rarity: 'rare',
    icon: '⚡',
  },
  {
    id: 'reaction_rainbow',
    name: 'Regenbogen-Reaktion 🌈',
    description: 'Die seltenste Reaktion für Community-Posts',
    type: 'reaction',
    rarity: 'epic',
    icon: '🌈',
  },
  {
    id: 'fragment_1',
    name: 'Fragment 1/3',
    description: 'Das erste Fragment eines geheimen Abzeichens',
    type: 'badge_fragment',
    rarity: 'rare',
    icon: '🧩',
    value: 1,
  },
  {
    id: 'fragment_2',
    name: 'Fragment 2/3',
    description: 'Das zweite Fragment eines geheimen Abzeichens',
    type: 'badge_fragment',
    rarity: 'rare',
    icon: '🧩',
    value: 2,
  },
  {
    id: 'fragment_3',
    name: 'Fragment 3/3',
    description: 'Das dritte Fragment eines geheimen Abzeichens',
    type: 'badge_fragment',
    rarity: 'epic',
    icon: '🧩',
    value: 3,
  },
];

const RARITY_WEIGHTS: Record<LootItem['rarity'], number> = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 4,
  legendary: 1,
};

function pickWeightedItem(): LootItem {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;

  let chosenRarity: LootItem['rarity'] = 'common';
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS) as [LootItem['rarity'], number][]) {
    roll -= weight;
    if (roll <= 0) {
      chosenRarity = rarity;
      break;
    }
  }

  const candidates = LOOT_POOL.filter((item) => item.rarity === chosenRarity);
  if (candidates.length === 0) return LOOT_POOL[0];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

interface LootState {
  availableCrates: number;
  inventory: LootItem[];
  equippedItems: Record<string, string>;
  recentOpening: LootItem | null;
  totalOpened: number;
  openCrate: () => void;
  addCrate: () => void;
  clearRecentOpening: () => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
}

export const useLootStore = create<LootState>()(
  persist(
    (set, get) => ({
      availableCrates: 1,
      inventory: [],
      equippedItems: {},
      recentOpening: null,
      totalOpened: 0,

      openCrate: () => {
        const state = get();
        if (state.availableCrates < 1) return;

        const item = pickWeightedItem();
        const inventoryItem: LootItem = {
          ...item,
          id: `${item.id}-${Date.now()}`,
          equipped: false,
        };

        set({
          availableCrates: state.availableCrates - 1,
          inventory: [...state.inventory, inventoryItem],
          recentOpening: inventoryItem,
          totalOpened: state.totalOpened + 1,
        });
      },

      addCrate: () =>
        set((state) => ({ availableCrates: state.availableCrates + 1 })),

      clearRecentOpening: () => set({ recentOpening: null }),

      equipItem: (itemId) => {
        const state = get();
        const item = state.inventory.find((i) => i.id === itemId);
        if (!item) return;

        const updatedInventory = state.inventory.map((i) => {
          if (i.id === itemId) return { ...i, equipped: true };
          if (i.type === item.type && i.equipped) return { ...i, equipped: false };
          return i;
        });

        set({
          inventory: updatedInventory,
          equippedItems: { ...state.equippedItems, [item.type]: itemId },
        });
      },

      unequipItem: (itemId) => {
        const state = get();
        const item = state.inventory.find((i) => i.id === itemId);
        if (!item) return;

        const updatedEquipped = { ...state.equippedItems };
        if (updatedEquipped[item.type] === itemId) {
          delete updatedEquipped[item.type];
        }

        set({
          inventory: state.inventory.map((i) =>
            i.id === itemId ? { ...i, equipped: false } : i
          ),
          equippedItems: updatedEquipped,
        });
      },
    }),
    { name: 'loot-store-v1' }
  )
);
