import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Send, Loader2, CheckCircle, Phone, User, MapPin } from 'lucide-react';
import { submitLead } from '../../services/leadService';
import { validateName, validatePhone, validateCity } from '../../utils/validation';
import { useToast } from '../ui/Toast';
import { buildWhatsAppUrl } from '../../lib/site';

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadPopup({ isOpen, onClose }: LeadPopupProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setName('');
      setPhone('');
      setCity('');
      setErrors({});
      setSubmitted(false);
      onClose();
    }
  }, [isSubmitting, onClose]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !popupRef.current) return;

    const focusableElements = popupRef.current.querySelectorAll<HTMLElement>(
      'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    firstFocusable?.focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errs: Record<string, string> = {};
    const nameErr = validateName(name);
    if (nameErr) errs.name = nameErr;
    const phoneErr = validatePhone(phone);
    if (phoneErr) errs.phone = phoneErr;
    const cityErr = city ? validateCity(city) : null;
    if (cityErr) errs.city = cityErr;

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
        city: city.trim(),
        source: 'Popup',
      });

      setSubmitted(true);
      toast.showSuccess('Thank you!', 'Our sleep expert will contact you shortly.');

      setTimeout(() => {
        const whatsappMessage = [
          `Hi RelaxPro,`,
          ``,
          `My name is ${name.trim()}.`,
          `I would like a free mattress consultation.`,
          city.trim() ? `City: ${city.trim()}` : '',
          `Please contact me.`,
        ].filter(Boolean).join('\n');

        window.open(buildWhatsAppUrl(whatsappMessage), '_blank');
        handleClose();
      }, 2000);
    } catch {
      toast.showError('Something went wrong', 'Please try again or reach out on WhatsApp.');
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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label="Free Mattress Consultation"
        >
          <motion.div
            ref={popupRef}
            key="popup-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,248,245,0.95))',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 32px 64px -16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-xl border border-brand-200/60 bg-white/80 hover:bg-white hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
              aria-label="Close popup"
            >
              <X className="w-4 h-4 text-neutral-dark/60" />
            </button>

            <div className="p-8 md:p-10 relative z-10">
              {!submitted ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-accent/20">
                      <Sparkles className="w-7 h-7 text-accent" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary tracking-tight leading-tight">
                      Find Your Perfect Mattress
                    </h2>
                    <p className="font-body text-neutral-dark/70 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
                      Get a FREE consultation with our sleep experts and receive the best mattress recommendation for your needs.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                      <label htmlFor="popup-name" className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-dark/40 pointer-events-none" />
                        <input
                          id="popup-name"
                          type="text"
                          value={name}
                          onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
                          placeholder="e.g. Srinivas Rao"
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-body bg-white focus:outline-hidden focus:ring-4 transition-all placeholder:text-neutral-dark/30 ${
                            errors.name ? 'border-red-300 focus:ring-red-100 text-red-700' : 'border-brand-200/60 focus:border-accent focus:ring-accent/10 text-primary'
                          }`}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'popup-name-error' : undefined}
                        />
                      </div>
                      {errors.name && (
                        <p id="popup-name-error" className="text-[10px] text-red-500 font-accent font-bold uppercase tracking-wider mt-1.5" role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="popup-phone" className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                        Phone Number <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-dark/40 pointer-events-none" />
                        <input
                          id="popup-phone"
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setPhone(val);
                            if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                          }}
                          placeholder="e.g. 9876543210"
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-mono bg-white focus:outline-hidden focus:ring-4 transition-all placeholder:text-neutral-dark/30 ${
                            errors.phone ? 'border-red-300 focus:ring-red-100 text-red-700' : 'border-brand-200/60 focus:border-accent focus:ring-accent/10 text-primary'
                          }`}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? 'popup-phone-error' : undefined}
                        />
                      </div>
                      {errors.phone && (
                        <p id="popup-phone-error" className="text-[10px] text-red-500 font-accent font-bold uppercase tracking-wider mt-1.5" role="alert">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="popup-city" className="block text-xs font-accent font-bold text-primary uppercase tracking-wider mb-2">
                        City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-dark/40 pointer-events-none" />
                        <input
                          id="popup-city"
                          type="text"
                          value={city}
                          onChange={(e) => { setCity(e.target.value); if (errors.city) setErrors(prev => ({ ...prev, city: '' })); }}
                          placeholder="e.g. Hyderabad"
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-body bg-white focus:outline-hidden focus:ring-4 transition-all placeholder:text-neutral-dark/30 ${
                            errors.city ? 'border-red-300 focus:ring-red-100 text-red-700' : 'border-brand-200/60 focus:border-accent focus:ring-accent/10 text-primary'
                          }`}
                          aria-invalid={!!errors.city}
                          aria-describedby={errors.city ? 'popup-city-error' : undefined}
                        />
                      </div>
                      {errors.city && (
                        <p id="popup-city-error" className="text-[10px] text-red-500 font-accent font-bold uppercase tracking-wider mt-1.5" role="alert">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <motion.button
                      whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-2xl font-accent font-bold text-sm tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-2 relative overflow-hidden group"
                      style={{ 
                        backgroundColor: isSubmitting ? '#8B7355' : '#C9A87C', 
                        color: '#1A2421',
                        boxShadow: '0 8px 24px -8px rgba(201, 168, 124, 0.4)'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Get Free Consultation</span>
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-[11px] font-body text-neutral-dark/50 mt-4">
                      No spam. We will contact you shortly.
                    </p>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center py-6"
                >
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-200 shadow-lg shadow-emerald-500/10">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary tracking-tight">
                    Thank You, {name.split(' ')[0]}!
                  </h3>
                  <p className="font-body text-neutral-dark/70 text-sm mt-3 leading-relaxed">
                    Our sleep expert will contact you shortly.
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-2 text-accent text-xs font-accent font-bold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Redirecting to WhatsApp...</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}