import { useCallback, useState } from 'react';
import type { SkillLevel, Sport } from '../../types';
import { SPORT_DRILL_DB } from '../../data/sportDrills';

export type Goal = 'Abnehmen' | 'Muskelaufbau' | 'Ausdauer' | 'Spaß' | 'Wettkampf';
export type Duration = 20 | 45 | 60 | 90;
export type PreferredTime = 'Morgens' | 'Mittags' | 'Abends';
export type Intensity = 'low' | 'medium' | 'high';

export interface TrainingDay {
  day: string;
  title: string;
  duration: number;
  intensity: Intensity;
  exercises: string[];
}

export interface TrainingWeek {
  week: number;
  focus: string;
  days: TrainingDay[];
}

export interface TrainingPlan {
  weeks: TrainingWeek[];
  coachNote: string;
}

export interface PlanInput {
  daysPerWeek: number;
  duration: Duration;
  goal: Goal;
  time: PreferredTime;
}

type DayType = 'technique' | 'conditioning' | 'strength' | 'play' | 'recovery' | 'mixed' | 'long';

const STORAGE_KEY = (sportId: string) => `training_plan_${sportId}`;
const LEVEL_DE: Record<SkillLevel, string> = {
  anfaenger: 'Anfänger',
  fortgeschritten: 'Fortgeschritten',
  profi: 'Profi',
};

const WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const pickDays = (n: number): string[] => {
  const presets: Record<number, number[]> = {
    1: [0],
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 2, 4, 5],
    5: [0, 1, 3, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6],
  };
  return (presets[n] ?? presets[3]).map((i) => WEEKDAYS[i]);
};

const FOCUS_BY_GOAL: Record<Goal, string[]> = {
  Abnehmen: ['Grundlagenausdauer aufbauen', 'Volumen steigern', 'Intervalle einführen', 'Peak — Maximalverbrennung'],
  Muskelaufbau: ['Technik & Bewegungsmuster', 'Volumen aufbauen', 'Intensität steigern', 'Deload & Peak'],
  Ausdauer: ['Aerobe Basis', 'Volumen-Block', 'Tempoarbeit', 'Peak & Erholung'],
  Spaß: ['Reinkommen & Routine', 'Variation entdecken', 'Spielerische Challenge', 'Highlight-Woche'],
  Wettkampf: ['Grundlage festigen', 'Spezifische Intensität', 'Wettkampf-Simulation', 'Taper & Peak'],
};

const DAY_TYPE_LABEL: Record<DayType, string> = {
  technique: 'Technik',
  conditioning: 'Kondition',
  strength: 'Kraft & Athletik',
  play: 'Spielform',
  recovery: 'Regeneration',
  mixed: 'Gemischt',
  long: 'Volumen',
};

const DAY_TYPE_INTENSITY: Record<DayType, Intensity> = {
  technique: 'medium',
  conditioning: 'high',
  strength: 'medium',
  play: 'high',
  recovery: 'low',
  mixed: 'medium',
  long: 'medium',
};

const DAY_PATTERNS: Record<Goal, Record<number, DayType[]>> = {
  Muskelaufbau: {
    1: ['strength'],
    2: ['strength', 'strength'],
    3: ['strength', 'strength', 'technique'],
    4: ['strength', 'conditioning', 'strength', 'recovery'],
    5: ['strength', 'conditioning', 'strength', 'technique', 'recovery'],
    6: ['strength', 'conditioning', 'strength', 'technique', 'strength', 'recovery'],
    7: ['strength', 'conditioning', 'strength', 'recovery', 'strength', 'technique', 'recovery'],
  },
  Abnehmen: {
    1: ['conditioning'],
    2: ['conditioning', 'conditioning'],
    3: ['conditioning', 'strength', 'conditioning'],
    4: ['conditioning', 'strength', 'conditioning', 'recovery'],
    5: ['conditioning', 'strength', 'conditioning', 'mixed', 'recovery'],
    6: ['conditioning', 'strength', 'conditioning', 'mixed', 'long', 'recovery'],
    7: ['conditioning', 'strength', 'conditioning', 'mixed', 'long', 'strength', 'recovery'],
  },
  Ausdauer: {
    1: ['long'],
    2: ['conditioning', 'long'],
    3: ['conditioning', 'technique', 'long'],
    4: ['conditioning', 'technique', 'strength', 'long'],
    5: ['conditioning', 'technique', 'strength', 'recovery', 'long'],
    6: ['conditioning', 'technique', 'conditioning', 'strength', 'recovery', 'long'],
    7: ['conditioning', 'technique', 'conditioning', 'strength', 'recovery', 'long', 'recovery'],
  },
  Spaß: {
    1: ['play'],
    2: ['play', 'mixed'],
    3: ['play', 'technique', 'mixed'],
    4: ['play', 'technique', 'mixed', 'play'],
    5: ['play', 'technique', 'conditioning', 'mixed', 'play'],
    6: ['play', 'technique', 'conditioning', 'mixed', 'play', 'recovery'],
    7: ['play', 'technique', 'conditioning', 'mixed', 'play', 'strength', 'recovery'],
  },
  Wettkampf: {
    1: ['play'],
    2: ['technique', 'play'],
    3: ['technique', 'conditioning', 'play'],
    4: ['technique', 'conditioning', 'strength', 'play'],
    5: ['technique', 'conditioning', 'strength', 'play', 'recovery'],
    6: ['technique', 'conditioning', 'strength', 'play', 'technique', 'recovery'],
    7: ['technique', 'conditioning', 'strength', 'play', 'technique', 'conditioning', 'recovery'],
  },
};

