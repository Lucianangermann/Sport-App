import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestStore } from '../store/questStore';
import type { ActiveQuest } from '../store/questStore';

const TYPE_COLORS: Record<string, string> = {
  training: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  social: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400',
  discovery: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  challenge: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
};

function getMidnightCountdown(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface XpFloatProps {
  xp: number;
  onDone: () => void;
}

function XpFloat({ xp, onDone }: XpFloatProps) {
  return (
    <motion.div
      className="pointer-events-none absolute right-0 top-0 z-10 text-sm font-bold text-emerald-500"
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: -40, opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      onAnimationComplete={onDone}
    >
      +{xp} XP
    </motion.div>
  );
}

interface QuestRowProps {
  quest: ActiveQuest;
}

function QuestRow({ quest }: QuestRowProps) {
  const claimReward = useQuestStore((s) => s.claimReward);
  const [showFloat, setShowFloat] = useState(false);

  const handleClaim = () => {
    claimReward(quest.id);
    setShowFloat(true);
  };

  const progressPct = Math.min(100, Math.round((quest.progress / quest.target) * 100));

  return (
    <motion.div
      layout
      className="relative flex items-center gap-3 rounded-2xl px-3 py-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      {showFloat && (
        <XpFloat xp={quest.xp} onDone={() => setShowFloat(false)} />
      )}

      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg ${TYPE_COLORS[quest.type] ?? 'bg-slate-100 text-slate-500'}`}>
        {quest.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">{quest.title}</p>
          <span className="flex-shrink-0 rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            {quest.xp} XP
          </span>
        </div>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{quest.desc}</p>

        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-ink-700">
          <motion.div
            className="h-full rounded-full bg-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {quest.progress}/{quest.target} {quest.unit}
          </p>

          {quest.completed && !quest.claimed && (
            <motion.button
              onClick={handleClaim}
              whileTap={{ scale: 0.92 }}
              className="rounded-xl bg-emerald-500 px-3 py-0.5 text-[11px] font-bold text-white shadow-sm active:bg-emerald-600"
            >
              Einlösen
            </motion.button>
          )}

          {quest.claimed && (
            <span className="text-[11px] font-semibold text-emerald-500">
              Erledigt ✓
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

type Tab = 'daily' | 'weekly';

export function QuestBoard() {
  const dailyQuests = useQuestStore((s) => s.dailyQuests);
  const weeklyQuests = useQuestStore((s) => s.weeklyQuests);
  const forceRefresh = useQuestStore((s) => s.forceRefresh);

  const [tab, setTab] = useState<Tab>('daily');
  const [countdown, setCountdown] = useState(getMidnightCountdown());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCountdown(getMidnightCountdown());
    }, 1000);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  const quests = tab === 'daily' ? dailyQuests : weeklyQuests;
  const allClaimed = quests.length > 0 && quests.every((q) => q.claimed);

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card dark:bg-ink-800 dark:shadow-card-dark">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <p className="font-display text-base font-bold text-ink-900 dark:text-white">Quests</p>
        <button
          onClick={forceRefresh}
          className="rounded-xl px-2 py-1 text-sm text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Quests neu laden"
        >
          ↻
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-ink-700">
          {(['daily', 'weekly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                tab === t
                  ? 'text-ink-900 dark:text-white'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="quest-tab-pill"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-ink-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">
                {t === 'daily' ? 'Täglich' : 'Wöchentlich'}
              </span>
            </button>
          ))}
        </div>

        {tab === 'daily' && (
          <p className="ml-auto flex-shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
            Neu in {countdown}
          </p>
        )}
      </div>

      <div className="divide-y divide-slate-50 px-1 pb-3 dark:divide-ink-700">
        <AnimatePresence mode="popLayout">
          {allClaimed ? (
            <motion.div
              key="all-done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-sm text-slate-400 dark:text-slate-500"
            >
              Alle Quests erledigt! 🎉
            </motion.div>
          ) : quests.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-sm text-slate-400 dark:text-slate-500"
            >
              Keine Quests verfügbar
            </motion.div>
          ) : (
            quests.map((quest) => (
              <QuestRow key={quest.id} quest={quest} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
