import { useCallback, useState } from 'react';
import { callClaudeJSON } from '../../lib/claude';

export interface QuizQuestion {
  question: string;
  options: string[];
}

export interface QuizAnswer {
  question: string;
  answer: string;
}

export interface QuizRecommendation {
  sport: string;
  match: number;
  reason: string;
}

export type QuizStep = 'intro' | 'questions' | 'loading' | 'results' | 'error';

const STATIC_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Trainierst du lieber alleine oder im Team?',
    options: ['Alleine', 'Im Team', 'Beides'],
  },
  {
    question: 'Indoor oder Outdoor?',
    options: ['Indoor', 'Outdoor', 'Egal'],
  },
  {
    question: 'Wie intensiv magst du es?',
    options: ['Entspannt', 'Moderat', 'Sehr intensiv'],
  },
];

const TOTAL_QUESTIONS = 8;

export function useQuiz() {
  const [step, setStep] = useState<QuizStep>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [recommendations, setRecommendations] = useState<QuizRecommendation[]>([]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(() => {
    setStep('questions');
    setCurrentIdx(0);
    setCurrentQuestion(STATIC_QUESTIONS[0]);
    setAnswers([]);
    setRecommendations([]);
    setError(null);
  }, []);

  const fetchNextDynamicQuestion = useCallback(
    async (allAnswers: QuizAnswer[]): Promise<QuizQuestion> => {
      const conversation = allAnswers
        .map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`)
        .join('\n\n');

      return await callClaudeJSON<QuizQuestion>({
        system:
          'Du bist ein Sport-Berater. Generiere die nächste Frage, um die perfekte Sportart zu finden. Antworte ausschließlich mit JSON in genau diesem Format: { "question": "...", "options": ["...", "...", "..."] }. Die Frage soll noch nicht gestellt worden sein, auf Deutsch sein und 3 Optionen haben. Kein Text davor oder danach.',
        messages: [
          {
            role: 'user',
            content: `Bisherige Antworten:\n\n${conversation}\n\nGeneriere die nächste relevante Frage als JSON.`,
          },
        ],
        maxTokens: 256,
      });
    },
    [],
  );

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!currentQuestion) return;
      const newAnswer: QuizAnswer = { question: currentQuestion.question, answer };
      const next = [...answers, newAnswer];
      setAnswers(next);

      const nextIdx = currentIdx + 1;
      if (nextIdx >= TOTAL_QUESTIONS) {
        // All 8 questions answered → loading + analysis
        setStep('loading');
        try {
          const conv = next
            .map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`)
            .join('\n\n');

          const result = await callClaudeJSON<{ recommendations: QuizRecommendation[] }>({
            system:
              'Du bist ein Sport-Berater. Analysiere die Antworten und empfehle die Top-5 passenden Sportarten. Antworte ausschließlich mit JSON in genau diesem Format: { "recommendations": [{ "sport": "...", "match": 94, "reason": "..." }, ... 5 Einträge] }. Match ist 0–100. Reason ist 1 Satz auf Deutsch. Sport-Namen aus dieser Liste wählen: Fußball, Basketball, Tennis, Schwimmen, Klettern, Yoga, Boxen, Laufen, Radfahren, Volleyball, Handball, Judo, Karate, Kickboxen, Badminton, Tischtennis, Squash, Rudern, Segeln, Surfen, Krafttraining, CrossFit, Pilates, Wandern, Mountainbike, Ski Alpin, Snowboard, Eishockey, Tanzen, Parkour, Reiten, Golf. Kein Text davor oder danach.',
            messages: [
              {
                role: 'user',
                content: `Antworten:\n\n${conv}\n\nGib die Top-5 Empfehlungen.`,
              },
            ],
            maxTokens: 1024,
          });
          setRecommendations((result.recommendations ?? []).slice(0, 5));
          setStep('results');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
          setStep('error');
        }
        return;
      }

      // Next question: static (0–2) or dynamic (3–7)
      setCurrentIdx(nextIdx);
      if (nextIdx < STATIC_QUESTIONS.length) {
        setCurrentQuestion(STATIC_QUESTIONS[nextIdx]);
      } else {
        setIsLoadingQuestion(true);
        try {
          const q = await fetchNextDynamicQuestion(next);
          setCurrentQuestion(q);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
          setStep('error');
        } finally {
          setIsLoadingQuestion(false);
        }
      }
    },
    [answers, currentIdx, currentQuestion, fetchNextDynamicQuestion],
  );

  const reset = useCallback(() => {
    setStep('intro');
    setCurrentIdx(0);
    setCurrentQuestion(null);
    setAnswers([]);
    setRecommendations([]);
    setError(null);
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setStep('intro');
  }, []);

  return {
    step,
    currentIdx,
    totalQuestions: TOTAL_QUESTIONS,
    currentQuestion,
    answers,
    recommendations,
    isLoadingQuestion,
    error,
    start,
    submitAnswer,
    reset,
    retry,
  };
}
