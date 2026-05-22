export type SportCategory =
  | 'Mannschaft'
  | 'Kampfsport'
  | 'Ausdauer'
  | 'Wasser'
  | 'Kraft'
  | 'Racket'
  | 'Mind & Body'
  | 'Outdoor'
  | 'Wintersport'
  | 'Tanz';

export type SportTag =
  | 'indoor'
  | 'outdoor'
  | 'team'
  | 'solo'
  | 'low-intensity'
  | 'high-intensity'
  | 'beginner-friendly';

export type SkillLevel = 'anfaenger' | 'fortgeschritten' | 'profi';

export interface Sport {
  id: string;
  name: string;
  emoji: string;
  category: SportCategory;
  tags: SportTag[];
  color: string; // tailwind-safe hex
  description: string;
  popularity: number; // 0-100, for trending
}

export interface LessonSource {
  title: string;
  url: string;
}

export interface LessonContent {
  intro?: string;
  keyPoints?: string[];
  tips?: string[];
  safety?: string[];
  sources?: LessonSource[];
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "20 min"
  /** 11-char YouTube video ID, if a real lesson video is available. */
  ytVideoId?: string;
  /** Channel that hosts the video, for attribution. */
  channel?: string;
  /** Optional richer lesson content shown beneath the video. */
  content?: LessonContent;
}

export interface SportCurriculum {
  sportId: string;
  anfaenger: TrainingModule[];
  fortgeschritten: TrainingModule[];
  profi: TrainingModule[];
}

export interface Club {
  id: string;
  name: string;
  sportId: string;
  distanceKm: number;
  rating: number;
  memberCount: number;
  address: string;
  trialAvailable: boolean;
  description: string;
  trainingTimes: string[];
  contactEmail: string;
  contactPhone: string;
}

export type FitnessLevel = 'couch' | 'occasional' | 'regular';

export interface OnboardingAnswers {
  fitnessLevel: FitnessLevel | null;
  indoorPreference: 'indoor' | 'outdoor' | 'both' | null;
  socialPreference: 'solo' | 'team' | 'both' | null;
  intensity: 'low' | 'high' | 'both' | null;
}

export interface UserProfile {
  name: string;
  avatarEmoji: string;
  xp: number;
  streakDays: number;
  lastActivityDate: string | null;
  onboardingComplete: boolean;
  onboarding: OnboardingAnswers;
  settings: {
    notifications: boolean;
    locationEnabled: boolean;
    language: 'de' | 'en';
  };
}

export interface ProgressEntry {
  // key: `${sportId}:${level}:${moduleId}`
  completedAt: string;
}

export interface SportProgress {
  // map level -> count of completed module IDs
  [moduleKey: string]: ProgressEntry;
}

export interface Inquiry {
  id: string;
  clubId: string;
  name: string;
  email: string;
  message: string;
  preferredDate: string;
  createdAt: string;
  status: 'sent' | 'confirmed';
}
