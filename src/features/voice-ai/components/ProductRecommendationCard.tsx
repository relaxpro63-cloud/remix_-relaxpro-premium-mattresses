import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import SafeImage from '../../../components/ui/SafeImage';
import type { RecommendedProduct } from '../types';

const SIZE_LABEL: Record<string, string> = {
  single: 'Single',
  double: 'Double',
  queen: 'Queen',
  king: 'King',
  diwan: 'Diwan',
};

function formatPrice(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

interface Props {
  product: RecommendedProduct;
  onNavigate: (url: string) => void;
  onEnquire: (product: RecommendedProduct) => void;
}

export default function ProductRecommendationCard({ product, onNavigate, onEnquire }: Props) {
  return (
    <article className="w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl border border-graphite-200 bg-white shadow-sm">
      <div className="relative aspect-4/3 bg-linen-100">
        {product.imageUrl && (
          <SafeImage
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {product.score}% Match
        </span>
      </div>

      <div className="space-y-2.5 p-3.5">
        <div>
          <h3 className="font-display text-sm font-semibold leading-snug text-ink-900">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="mt-0.5 line-clamp-1 text-[11px] text-graphite-500">{product.tagline}</p>
          )}
        </div>

        {product.price !== null ? (
          <p className="font-display text-lg font-bold text-brand-700">
            {formatPrice(product.price)}
            {product.size && (
              <span className="ml-1 text-[11px] font-normal text-graphite-500">
                / {SIZE_LABEL[product.size] ?? product.size}
              </span>
            )}
          </p>
        ) : (
          <p className="text-xs text-graphite-500">Price on request</p>
        )}

        <ul className="space-y-1">
          {product.reasons.slice(0, 3).map((reason) => (
            <li key={reason} className="flex items-start gap-1.5 text-[11px] text-graphite-600">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-eco-500" aria-hidden="true" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => onNavigate(product.url)}
            className="flex-1 rounded-full border border-brand-200 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-brand-700 transition-colors hover:border-brand-600"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onEnquire(product)}
            aria-label={`Enquire about ${product.name}`}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-brand-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-700"
          >
            Enquire
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
