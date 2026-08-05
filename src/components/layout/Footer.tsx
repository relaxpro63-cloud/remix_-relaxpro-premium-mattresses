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
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
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

  return (
    <footer className="relative overflow-hidden w-full bg-gradient-to-b from-[#05080D] via-[#0B1B33] to-[#0A3E72] min-h-[880px] lg:min-h-[1020px]">
      {/* ─── Botanical leaf texture overlay ─── */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M80 100 C90 85 105 80 110 90 C115 100 105 115 90 115 C75 115 70 105 80 100Z' fill='rgba(61,149,214,0.10)'/%3E%3Cpath d='M140 140 C145 130 155 125 158 132 C161 139 153 148 143 148 C133 148 132 142 140 140Z' fill='rgba(61,149,214,0.07)' transform='rotate(45 145 140)'/%3E%3C/svg%3E\")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.75,
        }}
        aria-hidden="true"
      />

      {/* ─── Blue ambient glow ─── */}
      <motion.div
        className="absolute top-[8%] left-[5%] w-[700px] h-[500px] rounded-full pointer-events-none select-none z-[1]"
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -15, 10, 0],
          opacity: [0.5, 0.8, 0.4, 0.5],
        }}
        transition={{
          duration: 14,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
        style={{
          background: 'radial-gradient(ellipse 50% 50% at center, rgba(61,149,214,0.22) 0%, rgba(61,149,214,0.08) 35%, transparent 65%)',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-[3%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none select-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at center, rgba(61,149,214,0.12) 0%, transparent 55%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      {/* ─── Ambient glow bottom right ─── */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full pointer-events-none select-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at center, rgba(61,149,214,0.10) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* ─── Main Content ─── */}
      <div className="relative z-10 w-full min-h-[880px] lg:min-h-[1020px] flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-14 pt-16 md:pt-24 lg:pt-28 pb-6 md:pb-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-12 md:gap-14 lg:gap-16"
          >
            {/* ═══════ BRAND SECTION — Large Logo + Tagline + Trust Pills ═══════ */}
            <motion.div variants={fadeUp} className="flex flex-col items-start w-full">
              {/* Large White Logo — clearly visible on dark background */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="relative inline-block"
              >
                {/* Bold white glow behind logo for maximum contrast */}
                <div className="absolute -inset-12 md:-inset-16 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(61,149,214,0.28)_0%,_rgba(61,149,214,0.12)_50%,_transparent_100%)] blur-3xl pointer-events-none" />
                <div className="absolute -inset-6 rounded-full bg-white/[0.06] blur-xl pointer-events-none" />
                <img
                  src="/relaxpro-logo-white.svg"
                  alt="RelaxPro Premium Mattresses"
                  className="h-20 md:h-24 lg:h-28 w-auto object-contain block relative brightness-110 drop-shadow-[0_0_30px_rgba(117,183,230,0.30)]"
                  width={500}
                  height={128}
                  loading="eager"
                  style={{ imageRendering: 'auto' }}
                />
              </motion.div>

              {/* Tagline with blue dot divider */}
              <motion.p
                variants={fadeUpStaggered(0.1)}
                className="mt-5 text-white/50 text-sm md:text-base font-body font-light max-w-xl leading-relaxed tracking-wide"
              >
                Pure Natural Latex Mattresses{' '}
                <span className="text-brand-300/90 mx-2 inline-block">✦</span>{' '}
                Crafted for Better Sleep
              </motion.p>

              {/* Trust Pills — horizontal row with blue accent border */}
              <motion.div
                variants={fadeUpStaggered(0.18)}
                className="flex flex-wrap gap-2.5 mt-6"
              >
                {trustItems.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3, scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-brand-300/50 transition-all duration-300"
                  >
                    <item.icon className="w-3 h-3 text-brand-300/80 group-hover:text-brand-300 transition-colors duration-300 shrink-0" />
                    <span className="text-[11px] font-accent font-medium tracking-wide text-white/45 group-hover:text-white/70 transition-colors duration-300">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* ═══════ NAVIGATION — 4 Columns with blue top border ═══════ */}
            <motion.div
              variants={fadeUpStaggered(0.25)}
              className="relative pt-8 md:pt-10"
            >
              {/* Blue accent divider line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-brand-300/35 via-brand-300/20 to-transparent" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-10 pt-4">
                {/* Company */}
                <div>
                  <h4 className="font-heading font-bold text-white/80 text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
                    <span className="inline-block w-5 h-px bg-brand-400/80" />
                    Company
                  </h4>
                  <ul className="space-y-3">
                    {companyLinks.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.path}
                          className="group inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-brand-300 transition-all duration-300 cursor-pointer"
                        >
                          <span className="w-0 h-px bg-brand-300/80 group-hover:w-3 transition-all duration-300" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Products */}
                <div>
                  <h4 className="font-heading font-bold text-white/80 text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
                    <span className="inline-block w-5 h-px bg-brand-400/80" />
                    Products
                  </h4>
                  <ul className="space-y-3">
                    {productLinks.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.path}
                          className="group inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-brand-300 transition-all duration-300 cursor-pointer"
                        >
                          <span className="w-0 h-px bg-brand-300/80 group-hover:w-3 transition-all duration-300" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="font-heading font-bold text-white/80 text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
                    <span className="inline-block w-5 h-px bg-brand-400/80" />
                    Support
                  </h4>
                  <ul className="space-y-3">
                    {supportLinks.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.path}
                          className="group inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-brand-300 transition-all duration-300 cursor-pointer"
                        >
                          <span className="w-0 h-px bg-brand-300/80 group-hover:w-3 transition-all duration-300" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Follow */}
                <div>
                  <h4 className="font-heading font-bold text-white/80 text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
                    <span className="inline-block w-5 h-px bg-brand-400/80" />
                    Follow
                  </h4>
                  <ul className="space-y-3">
                    {followLinks.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2.5 text-sm text-white/35 hover:text-brand-300/80 transition-all duration-300"
                        >
                          <span className="w-6 h-6 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center group-hover:border-brand-300/30 group-hover:bg-brand-300/10 transition-all duration-300">
                            <link.icon className="w-3 h-3 text-brand-300/50 group-hover:text-brand-300 transition-colors" />
                          </span>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* ═══════ CERTIFICATIONS + CONTACT — Premium Glass Cards ═══════ */}
            <motion.div
              variants={fadeUpStaggered(0.35)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            >
              {/* Certification Row — Premium Card */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="relative group rounded-2xl bg-white/[0.04] border border-white/10 hover:border-brand-300/40 p-6 md:p-7 transition-all duration-500 overflow-hidden"
              >
                {/* Subtle hover glow */}
                <div className="absolute -inset-20 bg-brand-300/[0.03] opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none" />
                
                <h4 className="font-heading font-bold text-brand-300/90 text-[10px] uppercase tracking-[0.25em] mb-5 relative">
                  Certified Natural Materials
                </h4>
                <div className="flex flex-wrap gap-3 relative">
                  {certifications.map((cert) => (
                    <div
                      key={cert.label}
                      className="group/cert flex flex-col items-center gap-1 px-5 py-3 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-brand-300/[0.10] hover:border-brand-300/45 transition-all duration-300 min-w-[90px]"
                    >
                      <span className="font-accent font-bold text-sm tracking-wider text-white/40 group-hover/cert:text-brand-300 transition-colors duration-300">
                        {cert.label}
                      </span>
                      <span className="text-[8px] text-white/20 group-hover/cert:text-white/40 font-body transition-colors duration-300 text-center leading-tight">
                        {cert.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Card — Premium Glass Card */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="relative group rounded-2xl bg-white/[0.04] border border-white/10 hover:border-brand-300/40 p-6 md:p-7 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -inset-20 bg-brand-300/[0.03] opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none" />

                <h4 className="font-heading font-bold text-brand-300/90 text-[10px] uppercase tracking-[0.25em] mb-5 relative">
                  Visit Our Showroom
                </h4>
                <div className="flex flex-col gap-3 relative">
                  {showrooms.map((loc) => (
                    <div key={loc.city} className="flex items-start gap-3 group/loc">
                      <div className="w-6 h-6 rounded-full bg-brand-300/20 border border-brand-300/40 flex items-center justify-center shrink-0 mt-0.5 group-hover/loc:bg-brand-300/20 transition-colors">
                        <MapPin className="w-3 h-3 text-brand-300/80" />
                      </div>
                      <div>
                        <span className="text-white/60 text-[12px] font-medium font-accent">{loc.city}</span>
                        <p className="text-white/30 text-[11px] font-body leading-relaxed">{loc.address}</p>
                      </div>
                    </div>
                  ))}
                  <div className="w-full h-px bg-gradient-to-r from-brand-300/15 via-white/[0.05] to-transparent my-1" />
                  <div className="flex items-center gap-3 group/contact">
                    <Phone className="w-3.5 h-3.5 text-brand-300/75 shrink-0" />
                    <a href={`tel:+${contactInfo.mainPhone || '918686624494'}`} className="text-white/35 hover:text-brand-300 transition-colors text-[12px] font-body">
                      +91 {contactInfo.mainPhone?.replace(/^(\d{5})(\d{5})$/, '$1 $2') || '86866 24494'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 group/contact">
                    <Mail className="w-3.5 h-3.5 text-brand-300/75 shrink-0" />
                    <a href={`mailto:${contactInfo.email || 'relaxpro2022@gmail.com'}`} className="text-white/35 hover:text-brand-300 transition-colors text-[12px] font-body">
                      {contactInfo.email || 'relaxpro2022@gmail.com'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-3.5 h-3.5 text-brand-300/75 shrink-0" />
                    <span className="text-white/35 text-[12px] font-body">{businessHours}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* ═══════ WHATSAPP CTA + SOCIAL ICONS ═══════ */}
            <motion.div
              variants={fadeUpStaggered(0.45)}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              {/* WhatsApp CTA Button */}
              <a
                href={`https://wa.me/${contactInfo.whatsappNumber || '918686624494'}?text=${encodeURIComponent('Hello Suresh, I would like to know more about RelaxPro mattresses. Can you help?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-400/30 to-brand-300/10 border border-brand-300/45 hover:border-brand-300/50 hover:from-brand-400/40 hover:to-brand-300/20 transition-all duration-300 shadow-lg shadow-brand-400/10"
              >
                <div className="w-10 h-10 rounded-full bg-brand-300/30 flex items-center justify-center group-hover:bg-brand-300/40 transition-colors">
                  <MessageSquare className="w-5 h-5 text-brand-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-brand-300 text-[10px] font-accent font-bold uppercase tracking-widest">WhatsApp Us</span>
                  <span className="text-white/40 text-[13px] font-body group-hover:text-white/60 transition-colors">Chat with our sleep expert</span>
                </div>
                <ExternalLink className="w-4 h-4 text-brand-300/80 group-hover:text-brand-300 group-hover:translate-x-0.5 transition-all ml-1 shrink-0" />
              </a>

              {/* Social icons row */}
              <div className="flex items-center gap-3">
                {followLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center hover:border-brand-300/50 hover:bg-brand-300/20 hover:scale-110 transition-all duration-300"
                    title={link.label}
                  >
                    <link.icon className="w-4 h-4 text-white/50 group-hover:text-brand-300 transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ═══════ BOTTOM STRIP — Removed per user request ═══════ */}
      </div>
    </footer>
  );
}
