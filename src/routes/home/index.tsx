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
      <TwoWaysToOwn
        onStartBuilding={() => handlePageNavigation('builder')}
        onSeeAllModels={() => handlePageNavigation('catalog')}
      />
      <Marquee />

      <ShopByBrands />

      <section className="bg-secondary/50 border-y border-brand-200/30 py-16 md:py-24 px-4 md:px-8">
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
            {PRODUCTS.slice(0, 3).map((item, idx) => {
              const isBestSeller = item.slug === 'nirvana';
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
                    {isBestSeller ? (
                      <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-accent text-primary font-accent text-[7px] md:text-[9px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md z-10">
                        <Sparkles className="w-2 h-2 md:w-3 md:h-3 fill-current" /> <span className="hidden sm:inline">Best Seller</span><span className="sm:hidden">Top</span>
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-primary/90 text-white font-accent text-[7px] md:text-[9px] px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase z-10 tracking-wider">
                        {item.comfortLevel} Feel
                      </span>
                    )}
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
                        {isBestSeller && (
                          <span className="text-[7px] md:text-[9px] font-accent font-bold uppercase tracking-wider text-accent-dark bg-accent/15 px-1 py-0.5 md:px-1.5 md:py-0.5 rounded text-center line-clamp-1">Hand-Crafted</span>
                        )}
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

              if (isBestSeller) {
                return (
                  <ShineBorder
                    key={item.slug}
                    className="group flex flex-col justify-between h-full card-hover scale-in cursor-pointer"
                    style={{ transitionDelay: `${idx * 0.1}s` } as any}
                    onClick={() => handleNavigateToPdp(item.slug)}
                  >
                    {cardContent}
                  </ShineBorder>
                );
              }

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

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 fade-up">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-widest font-accent text-accent uppercase bg-accent/10 px-4 py-1.5 rounded-full font-bold">Three Curated Categories</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 text-primary leading-tight">Engineered to Match Every Posture Need</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white p-7 md:p-8 rounded-2xl border border-brand-200/40 shadow-sm space-y-4 feature-card-glow relative scale-in" style={{ transitionDelay: '0s' }}>
            <div className="absolute top-0 inset-x-0 h-1 bg-accent rounded-t-2xl" />
            <span className="text-[10px] font-accent font-bold tracking-widest uppercase text-accent-dark bg-accent/15 px-2.5 py-1 rounded inline-block">Luxury Organic Latex</span>
            <h3 className="text-xl font-heading font-bold text-primary">Pure Organic Latex Blocks</h3>
            <p className="text-xs text-neutral-dark/50 leading-relaxed font-body">Denser solid GOLS latex sheets harvested in Kerala. Dual monozone and orthopedic 7-Zone configurations.</p>
            <ul className="space-y-2 text-xs text-neutral-dark/60 pt-2 font-body">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success shrink-0" /> Nirvana (8" Dual Zone)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success shrink-0" /> Amrita (10" Reversible Hybrid)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success shrink-0" /> Ananda (6" Classic Pure core)</li>
            </ul>
            <button onClick={() => { onNavigate('catalog'); }} className="text-accent hover:text-accent-dark text-xs font-semibold font-accent flex items-center gap-1 pt-3 cursor-pointer transition-colors">Browse Luxury Series →</button>
          </div>

          <div className="bg-white p-7 md:p-8 rounded-2xl border border-brand-200/40 shadow-sm space-y-4 feature-card-glow relative scale-in" style={{ transitionDelay: '0.15s' }}>
            <span className="text-[10px] font-accent font-bold tracking-widest uppercase text-primary bg-brand-100 px-2.5 py-1 rounded inline-block">Premium Spine Hybrids</span>
            <h3 className="text-xl font-heading font-bold text-primary">Orthopedic Support Cores</h3>
            <p className="text-xs text-neutral-dark/50 leading-relaxed font-body">Balanced structures blending organic latex with high density rebound posture matrices.</p>
            <ul className="space-y-2 text-xs text-neutral-dark/60 pt-2 font-body">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success shrink-0" /> Arogya (8" Doctor recommendation)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success shrink-0" /> Sthira (6" Ultimate firm alignment)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success shrink-0" /> Somya (10" Extra softy adaptive)</li>
            </ul>
            <button onClick={() => { onNavigate('catalog'); }} className="text-accent hover:text-accent-dark text-xs font-semibold font-accent flex items-center gap-1 pt-3 cursor-pointer transition-colors">Browse Premium Series →</button>
          </div>

          <div className="bg-white p-7 md:p-8 rounded-2xl border border-brand-200/40 shadow-sm space-y-4 feature-card-glow relative scale-in" style={{ transitionDelay: '0.3s' }}>
            <span className="text-[10px] font-accent font-bold tracking-widest uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded inline-block">Comfort High-Resilience</span>
            <h3 className="text-xl font-heading font-bold text-primary">Spine Transition Foams</h3>
            <p className="text-xs text-neutral-dark/50 leading-relaxed font-body">Accessible comfort mattresses with custom density transitions and Oeko-Tex certified wrappers.</p>
            <ul className="space-y-2 text-xs text-neutral-dark/60 pt-2 font-body">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success shrink-0" /> Sunidra (8" Universal sleeper)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success shrink-0" /> Ojas (6" Standard micro-weave)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success shrink-0" /> AyushRest (8" Triple ortho firmness)</li>
            </ul>
            <button onClick={() => { onNavigate('catalog'); }} className="text-accent hover:text-accent-dark text-xs font-semibold font-accent flex items-center gap-1 pt-3 cursor-pointer transition-colors">Browse Comfort Series →</button>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 md:py-20 px-4 md:px-8 border-y border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/30 mb-6">
            <Leaf className="w-10 h-10 text-accent" />
          </div>
          <span className="text-[10px] tracking-widest font-accent text-accent uppercase font-bold bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full inline-block mb-4">GOLS Certified Organic</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight mb-4">
            Pure Natural Latex — <span className="text-accent">Zero Compromise</span>
          </h2>
          <p className="text-white/50 font-body text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            All RelaxPro latex mattresses use GOLS certified natural rubber from Kerala plantations. No synthetic latex, no chemical fillers — just pure Dunlop sap transformed into your healthiest sleep surface.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {['GOLS Certified', 'Oeko-Tex', 'FSC Certified', 'Zero VOC'].map((cert) => (
              <div key={cert} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                <div className="text-accent font-heading font-bold text-lg">✓</div>
                <div className="text-white font-heading font-bold text-sm mt-1">{cert}</div>
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
        <ConsultationForm />
      </section>
    </PageShell>
  );
}
