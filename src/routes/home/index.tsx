import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PRODUCTS } from '../../data/products';
import { CartItem, Product, MattressSize, OrderReceipt } from '../../types';
import PageShell from '../../components/layout/PageShell';
import HeroSlider from '../../components/home/HeroSlider';
import Marquee from '../../components/ui/Marquee';
import ShopByBrands from '../../components/home/ShopByBrands';
import CostComparison from '../../components/home/CostComparison';

import QuickConnectBar from '../../components/home/QuickConnectBar';
import TwoWaysToOwn from '../../components/home/TwoWaysToOwn';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import SleepFAQs from '../../components/home/SleepFAQs';
import ConsultationForm from '../../components/home/ConsultationForm';
import ShowroomBookingForm from '../../components/home/ShowroomBookingForm';
import ComparisonTable from '../../components/home/ComparisonTable';
import {
  Check,
  Sparkles,
  Star,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  Leaf,
} from 'lucide-react';
import PriceText from '../../components/ui/PriceText';
import ShineBorder from '../../components/ui/ShineBorder';
import SEO from '../../components/seo/SEO';

interface HomePageProps {
  onAddToCartDirect: (
    product: Product,
    size: MattressSize,
    includeAccessories: boolean,
    fabricOption?: '300GSM' | '450GSM',
  ) => void;
  onOrderSuccess: (orderId: string, summary: OrderReceipt) => void;
  onNavigate: (page: string) => void;
}

const homeSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'RelaxPro Premium Mattresses',
  image: '/images/products/prakriti.webp',
  telephone: '+918686624494',
  email: 'relaxpro2022@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jeedimetla Industrial Area, Phase 3, Near Prasad Labs',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500055',
    addressCountry: 'IN',
  },
  url: 'https://remix-relaxpro-matress.vercel.app/',
  priceRange: '₹6,500 - ₹54,000',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '10:00',
    closes: '21:00',
  },
};

