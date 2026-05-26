import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPORTS } from '../../../data/sports';
import type { Sport } from '../../../types';
import { bounceIn, staggerContainer, slideUp } from '../utils/animations';
import { PageHeader } from '../../../components/PageHeader';

const UNLOCKED_COUNT = 8;

interface StampDetailSheetProps {
  sport: Sport;
  onClose: () => void;
}

function StampDetailSheet({ sport, onClose }: StampDetailSheetProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        className="relative w-full max-w-sm mx-4 mb-4 rounded-3xl bg-white p-6 shadow-2xl"
        variants={slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-5xl">{sport.emoji}</span>
          <p className="font-display text-xl font-bold text-ink-900">{sport.name}</p>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Freigeschaltet am: 15.01.2026
          </span>
          <p className="text-sm text-slate-500">{sport.description}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-ink-900 py-3 text-sm font-bold text-white"
        >
          Schließen
        </button>
      </motion.div>
    </motion.div>
  );
}

interface ShareModalProps {
  onClose: () => void;
}

function ShareModal({ onClose }: ShareModalProps) {
  const previewSports = SPORTS.slice(0, 6);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        className="relative w-full max-w-sm mx-4 mb-4 rounded-3xl bg-white p-5 shadow-2xl"
        variants={slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-4 text-center font-display text-base font-bold text-ink-900">
          Mein Sport-Passport
        </p>
        <div className="rounded-2xl bg-[#2d5a27] p-4">
          <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-white/60">
            Sportify Passport
          </p>
          <div className="grid grid-cols-3 gap-2">
            {previewSports.map((sport) => (
              <div
                key={sport.id}
                className="flex flex-col items-center gap-1 rounded-full bg-white/20 py-2"
              >
                <span className="text-xl">{sport.emoji}</span>
                <span className="text-[9px] font-semibold text-white">{sport.name}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-white/70">8 / 30 Stempel gesammelt</p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-ink-900 py-3 text-sm font-bold text-white"
        >
          Schließen
        </button>
      </motion.div>
    </motion.div>
  );
}

export function PassportPage() {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const handleStampTap = (sport: Sport, index: number) => {
    if (index < UNLOCKED_COUNT) {
      setSelectedSport(sport);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] pb-28">
      <PageHeader title="Passport" back />

      <div className="bg-[#2d5a27] px-5 pb-8 pt-4 rounded-b-3xl text-white">
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/150?u=me"
            alt="Avatar"
            className="h-16 w-16 rounded-full border-2 border-white/30 object-cover flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              Sportify Passport
            </p>
            <p className="font-display text-sm font-bold uppercase tracking-widest">
              Bundesrepublik Sportify
            </p>
            <p className="mt-1 text-sm font-semibold">Mein Profil</p>
            <p className="text-xs text-white/60">Mitglied seit 2026</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-2.5 text-xs">
          <span className="font-semibold">8 / 30 Stempel</span>
          <span className="h-3 w-px bg-white/20" />
          <span className="font-semibold">Passport Level: Silber</span>
          <span className="h-3 w-px bg-white/20" />
          <span className="text-white/70">Letzte: Laufen</span>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-3 px-5 py-4"
      >
        {SPORTS.map((sport, index) => {
          const unlocked = index < UNLOCKED_COUNT;

          if (unlocked) {
            return (
              <motion.button
                key={sport.id}
                variants={bounceIn}
                onClick={() => handleStampTap(sport, index)}
                className="flex aspect-square w-full flex-col items-center justify-center rounded-full border-4 bg-white shadow-md"
                style={{
                  borderColor: sport.color,
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * ((index % 3) + 1)}deg)`,
                }}
                whileTap={{ scale: 0.93 }}
              >
                <span className="text-2xl">{sport.emoji}</span>
                <span className="mt-0.5 w-full truncate px-1 text-center text-[10px] font-semibold text-ink-900">
                  {sport.name}
                </span>
              </motion.button>
            );
          }

          return (
            <div
              key={sport.id}
              className="flex aspect-square w-full items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white/50"
            >
              <span className="text-xl text-gray-400">?</span>
            </div>
          );
        })}
      </motion.div>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-[#2d5a27] px-5 py-3 text-sm font-bold text-white shadow-lg active:opacity-90"
        >
          Teilen 🔗
        </button>
      </div>

      <AnimatePresence>
        {selectedSport !== null && (
          <StampDetailSheet
            sport={selectedSport}
            onClose={() => setSelectedSport(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
