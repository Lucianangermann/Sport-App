import { useCallback, useState } from 'react';
import { SPORTS } from '../../data/sports';
import type { Sport, SportTag } from '../../types';

export interface QuizQuestion {
  question: string;
  options: string[];
  /** Each option maps to a set of tags / score boosters */
  optionTags?: Array<Partial<Record<string, number>>>;
}

export interface QuizAnswer {
  question: string;
  answer: string;
  optionIndex: number;
  tags?: Partial<Record<string, number>>;
}

export interface QuizRecommendation {
  sport: string;
  match: number;
  reason: string;
}

export type QuizStep = 'intro' | 'questions' | 'loading' | 'results' | 'error';

/** Static base questions — always asked. */
const STATIC_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Trainierst du lieber alleine oder im Team?',
    options: ['Alleine', 'Im Team', 'Beides'],
    optionTags: [{ solo: 3 }, { team: 3 }, { solo: 1, team: 1 }],
  },
  {
    question: 'Indoor oder Outdoor?',
    options: ['Indoor', 'Outdoor', 'Egal'],
    optionTags: [{ indoor: 3 }, { outdoor: 3 }, { indoor: 1, outdoor: 1 }],
  },
  {
    question: 'Wie intensiv magst du es?',
    options: ['Entspannt', 'Moderat', 'Sehr intensiv'],
    optionTags: [{ 'low-intensity': 3 }, { 'low-intensity': 1, 'high-intensity': 1 }, { 'high-intensity': 3 }],
  },
];

/** Pool of follow-up questions — pick 5 deterministically based on prior answers. */
const DYNAMIC_POOL: QuizQuestion[] = [
  {
    question: 'Wie viel Equipment bist du bereit anzuschaffen?',
    options: ['Möglichst wenig', 'Mittelmäßig', 'Viel — auch teures'],
    optionTags: [{ low_equipment: 3 }, { mid_equipment: 2 }, { high_equipment: 3 }],
  },
  {
    question: 'Möchtest du an Wettkämpfen teilnehmen?',
    options: ['Auf keinen Fall', 'Vielleicht', 'Unbedingt'],
    optionTags: [{ casual: 3 }, { mid_competitive: 2 }, { competitive: 3 }],
  },
  {
    question: 'Was ist dein Haupt-Ziel?',
    options: ['Abnehmen', 'Muskelaufbau', 'Beweglichkeit & Entspannung', 'Spaß & Geselligkeit'],
    optionTags: [
      { 'high-intensity': 2, endurance: 2 },
      { strength: 3, 'high-intensity': 1 },
      { 'low-intensity': 3, flexibility: 3 },
      { team: 2, social: 3 },
    ],
  },
  {
    question: 'Wie viel Zeit hast du pro Trainings-Einheit?',
    options: ['< 30 Min', '30–60 Min', 'Über 60 Min'],
    optionTags: [{ short: 3 }, { medium: 2 }, { long: 3 }],
  },
  {
    question: 'Wie risikofreudig bist du?',
    options: ['Eher vorsichtig', 'Neugierig', 'Adrenalin-Junkie'],
    optionTags: [{ safe: 2 }, { 'high-intensity': 1 }, { extreme: 3, 'high-intensity': 2 }],
  },
  {
    question: 'Magst du Musik beim Training?',
    options: ['Ohne Musik', 'Mit Musik im Hintergrund', 'Musik ist Teil des Sports'],
    optionTags: [{}, {}, { dance: 3 }],
  },
  {
    question: 'Wie wichtig ist dir die soziale Komponente?',
    options: ['Unwichtig', 'Nice to have', 'Sehr wichtig'],
    optionTags: [{ solo: 2 }, { solo: 1, team: 1 }, { team: 3, social: 2 }],
  },
  {
    question: 'Welche Disziplin spricht dich am meisten an?',
    options: ['Schnelligkeit', 'Kraft', 'Ausdauer', 'Geschicklichkeit'],
    optionTags: [
      { speed: 3, 'high-intensity': 1 },
      { strength: 3 },
      { endurance: 3 },
      { skill: 3 },
    ],
  },
  {
    question: 'Wie sehr willst du an deine Grenzen gehen?',
    options: ['Nicht so weit', 'Gelegentlich', 'Immer wieder'],
    optionTags: [{ 'low-intensity': 2 }, { 'high-intensity': 1 }, { 'high-intensity': 3, competitive: 1 }],
  },
  {
    question: 'Welche Saison passt am besten zu dir?',
    options: ['Sommer & Sonne', 'Winter & Schnee', 'Ganzjährig drinnen'],
    optionTags: [{ outdoor: 2 }, { winter: 3 }, { indoor: 3 }],
  },
  {
    question: 'Wie verträgst du Gelenkbelastung?',
    options: ['Eher empfindlich', 'Normal', 'Sehr robust'],
    optionTags: [{ 'low-impact': 3 }, {}, { 'high-impact': 1 }],
  },
];

