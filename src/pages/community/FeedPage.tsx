import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { useCommunityStore } from '../../features/community/store/communityStore';
import { UserAvatar } from '../../features/community/components/UserAvatar';
import { ReactionBar } from '../../features/community/components/ReactionBar';
import { StoryRing } from '../../features/community/components/StoryRing';
import { SportBadge } from '../../features/community/components/SportBadge';
import type { Post, CommunityUser } from '../../data/community';

const SPORTS = [
  { id: 'laufen', emoji: '🏃', label: 'Laufen' },
  { id: 'radfahren', emoji: '🚴', label: 'Radfahren' },
  { id: 'schwimmen', emoji: '🏊', label: 'Schwimmen' },
  { id: 'yoga', emoji: '🧘', label: 'Yoga' },
  { id: 'krafttraining', emoji: '🏋️', label: 'Krafttraining' },
  { id: 'klettern', emoji: '🧗', label: 'Klettern' },
  { id: 'fussball', emoji: '⚽', label: 'Fußball' },
  { id: 'tanzen', emoji: '💃', label: 'Tanzen' },
];

const formatTimeAgo = (iso: string): string => {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 60) return `vor ${diffMin} Min`;
  if (diffHours < 24) return `vor ${diffHours} Std`;
  if (diffDays === 1) return 'gestern';
  return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
};

interface MyStoryButtonProps {
  onClick: () => void;
}

const MyStoryButton = ({ onClick }: MyStoryButtonProps) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5">
    <div className="relative">
      <div className="rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-400 p-0.5">
        <div className="rounded-full bg-white p-0.5 dark:bg-ink-900">
          <img
            src="https://i.pravatar.cc/150?u=me"
            alt="Meine Story"
            className="h-14 w-14 rounded-full object-cover"
          />
        </div>
      </div>
      <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white text-xs font-bold border-2 border-white dark:border-ink-900">
        +
      </span>
    </div>
    <span className="max-w-[64px] truncate text-xs text-slate-600 dark:text-slate-400">
      Meine Story
    </span>
  </button>
);

interface PostComposerModalProps {
  onClose: () => void;
  onSubmit: (content: string, sport?: string, emoji?: string) => void;
}

const PostComposerModal = ({ onClose, onSubmit }: PostComposerModalProps) => {
  const [content, setContent] = useState('');
  const [selectedSport, setSelectedSport] = useState<{ id: string; emoji: string } | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim(), selectedSport?.id, selectedSport?.emoji);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg animate-slide-up rounded-t-3xl bg-white p-5 pb-10 shadow-2xl dark:bg-ink-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">
            Neuer Beitrag
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-ink-900 dark:bg-ink-700 dark:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <UserAvatar src="https://i.pravatar.cc/150?u=me" size="md" />
            <textarea
              value={content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              placeholder="Was machst du heute?"
              rows={4}
              className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-ink-900 placeholder-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 dark:border-ink-600 dark:bg-ink-700 dark:text-white dark:placeholder-slate-500"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Sport
            </p>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setSelectedSport(selectedSport?.id === s.id ? null : { id: s.id, emoji: s.emoji })
                  }
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    selectedSport?.id === s.id
                      ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                      : 'bg-slate-100 text-slate-700 dark:bg-ink-700 dark:text-slate-300'
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!content.trim()}
            className="w-full rounded-2xl bg-ink-900 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-40 dark:bg-violet-600"
          >
            Veröffentlichen
          </button>
        </form>
      </div>
    </div>
  );
};

interface PostCardProps {
  post: Post;
  onReact: (postId: string, reaction: 'fire' | 'muscle' | 'clap') => void;
  onComment: (postId: string, content: string) => void;
}

