import React from 'react';
import ConsultationForm from '../../components/home/ConsultationForm';
import PageShell from '../../components/layout/PageShell';

export default function ContactPage() {
  return (
    <PageShell
      title="Contact Suresh & Get Orthopedic Sleep Advice | RelaxPro"
      description="Request a free diagnostic sleep consultation callback. Suresh will review your orthopedic concerns and customize the perfect mattress configuration."
    >
      <div className="rp-container py-16 md:py-24">
        <div className="mb-12 max-w-2xl text-primary">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            Professional guidance
          </span>
          <h1 className="rp-display mt-5">Submit your sleep concern</h1>
          <p className="rp-body mt-4">
            Share your posture, pain, size, and comfort needs. Suresh will review the details and recommend the right mattress configuration.
          </p>
        </div>
        <ConsultationForm />
      </div>
    </PageShell>
  );
}
