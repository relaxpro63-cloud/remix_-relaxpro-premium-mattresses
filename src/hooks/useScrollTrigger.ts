import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollTriggerConfig {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  toggleActions?: string;
}

/**
 * Custom hook wrapping GSAP ScrollTrigger with React lifecycle cleanup.
 * Returns a ref to attach to the trigger element.
 */
export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(
  animation: (el: T, st: typeof ScrollTrigger) => gsap.core.Timeline | gsap.core.Tween | ScrollTrigger | void,
  deps: unknown[] = []
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      animation(el, ScrollTrigger);
    }, el);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * Simple hook that returns whether an element is in view via ScrollTrigger.
 */
export function useInViewGSAP<T extends HTMLElement = HTMLDivElement>(
  config?: Partial<ScrollTriggerConfig>
) {
  const ref = useRef<T | null>(null);
  const isInView = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: config?.start ?? 'top 85%',
      end: config?.end ?? 'bottom 15%',
      onEnter: () => { isInView.current = true; config?.onEnter?.(); },
      onLeave: () => { isInView.current = false; config?.onLeave?.(); },
      onEnterBack: () => { isInView.current = true; config?.onEnterBack?.(); },
      onLeaveBack: () => { isInView.current = false; config?.onLeaveBack?.(); },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return ref;
}

export default useScrollTrigger;
