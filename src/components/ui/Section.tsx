import React from 'react';

type Tone = 'default' | 'muted' | 'dark';

interface SectionProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  as?: 'section' | 'div';
}

export default function Section({
  children,
  tone = 'default',
  className = '',
  as: Tag = 'section',
}: SectionProps) {
  const toneClass =
    tone === 'muted'
      ? 'bg-brand-100/60'
      : tone === 'dark'
        ? 'bg-primary text-white'
        : '';

  return (
    <Tag className={`rp-section ${toneClass} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
