import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { ChevronRight, Shield, Award, Leaf, IndianRupee, ShieldCheck, Sparkles, Truck, RefreshCcw, CheckCircle, Heart, BadgeCheck, FlameKindling, ShieldAlert } from 'lucide-react';
import { getHero, imageUrl } from '../../lib/queries';
import { urlFor } from '../../lib/sanity';
import DecorativeBotanicals from './DecorativeBotanicals';
import { RevealText } from '../motion/motionPrimitives';
import { useMagnetic } from '../../lib/animations';

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

const floatingTrustBadges = [
  { icon: Leaf, label: '100% Natural Latex', position: 'top-[40%] right-[3%]', rotate: -2, delay: 0.7 },
  { icon: ShieldCheck, label: 'GOLS Certified', position: 'top-[57%] right-[8%]', rotate: 1, delay: 0.85 },
  { icon: Sparkles, label: 'Handmade Since 2015', position: 'bottom-[9%] right-[2%]', rotate: -1, delay: 1 },
];

// Sanity stores badge icons as lucide name strings — map them to components.
const iconMap: Record<string, any> = {
  Shield, ShieldCheck, Award, Leaf, IndianRupee, Truck, RefreshCcw,
  CheckCircle, Heart, BadgeCheck, Sparkles, FlameKindling, ShieldAlert,
};

