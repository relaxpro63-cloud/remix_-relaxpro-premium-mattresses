import React, { useState } from 'react';

interface RelaxProLogoProps {
  variant?: 'compact' | 'full' | 'footer';
  className?: string;
  inverse?: boolean;
}

const FALLBACK = '/relaxpro-logo.svg';

export default function RelaxProLogo({ variant = 'full', className = '', inverse = false }: RelaxProLogoProps) {
  const [imgError, setImgError] = useState(false);
  const logoFile = '/relaxpro-logo.svg';
  const src = imgError ? FALLBACK : logoFile;
  const isNav = variant === 'compact';

  // The official logo SVG has light-colored fills (for dark backgrounds).
  // On light backgrounds (inverse=false) we invert it via CSS filter so it's visible.
  // On dark backgrounds (inverse=true, e.g. footer) it shows as-is.
  const imgFilter = inverse ? '' : 'brightness(0)';

  if (variant === 'compact') {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src={src}
          alt="RelaxPro Premium Mattresses"
          className="w-[155px] h-[44px] md:w-[170px] md:h-[48px]"
          style={{ filter: imgFilter }}
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
          style={{ filter: imgFilter }}
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
        style={{ filter: imgFilter }}
        width={200}
        height={44}
        loading="eager"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
