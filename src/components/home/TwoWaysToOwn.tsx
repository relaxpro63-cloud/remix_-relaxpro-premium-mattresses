import React from 'react';
import { motion } from 'motion/react';
import { Gear, ShoppingBag, ArrowRight } from '@phosphor-icons/react';
import BlurFade from '../ui/BlurFade';

interface TwoWaysToOwnProps {
  onStartBuilding: () => void;
  onSeeAllModels: () => void;
}

export default function TwoWaysToOwn({ onStartBuilding, onSeeAllModels }: TwoWaysToOwnProps) {
  return (
    <section className="py-20 md:py-36 bg-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <BlurFade delay={0.05}>
          <h2 className="text-center text-3xl md:text-5xl font-heading font-normal tracking-[-0.02em] text-primary leading-[1.1] max-w-2xl mx-auto">
            Two ways to own a RelaxPro
          </h2>
          <p className="text-center text-muted text-sm md:text-base mt-4 leading-relaxed font-body max-w-lg mx-auto">
            Build layer by layer, or pick a plantation-tested system ready to ship.
          </p>
        </BlurFade>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8 max-w-4xl mx-auto mt-12 md:mt-16">
          {/* Left: Build your own (forest) */}
          <BlurFade delay={0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col rounded-2xl bg-primary p-6 md:p-10 h-full group"
            >
              <div className="mb-6">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <Gear className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl md:text-2xl text-white mb-3">Build your own</h3>
                <p className="text-white/60 text-sm font-body leading-relaxed">
                  Configure every layer from cover to core. Made to your specification in 5-7 days.
                </p>
              </div>

              <div className="mt-auto pt-6">
                <ul className="text-white/55 text-xs font-body space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                    Select cover fabric and comfort layers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                    Choose thickness: 4 to 10 inches
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                    Factory-direct pricing, no middleman
                  </li>
                </ul>
                <button
                  onClick={onStartBuilding}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-11 rounded-full px-6 py-3 text-xs font-accent font-bold uppercase tracking-wider bg-accent text-primary hover:bg-accent-dark transition-[background-color,transform] duration-200 active:scale-[0.97]"
                >
                  Customize
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </BlurFade>

          {/* Right: Shop pre-built (light) */}
          <BlurFade delay={0.15}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col rounded-2xl bg-white shadow-[0_4px_16px_rgba(10,23,19,0.03)] h-full group"
            >
              <div className="p-6 md:p-10 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center mb-5">
                    <ShoppingBag className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl text-primary mb-3">Shop pre-built</h3>
                  <p className="text-muted text-sm font-body leading-relaxed">
                    Plantation-tested sleep systems. Proven by thousands of sleepers across India.
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  <ul className="text-muted/70 text-xs font-body space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                      Nirvana, Amrita, Prakriti, and more
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                      Ready to ship in 48 hours
                    </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                    Handcrafted with premium materials
                  </li>
                  </ul>
                  <button
                    onClick={onSeeAllModels}
                    className="w-full inline-flex items-center justify-center gap-2 min-h-11 rounded-full px-6 py-3 text-xs font-accent font-bold uppercase tracking-wider border border-border text-primary hover:border-accent hover:text-accent transition-[border-color,color,transform] duration-200 active:scale-[0.97] bg-transparent"
                  >
                    Shop
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
