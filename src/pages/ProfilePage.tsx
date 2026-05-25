import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useAppStore } from '../store/useAppStore';
import { findClubById, getSportById, xpForLevel, moduleKey } from '../utils/helpers';
import { emojiForClub } from '../utils/clubVisuals';
import { ProgressBar } from '../components/ProgressBar';
import { CURRICULA } from '../data/modules';
import { SPORTS } from '../data/sports';
import { useThemeStore, type ThemeMode } from '../store/useThemeStore';

const AVATARS = ['🏃', '🏋️', '🧘', '🚴', '🏊', '🧗', '⚽', '🏀', '🎾', '🥋', '⛷️', '💃'];

const THEME_OPTIONS: Array<{ id: ThemeMode; label: string; emoji: string }> = [
  { id: 'light', label: 'Hell', emoji: '☀️' },
  { id: 'dark', label: 'Dunkel', emoji: '🌙' },
  { id: 'system', label: 'System', emoji: '⚙️' },
];

export const ProfilePage = () => {
  const profile = useAppStore((s) => s.profile);
  const favorites = useAppStore((s) => s.favorites);
  const inquiries = useAppStore((s) => s.inquiries);
  const progress = useAppStore((s) => s.progress);
  const setProfileName = useAppStore((s) => s.setProfileName);
  const setAvatar = useAppStore((s) => s.setAvatar);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const resetAll = useAppStore((s) => s.resetAll);
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);

  const { level, progress: levelPct, nextThreshold } = xpForLevel(profile.xp);

  const sportsInProgress = SPORTS.filter((s) => {
    const c = CURRICULA[s.id];
    return (['anfaenger', 'fortgeschritten', 'profi'] as const).some((lvl) =>
      c[lvl].some((m) => progress[moduleKey(s.id, lvl, m.id)]),
    );
  });

  return (
    <div>
      <PageHeader
        title="Profil"
        right={
          <button
            onClick={() => {
              if (editing) setProfileName(draftName);
              setEditing(!editing);
            }}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-card dark:bg-ink-700 dark:text-white dark:shadow-card-dark"
          >
            {editing ? 'Speichern' : 'Bearbeiten'}
          </button>
        }
      />
      <div className="px-5 pb-8">
        <div className="rounded-3xl bg-ink-900 p-5 text-white dark:bg-ink-800">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-4xl">
              {profile.avatarEmoji}
            </div>
            <div className="flex-1">
              {editing ? (
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full rounded-lg bg-white/10 px-2 py-1 font-display text-xl font-bold outline-none"
                />
              ) : (
                <div className="font-display text-xl font-bold">{profile.name}</div>
              )}
              <div className="text-xs text-white/70">
                Level {level} · {profile.xp} XP
              </div>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar value={levelPct} color="rgba(255,255,255,0.95)" />
            <div className="mt-1 text-[11px] text-white/70">
              {nextThreshold - profile.xp} XP bis Level {level + 1}
            </div>
          </div>
          {editing && (
            <div className="mt-4">
              <div className="mb-1 text-xs text-white/70">Avatar wählen</div>
              <div className="flex flex-wrap gap-1.5">
                {AVATARS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setAvatar(e)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xl transition ${
                      profile.avatarEmoji === e ? 'bg-white text-ink-900' : 'bg-white/10'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat title="Streak" value={`${profile.streakDays}🔥`} />
          <Stat title="Favoriten" value={`${favorites.length}`} />
          <Stat title="Anfragen" value={`${inquiries.length}`} />
        </div>

        {sportsInProgress.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-white">Aktive Sportarten</h2>
            <div className="space-y-2">
              {sportsInProgress.map((s) => {
                const totalMods = ['anfaenger', 'fortgeschritten', 'profi'].reduce(
                  (acc, lvl) => acc + CURRICULA[s.id][lvl as 'anfaenger'].length,
                  0,
                );
                const done = (['anfaenger', 'fortgeschritten', 'profi'] as const).reduce(
                  (acc, lvl) =>
                    acc +
                    CURRICULA[s.id][lvl].filter((m) => progress[moduleKey(s.id, lvl, m.id)]).length,
                  0,
                );
                return (
                  <Link
                    key={s.id}
                    to={`/sport/${s.id}`}
                    className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card dark:bg-ink-800 dark:shadow-card-dark"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                      style={{ background: `${s.color}1f` }}
                    >
                      {s.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-display text-sm font-bold text-ink-900 dark:text-white">
                          {s.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {done}/{totalMods}
                        </div>
                      </div>
                      <ProgressBar value={done / totalMods} color={s.color} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {inquiries.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-white">Meine Anfragen</h2>
            <div className="space-y-2">
              {inquiries.map((inq) => {
                const club = findClubById(inq.clubId);
                const sport = club && getSportById(club.sportId);
                const clubName = club?.name ?? inq.clubName ?? 'Verein';
                return (
                  <div key={inq.id} className="rounded-2xl bg-white p-3 shadow-card dark:bg-ink-800 dark:shadow-card-dark">
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                        style={{ background: `${sport?.color ?? '#0B0F14'}1a` }}
                      >
                        {club ? emojiForClub(club, sport) : sport?.emoji ?? '🏅'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-display text-sm font-bold text-ink-900 dark:text-white">
                            {clubName}
                          </div>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            Gesendet
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Wunsch: {new Date(inq.preferredDate).toLocaleDateString('de-DE')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-white">Erscheinungsbild</h2>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => setThemeMode(o.id)}
                className={`rounded-2xl border-2 px-3 py-3 text-sm font-semibold transition ${
                  themeMode === o.id
                    ? 'border-ink-900 bg-ink-900 text-white dark:border-white dark:bg-white dark:text-ink-900'
                    : 'border-transparent bg-white text-ink-900 shadow-card dark:bg-ink-800 dark:text-white dark:shadow-card-dark'
                }`}
              >
                <div className="text-2xl">{o.emoji}</div>
                <div className="mt-1 text-xs">{o.label}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-2 font-display text-lg font-bold text-ink-900 dark:text-white">Einstellungen</h2>
          <div className="overflow-hidden rounded-2xl bg-white shadow-card dark:bg-ink-800 dark:shadow-card-dark">
            <Toggle
              label="Benachrichtigungen"
              value={profile.settings.notifications}
              onChange={(v) => updateSettings({ notifications: v })}
            />
            <Toggle
              label="Standort aktivieren"
              value={profile.settings.locationEnabled}
              onChange={(v) => updateSettings({ locationEnabled: v })}
            />
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-ink-700">
              <div className="text-sm text-ink-900 dark:text-white">Sprache</div>
              <select
                value={profile.settings.language}
                onChange={(e) => updateSettings({ language: e.target.value as 'de' | 'en' })}
                className="rounded-lg bg-slate-100 px-2 py-1 text-sm text-ink-900 dark:bg-ink-700 dark:text-white"
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>

        <button
          onClick={() => {
            if (window.confirm('Alle Daten zurücksetzen? Dein Fortschritt geht verloren.')) resetAll();
          }}
          className="mt-6 w-full rounded-2xl bg-white py-3 text-sm font-semibold text-rose-600 shadow-card dark:bg-ink-800 dark:text-rose-400 dark:shadow-card-dark"
        >
          Konto zurücksetzen
        </button>
      </div>
    </div>
  );
};

const Stat = ({ title, value }: { title: string; value: string }) => (
  <div className="rounded-2xl bg-white p-3 shadow-card dark:bg-ink-800 dark:shadow-card-dark">
    <div className="font-display text-xl font-bold text-ink-900 dark:text-white">{value}</div>
    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
      {title}
    </div>
  </div>
);

const Toggle = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!value)}
    className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-ink-700"
  >
    <span className="text-sm text-ink-900 dark:text-white">{label}</span>
    <span
      className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${
        value ? 'bg-ink-900 dark:bg-white' : 'bg-slate-200 dark:bg-ink-700'
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow transition-transform dark:bg-ink-900 ${
          value ? 'translate-x-5' : ''
        } ${value ? 'dark:bg-ink-900' : 'dark:bg-slate-300'}`}
      />
    </span>
  </button>
);
