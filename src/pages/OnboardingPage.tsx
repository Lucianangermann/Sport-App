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
      active ? 'border-ink-900 bg-ink-900 text-white' : 'border-slate-200 bg-white text-ink-900'
    }`}
  >
    <span className="text-3xl">{emoji}</span>
    <div className="flex-1">
      <div className="font-display text-base font-bold">{title}</div>
      {body && <div className={`text-xs ${active ? 'text-white/70' : 'text-slate-500'}`}>{body}</div>}
    </div>
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
        active ? 'border-white bg-white text-ink-900' : 'border-slate-300'
      }`}
    >
      {active ? '✓' : ''}
    </span>
  </button>
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
          <span className="font-display text-2xl font-bold">Sportify</span>
          <span className="text-xs font-semibold text-slate-500">{Math.min(step + 1, 4)} / 4</span>
        </div>
        <div className="mb-8 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition ${i <= step ? 'bg-ink-900' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <h1 className="font-display text-3xl font-bold leading-tight">Willkommen 👋</h1>
            <p className="text-slate-600">Wie sollen wir dich nennen?</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Dein Vorname"
              className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 font-display text-lg outline-none transition focus:border-ink-900"
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-bold leading-tight">Wie fit fühlst du dich gerade?</h1>
            <p className="mb-4 text-slate-600">Ehrlich – wir bauen darauf deine Empfehlungen.</p>
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
              <h1 className="font-display text-2xl font-bold leading-tight">Was passt zu dir?</h1>
              <p className="text-slate-600">Wähle in jeder Zeile eine Option.</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700">Wo am liebsten?</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['indoor', 'outdoor', 'both'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setAnswers((a) => ({ ...a, indoorPreference: v }))}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold ${
                      answers.indoorPreference === v ? 'border-ink-900 bg-ink-900 text-white' : 'border-slate-200 bg-white'
                    }`}
                  >
                    {v === 'indoor' ? '🏠 Indoor' : v === 'outdoor' ? '🌳 Outdoor' : '🤷 Egal'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700">Solo oder Team?</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['solo', 'team', 'both'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setAnswers((a) => ({ ...a, socialPreference: v }))}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold ${
                      answers.socialPreference === v ? 'border-ink-900 bg-ink-900 text-white' : 'border-slate-200 bg-white'
                    }`}
                  >
                    {v === 'solo' ? '🙋 Solo' : v === 'team' ? '👥 Team' : '🤷 Egal'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-700">Intensität?</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'high', 'both'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setAnswers((a) => ({ ...a, intensity: v }))}
                    className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold ${
                      answers.intensity === v ? 'border-ink-900 bg-ink-900 text-white' : 'border-slate-200 bg-white'
                    }`}
                  >
                    {v === 'low' ? '🧘 Locker' : v === 'high' ? '🔥 Intensiv' : '🤷 Egal'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="font-display text-3xl font-bold leading-tight">Diese Sportarten passen zu dir 🎯</h1>
            <p className="text-slate-600">Basierend auf deinen Antworten – Top 5 für dich.</p>
            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((s) => (
                <SportCard key={s.id} sport={s} size="sm" hideFavorite />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-2xl bg-slate-100 px-5 py-3.5 font-semibold text-ink-900"
            >
              Zurück
            </button>
          )}
          <button
            disabled={step < 3 && !canNext}
            onClick={() => (step === 3 ? finish() : setStep((s) => s + 1))}
            className="flex-1 rounded-2xl bg-ink-900 px-5 py-3.5 font-semibold text-white transition disabled:bg-slate-300"
          >
            {step === 3 ? 'Loslegen 🚀' : 'Weiter'}
          </button>
        </div>
      </div>
    </div>
  );
};
