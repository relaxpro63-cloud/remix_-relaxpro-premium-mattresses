import React from 'react';
import { motion } from 'motion/react';
import PriceText from '../ui/PriceText';
import { ChevronRight, ChevronDown, Home, Users, Truck, Shield, Award, MessageSquare } from 'lucide-react';
import NumberTicker from '../ui/NumberTicker';
import BlurFade from '../ui/BlurFade';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
  onNavigateToPdp: (slug: string) => void;
}

export default function HeroSlider({ onNavigate, onNavigateToPdp }: HeroSliderProps) {
  return (
    <section
      id="main-content"
      className="relative overflow-hidden min-h-[90vh] md:min-h-[100vh] flex items-center noise-overlay"
      style={{
        background: 'linear-gradient(135deg, #1A1D1B 0%, #0F1729 50%, #1A1D1B 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 10s ease infinite',
      }}
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.04] pointer-events-none hidden lg:block"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="180" stroke="#317FBA" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="140" stroke="#317FBA" strokeWidth="0.3" />
        <circle cx="200" cy="200" r="100" stroke="#317FBA" strokeWidth="0.2" />
      </svg>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-24 pb-16 md:py-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 40, filter: 'blur(4px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-20 md:pb-28"
        >
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
            <BlurFade delay={0.1}>
              <span className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent px-4 py-2 rounded-full text-[11px] font-accent font-bold tracking-wider uppercase">
                <span className="text-sm">⭐</span> #1 Rated Mattress Store 2025
              </span>
            </BlurFade>

            <BlurFade delay={0.2}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-heading font-bold tracking-[-0.03em] md:tracking-[-0.05em] leading-[1.15] md:leading-[1.1]">
                <span className="text-white block" style={{ animation: 'wordSlideUp 0.6s ease forwards', animationDelay: '0.1s', opacity: 0 }}>Sleep Like</span>
                <span className="text-white block" style={{ animation: 'wordSlideUp 0.6s ease forwards', animationDelay: '0.25s', opacity: 0 }}>You've <span className="text-accent italic">Never</span></span>
                <span className="text-white block" style={{ animation: 'wordSlideUp 0.6s ease forwards', animationDelay: '0.4s', opacity: 0 }}>Slept <span className="text-accent italic">Before.</span></span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.4}>
              <p className="text-white/60 font-body text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Premium mattresses crafted for deep, restorative sleep. 100% natural GOLS certified latex, direct from Kerala to your bedroom.
              </p>
            </BlurFade>

            <BlurFade delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <button
                  onClick={() => onNavigate('catalog')}
                  className="w-full sm:w-auto btn-primary bg-accent hover:bg-accent-dark text-primary py-4 px-8 sm:px-10 rounded-full shadow-lg shadow-accent/20 text-xs font-bold font-accent uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  Shop Mattresses
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/918686624494?text=Hello%20Suresh%2C%20I%20want%20to%20enquire%20about%20RelaxPro%20premium%20mattresses.%20Please%20guide%20me."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto border border-accent/50 hover:bg-accent hover:text-primary text-accent py-4 px-8 sm:px-10 rounded-full text-xs font-bold font-accent uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
                <button
                  onClick={() => onNavigate('builder')}
                  className="w-full sm:w-auto border border-white/25 hover:border-white/50 hover:bg-white/10 text-white py-4 px-8 sm:px-10 rounded-full text-xs font-bold font-accent uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  Build Your Own →
                </button>
              </div>
            </BlurFade>

            <BlurFade delay={0.6}>
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 justify-center lg:justify-start overflow-x-auto">
                {[
                  { icon: <Truck className="w-4 h-4" />, text: 'Free Delivery' },
                  { icon: <Shield className="w-4 h-4" />, text: '100-Night Trial' },
                  { icon: <Award className="w-4 h-4" />, text: '10-Year Warranty' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-white/50 text-xs font-accent whitespace-nowrap"
                  >
                    <span className="text-accent">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>

          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="absolute -inset-4 bg-accent/10 rounded-3xl blur-2xl opacity-50" />
            <div
              onClick={() => onNavigateToPdp('nirvana')}
              className="animate-float bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 md:p-6 relative cursor-pointer hover:border-accent/40 transition-all duration-500 group"
            >
              <div className="absolute top-4 right-4 bg-accent/20 text-accent text-[9px] font-bold font-accent py-1 px-2.5 uppercase rounded-full z-10 tracking-wider">
                Bestseller
              </div>
              <div className="img-zoom rounded-xl overflow-hidden mb-4">
                <img
                  src="/images/products/prakriti.webp"
                  alt="Nirvana 8-inch dual zone natural latex mattress in a bedroom setting"
                  className="w-full h-48 md:h-56 object-cover rounded-xl"
                  loading="eager"
                  width={800}
                  height={450}
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="font-heading font-semibold text-white text-lg group-hover:text-accent transition-colors">
                Nirvana 8" Zone Latex
              </h4>
              <p className="text-white/40 text-xs mt-1.5 leading-relaxed font-body">
                7-zone orthopedic relief + monozone — handcrafted from Kerala organic latex
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-white/30 block uppercase font-accent tracking-wider font-bold">
                    Factory Direct
                  </span>
                  <span className="text-xl font-bold text-white font-body"><PriceText>₹24,500</PriceText></span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToPdp('nirvana');
                  }}
                  className="border border-accent/40 hover:bg-accent hover:text-primary text-accent rounded-full py-2.5 px-5 text-xs font-bold font-accent tracking-wider uppercase transition-all cursor-pointer"
                >
                  View Specs
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-20">
        <span className="text-white/30 text-[10px] font-accent uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 text-white/40 animate-bounce-arrow" />
      </div>
    </section>
  );
}
