import React from 'react';
import { Truck, Shield, Award, Leaf } from 'lucide-react';

const proofItems = [
  { icon: Truck, text: 'Free Delivery' },
  { icon: Shield, text: '100-Night Trial' },
  { icon: Award, text: '10-Year Warranty' },
  { icon: Leaf, text: 'GOLS Certified Latex' },
];

export default function ProofBar() {
  return (
    <section className="bg-surface border-b border-border py-4 md:py-5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="hidden md:flex items-center justify-center gap-8 lg:gap-12">
          {proofItems.map((item, i) => (
            <React.Fragment key={item.text}>
              {i > 0 && <div className="w-px h-4 bg-border" />}
              <div className="flex items-center gap-2.5 text-xs font-accent font-semibold tracking-wider text-muted uppercase">
                <item.icon className="w-4 h-4 text-accent shrink-0" />
                {item.text}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3">
          {proofItems.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 shrink-0 snap-start min-w-[70%] justify-center py-1"
            >
              <item.icon className="w-4 h-4 text-accent shrink-0" />
              <span className="text-xs font-accent font-semibold tracking-wider text-muted uppercase">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
