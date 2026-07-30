import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import PriceText from '../ui/PriceText';
import { Check, Shield, Award, HelpCircle, MessageSquare, ArrowLeft, Heart, Star, Sparkles, BookOpen, VolumeX, Mail, ShoppingCart, Leaf } from 'lucide-react';
import { Product, MattressSize, CartItem } from '../../types';
import ProductCarousel from './ProductCarousel';
import { WHATSAPP_NUMBER } from '../../lib/site';
import { getSiteSettings, imageUrl } from '../../lib/queries';

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
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getSiteSettings().then(s => setSettings(s)).catch(() => {});
  }, []);

  const SI = settings?.staticImages || {};

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
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24"
    >
      {/* Navigation & Back Link */}
      <button
        onClick={onNavigateBack}
        className="inline-flex items-center gap-2 text-graphite-500 hover:text-ink-900 text-xs font-accent font-semibold mb-8 lg:mb-12 group cursor-pointer transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-sky-100 border border-brand-200/50 flex items-center justify-center group-hover:bg-white group-hover:border-brand-200 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-ink-900" />
        </div>
        Back to Collections
      </button>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xs:gap-10 sm:gap-12 lg:gap-16">
        {/* Left: Product Images & Core Specs */}
        <div className="lg:col-span-7 space-y-8 xs:space-y-10 lg:space-y-12">
          <ProductCarousel
            images={[product.image, ...product.images]}
            alt={product.name}
            badge={product.badge}
          />

          {/* Core Spec Badges Section */}
          <div className="bg-white p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-brand-200/40 shadow-sm grid grid-cols-3 gap-2 sm:gap-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[7px] sm:text-[10px] font-mono text-graphite-400 uppercase tracking-widest block mb-1 sm:mb-2 truncate">Stiffness</span>
              <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full ${
                      i < product.comfortRating ? 'bg-brand-600 shadow-sm' : 'bg-sky-100 border border-brand-200/50'
                    }`}
                  ></span>
                ))}
              </div>
              <span className="text-xs sm:text-sm font-heading font-bold text-ink-900 capitalize leading-tight">
                {product.comfortLevel} <span className="text-graphite-400 font-body font-normal text-[9px] sm:text-[14px]">({product.comfortRating}/5)</span>
              </span>
            </div>
            
            <div className="border-x border-brand-200/30 flex flex-col items-center justify-center">
              <span className="text-[7px] sm:text-[10px] font-mono text-graphite-400 uppercase tracking-widest block mb-1">Depth Profile</span>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-ink-900 block leading-none sm:leading-tight">{product.totalThickness}"</span>
              <span className="text-[7px] sm:text-[11px] text-graphite-500 font-body block mt-0.5 sm:mt-1 truncate">Inches Composite</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="text-[7px] sm:text-[10px] font-mono text-graphite-400 uppercase tracking-widest block mb-1">Warranty</span>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-ink-900 block leading-none sm:leading-tight">{product.warranty}-Year</span>
              <span className="text-[7px] sm:text-[11px] text-graphite-500 font-body block mt-0.5 sm:mt-1 truncate">Direct Replacement</span>
            </div>
          </div>

          {/* Stacked Layer Breakdown with descriptions */}
          <div className="bg-sky-100/30 p-4 sm:p-6 md:p-10 rounded-[1.5rem] sm:rounded-[2rem] border border-brand-200/40 shadow-sm">
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink-900 mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center border border-brand-200/50 shadow-sm shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
              </div>
              Internal Architecture
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              {product.layers.map((layer, idx) => (
                <div key={idx} className="flex gap-3 sm:gap-5 items-start p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-brand-200/40 relative overflow-hidden group hover:border-brand-600/30 transition-colors">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 text-brand-600 font-heading font-bold flex items-center justify-center shrink-0 border border-brand-600/20 text-sm sm:text-lg group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    {layer.thickness}"
                  </div>
                  <div className="flex-1 pt-0 sm:pt-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <h4 className="font-accent font-bold text-xs sm:text-[14px] text-ink-900 uppercase tracking-wide">
                        {layer.material.replace('_', ' ')}
                      </h4>
                      {layer.brand && (
                         <span className="font-mono text-[8px] sm:text-[10px] bg-sky-100 border border-brand-200/50 text-graphite-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-medium">
                          {layer.brand}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-sm text-graphite-600 leading-relaxed font-body">
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
        <div className="lg:col-span-5 space-y-6 xs:space-y-8 lg:space-y-10">
          {/* Header titles */}
          <div className="sticky top-32">
            <span className="inline-flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] tracking-widest font-accent font-bold text-success bg-success/10 border border-success/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase mb-2 sm:mb-4">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {product.tier === 'luxury' ? 'Luxury Spine Care' : 'Ortho Certified'}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-ink-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-brand-600 text-sm sm:text-base font-heading italic mt-1 sm:mt-2">
              &ldquo;{product.tagline}&rdquo;
            </p>
            <div className="mt-6 p-5 rounded-2xl bg-sky-100 border border-brand-200/50 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600 rounded-l-2xl"></div>
              <p className="text-graphite-700 text-sm leading-relaxed font-body">
                {product.keyBenefit}
              </p>
            </div>

            {/* Size Selectors Section */}
            <div className="mt-6 sm:mt-10 bg-white p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-brand-200/40 shadow-sm">
              <h3 className="font-heading font-bold text-ink-900 text-lg sm:text-xl mb-4 sm:mb-6 flex items-center justify-between">
                Select Size
                <span className="text-[10px] sm:text-xs font-accent font-normal text-graphite-400 bg-sky-100 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">Step 1 of {product.pricingModel === 'with_without_accessories' || product.pricingModel === 'fabric_options' ? '2' : '1'}</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {(Object.keys(SIZE_LABELS) as MattressSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setActiveSize(sz)}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      activeSize === sz
                        ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                        : 'border-brand-200/50 hover:border-brand-600/40 hover:bg-sky-100'
                    }`}
                  >
                    <span className="font-accent font-bold text-xs sm:text-sm text-ink-900 capitalize block">{sz} Size</span>
                    <span className="font-mono text-[9px] sm:text-[10px] text-graphite-500 mt-1 sm:mt-1.5 block">
                      {sz === 'king' ? '72"x78"' : sz === 'queen' ? '60"x78"' : sz === 'double' ? '48"x75"' : '36"x75"'}
                    </span>
                    {activeSize === sz && (
                      <span className="absolute top-3 right-3 text-brand-600 bg-white rounded-full shadow-sm p-0.5">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Pricing Model configuration boxes */}
              {product.pricingModel === 'with_without_accessories' ? (
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-brand-200/40 space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                    <h3 className="font-heading font-bold text-ink-900 text-lg sm:text-xl">
                      Accessory Bundle
                    </h3>
                    <span className="text-[9px] sm:text-[10px] font-accent text-success bg-success/10 border border-success/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-bold uppercase tracking-wider">Save ₹3,700</span>
                  </div>
                  
                  <div
                    onClick={() => setIncludeAccessories(true)}
                    className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border cursor-pointer transition-all ${
                      includeAccessories
                        ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                        : 'border-brand-200/50 hover:border-brand-600/40 hover:bg-sky-100'
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${includeAccessories ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200/80 bg-white'}`}>
                        {includeAccessories && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-xs sm:text-[14px] text-ink-900 block">Include Premium Pack <span className="text-brand-600 text-[8px] sm:text-[10px] ml-1 uppercase tracking-widest block sm:inline">(Recommended)</span></strong>
                        <p className="text-[10px] sm:text-xs text-graphite-500 leading-relaxed mt-1 sm:mt-2 font-body">
                          Adds 2 Ergonomic Premium Latex Pillows + 1 Elasticated Waterproof Mattress Protector. Delivered pre-compressed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setIncludeAccessories(false)}
                    className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border cursor-pointer transition-all ${
                      !includeAccessories
                        ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                        : 'border-brand-200/50 hover:border-brand-600/40 hover:bg-sky-100'
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${!includeAccessories ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200/80 bg-white'}`}>
                        {!includeAccessories && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-xs sm:text-[14px] text-ink-900 block">Mattress Only</strong>
                        <p className="text-[10px] sm:text-xs text-graphite-500 leading-relaxed mt-1 sm:mt-2 font-body">
                          Deduct accessories. Delivered packaged flat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : product.pricingModel === 'fabric_options' ? (
                <div className="mt-8 pt-8 border-t border-brand-200/40 space-y-4">
                  <h3 className="font-heading font-bold text-ink-900 text-xl mb-4">
                    Outer Fabric Options
                  </h3>

                  <div
                    onClick={() => setSelectedFabric('300GSM')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      selectedFabric === '300GSM'
                        ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                        : 'border-brand-200/50 hover:border-brand-600/40 hover:bg-sky-100'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedFabric === '300GSM' ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200/80 bg-white'}`}>
                        {selectedFabric === '300GSM' && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-ink-900 block">300 GSM Premium Micro-Knit</strong>
                        <p className="text-xs text-graphite-500 leading-relaxed mt-2 font-body">
                          Standard luxury cover, lightweight, hyper breathable. Holds Oeko-Tex certification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedFabric('450GSM')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      selectedFabric === '450GSM'
                        ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
                        : 'border-brand-200/50 hover:border-brand-600/40 hover:bg-sky-100'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedFabric === '450GSM' ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200/80 bg-white'}`}>
                        {selectedFabric === '450GSM' && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-ink-900 block">450 GSM Luxurious Quilted Bamboo</strong>
                        <p className="text-xs text-graphite-500 leading-relaxed mt-2 font-body">
                          Upgraded luxurious thickness with stitched cloud padding. Bamboo fibers maintain high-end coolness natively.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Pricing Box & Add to Cart */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white border border-graphite-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] font-sans">
              <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-graphite-500 uppercase mb-1.5 sm:mb-2">
                Direct-to-Consumer Value
              </p>

              <div className="flex items-baseline gap-2 sm:gap-3 mb-1">
                <span className="text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight"><PriceText>₹{activePrice.toLocaleString('en-IN')}</PriceText></span>
                <span className="text-base sm:text-lg text-graphite-400 line-through"><PriceText>₹{Math.round(activePrice * 1.4).toLocaleString('en-IN')}</PriceText></span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-graphite-600 mb-4 sm:mb-6">
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span>Tax Included &bull; Free Shipping</span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-ink-900 hover:bg-ink-800 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{addedToCart ? 'Added!' : 'Add to Cart'}</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm cursor-pointer"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
                <button
                  onClick={handleContactSuresh}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-eco-500/20 text-eco-600 hover:bg-eco-50 font-medium rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Enquire on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Ask Suresh / Personal Consultation CTA */}
            <div className="mt-6 bg-sky-100/80 p-5 xs:p-6 sm:p-6 md:p-8 rounded-[1.5rem] xs:rounded-[1.75rem] sm:rounded-[2rem] border border-brand-200/40 flex items-start gap-3 xs:gap-4 sm:gap-5 shadow-sm">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-brand-200/50 shadow-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white animate-pulse"></div>
                <MessageSquare className="w-6 h-6 text-ink-900" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-ink-900 text-lg mb-2">Need a Clinical Posture Audit?</h4>
                <p className="text-graphite-600 text-sm leading-relaxed font-body mb-4">
                  Connect directly with Suresh (founder). He analyzes mattress hardness, sleep postures, and medical back histories to recommend the ideal model.
                </p>
                <button
                  onClick={handleContactSuresh}
                  className="inline-flex items-center gap-2 text-sm text-ink-900 font-accent font-bold hover:text-brand-600 transition-colors cursor-pointer group"
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
      <div className="mt-16 xs:mt-20 sm:mt-20 md:mt-24 lg:mt-32 mb-8 xs:mb-10 sm:mb-10 md:mb-14 lg:mb-20 border-t border-brand-200/40 pt-12 xs:pt-14 sm:pt-14 md:pt-16 lg:pt-24">
        <h2 className="text-2xl xs:text-[26px] sm:text-[30px] md:text-[34px] lg:text-4xl font-heading text-center text-ink-900 mb-8 xs:mb-10 sm:mb-12 md:mb-16 lg:mb-20">What Inside Counts: Premium Components</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 xs:gap-12 sm:gap-8 md:gap-8 lg:gap-12">
          {/* Component 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white">
              <img src={imageUrl(SI.gotsCotton) || '/images/gots-cotton.png'} alt="GOTS Certified Organic Cotton Fabric" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-2">GOTS Organic Cotton Fabric</h3>
            <div className="inline-flex items-center gap-1 bg-success/15 border border-success/20 text-success text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <Check className="w-3.5 h-3.5" /> GOTS Certified
            </div>
            <p className="text-sm sm:text-base text-graphite-600 font-body leading-relaxed max-w-sm">
              GOTS Certified Organic Cotton fabric is naturally breathable and anti allergic. It will help in avoiding sweat and moisture trapping next to the skin because of its natural properties.
            </p>
          </div>

          {/* Component 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white">
              <img src={imageUrl(SI.quiltedCotton) || '/images/quilted-cotton.png'} alt="Quilted Organic Cotton Layer" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-2">Quilted Organic Cotton</h3>
            <div className="inline-flex items-center gap-1 bg-success/15 border border-success/20 text-success text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <Check className="w-3.5 h-3.5" /> 100% Organic
            </div>
            <p className="text-sm sm:text-base text-graphite-600 font-body leading-relaxed max-w-sm">
              The 100% organic cotton layer used in our mattress has smooth feel . It has a cool surface that perfectly complements natural latex . When designing this mattress, we insisted on using only organic cotton as it is anti-allergic and good for skin. It is flexible and strong which makes it more durable.
            </p>
          </div>

          {/* Component 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white bg-sky-100">
              <img src={imageUrl(SI.naturalLatex) || '/images/natural-latex.png'} alt="100% Natural Dunlop Latex" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" sizes="(min-width: 768px) 33vw, 100vw" />
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-2">100% Natural Latex</h3>
            <div className="inline-flex items-center gap-1 bg-eco-600/15 border border-eco-600/20 text-eco-600 text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <Leaf className="w-3.5 h-3.5" /> 100% Eco-Friendly
            </div>
            <p className="text-sm sm:text-base text-graphite-600 font-body leading-relaxed max-w-sm">
              The main component of our mattress is 100% natural latex. We bring you the highest-quality latex that does not contain any synthetic material or fillers. It is made through the energy-efficient Dunlop process that provides best sleeping surface available in the market.
            </p>
          </div>
        </div>
      </div>

      {/* Certification Feature Images */}
      <div className="mt-6 xs:mt-8 sm:mt-8 md:mt-10 lg:mt-12 space-y-4 xs:space-y-5 sm:space-y-6">
        <div className="rounded-2xl overflow-hidden border border-brand-200/40 shadow-sm">
          <img src="/images/organic-cotton-quilting-fabric-latex-mattress-desktop-new.jpeg" alt="Organic Cotton Quilting" className="w-full h-auto object-cover" />
        </div>
        <div className="rounded-2xl overflow-hidden border border-brand-200/40 shadow-sm">
          <img src={imageUrl(SI.technicalSpecifications) || '/images/technical-specifications.png'} alt="Technical Specifications" className="w-full h-auto object-cover" sizes="100vw" />
        </div>
        <div className="rounded-2xl overflow-hidden border border-brand-200/40 shadow-sm">
          <img src={imageUrl(SI.vilasaBenefits) || '/images/vilasa-benefits.png'} alt="Vilasa Benefits" className="w-full h-auto object-cover" sizes="100vw" />
        </div>
      </div>

      {/* Comfort Meter Section */}
      <div className="mt-12 xs:mt-14 sm:mt-14 md:mt-16 lg:mt-24 mb-8 xs:mb-10 sm:mb-10 md:mb-14 lg:mb-20 border-t border-brand-200/40 pt-8 xs:pt-10 sm:pt-10 md:pt-12 lg:pt-16">
        <img 
          src={imageUrl(SI.comfortMeter) || '/images/comfort-meter.png'} 
          alt="RelaxPro Mattress Comfort Meter" 
          className="w-full h-auto object-contain rounded-xl xs:rounded-2xl shadow-sm"
          sizes="100vw"
        />
      </div>

      {/* Size Chart Section */}
      <div className="mt-12 xs:mt-14 sm:mt-14 md:mt-16 lg:mt-24 mb-8 xs:mb-10 sm:mb-10 md:mb-14 lg:mb-20 border-t border-brand-200/40 pt-8 xs:pt-10 sm:pt-10 md:pt-12 lg:pt-16">
        <img 
          src={imageUrl(SI.sizeChart) || '/images/size-chart.png'} 
          alt="RelaxPro Mattress Size Chart" 
          className="w-full h-auto object-contain rounded-2xl shadow-sm"
          sizes="100vw"
        />
      </div>
    </motion.div>
  );
}
