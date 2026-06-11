import { useEffect } from 'react';
import { useDomainEvent } from '../../../lib/events';
import { useXpStore, XP_SOURCES } from '../store/xpStore';
import { useBadgeStore } from '../store/badgeStore';
import { useQuestStore } from '../store/questStore';
import { useLootStore } from '../store/lootStore';
import { useSeasonStore } from '../store/seasonStore';

/**
 * Bridges domain events → gamification rewards. Mounted once at the app root.
 *
 * Everything here reacts to *events* ("a module was just completed"), never to
 * raw state diffs. That's the whole point: a reload re-creates state but emits
 * no events, so rewards can't fire by accident.
 */
export const useGameEvents = () => {
  const refreshQuests = useQuestStore((s) => s.refreshQuests);

  useEffect(() => {
    refreshQuests();
  }, [refreshQuests]);

  useDomainEvent('module.completed', () => {
    useXpStore.getState().addXP(XP_SOURCES.COMPLETE_MODULE, 'Modul abgeschlossen');
    useSeasonStore.getState().addSeasonXp(XP_SOURCES.COMPLETE_MODULE);
    useBadgeStore.getState().checkAndUnlock({ type: 'module_complete' });

    const { dailyQuests, updateProgress } = useQuestStore.getState();
    const trainingQuest = dailyQuests.find((q) => q.type === 'training' && !q.claimed);
    if (trainingQuest) updateProgress(trainingQuest.id, 1);
  });

  useDomainEvent('streak.advanced', ({ days }) => {
    if (days === 7) {
      useXpStore.getState().addXP(XP_SOURCES.STREAK_7_DAYS, '7-Tage-Streak');
      useBadgeStore.getState().checkAndUnlock({ type: 'streak_7' });
    }
    // A loot crate at every full week milestone (7, 14, 21, …).
    if (days % 7 === 0) useLootStore.getState().addCrate();
  });
};
