import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, animate } from 'motion/react';
import { PRODUCTS } from '../../data/products';
import { CartItem, Product, MattressSize, OrderReceipt } from '../../types';
import PageShell from '../../components/layout/PageShell';
import HeroSlider from '../../components/home/HeroSlider';
import TrustStrip from '../../components/home/TrustStrip';
import Marquee from '../../components/ui/Marquee';
import CertificationMarquee from '../../components/home/CertificationMarquee';
import ShopByBrands from '../../components/home/ShopByBrands';
import CostComparison from '../../components/home/CostComparison';
import { FadeUp, StaggerChildren, staggerItem, EASE_LUXURY } from '../../components/motion/motionPrimitives';
import { BedDouble, Bed, ShoppingBag } from 'lucide-react';

import QuickConnectBar from '../../components/home/QuickConnectBar';
import TwoWaysToOwn from '../../components/home/TwoWaysToOwn';

import SleepFAQs from '../../components/home/SleepFAQs';
import ConsultationForm from '../../components/home/ConsultationForm';
import ShowroomBookingForm from '../../components/home/ShowroomBookingForm';
import ComparisonTable from '../../components/home/ComparisonTable';
import CertificationsSection from '../../components/home/CertificationsSection';
import CustomerVideos from '../../components/home/CustomerVideos';
import FoundersPodcast from '../../components/home/FoundersPodcast';
import TrustBadges from '../../components/home/TrustBadges';
import {
  Check,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';
import PriceText from '../../components/ui/PriceText';
import ShineBorder from '../../components/ui/ShineBorder';
import SEO from '../../components/seo/SEO';
import { getHomePage, getAllProducts, getTestimonials, getAllShowrooms, imageUrl } from '../../lib/queries';
import { buildWhatsAppUrl } from '../../lib/site';

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

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showrooms, setShowrooms] = useState<any[]>([]);
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const slideCarousel = (dir: 'prev' | 'next') => {
    const container = carouselRef.current;
    if (!container || testimonials.length === 0) return;
    const cardWidth = 380 + 32;
    const visible = Math.floor((container.parentElement?.clientWidth || 1200) / cardWidth);
    const maxIdx = Math.max(0, testimonials.length - visible);
    const currentIdx = Math.round(-x.get() / cardWidth);
    const targetIdx = dir === 'next' ? Math.min(maxIdx, currentIdx + 1) : Math.max(0, currentIdx - 1);
    animate(x, -targetIdx * cardWidth, { type: 'spring', stiffness: 300, damping: 30 });
  };

  useEffect(() => {
    let bestsellersLoaded = false;

    getAllProducts().then(allProds => {
      const best = allProds.filter((p: any) => p.isBestseller).slice(0, 6);
      if (best.length > 0) {
        setBestsellers(best.map((p: any) => ({
          ...p,
          image: imageUrl(p.image) || '/images/products/' + p.slug + '.webp'
        })));
        bestsellersLoaded = true;
      }
    }).catch(() => {});

    getHomePage().then(data => {
      // Only use homepage bestsellers if getAllProducts didn't return any
      if (!bestsellersLoaded) {
        const prods = data?.bestsellersSection?.products || [];
        if (prods.length > 0) {
          setBestsellers(prods.map((p: any) => {
            const hc = PRODUCTS.find((h: any) => h.slug === p.slug);
            return { ...p, image: typeof p.image === 'string' ? p.image : imageUrl(p.image) || hc?.image || '/images/products/' + p.slug + '.webp' };
          }));
        }
      }
    }).catch(() => {});

    getTestimonials().then(setTestimonials).catch(() => {});
    getAllShowrooms().then(setShowrooms).catch(() => {});
  }, []);

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

      {/* Trust badges strip below hero — clean horizontal bar */}
      <TrustStrip />

      <FadeUp>      <TwoWaysToOwn
        onStartBuilding={() => handlePageNavigation('builder')}
        onSeeAllModels={() => handlePageNavigation('catalog')}
      /></FadeUp>
