import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
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

      {/* Shuddha Banner CTA */}
      <FadeUp>
        <section className="bg-secondary py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.button
              onClick={() => window.location.href = '/catalog'}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg shadow-brand-500/5 border border-brand-200/30 cursor-pointer group text-left"
            >
              <img
                src="/images/shuddha-banner.png"
                alt="Shuddha Premium Collection — Click to explore"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-ink-900 font-bold text-xs md:text-sm px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-400">
                <ShoppingBag className="w-4 h-4" />
                Explore Collection
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        </section>
      </FadeUp>
    </PageShell>
  );
}
