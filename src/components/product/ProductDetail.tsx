import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import PriceText from '../ui/PriceText';
import { Check, Shield, Award, HelpCircle, MessageSquare, ArrowLeft, Heart, Star, Sparkles, BookOpen, VolumeX, Mail, ShoppingCart } from 'lucide-react';
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
      className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16"
    >
      {/* Navigation & Back Link */}
      <button
        onClick={onNavigateBack}
        className="inline-flex items-center gap-2 text-neutral-dark/60 hover:text-primary text-xs font-accent font-semibold mb-8 lg:mb-12 group cursor-pointer transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-neutral-light border border-brand-200/50 flex items-center justify-center group-hover:bg-white group-hover:border-brand-200 transition-all">
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
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-brand-200/40 shadow-sm grid grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono text-neutral-dark/40 uppercase tracking-widest block mb-2">Stiffness</span>
              <div className="flex items-center justify-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < product.comfortRating ? 'bg-accent shadow-sm' : 'bg-neutral-light border border-brand-200/50'
                    }`}
                  ></span>
                ))}
              </div>
              <span className="text-sm font-heading font-bold text-primary capitalize">
                {product.comfortLevel} <span className="text-neutral-dark/40 font-body font-normal">({product.comfortRating}/5)</span>
              </span>
            </div>
            
            <div className="border-x border-brand-200/30 flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono text-neutral-dark/40 uppercase tracking-widest block mb-1">Depth Profile</span>
              <span className="text-2xl md:text-3xl font-bold font-heading text-primary block">{product.totalThickness}"</span>
              <span className="text-[11px] text-neutral-dark/50 font-body block mt-1">Inches Composite</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono text-neutral-dark/40 uppercase tracking-widest block mb-1">Warranty</span>
              <span className="text-2xl md:text-3xl font-bold font-heading text-primary block">{product.warranty}-Year</span>
              <span className="text-[11px] text-neutral-dark/50 font-body block mt-1">Direct Replacement</span>
            </div>
          </div>

          {/* Stacked Layer Breakdown with descriptions */}
          <div className="bg-neutral-light/30 p-6 md:p-10 rounded-[2rem] border border-brand-200/40 shadow-sm">
            <h3 className="font-heading font-bold text-2xl text-primary mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-brand-200/50 shadow-sm">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              Internal Architecture
            </h3>
            
            <div className="space-y-4">
              {product.layers.map((layer, idx) => (
                <div key={idx} className="flex gap-5 items-start p-5 bg-white rounded-2xl border border-brand-200/40 relative overflow-hidden group hover:border-accent/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent font-heading font-bold flex items-center justify-center shrink-0 border border-accent/20 text-lg group-hover:bg-accent group-hover:text-white transition-colors">
                    {layer.thickness}"
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-accent font-bold text-[14px] text-primary uppercase tracking-wide">
                        {layer.material.replace('_', ' ')}
                      </h4>
                      {layer.brand && (
                         <span className="font-mono text-[10px] bg-neutral-light border border-brand-200/50 text-neutral-dark/60 px-2 py-1 rounded-md font-medium">
                          {layer.brand}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-dark/70 leading-relaxed font-body">
                      {layer.description}
                    </p>
                    {layer.certification && (
                      <div className="flex gap-2 mt-4">
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
            <span className="inline-flex items-center gap-2 text-[10px] tracking-widest font-accent font-bold text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full uppercase mb-4">
              <Sparkles className="w-3 h-3" />
              {product.tier === 'luxury' ? 'Luxury Spine Care' : 'Ortho Certified'}
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-primary leading-tight">
              {product.name}
            </h1>
            <p className="text-accent text-base font-heading italic mt-2">
              &ldquo;{product.tagline}&rdquo;
            </p>
            <div className="mt-6 p-5 rounded-2xl bg-neutral-light border border-brand-200/50 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-2xl"></div>
              <p className="text-neutral-dark/80 text-sm leading-relaxed font-body">
                {product.keyBenefit}
              </p>
            </div>

            {/* Size Selectors Section */}
            <div className="mt-10 bg-white p-6 md:p-8 rounded-[2rem] border border-brand-200/40 shadow-sm">
              <h3 className="font-heading font-bold text-primary text-xl mb-6 flex items-center justify-between">
                Select Size
                <span className="text-xs font-accent font-normal text-neutral-dark/40 bg-neutral-light px-3 py-1 rounded-full">Step 1 of {product.pricingModel === 'with_without_accessories' || product.pricingModel === 'fabric_options' ? '2' : '1'}</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(SIZE_LABELS) as MattressSize[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setActiveSize(sz)}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      activeSize === sz
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-brand-200/50 hover:border-accent/40 hover:bg-neutral-light'
                    }`}
                  >
                    <span className="font-accent font-bold text-sm text-primary capitalize block">{sz} Size</span>
                    <span className="font-mono text-[10px] text-neutral-dark/50 mt-1.5 block">
                      {sz === 'king' ? '72"x78"' : sz === 'queen' ? '60"x78"' : sz === 'double' ? '48"x75"' : '36"x75"'}
                    </span>
                    {activeSize === sz && (
                      <span className="absolute top-3 right-3 text-accent bg-white rounded-full shadow-sm p-0.5">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Pricing Model configuration boxes */}
              {product.pricingModel === 'with_without_accessories' ? (
                <div className="mt-8 pt-8 border-t border-brand-200/40 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-heading font-bold text-primary text-xl">
                      Accessory Bundle
                    </h3>
                    <span className="text-[10px] font-accent text-success bg-success/10 border border-success/20 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Save ₹3,700</span>
                  </div>
                  
                  <div
                    onClick={() => setIncludeAccessories(true)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      includeAccessories
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-brand-200/50 hover:border-accent/40 hover:bg-neutral-light'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${includeAccessories ? 'border-accent bg-accent text-white' : 'border-brand-200/80 bg-white'}`}>
                        {includeAccessories && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-primary block">Include Premium Pack <span className="text-accent text-[10px] ml-1 uppercase tracking-widest">(Recommended)</span></strong>
                        <p className="text-xs text-neutral-dark/60 leading-relaxed mt-2 font-body">
                          Adds 2 Ergonomic Premium Latex Pillows + 1 Elasticated Waterproof Mattress Protector. Delivered pre-compressed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setIncludeAccessories(false)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      !includeAccessories
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-brand-200/50 hover:border-accent/40 hover:bg-neutral-light'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${!includeAccessories ? 'border-accent bg-accent text-white' : 'border-brand-200/80 bg-white'}`}>
                        {!includeAccessories && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-primary block">Mattress Only</strong>
                        <p className="text-xs text-neutral-dark/60 leading-relaxed mt-2 font-body">
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
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      selectedFabric === '300GSM'
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-brand-200/50 hover:border-accent/40 hover:bg-neutral-light'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedFabric === '300GSM' ? 'border-accent bg-accent text-white' : 'border-brand-200/80 bg-white'}`}>
                        {selectedFabric === '300GSM' && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-primary block">300 GSM Premium Micro-Knit</strong>
                        <p className="text-xs text-neutral-dark/60 leading-relaxed mt-2 font-body">
                          Standard luxury cover, lightweight, hyper breathable. Holds Oeko-Tex certification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedFabric('450GSM')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      selectedFabric === '450GSM'
                        ? 'border-accent bg-accent/5 ring-1 ring-accent'
                        : 'border-brand-200/50 hover:border-accent/40 hover:bg-neutral-light'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedFabric === '450GSM' ? 'border-accent bg-accent text-white' : 'border-brand-200/80 bg-white'}`}>
                        {selectedFabric === '450GSM' && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-primary block">450 GSM Luxurious Quilted Bamboo</strong>
                        <p className="text-xs text-neutral-dark/60 leading-relaxed mt-2 font-body">
                          Upgraded luxurious thickness with stitched cloud padding. Bamboo fibers maintain high-end coolness natively.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Pricing Box & Add to Cart */}
            <div className="mt-8 p-6 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] font-sans">
              <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">
                Direct-to-Consumer Value
              </p>

              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-bold text-gray-900 tracking-tight"><PriceText>₹{activePrice.toLocaleString('en-IN')}</PriceText></span>
                <span className="text-lg text-gray-400 line-through"><PriceText>₹{Math.round(activePrice * 1.4).toLocaleString('en-IN')}</PriceText></span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Check className="w-4 h-4 text-green-500" />
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
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-accent hover:bg-[#2569A0] text-white font-medium rounded-xl transition-colors duration-200 shadow-sm cursor-pointer"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
                <button
                  onClick={handleContactSuresh}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-medium rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Enquire on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Ask Suresh / Personal Consultation CTA */}
            <div className="mt-6 bg-neutral-light/80 p-6 md:p-8 rounded-[2rem] border border-brand-200/40 flex items-start gap-5 shadow-sm">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-brand-200/50 shadow-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white animate-pulse"></div>
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-primary text-lg mb-2">Need a Clinical Posture Audit?</h4>
                <p className="text-neutral-dark/70 text-sm leading-relaxed font-body mb-4">
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
    </motion.div>
  );
}
