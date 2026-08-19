import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

/** Ultra-thin fixed progress bar tracking overall page scroll. */
export default function ScrollProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    gsap.set(el, { scaleX: 0 });
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        gsap.to(el, { scaleX: self.progress, duration: 0.1, ease: 'none', overwrite: true });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200] bg-brand-600 pointer-events-none"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}
