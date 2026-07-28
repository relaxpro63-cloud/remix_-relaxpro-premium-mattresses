import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { getAccessories, imageUrl } from '../../lib/queries';
import { SanityAccessory, AccessoryType } from '../../lib/sanityTypes';
import { FadeUp, StaggerChildren, staggerItem } from '../../components/motion/motionPrimitives';
import { Search, BedDouble, Bed, Shield, Check, Star, ChevronRight, ShoppingBag, Sparkles, RefreshCw, Package, Tag } from 'lucide-react';
import PriceText from '../../components/ui/PriceText';
import PageShell from '../../components/layout/PageShell';

const TYPE_LABELS: Record<AccessoryType, string> = {
  latex_pillow: 'Latex Pillow',
  shredded_pillow: 'Shredded Latex Pillow',
  fiber_pillow: 'Fiber Pillow',
  mattress_protector: 'Mattress Protector',
  other: 'Accessory',
};

const TYPE_ICONS: Record<AccessoryType, React.ReactNode> = {
  latex_pillow: <BedDouble className="w-5 h-5" />,
  shredded_pillow: <BedDouble className="w-5 h-5" />,
  fiber_pillow: <BedDouble className="w-5 h-5" />,
  mattress_protector: <Bed className="w-5 h-5" />,
  other: <Package className="w-5 h-5" />,
};

