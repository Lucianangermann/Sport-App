import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { CURRICULA } from '../../data/modules';
import { getSportById, moduleKey } from '../../utils/helpers';
import { useAppStore } from '../../store/useAppStore';
import type { SkillLevel, Sport } from '../../types';
import {
  useTrainingPlan,
  type Duration,
  type Goal,
  type Intensity,
  type PlanInput,
  type PreferredTime,
  type TrainingDay,
  type TrainingWeek,
} from './useTrainingPlan';

const GOALS: Goal[] = ['Abnehmen', 'Muskelaufbau', 'Ausdauer', 'Spaß', 'Wettkampf'];
const DURATIONS: Duration[] = [20, 45, 60, 90];
const TIMES: PreferredTime[] = ['Morgens', 'Mittags', 'Abends'];

const intensityDot = (i: Intensity) => {
  if (i === 'high') return 'bg-rose-500';
  if (i === 'medium') return 'bg-amber-500';
  return 'bg-emerald-500';
};
const intensityLabel = (i: Intensity) => (i === 'high' ? 'Hart' : i === 'medium' ? 'Moderat' : 'Locker');

const LoadingDots = () => (
  <div className="flex items-center justify-center gap-1.5">
    <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
  </div>
);

/** Best-effort: derive user's active level for this sport from progress. */
const deriveLevel = (sportId: string, progress: Record<string, unknown>): SkillLevel => {
  const c = CURRICULA[sportId];
  if (!c) return 'anfaenger';
  const counts = (['anfaenger', 'fortgeschritten', 'profi'] as const).map((lvl) => ({
    lvl,
    done: c[lvl].filter((m) => progress[moduleKey(sportId, lvl, m.id)]).length,
  }));
  // If user has done >50% of a level, they're "on" that or the next level.
  const profi = counts[2];
  const fort = counts[1];
  const anf = counts[0];
  if (profi.done > 0) return 'profi';
  if (fort.done > fort.lvl.length / 2) return 'profi';
  if (fort.done > 0) return 'fortgeschritten';
  if (anf.done > anf.lvl.length / 2) return 'fortgeschritten';
  return 'anfaenger';
};

