import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, MessageSquare, Check } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';
import { FadeUp, StaggerChildren, staggerItem } from '../../components/motion/motionPrimitives';
import DecorativeBotanicals from '../../components/home/DecorativeBotanicals';
import { MATTRESS_CATEGORIES } from '../../data/mattressCategories';
import { SITE_URL } from '../../lib/site';

export default function MattressTypePage({ slug: propSlug }: { slug?: string }) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = propSlug || paramSlug;
  const path = `/${slug}`;
  const navigate = useNavigate();
  const category = MATTRESS_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return (
      <PageShell title="Mattress Type Not Found | RelaxPro" description="The mattress category you requested could not be found.">
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          <h2 className="text-2xl font-display text-brand-950">Mattress Category Not Found</h2>
          <p className="text-xs text-stone-500">We couldn't find that mattress category.</p>
          <button onClick={() => navigate('/catalog')} className="bg-brand-950 hover:bg-brand-800 text-white rounded-xl py-3 px-6 text-xs uppercase tracking-wider font-semibold font-display cursor-pointer">
            View All Models
          </button>
        </div>
      </PageShell>
    );
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}${path}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Catalog', item: `${SITE_URL}/catalog` },
          { '@type': 'ListItem', position: 3, name: category.h1, item: `${SITE_URL}${path}` },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}${path}#page`,
        name: category.h1,
        url: `${SITE_URL}${path}`,
        description: category.metaDescription,
      },
    ],
  };

  return (
    <PageShell title={category.title} description={category.metaDescription} schema={schema}>
      <div className="relative overflow-hidden">
        <DecorativeBotanicals density="light" />

        {/* Hero */}
        <section className="section-light-lux py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <FadeUp>
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
                  {category.eyebrow}
                </span>
                <h1 className="rp-display mt-5 text-ink-900">{category.h1}</h1>
                <p className="rp-body mt-4">{category.intro}</p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Sections */}
        <section className="bg-sky-100/20 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16">
            {category.sections.map((section, idx) => (
              <FadeUp key={section.heading}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                  <div className="lg:col-span-4">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-ink-900 leading-tight">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="lg:col-span-8 space-y-4">
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="text-sm sm:text-base text-graphite-600 font-body leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="space-y-2 pt-2">
                        {section.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-3 text-sm sm:text-base text-graphite-700 font-body">
                            <span className="w-5 h-5 rounded-full bg-success/10 border border-success/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-success" />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Matching models */}
        {category.products.length > 0 && (
          <section className="section-light-lux py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <FadeUp>
                <div className="max-w-2xl mb-10">
                  <span className="eyebrow">Matching Models</span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-ink-900 mt-3">
                    {category.h1}s in the RelaxPro range
                  </h2>
                </div>
              </FadeUp>
              <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {category.products.map((p) => (
                  <motion.div key={p.slug} variants={staggerItem}>
                    <Link
                      to={`/mattresses/${p.slug}`}
                      className="group block bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-brand-200 shadow-sm hover:border-brand-600/30 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 h-full"
                    >
                      <h3 className="font-heading font-bold text-lg text-ink-900">{p.name}</h3>
                      <p className="text-[12px] sm:text-sm text-graphite-600 font-body leading-relaxed mt-2 mb-6">{p.note}</p>
                      <span className="inline-flex items-center gap-2 text-[10px] font-accent font-bold uppercase tracking-widest text-brand-600">
                        View Model <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </StaggerChildren>
            </div>
          </section>
        )}

        {/* Related categories + CTA */}
        <section className="bg-sky-100/20 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <FadeUp>
              <div className="max-w-2xl mb-10">
                <span className="eyebrow">Keep Exploring</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-ink-900 mt-3">Related mattress categories</h2>
              </div>
            </FadeUp>
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-12">
              {category.related.map((r) => (
                <Link
                  key={r.path}
                  to={r.path}
                  className="inline-flex items-center gap-2 bg-white border border-brand-200 hover:border-brand-600/40 hover:bg-brand-50 text-ink-900 text-xs sm:text-sm font-accent font-bold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                >
                  {r.label} <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
                </Link>
              ))}
            </div>
            <FadeUp>
              <div className="bg-ink-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold">Not sure which mattress suits you?</h2>
                <p className="text-white/70 text-sm sm:text-base font-body mt-4 max-w-2xl mx-auto">
                  Talk to Suresh directly for a free clinical posture audit. He analyzes mattress hardness, sleep posture and medical back history to recommend the right model.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
                  <Link to="/catalog" className="btn btn-primary text-[10px] xs:text-xs font-bold font-accent uppercase tracking-widest py-3.5 px-8 rounded-full text-center cursor-pointer">
                    Browse the Catalog
                  </Link>
                  <a
                    href={`https://wa.me/918686624494?text=${encodeURIComponent(`Hello Suresh, I am considering a ${category.h1.toLowerCase()}. Can you help me pick the right one?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary text-[10px] xs:text-xs font-bold font-accent uppercase tracking-widest py-3.5 px-8 rounded-full text-center cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
