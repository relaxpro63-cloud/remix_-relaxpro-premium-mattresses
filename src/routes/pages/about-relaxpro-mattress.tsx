import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Leaf,
  Shield,
  Ruler,
  Truck,
  Check,
} from 'lucide-react';
import PageShell from '../../components/layout/PageShell';
import { FadeUp, StaggerChildren, staggerItem } from '../../components/motion/motionPrimitives';
import DecorativeBotanicals from '../../components/home/DecorativeBotanicals';
import { SITE_URL, toAbsoluteUrl, BUSINESS_NAME, SAME_AS, CONTACT_PHONE } from '../../lib/site';

const aboutSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/about-relaxpro-mattress#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'About RelaxPro Mattress', item: `${SITE_URL}/about-relaxpro-mattress` },
      ],
    },
    {
      '@type': 'AboutPage',
      '@id': `${SITE_URL}/about-relaxpro-mattress#about`,
      name: 'About RelaxPro Mattress',
      url: `${SITE_URL}/about-relaxpro-mattress`,
      description:
        'RelaxPro Mattress is a Hyderabad-based mattress manufacturer founded in 2015, producing premium natural latex, HR foam, rebonded and custom-size mattresses in India.',
      mainEntity: {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: BUSINESS_NAME,
        url: SITE_URL,
        foundingDate: '2015',
        logo: toAbsoluteUrl('/images/relaxpro-logo.png'),
        email: 'relaxpro2022@gmail.com',
        telephone: '+919281424494',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Jeedimetla Industrial Area, Phase 3, Near Prasad Labs',
          addressLocality: 'Hyderabad',
          addressRegion: 'Telangana',
          postalCode: '500055',
          addressCountry: 'IN',
        },
        sameAs: SAME_AS,
      },
    },
  ],
};

const productTypes = [
  { label: 'Natural Latex Mattress', path: '/natural-latex-mattress' },
  { label: 'Latex Mattress', path: '/latex-mattress' },
  { label: 'HR Foam Mattress', path: '/hr-foam-mattress' },
  { label: 'Rebonded Mattress', path: '/rebonded-mattress' },
  { label: 'Orthopedic Mattress', path: '/orthopedic-mattress' },
  { label: 'Custom Size Mattress', path: '/custom-size-mattress' },
];

const facts = [
  { icon: MapPin, title: 'Manufacturing', text: 'Handcrafted at our factory in Jeedimetla Industrial Area, Phase 3, Hyderabad, with natural latex sourced from our unit in Kerala.' },
  { icon: Ruler, title: 'Custom Sizes', text: 'Made-to-measure mattresses from 48" to 96" long and 24" to 84" wide, plus custom thickness.' },
  { icon: Shield, title: 'Certified', text: 'GOLS-certified organic latex and OEKO-TEX certified fabrics.' },
  { icon: Truck, title: 'Factory-Direct Delivery', text: 'Shipped directly to your doorstep across India — free shipping, tax included.' },
];

