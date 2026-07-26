import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      proxy: {
        '/api/sanity': {
          target: 'https://de6mndac.apicdn.sanity.io',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/sanity/, ''),
          secure: true,
        },
        '/api/sanity-write': {
          target: 'https://de6mndac.api.sanity.io',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/sanity-write/, ''),
          secure: true,
        },
      },
    },
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    },
  };
});
