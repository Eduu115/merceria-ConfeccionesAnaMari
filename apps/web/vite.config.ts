import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Vite sustituye %VITE_SITE_URL% en index.html; hace falta un valor siempre.
  if (!process.env.VITE_SITE_URL && !env.VITE_SITE_URL) {
    process.env.VITE_SITE_URL =
      mode === 'production' ? 'https://confemerana.es' : 'http://localhost:5173';
  }

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      watch: {
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
      },
      proxy: {
        '/api': process.env.API_INTERNO ?? 'http://localhost:3010',
        '/subidas': process.env.API_INTERNO ?? 'http://localhost:3010',
        '/socket.io': {
          target: process.env.API_INTERNO ?? 'http://localhost:3010',
          ws: true,
        },
      },
    },
  };
});
