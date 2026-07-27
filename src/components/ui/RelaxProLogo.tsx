import React, { useState } from 'react';

interface RelaxProLogoProps {
  variant?: 'compact' | 'full' | 'footer';
  className?: string;
}

const FALLBACK = '/images/relaxpro-logo.png';

export default function RelaxProLogo({ variant = 'full', className = '' }: RelaxProLogoProps) {
  const [imgError, setImgError] = useState(false);
  const logoFile = '/images/relaxpro-logo.png';
  const src = imgError ? FALLBACK : logoFile;
  const isNav = variant === 'compact';

  /**
   * All variants use height-only sizing with width:auto.
   * This prevents aspect-ratio distortion common with fixed w+h.
   * object-fit: contain ensures no cropping on edge cases.
   */

  if (variant === 'compact') {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src={src}
          alt="RelaxPro Premium Mattresses"
          className="h-14 md:h-16 lg:h-20 w-auto object-contain block"
          width={300}
          height={80}
          loading="eager"
          fetchPriority={isNav ? 'high' : undefined}
          onError={() => setImgError(true)}
          style={{ imageRendering: 'auto' }}
        />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col items-start select-none ${className}`}>
        <img
          src={src}
          alt="RelaxPro Premium Mattresses"
          className="h-20 md:h-24 lg:h-28 w-auto object-contain block"
          width={400}
          height={112}
          loading="eager"
          onError={() => setImgError(true)}
          style={{ imageRendering: 'auto' }}
        />
      </div>
    );
  }

  // Full variant (used on about/modals etc.)
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <img
        src={src}
        alt="RelaxPro Premium Mattresses"
        className="h-14 md:h-16 lg:h-20 w-auto object-contain block"
        width={300}
        height={80}
        loading="eager"
        onError={() => setImgError(true)}
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}
