import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { FadeUp } from '../../components/motion/motionPrimitives';
import DecorativeBotanicals from '../../components/home/DecorativeBotanicals';
import ConsultationForm from '../../components/home/ConsultationForm';
import ShowroomBookingForm from '../../components/home/ShowroomBookingForm';
import PageShell from '../../components/layout/PageShell';
import { getContactPage } from '../../lib/queries';

export default function ContactPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getContactPage().then(d => setData(d)).catch(() => {});
  }, []);

  return (
    <PageShell
      title={data?.seo?.metaTitle || 'Contact Suresh & Get Orthopedic Sleep Advice | RelaxPro'}
      description={data?.seo?.metaDescription || 'Request a free diagnostic sleep consultation callback. Suresh will review your orthopedic concerns and customize the perfect mattress configuration.'}
    >
      <div className="relative overflow-hidden">
      <DecorativeBotanicals density="light" />
      <section className="section-light-lux py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <FadeUp>
          <div className="mb-12 max-w-2xl text-ink-900">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
              Professional guidance
            </span>
            <h1 className="rp-display mt-5">{data?.heading || 'Submit your sleep concern'}</h1>
            <p className="rp-body mt-4">
              {data?.description || 'Share your posture, pain, size, and comfort needs. Suresh will review the details and recommend the right mattress configuration.'}
            </p>
          </div>
          </FadeUp>
        </div>
      </section>

      {/* Showroom Booking + Consultation Forms - Side by Side */}
      <section className="bg-sky-100/20 py-16 md:py-24 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-100/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <FadeUp className="text-center mb-12">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
              Let's Connect
            </span>
            <h2 className="rp-display mt-4 text-ink-900">Book a Visit or Get Advice</h2>
            <p className="rp-body mt-3 max-w-xl mx-auto">
              Reserve a private showroom tour or request a callback from Suresh for personalized mattress recommendations.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <ShowroomBookingForm />
            </div>
            <div>
              <ConsultationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info + Map */}
      <section className="bg-secondary py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <FadeUp>
              <div className="space-y-6">
                <span className="eyebrow">Get in Touch</span>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-ink-900 leading-tight">
                  We're Here to Help You Sleep Better
                </h3>
                
                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-sky-50 border border-brand-200/40">
                    <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-accent font-bold text-sm text-ink-900">RelaxPro Factory Showroom</p>
                      <p className="text-sm text-graphite-500 font-body mt-0.5">Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad, Telangana - 500055</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-sky-50 border border-brand-200/40">
                    <Phone className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-accent font-bold text-sm text-ink-900">Phone / WhatsApp</p>
                      <p className="text-sm text-graphite-500 font-body mt-0.5">+91 86866 24494<br />+91 72074 24494</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-sky-50 border border-brand-200/40">
                    <Mail className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-accent font-bold text-sm text-ink-900">Email</p>
                      <p className="text-sm text-graphite-500 font-body mt-0.5">relaxpro2022@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-sky-50 border border-brand-200/40">
                    <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-accent font-bold text-sm text-ink-900">Business Hours</p>
                      <p className="text-sm text-graphite-500 font-body mt-0.5">Monday - Sunday: 10:00 AM - 9:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Map */}
            <FadeUp delay={0.2}>
              <div className="rounded-2xl overflow-hidden border border-brand-200/40 shadow-sm h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3804.640936998565!2d78.463397!3d17.504569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDMwJzE2LjQiTiA3OMKwMjcnNDguMiJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RelaxPro Hyderabad Factory Showroom Location"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Shuddha Banner CTA */}
      <FadeUp>
        <section className="bg-secondary pb-12 md:pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.button
              onClick={() => window.location.href = '/catalog'}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg shadow-brand-500/5 border border-brand-200/30 cursor-pointer group text-left"
            >
              <img
                src="/images/shuddha-banner.png"
                alt="Shuddha Premium Collection — Click to explore"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-ink-900 font-bold text-xs md:text-sm px-4 md:px-6 py-2.5 md:py-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-400">
                <ShoppingBag className="w-4 h-4" />
                Explore Collection
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        </section>
      </FadeUp>
      </div>
    </PageShell>
  );
}
