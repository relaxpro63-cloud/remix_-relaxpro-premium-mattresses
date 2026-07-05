import React from 'react';
import PageShell from '../../components/layout/PageShell';

export default function AboutPage() {
  return (
    <PageShell
      title="About RelaxPro | Pure Natural Latex Mattress Manufacturer"
      description="Pioneering GOLS chemical-free natural organic latex mattresses in Andhra Pradesh, Telangana and Karnataka. Factory direct with zero markups."
    >
      <section className="rp-section">
        <div className="rp-container text-center">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            About RelaxPro
          </span>
          <h1 className="rp-display mx-auto mt-5 max-w-4xl text-primary">
            Telangana and AP's first pure latex mattress company
          </h1>
          <p className="rp-body mx-auto mt-5">
            RelaxPro handcrafts natural latex sleep systems for South India, delivered direct from our Kerala factory with transparent pricing and no synthetic fillers.
          </p>
          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-brand-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="font-heading text-2xl font-bold text-primary">Our presence</h2>
            <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-bold text-neutral-dark">
              <span className="rounded-full bg-brand-100 px-4 py-2">Hyderabad</span>
              <span className="rounded-full bg-brand-100 px-4 py-2">Rajahmundry</span>
              <span className="rounded-full bg-brand-100 px-4 py-2">Bangalore</span>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
