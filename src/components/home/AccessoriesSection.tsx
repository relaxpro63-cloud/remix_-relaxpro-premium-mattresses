import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { FadeUp, StaggerChildren, staggerItem, EASE_LUXURY } from '../motion/motionPrimitives';

const accessories = [
  {
    title: 'Latex Pillows',
    desc: 'Ergonomic cervical support in natural Dunlop latex',
    price: '₹2,499',
    image: '/assets/blob-shape.png',
    bgColor: '#E8F0E4',
    isFeatured: true,
  },
  {
    title: 'Shredded Pillows',
    desc: 'Adjustable loft pillows with natural latex fill',
    price: '₹1,999',
    image: '/assets/blob-shape.png',
    bgColor: '#E8F0E4',
    isFeatured: false,
  },
  {
    title: 'Mattress Protectors',
    desc: 'Breathable waterproof protection, deep-pocket fit',
    price: '₹2,999',
    image: '/assets/blob-shape.png',
    bgColor: '#E8F0E4',
    isFeatured: false,
  },
  {
    title: 'Fiber Pillows',
    desc: 'Soft, plush microfiber for everyday comfort',
    price: '₹999',
    image: '/assets/blob-shape.png',
    bgColor: '#E8F0E4',
    isFeatured: false,
  },
];

