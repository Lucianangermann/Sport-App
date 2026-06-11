import { useCallback, useEffect, useRef, useState } from 'react';
import type { SkillLevel, Sport, TrainingModule } from '../../types';

export type ChatRole = 'user' | 'assistant';
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

const MAX_HISTORY = 30;
const STORAGE_KEY = (sportId: string) => `coach_history_${sportId}`;

const loadHistory = (sportId: string): ChatMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(sportId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(-MAX_HISTORY);
  } catch {
    return [];
  }
};

const saveHistory = (sportId: string, history: ChatMessage[]) => {
  try {
    localStorage.setItem(STORAGE_KEY(sportId), JSON.stringify(history.slice(-MAX_HISTORY)));
  } catch {
    /* ignore */
  }
};

interface UseCoachArgs {
  sport: Sport;
  level: SkillLevel;
  completedModules: TrainingModule[];
}

const LEVEL_DE: Record<SkillLevel, string> = {
  anfaenger: 'Anfänger',
  fortgeschritten: 'Fortgeschritten',
  profi: 'Profi',
};

/** Topics the coach can answer. Each topic has keywords and per-level responses. */
interface CoachTopic {
  id: string;
  keywords: string[];
  answers: Record<SkillLevel, string[]>;
}

const COMMON_TOPICS: CoachTopic[] = [
  {
    id: 'motivation',
    keywords: ['motivation', 'motiviert', 'lust', 'antrieb', 'durchhalten', 'aufgeben', 'dranbleiben'],
    answers: {
      anfaenger: [
        'Jeder Anfang ist schwer — feiere die kleinen Erfolge. Schon 10 Minuten Training heute sind ein Sieg.',
        'Setz dir winzige Ziele: heute nur Schuhe an und 5 Minuten Bewegung. Den Rest macht die Routine.',
      ],
      fortgeschritten: [
        'Du bist über die Anfangshürde hinaus — jetzt bringen Variation und neue Reize den nächsten Schub.',
        'Plateaus gehören dazu. Wechsle die Übungsreihenfolge oder erhöhe leicht die Intensität.',
      ],
      profi: [
        'Auf deinem Niveau zählen mentale Routinen genauso wie körperliche. Visualisiere dein nächstes Ziel jeden Morgen.',
        'Vergleiche dich nur mit deinem letzten Trainingstag — das hält den Fortschritt scharf.',
      ],
    },
  },
  {
    id: 'frequency',
    keywords: ['wie oft', 'pro woche', 'häufigkeit', 'frequenz', 'tage'],
    answers: {
      anfaenger: ['Starte mit 2–3 Einheiten pro Woche. Lieber kurz und regelmäßig als lang und sporadisch.'],
      fortgeschritten: ['3–4 Einheiten pro Woche sind ideal. Plane mindestens einen Tag aktive Erholung ein.'],
      profi: ['4–6 Einheiten pro Woche, davon 1–2 hochintensiv und 1 reiner Regeneration.'],
    },
  },
  {
    id: 'warmup',
    keywords: ['aufwärmen', 'warmup', 'warm-up', 'mobilisieren'],
    answers: {
      anfaenger: ['5–10 Minuten lockeres Cardio plus dynamische Mobilisation (Kreisen, Ausfallschritte) reichen aus.'],
      fortgeschritten: ['10 Minuten progressives Warm-up: leichtes Cardio → dynamische Stretches → sportartspezifische Bewegungen.'],
      profi: ['Strukturiertes RAMP-Warm-up: Raise, Activate, Mobilise, Potentiate — 12–15 Minuten.'],
    },
  },
  {
    id: 'cooldown',
    keywords: ['abkühlen', 'cooldown', 'cool-down', 'stretching', 'dehnen'],
    answers: {
      anfaenger: ['5 Minuten ruhiges Auslaufen plus statisches Dehnen der Hauptmuskelgruppen — je 20 Sek.'],
      fortgeschritten: ['Kombiniere statisches Dehnen mit Foam-Rolling der belasteten Muskelketten.'],
      profi: ['Aktive Regeneration: 10 Min lockeres Cardio, Mobility-Flow, kontrolliertes Atemprotokoll.'],
    },
  },
  {
    id: 'nutrition',
    keywords: ['ernährung', 'essen', 'trinken', 'protein', 'kalorien', 'mahlzeit'],
    answers: {
      anfaenger: ['Iss 1–2 Stunden vor dem Training etwas Leichtes mit Kohlenhydraten. Genug Wasser ist wichtiger als jedes Supplement.'],
      fortgeschritten: ['Achte auf 1,4–1,8 g Protein pro kg Körpergewicht und timing-bewusste Kohlenhydrate rund ums Training.'],
      profi: ['Plane Makros tagespräzise: Kohlenhydrate periodisiert nach Trainingsintensität, Protein gleichmäßig auf 4–5 Mahlzeiten.'],
    },
  },
  {
    id: 'pain',
    keywords: ['schmerz', 'verletz', 'weh', 'zerrung', 'aua', 'tut weh'],
    answers: {
      anfaenger: ['Brich bei stechenden Schmerzen sofort ab. Muskelkater ist normal, scharfer Schmerz nicht — sprich mit einer Ärztin.'],
      fortgeschritten: ['Unterscheide Belastungsschmerz von Verletzung: kühlen, hochlagern, 24–48 h Pause. Bei Persistenz Diagnostik.'],
      profi: ['Frühzeitig physiotherapeutisch abklären lassen. Trainingspause ist günstiger als monatelange Rehab.'],
    },
  },
  {
    id: 'progress',
    keywords: ['fortschritt', 'verbessern', 'besser werden', 'levelup', 'level up', 'aufsteigen'],
    answers: {
      anfaenger: ['Fortschritt kommt aus Wiederholung. Tracke jede Einheit kurz — du wirst die Kurve nach 4 Wochen sehen.'],
      fortgeschritten: ['Plane progressive Overloads: jede Woche entweder Volumen oder Intensität minimal anheben.'],
      profi: ['Periodisiere in Mesozyklen von 4 Wochen: 3 Wochen aufbauen, 1 Woche deload. Daten führen, Bauch korrigieren.'],
    },
  },
  {
    id: 'recovery',
    keywords: ['erholung', 'regeneration', 'pause', 'müde', 'schlaf'],
    answers: {
      anfaenger: ['Schlaf 7–9 Stunden. Ohne Erholung kein Fortschritt — das ist keine Faulheit, das ist Trainingslehre.'],
      fortgeschritten: ['Plane einen reinen Ruhetag pro Woche und einen Light-Day. Schlaf-Konstanz schlägt Schlaflänge.'],
      profi: ['HRV-Tracking, kühlen Schlafraum (16–18°C), regelmäßige Massagen oder Mobility-Sessions am Off-Tag.'],
    },
  },
];

