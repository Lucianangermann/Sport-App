import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SeasonReward {
  level: number;
  type: 'xp' | 'badge' | 'lootbox' | 'title' | 'frame';
  label: string;
  icon: string;
  isPremium: boolean;
  unlocked: boolean;
}

export interface SeasonPlayer {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  isCurrentUser?: boolean;
}

interface SeasonState {
  seasonName: string;
  seasonTheme: string;
  seasonEndDate: string;
  userSeasonXp: number;
  userRank: number;
  totalParticipants: number;
  seasonLevel: number;
  rewards: SeasonReward[];
  leaderboard: SeasonPlayer[];
  isPremium: boolean;
  addSeasonXp: (amount: number) => void;
  togglePremium: () => void;
  claimReward: (level: number) => void;
}

const SEASON_REWARDS: SeasonReward[] = [
  { level: 1, type: 'xp', label: '50 XP', icon: '🪙', isPremium: false, unlocked: false },
  { level: 1, type: 'frame', label: 'Frühlings-Rahmen', icon: '🌸', isPremium: true, unlocked: false },
  { level: 2, type: 'lootbox', label: 'Lootbox', icon: '📦', isPremium: false, unlocked: false },
  { level: 2, type: 'xp', label: '+25% XP Boost', icon: '⚡', isPremium: true, unlocked: false },
  { level: 3, type: 'badge', label: 'Frühlings-Abzeichen', icon: '🧩', isPremium: false, unlocked: false },
  { level: 3, type: 'title', label: 'Kirschblüten-Titel', icon: '🌸', isPremium: true, unlocked: false },
  { level: 4, type: 'xp', label: '75 XP', icon: '🪙', isPremium: false, unlocked: false },
  { level: 4, type: 'lootbox', label: 'Premium Lootbox', icon: '📦', isPremium: true, unlocked: false },
  { level: 5, type: 'lootbox', label: 'Lootbox', icon: '📦', isPremium: false, unlocked: false },
  { level: 5, type: 'frame', label: 'Kirschblüten-Rahmen', icon: '🌸', isPremium: true, unlocked: false },
  { level: 6, type: 'xp', label: '100 XP', icon: '🪙', isPremium: false, unlocked: false },
  { level: 6, type: 'badge', label: 'Frühlings-Krieger', icon: '🌺', isPremium: true, unlocked: false },
  { level: 7, type: 'xp', label: '125 XP', icon: '🪙', isPremium: false, unlocked: false },
  { level: 7, type: 'lootbox', label: 'Seltene Lootbox', icon: '📦', isPremium: true, unlocked: false },
  { level: 8, type: 'lootbox', label: 'Lootbox', icon: '📦', isPremium: false, unlocked: false },
  { level: 8, type: 'xp', label: '+50% XP Boost', icon: '⚡', isPremium: true, unlocked: false },
  { level: 9, type: 'xp', label: '150 XP', icon: '🪙', isPremium: false, unlocked: false },
  { level: 9, type: 'frame', label: 'Blüten-Rahmen', icon: '🌷', isPremium: true, unlocked: false },
  { level: 10, type: 'badge', label: 'Saison-Veteran', icon: '🏅', isPremium: false, unlocked: false },
  { level: 10, type: 'title', label: 'Frühlings-Champion', icon: '🌸', isPremium: true, unlocked: false },
  { level: 11, type: 'xp', label: '200 XP', icon: '🪙', isPremium: false, unlocked: false },
  { level: 11, type: 'lootbox', label: 'Epische Lootbox', icon: '📦', isPremium: true, unlocked: false },
  { level: 12, type: 'lootbox', label: 'Lootbox', icon: '📦', isPremium: false, unlocked: false },
  { level: 12, type: 'badge', label: 'Saison-Meister', icon: '🏆', isPremium: true, unlocked: false },
  { level: 15, type: 'xp', label: '300 XP', icon: '🪙', isPremium: false, unlocked: false },
  { level: 15, type: 'frame', label: 'Elite-Frühlings-Rahmen', icon: '🌸', isPremium: true, unlocked: false },
  { level: 20, type: 'lootbox', label: 'Legendäre Lootbox', icon: '📦', isPremium: false, unlocked: false },
  { level: 20, type: 'title', label: 'Saison-Legende', icon: '👑', isPremium: true, unlocked: false },
  { level: 25, type: 'badge', label: 'Saison-Elite', icon: '💎', isPremium: false, unlocked: false },
  { level: 25, type: 'frame', label: 'Legendärer Frühlings-Rahmen', icon: '🌸', isPremium: true, unlocked: false },
];

const LEADERBOARD: SeasonPlayer[] = [
  { rank: 1, name: 'SportKing99', avatar: '👑', xp: 48200 },
  { rank: 2, name: 'FitnessFanatic', avatar: '💪', xp: 44100 },
  { rank: 3, name: 'UltraRunner', avatar: '🏃', xp: 41500 },
  { rank: 4, name: 'IronAthlete', avatar: '🏋️', xp: 38900 },
  { rank: 5, name: 'SwimStar', avatar: '🏊', xp: 36200 },
  { rank: 6, name: 'CycleChamp', avatar: '🚴', xp: 33800 },
  { rank: 7, name: 'YogaMaster', avatar: '🧘', xp: 31500 },
  { rank: 8, name: 'BoxKing', avatar: '🥊', xp: 29200 },
  { rank: 9, name: 'SoccerPro', avatar: '⚽', xp: 27600 },
  { rank: 10, name: 'TennisStar', avatar: '🎾', xp: 25900 },
  { rank: 11, name: 'CrossFitChamp', avatar: '🏅', xp: 24200 },
  { rank: 12, name: 'SprintKing', avatar: '⚡', xp: 22500 },
  { rank: 13, name: 'GymWarrior', avatar: '🔥', xp: 20800 },
  { rank: 14, name: 'NightRunner', avatar: '🌙', xp: 19200 },
  { rank: 15, name: 'EarlyBird', avatar: '🌅', xp: 17600 },
  { rank: 16, name: 'MountainBiker', avatar: '🚵', xp: 16000 },
  { rank: 17, name: 'PoolShark', avatar: '💧', xp: 14500 },
  { rank: 18, name: 'KickBoxer', avatar: '🦵', xp: 13000 },
  { rank: 19, name: 'WeightLifter', avatar: '🏋️', xp: 11500 },
  { rank: 147, name: 'Lucian', avatar: '🏃', xp: 3420, isCurrentUser: true },
];

export const useSeasonStore = create<SeasonState>()(
  persist(
    (set, get) => ({
      seasonName: 'Frühlings-Saison 2026',
      seasonTheme: '🌸 Erwachen',
      seasonEndDate: '2026-07-01T00:00:00.000Z',
      userSeasonXp: 3420,
      userRank: 147,
      totalParticipants: 12847,
      seasonLevel: 8,
      rewards: SEASON_REWARDS,
      leaderboard: LEADERBOARD,
      isPremium: false,

      addSeasonXp: (amount) => {
        const state = get();
        const newXp = state.userSeasonXp + amount;
        const newLevel = Math.max(1, Math.min(30, Math.floor(newXp / 500) + 1));
        set({ userSeasonXp: newXp, seasonLevel: newLevel });
      },

      togglePremium: () =>
        set((state) => ({ isPremium: !state.isPremium })),

      claimReward: (level) => {
        const state = get();
        if (state.seasonLevel < level) return;
        set({
          rewards: state.rewards.map((r) =>
            r.level === level ? { ...r, unlocked: true } : r
          ),
        });
      },
    }),
    { name: 'season-store-v1' }
  )
);
