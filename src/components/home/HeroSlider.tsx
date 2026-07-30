import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, Shield, Award, Leaf, IndianRupee } from 'lucide-react';
import { getHero, imageUrl } from '../../lib/queries';
import DecorativeBotanicals from './DecorativeBotanicals';

const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  onNavigateToPdp: (slug: string) => void;
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

  const heading = hero?.slides?.[0]?.heading || 'Sleep Pure. Sleep Natural.';
  const subtext = hero?.slides?.[0]?.description || 'Experience handcrafted 100% Natural Latex Mattresses designed for healthier sleep, orthopedic support, and lasting luxury.';
  const ctaLabel = hero?.slides?.[0]?.primaryCta?.label || 'Shop Collection';
  const heroImage = imageUrl(hero?.slides?.[0]?.image) || '/images/hero-banner.png';

  return (
    <section
      ref={sectionRef}
      id="main-content"
      className="relative min-h-screen flex overflow-hidden"
    >
      {/* ============================================ */}
      {/* BOTANICAL ACCENTS — Full section width      */}
      {/* ============================================ */}
      <DecorativeBotanicals density="light" />

      {/* ============================================ */}
      {/* LEFT SIDE — Content + Blue Gradient (40%)   */}
      {/* ============================================ */}
      <div className="w-full md:w-[40%] min-h-screen relative flex items-center overflow-hidden">
        {/* Deep blue gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1424] via-[#0F1A2E] to-[#0A1628]">
          {/* Radial glow behind text */}
          <div
            className="absolute right-1/3 top-1/2 translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(21,104,163,0.25) 0%, rgba(21,104,163,0.10) 40%, transparent 70%)' }}
          />
          
          {/* Organic wave pattern */}
          <div className="absolute inset-0 opacity-[0.06]">
            <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
              <path d="M0,400 C200,300 400,500 600,400 S800,300 1000,400 S1100,500 1200,400 L1200,0 L0,0 Z" fill="#6FAEE0" opacity="0.5" />
              <path d="M0,500 C200,400 400,600 600,500 S800,400 1000,500 S1100,600 1200,500 L1200,800 L0,800 Z" fill="#3A8FD2" opacity="0.3" />
              <path d="M0,300 C200,200 400,400 600,300 S800,200 1000,300 S1100,400 1200,300 L1200,800 L0,800 Z" fill="#1568A3" opacity="0.2" />
            </svg>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-brand-300/20"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${15 + (i % 4) * 22}%`,
                }}
                animate={{
                  y: [0, -12, 0],
                  opacity: [0.15, 0.35, 0.15],
                }}
                transition={{
                  duration: 5 + i * 0.8,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          {/* Gentle vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(7,32,56,0.5)] pointer-events-none" />
        </div>

        {/* Smooth edge fade — blends content bg into image seamlessly */}
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#0B1424]/90 pointer-events-none z-10" />

        {/* =============================== */}
        {/* CONTENT BLOCK */}
        {/* =============================== */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative z-20 w-full pl-10 md:pl-16 lg:pl-28 pr-8 md:pr-12 py-24 md:py-32"
        >
          <div className="max-w-[520px]">
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE_LUXURY }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span className="text-[11px] font-accent font-semibold uppercase tracking-[0.2em] text-brand-200">
                Handcrafted Since 2015
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE_LUXURY, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4.2rem] leading-[1.08] tracking-tight text-white"
            >
              {heading}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASE_LUXURY, delay: 0.3 }}
              className="font-body text-base sm:text-lg leading-relaxed mt-6 text-gray-300 max-w-md font-light"
            >
              {subtext}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_LUXURY, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                onClick={() => onNavigate('catalog')}
                className="btn-primary text-xs sm:text-sm font-bold font-accent uppercase tracking-[0.15em] cursor-pointer inline-flex items-center gap-3 py-5 px-10 rounded-2xl shadow-2xl shadow-brand-600/30"
              >
                {ctaLabel}
                <ChevronRight className="w-4 h-4 shrink-0" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                onClick={() => onNavigate('builder')}
                className="text-xs sm:text-sm font-bold font-accent uppercase tracking-[0.15em] cursor-pointer inline-flex items-center gap-3 py-5 px-10 rounded-2xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all duration-300"
              >
                {hero?.slides?.[0]?.secondaryCta?.label || 'Build Your Mattress'}
                <ChevronRight className="w-4 h-4 shrink-0" />
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_LUXURY, delay: 0.7 }}
              className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-white/10"
            >
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    <Icon className="w-3.5 h-3.5 text-brand-300" strokeWidth={1.5} />
                    <span className="text-[11px] font-accent font-medium tracking-wide whitespace-nowrap">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* RIGHT SIDE — Founder + Mattress Image (60%) */}
      {/* ============================================ */}
      <div className="hidden md:block relative w-[60%] min-h-screen overflow-hidden">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.08, opacity: 1 }}
          transition={{ duration: 2.5, ease: EASE_LUXURY }}
          src={heroImage}
          alt="RelaxPro founder with premium handcrafted natural latex mattress"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '18% center' }}
          sizes="60vw"
          loading="eager"
        />
        {/* Subtle edge fade to left */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B1424]/70 to-transparent pointer-events-none" />
      </div>

      {/* ============================================ */}
      {/* MOBILE — Stack image above content           */}
      {/* ============================================ */}
      <div className="md:hidden absolute inset-0 flex flex-col">
        {/* Image at top */}
        <div className="relative h-[45vh] overflow-hidden">
          <img
            src={heroImage}
            alt="RelaxPro founder with premium natural latex mattress"
            className="w-full h-full object-cover"
            style={{ objectPosition: '40% center' }}
            loading="eager"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0B1424]" />
        </div>

        {/* Content below */}
        <div className="flex-1 bg-gradient-to-br from-[#0B1424] via-[#0F1A2E] to-[#0A1628] px-6 py-8 flex flex-col justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] font-accent font-semibold uppercase tracking-[0.2em] text-brand-300 mb-3"
          >
            Handcrafted Since 2015
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-heading text-3xl leading-[1.1] text-white"
          >
            {heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-gray-300 mt-3 font-light leading-relaxed"
          >
            {subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col gap-3 mt-6"
          >
            <button
              onClick={() => onNavigate('catalog')}
              className="btn-primary text-xs font-bold font-accent uppercase tracking-[0.15em] py-4 px-8 rounded-2xl w-full text-center flex items-center justify-center gap-2"
            >
              {ctaLabel}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('builder')}
              className="text-xs font-bold font-accent uppercase tracking-[0.15em] py-4 px-8 rounded-2xl border border-white/20 text-white/70 w-full text-center"
            >
              {hero?.slides?.[0]?.secondaryCta?.label || 'Build Your Mattress'}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10"
          >
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <Icon className="w-3 h-3 text-brand-300" strokeWidth={1.5} />
                  <span className="text-[10px] text-white/60 font-medium">{badge.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
