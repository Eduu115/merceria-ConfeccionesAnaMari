import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
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
});
