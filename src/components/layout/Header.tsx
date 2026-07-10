import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { ShoppingCart, MessageSquare, Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';
import RelaxProLogo from '../ui/RelaxProLogo';

interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40);
    if (latest > 200) {
      setHidden(latest > lastY && latest - lastY > 5);
    } else {
      setHidden(false);
    }
    setLastY(latest);
  });

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
        className={`sticky top-0 z-40 w-full transition-[transform,background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out ${
          hidden && !mobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-white/80 backdrop-blur-md border-b border-border/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center cursor-pointer group"
          >
            <RelaxProLogo variant="compact" className="scale-85 md:scale-100 origin-left" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              if (item.label === 'Shop') {
                return (
                  <div key={item.path} className="relative group py-2">
                    <Link
                      to={item.path}
                      className={`text-xs font-bold uppercase tracking-widest font-accent transition-colors duration-200 cursor-pointer flex items-center gap-1 ${
                        isActive(item.path) ? 'text-primary' : 'text-neutral-dark/75 hover:text-primary'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 text-accent" />
                    </Link>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block w-52 bg-white border border-border shadow-xl rounded-2xl p-3.5 z-50">
                      <div className="flex flex-col gap-2 font-accent tracking-wider text-[10px] font-bold text-left">
                        <Link
                          to="/catalog"
                          className="hover:text-accent text-primary transition-colors duration-200 block py-2 px-2.5 rounded-lg hover:bg-brand-50"
                        >
                          Explore Collections
                        </Link>
                        <Link
                          to="/builder"
                          className="hover:text-accent text-primary transition-colors duration-200 block py-2 px-2.5 rounded-lg hover:bg-brand-50 border-t border-border pt-2"
                        >
                          Design Your Bed
                        </Link>
                        <Link
                          to="/compare"
                          className="hover:text-accent text-primary transition-colors duration-200 block py-2 px-2.5 rounded-lg hover:bg-brand-50 border-t border-border pt-2"
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
                  className={`relative text-xs font-bold uppercase tracking-widest font-accent py-1 transition-colors duration-200 cursor-pointer group ${
                    isActive(item.path) ? 'text-primary' : 'text-neutral-dark/75 hover:text-primary'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-[-2px] left-1/2 -translate-x-1/2 h-[2px] bg-accent rounded-full transition-[width] duration-300 ease-out ${
                    isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="text-neutral-dark/75 hover:text-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer font-accent uppercase tracking-widest transition-colors duration-200 mr-2"
            >
              <MessageSquare className="w-4 h-4 text-accent" />
              Contact
            </Link>

            <Link
              to="/catalog"
              className="inline-flex items-center justify-center min-h-11 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-[transform,background-color,box-shadow] duration-200 ease-out active:scale-[0.97] bg-accent hover:bg-accent-dark text-primary shadow-sm cursor-pointer"
            >
              Shop Now
            </Link>

            <Link
              to="/cart"
              className="relative bg-primary hover:bg-neutral-dark text-white p-2.5 rounded-xl transition-colors duration-200 cursor-pointer shadow-sm ml-1"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-mono text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Link
              to="/cart"
              className="relative bg-secondary hover:bg-brand-200 text-primary p-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`flex flex-col gap-[5px] p-2 rounded-lg cursor-pointer bg-secondary hover:bg-brand-200 transition-colors duration-200 ${
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
              className="text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer transition-colors duration-200"
              aria-label="Close navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 px-6 py-6 space-y-1.5">
            {navItems.map((item, i) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-menu-item block py-3.5 px-4 rounded-xl text-sm font-semibold font-accent uppercase tracking-wider transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-white bg-white/10 border-l-4 border-accent'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                style={{ transitionDelay: mobileMenuOpen ? `${i * 50}ms` : '0ms' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="px-6 py-6 border-t border-white/10 space-y-4">
            <p className="text-[11px] text-white/50 font-body leading-relaxed">
              Need help choosing? Chat with us on WhatsApp or call 8686624494.
            </p>
            <div className="flex items-center justify-center gap-6 pt-1">
              <a
                href="https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors duration-200"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/relaxpro__mattresses/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors duration-200"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@sureshmattressmanufacturer3784"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors duration-200"
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
