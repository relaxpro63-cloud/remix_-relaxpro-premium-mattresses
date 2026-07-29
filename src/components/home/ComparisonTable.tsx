import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, X, Leaf, Award, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { FadeUp, EASE_LUXURY } from '../motion/motionPrimitives';
import { getHomePage } from '../../lib/queries';

const iconMap: Record<string, React.ReactNode> = {
  leaf: <Leaf className="w-5 h-5" style={{ color: '#2D6A4F' }} />,
  award: <Award className="w-5 h-5" style={{ color: '#2D6A4F' }} />,
  sliders: <SlidersHorizontal className="w-5 h-5" style={{ color: '#2D6A4F' }} />,
  shield: <ShieldCheck className="w-5 h-5" style={{ color: '#2D6A4F' }} />,
  check: <Check className="w-5 h-5" style={{ color: '#2D6A4F' }} />,
};

const defaultData = {
  sectionTitle: 'Why Choose RelaxPro?',
  sectionSubtitle: 'See how we are compared to other mattress brands',
  items: [
    { relaxProTitle: 'Natural latex', icon: 'leaf', otherTitle: 'Memory foam / Synthetic foam', otherSubtext: 'Latex is often just a thin synthetic layer' },
    { relaxProTitle: 'GOLS certified', icon: 'award', otherTitle: 'None / false claims' },
    { relaxProTitle: 'Tailored to your comfort', icon: 'sliders', otherTitle: 'Too firm / Too soft - sinks' },
    { relaxProTitle: 'Safe for all', icon: 'shield', otherTitle: 'Releases cancer causing gas every day' },
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
    <section className="relative overflow-hidden py-20 md:py-28 px-4 md:px-8" style={{ backgroundColor: '#E8F0E4' }}>
      {/* ── Decorative Elements ── */}

      {/* Left side: tall rubber tree branch */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 opacity-[0.08] pointer-events-none z-0 overflow-hidden">
        <img
          src="/assets/rubber-tree.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-left"
        />
      </div>

      {/* Right side: floating leaves */}
      <div className="absolute top-20 right-8 w-16 md:w-24 opacity-[0.10] pointer-events-none z-0">
        <motion.img
          src="/assets/leaf-cluster.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto -rotate-12"
          animate={{ y: [0, -6, 0], rotate: [-12, -8, -12] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="absolute bottom-32 right-12 w-10 md:w-16 opacity-[0.08] pointer-events-none z-0">
        <motion.img
          src="/assets/leaf-single.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto rotate-45"
          animate={{ y: [0, -10, 0], rotate: [45, 50, 45] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </div>
      <div className="absolute top-1/3 right-4 w-8 md:w-12 opacity-[0.06] pointer-events-none z-0">
        <motion.img
          src="/assets/leaf-single.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto -rotate-30"
          animate={{ y: [0, -8, 0], rotate: [-30, -25, -30] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
      </div>

      {/* Leaf-vein pattern background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/leaf-pattern.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
        }}
      />

      {/* Gold particle dots scatter */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: '#D4A843',
              opacity: 0.08,
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ── Section Header ── */}
        <FadeUp className="text-center mb-12 md:mb-16">
          {/* "100% Natural" floating badge */}
          <motion.span
            initial={{ scale: 0, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold font-accent uppercase tracking-wider mb-4 shadow-md"
            style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF' }}
          >
            <Leaf className="w-3 h-3" />
            100% Natural
          </motion.span>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight"
            style={{ color: '#1B1B1B' }}
          >
            The{' '}
            <span className="italic" style={{ color: '#D4A843' }}>
              RelaxPro
            </span>{' '}
            Difference
          </h2>              {data.sectionSubtitle && (
                <p
                  className="text-sm md:text-base mt-4 max-w-xl mx-auto font-body leading-relaxed"
                  style={{ color: '#6B7280' }}
                >
                  {data.sectionSubtitle}
                </p>
              )}

          {/* Hand-drawn gold wavy underline */}
          <div className="flex justify-center mt-4">
            <div className="w-24 h-[2px]" style={{ backgroundColor: '#D4A843', opacity: 0.4, borderRadius: '1px' }} />
            <img src="/assets/sap-drop.png" alt="" aria-hidden="true" className="w-4 h-4 mx-1 opacity-30 -mt-1" />
            <div className="w-24 h-[2px]" style={{ backgroundColor: '#D4A843', opacity: 0.4, borderRadius: '1px' }} />
          </div>
        </FadeUp>

        {/* ── Comparison Rows ── */}
        <div className="space-y-4 md:space-y-6">
          {/* Header Row */}
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {/* RelaxPro header */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: EASE_LUXURY }}
              className="relative p-4 md:p-5 rounded-2xl overflow-hidden"
              style={{
                backgroundColor: '#2D6A4F',
                borderLeft: '4px solid #D4A843',
              }}
            >
              {/* Gold glow on left border */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[4px] opacity-60 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, #D4A843, rgba(212, 168, 67, 0.2))',
                }}
              />
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 md:w-6 md:h-6 shrink-0" style={{ color: '#D4A843' }} />
                <h3 className="text-white font-heading font-bold text-base md:text-lg">RelaxPro</h3>
              </div>
            </motion.div>

            {/* Other Brands header */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: EASE_LUXURY, delay: 0.1 }}
              className="p-4 md:p-5 rounded-2xl"
              style={{ backgroundColor: '#9CA3AF', opacity: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 md:w-6 md:h-6 shrink-0" style={{ color: '#E07A5F' }} />
                <h3 className="font-heading font-bold text-base md:text-lg" style={{ color: '#6B7280' }}>Other Brands</h3>
              </div>
            </motion.div>
          </div>

          {/* Data Rows */}
          {data.items.map((row: any, idx: number) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: EASE_LUXURY, delay: idx * 0.1 }}
                className="grid grid-cols-2 gap-3 md:gap-6"
              >
                {/* Zigzag offset: even rows shift right, odd rows shift left */}
                <div className={`${isEven ? 'md:ml-4' : ''} transition-all duration-300`}>
                  {/* RelaxPro side — green checkmark */}
                  <div
                    className="relative p-4 md:p-5 rounded-2xl flex items-center gap-3 md:gap-4 h-full transition-all duration-300"
                    style={{
                      backgroundColor: isEven ? '#FFFFFF' : '#FDF8F0',
                      borderLeft: '4px solid #D4A843',
                      boxShadow: isEven
                        ? '0 0 20px rgba(212, 168, 67, 0.08), 0 2px 8px rgba(0,0,0,0.03)'
                        : '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >


                    {/* Green circle checkmark with leaf */}
                    <div
                      className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center shrink-0 relative"
                      style={{ backgroundColor: '#2D6A4F' }}
                    >
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={3} />
                      {/* Small leaf growing from checkmark */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 opacity-80">
                        <img src="/assets/leaf-single.png" alt="" aria-hidden="true" className="w-full h-auto rotate-45" />
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="shrink-0 opacity-70">
                      {iconMap[row.icon] || iconMap['leaf']}
                    </div>

                    <span
                      className="font-semibold text-sm md:text-base leading-tight"
                      style={{ color: '#1B1B1B' }}
                    >
                      {row.relaxProTitle}
                    </span>
                  </div>
                </div>

                <div className={`${isEven ? '' : 'md:mr-4'} transition-all duration-300`}>
                  {/* Other Brands side — red/coral cross */}
                  <div
                    className="p-4 md:p-5 rounded-2xl flex flex-col justify-center gap-1 h-full transition-all duration-300"
                    style={{
                      backgroundColor: isEven ? '#FDF8F0' : '#FFFFFF',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      {/* Red/coral cross */}
                      <div
                        className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center shrink-0 relative"
                        style={{ backgroundColor: '#FEE2E2' }}
                      >
                        <X className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#E07A5F' }} strokeWidth={3} />
                        {/* Wilted leaf */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 opacity-40 rotate-180">
                          <img src="/assets/leaf-single.png" alt="" aria-hidden="true" className="w-full h-auto" />
                        </div>
                      </div>

                      <span
                        className="font-medium text-xs md:text-base leading-tight"
                        style={{ color: '#6B7280' }}
                      >
                        {row.otherTitle}
                      </span>
                    </div>

                    {row.otherSubtext && (
                      <p
                        className="text-[10px] md:text-xs leading-tight mt-1.5 ml-12"
                        style={{ color: '#9CA3AF' }}
                      >
                        {row.otherSubtext}
                      </p>
                    )}
                  </div>
                </div>

                {/* Gold dotted line separator (except after last row) */}
                {idx < data.items.length - 1 && (
                  <div className="col-span-2 flex items-center gap-2 px-2 md:px-4 -my-0.5">
                    <div className="flex-1 h-px border-t border-dotted" style={{ borderColor: '#D4A843', opacity: 0.2 }} />
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#D4A843', opacity: 0.15 }} />
                    <div className="flex-1 h-px border-t border-dotted" style={{ borderColor: '#D4A843', opacity: 0.2 }} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom insight banner ── */}
        <FadeUp delay={0.3}>
          <div
            className="mt-10 md:mt-14 p-4 md:p-6 rounded-2xl max-w-2xl mx-auto text-center relative overflow-hidden"
            style={{ backgroundColor: '#FDF8F0', borderLeft: '4px solid #D4A843' }}
          >
            {/* Leaf decorations on sides */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 opacity-15">
              <img src="/assets/leaf-single.png" alt="" aria-hidden="true" className="w-full h-auto -rotate-12" />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 opacity-15">
              <img src="/assets/leaf-single.png" alt="" aria-hidden="true" className="w-full h-auto rotate-45" />
            </div>

            <p
              className="font-medium text-sm md:text-base leading-relaxed relative z-10"
              style={{ color: '#1B1B1B' }}
            >
              🌿 100% Natural Latex. Zero Compromise. Every Single Night.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* ── Wavy green divider at bottom ── */}
      <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 pointer-events-none overflow-hidden z-0">
        <img
          src="/assets/vine-divider.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-bottom opacity-40"
        />
      </div>
    </section>
  );
}