const DayCard = ({ day, sportColor }: { day: TrainingDay; sportColor: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-white shadow-card dark:bg-ink-800 dark:shadow-card-dark">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 p-4 text-left">
        <span className={`h-3 w-3 shrink-0 rounded-full ${intensityDot(day.intensity)}`} />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {day.day} · {intensityLabel(day.intensity)}
          </div>
          <div className="truncate font-display text-sm font-bold text-ink-900 dark:text-white">{day.title}</div>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
          style={{ background: sportColor }}
        >
          {day.duration} min
        </span>
        <span className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-4 py-3 dark:border-ink-700">
          <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
            {day.exercises.map((ex, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold" style={{ color: sportColor }}>
                  •
                </span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const TrainingPlanGenerator = () => {
  const { id } = useParams<{ id: string }>();
  const sport = id ? getSportById(id) : undefined;
  // Guard before any feature hooks; the content component then calls all its
  // hooks unconditionally with a guaranteed `sport`.
  if (!sport) return <Navigate to="/discover" replace />;
  return <TrainingPlanContent sport={sport} />;
};

const TrainingPlanContent = ({ sport }: { sport: Sport }) => {
  const progress = useAppStore((s) => s.progress);
  const level = deriveLevel(sport.id, progress);
  const { plan, lastInput, loading, error, generate, reset } = useTrainingPlan({ sport, level });

  // Form state
  const [daysPerWeek, setDaysPerWeek] = useState(lastInput?.daysPerWeek ?? 3);
  const [duration, setDuration] = useState<Duration>(lastInput?.duration ?? 45);
  const [goal, setGoal] = useState<Goal>(lastInput?.goal ?? 'Ausdauer');
  const [time, setTime] = useState<PreferredTime>(lastInput?.time ?? 'Abends');
  const [activeWeek, setActiveWeek] = useState(1);

  const submit = () => {
    const input: PlanInput = { daysPerWeek, duration, goal, time };
    void generate(input);
  };

  return (
    <div>
      <PageHeader title="Trainingsplan" subtitle={sport.name} back />

      {!plan && !loading && (
        <div className="space-y-6 px-5 pb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Beantworte 4 Fragen — wir bauen dir einen 4-Wochen-Plan auf Level{' '}
            <strong className="text-ink-900 dark:text-white">
              {level === 'anfaenger' ? 'Anfänger' : level === 'fortgeschritten' ? 'Fortgeschritten' : 'Profi'}
            </strong>
            .
          </p>

          <Field label={`Tage pro Woche: ${daysPerWeek}`}>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              className="w-full accent-ink-900 dark:accent-white"
            />
            <div className="mt-1 flex justify-between text-[10px] text-slate-400">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
            </div>
          </Field>

          <Field label="Dauer pro Einheit">
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map((d) => (
                <ChoiceBtn key={d} active={duration === d} onClick={() => setDuration(d)}>
                  {d} min
                </ChoiceBtn>
              ))}
            </div>
          </Field>

          <Field label="Ziel">
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <ChoiceBtn key={g} active={goal === g} onClick={() => setGoal(g)}>
                  {g}
                </ChoiceBtn>
              ))}
            </div>
          </Field>

          <Field label="Bevorzugte Tageszeit">
            <div className="grid grid-cols-3 gap-2">
              {TIMES.map((t) => (
                <ChoiceBtn key={t} active={time === t} onClick={() => setTime(t)}>
                  {t}
                </ChoiceBtn>
              ))}
            </div>
          </Field>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/15 dark:text-rose-300">
              {error}
            </div>
          )}

          <button
            onClick={submit}
            className="w-full rounded-2xl bg-ink-900 py-4 font-semibold text-white dark:bg-white dark:text-ink-900"
          >
            Plan generieren ✨
          </button>
        </div>
      )}

      {loading && (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4 px-5 text-ink-900 dark:text-white">
          <div className="text-5xl">📋</div>
          <h2 className="font-display text-xl font-bold">Dein Plan wird gebaut…</h2>
          <LoadingDots />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            4 Wochen × {daysPerWeek} Tage werden zusammengestellt.
          </p>
        </div>
      )}

      {plan && !loading && (
        <div className="space-y-4 px-5 pb-8">
          {plan.coachNote && (
            <div
              className="rounded-2xl p-4 text-white shadow-card dark:shadow-card-dark"
              style={{ background: `linear-gradient(135deg, ${sport.color}, ${sport.color}cc)` }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-white/80">Coach-Note</div>
              <p className="mt-1 text-sm leading-snug">{plan.coachNote}</p>
            </div>
          )}

          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
            {plan.weeks.map((w) => (
              <button
                key={w.week}
                onClick={() => setActiveWeek(w.week)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeWeek === w.week
                    ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                    : 'bg-white text-slate-700 shadow-card dark:bg-ink-800 dark:text-slate-300 dark:shadow-card-dark'
                }`}
              >
                Woche {w.week}
              </button>
            ))}
          </div>

          {plan.weeks
            .filter((w) => w.week === activeWeek)
            .map((week: TrainingWeek) => (
              <div key={week.week} className="space-y-3">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Fokus: <span className="text-ink-900 dark:text-white">{week.focus}</span>
                </div>
                {week.days.map((day, i) => (
                  <DayCard key={i} day={day} sportColor={sport.color} />
                ))}
              </div>
            ))}

          <button
            onClick={() => {
              if (window.confirm('Plan löschen und neu generieren?')) reset();
            }}
            className="mt-4 w-full rounded-2xl bg-slate-100 py-3 text-sm font-semibold text-ink-900 dark:bg-ink-700 dark:text-white"
          >
            Plan neu generieren
          </button>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</div>
    {children}
  </div>
);

const ChoiceBtn = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${
      active
        ? 'border-ink-900 bg-ink-900 text-white dark:border-white dark:bg-white dark:text-ink-900'
        : 'border-slate-200 bg-white text-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-white'
    }`}
  >
    {children}
  </button>
);
