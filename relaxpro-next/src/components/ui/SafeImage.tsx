'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  referrerPolicy?: string;
  style?: React.CSSProperties;
}

export default function SafeImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.svg',
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  loading = 'lazy',
  referrerPolicy,
  style,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`bg-brand-100 flex items-center justify-center ${className}`}>
        <span className="text-xs text-neutral-dark/40">Image unavailable</span>
      </div>
    );
  }

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes={sizes || '(max-width: 768px) 100vw, 50vw'}
        className={className}
        priority={priority}
        {...(!priority ? { loading } : {})}
        onError={handleError}
        style={{ objectFit: 'cover', ...style }}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      priority={priority}
      {...(!priority ? { loading } : {})}
      onError={handleError}
      referrerPolicy={referrerPolicy as 'no-referrer' | 'origin' | 'no-referrer-when-downgrade' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' | undefined}
      style={style}
    />
  );
}
