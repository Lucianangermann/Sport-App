import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Badge } from '../data/badges';
import { BADGES, DEMO_UNLOCKED, getBadgeById } from '../data/badges';

interface BadgeState {
  unlockedBadges: string[];
  showcaseBadges: string[];
  newBadges: string[];
  pendingBadge: Badge | null;
  unlockBadge: (id: string) => void;
  clearPendingBadge: () => void;
  setShowcase: (ids: string[]) => void;
  checkAndUnlock: (event: { type: string; payload?: unknown }) => void;
}

export const useBadgeStore = create<BadgeState>()(
  persist(
    (set, get) => ({
      unlockedBadges: DEMO_UNLOCKED,
      showcaseBadges: ['streak_7', 'first_buddy', 'week_warrior'],
      newBadges: [],
      pendingBadge: null,

      unlockBadge: (id) => {
        const state = get();
        if (state.unlockedBadges.includes(id)) return;
        const badge = getBadgeById(id);
        if (!badge) return;
        set({
          unlockedBadges: [...state.unlockedBadges, id],
          newBadges: [...state.newBadges, id],
          pendingBadge: badge,
        });
      },

      clearPendingBadge: () => {
        const state = get();
        set({
          pendingBadge: null,
          newBadges: state.newBadges.filter(
            (id) => id !== state.pendingBadge?.id
          ),
        });
      },

      setShowcase: (ids) => {
        const state = get();
        const valid = ids
          .filter((id) => state.unlockedBadges.includes(id))
          .slice(0, 3);
        set({ showcaseBadges: valid });
      },

      checkAndUnlock: (event) => {
        const state = get();
        const { type, payload } = event;

        const tryUnlock = (id: string) => {
          if (!state.unlockedBadges.includes(id)) {
            state.unlockBadge(id);
          }
        };

        if (type === 'module_complete') {
          tryUnlock('first_steps');
        }

        if (type === 'sport_opened') {
          tryUnlock('first_sport');
          const discoverBadges = BADGES.filter(
            (b) => b.category === 'entdecker'
          );
          const unlockedEntdecker = state.unlockedBadges.filter((id) =>
            discoverBadges.some((b) => b.id === id)
          );
          if (unlockedEntdecker.length >= 4) tryUnlock('sport_5');
          if (unlockedEntdecker.length >= 9) tryUnlock('sport_10');
          if (unlockedEntdecker.length >= 19) tryUnlock('sport_20');
        }

        if (type === 'buddy_added') {
          tryUnlock('first_buddy');
          const buddyCount =
            (payload as { count?: number } | undefined)?.count ?? 1;
          if (buddyCount >= 5) tryUnlock('buddy_5');
        }

        if (type === 'post_created') {
          tryUnlock('first_post');
          const postCount =
            (payload as { count?: number } | undefined)?.count ?? 1;
          if (postCount >= 10) tryUnlock('post_10');
        }

        if (type === 'challenge_joined') {
          tryUnlock('first_challenge');
        }

        if (type === 'level_reached') {
          const level =
            (payload as { level?: number } | undefined)?.level ?? 0;
          if (level >= 5) tryUnlock('level_5');
          if (level >= 10) tryUnlock('level_10');
          if (level >= 25) tryUnlock('level_25');
          if (level >= 50) tryUnlock('level_50');
          if (level >= 100) tryUnlock('level_100');
        }
      },
    }),
    { name: 'badge-store-v1' }
  )
);
