import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Central animation configuration — one place to tune the site's motion
 * language. Every GSAP-driven utility below pulls its easing/duration from
 * here so the whole site reads as one system, not per-component guesses.
 */
export const EASE = {
  smooth: 'power3.out',
  slow: 'power4.out',
  expo: 'expo.out',
} as const;

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 1.0,
  cinematic: 1.4,
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Splits an element's text into per-line spans (wrapped in an
 * overflow-hidden mask) so each line can be revealed independently —
 * the "editorial text reveal" pattern used across major headings.
 * Splits on natural line breaks after layout, so it stays correct
 * across breakpoints. Returns the created line elements.
 */
export function splitLines(el: HTMLElement): HTMLElement[] {
  const words = el.textContent?.split(/\s+/).filter(Boolean) ?? [];
  el.textContent = '';
  el.style.display = 'block';

  const wordSpans = words.map((word, i) => {
    const span = document.createElement('span');
    span.textContent = word + (i < words.length - 1 ? ' ' : '');
    span.style.display = 'inline-block';
    el.appendChild(span);
    return span;
  });

  // Group spans by their rendered line (offsetTop) now that layout has run.
  const lineMap = new Map<number, HTMLElement[]>();
  wordSpans.forEach((span) => {
    const top = span.offsetTop;
    if (!lineMap.has(top)) lineMap.set(top, []);
    lineMap.get(top)!.push(span);
  });

  el.textContent = '';
  const lines: HTMLElement[] = [];
  Array.from(lineMap.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([, spans]) => {
      const mask = document.createElement('span');
      mask.style.display = 'block';
      mask.style.overflow = 'hidden';
      const inner = document.createElement('span');
      inner.style.display = 'block';
      spans.forEach((s) => inner.appendChild(s));
      mask.appendChild(inner);
      el.appendChild(mask);
      lines.push(inner);
    });

  return lines;
}

interface SplitTextRevealOptions {
  stagger?: number;
  y?: number;
  delay?: number;
  scrollTriggered?: boolean;
}

/**
 * React hook: reveals a heading line-by-line (translateY + opacity) the
 * moment it scrolls into view. Falls back to a plain opacity fade under
 * reduced-motion.
 */
export function useSplitTextReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: SplitTextRevealOptions = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { stagger = 0.08, y = 100, delay = 0, scrollTriggered = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const lines = splitLines(el);
      gsap.set(lines, { yPercent: y, opacity: 0 });
      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: DURATION.slow,
        ease: EASE.expo,
        stagger,
        delay,
        scrollTrigger: scrollTriggered
          ? { trigger: el, start: 'top 85%', once: true }
          : undefined,
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/**
 * React hook: clip-path "unveil" reveal for hero/editorial imagery —
 * inset(8%) → inset(0%) combined with a scale settle, matching the
 * luxury-magazine photograph reveal from the spec.
 */
export function useImageReveal<T extends HTMLElement = HTMLDivElement>(
  options: { delay?: number; scrollTriggered?: boolean } = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { delay = 0, scrollTriggered = false } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { clipPath: 'inset(8% 8% 8% 8%)', scale: 1.08, opacity: 0 });
      gsap.to(el, {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        opacity: 1,
        duration: DURATION.cinematic,
        ease: EASE.smooth,
        delay,
        scrollTrigger: scrollTriggered
          ? { trigger: el, start: 'top 80%', once: true }
          : undefined,
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/**
 * React hook: animates a number counting up from 0 once the element
 * scrolls into view (stat/trust counters).
 */
export function useCounter<T extends HTMLElement = HTMLSpanElement>(
  value: number,
  options: { duration?: number; decimals?: number } = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { duration = 1.5, decimals = 0 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.textContent = value.toFixed(decimals);
      return;
    }

    const counter = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(counter, {
        val: value,
        duration,
        ease: EASE.smooth,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = counter.val.toFixed(decimals);
        },
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, decimals]);

  return ref;
}