/** Sport-agnostic warm-ups, scaled by intensity. */
const WARMUP_BY_INTENSITY: Record<Intensity, string[]> = {
  low: [
    'Sanfte Mobilisation 8 Min (Atmung, Schultern, Hüfte)',
    'Lockerer Spaziergang 10 Min',
    'Cat-Cow + Hüftöffner-Flow 8 Min',
    'Yoga-Sun-Salutation-Sequenz 10 Min',
  ],
  medium: [
    'Dynamische Mobilisation 8 Min + Lauf-ABC 6×20 m',
    'Aktivierung Beinkette 6 Min + Sprungvariation 3×10',
    'Hip-Mobility-Flow 5 Min + 5 Min lockeres Cardio',
    'Schultern + Wirbelsäule mobilisieren 7 Min + Aktivierungs-Sprünge 4×10',
    "World's Greatest Stretch 4×/Seite + Lockeres Einlaufen 5 Min",
  ],
  high: [
    'Progressives Warm-up 12 Min + Sprintsteigerungen 4×60 m',
    'RAMP-Protokoll 10 Min + Plyo-Aktivierung 3×8',
    'Dynamic Stretch 6 Min + Sprint-Drill 4×40 m',
    'Mobility + Cardio-Boost 8 Min + Reaktions-Drill 3×30 Sek',
    'Aktivierungssatz 6 Min + Sprung-ABC 4 Übungen',
  ],
};

/** Recovery-day options — sport-agnostic, low intensity. */
const RECOVERY_POOL = [
  'Foam-Rolling Beinrückseite & Quadrizeps 10 Min',
  'Yoga-Flow für Hüfte & Rücken 15 Min',
  'Stretching Brust & Schultern 10 Min',
  'Atemarbeit Box-Breathing 8 Min',
  'Spaziergang locker 30 Min',
  'Mobility-Routine Wirbelsäule 12 Min',
  'Lockeres Schwimmen 20 Min',
  'Yin-Yoga 20 Min',
];

const COOLDOWN_POOL = [
  '5 Min lockeres Auslaufen',
  'Statisches Stretching 8 Min',
  'Mobility-Cool-down 6 Min',
  'Atemberuhigung 4 Min',
  'Foam-Rolling 8 Min',
];

const DAY_HINTS: Record<DayType, string[]> = {
  technique: [
    'Heute Tempo runter — Saubere Technik schlägt Geschwindigkeit.',
    'Filme dich kurz mit dem Handy und vergleiche mit einem Pro-Clip.',
    'Achte auf jedes Detail — Wiederholung mit Fokus macht den Unterschied.',
  ],
  conditioning: [
    'Bei den Intervallen wirklich pushen — die Pause ist die Belohnung.',
    'Atmung in der Pause kontrollieren, nicht durch die Belastung hetzen.',
    'Gefühlsskala 7-8/10 in den harten Phasen, sonst zu früh leer.',
  ],
  strength: [
    'Technik vor Gewicht — auch wenn der Kollege mehr drauf hat.',
    'Letzte 2 Wiederholungen sollten richtig anstrengend sein.',
    '60-90 Sek Pause zwischen Sätzen, das ist Teil des Trainings.',
  ],
  play: [
    'Heute Spielform-Fokus: aus Fehlern lernen, weniger über Ergebnis.',
    'Wenn möglich mit besseren Partnern — du lernst am meisten dort.',
    'Sprich mit deinem Trainer/Team — Feedback ist Gold wert.',
  ],
  recovery: [
    'Keine Leistung heute — Schlaf, Wasser und Bewegung sind das Training.',
    'Höre auf deinen Körper, weniger ist heute mehr.',
    'Mobility-Tag heißt: zwischendurch lange dehnen, nicht hetzen.',
  ],
  mixed: [
    'Kombi-Tag: leicht starten, dann steigern, am Ende auslaufen.',
    'Wechsel zwischen Belastungsformen hält den Körper wach.',
    'Heute geht es um Vielfalt — keine Übung dominiert.',
  ],
  long: [
    'Lang heißt: locker beginnen, durchziehen, nicht überdrehen.',
    'Trink- und Snack-Strategie im Voraus klären.',
    'Mentale Ausdauer ist heute genauso wichtig wie körperliche.',
  ],
};

