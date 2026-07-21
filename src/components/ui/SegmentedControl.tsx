import React from 'react';
import { motion } from 'motion/react';

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  sublabel?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`relative flex items-center p-1 bg-neutral-light/50 border border-brand-200/40 rounded-xl overflow-x-auto hide-scrollbar ${
        fullWidth ? 'w-full' : 'inline-flex'
      }`}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(option.value);
            }}
            className={`relative flex-1 flex flex-col items-center justify-center rounded-lg transition-colors cursor-pointer select-none whitespace-nowrap min-w-max ${
              size === 'sm' ? 'px-3 py-1.5' : size === 'lg' ? 'px-6 py-3' : 'px-4 py-2'
            } ${isActive ? 'text-primary' : 'text-neutral-dark/60 hover:text-primary hover:bg-white/40'}`}
          >
            {isActive && (
              <motion.div
                layoutId={`segmented-active-${options[0].value}`}
                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-brand-200/40"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span
              className={`relative z-10 font-accent font-bold uppercase tracking-widest ${
                size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'
              }`}
            >
              {option.label}
            </span>
            {option.sublabel && (
              <span
                className={`relative z-10 font-mono tracking-widest uppercase mt-0.5 opacity-60 ${
                  size === 'sm' ? 'text-[7px]' : size === 'lg' ? 'text-[10px]' : 'text-[8px]'
                }`}
              >
                {option.sublabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
