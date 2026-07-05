import React from 'react';

const ITEMS = [
  'GOLS Certified',
  'Oeko-Tex Standard 100',
  'FSC Certified',
  'Zero VOC Emissions',
];

export default function CertificationMarquee() {
  return (
    <section className="bg-secondary border-y border-brand-200/30">
      <div className="rp-container">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-5 md:py-6">
          {ITEMS.map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && (
                <span className="hidden md:inline-block w-px h-3 bg-brand-200/60" aria-hidden="true" />
              )}
              <span className="text-[9px] md:text-[10px] font-accent font-semibold uppercase tracking-editorial text-neutral-dark/60 select-none">
                {item}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
