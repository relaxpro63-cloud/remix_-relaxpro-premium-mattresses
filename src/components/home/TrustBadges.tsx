import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { FadeUp } from '../motion/motionPrimitives';

const certifications = [
  { src: '/images/cert-gols-logo.png', alt: 'GOLS Certified Organic', name: 'GOLS Certified' },
  { src: '/images/cert-iso-logo.png', alt: 'ISO 9001:2015 Certified', name: 'ISO 9001:2015' },
  { src: '/images/cert-oeko-logo.png', alt: 'OEKO-TEX Standard 100', name: 'OEKO-TEX®' },
];

const trustPoints = [
  '100% Natural Latex',
  'Chemical-Free',
  'Factory Direct Pricing',
];

export default function TrustBadges() {
  return (
    <FadeUp>
      <section className="bg-gradient-to-b from-[#F3F9FD] to-white border-t border-[#D5E8F7]/60 py-14 md:py-16 px-4 md:px-8 relative overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Badge */}
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.18em] font-accent font-bold text-[#3D95D6] uppercase bg-brand-50/80 border border-[#3D95D6]/20 px-4 py-1.5 rounded-full shadow-sm">
              <ShieldCheck className="w-3 h-3" /> Certified & Trusted
            </span>
          </div>

          {/* Certification Logos Row */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 md:gap-x-16 gap-y-6 mb-10 md:mb-12">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="flex flex-col items-center gap-2.5"
              >
                <div className="h-20 md:h-24 flex items-center justify-center bg-white rounded-2xl px-8 py-4 shadow-md border border-[#D5E8F7] hover:border-[#3D95D6]/40 hover:shadow-lg transition-all duration-300">
                  <img
                    src={cert.src}
                    alt={cert.alt}
                    className="h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="text-[11px] md:text-xs font-accent font-bold uppercase tracking-widest text-graphite-500">
                  {cert.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Trust Points Divider */}
          <div className="relative flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#3D95D6]/20 to-transparent" />
            {trustPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="relative z-10 bg-[#F3F9FD] px-3 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-[#063D64]" />
                <span className="text-xs sm:text-sm font-accent font-semibold text-graphite-700 whitespace-nowrap">
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </FadeUp>
  );
}
