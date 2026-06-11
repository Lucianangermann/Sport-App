import { describe, expect, it } from 'vitest';
import { formatDistance, getRecommendedSports, moduleKey } from './helpers';
import type { OnboardingAnswers } from '../types';

const NEUTRAL: OnboardingAnswers = {
  fitnessLevel: null,
  indoorPreference: null,
  socialPreference: null,
  intensity: null,
};

describe('getRecommendedSports', () => {
  it('respects the requested limit', () => {
    expect(getRecommendedSports(NEUTRAL, 3)).toHaveLength(3);
    expect(getRecommendedSports(NEUTRAL, 6)).toHaveLength(6);
  });

  it('falls back to popularity ordering when no preferences are set', () => {
    const top = getRecommendedSports(NEUTRAL, 3).map((s) => s.id);
    // Pure popularity: Fußball(98) > Laufen(92) > Krafttraining(90).
    expect(top).toEqual(['fussball', 'laufen', 'krafttraining']);
  });

  it('surfaces gentle sports for a couch starter who wants calm indoor solo training', () => {
    const couch: OnboardingAnswers = {
      fitnessLevel: 'couch',
      indoorPreference: 'indoor',
      socialPreference: 'solo',
      intensity: 'low',
    };
    const top3 = getRecommendedSports(couch, 3);

    // Every top pick should be both low-intensity and beginner-friendly.
    for (const sport of top3) {
      expect(sport.tags).toContain('low-intensity');
      expect(sport.tags).toContain('beginner-friendly');
    }
    // A high-intensity sport like CrossFit must not bubble to the top here.
    expect(top3.map((s) => s.id)).not.toContain('crossfit');
  });

  it('rewards a high-intensity match for a regular athlete', () => {
    const regular: OnboardingAnswers = {
      fitnessLevel: 'regular',
      indoorPreference: 'both',
      socialPreference: 'both',
      intensity: 'high',
    };
    const top = getRecommendedSports(regular, 5);
    expect(top.some((s) => s.tags.includes('high-intensity'))).toBe(true);
  });
});

describe('formatDistance', () => {
  it('shows metres below 1 km', () => {
    expect(formatDistance(0.42)).toBe('420 m');
  });
  it('shows one decimal kilometre at or above 1 km', () => {
    expect(formatDistance(3.456)).toBe('3.5 km');
  });
});

describe('moduleKey', () => {
  it('builds a stable composite key', () => {
    expect(moduleKey('fussball', 'anfaenger', 'b1')).toBe('fussball:anfaenger:b1');
  });
});
