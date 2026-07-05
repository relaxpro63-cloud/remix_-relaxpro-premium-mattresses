import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronDown, Truck, Shield, Award, Calendar } from 'lucide-react';
import BlurFade from '../ui/BlurFade';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  onNavigateToPdp: (slug: string) => void;
}

export default function HeroSlider({ onNavigate }: HeroSliderProps) {
  const handleScrollToShowrooms = () => {
    const el = document.getElementById('locations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('locations');
    }
  };

  return (
    <section
      id="main-content"
      className="relative overflow-hidden h-[90vh] md:h-screen flex items-center noise-overlay bg-primary"
    >
      {/* Full-screen lifestyle background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bedroom.png"
          alt="Serene modern bedroom with a natural organic latex mattress"
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Soft, deep gradient overlay for luxurious text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 relative z-10">
        <div className="max-w-3xl">
          <BlurFade delay={0.1}>
            <span className="inline-flex items-center gap-2 text-accent text-xs font-accent font-bold tracking-[0.25em] uppercase">
              ✨ Handcrafted Dunlop Latex Since 2015
            </span>
          </BlurFade>

          <BlurFade delay={0.2}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-heading font-normal tracking-[-0.02em] leading-[1.1] mt-4 text-white">
              Pure Natural Latex,<br />
              <span className="italic text-accent">From Kerala</span> to Your Bed
            </h1>
          </BlurFade>

          <BlurFade delay={0.3}>
            <p className="text-white/80 font-body text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mt-6">
              GOLS-certified organic latex, zero synthetic fillers or cancer-causing VOCs. Hand-layered for the deepest, most restorative sleep.
            </p>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => onNavigate('catalog')}
                className="w-full sm:w-auto btn-primary bg-accent hover:bg-accent-dark text-primary py-4 px-8 rounded-xl text-xs font-bold font-accent uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                Explore the Collection
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleScrollToShowrooms}
                className="w-full sm:w-auto border border-white/30 hover:border-white/60 hover:bg-white/10 text-white py-4 px-8 rounded-xl text-xs font-bold font-accent uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-accent" />
                Book a Showroom Visit
              </button>
            </div>
          </BlurFade>

          <BlurFade delay={0.5}>
            <div className="flex flex-wrap items-center gap-6 md:gap-8 pt-8 mt-10 border-t border-white/10">
              {[
                { icon: <Truck className="w-4.5 h-4.5 text-accent shrink-0" />, text: 'Free Delivery' },
                { icon: <Shield className="w-4.5 h-4.5 text-accent shrink-0" />, text: '100-Night Sleep Trial' },
                { icon: <Award className="w-4.5 h-4.5 text-accent shrink-0" />, text: '10-Year Replacement Warranty' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-white/90 text-xs font-accent tracking-wider font-semibold whitespace-nowrap"
                >
                  {item.icon}
                  {item.text}
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-20">
        <span className="text-white/30 text-[10px] font-accent uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 text-white/40 animate-bounce-arrow" />
      </div>
    </section>
  );
}
