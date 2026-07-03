import React from 'react';
import ConsultationForm from '../../components/home/ConsultationForm';
import PageShell from '../../components/layout/PageShell';

export default function ContactPage() {
  return (
    <PageShell
      title="Contact Suresh & Get Orthopedic Sleep Advice | RelaxPro"
      description="Request a free diagnostic sleep consultation callback. Suresh will review your orthopedic concerns and customize the perfect mattress configuration."
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="max-w-2xl mb-12 text-zinc-950">
          <span className="text-xs tracking-widest font-mono text-brand-600 uppercase bg-brand-100 px-3 py-1 rounded-full font-bold">GET PROFESSIONAL RECOMMENDATIONS DIRECTLY</span>
          <h1 className="text-4xl font-display font-medium tracking-tight mt-4">Submit Back Diagnostic Concern</h1>
          <p className="text-gray-500 text-xs mt-2 leading-relaxed">Suresh is a seasoned mattress engineer. He will analyze your vertebrae pain profiles, sizing needs, and formulate options with zero fees recursively.</p>
        </div>
        <ConsultationForm />
      </div>
    </PageShell>
  );
}
