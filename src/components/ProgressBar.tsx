interface Props {
  value: number; // 0–1
  color?: string;
  label?: string;
  showPct?: boolean;
}

export const ProgressBar = ({ value, color = '#0B0F14', label, showPct }: Props) => {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className="w-full">
      {(label || showPct) && (
        <div className="mb-1 flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>}
          {showPct && (
            <span className="font-semibold text-slate-700 dark:text-slate-200">{pct}%</span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-ink-700">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
};
