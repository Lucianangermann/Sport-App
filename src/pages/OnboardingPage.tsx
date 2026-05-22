import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import type { FitnessLevel, OnboardingAnswers } from '../types';
import { getRecommendedSports } from '../utils/helpers';
import { SportCard } from '../components/SportCard';

const FITNESS_OPTIONS: Array<{ id: FitnessLevel; emoji: string; title: string; body: string }> = [
  { id: 'couch', emoji: '🛋️', title: 'Couch Potato', body: 'Ich bewege mich kaum – aber das soll sich ändern.' },
  { id: 'occasional', emoji: '🚶', title: 'Gelegentlich aktiv', body: '1–2 Mal pro Woche bin ich in Bewegung.' },
  { id: 'regular', emoji: '🏃', title: 'Regelmäßig aktiv', body: 'Sport ist fester Bestandteil meiner Woche.' },
];

const OptionCard = ({
  active,
  emoji,
  title,
  body,
  onClick,
}: {
  active: boolean;
  emoji: string;
  title: string;
  body?: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
      active
        ? 'border-ink-900 bg-ink-900 text-white dark:border-white dark:bg-white dark:text-ink-900'
        : 'border-slate-200 bg-white text-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-white'
    }`}
  >
    <span className="text-3xl">{emoji}</span>
    <div className="flex-1">
      <div className="font-display text-base font-bold">{title}</div>
      {body && (
        <div
          className={`text-xs ${
            active ? 'text-white/70 dark:text-ink-700' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {body}
        </div>
      )}
    </div>
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
        active
          ? 'border-white bg-white text-ink-900 dark:border-ink-900 dark:bg-ink-900 dark:text-white'
          : 'border-slate-300 dark:border-ink-600'
      }`}
    >
      {active ? '✓' : ''}
    </span>
  </button>
);

const PrefRow = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: T; label: string }>;
  value: T | null;
  onChange: (v: T) => void;
}) => (
  <div className="grid grid-cols-3 gap-2">
    {options.map((o) => (
      <button
        key={o.id}
        onClick={() => onChange(o.id)}
        className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition ${
          value === o.id
            ? 'border-ink-900 bg-ink-900 text-white dark:border-white dark:bg-white dark:text-ink-900'
            : 'border-slate-200 bg-white text-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-white'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

export const OnboardingPage = () => {
  const nav = useNavigate();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setName = useAppStore((s) => s.setProfileName);

  const [step, setStep] = useState(0);
  const [name, setLocalName] = useState('');
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    fitnessLevel: null,
    indoorPreference: null,
    socialPreference: null,
    intensity: null,
  });

  const recommendations = step === 3 ? getRecommendedSports(answers, 5) : [];

  const canNext =
    (step === 0 && name.trim().length >= 2) ||
    (step === 1 && answers.fitnessLevel) ||
    (step === 2 && answers.indoorPreference && answers.socialPreference && answers.intensity);

  const finish = () => {
    setName(name);
    completeOnboarding(answers);
    nav('/', { replace: true });
  };

  return (
    <div className="app-shell">
      <div className="flex-1 overflow-y-auto px-5 pb-24 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-ink-900 dark:text-white">Sportify</span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {Math.min(step + 1, 4)} / 4
          </span>
        </div>
        <div className="mb-8 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition ${
                i <= step ? 'bg-ink-900 dark:bg-white' : 'bg-slate-200 dark:bg-ink-700'
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <h1 className="font-display text-3xl font-bold leading-tight text-ink-900 dark:text-white">
              Willkommen 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Wie sollen wir dich nennen?</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Dein Vorname"
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 font-display text-lg text-ink-900 outline-none transition focus:border-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-white dark:focus:border-white"
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-bold leading-tight text-ink-900 dark:text-white">
              Wie fit fühlst du dich gerade?
            </h1>
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              Ehrlich – wir bauen darauf deine Empfehlungen.
            </p>
            {FITNESS_OPTIONS.map((o) => (
              <OptionCard
                key={o.id}
                active={answers.fitnessLevel === o.id}
                emoji={o.emoji}
                title={o.title}
                body={o.body}
                onClick={() => setAnswers((a) => ({ ...a, fitnessLevel: o.id }))}
              />
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight text-ink-900 dark:text-white">
                Was passt zu dir?
              </h1>
              <p className="text-slate-600 dark:text-slate-400">Wähle in jeder Zeile eine Option.</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Wo am liebsten?</h3>
              <PrefRow
                options={[
                  { id: 'indoor', label: '🏠 Indoor' },
                  { id: 'outdoor', label: '🌳 Outdoor' },
                  { id: 'both', label: '🤷 Egal' },
                ] as const}
                value={answers.indoorPreference}
                onChange={(v) => setAnswers((a) => ({ ...a, indoorPreference: v }))}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Solo oder Team?</h3>
              <PrefRow
                options={[
                  { id: 'solo', label: '🙋 Solo' },
                  { id: 'team', label: '👥 Team' },
                  { id: 'both', label: '🤷 Egal' },
                ] as const}
                value={answers.socialPreference}
                onChange={(v) => setAnswers((a) => ({ ...a, socialPreference: v }))}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Intensität?</h3>
              <PrefRow
                options={[
                  { id: 'low', label: '🧘 Locker' },
                  { id: 'high', label: '🔥 Intensiv' },
                  { id: 'both', label: '🤷 Egal' },
                ] as const}
                value={answers.intensity}
                onChange={(v) => setAnswers((a) => ({ ...a, intensity: v }))}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="font-display text-3xl font-bold leading-tight text-ink-900 dark:text-white">
              Diese Sportarten passen zu dir 🎯
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Basierend auf deinen Antworten – Top 5 für dich.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((s) => (
                <SportCard key={s.id} sport={s} size="sm" hideFavorite />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-800">
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-2xl bg-slate-100 px-5 py-3.5 font-semibold text-ink-900 dark:bg-ink-700 dark:text-white"
            >
              Zurück
            </button>
          )}
          <button
            disabled={step < 3 && !canNext}
            onClick={() => (step === 3 ? finish() : setStep((s) => s + 1))}
            className="flex-1 rounded-2xl bg-ink-900 px-5 py-3.5 font-semibold text-white transition disabled:bg-slate-300 dark:bg-white dark:text-ink-900 dark:disabled:bg-ink-700 dark:disabled:text-slate-500"
          >
            {step === 3 ? 'Loslegen 🚀' : 'Weiter'}
          </button>
        </div>
      </div>
    </div>
  );
};
