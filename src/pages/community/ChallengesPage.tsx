import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { DemoDataNotice } from '../../components/DemoDataNotice';
import { useCommunityStore } from '../../features/community/store/communityStore';
import { LeaderboardRow } from '../../features/community/components/LeaderboardRow';
import type { Challenge } from '../../data/community';

const daysUntil = (deadline: string): number => {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / 86400000));
};

const calcProgressPct = (current: number, target: number): number =>
  Math.min(100, Math.round((current / target) * 100));

interface ActiveChallengeCardProps {
  challenge: Challenge;
  onClick: () => void;
}

const ActiveChallengeCard = ({ challenge, onClick }: ActiveChallengeCardProps) => {
  const pct = calcProgressPct(challenge.userProgress, challenge.target);
  const days = daysUntil(challenge.deadline);

  return (
    <button
      onClick={onClick}
      className="flex w-40 shrink-0 flex-col gap-2 rounded-2xl p-4 text-left shadow-card transition-transform active:scale-95 dark:shadow-card-dark"
      style={{ backgroundColor: challenge.color + '22' }}
    >
      <span className="text-3xl leading-none">{challenge.badge}</span>
      <p className="text-xs font-bold leading-tight text-ink-900 dark:text-white line-clamp-2">
        {challenge.title}
      </p>
      <div className="w-full overflow-hidden rounded-full bg-slate-200 dark:bg-ink-600" style={{ height: 6 }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: challenge.color }}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Noch {days} {days === 1 ? 'Tag' : 'Tage'}
      </p>
    </button>
  );
};

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: () => void;
  onLeave: () => void;
  onClick: () => void;
  joinedAnimation: boolean;
}

const ChallengeCard = ({ challenge, onJoin, onLeave, onClick, joinedAnimation }: ChallengeCardProps) => {
  const pct = calcProgressPct(challenge.userProgress, challenge.target);
  const days = daysUntil(challenge.deadline);

  return (
    <article className="rounded-2xl bg-white shadow-card dark:bg-ink-800 dark:shadow-card-dark overflow-hidden">
      <button onClick={onClick} className="w-full text-left">
        <div
          className="flex items-center gap-3 px-4 pt-4 pb-3"
          style={{ borderBottom: `2px solid ${challenge.color}33` }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
            style={{ backgroundColor: challenge.color + '22' }}
          >
            {challenge.badge}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-ink-900 dark:text-white">
                {challenge.title}
              </p>
              <span className="text-base leading-none">{challenge.sportEmoji}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {challenge.participantCount} Teilnehmer · Noch {days} Tage
            </p>
          </div>
        </div>

        <div className="px-4 py-3 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {challenge.description}
          </p>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {challenge.userProgress} / {challenge.target} {challenge.unit}
              </span>
              <span className="text-xs font-semibold" style={{ color: challenge.color }}>
                {pct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-ink-700">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: challenge.color }}
              />
            </div>
          </div>
        </div>
      </button>

      <div className="px-4 pb-4">
        {challenge.isJoined ? (
          <>
            {joinedAnimation && (
              <div className="flex items-center justify-center rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white animate-fade-in">
                Beigetreten! ✓
              </div>
            )}
            {!joinedAnimation && (
              <button
                onClick={(e) => { e.stopPropagation(); onLeave(); }}
                className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-ink-600 dark:text-slate-300 dark:hover:bg-ink-700"
              >
                Verlassen
              </button>
            )}
          </>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onJoin(); }}
            className="w-full rounded-2xl py-3 text-sm font-semibold text-white transition-opacity active:opacity-80"
            style={{ backgroundColor: challenge.color }}
          >
            Mitmachen
          </button>
        )}
      </div>
    </article>
  );
};

interface ChallengeDetailSheetProps {
  challenge: Challenge;
  onClose: () => void;
  onJoin: () => void;
  onLeave: () => void;
  onLogProgress: (amount: number) => void;
  joinedAnimation: boolean;
}

