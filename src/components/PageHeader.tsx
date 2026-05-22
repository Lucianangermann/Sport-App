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
  return (
    <header
      className={`sticky top-0 z-10 ${dark ? 'bg-ink-900 text-white' : 'bg-slate-50/90 text-ink-900'} px-5 pt-5 pb-3 backdrop-blur`}
    >
      <div className="flex items-center gap-3">
        {back && (
          <button
            onClick={() => nav(-1)}
            className={`-ml-2 flex h-9 w-9 items-center justify-center rounded-full ${
              dark ? 'bg-white/10 text-white' : 'bg-white text-ink-900 shadow-card'
            }`}
            aria-label="Zurück"
          >
            ←
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold leading-tight truncate">{title}</h1>
          {subtitle && <p className={`text-sm ${dark ? 'text-white/70' : 'text-slate-500'}`}>{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
};
