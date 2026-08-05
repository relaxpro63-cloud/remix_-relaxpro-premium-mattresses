import React from 'react';
import { motion } from 'motion/react';
import PriceText from '../ui/PriceText';
import SegmentedControl from '../ui/SegmentedControl';
import { MagnifyingGlass, Info, ShoppingCart, CaretRight, ArrowRight, Truck, Leaf, Star } from '@phosphor-icons/react';
import { Product, MattressSize } from '../../types';

interface ProductCardProps {
  product: Product;
  variant?: 'catalog' | 'featured';
  badge?: string;
  rating?: number;
  onClick?: () => void;
  activeSize?: MattressSize;
  onNavigateToPdp?: (slug: string) => void;
  handleBuyNow?: (product: Product, size: MattressSize) => void;
  handleAddToCart?: (product: Product, size: MattressSize) => void;
  justAdded?: Set<string>;
  setProductSize?: (slug: string, size: MattressSize) => void;
  getProductStartingPrice?: (product: Product, size: MattressSize) => number;
  hasLatex?: (product: Product) => boolean;
  getFirmnessBadge?: (level: string) => { label: string; color: string };
}

const defaultHasLatex = (p: Product): boolean =>
  Array.isArray(p.layers) && p.layers.some((l) => l.material === 'latex' || l.material === 'latex_rebonded');

const defaultGetProductStartingPrice = (p: Product, size: MattressSize): number => {
  if (p.pricingModel === 'with_without_accessories') {
    return p.pricing.withoutAccessories?.[size] || 0;
  }
  return p.pricing.fabric300Gsm?.[size] || 0;
};

const defaultGetFirmnessBadge = (level: string): { label: string; color: string } => {
  const softLevels = ['plush', 'soft', 'soft-medium', 'medium-soft'];
  const mediumLevels = ['medium', 'medium-firm', 'medium-plush'];
  if (softLevels.includes(level)) return { label: 'Soft', color: 'bg-success-500/15 text-success border-success/20' };
  if (mediumLevels.includes(level)) return { label: 'Medium', color: 'bg-blue-500/15 text-blue-600 border-blue-200' };
  return { label: 'Firm', color: 'bg-orange-500/15 text-orange-600 border-orange-200' };
};

