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
  address: string;
  /** Whether this club explicitly offers trial training (only known for curated mock data). */
  trialAvailable: boolean;
  /** Origin of the data: 'mock' = curated fixture, 'osm' = fetched from OpenStreetMap. */
  source?: 'mock' | 'osm';
  // Curated fields — present for mock data, usually missing for OSM.
  rating?: number;
  memberCount?: number;
  description?: string;
  trainingTimes?: string[];
  // Contact / OSM-friendly fields.
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  openingHours?: string;
  lat?: number;
  lon?: number;
  /** Human-readable POI type label ("Verein", "Studio", "Halle", "Platz", …). */
  kind?: string;
  /** True when the venue is sport-agnostic (matched via club=sport or sports_centre
   *  without explicit sport tag — typical for German multi-section clubs). */
  multiSport?: boolean;
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
  /** Snapshot of the club name at inquiry time — survives OSM cache eviction. */
  clubName?: string;
  name: string;
  email: string;
  message: string;
  preferredDate: string;
  createdAt: string;
  status: 'sent' | 'confirmed';
}
