import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BadgePercent, Ticket } from 'lucide-react';
import { FadeUp, RevealText, StaggerChildren, staggerItem, EASE_LUXURY } from '../motion/motionPrimitives';
import { getActiveOffers, getHomePage, imageUrl } from '../../lib/queries';
import CountdownTimer from '../ui/CountdownTimer';

interface OffersSectionProps {
  onNavigate?: (page: string) => void;
}

const sectionDefaults = {
  sectionBadge: 'Limited Time',
  title: 'Offers & Promotions',
  subtitle: 'Factory-direct pricing on India\u2019s finest natural latex sleep systems.',
};

// bannerColor -> tailwind gradient + glow classes (design-system sapphire family)
const colorThemes: Record<string, { bg: string; glow: string; chip: string }> = {
  brand: {
    bg: 'from-brand-600 via-brand-700 to-ink-900',
    glow: 'group-hover:shadow-brand-500/30',
    chip: 'border-brand-300/50 text-brand-700 bg-brand-50',
  },
  amber: {
    bg: 'from-sand-400 via-sand-500 to-sand-600',
    glow: 'group-hover:shadow-sand-500/30',
    chip: 'border-sand-400/50 text-sand-600 bg-sand-300/20',
  },
  green: {
    bg: 'from-eco-500 via-eco-600 to-ink-900',
    glow: 'group-hover:shadow-eco-500/30',
    chip: 'border-eco-500/50 text-eco-600 bg-eco-50',
  },
  blue: {
    bg: 'from-brand-500 via-brand-600 to-brand-800',
    glow: 'group-hover:shadow-brand-500/30',
    chip: 'border-brand-300/50 text-brand-700 bg-brand-50',
  },
  red: {
    bg: 'from-rose-500 via-rose-600 to-rose-800',
    glow: 'group-hover:shadow-rose-500/30',
    chip: 'border-rose-400/50 text-rose-600 bg-rose-50',
  },
};