const TOTAL_QUESTIONS = 8;

/** Sport metadata for scoring — extends the basic tags from sports.ts. */
const SPORT_PROFILE: Record<
  string,
  {
    extra: Array<keyof typeof SCORE_KEYS>;
  }
> = {
  fussball: { extra: ['endurance', 'social', 'mid_competitive', 'casual'] },
  basketball: { extra: ['speed', 'social', 'mid_competitive'] },
  tennis: { extra: ['speed', 'skill', 'mid_competitive'] },
  schwimmen: { extra: ['endurance', 'low-impact'] },
  klettern: { extra: ['strength', 'skill', 'extreme', 'mid_equipment'] },
  yoga: { extra: ['flexibility', 'low-impact', 'low_equipment'] },
  boxen: { extra: ['strength', 'speed', 'mid_competitive'] },
  laufen: { extra: ['endurance', 'low_equipment', 'short'] },
  radfahren: { extra: ['endurance', 'high_equipment', 'long'] },
  volleyball: { extra: ['social', 'skill'] },
  handball: { extra: ['speed', 'social', 'mid_competitive'] },
  judo: { extra: ['strength', 'skill', 'competitive'] },
  karate: { extra: ['skill', 'mid_competitive'] },
  kickboxen: { extra: ['strength', 'speed'] },
  badminton: { extra: ['speed', 'skill', 'mid_equipment'] },
  tischtennis: { extra: ['speed', 'skill', 'short'] },
  squash: { extra: ['speed', 'endurance'] },
  rudern: { extra: ['endurance', 'strength', 'high_equipment'] },
  segeln: { extra: ['skill', 'high_equipment'] },
  surfen: { extra: ['skill', 'extreme'] },
  krafttraining: { extra: ['strength', 'high_equipment'] },
  crossfit: { extra: ['strength', 'endurance', 'competitive'] },
  pilates: { extra: ['flexibility', 'low-impact', 'low_equipment'] },
  wandern: { extra: ['endurance', 'low_equipment', 'long', 'low-impact'] },
  mountainbike: { extra: ['endurance', 'extreme', 'high_equipment'] },
  ski: { extra: ['winter', 'skill', 'extreme', 'high_equipment'] },
  snowboard: { extra: ['winter', 'extreme', 'high_equipment'] },
  eishockey: { extra: ['winter', 'speed', 'team', 'competitive', 'high_equipment'] },
  tanzen: { extra: ['dance', 'flexibility', 'social', 'low-impact'] },
  parkour: { extra: ['extreme', 'skill', 'speed', 'low_equipment'] },
  reiten: { extra: ['skill', 'high_equipment'] },
  golf: { extra: ['skill', 'long', 'mid_equipment'] },
};

/** All scoring keys for type-safety. */
const SCORE_KEYS = {
  solo: 0,
  team: 0,
  indoor: 0,
  outdoor: 0,
  'low-intensity': 0,
  'high-intensity': 0,
  low_equipment: 0,
  mid_equipment: 0,
  high_equipment: 0,
  casual: 0,
  mid_competitive: 0,
  competitive: 0,
  endurance: 0,
  strength: 0,
  flexibility: 0,
  social: 0,
  short: 0,
  medium: 0,
  long: 0,
  safe: 0,
  extreme: 0,
  dance: 0,
  speed: 0,
  skill: 0,
  winter: 0,
  'low-impact': 0,
  'high-impact': 0,
} as const;
type ScoreKey = keyof typeof SCORE_KEYS;

/** Pick the next dynamic question deterministically based on which tags haven't been explored. */
const pickNextDynamicQuestion = (
  pool: QuizQuestion[],
  used: Set<string>,
  scores: Record<string, number>,
): QuizQuestion | null => {
  const remaining = pool.filter((q) => !used.has(q.question));
  if (!remaining.length) return null;
  // Prefer questions whose tags haven't been hit much yet.
  let best = remaining[0];
  let bestScore = Infinity;
  for (const q of remaining) {
    const novelty = (q.optionTags ?? []).reduce((acc, tagSet) => {
      const sum = Object.keys(tagSet).reduce((s, k) => s + (scores[k] ?? 0), 0);
      return acc + sum;
    }, 0);
    if (novelty < bestScore) {
      bestScore = novelty;
      best = q;
    }
  }
  return best;
};

