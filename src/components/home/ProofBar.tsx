import React from 'react';
import { Truck, Leaf } from '@phosphor-icons/react';

const proofItems = [
  { icon: Truck, text: 'Free delivery' },
  { icon: Leaf, text: 'GOLS certified latex' },
];

export default function ProofBar() {
  return (
    <section className="bg-surface border-b border-border py-3.5 md:py-4">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        {/* Desktop: centered row with hairline dividers */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
          {proofItems.map((item, i) => (
            <React.Fragment key={item.text}>
              {i > 0 && <div className="w-px h-3 bg-border" />}
              <div className="flex items-center gap-2 text-[11px] font-accent font-semibold tracking-[0.12em] text-muted uppercase">
                <item.icon className="w-3.5 h-3.5 text-muted/60 shrink-0" strokeWidth={1.5} />
                {item.text}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Mobile: horizontal snap chips */}
        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none gap-2">
          {proofItems.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-1.5 shrink-0 snap-start px-3 py-1.5 rounded-full border border-border bg-white"
            >
              <item.icon className="w-3 h-3 text-muted/60 shrink-0" strokeWidth={1.5} />
              <span className="text-[10px] font-accent font-semibold tracking-[0.1em] text-muted uppercase">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
