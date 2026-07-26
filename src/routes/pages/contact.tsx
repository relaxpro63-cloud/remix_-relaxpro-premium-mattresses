import React, { useState, useEffect } from 'react';
import { FadeUp } from '../../components/motion/motionPrimitives';
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
      <section className="bg-secondary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <FadeUp>
          <div className="mb-12 max-w-2xl text-ink-900">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
              Professional guidance
            </span>
            <h1 className="rp-display mt-5">{data?.heading || 'Submit your sleep concern'}</h1>
            <p className="rp-body mt-4">
              {data?.description || 'Share your posture, pain, size, and comfort needs. Suresh will review the details and recommend the right mattress configuration.'}
            </p>
          </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-sky-100/20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ConsultationForm />
        </div>
      </section>
    </PageShell>
  );
}
