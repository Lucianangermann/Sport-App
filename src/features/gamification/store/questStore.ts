import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DAILY_TEMPLATES, WEEKLY_TEMPLATES } from '../data/questTemplates';
import { useXpStore } from './xpStore';

export interface ActiveQuest {
  id: string;
  templateId: string;
  title: string;
  desc: string;
  xp: number;
  type: string;
  target: number;
  unit: string;
  icon: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
  period: 'daily' | 'weekly';
}

interface QuestState {
  dailyQuests: ActiveQuest[];
  weeklyQuests: ActiveQuest[];
  lastDailyRefresh: string;
  lastWeeklyRefresh: string;
  completedToday: string[];
  totalCompleted: number;
  refreshQuests: () => void;
  updateProgress: (questId: string, amount: number) => void;
  claimReward: (questId: string) => void;
  forceRefresh: () => void;
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getISOWeekStr(): string {
  const now = new Date();
  const jan4 = new Date(now.getFullYear(), 0, 4);
  const dayOfYear =
    Math.floor((now.getTime() - jan4.getTime()) / 86400000) +
    jan4.getDay() +
    1;
  const week = Math.ceil(dayOfYear / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function templateToQuest(
  template: (typeof DAILY_TEMPLATES)[number],
  index: number
): ActiveQuest {
  return {
    id: `${template.id}-${Date.now()}-${index}`,
    templateId: template.id,
    title: template.title,
    desc: template.desc,
    xp: template.xp,
    type: template.type,
    target: template.target,
    unit: template.unit,
    icon: template.icon,
    progress: 0,
    completed: false,
    claimed: false,
    period: template.period,
  };
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      dailyQuests: [],
      weeklyQuests: [],
      lastDailyRefresh: '',
      lastWeeklyRefresh: '',
      completedToday: [],
      totalCompleted: 0,

      refreshQuests: () => {
        const state = get();
        const today = getTodayStr();
        const thisWeek = getISOWeekStr();

        const updates: Partial<QuestState> = {};

        if (state.lastDailyRefresh !== today) {
          const picked = pickRandom(DAILY_TEMPLATES, 3);
          updates.dailyQuests = picked.map((t, i) => templateToQuest(t, i));
          updates.lastDailyRefresh = today;
          updates.completedToday = [];
        }

        if (state.lastWeeklyRefresh !== thisWeek) {
          const picked = pickRandom(WEEKLY_TEMPLATES, 2);
          updates.weeklyQuests = picked.map((t, i) => templateToQuest(t, i));
          updates.lastWeeklyRefresh = thisWeek;
        }

        if (Object.keys(updates).length > 0) {
          set(updates);
        }
      },

      updateProgress: (questId, amount) => {
        set((state) => {
          const updateList = (quests: ActiveQuest[]): ActiveQuest[] =>
            quests.map((q) => {
              if (q.id !== questId || q.claimed) return q;
              const newProgress = q.progress + amount;
              const completed = newProgress >= q.target;
              return { ...q, progress: newProgress, completed };
            });

          return {
            dailyQuests: updateList(state.dailyQuests),
            weeklyQuests: updateList(state.weeklyQuests),
          };
        });
      },

      claimReward: (questId) => {
        const state = get();
        const allQuests = [...state.dailyQuests, ...state.weeklyQuests];
        const quest = allQuests.find((q) => q.id === questId);

        if (!quest || !quest.completed || quest.claimed) return;

        const source = quest.period === 'weekly' ? 'WEEKLY_QUEST' : 'DAILY_QUEST';
        useXpStore.getState().addXP(quest.xp, source);

        set((s) => {
          const updateList = (quests: ActiveQuest[]): ActiveQuest[] =>
            quests.map((q) => (q.id === questId ? { ...q, claimed: true } : q));

          return {
            dailyQuests: updateList(s.dailyQuests),
            weeklyQuests: updateList(s.weeklyQuests),
            completedToday: [...s.completedToday, questId],
            totalCompleted: s.totalCompleted + 1,
          };
        });
      },

      forceRefresh: () => {
        const dailyPicked = pickRandom(DAILY_TEMPLATES, 3);
        const weeklyPicked = pickRandom(WEEKLY_TEMPLATES, 2);
        set({
          dailyQuests: dailyPicked.map((t, i) => templateToQuest(t, i)),
          weeklyQuests: weeklyPicked.map((t, i) => templateToQuest(t, i)),
          lastDailyRefresh: getTodayStr(),
          lastWeeklyRefresh: getISOWeekStr(),
          completedToday: [],
        });
      },
    }),
    {
      name: 'quest-store-v1',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.refreshQuests();
        }
      },
    }
  )
);
