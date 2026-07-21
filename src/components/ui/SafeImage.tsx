import React, { ImgHTMLAttributes, useState } from 'react';

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  src: string;
  alt: string;
}

const FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="%23e7e5e4"/><path d="M1.5 2L2 1.5 3 2.5M0 0h4v3H0z" fill="none" stroke="%23a8a29e" stroke-width="0.15"/><text x="2" y="1.85" text-anchor="middle" font-size="0.4" fill="%2378716c" font-family="sans-serif">RelaxPro</text></svg>';

export function SafeImage({ src, alt, ...rest }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== FALLBACK) setCurrentSrc(FALLBACK);
      }}
      {...rest}
    />
  );
}

export default SafeImage;
