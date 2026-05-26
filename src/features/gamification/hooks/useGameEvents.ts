import { useEffect } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useXpStore, XP_SOURCES } from '../store/xpStore';
import { useBadgeStore } from '../store/badgeStore';
import { useQuestStore } from '../store/questStore';
import { useLootStore } from '../store/lootStore';
import { useSeasonStore } from '../store/seasonStore';

export const useGameEvents = () => {
  const progress = useAppStore((s) => s.progress);
  const profile = useAppStore((s) => s.profile);

  const addXP = useXpStore((s) => s.addXP);
  const checkAndUnlock = useBadgeStore((s) => s.checkAndUnlock);
  const updateProgress = useQuestStore((s) => s.updateProgress);
  const refreshQuests = useQuestStore((s) => s.refreshQuests);
  const dailyQuests = useQuestStore((s) => s.dailyQuests);
  const addCrate = useLootStore((s) => s.addCrate);
  const addSeasonXp = useSeasonStore((s) => s.addSeasonXp);

  useEffect(() => {
    refreshQuests();
  }, [refreshQuests]);

  const prevProgressRef = useEffect(() => {}, []);
  void prevProgressRef;

  const completedModulesCount = Object.values(progress).filter(Boolean).length;

  useEffect(() => {
    if (completedModulesCount === 0) return;
    addXP(XP_SOURCES.COMPLETE_MODULE, 'Modul abgeschlossen');
    addSeasonXp(XP_SOURCES.COMPLETE_MODULE);
    checkAndUnlock({ type: 'module_complete' });

    const trainingQuest = dailyQuests.find((q) => q.type === 'training' && !q.claimed);
    if (trainingQuest) {
      updateProgress(trainingQuest.id, 1);
    }
  }, [completedModulesCount]);

  const streakDays = profile.streakDays;

  useEffect(() => {
    if (streakDays === 7) {
      addXP(XP_SOURCES.STREAK_7_DAYS, '7-Tage-Streak');
      checkAndUnlock({ type: 'streak_7' });
    }
    if (streakDays > 0 && streakDays % 7 === 0) {
      addCrate();
    }
  }, [streakDays]);
};
