import { useCallback, useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getSportById } from '../../utils/helpers';
import { useXpStore, XP_SOURCES } from '../gamification/store/xpStore';

export interface InsightCard {
  icon: string;
  title: string;
  text: string;
}

interface CachedInsights {
  generatedAtISO: string;
  isoWeek: string;
  insights: InsightCard[];
}

const CACHE_KEY = 'weekly_insights_v2';

const isoWeek = (d: Date): string => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
};

const loadCache = (): CachedInsights | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CachedInsights) : null;
  } catch {
    return null;
  }
};

const saveCache = (data: CachedInsights) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
};

interface WeeklyStats {
  modulesThisWeek: number;
  activeDaysThisWeek: number;
  sportsThisWeek: string[];
  totalCompleted: number;
  streak: number;
  level: number;
  nextLevelThreshold: number;
  xp: number;
  modulesLastWeek: number;
}

const buildStats = (
  progress: Record<string, { completedAt: string }>,
  streak: number,
  xp: number,
  level: number,
  nextLevelThreshold: number,
): WeeklyStats => {
  const now = new Date();
  const day = (now.getDay() + 6) % 7;
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - day);
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  let modulesThisWeek = 0;
  let modulesLastWeek = 0;
  const activeDays = new Set<string>();
  const sports = new Set<string>();

  for (const [key, entry] of Object.entries(progress)) {
    const completed = new Date(entry.completedAt);
    if (completed >= startOfWeek) {
      modulesThisWeek++;
      activeDays.add(completed.toISOString().slice(0, 10));
      const sportId = key.split(':')[0];
      const sport = getSportById(sportId);
      if (sport) sports.add(sport.name);
    } else if (completed >= startOfLastWeek) {
      modulesLastWeek++;
    }
  }

  return {
    modulesThisWeek,
    activeDaysThisWeek: activeDays.size,
    sportsThisWeek: Array.from(sports),
    totalCompleted: Object.keys(progress).length,
    streak,
    level,
    nextLevelThreshold,
    xp,
    modulesLastWeek,
  };
};

const buildPrognose = (stats: WeeklyStats): InsightCard => {
  const { xp, level, nextLevelThreshold, modulesThisWeek } = stats;
  const xpToNext = Math.max(1, nextLevelThreshold - xp);
  const modulesNeeded = Math.ceil(xpToNext / XP_SOURCES.COMPLETE_MODULE);
  if (modulesThisWeek === 0) {
    return {
      icon: '🎯',
      title: 'Prognose',
      text: `Schließe ${modulesNeeded} Module ab, um Level ${level + 1} zu erreichen.`,
    };
  }
  const weeksNeeded = Math.max(1, Math.ceil(modulesNeeded / modulesThisWeek));
  return {
    icon: '🎯',
    title: 'Prognose',
    text: `Bei diesem Tempo erreichst du Level ${level + 1} in ${weeksNeeded} Woche${weeksNeeded > 1 ? 'n' : ''}.`,
  };
};

const buildVolumeInsight = (stats: WeeklyStats): InsightCard => {
  const { modulesThisWeek, modulesLastWeek } = stats;
  if (modulesThisWeek === 0 && modulesLastWeek === 0) {
    return { icon: '🚀', title: 'Volumen', text: 'Du hast diese Woche noch nicht trainiert — eine kurze Einheit reicht für den Einstieg.' };
  }
  if (modulesThisWeek === 0) {
    return { icon: '⏱️', title: 'Volumen', text: `Letzte Woche hast du ${modulesLastWeek} Modul${modulesLastWeek === 1 ? '' : 'e'} geschafft — hol dir den Rhythmus zurück.` };
  }
  if (modulesLastWeek === 0) {
    return { icon: '🔥', title: 'Volumen', text: `${modulesThisWeek} Modul${modulesThisWeek === 1 ? '' : 'e'} diese Woche — starker Wiedereinstieg.` };
  }
  const diff = modulesThisWeek - modulesLastWeek;
  if (diff > 0) {
    return { icon: '📈', title: 'Volumen', text: `+${diff} Modul${diff === 1 ? '' : 'e'} gegenüber letzter Woche — du legst zu.` };
  }
  if (diff < 0) {
    return { icon: '🪫', title: 'Volumen', text: `${Math.abs(diff)} Modul${Math.abs(diff) === 1 ? '' : 'e'} weniger als letzte Woche — kein Problem, dranbleiben.` };
  }
  return { icon: '⚖️', title: 'Volumen', text: `Gleiche Anzahl wie letzte Woche — Konstanz ist wertvoll.` };
};

