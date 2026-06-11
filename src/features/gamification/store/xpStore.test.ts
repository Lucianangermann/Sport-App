import { describe, expect, it } from 'vitest';
import { calcLevel } from './xpStore';

describe('calcLevel', () => {
  it('starts a brand-new user at level 1 (Rookie)', () => {
    const info = calcLevel(0);
    expect(info.level).toBe(1);
    expect(info.levelTitle).toBe('Rookie');
    expect(info.xpProgress).toBe(0);
    expect(info.xpToNextLevel).toBe(500);
  });

  it('advances exactly one level at a band threshold', () => {
    const info = calcLevel(500);
    expect(info.level).toBe(2);
    expect(info.levelTitle).toBe('Rookie');
    expect(info.xpProgress).toBe(0);
  });

  it('reports partial progress within a level', () => {
    const info = calcLevel(750); // 250 XP into the second 500-XP level
    expect(info.level).toBe(2);
    expect(info.xpProgress).toBe(50);
    expect(info.xpToNextLevel).toBe(250);
  });

  it('crosses into the Enthusiast band after level 10', () => {
    // 10 Rookie levels * 500 XP = 5000 XP exhausts the first band.
    const info = calcLevel(5000);
    expect(info.level).toBe(11);
    expect(info.levelTitle).toBe('Enthusiast');
    expect(info.xpToNextLevel).toBe(1000);
  });

  it('caps at level 100 (Legend) for very large XP', () => {
    const info = calcLevel(10_000_000);
    expect(info.level).toBe(100);
    expect(info.levelTitle).toBe('Legend');
    expect(info.xpProgress).toBe(100);
  });

  it('never returns a level above the cap', () => {
    for (const xp of [0, 499, 5001, 50_000, 250_000, 999_999_999]) {
      expect(calcLevel(xp).level).toBeLessThanOrEqual(100);
    }
  });

  it('keeps xpToNextLevel consistent with progress', () => {
    const info = calcLevel(1234);
    // Inside the Rookie band each level spans 500 XP.
    const span = 500;
    const expectedProgress = Math.round(((span - info.xpToNextLevel) / span) * 100);
    expect(info.xpProgress).toBe(expectedProgress);
  });
});
