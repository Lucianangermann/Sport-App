import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env from .env.local (gitignored) so the API key never reaches the browser bundle.
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.ANTHROPIC_API_KEY ?? '';

  if (!apiKey && mode !== 'production') {
    console.warn(
      '\n[anthropic proxy] ⚠️  ANTHROPIC_API_KEY not set. Create .env.local with your key.\n' +
        '   cp .env.local.example .env.local && edit it.\n',
    );
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Anthropic API proxy — injects the API key server-side.
        // Browser calls /api/anthropic/v1/messages with no auth header;
        // Vite forwards to api.anthropic.com with x-api-key set from .env.local.
        '/api/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, _req, res) => {
              if (!apiKey) {
                // Short-circuit: respond directly so the user sees a clear message.
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({
                    error: 'ANTHROPIC_API_KEY ist nicht gesetzt. Erstelle .env.local aus .env.local.example und starte den Dev-Server neu.',
                  }),
                );
                proxyReq.destroy();
                return;
              }
              proxyReq.setHeader('x-api-key', apiKey);
              // Drop the browser-direct-access header — we're going through a proxy now.
              proxyReq.removeHeader('anthropic-dangerous-direct-browser-access');
            });
            proxy.on('error', (err) => {
              console.error('[anthropic proxy] error:', err.message);
            });
          },
        },
      },
    },
  };
});
