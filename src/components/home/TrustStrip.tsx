import React from 'react';
import { Truck, Shield, Building2, Award, Ruler } from 'lucide-react';
import { FadeUp } from '../motion/motionPrimitives';

const TRUST_ITEMS = [
  { icon: Truck, label: 'Free Shipping' },
  { icon: Award, label: 'Since 2015' },
  { icon: Building2, label: 'Factory Direct' },
  { icon: Shield, label: '10-Yr Warranty' },
  { icon: Ruler, label: 'Custom Sizes' },
];

export default function TrustStrip() {
  return (
    <FadeUp>
      <section className="bg-white border-b border-brand-200/30 py-4 md:py-5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 md:gap-x-12">
            {TRUST_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs md:text-sm font-accent font-semibold text-graphite-600"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-brand-500 shrink-0" />
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
