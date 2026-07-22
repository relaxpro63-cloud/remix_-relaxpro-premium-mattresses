import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, RefreshCcw, Truck, Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';
import { getSiteSettings, getNavigation } from '../../lib/queries';
import RelaxProLogo from '../ui/RelaxProLogo';

export default function Footer() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [nav, setNav] = useState<any>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(() => {});
    getNavigation().then(setNav).catch(() => {});
  }, []);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const quickLinks = (nav?.footerMenu?.[0]?.links || [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/catalog' },
    { label: 'Customize', path: '/builder' },
    { label: 'Sleep Science', path: '/science' },
    { label: 'About Us', path: '/about' },
  ]).map((item: any) => ({ path: item.path || item.href || '/', label: item.label }));

  const customerCare = (nav?.footerMenu?.[1]?.links || [
    { label: 'Contact Us', path: '/contact' },
    { label: 'Store Locations', path: '/locations' },
    { label: 'Sleep Education', path: '/science' },
  ]).map((item: any) => ({ path: item.path || item.href || '/', label: item.label }));

  const contactInfo = settings?.contactInfo || {};
  const defaultDescription = 'Leading natural latex mattress manufacturer in Andhra Pradesh and Telangana. Handcrafted from 100% GOLS certified Dunlop rubber — factory direct with zero markups.';

  return (
    <footer className="bg-primary text-white/70 border-t-2 border-blue/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10">

          <div className="lg:col-span-4 space-y-5">
            <div className="flex flex-col items-start gap-1">
              <RelaxProLogo variant="footer" inverse={true} className="!items-start" />
              <span className="text-[8px] font-accent tracking-[0.22em] text-blue block uppercase font-bold mt-2">
                Kerala Organic Latex Labs
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed max-w-sm font-body">
              {settings?.footer?.description || defaultDescription}
            </p>

            <div className="space-y-2.5 text-xs">
              {(settings?.footer?.certifications || [
                { name: '10-Year Factory Replacement Warranty' },
                { name: 'Direct From Kerala • No Middleman' },
                { name: 'Free Doorstep Shipping To Major Cities' },
              ]).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2.5 text-white/60">
                  <span className="text-blue shrink-0">{idx === 0 ? <Shield className="w-4 h-4" /> : idx === 1 ? <RefreshCcw className="w-4 h-4" /> : <Truck className="w-4 h-4" />}</span>
                  <span>{typeof item === 'string' ? item : item.name}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-2">
              <a href={settings?.contactInfo?.facebookUrl || 'https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/'} target="_blank" rel="noopener noreferrer" className="social-bounce text-white/30 hover:text-white" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={settings?.contactInfo?.instagramUrl || 'https://www.instagram.com/relaxpro__mattresses/?hl=en'} target="_blank" rel="noopener noreferrer" className="social-bounce text-white/30 hover:text-white" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={settings?.contactInfo?.youtubeUrl || 'https://www.youtube.com/@sureshmattressmanufacturer3784'} target="_blank" rel="noopener noreferrer" className="social-bounce text-white/30 hover:text-white" title="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="hidden md:grid lg:col-span-4 grid-cols-2 gap-6">
            <div>
              <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs">
                {quickLinks.map((link: any) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="hover:text-white hover:translate-x-1 transition-all inline-block cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-4">
                Customer Care
              </h4>
              <ul className="space-y-2.5 text-xs">
                {customerCare.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="hover:text-white hover:translate-x-1 transition-all inline-block cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-3 text-xs">
                <div className="flex gap-2 items-start">
                  <Phone className="w-3.5 h-3.5 text-blue shrink-0 mt-0.5" />
                  <div>
                    <a href={`tel:+${contactInfo.mainPhone || '918686624494'}`} className="hover:text-white block font-semibold">+91 {(contactInfo.mainPhone || '8686624494').replace(/^(\d{5})(\d{5})$/, '$1 $2')}</a>
                    {contactInfo.whatsappNumber && contactInfo.whatsappNumber !== contactInfo.mainPhone && (
                      <a href={`tel:+${contactInfo.whatsappNumber}`} className="hover:text-white block">+91 {contactInfo.whatsappNumber.replace(/^(\d{5})(\d{5})$/, '$1 $2')}</a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <Mail className="w-3.5 h-3.5 text-blue shrink-0 mt-0.5" />
                  <a href={`mailto:${contactInfo.email || 'relaxpro2022@gmail.com'}`} className="hover:text-white">{contactInfo.email || 'relaxpro2022@gmail.com'}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden space-y-0 border-t border-white/10 pt-4">
            {[
              { key: 'links', title: 'Quick Links', items: quickLinks },
              { key: 'care', title: 'Customer Care', items: customerCare },
            ].map(section => (
              <div key={section.key} className="border-b border-white/10">
                <button
                  onClick={() => toggleAccordion(section.key)}
                  className="w-full flex items-center justify-between py-4 text-white text-xs font-heading font-bold uppercase tracking-widest cursor-pointer"
                >
                  {section.title}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                    openAccordion === section.key ? 'rotate-180' : ''
                  }`} />
                </button>
                <div className={`footer-accordion-content ${openAccordion === section.key ? 'open' : ''}`}>
                  <ul className="space-y-2.5 text-xs pb-4">
                    {section.items.map((link: any) => (
                      <li key={link.path}>
                        <Link to={link.path} className="hover:text-white transition-colors cursor-pointer block py-1">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest">
              Factory Headquarters
            </h4>
            <div className="flex gap-2 items-start text-xs">
              <MapPin className="w-4 h-4 text-blue shrink-0 mt-0.5" />
              <p className="text-white/50">{contactInfo.factoryAddress || 'Jeedimetla Ind. Area Phase 3, Hyderabad, Telangana'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <div className="text-center md:text-left">
          </div>
        </div>
      </div>
    </footer>
  );
}