const SPORT_TIPS: Record<string, string[]> = {
  fussball: ['Achte auf den ersten Kontakt — er entscheidet 80 % der Aktion.', 'Trainiere beide Füße zu gleichen Anteilen.'],
  basketball: ['Pivot-Fuß bewusst setzen, dann erst entscheiden.', 'Free Throws sind Wiederholung pur — 50 pro Einheit minimum.'],
  tennis: ['Spielposition zurück zum Center nach jedem Schlag.', 'Spin schlägt Härte — Topspin gibt dir Spielraum.'],
  schwimmen: ['Atmung rhythmisieren: gleiche Anzahl Züge pro Atemzug.', 'Wasserlage vor Kraft — Hüfte hoch, Kopf neutral.'],
  klettern: ['Beine drücken, Arme halten. Wer mit den Armen klettert, ermüdet schnell.', 'Lies die Route vom Boden aus komplett durch.'],
  yoga: ['Atem führt Bewegung — nicht andersrum.', 'Halte jede Pose so lange, dass du sie noch sauber halten kannst.'],
  boxen: ['Deckung oben, Kinn runter. Immer.', 'Geradenfolge → Variation. Niemals doppelt das Gleiche.'],
  laufen: ['Schrittfrequenz vor Schrittlänge — peile 170–180 Steps/Min an.', 'Lockerer Oberkörper, Schultern weg von den Ohren.'],
  radfahren: ['Trittfrequenz 80–90 — Knie schonen, Ausdauer aufbauen.', 'Cleats-Position regelmäßig prüfen.'],
  volleyball: ['Pritsche-Hände immer früh in Position.', 'Sprung kommt aus den Beinen, Schlagarm ist Peitsche.'],
  handball: ['Wurfbewegung aus dem Stand sauber, dann erst Sprung.', 'Schritte zählen, immer.'],
  judo: ['Kuzushi vor Tsukuri — erst aus dem Gleichgewicht bringen, dann werfen.', 'Fall sauber lernen, bevor du wirfst.'],
  karate: ['Hüfte ist die Schlagquelle, nicht der Arm.', 'Kihon täglich — Basics sind alles.'],
  kickboxen: ['Tritte aus der Hüfte, nicht aus dem Knie.', 'Defense first — Angriff ohne Deckung ist riskant.'],
  badminton: ['Grundstellung mittig, Schläger immer hoch.', 'Handgelenkstechnik schlägt Armkraft.'],
  tischtennis: ['Spin lesen lernen ist wichtiger als hart spielen.', 'Beinarbeit klein und schnell.'],
  squash: ['T-Position halten zwischen jedem Schlag.', 'Lob und Drop variieren halten Gegner in Bewegung.'],
  rudern: ['Beine — Rumpf — Arme. In dieser Reihenfolge.', 'Schlagzahl niedrig halten, sauber technisch arbeiten.'],
  segeln: ['Wind lesen vor Manöver setzen.', 'Trimm vor Tempo — gut getrimmt = automatisch schnell.'],
  surfen: ['Paddeln ist 80 % des Sports — trainiere Schultern.', 'Wellen lesen ist wichtiger als perfekte Technik.'],
  krafttraining: ['Technik vor Gewicht. Immer.', 'Compound-Übungen sind das Fundament — Kniebeuge, Kreuzheben, Bankdrücken.'],
  crossfit: ['Skalieren ist kein Versagen — saubere Bewegung schlägt schwere Bewegung.', 'Hände tapen und Grip-Strength gezielt trainieren.'],
  pilates: ['Atmung in jede Bewegung integrieren.', 'Powerhouse (Core) aktivieren vor jeder Übung.'],
  wandern: ['Trinken vor Durst, essen vor Hunger.', 'Stöcke entlasten Knie auf Abstiegen um bis zu 25 %.'],
  mountainbike: ['Blick weit voraus, nicht aufs Vorderrad.', 'Bremsen vor der Kurve, nicht in der Kurve.'],
  ski: ['Druck aufs Vorderski in der Kurve.', 'Oberkörper ruhig zum Tal, Beine arbeiten.'],
  snowboard: ['Vorderes Bein steuert, hinteres Bein gibt Speed.', 'Kanten sauber wechseln — keine Drehung über Hüfte.'],
  eishockey: ['Schlittschuh-Stride lang halten, Knie tief.', 'Puck-Handling muss blind funktionieren.'],
  tanzen: ['Musik zählen, dann Bewegung. Erst Rhythmus, dann Schritt.', 'Spannung im Rumpf, Beine arbeiten leicht.'],
  parkour: ['Sauber landen lernen vor sauber springen.', 'Scoutet jede Bewegung vor der Ausführung.'],
  reiten: ['Hände ruhig, Becken folgt der Bewegung.', 'Atem und Stimme sind Hilfen — nutze sie.'],
  golf: ['Setup ist 70 % des Schlags.', 'Tempo schlägt Power — gleichmäßiger Schwung führt weiter.'],
};

