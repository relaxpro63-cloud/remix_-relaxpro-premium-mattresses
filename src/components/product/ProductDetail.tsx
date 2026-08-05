import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import PriceText from '../ui/PriceText';
import { Check, Question, ChatCircleText, ArrowLeft, Heart, Star, Sparkle, BookOpen, SpeakerX, Envelope, ShoppingCart, Leaf } from '@phosphor-icons/react';
import { Product, MattressSize, CartItem } from '../../types';
import ProductCarousel from './ProductCarousel';

interface ProductDetailProps {
  product: Product;
  onAddToCartDirect: (product: Product, size: MattressSize, includeAcc: boolean, fabricOption?: '300GSM' | '450GSM') => void;
  onNavigateBack: () => void;
  onNavigate: (page: string) => void;
}

export default function ProductDetail({ product, onAddToCartDirect, onNavigateBack, onNavigate }: ProductDetailProps) {
  const [activeSize, setActiveSize] = useState<MattressSize>('king');
  const [includeAccessories, setIncludeAccessories] = useState<boolean>(true);
  const [selectedFabric, setSelectedFabric] = useState<'300GSM' | '450GSM'>('300GSM');

  const SIZE_LABELS = {
    king: 'King Size (72" x 78")',
    queen: 'Queen Size (60" x 78")',
    double: 'Double Size (48" x 75")',
    single: 'Single Size (36" x 75")'
  };

  // Pricing math calculator
  const activePrice = useMemo(() => {
    if (product.pricingModel === 'with_without_accessories') {
      const pricingObj = product.pricing;
      if (includeAccessories) {
        return pricingObj.withAccessories?.[activeSize] || 0;
      } else {
        return pricingObj.withoutAccessories?.[activeSize] || 0;
      }
    } else {
      const pricingObj = product.pricing;
      if (selectedFabric === '450GSM') {
        return pricingObj.fabric450Gsm?.[activeSize] || 0;
      } else {
        return pricingObj.fabric300Gsm?.[activeSize] || 0;
      }
    }
  }, [product, activeSize, includeAccessories, selectedFabric]);

  const [addedToCart, setAddedToCart] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    onAddToCartDirect(
      product,
      activeSize,
      product.pricingModel === 'with_without_accessories' ? includeAccessories : false,
      product.pricingModel === 'fabric_options' ? selectedFabric : undefined
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleBuyNow = () => {
    onAddToCartDirect(
      product,
      activeSize,
      product.pricingModel === 'with_without_accessories' ? includeAccessories : false,
      product.pricingModel === 'fabric_options' ? selectedFabric : undefined
    );
    onNavigate('cart');
  };

  const handleContactSuresh = () => {
    const message = `Hello Suresh, I am interested in purchasing the RelaxPro ${product.name} Mattress (${activeSize}). Could you please guide me on pricing, delivery timelines, and orthopedic support suitability?`;
    window.open(`https://wa.me/918686624494?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-28 md:pb-16"
    >
      {/* Navigation & Back Link */}
      <button
        onClick={onNavigateBack}
        className="inline-flex items-center gap-2 text-muted/70 hover:text-primary text-xs font-accent font-semibold mb-8 lg:mb-12 group cursor-pointer transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-bg border border-brand-200/50 flex items-center justify-center group-hover:bg-white group-hover:border-brand-200 transition-[transform,box-shadow,border-color,background-color,color,opacity]">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-primary" />
        </div>
        Back to Collections
      </button>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left: Product Images & Core Specs */}
        <div className="lg:col-span-7 space-y-10">
          <ProductCarousel
            images={[product.image, ...product.images]}
            alt={product.name}
            badge={product.badge}
          />

          {/* Core Spec Badges Section */}
          <div className="bg-white p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-brand-200/40 shadow-sm grid grid-cols-3 gap-2 sm:gap-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[7px] sm:text-[10px] font-mono text-muted/60 uppercase tracking-widest block mb-1 sm:mb-2 truncate">Stiffness</span>
              <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full ${
                      i < product.comfortRating ? 'bg-accent shadow-sm' : 'bg-bg border border-brand-200/50'
                    }`}
                  ></span>
                ))}
              </div>
              <span className="text-xs sm:text-sm font-heading font-bold text-primary capitalize leading-tight">
                {product.comfortLevel} <span className="text-muted/60 font-body font-normal text-[9px] sm:text-[14px]">({product.comfortRating}/5)</span>
              </span>
            </div>
            
            <div className="border-x border-brand-200/30 flex flex-col items-center justify-center">
              <span className="text-[7px] sm:text-[10px] font-mono text-muted/60 uppercase tracking-widest block mb-1">Depth Profile</span>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-primary block leading-none sm:leading-tight">{product.totalThickness}"</span>
              <span className="text-[7px] sm:text-[11px] text-muted/60 font-body block mt-0.5 sm:mt-1 truncate">Inches Composite</span>
            </div>


          </div>

          {/* Stacked Layer Breakdown with descriptions */}
          <div className="bg-bg/30 p-4 sm:p-6 md:p-10 rounded-[1.5rem] sm:rounded-[2rem] border border-brand-200/40 shadow-sm">
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-primary mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center border border-brand-200/50 shadow-sm shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              </div>
              Internal Architecture
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              {product.layers.map((layer, idx) => (
                <div key={idx} className="flex gap-3 sm:gap-5 items-start p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-brand-200/40 relative overflow-hidden group hover:border-accent/30 transition-colors">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 text-accent font-heading font-bold flex items-center justify-center shrink-0 border border-accent/20 text-sm sm:text-lg group-hover:bg-accent group-hover:text-white transition-colors">
                    {layer.thickness}"
                  </div>
                  <div className="flex-1 pt-0 sm:pt-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <h4 className="font-accent font-bold text-xs sm:text-[14px] text-primary uppercase tracking-wide">
                        {layer.material.replace('_', ' ')}
                      </h4>
                      {layer.brand && (
                         <span className="font-mono text-[8px] sm:text-[10px] bg-bg border border-brand-200/50 text-muted/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-medium">
                          {layer.brand}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-sm text-muted/80 leading-relaxed font-body">
                      {layer.description}
                    </p>
                    {layer.certification && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-4">
                        {layer.certification.map((c) => (
                          <span key={c} className="text-[10px] font-bold font-accent bg-success/10 text-success border border-success/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3" /> {c} Certified
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pricing, Configurations and Add To Cart */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header titles */}
          <div className="sticky top-32">
            <span className="inline-flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] tracking-widest font-accent font-bold text-success bg-success/10 border border-success/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase mb-2 sm:mb-4">
              <Sparkle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {product.tier === 'luxury' ? 'Luxury Spine Care' : 'Ortho Certified'}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-primary leading-tight">
              {product.name}
            </h1>
            <p className="text-muted text-sm sm:text-base font-body mt-1 sm:mt-2">
              {product.tagline}
            </p>
            <div className="mt-6 p-5 rounded-2xl bg-bg border border-brand-200/40">
              <p className="text-primary/70 text-sm leading-relaxed font-body">
                {product.keyBenefit}
              </p>
            </div>

            {/* Size Selectors Section */}
            <div className="mt-6 sm:mt-10 bg-white p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-brand-200/40 shadow-sm">
              <h3 className="font-heading font-bold text-primary text-lg sm:text-xl mb-4 sm:mb-6 flex items-center justify-between">
                Select Size
                <span className="text-[10px] sm:text-xs font-accent font-normal text-muted/60 bg-bg px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">Step 1 of {product.pricingModel === 'with_without_accessories' || product.pricingModel === 'fabric_options' ? '2' : '1'}</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {(Object.keys(SIZE_LABELS) as MattressSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setActiveSize(sz)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 relative overflow-hidden cursor-pointer ${
                      activeSize === sz
                        ? 'border-primary bg-primary/[0.04] shadow-sm'
                        : 'border-brand-200/60 hover:border-primary/30 hover:shadow-md hover:bg-bg'
                    }`}
                  >
                    <span className={`font-accent font-bold text-xs sm:text-sm capitalize block transition-colors duration-200 ${
                      activeSize === sz ? 'text-primary' : 'text-primary/80'
                    }`}>{sz} Size</span>
                    <span className={`font-mono text-[9px] sm:text-[10px] mt-1 sm:mt-1.5 block transition-colors duration-200 ${
                      activeSize === sz ? 'text-primary/60' : 'text-primary/40'
                    }`}>
                      {sz === 'king' ? '72"x78"' : sz === 'queen' ? '60"x78"' : sz === 'double' ? '48"x75"' : '36"x75"'}
                    </span>
                    {activeSize === sz && (
                      <span className="absolute top-3 right-3 text-white bg-primary rounded-full p-0.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Pricing Model configuration boxes */}
              {product.pricingModel === 'with_without_accessories' ? (
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-brand-200/40 space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                    <h3 className="font-heading font-bold text-primary text-lg sm:text-xl">
                      Accessory Bundle
                    </h3>
                    <span className="text-[9px] sm:text-[10px] font-accent text-success bg-success/10 border border-success/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-bold uppercase tracking-wider">Save ₹3,700</span>
                  </div>
                  
                  <div
                    onClick={() => setIncludeAccessories(true)}
                    className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border cursor-pointer transition-[transform,box-shadow,border-color,background-color,color,opacity] ${
                      includeAccessories
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-brand-200/50 hover:border-accent/40 hover:bg-bg'
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${includeAccessories ? 'border-accent bg-accent text-white' : 'border-brand-200/80 bg-white'}`}>
                        {includeAccessories && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-xs sm:text-[14px] text-primary block">Include Premium Pack <span className="text-accent text-[8px] sm:text-[10px] ml-1 uppercase tracking-widest block sm:inline">(Recommended)</span></strong>
                        <p className="text-[10px] sm:text-xs text-muted/70 leading-relaxed mt-1 sm:mt-2 font-body">
                          Adds 2 Ergonomic Premium Latex Pillows + 1 Elasticated Waterproof Mattress Protector. Delivered pre-compressed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setIncludeAccessories(false)}
                    className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border cursor-pointer transition-[transform,box-shadow,border-color,background-color,color,opacity] ${
                      !includeAccessories
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-brand-200/50 hover:border-accent/40 hover:bg-bg'
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${!includeAccessories ? 'border-accent bg-accent text-white' : 'border-brand-200/80 bg-white'}`}>
                        {!includeAccessories && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-xs sm:text-[14px] text-primary block">Mattress Only</strong>
                        <p className="text-[10px] sm:text-xs text-muted/70 leading-relaxed mt-1 sm:mt-2 font-body">
                          Deduct accessories. Delivered packaged flat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : product.pricingModel === 'fabric_options' ? (
                <div className="mt-8 pt-8 border-t border-brand-200/40 space-y-4">
                  <h3 className="font-heading font-bold text-primary text-xl mb-4">
                    Outer Fabric Options
                  </h3>

                  <div
                    onClick={() => setSelectedFabric('300GSM')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-[transform,box-shadow,border-color,background-color,color,opacity] ${
                      selectedFabric === '300GSM'
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-brand-200/50 hover:border-accent/40 hover:bg-bg'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedFabric === '300GSM' ? 'border-accent bg-accent text-white' : 'border-brand-200/80 bg-white'}`}>
                        {selectedFabric === '300GSM' && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-primary block">300 GSM Premium Micro-Knit</strong>
                        <p className="text-xs text-muted/70 leading-relaxed mt-2 font-body">
                          Standard luxury cover, lightweight, hyper breathable. Holds Oeko-Tex certification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedFabric('450GSM')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-[transform,box-shadow,border-color,background-color,color,opacity] ${
                      selectedFabric === '450GSM'
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-brand-200/50 hover:border-accent/40 hover:bg-bg'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedFabric === '450GSM' ? 'border-accent bg-accent text-white' : 'border-brand-200/80 bg-white'}`}>
                        {selectedFabric === '450GSM' && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-primary block">450 GSM Luxurious Quilted Bamboo</strong>
                        <p className="text-xs text-muted/70 leading-relaxed mt-2 font-body">
                          Upgraded luxurious thickness with stitched cloud padding. Bamboo fibers maintain high-end coolness natively.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Pricing Box & Add to Cart */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white border border-brand-200/40 rounded-2xl shadow-sm">
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-muted uppercase mb-1.5 sm:mb-2">
                Direct-to-Consumer Value
              </p>

              <div className="flex items-baseline gap-2 sm:gap-3 mb-1">
                <span className="text-3xl sm:text-4xl font-bold text-primary tracking-tight"><PriceText>₹{activePrice.toLocaleString('en-IN')}</PriceText></span>
                <span className="text-base sm:text-lg text-muted/60 line-through"><PriceText>₹{Math.round(activePrice * 1.4).toLocaleString('en-IN')}</PriceText></span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted mb-4 sm:mb-6">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                <span>Tax Included &bull; Free Shipping</span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-primary hover:bg-neutral-dark text-white font-medium rounded-xl transition-colors duration-200 shadow-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{addedToCart ? 'Added!' : 'Add to Cart'}</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-accent hover:bg-[#b08a35] text-primary font-medium rounded-xl transition-colors duration-200 shadow-sm cursor-pointer"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
                <button
                  onClick={handleContactSuresh}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-success/30 text-success hover:bg-success/5 font-medium rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  <ChatCircleText className="w-4 h-4" />
                  <span className="text-sm">Enquire on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Ask Suresh / Personal Consultation CTA */}
            <div className="mt-6 bg-bg/80 p-6 md:p-8 rounded-[2rem] border border-brand-200/40 flex items-start gap-5 shadow-sm">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-brand-200/50 shadow-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white animate-pulse"></div>
                <ChatCircleText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-primary text-lg mb-2">Need a Clinical Posture Audit?</h4>
                <p className="text-muted/80 text-sm leading-relaxed font-body mb-4">
                  Connect directly with Suresh (founder). He analyzes mattress hardness, sleep postures, and medical back histories to recommend the ideal model.
                </p>
                <button
                  onClick={handleContactSuresh}
                  className="inline-flex items-center gap-2 text-sm text-primary font-accent font-bold hover:text-accent transition-colors cursor-pointer group"
                >
                  Chat on WhatsApp
                  <ArrowLeft className="w-4 h-4 rotate-135 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Components Section */}
      <div className="mt-20 lg:mt-32 mb-10 border-t border-brand-200/40 pt-16 lg:pt-24">
        <h2 className="text-3xl md:text-4xl font-heading text-center text-primary mb-12 lg:mb-20">What Inside Counts: Premium Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
          {/* Component 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white">
              <img src="/images/gots-cotton.png" alt="GOTS Certified Organic Cotton Fabric" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-primary mb-2">GOTS Organic Cotton Fabric</h3>
            <div className="inline-flex items-center gap-1 bg-success/15 border border-success/20 text-success text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <Check className="w-3.5 h-3.5" /> GOTS Certified
            </div>
            <p className="text-sm sm:text-base text-muted/80 font-body leading-relaxed max-w-sm">
              GOTS Certified Organic Cotton fabric is naturally breathable and anti allergic. It will help in avoiding sweat and moisture trapping next to the skin because of its natural properties.
            </p>
          </div>

          {/* Component 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white">
              <img src="/images/quilted-cotton.png" alt="Quilted Organic Cotton Layer" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-primary mb-2">Quilted Organic Cotton</h3>
            <div className="inline-flex items-center gap-1 bg-success/15 border border-success/20 text-success text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <Check className="w-3.5 h-3.5" /> 100% Organic
            </div>
            <p className="text-sm sm:text-base text-muted/80 font-body leading-relaxed max-w-sm">
              The 100% organic cotton layer used in our mattress has smooth feel . It has a cool surface that perfectly complements natural latex . When designing this mattress, we insisted on using only organic cotton as it is anti-allergic and good for skin. It is flexible and strong which makes it more durable.
            </p>
          </div>

          {/* Component 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white bg-bg">
              <img src="/images/natural-latex.png" alt="100% Natural Dunlop Latex" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-primary mb-2">100% Natural Latex</h3>
            <div className="inline-flex items-center gap-1 bg-success-700/15 border border-success-700/20 text-success-700 text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <Leaf className="w-3.5 h-3.5" /> 100% Eco-Friendly
            </div>
            <p className="text-sm sm:text-base text-muted/80 font-body leading-relaxed max-w-sm">
              The main component of our mattress is 100% natural latex. We bring you the highest-quality latex that does not contain any synthetic material or fillers. It is made through the energy-efficient Dunlop process that provides best sleeping surface available in the market.
            </p>
          </div>
        </div>
      </div>

      {/* Comfort Meter Section */}
      <div className="mt-16 lg:mt-24 mb-10 border-t border-brand-200/40 pt-10">
        <img 
          src="/images/comfort-meter.png" 
          alt="RelaxPro Mattress Comfort Meter" 
          className="w-full h-auto object-contain rounded-2xl shadow-sm"
        />
      </div>

      {/* Size Chart Section */}
      <div className="mt-16 lg:mt-24 mb-10 border-t border-brand-200/40 pt-10">
        <img 
          src="/images/size-chart.png" 
          alt="RelaxPro Mattress Size Chart" 
          className="w-full h-auto object-contain rounded-2xl shadow-sm"
        />
      </div>

      {/* Mobile-only sticky buy bar (hidden on >= md) */}
      <motion.div
        initial={reduceMotion ? false : { y: '100%' }}
        animate={{ y: footerInView ? '100%' : '0%' }}
        transition={reduceMotion ? { duration: 0 } : { type: 'tween', duration: 0.3, ease: 'easeOut' }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur border-t border-brand-200/60 shadow-[0_-4px_20px_-6px_rgba(0,0,0,0.12)] pb-[env(safe-area-inset-bottom)]"
        aria-hidden={footerInView}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex flex-col leading-none min-w-0">
            <span className="text-[10px] font-accent font-semibold uppercase tracking-wider text-muted/60">
              {product.name}
            </span>
            <span className="text-lg font-bold text-primary tracking-tight truncate">
              <PriceText>₹{activePrice.toLocaleString('en-IN')}</PriceText>
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="ml-auto flex-1 min-h-11 min-w-0 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-neutral-dark text-white font-medium rounded-xl transition-colors duration-200 shadow-sm cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5 shrink-0" />
            <span className="truncate">{addedToCart ? 'Added!' : 'Add to Cart'}</span>
          </button>

          <button
            onClick={handleContactSuresh}
            aria-label="Enquire on WhatsApp"
            className="min-h-11 min-w-11 shrink-0 inline-flex items-center justify-center p-3 bg-success hover:bg-success/90 text-white rounded-xl transition-colors duration-200 shadow-sm cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.83.001-2.624-1.023-5.091-2.884-6.957C16.586 1.964 14.111.94 11.488.94c-5.438 0-9.863 4.414-9.866 9.831-.001 1.942.509 3.826 1.481 5.534L2.016 20.2l4.631-1.046zM17.91 14.5c-.34-.17-2.015-.994-2.327-1.107-.31-.114-.537-.17-.762.17-.224.34-.868 1.107-1.064 1.332-.197.225-.394.25-.733.08-.339-.17-1.432-.527-2.73-1.682-1.01-.902-1.693-2.016-1.89-2.356-.198-.34-.021-.523.149-.693.153-.153.34-.397.51-.595.17-.198.226-.34.34-.567.113-.227.056-.425-.028-.595-.085-.17-.763-1.839-1.045-2.522-.275-.66-.554-.57-.762-.58-.198-.011-.424-.013-.65-.013-.226 0-.594.085-.905.424-.311.34-1.187 1.162-1.187 2.831 0 1.67 1.215 3.284 1.385 3.51.17.227 2.39 3.65 5.79 5.12.809.35 1.44.558 1.933.715.813.258 1.554.222 2.14.135.653-.097 2.016-.823 2.3-1.577.283-.755.283-1.401.198-1.537-.085-.136-.312-.222-.653-.392z" />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
