import { useState } from 'react';
import type { CommunityUser } from '../../data/community';
import { PageHeader } from '../../components/PageHeader';
import { DemoDataNotice } from '../../components/DemoDataNotice';
import { UserAvatar } from '../../features/community/components/UserAvatar';
import { MatchScoreBadge } from '../../features/community/components/MatchScoreBadge';
import { SportBadge } from '../../features/community/components/SportBadge';
import { useCommunityStore } from '../../features/community/store/communityStore';

const SPORT_FILTERS = [
  { id: 'alle', label: 'Alle', emoji: '🏅' },
  { id: 'laufen', label: 'Laufen', emoji: '🏃' },
  { id: 'radfahren', label: 'Radfahren', emoji: '🚴' },
  { id: 'schwimmen', label: 'Schwimmen', emoji: '🏊' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'klettern', label: 'Klettern', emoji: '🧗' },
  { id: 'krafttraining', label: 'Krafttraining', emoji: '🏋️' },
  { id: 'fussball', label: 'Fußball', emoji: '⚽' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
];

const DAY_FILTERS = ['Alle', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

interface BuddyProfileModalProps {
  user: CommunityUser;
  isPending: boolean;
  isFollowing: boolean;
  onClose: () => void;
  onRequest: () => void;
  onFollow: () => void;
}

const BuddyProfileModal = ({
  user,
  isPending,
  isFollowing,
  onClose,
  onRequest,
  onFollow,
}: BuddyProfileModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white dark:bg-ink-900 pb-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-5 pt-5 pb-4">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-ink-700 dark:text-slate-300 text-lg font-bold"
            aria-label="Schließen"
          >
            ×
          </button>
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white leading-tight">
                {user.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {user.age} Jahre · {user.city}
              </p>
              <div className="mt-2">
                <MatchScoreBadge score={user.matchScore} />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 dark:divide-ink-700 rounded-2xl bg-slate-50 dark:bg-ink-800 overflow-hidden">
            <div className="flex flex-col items-center py-3">
              <span className="font-display text-lg font-bold text-ink-900 dark:text-white">
                {user.followerCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Follower</span>
            </div>
            <div className="flex flex-col items-center py-3">
              <span className="font-display text-lg font-bold text-ink-900 dark:text-white">
                {user.matchScore}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Match</span>
            </div>
            <div className="flex flex-col items-center py-3">
              <span className="font-display text-lg font-bold text-ink-900 dark:text-white">
                {user.isBuddy ? '✓' : '–'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Buddy</span>
            </div>
          </div>

          {user.bio && (
            <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {user.bio}
            </p>
          )}

          <div className="mt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Sportarten
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.sports.map((s) => (
                <SportBadge key={s.sportId} sportId={s.sportId} level={s.level} />
              ))}
            </div>
          </div>

          {user.availability.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Verfügbarkeit
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {user.availability.map((day) => (
                  <span
                    key={day}
                    className="rounded-full bg-slate-100 dark:bg-ink-700 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.badges.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Badges
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {user.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-violet-50 dark:bg-violet-900/20 px-2.5 py-1 text-xs font-medium text-violet-700 dark:text-violet-400"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {user.isBuddy ? (
              <button
                disabled
                className="flex-1 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400"
              >
                Trainingspartner ✓
              </button>
            ) : isPending ? (
              <button
                disabled
                className="flex-1 rounded-2xl bg-amber-100 dark:bg-amber-900/30 py-3 text-sm font-semibold text-amber-700 dark:text-amber-400"
              >
                Anfrage gesendet
              </button>
            ) : (
              <button
                onClick={onRequest}
                className="flex-1 rounded-2xl bg-violet-600 py-3 text-sm font-semibold text-white active:bg-violet-700"
              >
                Anfragen
              </button>
            )}
            <button
              onClick={onFollow}
              className={`flex-1 rounded-2xl border py-3 text-sm font-semibold transition-colors ${
                isFollowing
                  ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400'
                  : 'border-slate-200 bg-white text-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-white'
              }`}
            >
              {isFollowing ? 'Folgt ✓' : 'Folgen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BuddyCardProps {
  user: CommunityUser;
  isPending: boolean;
  isFollowing: boolean;
  onCardClick: () => void;
  onRequest: (e: React.MouseEvent) => void;
  onFollow: (e: React.MouseEvent) => void;
}

const BuddyCard = ({ user, isPending, isFollowing, onCardClick, onRequest, onFollow }: BuddyCardProps) => {
  return (
    <div
      className="rounded-3xl bg-white dark:bg-ink-800 shadow-sm dark:shadow-none border border-slate-100 dark:border-ink-700 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
      onClick={onCardClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <UserAvatar src={user.avatar} size="lg" />
            <div className="absolute -top-1 -right-1">
              <MatchScoreBadge score={user.matchScore} />
            </div>
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-base font-bold text-ink-900 dark:text-white leading-tight truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user.age} · {user.city}
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {user.sports.map((s) => (
                <SportBadge key={s.sportId} sportId={s.sportId} level={s.level} small />
              ))}
            </div>
          </div>
        </div>

        {user.bio && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {user.bio}
          </p>
        )}

        {user.availability.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {user.availability.map((day) => (
              <span
                key={day}
                className="rounded-full bg-slate-100 dark:bg-ink-700 px-2 py-0.5 text-xs text-slate-500 dark:text-slate-400"
              >
                {day}
              </span>
            ))}
          </div>
        )}

        {user.badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {user.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-400"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
          {user.isBuddy ? (
            <button
              disabled
              className="flex-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
            >
              Trainingspartner ✓
            </button>
          ) : isPending ? (
            <button
              disabled
              className="flex-1 rounded-xl bg-amber-100 dark:bg-amber-900/30 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400"
            >
              Anfrage gesendet
            </button>
          ) : (
            <button
              onClick={onRequest}
              className="flex-1 rounded-xl bg-violet-600 py-2 text-xs font-semibold text-white active:bg-violet-700"
            >
              Anfragen
            </button>
          )}
          <button
            onClick={onFollow}
            className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-colors ${
              isFollowing
                ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400'
                : 'border-slate-200 bg-white text-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-white'
            }`}
          >
            {isFollowing ? 'Folgt ✓' : 'Folgen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const BuddyFinderPage = () => {
  const buddies = useCommunityStore((s) => s.buddies);
  const pendingRequests = useCommunityStore((s) => s.pendingRequests);
  const following = useCommunityStore((s) => s.following);
  const sendBuddyRequest = useCommunityStore((s) => s.sendBuddyRequest);
  const toggleFollow = useCommunityStore((s) => s.toggleFollow);

  const [selectedSport, setSelectedSport] = useState('alle');
  const [selectedDay, setSelectedDay] = useState('Alle');
  const [selectedUser, setSelectedUser] = useState<CommunityUser | null>(null);

  const filtered = buddies
    .filter((u) => {
      const sportMatch =
        selectedSport === 'alle' || u.sports.some((s) => s.sportId === selectedSport);
      const dayMatch = selectedDay === 'Alle' || u.availability.includes(selectedDay);
      return sportMatch && dayMatch;
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-900">
      <PageHeader title="Trainingspartner" subtitle="Finde deinen perfect Match" back />
      <DemoDataNotice className="mx-5 mt-3" />

      <div className="space-y-3 pt-4 pb-24">
        <div className="no-scrollbar overflow-x-auto px-5">
          <div className="flex gap-2 pb-1">
            {SPORT_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedSport(f.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  selectedSport === f.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-white dark:bg-ink-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-ink-700'
                }`}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="no-scrollbar overflow-x-auto px-5">
          <div className="flex gap-2 pb-1">
            {DAY_FILTERS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  selectedDay === day
                    ? 'bg-amber-500 text-white'
                    : 'bg-white dark:bg-ink-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-ink-700'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
            {filtered.length} {filtered.length === 1 ? 'Trainingspartner' : 'Trainingspartner'} gefunden
          </p>
          <div className="space-y-3">
            {filtered.map((user) => (
              <BuddyCard
                key={user.id}
                user={user}
                isPending={pendingRequests.includes(user.id)}
                isFollowing={following.includes(user.id)}
                onCardClick={() => setSelectedUser(user)}
                onRequest={(e) => {
                  e.stopPropagation();
                  sendBuddyRequest(user.id);
                }}
                onFollow={(e) => {
                  e.stopPropagation();
                  toggleFollow(user.id);
                }}
              />
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-4xl mb-3">🤷</span>
                <p className="font-medium text-ink-900 dark:text-white">Keine Ergebnisse</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Versuche einen anderen Filter
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedUser && (
        <BuddyProfileModal
          user={selectedUser}
          isPending={pendingRequests.includes(selectedUser.id)}
          isFollowing={following.includes(selectedUser.id)}
          onClose={() => setSelectedUser(null)}
          onRequest={() => sendBuddyRequest(selectedUser.id)}
          onFollow={() => toggleFollow(selectedUser.id)}
        />
      )}
    </div>
  );
};
