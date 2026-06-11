import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { DemoDataNotice } from '../components/DemoDataNotice';
import { useCommunityStore } from '../features/community/store/communityStore';
import { StoryRing } from '../features/community/components/StoryRing';

interface HubEntry {
  emoji: string;
  title: string;
  subtitle: string;
  to: string;
  bg: string;
}

const hubEntries: HubEntry[] = [
  {
    emoji: '📰',
    title: 'Feed',
    subtitle: 'Neuigkeiten',
    to: '/community/feed',
    bg: 'bg-violet-500',
  },
  {
    emoji: '🏆',
    title: 'Challenges',
    subtitle: 'Herausforderungen',
    to: '/community/challenges',
    bg: 'bg-emerald-500',
  },
  {
    emoji: '🤝',
    title: 'Buddies',
    subtitle: 'Trainingspartner',
    to: '/community/buddies',
    bg: 'bg-amber-500',
  },
  {
    emoji: '🗺️',
    title: 'Map',
    subtitle: 'Sportkarte',
    to: '/community/map',
    bg: 'bg-sky-500',
  },
  {
    emoji: '📡',
    title: 'Live',
    subtitle: 'Live Sessions',
    to: '/community/live',
    bg: 'bg-rose-500',
  },
  {
    emoji: '🎓',
    title: 'Mentoren',
    subtitle: 'Mentoren',
    to: '/community/mentors',
    bg: 'bg-indigo-500',
  },
  {
    emoji: '🏟️',
    title: 'Clubs',
    subtitle: 'Vereine',
    to: '/clubs',
    bg: 'bg-teal-500',
  },
  {
    emoji: '📅',
    title: 'Events',
    subtitle: 'Events',
    to: '/community/challenges',
    bg: 'bg-orange-500',
  },
];

export const CommunityHubPage = () => {
  const notifications = useCommunityStore((s) => s.notifications);
  const buddies = useCommunityStore((s) => s.buddies);

  const activeUsers = buddies.filter((u) => u.isFollowing || u.isBuddy).slice(0, 5);

  return (
    <div>
      <PageHeader title="Community" subtitle="Trainiere mit anderen" />

      <div className="space-y-6 px-5 pt-5 pb-8">
        <DemoDataNotice />
        {activeUsers.length > 0 && (
          <section>
            <h2 className="mb-3 font-display text-base font-bold text-ink-900 dark:text-white">
              Aktive Freunde
            </h2>
            <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5">
              {activeUsers.map((user) => (
                <StoryRing
                  key={user.id}
                  user={user}
                  onClick={() => {}}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="grid grid-cols-2 gap-3">
            {hubEntries.map((entry) => {
              const isFeed = entry.to === '/community/feed';
              return (
                <Link
                  key={entry.to + entry.title}
                  to={entry.to}
                  className={`relative flex flex-col items-start justify-between overflow-hidden rounded-3xl ${entry.bg} p-4 text-white shadow-lg active:scale-95 transition-transform`}
                >
                  {isFeed && notifications > 0 && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-red-600">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                  <span className="text-3xl">{entry.emoji}</span>
                  <div className="mt-8">
                    <div className="font-display text-base font-bold leading-tight">{entry.title}</div>
                    <div className="mt-0.5 text-xs font-medium text-white/75">{entry.subtitle}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
