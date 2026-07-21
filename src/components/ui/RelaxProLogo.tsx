import React from 'react';

interface RelaxProLogoProps {
  variant?: 'compact' | 'full' | 'footer';
  className?: string;
  inverse?: boolean;
}

export default function RelaxProLogo({ variant = 'full', className = '', inverse = false }: RelaxProLogoProps) {
  const textColor = inverse ? '#ffffff' : '#1E1E1E';
  const blue = '#2D8CFF';
  const subtitleColor = inverse ? '#ffffff' : '#1E1E1E';
  const footerSubtitleColor = inverse ? '#71717A' : '#4A5A57';

  if (variant === 'compact') {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <svg
          viewBox="0 0 440 120"
          className="w-[155px] h-[44px] md:w-[170px] md:h-[48px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text x="35" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={textColor}>R</text>
          <text x="100" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={textColor}>E</text>
          <text x="162" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={textColor}>L</text>
          <text x="218" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={textColor}>A</text>
          <text x="290" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={textColor}>X</text>

          <path d="M 211,44 L 239,20 L 267,44" stroke={textColor} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
          <rect x="254" y="24" width="6" height="12" fill={textColor} />
          <rect x="235" y="29" width="8" height="8" rx="1.5" fill="none" stroke={textColor} strokeWidth="1.5" />
          <line x1="239" y1="29" x2="239" y2="37" stroke={textColor} strokeWidth="1.2" />
          <line x1="235" y1="33" x2="243" y2="33" stroke={textColor} strokeWidth="1.2" />

          <line x1="211" y1="72" x2="211" y2="92" stroke={blue} strokeWidth="3" strokeLinecap="round" />
          <line x1="267" y1="72" x2="267" y2="92" stroke={blue} strokeWidth="3" strokeLinecap="round" />
          <line x1="211" y1="81" x2="267" y2="81" stroke={blue} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="218" y1="81" x2="218" y2="92" stroke={blue} strokeWidth="2.2" />
          <line x1="260" y1="81" x2="260" y2="92" stroke={blue} strokeWidth="2.2" />
          <rect x="216" y="75" width="13" height="5" rx="1" fill={blue} />
          <path d="M 218,75 Q 228,68 238,75 T 258,75" stroke={blue} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />

          <text x="348" y="52" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="24" fill={blue} letterSpacing="1">PRO</text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 440 185"
        className="w-[200px] h-[84px] md:w-[240px] md:h-[100px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text x="35" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={textColor}>R</text>
        <text x="100" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={textColor}>E</text>
        <text x="162" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={textColor}>L</text>
        <text x="218" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={textColor}>A</text>
        <text x="290" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={textColor}>X</text>

        <path d="M 211,44 L 239,20 L 267,44" stroke={textColor} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="254" y="24" width="6" height="12" fill={textColor} />
        <rect x="235" y="29" width="8" height="8" rx="1.5" fill="none" stroke={textColor} strokeWidth="1.5" />
        <line x1="239" y1="29" x2="239" y2="37" stroke={textColor} strokeWidth="1.2" />
        <line x1="235" y1="33" x2="243" y2="33" stroke={textColor} strokeWidth="1.2" />

        <line x1="211" y1="72" x2="211" y2="92" stroke={blue} strokeWidth="3" strokeLinecap="round" />
        <line x1="267" y1="72" x2="267" y2="92" stroke={blue} strokeWidth="3" strokeLinecap="round" />
        <line x1="211" y1="81" x2="267" y2="81" stroke={blue} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="218" y1="81" x2="218" y2="92" stroke={blue} strokeWidth="2.2" />
        <line x1="260" y1="81" x2="260" y2="92" stroke={blue} strokeWidth="2.2" />
        <rect x="216" y="75" width="13" height="5" rx="1" fill={blue} />
        <path d="M 218,75 Q 228,68 238,75 T 258,75" stroke={blue} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />

        <text x="348" y="52" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="24" fill={blue} letterSpacing="1">PRO</text>

        <rect x="110" y="122" width="220" height="23" rx="11.5" fill={inverse ? '#ffffff' : '#18181b'} />
        <text x="220" y="137" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="bold" fontSize="11.5" fill={blue} textAnchor="middle">Sleep Better Wake Better</text>

        {variant === 'footer' && (
          <text x="220" y="172" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="bold" fontSize="10" fill={footerSubtitleColor} textAnchor="middle" letterSpacing="1.2">MATTRESSES • SOFAS • INTERIORS</text>
        )}
      </svg>
    </div>
  );
}
