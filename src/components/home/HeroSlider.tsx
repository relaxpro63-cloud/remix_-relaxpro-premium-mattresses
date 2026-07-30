import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, Shield, Award, Leaf, IndianRupee } from 'lucide-react';
import { getHero, imageUrl } from '../../lib/queries';
import DecorativeBotanicals from './DecorativeBotanicals';

const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;

interface HeroSliderProps {
  onNavigate: (page: string) => void;
}

const trustBadges = [
  { icon: Shield, label: 'GOLS Certified' },
  { icon: Award, label: 'OEKO-TEX® Certified' },
  { icon: Leaf, label: '15+ Years Experience' },
  { icon: IndianRupee, label: 'Made in India' },
];

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const [hero, setHero] = useState<any>(null);

  useEffect(() => {
    getHero().then(d => setHero(d)).catch(() => {});
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const heading = hero?.slides?.[0]?.heading || 'Nature to Your Bed';
  const subtext = hero?.slides?.[0]?.description || 'GOLS-certified organic latex, zero synthetic fillers or cancer-causing VOCs. Handcrafted in Hyderabad and shipped directly to your doorstep.';
  const ctaLabel = hero?.slides?.[0]?.primaryCta?.label || 'Shop Collection';
  const heroImage = imageUrl(hero?.slides?.[0]?.image) || '/images/hero-section.png';

  return (
    <section
      ref={sectionRef}
      id="main-content"
      className="relative min-h-dvh overflow-hidden"
    >
      {/* ============================================ */}
      {/* BOTANICAL ACCENTS — responsive density      */}
      {/* ============================================ */}
      <DecorativeBotanicals density="light" className="z-10 opacity-30 sm:opacity-50 md:opacity-40 2xl:opacity-30" />

      {/* ============================================ */}
      {/* DESKTOP LAYOUT — 40/60 side-by-side         */}
      {/* Shows from md breakpoint (768px) and up     */}
      {/* ============================================ */}
      <div className="hidden md:flex min-h-dvh">
        {/* LEFT — Blue gradient + content (40%) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] 2xl:w-[38%] relative flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1424] via-[#0F1A2E] to-[#0A1628]">
            <div
              className="absolute right-1/3 top-1/2 translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(21,104,163,0.25) 0%, rgba(21,104,163,0.10) 40%, transparent 70%)' }}
            />
            <div className="absolute inset-0 opacity-[0.04] sm:opacity-[0.06]">
              <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
                <path d="M0,400 C200,300 400,500 600,400 S800,300 1000,400 S1100,500 1200,400 L1200,0 L0,0 Z" fill="#6FAEE0" opacity="0.5" />
                <path d="M0,500 C200,400 400,600 600,500 S800,400 1000,500 S1100,600 1200,500 L1200,800 L0,800 Z" fill="#3A8FD2" opacity="0.3" />
                <path d="M0,300 C200,200 400,400 600,300 S800,200 1000,300 S1100,400 1200,300 L1200,800 L0,800 Z" fill="#1568A3" opacity="0.2" />
              </svg>
            </div>
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-brand-300/20"
                  style={{ left: `${20 + i * 15}%`, top: `${15 + (i % 4) * 22}%` }}
                  animate={{ y: [0, -12, 0], opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 5 + i * 0.8, ease: 'easeInOut', repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </div>
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(7,32,56,0.5)] pointer-events-none" />
          </div>

          <div className="absolute inset-y-0 right-0 w-16 lg:w-20 xl:w-24 bg-gradient-to-r from-transparent to-[#0B1424]/90 pointer-events-none z-10" />

          <motion.div
            style={{ opacity: contentOpacity }}
            className="relative z-20 w-full pl-8 lg:pl-16 xl:pl-20 2xl:pl-28 pr-6 lg:pr-10 xl:pr-12 py-16 lg:py-24 xl:py-32 2xl:py-40"
          >
            <div className="max-w-[480px] xl:max-w-[520px] 2xl:max-w-[580px]">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: EASE_LUXURY }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4 lg:mb-6 xl:mb-8"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-400 animate-pulse" />
                <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-accent font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-200">
                  Handcrafted Since 2015
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: EASE_LUXURY, delay: 0.1 }}
                className="font-heading text-[2.5rem] lg:text-[3.2rem] xl:text-[3.8rem] 2xl:text-[4.5rem] leading-[1.05] lg:leading-[1.06] xl:leading-[1.08] tracking-tight text-white"
              >
                {heading}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: EASE_LUXURY, delay: 0.3 }}
                className="font-body text-sm lg:text-base xl:text-lg 2xl:text-xl leading-relaxed mt-4 lg:mt-5 xl:mt-6 text-gray-300 max-w-sm lg:max-w-md font-light"
              >
                {subtext}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_LUXURY, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 lg:mt-8 xl:mt-10"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  onClick={() => onNavigate('catalog')}
                  className="btn-primary text-[11px] lg:text-xs xl:text-sm font-bold font-accent uppercase tracking-[0.12em] lg:tracking-[0.15em] cursor-pointer inline-flex items-center gap-2 lg:gap-3 py-3.5 lg:py-4 xl:py-5 px-6 lg:px-8 xl:px-10 rounded-xl lg:rounded-2xl shadow-2xl shadow-brand-600/30"
                >
                  {ctaLabel}
                  <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 shrink-0" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  onClick={() => onNavigate('builder')}
                  className="text-[11px] lg:text-xs xl:text-sm font-bold font-accent uppercase tracking-[0.12em] lg:tracking-[0.15em] cursor-pointer inline-flex items-center gap-2 lg:gap-3 py-3.5 lg:py-4 xl:py-5 px-6 lg:px-8 xl:px-10 rounded-xl lg:rounded-2xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all duration-300"
                >
                  {hero?.slides?.[0]?.secondaryCta?.label || 'Build Your Mattress'}
                  <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 shrink-0" />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_LUXURY, delay: 0.7 }}
                className="flex flex-wrap gap-2 lg:gap-3 mt-8 lg:mt-10 xl:mt-12 pt-4 lg:pt-6 xl:pt-8 border-t border-white/10"
              >
                {trustBadges.map((badge, i) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 xl:px-4 py-1.5 lg:py-2 xl:py-2.5 rounded-lg lg:rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                      <Icon className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-brand-300" strokeWidth={1.5} />
                      <span className="text-[9px] lg:text-[10px] xl:text-[11px] font-accent font-medium tracking-wide whitespace-nowrap">
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — Image (60%) */}
        <div className="relative w-full lg:w-[55%] xl:w-[60%] 2xl:w-[62%] overflow-hidden">
          <motion.img
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.08, opacity: 1 }}
            transition={{ duration: 2.5, ease: EASE_LUXURY }}
            src={heroImage}
            alt="RelaxPro founder with premium handcrafted natural latex mattress"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '18% center' }}
            sizes="(max-width: 768px) 0vw, 60vw"
            loading="eager"
          />
          <div className="absolute inset-y-0 left-0 w-16 lg:w-20 xl:w-24 bg-gradient-to-r from-[#0B1424]/70 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ============================================ */}
      {/* MOBILE / TABLET LAYOUT — Image stacked      */}
      {/* Shows from 320px up to md breakpoint (768px)*/}
      {/* ============================================ */}
      <div className="md:hidden relative flex flex-col min-h-dvh">
        {/* Image — adjusts height for very small screens */}
        <div className="relative h-[35vh] xs:h-[38vh] sm:h-[42vh] min-h-[260px] xs:min-h-[280px] sm:min-h-[320px] overflow-hidden">
          <img
            src={heroImage}
            alt="RelaxPro founder with premium natural latex mattress"
            className="w-full h-full object-cover"
            style={{ objectPosition: '40% center' }}
            sizes="100vw"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-[#0B1424]" />
        </div>

        {/* Content — responsive padding and spacing */}
        <div className="flex-1 bg-gradient-to-br from-[#0B1424] via-[#0F1A2E] to-[#0A1628] px-4 xs:px-5 sm:px-6 py-5 xs:py-6 sm:py-8 flex flex-col justify-start overflow-y-auto relative z-20">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[9px] xs:text-[10px] sm:text-[11px] font-accent font-semibold uppercase tracking-[0.15em] xs:tracking-[0.2em] text-brand-300 mb-1.5 xs:mb-2"
          >
            Handcrafted Since 2015
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-heading text-xl xs:text-2xl sm:text-3xl leading-[1.15] xs:leading-[1.12] sm:leading-[1.1] text-white"
          >
            {heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xs xs:text-sm text-gray-300 mt-1.5 xs:mt-2 font-light leading-relaxed line-clamp-2 xs:line-clamp-3 sm:line-clamp-none"
          >
            {subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col xs:flex-row gap-2 xs:gap-2.5 mt-3 xs:mt-4"
          >
            <button
              onClick={() => onNavigate('catalog')}
              className="btn-primary text-[10px] xs:text-xs font-bold font-accent uppercase tracking-[0.12em] xs:tracking-[0.15em] py-3 xs:py-3.5 px-5 xs:px-6 rounded-xl xs:rounded-2xl w-full xs:flex-1 text-center flex items-center justify-center gap-1.5 xs:gap-2"
            >
              {ctaLabel}
              <ChevronRight className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('builder')}
              className="text-[10px] xs:text-xs font-bold font-accent uppercase tracking-[0.12em] xs:tracking-[0.15em] py-3 xs:py-3.5 px-5 xs:px-6 rounded-xl xs:rounded-2xl border border-white/20 text-white/70 w-full xs:flex-1 text-center"
            >
              {hero?.slides?.[0]?.secondaryCta?.label || 'Build Your Mattress'}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-1.5 xs:gap-2 mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-white/10"
          >
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="inline-flex items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 py-1 xs:py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <Icon className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-brand-300" strokeWidth={1.5} />
                  <span className="text-[8px] xs:text-[9px] sm:text-[10px] text-white/60 font-medium">{badge.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
