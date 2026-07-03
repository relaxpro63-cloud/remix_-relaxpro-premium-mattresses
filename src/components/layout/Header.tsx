import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, MessageSquare, Facebook, Instagram, Youtube, Truck } from 'lucide-react';
import RelaxProLogo from '../ui/RelaxProLogo';

interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll listener for navbar background transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
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

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Shop' },
    { path: '/builder', label: 'Customize' },
    { path: '/compare', label: 'Compare' },
    { path: '/science', label: 'Sleep Science' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/97 backdrop-blur-xl border-b border-brand-200 shadow-sm'
            : 'bg-brand-50/95 backdrop-blur-md border-b border-brand-200'
        }`}
      >
        {/* Top Banner */}
        <div className="bg-primary text-white text-[10px] md:text-[11px] py-1.5 px-2 md:px-4 text-center font-accent tracking-wider flex-col md:flex-row flex items-center justify-center gap-1 md:gap-4">
          <span className="font-semibold text-accent-light">
            Telangana & AP's 1st Pure Latex Mattress Company • 100% Natural Latex
          </span>
          <span className="hidden md:inline-block text-white/40">•</span>
          <span className="font-semibold text-white/80">📞 8686624494, 9642024494</span>
          <span className="hidden md:inline-block text-white/40">•</span>
          <span className="text-white/60 font-bold">📍Hyderabad 📍Rajahmundry 📍Bangalore</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center cursor-pointer group"
          >
            <RelaxProLogo variant="compact" className="scale-85 md:scale-100 origin-left" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link-animated text-xs font-semibold uppercase tracking-wider font-accent py-1 transition-colors cursor-pointer ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-neutral-dark/60 hover:text-primary'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute bottom-[-2px] left-0 w-full h-[2px] bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="text-neutral-dark/60 hover:text-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer font-accent uppercase tracking-widest transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-accent" />
              Contact
            </Link>

            {/* Shop Now CTA */}
            <Link
              to="/catalog"
              className="btn-primary bg-accent hover:bg-accent-dark text-primary py-2.5 px-5 rounded-full text-xs font-bold font-accent uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Shop Now
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative bg-primary hover:bg-brand-800 active:bg-black text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Controls */}
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

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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

      {/* Mobile Menu Backdrop */}
      <div
        className={`mobile-menu-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <nav
        className={`mobile-menu-panel ${mobileMenuOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          {/* Close area */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-brand-200">
            <span className="font-heading font-bold text-lg text-primary">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-primary p-1 rounded-lg hover:bg-secondary cursor-pointer"
              aria-label="Close navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex-1 px-6 py-6 space-y-1">
            {navItems.map((item, idx) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-menu-item block py-3.5 px-4 rounded-xl text-sm font-semibold font-accent uppercase tracking-wider transition-colors ${
                  isActive(item.path)
                    ? 'text-primary bg-secondary border-l-4 border-accent'
                    : 'text-neutral-dark/60 hover:bg-secondary hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="px-6 py-6 border-t border-brand-200 space-y-4">
            {/* Free Delivery Badge */}
            <div className="mobile-menu-item flex items-center gap-2 bg-success/10 text-success px-4 py-3 rounded-xl text-xs font-semibold">
              <Truck className="w-4 h-4" />
              Free Delivery on All Orders
            </div>

            {/* Social Icons */}
            <div className="mobile-menu-item flex items-center justify-center gap-6 pt-2">
              <a href="https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/" target="_blank" rel="noopener noreferrer" className="text-neutral-dark/40 hover:text-primary transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/relaxpro__mattresses/?hl=en" target="_blank" rel="noopener noreferrer" className="text-neutral-dark/40 hover:text-primary transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@sureshmattressmanufacturer3784" target="_blank" rel="noopener noreferrer" className="text-neutral-dark/40 hover:text-primary transition-colors" title="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