export default function AccessoriesSection({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-4 md:px-8" style={{ backgroundColor: '#FDF8F0' }}>
      {/* ── Botanical Decorations ── */}
      {/* Top-left: leaf cluster */}
      <div className="absolute top-0 left-0 w-28 md:w-40 opacity-[0.12] pointer-events-none z-0">
        <img
          src="/assets/leaf-cluster.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto -rotate-12"
        />
      </div>

      {/* Bottom-right: sap drop */}
      <div className="absolute bottom-8 right-8 w-10 md:w-14 opacity-[0.10] pointer-events-none z-0">
        <img
          src="/assets/sap-drop.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto"
        />
      </div>

      {/* Right side: large faded leaf watermark */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-64 md:w-96 opacity-[0.04] pointer-events-none z-0">
        <img
          src="/assets/leaf-single.png"
          alt=""
          aria-hidden="true"
          className="w-full h-auto"
        />
      </div>

      {/* Leaf-vein pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/assets/leaf-pattern.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Section Header ── */}
        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
            <div className="max-w-xl">
              {/* Eyebrow with leaf icon */}
              <span className="inline-flex items-center gap-2 text-[11px] tracking-widest font-accent font-bold uppercase mb-3" style={{ color: '#D4A843' }}>
                <Leaf className="w-3.5 h-3.5" />
                Complete Your Setup
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight" style={{ color: '#1B1B1B' }}>
                Complete Your{' '}
                <span className="italic" style={{ color: '#D4A843' }}>Sleep Sanctuary</span>
              </h2>
              <p className="mt-4 text-sm md:text-base leading-relaxed font-body" style={{ color: '#6B7280' }}>
                Crafted from the same premium materials as our mattresses — naturally. 
                From ergonomic latex pillows to waterproof protectors, every accessory is 
                designed to enhance your sleep experience.
              </p>
            </div>
            <button
              onClick={() => onNavigate('accessories')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold font-accent uppercase tracking-widest transition-all duration-300 cursor-pointer group"
              style={{
                backgroundColor: '#2D6A4F',
                color: '#FFFFFF',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#1B4D3A'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#2D6A4F'; }}
            >
              <ShoppingBag className="w-4 h-4" />
              Shop All Accessories
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </FadeUp>

        {/* ── Accessory Cards ── */}
        {/* Mobile: horizontal scroll */}
        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          <div className="flex gap-4 w-max">
            {accessories.map((item, i) => (
              <AccessoryCard key={i} item={item} index={i} isMobile />
            ))}
          </div>
          {/* Dotted vine connectors between cards (mobile: horizontal) */}
          <div className="flex items-center gap-0 mt-2 mx-8">
            {accessories.map((_, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div className="flex-1 h-px border-t border-dotted" style={{ borderColor: '#D4A843', opacity: 0.3 }} />
                )}
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#D4A843', opacity: 0.25 }} />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Desktop: 2×2 asymmetric grid (first card larger) */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-6">
          {/* Featured card (spans 2 columns, first row) */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE_LUXURY }}
          >
            <FeaturedCard item={accessories[0]} />
          </motion.div>

          {/* Second card (1 column, first row) */}
          <FadeUp delay={0.15}>
            <AccessoryCard item={accessories[1]} index={1} />
          </FadeUp>

          {/* Vine connectors between featured and second card */}
          <div className="col-span-3 flex items-center gap-3 -mt-2 -mb-2">
            <div className="flex-1 h-px border-t border-dotted" style={{ borderColor: '#D4A843', opacity: 0.2 }} />
            <img src="/assets/sap-drop.png" alt="" aria-hidden="true" className="w-4 h-4 opacity-30" />
            <div className="flex-1 h-px border-t border-dotted" style={{ borderColor: '#D4A843', opacity: 0.2 }} />
          </div>

          {/* Third + Fourth cards (second row) */}
          <StaggerChildren className="col-span-3 grid grid-cols-2 gap-5 lg:gap-6" stagger={0.12}>
            {accessories.slice(2).map((item, i) => (
              <motion.div key={i + 2} variants={staggerItem}>
                <AccessoryCard item={item} index={i + 2} />
              </motion.div>
            ))}
          </StaggerChildren>
        </div>

        {/* ── Bottom vine decoration ── */}
        <div className="flex items-center justify-center gap-3 mt-10 md:mt-14">
          <img src="/assets/leaf-single.png" alt="" aria-hidden="true" className="w-5 h-5 opacity-20 -rotate-12" />
          <div className="flex-1 max-w-[200px] h-px border-t border-dotted" style={{ borderColor: '#D4A843', opacity: 0.25 }} />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D4A843', opacity: 0.35 }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D4A843', opacity: 0.25 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D4A843', opacity: 0.35 }} />
          </div>
          <div className="flex-1 max-w-[200px] h-px border-t border-dotted" style={{ borderColor: '#D4A843', opacity: 0.25 }} />
          <img src="/assets/sap-drop.png" alt="" aria-hidden="true" className="w-4 h-4 opacity-20" />
        </div>
      </div>
    </section>
  );
}

/* ── Regular Accessory Card ── */
function AccessoryCard({ item, index, isMobile }: {
  item: typeof accessories[0]; index: number; isMobile?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: EASE_LUXURY, delay: 0.08 * index }}
      whileHover={{ y: -8 }}
      className={`relative group cursor-default snap-start ${isMobile ? 'w-[260px] shrink-0' : ''}`}
    >
      {/* Card */}
      <div
        className="relative rounded-[1.75rem] border overflow-hidden transition-all duration-500 h-full flex flex-col"
        style={{
          backgroundColor: item.bgColor,
          borderColor: '#D4A843',
          borderLeftWidth: '4px',
          borderLeftColor: '#D4A843',
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1.75rem]"
          style={{
            boxShadow: '0 0 30px rgba(212, 168, 67, 0.15), 0 8px 32px rgba(212, 168, 67, 0.08)',
          }}
        />

        {/* Leaf icon decoration */}
        <div className="absolute top-3 right-3 w-6 h-6 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-500">
          <img src="/assets/leaf-single.png" alt="" aria-hidden="true" className="w-full h-auto rotate-45" />
        </div>

        {/* Image container - organic blob shape */}
        <div
          className="relative mx-4 mt-4 overflow-hidden"
          style={{
            borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
            aspectRatio: '4/3',
            backgroundColor: '#FFFFFF',
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Subtle gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 md:p-5 flex flex-col flex-1">
          <h3 className="font-heading font-bold text-sm md:text-base" style={{ color: '#1B1B1B' }}>
            {item.title}
          </h3>
          <p className="text-[10px] md:text-xs mt-1 leading-relaxed font-body flex-1" style={{ color: '#6B7280' }}>
            {item.desc}
          </p>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'rgba(212, 168, 67, 0.2)' }}>
            {/* Price pill */}
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-accent"
              style={{ backgroundColor: '#E07A5F', color: '#FFFFFF' }}
            >
              {item.price}
            </span>

            {/* Small leaf accent */}
            <Leaf className="w-3 h-3" style={{ color: '#2D6A4F', opacity: 0.3 }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Featured Card (larger, first item) ── */
function FeaturedCard({ item }: { item: typeof accessories[0] }) {
  return (
    <div className="relative group cursor-default h-full">
      <div
        className="relative rounded-[1.75rem] border overflow-hidden transition-all duration-500 h-full flex flex-col md:flex-row"
        style={{
          backgroundColor: item.bgColor,
          borderColor: '#D4A843',
          borderLeftWidth: '4px',
          borderLeftColor: '#D4A843',
        }}
      >
        {/* Hover gold glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1.75rem]"
          style={{
            boxShadow: '0 0 40px rgba(212, 168, 67, 0.18), 0 8px 40px rgba(212, 168, 67, 0.1)',
          }}
        />

        {/* Leaf decorations */}
        <div className="absolute top-3 right-3 w-8 h-8 opacity-[0.12] group-hover:opacity-[0.2] transition-opacity duration-500 z-10">
          <img src="/assets/leaf-cluster.png" alt="" aria-hidden="true" className="w-full h-auto" />
        </div>

        {/* Best Seller badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-bold font-accent uppercase tracking-wider"
            style={{ backgroundColor: '#D4A843', color: '#FFFFFF' }}
          >
            <Sparkles className="w-2.5 h-2.5" />
            Best Seller
          </span>
        </div>

        {/* Image - left side (larger) */}
        <div
          className="relative w-full md:w-[45%] overflow-hidden shrink-0"
          style={{
            borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
            minHeight: '200px',
            backgroundColor: '#FFFFFF',
            margin: '12px',
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        </div>

        {/* Content - right side */}
        <div className="p-5 md:p-6 flex flex-col justify-center flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4" style={{ color: '#2D6A4F' }} />
            <h3 className="font-heading font-bold text-lg md:text-xl" style={{ color: '#1B1B1B' }}>
              {item.title}
            </h3>
          </div>
          <p className="text-xs md:text-sm leading-relaxed font-body" style={{ color: '#6B7280' }}>
            {item.desc}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold font-accent"
              style={{ backgroundColor: '#E07A5F', color: '#FFFFFF' }}
            >
              {item.price}
            </span>
            <span className="text-[10px] font-medium" style={{ color: '#2D6A4F' }}>
              🌿 Premium Pick
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
