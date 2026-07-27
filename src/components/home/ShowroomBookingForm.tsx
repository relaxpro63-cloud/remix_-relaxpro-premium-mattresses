import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Calendar, Send, Sparkles, MapPin, UserCheck, AlertCircle, Clock } from 'lucide-react';
import { submitLead } from '../../services/leadService';
import { buildWhatsAppUrl } from '../../lib/site';

export default function ShowroomBookingForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showroom, setShowroom] = useState('Hyderabad');
  const [visitDate, setVisitDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 1:00 PM');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const easeCurve = [0.22, 1, 0.36, 1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please specify your name so we can welcome you.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setValidationError('Please specify a valid 10-digit mobile number for confirmation.');
      return;
    }
    if (!visitDate) {
      setValidationError('Please select a preferred date for your showroom visit.');
      return;
    }

    setIsSubmitting(true);
    try {
      const detailedNotes = `Preferred Showroom: ${showroom}\nPreferred Date: ${visitDate}\nPreferred Time Slot: ${timeSlot}\nCustomer Notes: ${notes || 'None'}`;
      
      await submitLead({
        name: name.trim(),
        phone: phone.replace(/\D/g, ''),
        city: showroom,
        contactTime: `${visitDate} @ ${timeSlot}`,
        product: 'Showroom Visit Booking',
        notes: detailedNotes,
        source: 'Showroom Booking Form',
      });

      const waMsg = [
        '🏪 New Showroom Booking',
        '',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Showroom: ${showroom}`,
        `Date: ${visitDate}`,
        `Time: ${timeSlot}`,
        `Notes: ${notes || 'None'}`,
        '',
        'Customer needs confirmation and live support.',
      ].join('\n');
      window.open(buildWhatsAppUrl(waMsg), '_blank');

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setValidationError('An error occurred. Please try again or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLaunchWhatsApp = () => {
    const text = `Hello Suresh, I would like to book a showroom visit. Name: ${name}. Phone: ${phone}. Showroom: ${showroom}. Date: ${visitDate} @ ${timeSlot}.`;
    window.location.href = buildWhatsAppUrl(text);
  };

  return (
    <div 
      id="showroom-booking-section" 
      className="card-ink rounded-[2rem] border border-brand-700/25 shadow-2xl p-6 md:p-12 max-w-3xl mx-auto relative overflow-hidden group py-16 md:py-20"
    >
      {/* Decorative luxury radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent opacity-70 pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form 
            key="booking-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.2, ease: easeCurve }}
            onSubmit={handleSubmit} 
            className="space-y-10 relative z-10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-8 gap-4">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-brand-700/25 bg-white/5 backdrop-blur-md shrink-0">
                  <Calendar className="w-7 h-7 text-brand-400" />
                </div>
                <div>
                  <h3 className="font-heading font-serif font-normal text-3xl tracking-tight text-linen-100">
                    Book Your Showroom Visit
                  </h3>
                  <p className="text-sm font-body mt-1.5 text-linen-200/70">
                    Reserve a private styling consultation at our Kerala factory outlets.
                  </p>
                </div>
              </div>
              <span className="badge-luxury self-start md:self-center">
                ✨ GOLS Certified Organic
              </span>
            </div>

            {validationError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-red-950/60 text-red-200 text-xs font-body p-4 rounded-xl border border-red-900/50 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <span>{validationError}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-body">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-accent tracking-[0.2em] font-bold text-brand-400">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Srinivas Rao"
                  className="w-full px-5 py-4 rounded-xl border border-white/10 text-sm focus:outline-hidden focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 bg-white/5 transition-all font-body placeholder:text-white/20 text-linen-100"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-accent tracking-[0.2em] font-bold text-brand-400">WhatsApp Callback Number</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 8686624494"
                  className="w-full px-5 py-4 rounded-xl border border-white/10 text-sm focus:outline-hidden focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 bg-white/5 transition-all font-body placeholder:text-white/20 text-linen-100"
                />
              </div>

              {/* Showroom Location */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-accent tracking-[0.2em] font-bold text-brand-400">Select Showroom Outlet</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4.5 w-4 h-4 text-brand-400/70 pointer-events-none" />
                  <select
                    value={showroom}
                    onChange={(e) => setShowroom(e.target.value)}
                    className="w-full pl-11 pr-5 py-4 rounded-xl border border-white/10 text-sm focus:outline-hidden focus:border-brand-500 bg-ink-900 transition-all font-body appearance-none cursor-pointer text-linen-100"
                  >
                    <option value="Hyderabad">Hyderabad Factory Showroom (Jeedimetla)</option>
                    <option value="Rajahmundry">Rajahmundry Experience Store (Danavaipeta)</option>
                    <option value="Bangalore">Bangalore Partner Store (Indiranagar)</option>
                  </select>
                  <div className="absolute right-4 top-5 w-2 h-2 border-r-2 border-b-2 border-brand-600 transform rotate-45 pointer-events-none" />
                </div>
              </div>

              {/* Visit Date */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase font-accent tracking-[0.2em] font-bold text-brand-400">Preferred Visit Date</label>
                <input
                  type="date"
                  value={visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 text-sm focus:outline-hidden focus:border-brand-500 bg-ink-900 transition-all font-body cursor-pointer select-none text-linen-100"
                />
              </div>

              {/* Visit Time Slot */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-[10px] uppercase font-accent tracking-[0.2em] font-bold mb-3 text-brand-400">Preferred Time Window</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    '10:00 AM - 12:00 PM',
                    '12:00 PM - 3:00 PM',
                    '3:00 PM - 6:00 PM',
                    '6:00 PM - 9:00 PM'
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-3 px-2 rounded-xl border font-accent font-bold text-[10px] text-center uppercase tracking-wider cursor-pointer transition-all ${
                        timeSlot === slot
                          ? 'border-brand-500 bg-brand-500 text-ink-900 shadow-lg'
                          : 'border-white/10 bg-white/5 hover:border-brand-500/50 text-linen-200/80'
                      }`}
                    >
                      {slot.split(' - ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom notes */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-[10px] uppercase font-accent tracking-[0.2em] font-bold text-brand-400">Special Mattress Requirements / Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g., Interested in checking the Nirvana 8-inch and testing custom firmness levels..."
                  className="w-full px-5 py-4 rounded-xl border border-white/10 text-sm focus:outline-hidden focus:border-brand-500 bg-white/5 resize-none transition-all font-body placeholder:text-white/20 text-linen-100"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary font-accent font-bold text-[13px] tracking-widest uppercase py-4.5 rounded-xl transition-all shadow-xl group cursor-pointer flex items-center justify-center gap-3 mt-6"
            >
              {isSubmitting ? (
                <span>Securing Your Showroom Booking...</span>
              ) : (
                <>Confirm Reservation <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: easeCurve }}
            className="text-center py-12 space-y-8 relative z-10 font-body"
          >
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl border bg-brand-500/10 border-brand-500">
              <UserCheck className="w-10 h-10 text-brand-400" />
            </div>
            
            <div className="space-y-3">
              <h3 className="font-heading font-serif font-normal text-4xl text-linen-100">
                Showroom Appointment Confirmed
              </h3>
              <p className="text-sm md:text-base max-w-md mx-auto leading-relaxed text-linen-200/80">
                Dear <strong className="text-brand-400">{name}</strong>, your private slot at our <strong className="text-brand-400">{showroom} Outlet</strong> has been booked for <strong className="text-brand-400">{visitDate} ({timeSlot})</strong>.
              </p>
            </div>

            <div className="p-6 rounded-[2rem] border max-w-md mx-auto flex flex-col items-center justify-center text-center bg-white/5 border-white/10">
              <span className="text-[10px] tracking-widest font-accent uppercase font-bold text-brand-400">Need Instant Directions?</span>
              <p className="text-xs mt-2 mb-5 leading-relaxed text-linen-200/70">
                You can also receive automated maps pin details and coordinate maps routing directly via WhatsApp chat.
              </p>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={handleLaunchWhatsApp}
                className="inline-flex items-center justify-center gap-2.5 bg-eco-500 hover:bg-[#1DA851] text-white font-accent font-bold text-xs tracking-wider uppercase py-3.5 px-8 rounded-xl cursor-pointer transition-all shadow-lg shadow-[#25D366]/20 w-full"
              >
                <MessageSquare className="w-4 h-4" /> Message Suresh on WhatsApp
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
