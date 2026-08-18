import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import PriceText from '../../components/ui/PriceText';
import ProductCarousel from '../../components/product/ProductCarousel';
import DecorativeBotanicals from '../../components/home/DecorativeBotanicals';
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
import OptionButton from '../../components/ui/OptionButton';
import PageShell from '../../components/layout/PageShell';
import ProductCompareInline from '../../components/product/ProductCompareInline';
import { Product, MattressSize, SizeCategory } from '../../types';
import { PRODUCTS } from '../../data/products';
import { STANDARD_SIZES, SIZE_CATEGORIES } from '../../types/sizes';
import { getProductBySlug, getAllProducts, getSiteSettings, imageUrl } from '../../lib/queries';
import { SITE_URL, toAbsoluteUrl } from '../../lib/site';

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
  const [sanityProduct, setSanityProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [staticImages, setStaticImages] = useState<any>(null);

  const hcRaw = PRODUCTS.find((p) => p.slug === slug);
  const hc = allProducts.find((p: any) => p.slug === slug) || hcRaw;

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug).then(setSanityProduct);
    getAllProducts().then(setAllProducts);
    getSiteSettings().then((s) => setStaticImages(s?.staticImages || null)).catch(() => {});
  }, [slug]);

  const product: Product | undefined = useMemo(() => {
    if (!hc) return undefined;
    const normalize = (p: any) => ({
      ...p,
      image: imageUrl(p.image) || (typeof p.image === 'string' ? p.image : ''),
      images: Array.isArray(p.images) ? p.images.map((img: any) => imageUrl(img) || (typeof img === 'string' ? img : '')) : [],
    });
    if (!sanityProduct) return normalize(hc);

    // When Sanity data exists but images are not uploaded to Sanity,
    // fall back to the hardcoded product data for string image paths.
    const fallbackImage = imageUrl(hcRaw?.image) || '/images/products/' + (slug || '') + '.webp';
    const fallbackImages = Array.isArray(hcRaw?.images)
      ? hcRaw.images.map((img: any) => imageUrl(img) || '')
      : [];

    return normalize({
      ...hc,
      name: sanityProduct.name || hc.name,
      tagline: sanityProduct.tagline || hc.tagline,
      subtitle: sanityProduct.subtitle || hc.subtitle,
      keyBenefit: sanityProduct.keyBenefit || sanityProduct.shortDescription || hc.keyBenefit,
      description: sanityProduct.description || sanityProduct.longDescription || hc.description,
      longDescription: sanityProduct.longDescription || sanityProduct.description || hc.description,
      category: sanityProduct.category || hc.category || undefined,
      badge: sanityProduct.badge || sanityProduct.badges?.[0] || hc.badge,
      comfortLevel: sanityProduct.comfortLevel || hc.comfortLevel,
      comfortRating: sanityProduct.comfortRating ?? hc.comfortRating,
      totalThickness: sanityProduct.totalThickness ?? hc.totalThickness,
      layers: sanityProduct.layers || hc.layers,
      specifications: sanityProduct.specifications || hc.specifications,
      fabricGsm: sanityProduct.fabricGsm ?? hc.fabricGsm,
      fabricType: sanityProduct.fabricType || hc.fabricType,
      certifications: sanityProduct.certifications || hc.certifications,
      accessories: sanityProduct.accessories || hc.accessories,
      pricingModel: sanityProduct.pricingModel || hc.pricingModel,
      pricing: sanityProduct.pricing || hc.pricing,
      features: sanityProduct.features || hc.features,
      image: imageUrl(sanityProduct.image) || imageUrl(hc.image) || fallbackImage,
      images: sanityProduct.images?.length
        ? sanityProduct.images.map((img: any) => imageUrl(img) || '')
        : Array.isArray(hc.images) && hc.images.length > 0
          ? hc.images.map((img: any) => imageUrl(img) || (typeof img === 'string' ? img : ''))
          : fallbackImages,
      tier: sanityProduct.tier || hc.tier,
      rating: sanityProduct.rating ?? (hc as any).rating,
      reviewCount: sanityProduct.reviewCount ?? (hc as any).reviewCount,
      metaTitle: sanityProduct.metaTitle || hc.metaTitle,
      metaDescription: sanityProduct.metaDescription || hc.metaDescription,
    });
  }, [hc, sanityProduct, hcRaw, slug]);

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
      url: `${SITE_URL}/mattresses/${slug}`,
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
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${SITE_URL}/mattresses/${product.slug}#product`,
        name: product.name,
        image: toAbsoluteUrl(product.image),
        description: product.longDescription || product.description || product.keyBenefit,
        ...(product.category?.name ? { category: product.category.name } : {}),
        brand: { '@type': 'Brand', name: 'RelaxPro' },
        offers: {
          '@type': 'Offer',
          url: `${SITE_URL}/mattresses/${product.slug}`,
          priceCurrency: 'INR',
          price: product.pricingModel === 'with_without_accessories'
            ? product.pricing.withoutAccessories?.[legacyKey] || 0
            : product.pricing.fabric300Gsm?.[legacyKey] || 0,
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/mattresses/${product.slug}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Catalog', item: `${SITE_URL}/catalog` },
          { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/mattresses/${product.slug}` },
        ],
      },
    ],
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
    window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919281424494'}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <PageShell title={product.metaTitle} description={product.metaDescription} ogImage={product.image} schema={productSchema}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 relative overflow-clip"
      >
        <DecorativeBotanicals density="light" />

        <button
          onClick={() => onNavigateBack()}
          className="inline-flex items-center gap-2 text-graphite-500 hover:text-ink-900 text-xs font-accent font-semibold mb-8 lg:mb-12 group cursor-pointer transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-sky-100 border border-brand-200/50 flex items-center justify-center group-hover:bg-white group-hover:border-brand-200 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-ink-900" />
          </div>
          Back to Collections
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column — Images + Specs + Architecture */}
          <div className="lg:col-span-7 space-y-10">
            <ProductCarousel images={[product.image, ...product.images]} alt={product.name} badge={product.badge} />

            <div className="bg-white p-3 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-brand-200/40 shadow-sm grid grid-cols-3 gap-2 sm:gap-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[7px] sm:text-[10px] font-mono text-graphite-400 uppercase tracking-widest block mb-1 sm:mb-2 truncate">Stiffness</span>
                <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full ${i < product.comfortRating ? 'bg-brand-600 shadow-sm' : 'bg-sky-100 border border-brand-200/50'}`} />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-heading font-bold text-ink-900 capitalize leading-tight">{product.comfortLevel} <span className="text-graphite-400 font-body font-normal text-[9px] sm:text-[14px]">({product.comfortRating}/5)</span></span>
              </div>
              <div className="border-x border-brand-200/30 flex flex-col items-center justify-center">
                <span className="text-[7px] sm:text-[10px] font-mono text-graphite-400 uppercase tracking-widest block mb-1">Depth Profile</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-ink-900 block leading-none sm:leading-tight">{product.totalThickness}"</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[7px] sm:text-[10px] font-mono text-graphite-400 uppercase tracking-widest block mb-1 sm:mb-2 truncate">Material</span>
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-brand-600" />
                </div>
                <span className="text-xs sm:text-sm font-heading font-bold text-ink-900 capitalize leading-tight truncate">
                  {product.specifications?.material || product.layers?.[0]?.material?.replace('_', ' ') || 'Natural Latex'}
                </span>
              </div>
            </div>

            <div className="bg-secondary p-4 sm:p-6 md:p-10 rounded-[1.5rem] sm:rounded-[2rem] border border-brand-200/40 shadow-sm">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-ink-900 mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center border border-brand-200/50 shadow-sm shrink-0"><BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" /></div>
                Internal Architecture
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {product.layers.map((layer, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-5 items-start p-3 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-brand-200/40 relative overflow-hidden group hover:border-brand-600/30 transition-colors">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 text-brand-600 font-heading font-bold flex items-center justify-center shrink-0 border border-brand-600/20 text-sm sm:text-lg group-hover:bg-brand-600 group-hover:text-white transition-colors">{layer.thickness}"</div>
                    <div className="flex-1 pt-0 sm:pt-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <h4 className="font-accent font-bold text-xs sm:text-[14px] text-ink-900 uppercase tracking-wide">{layer.material.replace('_', ' ')}</h4>
                        {layer.brand && <span className="font-mono text-[8px] sm:text-[10px] bg-sky-100 border border-brand-200/50 text-graphite-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-medium">{layer.brand}</span>}
                      </div>
                      <p className="text-[10px] sm:text-sm text-graphite-600 leading-relaxed font-body">{layer.description}</p>
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
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight text-ink-900 leading-tight">{product.name}</h1>

              {/* About This Product */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-200/40 shadow-sm">
                <h3 className="font-heading font-bold text-ink-900 text-base sm:text-lg mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
                  About This Product
                </h3>
                <ul className="text-graphite-600 text-sm leading-relaxed font-body space-y-2 list-disc list-inside">
                  {product.description?.split(/\.\s+/).filter(Boolean).map((s: string, i: number) => (
                    <li key={i}>{s}{s.endsWith('.') ? '' : '.'}</li>
                  ))}
                </ul>
                {product.longDescription && product.longDescription !== product.description && (
                  <p className="text-graphite-600 text-sm leading-relaxed font-body mt-4">{product.longDescription}</p>
                )}
              </div>

              {/* ─── SIZE SELECTION BLOCK ─────────────────────────────────── */}
              <div className="mt-6 sm:mt-10 bg-white p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-brand-200/40 shadow-sm space-y-6">
                <h3 className="font-heading font-bold text-ink-900 text-lg sm:text-xl flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
                    Select Size
                  </span>
                </h3>

                {/* Step 1 — Category selector */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {SIZE_CATEGORIES.map((cat) => (
                    <OptionButton
                      key={cat.value}
                      selected={sizeCategory === cat.value && !isCustom}
                      onClick={() => handleCategorySelect(cat.value)}
                      hint={cat.hint}
                    >
                      {cat.label}
                    </OptionButton>
                  ))}
                </div>

                {/* Step 2 — Standard size variants */}
                {sizeCategory && !isCustom && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-accent font-bold uppercase tracking-widest text-graphite-500">Available Sizes — {STANDARD_SIZES[sizeCategory].label}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {STANDARD_SIZES[sizeCategory].variants.map((variant, idx) => (
                        <OptionButton
                          key={variant.legacyKey}
                          selected={selectedVariantIdx === idx}
                          onClick={() => handleVariantSelect(idx)}
                          size="md"
                        >
                          {variant.label}
                        </OptionButton>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Size toggle + form */}
                <div className="border-t border-brand-200/40 pt-4 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={handleCustomToggle}
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isCustom ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200/80 bg-white'}`}
                    >
                      {isCustom && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                    </div>
                    <span className="text-[11px] sm:text-xs font-accent font-bold text-ink-900 uppercase tracking-wider">Need a Custom Size?</span>
                  </label>

                  {isCustom && (
                    <div className="space-y-3 pl-1">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-accent font-bold text-ink-900 uppercase tracking-wider mb-1.5">Length (inches)</label>
                          <input
                            type="number"
                            min={48}
                            max={96}
                            value={customL}
                            onChange={(e) => handleCustomLChange(e.target.value)}
                            placeholder={`e.g. 80`}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-200/50 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 bg-sky-100/50 focus:bg-white transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-accent font-bold text-ink-900 uppercase tracking-wider mb-1.5">Width (inches)</label>
                          <input
                            type="number"
                            min={24}
                            max={84}
                            value={customW}
                            onChange={(e) => handleCustomWChange(e.target.value)}
                            placeholder={`e.g. 70`}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-200/50 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 bg-sky-100/50 focus:bg-white transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-accent font-bold text-graphite-500 uppercase tracking-wider mb-1.5">Thickness / Height (optional)</label>
                        <input
                          type="number"
                          min={4}
                          max={14}
                          value={customH}
                          onChange={(e) => setCustomH(e.target.value)}
                          placeholder={`e.g. 8`}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-brand-200/50 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 bg-sky-100/50 focus:bg-white transition-all outline-none"
                        />
                      </div>
                      {customError && (
                        <p className="text-[10px] font-accent font-bold text-red-500 uppercase tracking-wider">{customError}</p>
                      )}
                      <p className="text-[10px] text-graphite-400 leading-relaxed">Length: 48"–96" · Width: 24"–84" · Price on request — chat with us for a custom quote.</p>
                    </div>
                  )}
                </div>

                {/* Selected size pill */}
                {selectedLabel && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-accent font-bold text-graphite-400 uppercase tracking-widest">Selected:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-600/20 text-[11px] sm:text-xs font-accent font-bold">{selectedLabel}</span>
                  </div>
                )}
              </div>
              {/* ─── END SIZE SELECTION BLOCK ─────────────────────────────── */}

              {/* Accessory Bundle */}
              {product.pricingModel === 'with_without_accessories' && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-brand-200/40 space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                    <h3 className="font-heading font-bold text-ink-900 text-lg sm:text-xl">Accessory Bundle</h3>
                    <span className="text-[9px] sm:text-[10px] font-accent text-success bg-success/10 border border-success/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-bold uppercase tracking-wider">Save ₹3,700</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }} onClick={() => setIncludeAccessories(true)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIncludeAccessories(true); } }} className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border cursor-pointer transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30 ${includeAccessories ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/20 shadow-lg shadow-brand-600/10' : 'border-brand-200/50 hover:border-brand-500 hover:bg-sky-100 hover:shadow-md hover:shadow-brand-600/5'}`}>
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${includeAccessories ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200/80 bg-white'}`}>{includeAccessories && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}</div>
                      <div>
                        <strong className="font-accent font-bold text-xs sm:text-[14px] text-ink-900 block">Include Premium Pack <span className="text-brand-600 text-[8px] sm:text-[10px] ml-1 uppercase tracking-widest block sm:inline">(Recommended)</span></strong>
                        <p className="text-[10px] sm:text-xs text-graphite-500 leading-relaxed mt-1 sm:mt-2 font-body">Adds 2 Ergonomic Premium Latex Pillows + 1 Elasticated Waterproof Mattress Protector. Delivered pre-compressed.</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }} onClick={() => setIncludeAccessories(false)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIncludeAccessories(false); } }} className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl border cursor-pointer transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30 ${!includeAccessories ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/20 shadow-lg shadow-brand-600/10' : 'border-brand-200/50 hover:border-brand-500 hover:bg-sky-100 hover:shadow-md hover:shadow-brand-600/5'}`}>
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${!includeAccessories ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200/80 bg-white'}`}>{!includeAccessories && <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}</div>
                      <div>
                        <strong className="font-accent font-bold text-xs sm:text-[14px] text-ink-900 block">Mattress Only</strong>
                        <p className="text-[10px] sm:text-xs text-graphite-500 leading-relaxed mt-1 sm:mt-2 font-body">Deduct accessories. Delivered packaged flat.</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Fabric options */}
              {product.pricingModel === 'fabric_options' && (
                <div className="mt-8 pt-8 border-t border-brand-200/40 space-y-4">
                  <h3 className="font-heading font-bold text-ink-900 text-xl mb-4">Outer Fabric Options</h3>
                  <motion.div whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }} onClick={() => setSelectedFabric('300GSM')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedFabric('300GSM'); } }} className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30 ${selectedFabric === '300GSM' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/20 shadow-lg shadow-brand-600/10' : 'border-brand-200/50 hover:border-brand-500 hover:bg-sky-100 hover:shadow-md hover:shadow-brand-600/5'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedFabric === '300GSM' ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200/80 bg-white'}`}>{selectedFabric === '300GSM' && <Check className="w-3.5 h-3.5" />}</div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-ink-900 block">300 GSM Premium Micro-Knit</strong>
                        <p className="text-xs text-graphite-500 leading-relaxed mt-2 font-body">Standard luxury cover, lightweight, hyper breathable. Holds Oeko-Tex certification.</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }} onClick={() => setSelectedFabric('450GSM')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedFabric('450GSM'); } }} className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30 ${selectedFabric === '450GSM' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/20 shadow-lg shadow-brand-600/10' : 'border-brand-200/50 hover:border-brand-500 hover:bg-sky-100 hover:shadow-md hover:shadow-brand-600/5'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selectedFabric === '450GSM' ? 'border-brand-600 bg-brand-600 text-white' : 'border-brand-200/80 bg-white'}`}>{selectedFabric === '450GSM' && <Check className="w-3.5 h-3.5" />}</div>
                      <div>
                        <strong className="font-accent font-bold text-[14px] text-ink-900 block">450 GSM Luxurious Quilted Bamboo</strong>
                        <p className="text-xs text-graphite-500 leading-relaxed mt-2 font-body">Upgraded luxurious thickness with stitched cloud padding. Bamboo fibers maintain high-end coolness natively.</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Price + Add to Cart */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white border border-graphite-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] font-sans">
                <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-graphite-500 uppercase mb-1.5 sm:mb-2">
                  {isCustom ? 'Custom Size — Price on Request' : 'Direct-to-Consumer Value'}
                </p>
                <div className="flex items-baseline gap-2 sm:gap-3 mb-1">
                  {isCustom ? (
                    <span className="text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">₹ —</span>
                  ) : (
                    <>
                      <span className="text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight"><PriceText>₹{activePrice.toLocaleString('en-IN')}</PriceText></span>
                      <span className="text-base sm:text-lg text-graphite-400 line-through"><PriceText>₹{Math.round(activePrice * 1.4).toLocaleString('en-IN')}</PriceText></span>
                    </>
                  )}
                </div>
                {!isCustom && (
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-graphite-600 mb-4 sm:mb-6">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /><span>Tax Included • Free Shipping</span>
                  </div>
                )}
                {isCustom && (
                  <p className="text-[11px] sm:text-sm text-brand-600 font-accent font-bold mb-4 sm:mb-6 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Chat with us on WhatsApp for a custom quote
                  </p>
                )}
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} className="flex items-center justify-center gap-2 py-3.5 px-4 bg-ink-900 text-white font-accent font-bold rounded-xl shadow-lg shadow-ink-900/20 cursor-pointer border border-ink-900/20">
                      <ShoppingCart className="w-5 h-5 opacity-80" /><span>{addedToCart ? 'Added!' : 'Add to Cart'}</span>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBuyNow} className="flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue to-blue-bright hover:from-blue-bright hover:to-blue text-white font-accent font-bold rounded-xl shadow-lg shadow-brand-600/20 cursor-pointer border border-brand-600/20">
                      <span>Buy Now</span>
                    </motion.button>
                  </div>
                  <button onClick={handleContactSuresh} className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-eco-500/20 text-eco-600 hover:bg-eco-50 font-medium rounded-xl transition-colors duration-200 cursor-pointer">
                    <MessageSquare className="w-4 h-4" /><span className="text-sm">Enquire on WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Clinical Posture Audit card */}
              <div className="mt-6 bg-sky-100/80 p-6 md:p-8 rounded-[2rem] border border-brand-200/40 flex items-start gap-5 shadow-sm">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-brand-200/50 shadow-sm relative">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white animate-pulse"></div>
                  <MessageSquare className="w-6 h-6 text-ink-900" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-ink-900 text-lg mb-2">Need a Clinical Posture Audit?</h4>
                  <p className="text-graphite-600 text-sm leading-relaxed font-body mb-4">Connect directly with Suresh (founder). He analyzes mattress hardness, sleep postures, and medical back histories to recommend the ideal model.</p>
                  <button onClick={handleContactSuresh} className="inline-flex items-center gap-2 text-sm text-ink-900 font-accent font-bold hover:text-brand-600 transition-colors cursor-pointer group">Chat on WhatsApp <ArrowLeft className="w-4 h-4 rotate-135 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Components Section ─────────────────────────────────────────── */}
        <div className="mt-20 lg:mt-32 mb-10 border-t border-brand-200/40 pt-16 lg:pt-24">
          <h2 className="text-3xl md:text-4xl font-heading text-center text-ink-900 mb-12 lg:mb-20">What Inside Counts: Premium Components</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white">
                <img src={imageUrl(staticImages?.gotsCotton) || '/images/gots-cotton.webp'} alt="GOTS Certified Organic Cotton Fabric" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-2">GOTS Organic Cotton Fabric</h3>
              <div className="inline-flex items-center gap-1 bg-success/15 border border-success/20 text-success text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4"><Check className="w-3.5 h-3.5" /> GOTS Certified</div>
              <p className="text-sm sm:text-base text-graphite-600 font-body leading-relaxed max-w-sm">GOTS Certified Organic Cotton fabric is naturally breathable and anti allergic. It will help in avoiding sweat and moisture trapping next to the skin because of its natural properties.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white">
                <img src={imageUrl(staticImages?.quiltedCotton) || '/images/quilted-cotton.webp'} alt="Quilted Organic Cotton Layer" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-2">Quilted Organic Cotton</h3>
              <div className="inline-flex items-center gap-1 bg-success/15 border border-success/20 text-success text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4"><Check className="w-3.5 h-3.5" /> 100% Organic</div>
              <p className="text-sm sm:text-base text-graphite-600 font-body leading-relaxed max-w-sm">The 100% organic cotton layer used in our mattress has smooth feel. It has a cool surface that perfectly complements natural latex. When designing this mattress, we insisted on using only organic cotton as it is anti-allergic and good for skin. It is flexible and strong which makes it more durable.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden mb-6 sm:mb-8 shadow-xl ring-4 ring-white bg-sky-100">
                <img src={imageUrl(staticImages?.naturalLatex) || '/images/natural-latex.webp'} alt="100% Natural Dunlop Latex" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-2">100% Natural Latex</h3>
              <div className="inline-flex items-center gap-1 bg-eco-600/15 border border-eco-600/20 text-eco-600 text-[11px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4"><Leaf className="w-3.5 h-3.5" /> 100% Eco-Friendly</div>
              <p className="text-sm sm:text-base text-graphite-600 font-body leading-relaxed max-w-sm">The main component of our mattress is 100% natural latex. We bring you the highest-quality latex that does not contain any synthetic material or fillers. It is made through the energy-efficient Dunlop process that provides best sleeping surface available in the market.</p>
            </div>
          </div>
        </div>

        {/* Certification Feature Images */}
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl overflow-hidden border border-brand-200/40 shadow-sm">
            <img src="/images/organic-cotton-quilting-fabric-latex-mattress-desktop-new.jpeg" alt="Organic Cotton Quilting" className="w-full h-auto object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-brand-200/40 shadow-sm">
            <img src="/images/technical-specifications.webp" alt="Technical Specifications" className="w-full h-auto object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-brand-200/40 shadow-sm">
            <img src="/images/vilasa-benefits.png" alt="Vilasa Benefits" className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Comfort Meter */}
        <div className="mt-16 lg:mt-24 mb-10 border-t border-brand-200/40 pt-10">
          <img src={imageUrl(staticImages?.comfortMeter) || '/images/comfort-meter.webp'} alt="RelaxPro Mattress Comfort Meter" className="w-full h-auto object-contain rounded-2xl shadow-sm" />
        </div>

        {/* Size Chart */}
        <div className="mt-16 lg:mt-24 mb-10 border-t border-brand-200/40 pt-10">
          <img src={imageUrl(staticImages?.sizeChart) || '/images/size-chart.webp'} alt="RelaxPro Mattress Size Chart" className="w-full h-auto object-contain rounded-2xl shadow-sm" />
        </div>

        {/* Inline Product Comparison Table */}
        <ProductCompareInline currentProduct={product} allProducts={allProducts} />
      </motion.div>
    </PageShell>
  );
}
