import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { FadeUp, RevealText, StaggerChildren, staggerItem, AnimatedCounter, EASE_LUXURY } from '../motion/motionPrimitives';
import { getHomePage } from '../../lib/queries';
import DecorativeBotanicals from './DecorativeBotanicals';

const defaultData = [
  { label: 'Avg. Price (Double Bed)', latex: '₹40,000', foam: '₹20,000', foamHigher: false },
  { label: 'Avg. Lifespan', latex: '15 Years', foam: '7 Years', foamHigher: false },
  { label: 'Per Year Cost', latex: '₹2,700/yr', foam: '₹2,900/yr', foamHigher: true },
  { label: 'Per Day Cost', latex: '₹7/day', foam: '₹8/day', foamHigher: true },
];

export default function CostComparison() {
  const [data, setData] = useState(defaultData);
  const [heading, setHeading] = useState('Is Buying Latex Mattress Really Expensive?');
  const [latexLabel, setLatexLabel] = useState('Natural Latex');
  const [foamLabel, setFoamLabel] = useState('Ordinary Foam');
  const [footnote, setFootnote] = useState('While a 100% Natural Latex Mattress may seem more expensive upfront, it actually offers better long-term value than an Ordinary Foam Mattress');

  useEffect(() => {
    getHomePage().then(p => {
      const c = p?.costComparison;
      if (!c) return;
      if (c.sectionTitle) setHeading(c.sectionTitle);
      if (c.naturalLatex?.label) setLatexLabel(c.naturalLatex.label);
      if (c.ordinaryFoam?.label) setFoamLabel(c.ordinaryFoam.label);
      if (c.footnote) setFootnote(c.footnote);
      if (c.naturalLatex && c.ordinaryFoam) {
        setData([
          { label: 'Avg. Price (Double Bed)', latex: c.naturalLatex.avgPrice, foam: c.ordinaryFoam.avgPrice, foamHigher: false },
          { label: 'Avg. Lifespan', latex: c.naturalLatex.lifespan, foam: c.ordinaryFoam.lifespan, foamHigher: false },
          { label: 'Per Year Cost', latex: c.naturalLatex.perYearCost, foam: c.ordinaryFoam.perYearCost, foamHigher: true },
          { label: 'Per Day Cost', latex: c.naturalLatex.perDayCost, foam: c.ordinaryFoam.perDayCost, foamHigher: true },
        ]);
      }
    }).catch(() => {});
  }, []);

  const [latexFirst, ...latexRest] = latexLabel.split(' ');
  const [foamFirst, ...foamRest] = foamLabel.split(' ');

  return (
    <section className="py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 bg-secondary border-y border-brand-200/30 font-body overflow-hidden relative">
      <DecorativeBotanicals density="light" />
      <div className="max-w-5xl mx-auto relative z-10">
        <FadeUp>
          <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-20">
            <RevealText as="h2" className="text-2xl xs:text-3xl sm:text-[2rem] md:text-4xl lg:text-5xl font-heading font-medium text-ink-900 leading-tight">
              {heading}
            </RevealText>
          </div>
        </FadeUp>

        {/* Unified Layout for Mobile & Desktop */}
        <div className="relative pb-4 overflow-x-hidden max-w-[900px] mx-auto pt-4 md:pt-8">
          
          {/* Headers — slide in from opposite sides */}
          <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-8 md:gap-12 lg:gap-16 mb-6 xs:mb-8 sm:mb-12 text-center">
            <motion.h3
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: EASE_LUXURY }}
              className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-ink-900"
            >
              {latexFirst}{latexRest.length ? <><br className="md:hidden" /> {latexRest.join(' ')}</> : null}
            </motion.h3>
            <motion.h3
              initial={{ x: 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: EASE_LUXURY }}
              className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-ink-900"
            >
              {foamFirst}{foamRest.length ? <><br className="md:hidden" /> {foamRest.join(' ')}</> : null}
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
                className="w-28 sm:w-56 h-20 sm:h-36 object-cover rounded-xl shadow-md border border-graphite-200 transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300"
              />
            </motion.div>
          </div>

          {/* VS Badge & Vertical Line */}
          <div className="absolute left-1/2 top-20 xs:top-24 sm:top-32 md:top-36 bottom-0 w-0.5 xs:w-1 sm:w-1.5 bg-ink-900/80 -translate-x-1/2 z-0" />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            className="absolute left-1/2 top-[100px] xs:top-[120px] sm:top-[160px] md:top-[180px] -translate-x-1/2 z-20 flex flex-col items-center justify-center"
          >
            <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-ink-900 text-white font-heading font-bold text-sm xs:text-lg sm:text-2xl md:text-3xl flex items-center justify-center shadow-xl border-[2px] xs:border-[3px] sm:border-4 border-white">
              VS
            </div>
          </motion.div>

          {/* Rows — stagger reveal row by row */}
          <StaggerChildren className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 relative z-10 px-1 sm:px-4" stagger={0.12} delay={0.2}>
            {data.map((row, idx) => (
              <motion.div key={idx} variants={staggerItem} className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-8 md:gap-12 lg:gap-16 items-center">
                
                {/* Left Side: Label + Value */}                  <div className="bg-brand-50 rounded-md xs:rounded-lg sm:rounded-xl flex items-center justify-between p-2 xs:p-3 sm:p-4 shadow-sm relative">
                  <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                    <span className="font-bold text-ink-900 text-[9px] xs:text-[10px] sm:text-sm lg:text-base leading-tight w-[55px] xs:w-[60px] sm:w-[100px] lg:w-auto break-words">{typeof row.label === 'string' ? row.label.split(' (')[0] : row.label}</span>
                    <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-5 sm:h-5 text-ink-900 hidden min-[380px]:block" strokeWidth={3} />
                  </div>
                  <span className="font-bold text-ink-900 text-[10px] xs:text-[11px] sm:text-base lg:text-lg text-right sm:text-left leading-tight">{row.latex}</span>
                </div>

                {/* Right Side: Value */}
                <div className="bg-brand-50 rounded-md xs:rounded-lg sm:rounded-xl flex items-center justify-center p-2 xs:p-3 sm:p-4 shadow-sm relative text-center">
                  <span className="font-bold text-ink-900 text-[10px] xs:text-[11px] sm:text-base lg:text-lg leading-tight">{row.foam}</span>
                  {row.foamHigher && (
                    <ArrowUp className="w-3 h-3 sm:w-5 sm:h-5 text-ink-900 absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2" strokeWidth={4} />
                  )}
                </div>

              </motion.div>
            ))}
          </StaggerChildren>
        </div>

        <FadeUp delay={0.4}>
          <div className="mt-8 xs:mt-10 sm:mt-12 md:mt-14 bg-brand-50 p-3 xs:p-4 sm:p-5 md:p-6 rounded-xl xs:rounded-2xl max-w-2xl mx-auto text-center shadow-sm relative z-10">
            <p className="text-ink-900 font-medium text-[11px] xs:text-xs sm:text-sm md:text-base leading-relaxed">
              {footnote}
            </p>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}