const PostCard = ({ post, onReact, onComment }: PostCardProps) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');

  const visibleComments = commentsOpen ? post.comments : post.comments.slice(0, 2);
  const hasMore = post.comments.length > 2;

  const handleCommentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!commentDraft.trim()) return;
    onComment(post.id, commentDraft.trim());
    setCommentDraft('');
  };

  return (
    <article className="rounded-2xl bg-white p-4 shadow-card dark:bg-ink-800 dark:shadow-card-dark">
      <div className="mb-3 flex items-center gap-3">
        <UserAvatar src={post.userAvatar} size="md" />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">
            {post.userName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatTimeAgo(post.createdAt)}
          </p>
        </div>
        {post.sport && (
          <SportBadge sportId={post.sport} small />
        )}
      </div>

      <p className="mb-3 text-sm leading-relaxed text-ink-900 dark:text-slate-200">
        {post.content}
      </p>

      {post.imageUrl && (
        <div className="mb-3 overflow-hidden rounded-2xl">
          <img
            src={post.imageUrl}
            alt=""
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {post.likes} {post.likes === 1 ? 'Reaktion' : 'Reaktionen'}
        </span>
        <div className="flex-1" />
        <ReactionBar
          reactions={post.reactions}
          userReaction={post.userReaction}
          onReact={(r) => onReact(post.id, r)}
        />
      </div>

      {post.comments.length > 0 && (
        <div className="border-t border-slate-100 pt-3 dark:border-ink-700">
          <div className="space-y-2">
            {visibleComments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <img
                  src={c.userAvatar}
                  alt=""
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-ink-900 dark:text-white">
                    {c.userName}{' '}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">{c.content}</span>
                </div>
              </div>
            ))}
          </div>

          {hasMore && !commentsOpen && (
            <button
              onClick={() => setCommentsOpen(true)}
              className="mt-2 text-xs font-medium text-violet-600 dark:text-violet-400"
            >
              Alle {post.comments.length} Kommentare anzeigen
            </button>
          )}

          {commentsOpen && (
            <form onSubmit={handleCommentSubmit} className="mt-3 flex gap-2">
              <UserAvatar src="https://i.pravatar.cc/150?u=me" size="sm" />
              <input
                type="text"
                value={commentDraft}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCommentDraft(e.target.value)}
                placeholder="Kommentar schreiben…"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-ink-900 placeholder-slate-400 focus:border-violet-400 focus:outline-none dark:border-ink-600 dark:bg-ink-700 dark:text-white dark:placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!commentDraft.trim()}
                className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 dark:bg-violet-600"
              >
                Senden
              </button>
            </form>
          )}
        </div>
      )}

      {post.comments.length === 0 && (
        <div className="border-t border-slate-100 pt-3 dark:border-ink-700">
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <UserAvatar src="https://i.pravatar.cc/150?u=me" size="sm" />
            <input
              type="text"
              value={commentDraft}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCommentDraft(e.target.value)}
              placeholder="Kommentar schreiben…"
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-ink-900 placeholder-slate-400 focus:border-violet-400 focus:outline-none dark:border-ink-600 dark:bg-ink-700 dark:text-white dark:placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!commentDraft.trim()}
              className="rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 dark:bg-violet-600"
            >
              Senden
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export const FeedPage = () => {
  const [composerOpen, setComposerOpen] = useState(false);

  const posts = useCommunityStore((s) => s.posts);
  const buddies = useCommunityStore((s) => s.buddies);
  const toggleReaction = useCommunityStore((s) => s.toggleReaction);
  const addPost = useCommunityStore((s) => s.addPost);
  const addComment = useCommunityStore((s) => s.addComment);

  const storyUsers: CommunityUser[] = buddies
    .filter((u) => u.isFollowing || u.isBuddy)
    .slice(0, 10);

  return (
    <div className="relative pb-24">
      <PageHeader title="Community Feed" back />

      <div className="space-y-6 px-4 pt-4">
        <section>
          <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4">
            <MyStoryButton onClick={() => setComposerOpen(true)} />
            {storyUsers.map((user) => (
              <StoryRing key={user.id} user={user} onClick={() => {}} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onReact={toggleReaction}
              onComment={addComment}
            />
          ))}
        </section>
      </div>

      <button
        onClick={() => setComposerOpen(true)}
        className="fixed bottom-24 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-white shadow-lg transition-transform active:scale-95 dark:bg-violet-600"
        aria-label="Neuer Beitrag"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      {composerOpen && (
        <PostComposerModal
          onClose={() => setComposerOpen(false)}
          onSubmit={addPost}
        />
      )}
    </div>
  );
};
