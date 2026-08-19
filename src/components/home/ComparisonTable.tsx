import React, { useState, useEffect } from 'react';
import { XCircle, CheckCircle2, Leaf, Award, SlidersHorizontal, ShieldCheck, HeartPulse } from 'lucide-react';
// Uses new design tokens: eco-*, brand-*, ink-*, linen-*, graphite-*
import { getHomePage } from '../../lib/queries';
import DecorativeBotanicals from './DecorativeBotanicals';
import BlurFade from '../ui/BlurFade';

const iconMap: Record<string, React.ReactNode> = {
  leaf: <Leaf className="w-6 h-6 text-eco-500" />,
  award: <Award className="w-6 h-6 text-eco-500" />,
  sliders: <SlidersHorizontal className="w-6 h-6 text-eco-500" />,
  check: <CheckCircle2 className="w-6 h-6 text-eco-500" />,
  heart: <HeartPulse className="w-6 h-6 text-eco-500" />,
  shield: <ShieldCheck className="w-6 h-6 text-eco-500" />,
};

const defaultData = {
  sectionTitle: 'Why Choose RelaxPro?',
  sectionSubtitle: 'See how we are compared to other mattress brands',
  items: [
    { relaxProTitle: 'Natural latex', icon: 'leaf', otherTitle: 'Memory foam / Synthetic foam', otherSubtext: 'Latex is often just a thin synthetic layer' },
    { relaxProTitle: 'GOLS certified', icon: 'award', otherTitle: 'None / false claims' },
    { relaxProTitle: 'Tailored to your comfort', icon: 'sliders', otherTitle: 'Too firm / Too soft - sinks' },
    { relaxProTitle: 'Safe for all', icon: 'check', otherTitle: 'Releases cancer causing gas every day' },
  ],
};

export default function ComparisonTable() {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    getHomePage().then(p => {
      if (p?.comparisonSection?.items?.length > 0) {
        setData(p.comparisonSection);
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="py-10 xs:py-12 sm:py-14 md:py-16 lg:py-20 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 bg-sky-100/20 relative overflow-hidden">
      <DecorativeBotanicals density="light" />
      <div className="max-w-5xl mx-auto relative z-10">
        <BlurFade>
          <div className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-14">
            <h2 className="text-2xl xs:text-3xl sm:text-[2rem] md:text-4xl font-heading font-bold text-ink-900 mb-2 xs:mb-3">
              {data.sectionTitle}
            </h2>
            <p className="text-graphite-500 font-body text-sm xs:text-[15px] sm:text-base">
              {data.sectionSubtitle}
            </p>
          </div>
        </BlurFade>

        <div className="rounded-2xl overflow-hidden border border-brand-200/50 shadow-sm font-body">
          <div className="grid grid-cols-2 bg-eco-50">
            <div className="py-3 xs:py-4 sm:py-5 md:py-6 text-center border-r border-brand-200/50">
              <h3 className="text-sm xs:text-base md:text-lg font-bold text-ink-900 font-heading">RelaxPro</h3>
            </div>
            <div className="py-3 xs:py-4 sm:py-5 md:py-6 text-center">
              <h3 className="text-sm xs:text-base md:text-lg font-bold text-graphite-600 font-heading">Other Brands</h3>
            </div>
          </div>

          <div className="flex flex-col">
            {data.items.map((row: any, idx: number) => (
              <div 
                key={idx} 
                className={`grid grid-cols-2 border-t border-brand-200/30 ${idx % 2 === 0 ? 'bg-white' : 'bg-sky-100/40'}`}
              >
                <div className="p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col md:flex-row items-center justify-start gap-2 xs:gap-3 md:gap-4 border-r border-brand-200/30 text-center md:text-left">
                  <div className="w-7 h-7 xs:w-8 xs:h-8 md:w-10 md:h-10 rounded-full bg-eco-50 flex items-center justify-center shrink-0">
                    <div className="scale-[0.6] xs:scale-75 md:scale-100 flex items-center justify-center">{iconMap[row.icon] || iconMap['check']}</div>
                  </div>
                  <span className="font-semibold text-ink-900 text-xs xs:text-sm md:text-base leading-tight">{row.relaxProTitle}</span>
                </div>
                
                <div className="p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col justify-center gap-1">
                  <div className="flex flex-col md:flex-row items-center justify-start gap-1.5 xs:gap-2 md:gap-3 text-graphite-600 text-center md:text-left">
                    <XCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 md:w-5 md:h-5 text-red-400 shrink-0" />
                    <span className="font-medium text-[11px] xs:text-xs md:text-base leading-tight">{row.otherTitle}</span>
                  </div>
                  {row.otherSubtext && (
                    <p className="text-[9px] xs:text-[10px] md:text-xs text-graphite-400 text-center md:text-left md:pl-8 leading-tight mt-1 md:mt-0">
                      {row.otherSubtext}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
