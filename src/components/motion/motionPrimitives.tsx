import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useInView, useSpring, useMotionValue, useTransform, MotionValue } from 'motion/react';

/* =============================================
   SHARED CONSTANTS
   ============================================= */
const EASE_LUXURY: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DURATION_REVEAL = 0.8;
const STAGGER_STEP = 0.08;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* =============================================
   REVEAL TEXT — Masked line-by-line rise
   ============================================= */
interface RevealTextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  delay?: number;
  splitBy?: 'words' | 'lines';
  stagger?: number;
}

export function RevealText({
  children,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  splitBy = 'words',
  stagger = STAGGER_STEP,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = usePrefersReducedMotion();

  const words = useMemo(() => {
    if (splitBy === 'words') return children.split(' ');
    return [children];
  }, [children, splitBy]);

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag ref={ref as React.RefObject<never>} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: DURATION_REVEAL,
              ease: EASE_LUXURY,
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Tag>
  );
}

/* =============================================
   FADE UP — Scroll-triggered fade + translate
   ============================================= */
interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}

export function FadeUp({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  y = 40,
  once = true,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-60px' });
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? {} : { opacity: 0, y }}
      animate={isInView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, ease: EASE_LUXURY, delay }}
    >
      {children}
    </motion.div>
  );
}

/* =============================================
   STAGGER CHILDREN — Orchestrates child stagger
   ============================================= */
interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function StaggerChildren({
  children,
  className = '',
  stagger = STAGGER_STEP,
  delay = 0,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView || reduced ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : stagger,
            delayChildren: reduced ? 0 : delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_LUXURY },
  },
};

/* =============================================
   PARALLAX IMAGE — Subtle scale + y-shift
   ============================================= */
interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  scale?: number;
  speed?: number;
  loading?: 'eager' | 'lazy';
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  scale = 1.1,
  speed = 50,
  loading = 'lazy',
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const y = useMotionValue(0);

  useEffect(() => {
    if (reduced || !ref.current) return;

    const el = ref.current;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = (windowH - rect.top) / (windowH + rect.height);
      y.set((progress - 0.5) * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reduced, speed, y]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        className="w-full h-full object-cover will-change-transform"
        style={{
          y: reduced ? 0 : y,
          scale: reduced ? 1 : scale,
        }}
      />
    </div>
  );
}

/* =============================================
   ANIMATED COUNTER — Spring count-up on view
   ============================================= */
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 1.5,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = usePrefersReducedMotion();

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: reduced ? 0 : duration,
  });

  const display = useTransform(spring, (v: number) =>
    Math.floor(v).toLocaleString('en-IN')
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <MotionValueDisplay value={display} />
      {suffix}
    </span>
  );
}

function MotionValueDisplay({ value }: { value: MotionValue<string> }) {
  const [text, setText] = useState('0');
  useEffect(() => {
    const unsubscribe = value.on('change', (v) => setText(v));
    return unsubscribe;
  }, [value]);
  return <>{text}</>;
}

/* =============================================
   GOLD SHIMMER — Sweep highlight on text
   ============================================= */
interface GoldShimmerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GoldShimmer({ children, className = '', delay = 1.5 }: GoldShimmerProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      {!reduced && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(120deg, transparent 30%, rgba(201,168,124,0.4) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
          }}
          initial={{ backgroundPosition: '-200% 0' }}
          animate={{ backgroundPosition: '200% 0' }}
          transition={{ duration: 1.8, ease: 'easeInOut', delay, repeat: 0 }}
        />
      )}
    </span>
  );
}

/* =============================================
   SCROLL INDICATOR — Bouncing chevron
   ============================================= */
export function ScrollIndicator({ className = '' }: { className?: string }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ delay: 2, duration: 1 }}
    >
      <span className="text-[10px] font-accent tracking-[0.3em] uppercase text-warm-white/60">
        Scroll
      </span>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent"
        animate={reduced ? {} : { y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </motion.svg>
    </motion.div>
  );
}

export { EASE_LUXURY, DURATION_REVEAL, STAGGER_STEP };
