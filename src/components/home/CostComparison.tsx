import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Crown, X, Coffee, DollarSign, Clock, TrendingDown, Leaf } from 'lucide-react';
import { FadeUp, EASE_LUXURY } from '../motion/motionPrimitives';
import { getHomePage } from '../../lib/queries';

const defaultData = [
  { label: 'Avg. Price (Double Bed)', latex: '₹40,000', foam: '₹20,000', foamHigher: false },
  { label: 'Avg. Lifespan', latex: '15 Years', foam: '7 Years', foamHigher: false },
  { label: 'Per Year Cost', latex: '₹2,700/yr', foam: '₹2,900/yr', foamHigher: true },
  { label: 'Per Day Cost', latex: '₹7/day', foam: '₹8/day', foamHigher: true },
];

const statIcons: Record<string, React.ReactNode> = {
  'Avg. Price': <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4" />,
  'Avg. Lifespan': <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />,
  'Per Year Cost': <TrendingDown className="w-3.5 h-3.5 md:w-4 md:h-4" />,
  'Per Day Cost': <Coffee className="w-3.5 h-3.5 md:w-4 md:h-4" />,
};

const goldLeaves = [
  { top: '8%', left: '5%', size: 'w-6', delay: 0, rotate: -15 },
  { top: '25%', right: '8%', size: 'w-8', delay: 1.5, rotate: 30 },
  { top: '55%', left: '12%', size: 'w-5', delay: 0.8, rotate: -40 },
  { top: '75%', right: '5%', size: 'w-7', delay: 2.2, rotate: 20 },
  { top: '40%', left: '3%', size: 'w-4', delay: 3, rotate: 10 },
  { top: '85%', left: '20%', size: 'w-5', delay: 1.2, rotate: -25 },
  { top: '15%', right: '15%', size: 'w-4', delay: 2.8, rotate: 45 },
  { top: '65%', right: '20%', size: 'w-6', delay: 0.5, rotate: -10 },
];