const intensityForDay = (dayType: DayType, week: number, goal: Goal): Intensity => {
  const base = DAY_TYPE_INTENSITY[dayType];
  if (week === 4) {
    if (goal === 'Muskelaufbau' || goal === 'Wettkampf') {
      if (base === 'high') return 'medium';
      if (base === 'medium') return 'low';
    } else if (base === 'medium') return 'high';
  }
  if (week === 1 && base === 'high' && goal !== 'Wettkampf') return 'medium';
  return base;
};

const titleForDay = (sport: Sport, dayType: DayType) => `${DAY_TYPE_LABEL[dayType]} · ${sport.name}`;

const seededPick = <T,>(arr: T[], seed: number): T => arr[((seed % arr.length) + arr.length) % arr.length];

/** Pick N distinct items from arr (cycling if N > arr.length, but offset stride avoids 1-step repeats). */
const seededPickN = <T,>(arr: T[], n: number, seed: number): T[] => {
  if (!arr.length) return [];
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    result.push(arr[((seed + i * 3) % arr.length + arr.length) % arr.length]);
  }
  return result;
};

interface BuildDayArgs {
  sport: Sport;
  level: SkillLevel;
  dayType: DayType;
  week: number;
  dayIdxInWeek: number;
  duration: Duration;
  goal: Goal;
}

const drillsForCategory = (
  sportId: string,
  level: SkillLevel,
  category: 'technique' | 'conditioning' | 'strength' | 'play' | 'long',
): string[] => {
  const pool = SPORT_DRILL_DB[sportId]?.[level];
  return pool ? pool[category] ?? [] : [];
};

const buildDay = ({ sport, level, dayType, week, dayIdxInWeek, duration, goal }: BuildDayArgs): TrainingDay => {
  const intensity = intensityForDay(dayType, week, goal);
  const seed = week * 7 + dayIdxInWeek + dayType.length;
  const warmup = seededPick(WARMUP_BY_INTENSITY[intensity], seed);
  const cooldown = seededPick(COOLDOWN_POOL, seed + 1);
  const hint = seededPick(DAY_HINTS[dayType], seed + 2);

  const mainCount = duration <= 20 ? 2 : duration <= 45 ? 3 : duration <= 60 ? 4 : 5;
  const main: string[] = [];

  switch (dayType) {
    case 'technique':
      main.push(...seededPickN(drillsForCategory(sport.id, level, 'technique'), mainCount, seed));
      break;
    case 'play': {
      const playPool = drillsForCategory(sport.id, level, 'play');
      const techPool = drillsForCategory(sport.id, level, 'technique');
      if (playPool.length) main.push(...seededPickN(playPool, Math.min(mainCount, 3), seed));
      while (main.length < mainCount && techPool.length) {
        main.push(seededPick(techPool, seed + main.length + 5));
      }
      break;
    }
    case 'conditioning':
      main.push(...seededPickN(drillsForCategory(sport.id, level, 'conditioning'), mainCount, seed));
      break;
    case 'strength':
      main.push(...seededPickN(drillsForCategory(sport.id, level, 'strength'), mainCount, seed));
      break;
    case 'recovery':
      main.push(...seededPickN(RECOVERY_POOL, mainCount, seed));
      break;
    case 'mixed': {
      const tech = drillsForCategory(sport.id, level, 'technique');
      const cond = drillsForCategory(sport.id, level, 'conditioning');
      const str = drillsForCategory(sport.id, level, 'strength');
      if (tech.length) main.push(seededPick(tech, seed));
      if (cond.length) main.push(seededPick(cond, seed + 1));
      if (mainCount >= 3 && str.length) main.push(seededPick(str, seed + 2));
      let fallback = 3;
      while (main.length < mainCount) {
        const pools = [tech, cond, str].filter((p) => p.length);
        if (!pools.length) break;
        const p = pools[fallback % pools.length];
        main.push(seededPick(p, seed + main.length + fallback));
        fallback++;
      }
      break;
    }
    case 'long': {
      const longPool = drillsForCategory(sport.id, level, 'long');
      const tech = drillsForCategory(sport.id, level, 'technique');
      const cond = drillsForCategory(sport.id, level, 'conditioning');
      if (longPool.length) main.push(seededPick(longPool, seed));
      else if (cond.length) main.push(seededPick(cond, seed));
      else if (tech.length) main.push(seededPick(tech, seed));
      if (mainCount >= 3) {
        if (cond.length) main.push(seededPick(cond, seed + 1));
        if (tech.length && main.length < mainCount) main.push(seededPick(tech, seed + 2));
      }
      while (main.length < mainCount && tech.length) {
        main.push(seededPick(tech, seed + main.length + 7));
      }
      break;
    }
  }

  // Dedup
  const seen = new Set<string>();
  const uniqueMain = main.filter((m) => {
    if (seen.has(m)) return false;
    seen.add(m);
    return true;
  });

  // Fallback if a sport has empty pools for everything (shouldn't happen with the new DB)
  if (uniqueMain.length === 0) {
    uniqueMain.push(`${sport.name}-Einheit ${duration} Min nach individueller Auswahl`);
  }

  const exercises = ['Warm-up: ' + warmup, ...uniqueMain, 'Cool-down: ' + cooldown, `💡 ${hint}`];

  return {
    day: WEEKDAYS[0],
    title: titleForDay(sport, dayType),
    duration,
    intensity,
    exercises,
  };
};

