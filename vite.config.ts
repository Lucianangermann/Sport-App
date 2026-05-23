import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env from .env.local (gitignored) so the API key never reaches the browser bundle.
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.ANTHROPIC_API_KEY ?? '';

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
            proxy.on('proxyReq', (proxyReq) => {
              if (apiKey) {
                proxyReq.setHeader('x-api-key', apiKey);
              }
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
