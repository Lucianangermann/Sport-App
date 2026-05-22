import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { CURRICULA, LEVEL_LABELS } from '../data/modules';
import { getSportById, moduleKey } from '../utils/helpers';
import { useAppStore } from '../store/useAppStore';
import type { SkillLevel } from '../types';

const isLevel = (v: string | undefined): v is SkillLevel =>
  v === 'anfaenger' || v === 'fortgeschritten' || v === 'profi';

export const LessonViewerPage = () => {
  const nav = useNavigate();
  const { id, level, moduleId } = useParams<{ id: string; level: string; moduleId: string }>();
  const sport = id ? getSportById(id) : undefined;
  const progress = useAppStore((s) => s.progress);
  const toggleModule = useAppStore((s) => s.toggleModule);

  if (!sport || !isLevel(level)) return <Navigate to="/discover" replace />;
  const modules = CURRICULA[sport.id][level];
  const idx = modules.findIndex((m) => m.id === moduleId);
  const module_ = idx >= 0 ? modules[idx] : undefined;
  if (!module_) return <Navigate to={`/sport/${sport.id}/${level}`} replace />;

  const key = moduleKey(sport.id, level, module_.id);
  const completed = !!progress[key];
  const meta = LEVEL_LABELS[level];
  const prev = modules[idx - 1];
  const next = modules[idx + 1];

  const onComplete = () => {
    toggleModule(sport.id, level, module_.id);
    if (next) {
      nav(`/sport/${sport.id}/${level}/${next.id}`, { replace: true });
    } else {
      nav(`/sport/${sport.id}/${level}`, { replace: true });
    }
  };

  return (
    <div>
      <PageHeader title={module_.title} subtitle={`${sport.name} · ${meta.label} · Modul ${idx + 1}/${modules.length}`} back />

      <div className="px-5 pb-8">
        {/* Video / Visual */}
        <div className="overflow-hidden rounded-2xl bg-black shadow-card dark:shadow-card-dark">
          {module_.ytVideoId ? (
            <div className="relative aspect-video w-full">
              <iframe
                title={module_.title}
                src={`https://www.youtube-nocookie.com/embed/${module_.ytVideoId}?rel=0&modestbranding=1`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <div
              className="flex aspect-video w-full items-center justify-center text-6xl"
              style={{ background: `linear-gradient(135deg, ${sport.color}, ${sport.color}cc)`, color: 'white' }}
            >
              {sport.emoji}
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span
            className="rounded-full px-2.5 py-1 text-white"
            style={{ background: sport.color }}
          >
            {meta.emoji} {meta.label}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-ink-700 dark:text-slate-200">
            ⏱ {module_.duration}
          </span>
          {module_.channel && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-ink-700 dark:text-slate-200">
              📺 {module_.channel}
            </span>
          )}
          {!module_.ytVideoId && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              Video folgt – Text-Lektion verfügbar
            </span>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{module_.description}</p>

        {/* Rich content */}
        {module_.content && (
          <div className="mt-5 space-y-5">
            {module_.content.intro && (
              <p className="text-sm leading-relaxed text-ink-900 dark:text-white">{module_.content.intro}</p>
            )}

            {module_.content.keyPoints && module_.content.keyPoints.length > 0 && (
              <Block title="Worauf du achten solltest" icon="🎯">
                <ul className="space-y-1.5">
                  {module_.content.keyPoints.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="font-bold" style={{ color: sport.color }}>
                        {i + 1}.
                      </span>
                      <span className="text-slate-700 dark:text-slate-200">{p}</span>
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {module_.content.tips && module_.content.tips.length > 0 && (
              <Block title="Tipps für die Praxis" icon="💡">
                <ul className="space-y-1.5">
                  {module_.content.tips.map((t, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-200">
                      • {t}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {module_.content.safety && module_.content.safety.length > 0 && (
              <Block title="Sicherheitshinweise" icon="🛡️" highlight="rose">
                <ul className="space-y-1.5">
                  {module_.content.safety.map((s, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-200">
                      • {s}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {module_.content.sources && module_.content.sources.length > 0 && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <div className="mb-1 font-semibold">Quellen</div>
                <ul className="space-y-0.5">
                  {module_.content.sources.map((src, i) => (
                    <li key={i}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-ink-900 dark:hover:text-white"
                      >
                        {src.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!module_.content && (
          <div className="mt-5 rounded-2xl border-2 border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-ink-700 dark:text-slate-400">
            Detaillierte Lektionsinhalte für dieses Modul folgen bald. Schaue dir das Video an und markiere
            das Modul danach als erledigt.
          </div>
        )}

        {/* Bottom CTAs */}
        <div className="mt-7 grid grid-cols-2 gap-2">
          {prev ? (
            <button
              onClick={() => nav(`/sport/${sport.id}/${level}/${prev.id}`, { replace: true })}
              className="rounded-2xl bg-slate-100 py-3.5 text-sm font-semibold text-ink-900 dark:bg-ink-700 dark:text-white"
            >
              ← Vorheriges
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={onComplete}
            className={`rounded-2xl py-3.5 text-sm font-semibold transition ${
              completed
                ? 'bg-emerald-600 text-white'
                : 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
            }`}
          >
            {completed ? '✓ Erledigt – nochmal?' : next ? 'Erledigt · Nächstes →' : 'Modul abschließen'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Block = ({
  title,
  icon,
  children,
  highlight,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  highlight?: 'rose';
}) => (
  <section
    className={`rounded-2xl p-4 ${
      highlight === 'rose'
        ? 'bg-rose-50 dark:bg-rose-900/15'
        : 'bg-white shadow-card dark:bg-ink-800 dark:shadow-card-dark'
    }`}
  >
    <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-ink-900 dark:text-white">
      <span>{icon}</span>
      <span>{title}</span>
    </h3>
    {children}
  </section>
);
