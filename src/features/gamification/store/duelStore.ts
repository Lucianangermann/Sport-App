import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DuelParticipant {
  userId: string;
  name: string;
  avatar: string;
  score: number;
}

export interface Duel {
  id: string;
  challenger: DuelParticipant;
  opponent: DuelParticipant;
  sport: string;
  sportEmoji: string;
  metric: string;
  duelType: 'minutes' | 'sessions' | 'streak' | 'xp';
  startedAt: string;
  endsAt: string;
  status: 'pending' | 'active' | 'completed';
  winner?: string;
}

export const DUEL_TYPES = [
  {
    id: 'minutes',
    label: 'Trainingsminuten',
    desc: 'Meiste Minuten in der Woche',
    icon: '⏱️',
  },
  {
    id: 'sessions',
    label: 'Trainingseinheiten',
    desc: 'Meiste Sessions in der Woche',
    icon: '🏋️',
  },
  {
    id: 'streak',
    label: 'Tagesstreak',
    desc: 'Längster Streak',
    icon: '🔥',
  },
  {
    id: 'xp',
    label: 'XP-Jagd',
    desc: 'Meiste XP diese Woche',
    icon: '⚡',
  },
] as const;

export const TRASH_TALK_MESSAGES: string[] = [
  'Ich werde dich vernichten! 😤',
  'Bereite dich auf deine Niederlage vor! 🏆',
  'Das wird leicht für mich! 💪',
  'Du hast keine Chance gegen mich! ⚡',
  'Ich bin unaufhaltbar! 🔥',
  'Du wirst heute weinend schlafen gehen! 😈',
  'Meine Oma wäre schneller als du! 👵',
  'Zeit, dich in den Ruhestand zu schicken! 🪑',
  'Schau mal, wer verlieren wird... 😏',
  'Ich spiele schon in meinem Schlaf besser als du! 😴',
];

const NOW = new Date('2026-05-26T12:00:00.000Z');

function daysFromNow(days: number): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function daysAgo(days: number): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const ME: DuelParticipant = {
  userId: 'user1',
  name: 'Lucian',
  avatar: '🏃',
  score: 0,
};

const MOCK_DUELS: Duel[] = [
  {
    id: 'duel-active-1',
    challenger: { ...ME, score: 145 },
    opponent: { userId: 'user2', name: 'Max Müller', avatar: '💪', score: 92 },
    sport: 'laufen',
    sportEmoji: '🏃',
    metric: 'Trainingsminuten diese Woche',
    duelType: 'minutes',
    startedAt: daysAgo(4),
    endsAt: daysFromNow(3),
    status: 'active',
  },
  {
    id: 'duel-active-2',
    challenger: { ...ME, score: 7 },
    opponent: { userId: 'user3', name: 'Sarah K.', avatar: '🧘', score: 5 },
    sport: 'yoga',
    sportEmoji: '🧘',
    metric: 'Trainingseinheiten diese Woche',
    duelType: 'sessions',
    startedAt: daysAgo(2),
    endsAt: daysFromNow(5),
    status: 'active',
  },
  {
    id: 'duel-active-3',
    challenger: { ...ME, score: 1250 },
    opponent: { userId: 'user4', name: 'Tom B.', avatar: '🏋️', score: 1180 },
    sport: 'krafttraining',
    sportEmoji: '🏋️',
    metric: 'XP diese Woche',
    duelType: 'xp',
    startedAt: daysAgo(6),
    endsAt: daysFromNow(1),
    status: 'active',
  },
  {
    id: 'duel-pending-1',
    challenger: { userId: 'user5', name: 'Anna', avatar: '🌟', score: 0 },
    opponent: { ...ME, score: 0 },
    sport: 'schwimmen',
    sportEmoji: '🏊',
    metric: 'Trainingsminuten diese Woche',
    duelType: 'minutes',
    startedAt: daysAgo(1),
    endsAt: daysFromNow(6),
    status: 'pending',
  },
  {
    id: 'duel-pending-2',
    challenger: { userId: 'user8', name: 'Klaus', avatar: '🚴', score: 0 },
    opponent: { ...ME, score: 0 },
    sport: 'radfahren',
    sportEmoji: '🚴',
    metric: 'Trainingsminuten diese Woche',
    duelType: 'minutes',
    startedAt: daysAgo(0),
    endsAt: daysFromNow(7),
    status: 'pending',
  },
];