const greetings = ['hi', 'hallo', 'hey', 'moin', 'servus'];
const thanks = ['danke', 'thx', 'thanks'];

const stripAccents = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss');

const matchTopic = (text: string): CoachTopic | null => {
  const norm = stripAccents(text);
  let best: { topic: CoachTopic; score: number } | null = null;
  for (const t of COMMON_TOPICS) {
    let score = 0;
    for (const kw of t.keywords) {
      if (norm.includes(stripAccents(kw))) score++;
    }
    if (score > 0 && (!best || score > best.score)) best = { topic: t, score };
  }
  return best?.topic ?? null;
};

const pickFromArr = <T,>(arr: T[], seed: number): T => arr[seed % arr.length];

const buildReply = (
  text: string,
  sport: Sport,
  level: SkillLevel,
  completedModules: TrainingModule[],
  turnIndex: number,
): string => {
  const norm = stripAccents(text);

  if (greetings.some((g) => norm === g || norm.startsWith(g + ' '))) {
    return `Hi! Ich bin dein ${sport.name}-Coach. Frag mich nach Aufwärmen, Technik, Ernährung, Motivation oder Erholung — was steht an?`;
  }
  if (thanks.some((g) => norm.includes(g))) {
    return 'Sehr gerne — viel Spaß beim Training!';
  }

  const sportTips = SPORT_TIPS[sport.id] ?? [];
  const moduleHint = completedModules.length
    ? ` Du hast bereits ${completedModules.length} Modul${completedModules.length === 1 ? '' : 'e'} abgeschlossen — bleib dran.`
    : ' Starte mit den ersten Modulen, sie geben dir das Fundament.';

  const topic = matchTopic(text);
  if (topic) {
    const general = pickFromArr(topic.answers[level], turnIndex);
    if (topic.id === 'progress' && sportTips.length) {
      const tip = pickFromArr(sportTips, turnIndex);
      return `${general} Konkret für ${sport.name}: ${tip}`;
    }
    return general + (topic.id === 'motivation' ? moduleHint : '');
  }

  // Fallback: sport-specific tip + generic guidance.
  if (sportTips.length) {
    const tip = pickFromArr(sportTips, turnIndex);
    return `Für ${sport.name} (${LEVEL_DE[level]}): ${tip} Schreib mir, wenn du Tipps zu Aufwärmen, Technik, Ernährung oder Erholung brauchst.`;
  }
  return `Auf Level ${LEVEL_DE[level]} hilft es, fokussierte Einheiten zu fahren — 2–3 mal pro Woche reichen, wenn du sauber arbeitest.${moduleHint}`;
};

