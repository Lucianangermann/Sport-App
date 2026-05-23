import { useCallback, useEffect, useState } from 'react';
import { callClaudeJSON } from '../../lib/claude';
import { useAppStore } from '../../store/useAppStore';
import { getSportById, xpForLevel } from '../../utils/helpers';

export interface InsightCard {
  icon: string;
  title: string;
  text: string;
}

interface CachedInsights {
  generatedAtISO: string;
  isoWeek: string; // YYYY-Www
  insights: InsightCard[];
}

const CACHE_KEY = 'weekly_insights_v1';

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
}

const buildStats = (
  progress: Record<string, { completedAt: string }>,
  streak: number,
  xp: number,
): WeeklyStats => {
  const now = new Date();
  // Start of current ISO week (Monday)
  const day = (now.getDay() + 6) % 7; // Mon = 0
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - day);

  let modulesThisWeek = 0;
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
    }
  }

  const { level, nextThreshold } = xpForLevel(xp);

  return {
    modulesThisWeek,
    activeDaysThisWeek: activeDays.size,
    sportsThisWeek: Array.from(sports),
    totalCompleted: Object.keys(progress).length,
    streak,
    level,
    nextLevelThreshold: nextThreshold,
    xp,
  };
};

/** Static prognose card based on completion rate. */
const buildPrognose = (stats: WeeklyStats): InsightCard => {
  const { xp, level, nextLevelThreshold, modulesThisWeek } = stats;
  const xpToNext = Math.max(1, nextLevelThreshold - xp);
  // Each completed module gives 25 XP.
  const modulesNeeded = Math.ceil(xpToNext / 25);
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

export function useInsights() {
  const progress = useAppStore((s) => s.progress);
  const profile = useAppStore((s) => s.profile);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [prognose, setPrognose] = useState<InsightCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<WeeklyStats | null>(null);

  // Compute stats + prognose on mount / when data changes.
  useEffect(() => {
    const s = buildStats(progress, profile.streakDays, profile.xp);
    setStats(s);
    setPrognose(buildPrognose(s));

    // Load cached insights if same ISO week
    const cached = loadCache();
    if (cached && cached.isoWeek === isoWeek(new Date())) {
      setInsights(cached.insights);
    }
  }, [progress, profile.streakDays, profile.xp]);

  const generate = useCallback(async () => {
    if (!stats) return;
    setLoading(true);
    setError(null);
    try {
      const prompt = `Trainingsdaten der aktuellen Woche:
- Abgeschlossene Module: ${stats.modulesThisWeek}
- Aktive Trainingstage: ${stats.activeDaysThisWeek}
- Trainierte Sportarten: ${stats.sportsThisWeek.join(', ') || 'noch keine'}
- Streak: ${stats.streak} Tage
- Level: ${stats.level} (${stats.xp} XP)
- Gesamt abgeschlossen: ${stats.totalCompleted} Module`;

      const result = await callClaudeJSON<InsightCard[]>({
        system:
          'Analysiere die Trainingsdaten und gib 3 kurze Insights auf Deutsch. Antworte ausschließlich als JSON-Array: [{ "icon": "🔥", "title": "...", "text": "..." }, ... 3 Einträge]. Jeder text max. 1 Satz, motivierend und konkret. Nutze passende Emoji für icon. Keine Erklärung davor oder danach.',
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 512,
      });

      const list = Array.isArray(result) ? result.slice(0, 3) : [];
      setInsights(list);
      saveCache({ generatedAtISO: new Date().toISOString(), isoWeek: isoWeek(new Date()), insights: list });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, [stats]);

  return { insights, prognose, stats, loading, error, generate };
}