function AccCard({ acc }: { acc: SanityAccessory }) {
  const imgSrc = imageUrl(acc.thumbnail) || imageUrl(acc.images?.[0]) || '';
  const hasDiscount = acc.pricing.mrp > acc.pricing.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-brand-200/40 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-brand-500/5 hover:border-brand-300 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 sm:h-56 bg-sky-100 overflow-hidden">
        {acc.isNew && (
          <span className="absolute top-3 left-3 z-10 bg-brand-600 text-white text-[9px] font-accent font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
            New
          </span>
        )}
        {acc.isBestseller && !acc.isNew && (
          <span className="absolute top-3 left-3 z-10 bg-ink-900 text-white text-[9px] font-accent font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
            Bestseller
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-3 right-3 z-10 bg-green-500 text-white text-[9px] font-accent font-bold px-2.5 py-1 rounded-full shadow-lg">
            {Math.round((1 - acc.pricing.price / acc.pricing.mrp) * 100)}% OFF
          </span>
        )}
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={acc.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
              {TYPE_ICONS[acc.type] || <Package className="w-8 h-8 text-brand-400" />}
            </div>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-ink-900 text-[11px] font-accent font-bold px-5 py-2.5 rounded-xl shadow-xl flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
            Quick View <ChevronRight className="w-3.5 h-3.5 text-brand-600" />
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="inline-flex items-center gap-1 text-[9px] font-accent font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full mb-2">
            {TYPE_ICONS[acc.type]}
            {TYPE_LABELS[acc.type]}
          </span>
          <h3 className="font-heading font-bold text-lg text-ink-900 mt-1.5 leading-tight">{acc.name}</h3>
          {acc.tagline && (
            <p className="text-[11px] text-graphite-500 font-body italic mt-1 leading-relaxed line-clamp-1">{acc.tagline}</p>
          )}
          {acc.description && (
            <p className="text-xs text-graphite-600 font-body mt-3 leading-relaxed line-clamp-2">{acc.description}</p>
          )}

          {/* Features */}
          {acc.features && acc.features.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {acc.features.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px] text-graphite-500 font-body">
                  <Check className="w-3 h-3 text-eco-500 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}

          {/* Sizes pill */}
          {acc.sizes && acc.sizes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {acc.sizes.map((s) => (
                <span key={s} className="text-[8px] font-accent font-bold uppercase tracking-wider text-graphite-500 bg-sky-100 border border-brand-200/40 px-2 py-0.5 rounded-md">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-5 pt-4 border-t border-brand-200/40">
          {acc.pricing.price > 0 ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-heading text-ink-900">
                <PriceText>₹{acc.pricing.price.toLocaleString('en-IN')}</PriceText>
              </span>
              {hasDiscount && (
                <span className="text-sm text-graphite-400 line-through">
                  <PriceText>₹{acc.pricing.mrp.toLocaleString('en-IN')}</PriceText>
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm font-accent font-bold text-brand-600">Price on Request</span>
          )}
          {!acc.inStock && (
            <span className="text-[10px] font-accent font-bold uppercase tracking-widest text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<SanityAccessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<AccessoryType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAccessories()
      .then(setAccessories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = accessories.filter((acc) => {
    if (activeFilter !== 'all' && acc.type !== activeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        acc.name.toLowerCase().includes(q) ||
        (acc.tagline || '').toLowerCase().includes(q) ||
        (acc.description || '').toLowerCase().includes(q) ||
        (acc.features || []).some((f) => f.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const typeCounts = accessories.reduce(
    (acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const filterOptions: { value: AccessoryType | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'All Accessories', count: accessories.length },
    { value: 'latex_pillow', label: 'Latex Pillows', count: typeCounts.latex_pillow || 0 },
    { value: 'shredded_pillow', label: 'Shredded Pillows', count: typeCounts.shredded_pillow || 0 },
    { value: 'fiber_pillow', label: 'Fiber Pillows', count: typeCounts.fiber_pillow || 0 },
    { value: 'mattress_protector', label: 'Protectors', count: typeCounts.mattress_protector || 0 },
  ].filter((o) => o.count > 0);

  return (
    <PageShell
      title="Mattress Accessories — Pillows & Protectors | RelaxPro"
      description="Complete your sleep setup with GOLS-certified latex pillows, shredded latex pillows, fiber pillows, and elasticated mattress protectors. Direct factory pricing."
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Header */}
        <FadeUp><div className="mb-12 border-b border-brand-200/40 pb-10">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-widest font-accent text-brand-600 uppercase bg-brand-50 px-4 py-1.5 rounded-full font-bold">
            <Tag className="w-3.5 h-3.5" /> RelaxPro Premium Accessories
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mt-6 text-ink-900 leading-[1.1]">
            Complete Your <span className="text-brand-600">Sleep System</span>
          </h1>
          <p className="text-graphite-600 text-base md:text-lg mt-6 font-body leading-relaxed max-w-2xl">
            Designed to complement your RelaxPro mattress perfectly. From ergonomic latex pillows to waterproof protectors — all handcrafted with the same natural materials and quality standards.
          </p>
        </div></FadeUp>

        {/* Filters */}
        {filterOptions.length > 1 && (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setActiveFilter(opt.value)}
                  className={`text-[10px] font-accent font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    activeFilter === opt.value
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20'
                      : 'bg-white text-graphite-600 border-brand-200/50 hover:border-brand-500 hover:text-brand-600'
                  }`}
                >
                  {opt.label}
                  <span className={`ml-1.5 text-[9px] ${activeFilter === opt.value ? 'text-white/70' : 'text-graphite-400'}`}>
                    ({opt.count})
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="w-full sm:w-64 relative">
              <Search className="w-3.5 h-3.5 text-graphite-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search accessories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-200/40 text-sm font-body focus:outline-none focus:ring-2 focus:ring-brand-600/15 focus:border-brand-600 bg-white transition-all placeholder:text-graphite-400"
              />
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-brand-200/40 overflow-hidden animate-pulse">
                <div className="h-48 bg-sky-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-sky-100 rounded w-1/3" />
                  <div className="h-5 bg-sky-100 rounded w-2/3" />
                  <div className="h-3 bg-sky-100 rounded w-full" />
                  <div className="h-3 bg-sky-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <FadeUp><AnimatePresence mode="popLayout">
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((acc) => (
                <motion.div key={(acc as any)._id || acc.name} variants={staggerItem}>
                  <AccCard acc={acc} />
                </motion.div>
              ))}
            </StaggerChildren>
          </AnimatePresence></FadeUp>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-secondary rounded-3xl border border-brand-200/40 max-w-lg mx-auto"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-brand-200/40">
              <Package className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="font-heading font-bold text-xl text-ink-900 mb-2">No Accessories Found</h3>
            <p className="text-sm text-graphite-500 font-body mb-6">
              {searchTerm
                ? 'Try adjusting your search or filter.'
                : 'Accessories coming soon. Check back later.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
              className="inline-flex items-center gap-2 bg-ink-900 text-white text-xs font-accent font-bold px-5 py-3 rounded-xl cursor-pointer hover:bg-ink-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </motion.div>
        )}

        {/* CTA Banner */}
        <FadeUp><section className="mt-20 bg-gradient-to-br from-ink-900 to-ink-950 text-white rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700/30 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-xl relative z-10">
            <span className="text-[10px] tracking-widest font-accent text-brand-400 uppercase font-bold block mb-2">
              <Sparkles className="w-3 h-3 inline mr-1" /> Bundle & Save
            </span>
            <h3 className="text-2xl md:text-3xl font-heading font-bold leading-tight">
              Complete Your Bedroom Setup
            </h3>
            <p className="text-white/70 text-sm md:text-base mt-3 leading-relaxed font-body">
              Add pillows and a protector when ordering any RelaxPro mattress and save up to ₹3,700. All accessories are pre-compressed and delivered together.
            </p>
          </div>
          <Link
            to="/catalog"
            className="shrink-0 bg-white text-ink-900 px-8 py-4 rounded-2xl text-[13px] font-bold font-accent tracking-widest uppercase transition-all cursor-pointer shadow-lg hover:shadow-xl hover:bg-sky-50 active:scale-95 relative z-10"
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" /> Shop Mattresses
          </Link>
        </section></FadeUp>
      </div>
    </PageShell>
  );
}
