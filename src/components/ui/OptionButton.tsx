import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  hint?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function OptionButton({
  selected,
  onClick,
  children,
  hint,
  className = '',
  disabled = false,
  size = 'md',
}: OptionButtonProps) {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const rippleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    };
  }, []);

  const handleRipple = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    rippleTimeoutRef.current = setTimeout(() => setRipple(null), 500);
  };

  const sizeClasses = {
    sm: 'py-2 px-2 text-[10px] sm:text-[11px]',
    md: 'py-2.5 sm:py-3 px-2 sm:px-3 text-[11px] sm:text-xs',
    lg: 'py-3 sm:py-3.5 px-3 sm:px-4 text-xs sm:text-[13px]',
  };

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={(e) => { handleRipple(e); onClick(); }}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.03, y: -3 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`
        relative overflow-hidden rounded-xl border text-center transition-all duration-300 cursor-pointer
        select-none outline-none group
        ${sizeClasses[size]}
        ${selected
          ? 'border-brand-600 bg-brand-600 text-white font-bold shadow-lg shadow-brand-600/25 ring-2 ring-brand-600/20'
          : 'border-brand-200/60 bg-white text-ink-900 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 hover:shadow-md hover:shadow-brand-600/10 focus-visible:ring-2 focus-visible:ring-brand-600/30 focus-visible:border-brand-600'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {/* Ripple effect */}
      {ripple && (
        <span
          className="absolute w-8 h-8 rounded-full bg-brand-400/30 pointer-events-none animate-ping"
          style={{ left: ripple.x - 16, top: ripple.y - 16 }}
        />
      )}

      {/* Glow effect on selected */}
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-brand-400/5 to-brand-500/10 pointer-events-none" />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-1.5">
        {selected && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" strokeWidth={3} />}
        <span className="leading-tight">{children}</span>
      </span>
      {hint && (
        <span className={`block text-[8px] sm:text-[9px] mt-0.5 leading-tight ${selected ? 'text-brand-100' : 'text-graphite-400'}`}>
          {hint}
        </span>
      )}
    </motion.button>
  );
}
