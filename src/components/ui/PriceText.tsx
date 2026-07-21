import React from 'react';

const PRICE_REGEX = /[₹$]\s*[\d,]+(?:\.\d+)?/g;

interface PriceTextProps {
  children: React.ReactNode;
}

export default function PriceText({ children }: PriceTextProps) {
  const text = React.Children.toArray(children).join('');
  const matches = text.match(PRICE_REGEX);

  if (!matches) {
    return <>{children}</>;
  }

  const parts = text.split(PRICE_REGEX);

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {matches[i] && <span className="font-price">{matches[i]}</span>}
        </React.Fragment>
      ))}
    </>
  );
}
