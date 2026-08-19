import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion, hasFinePointer } from '../../lib/animations';

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, [role="button"], .card-hover, .card-luxury';

/**
 * Minimal desktop-only custom cursor: a small dot that expands over
 * interactive elements and can surface a short label via
 * `data-cursor-label="Explore"` on the target element. Never mounts its
 * DOM on touch devices or under reduced-motion — those users get the
 * native cursor, untouched.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    setEnabled(!prefersReducedMotion() && hasFinePointer());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('custom-cursor-active');
    return () => document.documentElement.classList.remove('custom-cursor-active');
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;

    const xTo = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3.out' });
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(INTERACTIVE_SELECTOR);
      if (target) {
        setHovering(true);
        setLabel(target.getAttribute('data-cursor-label') || '');
      }
    };
    const onOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(INTERACTIVE_SELECTOR);
      if (target) {
        setHovering(false);
        setLabel('');
      }
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    >
      <div
        className="flex items-center justify-center rounded-full bg-white transition-[width,height] duration-200 ease-out"
        style={{ width: hovering ? (label ? 64 : 32) : 8, height: hovering ? (label ? 64 : 32) : 8 }}
      >
        {label && (
          <span className="text-[9px] font-accent font-bold uppercase tracking-wider text-ink-900">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
