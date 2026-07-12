import React, { type HTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'variant'> {
  variant?: Variant;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  icon,
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 min-h-11 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none';

  const variants: Record<Variant, string> = {
    primary: 'bg-accent text-primary hover:bg-accent-dark shadow-sm',
    secondary: 'bg-primary text-white hover:bg-neutral-dark shadow-sm',
    outline: 'border border-border text-primary hover:border-accent hover:text-accent',
    ghost: 'text-primary hover:text-accent',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`.trim()} {...rest}>
      <span>{children}</span>
      {icon && (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/5 group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
          {icon}
        </span>
      )}
    </button>
  );
}
