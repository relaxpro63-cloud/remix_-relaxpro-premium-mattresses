interface RelaxProLogoProps {
  variant?: 'compact' | 'full' | 'footer';
  className?: string;
}

// Real brand mark: "REL[hut+bed]X PRO" — the A is the house/bed glyph, not a letter.
// Height-only sizing + intrinsic 1074x350 keeps the aspect ratio and avoids CLS.
const SIZES = {
  compact: 'h-12 md:h-14 lg:h-16',
  footer: 'h-14 md:h-16 lg:h-20',
  full: 'h-16 md:h-20 lg:h-24',
} as const;

export default function RelaxProLogo({ variant = 'full', className = '' }: RelaxProLogoProps) {
  return (
    <img
      src="/images/relaxpro-logo.png"
      alt="RelaxPro Premium Mattresses — Sleep Better Wake Better"
      className={`${SIZES[variant]} w-auto object-contain block select-none ${className}`}
      width={1074}
      height={350}
      loading="eager"
      fetchPriority={variant === 'compact' ? 'high' : undefined}
    />
  );
}
