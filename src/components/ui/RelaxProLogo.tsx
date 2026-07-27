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

  if (variant === 'compact') {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src={src}
          alt="RelaxPro Premium Mattresses"
          className="w-[155px] h-[44px] md:w-[170px] md:h-[48px]"
          width={170}
          height={48}
          loading="eager"
          fetchPriority={isNav ? 'high' : undefined}
          onError={() => setImgError(true)}
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
          className="w-[200px] h-[84px] md:w-[240px] md:h-[100px]"
          width={240}
          height={100}
          loading="eager"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <img
        src={src}
        alt="RelaxPro Premium Mattresses"
        className="h-[44px] md:h-[52px] w-auto"
        width={200}
        height={44}
        loading="eager"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