export function useCoach({ sport, level, completedModules }: UseCoachArgs) {
  const [history, setHistory] = useState<ChatMessage[]>(() => loadHistory(sport.id));
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error] = useState<string | null>(null);
  const abortRef = useRef<{ aborted: boolean } | null>(null);

  useEffect(() => {
    // Re-sync chat history from localStorage when the sport changes.
    /* eslint-disable react-hooks/set-state-in-effect */
    setHistory(loadHistory(sport.id));
    setStreamingText('');
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [sport.id]);

  const send = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = { role: 'user', content: text.trim() };
      if (!userMsg.content) return;

      const next = [...history, userMsg].slice(-MAX_HISTORY);
      setHistory(next);
      saveHistory(sport.id, next);

      const ctrl = { aborted: false };
      abortRef.current = ctrl;
      setStreaming(true);
      setStreamingText('');

      const reply = buildReply(text, sport, level, completedModules, history.length);

      // Stream char by char for the same UX as before.
      const chunkSize = 3;
      const interval = 18;
      for (let i = 0; i < reply.length; i += chunkSize) {
        if (ctrl.aborted) break;
        await new Promise((r) => window.setTimeout(r, interval));
        setStreamingText(reply.slice(0, i + chunkSize));
      }

      if (!ctrl.aborted) {
        const finalHistory = [...next, { role: 'assistant' as const, content: reply }].slice(-MAX_HISTORY);
        setHistory(finalHistory);
        saveHistory(sport.id, finalHistory);
      }
      setStreaming(false);
      setStreamingText('');
      abortRef.current = null;
    },
    [history, sport, level, completedModules],
  );

  const retry = useCallback(() => {
    if (!history.length) return;
    const lastUser = [...history].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    const idx = history.findIndex((m) => m === lastUser);
    const trimmed = history.slice(0, idx);
    setHistory(trimmed);
    saveHistory(sport.id, trimmed);
    void send(lastUser.content);
  }, [history, send, sport.id]);

  const clear = useCallback(() => {
    setHistory([]);
    saveHistory(sport.id, []);
  }, [sport.id]);

  const abort = useCallback(() => {
    if (abortRef.current) abortRef.current.aborted = true;
  }, []);

  return { history, streaming, streamingText, error, send, retry, clear, abort };
}
