import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Shield, RefreshCcw, Truck,
  Facebook, Instagram, Youtube, ChevronDown, ArrowRight,
  Heart, Award, MessageSquare, Store, Sparkles, CheckCircle,
  Clock,
} from 'lucide-react';
import { getSiteSettings, getNavigation } from '../../lib/queries';
import RelaxProLogo from '../ui/RelaxProLogo';
import DecorativeBotanicals from '../home/DecorativeBotanicals';

export default function Footer() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [nav, setNav] = useState<any>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(() => {});
    getNavigation().then(setNav).catch(() => {});
  }, []);

  const toggleAccordion = (section: string) =>
    setOpenAccordion(openAccordion === section ? null : section);

  const shopLinks = (nav?.footerMenu?.[0]?.links || [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/catalog' },
    { label: 'Custom Build', path: '/builder' },
    { label: 'Compare', path: '/compare' },
    { label: 'Accessories', path: '/accessories' },
  ]).map((item: any) => ({ path: item.path || item.href || '/', label: item.label }));

  const supportLinks = (nav?.footerMenu?.[1]?.links || [
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQs', path: '/#faq' },
    { label: 'Warranty', path: '/contact' },
    { label: 'Shipping & Returns', path: '/contact' },
    { label: 'Sleep Guide', path: '/science' },
  ]).map((item: any) => ({ path: item.path || item.href || '/', label: item.label }));

  const contactInfo = settings?.contactInfo || {};

  // Icon resolver
  const footerIconMap: Record<string, any> = {
    Shield, Award, Truck, Heart, RefreshCcw, MapPin, Sparkles, CheckCircle, Mail, Phone, MessageSquare,
  };

  const trustBadges = (settings?.footer?.trustBadges && settings.footer.trustBadges.length > 0
    ? settings.footer.trustBadges.map((b: any) => ({
        icon: footerIconMap[b.icon] || Shield,
        text: b.text,
      }))
    : [
        { icon: Shield, text: '100% Natural Latex' },
        { icon: Award, text: '10-Year Warranty' },
        { icon: Truck, text: 'Free Delivery Across India' },
        { icon: RefreshCcw, text: 'Factory Direct Pricing' },
        { icon: Heart, text: 'Handmade in India' },
        { icon: CheckCircle, text: 'OEKO-TEX Certified' },
      ]
  );

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Our Models', path: '/catalog' },
    { label: 'Customize', path: '/builder' },
    { label: 'Sleep Science', path: '/science' },
    { label: 'Why Latex', path: '/science' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Warranty', path: '/contact' },
    { label: 'Blogs', path: '/science' },
    { label: 'FAQs', path: '/#faq' },
    { label: 'Care Guide', path: '/contact' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  const socials = [
    {
      icon: Facebook,
      href: settings?.contactInfo?.facebookUrl || 'https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/',
      title: 'Facebook',
    },
    {
      icon: Instagram,
      href: settings?.contactInfo?.instagramUrl || 'https://www.instagram.com/relaxpro__mattresses/?hl=en',
      title: 'Instagram',
    },
    {
      icon: Youtube,
      href: settings?.contactInfo?.youtubeUrl || 'https://www.youtube.com/@sureshmattressmanufacturer3784',
      title: 'YouTube',
    },
    {
      icon: MessageSquare,
      href: `https://wa.me/${contactInfo.whatsappNumber || '918686624494'}`,
      title: 'WhatsApp',
    },
  ];

  const businessHours = settings?.contactInfo?.businessHours || 'Mon–Sat: 9 AM – 7 PM';

  return (
    <footer className="footer-luxury-new relative overflow-hidden min-h-[700px] lg:min-h-[820px] w-full">
      {/* ─── Hidden Logo Watermark (inside curve) ─── */}
      <div className="footer-hidden-logo pointer-events-none select-none" aria-hidden="true">
        <div className="w-full h-full flex items-center justify-center opacity-[0.06] mix-blend-soft-light">
          <img
            src="/images/relaxpro-logo.png"
            alt=""
            className="w-[90%] max-w-[900px] h-auto object-contain blur-[2px]"
            style={{ filter: 'blur(2px) brightness(1.3)' }}
          />
        </div>
      </div>

      {/* ─── Luxury Bedroom Image (right side dark overlay) ─── */}
      <div
        className="absolute right-0 top-0 w-full lg:w-2/5 h-full pointer-events-none overflow-hidden select-none z-[1]"
        aria-hidden="true"
      >
        <img
          src="/images/hero-bedroom.png"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{
            opacity: 0.12,
            filter: 'blur(6px) brightness(0.5) saturate(0.7)',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.5) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ─── Organic Curved SVG Wave ─── */}
      <div className="absolute top-0 left-0 w-full h-[280px] md:h-[380px] lg:h-[440px] pointer-events-none select-none z-[2]" aria-hidden="true">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 440"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="curveLight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0A5EFF" stopOpacity="0.15" />
              <stop offset="40%" stopColor="#3A8FD2" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#6FAEE0" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="curveGlow" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#0A5EFF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0A5EFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Upper light region */}
          <path
            d="M0,0 L1440,0 L1440,40 C1080,120 720,60 360,120 C180,140 60,130 0,100 Z"
            fill="url(#curveLight)"
            opacity="0.6"
          />
          {/* Main organic wave - flowing asymmetrical curve */}
          <path
            d="M0,60 C240,180 480,40 720,120 C960,200 1200,60 1440,140 L1440,0 L0,0 Z"
            fill="url(#curveLight)"
            opacity="0.4"
          />
          {/* Deep wave overlay for depth */}
          <path
            d="M0,100 C300,220 600,80 900,160 C1100,200 1300,100 1440,180 L1440,0 L0,0 Z"
            fill="url(#curveLight)"
            opacity="0.25"
          />
          {/* Soft glow streak */}
          <path
            d="M0,80 C400,200 800,60 1200,140 C1320,160 1400,120 1440,100 L1440,0 L0,0 Z"
            fill="url(#curveGlow)"
            opacity="0.5"
          />
          {/* Light sweep animation across the curve */}
          <path
            className="footer-curve-sweep"
            d="M0,60 C240,180 480,40 720,120 C960,200 1200,60 1440,140 L1440,0 L0,0 Z"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="60"
            strokeLinecap="round"
            opacity="0"
          />
        </svg>
      </div>

      {/* ─── Floating Blue Light Particles ─── */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="footer-particle pointer-events-none select-none"
          style={{
            left: `${15 + (i * 11) % 85}%`,
            top: `${10 + (i * 7) % 60}%`,
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            animationDelay: `${i * 1.8}s`,
            animationDuration: `${4 + (i % 3) * 2}s`,
            opacity: 0.5 + (i % 3) * 0.15,
          }}
          aria-hidden="true"
        />
      ))}


      {/* ─── Decorative Botanicals ─── */}
      <DecorativeBotanicals density="light" className="opacity-25 z-[1]" />

      {/* ─── Ambient Glows ─── */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-[180px] pointer-events-none z-[1]" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-600/5 rounded-full blur-[140px] pointer-events-none z-[1]" aria-hidden="true" />
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-brand-400/4 rounded-full blur-[100px] pointer-events-none z-[1]" aria-hidden="true" />

      {/* ─── Noise / Vignette Overlay ─── */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(6,19,33,0.6) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ─── Main Content ─── */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-48 md:pt-56 lg:pt-64 pb-10 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col lg:flex-row gap-14 lg:gap-20"
          >
            {/* ═══════ LEFT COLUMN (65%) ═══════ */}
            <motion.div variants={fadeUp} className="w-full lg:w-[65%] space-y-10">
              {/* Premium Logo — same as header/navbar */}
              <RelaxProLogo variant="compact" className="!items-start brightness-[1.1]" />

              {/* Brand Description */}
              <p className="max-w-[500px] text-white/40 text-sm md:text-base leading-[1.9] font-body">
                {settings?.footer?.description ||
                  'Leading Natural Latex Mattress Manufacturer. ' +
                  'Crafting handcrafted luxury sleep experiences using ' +
                  '100% natural latex sourced from Kerala. ' +
                  'Designed for comfort. Built for decades.'}
              </p>

              {/* Trust Feature Cards — Glassmorphism 2-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {trustBadges.map((badge, idx) => (
                  <div key={idx} className="footer-glass-card-v2 group cursor-default">
                    <badge.icon className="w-4 h-4 text-brand-400 shrink-0 group-hover:text-brand-300 transition-colors duration-300" />
                    <span className="text-[12px] font-accent font-medium tracking-wide text-white/60 group-hover:text-white/80 transition-colors duration-300">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3.5 pt-2">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social group"
                    title={s.title}
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* ═══════ RIGHT COLUMN (35%) ═══════ */}
            <motion.div variants={fadeUp} className="w-full lg:w-[35%] space-y-10 lg:pt-2">
              {/* SHOP Navigation */}
              <div>
                <h4 className="font-heading font-bold text-white/90 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
                  <span className="w-5 h-[2px] bg-brand-500 rounded-full" />
                  SHOP
                  <span className="w-5 h-[2px] bg-brand-500 rounded-full" />
                </h4>
                <ul className="space-y-3">
                  {navItems.map((item) => (
                    <li key={item.path + item.label}>
                      <Link
                        to={item.path}
                        className="footer-link-nav text-sm text-white/45 inline-block cursor-pointer"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-white/90 text-xs uppercase tracking-[0.2em] mb-5 flex items-center gap-2.5">
                  <span className="w-5 h-[2px] bg-brand-500 rounded-full" />
                  CONTACT
                  <span className="w-5 h-[2px] bg-brand-500 rounded-full" />
                </h4>
                <div className="space-y-4">
                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <a
                      href={`tel:+${contactInfo.mainPhone || '918686624494'}`}
                      className="text-white/50 hover:text-white transition-colors text-sm font-body"
                    >
                      +91 {contactInfo.mainPhone?.replace(/^(\d{5})(\d{5})$/, '$1 $2') || '86866 24494'}
                    </a>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-white/5 via-white/[0.08] to-transparent" />

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <a
                      href={`mailto:${contactInfo.email || 'relaxpro2022@gmail.com'}`}
                      className="text-white/50 hover:text-white transition-colors text-sm font-body"
                    >
                      {contactInfo.email || 'relaxpro2022@gmail.com'}
                    </a>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-white/5 via-white/[0.08] to-transparent" />

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                    <span className="text-white/50 text-sm font-body leading-relaxed">
                      {contactInfo.factoryAddress || 'Jeedimetla Ind. Area Phase 3, Hyderabad, Telangana 500055'}
                    </span>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-white/5 via-white/[0.08] to-transparent" />

                  {/* Business Hours */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span className="text-white/50 text-sm font-body">{businessHours}</span>
                  </div>
                </div>
              </div>

              {/* CTA Box */}
              <div className="footer-glass-card-v2 p-5 md:p-6 space-y-4 !bg-gradient-to-br from-white/[0.06] to-white/[0.01] !border-brand-500/15">
                <p className="font-heading text-white/80 text-base md:text-lg font-semibold leading-tight">
                  Experience Natural Sleep
                </p>
                <p className="text-white/35 text-xs font-body leading-relaxed">
                  Explore our collection of handcrafted natural latex mattresses — designed for comfort, built for decades.
                </p>
                <Link
                  to="/catalog"
                  className="footer-cta group inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-bold font-accent uppercase tracking-widest px-6 py-3.5 rounded-full transition-all duration-500 shadow-lg shadow-brand-600/20 hover:shadow-brand-500/40"
                >
                  Explore Collection
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* ─── Mobile Accordions ─── */}
          <div className="md:hidden border-t border-white/10 mt-12 pt-6">
            {[
              { key: 'shop', title: 'Shop', items: shopLinks },
              { key: 'support', title: 'Support', items: supportLinks },
            ].map((section) => (
              <div key={section.key} className="border-b border-white/10">
                <button
                  onClick={() => toggleAccordion(section.key)}
                  className="w-full flex items-center justify-between py-4 text-white text-xs font-heading font-bold uppercase tracking-widest cursor-pointer"
                >
                  {section.title}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${openAccordion === section.key ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`footer-accordion-content ${openAccordion === section.key ? 'open' : ''}`}>
                  <ul className="space-y-3 text-sm pb-4">
                    {section.items.map((link: any) => (
                      <li key={link.path}>
                        <Link to={link.path} className="hover:text-white transition-colors cursor-pointer block py-1 text-white/50">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Bottom Bar ─── */}
          <hr className="footer-divider my-10" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-5 text-xs text-white/25 font-body">
            <span>© {new Date().getFullYear()} RelaxPro Premium Mattresses. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link to="/contact" className="hover:text-white/50 transition-colors cursor-pointer">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-white/50 transition-colors cursor-pointer">Terms</Link>
              <Link to="/contact" className="hover:text-white/50 transition-colors cursor-pointer">Shipping</Link>
              <Link to="/contact" className="hover:text-white/50 transition-colors cursor-pointer">Returns</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
