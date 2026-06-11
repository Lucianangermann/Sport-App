import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface XpGain {
  id: string;
  amount: number;
  source: string;
  multiplier: number;
  timestamp: number;
}

export const XP_SOURCES = {
  COMPLETE_MODULE: 30,
  COMPLETE_SESSION: 50,
  NEW_SPORT: 100,
  STREAK_7_DAYS: 200,
  CHALLENGE_WIN: 150,
  FIND_BUDDY: 75,
  POST_REACTION: 40,
  DAILY_QUEST: 30,
  WEEKLY_QUEST: 100,
} as const;

interface LevelInfo {
  level: number;
  levelTitle: string;
  xpToNextLevel: number;
  xpProgress: number;
}

export function calcLevel(xp: number): LevelInfo {
  let remaining = xp;
  let level = 1;

  const bands = [
    { maxLevel: 10, xpPerLevel: 500, title: 'Rookie' },
    { maxLevel: 25, xpPerLevel: 1000, title: 'Enthusiast' },
    { maxLevel: 50, xpPerLevel: 2000, title: 'Athlete' },
    { maxLevel: 75, xpPerLevel: 3500, title: 'Champion' },
    { maxLevel: 100, xpPerLevel: 5000, title: 'Legend' },
  ];

  for (const band of bands) {
    const levelsInBand = band.maxLevel - (level - 1);
    const xpForBand = levelsInBand * band.xpPerLevel;

    if (remaining < xpForBand) {
      const levelsEarned = Math.floor(remaining / band.xpPerLevel);
      level += levelsEarned;
      const xpIntoLevel = remaining - levelsEarned * band.xpPerLevel;
      const xpToNextLevel = band.xpPerLevel - xpIntoLevel;
      const xpProgress = Math.round((xpIntoLevel / band.xpPerLevel) * 100);
      return {
        level: Math.min(level, 100),
        levelTitle: band.title,
        xpToNextLevel,
        xpProgress,
      };
    }

    remaining -= xpForBand;
    level = band.maxLevel + 1;
  }

  return {
    level: 100,
    levelTitle: 'Legend',
    xpToNextLevel: 0,
    xpProgress: 100,
  };
}

interface XpState {
  xp: number;
  level: number;
  levelTitle: string;
  xpToNextLevel: number;
  xpProgress: number;
  multiplier: number;
  recentXpGains: XpGain[];
  pendingLevelUp: number | null;
  addXP: (amount: number, source: string, multiplierOverride?: number) => void;
  clearLevelUp: () => void;
  clearRecentGain: (id: string) => void;
  setMultiplier: (m: number) => void;
}

// New users start at level 1. (Previously seeded to a demo value of 2340,
// which dropped real first-time users in around level 5.)
const INITIAL_XP = 0;
const initialLevelInfo = calcLevel(INITIAL_XP);

export const useXpStore = create<XpState>()(
  persist(
    (set, get) => ({
      xp: INITIAL_XP,
      level: initialLevelInfo.level,
      levelTitle: initialLevelInfo.levelTitle,
      xpToNextLevel: initialLevelInfo.xpToNextLevel,
      xpProgress: initialLevelInfo.xpProgress,
      multiplier: 1,
      recentXpGains: [],
      pendingLevelUp: null,

      addXP: (amount, source, multiplierOverride) => {
        const state = get();
        const effectiveMultiplier = multiplierOverride ?? state.multiplier;
        const earned = Math.round(amount * effectiveMultiplier);
        const newXp = state.xp + earned;
        const newLevelInfo = calcLevel(newXp);
        const didLevelUp = newLevelInfo.level > state.level;

        const gain: XpGain = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          amount: earned,
          source,
          multiplier: effectiveMultiplier,
          timestamp: Date.now(),
        };

        const recentGains = [gain, ...state.recentXpGains].slice(0, 10);

        set({
          xp: newXp,
          level: newLevelInfo.level,
          levelTitle: newLevelInfo.levelTitle,
          xpToNextLevel: newLevelInfo.xpToNextLevel,
          xpProgress: newLevelInfo.xpProgress,
          recentXpGains: recentGains,
          pendingLevelUp: didLevelUp ? newLevelInfo.level : state.pendingLevelUp,
        });
      },

      clearLevelUp: () => set({ pendingLevelUp: null }),

      clearRecentGain: (id) =>
        set((state) => ({
          recentXpGains: state.recentXpGains.filter((g) => g.id !== id),
        })),

      setMultiplier: (m) => set({ multiplier: m }),
    }),
    { name: 'xp-store-v1' }
  )
);
