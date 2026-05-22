interface Props {
  emoji: string;
  title: string;
  body?: string;
  cta?: React.ReactNode;
}

export const EmptyState = ({ emoji, title, body, cta }: Props) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-8 text-center shadow-card">
    <div className="text-5xl">{emoji}</div>
    <h3 className="font-display text-lg font-bold">{title}</h3>
    {body && <p className="text-sm text-slate-500">{body}</p>}
    {cta}
  </div>
);
