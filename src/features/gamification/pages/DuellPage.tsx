import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useDuelStore,
  DUEL_TYPES,
  TRASH_TALK_MESSAGES,
} from '../store/duelStore';
import type { Duel, DuelParticipant } from '../store/duelStore';
import { slideUp, fadeIn, scaleIn, staggerContainer } from '../utils/animations';

type Tab = 'aktiv' | 'anfragen' | 'abgeschlossen';

interface Toast {
  id: number;
  message: string;
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2200);
  };
  return { toasts, show };
}

function ToastLayer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-ink-900 dark:bg-white text-white dark:text-ink-900 px-4 py-2 rounded-full text-sm font-semibold shadow-xl"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function timeRemaining(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return 'Beendet';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `Noch ${days} Tage ${hours} Std`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `Noch ${hours} Std ${mins} Min`;
  return `Noch ${mins} Min`;
}

function TrashTalkSheet({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (msg: string) => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative bg-white dark:bg-ink-800 rounded-t-3xl p-6 pb-10"
      >
        <div className="w-10 h-1 bg-slate-200 dark:bg-ink-600 rounded-full mx-auto mb-5" />
        <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white mb-4">
          Trash Talk 💬
        </h2>
        <div className="flex flex-col gap-2">
          {TRASH_TALK_MESSAGES.slice(0, 6).map((msg, i) => (
            <button
              key={i}
              onClick={() => onSend(msg)}
              className="text-left px-4 py-3 rounded-2xl bg-slate-50 dark:bg-ink-700 text-sm text-ink-900 dark:text-white hover:bg-violet-50 dark:hover:bg-ink-600 transition-colors"
            >
              {msg}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

const MOCK_BUDDIES: DuelParticipant[] = [
  { userId: 'b1', name: 'Max Müller', avatar: 'https://i.pravatar.cc/48?img=1', score: 0 },
  { userId: 'b2', name: 'Sarah Klein', avatar: 'https://i.pravatar.cc/48?img=5', score: 0 },
  { userId: 'b3', name: 'Tom Becker', avatar: 'https://i.pravatar.cc/48?img=8', score: 0 },
  { userId: 'b4', name: 'Anna Schmidt', avatar: 'https://i.pravatar.cc/48?img=9', score: 0 },
  { userId: 'b5', name: 'Klaus Weber', avatar: 'https://i.pravatar.cc/48?img=12', score: 0 },
];

const DURATIONS = [
  { label: '3 Tage', days: 3 },
  { label: '1 Woche', days: 7 },
  { label: '2 Wochen', days: 14 },
];

function NewDuelModal({
  onClose,
  onSend,
}: {
  onClose: () => void;
  onSend: (opponent: DuelParticipant, duelType: Duel['duelType'], days: number) => void;
}) {
  const [step, setStep] = useState(1);
  const [selectedBuddy, setSelectedBuddy] = useState<DuelParticipant | null>(null);
  const [selectedType, setSelectedType] = useState<Duel['duelType'] | null>(null);
  const [selectedDays, setSelectedDays] = useState<number | null>(null);

  const canProceed =
    (step === 1 && selectedBuddy !== null) ||
    (step === 2 && selectedType !== null) ||
    (step === 3 && selectedDays !== null);

  const handleNext = () => {
    if (step < 4) setStep((s) => s + 1);
  };

  const handleSend = () => {
    if (selectedBuddy && selectedType && selectedDays) {
      onSend(selectedBuddy, selectedType, selectedDays);
    }
  };

  const selectedTypeInfo = DUEL_TYPES.find((dt) => dt.id === selectedType);
  const selectedDurationLabel = DURATIONS.find((d) => d.days === selectedDays)?.label;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative bg-white dark:bg-ink-800 rounded-t-3xl px-5 pt-5 pb-10 max-h-[85vh] overflow-y-auto"
      >
        <div className="w-10 h-1 bg-slate-200 dark:bg-ink-600 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white">
            Neues Duell
          </h2>
          <span className="text-sm text-slate-400 font-medium">{step}/4</span>
        </div>
        <div className="flex gap-1.5 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-violet-500' : 'bg-slate-100 dark:bg-ink-700'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3 className="font-semibold text-ink-900 dark:text-white mb-3">Gegner wählen</h3>
            <div className="flex flex-col gap-2">
              {MOCK_BUDDIES.map((buddy) => (
                <button
                  key={buddy.userId}
                  onClick={() => setSelectedBuddy(buddy)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                    selectedBuddy?.userId === buddy.userId
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-transparent bg-slate-50 dark:bg-ink-700'
                  }`}
                >
                  <img
                    src={buddy.avatar}
                    alt={buddy.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm text-ink-900 dark:text-white">{buddy.name}</p>
                    <p className="text-xs text-slate-400">Letzte Woche aktiv</p>
                  </div>
                  {selectedBuddy?.userId === buddy.userId && (
                    <span className="text-violet-500 font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-semibold text-ink-900 dark:text-white mb-3">Duell-Typ</h3>
            <div className="grid grid-cols-2 gap-3">
              {DUEL_TYPES.map((dt) => (
                <button
                  key={dt.id}
                  onClick={() => setSelectedType(dt.id as Duel['duelType'])}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    selectedType === dt.id
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-transparent bg-slate-50 dark:bg-ink-700'
                  }`}
                >
                  <span className="text-2xl block mb-2">{dt.icon}</span>
                  <p className="font-semibold text-sm text-ink-900 dark:text-white">{dt.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{dt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-semibold text-ink-900 dark:text-white mb-3">Dauer</h3>
            <div className="flex flex-col gap-3">
              {DURATIONS.map((d) => (
                <button
                  key={d.days}
                  onClick={() => setSelectedDays(d.days)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    selectedDays === d.days
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-transparent bg-slate-50 dark:bg-ink-700'
                  }`}
                >
                  <span className="font-semibold text-ink-900 dark:text-white">{d.label}</span>
                  {selectedDays === d.days && (
                    <span className="text-violet-500 font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && selectedBuddy && selectedTypeInfo && selectedDurationLabel && (
          <div>
            <h3 className="font-semibold text-ink-900 dark:text-white mb-4">Bestätigung</h3>
            <div className="bg-slate-50 dark:bg-ink-700 rounded-2xl p-4 space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Gegner</span>
                <div className="flex items-center gap-2">
                  <img
                    src={selectedBuddy.avatar}
                    alt={selectedBuddy.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-semibold text-ink-900 dark:text-white">
                    {selectedBuddy.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Typ</span>
                <span className="text-sm font-semibold text-ink-900 dark:text-white">
                  {selectedTypeInfo.icon} {selectedTypeInfo.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Dauer</span>
                <span className="text-sm font-semibold text-ink-900 dark:text-white">
                  {selectedDurationLabel}
                </span>
              </div>
            </div>
            <button
              onClick={handleSend}
              className="w-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 py-4 rounded-2xl font-display font-bold text-lg"
            >
              Duell senden ✉️
            </button>
          </div>
        )}

        {step < 4 && (
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`w-full mt-6 py-4 rounded-2xl font-display font-bold text-lg transition-all ${
              canProceed
                ? 'bg-ink-900 dark:bg-white text-white dark:text-ink-900'
                : 'bg-slate-100 dark:bg-ink-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            Weiter
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function ActiveDuelCard({
  duel,
  onTrashTalk,
}: {
  duel: Duel;
  onTrashTalk: () => void;
}) {
  const myScore = duel.challenger.score;
  const theirScore = duel.opponent.score;
  const total = myScore + theirScore || 1;
  const myPercent = Math.round((myScore / total) * 100);
  const theirPercent = 100 - myPercent;

  return (
    <motion.div
      variants={slideUp}
      className="bg-white dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark p-5 mx-5 mb-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{duel.sportEmoji}</span>
        <div>
          <p className="font-display font-bold text-ink-900 dark:text-white capitalize">
            {duel.sport}
          </p>
          <p className="text-xs text-slate-400">{duel.metric}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{duel.challenger.avatar}</div>
          <p className="text-xs font-medium text-ink-900 dark:text-white truncate">
            {duel.challenger.name}
          </p>
          <p className="text-4xl font-display font-black text-violet-600">
            {duel.challenger.score}
          </p>
        </div>
        <div className="text-sm font-bold text-slate-300 dark:text-slate-500">VS</div>
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{duel.opponent.avatar}</div>
          <p className="text-xs font-medium text-ink-900 dark:text-white truncate">
            {duel.opponent.name}
          </p>
          <p className="text-4xl font-display font-black text-slate-400 dark:text-slate-300">
            {duel.opponent.score}
          </p>
        </div>
      </div>

      <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-3">
        <motion.div
          className="bg-violet-500 rounded-l-full"
          initial={{ width: 0 }}
          animate={{ width: `${myPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <motion.div
          className="bg-slate-200 dark:bg-ink-600 flex-1 rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${theirPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
          ⏳ {timeRemaining(duel.endsAt)}
        </span>
        <button
          onClick={onTrashTalk}
          className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 px-3 py-1 rounded-full"
        >
          Trash Talk 💬
        </button>
      </div>
    </motion.div>
  );
}

function PendingDuelCard({
  duel,
  onAccept,
  onDecline,
}: {
  duel: Duel;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <motion.div
      variants={slideUp}
      className="bg-white dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark p-4 mx-5 mb-3"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">{duel.challenger.avatar}</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink-900 dark:text-white text-sm">
            {duel.challenger.name}
          </p>
          <p className="text-xs text-slate-400">
            {duel.sportEmoji} {duel.sport} · {duel.metric}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="flex-1 bg-emerald-500 text-white py-2.5 rounded-2xl text-sm font-bold"
        >
          Annehmen ✓
        </button>
        <button
          onClick={onDecline}
          className="flex-1 bg-slate-100 dark:bg-ink-700 text-slate-500 dark:text-slate-300 py-2.5 rounded-2xl text-sm font-semibold"
        >
          Ablehnen
        </button>
      </div>
    </motion.div>
  );
}

function CompletedDuelCard({
  duel,
  onRevanche,
}: {
  duel: Duel;
  onRevanche: () => void;
}) {
  const iWon = duel.winner === duel.challenger.userId;

  return (
    <motion.div
      variants={slideUp}
      className="bg-white dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark p-4 mx-5 mb-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{duel.sportEmoji}</span>
          <div>
            <p className="font-semibold text-sm text-ink-900 dark:text-white capitalize">
              {duel.sport}
            </p>
            <p className="text-xs text-slate-400">{duel.metric}</p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            iWon
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-slate-100 dark:bg-ink-700 text-slate-500 dark:text-slate-300'
          }`}
        >
          {iWon ? 'Gewonnen 🥇' : 'Verloren 💪'}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className="font-bold text-violet-600">{duel.challenger.score}</span>
        <span className="text-slate-300">vs</span>
        <span className="font-bold text-slate-400">{duel.opponent.score}</span>
        <span className="text-slate-400">({duel.opponent.name})</span>
      </div>
      <button
        onClick={onRevanche}
        className="w-full bg-slate-100 dark:bg-ink-700 text-ink-900 dark:text-white py-2.5 rounded-2xl text-sm font-semibold"
      >
        Revanche 🔄
      </button>
    </motion.div>
  );
}

export const DuellPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('aktiv');
  const [trashTalkDuelId, setTrashTalkDuelId] = useState<string | null>(null);
  const [showNewDuelModal, setShowNewDuelModal] = useState(false);
  const { toasts, show: showToast } = useToast();
  const { duels, pendingDuels, completedDuels, sendDuel, acceptDuel, declineDuel } =
    useDuelStore();

  const activeDuels = duels.filter((d) => d.status === 'active');

  const handleSendDuel = (
    opponent: DuelParticipant,
    duelType: Duel['duelType'],
    days: number
  ) => {
    sendDuel(opponent, duelType, days);
    setShowNewDuelModal(false);
    showToast('Duell gesendet! ✉️');
  };

  const handleAccept = (id: string) => {
    acceptDuel(id);
    showToast('Duell angenommen! ⚔️');
  };

  const handleDecline = (id: string) => {
    declineDuel(id);
    showToast('Duell abgelehnt');
  };

  const handleTrashTalkSend = () => {
    setTrashTalkDuelId(null);
    showToast('Gesendet!');
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'aktiv', label: 'Aktiv', count: activeDuels.length },
    { key: 'anfragen', label: 'Anfragen', count: pendingDuels.length },
    { key: 'abgeschlossen', label: 'Abgeschlossen' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-900 pb-24">
      <ToastLayer toasts={toasts} />

      <header className="sticky top-0 z-10 bg-slate-50/90 dark:bg-ink-900/90 backdrop-blur px-5 pt-5 pb-3">
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Duelle ⚔️</h1>
      </header>

      <div className="flex gap-1 mx-5 mt-2 mb-4 bg-slate-100 dark:bg-ink-800 p-1 rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === tab.key
                ? 'bg-white dark:bg-ink-700 text-ink-900 dark:text-white shadow-card'
                : 'text-slate-400'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-violet-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'aktiv' && (
          <motion.div
            key="aktiv"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {activeDuels.length === 0 ? (
              <motion.div variants={fadeIn} className="text-center py-16 px-5">
                <div className="text-6xl mb-3">⚔️</div>
                <p className="font-display font-bold text-ink-900 dark:text-white text-lg mb-1">
                  Keine aktiven Duelle
                </p>
                <p className="text-sm text-slate-400">Fordere einen Freund heraus!</p>
              </motion.div>
            ) : (
              activeDuels.map((duel) => (
                <ActiveDuelCard
                  key={duel.id}
                  duel={duel}
                  onTrashTalk={() => setTrashTalkDuelId(duel.id)}
                />
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'anfragen' && (
          <motion.div
            key="anfragen"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {pendingDuels.length === 0 ? (
              <motion.div variants={fadeIn} className="text-center py-16 px-5">
                <div className="text-6xl mb-3">📬</div>
                <p className="font-display font-bold text-ink-900 dark:text-white text-lg mb-1">
                  Keine Anfragen
                </p>
                <p className="text-sm text-slate-400">Du bist auf dem neuesten Stand!</p>
              </motion.div>
            ) : (
              pendingDuels.map((duel) => (
                <PendingDuelCard
                  key={duel.id}
                  duel={duel}
                  onAccept={() => handleAccept(duel.id)}
                  onDecline={() => handleDecline(duel.id)}
                />
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'abgeschlossen' && (
          <motion.div
            key="abgeschlossen"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {completedDuels.length === 0 ? (
              <motion.div variants={fadeIn} className="text-center py-16 px-5">
                <div className="text-6xl mb-3">🏁</div>
                <p className="font-display font-bold text-ink-900 dark:text-white text-lg mb-1">
                  Keine abgeschlossenen Duelle
                </p>
              </motion.div>
            ) : (
              completedDuels.map((duel) => (
                <CompletedDuelCard
                  key={duel.id}
                  duel={duel}
                  onRevanche={() => showToast('Anfrage gesendet! 🔄')}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'aktiv' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNewDuelModal(true)}
          className="fixed bottom-24 right-5 w-14 h-14 bg-ink-900 dark:bg-white text-white dark:text-ink-900 rounded-full shadow-xl flex items-center justify-center text-2xl font-bold z-20"
          aria-label="Neues Duell"
        >
          +
        </motion.button>
      )}

      <AnimatePresence>
        {trashTalkDuelId !== null && (
          <TrashTalkSheet
            onClose={() => setTrashTalkDuelId(null)}
            onSend={handleTrashTalkSend}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewDuelModal && (
          <NewDuelModal
            onClose={() => setShowNewDuelModal(false)}
            onSend={handleSendDuel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
