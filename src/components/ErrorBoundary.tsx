import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * App-wide safety net. Without it, a single throwing component unmounts the
 * whole React tree and the user is left staring at a blank white screen.
 * Here we catch the error, keep the shell, and offer a way back.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surfaced in the console for debugging; no remote logging in this app.
    console.error('Uncaught UI error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center dark:bg-ink-900">
        <div className="text-5xl">🛠️</div>
        <h1 className="font-display text-xl font-bold text-ink-900 dark:text-white">
          Da ist etwas schiefgelaufen
        </h1>
        <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
          Ein unerwarteter Fehler ist aufgetreten. Deine Fortschritte sind gespeichert.
        </p>
        <div className="flex gap-2">
          <button
            onClick={this.handleReset}
            className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-ink-900"
          >
            Erneut versuchen
          </button>
          <a
            href="/"
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-ink-900 dark:border-ink-700 dark:text-white"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    );
  }
}
