import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import 'lenis/dist/lenis.css';
import { initSmoothScroll } from './lib/smoothScroll';

// Initialize Lenis smooth scrolling + GSAP ticker
const cleanup = initSmoothScroll();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);

// Cleanup on HMR dispose (Vite dev)
if ((import.meta as any).hot) {
  (import.meta as any).hot.dispose(() => cleanup());
}
