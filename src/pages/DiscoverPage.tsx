import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { SPORTS, CATEGORIES } from '../data/sports';
import { SportCard } from '../components/SportCard';
import { EmptyState } from '../components/EmptyState';

export const DiscoverPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SPORTS.filter(
      (s) =>
        (category === 'all' || s.category === category) &&
        (q === '' || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)),
    );
  }, [query, category]);

  return (
    <div>
      <PageHeader title="Entdecken" subtitle={`${SPORTS.length} Sportarten`} />
      <div className="px-5 pb-4">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sportart suchen…"
            className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-ink-900 dark:border-ink-700 dark:bg-ink-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-white"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              ✕
            </button>
          )}
        </div>
        <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === c.id
                  ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                  : 'bg-white text-slate-700 shadow-card dark:bg-ink-800 dark:text-slate-300 dark:shadow-card-dark'
              }`}
            >
              <span className="mr-1">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6">
        {filtered.length === 0 ? (
          <EmptyState emoji="🤔" title="Nichts gefunden" body="Versuch's mit einem anderen Suchbegriff." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((s) => (
              <SportCard key={s.id} sport={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
