import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { usePrefersReducedMotion, SPRING_TAP, SPRING_HOVER } from '../motion/motionPrimitives';
import { useMagnetic } from '../../lib/animations';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'variant'> {
  variant?: Variant;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const reduced = usePrefersReducedMotion();
  const magneticRef = useMagnetic<HTMLSpanElement>(8);
  const isMagnetic = variant === 'primary' || variant === 'secondary';

  const base =
    'inline-flex items-center justify-center min-h-11 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none';

  const variants: Record<Variant, string> = {
    primary: 'bg-gradient-to-r from-[#0A5487] via-[#1685C5] to-[#0A5487] bg-[length:200%_100%] bg-left hover:bg-right text-white shadow-lg shadow-brand-600/25',
    secondary: 'bg-gradient-to-b from-brand-700 to-brand-800 text-white hover:from-brand-600 hover:to-brand-800 shadow-sm',
    outline: 'border border-brand-200 text-ink-900 hover:border-brand-600 hover:text-brand-600',
    ghost: 'text-ink-900 hover:text-brand-600',
  };

  const lift = isMagnetic ? -2 : 0;

  const button = (
    <motion.button
      className={`${base} ${variants[variant]} ${className}`.trim()}
      whileHover={reduced ? undefined : { y: lift, scale: 1.01, transition: SPRING_HOVER }}
      whileTap={reduced ? undefined : { y: 1, scale: 0.97, transition: SPRING_TAP }}
      {...rest}
    >
      {children}
    </motion.button>
  );

  if (!isMagnetic) return button;

  return (
    <span ref={magneticRef} className="inline-block">
      {button}
    </span>
  );
}
