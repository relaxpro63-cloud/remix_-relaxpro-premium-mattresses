import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { RevealText, FadeUp, EASE_LUXURY } from '../motion/motionPrimitives';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  onNavigateToPdp: (slug: string) => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

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
      className="relative overflow-hidden min-h-[100dvh] flex items-center justify-center bg-primary"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.08, opacity: 0.7 }}
          transition={{ duration: 2.5, ease: EASE_LUXURY }}
          style={{ scale: imageScale, y: imageY }}
          src="/images/hero-bedroom.png"
          alt="Serene organic bedroom featuring a handcrafted RelaxPro natural latex mattress"
          className="w-full h-full object-cover select-none pointer-events-none will-change-transform"
          loading="eager"
          fetchPriority="high"
          width="1920"
          height="1080"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, rgba(15, 31, 23, 0.94) 0%, rgba(15, 31, 23, 0.7) 50%, rgba(15, 31, 23, 0.2) 100%)',
          }}
        />
      </div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="max-w-7xl mx-auto w-full px-6 md:px-16 relative z-10 flex flex-col justify-center min-h-[100dvh] py-24 md:py-32"
      >
        <div className="max-w-3xl">
          <div className="mt-6 drop-shadow-lg">
            <RevealText
              as="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-heading font-normal tracking-[-0.02em] leading-[1.08] text-warm-white"
              delay={0.2}
              stagger={0.08}
            >
              Pure Natural Latex,
            </RevealText>
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.9, ease: EASE_LUXURY, delay: 0.8 }}
              >
                <span
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-heading italic font-normal tracking-[-0.02em] leading-[1.08] text-accent"
                >
                  From Kerala
                </span>
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-heading font-normal tracking-[-0.02em] leading-[1.08] text-warm-white">
                  {' '}to Your Bed
                </span>
              </motion.div>
            </div>
          </div>

          <FadeUp delay={0.5} y={24}>
            <p className="font-body text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mt-6 text-warm-white/80">
              GOLS-certified organic latex crafted in Kerala. Zero synthetic fillers. Hand-layered for the deepest, most restorative sleep.
            </p>
          </FadeUp>

          <FadeUp delay={0.7} y={20}>
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3, ease: EASE_LUXURY }}
                onClick={() => onNavigate('catalog')}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 text-xs font-bold font-accent uppercase tracking-widest cursor-pointer py-4 px-8 rounded-full transition-[transform,background-color,box-shadow] duration-200 ease-out shadow-lg bg-accent text-primary hover:bg-accent-dark"
              >
                <span>Explore the Collection</span>
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3, ease: EASE_LUXURY }}
                onClick={handleScrollToShowrooms}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 border border-white/20 hover:border-white/50 text-xs font-bold font-accent uppercase tracking-widest cursor-pointer py-4 px-8 rounded-full transition-[transform,border-color,background-color] duration-200 ease-out bg-white/5 backdrop-blur-md text-warm-white"
              >
                <Calendar className="w-4 h-4 text-accent" />
                Book a Showroom Visit
              </motion.button>
            </div>
          </FadeUp>
        </div>
      </motion.div>
    </section>
  );
}
