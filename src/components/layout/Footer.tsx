import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Shield, RefreshCcw, Truck,
  Facebook, Instagram, Youtube,
  Heart, Award, MessageSquare, CheckCircle,
  Clock, ExternalLink, Leaf, ShieldCheck, BadgeCheck, Sparkles, Building2, Ruler,
} from 'lucide-react';
import { getSiteSettings, getNavigation, getAllShowrooms } from '../../lib/queries';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [nav, setNav] = useState<any>(null);
  const [showrooms, setShowrooms] = useState<any[] | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(() => {});
    getNavigation().then(setNav).catch(() => {});
    getAllShowrooms().then(setShowrooms).catch(() => {});
  }, []);

  const contactInfo = settings?.contactInfo || {};

  /* ─── Data ─────────────────────────────────────── */

  const fallbackTrustItems = [
    { icon: Shield, text: '100% Natural Latex' },
    { icon: Award, text: 'GOLS Certified' },
    { icon: CheckCircle, text: 'OEKO-TEX Certified' },
    { icon: RefreshCcw, text: 'Factory Direct' },
    { icon: Truck, text: 'Free Delivery' },
    { icon: Heart, text: 'Handmade in India' },
  ];

  // Sanity stores badge icons as lucide name strings — map them to components.
  const iconMap: Record<string, any> = {
    Shield, ShieldCheck, Award, Leaf, Truck, RefreshCcw, CheckCircle,
    Heart, BadgeCheck, Sparkles, Building2, Ruler,
  };

  // Trial/warranty/refund promises are no longer offered — drop such badges.
  const REMOVED_BADGE_TERMS = ['warranty', 'guarantee', 'trial', 'refund', 'return policy', '100-night', '10-year'];

  const cmsTrustItems = (settings?.footer?.trustBadges || [])
    .filter((b: any) => b?.text && !REMOVED_BADGE_TERMS.some(term => b.text.toLowerCase().includes(term)))
    .map((b: any) => ({ icon: iconMap[b.icon] || Shield, text: b.text }));
  const trustItems = cmsTrustItems.length ? cmsTrustItems : fallbackTrustItems;

  const companyLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'About RelaxPro Mattress', path: '/about-relaxpro-mattress' },
    { label: 'Why Latex', path: '/science' },
    { label: 'Sleep Science', path: '/science' },
  ];

  const productLinks = [
    { label: 'Our Models', path: '/catalog' },
    { label: 'Latex Mattress', path: '/latex-mattress' },
    { label: 'Natural Latex Mattress', path: '/natural-latex-mattress' },
    { label: 'HR Foam Mattress', path: '/hr-foam-mattress' },
    { label: 'Rebonded Mattress', path: '/rebonded-mattress' },
    { label: 'Orthopedic Mattress', path: '/orthopedic-mattress' },
    { label: 'Custom Size Mattress', path: '/custom-size-mattress' },
    { label: 'Custom Builder', path: '/builder' },
    { label: 'Accessories', path: '/accessories' },
  ];

  const supportLinks = [
    { label: 'FAQs', path: '/#faq' },
    { label: 'Care Guide', path: '/contact' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Showrooms', path: '/locations' },
  ];

  const fallbackFollowLinks = [
    { label: 'Instagram', href: 'https://www.instagram.com/relaxpro__mattresses/?hl=en', icon: Instagram },
    { label: 'Facebook', href: 'https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/', icon: Facebook },
    { label: 'YouTube', href: 'https://www.youtube.com/@sureshmattressmanufacturer3784', icon: Youtube },
    { label: 'WhatsApp', href: `https://wa.me/${contactInfo.whatsappNumber || '919281424494'}`, icon: MessageSquare },
  ];

  const platformIcons: Record<string, any> = {
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    whatsapp: MessageSquare,
  };

  const followLinks = settings?.footer?.socialLinks?.length
    ? settings.footer.socialLinks
        .map((link: any) => ({
          label: link.platform || 'Follow',
          href: link.url || '#',
          icon: platformIcons[(link.platform || '').toLowerCase()] || MessageSquare,
        }))
    : fallbackFollowLinks;

  const fallbackShowrooms = [
    { city: 'Hyderabad', address: 'Jeedimetla Industrial Area, Phase 3' },
    { city: 'Rajahmundry', address: 'JN Road, Opposite Surya Function Hall' },
    { city: 'Bangalore', address: 'KR Puram Hoodi Main Road' },
  ];

  const cmsShowrooms = showrooms
    ? showrooms
        .filter((loc) => loc?.address?.city)
        .map((loc) => ({
          city: loc.address.city,
          address: loc.address.fullAddress || loc.address.street || loc.address.city,
        }))
    : [];
  const displayShowrooms = cmsShowrooms.length ? cmsShowrooms : fallbackShowrooms;

  const fallbackLinkColumns = [
    { heading: 'Company', links: companyLinks },
    { heading: 'Products', links: productLinks },
    { heading: 'Support', links: supportLinks },
  ];

  const linkColumns = nav?.footerMenu?.length
    ? nav.footerMenu
        .filter((col: any) => col?.heading)
        .map((col: any) => ({
          heading: col.heading,
          links: col.links?.length
            ? col.links.filter((l: any) => l?.label).map((l: any) => ({ label: l.label, path: l.path }))
            : [],
        }))
    : fallbackLinkColumns;

  const businessHours = settings?.contactInfo?.businessHours || 'Mon–Sat: 9 AM – 7 PM';

  return (
    <footer className="relative overflow-hidden w-full bg-gradient-to-b from-sky-50 via-sky-100 to-brand-200">
      {/* ─── Botanical leaf texture overlay ─── */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M80 100 C90 85 105 80 110 90 C115 100 105 115 90 115 C75 115 70 105 80 100Z' fill='rgba(46,140,208,0.12)'/%3E%3Cpath d='M140 140 C145 130 155 125 158 132 C161 139 153 148 143 148 C133 148 132 142 140 140Z' fill='rgba(46,140,208,0.09)' transform='rotate(45 145 140)'/%3E%3C/svg%3E\")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.75,
        }}
        aria-hidden="true"
      />

      {/* ─── Blue ambient glow ─── */}
      <div
        className="absolute top-[8%] left-[5%] w-[700px] h-[500px] rounded-full pointer-events-none select-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at center, rgba(46,140,208,0.16) 0%, rgba(46,140,208,0.06) 35%, transparent 65%)',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-[3%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none select-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at center, rgba(46,140,208,0.12) 0%, transparent 55%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      {/* ─── Ambient glow bottom right ─── */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full pointer-events-none select-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at center, rgba(46,140,208,0.10) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      {/* ─── Main Content ─── */}
      <div className="relative z-10 w-full flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 md:px-10 lg:px-14 pt-12 md:pt-24 lg:pt-28 pb-6 md:pb-8">
          <div className="flex flex-col gap-9 sm:gap-10 md:gap-14 lg:gap-16">
            {/* ═══════ BRAND SECTION — Large Logo + Tagline + Trust Pills ═══════ */}
            <div className="flex flex-col items-start w-full">
              {/* Navbar logo — sits directly on the light-blue footer */}
              <img
                src="/images/relaxpro-logo.png"
                alt="RelaxPro Premium Mattresses"
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain block"
                width={1074}
                height={350}
                loading="eager"
                style={{ imageRendering: 'auto' }}
              />

                {/* Tagline with blue dot divider */}
                <p
                  className="mt-4 md:mt-5 text-graphite-500 text-sm md:text-base font-body font-light max-w-xl leading-relaxed tracking-wide"
                >
                  Pure Natural Latex Mattresses{' '}
                  <span className="text-brand-500/80 mx-2 inline-block">✦</span>{' '}
                  Crafted for Better Sleep
                </p>

                {/* Trust Pills — horizontal row with blue accent border */}
                <div
                  className="flex flex-wrap gap-2 mt-4 md:mt-6"
                >
                {trustItems.map((item, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-2 px-3.5 py-2 rounded-full border border-brand-200 bg-white/70 shadow-sm"
                  >
                    <item.icon className="w-3 h-3 text-brand-500 shrink-0" />
                    <span className="text-[11px] font-accent font-medium tracking-wide text-graphite-600">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══════ NAVIGATION — 4 Columns with blue top border ═══════ */}
            <div
              className="relative pt-6 md:pt-10"
            >
              {/* Blue accent divider line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-brand-400/50 via-brand-300/40 to-transparent" />

              <div className="flex flex-wrap gap-x-6 gap-y-8 md:gap-6 lg:gap-10 pt-4">
                {linkColumns.map((column) => (
                  <div key={column.heading} className="min-w-[150px] flex-1">
                    <h4 className="font-heading font-bold text-graphite-700 text-[11px] uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2.5">
                      <span className="inline-block w-5 h-px bg-brand-500" />
                      {column.heading}
                    </h4>
                    <ul className="space-y-1.5 md:space-y-3">
                      {column.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            to={link.path}
                            className="group inline-flex items-center gap-1.5 text-sm text-graphite-500 hover:text-brand-600 transition-all duration-300 cursor-pointer"
                          >
                            <span className="w-0 h-px bg-brand-500 group-hover:w-3 transition-all duration-300" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Follow */}
                <div className="min-w-[150px] flex-1">
                  <h4 className="font-heading font-bold text-graphite-700 text-[11px] uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2.5">
                    <span className="inline-block w-5 h-px bg-brand-500" />
                    Follow
                  </h4>
                  <ul className="space-y-1.5 md:space-y-3">
                    {followLinks.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2.5 text-sm text-graphite-500 hover:text-brand-600 transition-all duration-300"
                        >
                          <span className="w-6 h-6 rounded-full border border-brand-200 bg-white/70 flex items-center justify-center group-hover:border-brand-400 group-hover:bg-brand-100 transition-all duration-300">
                            <link.icon className="w-3 h-3 text-brand-500 group-hover:text-brand-600 transition-colors" />
                          </span>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ═══════ CONTACT — Premium Glass Card ═══════ */}
            <div
              className="grid grid-cols-1 gap-5 md:gap-8"
            >
              {/* Contact Card — Premium Glass Card */}
              <div
                className="relative group rounded-2xl bg-white/80 border border-brand-200 shadow-sm hover:border-brand-400 p-5 md:p-7 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -inset-20 bg-brand-300/20 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none" />

                <h4 className="font-heading font-bold text-brand-700 text-[10px] uppercase tracking-[0.25em] mb-4 md:mb-5 relative">
                  Visit Our Showroom
                </h4>
                <div className="flex flex-col gap-2.5 md:gap-3 relative">
                  {displayShowrooms.map((loc) => (
                    <div key={loc.city} className="flex items-start gap-3 group/loc">
                      <div className="w-6 h-6 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center shrink-0 mt-0.5 group-hover/loc:bg-brand-200 transition-colors">
                        <MapPin className="w-3 h-3 text-brand-600" />
                      </div>
                      <div>
                        <span className="text-graphite-700 text-[12px] font-medium font-accent">{loc.city}</span>
                        <p className="text-graphite-500 text-[11px] font-body leading-relaxed">{loc.address}</p>
                      </div>
                    </div>
                  ))}
                  <div className="w-full h-px bg-gradient-to-r from-brand-300/40 via-brand-200/50 to-transparent my-1" />
                  <div className="flex items-center gap-3 group/contact">
                    <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <a href={`tel:+${contactInfo.mainPhone || '919281424494'}`} className="text-graphite-600 hover:text-brand-600 transition-colors text-[12px] font-body">
                      +91 {contactInfo.mainPhone?.replace(/^(\d{5})(\d{5})$/, '$1 $2') || '92814 24494'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 group/contact">
                    <Mail className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <a href={`mailto:${contactInfo.email || 'relaxpro2022@gmail.com'}`} className="text-graphite-600 hover:text-brand-600 transition-colors text-[12px] font-body">
                      {contactInfo.email || 'relaxpro2022@gmail.com'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="text-graphite-600 text-[12px] font-body">{businessHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════ WHATSAPP CTA + SOCIAL ICONS ═══════ */}
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6"
            >
              {/* WhatsApp CTA Button */}
              <a
                href={`https://wa.me/${contactInfo.whatsappNumber || '919281424494'}?text=${encodeURIComponent('Hello Suresh, I would like to know more about RelaxPro mattresses. Can you help?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 border border-brand-600 shadow-lg shadow-brand-400/20 hover:from-brand-700 hover:to-brand-600 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[10px] font-accent font-bold uppercase tracking-widest">WhatsApp Us</span>
                  <span className="text-white/80 text-[13px] font-body group-hover:text-white transition-colors">Chat with our sleep expert</span>
                </div>
                <ExternalLink className="w-4 h-4 text-white/90 group-hover:text-white group-hover:translate-x-0.5 transition-all ml-1 shrink-0" />
              </a>

              {/* Social icons row */}
              <div className="flex items-center gap-3">
                {followLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-10 h-10 rounded-full border border-brand-200 bg-white/70 flex items-center justify-center hover:border-brand-400 hover:bg-brand-600 hover:scale-110 transition-all duration-300"
                    title={link.label}
                  >
                    <link.icon className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ BOTTOM STRIP — Removed per user request ═══════ */}
      </div>
    </footer>
  );
}
