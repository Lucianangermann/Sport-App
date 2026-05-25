import { useState } from 'react';
import type { LiveSession } from '../../data/community';
import { PageHeader } from '../../components/PageHeader';
import { useCommunityStore } from '../../features/community/store/communityStore';
import { UserAvatar } from '../../features/community/components/UserAvatar';
import { LiveBadge } from '../../features/community/components/LiveBadge';
import { SportBadge } from '../../features/community/components/SportBadge';

interface FloatingEmoji {
  id: number;
  emoji: string;
}

const REACTIONS = ['🔥', '❤️', '💪', '👏', '🙌'];

const formatSessionDate = (iso: string): string => {
  const date = new Date(iso);
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const day = days[date.getDay()];
  const d = date.getDate();
  const month = months[date.getMonth()];
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${day}, ${d}. ${month} · ${h}:${m} Uhr`;
};

export const LiveSessionsPage = () => {
  const { liveSessions, toggleLiveReminder } = useCommunityStore();
  const [playerSession, setPlayerSession] = useState<LiveSession | null>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [toastVisible, setToastVisible] = useState(false);

  const now = new Date();
  const liveSession = liveSessions.find((s) => new Date(s.scheduledAt) <= now) ?? liveSessions[0];
  const upcoming = liveSessions.filter((s) => s.id !== liveSession?.id);

  const handleReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    setFloatingEmojis((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 1000);
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-900 pb-24">
      <PageHeader title="Live Sessions" back />

      <div className="px-5 space-y-8 pt-4">
        {liveSession && (
          <section>
            <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white mb-3">
              Jetzt Live
            </h2>
            <button
              className="relative w-full rounded-2xl overflow-hidden focus:outline-none"
              onClick={() => setPlayerSession(liveSession)}
            >
              <div className="aspect-video w-full">
                <img
                  src={liveSession.thumbnail}
                  alt={liveSession.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <LiveBadge />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display text-lg font-bold text-white leading-snug mb-2">
                  {liveSession.title}
                </p>
                <div className="flex items-center gap-2">
                  <UserAvatar src={liveSession.hostAvatar} size="sm" />
                  <span className="text-sm text-white/90">{liveSession.hostName}</span>
                  <span className="ml-auto text-xs text-white/70">
                    👁 {liveSession.participantCount}
                  </span>
                </div>
              </div>
            </button>
          </section>
        )}

        <section>
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white mb-3">
            Kommende Sessions
          </h2>
          <div className="space-y-4">
            {upcoming.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl bg-white dark:bg-ink-800 shadow-card dark:shadow-card-dark overflow-hidden"
              >
                <div className="aspect-video w-full">
                  <img
                    src={session.thumbnail}
                    alt={session.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <SportBadge sportId={session.sport} small />
                    <span className="text-base">{session.sportEmoji}</span>
                  </div>
                  <p className="font-display text-base font-bold text-ink-900 dark:text-white leading-snug">
                    {session.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <UserAvatar src={session.hostAvatar} size="sm" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {session.hostName}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>🗓 {formatSessionDate(session.scheduledAt)}</span>
                    <span>⏱ {session.durationMin} Min</span>
                    <span>
                      👥 {session.participantCount}/{session.maxParticipants}
                    </span>
                  </div>
                  {session.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {session.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 dark:bg-ink-700 px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => toggleLiveReminder(session.id)}
                    className={`mt-1 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                      session.isReminded
                        ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                        : 'border border-ink-900 text-ink-900 dark:border-white dark:text-white'
                    }`}
                  >
                    {session.isReminded ? '🔔 Erinnert' : '🔔 Erinnern'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="pb-4">
          <button
            onClick={showToast}
            className="w-full rounded-2xl bg-ink-900 dark:bg-white py-4 text-center font-semibold text-white dark:text-ink-900"
          >
            + Session erstellen
          </button>
        </div>
      </div>

      {toastVisible && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-ink-900 dark:bg-white text-white dark:text-ink-900 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium whitespace-nowrap">
          Funktion in Kürze verfügbar
        </div>
      )}

      {playerSession && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="relative flex-1">
            <img
              src={playerSession.thumbnail}
              alt={playerSession.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

            <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-5 pt-12 pb-4">
              <div className="flex-1 min-w-0">
                <p className="font-display text-xl font-bold text-white leading-tight truncate">
                  {playerSession.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <UserAvatar src={playerSession.hostAvatar} size="sm" />
                  <span className="text-sm text-white/80">{playerSession.hostName}</span>
                  <LiveBadge />
                </div>
              </div>
              <button
                onClick={() => setPlayerSession(null)}
                className="shrink-0 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
              >
                Verlassen
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-5 pb-10">
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-full bg-black/40 px-3 py-1 text-sm text-white backdrop-blur">
                  👁 {playerSession.participantCount} Zuschauer
                </span>
              </div>

              <div className="flex items-center gap-3">
                {REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-xl backdrop-blur active:scale-90 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {floatingEmojis.map((fe) => (
                <span
                  key={fe.id}
                  className="absolute bottom-32 left-1/2 -translate-x-1/2 text-3xl animate-bounce"
                  style={{ left: `${20 + Math.random() * 60}%` }}
                >
                  {fe.emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
