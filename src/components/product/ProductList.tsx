import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PriceText from '../ui/PriceText';
import { MagnifyingGlass, Sliders, Check, Star, ArrowsClockwise, ChatCircleText, Info, CaretRight, Sparkle, WarningCircle, ShoppingCart, Bed, ArrowRight, Truck, Leaf } from '@phosphor-icons/react';
import { Product, MattressSize, Tier } from '../../types';
import { PRODUCTS } from '../../data/products';
import SegmentedControl from '../ui/SegmentedControl';
import ProductCard from './ProductCard';

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
    if (softLevels.includes(level)) return { label: 'Soft', color: 'bg-success-500/15 text-success border-success/20' };
    if (mediumLevels.includes(level)) return { label: 'Medium', color: 'bg-blue-500/15 text-blue-600 border-blue-200' };
    return { label: 'Firm', color: 'bg-orange-500/15 text-orange-600 border-orange-200' };
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

    // MagnifyingGlass filter
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
          <p className="text-muted/80 text-base md:text-lg mt-6 font-body leading-relaxed max-w-xl">
            Direct-from-factory pricing with absolute transparency. Tap any product image for comprehensive layered specifications and custom warranties.
          </p>
        </div>
        
        {/* Dynamic counter */}
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted/60 bg-white/50 backdrop-blur-sm px-5 py-3 rounded-full border border-brand-200/40 shrink-0 select-none shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          Showing <span className="font-bold text-primary">{filteredProducts.length}</span> of 13 Models
        </div>
      </div>

      {/* FILTER CONTROLLER DASHBOARD */}
      <div className="bg-white/60 backdrop-blur-md p-4 md:p-6 rounded-3xl border border-brand-200/40 shadow-sm mb-12 flex flex-col xl:flex-row gap-5 items-center justify-between fade-up" style={{ transitionDelay: '0.1s' }}>
        
        {/* MagnifyingGlass & Tier */}
        <div className="w-full xl:w-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-72 relative group shrink-0">
            <MagnifyingGlass className="w-4 h-4 text-muted/60 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary" />
<input
               type="text"
               placeholder="Find your perfect mattress..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-brand-200/40 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 text-sm font-body placeholder-muted/50 bg-white transition-[border-color,box-shadow,background-color] outline-none"
             />
          </div>

          <div className="w-full md:w-auto overflow-x-auto hide-scrollbar">
            <SegmentedControl
              options={[
                { value: 'all', label: 'All Tiers' },
                { value: 'luxury', label: 'Luxury' },
                { value: 'premium', label: 'Premium' },
                { value: 'comfort', label: 'Comfort' }
              ]}
              value={selectedTier}
              onChange={(t) => setSelectedTier(t as any)}
            />
          </div>
        </div>

        {/* Selects & Toggles */}
        <div className="w-full xl:w-auto flex flex-wrap gap-3 items-center justify-start xl:justify-end">
          <select
            value={selectedComfort}
            onChange={(e) => setSelectedComfort(e.target.value as any)}
            className="bg-white border border-brand-200/40 text-[11px] uppercase tracking-wider font-bold font-accent px-4 py-2.5 rounded-xl text-primary focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-[border-color,box-shadow,background-color] cursor-pointer outline-none appearance-none pr-8 relative bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%227%22%20viewBox%3D%220%200%2012%207%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201L6%206L11%201%22%20stroke%3D%22%231A2340%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:calc(100%-12px)_center] min-w-[170px]"
          >
            <option value="all">Any comfort level</option>
            <option value="soft">Soft - Cloud-like cradle</option>
            <option value="medium">Medium - Balanced comfort</option>
            <option value="firm">Firm - Spinal alignment</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-brand-200/40 text-[11px] uppercase tracking-wider font-bold font-accent px-4 py-2.5 rounded-xl text-primary focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-[border-color,box-shadow,background-color] cursor-pointer outline-none appearance-none pr-8 bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%227%22%20viewBox%3D%220%200%2012%207%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201L6%206L11%201%22%20stroke%3D%22%231A2340%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:calc(100%-12px)_center] min-w-[170px]"
          >
            <option value="popular">Most loved</option>
            <option value="priceAsc">Price: Low - High</option>
            <option value="priceDesc">Price: High - Low</option>
            <option value="thickness">Luxury thickness</option>
          </select>

          <label className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-accent font-bold text-accent bg-accent/5 border border-accent/20 px-4 py-2.5 rounded-xl hover:bg-accent/10 cursor-pointer select-none transition-colors">
            <input
              type="checkbox"
              checked={onlyLatex}
              onChange={(e) => setOnlyLatex(e.target.checked)}
              className="rounded text-accent focus:ring-accent/20 w-3.5 h-3.5 border-brand-200/50 cursor-pointer bg-white"
            />
            <span>Pure Latex Only</span>
          </label>
        </div>
      </div>

 {/* Craft Promise Trust Strip */}
 <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 py-6 mb-8 border-y border-brand-200/30">
    <div className="flex items-center gap-2 text-xs text-muted/70">
      <Truck className="w-4 h-4 text-accent" />
      <span>Free delivery</span>
    </div>
    <div className="flex items-center gap-2 text-xs text-muted/70">
      <Leaf className="w-4 h-4 text-accent" />
      <span>GOLS certified latex</span>
    </div>
  </div>

