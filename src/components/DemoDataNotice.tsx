/**
 * Honest label for screens whose content is simulated. The community layer
 * ships with static fixtures (feed, buddies, mentors, …); this makes that
 * explicit instead of letting the data read as live.
 */
export const DemoDataNotice = ({ className = '' }: { className?: string }) => (
  <div
    className={`flex items-start gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-[11px] leading-snug text-slate-500 dark:border-ink-600 dark:bg-ink-800/60 dark:text-slate-400 ${className}`}
  >
    <span className="text-sm leading-none">ℹ️</span>
    <span>Beispieldaten — diese Community-Inhalte sind zu Demozwecken simuliert.</span>
  </div>
);
