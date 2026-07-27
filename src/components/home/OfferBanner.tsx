import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Gift, Sparkles, X, ChevronRight, Clock } from 'lucide-react';
import { getActiveOffers, imageUrl } from '../../lib/queries';

export default function OfferBanner() {
  const [offer, setOffer] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getActiveOffers().then(offers => {
      if (offers?.length > 0) {
        // Find the first active offer that has showBanner enabled
        const bannerOffer = offers.find((o: any) => o.showBanner) || offers[0];
        setOffer(bannerOffer);
      }
    }).catch(() => {});
  }, []);

  if (!offer || dismissed) return null;

  const bgColorMap: Record<string, string> = {
    brand: 'from-brand-600 to-brand-700',
    amber: 'from-amber-500 to-amber-600',
    green: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="relative overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${bgColorMap[offer.bannerColor] || 'from-brand-600 to-brand-700'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {offer.badge && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap">
                <Sparkles className="w-3 h-3" />
                {offer.badge}
              </span>
            )}
            <div className="flex items-center gap-2 min-w-0">
              {offer.discountText && (
                <span className="font-heading font-bold text-sm md:text-base whitespace-nowrap">{offer.discountText}</span>
              )}
              <span className="text-white/90 text-xs md:text-sm truncate">{offer.subtitle || offer.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {offer.couponCode && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-white/15 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md tracking-wider">
                <Gift className="w-3 h-3" />
                {offer.couponCode}
              </span>
            )}
            {offer.cta?.link && (
              <Link
                to={offer.cta.link}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-accent font-bold uppercase tracking-wider bg-white text-ink-900 hover:bg-white/90 px-4 py-1.5 rounded-lg transition-all hover:shadow-lg cursor-pointer"
              >
                {offer.cta.label || 'Shop Now'}
                <ChevronRight className="w-3 h-3" />
              </Link>
            )}
            {offer.endDate && (
              <span className="hidden md:flex items-center gap-1 text-white/70 text-[10px]">
                <Clock className="w-3 h-3" />
                {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="text-white/60 hover:text-white p-1 cursor-pointer transition-colors"
              aria-label="Dismiss offer banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
