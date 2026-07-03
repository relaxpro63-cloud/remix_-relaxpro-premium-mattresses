import React from 'react';

interface RelaxProLogoProps {
  variant?: 'compact' | 'full' | 'footer';
  className?: string;
  inverse?: boolean;
}

export default function RelaxProLogo({ variant = 'full', className = '', inverse = false }: RelaxProLogoProps) {
  const fillColor = inverse ? '#ffffff' : '#0c0a09'; // stone-950

  if (variant === 'compact') {
    // Only show the RELAX PRO brand mark with integrated roof and bed
    return (
      <div className={`flex items-center select-none ${className}`}>
        <svg
          viewBox="0 0 440 120"
          className="w-[155px] h-[44px] md:w-[170px] md:h-[48px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* R E L A X text paths */}
          <text x="35" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={fillColor}>R</text>
          <text x="100" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={fillColor}>E</text>
          <text x="162" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={fillColor}>L</text>
          <text x="218" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={fillColor}>A</text>
          <text x="290" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={fillColor}>X</text>

          {/* House Roof on top of A */}
          <path d="M 211,44 L 239,20 L 267,44" stroke={fillColor} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
          <rect x="254" y="24" width="6" height="12" fill={fillColor} />
          {/* Attic window cross overlay */}
          <rect x="235" y="29" width="8" height="8" rx="1.5" fill="none" stroke={fillColor} strokeWidth="1.5" />
          <line x1="239" y1="29" x2="239" y2="37" stroke={fillColor} strokeWidth="1.2" />
          <line x1="235" y1="33" x2="243" y2="33" stroke={fillColor} strokeWidth="1.2" />

          {/* Blue Bed frame on the crossbar of A */}
          {/* Head post */}
          <line x1="211" y1="72" x2="211" y2="92" stroke="#317FBA" strokeWidth="3" strokeLinecap="round" />
          {/* Tail post */}
          <line x1="267" y1="72" x2="267" y2="92" stroke="#317FBA" strokeWidth="3" strokeLinecap="round" />
          {/* Main mattress frame */}
          <line x1="211" y1="81" x2="267" y2="81" stroke="#317FBA" strokeWidth="3.5" strokeLinecap="round" />
          {/* Legs */}
          <line x1="218" y1="81" x2="218" y2="92" stroke="#317FBA" strokeWidth="2.2" />
          <line x1="260" y1="81" x2="260" y2="92" stroke="#317FBA" strokeWidth="2.2" />
          {/* Pillow */}
          <rect x="216" y="75" width="13" height="5" rx="1" fill="#317FBA" />
          {/* Sleep blanket contour waves */}
          <path d="M 218,75 Q 228,68 238,75 T 258,75" stroke="#317FBA" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />

          {/* PRO text badge top right of X */}
          <text x="348" y="52" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="24" fill="#317FBA" letterSpacing="1">PRO</text>
        </svg>
      </div>
    );
  }

  // Otherwise, render full lockup (either simple full, or with footer margins)
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 440 185"
        className="w-[200px] h-[84px] md:w-[240px] md:h-[100px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* R E L A X text paths */}
        <text x="35" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={fillColor}>R</text>
        <text x="100" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={fillColor}>E</text>
        <text x="162" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={fillColor}>L</text>
        <text x="218" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={fillColor}>A</text>
        <text x="290" y="98" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="900" fontSize="72" fill={fillColor}>X</text>

        {/* House Roof on top of A */}
        <path d="M 211,44 L 239,20 L 267,44" stroke={fillColor} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="254" y="24" width="6" height="12" fill={fillColor} />
        {/* Attic window cross overlay */}
        <rect x="235" y="29" width="8" height="8" rx="1.5" fill="none" stroke={fillColor} strokeWidth="1.5" />
        <line x1="239" y1="29" x2="239" y2="37" stroke={fillColor} strokeWidth="1.2" />
        <line x1="235" y1="33" x2="243" y2="33" stroke={fillColor} strokeWidth="1.2" />

        {/* Blue Bed frame on the crossbar of A */}
        {/* Head post */}
        <line x1="211" y1="72" x2="211" y2="92" stroke="#317FBA" strokeWidth="3" strokeLinecap="round" />
        {/* Tail post */}
        <line x1="267" y1="72" x2="267" y2="92" stroke="#317FBA" strokeWidth="3" strokeLinecap="round" />
        {/* Main mattress frame */}
        <line x1="211" y1="81" x2="267" y2="81" stroke="#317FBA" strokeWidth="3.5" strokeLinecap="round" />
        {/* Legs */}
        <line x1="218" y1="81" x2="218" y2="92" stroke="#317FBA" strokeWidth="2.2" />
        <line x1="260" y1="81" x2="260" y2="92" stroke="#317FBA" strokeWidth="2.2" />
        {/* Pillow */}
        <rect x="216" y="75" width="13" height="5" rx="1" fill="#317FBA" />
        {/* Sleep blanket contour waves */}
        <path d="M 218,75 Q 228,68 238,75 T 258,75" stroke="#317FBA" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />

        {/* PRO text badge top right of X */}
        <text x="348" y="52" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="24" fill="#317FBA" letterSpacing="1">PRO</text>

        {/* Subtitle Pill capsule "Sleep Better Wake Better" */}
        <rect x="110" y="122" width="220" height="23" rx="11.5" fill={inverse ? '#ffffff' : '#18181b'} />
        <text
          x="220"
          y="137"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontWeight="bold"
          fontSize="11.5"
          fill={inverse ? '#18181b' : '#317FBA'}
          textAnchor="middle"
        >
          Sleep Better Wake Better
        </text>

        {/* Subtitles: MATTRESSES • SOFAS • INTERIORS */}
        {variant === 'footer' && (
          <text
            x="220"
            y="172"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="bold"
            fontSize="10"
            fill={inverse ? '#a8a29e' : '#57534e'}
            textAnchor="middle"
            letterSpacing="1.2"
          >
            MATTRESSES • SOFAS • INTERIORS
          </text>
        )}
      </svg>
    </div>
  );
}