export default function HomePage({
  onAddToCartDirect,
  onOrderSuccess,
  onNavigate,
}: HomePageProps) {
  const navigate = useNavigate();

  const handlePageNavigation = (page: string) => {
    if (page === 'home') navigate('/');
    else navigate(`/${page}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateToPdp = (slug: string) => {
    navigate(`/mattresses/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageShell
      title="RelaxPro Premium Mattresses | 100% Natural Organic Latex India"
      description="Telangana and AP's leading manufacturer of pure natural latex mattresses. Handcrafted, GOLS certified Dunlop rubber latex direct from Kerala unit to your bedroom."
      schema={homeSchema}
    >
      <HeroSlider
        onNavigate={handlePageNavigation}
        onNavigateToPdp={handleNavigateToPdp}
      />

      {/* Quick Action CTA Buttons Just After Hero */}
      <section className="bg-neutral-light py-5 md:py-7 border-b border-brand-200/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
          <button
            onClick={() => handlePageNavigation('builder')}
            className="w-full sm:w-auto btn-primary bg-primary text-white hover:bg-neutral-dark/90 py-4 px-10 rounded-full text-xs font-bold font-accent uppercase tracking-widest cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
          >
            Find Your Own Bed
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('bestsellers');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                handlePageNavigation('catalog');
              }
            }}
            className="w-full sm:w-auto btn-primary bg-accent hover:bg-accent-dark text-primary py-4 px-10 rounded-full text-xs font-bold font-accent uppercase tracking-widest cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
          >
            Best Selling Models
          </button>
        </div>
      </section>

      <TwoWaysToOwn
        onStartBuilding={() => handlePageNavigation('builder')}
        onSeeAllModels={() => handlePageNavigation('catalog')}
      />
      <Marquee />

      <ShopByBrands />

      <section id="bestsellers" className="bg-secondary/50 border-y border-brand-200/30 py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-4 fade-up">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] tracking-widest font-accent text-accent uppercase bg-accent/10 px-4 py-1.5 rounded-full font-bold">Top Selling Sleep Systems</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-3">Bestselling Products</h2>
            </div>
            <button
              onClick={() => handlePageNavigation('catalog')}
              className="btn-primary text-xs font-bold font-accent uppercase tracking-widest text-primary bg-white border border-brand-200 hover:border-accent py-3.5 px-6 rounded-full cursor-pointer shadow-sm"
            >
              View All Products
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {PRODUCTS.slice(0, 3).map((item, idx) => {
              const isNirvana = item.slug === 'nirvana';

              if (isNirvana) {
                return (
                  <motion.div
                    key={item.slug}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    whileHover={{ scale: 1.025, y: -6 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-xl border cursor-pointer h-full relative"
                    style={{ backgroundColor: '#1A2421', borderColor: 'rgba(201, 168, 124, 0.15)' }}
                    onClick={() => handleNavigateToPdp(item.slug)}
                  >
                    {/* Golden luxury glow effect on card hover */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      <motion.img
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        src={item.image}
                        alt={`${item.name} natural organic latex mattress`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={400}
                        height={300}
                        referrerPolicy="no-referrer"
                      />
                      <span 
                        className="absolute top-3 left-3 font-accent text-[8px] md:text-[9px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-1.5 shadow-lg border"
                        style={{ backgroundColor: '#C9A87C', color: '#1A2421', borderColor: 'rgba(26, 36, 33, 0.1)' }}
                      >
                        <Sparkles className="w-2.5 h-2.5 fill-current" /> Premium Masterpiece
                      </span>
                    </div>

                    <div className="p-5 md:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating block */}
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: '#C9A87C' }} />
                          ))}
                          <span className="text-[10px] ml-1.5 font-accent tracking-widest uppercase font-bold" style={{ color: '#F5F2EB', opacity: 0.6 }}>(4.9)</span>
                        </div>

                        {/* Title & Badge */}
                        <h3 className="font-heading font-serif font-normal text-lg md:text-2xl flex flex-wrap items-center gap-2" style={{ color: '#F5F2EB' }}>
                          {item.name}
                          <span 
                            className="text-[8px] font-accent font-bold uppercase tracking-widest border px-2 py-0.5 rounded-lg"
                            style={{ color: '#C9A87C', borderColor: 'rgba(201, 168, 124, 0.3)', backgroundColor: 'rgba(201, 168, 124, 0.08)' }}
                          >
                            100% Organic
                          </span>
                        </h3>

                        <p className="text-xs mt-3 leading-relaxed font-body" style={{ color: '#F5F2EB', opacity: 0.85 }}>
                          {item.keyBenefit}
                        </p>

                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-accent tracking-wider uppercase" style={{ color: '#F5F2EB', opacity: 0.5 }}>Starting Price</span>
                            <span className="text-lg md:text-2xl font-bold font-body mt-0.5" style={{ color: '#F5F2EB' }}>
                              <PriceText>
                                ₹
                                {item.pricingModel === 'with_without_accessories'
                                  ? item.pricing.withoutAccessories?.king?.toLocaleString('en-IN')
                                  : item.pricing.fabric300Gsm?.king?.toLocaleString('en-IN')}
                              </PriceText>
                            </span>
                          </div>
                          <span className="text-[10px] font-accent tracking-widest uppercase border border-white/10 rounded-lg px-2.5 py-1" style={{ color: '#F5F2EB', opacity: 0.7 }}>King Size</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 md:p-6 pt-0 border-t border-white/5 flex flex-col gap-2.5 mt-auto relative z-10">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToPdp(item.slug);
                        }}
                        className="w-full py-3 px-4 rounded-xl border font-accent font-bold text-[10px] md:text-xs tracking-widest uppercase text-center cursor-pointer transition-all shadow-md"
                        style={{ backgroundColor: '#C9A87C', color: '#1A2421', borderColor: '#C9A87C' }}
                      >
                        Customize & Purchase
                      </motion.button>
                      <motion.a
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        href={`https://wa.me/918686624494?text=${encodeURIComponent(
                          `Hello Suresh, I am interested in the RelaxPro ${item.name} Mattress (King size). Please share pricing and delivery info.`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 px-4 rounded-xl text-[10px] md:text-xs font-accent tracking-widest font-bold uppercase text-center transition-all flex items-center justify-center gap-1.5 border"
                        style={{ color: '#F5F2EB', borderColor: 'rgba(245, 242, 235, 0.2)', backgroundColor: 'rgba(245, 242, 235, 0.04)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageSquare className="w-3.5 h-3.5" style={{ color: '#C9A87C' }} /> Enquire on WhatsApp
                      </motion.a>
                    </div>
                  </motion.div>
                );
              }

              const cardContent = (
                <>
                  <div className="relative img-zoom" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={item.image}
                      alt={`${item.name} natural latex mattress`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={400}
                      height={300}
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-primary/90 text-white font-accent text-[7px] md:text-[9px] px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase z-10 tracking-wider">
                      {item.comfortLevel} Feel
                    </span>
                  </div>
                  <div className="p-3 md:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-0.5 md:gap-1 text-accent mb-1 md:mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-current" />
                        ))}
                        <span className="text-[8px] md:text-[10px] text-neutral-dark/40 ml-1 font-accent">(4.9)</span>
                      </div>
                      <h3 className="font-heading font-bold text-sm md:text-lg text-primary flex flex-wrap items-center gap-1">
                        {item.name}
                      </h3>
                      <p className="text-[9px] md:text-xs text-neutral-dark/50 mt-1 leading-relaxed font-body line-clamp-2">{item.keyBenefit}</p>
                      <div className="mt-2 md:mt-4 pt-2 md:pt-3 border-t border-brand-200/40 flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
                        <span className="text-xs md:text-lg font-bold text-primary font-body">
                          <PriceText>
                            ₹
                            {item.pricingModel === 'with_without_accessories'
                              ? item.pricing.withoutAccessories?.king?.toLocaleString('en-IN')
                              : item.pricing.fabric300Gsm?.king?.toLocaleString('en-IN')}
                          </PriceText>
                        </span>
                        <span className="text-[8px] md:text-[10px] text-neutral-dark/40 font-accent">King Size</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 md:p-4 border-t border-brand-200/30 flex flex-col gap-1.5 md:gap-2 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToPdp(item.slug);
                      }}
                      className="btn-primary w-full py-1.5 md:py-2.5 px-2 md:px-3 rounded-lg md:rounded-xl border border-brand-200 hover:border-accent bg-white font-accent font-semibold text-[9px] md:text-xs text-center cursor-pointer text-primary transition-all"
                    >
                      View Details
                    </button>
                    <a
                      href={`https://wa.me/918686624494?text=${encodeURIComponent(
                        `Hello Suresh, I am interested in the RelaxPro ${item.name} Mattress (King size). Please share pricing and delivery info.`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary w-full py-1.5 md:py-2.5 px-2 md:px-3 rounded-lg md:rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] md:text-xs font-semibold text-center transition-all flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-2.5 h-2.5 md:w-3 md:h-3" /> <span className="hidden sm:inline">Enquire on WA</span><span className="sm:hidden">WhatsApp</span>
                    </a>
                  </div>
                </>
              );

              return (
                <div
                  key={item.slug}
                  className={`bg-white rounded-2xl border border-brand-200/40 overflow-hidden flex flex-col justify-between group shadow-sm card-hover scale-in cursor-pointer`}
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                  onClick={() => handleNavigateToPdp(item.slug)}
                >
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </section>



      <section
        className="rp-section"
        style={{
          background: '#141C1A',
          color: '#FFFFFF',
        }}
      >
        <div className="rp-container text-center">
          <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <Leaf className="h-10 w-10 text-accent" />
          </div>

          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#C9A87C',
              backgroundColor: 'rgba(201,168,124,0.18)',
              border: '1px solid rgba(201,168,124,0.5)',
              borderRadius: '9999px',
              marginBottom: '24px',
            }}
          >
            GOLS Certified Organic
          </span>

          <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl">
            Pure Natural Latex — <span style={{ color: '#C9A87C' }}>Zero Compromise</span>
          </h2>

          <p
            style={{
              margin: '16px auto 0',
              maxWidth: '640px',
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#E6E6E4',
            }}
          >
            GOLS-certified Dunlop rubber from Kerala, with no synthetic latex or chemical fillers.
          </p>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {['GOLS Certified', 'Oeko-Tex', 'FSC Certified', 'Zero VOC'].map((cert) => (
              <div
                key={cert}
                style={{
                  borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  padding: '20px 16px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#C9A87C' }}>✓</div>
                <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                  {cert}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-12 md:py-16 px-4 md:px-8 bg-neutral-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[11px] tracking-widest font-accent text-accent uppercase font-bold bg-accent/10 px-4 py-1.5 rounded-full inline-block mb-3">Visit Our Factory Showroom</span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">Find Us in Hyderabad</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border border-brand-200/40 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3804.640936998565!2d78.463397!3d17.504569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDMwJzE2LjQiTiA3OMKwMjcnNDguMiJF!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="RelaxPro Hyderabad Factory Showroom"
            />
          </div>
          <p className="text-center text-neutral-dark/50 text-xs mt-4 font-body">Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad — Open 10 AM to 9 PM Daily</p>
        </div>
      </section>

      <WhyChooseUs />

      <CostComparison />

      <ComparisonTable />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 fade-up">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-widest font-accent text-accent uppercase bg-accent/10 px-4 py-1.5 rounded-full font-bold">Trust & Honest Feedback</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 text-primary leading-tight">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-2xl font-bold font-heading text-primary">4.9</span>
            <span className="text-accent text-lg">/ 5 ★</span>
            <span className="text-neutral-dark/40 text-sm font-body ml-1">from 2,400+ reviews</span>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 't1', name: 'Srinivas Rao', city: 'Hyderabad', rating: 5, comment: 'Buying the Nirvana mattress was the best decision for my chronic lower back issues.', product: 'Nirvana 8"' },
            { id: 't2', name: 'Anvitha Reddy', city: 'Bangalore', rating: 5, comment: 'We got the Amrita mattress 6 months ago. Incredible comfort. It isolates motion perfectly.', product: 'Amrita 10" Hybrid' },
            { id: 't3', name: 'Rajendra Prasad', city: 'Rajahmundry', rating: 5, comment: 'Sthira is perfect for those who want a firm but very comfortable orthopedic feel.', product: 'Sthira 6"' },
            { id: 't4', name: 'Deepak Sharma', city: 'Hyderabad', rating: 5, comment: 'I am amazed by the Custom Mattress builder! Delivered within 6 days.', product: 'Custom Build' },
          ].map((t, idx) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-2xl border border-brand-200/40 shadow-sm flex flex-col justify-between card-hover fade-up"
              style={{ transitionDelay: `${idx * 0.08}s` }}
            >
              <div>
                <span className="text-4xl font-heading text-accent/20 leading-none block mb-2">“</span>
                <div className="flex items-center gap-0.5 text-accent mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-neutral-dark/70 leading-relaxed italic font-body">“{t.comment}”</p>
              </div>
              <div className="border-t border-brand-200/30 pt-3 mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center text-accent font-heading font-bold text-sm shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <span className="font-heading font-bold text-xs text-primary block">{t.name}</span>
                  <span className="text-[10px] text-neutral-dark/40 block font-body">{t.city} • <span className="text-success font-semibold">✓ Verified</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden testimonial-carousel">
          {[
            { id: 't1', name: 'Srinivas Rao', city: 'Hyderabad', rating: 5, comment: 'Buying the Nirvana mattress was the best decision for my chronic lower back issues.', product: 'Nirvana 8"' },
            { id: 't2', name: 'Anvitha Reddy', city: 'Bangalore', rating: 5, comment: 'We got the Amrita mattress 6 months ago. Incredible comfort.', product: 'Amrita 10" Hybrid' },
            { id: 't3', name: 'Rajendra Prasad', city: 'Rajahmundry', rating: 5, comment: 'Sthira is perfect for those who want a firm but very comfortable orthopedic feel.', product: 'Sthira 6"' },
            { id: 't4', name: 'Deepak Sharma', city: 'Hyderabad', rating: 5, comment: 'I am amazed by the Custom Mattress builder! Delivered within 6 days.', product: 'Custom Build' },
          ].map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-2xl border border-brand-200/40 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-3xl font-heading text-accent/20 leading-none block mb-2">“</span>
                <div className="flex items-center gap-0.5 text-accent mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-neutral-dark/70 leading-relaxed italic font-body">“{t.comment}”</p>
              </div>
              <div className="border-t border-brand-200/30 pt-3 mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center text-accent font-heading font-bold text-sm shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <span className="font-heading font-bold text-xs text-primary block">{t.name}</span>
                  <span className="text-[10px] text-neutral-dark/40 block font-body">{t.city} • <span className="text-success font-semibold">✓ Verified</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="locations" className="bg-zinc-100 border-t border-zinc-200 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-[10px] tracking-wider font-mono text-brand-600 uppercase font-bold">EXPERIENCE BEFORE BUYING</span>
            <h2 className="text-2xl md:text-3xl font-display font-medium text-brand-950 mt-1">Our Showrooms and Kerala Factory Outlets</h2>
            <p className="text-gray-500 text-xs mt-1">Walk in, test firmness profiles, lay down, and speak with Suresh's trained team directly at the locations below.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {[
              { city: 'Hyderabad', address: 'RelaxPro Factory Showroom, Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad, Telangana - 500055', phones: ['+918686624494', '+917207424494'], hours: 'Mon - Sun: 10:00 AM - 9:00 PM' },
              { city: 'Rajahmundry', address: 'RelaxPro Experience Store, Danavaipeta Mall Road, Opposite Municipal Complex, Rajahmundry, Andhra Pradesh - 533103', phones: ['+918686624494'], hours: 'Mon - Sat: 10:00 AM - 8:30 PM, Sun: 11:00 AM - 7:00 PM' },
              { city: 'Bangalore', address: 'RelaxPro Partner Store, Indiranagar 100 Feet Road, Near Halasuru Metro Station, Bangalore, Karnataka - 560038', phones: ['+917207424494'], hours: 'Mon - Sun: 10:30 AM - 8:30 PM' },
            ].map((loc, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl p-4 sm:p-6 border border-zinc-200/65 shadow-xs flex flex-col ${
                  idx === 2 ? "col-span-2 lg:col-span-1 w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none mx-auto" : ""
                }`}
              >
                <div className="mb-2 sm:mb-4">
                  <span className="text-[9px] sm:text-xs font-display font-bold uppercase tracking-wider text-brand-800 bg-brand-100 px-2 py-0.5 rounded">{loc.city} Store</span>
                </div>
                <p className="text-[10px] sm:text-xs text-stone-700 leading-relaxed font-sans mb-3 sm:mb-4 flex-grow">{loc.address}</p>
                
                <div className="text-[9px] sm:text-xs space-y-1 sm:space-y-1.5 pt-2 border-t border-zinc-100">
                  <div className="text-zinc-500"><strong className="text-zinc-900 font-medium">Outlets hours:</strong> {loc.hours}</div>
                  <div className="text-zinc-900 font-mono"><strong className="text-zinc-500 font-sans font-medium">Contact:</strong> {loc.phones.join(', ')}</div>
                </div>
                
                <div className="mt-3 sm:mt-4 pt-2 border-t border-zinc-100/50">
                  <a
                    href={`https://wa.me/918686624494?text=${encodeURIComponent(`Hello, I would like to visit the RelaxPro ${loc.city} Experience Showroom. Can you please guide me on directions?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[9px] sm:text-xs text-brand-900 font-semibold font-mono hover:text-brand-950 cursor-pointer text-left leading-tight"
                  >
                    Book Showroom Visit + Map Route
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuickConnectBar />

      <section className="py-20 bg-white border-t border-zinc-200/50">
        <SleepFAQs />
      </section>

      <section className="py-20 bg-linear-to-b from-zinc-150 to-brand-50/50 px-4">
        <ShowroomBookingForm />
      </section>

      <section className="py-20 bg-neutral-light border-t border-brand-200/40 px-4">
        <ConsultationForm />
      </section>
    </PageShell>
  );
}
