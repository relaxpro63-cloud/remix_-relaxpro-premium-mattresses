import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, Calendar, Award, Shield, Truck, Sparkles, ChevronDown } from 'lucide-react';
import { RevealText, FadeUp, GoldShimmer, ScrollIndicator, EASE_LUXURY } from '../motion/motionPrimitives';
import { getHero, imageUrl } from '../../lib/queries';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  onNavigateToPdp: (slug: string) => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const [hero, setHero] = useState<any>(null);
  const trustIconMap: Record<string, any> = { truck: Truck, shield: Shield, award: Award };

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

  const handleScrollToShowrooms = () => {
    const el = document.getElementById('showroom-booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('showroom-booking-section');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="main-content"
      className="relative overflow-hidden min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0F1F17' }}
    >
      {/* Ken Burns Hero Background — slow 20s scale cycle */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.08, opacity: 0.7 }}
          transition={{ duration: 2.5, ease: EASE_LUXURY }}
          style={{ scale: imageScale, y: imageY }}
          src={imageUrl(hero?.slides?.[0]?.image) || '/images/hero-bedroom.png'}
          alt="Serene organic bedroom featuring a handcrafted RelaxPro natural latex mattress"
          className="w-full h-full object-cover select-none pointer-events-none will-change-transform"
          loading="eager"
        />
        {/* Rich cinematic gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, rgba(15, 31, 23, 0.94) 0%, rgba(15, 31, 23, 0.7) 50%, rgba(15, 31, 23, 0.2) 100%)',
          }}
        />
      </div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="max-w-7xl mx-auto w-full px-6 md:px-16 relative z-10 flex flex-col justify-center min-h-[85vh] py-32"
      >
        <div className="max-w-3xl">
          {/* Subtitle Accent — icon replaces emoji */}
          <FadeUp delay={0.1}>
            <span
              className="inline-flex items-center gap-2.5 text-[10px] font-accent font-bold tracking-[0.25em] uppercase"
              style={{ color: '#C9A87C' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {hero?.slides?.[0]?.badge || 'Handcrafted Dunlop Latex Since 2015'}
            </span>
          </FadeUp>

          {/* Heading with word-by-word reveal */}
          <div className="mt-6 drop-shadow-lg">
            <RevealText
              as="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-heading font-normal tracking-[-0.02em] leading-[1.08] text-white"
              delay={0.3}
              stagger={0.1}
            >
              {hero?.slides?.[0]?.heading || 'Pure Natural Latex,'}
            </RevealText>
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.9, ease: EASE_LUXURY, delay: 1.0 }}
              >
                <GoldShimmer delay={2.0}>
                  <span
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-heading italic font-normal tracking-[-0.02em] leading-[1.08]"
                    style={{ color: '#C9A87C' }}
                  >
                    {hero?.slides?.[0]?.highlight || 'From Kerala'}
                  </span>
                </GoldShimmer>
                <span
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-heading font-normal tracking-[-0.02em] leading-[1.08]"
                  style={{ color: '#F5F2EB' }}
                >
                  {' '}{hero?.slides?.[0]?.subheading || 'to Your Bed'}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Description */}
          <FadeUp delay={0.6} y={30}>
            <p
              className="font-body text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mt-8"
              style={{ color: '#F5F2EB', opacity: 0.85 }}
            >
              {hero?.slides?.[0]?.description || 'GOLS-certified organic latex, zero synthetic fillers or cancer-causing VOCs. Hand-layered for the deepest, most restorative sleep.'}
            </p>
          </FadeUp>

          {/* Buttons with spring hover */}
          <FadeUp delay={0.8} y={24}>
            <div className="flex flex-col sm:flex-row gap-5 pt-8">
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                onClick={() => onNavigate('catalog')}
                className="w-full sm:w-auto text-xs font-bold font-accent uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 py-4.5 px-10 rounded-xl transition-all shadow-lg"
                style={{ backgroundColor: '#C9A87C', color: '#0F1F17' }}
              >
                {hero?.slides?.[0]?.primaryCta?.label || 'Explore the Collection'}
                <ChevronRight className="w-4 h-4 shrink-0" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                onClick={handleScrollToShowrooms}
                className="w-full sm:w-auto border border-white/20 hover:border-white/50 text-xs font-bold font-accent uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 py-4.5 px-10 rounded-xl transition-all bg-white/5 backdrop-blur-md"
                style={{ color: '#F5F2EB' }}
              >
                <Calendar className="w-4 h-4" style={{ color: '#C9A87C' }} />
                {hero?.slides?.[0]?.secondaryCta?.label || 'Book a Showroom Visit'}
              </motion.button>
            </div>
          </FadeUp>

          {/* Trust Badges — stagger in */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.12, delayChildren: 1.2 },
              },
            }}
            className="flex flex-wrap items-center gap-8 md:gap-12 pt-10 mt-14 border-t border-white/10"
          >
            {(hero?.slides?.[0]?.trustBadges || [
              { icon: 'truck', text: 'Free Delivery' },
              { icon: 'shield', text: '100-Night Sleep Trial' },
              { icon: 'award', text: '10-Year Replacement Warranty' },
            ]).map((item: any, idx: number) => {
              const IconComp = trustIconMap[item.icon] || Shield;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 0.9, y: 0, transition: { duration: 0.6, ease: EASE_LUXURY } },
                  }}
                  className="flex items-center gap-3 text-xs font-accent tracking-wider font-semibold whitespace-nowrap"
                  style={{ color: '#F5F2EB' }}
                >
                  <IconComp className="w-5 h-5 shrink-0" style={{ color: '#C9A87C' }} />
                  {item.text}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ScrollIndicator />
        </div>
      </motion.div>
    </section>
  );
}
