import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Shield, RefreshCcw, Truck,
  Facebook, Instagram, Youtube,
  Heart, Award, MessageSquare, CheckCircle,
  Clock, ExternalLink,
} from 'lucide-react';
import { getSiteSettings } from '../../lib/queries';
import RelaxProLogo from '../ui/RelaxProLogo';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const contactInfo = settings?.contactInfo || {};

  /* ─── Data ─────────────────────────────────────── */

  const trustItems = [
    { icon: Shield, text: '100% Natural Latex' },
    { icon: Award, text: 'GOLS Certified' },
    { icon: CheckCircle, text: 'OEKO-TEX Certified' },
    { icon: RefreshCcw, text: 'Factory Direct' },
    { icon: Truck, text: 'Free Delivery' },
    { icon: Heart, text: 'Handmade in India' },
  ];

  const certifications = [
    { label: 'GOLS', sub: 'Certified Organic' },
    { label: 'OEKO-TEX', sub: 'Standard 100' },
    { label: 'ISO', sub: '9001:2015' },
  ];

  const companyLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Why Latex', path: '/science' },
    { label: 'Sleep Science', path: '/science' },
    { label: 'Warranty', path: '/contact' },
  ];

  const productLinks = [
    { label: 'Our Models', path: '/catalog' },
    { label: 'Custom Mattress', path: '/builder' },
    { label: 'Luxury Collection', path: '/catalog' },
    { label: 'Accessories', path: '/accessories' },
  ];

  const supportLinks = [
    { label: 'FAQs', path: '/#faq' },
    { label: 'Care Guide', path: '/contact' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Showrooms', path: '/locations' },
  ];

  const followLinks = [
    { label: 'Instagram', href: settings?.contactInfo?.instagramUrl || 'https://www.instagram.com/relaxpro__mattresses/?hl=en', icon: Instagram },
    { label: 'Facebook', href: settings?.contactInfo?.facebookUrl || 'https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/', icon: Facebook },
    { label: 'YouTube', href: settings?.contactInfo?.youtubeUrl || 'https://www.youtube.com/@sureshmattressmanufacturer3784', icon: Youtube },
    { label: 'WhatsApp', href: `https://wa.me/${contactInfo.whatsappNumber || '918686624494'}`, icon: MessageSquare },
  ];

  const showrooms = [
    { city: 'Hyderabad', address: 'Jeedimetla Industrial Area, Phase 3' },
    { city: 'Rajahmundry', address: 'Danavaipeta Mall Road' },
    { city: 'Bangalore', address: 'Indiranagar, 100 Feet Road' },
  ];

  const businessHours = settings?.contactInfo?.businessHours || 'Mon–Sat: 9 AM – 7 PM';

  /* ─── Animation Variants ────────────────────────── */

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.12 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  const fadeUpStaggered = (delay: number) => ({
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
  });

  const floatLogo = {
    y: [0, -3, 0],
    transition: { duration: 5, ease: 'easeInOut', repeat: Infinity },
  };

  return (
    <footer className="relative overflow-hidden w-full bg-gradient-to-b from-[#061A24] via-[#0A2530] to-[#102F3B] min-h-[880px] lg:min-h-[1020px]">
      {/* ─── Botanical leaf texture overlay ─── */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M80 100 C90 85 105 80 110 90 C115 100 105 115 90 115 C75 115 70 105 80 100Z' fill='rgba(111,174,224,0.06)'/%3E%3Cpath d='M140 140 C145 130 155 125 158 132 C161 139 153 148 143 148 C133 148 132 142 140 140Z' fill='rgba(111,174,224,0.04)' transform='rotate(45 145 140)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.6,
        }}
        aria-hidden="true"
      />

      {/* ─── Subtle radial glow behind logo — slowly drifts ─── */}
      <motion.div
        className="absolute top-[10%] left-[8%] w-[600px] h-[400px] rounded-full pointer-events-none select-none z-[1]"
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -10, 15, 0],
          opacity: [0.6, 0.9, 0.5, 0.6],
        }}
        transition={{
          duration: 12,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        style={{
          background: 'radial-gradient(ellipse 50% 50% at center, rgba(10,94,255,0.12) 0%, rgba(10,94,255,0.04) 30%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-[5%] right-[15%] w-[350px] h-[350px] rounded-full pointer-events-none select-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at center, rgba(58,143,210,0.08) 0%, transparent 55%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      {/* ─── Ambient glow bottom right ─── */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full pointer-events-none select-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at center, rgba(10,94,255,0.06) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* ─── Main Content ─── */}
      <div className="relative z-10 w-full min-h-[880px] lg:min-h-[1020px] flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-14 pt-20 md:pt-28 lg:pt-32 pb-6 md:pb-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-14 md:gap-16 lg:gap-20"
          >
            {/* ═══════ BRAND SECTION — Logo + Tagline + Trust Pills ═══════ */}
            <motion.div variants={fadeUp} className="flex flex-col items-start w-full">
              {/* Large Logo with soft glow */}
              <motion.div
                animate={floatLogo}
                className="relative inline-block"
              >
                <RelaxProLogo variant="compact" className="!items-start brightness-[1.2] [&_img]:h-16 md:[&_img]:h-20 lg:[&_img]:h-28" />
              </motion.div>

              {/* Tagline */}
              <motion.p
                variants={fadeUpStaggered(0.15)}
                className="mt-6 text-white/40 text-sm md:text-base font-body font-light max-w-xl leading-relaxed tracking-wide"
              >
                Pure Natural Latex Mattresses<span className="text-brand-400/60 mx-2">•</span>
                Crafted for Better Sleep
              </motion.p>

              {/* Trust Pills — horizontal row */}
              <motion.div
                variants={fadeUpStaggered(0.25)}
                className="flex flex-wrap gap-3 mt-8"
              >
                {trustItems.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="footer-trust-pill group"
                  >
                    <item.icon className="w-3.5 h-3.5 text-brand-400/70 group-hover:text-brand-300 transition-colors duration-300 shrink-0" />
                    <span className="text-[11px] font-accent font-medium tracking-wide text-white/50 group-hover:text-white/80 transition-colors duration-300">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* ═══════ NAVIGATION — 4 Columns ═══════ */}
            <motion.div
              variants={fadeUpStaggered(0.35)}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-10"
            >
              {/* Company */}
              <div>
                <h4 className="font-heading font-bold text-white/80 text-[11px] uppercase tracking-[0.2em] mb-6">
                  <span className="inline-block w-5 h-px bg-brand-500/60 align-middle mr-2.5" />
                  Company
                </h4>
                <ul className="space-y-3.5">
                  {companyLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="footer-nav-link text-sm text-white/40 inline-block cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-heading font-bold text-white/80 text-[11px] uppercase tracking-[0.2em] mb-6">
                  <span className="inline-block w-5 h-px bg-brand-500/60 align-middle mr-2.5" />
                  Products
                </h4>
                <ul className="space-y-3.5">
                  {productLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="footer-nav-link text-sm text-white/40 inline-block cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-heading font-bold text-white/80 text-[11px] uppercase tracking-[0.2em] mb-6">
                  <span className="inline-block w-5 h-px bg-brand-500/60 align-middle mr-2.5" />
                  Support
                </h4>
                <ul className="space-y-3.5">
                  {supportLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="footer-nav-link text-sm text-white/40 inline-block cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Follow */}
              <div>
                <h4 className="font-heading font-bold text-white/80 text-[11px] uppercase tracking-[0.2em] mb-6">
                  <span className="inline-block w-5 h-px bg-brand-500/60 align-middle mr-2.5" />
                  Follow
                </h4>
                <ul className="space-y-3.5">
                  {followLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-nav-link text-sm text-white/40 inline-flex items-center gap-2 cursor-pointer"
                      >
                        <link.icon className="w-3.5 h-3.5 text-brand-400/60 shrink-0" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* ═══════ CERTIFICATIONS + CONTACT — Side by Side ═══════ */}
            <motion.div
              variants={fadeUpStaggered(0.45)}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
            >
              {/* Certification Row */}
              <div className="footer-glass p-6 md:p-7">
                <h4 className="font-heading font-bold text-white/70 text-[10px] uppercase tracking-[0.25em] mb-5">
                  Certified Natural Materials
                </h4>
                <div className="flex flex-wrap gap-4">
                  {certifications.map((cert) => (
                    <div
                      key={cert.label}
                      className="footer-cert-badge group"
                    >
                      <span className="font-accent font-bold text-xs tracking-wider text-white/40 group-hover:text-white transition-colors duration-300">
                        {cert.label}
                      </span>
                      <span className="text-[8px] text-white/20 group-hover:text-white/40 font-body transition-colors duration-300">
                        {cert.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Card */}
              <div className="footer-glass p-6 md:p-7">
                <h4 className="font-heading font-bold text-white/70 text-[10px] uppercase tracking-[0.25em] mb-5">
                  Visit Our Showroom
                </h4>
                <div className="flex flex-col gap-3.5">
                  {showrooms.map((loc) => (
                    <div key={loc.city} className="flex items-start gap-3">
                      <MapPin className="w-3.5 h-3.5 text-brand-400/60 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/60 text-[12px] font-medium font-accent">{loc.city}</span>
                        <p className="text-white/35 text-[11px] font-body leading-relaxed">{loc.address}</p>
                      </div>
                    </div>
                  ))}
                  <div className="w-full h-px bg-gradient-to-r from-white/5 via-white/[0.07] to-transparent my-1" />
                  <div className="flex items-center gap-3">
                    <Phone className="w-3.5 h-3.5 text-brand-400/60 shrink-0" />
                    <a href={`tel:+${contactInfo.mainPhone || '918686624494'}`} className="text-white/40 hover:text-white transition-colors text-[12px] font-body">
                      +91 {contactInfo.mainPhone?.replace(/^(\d{5})(\d{5})$/, '$1 $2') || '86866 24494'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-3.5 h-3.5 text-brand-400/60 shrink-0" />
                    <a href={`mailto:${contactInfo.email || 'relaxpro2022@gmail.com'}`} className="text-white/40 hover:text-white transition-colors text-[12px] font-body">
                      {contactInfo.email || 'relaxpro2022@gmail.com'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-3.5 h-3.5 text-brand-400/60 shrink-0" />
                    <span className="text-white/40 text-[12px] font-body">{businessHours}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-3.5 h-3.5 text-brand-400/60 shrink-0" />
                    <a
                      href={`https://wa.me/${contactInfo.whatsappNumber || '918686624494'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-brand-300 transition-colors text-[12px] font-body inline-flex items-center gap-1.5"
                    >
                      WhatsApp Us
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ═══════ SOCIAL ICONS ═══════ */}
            <motion.div
              variants={fadeUpStaggered(0.55)}
              className="flex items-center gap-4"
            >
              {followLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon group"
                  title={link.label}
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ═══════ BOTTOM STRIP ═══════ */}
        <div className="w-full border-t border-white/[0.06] relative">
          {/* Subtle glow on the divider */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-brand-400/15 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-14 py-6 md:py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-white/20 text-[11px] font-body font-light">
                <span>© {new Date().getFullYear()} RelaxPro Mattresses</span>
                <span className="hidden md:inline text-white/10 mx-1">|</span>
                <span className="hidden md:inline font-heading text-white/15 italic text-[10px]">
                  Designed with Nature <span className="not-italic">•</span> Built for Better Sleep
                </span>
              </div>
              <div className="flex items-center gap-5">
                <Link to="/contact" className="text-[10px] text-white/25 hover:text-white/60 transition-colors font-accent tracking-wide uppercase cursor-pointer">
                  Privacy Policy
                </Link>
                <Link to="/contact" className="text-[10px] text-white/25 hover:text-white/60 transition-colors font-accent tracking-wide uppercase cursor-pointer">
                  Terms
                </Link>
                <Link to="/contact" className="text-[10px] text-white/25 hover:text-white/60 transition-colors font-accent tracking-wide uppercase cursor-pointer">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
