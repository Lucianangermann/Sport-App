import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { ClubMessage, ClubPost } from '../../data/community';
import {
  mockClubPosts,
  mockClubEvents,
  mockClubMessages,
  mockClubMembers,
} from '../../data/community';
import { PageHeader } from '../../components/PageHeader';
import { UserAvatar } from '../../features/community/components/UserAvatar';
import { SportBadge } from '../../features/community/components/SportBadge';
import { findClubById } from '../../utils/helpers';

type Tab = 'news' | 'chat' | 'events' | 'members';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'news', label: 'Neuigkeiten' },
  { id: 'chat', label: 'Chat' },
  { id: 'events', label: 'Events' },
  { id: 'members', label: 'Mitglieder' },
];

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Gerade eben';
  if (mins < 60) return `vor ${mins} Min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days !== 1 ? 'en' : ''}`;
};

const formatEventDate = (date: string, time: string): string => {
  const d = new Date(`${date}T${time}`);
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const day = days[d.getDay()];
  const dom = d.getDate();
  const month = months[d.getMonth()];
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${day}, ${dom}. ${month} · ${h}:${m} Uhr`;
};

const formatMsgTime = (iso: string): string => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const ClubCommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const clubId = id ? decodeURIComponent(id) : '';
  const club = findClubById(clubId);

  const [activeTab, setActiveTab] = useState<Tab>('news');
  const [posts, setPosts] = useState<ClubPost[]>(mockClubPosts);
  const [messages, setMessages] = useState<ClubMessage[]>(mockClubMessages);
  const [chatInput, setChatInput] = useState('');
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab, messages]);

  const handleSendMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    const msg: ClubMessage = {
      id: `cm_${Date.now()}`,
      authorName: 'Du',
      authorAvatar: 'https://i.pravatar.cc/150?u=me',
      content: trimmed,
      createdAt: new Date().toISOString(),
      isMine: true,
    };
    setMessages((prev) => [...prev, msg]);
    setChatInput('');
  };

  const handleSubmitPost = () => {
    const trimmed = newPostText.trim();
    if (!trimmed) return;
    const post: ClubPost = {
      id: `cp_${Date.now()}`,
      authorName: 'Du',
      authorAvatar: 'https://i.pravatar.cc/150?u=me',
      content: trimmed,
      createdAt: new Date().toISOString(),
      isPinned: false,
      likes: 0,
    };
    setPosts((prev) => [post, ...prev]);
    setNewPostText('');
    setNewPostOpen(false);
  };

  const handleJoinEvent = (eventId: string) => {
    setJoinedEvents((prev) => {
      const next = new Set(prev);
      next.add(eventId);
      return next;
    });
    setTimeout(() => {
      setJoinedEvents((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-900 flex flex-col">
      <PageHeader
        title={club?.name ?? 'Verein'}
        back
      />

      <div className="sticky top-[72px] z-10 bg-slate-50/95 dark:bg-ink-900/95 backdrop-blur border-b border-slate-200 dark:border-ink-700 px-5">
        <div className="flex gap-0 -mb-px overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-ink-900 text-ink-900 dark:border-white dark:text-white'
                  : 'border-transparent text-slate-400 dark:text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {activeTab === 'news' && (
          <div className="px-5 py-4 space-y-4 pb-28">
            <button
              onClick={() => setNewPostOpen(true)}
              className="w-full rounded-2xl bg-ink-900 dark:bg-white py-3 text-sm font-semibold text-white dark:text-ink-900"
            >
              + Neuer Beitrag
            </button>

            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl bg-white dark:bg-ink-800 shadow-card dark:shadow-card-dark p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <UserAvatar src={post.authorAvatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-ink-900 dark:text-white">
                        {post.authorName}
                      </span>
                      {post.isPinned && (
                        <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400 font-medium">
                          📌 Angeheftet
                        </span>
                      )}
                      <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 shrink-0">
                        {timeAgo(post.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-ink-700">
                  <span>👍</span>
                  <span>{post.likes}</span>
                </div>
              </div>
            ))}

            {newPostOpen && (
              <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm">
                <div className="w-full rounded-t-3xl bg-white dark:bg-ink-800 p-5 space-y-4">
                  <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">
                    Neuer Beitrag
                  </h3>
                  <textarea
                    className="w-full rounded-xl border border-slate-200 dark:border-ink-600 bg-slate-50 dark:bg-ink-700 px-4 py-3 text-sm text-ink-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ink-900 dark:focus:ring-white resize-none"
                    rows={5}
                    placeholder="Was möchtest du teilen?"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setNewPostOpen(false); setNewPostText(''); }}
                      className="flex-1 rounded-xl border border-slate-200 dark:border-ink-600 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={handleSubmitPost}
                      className="flex-1 rounded-xl bg-ink-900 dark:bg-white py-3 text-sm font-semibold text-white dark:text-ink-900"
                    >
                      Veröffentlichen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-[calc(100vh-160px)]">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.isMine ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!msg.isMine && (
                    <UserAvatar src={msg.authorAvatar} size="sm" />
                  )}
                  <div className={`max-w-[72%] ${msg.isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!msg.isMine && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 mb-1 ml-1">
                        {msg.authorName}
                      </span>
                    )}
                    <div
                      className={`px-4 py-2.5 text-sm leading-relaxed ${
                        msg.isMine
                          ? 'bg-ink-900 dark:bg-white text-white dark:text-ink-900 rounded-2xl rounded-br-sm'
                          : 'bg-slate-100 dark:bg-ink-700 text-ink-900 dark:text-white rounded-2xl rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 mx-1">
                      {formatMsgTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            <div className="border-t border-slate-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-4 py-3 flex gap-3 items-center">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder="Nachricht schreiben..."
                className="flex-1 rounded-xl bg-slate-100 dark:bg-ink-700 px-4 py-2.5 text-sm text-ink-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="rounded-xl bg-ink-900 dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-ink-900 disabled:opacity-40"
              >
                Senden
              </button>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="px-5 py-4 space-y-4 pb-28">
            {mockClubEvents.map((event) => {
              const joined = joinedEvents.has(event.id);
              return (
                <div
                  key={event.id}
                  className="rounded-2xl bg-white dark:bg-ink-800 shadow-card dark:shadow-card-dark p-4 space-y-3"
                >
                  <h3 className="font-display text-base font-bold text-ink-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>🗓</span>
                      <span>{formatEventDate(event.date, event.time)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>👥</span>
                      <span>
                        {event.participantCount}
                        {event.maxParticipants ? ` / ${event.maxParticipants} Teilnehmer` : ' Teilnehmer'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinEvent(event.id)}
                    className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                      joined
                        ? 'bg-emerald-500 text-white'
                        : 'bg-ink-900 dark:bg-white text-white dark:text-ink-900'
                    }`}
                  >
                    {joined ? 'Angemeldet ✓' : 'Teilnehmen'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="px-5 py-4 space-y-2 pb-28">
            {mockClubMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-2xl bg-white dark:bg-ink-800 shadow-card dark:shadow-card-dark px-4 py-3"
              >
                <UserAvatar src={member.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Seit {member.joinedYear}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      member.role === 'Vorstand'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        : member.role === 'Trainer'
                          ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-ink-700 dark:text-slate-300'
                    }`}
                  >
                    {member.role}
                  </span>
                  <SportBadge sportId={member.sport} small />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
