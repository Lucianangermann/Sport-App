import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Inquiry,
  OnboardingAnswers,
  ProgressEntry,
  SkillLevel,
  UserProfile,
} from '../types';
import { moduleKey } from '../utils/helpers';

interface AppState {
  profile: UserProfile;
  favorites: string[]; // sport IDs
  progress: Record<string, ProgressEntry>; // key from moduleKey()
  inquiries: Inquiry[];
  lastSportId: string | null;

  // actions
  setProfileName: (name: string) => void;
  setAvatar: (emoji: string) => void;
  toggleFavorite: (sportId: string) => void;
  toggleModule: (sportId: string, level: SkillLevel, moduleId: string, xpDelta?: number) => void;
  setLastSport: (sportId: string) => void;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  resetOnboarding: () => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => Inquiry;
  updateSettings: (patch: Partial<UserProfile['settings']>) => void;
  resetAll: () => void;
}

const defaultProfile: UserProfile = {
  name: 'Sportler:in',
  avatarEmoji: '🏃',
  xp: 0,
  streakDays: 0,
  lastActivityDate: null,
  onboardingComplete: false,
  onboarding: {
    fitnessLevel: null,
    indoorPreference: null,
    socialPreference: null,
    intensity: null,
  },
  settings: {
    notifications: true,
    locationEnabled: false,
    language: 'de',
  },
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) => {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      favorites: [],
      progress: {},
      inquiries: [],
      lastSportId: null,

      setProfileName: (name) =>
        set((s) => ({ profile: { ...s.profile, name: name.trim() || 'Sportler:in' } })),

      setAvatar: (emoji) => set((s) => ({ profile: { ...s.profile, avatarEmoji: emoji } })),

      toggleFavorite: (sportId) =>
        set((s) => ({
          favorites: s.favorites.includes(sportId)
            ? s.favorites.filter((id) => id !== sportId)
            : [...s.favorites, sportId],
        })),

      toggleModule: (sportId, level, moduleId, xpDelta = 25) => {
        const key = moduleKey(sportId, level, moduleId);
        const { progress, profile } = get();
        const wasCompleted = !!progress[key];
        const nextProgress = { ...progress };
        let nextXp = profile.xp;
        let nextStreak = profile.streakDays;
        let nextLast = profile.lastActivityDate;

        if (wasCompleted) {
          delete nextProgress[key];
          nextXp = Math.max(0, nextXp - xpDelta);
        } else {
          nextProgress[key] = { completedAt: new Date().toISOString() };
          nextXp += xpDelta;
          const today = todayISO();
          if (!profile.lastActivityDate) {
            nextStreak = 1;
          } else {
            const diff = daysBetween(profile.lastActivityDate, today);
            if (diff === 0) nextStreak = profile.streakDays || 1;
            else if (diff === 1) nextStreak = profile.streakDays + 1;
            else nextStreak = 1;
          }
          nextLast = today;
        }

        set({
          progress: nextProgress,
          profile: { ...profile, xp: nextXp, streakDays: nextStreak, lastActivityDate: nextLast },
          lastSportId: sportId,
        });
      },

      setLastSport: (sportId) => set({ lastSportId: sportId }),

      completeOnboarding: (answers) =>
        set((s) => ({
          profile: { ...s.profile, onboarding: answers, onboardingComplete: true },
        })),

      resetOnboarding: () =>
        set((s) => ({
          profile: { ...s.profile, onboardingComplete: false, onboarding: defaultProfile.onboarding },
        })),

      addInquiry: (inquiry) => {
        const full: Inquiry = {
          ...inquiry,
          id: `inq_${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'sent',
        };
        set((s) => ({ inquiries: [full, ...s.inquiries] }));
        return full;
      },

      updateSettings: (patch) =>
        set((s) => ({ profile: { ...s.profile, settings: { ...s.profile.settings, ...patch } } })),

      resetAll: () =>
        set({
          profile: defaultProfile,
          favorites: [],
          progress: {},
          inquiries: [],
          lastSportId: null,
        }),
    }),
    {
      name: 'sportify-store-v1',
    },
  ),
);
