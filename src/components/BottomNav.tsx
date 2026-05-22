import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/discover', label: 'Entdecken', icon: '🔍' },
  { to: '/favorites', label: 'Favoriten', icon: '❤️' },
  { to: '/profile', label: 'Profil', icon: '👤' },
];

export const BottomNav = () => (
  <nav className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
    <div className="grid grid-cols-4">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-ink-900' : 'text-slate-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>{t.icon}</span>
              <span>{t.label}</span>
              <span className={`mt-0.5 h-1 w-1 rounded-full ${isActive ? 'bg-ink-900' : 'bg-transparent'}`} />
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);
