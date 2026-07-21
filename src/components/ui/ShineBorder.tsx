import React from 'react';

interface ShineBorderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'key'> {
  children: React.ReactNode;
  className?: string;
  key?: React.Key | null;
  style?: React.CSSProperties;
}

export default function ShineBorder({ children, className = '', ...props }: ShineBorderProps) {
  return (
    <div className={`relative p-[1.5px] rounded-2xl bg-linear-to-r from-accent/40 via-blue-300 to-accent-dark/40 animate-shine animate-glow-soft ${className}`} {...props}>

      <div className="bg-white rounded-[calc(1rem-1px)] h-full w-full overflow-hidden flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}
