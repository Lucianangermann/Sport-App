import type { SportCurriculum, TrainingModule } from '../types';
import { SPORTS } from './sports';

const beginner: TrainingModule[] = [
  { id: 'b1', title: 'Grundlagen & Regeln', description: 'Lerne die wichtigsten Regeln und Begriffe.', duration: '15 min', videoPlaceholder: '/videos/placeholder-1.mp4' },
  { id: 'b2', title: 'Erste Bewegungen', description: 'Die fundamentalen Bewegungsabläufe.', duration: '20 min', videoPlaceholder: '/videos/placeholder-2.mp4' },
  { id: 'b3', title: 'Ausrüstung verstehen', description: 'Was du wirklich brauchst – und was nicht.', duration: '10 min', videoPlaceholder: '/videos/placeholder-3.mp4' },
  { id: 'b4', title: 'Aufwärmen richtig', description: 'Verletzungen vermeiden, Leistung steigern.', duration: '12 min', videoPlaceholder: '/videos/placeholder-4.mp4' },
  { id: 'b5', title: 'Erste eigene Einheit', description: 'Dein erstes vollständiges Training.', duration: '25 min', videoPlaceholder: '/videos/placeholder-5.mp4' },
];

const intermediate: TrainingModule[] = [
  { id: 'i1', title: 'Technik vertiefen', description: 'Saubere Ausführung als Basis für mehr.', duration: '25 min', videoPlaceholder: '/videos/placeholder-6.mp4' },
  { id: 'i2', title: 'Taktische Grundlagen', description: 'Strategie verstehen und anwenden.', duration: '30 min', videoPlaceholder: '/videos/placeholder-7.mp4' },
  { id: 'i3', title: 'Konditionstraining', description: 'Ausdauer für ernsthaftes Training.', duration: '35 min', videoPlaceholder: '/videos/placeholder-8.mp4' },
  { id: 'i4', title: 'Erste Wettkämpfe', description: 'So bereitest du dich auf den ersten Vergleich vor.', duration: '20 min', videoPlaceholder: '/videos/placeholder-9.mp4' },
  { id: 'i5', title: 'Regeneration', description: 'Schlaf, Ernährung, aktive Erholung.', duration: '15 min', videoPlaceholder: '/videos/placeholder-10.mp4' },
];

const advanced: TrainingModule[] = [
  { id: 'p1', title: 'Peak Performance', description: 'Den letzten Prozent herauskitzeln.', duration: '40 min', videoPlaceholder: '/videos/placeholder-11.mp4' },
  { id: 'p2', title: 'Mentaltraining', description: 'Fokus, Visualisierung, Wettkampfpsychologie.', duration: '30 min', videoPlaceholder: '/videos/placeholder-12.mp4' },
  { id: 'p3', title: 'Periodisierung', description: 'Trainingsphasen sinnvoll planen.', duration: '35 min', videoPlaceholder: '/videos/placeholder-13.mp4' },
  { id: 'p4', title: 'Analyse & Daten', description: 'Mit Metriken besser werden.', duration: '25 min', videoPlaceholder: '/videos/placeholder-14.mp4' },
  { id: 'p5', title: 'Coaching anderer', description: 'Wissen weitergeben, selbst wachsen.', duration: '30 min', videoPlaceholder: '/videos/placeholder-15.mp4' },
];

// Every sport gets the same template modules — in a real app these'd be sport-specific.
export const CURRICULA: Record<string, SportCurriculum> = Object.fromEntries(
  SPORTS.map((s) => [
    s.id,
    {
      sportId: s.id,
      anfaenger: beginner,
      fortgeschritten: intermediate,
      profi: advanced,
    },
  ]),
);

export const LEVEL_LABELS = {
  anfaenger: { label: 'Anfänger', emoji: '🌱', subtitle: 'Grundlagen & erste Übungen' },
  fortgeschritten: { label: 'Fortgeschritten', emoji: '⚡', subtitle: 'Technik, Taktik & Wettkampf' },
  profi: { label: 'Profi', emoji: '🏆', subtitle: 'Peak Performance & Mentaltraining' },
} as const;