export default function CostComparison() {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    getHomePage().then(p => {
      const c = p?.costComparison;
      if (c?.naturalLatex && c?.ordinaryFoam) {
        setData([
          { label: 'Avg. Price (Double Bed)', latex: c.naturalLatex.avgPrice, foam: c.ordinaryFoam.avgPrice, foamHigher: false },
          { label: 'Avg. Lifespan', latex: c.naturalLatex.lifespan, foam: c.ordinaryFoam.lifespan, foamHigher: false },
          { label: 'Per Year Cost', latex: c.naturalLatex.perYearCost, foam: c.ordinaryFoam.perYearCost, foamHigher: true },
          { label: 'Per Day Cost', latex: c.naturalLatex.perDayCost, foam: c.ordinaryFoam.perDayCost, foamHigher: true },
        ]);
      }
    }).catch(() => {});
  }, []);

  const perDayRow = data.find(r => r.label.includes('Per Day Cost'));

  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-4 md:px-8" style={{ backgroundColor: '#2D6A4F' }}>
      {/* ── Decorative Elements ── */}

      {/* Corner rubber branch - top-right */}
      <div className="absolute top-0 right-0 w-32 md:w-48 opacity-[0.08] pointer-events-none z-0">
        <img
          src="/assets/branch-leaves.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto rotate-12"
        />
      </div>

      {/* Corner rubber branch - bottom-left */}
      <div className="absolute bottom-0 left-0 w-40 md:w-56 opacity-[0.06] pointer-events-none z-0">
        <img
          src="/assets/rubber-tree.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto"
        />
      </div>

      {/* Scattered gold leaves */}
      {goldLeaves.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-0"
          style={{
            top: leaf.top,
            left: leaf.left,
            right: (leaf as any).right,
            width: leaf.size.includes('w-6') ? '24px' : leaf.size.includes('w-8') ? '32px' : leaf.size.includes('w-7') ? '28px' : leaf.size.includes('w-5') ? '20px' : '16px',
            opacity: 0.1,
          }}
          animate={{ y: [0, -4, 0], rotate: [leaf.rotate, leaf.rotate + 5, leaf.rotate] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: leaf.delay }}
        >
          <img src="/assets/leaf-single.png" alt="" aria-hidden="true" className="w-full h-auto" style={{ filter: 'brightness(0) saturate(100%) invert(74%) sepia(32%) saturate(580%) hue-rotate(2deg) brightness(89%) contrast(87%)' }} />
        </motion.div>
      ))}

      {/* Subtle radial gradient glow behind VS badge */}
      <div
        className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(212, 168, 67, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ── Section Header ── */}
        <FadeUp className="text-center mb-14 md:mb-20">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight"
            style={{ color: '#FDF8F0' }}
          >
            The Real Cost of{' '}
            <span className="italic" style={{ color: '#D4A843' }}>
              Sleep
            </span>
          </h2>

          {/* Hand-drawn gold wavy underline */}
          <div className="flex justify-center mt-4">
            <div className="w-24 h-[2px]" style={{ backgroundColor: '#D4A843', opacity: 0.4, borderRadius: '1px' }} />
            <img src="/assets/sap-drop.png" alt="" aria-hidden="true" className="w-4 h-4 mx-1 opacity-30 -mt-1" />
            <div className="w-24 h-[2px]" style={{ backgroundColor: '#D4A843', opacity: 0.4, borderRadius: '1px' }} />
          </div>

          <p
            className="text-sm md:text-base mt-4 max-w-xl mx-auto font-body leading-relaxed"
            style={{ color: 'rgba(253, 248, 240, 0.7)' }}
          >
            A deeper look at what you're really paying — today and over time.
          </p>
        </FadeUp>

        {/* ── VS Battle Cards Layout ── */}
        <div className="relative max-w-5xl mx-auto">
          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-6">
            {/* Latex Card */}
            <div
              className="rounded-[1.75rem] overflow-hidden shadow-xl"
              style={{ backgroundColor: '#FDF8F0' }}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5" style={{ color: '#D4A843' }} />
                  <h3 className="font-heading font-bold text-lg" style={{ color: '#2D6A4F' }}>Natural Latex</h3>
                </div>
                {data.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: 'rgba(45, 106, 79, 0.1)' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#2D6A4F', opacity: 0.6 }}>
                        {statIcons[row.label.split(' (')[0] as keyof typeof statIcons] || <Leaf className="w-3.5 h-3.5" />}
                      </span>
                      <span className="text-xs font-medium" style={{ color: '#2D6A4F' }}>
                        {row.label.split(' (')[0]}
                      </span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: '#2D6A4F' }}>{row.latex}</span>
                  </div>
                ))}
                {perDayRow && (
                  <div
                    className="mt-4 px-4 py-2.5 rounded-xl flex items-center justify-between"
                    style={{ backgroundColor: '#D4A843', opacity: 0.9 }}
                  >
                    <span className="text-xs font-bold text-white">☕ Just {perDayRow.latex}/day</span>
                    <span className="text-[10px] text-white/80">vs {perDayRow.foam}/day</span>
                  </div>
                )}
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex justify-center -my-3 relative z-20">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-[3px] border-white relative"
                style={{ backgroundColor: '#D4A843' }}
              >
                <span className="font-heading font-bold text-lg text-white">VS</span>
                {/* Radiating lines */}
                <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: '#D4A843' }}>
                  <div className="absolute inset-[-4px] rounded-full border" style={{ borderColor: '#D4A843', opacity: 0.2 }} />
                  <div className="absolute inset-[-8px] rounded-full border" style={{ borderColor: '#D4A843', opacity: 0.1 }} />
                </div>
              </motion.div>
            </div>

            {/* Foam Card */}
            <div
              className="rounded-[1.75rem] overflow-hidden shadow-xl"
              style={{ backgroundColor: '#F3F4F6', opacity: 0.85 }}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <X className="w-5 h-5" style={{ color: '#9CA3AF' }} />
                  <h3 className="font-heading font-bold text-lg" style={{ color: '#6B7280' }}>Ordinary Foam</h3>
                </div>
                {data.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: 'rgba(107, 114, 128, 0.15)' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#6B7280', opacity: 0.5 }}>
                        {statIcons[row.label.split(' (')[0] as keyof typeof statIcons] || <Leaf className="w-3.5 h-3.5" />}
                      </span>
                      <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                        {row.label.split(' (')[0]}
                      </span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: '#6B7280' }}>{row.foam}</span>
                  </div>
                ))}
                {perDayRow && (
                  <div
                    className="mt-4 px-4 py-2.5 rounded-xl flex items-center justify-between"
                    style={{ backgroundColor: '#E5E7EB' }}
                  >
                    <span className="text-xs font-bold" style={{ color: '#6B7280' }}>{perDayRow.foam}/day</span>
                    <span className="text-[10px]" style={{ color: '#9CA3AF' }}>per day cost</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop: side-by-side cards with VS in center */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* LEFT: Natural Latex Card */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: EASE_LUXURY }}
              className="rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.12)] relative group"
              style={{ backgroundColor: '#FDF8F0' }}
            >
              {/* Hover gold glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"
                style={{ boxShadow: 'inset 0 0 40px rgba(212, 168, 67, 0.08)' }}
              />
              <div className="p-6 lg:p-8">
                {/* Header with golden crown */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: 'rgba(45, 106, 79, 0.1)' }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#D4A843' }}
                  >
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl" style={{ color: '#2D6A4F' }}>Natural Latex</h3>
                    <p className="text-[10px] font-accent tracking-wider uppercase" style={{ color: '#2D6A4F', opacity: 0.5 }}>Premium Choice</p>
                  </div>
                </div>

                {/* Stat rows */}
                <div className="space-y-1">
                  {data.map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3 px-3 rounded-xl transition-colors duration-200"
                      style={{ backgroundColor: idx % 2 === 0 ? 'rgba(45, 106, 79, 0.03)' : 'transparent' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span style={{ color: '#2D6A4F', opacity: 0.5 }}>
                          {statIcons[row.label.split(' (')[0] as keyof typeof statIcons] || <Leaf className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-xs font-medium" style={{ color: '#2D6A4F' }}>
                          {row.label.split(' (')[0]}
                        </span>
                      </div>
                      <span className="font-bold text-sm" style={{ color: '#2D6A4F' }}>{row.latex}</span>
                    </div>
                  ))}
                </div>

                {/* Per Day Cost highlight */}
                {perDayRow && (
                  <div
                    className="mt-5 px-5 py-3 rounded-2xl flex items-center justify-between"
                    style={{ backgroundColor: '#D4A843' }}
                  >
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-white" />
                      <span className="text-sm font-bold text-white">Just {perDayRow.latex}/day ☕</span>
                    </div>
                    <span className="text-[10px] text-white/70">vs {perDayRow.foam}/day</span>
                  </div>
                )}

                {/* Leaf accent bottom-right */}
                <div className="flex justify-end mt-3">
                  <img src="/assets/leaf-single.png" alt="" aria-hidden="true" className="w-6 h-6 opacity-15 rotate-45" />
                </div>
              </div>
            </motion.div>

            {/* RIGHT: Ordinary Foam Card */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: EASE_LUXURY, delay: 0.1 }}
              className="rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.06)] relative"
              style={{ backgroundColor: '#F3F4F6', opacity: 0.7 }}
            >
              <div className="p-6 lg:p-8">
                {/* Header with cross */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: 'rgba(107, 114, 128, 0.15)' }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#D1D5DB' }}
                  >
                    <X className="w-5 h-5" style={{ color: '#9CA3AF' }} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl" style={{ color: '#6B7280' }}>Ordinary Foam</h3>
                    <p className="text-[10px] font-accent tracking-wider uppercase" style={{ color: '#6B7280', opacity: 0.4 }}>Conventional Option</p>
                  </div>
                </div>

                {/* Stat rows */}
                <div className="space-y-1">
                  {data.map((row, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3 px-3 rounded-xl"
                      style={{ backgroundColor: idx % 2 === 0 ? 'rgba(107, 114, 128, 0.04)' : 'transparent' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span style={{ color: '#6B7280', opacity: 0.4 }}>
                          {statIcons[row.label.split(' (')[0] as keyof typeof statIcons] || <Leaf className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-xs font-medium" style={{ color: '#6B7280' }}>
                          {row.label.split(' (')[0]}
                        </span>
                      </div>
                      <span className="font-bold text-sm" style={{ color: '#6B7280' }}>{row.foam}</span>
                    </div>
                  ))}
                </div>

                {/* Per Day Cost — less emphasized */}
                {perDayRow && (
                  <div
                    className="mt-5 px-5 py-3 rounded-2xl flex items-center justify-between"
                    style={{ backgroundColor: '#E5E7EB' }}
                  >
                    <span className="text-sm font-bold" style={{ color: '#6B7280' }}>{perDayRow.foam}/day</span>
                    <span className="text-[10px]" style={{ color: '#9CA3AF' }}>per day cost</span>
                  </div>
                )}

                {/* Cross accent bottom-right */}
                <div className="flex justify-end mt-3">
                  <X className="w-5 h-5" style={{ color: '#D1D5DB' }} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* VS Badge (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
              className="relative"
            >
              {/* Outer glow rings */}
              <div
                className="absolute inset-[-12px] rounded-full"
                style={{
                  border: '1px solid rgba(212, 168, 67, 0.15)',
                  animation: 'pulseGlow 3s ease-in-out infinite',
                }}
              />
              <div
                className="absolute inset-[-24px] rounded-full"
                style={{
                  border: '1px solid rgba(212, 168, 67, 0.08)',
                  animation: 'pulseGlow 3s ease-in-out infinite 0.5s',
                }}
              />

              {/* Main VS circle */}
              <div
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,168,67,0.2)] border-[3px] border-white relative"
                style={{ backgroundColor: '#D4A843' }}
              >
                <span className="font-heading font-bold text-xl lg:text-2xl text-white">VS</span>

                {/* Radiating lines */}
                <div className="absolute inset-[-3px] rounded-full border-2" style={{ borderColor: 'rgba(212, 168, 67, 0.3)' }}>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                    <div
                      key={deg}
                      className="absolute top-1/2 left-1/2 w-8 h-[1px]"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${deg}deg) translateX(28px)`,
                        backgroundColor: '#D4A843',
                        opacity: 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Bottom insight banner ── */}
        <FadeUp delay={0.4}>
          <div
            className="mt-10 md:mt-16 p-4 md:p-6 rounded-2xl max-w-2xl mx-auto text-center relative overflow-hidden"
            style={{ backgroundColor: '#FDF8F0', borderLeft: '4px solid #D4A843' }}
          >
            {/* Leaf decorations */}
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
              🌿 Better sleep. Lower cost. Every single day.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* ── Keyframes for pulse glow ── */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.6; }
          }
        }
      `}</style>
    </section>
  );
}
