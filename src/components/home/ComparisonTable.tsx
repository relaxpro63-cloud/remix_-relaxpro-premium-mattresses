import React, { useState, useEffect } from 'react';
import { XCircle, CheckCircle2, Leaf, Award, SlidersHorizontal, ShieldCheck, HeartPulse } from 'lucide-react';
import { getHomePage } from '../../lib/queries';

const iconMap: Record<string, React.ReactNode> = {
  leaf: <Leaf className="w-6 h-6 text-emerald-600" />,
  award: <Award className="w-6 h-6 text-emerald-600" />,
  sliders: <SlidersHorizontal className="w-6 h-6 text-emerald-600" />,
  check: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
  heart: <HeartPulse className="w-6 h-6 text-emerald-600" />,
  shield: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
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
    <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-3">
            {data.sectionTitle}
          </h2>
          <p className="text-neutral-dark/60 font-body text-sm md:text-base">
            {data.sectionSubtitle}
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-brand-200/50 shadow-sm font-body">
          <div className="grid grid-cols-2 bg-emerald-50/50">
            <div className="py-4 md:py-6 text-center border-r border-brand-200/50">
              <h3 className="text-base md:text-lg font-bold text-primary font-heading">RelaxPro</h3>
            </div>
            <div className="py-4 md:py-6 text-center">
              <h3 className="text-base md:text-lg font-bold text-neutral-dark/70 font-heading">Other Brands</h3>
            </div>
          </div>

          <div className="flex flex-col">
            {data.items.map((row: any, idx: number) => (
              <div 
                key={idx} 
                className={`grid grid-cols-2 border-t border-brand-200/30 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-light/30'}`}
              >
                <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-start gap-3 md:gap-4 border-r border-brand-200/30 text-center md:text-left">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100/50 flex items-center justify-center shrink-0">
                    <div className="scale-75 md:scale-100 flex items-center justify-center">{iconMap[row.icon] || iconMap['check']}</div>
                  </div>
                  <span className="font-semibold text-primary text-sm md:text-base leading-tight">{row.relaxProTitle}</span>
                </div>
                
                <div className="p-4 md:p-6 flex flex-col justify-center gap-1">
                  <div className="flex flex-col md:flex-row items-center justify-start gap-2 md:gap-3 text-neutral-dark/70 text-center md:text-left">
                    <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 shrink-0" />
                    <span className="font-medium text-xs md:text-base leading-tight">{row.otherTitle}</span>
                  </div>
                  {row.otherSubtext && (
                    <p className="text-[10px] md:text-xs text-neutral-dark/50 text-center md:text-left md:pl-8 leading-tight mt-1 md:mt-0">
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