export default function OffersSection({ onNavigate }: OffersSectionProps) {
  // Initialize header with fallbacks to avoid a flash of default copy before Sanity responds.
  const [offers, setOffers] = useState<any[] | null>(null);
  const [header, setHeader] = useState<any>(sectionDefaults);

  useEffect(() => {
    getActiveOffers()
      .then((list: any[]) => setOffers(Array.isArray(list) ? list : []))
      .catch(() => setOffers([]));
    // Section header (badge/title/subtitle) is CMS-editable via home.offersSection
    getHomePage()
      .then((home: any) => {
        if (home?.offersSection) setHeader(home.offersSection);
      })
      .catch(() => {});
  }, []);

  // Hide the section entirely until we know there are offers (no fake promos).
  if (!offers || offers.length === 0) return null;

  const handleCta = (link?: string, openInNewTab?: boolean) => {
    if (!link) return;
    const internal = link.startsWith('/');
    if (internal && onNavigate && !openInNewTab) {
      const page = link.replace(/^\//, '') || 'home';
      onNavigate(page);
      return;
    }
    window.open(link, openInNewTab || !internal ? '_blank' : '_self');
  };

  return (
    <section className="relative overflow-hidden bg-ink-900 py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(80% 60% at 20% 0%, rgba(21,104,163,0.22) 0%, transparent 60%), radial-gradient(70% 50% at 90% 100%, rgba(180,154,115,0.12) 0%, transparent 55%)' }} />
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" viewBox="0 0 1200 500" preserveAspectRatio="none">
          <path d="M0,300 C200,200 400,380 600,300 S900,180 1200,260 L1200,0 L0,0 Z" fill="#6FAEE0" />
          <path d="M0,400 C250,300 450,480 700,380 S1000,280 1200,360 L1200,500 L0,500 Z" fill="#3A8FD2" opacity="0.6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <FadeUp className="text-center max-w-2xl mx-auto mb-10 xs:mb-12 sm:mb-14 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-300/30 text-brand-300 text-[10px] xs:text-[11px] font-accent font-bold uppercase tracking-[0.18em]">
            <BadgePercent className="w-3.5 h-3.5" />
            {header?.sectionBadge || sectionDefaults.sectionBadge}
          </span>
          <RevealText as="h2" className="text-2xl xs:text-3xl sm:text-[2rem] md:text-4xl lg:text-5xl font-heading font-medium text-white leading-tight mt-4">
            {header?.sectionTitle || sectionDefaults.title}
          </RevealText>
          <p className="text-sky-200/60 text-xs xs:text-sm md:text-base mt-3 font-body font-light leading-relaxed">
            {header?.sectionSubtitle || sectionDefaults.subtitle}
          </p>
        </FadeUp>

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8" stagger={0.15}>
          {offers.map((offer: any, idx: number) => {
            const theme = colorThemes[offer.bannerColor] || colorThemes.brand;
            const img = imageUrl(offer.bannerImage);
            const cta = offer.cta;
            const ctaLabel = cta?.label || 'Explore Offer';
            const coupon = offer.couponCode;

            return (
              <motion.div
                key={offer._id || idx}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.4, ease: EASE_LUXURY }}
                className={`group relative rounded-2xl xs:rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br ${theme.bg} shadow-xl transition-shadow duration-500 ${theme.glow} flex flex-col`}
              >
                {/* Banner image or gradient fill */}
                {img ? (
                  <div className="relative h-44 xs:h-48 sm:h-52 overflow-hidden">
                    <img
                      src={img}
                      alt={offer.bannerImage?.alt || offer.title || 'RelaxPro offer'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="h-32 xs:h-36 sm:h-40 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                        <path d="M0,140 C150,80 300,180 450,110 S550,60 600,100 L600,0 L0,0 Z" fill="#FFFFFF" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="relative flex flex-col flex-1 p-4 xs:p-5 sm:p-6 md:p-7">
                  {/* Badge + discount */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {offer.badge ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm text-white text-[9px] xs:text-[10px] font-accent font-bold uppercase tracking-[0.14em]">
                        {offer.badge}
                      </span>
                    ) : <span />}
                    {offer.discountText && (
                      <span className="font-heading font-bold text-2xl xs:text-3xl md:text-4xl text-white drop-shadow-sm">
                        {offer.discountText}
                      </span>
                    )}
                  </div>

                  {/* Title + description */}
                  <h3 className="font-heading font-bold text-lg xs:text-xl md:text-2xl text-white leading-snug">
                    {offer.title}
                  </h3>
                  {offer.subtitle && (
                    <p className="text-white/80 text-xs xs:text-sm font-body mt-1.5 font-light leading-relaxed">
                      {offer.subtitle}
                    </p>
                  )}
                  {offer.description && (
                    <p className="text-white/60 text-[11px] xs:text-xs font-body mt-2 leading-relaxed line-clamp-2">
                      {offer.description}
                    </p>
                  )}

                  {/* Live countdown — only when the offer has an end date */}
                  {offer.endDate && (
                    <div className="mt-4 border-t border-white/10 pt-3.5">
                      <CountdownTimer endDate={offer.endDate} />
                    </div>
                  )}

                  {/* Coupon code */}
                  {coupon && (
                    <div className={`inline-flex items-center gap-1.5 mt-4 self-start px-2.5 py-1.5 rounded-lg border border-dashed ${theme.chip} text-[10px] xs:text-[11px] font-mono font-bold tracking-wide`}>
                      <Ticket className="w-3.5 h-3.5" />
                      {coupon}
                    </div>
                  )}

                  {/* CTA */}
                  {cta && (
                    <button
                      type="button"
                      onClick={() => handleCta(cta.link, cta.openInNewTab)}
                      className="mt-5 inline-flex items-center gap-2 self-start bg-white text-ink-900 hover:bg-sky-50 text-[11px] xs:text-xs font-accent font-bold uppercase tracking-[0.14em] px-5 py-2.5 rounded-full shadow-lg transition-all duration-300 hover:gap-3 cursor-pointer"
                    >
                      {ctaLabel}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
