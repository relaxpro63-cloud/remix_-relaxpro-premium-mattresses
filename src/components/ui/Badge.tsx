import React from 'react';

interface BadgeProps {
	children: React.ReactNode;
	className?: string;
}

export default function Badge({ children, className = '' }: BadgeProps) {
return (
<span
className={`inline-flex items-center rounded-full border border-brand-200 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary ${className}`.trim()}
>
{children}
</span>
);
}
