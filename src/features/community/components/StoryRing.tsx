import type { CommunityUser } from '../../../data/community';

interface Props {
  user: CommunityUser;
  onClick: () => void;
}

export const StoryRing = ({ user, onClick }: Props) => {
  const truncatedName = user.name.length > 8 ? user.name.slice(0, 8) + '…' : user.name;

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5">
      <div className="rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-400 p-0.5">
        <div className="rounded-full bg-white p-0.5 dark:bg-ink-900">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-14 w-14 rounded-full object-cover"
          />
        </div>
      </div>
      <span className="max-w-[64px] truncate text-xs text-slate-600 dark:text-slate-400">
        {truncatedName}
      </span>
    </button>
  );
};
