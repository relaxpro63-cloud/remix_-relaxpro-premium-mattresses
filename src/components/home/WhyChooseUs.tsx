import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Truck, Award, Leaf } from 'lucide-react';
import { AnimatedCounter, FadeUp, StaggerChildren, staggerItem, EASE_LUXURY } from '../motion/motionPrimitives';
import { getHomePage } from '../../lib/queries';

const iconMap: Record<string, React.ReactNode> = {
  'shield': <Shield className="w-5 h-5 sm:w-7 sm:h-7" />,
  'truck': <Truck className="w-5 h-5 sm:w-7 sm:h-7" />,
  'award': <Award className="w-5 h-5 sm:w-7 sm:h-7" />,
  'leaf': <Leaf className="w-5 h-5 sm:w-7 sm:h-7" />,
};

const colorMap: Record<string, string> = {
  'shield': 'bg-brand-50 text-brand-600 border-brand-600-100',
  'truck': 'bg-eco-50 text-eco-500 border-eco-50',
  'award': 'bg-sky-50 text-sky-600 border-sky-100',
  'leaf': 'bg-green-50 text-green-600 border-green-100',
};

const defaultFeatures = [
  { icon: 'shield', title: 'Free White-Glove Delivery', desc: 'We deliver and set up in your bedroom. No extra cost, no hassle.' },
  { icon: 'award', title: '10-Year Warranty', desc: 'Built to last a decade, guaranteed. Direct factory replacement policy.' },
  { icon: 'leaf', title: 'Eco-Friendly Materials', desc: 'CertiPUR-US certified foam. GOLS certified natural latex from Kerala.' },
];

const defaultStats = [
  { value: 10000, suffix: '+', label: 'Happy Customers' },
  { value: 500, suffix: '+', label: 'Products Sold' },
  { value: 0, suffix: '', prefix: '', label: '4.9★ Avg Rating', isStatic: true },
  { value: 15, suffix: '+', label: 'Years Experience' },
];

export default function WhyChooseUs() {
  const [features, setFeatures] = useState(defaultFeatures);
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    getHomePage().then(data => {
      if (data?.whyChooseUs?.benefits?.length > 0) {
        setFeatures(data.whyChooseUs.benefits.map((b: any) => ({
          icon: b.icon || 'shield',
          title: b.title,
          desc: b.description,
        })));
      }
    }).catch(() => {});
  }, []);
  return (
    <>
      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 px-4 md:px-8 bg-secondary">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <FadeUp className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-widest font-accent text-brand-600 uppercase bg-brand-50 px-4 py-1.5 rounded-full font-bold">
              Why Choose RelaxPro
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 text-ink-900 leading-tight">
              Engineered for Your Best Sleep
            </h2>
            <p className="text-graphite-500 text-sm mt-3 font-body leading-relaxed">
              Every mattress we craft combines generations of expertise with the finest natural materials.
            </p>
          </FadeUp>

          {/* Feature Cards Grid — stagger reveal */}
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6" stagger={0.1}>
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_LUXURY } }}
                className="bg-white p-4 sm:p-5 md:p-7 rounded-xl sm:rounded-2xl border border-brand-200/60 shadow-sm flex flex-col cursor-default"
              >
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${colorMap[feature.icon] || 'bg-brand-50 text-brand-600 border-brand-600-100'} border flex items-center justify-center mb-3 sm:mb-5 shrink-0`}>
                  {iconMap[feature.icon] || iconMap['shield']}
                </div>
                <h3 className="font-heading font-bold text-xs sm:text-base md:text-lg text-ink-900 mb-1.5 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-graphite-500 text-[10px] sm:text-xs md:text-sm font-body leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Stats Counter Bar — spring count-up with gold underline */}
      <section className="bg-ink-900 py-12 md:py-16 px-4 md:px-8 border-y border-white/10">
        <StaggerChildren className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4" stagger={0.15}>
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className={`text-center ${
                idx < stats.length - 1 ? 'md:border-r md:border-white/10' : ''
              }`}
            >
              {stat.isStatic ? (
                <div className="text-3xl md:text-4xl font-bold font-heading text-white">
                  4.9<span className="text-brand-600">★</span>
                </div>
              ) : (
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  className="text-3xl md:text-4xl font-bold font-heading text-white"
                />
              )}
              {/* Gold underline draw */}
              <div className="w-8 h-[2px] bg-brand-600/40 mx-auto mt-2 rounded-full" />
              <p className="text-white/40 text-xs font-accent uppercase tracking-wider mt-2 font-semibold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </StaggerChildren>
      </section>
    </>
  );
}
