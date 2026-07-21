import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { FadeUp, RevealText, StaggerChildren, staggerItem, AnimatedCounter, EASE_LUXURY } from '../motion/motionPrimitives';

const compareData = [
  {
    label: <>Avg. Price<br />(Double Bed)</>,
    latex: "₹ 40,000",
    foam: "₹ 20,000",
    foamHigher: false
  },
  {
    label: "Avg. Lifespan",
    latex: "15 Years",
    foam: "7 Years",
    foamHigher: false
  },
  {
    label: "Per Year Cost",
    latex: <>40,000 ÷ 15 =<br />₹2,700/- per year</>,
    foam: <>20,000 ÷ 7 =<br />₹2,900/- per year</>,
    foamHigher: true
  },
  {
    label: "Per Day Cost",
    latex: <>2700 ÷ 365 =<br />₹7/- per day</>,
    foam: <>2900 ÷ 365 =<br />₹8/- per day</>,
    foamHigher: true
  }
];

export default function CostComparison() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-white border-y border-brand-200/40 font-body overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12 md:mb-20">
            <RevealText as="h2" className="text-3xl md:text-4xl lg:text-5xl font-heading font-medium text-neutral-800 leading-tight">
              Is Buying Latex Mattress Really Expensive?
            </RevealText>
          </div>
        </FadeUp>

        {/* Unified Layout for Mobile & Desktop */}
        <div className="relative pb-4 overflow-x-hidden max-w-[900px] mx-auto pt-4 md:pt-8">
          
          {/* Headers — slide in from opposite sides */}
          <div className="grid grid-cols-2 gap-4 sm:gap-16 mb-8 sm:mb-12 text-center">
            <motion.h3
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: EASE_LUXURY }}
              className="text-xl sm:text-3xl lg:text-4xl font-heading font-bold text-emerald-800"
            >
              Natural<br className="md:hidden" /> Latex
            </motion.h3>
            <motion.h3
              initial={{ x: 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: EASE_LUXURY }}
              className="text-xl sm:text-3xl lg:text-4xl font-heading font-bold text-emerald-800"
            >
              Ordinary<br className="md:hidden" /> Foam
            </motion.h3>
          </div>

          {/* Images Section — slide in from opposite sides */}
          <div className="grid grid-cols-2 gap-4 sm:gap-16 mb-8 sm:mb-10 text-center relative z-10 px-4">
            <motion.div
              initial={{ x: -80, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, ease: EASE_LUXURY, delay: 0.1 }}
              className="flex justify-center"
            >
              <img 
                src="/images/latex-compare.png" 
                alt="Natural Latex Mattress" 
                className="w-28 sm:w-56 h-20 sm:h-36 object-cover rounded-xl shadow-md border border-brand-200/50 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300"
              />
            </motion.div>
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, ease: EASE_LUXURY, delay: 0.1 }}
              className="flex justify-center"
            >
              <img 
                src="/images/foam-compare.png" 
                alt="Ordinary Foam Mattress" 
                className="w-28 sm:w-56 h-20 sm:h-36 object-cover rounded-xl shadow-md border border-gray-200 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300"
              />
            </motion.div>
          </div>

          {/* VS Badge & Vertical Line */}
          <div className="absolute left-1/2 top-24 bottom-0 w-1 sm:w-1.5 bg-emerald-800/80 -translate-x-1/2 z-0" />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            className="absolute left-1/2 top-[120px] sm:top-[160px] -translate-x-1/2 z-20 flex flex-col items-center justify-center"
          >
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-emerald-800 text-white font-heading font-bold text-lg sm:text-3xl flex items-center justify-center shadow-xl border-[3px] sm:border-4 border-white">
              VS
            </div>
          </motion.div>

          {/* Rows — stagger reveal row by row */}
          <StaggerChildren className="space-y-3 sm:space-y-5 relative z-10 px-1 sm:px-4" stagger={0.12} delay={0.2}>
            {compareData.map((row, idx) => (
              <motion.div key={idx} variants={staggerItem} className="grid grid-cols-2 gap-3 sm:gap-12 lg:gap-16 items-center">
                
                {/* Left Side: Label + Value */}
                <div className="bg-[#c2e2be] rounded-md sm:rounded-xl flex items-center justify-between p-2 sm:p-4 shadow-sm relative">
                  <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                    <span className="font-bold text-emerald-950 text-[9px] sm:text-sm lg:text-base leading-tight w-[60px] sm:w-[100px] lg:w-auto break-words">{row.label}</span>
                    <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-950 hidden min-[380px]:block" strokeWidth={3} />
                  </div>
                  <span className="font-bold text-emerald-950 text-[10px] sm:text-base lg:text-lg text-right sm:text-left leading-tight">{row.latex}</span>
                </div>

                {/* Right Side: Value */}
                <div className="bg-[#c2e2be] rounded-md sm:rounded-xl flex items-center justify-center p-2 sm:p-4 shadow-sm relative text-center">
                  <span className="font-bold text-emerald-950 text-[10px] sm:text-base lg:text-lg leading-tight">{row.foam}</span>
                  {row.foamHigher && (
                    <ArrowUp className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-950 absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2" strokeWidth={4} />
                  )}
                </div>

              </motion.div>
            ))}
          </StaggerChildren>
        </div>

        <FadeUp delay={0.4}>
          <div className="mt-10 md:mt-12 bg-[#c2e2be] p-4 md:p-6 rounded-2xl max-w-2xl mx-auto text-center shadow-sm relative z-10">
            <p className="text-emerald-950 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
              While a 100% Natural Latex Mattress may seem more expensive upfront, it actually offers better long-term value than an Ordinary Foam Mattress
            </p>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}
