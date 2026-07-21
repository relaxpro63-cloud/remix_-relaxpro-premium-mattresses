import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import PriceText from '../../components/ui/PriceText';
import ProductCarousel from '../../components/product/ProductCarousel';
import {
  Check,
  Shield,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  BookOpen,
  ShoppingCart,
  Leaf,
  Ruler,
} from 'lucide-react';
import PageShell from '../../components/layout/PageShell';
import { Product, MattressSize, SizeCategory } from '../../types';
import { PRODUCTS } from '../../data/products';
import { STANDARD_SIZES, SIZE_CATEGORIES } from '../../types/sizes';

interface ProductDetailRouteProps {
  onAddToCartDirect: (
    product: Product,
    size: MattressSize,
    includeAcc: boolean,
    fabricOption?: '300GSM' | '450GSM',
    customSizeData?: { length: number; width: number; thickness?: number },
    sizeCategory?: SizeCategory,
  ) => void;
  onNavigateBack: () => void;
}

const SIZE_LABELS: Record<string, string> = {
  king: 'King Size (72" × 72")',
  queen: 'Queen Size (60" × 78")',
  double: 'Double Size (48" × 75")',
  single: 'Single Size (36" × 75")',
};

export default function ProductDetailRoute({ onAddToCartDirect, onNavigateBack }: ProductDetailRouteProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.slug === slug);

  // ─── Size selection state ───────────────────────────────────────────────────
  const [sizeCategory, setSizeCategory] = useState<SizeCategory | null>(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [isCustom, setIsCustom] = useState(false);
  const [customL, setCustomL] = useState('');
  const [customW, setCustomW] = useState('');
  const [customH, setCustomH] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);

  const [includeAccessories, setIncludeAccessories] = useState<boolean>(true);
  const [selectedFabric, setSelectedFabric] = useState<'300GSM' | '450GSM'>('300GSM');
  const [addedToCart, setAddedToCart] = useState(false);

  // ─── Derived: effective size key + display text ────────────────────────────
  const effectiveSizeKey: MattressSize | 'custom' = useMemo(() => {
    if (isCustom) return 'custom';
    if (!sizeCategory) return 'king';
    const cat = STANDARD_SIZES[sizeCategory];
    const variant = cat.variants[selectedVariantIdx] || cat.variants[0];
    return variant.legacyKey as MattressSize;
  }, [sizeCategory, selectedVariantIdx, isCustom]);

  const selectedLabel = useMemo(() => {
    if (isCustom) {
      const l = parseInt(customL);
      const w = parseInt(customW);
      const h = customH ? ` · H: ${customH}"` : '';
      if (!isNaN(l) && !isNaN(w)) return `Custom · ${l}" × ${w}"${h}`;
      return 'Custom Size';
    }
    if (!sizeCategory) return '';
    const cat = STANDARD_SIZES[sizeCategory];
    const variant = cat.variants[selectedVariantIdx] || cat.variants[0];
    return `${cat.label} · ${variant.label}`;
  }, [sizeCategory, selectedVariantIdx, isCustom, customL, customW, customH]);

  // ─── Legacy size key used for legacy SizePrice lookup ──────────────────────
  const legacyKey: MattressSize = useMemo(() => {
    if (!sizeCategory || isCustom) return 'king';
    const cat = STANDARD_SIZES[sizeCategory];
    const variant = cat.variants[selectedVariantIdx] || cat.variants[0];
    return variant.legacyKey as MattressSize;
  }, [sizeCategory, selectedVariantIdx, isCustom]);

  // ─── Price ─────────────────────────────────────────────────────────────────
  const activePrice = useMemo(() => {
    if (!product) return 0;
    if (isCustom) return 0;
    if (product.pricingModel === 'with_without_accessories') {
      const pricingObj = product.pricing;
      if (includeAccessories) return pricingObj.withAccessories?.[legacyKey] || 0;
      return pricingObj.withoutAccessories?.[legacyKey] || 0;
    }
    const pricingObj = product.pricing;
    return selectedFabric === '450GSM'
      ? pricingObj.fabric450Gsm?.[legacyKey] || 0
      : pricingObj.fabric300Gsm?.[legacyKey] || 0;
  }, [product, legacyKey, isCustom, includeAccessories, selectedFabric]);

  // ─── Error page ────────────────────────────────────────────────────────────
  if (!product) {
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Product Not Found | RelaxPro Premium Mattresses',
      description: 'The requested mattress model could not be found.',
      url: `https://remix-relaxpro-matress.vercel.app/mattresses/${slug}`,
    };
    return (
      <PageShell title="Product Not Found | RelaxPro Premium Mattresses" description="The requested mattress model could not be found." schema={productSchema}>
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          <h2 className="text-2xl font-display text-brand-950">Mattress Not Found</h2>
          <p className="text-xs text-stone-500">We couldn't find a mattress matching that name.</p>
          <button onClick={() => navigate('/catalog')} className="bg-brand-950 hover:bg-brand-800 text-white rounded-xl py-3 px-6 text-xs uppercase tracking-wider font-semibold font-display cursor-pointer">View All Models</button>
        </div>
      </PageShell>
    );
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.keyBenefit,
    brand: { '@type': 'Brand', name: 'RelaxPro' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.pricingModel === 'with_without_accessories'
        ? product.pricing.withoutAccessories?.[legacyKey] || 0
        : product.pricing.fabric300Gsm?.[legacyKey] || 0,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      url: `https://remix-relaxpro-matress.vercel.app/mattresses/${product.slug}`,
    },
  };

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const validateCustom = useCallback(() => {
    const l = parseInt(customL);
    const w = parseInt(customW);
    if (!customL || isNaN(l) || l < 48 || l > 96) {
      setCustomError('Length must be between 48" and 96".');
      return false;
    }
    if (!customW || isNaN(w) || w < 24 || w > 84) {
      setCustomError('Width must be between 24" and 84".');
      return false;
    }
    setCustomError(null);
    return true;
  }, [customL, customW]);

  const handleCustomLChange = (val: string) => {
    setCustomL(val);
    if (customError) setCustomError(null);
  };
  const handleCustomWChange = (val: string) => {
    setCustomW(val);
    if (customError) setCustomError(null);
  };

  const handleCategorySelect = (cat: SizeCategory) => {
    setSizeCategory(cat);
    setSelectedVariantIdx(0);
    setIsCustom(false);
    setCustomError(null);
    setCustomL('');
    setCustomW('');
    setCustomH('');
  };

  const handleVariantSelect = (idx: number) => {
    setSelectedVariantIdx(idx);
    setIsCustom(false);
  };

  const handleCustomToggle = () => {
    const next = !isCustom;
    setIsCustom(next);
    if (next) {
      setSizeCategory(null);
      setSelectedVariantIdx(0);
    }
    setCustomError(null);
  };

  const handleAddToCart = () => {
    if (isCustom && !validateCustom()) return;
    onAddToCartDirect(
      product,
      effectiveSizeKey,
      product.pricingModel === 'with_without_accessories' ? includeAccessories : false,
      product.pricingModel === 'fabric_options' ? selectedFabric : undefined,
      isCustom
        ? { length: parseInt(customL), width: parseInt(customW), thickness: customH ? parseInt(customH) : undefined }
        : undefined,
      isCustom ? undefined : sizeCategory || undefined,
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleBuyNow = () => {
    if (isCustom && !validateCustom()) return;
    onAddToCartDirect(
      product,
      effectiveSizeKey,
      product.pricingModel === 'with_without_accessories' ? includeAccessories : false,
      product.pricingModel === 'fabric_options' ? selectedFabric : undefined,
      isCustom
        ? { length: parseInt(customL), width: parseInt(customW), thickness: customH ? parseInt(customH) : undefined }
        : undefined,
      isCustom ? undefined : sizeCategory || undefined,
    );
    navigate('/cart');
  };

  const handleContactSuresh = () => {
    const sizeStr = isCustom
      ? `Custom ${customL}" × ${customW}"${customH ? ` × ${customH}"` : ''}`
      : selectedLabel;
    const message = `Hello Suresh, I am interested in purchasing the RelaxPro ${product.name} Mattress (${sizeStr}). Could you please guide me on pricing, delivery timelines, and orthopedic support suitability?`;
    window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '918686624494'}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <PageShell title={product.metaTitle} description={product.metaDescription} ogImage={product.image} schema={productSchema}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16"
      >
        <button
          onClick={() => onNavigateBack()}
          className="inline-flex items-center gap-2 text-neutral-dark/60 hover:text-primary text-xs font-accent font-semibold mb-8 lg:mb-12 group cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-neutral-light border border-brand-200/50 flex items-center justify-center group-hover:bg-white group-hover:border-brand-200 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-primary" />
          </div>
          Back to Collections
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column — Images + Specs + Architecture */}
          <div className="lg:col-span-7 space-y-10">
            <ProductCarousel images={[product.image, ...product.images]} alt={product.name} badge={product.badge} />

            <div className="bg-white p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-brand-200/40 shadow-sm grid grid-cols-3 gap-2 sm:gap-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[7px] sm:text-[10px] font-mono text-neutral-dark/40 uppercase tracking-widest block mb-1 sm:mb-2 truncate">Stiffness</span>
                <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full ${i < product.comfortRating ? 'bg-blue shadow-sm' : 'bg-neutral-light border border-brand-200/50'}`} />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-heading font-bold text-primary capitalize leading-tight">{product.comfortLevel} <span className="text-neutral-dark/40 font-body font-normal text-[9px] sm:text-[14px]">({product.comfortRating}/5)</span></span>
              </div>
              <div className="border-x border-brand-200/30 flex flex-col items-center justify-center">
                <span className="text-[7px] sm:text-[10px] font-mono text-neutral-dark/40 uppercase tracking-widest block mb-1">Depth Profile</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-primary block leading-none sm:leading-tight">{product.totalThickness}"</span>
                <span className="text-[7px] sm:text-[11px] text-neutral-dark/50 font-body block mt-0.5 sm:mt-1 truncate">Inches Composite</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[7px] sm:text-[10px] font-mono text-neutral-dark/40 uppercase tracking-widest block mb-1">Warranty</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-primary block leading-none sm:leading-tight">{product.warranty}-Year</span>
                <span className="text-[7px] sm:text-[11px] text-neutral-dark/50 font-body block mt-0.5 sm:mt-1 truncate">Direct Replacement</span>
              </div>
            </div>

            <div className="bg-neutral-light/30 p-4 sm:p-6 md:p-10 rounded-[1.5rem] sm:rounded-[2rem] border border-brand-200/40 shadow-sm">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-primary mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center border border-brand-200/50 shadow-sm shrink-0"><BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue" /></div>
                Internal Architecture
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {product.layers.map((layer, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-5 items-start p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-brand-200/40 relative overflow-hidden group hover:border-blue/30 transition-colors">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue/10 text-blue font-heading font-bold flex items-center justify-center shrink-0 border border-blue/20 text-sm sm:text-lg group-hover:bg-blue group-hover:text-white transition-colors">{layer.thickness}"</div>
                    <div className="flex-1 pt-0 sm:pt-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <h4 className="font-accent font-bold text-xs sm:text-[14px] text-primary uppercase tracking-wide">{layer.material.replace('_', ' ')}</h4>
                        {layer.brand && <span className="font-mono text-[8px] sm:text-[10px] bg-neutral-light border border-brand-200/50 text-neutral-dark/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-medium">{layer.brand}</span>}
                      </div>
                      <p className="text-[10px] sm:text-sm text-neutral-dark/70 leading-relaxed font-body">{layer.description}</p>
                      {layer.certification && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-4">
                          {layer.certification.map((c) => (
                            <span key={c} className="text-[10px] font-bold font-accent bg-success/10 text-success border border-success/20 px-2.5 py-1 rounded-md flex items-center gap-1"><Check className="w-3 h-3" /> {c} Certified</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Sticky Product Info + Size Selector + Add to Cart */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-32 space-y-6">
              {/* Badge + Title */}
              <span className="inline-flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] tracking-widest font-accent font-bold text-success bg-success/10 border border-success/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {product.tier === 'luxury' ? 'Luxury Spine Care' : 'Ortho Certified'}
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-primary leading-tight">{product.name}</h1>
              <p className="text-blue text-sm sm:text-base font-heading italic mt-1 sm:mt-2">“{product.tagline}”</p>

              {/* Key benefit banner */}
              <div className="mt-6 p-5 rounded-2xl bg-neutral-light border border-blue/20 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue rounded-l-2xl" />
                <p className="text-neutral-dark/80 text-sm leading-relaxed font-body">{product.keyBenefit}</p>
              </div>

              {/* ─── SIZE SELECTION BLOCK ─────────────────────────────────── */}
              <div className="mt-6 sm:mt-10 bg-white p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-brand-200/40 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-primary text-lg sm:text-xl flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-blue" />
                    Select Size
                  </span>
                </h3>

                {/* Step 1 — Category selector */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {SIZE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategorySelect(cat.value)}
                      className={`py-2 sm:py-3 px-1 rounded-xl border text-center transition-all cursor-pointer ${sizeCategory === cat.value && !isCustom ? 'border-blue bg-blue/5 ring-1 ring-blue shadow-sm' : 'border-brand-200/60 bg-white hover:border-blue/40 hover:bg-neutral-light'}`}
                    >
                      <span className={`block text-[10px] sm:text-xs font-accent font-bold leading-tight ${sizeCategory === cat.value && !isCustom ? 'text-blue' : 'text-primary'}`}>{cat.label}</span>
                      <span className="block text-[8px] sm:text-[10px] text-neutral-dark/40 mt-0.5">{cat.hint}</span>
                    </button>
                  ))}
                </div>

                {/* Step 2 — Standard size variants */}
                {sizeCategory && !isCustom && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-accent font-bold uppercase tracking-widest text-neutral-dark/50">Available Sizes — {STANDARD_SIZES[sizeCategory].label}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {STANDARD_SIZES[sizeCategory].variants.map((variant, idx) => (
                        <button
                          key={variant.legacyKey}
                          onClick={() => handleVariantSelect(idx)}
                          className={`py-2.5 sm:py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${selectedVariantIdx === idx ? 'border-blue bg-blue/5 ring-1 ring-blue' : 'border-brand-200/60 bg-white hover:border-blue/40'}`}
                        >
                          <span className={`text-[11px] sm:text-sm font-accent font-bold ${selectedVariantIdx === idx ? 'text-blue' : 'text-primary'}`}>{variant.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Size toggle + form */}
                <div className="border-t border-brand-200/40 pt-4 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={handleCustomToggle}
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isCustom ? 'border-blue bg-blue text-white' : 'border-brand-200/80 bg-white'}`}
                    >
                      {isCustom && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                    </div>
                    <span className="text-[11px] sm:text-xs font-accent font-bold text-primary uppercase tracking-wider">Need a Custom Size?</span>
                  </label>

                  {isCustom && (
                    <div className="space-y-3 pl-1">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-accent font-bold text-primary uppercase tracking-wider mb-1.5">Length (inches)</label>
                          <input
                            type="number"
                            min={48}
                            max={96}
                            value={customL}
                            onChange={(e) => handleCustomLChange(e.target.value)}
                            placeholder={`e.g. 80`}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-200/50 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue/20 focus:border-blue bg-neutral-light/50 focus:bg-white transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-accent font-bold text-primary uppercase tracking-wider mb-1.5">Width (inches)</label>
                          <input
                            type="number"
                            min={24}
                            max={84}
                            value={customW}
                            onChange={(e) => handleCustomWChange(e.target.value)}
                            placeholder={`e.g. 70`}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-200/50 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue/20 focus:border-blue bg-neutral-light/50 focus:bg-white transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-accent font-bold text-neutral-dark/50 uppercase tracking-wider mb-1.5">Thickness / Height (optional)</label>
                        <input
                          type="number"
                          min={4}
                          max={14}
                          value={customH}
                          onChange={(e) => setCustomH(e.target.value)}
                          placeholder={`e.g. 8`}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-200/50 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue/20 focus:border-blue bg-neutral-light/50 focus:bg-white transition-all outline-none"
                        />
                      </div>
                      {customError && (
                        <p className="text-[10px] font-accent font-bold text-red-500 uppercase tracking-wider">{customError}</p>
                      )}
                      <p className="text-[10px] text-neutral-dark/40 leading-relaxed">Length: 48"–96" · Width: 24"–84" · Price on request — chat with us for a custom quote.</p>
                    </div>
                  )}
                </div>

                {/* Selected size pill */}
                {selectedLabel && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-accent font-bold text-neutral-dark/40 uppercase tracking-widest">Selected:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue/10 text-blue border border-blue/20 text-[11px] sm:text-xs font-accent font-bold">{selectedLabel}</span>
                  </div>
                )}
              </div>
              {/* ─── END SIZE SELECTION BLOCK ─────────────────────────────── */}

              {/* Accessory Bundle */}
              {product.pricingModel === 'with_without_accessories' && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-brand-200/40 space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                    <h3 className="font-heading font-bold text-primary text-lg sm:text-xl">Accessory Bundle</h3>
                    <span className="text-[9px] sm:text-[10px] font-accent text-success bg-success/10 border border-success/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-bold uppercase tracking-wider">Save ₹3,700</span>
                  </div>
                  <div onClick={() => setIncludeAccessories(true)} className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border cursor-pointer transition-all ${includeAccessories ? 'border-blue bg-blue/5 ring-1 ring-blue' : 'border-brand-200/50 hover:border-blue/40 hover:bg-neutral-light'}`}>
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${includeAccessories ? 'border-blue bg-blue text-white' : 'border-brand-200/80 bg-white'}`}>{includeAccessories && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}</div>
                      <div>
                        <strong className="font-accent font-bold text-xs sm:text-[14px] text-primary block">Include Premium Pack <span className="text-blue text-[8px] sm:text-[10px] ml-1 uppercase tracking-widest block sm:inline">(Recommended)</span></strong>
                        <p className="text-[10px] sm:text-xs text-neutral-dark/60 leading-relaxed mt-1 sm:mt-2 font-body">Adds 2 Ergonomic Premium Latex Pillows + 1 Elasticated Waterproof Mattress Protector. Delivered pre-compressed.</p>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setIncludeAccessories(false)} className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border cursor-pointer transition-all ${!includeAccessories ? 'border-blue bg-blue/5 ring-1 ring-blue' : 'border-brand-200/50 hover:border-blue/40 hover:bg-neutral-light'}`}>
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${!includeAccessories ? 'border-blue bg-blue text-white' : 'border-brand-200/80 bg-white'}`}>{!includeAccessories && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}</div>
                      <div>
                        <strong className="font-accent font-bold text-xs sm:text-[14px] text-primary block">Mattress Only</strong>
                        <p className="text-[10px] sm:text-xs text-neutral-dark/60 leading-relaxed mt-1 sm:mt-2 font-body">Deduct accessories. Delivered packaged flat.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Fabric options */}
              {product.pricingModel === 'fabric_options' && (
                <div className="mt-8 pt-8 border-t border-brand-200/40 space-y-4">
                  <h3 className="font-heading font-bold text-primary text-xl mb-4">Outer Fabric Options</h3>
                  <div onClick={() => setSelectedFabric('300GSM')} className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedFabric === '300GSM' ? 'border-blue bg-blue/5 ring-1 ring-blue' : 'border-brand-200/50 hover:border-blue/40 hover:bg-neutral-light'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedFabric === '300GSM' ? 'border-blue bg-blue text-white' : 'border-brand-200/80 bg-white'}`}>{selectedFabric === '300GSM' && <Check className="w-3.5 h-3.5" />}</div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-primary block">300 GSM Premium Micro-Knit</strong>
                        <p className="text-xs text-neutral-dark/60 leading-relaxed mt-2 font-body">Standard luxury cover, lightweight, hyper breathable. Holds Oeko-Tex certification.</p>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setSelectedFabric('450GSM')} className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedFabric === '450GSM' ? 'border-blue bg-blue/5 ring-1 ring-blue' : 'border-brand-200/50 hover:border-blue/40 hover:bg-neutral-light'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedFabric === '450GSM' ? 'border-blue bg-blue text-white' : 'border-brand-200/80 bg-white'}`}>{selectedFabric === '450GSM' && <Check className="w-3.5 h-3.5" />}</div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-primary block">450 GSM Luxurious Quilted Bamboo</strong>
                        <p className="text-xs text-neutral-dark/60 leading-relaxed mt-2 font-body">Upgraded luxurious thickness with stitched cloud padding. Bamboo fibers maintain high-end coolness natively.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price + Add to Cart */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] font-sans">
                <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1.5 sm:mb-2">
                  {isCustom ? 'Custom Size — Price on Request' : 'Direct-to-Consumer Value'}
                </p>
                <div className="flex items-baseline gap-2 sm:gap-3 mb-1">
                  {isCustom ? (
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">₹ —</span>
                  ) : (
                    <>
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight"><PriceText>₹{activePrice.toLocaleString('en-IN')}</PriceText></span>
                      <span className="text-base sm:text-lg text-gray-400 line-through"><PriceText>₹{Math.round(activePrice * 1.4).toLocaleString('en-IN')}</PriceText></span>
                    </>
                  )}
                </div>
                {!isCustom && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /><span>Tax Included • Free Shipping</span>
                  </div>
                )}
                {isCustom && (
                  <p className="text-[11px] sm:text-sm text-blue font-accent font-bold mb-4 sm:mb-6 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Chat with us on WhatsApp for a custom quote
                  </p>
                )}
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} className="flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white font-accent font-bold rounded-xl shadow-lg shadow-primary/20 cursor-pointer border border-primary/20">
                      <ShoppingCart className="w-5 h-5 opacity-80" /><span>{addedToCart ? 'Added!' : 'Add to Cart'}</span>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBuyNow} className="flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue to-blue-bright hover:from-blue-bright hover:to-blue text-white font-accent font-bold rounded-xl shadow-lg shadow-blue/20 cursor-pointer border border-blue/20">
                      <span>Buy Now</span>
                    </motion.button>
                  </div>
                  <button onClick={handleContactSuresh} className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-medium rounded-xl transition-colors duration-200 cursor-pointer">
                    <MessageSquare className="w-4 h-4" /><span className="text-sm">Enquire on WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Clinical Posture Audit card */}
              <div className="mt-6 bg-neutral-light/80 p-6 md:p-8 rounded-[2rem] border border-brand-200/40 flex items-start gap-5 shadow-sm">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-brand-200/50 shadow-sm relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white animate-pulse"></div>
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary text-lg mb-2">Need a Clinical Posture Audit?</h4>
                  <p className="text-neutral-dark/70 text-sm leading-relaxed font-body mb-4">Connect directly with Suresh (founder). He analyzes mattress hardness, sleep postures, and medical back histories to recommend the ideal model.</p>
                  <button onClick={handleContactSuresh} className="inline-flex items-center gap-2 text-sm text-primary font-accent font-bold hover:text-blue transition-colors cursor-pointer group">Chat on WhatsApp <ArrowLeft className="w-4 h-4 rotate-135 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Components Section ─────────────────────────────────────────── */}
        <div className="mt-20 lg:mt-32 mb-10 border-t border-brand-200/40 pt-16 lg:pt-24">
          <h2 className="text-3xl md:text-4xl font-heading text-center text-primary mb-12 lg:mb-20">What Inside Counts: Premium Components</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white">
                <img src="/images/gots-cotton.png" alt="GOTS Certified Organic Cotton Fabric" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-primary mb-2">GOTS Organic Cotton Fabric</h3>
              <div className="inline-flex items-center gap-1 bg-success/15 border border-success/20 text-success text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4"><Check className="w-3.5 h-3.5" /> GOTS Certified</div>
              <p className="text-sm sm:text-base text-neutral-dark/70 font-body leading-relaxed max-w-sm">GOTS Certified Organic Cotton fabric is naturally breathable and anti allergic. It will help in avoiding sweat and moisture trapping next to the skin because of its natural properties.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white">
                <img src="/images/quilted-cotton.png" alt="Quilted Organic Cotton Layer" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-primary mb-2">Quilted Organic Cotton</h3>
              <div className="inline-flex items-center gap-1 bg-success/15 border border-success/20 text-success text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4"><Check className="w-3.5 h-3.5" /> 100% Organic</div>
              <p className="text-sm sm:text-base text-neutral-dark/70 font-body leading-relaxed max-w-sm">The 100% organic cotton layer used in our mattress has smooth feel. It has a cool surface that perfectly complements natural latex. When designing this mattress, we insisted on using only organic cotton as it is anti-allergic and good for skin. It is flexible and strong which makes it more durable.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white bg-neutral-light">
                <img src="/images/natural-latex.png" alt="100% Natural Dunlop Latex" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-primary mb-2">100% Natural Latex</h3>
              <div className="inline-flex items-center gap-1 bg-emerald-700/15 border border-emerald-700/20 text-emerald-700 text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4"><Leaf className="w-3.5 h-3.5" /> 100% Eco-Friendly</div>
              <p className="text-sm sm:text-base text-neutral-dark/70 font-body leading-relaxed max-w-sm">The main component of our mattress is 100% natural latex. We bring you the highest-quality latex that does not contain any synthetic material or fillers. It is made through the energy-efficient Dunlop process that provides best sleeping surface available in the market.</p>
            </div>
          </div>
        </div>

        {/* Comfort Meter */}
        <div className="mt-16 lg:mt-24 mb-10 border-t border-brand-200/40 pt-10">
          <img src="/images/comfort-meter.png" alt="RelaxPro Mattress Comfort Meter" className="w-full h-auto object-contain rounded-2xl shadow-sm" />
        </div>

        {/* Size Chart */}
        <div className="mt-16 lg:mt-24 mb-10 border-t border-brand-200/40 pt-10">
          <img src="/images/size-chart.png" alt="RelaxPro Mattress Size Chart" className="w-full h-auto object-contain rounded-2xl shadow-sm" />
        </div>
      </motion.div>
    </PageShell>
  );
}
