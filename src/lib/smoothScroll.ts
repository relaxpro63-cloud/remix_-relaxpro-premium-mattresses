import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/**
 * Initialize Lenis smooth scrolling and sync with GSAP ticker.
 * Call once at app mount. Returns cleanup function.
 */
export function initSmoothScroll(): () => void {
  if (lenisInstance) return () => {};

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  lenisInstance = new Lenis({
    duration: prefersReduced ? 0.01 : 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 1.5,
  });

  // Wire Lenis to GSAP's ticker for synchronized scroll-driven animations
  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time: number) => {
    lenisInstance?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return () => {
    lenisInstance?.destroy();
    lenisInstance = null;
  };
}

/**
 * Get the current Lenis instance for programmatic scrollTo.
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Programmatic smooth scroll to a target element or position.
 */
export function smoothScrollTo(
  target: string | HTMLElement | number,
  options?: { offset?: number; duration?: number }
): void {
  lenisInstance?.scrollTo(target, {
    offset: options?.offset ?? 0,
    duration: options?.duration ?? 1.2,
  });
}