<FadeUp><Marquee /></FadeUp>
<FadeUp><CertificationMarquee /></FadeUp>
<FadeUp><ShopByBrands /></FadeUp>

      {/* Shuddha Banner — Clickable to Catalog */}
      <FadeUp>
        <section className="bg-secondary py-8 md:py-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.button
              onClick={() => handlePageNavigation('catalog')}
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
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* CTA label */}
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-ink-900 font-bold text-xs md:text-sm px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-400">
                <ShoppingBag className="w-4 h-4" />
                Explore Collection
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        </section>
      </FadeUp>

      <FadeUp><section id="bestsellers" className="bg-sky-100/20 border-y border-brand-200/30 py-12 md:py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(21,104,163,0.06) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto">
          <FadeUp className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-4">
            <div>
              <span className="eyebrow">Best In Class</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink-900 mt-3">Our Bestsellers</h2>
            </div>
            <button
              onClick={() => handlePageNavigation('catalog')}
              className="btn btn-secondary text-xs font-bold font-accent uppercase tracking-widest py-3.5 px-6 rounded-full cursor-pointer"
            >
              View All Models
            </button>
          </FadeUp>

          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 justify-center" stagger={0.15}>
            {(bestsellers.length > 0 ? bestsellers : PRODUCTS.slice(0, 6)).map((item: any, idx: number) => {
              const isBestSeller = item.isBestseller || item.slug === 'nirvana';
              const imageUrl = item.image || '';

              return (
                <motion.div
                  key={item.slug}
                  variants={staggerItem}
                  whileHover={{ scale: 1.025, rotateY: 4, rotateX: 2, y: -6 }}
                  transition={{ duration: 0.6, ease: EASE_LUXURY }}
                  className="card-ink overflow-hidden flex flex-col justify-between group cursor-pointer h-full relative"
                  onClick={() => handleNavigateToPdp(item.slug)}
                >
                  {/* Sapphire glow effect on card hover */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <motion.img
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      src={imageUrl}
                      alt={`${item.name} natural organic latex mattress`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={400}
                      height={300}
                      referrerPolicy="no-referrer"
                    />
                    {isBestSeller ? (
                      <span className="absolute top-2 left-2 md:top-3 md:left-3 badge-blue flex items-center gap-1 shadow-lg">
                        <Sparkles className="w-2 h-2 md:w-2.5 md:h-2.5 fill-current" /> <span className="hidden md:inline">Premium Masterpiece</span><span className="inline md:hidden">Premium</span>
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 md:top-3 md:left-3 badge-eco shadow-lg">
                        {item.comfortLevel} Feel
                      </span>
                    )}
                  </div>

                  <div className="p-3 md:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating block */}
                      <div className="flex items-center gap-0.5 md:gap-1 mb-1.5 md:mb-3 stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-current" />
                        ))}
                        <span className="text-[8px] md:text-[10px] ml-1 font-accent tracking-widest uppercase font-bold text-linen-200/60">(4.9)</span>
                      </div>

                      {/* Title & Badge */}
                      <h3 className="font-heading font-serif font-normal text-sm md:text-2xl flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-1 md:gap-2 text-linen-100">
                        <span>{item.name}</span>
                        {isBestSeller && (
                          <span className="badge-blue text-[6px] md:text-[8px]">
                            100% Organic
                          </span>
                        )}
                      </h3>

                      <p className="text-[9px] md:text-xs mt-1.5 md:mt-3 leading-relaxed font-body h-[28px] md:h-[40px] line-clamp-2 text-linen-200/85">
                        {item.keyBenefit}
                      </p>

                      <div className="mt-3 md:mt-6 pt-2 md:pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
                        <div className="flex flex-col">
                          <span className="text-[7px] md:text-[9px] font-accent tracking-wider uppercase text-linen-200/50">Starting Price</span>
                          <span className="text-sm md:text-2xl font-bold font-body mt-0 md:mt-0.5 text-linen-100">
                            <PriceText>
                              ₹
                              {(() => {
                                const price = item.pricing?.withoutAccessories?.king ?? item.pricing?.fabric300Gsm?.king ?? item.pricing?.withAccessories?.king ?? 0;
                                return price ? price.toLocaleString('en-IN') : '';
                              })()}
                            </PriceText>
                          </span>
                        </div>
                        <span className="text-[7px] md:text-[10px] font-accent tracking-widest uppercase border border-white/10 rounded md:rounded-lg px-1.5 py-0.5 md:px-2.5 md:py-1 self-start md:self-auto text-linen-200/70">King Size</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-6 pt-0 border-t border-white/5 flex flex-col gap-2 mt-auto relative z-10">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToPdp(item.slug);
                      }}
                      className="btn btn-primary w-full py-1.5 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl font-accent font-bold text-[8px] md:text-[10px] lg:text-xs tracking-widest uppercase text-center cursor-pointer flex items-center justify-center gap-1 md:gap-2"
                    >
                      <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 opacity-80" /> <span className="hidden md:inline">Customize &amp; Purchase</span><span className="inline md:hidden">Buy</span>
                    </motion.button>
                    
                    <motion.a
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '918686624494'}?text=${encodeURIComponent(
                        `Hi! I am interested in the ${item.name} mattress. Can you help me select the right size and customization?`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-ghost-dark w-full py-1.5 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl text-[8px] md:text-[10px] lg:text-xs font-accent tracking-widest font-bold uppercase text-center flex items-center justify-center gap-1 md:gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageSquare className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-brand-300" /> <span className="hidden md:inline">Enquire on WhatsApp</span><span className="inline md:hidden">WhatsApp</span>
                    </motion.a>
                  </div>
                </motion.div>
              );
            })}
          </StaggerChildren>
        </div>
      </section></FadeUp>



      <FadeUp><section className="py-10 md:py-12 px-4 md:px-8 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="eyebrow">Visit Our Factory Showroom</span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-ink-900">Find Us in Hyderabad</h2>
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
          <p className="text-center text-graphite-500 text-xs mt-4 font-body">Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad — Open 10 AM to 9 PM Daily</p>
        </div>
      </section></FadeUp>

  {/* ── Accessories Section ── */}
      <FadeUp><section className="bg-sky-100/20 py-16 md:py-24 px-4 md:px-8 border-t border-brand-200/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 80%, rgba(21,104,163,0.06) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <span className="eyebrow">Complete Your Setup</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-ink-900 mt-3 leading-tight">
                Pillows, Protectors &<br />
                <span className="text-brand-600">More Accessories</span>
              </h2>
              <p className="text-graphite-600 text-sm md:text-base mt-4 font-body leading-relaxed">
                Crafted from the same premium materials as our mattresses — naturally. From ergonomic latex pillows to waterproof protectors, every accessory is designed to enhance your sleep experience.
              </p>
            </div>
            <button
              onClick={() => handlePageNavigation('accessories')}
              className="btn btn-primary shrink-0 group text-xs font-bold font-accent uppercase tracking-widest py-3.5 px-8 rounded-full flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop Accessories
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </FadeUp>

          <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" stagger={0.12}>
            {[
              {
                icon: BedDouble,
                title: 'Latex Pillows',
                desc: 'Ergonomic cervical support in natural Dunlop latex',
                bg: 'from-brand-50 to-sky-50',
                border: 'border-brand-200/50',
              },
              {
                icon: BedDouble,
                title: 'Shredded Pillows',
                desc: 'Adjustable loft pillows with natural latex fill',
                bg: 'from-sky-100/50 to-sky-50',
                border: 'border-brand-200/40',
              },
              {
                icon: Bed,
                title: 'Mattress Protectors',
                desc: 'Breathable waterproof protection, deep-pocket fit',
                bg: 'from-brand-50 to-sky-50',
                border: 'border-brand-200/50',
              },
              {
                icon: Bed,
                title: 'Fiber Pillows',
                desc: 'Soft, plush microfiber for everyday comfort',
                bg: 'from-sky-100/50 to-sky-50',
                border: 'border-brand-200/40',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className={`bg-gradient-to-br ${item.bg} rounded-2xl border ${item.border} shadow-sm p-5 md:p-7 flex flex-col items-start text-left group cursor-default transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5`}
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-brand-200/40 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 group-hover:rotate-[-6deg] transition-all duration-400">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm md:text-lg text-ink-900 mb-1.5">{item.title}</h3>
                <p className="text-[10px] md:text-xs text-graphite-500 font-body leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section></FadeUp>

      <FadeUp><CostComparison /></FadeUp>

      <FadeUp><ComparisonTable /></FadeUp>

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 md:py-24 overflow-hidden">
        <FadeUp className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="eyebrow">Trust & Honest Feedback</span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mt-4 text-ink-900 leading-tight">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-2xl font-bold font-heading text-ink-900">4.9</span>
            <span className="text-brand-600 text-lg">/ 5 ★</span>
            <span className="text-graphite-400 text-sm font-body ml-1">from 220+ reviews</span>
          </div>
        </FadeUp>

        <div className="relative">
          {/* Prev arrow */}
          <button
            onClick={() => slideCarousel('prev')}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-sky-50/90 backdrop-blur-sm border border-brand-200/40 shadow-md flex items-center justify-center text-ink-900 hover:bg-brand-600 hover:text-white transition-all duration-200"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <motion.div
            ref={carouselRef}
            className="flex gap-4 md:gap-8 cursor-grab active:cursor-grabbing pb-8 w-max"
            drag="x"
            style={{ x }}
            dragElastic={0.1}
          >
            {(testimonials.length > 0 ? testimonials : []).map((t: any, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-[300px] md:w-[380px] shrink-0 bg-secondary p-8 rounded-2xl border border-brand-200/40 shadow-sm flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute -top-6 -left-2 text-9xl font-heading text-brand-100 opacity-50 select-none pointer-events-none">“</div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-1 stars mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-graphite-700 leading-relaxed italic font-body min-h-[100px]">"{t.quote}"</p>
                </div>
                
                <div className="border-t border-brand-200/40 pt-4 mt-6 flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-heading font-bold text-lg shrink-0">
                    {(t.customerName || '?').charAt(0)}
                  </div>
                  <div>
                    <span className="font-heading font-bold text-sm text-ink-900 block">{t.customerName}</span>
                    <span className="text-[10px] text-graphite-400 flex items-center gap-1 font-body mt-0.5">
                      {t.location} <span className="w-1 h-1 rounded-full bg-graphite-200" /> {t.isVerified !== false && <span className="text-eco-500 font-semibold flex items-center gap-0.5"><Check className="w-3 h-3" /> Verified</span>}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Next arrow */}
          <button
            onClick={() => slideCarousel('next')}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-sky-50/90 backdrop-blur-sm border border-brand-200/40 shadow-md flex items-center justify-center text-ink-900 hover:bg-brand-600 hover:text-white transition-all duration-200"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-8 md:w-24 bg-gradient-to-r from-sky-50 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 md:w-24 bg-gradient-to-l from-sky-50 to-transparent pointer-events-none" />
        </div>
      </section>

      <CertificationsSection />

      <FadeUp><CustomerVideos /></FadeUp>

      <FadeUp><section id="locations" className="bg-sky-100/20 border-t border-brand-200/30 py-16 md:py-24 px-4 md:px-8 relative overflow-hidden">
        {/* Wipe reveal background element */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.5, ease: EASE_LUXURY }}
          className="absolute top-0 right-0 w-3/4 h-full bg-sky-100 origin-right z-0"
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeUp className="max-w-2xl mb-12 md:mb-16">
            <span className="eyebrow">Experience Before Buying</span>
            <h2 className="text-3xl md:text-5xl font-heading font-medium text-ink-900 mt-1">Our Showrooms and Manufacturer Outlets</h2>
            <p className="text-graphite-500 text-sm md:text-base mt-4 font-body leading-relaxed max-w-lg">Walk in, test firmness profiles, lay down, and speak with Suresh's trained team directly at the locations below.</p>
          </FadeUp>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" stagger={0.15}>
            {(showrooms.length > 0 ? showrooms : []).map((loc: any, idx: number) => (
              <motion.div 
                key={idx} 
                variants={staggerItem}
                whileHover={{ y: -8, boxShadow: '0 20px 40px -15px rgba(21, 104, 163, 0.15)' }}
                transition={{ duration: 0.4, ease: EASE_LUXURY }}
                className="bg-sky-50 rounded-3xl p-6 sm:p-8 border border-brand-200/50 shadow-sm flex flex-col relative group"
              >
                {/* Sapphire keyline top border on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-t-3xl" />
                
                <div className="mb-4">
                  <span className="badge-luxury">{loc.address?.city || loc.name} Store</span>
                </div>
                <p className="text-xs sm:text-sm text-graphite-700 leading-relaxed font-body mb-6 flex-grow">{loc.address?.fullAddress || loc.address?.street || ''}</p>
                
                <div className="text-[10px] sm:text-xs space-y-2 pt-4 border-t border-brand-200/30 font-body">
                  <div className="text-graphite-500"><strong className="text-ink-900 font-bold">Outlets hours:</strong> {loc.hours?.note || `${loc.hours?.monday || '10:00 AM - 9:00 PM'} Daily`}</div>
                  <div className="text-ink-900"><strong className="text-graphite-500 font-medium">Contact:</strong> {(loc.contact?.phoneNumbers || []).join(', ')}</div>
                </div>
                
                <div className="mt-6 pt-5 border-t border-brand-200/30">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={buildWhatsAppUrl(`Hello, I would like to visit the RelaxPro ${loc.address?.city || loc.name} Experience Showroom. Can you please guide me on directions?`)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary w-full flex items-center justify-center gap-2 py-3.5 px-4 text-[10px] sm:text-xs font-accent font-bold uppercase tracking-widest rounded-xl shadow-md"
                  >
                    Book Visit + Map Route
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section></FadeUp>

      <QuickConnectBar />

      <FadeUp><section className="bg-secondary border-t border-brand-200/30">
        <SleepFAQs />
      </section></FadeUp>

      <FadeUp><section className="py-12 md:py-16 bg-sky-100/20 px-4">
        <ShowroomBookingForm />
      </section></FadeUp>

      <FadeUp><section className="py-12 md:py-16 bg-secondary border-t border-brand-200/30 px-4">
        <ConsultationForm />
      </section></FadeUp>

      <TrustBadges />

      <FoundersPodcast />
    </PageShell>
  );
}
