import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Layers, BoxSelect, Expand, BedDouble, ShieldCheck, Truck, ArrowRight, ArrowRightCircle } from 'lucide-react';
import BlurFade from '../ui/BlurFade';
import { getHomePage, imageUrl } from '../../lib/queries';

interface TwoWaysToOwnProps {
  onStartBuilding: () => void;
  onSeeAllModels: () => void;
}

export default function TwoWaysToOwn({ onStartBuilding, onSeeAllModels }: TwoWaysToOwnProps) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getHomePage().then(p => setData(p?.ownershipWays)).catch(() => {});
  }, []);

  // Helper to resolve icon from string if CMS provides it, or use fallback
  const getIconForFeature = (index: number, type: 'custom' | 'shop') => {
    if (type === 'custom') {
      const icons = [Layers, BoxSelect, Expand, BedDouble];
      const Icon = icons[index % icons.length];
      return <Icon className="w-4 h-4 text-brand-500" strokeWidth={1.5} />;
    } else {
      const icons = [BedDouble, Sparkles, BoxSelect, Truck, ShieldCheck];
      const Icon = icons[index % icons.length];
      return <Icon className="w-4 h-4 text-brand-500" strokeWidth={1.5} />;
    }
  };

  return (
    <section id="two-ways-section" className="py-20 md:py-32 relative overflow-hidden bg-[#F3F9FD]">
      {/* Full-section background image (subtle texture) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/images/section-bg.png"
          alt="Natural organic latex texture with botanical accents"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          loading="lazy"
        />
        {/* Light wash so content stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F3F9FD] via-[#F3F9FD]/90 to-[#F3F9FD]" />
        {/* Soft luxury orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFFFFF] blur-[120px] opacity-80" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#EEF7FC] blur-[150px] opacity-90" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-brand-100/40 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Centered Heading */}
        <BlurFade delay={0.05}>
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <span className="text-xs tracking-[0.15em] font-sans font-semibold text-brand-600 uppercase mb-4 inline-block">
              {data?.sectionSubtitle || 'Bespoke Comfort'}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium text-ink-900 leading-tight tracking-tight">
              {data?.sectionTitle || 'Best Selling Models'}
            </h2>
            <p className="text-graphite-600 text-base md:text-lg mt-6 leading-relaxed font-body max-w-2xl mx-auto font-light">
              Whether you want to orchestrate your custom orthopedic configuration layer by layer or choose from our plantation-tested pre-built formulations.
            </p>
          </div>
        </BlurFade>

        {/* 2-Column Luxury Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Card 1: Customize Your Comfort */}
          <BlurFade delay={0.1}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative h-full flex flex-col justify-between bg-white/60 backdrop-blur-md rounded-[32px] p-8 md:p-12 border border-white/80 shadow-[0_4px_24px_-8px_rgba(11,18,32,0.05)] hover:shadow-[0_20px_48px_-12px_rgba(11,18,32,0.1)] transition-all duration-500 overflow-hidden"
            >
              {/* Subtle Glowing Border on Hover */}
              <div className="absolute inset-0 rounded-[32px] border-2 border-transparent group-hover:border-brand-200/50 transition-colors duration-700 pointer-events-none" />
              
              {/* Full-bleed card image header — breaks out of card padding */}
              <div className="-mx-8 md:-mx-12 -mt-8 md:-mt-12 mb-6 rounded-t-[32px] overflow-hidden">
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src={imageUrl(data?.customBuilder?.image) || '/images/box-customize.png'}
                    alt="Artisan hand-layering natural latex and organic wool comfort layers"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="font-heading text-3xl md:text-4xl text-ink-900 tracking-tight leading-tight mb-8">
                  {data?.customBuilder?.title || 'Customize Your Comfort'}
                </h3>

                <ul className="space-y-4 md:space-y-6">
                  {(data?.customBuilder?.features || [
                    'Pick Cover Fabric: Select casing textile',
                    'Comfort Layers: Configure latex zones',
                    'Dial in Thickness: 4″ to 10″ profiles',
                    'Custom Built: Delivered in 10–14 days',
                  ]).map((feature: any, i: number) => {
                    // Handle both new Sanity object format and old string format
                    const text = typeof feature === 'string' ? feature : `${feature.title}${feature.description ? `: ${feature.description}` : ''}`;
                    const hasColon = text.includes(':');
                    const prefix = hasColon ? text.split(':')[0] + ':' : text;
                    const suffix = hasColon ? text.split(':')[1] : '';

                    return (
                      <li key={i} className="flex items-start gap-4 group/item">
                        <div className="mt-1 w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100/50 group-hover/item:bg-brand-100 transition-colors duration-300">
                           {getIconForFeature(i, 'custom')}
                        </div>
                        <p className="text-graphite-700 font-body text-[15px] leading-relaxed font-light mt-0.5">
                          {hasColon ? (
                            <>
                              <strong className="font-medium text-ink-900">{prefix}</strong>
                              <span className="opacity-90">{suffix}</span>
                            </>
                          ) : (
                            <span className="opacity-90">{text}</span>
                          )}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="relative z-10 mt-12 pt-8 border-t border-brand-100/60">
                <button
                  onClick={onStartBuilding}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-sans font-medium text-sm md:text-base py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(21,104,163,0.4)] group-hover:shadow-[0_12px_28px_-6px_rgba(21,104,163,0.5)] cursor-pointer"
                >
                  <span className="tracking-wide">{data?.customBuilder?.cta?.label || 'Build Your Dream Mattress'}</span>
                  <ArrowRightCircle className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          </BlurFade>

          {/* Card 2: Our Models */}
          <BlurFade delay={0.2}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative h-full flex flex-col justify-between bg-white/60 backdrop-blur-md rounded-[32px] p-8 md:p-12 border border-white/80 shadow-[0_4px_24px_-8px_rgba(11,18,32,0.05)] hover:shadow-[0_20px_48px_-12px_rgba(11,18,32,0.1)] transition-all duration-500 overflow-hidden"
            >
              {/* Subtle Glowing Border on Hover */}
              <div className="absolute inset-0 rounded-[32px] border-2 border-transparent group-hover:border-brand-200/50 transition-colors duration-700 pointer-events-none" />
              
              {/* Full-bleed card image header — breaks out of card padding */}
              <div className="-mx-8 md:-mx-12 -mt-8 md:-mt-12 mb-6 rounded-t-[32px] overflow-hidden">
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src={imageUrl(data?.shopPrebuilt?.image) || '/images/box-models.png'}
                    alt="Luxury bedroom with a premium organic latex mattress in warm morning light"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="font-heading text-3xl md:text-4xl text-ink-900 tracking-tight leading-tight mb-8">
                  {data?.shopPrebuilt?.title || 'Our Models'}
                </h3>

                <ul className="space-y-4 md:space-y-6">
                  {(data?.shopPrebuilt?.features || [
                    '13 Organic Models: Orthopedic alignment',
                    '3 Curated Tiers: Luxury, Premium & Comfort',
                    'Pick Your Size: Standard or Custom',
                    'Express Shipping: Delivered in 10–14 Days',
                  ]).map((feature: any, i: number) => {
                    const text = typeof feature === 'string' ? feature : `${feature.title}${feature.description ? `: ${feature.description}` : ''}`;
                    const hasColon = text.includes(':');
                    const prefix = hasColon ? text.split(':')[0] + ':' : text;
                    const suffix = hasColon ? text.split(':')[1] : '';

                    return (
                      <li key={i} className="flex items-start gap-4 group/item">
                        <div className="mt-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-brand-100/80 shadow-sm group-hover/item:border-brand-300 transition-colors duration-300">
                          {getIconForFeature(i, 'shop')}
                        </div>
                        <p className="text-graphite-700 font-body text-[15px] leading-relaxed font-light mt-0.5">
                          {hasColon ? (
                            <>
                              <strong className="font-medium text-ink-900">{prefix}</strong>
                              <span className="opacity-90">{suffix}</span>
                            </>
                          ) : (
                            <span className="opacity-90">{text}</span>
                          )}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="relative z-10 mt-12 pt-8 border-t border-brand-100/60">
                <button
                  onClick={onSeeAllModels}
                  className="w-full flex items-center justify-between bg-white hover:bg-brand-50 border border-brand-200/60 text-ink-900 font-sans font-medium text-sm md:text-base py-4 px-6 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group/btn"
                >
                  <span className="tracking-wide">{data?.shopPrebuilt?.cta?.label || 'Explore Our Collection'}</span>
                  <ArrowRight className="w-5 h-5 text-brand-600 group-hover/btn:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
