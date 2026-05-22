import { Navigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { CURRICULA, LEVEL_LABELS } from '../data/modules';
import { getSportById, moduleKey } from '../utils/helpers';
import { useAppStore } from '../store/useAppStore';
import { ProgressBar } from '../components/ProgressBar';
import type { SkillLevel } from '../types';

const isLevel = (v: string | undefined): v is SkillLevel =>
  v === 'anfaenger' || v === 'fortgeschritten' || v === 'profi';

export const LevelDetailPage = () => {
  const { id, level } = useParams<{ id: string; level: string }>();
  const sport = id ? getSportById(id) : undefined;
  const progress = useAppStore((s) => s.progress);
  const toggleModule = useAppStore((s) => s.toggleModule);

  if (!sport || !isLevel(level)) return <Navigate to="/discover" replace />;

  const meta = LEVEL_LABELS[level];
  const modules = CURRICULA[sport.id][level];
  const done = modules.filter((m) => progress[moduleKey(sport.id, level, m.id)]).length;
  const ratio = done / modules.length;

  return (
    <div>
      <PageHeader title={`${meta.emoji} ${meta.label}`} subtitle={`${sport.name} · ${meta.subtitle}`} back />

      <section className="px-5">
        <div className="rounded-2xl p-4 text-white" style={{ background: sport.color }}>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Dein Fortschritt</span>
            <span>{done}/{modules.length} Module</span>
          </div>
          <div className="mt-2">
            <ProgressBar value={ratio} color="rgba(255,255,255,0.95)" />
          </div>
          <div className="mt-1 text-[11px] text-white/80">
            Jedes Modul gibt dir 25 XP. Vollständig abgeschlossen: +{modules.length * 25} XP.
          </div>
        </div>
      </section>

      <section className="space-y-3 px-5 pt-5 pb-8">
        {modules.map((m, idx) => {
          const key = moduleKey(sport.id, level, m.id);
          const completed = !!progress[key];
          return (
            <div
              key={m.id}
              className={`rounded-2xl border-2 bg-white p-4 transition ${
                completed ? 'border-emerald-200 bg-emerald-50/40' : 'border-transparent shadow-card'
              }`}
            >
              <div className="flex gap-3">
                <div className="aspect-video w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <div
                    className="flex h-full w-full items-center justify-center text-2xl"
                    style={{ background: `${sport.color}1f` }}
                  >
                    ▶︎
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Modul {idx + 1} · {m.duration}
                  </div>
                  <div className="font-display text-base font-bold">{m.title}</div>
                  <p className="text-xs text-slate-500">{m.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleModule(sport.id, level, m.id)}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
                  completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-ink-900 text-white'
                }`}
              >
                {completed ? '✓ Abgeschlossen' : 'Als erledigt markieren'}
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
};
