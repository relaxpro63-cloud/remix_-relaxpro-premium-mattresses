import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, PenTool, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import BlurFade from '../ui/BlurFade';

interface TwoWaysToOwnProps {
  onStartBuilding: () => void;
  onSeeAllModels: () => void;
}

export default function TwoWaysToOwn({ onStartBuilding, onSeeAllModels }: TwoWaysToOwnProps) {
  return (
    <section id="two-ways-section" className="py-12 md:py-16 bg-neutral-light border-y border-blue/15 relative overflow-hidden">
      {/* Subtle blue radial glow background */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(45,140,255,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Centered Heading */}
        <BlurFade delay={0.05}>
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <span className="text-[11px] tracking-widest font-accent font-bold text-blue uppercase bg-blue/10 border border-blue/20 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-sm mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Find Your Own Bed
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 text-primary leading-tight">Best Selling Models</h2>
            <p className="text-neutral-dark/70 text-sm md:text-base mt-4 leading-relaxed font-body max-w-lg mx-auto">
              Whether you want to orchestrate your custom orthopedic configuration layer by layer or choose from our plantation-tested pre-built formulations.
            </p>
          </div>
        </BlurFade>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 lg:gap-12 max-w-5xl mx-auto">

          {/* Option 1: Customize Your Comfort */}
          <BlurFade delay={0.1}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-brand-200/50 shadow-sm hover:shadow-xl hover:shadow-blue/10 transition-all duration-500 p-3 sm:p-5 md:p-8 lg:p-10 flex flex-col justify-between h-full relative overflow-hidden group"
            >
              {/* Blue accent strip on top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue rounded-t-[1.5rem] md:rounded-t-[2.5rem] z-20" />
              {/* Subtle background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-blue/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110 duration-700 ease-out z-0" />

              <div className="relative z-10 space-y-3 md:space-y-6">
                {/* Icon Circle */}
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                  <PenTool className="w-5 h-5 md:w-6 md:h-6 text-blue" />
                </div>

                <div className="pt-1 md:pt-2">
                  <h3 className="font-heading font-bold text-lg sm:text-xl md:text-3xl text-primary tracking-tight">Customize Your Comfort</h3>
                  <p className="font-heading italic text-blue text-[10px] sm:text-xs md:text-sm mt-1 md:mt-2 line-clamp-2 md:line-clamp-none">
                    &ldquo;Customize your mattress, layer by layer.&rdquo;
                  </p>
                  <ul className="text-neutral-dark/75 text-[10px] sm:text-xs md:text-sm mt-3 md:mt-5 space-y-1 sm:space-y-1.5 md:space-y-2 text-left font-body">
                    <li className="flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0"><Check className="w-3 h-3 md:w-4 md:h-4 text-blue" strokeWidth={3} /></span>
                      <span><strong>Pick Cover Fabric:</strong> Select casing textile</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0"><Check className="w-3 h-3 md:w-4 md:h-4 text-blue" strokeWidth={3} /></span>
                      <span><strong>Comfort Layers:</strong> Configure latex zones</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0"><Check className="w-3 h-3 md:w-4 md:h-4 text-blue" strokeWidth={3} /></span>
                      <span><strong>Dial in Thickness:</strong> 4″ to 10″ profiles</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0"><Check className="w-3 h-3 md:w-4 md:h-4 text-blue" strokeWidth={3} /></span>
                      <span><strong>Custom Built:</strong> Delivered in 5–7 days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </BlurFade>

          {/* Option 2: Shop Our Models */}
          <BlurFade delay={0.15}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-brand-200/50 shadow-sm hover:shadow-xl hover:shadow-blue/10 transition-all duration-500 p-3 sm:p-5 md:p-8 lg:p-10 flex flex-col justify-between h-full relative overflow-hidden group"
            >
              {/* Blue accent strip on top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue rounded-t-[1.5rem] md:rounded-t-[2.5rem] z-20" />
              {/* Subtle background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-blue/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110 duration-700 ease-out z-0" />

              <div className="relative z-10 space-y-3 md:space-y-6">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-neutral-light text-primary flex items-center justify-center shrink-0 shadow-sm border border-brand-200/60 group-hover:scale-110 transition-transform duration-500">
                  <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue" />
                </div>

                <div className="pt-1 md:pt-2">
                  <h3 className="font-heading font-bold text-lg sm:text-xl md:text-3xl text-primary tracking-tight">Shop Our Models</h3>
                  <p className="font-heading italic text-blue text-[10px] sm:text-xs md:text-sm mt-1 md:mt-2 line-clamp-2 md:line-clamp-none">
                    &ldquo;Shop pre-built — our mattresses, ready to ship.&rdquo;
                  </p>
                  <ul className="text-neutral-dark/75 text-[10px] sm:text-xs md:text-sm mt-3 md:mt-5 space-y-1 sm:space-y-1.5 md:space-y-2 text-left font-body">
                    <li className="flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0"><Check className="w-3 h-3 md:w-4 md:h-4 text-blue" strokeWidth={3} /></span>
                      <span><strong>13 Organic Models:</strong> Orthopedic alignment</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0"><Check className="w-3 h-3 md:w-4 md:h-4 text-blue" strokeWidth={3} /></span>
                      <span><strong>3 Curated Tiers:</strong> Luxury, Premium & Comfort</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0"><Check className="w-3 h-3 md:w-4 md:h-4 text-blue" strokeWidth={3} /></span>
                      <span><strong>Pick Your Size:</strong> Standard or Custom</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0"><Check className="w-3 h-3 md:w-4 md:h-4 text-blue" strokeWidth={3} /></span>
                      <span><strong>Express Shipping:</strong> Delivered in 5–7 Days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </BlurFade>

        </div>

        {/* CTA Buttons */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-blue/15 max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 md:gap-4">
          <button
            onClick={onStartBuilding}
            className="flex-1 btn-primary bg-blue hover:bg-blue-dark text-white font-accent font-bold text-[10px] sm:text-[11px] md:text-[13px] tracking-widest uppercase py-3 md:py-4.5 rounded-xl md:rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1 md:gap-3 shadow-md"
          >
            <span className="hidden sm:inline">Start building</span>
            <span className="sm:hidden">Build</span>
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </button>
          <button
            onClick={onSeeAllModels}
            className="flex-1 bg-neutral-light hover:bg-brand-100 text-primary font-accent font-bold text-[10px] sm:text-[11px] md:text-[13px] tracking-widest uppercase py-3 md:py-4.5 rounded-xl md:rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1 md:gap-3 border border-brand-200/60 shadow-sm"
          >
            <span className="hidden sm:inline">See all models</span>
            <span className="sm:hidden">All models</span>
            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
}
