import React from 'react';
import PageShell from '../../components/layout/PageShell';

export default function AboutPage() {
  return (
    <PageShell
      title="About RelaxPro | Pure Natural Latex Mattress Manufacturer"
      description="Pioneering GOLS chemical-free natural organic latex mattresses in Andhra Pradesh, Telangana and Karnataka. Factory direct with zero markups."
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center space-y-6">
        <span className="text-xs tracking-widest font-mono text-brand-600 uppercase bg-brand-100 px-3 py-1 rounded-full font-bold">ABOUT RELAXPRO</span>
        <h1 className="text-4xl font-display font-medium text-brand-950 mt-4">Telangana and AP 1st Pure Latex Mattress Company</h1>
        <p className="text-zinc-600 max-w-3xl mx-auto font-sans leading-relaxed">With our deep roots in natural rubber harvesting, RelaxPro Mattresses pioneers 100% pure natural latex sleep solutions in South India. Our mission is to handcraft restorative, customized, and orthopedic mattresses free from harmful synthetics—delivering straight from our Kerala factory to your doorstep.</p>
        <div className="pt-8">
          <h3 className="font-display font-bold text-xl text-brand-900 mb-4">Our Presence</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-mono text-zinc-500 font-bold">
            <span className="bg-zinc-100 px-4 py-2 rounded-lg">📍 Hyderabad</span>
            <span className="bg-zinc-100 px-4 py-2 rounded-lg">📍 Rajahmundry</span>
            <span className="bg-zinc-100 px-4 py-2 rounded-lg">📍 Bangalore</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
