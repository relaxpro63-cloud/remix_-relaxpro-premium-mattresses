import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Send, Loader2, CheckCircle, Phone, User, MapPin, Mail, Shield, Headphones, Tag } from 'lucide-react';
import { submitLead } from '../../services/leadService';
import { validateName, validatePhone, validateCity } from '../../utils/validation';
import { buildWhatsAppUrl } from '../../lib/site';

interface PopupContent {
  heading?: string;
  description?: string;
  badgeText?: string;
  ctaLabel?: string;
  successHeading?: string;
  successDescription?: string;
  trustTexts?: string[];
  disclaimer?: string;
  dontShowAgainText?: string;
  showLogo?: boolean;
  submittingText?: string;
}

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  onDontShowAgain: () => void;
  content?: PopupContent;
}

const DEFAULT_CONTENT: PopupContent = {
  heading: 'Get Exclusive Offers',
  description: 'Get personalized mattress recommendations and exclusive pricing directly from our sleep experts.',
  badgeText: '🎁 Limited-Time Offer',
  ctaLabel: 'Get My Offer',
  successHeading: '✅ Thank You!',
  successDescription: 'Our sleep expert will contact you shortly.',
  trustTexts: ['No Spam', 'Expert Assistance', 'Exclusive Deals'],
  disclaimer: 'By submitting this form you agree to be contacted via call, WhatsApp or email.',
  dontShowAgainText: "Don't show this again",
  showLogo: true,
  submittingText: 'Submitting...',
};

