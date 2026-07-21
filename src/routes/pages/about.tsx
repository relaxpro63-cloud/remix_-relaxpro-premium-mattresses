import React, { useState, useEffect } from 'react';
import PageShell from '../../components/layout/PageShell';
import { getAboutPage } from '../../lib/queries';

const defaultSections = [
  {
    label: 'Our Story',
    heading: "Telangana and AP's first pure latex mattress company",
    image: '/images/about-story.png',
    imageAlt: 'RelaxPro factory floor in Jeedimetla, Hyderabad',
    paragraphs: [
      'RelaxPro handcrafts natural latex sleep systems for South India, delivered direct from our Kerala factory with transparent pricing and no synthetic fillers. Founded by Suresh, a third-generation rubber goods manufacturer, the brand was built to solve a problem he saw everywhere: families paying luxury prices for mattresses filled with industrial chemicals.',
      'Every RelaxPro mattress starts as tapped latex from smallholder farms in Kerala. The sap is processed through the Dunlop method — a century-old technique that preserves the latex\'s natural cellular structure without synthetic stabilizers. The result is a material that breathes, rebounds, and stays supportive for over a decade.',
    ],
    imageFirst: true,
  },
  {
    label: 'The Kerala Process',
    heading: 'From plantation to bedroom in fourteen days',
    image: '/images/about-process.png',
    imageAlt: 'Latex tapping at a Kerala rubber plantation at dawn',
    paragraphs: [
      'At 4 AM each morning, tappers move through the plantation making clean diagonal cuts in the bark. The raw latex flows into collection cups and is transported to our unit within hours — before polymerization begins.',
      'Back at the factory, the latex is filtered, whipped, and baked in the Dunlop mold. Each core block is then washed, tested for density consistency, and fitted with GOTS-certified organic cotton covers before being compression-rolled and shipped.',
    ],
    imageFirst: false,
  },
  {
    label: 'Our Philosophy',
    heading: 'Restraint over hype',
    image: null,
    paragraphs: [
      'Luxury branding in India typically leans on superlatives: "best," "ultimate," "world-class." RelaxPro does not. We describe what the mattress is made of, how it is made, and what price it is sold for. That restraint is the brand.',
      'Three certifications back every product: GOLS for organic latex integrity, Oeko-Tex for fabric safety, and FSC for sustainable rubber sourcing. These credentials are stated once, not repeated on every product card.',
      'If you walk into our Jeedimetla showroom, Suresh or a trained team member will spend twenty minutes talking through layer density, sleep posture, and medical considerations — not closing a sale. If you prefer WhatsApp, the same detail is there.',
    ],
  },
];

function extractText(blocks: any): string {
  if (!blocks || typeof blocks === 'string') return blocks || '';
  if (!Array.isArray(blocks)) return '';
  return blocks.map((b: any) => b.children?.map((c: any) => c.text).join('') || '').join('\n');
}

export default function AboutPage() {
  const [sections, setSections] = useState(defaultSections);
  const [seo, setSeo] = useState<any>(null);
  const [cities, setCities] = useState(['Hyderabad', 'Rajahmundry', 'Bangalore']);

  useEffect(() => {
    getAboutPage().then(data => {
      if (!data) return;
      setSeo(data.seo);
      const built: any[] = [];
      if (data.ourStory) {
        built.push({
          label: 'Our Story',
          heading: data.ourStory.title || defaultSections[0].heading,
          image: defaultSections[0].image,
          imageAlt: defaultSections[0].imageAlt,
          paragraphs: [extractText(data.ourStory.content) || defaultSections[0].paragraphs[0]],
          imageFirst: true,
        });
      }
      if (data.ourProcess && data.ourProcess.steps?.length > 0) {
        const stepsText = data.ourProcess.steps.map((s: any) => `${s.title}: ${s.description}`).join(' ');
        built.push({
          label: 'The Kerala Process',
          heading: data.ourProcess.title || defaultSections[1].heading,
          image: defaultSections[1].image,
          imageAlt: defaultSections[1].imageAlt,
          paragraphs: [stepsText || defaultSections[1].paragraphs.join(' ')],
          imageFirst: false,
        });
      }
      if (data.values?.valueCards?.length > 0) {
        const valuesText = data.values.valueCards.map((v: any) => v.description || '').filter(Boolean).join(' ');
        built.push({
          label: 'Our Philosophy',
          heading: data.values.missionStatement || defaultSections[2].heading,
          image: null,
          paragraphs: valuesText ? [valuesText] : defaultSections[2].paragraphs,
        });
      }
      if (built.length > 0) setSections(built);
    }).catch(() => {});
  }, []);

  return (
    <PageShell
      title={seo?.metaTitle || 'About RelaxPro | Pure Natural Latex Mattress Manufacturer'}
      description={seo?.metaDescription || 'Pioneering GOLS chemical-free natural organic latex mattresses in Andhra Pradesh, Telangana and Karnataka. Factory direct with zero markups.'}
    >
      <div className="rp-container py-16 md:py-24">
        {sections.map((section, idx) => {
          const hasImage = section.image !== null;
          const isDark = idx === 2;

          return (
            <div
              key={section.label}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${
                isDark 
                  ? 'bg-primary text-white rounded-[2rem] p-6 sm:p-10 md:p-16 shadow-lg shadow-brand-900/10' 
                  : ''
              } ${idx > 0 ? 'mt-20 md:mt-32' : ''}`}
            >
              <div
                className={`space-y-6 ${
                  isDark 
                    ? 'lg:col-span-12 w-full max-w-4xl mx-auto' 
                    : `lg:col-span-7 ${hasImage && !section.imageFirst ? 'lg:order-2' : ''}`
                }`}
              >
                <span className={`text-[10px] font-accent font-bold uppercase tracking-editorial px-4 py-1.5 rounded-full ${
                  isDark ? 'text-accent bg-accent/20' : 'text-accent bg-accent/10'
                }`}>
                  {section.label}
                </span>
                <h2 className={`rp-display ${isDark ? 'text-white' : 'text-primary'}`}>{section.heading}</h2>
                {section.paragraphs.map((p: string, pIdx: number) => (
                  <p
                    key={pIdx}
                    className={`rp-body leading-loose ${pIdx === 0 ? 'drop-cap' : ''} ${isDark ? 'text-zinc-100/90' : 'text-neutral-dark/70'}`}
                  >
                    {p}
                  </p>
                ))}
                {idx === sections.length - 1 && (
                  <div className={`pt-6 flex flex-wrap gap-3 text-sm font-bold ${isDark ? 'text-white/90' : 'text-neutral-dark'}`}>
                    {cities.map(c => (
                      <span key={c} className={`rounded-full px-4 py-2 ${isDark ? 'border border-white/20' : 'bg-brand-100'}`}>{c}</span>
                    ))}
                  </div>
                )}
              </div>

              {hasImage && (
                <div className={`lg:col-span-5 ${section.imageFirst ? '' : 'lg:order-1'}`}>
                  <div className="sticky top-32">
                    <img
                      src={section.image!}
                      alt={section.imageAlt}
                      className="w-full aspect-[4/5] object-cover rounded-[1.5rem] shadow-sm"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