// Trial/warranty/refund promises are no longer offered — drop such badges
// even if someone adds them in the CMS.
const REMOVED_BADGE_TERMS = ['warranty', 'trial', 'refund', 'return policy', '100-night', '10-year'];

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const [hero, setHero] = useState<any>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    getHero().then(d => setHero(d)).catch(() => {});
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const magneticPrimaryRef = useMagnetic<HTMLSpanElement>(10);
  const magneticSecondaryRef = useMagnetic<HTMLSpanElement>(10);

  const heroImgWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = heroImgWrapRef.current;
    if (!wrap || reduce) return;

    const ctx = gsap.context(() => {
      // Unveil: the photo emerges from behind a soft inset mask on load —
      // a separate CSS property from the img's own Framer scale/opacity
      // entrance, so the two engines never fight over the same value.
      gsap.fromTo(
        wrap,
        { clipPath: 'inset(6% 6% 6% 6%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.out', delay: 0.15 }
      );

      // Scroll-scrub: the frame itself creeps in slightly further as the
      // user scrolls past the hero, on top of the photo's own zoom.
      gsap.fromTo(
        wrap,
        { scale: 1 },
        {
          scale: 1.04,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
        }
      );
    }, wrap);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const heading = 'RelaxPro';
  const subheading = 'Luxury Natural Latex Mattresses';
  const subtext = hero?.slides?.[0]?.description || 'GOLS-certified organic latex, handcrafted in Hyderabad and delivered to your door.';
  const ctaLabel = hero?.slides?.[0]?.primaryCta?.label || 'Explore Collection';
  const heroImg = hero?.slides?.[0]?.image || null;
  const heroImage = heroImg ? imageUrl(heroImg) : '/images/hero-section.webp';
  const heroSrcSet = heroImg
    ? [640, 828, 1200, 1600, 1920].map(w => `${urlFor(heroImg).width(w).auto('format').quality(80).url()} ${w}w`).join(', ')
    : '';
  const eyebrow = hero?.slides?.[0]?.badge || 'Handcrafted Since 2015';

  const heroTrustBadges = (hero?.slides?.[0]?.trustBadges || [])
    .filter((b: any) => {
      const t = (b?.text || '').toLowerCase();
      return !REMOVED_BADGE_TERMS.some(term => t.includes(term));
    })
    .map((b: any) => ({ ...b, iconComponent: iconMap[b.icon] || Shield }));
  const displayTrustBadges = heroTrustBadges.length ? heroTrustBadges : trustBadges;

  return (
    <section
      ref={sectionRef}
      id="main-content"
      className="relative overflow-hidden"
    >
      {/* ============================================ */}
      {/* DESKTOP LAYOUT — 40/60 side-by-side         */}
      {/* Shows from md breakpoint (768px) and up     */}
      {/* ============================================ */}
      <div className="hidden md:flex min-h-dvh">
        {/* LEFT — Blue gradient + content (40%) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] 2xl:w-[38%] relative flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#05080D] via-[#0A1120] to-[#063D64]">
            <div
              className="absolute right-1/3 top-1/2 translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,94,157,0.32) 0%, rgba(0,94,157,0.14) 40%, transparent 70%)' }}
            />
            <div className="absolute inset-0 opacity-[0.04] sm:opacity-[0.06]">
              <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
                <path d="M0,400 C200,300 400,500 600,400 S800,300 1000,400 S1100,500 1200,400 L1200,0 L0,0 Z" fill="#75B7E6" opacity="0.5" />
                <path d="M0,500 C200,400 400,600 600,500 S800,400 1000,500 S1100,600 1200,500 L1200,800 L0,800 Z" fill="#3D95D6" opacity="0.3" />
                <path d="M0,300 C200,200 400,400 600,300 S800,200 1000,300 S1100,400 1200,300 L1200,800 L0,800 Z" fill="#005E9D" opacity="0.2" />
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
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(4,32,58,0.55)] pointer-events-none" />
          </div>

          <div className="absolute inset-0 z-[1] pointer-events-none">
            <DecorativeBotanicals density="light" />
          </div>

          <div className="absolute inset-y-0 right-0 w-16 lg:w-20 xl:w-24 bg-gradient-to-r from-transparent to-[#05080D]/90 pointer-events-none z-10" />

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
                  {eyebrow}
                </span>
              </motion.div>

              <h1 className="font-heading text-[2.5rem] lg:text-[3.2rem] xl:text-[3.8rem] 2xl:text-[4.5rem] leading-[1.05] lg:leading-[1.06] xl:leading-[1.08] tracking-tight text-white">
                <RevealText as="span" className="block" delay={0.1} splitBy="words">
                  {heading}
                </RevealText>
                <RevealText as="span" className="block text-gradient-brand" delay={0.22} splitBy="words">
                  {subheading}
                </RevealText>
              </h1>

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
                <span ref={magneticPrimaryRef} className="inline-block">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    onClick={() => onNavigate('catalog')}
                    className="btn-primary text-[11px] lg:text-xs xl:text-sm font-bold font-accent uppercase tracking-[0.12em] lg:tracking-[0.15em] cursor-pointer inline-flex items-center gap-2 lg:gap-3 py-3.5 lg:py-4 xl:py-5 px-6 lg:px-8 xl:px-10 rounded-xl lg:rounded-2xl shadow-2xl shadow-brand-600/30"
                    data-cursor-label="Explore"
                  >
                    {ctaLabel}
                    <ChevronRight className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 shrink-0" />
                  </motion.button>
                </span>

                <span ref={magneticSecondaryRef} className="inline-block">
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
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_LUXURY, delay: 0.7 }}
                className="flex flex-wrap gap-2 lg:gap-3 mt-8 lg:mt-10 xl:mt-12 pt-4 lg:pt-6 xl:pt-8 border-t border-white/10"
              >
                {displayTrustBadges.map((badge, i) => {
                  const Icon = badge.iconComponent || Shield;
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
        <div ref={heroImgWrapRef} className="relative w-full lg:w-[55%] xl:w-[60%] 2xl:w-[62%] overflow-hidden">
          <motion.img
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1.08, opacity: 1 }}
            transition={{ duration: 2.5, ease: EASE_LUXURY }}
            src={heroImage}
            srcSet={heroSrcSet || undefined}
            sizes="(max-width: 768px) 0vw, 60vw"
            alt="RelaxPro founder with premium handcrafted natural latex mattress"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '18% center' }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {/* Breathing ambient blue glow — screen-blended over the photo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen z-[1]">
            <div
              className="ambient-breathe w-[68%] h-[74%] rounded-full"
              style={{
                background: 'radial-gradient(ellipse 50% 50% at center, rgba(22,133,197,0.34) 0%, rgba(0,94,157,0.12) 45%, transparent 72%)',
                filter: 'blur(70px)',
              }}
            />
          </div>
          <div className="absolute inset-y-0 left-0 w-16 lg:w-20 xl:w-24 bg-gradient-to-r from-[#05080D]/70 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ============================================ */}
      {/* MOBILE / TABLET LAYOUT — Image stacked      */}
      {/* Shows from 320px up to md breakpoint (768px)*/}
      {/* ============================================ */}
      <div className="md:hidden relative flex flex-col min-h-[100dvh]">
        {/* Botanicals reduced to a faint watermark behind the photo — the mobile
            hero's negative space is for informative trust badges, not decoration */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <DecorativeBotanicals density="light" className="opacity-[0.06]! scale-[0.7]! translate-x-10!" />
        </div>
        {/* Image — adjusts height for very small screens */}
        <div className="relative h-[36vh] xs:h-[40vh] sm:h-[44vh] min-h-[280px] xs:min-h-[300px] sm:min-h-[330px] overflow-hidden">
          <motion.img
            initial={reduce ? { opacity: 0 } : { scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: reduce ? 0.3 : 1.4, ease: EASE_LUXURY }}
            src={heroImage}
            srcSet={heroSrcSet || undefined}
            sizes="100vw"
            alt="RelaxPro founder with premium natural latex mattress"
            className="w-full h-full object-cover"
            style={{ objectPosition: '40% center' }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-[#063D64]" />

          {/* Floating trust badges — fill the right-side negative space beside the
              subject, informative instead of decorative (glassmorphism) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {floatingTrustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE_LUXURY, delay: badge.delay }}
                  className={`absolute ${badge.position}`}
                >
                  <motion.div
                    animate={reduce ? { rotate: badge.rotate } : { y: [0, -5, 0], rotate: badge.rotate }}
                    transition={reduce ? undefined : { duration: 4 + i, ease: 'easeInOut', repeat: Infinity, delay: i * 0.6 }}
                    className="inline-flex items-center gap-1.5 xs:gap-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md px-2.5 xs:px-3 py-1.5 xs:py-2 shadow-lg shadow-black/25"
                  >
                    <Icon className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-brand-300" strokeWidth={1.75} />
                    <span className="text-[9px] xs:text-[10px] font-accent font-semibold text-white/90 whitespace-nowrap tracking-wide">
                      {badge.label}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Content — responsive padding and spacing */}
        <div className="flex-1 bg-gradient-to-br from-[#05080D] via-[#0A1120] to-[#063D64] px-4 xs:px-5 sm:px-6 py-5 xs:py-6 sm:py-8 flex flex-col justify-center overflow-y-auto relative z-20">
          <div className="w-full flex flex-col">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[9px] xs:text-[10px] sm:text-[11px] font-accent font-semibold uppercase tracking-[0.15em] xs:tracking-[0.2em] text-brand-300 mb-1.5 xs:mb-2"
          >
            {eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-heading text-xl xs:text-2xl sm:text-3xl leading-[1.15] xs:leading-[1.12] sm:leading-[1.1] text-white"
          >
            {heading}
            <span className="block text-gradient-brand">{subheading}</span>
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
            {displayTrustBadges.map((badge, i) => {
              const Icon = badge.iconComponent || Shield;
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
      </div>
    </section>
  );
}
