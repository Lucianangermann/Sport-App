import { SPORTS } from '../data/sports';
import { CLUBS } from '../data/clubs';
import { lookupClub } from '../lib/clubRegistry';
import type { Club, OnboardingAnswers, SkillLevel, Sport } from '../types';

export const getSportById = (id: string): Sport | undefined => SPORTS.find((s) => s.id === id);

export const getClubsForSport = (sportId: string) => CLUBS.filter((c) => c.sportId === sportId);

/** Resolve a club ID against curated mock data first, then the OSM registry. */
export const findClubById = (id: string): Club | undefined => {
  const mock = CLUBS.find((c) => c.id === id);
  if (mock) return mock;
  return lookupClub(id) ?? undefined;
};

export const getRecommendedSports = (answers: OnboardingAnswers, limit = 5): Sport[] => {
  const score = (s: Sport): number => {
    let pts = s.popularity * 0.05;
    if (answers.fitnessLevel === 'couch' && s.tags.includes('beginner-friendly')) pts += 30;
    if (answers.fitnessLevel === 'couch' && s.tags.includes('low-intensity')) pts += 20;
    if (answers.fitnessLevel === 'regular' && s.tags.includes('high-intensity')) pts += 20;
    if (answers.indoorPreference && answers.indoorPreference !== 'both' && s.tags.includes(answers.indoorPreference)) pts += 25;
    if (answers.socialPreference && answers.socialPreference !== 'both' && s.tags.includes(answers.socialPreference)) pts += 25;
    if (answers.intensity === 'low' && s.tags.includes('low-intensity')) pts += 25;
    if (answers.intensity === 'high' && s.tags.includes('high-intensity')) pts += 25;
    return pts;
  };
  return [...SPORTS].sort((a, b) => score(b) - score(a)).slice(0, limit);
};

export const moduleKey = (sportId: string, level: SkillLevel, moduleId: string) =>
  `${sportId}:${level}:${moduleId}`;

export const formatDistance = (km: number) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`);

export const greeting = (name: string) => {
  const hour = new Date().getHours();
  if (hour < 11) return `Guten Morgen, ${name}`;
  if (hour < 18) return `Hallo, ${name}`;
  return `Guten Abend, ${name}`;
};
