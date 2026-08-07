import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, User, Loader2, CheckCircle, ChevronRight } from 'lucide-react';
import { submitLead } from '../../services/leadService';
import { validateName, validatePhone } from '../../utils/validation';

interface PopupContent {
  heading?: string;
  description?: string;
  ctaLabel?: string;
  successHeading?: string;
  successDescription?: string;
  disclaimer?: string;
  dontShowAgainText?: string;
  showLogo?: boolean;
  submittingText?: string;
  image?: string;
}

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  onDontShowAgain: () => void;
  content?: PopupContent;
}

const DEFAULT_CONTENT: PopupContent = {
  heading: 'Welcome!',
  description: 'Join our community and enjoy exclusive benefits on your first purchase.',
  ctaLabel: 'Claim My Offer',
  successHeading: 'You\'re All Set!',
  successDescription: 'Our sleep expert will contact you shortly with your exclusive offer.',
  disclaimer: 'We respect your privacy. No spam. Unsubscribe anytime.',
  dontShowAgainText: "Don't show this again",
  showLogo: true,
  submittingText: 'Submitting...',
  image: '/images/hero-bedroom.webp',
};

export default function LeadPopup({ isOpen, onClose, onSubmitted, onDontShowAgain, content }: LeadPopupProps) {
  const c = { ...DEFAULT_CONTENT, ...content };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dontShow, setDontShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    // If user checked "Don't show again", persist it before closing
    if (dontShow) {
      onDontShowAgain();
    }
    setName(''); setEmail(''); setPhone('');
    setDontShow(false);
    setErrors({}); setSubmitted(false); setIsSubmitting(false);
    setImgError(false);
    onClose();
  }, [onClose, dontShow, onDontShowAgain]);

  // Store saved scroll position in a ref to avoid stale closure issues
  const savedScrollRef = useRef(0);

  // Prevent background scrolling while preserving scroll position
  // Uses a single ref for scroll pos to avoid duplicate restoration
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      savedScrollRef.current = window.scrollY;
      document.body.style.overflowY = 'scroll'; // preserve scrollbar gutter
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      const pos = savedScrollRef.current;
      // Batch style removal + scroll restore in same frame to eliminate visual jump
      requestAnimationFrame(() => {
        document.body.style.overflowY = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        window.scrollTo(0, pos);
        // Restore focus without forcing a scroll jump
        requestAnimationFrame(() => {
          previousActiveElement.current?.focus({ preventScroll: true });
        });
      });
    }
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !popupRef.current) return;
    const focusable = popupRef.current.querySelectorAll<HTMLElement>(
      'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus();
      }
    }
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    const nameErr = validateName(name);
    if (nameErr) errs.name = nameErr;

    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    const phoneErr = validatePhone(phone);
    if (phoneErr) errs.phone = phoneErr;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await submitLead({
        name: name.trim(),
        phone: phone.replace(/\D/g, ''),
        email: email.trim(),
        source: 'Popup',
        notes: `Page: ${window.location.href} | Device: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}`,
      });

      setSubmitted(true);

      // If "Don't show again" was checked, also dismiss permanently
      if (dontShow) {
        try { localStorage.setItem('relaxpro_popup_dismissed', 'true'); } catch { /* noop */ }
      }

      setTimeout(() => {
        onSubmitted();
      }, 3500);
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(8px)' }}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label="Welcome popup"
        >
          <motion.div
            ref={popupRef}
            key="popup-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-[700px] max-h-[500px] overflow-hidden rounded-[18px] bg-white shadow-2xl flex"
            style={{ boxShadow: '0 24px 80px -12px rgba(0,0,0,0.35)' }}
          >
            {/* ===== LEFT PANEL — Image (40%) ===== */}
            <div className="hidden sm:block relative w-[40%] flex-shrink-0 overflow-hidden rounded-l-[18px]">
              {/* Image */}
              {!imgError ? (
                <img
                  src={c.image || DEFAULT_CONTENT.image!}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-950" />
              )}

              {/* Dark overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Bottom overlay text */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-heading text-lg font-semibold leading-tight">
                  Welcome to<br />
                  <span className="text-white/95">RelaxPro</span>
                </p>
                <p className="text-white/65 text-xs mt-1.5 font-accent font-normal leading-relaxed">
                  Unlock exclusive member benefits.
                </p>
              </div>

              {/* Decorative accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* ===== RIGHT PANEL — Form (60% desktop, 100% mobile) ===== */}
            <div className="flex-1 flex flex-col relative overflow-y-auto">
              {/* Close button — top right */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all cursor-pointer active:scale-95"
                aria-label="Close popup"
              >
                <X className="w-[18px] h-[18px]" />
              </button>

              {!submitted ? (
                <div className="flex flex-col px-7 sm:px-8 pt-7 sm:pt-8 pb-6 sm:pb-7 flex-1 justify-center">
                  {/* ===== Logo ===== */}
                  {c.showLogo && (
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                        <img
                          src="/images/relaxpro-logo.png"
                          alt="RelaxPro"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* ===== Heading ===== */}
                  <h2 className="text-center font-heading text-[28px] sm:text-[32px] font-bold text-gray-900 tracking-tight leading-tight">
                    {c.heading}
                  </h2>
                  <p className="text-center text-gray-500 text-[15px] font-accent mt-2 leading-relaxed max-w-xs mx-auto">
                    {c.description}
                  </p>

                  {/* ===== Form ===== */}
                  <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-3.5">
                    {/* Full Name */}
                    <div>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-gray-400 pointer-events-none" />
                        <input
                          id="popup-name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors(p => ({ ...p, name: '' }));
                          }}
                          placeholder="Enter your name"
                          className={`w-full h-[52px] pl-[42px] pr-4 rounded-[10px] border text-[15px] font-accent bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all placeholder:text-gray-400 ${
                            errors.name
                              ? 'border-red-300 focus:ring-red-100'
                              : 'border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-[11px] text-red-500 font-accent mt-1" role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-gray-400 pointer-events-none" />
                        <input
                          id="popup-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors(p => ({ ...p, email: '' }));
                          }}
                          placeholder="Enter your email"
                          className={`w-full h-[52px] pl-[42px] pr-4 rounded-[10px] border text-[15px] font-accent bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all placeholder:text-gray-400 ${
                            errors.email
                              ? 'border-red-300 focus:ring-red-100'
                              : 'border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-red-500 font-accent mt-1" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-gray-400 pointer-events-none" />
                        <input
                          id="popup-phone"
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '');
                            setPhone(v);
                            if (errors.phone) setErrors(p => ({ ...p, phone: '' }));
                          }}
                          placeholder="Enter your mobile number"
                          className={`w-full h-[52px] pl-[42px] pr-4 rounded-[10px] border text-[15px] font-accent bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-all placeholder:text-gray-400 ${
                            errors.phone
                              ? 'border-red-300 focus:ring-red-100'
                              : 'border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-red-500 font-accent mt-1" role="alert">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {errors.submit && (
                      <p className="text-[11px] text-red-500 font-accent text-center" role="alert">
                        {errors.submit}
                      </p>
                    )}

                    {/* CTA Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[54px] rounded-[10px] font-accent font-semibold text-[16px] text-white transition-all cursor-pointer flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-[18px] h-[18px] animate-spin" /><span>{c.submittingText}</span></>
                      ) : (
                        <span className="flex items-center gap-2">
                          {c.ctaLabel}
                          <ChevronRight className="w-[18px] h-[18px]" />
                        </span>
                      )}
                    </button>

                    {/* Privacy note */}
                    <p className="text-center text-[12px] text-gray-400 font-accent leading-relaxed">
                      {c.disclaimer}
                    </p>
                  </form>

                  {/* Don't show again — checkbox */}
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="popup-dont-show"
                        checked={dontShow}
                        onChange={(e) => setDontShow(e.target.checked)}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="popup-dont-show"
                        className="flex items-center gap-2 cursor-pointer select-none group"
                      >
                        <span
                          className={`w-[18px] h-[18px] flex items-center justify-center rounded-[4px] border-2 transition-all ${
                            dontShow
                              ? 'bg-brand-600 border-brand-600'
                              : 'border-gray-300 bg-white group-hover:border-brand-400'
                          }`}
                        >
                          {dontShow && (
                            <svg className="w-[11px] h-[11px] text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="text-[12px] font-accent text-gray-500 group-hover:text-gray-700 transition-colors">
                          {c.dontShowAgainText}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                /* ===== SUCCESS STATE ===== */
                <div className="flex flex-col items-center justify-center px-7 sm:px-8 py-10 flex-1 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-[72px] h-[72px] rounded-full bg-eco-50 border border-eco-500/20 flex items-center justify-center mb-5"
                  >
                    <CheckCircle className="w-[36px] h-[36px] text-eco-500" />
                  </motion.div>

                  <h3 className="font-heading text-[28px] sm:text-[32px] font-bold text-gray-900 tracking-tight">
                    {c.successHeading}
                  </h3>
                  <p className="text-gray-500 text-[15px] font-accent mt-2.5 leading-relaxed max-w-[260px]">
                    {c.successDescription}
                  </p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-2 mt-5 text-gray-400 text-[12px] font-accent"
                  >
                    <Loader2 className="w-[14px] h-[14px] animate-spin" />
                    <span>Closing automatically...</span>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
