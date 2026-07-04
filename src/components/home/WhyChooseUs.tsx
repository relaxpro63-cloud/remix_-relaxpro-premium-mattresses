import React, { useEffect, useRef, useState } from 'react';
import { Shield, Truck, Award, Leaf } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 1500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, target]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold font-heading text-white">
      {prefix}{count.toLocaleString('en-IN')}{suffix}
    </div>
  );
}

const features = [
  {
    icon: <Shield className="w-5 h-5 sm:w-7 sm:h-7" />,
    title: '100-Night Sleep Trial',
    desc: 'Try it risk-free. Return for free if not in love with your new mattress.',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    icon: <Truck className="w-5 h-5 sm:w-7 sm:h-7" />,
    title: 'Free White-Glove Delivery',
    desc: 'We deliver and set up in your bedroom. No extra cost, no hassle.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: <Award className="w-5 h-5 sm:w-7 sm:h-7" />,
    title: '10-Year Warranty',
    desc: 'Built to last a decade, guaranteed. Direct factory replacement policy.',
    color: 'bg-sky-50 text-sky-600 border-sky-100',
  },
  {
    icon: <Leaf className="w-5 h-5 sm:w-7 sm:h-7" />,
    title: 'Eco-Friendly Materials',
    desc: 'CertiPUR-US certified foam. GOLS certified natural latex from Kerala.',
    color: 'bg-green-50 text-green-600 border-green-100',
  },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Happy Customers' },
  { value: 500, suffix: '+', label: 'Products Sold' },
  { value: 49, suffix: '', prefix: '', label: '4.9★ Avg Rating' },
  { value: 15, suffix: '+', label: 'Years Experience' },
];

export default function WhyChooseUs() {
  const [sectionRef, isSectionVisible] = useIntersectionObserver<HTMLElement>({ threshold: 0.1 });

  return (
    <>
      {/* Why Choose Us Section */}
      <section
        ref={sectionRef}
        className="py-12 md:py-24 px-4 md:px-8 bg-neutral-light"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`text-center max-w-2xl mx-auto mb-8 md:mb-16 fade-up ${isSectionVisible ? 'animate-in' : ''}`}>
            <span className="inline-flex items-center gap-2 text-[11px] tracking-widest font-accent text-accent uppercase bg-accent/10 px-4 py-1.5 rounded-full font-bold">
              Why Choose RelaxPro
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 text-primary leading-tight">
              Engineered for Your Best Sleep
            </h2>
            <p className="text-neutral-dark/50 text-sm mt-3 font-body leading-relaxed">
              Every mattress we craft combines generations of expertise with the finest natural materials.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`bg-white p-4 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl border border-brand-200/60 shadow-sm feature-card-glow scale-in flex flex-col ${
                  isSectionVisible ? 'animate-in' : ''
                }`}
                style={{ transitionDelay: `${0.1 * idx}s` }}
              >
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${feature.color} border flex items-center justify-center mb-3 sm:mb-5 shrink-0`}>
                  {feature.icon}
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-base md:text-lg text-primary mb-1.5 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-dark/50 text-[10px] sm:text-xs md:text-sm font-body leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-primary py-12 md:py-16 px-4 md:px-8 border-y border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`text-center ${
                idx < stats.length - 1 ? 'md:border-r md:border-white/10' : ''
              }`}
            >
              {stat.label === '4.9★ Avg Rating' ? (
                <div className="text-3xl md:text-4xl font-bold font-heading text-white">
                  4.9<span className="text-accent">★</span>
                </div>
              ) : (
                <div className="text-3xl md:text-4xl font-bold font-heading text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
              )}
              <p className="text-white/40 text-xs font-accent uppercase tracking-wider mt-2 font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
