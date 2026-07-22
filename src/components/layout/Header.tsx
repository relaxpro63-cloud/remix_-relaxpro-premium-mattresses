import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, MessageSquare, Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';
import RelaxProLogo from '../ui/RelaxProLogo';
import { getSiteSettings, getNavigation } from '../../lib/queries';

interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bannerText, setBannerText] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const [nav, setNav] = useState<any>(null);
  const location = useLocation();
  const lastScrollY = useRef(0);

  useEffect(() => {
    getSiteSettings().then(s => {
      setSettings(s);
      if (s?.announcement?.showBanner && s?.announcement?.bannerText) {
        setBannerText(s.announcement.bannerText);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    getNavigation().then(setNav).catch(() => {});
  }, []);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > 40);

    // Hide on scroll down, reveal on scroll up (only after 200px)
    if (currentY > 200) {
      setHidden(currentY > lastScrollY.current && currentY - lastScrollY.current > 5);
    } else {
      setHidden(false);
    }
    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = (nav?.desktopMenu || [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Shop' },
    { path: '/builder', label: 'Customize' },
    { path: '/compare', label: 'Compare' },
    { path: '/science', label: 'Sleep Science' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]).map((item: any) => ({ path: item.path, label: item.label }));

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-500 ${
          hidden && !mobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled
    ? 'bg-white/90 backdrop-blur-xl border-b border-blue/20 shadow-sm'
    : 'bg-brand-50/80 backdrop-blur-md border-b border-blue/10'
        }`}
      >
{/* Top Banner */}
<div className="bg-primary text-white text-[10px] md:text-[11px] py-2 px-3 md:px-4 text-center font-accent tracking-widest flex items-center justify-center">
  <span className="font-semibold text-blue uppercase">
            {bannerText || "Telangana & AP's 1st Pure Latex Mattress Company • GOLS Certified Organic Latex • Direct Factory Pricing"}
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center cursor-pointer group"
          >
            <RelaxProLogo variant="compact" className="scale-85 md:scale-100 origin-left" />
          </Link>

          {/* Desktop Navigation with dropdown for Shop */}
          <nav className="hidden lg:flex items-center gap-7" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              if (item.label === 'Shop') {
                return (
                  <div key={item.path} className="relative group py-2">
                    <Link
                      to={item.path}
                      className={`text-xs font-bold uppercase tracking-widest font-accent transition-colors cursor-pointer flex items-center gap-1 ${
                        isActive(item.path) ? 'text-blue' : 'text-neutral-dark/75 hover:text-blue'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 text-blue" />
                    </Link>
                    {/* Hover Dropdown */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block w-52 bg-white border border-brand-200 shadow-xl rounded-xl p-3.5 z-50">
                      <div className="flex flex-col gap-2 font-accent tracking-wider text-[10px] font-bold text-left">
                        <Link
                          to="/catalog"
                          className="hover:text-blue text-primary transition-colors block py-2 px-2.5 rounded-lg hover:bg-brand-50"
                        >
                          Explore Collections
                        </Link>
                        <Link
                          to="/builder"
                          className="hover:text-blue text-primary transition-colors block py-2 px-2.5 rounded-lg hover:bg-brand-50 border-t border-brand-200/20 pt-2"
                        >
                          Design Your Bed
                        </Link>
                        <Link
                          to="/compare"
                          className="hover:text-blue text-primary transition-colors block py-2 px-2.5 rounded-lg hover:bg-brand-50 border-t border-brand-200/20 pt-2"
                        >
                          Compare Models
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative text-xs font-bold uppercase tracking-widest font-accent py-1 transition-colors cursor-pointer group ${
                    isActive(item.path) ? 'text-blue' : 'text-neutral-dark/75 hover:text-blue'
                  }`}
                >
                  {item.label}
                  {/* Center-out underline on hover */}
                  <span className={`absolute bottom-[-2px] left-1/2 -translate-x-1/2 h-[2px] bg-blue rounded-full transition-all duration-300 ${
                    isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
    to="/contact"
    className="text-neutral-dark/75 hover:text-blue text-xs font-bold flex items-center gap-1.5 cursor-pointer font-accent uppercase tracking-widest transition-colors mr-2"
  >
    <MessageSquare className="w-4 h-4 text-blue" />
              Contact
            </Link>

      <Link
        to="/catalog"
        className="btn-primary bg-blue hover:bg-blue-dark text-white py-2.5 px-6 rounded-xl text-xs font-bold font-accent uppercase tracking-wider shadow-sm cursor-pointer transition-all"
      >
              Shop Now
            </Link>

            <Link
              to="/cart"
              className="relative bg-primary hover:bg-neutral-dark text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-sm ml-1"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Link
              to="/cart"
              className="relative bg-secondary hover:bg-brand-200 text-primary p-2.5 rounded-xl transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`flex flex-col gap-[5px] p-2 rounded-lg cursor-pointer bg-secondary hover:bg-brand-200 transition-colors ${
                mobileMenuOpen ? 'hamburger-open' : ''
              }`}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop open"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Styled Mobile Menu with bg-primary and white text */}
      <nav
        className={`mobile-menu-panel bg-primary ${mobileMenuOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full text-white">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <span className="font-heading font-bold text-lg text-white">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Close navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 px-6 py-6 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-menu-item block py-3.5 px-4 rounded-xl text-sm font-semibold font-accent uppercase tracking-wider transition-colors ${
                  isActive(item.path)
        ? 'text-white bg-white/10 border-l-4 border-blue'
        : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="px-6 py-6 border-t border-white/10 space-y-4">
            <p className="text-[11px] text-white/50 font-body leading-relaxed">
              Need help choosing? Chat with us on WhatsApp or call {settings?.contactInfo?.whatsappNumber || '918686624494'}.
            </p>
            <div className="flex items-center justify-center gap-6 pt-1">
              <a
              href={settings?.contactInfo?.facebookUrl || 'https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={settings?.contactInfo?.instagramUrl || 'https://www.instagram.com/relaxpro__mattresses/?hl=en'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={settings?.contactInfo?.youtubeUrl || 'https://www.youtube.com/@sureshmattressmanufacturer3784'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}



