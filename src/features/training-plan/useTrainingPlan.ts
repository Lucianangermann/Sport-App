import { useCallback, useState } from 'react';
import { callClaudeJSON } from '../../lib/claude';
import type { SkillLevel, Sport } from '../../types';

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

const STORAGE_KEY = (sportId: string) => `training_plan_${sportId}`;
const LEVEL_DE: Record<SkillLevel, string> = {
  anfaenger: 'Anfänger',
  fortgeschritten: 'Fortgeschritten',
  profi: 'Profi',
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
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (input: PlanInput) => {
      setLoading(true);
      setError(null);
      try {
        const result = await callClaudeJSON<TrainingPlan>({
          system: `Du bist ein erfahrener ${sport.name}-Trainer. Erstelle einen detaillierten Trainingsplan auf Level ${LEVEL_DE[level]}.
Ziel: ${input.goal}, ${input.daysPerWeek} Tage/Woche, ${input.duration} Minuten pro Einheit, bevorzugte Trainingszeit: ${input.time}.

Antworte AUSSCHLIESSLICH mit JSON in genau diesem Format (keine Erklärung davor oder danach, keine Markdown-Codeblöcke):
{
  "weeks": [
    {
      "week": 1,
      "focus": "Grundlagen aufbauen",
      "days": [
        { "day": "Montag", "title": "...", "duration": 45, "intensity": "low", "exercises": ["...", "..."] }
      ]
    }
  ],
  "coachNote": "Kurze Motivation vom Coach auf Deutsch"
}

Regeln:
- Genau 4 Wochen
- Pro Woche genau ${input.daysPerWeek} Tage
- Wochentage auf Deutsch (Montag, Dienstag, …)
- intensity ist "low", "medium" oder "high"
- duration in Minuten (Zahl, ca. ${input.duration})
- 3–6 konkrete Übungen pro Tag, sportartspezifisch
- Progression über die 4 Wochen
- coachNote: 1–2 Sätze Motivation auf Deutsch`,
          messages: [
            {
              role: 'user',
              content: `Erstelle den Plan für ${sport.name} (${LEVEL_DE[level]}), Ziel ${input.goal}, ${input.daysPerWeek}× pro Woche je ${input.duration} Min ${input.time}.`,
            },
          ],
          maxTokens: 3000,
        });
        setPlan(result);
        setLastInput(input);
        savePlan(sport.id, result, input);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      } finally {
        setLoading(false);
      }
    },
    [sport, level],
  );

  const reset = useCallback(() => {
    setPlan(null);
    setLastInput(null);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY(sport.id));
    } catch {
      /* ignore */
    }
  }, [sport.id]);

  return { plan, lastInput, loading, error, generate, reset };
}
