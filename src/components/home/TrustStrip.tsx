import React from 'react';
import { Truck, Building2, Award, Ruler } from 'lucide-react';
import { FadeUp } from '../motion/motionPrimitives';

const TRUST_ITEMS = [
  { icon: Truck, label: 'Free Shipping' },
  { icon: Award, label: 'Since 2015' },
  { icon: Building2, label: 'Factory Direct' },
  { icon: Ruler, label: 'Custom Sizes' },
];

export default function TrustStrip() {
  return (
    <FadeUp>
      <section className="bg-white border-b border-brand-200/30 py-3 xs:py-3.5 sm:py-4 md:py-5 px-3 xs:px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-4 xs:gap-x-5 sm:gap-x-6 md:gap-x-8 lg:gap-x-12 gap-y-1.5 xs:gap-y-2">
            {TRUST_ITEMS.map((item, i) => {
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