{/* PRODUCT GRID BLOCKS */}
       <AnimatePresence mode="popLayout">
         {filteredProducts.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-8">
             {filteredProducts.map((p, index) => {
               // First product gets hero treatment
               const isHeroCard = index === 0 && filteredProducts.length > 2;
               const gridClasses = isHeroCard 
                 ? 'lg:col-span-4' // Takes 4 of 6 columns
                 : 'lg:col-span-2'; // Others take 2
               
               const activeSize = getProductSize(p.slug);
               const price = getProductStartingPrice(p, activeSize);
               const isLatex = hasLatex(p);
               const isBestSeller = p.slug === 'nirvana' || (p.badge && p.badge.toLowerCase().includes('best seller'));

               return (
                 <div key={p.slug} className={gridClasses}>
<ProductCard
                      product={p}
                      activeSize={activeSize}
                      onNavigateToPdp={onNavigateToPdp}
                      handleBuyNow={handleBuyNow}
                      handleAddToCart={handleAddToCart}
                      justAdded={justAdded}
                      setProductSize={setProductSize}
                      getProductStartingPrice={getProductStartingPrice}
                      hasLatex={hasLatex}
                      getFirmnessBadge={getFirmnessBadge}
                    />
                 </div>
               );
             })}
           </div>
) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full py-20 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Bed className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                No mattresses found
              </h3>
              <p className="text-muted/70 text-sm max-w-md mx-auto mb-6">
                Try adjusting your filters or explore our full collection
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTier('all');
                  setSelectedComfort('all');
                  setOnlyLatex(false);
                }}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                Reset all filters
                <ArrowRight className="w-4 h-4" />
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
            <Leaf className="w-3 h-3" /> Orthopedic Confidence
          </span>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mt-4 leading-tight">
            Can't decide on structural layers?
          </h3>
          <p className="text-muted/40 text-sm md:text-base mt-4 leading-relaxed font-body">
            Every spinal structure has unique density requirements. RelaxPro allows you to custom engineer density blends, accessories, and outer quilted weaves. Open our 3D interactive builder.
          </p>
        </div>
        <button
          onClick={() => onNavigate('builder')}
          className="btn-primary bg-white text-primary text-sm font-bold font-accent tracking-wide uppercase py-4 px-8 rounded-xl flex items-center gap-2 shrink-0 group shadow-xl hover:shadow-2xl hover:bg-bg cursor-pointer relative z-10"
        >
          <Sparkle className="w-5 h-5 text-accent" /> Start 3D Customizer
          <CaretRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
</div>
);
}
