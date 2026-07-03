import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Check, Phone, Clipboard, Send, UserCheck, AlertCircle } from 'lucide-react';
import BlurFade from '../ui/BlurFade';
import { submitLead } from '../../utils/googleSheets';

export default function ConsultationForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [painLevel, setPainLevel] = useState('none');
  const [customNotes, setCustomNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please specify your name so we can address you correctly.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setValidationError('Please specify a valid 10-digit mobile number for Suresh to call back.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Call Google Sheets integration
      await submitLead({
        orderId: "",
        name,
        phone,
        email: "",
        city: "Hyderabad / Online",
        address: "",
        pincode: "",
        contactTime: "Immediate Callback Request",
        product: `Orthopedic Consultation (${painLevel})`,
        size: "",
        price: "0",
        notes: customNotes || `Back concerns flagged level: ${painLevel}`,
        source: "Consultation Form"
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setValidationError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLaunchWhatsApp = () => {
    const complaintText = painLevel !== 'none' ? `My back pain level is ${painLevel}/5. Notes: ${customNotes}` : '';
    const text = `Hello Suresh, I am requesting an orthopedic mattress consultation. Name: ${name}. Phone: ${phone}. ${complaintText}`;
    window.location.href = `https://wa.me/918686624494?text=${encodeURIComponent(text)}`;
  };

  return (
    <div id="consultation-section" className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-brand-200/50 shadow-xl shadow-brand-500/5 p-6 md:p-10 max-w-2xl mx-auto relative overflow-hidden group">
      {/* Decorative gradient orb */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/20 transition-colors duration-1000" />
      
      {!submitted ? (
        <BlurFade duration={0.65}>
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="flex items-center gap-4 border-b border-brand-200/40 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-neutral-light flex items-center justify-center shadow-sm border border-brand-200/60">
              <Clipboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-primary text-2xl tracking-tight">Diagnostic Consultation</h3>
              <p className="text-sm font-body text-neutral-dark/70 mt-1">Direct callback request coordinate for personal recommendation.</p>
            </div>
          </div>

          {validationError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-800 text-sm font-body p-4 rounded-2xl border border-red-200 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </motion.div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-[11px] uppercase font-accent tracking-widest text-primary/70 font-bold mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Srinivas Rao"
                className="w-full px-4 py-3.5 rounded-2xl border border-brand-200/60 text-sm focus:outline-hidden focus:border-accent focus:ring-4 focus:ring-accent/10 bg-neutral-light/50 text-primary transition-all font-body placeholder:text-neutral-dark/40"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-accent tracking-widest text-primary/70 font-bold mb-2">Mobile Number (WhatsApp Callback)</label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 8686624494"
                className="w-full px-4 py-3.5 rounded-2xl border border-brand-200/60 text-sm focus:outline-hidden focus:border-accent focus:ring-4 focus:ring-accent/10 bg-neutral-light/50 text-primary transition-all font-body placeholder:text-neutral-dark/40"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-accent tracking-widest text-primary/70 font-bold mb-3">Current Back Comfort Concerns?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'none', label: 'Healthy/None' },
                  { value: 'mild', label: 'Mild Neck pain' },
                  { value: 'lumbar', label: 'Lower Back Soreness' },
                  { value: 'spine', label: 'Spine/Cervical Spine' }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPainLevel(item.value)}
                    className={`p-3 rounded-2xl border font-accent font-bold text-[11px] text-center uppercase tracking-wider cursor-pointer transition-all ${
                      painLevel === item.value
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-brand-200/60 bg-white hover:border-accent hover:bg-neutral-light text-primary/70'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-accent tracking-widest text-primary/70 font-bold mb-2">Anatomical Notes or Doctors Advice (Optional)</label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={3}
                placeholder="Write specific details (e.g. Doc recommended GOLS hard mattress...)"
                className="w-full px-4 py-3.5 rounded-2xl border border-brand-200/60 text-sm focus:outline-hidden focus:border-accent focus:ring-4 focus:ring-accent/10 bg-neutral-light/50 resize-none text-primary transition-all font-body placeholder:text-neutral-dark/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary bg-primary hover:bg-neutral-dark disabled:bg-neutral-dark/50 active:scale-[0.98] text-white font-accent font-bold text-[13px] tracking-widest uppercase py-4.5 rounded-2xl transition-all shadow-md group cursor-pointer flex items-center justify-center gap-3 mt-4"
          >
            {isSubmitting ? (
              <span>Saving details securely...</span>
            ) : (
              <>Submit <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
            )}
          </button>
        </form>
        </BlurFade>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 space-y-8 relative z-10"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 border border-emerald-200">
            <UserCheck className="w-10 h-10" />
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-3xl text-primary">Diagnostic Callback Booked!</h3>
            <p className="text-neutral-dark/70 text-sm md:text-base mt-4 font-body max-w-sm mx-auto leading-relaxed">
              Hey <strong className="text-primary">{name}</strong>, Suresh has received your clinical diagnostic notes. He will reach out directly on <strong className="text-primary">{phone}</strong> within 12 working hours.
            </p>
          </div>

          <div className="bg-neutral-light/80 p-6 rounded-[2rem] border border-brand-200/60 max-w-md mx-auto flex flex-col items-center justify-center text-center">
            <strong className="font-heading font-bold text-lg text-primary block">Want immediate advice?</strong>
            <p className="font-body text-neutral-dark/70 text-sm mt-2 mb-5">
              You can also reach out to us directly on WhatsApp for a faster response:
            </p>
            <button
              onClick={handleLaunchWhatsApp}
              className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1DA851] active:scale-95 text-white font-accent font-bold text-sm tracking-wide py-3.5 px-8 rounded-2xl cursor-pointer transition-all shadow-lg shadow-[#25D366]/30 w-full md:w-auto"
            >
              <MessageSquare className="w-5 h-5" /> Start WhatsApp Chat
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
