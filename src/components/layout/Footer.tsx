import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, RefreshCcw, Truck, Facebook, Instagram, Youtube, ChevronDown, ArrowRight, Heart, Award, MessageSquare, Store, Sparkles, CheckCircle } from 'lucide-react';
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

  // Icon resolver: maps Sanity icon names to lucide components
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
        { icon: Truck, text: 'Free Delivery Pan India' },
        { icon: RefreshCcw, text: 'Direct Factory Pricing' },
        { icon: Heart, text: 'Handmade in India' },
      ]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const colVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <footer className="footer-luxury text-white/70 relative overflow-hidden">
      <DecorativeBotanicals density="light" className="opacity-30" />
      {/* Soft glow behind logo */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-600/6 rounded-full blur-[150px] pointer-events-none" />
      {/* Bottom-right glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-700/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-28 pb-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-10 lg:gap-14"
        >
          {/* ── Column 1: Brand + Trust ── */}
          <motion.div variants={colVariants} className="lg:col-span-4 space-y-7">
            <RelaxProLogo variant="footer" className="!items-start" />
            <p className="text-white/40 text-sm leading-relaxed max-w-sm font-body">
              {settings?.footer?.description ||
                "Crafting India's finest natural latex mattresses designed for healthier sleep and lifelong comfort."}
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="footer-trust-badge">
                  <badge.icon className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="text-[11px] font-accent font-medium tracking-wide">{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Facebook, href: settings?.contactInfo?.facebookUrl || 'https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/', title: 'Facebook' },
                { icon: Instagram, href: settings?.contactInfo?.instagramUrl || 'https://www.instagram.com/relaxpro__mattresses/?hl=en', title: 'Instagram' },
                { icon: Youtube, href: settings?.contactInfo?.youtubeUrl || 'https://www.youtube.com/@sureshmattressmanufacturer3784', title: 'YouTube' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="footer-social" title={s.title}>
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Column 2: Shop ── */}
          <motion.div variants={colVariants} className="lg:col-span-2">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-[0.18em] mb-6">Shop</h4>
            <ul className="space-y-3.5">
              {shopLinks.map((link: any) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link text-sm text-white/50 inline-block cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Column 3: Support ── */}
          <motion.div variants={colVariants} className="lg:col-span-2">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-[0.18em] mb-6">Support</h4>
            <ul className="space-y-3.5">
              {supportLinks.map((link: any) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link text-sm text-white/50 inline-block cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-white/5">
              <Link to="/locations" className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors font-accent font-semibold group">
                <MapPin className="w-4 h-4" />
                <span>Find Our Showrooms</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* ── Column 4: Contact + Newsletter ── */}
          <motion.div variants={colVariants} className="lg:col-span-4 space-y-8">
            {/* Contact card */}
            <div className="footer-glass-card p-6 space-y-4">
              <h4 className="font-heading font-bold text-white/90 text-xs uppercase tracking-[0.18em] flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-brand-400" />
                Contact
              </h4>
              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-white/50">{contactInfo.factoryAddress || 'Jeedimetla Ind. Area Phase 3, Hyderabad, Telangana 500055'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                  <a href={`tel:+${contactInfo.mainPhone || '918686624494'}`} className="text-white/50 hover:text-white transition-colors">
                    +91 {contactInfo.mainPhone?.replace(/^(\d{5})(\d{5})$/, '$1 $2') || '86866 24494'}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                  <a href={`mailto:${contactInfo.email || 'relaxpro2022@gmail.com'}`} className="text-white/50 hover:text-white transition-colors">
                    {contactInfo.email || 'relaxpro2022@gmail.com'}
                  </a>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-eco-500 shrink-0" />
                    <a
                      href={`https://wa.me/${contactInfo.whatsappNumber || '918686624494'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-eco-500 hover:text-eco-400 transition-colors font-accent font-semibold"
                    >
                      WhatsApp Chat
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                    <Link to="/locations" className="text-white/50 hover:text-white transition-colors font-accent">
                      Google Maps
                    </Link>
                  </div>
                </div>
              </div>
            </div>


          </motion.div>
        </motion.div>

        {/* ── Mobile Accordions ── */}
        <div className="md:hidden space-y-0 border-t border-white/10 mt-10 pt-6">
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

        {/* ── Bottom Bar ── */}
        <hr className="footer-divider my-10" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 text-xs text-white/30 font-body">
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-white/60 transition-colors cursor-pointer">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white/60 transition-colors cursor-pointer">Terms</Link>
            <Link to="/contact" className="hover:text-white/60 transition-colors cursor-pointer">Shipping</Link>
            <Link to="/contact" className="hover:text-white/60 transition-colors cursor-pointer">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
