import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { FadeUp, EASE_LUXURY } from '../motion/motionPrimitives';
import { getHero, imageUrl } from '../../lib/queries';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  onNavigateToPdp: (slug: string) => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const [hero, setHero] = useState<any>(null);

  useEffect(() => {
    getHero().then(d => setHero(d)).catch(() => {});
  }, []);

  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: image slowly scales down and shifts as user scrolls past hero
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="main-content"
      className="hero-ink relative overflow-hidden min-h-screen flex items-center justify-center"
    >
      {/* Ken Burns Hero Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.08, opacity: 1 }}
          transition={{ duration: 2.5, ease: EASE_LUXURY }}
          style={{ scale: imageScale, y: imageY }}
          src={imageUrl(hero?.slides?.[0]?.image) || '/images/hero-banner.png'}
          alt="Serene organic bedroom featuring a handcrafted RelaxPro natural latex mattress"
          className="w-full h-full object-cover select-none pointer-events-none will-change-transform"
          sizes="100vw"
          loading="eager"
        />
        {/* Cinematic gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, rgba(11, 18, 32, 0.75) 0%, rgba(11, 18, 32, 0.35) 50%, rgba(11, 18, 32, 0.15) 100%)',
          }}
        />
      </div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="max-w-7xl mx-auto w-full px-6 md:px-16 relative z-10 flex flex-col justify-center min-h-[85vh] py-32"
      >
        <div className="max-w-3xl">
          {/* Short heading — minimal, clean */}
          <FadeUp delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-heading font-normal tracking-[-0.02em] leading-[1.08] text-white drop-shadow-lg">
              {hero?.slides?.[0]?.heading || 'Sleep Pure. Sleep Natural.'}
            </h1>
          </FadeUp>

          {/* One line offer — replaces long description */}
          <FadeUp delay={0.5} y={20}>
            <p className="font-body text-base sm:text-lg md:text-xl max-w-xl leading-snug mt-6 text-brand-200 font-medium">
              {hero?.slides?.[0]?.description || 'GOLS-Certified Organic Latex Mattresses — Save Up to 30%'}
            </p>
          </FadeUp>

          {/* Single button — SHOP NOW */}
          <FadeUp delay={0.7} y={20}>
            <div className="pt-8">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                onClick={() => onNavigate('catalog')}
                className="btn btn-primary text-xs sm:text-sm font-bold font-accent uppercase tracking-[0.15em] cursor-pointer inline-flex items-center gap-3 py-5 px-10 md:px-12 rounded-2xl shadow-2xl shadow-brand-600/25"
              >
                {hero?.slides?.[0]?.primaryCta?.label || 'SHOP NOW'}
                <ChevronRight className="w-4 h-4 shrink-0" />
              </motion.button>
            </div>
          </FadeUp>
        </div>
      </motion.div>
    </section>
  );
}
