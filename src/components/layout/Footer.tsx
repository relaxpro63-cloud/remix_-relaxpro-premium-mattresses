import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield, RefreshCcw, Truck, Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import RelaxProLogo from '../ui/RelaxProLogo';

export default function Footer() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const luxuryModels = PRODUCTS.filter(p => p.tier === 'luxury');
  const premiumModels = PRODUCTS.filter(p => p.tier === 'premium');
  const comfortModels = PRODUCTS.filter(p => p.tier === 'comfort');

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Shop All' },
    { path: '/builder', label: 'Customize' },
    { path: '/science', label: 'Sleep Science' },
    { path: '/about', label: 'About Us' },
  ];

  const customerCare = [
    { path: '/contact', label: 'Contact Us' },
    { path: '/locations', label: 'Store Locations' },
    { path: '/science', label: 'Sleep Education' },
  ];

  return (
    <footer className="bg-primary text-white/70 border-t-2 border-accent/30">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10">

          {/* Col 1: Brand */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex flex-col items-start gap-1">
              <RelaxProLogo variant="footer" inverse={true} className="!items-start" />
              <span className="text-[8px] font-accent tracking-[0.22em] text-accent block uppercase font-bold mt-2">
                Kerala Organic Latex Labs
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed max-w-sm font-body">
              Leading natural latex mattress manufacturer in Andhra Pradesh and Telangana. Handcrafted from 100% GOLS certified Dunlop rubber — factory direct with zero markups.
            </p>

            {/* Trust Badges */}
            <div className="space-y-2.5 text-xs">
              {[
                { icon: <Shield className="w-4 h-4" />, text: '10-Year Factory Replacement Warranty' },
                { icon: <RefreshCcw className="w-4 h-4" />, text: 'Direct From Kerala • No Middleman' },
                { icon: <Truck className="w-4 h-4" />, text: 'Free Doorstep Shipping To Major Cities' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-white/60">
                  <span className="text-accent shrink-0">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/" target="_blank" rel="noopener noreferrer" className="social-bounce text-white/30 hover:text-white" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/relaxpro__mattresses/?hl=en" target="_blank" rel="noopener noreferrer" className="social-bounce text-white/30 hover:text-white" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@sureshmattressmanufacturer3784" target="_blank" rel="noopener noreferrer" className="social-bounce text-white/30 hover:text-white" title="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2 & 3: Quick Links + Customer Care (Desktop only) */}
          <div className="hidden md:grid lg:col-span-4 grid-cols-2 gap-6">
            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs">
                {quickLinks.map((link) => (
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

            {/* Customer Care */}
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

              {/* Contact */}
              <div className="mt-6 space-y-3 text-xs">
                <div className="flex gap-2 items-start">
                  <Phone className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <a href="tel:+918686624494" className="hover:text-white block font-semibold">+91 86866 24494</a>
                    <a href="tel:+917207424494" className="hover:text-white block">+91 72074 24494</a>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <Mail className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <a href="mailto:relaxpro2022@gmail.com" className="hover:text-white">relaxpro2022@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Accordion (shown on mobile only) */}
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
                    {section.items.map((link) => (
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

          {/* Col 4: Factory Address */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-widest">
              Factory Headquarters
            </h4>
            <div className="flex gap-2 items-start text-xs">
              <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-white/50">Jeedimetla Ind. Area Phase 3, Hyderabad, Telangana</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <div className="text-center md:text-left">
            <p>© {new Date().getFullYear()} RelaxPro Premium Mattresses Pvt Ltd. All rights reserved.</p>
            <p className="mt-1 text-[10px]">Kerala harvested latex is GOLS Certified • Fabrics hold Oeko-Tex Standard-100</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/science" className="hover:text-white/60 transition-colors uppercase tracking-widest font-accent text-[10px] cursor-pointer">
              Sleep Science
            </Link>
            <Link to="/locations" className="hover:text-white/60 transition-colors uppercase tracking-widest font-accent text-[10px] cursor-pointer">
              Showrooms
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
}
