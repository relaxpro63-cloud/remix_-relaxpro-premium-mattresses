import React, { useState, useEffect, useRef } from 'react';
import {
  Truck, Building2, Award, Ruler, Shield, ShieldCheck, Leaf,
  RefreshCcw, CheckCircle, Heart, BadgeCheck, Sparkles,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FadeUp } from '../motion/motionPrimitives';
import { getSiteSettings } from '../../lib/queries';
import { prefersReducedMotion } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_TRUST_ITEMS = [
  { icon: Truck, label: 'Free Shipping' },
  { icon: Award, label: 'Since 2015' },
  { icon: Building2, label: 'Factory Direct' },
  { icon: Ruler, label: 'Custom Sizes' },
];

// Sanity stores badge icons as lucide name strings — map them to components.
const iconMap: Record<string, any> = {
  Truck, Building2, Award, Ruler, Shield, ShieldCheck, Leaf, RefreshCcw,
  CheckCircle, Heart, BadgeCheck, Sparkles,
};

// Trial/warranty/refund promises are no longer offered — drop such badges.
const REMOVED_BADGE_TERMS = ['warranty', 'guarantee', 'trial', 'refund', 'return policy', '100-night', '10-year'];

export default function TrustStrip() {
  const [trustItems, setTrustItems] = useState(FALLBACK_TRUST_ITEMS);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;

    // Bleeds the hero's dark navy into this section's white as the seam
    // scrolls through view, instead of a hard color cut.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { backgroundColor: '#0A1120' },
        {
          backgroundColor: '#FFFFFF',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top center', scrub: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    getSiteSettings().then(s => {
      const badges = s?.footer?.trustBadges;
      if (badges?.length > 0) {
        const cleaned = badges
          .filter((b: any) => b?.text && !REMOVED_BADGE_TERMS.some(term => b.text.toLowerCase().includes(term)))
          .map((b: any) => ({ icon: iconMap[b.icon] || Shield, label: b.text }));
        if (cleaned.length) setTrustItems(cleaned);
      }
    }).catch(() => {});
  }, []);

  return (
    <FadeUp>
      <section ref={sectionRef} className="bg-white border-b border-brand-200/30 py-3 xs:py-3.5 sm:py-4 md:py-5 px-3 xs:px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-4 xs:gap-x-5 sm:gap-x-6 md:gap-x-8 lg:gap-x-12 gap-y-1.5 xs:gap-y-2">
            {trustItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5 xs:gap-2 text-[11px] xs:text-xs sm:text-xs md:text-sm font-accent font-semibold text-graphite-600"
                >
                  <Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-brand-500 shrink-0" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
