import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Envelope, Phone, MapPin, Truck, CaretDown } from '@phosphor-icons/react';
import RelaxProLogo from '../ui/RelaxProLogo';

export default function Footer() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Shop' },
    { path: '/builder', label: 'Customize' },
    { path: '/compare', label: 'Compare' },
    { path: '/science', label: 'Sleep Science' },
    { path: '/about', label: 'About' },
  ];

  const customerCare = [
    { path: '/contact', label: 'Contact' },
    { path: '/locations', label: 'Locations' },
    { path: '/cart', label: 'Cart' },
  ];

  return (
    <footer className="bg-primary text-white/60 border-t border-accent/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">

          {/* Brand + Factory */}
          <div className="space-y-5">
            <RelaxProLogo variant="footer" inverse className="!items-start" />
            <p className="text-white/35 text-xs leading-relaxed max-w-xs font-body">
              Telangana and AP's leading manufacturer of 100% natural latex mattresses. GOLS certified, factory direct.
            </p>

            <div className="space-y-2 text-[11px]">
              {[
                { icon: Truck, text: 'Free delivery' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5 text-white/45">
                  <item.icon className="w-3.5 h-3.5 text-accent/70 shrink-0" strokeWidth={1.5} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop link columns */}
          <div className="hidden md:grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-heading font-bold text-white/90 text-[11px] uppercase tracking-[0.16em] mb-4">
                Navigate
              </h4>
              <ul className="space-y-2.5 text-xs">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold text-white/90 text-[11px] uppercase tracking-[0.16em] mb-4">
                Support
              </h4>
              <ul className="space-y-2.5 text-xs">
                {customerCare.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-2.5 text-xs">
                <div className="flex gap-2 items-start">
                  <Phone className="w-3.5 h-3.5 text-accent/70 shrink-0 mt-0.5" strokeWidth={1.5} />
                  <a href="tel:+918686624494" className="hover:text-white block">+91 86866 24494</a>
                </div>
                <div className="flex gap-2 items-start">
                  <Envelope className="w-3.5 h-3.5 text-accent/70 shrink-0 mt-0.5" strokeWidth={1.5} />
                  <a href="mailto:relaxpro2022@gmail.com" className="hover:text-white">relaxpro2022@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile accordion */}
          <div className="md:hidden space-y-0 border-t border-white/10 pt-4">
            {[
              { key: 'links', title: 'Navigate', items: quickLinks },
              { key: 'care', title: 'Support', items: customerCare },
            ].map(section => (
              <div key={section.key} className="border-b border-white/10">
                <button
                  onClick={() => toggleAccordion(section.key)}
                  className="w-full flex items-center justify-between py-4 text-white/80 text-[11px] font-heading font-bold uppercase tracking-[0.16em]"
                >
                  {section.title}
                  <CaretDown className={`w-4 h-4 transition-transform duration-300 ${
                    openAccordion === section.key ? 'rotate-180' : ''
                  }`} strokeWidth={1.5} />
                </button>
                <div className={`footer-accordion-content ${openAccordion === section.key ? 'open' : ''}`}>
                  <ul className="space-y-2.5 text-xs pb-4">
                    {section.items.map((link) => (
                      <li key={link.path}>
                        <Link to={link.path} className="hover:text-white transition-colors block py-1">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Factory */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-white/90 text-[11px] uppercase tracking-[0.16em]">
              Factory
            </h4>
            <div className="flex gap-2 items-start text-xs">
              <MapPin className="w-4 h-4 text-accent/70 shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="text-white/50 leading-relaxed">
                Jeedimetla Industrial Area, Phase 3, Hyderabad, Telangana 500055
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-white/25">
          <p>© {new Date().getFullYear()} RelaxPro Premium Mattresses. All rights reserved.</p>
          <div className="flex items-center gap-5 uppercase tracking-[0.16em] font-accent">
            <a href="tel:+918686624494" className="hover:text-white/50 transition-colors">Call</a>
            <Link to="/contact" className="hover:text-white/50 transition-colors">Contact</Link>
            <span className="text-white/25">·</span>
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