const MOCK_COMPLETED: Duel[] = [
  {
    id: 'duel-completed-1',
    challenger: { ...ME, score: 180 },
    opponent: { userId: 'user6', name: 'Peter', avatar: '🎯', score: 120 },
    sport: 'fußball',
    sportEmoji: '⚽',
    metric: 'Trainingsminuten diese Woche',
    duelType: 'minutes',
    startedAt: daysAgo(14),
    endsAt: daysAgo(7),
    status: 'completed',
    winner: 'user1',
  },
  {
    id: 'duel-completed-2',
    challenger: { userId: 'user7', name: 'Julia', avatar: '🏅', score: 89 },
    opponent: { ...ME, score: 45 },
    sport: 'tennis',
    sportEmoji: '🎾',
    metric: 'Trainingseinheiten diese Woche',
    duelType: 'sessions',
    startedAt: daysAgo(21),
    endsAt: daysAgo(14),
    status: 'completed',
    winner: 'user7',
  },
];

interface DuelState {
  duels: Duel[];
  pendingDuels: Duel[];
  completedDuels: Duel[];
  sendDuel: (
    opponent: DuelParticipant,
    duelType: Duel['duelType'],
    durationDays: number
  ) => void;
  acceptDuel: (duelId: string) => void;
  declineDuel: (duelId: string) => void;
  updateScore: (duelId: string, userId: string, newScore: number) => void;
  completeDuel: (duelId: string) => void;
}

export const useDuelStore = create<DuelState>()(
  persist(
    (set, get) => ({
      duels: MOCK_DUELS,
      pendingDuels: MOCK_DUELS.filter((d) => d.status === 'pending'),
      completedDuels: MOCK_COMPLETED,

      sendDuel: (opponent, duelType, durationDays) => {
        const duelTypeInfo = DUEL_TYPES.find((dt) => dt.id === duelType);
        const newDuel: Duel = {
          id: `duel-${Date.now()}`,
          challenger: { ...ME, score: 0 },
          opponent: { ...opponent, score: 0 },
          sport: 'sport',
          sportEmoji: duelTypeInfo?.icon ?? '🏆',
          metric: duelTypeInfo?.desc ?? 'Punkte',
          duelType,
          startedAt: new Date().toISOString(),
          endsAt: new Date(
            Date.now() + durationDays * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: 'pending',
        };
        set((state) => ({
          duels: [...state.duels, newDuel],
          pendingDuels: [...state.pendingDuels, newDuel],
        }));
      },

      acceptDuel: (duelId) => {
        set((state) => {
          const updatedDuels = state.duels.map((d) =>
            d.id === duelId ? { ...d, status: 'active' as const } : d
          );
          return {
            duels: updatedDuels,
            pendingDuels: state.pendingDuels.filter((d) => d.id !== duelId),
          };
        });
      },

      declineDuel: (duelId) => {
        set((state) => ({
          duels: state.duels.filter((d) => d.id !== duelId),
          pendingDuels: state.pendingDuels.filter((d) => d.id !== duelId),
        }));
      },

      updateScore: (duelId, userId, newScore) => {
        set((state) => ({
          duels: state.duels.map((d) => {
            if (d.id !== duelId) return d;
            if (d.challenger.userId === userId) {
              return {
                ...d,
                challenger: { ...d.challenger, score: newScore },
              };
            }
            if (d.opponent.userId === userId) {
              return {
                ...d,
                opponent: { ...d.opponent, score: newScore },
              };
            }
            return d;
          }),
        }));
      },

      completeDuel: (duelId) => {
        const state = get();
        const duel = state.duels.find((d) => d.id === duelId);
        if (!duel) return;

        const winner =
          duel.challenger.score >= duel.opponent.score
            ? duel.challenger.userId
            : duel.opponent.userId;

        const completed: Duel = {
          ...duel,
          status: 'completed',
          winner,
          endsAt: new Date().toISOString(),
        };

        set((s) => ({
          duels: s.duels.filter((d) => d.id !== duelId),
          completedDuels: [completed, ...s.completedDuels],
        }));
      },
    }),
    { name: 'duel-store-v1' }
  )
);
