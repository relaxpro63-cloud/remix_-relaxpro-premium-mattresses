import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, ShieldCheck, HeartPulse } from 'lucide-react';
import BlurFade from '../ui/BlurFade';
import { useNavigate } from 'react-router-dom';

const postureData = [
  {
    title: 'Luxury Organic Latex',
    subtitle: 'Pure Organic Latex Blocks',
    desc: 'Denser solid GOLS latex sheets harvested in Kerala. Dual monozone and orthopedic 7-Zone configurations.',
    items: [
      'Nirvana (8" Dual Zone)',
      'Amrita (10" Reversible Hybrid)',
      'Ananda (6" Classic Pure core)',
    ],
    linkText: 'Browse Luxury Series',
    slug: 'luxury',
    icon: <Leaf className="w-5 h-5 md:w-7 md:h-7 text-emerald-700" />,
    iconBg: 'bg-emerald-50 border-emerald-100'
  },
  {
    title: 'Premium Spine Hybrids',
    subtitle: 'Orthopedic Support Cores',
    desc: 'Balanced structures blending organic latex with high density rebound posture matrices.',
    items: [
      'Arogya (8" Doctor recommendation)',
      'Sthira (6" Ultimate firm alignment)',
      'Somya (10" Extra softy adaptive)',
    ],
    linkText: 'Browse Premium Series',
    slug: 'premium',
    icon: <ShieldCheck className="w-5 h-5 md:w-7 md:h-7 text-blue-700" />,
    iconBg: 'bg-blue-50 border-blue-100'
  },
  {
    title: 'Comfort High-Resilience',
    subtitle: 'Spine Transition Foams',
    desc: 'Accessible comfort mattresses with custom density transitions and Oeko-Tex certified wrappers.',
    items: [
      'Sunidra (8" Universal sleeper)',
      'Ojas (6" Standard micro-weave)',
      'AyushRest (8" Triple ortho firmness)',
    ],
    linkText: 'Browse Comfort Series',
    slug: 'comfort',
    icon: <HeartPulse className="w-5 h-5 md:w-7 md:h-7 text-rose-700" />,
    iconBg: 'bg-rose-50 border-rose-100'
  },
];

export default function EngineeredPosture() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-white border-y border-brand-200/40">
      <div className="max-w-6xl mx-auto">
        <BlurFade delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-neutral-800 leading-tight">
              Engineered to Match Every Posture Need
            </h2>
          </div>
        </BlurFade>

        {/* Grid Layout: 2 cols on mobile (with 3rd centered), 3 cols on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {postureData.map((data, idx) => (
            <div 
              key={idx}
              className={idx === 2 ? "col-span-2 md:col-span-1 w-full max-w-[280px] sm:max-w-[320px] md:max-w-none mx-auto" : ""}
            >
              <BlurFade delay={0.1 + idx * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-neutral-light rounded-2xl md:rounded-[2rem] p-4 sm:p-6 md:p-8 border border-brand-200/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col group cursor-pointer"
                  onClick={() => navigate(`/collections/${data.slug}`)}
                >
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm border mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 ${data.iconBg}`}>
                    {data.icon}
                  </div>
                  
                  <h3 className="font-heading font-bold text-sm sm:text-base md:text-2xl text-neutral-800 mb-1 leading-tight">
                    {data.title}
                  </h3>
                  <div className="font-accent font-semibold text-[9px] sm:text-[10px] md:text-xs tracking-wider uppercase text-neutral-500 mb-3 md:mb-4">
                    {data.subtitle}
                  </div>
                  
                  <p className="text-neutral-600 text-[10px] sm:text-xs md:text-sm leading-relaxed font-body mb-4 md:mb-6">
                    {data.desc}
                  </p>

                  <div className="mb-6 md:mb-8 flex-grow">
                    <ul className="space-y-2 md:space-y-3">
                      {data.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent mt-1.5 md:mt-2 shrink-0" />
                          <span className="text-[10px] sm:text-xs md:text-sm text-neutral-700 font-medium leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 border-t border-brand-200/60">
                    <span className="inline-flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] md:text-xs font-accent font-bold tracking-wider sm:tracking-widest uppercase text-accent group-hover:text-primary transition-colors text-left leading-tight">
                      {data.linkText} <ArrowRight className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                    </span>
                  </div>
                </motion.div>
              </BlurFade>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