const ChallengeDetailSheet = ({
  challenge,
  onClose,
  onJoin,
  onLeave,
  onLogProgress,
  joinedAnimation,
}: ChallengeDetailSheetProps) => {
  const [progressInput, setProgressInput] = useState('1');
  const pct = calcProgressPct(challenge.userProgress, challenge.target);
  const days = daysUntil(challenge.deadline);

  const handleLogSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(progressInput);
    if (isNaN(amount) || amount <= 0) return;
    onLogProgress(amount);
    setProgressInput('1');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-slide-up rounded-t-3xl bg-white dark:bg-ink-800 max-h-[90vh] overflow-y-auto">
        <div
          className="sticky top-0 z-10 rounded-t-3xl px-5 pt-5 pb-4"
          style={{ backgroundColor: challenge.color + '22', borderBottom: `2px solid ${challenge.color}44` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shrink-0"
                style={{ backgroundColor: challenge.color + '33' }}
              >
                {challenge.badge}
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">
                  {challenge.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {challenge.sportEmoji} {challenge.sport} · Noch {days} Tage
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/60 text-ink-900 dark:bg-ink-700 dark:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 pb-10">
          <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-300">
            {challenge.description}
          </p>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink-900 dark:text-white">
                Dein Fortschritt
              </span>
              <span className="text-sm font-bold" style={{ color: challenge.color }}>
                {challenge.userProgress} / {challenge.target} {challenge.unit}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-ink-700">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: challenge.color }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">
              {pct}% abgeschlossen
            </p>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Teilnehmer
            </p>
            <p className="text-sm text-ink-900 dark:text-white">
              {challenge.participantCount} Sportler nehmen teil
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-ink-900 dark:text-white">
              Bestenliste (Top 5)
            </p>
            <div className="space-y-2">
              {challenge.leaderboard.slice(0, 5).map((entry) => (
                <LeaderboardRow key={entry.userId} entry={entry} target={challenge.target} />
              ))}
            </div>
          </div>

          {challenge.isJoined && (
            <div>
              <p className="mb-2 text-sm font-bold text-ink-900 dark:text-white">
                Fortschritt loggen
              </p>
              <form onSubmit={handleLogSubmit} className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={progressInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setProgressInput(e.target.value)}
                  className="w-20 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-ink-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 dark:border-ink-600 dark:bg-ink-700 dark:text-white"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400 shrink-0">
                  {challenge.unit}
                </span>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl py-2.5 text-sm font-semibold text-white transition-opacity active:opacity-80"
                  style={{ backgroundColor: challenge.color }}
                >
                  Fortschritt loggen
                </button>
              </form>
            </div>
          )}

          <div className="pt-2">
            {challenge.isJoined ? (
              <>
                {joinedAnimation && (
                  <div className="w-full rounded-2xl bg-emerald-500 py-3 text-center text-sm font-semibold text-white animate-fade-in">
                    Beigetreten! ✓
                  </div>
                )}
                {!joinedAnimation && (
                  <button
                    onClick={onLeave}
                    className="w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-ink-600 dark:text-slate-300 dark:hover:bg-ink-700"
                  >
                    Challenge verlassen
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={onJoin}
                className="w-full rounded-2xl py-3 text-sm font-semibold text-white transition-opacity active:opacity-80"
                style={{ backgroundColor: challenge.color }}
              >
                Jetzt mitmachen
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChallengesPage = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [joinedAnimations, setJoinedAnimations] = useState<Record<string, boolean>>({});

  const challenges = useCommunityStore((s) => s.challenges);
  const joinChallenge = useCommunityStore((s) => s.joinChallenge);
  const leaveChallenge = useCommunityStore((s) => s.leaveChallenge);
  const logChallengeProgress = useCommunityStore((s) => s.logChallengeProgress);

  const activeChallenges = challenges.filter((c) => c.isJoined);

  const handleJoin = (id: string) => {
    joinChallenge(id);
    setJoinedAnimations((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setJoinedAnimations((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleLeave = (id: string) => {
    leaveChallenge(id);
  };

  const handleLogProgress = (id: string, amount: number) => {
    logChallengeProgress(id, amount);
  };

  const syncedChallenge = selectedChallenge
    ? (challenges.find((c) => c.id === selectedChallenge.id) ?? selectedChallenge)
    : null;

  return (
    <div className="pb-24">
      <PageHeader title="Challenges" back />
      <DemoDataNotice className="mx-5 mt-3" />

      <div className="space-y-6 pt-4">
        {activeChallenges.length > 0 && (
          <section className="px-4">
            <h2 className="mb-3 font-display text-base font-bold text-ink-900 dark:text-white">
              Meine Challenges
            </h2>
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
              {activeChallenges.map((c) => (
                <ActiveChallengeCard key={c.id} challenge={c} onClick={() => setSelectedChallenge(c)} />
              ))}
            </div>
          </section>
        )}

        <section className="px-4">
          <h2 className="mb-3 font-display text-base font-bold text-ink-900 dark:text-white">
            Alle Challenges
          </h2>
          <div className="space-y-4">
            {challenges.map((c) => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                onJoin={() => handleJoin(c.id)}
                onLeave={() => handleLeave(c.id)}
                onClick={() => setSelectedChallenge(c)}
                joinedAnimation={!!joinedAnimations[c.id]}
              />
            ))}
          </div>
        </section>
      </div>

      {syncedChallenge && (
        <ChallengeDetailSheet
          challenge={syncedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onJoin={() => handleJoin(syncedChallenge.id)}
          onLeave={() => handleLeave(syncedChallenge.id)}
          onLogProgress={(amount) => handleLogProgress(syncedChallenge.id, amount)}
          joinedAnimation={!!joinedAnimations[syncedChallenge.id]}
        />
      )}
    </div>
  );
};