const buildDiversityInsight = (stats: WeeklyStats): InsightCard => {
  const n = stats.sportsThisWeek.length;
  if (n === 0) {
    return { icon: '🎨', title: 'Vielfalt', text: 'Wenn du startest: 1–2 Sportarten parallel sind ein guter Mix.' };
  }
  if (n === 1) {
    return { icon: '🎯', title: 'Vielfalt', text: `Fokus auf ${stats.sportsThisWeek[0]} — Spezialisierung bringt schnelle Fortschritte.` };
  }
  if (n === 2) {
    return { icon: '🔀', title: 'Vielfalt', text: `Schöner Mix aus ${stats.sportsThisWeek.join(' & ')} — komplementäre Reize.` };
  }
  return { icon: '🌈', title: 'Vielfalt', text: `${n} verschiedene Sportarten — breit aufgestellt, achte aber auf Tiefe in 1–2.` };
};

const buildStreakInsight = (stats: WeeklyStats): InsightCard => {
  const { streak, activeDaysThisWeek } = stats;
  if (streak >= 7) {
    return { icon: '🔥', title: 'Streak', text: `${streak} Tage in Folge aktiv — beeindruckende Disziplin.` };
  }
  if (streak >= 3) {
    return { icon: '⚡️', title: 'Streak', text: `${streak} Tage Streak — noch ${7 - streak} Tag${7 - streak === 1 ? '' : 'e'} bis zum Wochen-Badge.` };
  }
  if (activeDaysThisWeek >= 3) {
    return { icon: '💪', title: 'Aktive Tage', text: `${activeDaysThisWeek} Tage aktiv diese Woche — solide Grundlage.` };
  }
  return { icon: '🌱', title: 'Konsistenz', text: 'Kurze tägliche Einheiten bauen schneller Routine als seltene lange.' };
};

export function useInsights() {
  const progress = useAppStore((s) => s.progress);
  const streakDays = useAppStore((s) => s.profile.streakDays);
  const xp = useXpStore((s) => s.xp);
  const level = useXpStore((s) => s.level);
  const xpToNextLevel = useXpStore((s) => s.xpToNextLevel);
  // Rehydrate this week's cached insight cards once, lazily, on first render.
  const [insights, setInsights] = useState<InsightCard[]>(() => {
    const cached = loadCache();
    return cached && cached.isoWeek === isoWeek(new Date()) ? cached.insights : [];
  });
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Stats and the prognosis are pure derivations of the user's progress and
  // XP — memoize them rather than mirroring into state inside an effect.
  const stats = useMemo(
    () => buildStats(progress, streakDays, xp, level, xp + xpToNextLevel),
    [progress, streakDays, xp, level, xpToNextLevel],
  );
  const prognose = useMemo(() => buildPrognose(stats), [stats]);

  const generate = useCallback(async () => {
    if (!stats) return;
    setLoading(true);
    await new Promise((r) => window.setTimeout(r, 400));
    const list: InsightCard[] = [
      buildVolumeInsight(stats),
      buildDiversityInsight(stats),
      buildStreakInsight(stats),
    ];
    setInsights(list);
    saveCache({ generatedAtISO: new Date().toISOString(), isoWeek: isoWeek(new Date()), insights: list });
    setLoading(false);
  }, [stats]);

  return { insights, prognose, stats, loading, error, generate };
}
