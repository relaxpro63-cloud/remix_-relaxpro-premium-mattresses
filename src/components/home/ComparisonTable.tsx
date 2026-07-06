import React from 'react';
import { XCircle, CheckCircle2, Leaf, Award, SlidersHorizontal, ShieldCheck, HeartPulse } from 'lucide-react';

const comparisonData = [
  {
    relaxPro: {
      title: 'Natural latex',
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
    },
    other: {
      title: 'Memory foam / Synthetic foam',
      subtext: 'Latex is often just a thin synthetic layer',
    }
  },
  {
    relaxPro: {
      title: 'GOLS certified',
      icon: <Award className="w-6 h-6 text-emerald-600" />,
    },
    other: {
      title: 'None / false claims',
    }
  },
  {
    relaxPro: {
      title: 'Tailored to your comfort',
      icon: <SlidersHorizontal className="w-6 h-6 text-emerald-600" />,
    },
    other: {
      title: 'Too firm/ Too soft - sinks',
    }
  },

  {
    relaxPro: {
      title: 'Safe for all',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    },
    other: {
      title: 'Releases cancer causing gas every day',
    }
  }
];

export default function ComparisonTable() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-3">
            Why Choose RelaxPro?
          </h2>
          <p className="text-neutral-dark/60 font-body text-sm md:text-base">
            See how we are compared to other mattress brands
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-brand-200/50 shadow-sm font-body">
          {/* Header */}
          <div className="grid grid-cols-2 bg-emerald-50/50">
            <div className="py-4 md:py-6 text-center border-r border-brand-200/50">
              <h3 className="text-base md:text-lg font-bold text-primary font-heading">RelaxPro</h3>
            </div>
            <div className="py-4 md:py-6 text-center">
              <h3 className="text-base md:text-lg font-bold text-neutral-dark/70 font-heading">Other Brands</h3>
            </div>
          </div>

          {/* Rows */}
          <div className="flex flex-col">
            {comparisonData.map((row, idx) => (
              <div 
                key={idx} 
                className={`grid grid-cols-2 border-t border-brand-200/30 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-light/30'}`}
              >
                {/* RelaxPro Column */}
                <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-start gap-3 md:gap-4 border-r border-brand-200/30 text-center md:text-left">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100/50 flex items-center justify-center shrink-0">
                    <div className="scale-75 md:scale-100 flex items-center justify-center">{row.relaxPro.icon}</div>
                  </div>
                  <span className="font-semibold text-primary text-sm md:text-base leading-tight">{row.relaxPro.title}</span>
                </div>
                
                {/* Other Brands Column */}
                <div className="p-4 md:p-6 flex flex-col justify-center gap-1">
                  <div className="flex flex-col md:flex-row items-center justify-start gap-2 md:gap-3 text-neutral-dark/70 text-center md:text-left">
                    <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 shrink-0" />
                    <span className="font-medium text-xs md:text-base leading-tight">{row.other.title}</span>
                  </div>
                  {row.other.subtext && (
                    <p className="text-[10px] md:text-xs text-neutral-dark/50 text-center md:text-left md:pl-8 leading-tight mt-1 md:mt-0">
                      {row.other.subtext}
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
