import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PriceText from '../ui/PriceText';
import { Search, SlidersHorizontal, Check, Shield, Star, RefreshCw, MessageSquare, Info, ChevronRight, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { Product, MattressSize, Tier } from '../../types';
import { PRODUCTS } from '../../data/products';
import ShineBorder from '../ui/ShineBorder';

interface ProductListProps {
  onAddToCartDirect: (product: Product, size: MattressSize, includeAcc: boolean) => void;
  onNavigateToPdp: (slug: string) => void;
  onNavigate: (page: string) => void;
  selectedTier: Tier | 'all';
  setSelectedTier: (tier: Tier | 'all') => void;
}

export default function ProductList({ 
  onAddToCartDirect, 
  onNavigateToPdp, 
  onNavigate,
  selectedTier,
  setSelectedTier
}: ProductListProps) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComfort, setSelectedComfort] = useState<'all' | 'soft' | 'medium' | 'firm'>('all');
  const [onlyLatex, setOnlyLatex] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'thickness'>('popular');
  
  // Card-specific size selectors (state mapped by slug)
  const [cardSizes, setCardSizes] = useState<Record<string, MattressSize>>({});

  // Helper: get selected size for a specific product
  const getProductSize = (slug: string): MattressSize => {
    return cardSizes[slug] || 'king';
  };

  // Helper: set selected size for a specific product
  const setProductSize = (slug: string, size: MattressSize) => {
    setCardSizes(prev => ({ ...prev, [slug]: size }));
  };

  // Helper check for latex in layers
  const hasLatex = (product: Product) => {
    return product.layers.some(l => l.material === 'latex' || l.material === 'latex_rebonded');
  };

  // Firmness badge config
  const getFirmnessBadge = (level: string): { label: string; color: string } => {
    const softLevels = ['plush', 'soft', 'soft-medium', 'medium-soft'];
    const mediumLevels = ['medium', 'medium-firm', 'medium-plush'];
    if (softLevels.includes(level)) return { label: 'Soft', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-200' };
    if (mediumLevels.includes(level)) return { label: 'Medium', color: 'bg-blue-500/15 text-blue-600 border-blue-200' };
    return { label: 'Firm', color: 'bg-orange-500/15 text-orange-600 border-orange-200' };
  };

  // Price range helper
  const getPriceRange = (product: Product): { min: number; max: number } => {
    const sizes: MattressSize[] = ['single', 'double', 'queen', 'king'];
    let prices: number[] = [];
    if (product.pricingModel === 'with_without_accessories') {
      const wo = product.pricing.withoutAccessories || {};
      prices = sizes.map(s => wo[s] || 0);
    } else {
      const f3 = product.pricing.fabric300Gsm || {};
      prices = sizes.map(s => f3[s] || 0);
    }
    return { min: Math.min(...prices), max: Math.max(...prices) };
  };

  // Track which products were just added to cart (for visual feedback)
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());

  // WhatsApp Enquire handler
  const handleWhatsAppEnquire = (product: Product, size: MattressSize) => {
    const msg = `Hello Suresh, I am interested in the RelaxPro ${product.name} Mattress (${size} size). Could you please guide me on pricing, delivery and orthopedic suitability?`;
    window.open(`https://wa.me/918686624494?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddToCart = (product: Product, size: MattressSize) => {
    onAddToCartDirect(product, size, true);
    setJustAdded(prev => new Set(prev).add(product.slug));
    setTimeout(() => {
      setJustAdded(prev => {
        const next = new Set(prev);
        next.delete(product.slug);
        return next;
      });
    }, 1500);
  };

  const handleBuyNow = (product: Product, size: MattressSize) => {
    onAddToCartDirect(product, size, true);
    onNavigate('cart');
  };

  // Helper to extract baseline starting price
  const getProductStartingPrice = (product: Product, size: MattressSize) => {
    if (product.pricingModel === 'with_without_accessories') {
      return product.pricing.withoutAccessories?.[size] || 0;
    } else {
      return product.pricing.fabric300Gsm?.[size] || 0;
    }
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || 
             p.tagline.toLowerCase().includes(q) ||
             p.keyBenefit.toLowerCase().includes(q) ||
             p.layers.some(l => l.description.toLowerCase().includes(q))
      );
    }

    // Tier filter
    if (selectedTier !== 'all') {
      result = result.filter(p => p.tier === selectedTier);
    }

    // Comfort filter
    if (selectedComfort !== 'all') {
      result = result.filter(p => {
        if (selectedComfort === 'soft') return p.comfortLevel.includes('soft') || p.comfortLevel === 'plush';
        if (selectedComfort === 'medium') return p.comfortLevel.includes('medium') || p.comfortLevel === 'plush';
        if (selectedComfort === 'firm') return p.comfortLevel.includes('firm');
        return true;
      });
    }

    // Latex Filter
    if (onlyLatex) {
      result = result.filter(p => hasLatex(p));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'priceAsc') {
        return getProductStartingPrice(a, 'king') - getProductStartingPrice(b, 'king');
      }
      if (sortBy === 'priceDesc') {
        return getProductStartingPrice(b, 'king') - getProductStartingPrice(a, 'king');
      }
      if (sortBy === 'thickness') {
        return b.totalThickness - a.totalThickness;
      }
      // 'popular' keeps order
      return 0;
    });

    return result;
  }, [searchTerm, selectedTier, selectedComfort, onlyLatex, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* Title block */}
      <div className="mb-12 border-b border-brand-200/40 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 fade-up">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-widest font-accent text-accent uppercase bg-accent/10 px-4 py-1.5 rounded-full font-bold">
            Real Natural Latex & Ortho Health Modules
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mt-6 text-primary leading-[1.1]">
            Explore Mattress Collections
          </h1>
          <p className="text-neutral-dark/70 text-base md:text-lg mt-6 font-body leading-relaxed max-w-xl">
            Direct-from-factory pricing with absolute transparency. Tap any product image for comprehensive layered specifications and custom warranties.
          </p>
        </div>
        
        {/* Dynamic counter */}
        <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-dark/50 bg-white/50 backdrop-blur-sm px-5 py-3 rounded-full border border-brand-200/40 shrink-0 select-none shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          Showing <span className="font-bold text-primary">{filteredProducts.length}</span> of 13 Models
        </div>
      </div>

      {/* FILTER CONTROLLER DASHBOARD */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-brand-200/40 shadow-sm mb-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-center fade-up" style={{ transitionDelay: '0.1s' }}>
        {/* Search */}
        <div className="md:col-span-3 relative group">
          <Search className="w-4 h-4 text-neutral-dark/40 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-accent" />
          <input
            type="text"
            placeholder="Search mattresses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-200/50 focus:border-accent focus:ring-4 focus:ring-accent/10 text-sm font-body placeholder-neutral-dark/40 bg-neutral-light/30 transition-all outline-none"
          />
        </div>

        {/* Filters */}
        <div className="md:col-span-9 flex flex-wrap gap-4 items-center justify-start md:justify-end">
          {/* Collection tabs */}
          <div className="flex bg-neutral-light/50 p-1.5 rounded-xl border border-brand-200/40 text-xs font-semibold">
            {(['all', 'luxury', 'premium', 'comfort'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-4 py-2 rounded-lg font-accent capitalize transition-all cursor-pointer ${
                  selectedTier === t
                    ? 'bg-primary text-white shadow-md'
                    : 'text-neutral-dark/60 hover:text-primary hover:bg-white/60'
                }`}
              >
                {t === 'all' ? 'All Tiers' : t}
              </button>
            ))}
          </div>

          {/* Comfort levels dropdown */}
          <select
            value={selectedComfort}
            onChange={(e) => setSelectedComfort(e.target.value as any)}
            className="bg-white border border-brand-200/50 text-xs font-medium font-accent px-4 py-2.5 rounded-xl text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer outline-none appearance-none pr-8 relative bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%227%22%20viewBox%3D%220%200%2012%207%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201L6%206L11%201%22%20stroke%3D%22%231A2340%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:calc(100%-12px)_center] min-w-[180px]"
          >
            <option value="all">Any Comfort/Firmness</option>
            <option value="soft">Soft & Plush Feel</option>
            <option value="medium">Medium Support</option>
            <option value="firm">Firm Orthopedic Feel</option>
          </select>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-brand-200/50 text-xs font-medium font-accent px-4 py-2.5 rounded-xl text-primary focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer outline-none appearance-none pr-8 bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%227%22%20viewBox%3D%220%200%2012%207%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201L6%206L11%201%22%20stroke%3D%22%231A2340%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:calc(100%-12px)_center] min-w-[200px]"
          >
            <option value="popular">Sorted by Recommendation</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="thickness">Thickness Profile: Deepest First</option>
          </select>

          {/* Checkbox: natural latex */}
          <label className="flex items-center gap-2.5 text-xs font-accent font-medium text-primary bg-accent/5 border border-accent/20 px-4 py-2.5 rounded-xl hover:bg-accent/10 cursor-pointer select-none transition-colors">
            <input
              type="checkbox"
              checked={onlyLatex}
              onChange={(e) => setOnlyLatex(e.target.checked)}
              className="rounded-md text-accent focus:ring-accent/20 w-4 h-4 border-brand-200/50 cursor-pointer"
            />
            <span>Pure Kerala Latex Only</span>
          </label>
        </div>
      </div>

      {/* PRODUCT GRID BLOCKS */}
      <AnimatePresence mode="popLayout">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p, index) => {
              const activeSize = getProductSize(p.slug);
              const price = getProductStartingPrice(p, activeSize);
              const isLatex = hasLatex(p);
              const isBestSeller = p.slug === 'nirvana' || (p.badge && p.badge.toLowerCase().includes('best seller'));

              const cardInner = (
                <>
                  {/* Luxury Gold/Silver Border for Luxury Tier */}
                  {p.tier === 'luxury' && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent via-accent-light to-accent z-10"></div>
                  )}

                  {/* Header metadata display */}
                  <div className="p-5 bg-neutral-light/50 border-b border-brand-200/40 flex items-center justify-between text-[10px] font-mono text-neutral-dark/60 select-none">
                    <span className="uppercase tracking-widest font-bold text-accent">{p.tier} collection</span>
                    <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-brand-200/50 shadow-sm font-accent text-primary">
                      <Shield className="w-3 h-3 text-accent" /> {p.warranty}Y Warranty
                    </span>
                  </div>

                  {/* Product Image block */}
                  <div className="h-60 relative overflow-hidden bg-neutral-light cursor-pointer img-zoom" onClick={() => onNavigateToPdp(p.slug)}>
                    {p.badge && (
                      <span className="absolute top-4 left-4 bg-primary/95 backdrop-blur-sm text-white font-accent text-[10px] tracking-widest uppercase font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg z-10 max-w-[80%] truncate">
                        {p.badge}
                      </span>
                    )}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Glassmorphism hover card overlay */}
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6">
                      <span className="btn-primary bg-white text-primary text-xs font-accent font-bold px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        Quick View <ChevronRight className="w-4 h-4 text-accent" />
                      </span>
                    </div>
                  </div>

                  {/* Core Card Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name & Comfort rating line */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-heading font-bold text-xl md:text-2xl text-primary flex flex-wrap items-center gap-2 mb-1">
                            {p.name}
                            {isBestSeller && (
                              <span className="text-[9px] font-accent font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 rounded-md border border-accent/20 text-center mt-1 sm:mt-0">Best Seller</span>
                            )}
                          </h3>
                          <span className="text-[11px] text-neutral-dark/50 font-body italic block">{p.tagline}</span>
                        </div>
                        
                        {/* Comfort label */}
                        <div className="text-right shrink-0">
                          {(() => {
                            const badge = getFirmnessBadge(p.comfortLevel);
                            return (
                              <span className={`inline-block text-[10px] font-bold tracking-widest font-mono uppercase px-2.5 py-1 rounded-md border ${badge.color}`}>
                                {badge.label}
                              </span>
                            );
                          })()}
                          <div className="flex items-center justify-end gap-1 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`w-2.5 h-2.5 rounded-full ${
                                  i < p.comfortRating ? 'bg-accent shadow-sm' : 'bg-neutral-light border border-brand-200/50'
                                }`}
                              ></span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Brief description */}
                      <p className="text-sm text-neutral-dark/70 mt-5 leading-relaxed line-clamp-2 font-body">
                        {p.keyBenefit}
                      </p>

                      {/* Details specs bullets checklist */}
                      <div className="mt-6 pt-5 border-t border-brand-200/40 space-y-2.5 text-xs text-neutral-dark/60 font-body">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                          </div>
                          <span>Thickness Profile: <strong className="text-primary font-bold">{p.totalThickness} Inches</strong> composite</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                          </div>
                          <span>Cover Shell: <strong className="text-primary font-bold">{p.fabricGsm} GSM {p.fabricType.split(' ')[0]}</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                          </div>
                          <span>Natural Rubber India: <strong className="text-primary font-bold">{isLatex ? 'Yes, Organic' : 'Ortho Foams'}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Mattress Size Configurator inside each block */}
                    <div className="mt-6 pt-5 border-t border-brand-200/40">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-mono text-neutral-dark/40 uppercase tracking-widest bg-neutral-light px-2.5 py-1 rounded-md">
                          Select Size
                        </span>
                        
                        {/* Size button triggers */}
                        <div className="flex gap-1.5 bg-neutral-light/50 p-1 rounded-lg border border-brand-200/30">
                          {(['king', 'queen', 'double', 'single'] as MattressSize[]).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setProductSize(p.slug, sz);
                              }}
                              className={`w-8 h-7 rounded-md font-accent text-[10px] font-bold transition-all uppercase select-none cursor-pointer ${
                                activeSize === sz
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'text-neutral-dark/50 hover:text-primary hover:bg-white'
                              }`}
                            >
                              {sz[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price indicator */}
                      <div className="flex justify-between items-end p-4 rounded-xl border border-brand-200/50 bg-white shadow-sm mt-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-accent text-neutral-dark/50 tracking-widest uppercase mb-1">Starting From</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-heading text-primary">
                              <PriceText>₹{price.toLocaleString('en-IN')}</PriceText>
                            </span>
                            <span className="text-sm font-body text-neutral-dark/40">
                              Single
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-dark/50 font-mono mt-0.5">
                            <PriceText>Up to ₹{getPriceRange(p).max.toLocaleString('en-IN')} (King)</PriceText>
                          </span>
                        </div>
                        <div className="text-right text-[9px] text-neutral-dark/40 font-mono max-w-[110px] leading-tight">
                          {p.pricingModel === 'with_without_accessories' ? 
                            'Tax incl. No middleman' : 
                            'Base 300 GSM model.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="p-5 bg-white border-t border-brand-200/40 flex flex-wrap gap-2 text-xs rounded-b-2xl">
                    <button
                      onClick={(e) => { e.stopPropagation(); onNavigateToPdp(p.slug); }}
                      className="flex-1 min-w-[80px] py-3 px-3 rounded-xl border-2 border-neutral-light hover:border-accent bg-white hover:bg-accent/5 font-accent font-bold text-primary flex items-center justify-center gap-1.5 cursor-pointer transition-all focus:outline-none focus:ring-4 focus:ring-accent/10"
                    >
                      <Info className="w-3.5 h-3.5 text-accent" /> Details
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(p, activeSize); }}
                      className="flex-1 min-w-[80px] py-3 px-3 rounded-xl bg-primary hover:bg-neutral-dark text-white font-accent font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/20"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-white/80" />
                      {justAdded.has(p.slug) ? 'Added!' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBuyNow(p, activeSize); }}
                      className="flex-1 min-w-[80px] py-3 px-3 rounded-xl bg-accent hover:bg-[#2569A0] text-white font-accent font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-accent/20"
                    >
                      Buy Now
                    </button>
                  </div>
                </>
              );

              return (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
                  className="h-full cursor-pointer fade-up"
                  onClick={() => onNavigateToPdp(p.slug)}
                >
                  {isBestSeller ? (
                    <ShineBorder className="h-full flex flex-col justify-between group rounded-2xl bg-white card-hover shadow-sm border border-brand-200/40">
                      {cardInner}
                    </ShineBorder>
                  ) : (
                    <div className="bg-white rounded-2xl border border-brand-200/40 shadow-sm overflow-hidden flex flex-col justify-between group h-full relative card-hover">
                      {cardInner}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-neutral-light p-8 rounded-3xl border border-brand-200/40 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand-200/40">
              <AlertCircle className="w-10 h-10 text-accent" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-primary mb-3">No Mattresses Match Filters</h3>
            <p className="text-neutral-dark/60 text-base leading-relaxed mb-8 font-body">
              Try updating your search queries, clearing the "Pure Kerala Latex" parameter, or choosing another collection tier to discover our premium models.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTier('all');
                setSelectedComfort('all');
                setOnlyLatex(false);
              }}
              className="btn-primary inline-flex items-center gap-2 bg-primary text-white font-accent text-sm font-bold px-6 py-3.5 rounded-xl cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4 text-white/80" /> Reset Filter Matrix
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Callout */}
      <section className="bg-gradient-to-br from-primary to-primary/95 text-white mt-24 p-8 md:p-12 rounded-[2rem] border border-primary/20 flex flex-col md:flex-row gap-8 items-center justify-between shadow-xl relative overflow-hidden fade-up">
        {/* Abstract background shapes */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-200/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-2 text-[10px] tracking-widest font-accent text-accent uppercase bg-accent/10 px-3 py-1 rounded-full font-bold border border-accent/20">
            <Shield className="w-3 h-3" /> Orthopedic Confidence
          </span>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mt-4 leading-tight">
            Can't decide on structural layers?
          </h3>
          <p className="text-neutral-light/80 text-sm md:text-base mt-4 leading-relaxed font-body">
            Every spinal structure has unique density requirements. RelaxPro allows you to custom engineer density blends, accessories, and outer quilted weaves. Open our 3D interactive builder.
          </p>
        </div>
        <button
          onClick={() => onNavigate('builder')}
          className="btn-primary bg-white text-primary text-sm font-bold font-accent tracking-wide uppercase py-4 px-8 rounded-xl flex items-center gap-2 shrink-0 group shadow-xl hover:shadow-2xl hover:bg-neutral-light cursor-pointer relative z-10"
        >
          <Sparkles className="w-5 h-5 text-accent" /> Start 3D Customizer
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
    </div>
  );
}