export default function LeadPopup({ isOpen, onClose, onSubmitted, onDontShowAgain, content }: LeadPopupProps) {
  const c = { ...DEFAULT_CONTENT, ...content };
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    setName(''); setPhone(''); setCity(''); setEmail('');
    setErrors({}); setSubmitted(false); setIsSubmitting(false);
    onClose();
  }, [onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
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
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
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
    const phoneErr = validatePhone(phone);
    if (phoneErr) errs.phone = phoneErr;    const cityErr = city.trim() ? validateCity(city) : 'City is required';
    if (cityErr) errs.city = cityErr;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setErrors({});
    setIsSubmitting(true);
    try {
      await submitLead({
        name: name.trim(),
        phone: phone.replace(/\D/g, ''),
        city: city.trim(),
        email: email.trim(),
        source: 'Popup Leads',
        notes: `Page: ${window.location.href} | Device: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}`,
      });
      setSubmitted(true);
      setTimeout(() => {
        onSubmitted();
      }, 3000);
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
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: 'rgba(7, 11, 18, 0.6)', backdropFilter: 'blur(12px)' }}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label="Exclusive Offers"
        >
          <motion.div
            ref={popupRef}
            key="popup-card"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-[92%] sm:w-[520px] max-h-[90vh] sm:max-h-[88vh] overflow-y-auto rounded-[20px] relative bg-white"
            style={{
              boxShadow: '0 0 0 1px rgba(21,104,163,0.08), 0 8px 40px -8px rgba(7,11,18,0.18), 0 32px 80px -20px rgba(21,104,163,0.12)',
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-sky-100 hover:bg-brand-50 border border-brand-200/60 hover:border-brand-300 transition-all cursor-pointer hover:shadow-md active:scale-95"
              aria-label="Close popup"
            >
              <X className="w-5 h-5 text-graphite-500" />
            </button>

            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-100/60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-50/80 rounded-full blur-3xl pointer-events-none" />

            <div className="p-6 sm:p-8 md:p-10 relative z-10">
              {!submitted ? (
                <>
                  {/* Header with gift icon */}
                  <div className="text-center mb-7 sm:mb-8">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center justify-center gap-3 mb-5"
                    >
                      {c.showLogo && (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center shadow-md border border-brand-200/40">
                          <span className="font-heading font-bold text-lg sm:text-xl text-ink-900 tracking-tight">RELAX<span className="text-brand-600">PRO</span></span>
                        </div>
                      )}
                      <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600" />
                    </motion.div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-accent font-bold text-brand-600 uppercase tracking-[0.15em] bg-brand-50 border border-brand-600/15 px-3 py-1 rounded-full mb-4">
                      {c.badgeText}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-[2rem] font-heading font-bold text-ink-900 tracking-tight leading-tight">
                      {c.heading}
                    </h2>
                    <p className="font-body text-graphite-500 text-xs sm:text-sm mt-2.5 max-w-sm mx-auto leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="popup-name" className="block text-[10px] sm:text-[11px] font-accent font-bold text-ink-900 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-brand-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite-400 pointer-events-none" />
                        <input
                          id="popup-name"
                          type="text"
                          value={name}
                          onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: '' })); }}
                          placeholder="e.g. Srinivas Rao"
                          className={`w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl border text-sm font-body bg-sky-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/15 focus:border-brand-600 transition-all placeholder:text-graphite-400 ${errors.name ? 'border-red-300 focus:ring-red-100' : 'border-brand-200/60 text-ink-900'}`}
                        />
                      </div>
                      {errors.name && <p className="text-[10px] text-red-500 font-accent font-bold mt-1" role="alert">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="popup-phone" className="block text-[10px] sm:text-[11px] font-accent font-bold text-ink-900 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-brand-600">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite-400 pointer-events-none" />
                        <input
                          id="popup-phone"
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setPhone(v); if (errors.phone) setErrors(p => ({ ...p, phone: '' })); }}
                          placeholder="e.g. 9876543210"
                          className={`w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl border text-sm font-mono bg-sky-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/15 focus:border-brand-600 transition-all placeholder:text-graphite-400 ${errors.phone ? 'border-red-300 focus:ring-red-100' : 'border-brand-200/60 text-ink-900'}`}
                        />
                      </div>
                      {errors.phone && <p className="text-[10px] text-red-500 font-accent font-bold mt-1" role="alert">{errors.phone}</p>}
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="popup-city" className="block text-[10px] sm:text-[11px] font-accent font-bold text-ink-900 uppercase tracking-wider mb-1.5">
                        City <span className="text-brand-600">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite-400 pointer-events-none" />
                        <input
                          id="popup-city"
                          type="text"
                          value={city}
                          onChange={(e) => { setCity(e.target.value); if (errors.city) setErrors(p => ({ ...p, city: '' })); }}
                          placeholder="e.g. Hyderabad"
                          className={`w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl border text-sm font-body bg-sky-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/15 focus:border-brand-600 transition-all placeholder:text-graphite-400 ${errors.city ? 'border-red-300 focus:ring-red-100' : 'border-brand-200/60 text-ink-900'}`}
                        />
                      </div>
                      {errors.city && <p className="text-[10px] text-red-500 font-accent font-bold mt-1" role="alert">{errors.city}</p>}
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label htmlFor="popup-email" className="block text-[10px] sm:text-[11px] font-accent font-bold text-ink-900 uppercase tracking-wider mb-1.5">
                        Email <span className="text-graphite-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite-400 pointer-events-none" />
                        <input
                          id="popup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. you@example.com"
                          className="w-full pl-10 pr-4 py-3 sm:py-3.5 rounded-xl border border-brand-200/60 text-sm font-body bg-sky-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/15 focus:border-brand-600 text-ink-900 transition-all placeholder:text-graphite-400"
                        />
                      </div>
                    </div>

                    {errors.submit && (
                      <p className="text-[10px] text-red-500 font-accent font-bold text-center" role="alert">{errors.submit}</p>
                    )}

                    {/* CTA Button */}
                    <motion.button
                      whileHover={!isSubmitting ? { scale: 1.015, y: -2, boxShadow: '0 12px 32px -6px rgba(21,104,163,0.4)' } : {}}
                      whileTap={!isSubmitting ? { scale: 0.985 } : {}}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 sm:py-[18px] rounded-xl font-accent font-bold text-[13px] sm:text-sm tracking-[0.12em] uppercase transition-all cursor-pointer flex items-center justify-center gap-2.5 bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 text-white shadow-lg shadow-brand-600/25 hover:from-brand-500 hover:via-brand-600 hover:to-brand-700 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>{c.submittingText}</span></>
                      ) : (
                        <><span>{c.ctaLabel}</span><Send className="w-4 h-4" /></>
                      )}
                    </motion.button>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 sm:gap-6 pt-1">
                      {(c.trustTexts || []).map((text, i) => {
                        const icons = [Shield, Headphones, Tag];
                        const Icon = icons[i % icons.length];
                        return (
                          <span key={i} className="flex items-center gap-1 text-[10px] sm:text-[11px] font-body text-graphite-500">
                            <Icon className="w-3 h-3 text-brand-600" /> {text}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-center text-[9px] sm:text-[10px] font-body text-graphite-400 leading-relaxed">
                      {c.disclaimer}
                    </p>

                  </form>

                  {/* Don't show again — outside form */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={onDontShowAgain}
                      className="text-[11px] font-accent text-graphite-400 hover:text-brand-600 transition-colors cursor-pointer underline underline-offset-2 decoration-dotted hover:decoration-solid"
                    >
                      {c.dontShowAgainText}
                    </button>
                  </div>
                </>
              ) : (
                <motion.form
                  noValidate
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-8 sm:py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-18 h-18 sm:w-22 sm:h-22 bg-eco-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-eco-500/20 shadow-lg shadow-eco-500/10"
                  >
                    <CheckCircle className="w-9 h-9 sm:w-11 sm:h-11 text-eco-500" />
                  </motion.div>
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-ink-900 tracking-tight">
                    {c.successHeading}
                  </h3>
                  <p className="font-body text-graphite-500 text-sm mt-3 leading-relaxed max-w-xs mx-auto">
                    {c.successDescription}
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-2 text-graphite-400 text-xs font-body">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Closing automatically...</span>
                  </div>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={onDontShowAgain}
                      className="text-[11px] font-accent text-graphite-400 hover:text-brand-600 transition-colors cursor-pointer underline underline-offset-2 decoration-dotted hover:decoration-solid"
                    >
                      {c.dontShowAgainText}
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
