import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Moon, Activity, Sun } from 'lucide-react';
import BlurFade from '../ui/BlurFade';
import { useNavigate } from 'react-router-dom';

const styles = [
  {
    title: 'Side Sleeper',
    desc: 'Need pressure relief on shoulders & hips. Try our plush organic latex or soft-medium hybrids.',
    icon: <Moon className="w-6 h-6 md:w-8 md:h-8 text-accent" />,
    slug: 'nirvana',
    linkText: 'View luxury models'
  },
  {
    title: 'Back & Orthopedic',
    desc: 'Require spine alignment & firm support. Our medium-firm orthopedic builds are doctor-recommended.',
    icon: <Activity className="w-6 h-6 md:w-8 md:h-8 text-accent" />,
    slug: 'amrita',
    linkText: 'View premium models'
  },
  {
    title: 'Stomach Sleeper',
    desc: 'Need firm even surface to prevent hip sinking. Our firm and ultra-firm options keep you aligned.',
    icon: <Sun className="w-6 h-6 md:w-8 md:h-8 text-accent" />,
    slug: 'ananda',
    linkText: 'View comfort models'
  },
];

export default function SleepStyleGuide() {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-neutral-light border-y border-brand-200/40">
      <div className="max-w-6xl mx-auto">
        <BlurFade delay={0.1}>
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary leading-tight">
              Which Mattress Is Right for You?
            </h2>
            <p className="text-neutral-dark/70 text-sm md:text-base mt-4 font-body leading-relaxed max-w-lg mx-auto">
              Not sure where to start? Pick your sleep style and we'll recommend the perfect model.
            </p>
          </div>
        </BlurFade>

        {/* Grid Layout: 2 cols on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
          {styles.map((style, idx) => (
            <div 
              key={idx}
              className={idx === 2 ? "col-span-2 md:col-span-1 w-full max-w-[280px] md:max-w-none mx-auto" : ""}
            >
              <BlurFade delay={0.1 + idx * 0.1}>
                <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-8 border border-brand-200/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col group cursor-pointer"
                onClick={() => navigate(`/product/${style.slug}`)}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-neutral-light text-primary flex items-center justify-center shrink-0 shadow-sm border border-brand-200/60 group-hover:scale-110 transition-transform duration-500 mb-4 md:mb-6">
                  {style.icon}
                </div>
                
                <h3 className="font-heading font-bold text-base sm:text-lg md:text-2xl text-primary mb-2 md:mb-3">
                  {style.title}
                </h3>
                
                <p className="text-neutral-dark/70 text-[11px] sm:text-xs md:text-sm leading-relaxed font-body mb-6 md:mb-8 flex-grow">
                  {style.desc}
                </p>

                <div className="mt-auto pt-4 md:pt-5 border-t border-brand-200/40">
                  <span className="inline-flex items-center gap-1 md:gap-2 text-[10px] sm:text-xs md:text-sm font-accent font-bold tracking-widest uppercase text-accent group-hover:text-primary transition-colors text-left leading-tight">
                    View model <ArrowRight className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
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
