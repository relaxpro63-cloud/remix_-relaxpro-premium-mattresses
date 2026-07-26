import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Check, X, ChevronLeft, ChevronRight, Ruler, Award, Shield, Leaf, Star } from 'lucide-react';
import PriceText from '../ui/PriceText';
import { imageUrl } from '../../lib/queries';

interface ProductCompareInlineProps {
  currentProduct: any;
  allProducts: any[];
}

const COMFORT_LABELS: Record<string, string> = {
  plush: 'Plush',
  'medium-soft': 'Medium Soft',
  soft: 'Soft',
  'soft-medium': 'Soft-Medium',
  medium: 'Medium',
  'medium-firm': 'Medium Firm',
  firm: 'Firm',
};

export default function ProductCompareInline({ currentProduct, allProducts }: ProductCompareInlineProps) {
  const navigate = useNavigate();
  const [startIdx, setStartIdx] = useState(0);

  // Filter out the current product and get other mattress products (not accessories)
  const otherProducts = allProducts.filter(
    (p: any) => p.slug !== currentProduct?.slug && p.totalThickness
  );

  // Show max 3 other products alongside the current one
  const visibleProducts = [currentProduct, ...otherProducts.slice(startIdx, startIdx + 3)].filter(Boolean);
  const maxStart = Math.max(0, otherProducts.length - 3);

  const getDisplayPrice = (product: any) => {
    if (!product?.pricing) return 0;
    if (product.pricingModel === 'with_without_accessories') {
      return product.pricing.withoutAccessories?.king || product.pricing.withAccessories?.king || 0;
    }
    return product.pricing.fabric300Gsm?.king || product.pricing.fabric450Gsm?.king || 0;
  };

  const hasLatex = (product: any) => {
    if (!product?.layers) return false;
    return product.layers.some((l: any) =>
      l.material === 'latex' || l.material === 'latex_rebonded'
    );
  };

  const getLayerSummary = (product: any) => {
    if (!product?.layers) return '—';
    return product.layers.map((l: any) => `${l.thickness}" ${l.material.replace('_', ' ')}`).join(' + ');
  };

  return (
    <section className="mt-20 lg:mt-28 border-t border-brand-200/40 pt-12 lg:pt-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1 text-[10px] tracking-widest font-accent font-bold text-brand-600 bg-brand-50 border border-brand-200/40 px-3 py-1.5 rounded-full uppercase">
          <Award className="w-3.5 h-3.5" /> Smart Buying Tool
        </span>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink-900 mt-4 mb-3">
          Want to see how <span className="text-brand-600">{currentProduct?.name}</span> stacks up against other models?
        </h2>
        <p className="text-sm text-graphite-500 font-body max-w-lg mx-auto">
          Compare comfort, construction, pricing, and certifications side-by-side.
        </p>
      </div>

      {/* Carousel Navigation */}
      {otherProducts.length > 3 && (
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setStartIdx(Math.max(0, startIdx - 1))}
            disabled={startIdx === 0}
            className="w-9 h-9 rounded-full bg-white border border-brand-200/50 flex items-center justify-center text-graphite-500 hover:text-brand-600 hover:border-brand-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setStartIdx(Math.min(maxStart, startIdx + 1))}
            disabled={startIdx >= maxStart}
            className="w-9 h-9 rounded-full bg-white border border-brand-200/50 flex items-center justify-center text-graphite-500 hover:text-brand-600 hover:border-brand-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            aria-label="Next products"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Comparison Grid */}
      <div className="overflow-x-auto rounded-2xl border border-brand-200/40 bg-white shadow-sm">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-secondary border-b border-brand-200/40">
              <th className="p-4 md:p-5 text-[10px] font-accent font-bold uppercase tracking-widest text-graphite-500 w-[130px] min-w-[110px]">
                Features
              </th>
              {visibleProducts.map((p: any) => (
                <th
                  key={p?.slug}
                  className={`p-4 md:p-5 text-left border-l border-brand-200/40 min-w-[160px] ${
                    p?.slug === currentProduct?.slug ? 'bg-brand-50/60' : ''
                  }`}
                >
                  {p?.badge && (
                    <span className="inline-block text-[9px] font-bold tracking-wider font-accent text-brand-700 bg-brand-100 rounded-full px-2 py-0.5 mb-2">
                      {p.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-sky-100 border border-brand-200/30">
                      <img
                        src={imageUrl(p?.image) || `/images/products/${p?.slug}.webp`}
                        alt={p?.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className={`font-heading font-bold text-sm leading-tight ${p?.slug === currentProduct?.slug ? 'text-brand-700' : 'text-ink-900'}`}>
                        {p?.name}
                        {p?.slug === currentProduct?.slug && (
                          <span className="block text-[9px] font-accent text-brand-500 uppercase tracking-wider">Viewing</span>
                        )}
                      </h3>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-200/30 text-xs md:text-sm">
            {/* Row: Price */}
            <tr>
              <td className="p-4 md:p-5 font-accent font-bold text-graphite-500 bg-secondary/50 text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-brand-500" />
                  Price (King)
                </span>
              </td>
              {visibleProducts.map((p: any) => {
                const price = getDisplayPrice(p);
                return (
                  <td key={p?.slug} className={`p-4 md:p-5 border-l border-brand-200/40 ${p?.slug === currentProduct?.slug ? 'bg-brand-50/30' : ''}`}>
                    <span className="text-base font-bold font-heading text-ink-900">
                      <PriceText>₹{price.toLocaleString('en-IN')}</PriceText>
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Row: Tier */}
            <tr>
              <td className="p-4 md:p-5 font-accent font-bold text-graphite-500 bg-secondary/50 text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-brand-500" />
                  Tier
                </span>
              </td>
              {visibleProducts.map((p: any) => (
                <td key={p?.slug} className={`p-4 md:p-5 border-l border-brand-200/40 capitalize ${p?.slug === currentProduct?.slug ? 'bg-brand-50/30' : ''}`}>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-accent font-bold uppercase tracking-wider ${
                    p?.tier === 'luxury' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    p?.tier === 'premium' ? 'bg-brand-50 text-brand-700 border border-brand-200' :
                    'bg-graphite-100 text-graphite-700 border border-graphite-200'
                  }`}>
                    {p?.tier}
                  </span>
                </td>
              ))}
            </tr>

            {/* Row: Comfort */}
            <tr>
              <td className="p-4 md:p-5 font-accent font-bold text-graphite-500 bg-secondary/50 text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-brand-500" />
                  Comfort
                </span>
              </td>
              {visibleProducts.map((p: any) => (
                <td key={p?.slug} className={`p-4 md:p-5 border-l border-brand-200/40 ${p?.slug === currentProduct?.slug ? 'bg-brand-50/30' : ''}`}>
                  <div className="space-y-1">
                    <span className="font-accent font-bold text-ink-900 text-xs capitalize">
                      {COMFORT_LABELS[p?.comfortLevel] || p?.comfortLevel}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`inline-block w-2 h-2 rounded-full ${
                            idx < (p?.comfortRating || 0) ? 'bg-brand-600' : 'bg-graphite-200'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-graphite-400 ml-1 font-mono">{p?.comfortRating}/5</span>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* Row: Thickness */}
            <tr>
              <td className="p-4 md:p-5 font-accent font-bold text-graphite-500 bg-secondary/50 text-[11px] uppercase tracking-wider">
                Thickness
              </td>
              {visibleProducts.map((p: any) => (
                <td key={p?.slug} className={`p-4 md:p-5 border-l border-brand-200/40 ${p?.slug === currentProduct?.slug ? 'bg-brand-50/30' : ''}`}>
                  <span className="font-heading font-bold text-ink-900">{p?.totalThickness}"</span>
                  <span className="text-graphite-400 text-[11px] ml-1">profile</span>
                </td>
              ))}
            </tr>

            {/* Row: Natural Latex */}
            <tr>
              <td className="p-4 md:p-5 font-accent font-bold text-graphite-500 bg-secondary/50 text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-eco-500" />
                  Natural Latex
                </span>
              </td>
              {visibleProducts.map((p: any) => {
                const latex = hasLatex(p);
                return (
                  <td key={p?.slug} className={`p-4 md:p-5 border-l border-brand-200/40 ${p?.slug === currentProduct?.slug ? 'bg-brand-50/30' : ''}`}>
                    <div className="flex items-center gap-1.5">
                      {latex ? (
                        <>
                          <div className="w-5 h-5 rounded-full bg-eco-50 flex items-center justify-center text-eco-600">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-ink-900 font-accent font-bold text-xs">GOLS Certified</span>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 rounded-full bg-graphite-100 flex items-center justify-center text-graphite-400">
                            <X className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-graphite-500 text-xs">Premium Foam</span>
                        </>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row: Layer Construction */}
            <tr>
              <td className="p-4 md:p-5 font-accent font-bold text-graphite-500 bg-secondary/50 text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-500" />
                  Construction
                </span>
              </td>
              {visibleProducts.map((p: any) => (
                <td key={p?.slug} className={`p-4 md:p-5 border-l border-brand-200/40 text-[11px] leading-relaxed ${p?.slug === currentProduct?.slug ? 'bg-brand-50/30' : ''}`}>
                  <span className="text-graphite-600">{getLayerSummary(p)}</span>
                </td>
              ))}
            </tr>

            {/* Row: Key Benefit */}
            <tr>
              <td className="p-4 md:p-5 font-accent font-bold text-graphite-500 bg-secondary/50 text-[11px] uppercase tracking-wider">
                Key Benefit
              </td>
              {visibleProducts.map((p: any) => (
                <td key={p?.slug} className={`p-4 md:p-5 border-l border-brand-200/40 text-[11px] leading-relaxed ${p?.slug === currentProduct?.slug ? 'bg-brand-50/30' : ''}`}>
                  <span className="text-graphite-600 line-clamp-3">{p?.keyBenefit}</span>
                </td>
              ))}
            </tr>

            {/* Row: Certifications */}
            <tr>
              <td className="p-4 md:p-5 font-accent font-bold text-graphite-500 bg-secondary/50 text-[11px] uppercase tracking-wider">
                Certifications
              </td>
              {visibleProducts.map((p: any) => (
                <td key={p?.slug} className={`p-4 md:p-5 border-l border-brand-200/40 ${p?.slug === currentProduct?.slug ? 'bg-brand-50/30' : ''}`}>
                  <div className="flex flex-wrap gap-1">
                    {p?.certifications?.length > 0 ? p.certifications.map((c: string) => (
                      <span key={c} className="text-[9px] font-accent font-bold px-2 py-0.5 bg-success/10 text-success border border-success/20 rounded-full uppercase tracking-wider">
                        {c}
                      </span>
                    )) : <span className="text-graphite-400 text-[11px]">Standard</span>}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row: Warranty */}
            <tr>
              <td className="p-4 md:p-5 font-accent font-bold text-graphite-500 bg-secondary/50 text-[11px] uppercase tracking-wider">
                Warranty
              </td>
              {visibleProducts.map((p: any) => (
                <td key={p?.slug} className={`p-4 md:p-5 border-l border-brand-200/40 ${p?.slug === currentProduct?.slug ? 'bg-brand-50/30' : ''}`}>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-brand-500" />
                    <span className="font-accent font-bold text-ink-900 text-xs">{p?.warranty} Years</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Row: Actions */}
            <tr className="bg-secondary/30">
              <td className="p-4 md:p-5 font-accent font-bold text-graphite-500 bg-secondary/50 text-[11px] uppercase tracking-wider">
                Explore
              </td>
              {visibleProducts.map((p: any) => (
                <td key={p?.slug} className={`p-4 md:p-5 border-l border-brand-200/40 ${p?.slug === currentProduct?.slug ? 'bg-brand-50/30' : ''}`}>
                  <button
                    onClick={() => navigate(`/mattresses/${p?.slug}`)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-accent font-bold transition-all duration-200 cursor-pointer ${
                      p?.slug === currentProduct?.slug
                        ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
                        : 'bg-white text-ink-900 border border-brand-200/50 hover:border-brand-400 hover:bg-brand-50'
                    }`}
                  >
                    {p?.slug === currentProduct?.slug ? 'You\'re viewing' : 'View Details'}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* View all CTA */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/compare')}
          className="inline-flex items-center gap-2 text-sm font-accent font-bold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer group"
        >
          <span>Compare all mattresses side-by-side</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}