export default function AboutRelaxProMattressPage() {
  return (
    <PageShell
      title="About RelaxPro Mattress | Premium Latex Mattress Manufacturer in Hyderabad"
      description="RelaxPro Mattress is a Hyderabad-based mattress manufacturer founded in 2015. We make premium natural latex, HR foam, rebonded and custom-size mattresses — GOLS certified and factory-direct."
      schema={aboutSchema}
    >
      <div className="relative overflow-hidden">
        <DecorativeBotanicals density="light" />
        {/* Hero */}
        <section className="section-light-lux py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <FadeUp>
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
                  The Brand Behind the Sleep
                </span>
                <h1 className="rp-display mt-5 text-ink-900">About RelaxPro Mattress</h1>
                <p className="rp-body mt-4">
                  RelaxPro Mattress is a mattress manufacturer and sleep-products brand based in Hyderabad, Telangana. Since 2015 we have handcrafted premium latex, natural latex, HR foam, rebonded and customized mattresses — built on the principle that a mattress should be described by what it is made of, how it is made, and what it costs. No synthetic fillers, no inflated middlemen margins.
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Who we are / founder */}
        <section className="bg-sky-100/20 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <FadeUp>
              <div className="max-w-3xl">
                <span className="eyebrow">Who We Are</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-ink-900 mt-3">A third-generation rubber manufacturer's answer to chemical-filled mattresses</h2>
                <div className="mt-6 space-y-4 text-graphite-600 text-sm sm:text-base font-body leading-relaxed">
                  <p>
                    RelaxPro Mattress was founded in 2015 by Suresh, a third-generation rubber goods manufacturer. The brand was built to solve a problem he saw everywhere: families paying luxury prices for mattresses filled with industrial chemicals.
                  </p>
                  <p>
                    Every RelaxPro mattress starts as tapped latex from smallholder farms in Kerala. The sap is processed through the Dunlop method — a century-old technique that preserves the latex's natural cellular structure without synthetic stabilizers. The result is a material that breathes, rebounds, and stays supportive for over a decade.
                  </p>
                  <p>
                    From our factory in Jeedimetla, Hyderabad, we manufacture and ship directly to customers across India. We operate experience showrooms in Hyderabad, Rajahmundry and Bangalore where you can test firmness profiles and speak directly with our trained team.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Facts grid */}
        <section className="section-light-lux py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {facts.map((f) => (
                <motion.div
                  key={f.title}
                  variants={staggerItem}
                  className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-brand-200 shadow-sm"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-600/20 mb-4">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-accent font-bold text-xs sm:text-sm text-ink-900 uppercase tracking-wider mb-2">{f.title}</h3>
                  <p className="text-[12px] sm:text-sm text-graphite-600 font-body leading-relaxed">{f.text}</p>
                </motion.div>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* What we manufacture */}
        <section className="bg-sky-100/20 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <FadeUp>
              <div className="max-w-2xl mb-10">
                <span className="eyebrow">What We Manufacture</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-ink-900 mt-3">Mattresses for every sleep profile</h2>
                <p className="text-graphite-600 text-sm sm:text-base font-body leading-relaxed mt-4">
                  Our range spans pure natural latex sleep systems, latex–foam hybrids, firm orthopedic builds and fully custom sizes. Explore each category to understand how it is made.
                </p>
              </div>
            </FadeUp>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {productTypes.map((p) => (
                <Link
                  key={p.path}
                  to={p.path}
                  className="inline-flex items-center gap-2 bg-white border border-brand-200 hover:border-brand-600/40 hover:bg-brand-50 text-ink-900 text-xs sm:text-sm font-accent font-bold px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                >
                  <Leaf className="w-3.5 h-3.5 text-brand-600" />
                  {p.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications + contact */}
        <section className="section-light-lux py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <FadeUp>
              <div>
                <span className="eyebrow">Quality &amp; Certifications</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-ink-900 mt-3">Stated once, not repeated</h2>
                <ul className="mt-6 space-y-3 text-sm text-graphite-600 font-body">
                  {[
                    'GOLS — certified organic latex integrity',
                    'OEKO-TEX Standard 100 — certified fabric safety',
                    'Manufacturer warranty on every mattress — confirm current terms with our team',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
            <FadeUp>
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-brand-200 shadow-sm">
                <span className="eyebrow">Contact RelaxPro Mattress</span>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink-900 mt-3">Talk to the manufacturer directly</h2>
                <div className="mt-6 space-y-4 text-sm text-graphite-700 font-body">
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    <a href="tel:+919281424494" className="hover:text-brand-600 transition-colors">+91 92814 24494</a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    <a href="mailto:relaxpro2022@gmail.com" className="hover:text-brand-600 transition-colors">relaxpro2022@gmail.com</a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    <span>Factory showroom: Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad, Telangana 500055</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    <span>Showrooms in Hyderabad, Rajahmundry and Bangalore. Factory-direct delivery across India.</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Link to="/catalog" className="btn btn-primary text-[10px] xs:text-xs font-bold font-accent uppercase tracking-widest py-3.5 px-6 rounded-full text-center cursor-pointer">Browse Mattresses</Link>
                  <a
                    href={`https://wa.me/919281424494?text=${encodeURIComponent('Hello Suresh, I would like to know more about RelaxPro Mattress and your range. Can you help?')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary text-[10px] xs:text-xs font-bold font-accent uppercase tracking-widest py-3.5 px-6 rounded-full text-center cursor-pointer inline-flex items-center justify-center gap-2"
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