export default function ProductCard({
  product,
  variant = 'catalog',
  badge,
  rating,
  onClick,
  activeSize = 'king',
  onNavigateToPdp = () => {},
  handleBuyNow = () => {},
  handleAddToCart = () => {},
  justAdded = new Set<string>(),
  setProductSize = () => {},
  getProductStartingPrice = defaultGetProductStartingPrice,
  hasLatex = defaultHasLatex,
  getFirmnessBadge = defaultGetFirmnessBadge,
}: ProductCardProps) {
  const isLatex = hasLatex(product);
  const price = getProductStartingPrice(product, activeSize);
  const isBestSeller = product.slug === 'nirvana' || (product.badge && product.badge.toLowerCase().includes('best seller'));
  const isHeroCard = false; // This will be determined by the parent component

  const cardInner = (
    <>
      {/* Luxury Gold/Silver Border for Luxury Tier */}
      {product.tier === 'luxury' && (
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent via-accent-light to-accent z-10"></div>
      )}

      {/* Header metadata display */}
      <div className="p-2 sm:p-5 bg-bg/50 border-b border-brand-200/40 flex flex-row items-center justify-between gap-1 sm:gap-0 text-[7px] sm:text-[10px] font-mono text-muted/70 select-none">
        <span className="uppercase tracking-widest font-bold text-accent truncate">{product.tier} collection</span>
        <span className="text-[9px] sm:text-[10px] font-mono text-muted/60 uppercase tracking-widest">
          GOLS Certified
        </span>
      </div>

{/* Product Image block */}
        <div className="h-28 sm:h-48 md:h-60 relative overflow-hidden bg-bg cursor-pointer img-zoom group" onClick={() => onNavigateToPdp(product.slug)}>
        {product.badge && (
          <span className="absolute top-1 sm:top-4 left-1 sm:left-4 bg-primary/95 backdrop-blur-sm text-white font-accent text-[6px] sm:text-[10px] tracking-widest uppercase font-bold px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-md border border-white/10 shadow-lg z-10 max-w-[80%] truncate">
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        
        {/* Hover overlay with craft hint */}
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6">
          <span className="btn-primary bg-white text-primary text-xs font-accent font-bold px-6 py-3 rounded-xl shadow-xl flex items-center gap-2">
            Quick View <CaretRight className="w-4 h-4 text-accent" />
          </span>
          <span className="text-white/70 text-[10px] font-mono uppercase tracking-widest">
            Handcrafted in 7 days
          </span>
        </div>
      </div>

      {/* Core Card Info */}
      <div className="p-2 sm:p-5 md:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Name & Comfort rating line */}
          <div className="flex flex-row justify-between items-start gap-1 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-heading font-bold text-xs sm:text-xl md:text-2xl text-primary flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 truncate">
                {product.name}
                {isBestSeller && (
                  <span className="text-[6px] sm:text-[9px] font-accent font-bold uppercase tracking-widest text-accent bg-accent/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded-md border border-accent/20 text-center">Best Seller</span>
                )}
              </h3>
              <span className="hidden sm:block text-[9px] sm:text-[11px] text-muted/60 font-body italic leading-tight sm:leading-normal truncate">{product.tagline}</span>
            </div>
            
            {/* Comfort label */}
            <div className="text-right shrink-0 flex flex-col items-end">
              {(() => {
                const badge = getFirmnessBadge(product.comfortLevel);
                return (
                  <span className={`inline-block text-[6px] sm:text-[10px] font-bold tracking-widest font-mono uppercase px-1 sm:px-2.5 py-0.5 sm:py-1 rounded-md border ${badge.color}`}>
                    {badge.label}
                  </span>
                );
              })()}
              <div className="flex items-center justify-end gap-0.5 sm:gap-1 mt-1 sm:mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full ${
                      i < product.comfortRating ? 'bg-accent shadow-sm' : 'bg-bg border border-brand-200/50'
                    }`}
                  ></span>
                ))}
              </div>
            </div>
          </div>

          {/* Brief description */}
          <p className="hidden sm:block text-[10px] sm:text-sm text-muted/80 mt-3 sm:mt-5 leading-relaxed line-clamp-2 font-body">
            {product.keyBenefit}
          </p>

          {/* Details specs bullets checklist */}
          <div className="mt-2 sm:mt-6 pt-2 sm:pt-5 border-t border-brand-200/40 space-y-1 sm:space-y-2.5 text-[7px] sm:text-xs text-muted/70 font-body">
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="w-2 h-2 sm:w-5 sm:h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <span className="w-0.5 h-0.5 sm:w-1.5 sm:h-1.5 rounded-full bg-accent"></span>
              </div>
              <span className="truncate">Thick: <strong className="text-primary font-bold">{product.totalThickness}"</strong></span>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="w-2 h-2 sm:w-5 sm:h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <span className="w-0.5 h-0.5 sm:w-1.5 sm:h-1.5 rounded-full bg-accent"></span>
              </div>
              <span className="truncate">Cover: <strong className="text-primary font-bold">{product.fabricGsm}GSM {product.fabricType.split(' ')[0]}</strong></span>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="w-2 h-2 sm:w-5 sm:h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <span className="w-0.5 h-0.5 sm:w-1.5 sm:h-1.5 rounded-full bg-accent"></span>
              </div>
              <span className="truncate">Latex: <strong className="text-primary font-bold">{isLatex ? 'Yes' : 'No'}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Mattress Size Configurator inside each block */}
        <div className="mt-2 sm:mt-6 pt-2 sm:pt-5 border-t border-brand-200/40" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-2 sm:gap-3 mb-1.5 sm:mb-4">
            <span className="text-[9px] sm:text-[10px] font-accent text-muted/60 uppercase tracking-widest">
              Select size
            </span>

            {/* Desktop: full-word segmented control */}
            <div className="hidden sm:block">
              <SegmentedControl
                options={[
                  { value: 'king', label: 'King' },
                  { value: 'queen', label: 'Queen' },
                  { value: 'double', label: 'Double' },
                  { value: 'single', label: 'Single' },
                ]}
                value={activeSize}
                onChange={(sz) => setProductSize(product.slug, sz as MattressSize)}
                size="sm"
                fullWidth
              />
            </div>

            {/* Mobile: native select with full size labels */}
            <div className="sm:hidden">
              <select
                value={activeSize}
                onChange={(e) => setProductSize(product.slug, e.target.value as MattressSize)}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Select size for ${product.name}`}
                className="w-full bg-secondary border border-brand-200/60 text-xs font-accent font-bold text-primary px-3 py-2.5 rounded-lg cursor-pointer outline-none appearance-none pr-8"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230F1F17' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                }}
              >
                <option value="king">King Size (72"×78")</option>
                <option value="queen">Queen Size (60"×78")</option>
                <option value="double">Double Size (48"×75")</option>
                <option value="single">Single Size (36"×75")</option>
              </select>
            </div>
          </div>

          {/* Price indicator - selected size only */}
          <div className="flex flex-row justify-between items-center p-1.5 sm:p-4 rounded-lg sm:rounded-xl border border-brand-200/50 bg-secondary shadow-sm mt-1 sm:mt-2">
            <div className="flex flex-col">
              <span className="text-[6px] sm:text-[9px] font-accent text-muted/60 tracking-widest uppercase mb-0.5 sm:mb-1">
                {activeSize.charAt(0).toUpperCase() + activeSize.slice(1)} price
              </span>
              <div className="flex items-baseline gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-2xl font-bold font-heading text-primary">
                  <PriceText>₹{price.toLocaleString('en-IN')}</PriceText>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions buttons */}
      <div className="p-1.5 sm:p-5 bg-white border-t border-brand-200/40 grid grid-cols-2 sm:flex sm:flex-row gap-1 sm:gap-2 rounded-b-2xl">
        <button
          onClick={(e) => { e.stopPropagation(); onNavigateToPdp(product.slug); }}
          className="col-span-1 sm:flex-1 py-1.5 sm:py-3 px-1 sm:px-3 rounded-md sm:rounded-xl border border-border hover:border-accent bg-white hover:bg-accent/5 font-accent font-bold text-primary flex items-center justify-center gap-1 cursor-pointer transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent/10 text-[8px] sm:text-xs"
        >
          <Info className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-accent" /> <span className="hidden sm:inline">Details</span><span className="sm:hidden">Info</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleBuyNow(product, activeSize); }}
          className="col-span-1 sm:flex-1 py-1.5 sm:py-3 px-1 sm:px-3 rounded-md sm:rounded-xl bg-accent hover:bg-accent-dark text-primary font-accent font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent/20 text-[8px] sm:text-xs"
        >
          Buy
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleAddToCart(product, activeSize); }}
          className="col-span-2 sm:flex-1 py-2 sm:py-3 px-1 sm:px-3 rounded-md sm:rounded-xl bg-primary hover:bg-neutral-dark text-white font-accent font-bold flex items-center justify-center gap-1 cursor-pointer shadow-sm transition-[transform,background-color,border-color,color,box-shadow] duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary/20 text-[9px] sm:text-xs"
        >
          <ShoppingCart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white/80" />
          {justAdded.has(product.slug) ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </>
  );

  // Featured variant (used on the home page bestsellers section)
  if (variant === 'featured') {
    const displayBadge = badge ?? product.badge;
    const stars = rating ?? product.comfortRating ?? 5;
    const featuredPrice = getProductStartingPrice(product, 'king');
    const go = onClick ?? (() => onNavigateToPdp(product.slug));
    return (
      <motion.article
        key={product.slug}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={go}
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgba(10,23,19,0.05)] ring-1 ring-brand-200/40 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(10,23,19,0.12)]"
      >
        {product.tier === 'luxury' && (
          <div className="absolute inset-x-0 top-0 z-10 h-1.5 bg-gradient-to-r from-accent via-accent-light to-accent" />
        )}

        {/* Image */}
        <div className="relative aspect-[16/11] overflow-hidden bg-brand-100">
          {displayBadge && (
            <span className="absolute left-4 top-4 z-10 rounded-md border border-white/10 bg-primary/95 px-3 py-1.5 text-[10px] font-accent font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-sm">
              {displayBadge}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent" />
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-heading text-2xl font-bold leading-tight text-primary">{product.name}</h3>
            <div className="flex shrink-0 items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  weight={i < stars ? 'fill' : 'regular'}
                  className={`h-4 w-4 ${i < stars ? 'text-accent' : 'text-brand-200'}`}
                />
              ))}
            </div>
          </div>

          <p className="mt-2 font-body text-sm italic leading-snug text-muted/70">{product.tagline}</p>

          <p className="mt-4 line-clamp-2 font-body text-sm leading-relaxed text-muted/80">{product.keyBenefit}</p>

          <div className="mt-auto flex items-end justify-between pt-6">
            <div className="flex flex-col">
              <span className="font-accent text-[10px] uppercase tracking-widest text-muted/60">From</span>
              <span className="font-heading text-2xl font-bold text-primary">
                <PriceText>₹{featuredPrice.toLocaleString('en-IN')}</PriceText>
              </span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-accent font-bold uppercase tracking-widest text-white transition-transform duration-200 group-hover:translate-x-1">
              View
              <CaretRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.div
      key={product.slug}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(0, 0.4) }} // Delay will be set by parent
      className="h-full cursor-pointer fade-up"
      onClick={() => onNavigateToPdp(product.slug)}
    >
      {isBestSeller ? (
        <div className="h-full flex flex-col justify-between group rounded-2xl bg-white card-hover shadow-sm border border-brand-200/40">
          {cardInner}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-200/40 shadow-sm overflow-hidden flex flex-col justify-between group h-full relative card-hover">
          {cardInner}
        </div>
      )}
    </motion.div>
  );
}