import { useState } from 'react';
import type { Mentor } from '../../data/community';
import { mockMentors } from '../../data/community';
import { PageHeader } from '../../components/PageHeader';
import { UserAvatar } from '../../features/community/components/UserAvatar';

const getNextDates = (): string[] => {
  const result: string[] = [];
  const base = new Date('2026-05-25T00:00:00Z');
  const current = new Date(base);
  while (result.length < 3) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day === 1 || day === 3 || day === 5) {
      const label = current.toLocaleDateString('de-DE', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
      });
      result.push(label);
    }
  }
  return result;
};

const DATE_OPTIONS = getNextDates();

const allSports = Array.from(new Set(mockMentors.map((m) => m.sport)));

const SPORT_FILTER_OPTIONS = [
  { id: 'alle', label: 'Alle', emoji: '🏅' },
  ...allSports.map((sport) => {
    const mentor = mockMentors.find((m) => m.sport === sport);
    return {
      id: sport,
      label: sport,
      emoji: mentor?.sportEmoji ?? '🏅',
    };
  }),
];

interface ContactSheetProps {
  mentor: Mentor;
  onClose: () => void;
}

const ContactSheet = ({ mentor, onClose }: ContactSheetProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white dark:bg-ink-900 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-2">
          <div className="mb-5 flex items-center gap-4">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-14 h-14 rounded-2xl object-cover"
            />
            <div>
              <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">
                {mentor.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mentor.sportEmoji} {mentor.sport}
              </p>
              <p className="mt-1 text-base font-bold text-violet-600 dark:text-violet-400">
                {mentor.pricePerSession} / Session
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-ink-700 dark:text-slate-300 text-lg font-bold"
              aria-label="Schließen"
            >
              ×
            </button>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Datum wählen
            </p>
            <div className="flex gap-2">
              {DATE_OPTIONS.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-1 rounded-2xl border py-2.5 text-sm font-medium transition-colors ${
                    selectedDate === date
                      ? 'border-violet-600 bg-violet-600 text-white'
                      : 'border-slate-200 bg-white text-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-white'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Nachricht (optional)
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Erzähl dem Mentor von deinen Zielen…"
              rows={3}
              className="w-full rounded-2xl border border-slate-200 dark:border-ink-700 bg-slate-50 dark:bg-ink-800 px-4 py-3 text-sm text-ink-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>

          {sent ? (
            <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 py-4 text-center">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                Anfrage gesendet! ✓
              </span>
            </div>
          ) : (
            <button
              onClick={handleSend}
              disabled={!selectedDate}
              className="w-full rounded-2xl bg-violet-600 py-4 text-sm font-semibold text-white disabled:opacity-40 active:bg-violet-700 transition-colors"
            >
              Anfrage senden
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface MentorCardProps {
  mentor: Mentor;
  onContact: () => void;
}

const MentorCard = ({ mentor, onContact }: MentorCardProps) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-ink-800 border border-slate-100 dark:border-ink-700 shadow-sm dark:shadow-none overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <UserAvatar src={mentor.avatar} size="lg" />
            {mentor.verified && (
              <span
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs"
                title="Verifiziert"
              >
                ✓
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-bold text-ink-900 dark:text-white leading-tight truncate">
                  {mentor.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{mentor.city}</p>
              </div>
              <span className="shrink-0 text-xl font-bold text-violet-600 dark:text-violet-400">
                {mentor.pricePerSession}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-ink-700 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                {mentor.sportEmoji} {mentor.level}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                ⭐{' '}
                <span className="font-semibold text-ink-900 dark:text-white">{mentor.rating}</span>
                <span>({mentor.reviewCount})</span>
              </span>
              <span>·</span>
              <span>{mentor.sessionsCount} Sessions</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {mentor.bio}
        </p>

        {mentor.specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {mentor.specialties.map((spec) => (
              <span
                key={spec}
                className="rounded-full bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-400"
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onContact}
          className="mt-4 w-full rounded-2xl bg-violet-600 py-3 text-sm font-semibold text-white active:bg-violet-700 transition-colors"
        >
          Anfragen
        </button>
      </div>
    </div>
  );
};

export const MentorsPage = () => {
  const [selectedSport, setSelectedSport] = useState('alle');
  const [contactMentor, setContactMentor] = useState<Mentor | null>(null);
  const [showBecomeMentorToast, setShowBecomeMentorToast] = useState(false);

  const filtered = mockMentors.filter(
    (m) => selectedSport === 'alle' || m.sport === selectedSport,
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-900">
      <PageHeader title="Mentoren" subtitle="Lerne von den Besten" back />

      <div className="space-y-4 pt-4 pb-24">
        <div className="no-scrollbar overflow-x-auto px-5">
          <div className="flex gap-2 pb-1">
            {SPORT_FILTER_OPTIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedSport(f.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  selectedSport === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-ink-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-ink-700'
                }`}
              >
                <span>{f.emoji}</span>
                <span className="capitalize">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 space-y-3">
          {filtered.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onContact={() => setContactMentor(mentor)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-3">🎓</span>
              <p className="font-medium text-ink-900 dark:text-white">Keine Mentoren gefunden</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Versuche einen anderen Filter
              </p>
            </div>
          )}
        </div>

        <div className="px-5">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-4xl">🎓</span>
              <div>
                <h3 className="font-display text-xl font-bold">Teile dein Wissen</h3>
                <p className="text-sm text-white/70 mt-0.5">
                  Werde Mentor und hilf anderen besser zu werden
                </p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-5">
              Du hast Expertise in deiner Sportart? Teile dein Wissen als zertifizierter Mentor
              und verdiene nebenbei etwas dazu. Über 1.000 Sportler warten auf dich.
            </p>
            <button
              onClick={() => {
                setShowBecomeMentorToast(true);
                setTimeout(() => setShowBecomeMentorToast(false), 3000);
              }}
              className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-indigo-700 active:bg-white/90 transition-colors"
            >
              Jetzt bewerben
            </button>
          </div>
        </div>
      </div>

      {contactMentor && (
        <ContactSheet mentor={contactMentor} onClose={() => setContactMentor(null)} />
      )}

      {showBecomeMentorToast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-emerald-600 px-5 py-3 shadow-lg flex items-center gap-3">
          <span className="text-sm font-semibold text-white">Bewerbung gesendet! ✓</span>
          <button
            onClick={() => setShowBecomeMentorToast(false)}
            className="text-white/70 text-sm"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
