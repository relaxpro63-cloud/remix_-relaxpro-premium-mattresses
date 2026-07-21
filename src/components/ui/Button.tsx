import React, { type HTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'variant'> {
  variant?: Variant;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center min-h-11 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-[1px] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none';

  const variants: Record<Variant, string> = {
    primary: 'bg-primary text-white hover:bg-neutral-dark shadow-sm',
    secondary: 'bg-brand-800 text-white hover:bg-primary shadow-sm',
    outline: 'border border-brand-200 text-primary hover:border-accent hover:text-accent',
    ghost: 'text-primary hover:text-accent',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
