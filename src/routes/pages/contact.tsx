import React, { useState, useEffect } from 'react';
import ConsultationForm from '../../components/home/ConsultationForm';
import PageShell from '../../components/layout/PageShell';
import { getContactPage } from '../../lib/queries';

export default function ContactPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getContactPage().then(d => setData(d)).catch(() => {});
  }, []);

  return (
    <PageShell
      title={data?.seo?.metaTitle || 'Contact Suresh & Get Orthopedic Sleep Advice | RelaxPro'}
      description={data?.seo?.metaDescription || 'Request a free diagnostic sleep consultation callback. Suresh will review your orthopedic concerns and customize the perfect mattress configuration.'}
    >
      <div className="rp-container py-16 md:py-24">
        <div className="mb-12 max-w-2xl text-primary">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            Professional guidance
          </span>
          <h1 className="rp-display mt-5">{data?.heading || 'Submit your sleep concern'}</h1>
          <p className="rp-body mt-4">
            {data?.description || 'Share your posture, pain, size, and comfort needs. Suresh will review the details and recommend the right mattress configuration.'}
          </p>
        </div>
        <ConsultationForm />
      </div>
    </PageShell>
  );
}
