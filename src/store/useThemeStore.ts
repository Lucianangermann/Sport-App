import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolved: () => 'light' | 'dark';
}

const resolveMode = (m: ThemeMode): 'light' | 'dark' => {
  if (m === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return m;
};

export const applyTheme = (m: ThemeMode) => {
  const resolved = resolveMode(m);
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  const themeColor = resolved === 'dark' ? '#0B0F14' : '#F8FAFC';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode) => {
        set({ mode });
        applyTheme(mode);
      },
      resolved: () => resolveMode(get().mode),
    }),
    {
      name: 'sportify-theme-v1',
    },
  ),
);

// Listen for OS-level changes when in 'system' mode
if (typeof window !== 'undefined') {
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener?.('change', () => {
    if (useThemeStore.getState().mode === 'system') applyTheme('system');
  });
}
