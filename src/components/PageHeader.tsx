import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  dark?: boolean;
}

export const PageHeader = ({ title, subtitle, back, right, dark }: Props) => {
  const nav = useNavigate();
  const darkSurface = dark
    ? 'bg-ink-900 text-white dark:bg-ink-800'
    : 'bg-slate-50/90 text-ink-900 dark:bg-ink-900/90 dark:text-white';
  return (
    <header className={`sticky top-0 z-10 ${darkSurface} px-5 pt-5 pb-3 backdrop-blur`}>
      <div className="flex items-center gap-3">
        {back && (
          <button
            onClick={() => nav(-1)}
            className={`-ml-2 flex h-9 w-9 items-center justify-center rounded-full ${
              dark
                ? 'bg-white/10 text-white'
                : 'bg-white text-ink-900 shadow-card dark:bg-ink-700 dark:text-white dark:shadow-card-dark'
            }`}
            aria-label="Zurück"
          >
            ←
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold leading-tight truncate">{title}</h1>
          {subtitle && (
            <p className={`text-sm ${dark ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {right}
      </div>
    </header>
  );
};
