import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { applyTheme, useThemeStore } from './store/useThemeStore';

// Apply theme before first render to avoid flash of wrong theme
applyTheme(useThemeStore.getState().mode);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