const buildReason = (sport: Sport, scores: Record<string, number>): string => {
  const reasons: string[] = [];
  if (scores.outdoor >= 3 && sport.tags.includes('outdoor')) reasons.push('passt zu deiner Outdoor-Vorliebe');
  if (scores.indoor >= 3 && sport.tags.includes('indoor')) reasons.push('passt zu deiner Indoor-Vorliebe');
  if (scores.solo >= 3 && sport.tags.includes('solo')) reasons.push('ideal für Solo-Training');
  if (scores.team >= 3 && sport.tags.includes('team')) reasons.push('starker Teamsport');
  if (scores['high-intensity'] >= 3 && sport.tags.includes('high-intensity'))
    reasons.push('liefert die Intensität, die du suchst');
  if (scores['low-intensity'] >= 3 && sport.tags.includes('low-intensity')) reasons.push('entspannt und gelenkschonend');
  const profile = SPORT_PROFILE[sport.id]?.extra ?? [];
  if (scores.endurance >= 2 && profile.includes('endurance')) reasons.push('top für Ausdauer');
  if (scores.strength >= 2 && profile.includes('strength')) reasons.push('baut Kraft auf');
  if (scores.flexibility >= 2 && profile.includes('flexibility')) reasons.push('verbessert Beweglichkeit');
  if (scores.social >= 2 && profile.includes('social')) reasons.push('viel Kontakt zu anderen');
  if (scores.extreme >= 2 && profile.includes('extreme')) reasons.push('liefert Adrenalin');
  if (scores.winter >= 2 && profile.includes('winter')) reasons.push('perfekt für die kalte Saison');
  if (scores.dance >= 2 && profile.includes('dance')) reasons.push('mit Musik & Rhythmus');
  if (!reasons.length) reasons.push('passt grundsätzlich zu deinen Antworten');
  return reasons.slice(0, 2).join(', ') + '.';
};

const scoreSports = (answers: QuizAnswer[]): QuizRecommendation[] => {
  const scores: Record<string, number> = {};
  for (const a of answers) {
    if (!a.tags) continue;
    for (const [k, v] of Object.entries(a.tags)) {
      scores[k] = (scores[k] ?? 0) + (v ?? 0);
    }
  }

  const ranked = SPORTS.map((sport) => {
    let raw = sport.popularity * 0.1; // small baseline so popular sports edge ties
    for (const tag of sport.tags as SportTag[]) {
      raw += (scores[tag] ?? 0) * 2;
    }
    const extras = SPORT_PROFILE[sport.id]?.extra ?? [];
    for (const e of extras) {
      raw += (scores[e] ?? 0) * 1.5;
    }
    return { sport, raw };
  }).sort((a, b) => b.raw - a.raw);

  const top = ranked.slice(0, 5);
  const maxRaw = top[0]?.raw ?? 1;
  return top.map(({ sport, raw }) => ({
    sport: sport.name,
    match: Math.max(60, Math.min(99, Math.round((raw / Math.max(1, maxRaw)) * 99))),
    reason: buildReason(sport, scores),
  }));
};

export function useQuiz() {
  const [step, setStep] = useState<QuizStep>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [recommendations, setRecommendations] = useState<QuizRecommendation[]>([]);
  const [error] = useState<string | null>(null);

  const start = useCallback(() => {
    setStep('questions');
    setCurrentIdx(0);
    setCurrentQuestion(STATIC_QUESTIONS[0]);
    setAnswers([]);
    setRecommendations([]);
  }, []);

  const submitAnswer = useCallback(
    (answer: string) => {
      if (!currentQuestion) return;
      const optionIndex = currentQuestion.options.indexOf(answer);
      const tags = currentQuestion.optionTags?.[optionIndex] ?? {};
      const newAnswer: QuizAnswer = { question: currentQuestion.question, answer, optionIndex, tags };
      const next = [...answers, newAnswer];
      setAnswers(next);

      const nextIdx = currentIdx + 1;
      if (nextIdx >= TOTAL_QUESTIONS) {
        setStep('loading');
        // Small artificial delay so the user gets to read "Wir analysieren…"
        window.setTimeout(() => {
          const recs = scoreSports(next);
          setRecommendations(recs);
          setStep('results');
        }, 900);
        return;
      }

      setCurrentIdx(nextIdx);
      if (nextIdx < STATIC_QUESTIONS.length) {
        setCurrentQuestion(STATIC_QUESTIONS[nextIdx]);
      } else {
        const aggregated: Record<string, number> = {};
        for (const a of next) {
          if (!a.tags) continue;
          for (const [k, v] of Object.entries(a.tags)) aggregated[k] = (aggregated[k] ?? 0) + (v ?? 0);
        }
        const used = new Set(next.map((a) => a.question));
        const q = pickNextDynamicQuestion(DYNAMIC_POOL, used, aggregated);
        if (q) setCurrentQuestion(q);
      }
    },
    [answers, currentIdx, currentQuestion],
  );

  const reset = useCallback(() => {
    setStep('intro');
    setCurrentIdx(0);
    setCurrentQuestion(null);
    setAnswers([]);
    setRecommendations([]);
  }, []);

  const retry = reset;

  return {
    step,
    currentIdx,
    totalQuestions: TOTAL_QUESTIONS,
    currentQuestion,
    answers,
    recommendations,
    isLoadingQuestion: false,
    error,
    start,
    submitAnswer,
    reset,
    retry,
  };
}

// Silence "unused" for SCORE_KEYS type-only constant.
void SCORE_KEYS;
export type { ScoreKey };
