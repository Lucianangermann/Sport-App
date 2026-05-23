import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { findClubById } from '../utils/helpers';
import { PageHeader } from '../components/PageHeader';
import { useAppStore } from '../store/useAppStore';

const todayISO = () => new Date().toISOString().slice(0, 10);

export const ContactPage = () => {
  const { id } = useParams<{ id: string }>();
  const clubId = id ? decodeURIComponent(id) : '';
  const club = clubId ? findClubById(clubId) : undefined;
  const profile = useAppStore((s) => s.profile);
  const addInquiry = useAppStore((s) => s.addInquiry);

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('Ich möchte ein Probetraining vereinbaren.');
  const [date, setDate] = useState(todayISO());
  const [sent, setSent] = useState(false);

  if (!club) return <Navigate to="/clubs" replace />;

  const valid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && message.trim().length > 5 && date;

  const submit = () => {
    if (!valid) return;
    addInquiry({ clubId: club.id, clubName: club.name, name, email, message, preferredDate: date });
    setSent(true);
  };

  if (sent) {
    return (
      <div>
        <PageHeader title="Anfrage gesendet" />
        <div className="flex flex-col items-center px-5 pt-6 text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-5xl dark:bg-emerald-900/40">
            ✓
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
            Wir haben deine Anfrage gesendet!
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            <strong>{club.name}</strong> meldet sich in der Regel innerhalb von 1–2 Werktagen bei dir.
          </p>
          <div className="my-6 w-full rounded-2xl bg-white p-4 text-left text-sm shadow-card dark:bg-ink-800 dark:shadow-card-dark">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Wunschtermin
            </div>
            <div className="font-display text-base font-bold text-ink-900 dark:text-white">
              {new Date(date).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
          <div className="flex w-full gap-2">
            <Link
              to="/profile"
              className="flex-1 rounded-2xl bg-slate-100 py-3.5 text-center font-semibold text-ink-900 dark:bg-ink-700 dark:text-white"
            >
              Meine Anfragen
            </Link>
            <Link
              to="/"
              className="flex-1 rounded-2xl bg-ink-900 py-3.5 text-center font-semibold text-white dark:bg-white dark:text-ink-900"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Probetraining" subtitle={club.name} back />
      <div className="space-y-4 px-5 pb-8">
        <Field label="Dein Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="E-Mail">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="du@example.de"
            className={inputCls}
          />
        </Field>
        <Field label="Wunschtermin">
          <input
            value={date}
            min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className={inputCls}
          />
        </Field>
        <Field label="Nachricht">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className={`${inputCls} resize-none`}
          />
        </Field>
        <button
          onClick={submit}
          disabled={!valid}
          className="w-full rounded-2xl bg-ink-900 py-4 font-semibold text-white transition disabled:bg-slate-300 dark:bg-white dark:text-ink-900 dark:disabled:bg-ink-700 dark:disabled:text-slate-500"
        >
          Anfrage senden
        </button>
      </div>
    </div>
  );
};

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-ink-900 outline-none placeholder:text-slate-400 focus:border-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white';

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <div className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</div>
    {children}
  </label>
);
