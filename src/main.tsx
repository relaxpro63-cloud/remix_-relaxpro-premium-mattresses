import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import 'lenis/dist/lenis.css';

// Lenis+GSAP smooth scroll: desktop pointers only. On touch devices native
// momentum scrolling feels better AND this keeps the 130KB scroll chunk out
// of the critical path for most mobile visitors.
let cleanup: (() => void) | undefined;
if (
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  import('./lib/smoothScroll').then(({ initSmoothScroll }) => {
    cleanup = initSmoothScroll();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);

// Cleanup on HMR dispose (Vite dev)
if ((import.meta as any).hot) {
  (import.meta as any).hot.dispose(() => cleanup?.());
}
