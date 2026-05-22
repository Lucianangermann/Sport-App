interface Props {
  emoji: string;
  title: string;
  body?: string;
  cta?: React.ReactNode;
}

export const EmptyState = ({ emoji, title, body, cta }: Props) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-8 text-center shadow-card dark:bg-ink-800 dark:shadow-card-dark">
    <div className="text-5xl">{emoji}</div>
    <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">{title}</h3>
    {body && <p className="text-sm text-slate-500 dark:text-slate-400">{body}</p>}
    {cta}
  </div>
);
