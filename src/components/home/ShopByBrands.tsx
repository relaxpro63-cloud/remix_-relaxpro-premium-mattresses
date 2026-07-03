import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Layers, Cloud, ShieldPlus, Sparkles, Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import PriceText from '../ui/PriceText';
import ShineBorder from '../ui/ShineBorder';

const categories = [
  { name: 'Full Latex Mattress', icon: <BedDouble className="w-5 h-5" /> },
  { name: 'Hybrid Latex Mattress', icon: <Layers className="w-5 h-5" /> },
  { name: 'Orthopedic Support', icon: <ShieldPlus className="w-5 h-5" /> },
  { name: 'Luxury Pillows', icon: <Cloud className="w-5 h-5" /> },
  { name: 'Custom Builder', icon: <Sparkles className="w-5 h-5" /> },
];

const getProductsByCategory = (category: string) => {
  switch (category) {
    case 'Full Latex Mattress':
      return PRODUCTS.filter(p => ['nirvana', 'ananda', 'amrita', 'prakriti'].includes(p.slug));
    case 'Hybrid Latex Mattress':
      return PRODUCTS.filter(p => ['somya', 'shuddha', 'bhumi', 'sunidra', 'vishram'].includes(p.slug));
    case 'Orthopedic Support':
      return PRODUCTS.filter(p => p.slug === 'arogya' || p.slug === 'sthira' || p.slug === 'ojas' || p.slug === 'ayushrest');
    default:
      return [];
  }
};

export default function ShopByBrands() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0].name);

  const activeProducts = getProductsByCategory(activeCategory);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleNavigateToPdp = (slug: string) => {
    navigate(`/mattresses/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-white border-b border-brand-200/40">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6 md:mb-8">
          Shop by Brands
        </h2>
        
        {/* Category Pills */}
        <div className="flex overflow-x-auto pb-4 gap-4 md:gap-5 snap-x mb-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .hide-scroll::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex gap-4 md:gap-5 hide-scroll w-full">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (cat.name === 'Custom Builder') {
                    navigate('/builder');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (cat.name === 'Luxury Pillows') {
                    navigate('/catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    setActiveCategory(cat.name);
                  }
                }}
                className={`snap-start shrink-0 flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 border rounded-xl transition-all duration-300 cursor-pointer group ${
                  activeCategory === cat.name 
                    ? 'border-accent bg-accent/5 shadow-sm text-accent' 
                    : 'border-brand-200/80 bg-white hover:border-accent hover:shadow-md hover:bg-neutral-light/50 text-primary'
                }`}
              >
                <div className={`group-hover:scale-110 transition-transform duration-300 ${activeCategory === cat.name ? 'text-accent' : 'text-accent'}`}>
                  {cat.icon}
                </div>
                <span className={`font-heading font-bold text-sm whitespace-nowrap ${activeCategory === cat.name ? 'text-primary' : 'text-primary'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Carousel */}
        {activeProducts.length > 0 && (
          <div className="relative group">
            {/* Left Arrow */}
            <button 
              onClick={() => scroll('left')}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-brand-200 rounded-full p-2 shadow-md opacity-100 group-hover:opacity-100 md:opacity-0 transition-opacity hover:bg-neutral-light cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>

            {/* Scroll Container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto hide-scroll snap-x pb-8 pt-4 px-2"
            >
              {activeProducts.map((item) => {
                const isBestSeller = item.slug === 'nirvana';
                const cardContent = (
                  <>
                    <div className="relative img-zoom" style={{ aspectRatio: '4/3' }}>
                      <img
                        src={item.image}
                        alt={`${item.name} natural latex mattress`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isBestSeller ? (
                        <span className="absolute top-3 left-3 bg-accent text-primary font-accent text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md z-10">
                          <Sparkles className="w-3 h-3 fill-current" /> Best Seller
                        </span>
                      ) : (
                        <span className="absolute top-3 left-3 bg-primary/90 text-white font-accent text-[9px] px-3 py-1.5 rounded-full uppercase z-10 tracking-wider">
                          {item.comfortLevel} Feel
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-accent mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                          <span className="text-[10px] text-neutral-dark/40 ml-1 font-accent">(4.9)</span>
                        </div>
                        <h3 className="font-heading font-bold text-lg text-primary flex flex-wrap items-center gap-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-neutral-dark/50 mt-1 leading-relaxed font-body line-clamp-2">{item.keyBenefit}</p>
                        <div className="mt-4 pt-3 border-t border-brand-200/40 flex items-center gap-3">
                          <span className="text-lg font-bold text-primary font-body">
                            <PriceText>
                              ₹
                              {item.pricingModel === 'with_without_accessories'
                                ? item.pricing.withoutAccessories?.king?.toLocaleString('en-IN')
                                : item.pricing.fabric300Gsm?.king?.toLocaleString('en-IN')}
                            </PriceText>
                          </span>
                          <span className="text-[10px] text-neutral-dark/40 font-accent">King Size</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-brand-200/30 grid grid-cols-2 gap-2 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToPdp(item.slug);
                        }}
                        className="btn-primary py-2.5 px-3 rounded-xl border border-brand-200 hover:border-accent bg-white font-accent font-semibold text-xs text-center cursor-pointer text-primary transition-all"
                      >
                        Details
                      </button>
                      <a
                        href={`https://wa.me/918686624494?text=${encodeURIComponent(
                          `Hello Suresh, I am interested in the RelaxPro ${item.name} Mattress.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageSquare className="w-3 h-3" /> Chat
                      </a>
                    </div>
                  </>
                );

                if (isBestSeller) {
                  return (
                    <ShineBorder
                      key={item.slug}
                      className="snap-start shrink-0 w-[85vw] sm:w-[280px] md:w-[320px] flex flex-col justify-between h-full card-hover cursor-pointer"
                      onClick={() => handleNavigateToPdp(item.slug)}
                    >
                      {cardContent}
                    </ShineBorder>
                  );
                }

                return (
                  <div 
                    key={item.slug} 
                    className="snap-start shrink-0 w-[85vw] sm:w-[280px] md:w-[320px] bg-white rounded-2xl border border-brand-200/40 overflow-hidden flex flex-col justify-between group shadow-sm card-hover cursor-pointer"
                    onClick={() => handleNavigateToPdp(item.slug)}
                  >
                    {cardContent}
                  </div>
                );
              })}
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => scroll('right')}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-brand-200 rounded-full p-2 shadow-md opacity-100 group-hover:opacity-100 md:opacity-0 transition-opacity hover:bg-neutral-light cursor-pointer"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
