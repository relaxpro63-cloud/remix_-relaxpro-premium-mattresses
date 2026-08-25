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
        // Dev only: the /api/lead function exists on Vercel, proxy there so
        // local form submissions still reach the lead Sheet.
        '/api/lead': {
          target: 'https://www.relaxpromattress.com',
          changeOrigin: true,
          secure: true,
        },
      },
    },
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    },
    build: {
      target: 'es2018',
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('gsap') || id.includes('lenis')) return 'scroll';
              if (id.includes('@sanity') || id.includes('sanity')) return 'sanity';
              if (id.includes('motion') || id.includes('framer-motion')) return 'motion';
              if (id.includes('react-dom') || id.includes('react-router') || id.includes('react-helmet') || id.includes('scheduler')) return 'react';
            }
          },
        },
      },
    },
  };
});
