import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Calendar, Award, Shield, Truck } from 'lucide-react';

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

  const easeCurve = [0.22, 1, 0.36, 1];

  return (
    <section
      id="main-content"
      className="relative overflow-hidden min-h-screen flex items-center justify-center py-24 md:py-36"
      style={{ backgroundColor: '#1A2421' }}
    >
      {/* Parallax / Ken Burns Hero Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.35 }}
          transition={{ duration: 2.2, ease: easeCurve }}
          src="/images/hero-bedroom.png"
          alt="Serene organic bedroom featuring a handcrafted RelaxPro natural latex mattress"
          className="w-full h-full object-cover select-none pointer-events-none"
          loading="eager"
        />
        {/* Soft designer gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(26, 36, 33, 0.95) 0%, rgba(26, 36, 33, 0.75) 50%, rgba(26, 36, 33, 0.98) 100%)'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-16 relative z-10 flex flex-col justify-center min-h-[70vh]">
        <div className="max-w-3xl">
          {/* Subtitle Accent */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: easeCurve, delay: 0.1 }}
          >
            <span 
              className="inline-flex items-center gap-2 text-xs font-accent font-bold tracking-[0.25em] uppercase text-accent"
              style={{ color: '#C9A87C' }}
            >
              ✨ Handcrafted Dunlop Latex Since 2015
            </span>
          </motion.div>

          {/* Heading with Premium Serif */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: easeCurve, delay: 0.25 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-heading font-serif font-normal tracking-[-0.02em] leading-[1.08] mt-6"
            style={{ color: '#F5F2EB' }}
          >
            Pure Natural Latex,<br />
            <span className="italic" style={{ color: '#C9A87C' }}>From Kerala</span> to Your Bed
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: easeCurve, delay: 0.4 }}
            className="font-body text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mt-8"
            style={{ color: '#F5F2EB', opacity: 0.85 }}
          >
            GOLS-certified organic latex, zero synthetic fillers or cancer-causing VOCs. Hand-layered for the deepest, most restorative sleep.
          </motion.p>

          {/* Buttons with Magnetic-Like Hover */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease: easeCurve, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-5 pt-8"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={() => onNavigate('catalog')}
              className="w-full sm:w-auto text-xs font-bold font-accent uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 py-4.5 px-10 rounded-xl transition-all shadow-lg"
              style={{ backgroundColor: '#C9A87C', color: '#1A2421' }}
            >
              Explore the Collection
              <ChevronRight className="w-4 h-4 shrink-0" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={handleScrollToShowrooms}
              className="w-full sm:w-auto border border-white/20 hover:border-white/50 text-xs font-bold font-accent uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 py-4.5 px-10 rounded-xl transition-all bg-white/5 backdrop-blur-md"
              style={{ color: '#F5F2EB' }}
            >
              <Calendar className="w-4 h-4 animate-pulse" style={{ color: '#C9A87C' }} />
              Book a Showroom Visit
            </motion.button>
          </motion.div>

          {/* Luxury Badge Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 1.6, ease: easeCurve, delay: 0.7 }}
            className="flex flex-wrap items-center gap-8 md:gap-12 pt-10 mt-14 border-t border-white/10"
          >
            {[
              { icon: <Truck className="w-5 h-5 shrink-0" style={{ color: '#C9A87C' }} />, text: 'Free Delivery' },
              { icon: <Shield className="w-5 h-5 shrink-0" style={{ color: '#C9A87C' }} />, text: '100-Night Sleep Trial' },
              { icon: <Award className="w-5 h-5 shrink-0" style={{ color: '#C9A87C' }} />, text: '10-Year Replacement Warranty' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-xs font-accent tracking-wider font-semibold whitespace-nowrap"
                style={{ color: '#F5F2EB' }}
              >
                {item.icon}
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