const buildTemplatePlan = (sport: Sport, level: SkillLevel, input: PlanInput): TrainingPlan => {
  const dayNames = pickDays(input.daysPerWeek);
  const basePattern =
    DAY_PATTERNS[input.goal]?.[input.daysPerWeek] ?? DAY_PATTERNS[input.goal]?.[3] ?? ['technique', 'conditioning', 'recovery'];

  const weeks: TrainingWeek[] = [];
  for (let w = 1; w <= 4; w++) {
    const offset = (w - 1) % basePattern.length;
    const rotated = [...basePattern.slice(offset), ...basePattern.slice(0, offset)];

    const days: TrainingDay[] = dayNames.map((dayName, idx) => {
      const dayType = rotated[idx] ?? basePattern[idx % basePattern.length] ?? 'technique';
      const day = buildDay({
        sport,
        level,
        dayType,
        week: w,
        dayIdxInWeek: idx,
        duration: input.duration,
        goal: input.goal,
      });
      return { ...day, day: dayName };
    });

    weeks.push({ week: w, focus: FOCUS_BY_GOAL[input.goal][w - 1], days });
  }

  const hasSportData = !!SPORT_DRILL_DB[sport.id];
  const coachNote = (() => {
    const base = `4 Wochen ${sport.name} mit Fokus ${input.goal.toLowerCase()}, ${input.daysPerWeek}× pro Woche je ${input.duration} Min auf Level ${LEVEL_DE[level]}.`;
    const sportNote = hasSportData
      ? `Übungen sind sportartspezifisch aus einem ${sport.name}-Drill-Pool und rotieren über die 4 Wochen.`
      : 'Übungen sind allgemein gehalten — wir bauen die Drill-Datenbank für diese Sportart noch aus.';
    const time =
      input.time === 'Morgens'
        ? 'Morgens trainiert es sich nüchtern besonders fokussiert — leichtes Frühstück danach.'
        : input.time === 'Mittags'
          ? 'Mittagseinheiten geben den ganzen Nachmittag Energie — gute Mahlzeiten-Abstände beachten.'
          : 'Abends ist Stress raus — gib dem Körper Zeit zum Runterfahren.';
    return `${base} ${sportNote} ${time}`;
  })();

  return { weeks, coachNote };
};

const loadPlan = (sportId: string): { plan: TrainingPlan; input: PlanInput } | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(sportId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const savePlan = (sportId: string, plan: TrainingPlan, input: PlanInput) => {
  try {
    localStorage.setItem(STORAGE_KEY(sportId), JSON.stringify({ plan, input }));
  } catch {
    /* ignore */
  }
};

interface UseTrainingPlanArgs {
  sport: Sport;
  level: SkillLevel;
}

export function useTrainingPlan({ sport, level }: UseTrainingPlanArgs) {
  const stored = loadPlan(sport.id);
  const [plan, setPlan] = useState<TrainingPlan | null>(stored?.plan ?? null);
  const [lastInput, setLastInput] = useState<PlanInput | null>(stored?.input ?? null);
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const generate = useCallback(
    async (input: PlanInput) => {
      setLoading(true);
      await new Promise((r) => window.setTimeout(r, 600));
      const result = buildTemplatePlan(sport, level, input);
      setPlan(result);
      setLastInput(input);
      savePlan(sport.id, result, input);
      setLoading(false);
    },
    [sport, level],
  );

  const reset = useCallback(() => {
    setPlan(null);
    setLastInput(null);
    try {
      localStorage.removeItem(STORAGE_KEY(sport.id));
    } catch {
      /* ignore */
    }
  }, [sport.id]);

  return { plan, lastInput, loading, error, generate, reset };
}
