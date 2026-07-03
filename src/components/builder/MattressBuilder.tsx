import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PriceText from '../ui/PriceText';
import {
  Ruler, Layers, Sparkles, Check, MessageSquare, Shirt, Bed,
  ChevronDown, Shield, Truck, Gift, ShoppingCart
} from 'lucide-react';
import { MattressSize, CartItem } from '../../types';

interface LayerOption {
  id: string;
  name: string;
  type: 'base' | 'transition' | 'top';
  material: 'rebonded_foam' | 'latex_rebonded' | 'hr_softy_foam' | 'latex' | 'hr_foam';
  thickness: number;
  priceFactor: { king: number; queen: number; double: number; single: number; };
  colorClass: string;
  description: string;
}

const STEPS_CONFIG = [
  { key: 'size', label: 'Mattress Size', icon: Bed, desc: 'Choose your size' },
  { key: 'base', label: 'Foundation', icon: Layers, desc: 'Support core' },
  { key: 'transition', label: 'Transition', icon: Layers, desc: 'Pressure relief' },
  { key: 'topper', label: 'Comfort Topper', icon: Layers, desc: 'Surface feel' },
  { key: 'cover', label: 'Outer Cover', icon: Shirt, desc: 'Finish & fabric' },
  { key: 'accessories', label: 'Accessories', icon: Gift, desc: 'Complete the set' },
] as const;

type StepKey = typeof STEPS_CONFIG[number]['key'];

const BASE_LAYERS: LayerOption[] = [
  {
    id: 'b1', name: 'Century 95-Density', type: 'base',
    material: 'rebonded_foam', thickness: 4,
    priceFactor: { king: 12000, queen: 10000, double: 8000, single: 6000 },
    colorClass: 'bg-zinc-800',
    description: 'Ultra-firm orthopedic foundation. Maximum support and durability.'
  },
  {
    id: 'b2', name: 'Eco-Dense Latex', type: 'base',
    material: 'latex_rebonded', thickness: 4,
    priceFactor: { king: 16000, queen: 13500, double: 11000, single: 8500 },
    colorClass: 'bg-blue-900',
    description: 'Premium bonded latex shreds. Zero synthetic foam, higher elasticity.'
  }
];

const TRANSITION_LAYERS: LayerOption[] = [
  {
    id: 't-none', name: 'None (Direct Support)', type: 'transition',
    material: 'hr_foam', thickness: 0,
    priceFactor: { king: 0, queen: 0, double: 0, single: 0 },
    colorClass: '', description: 'Firmer feel — top cover sits directly on the support block.'
  },
  {
    id: 't1', name: '2" Century HR AirFlow', type: 'transition',
    material: 'hr_softy_foam', thickness: 2,
    priceFactor: { king: 5000, queen: 4000, double: 3200, single: 2400 },
    colorClass: 'bg-amber-100',
    description: 'Highly resilient cushioning that relieves pressure from the base layer.'
  },
  {
    id: 't2', name: '2" Natural Kerala Latex', type: 'transition',
    material: 'latex', thickness: 2,
    priceFactor: { king: 10000, queen: 8500, double: 6800, single: 5000 },
    colorClass: 'bg-sky-100',
    description: 'Pure elastic response for active springiness and motion isolation.'
  }
];

const COMFORT_TOPPER_LAYERS: LayerOption[] = [
  {
    id: 'top-none', name: 'None (Firmer Feel)', type: 'top',
    material: 'hr_foam', thickness: 0,
    priceFactor: { king: 0, queen: 0, double: 0, single: 0 },
    colorClass: '', description: 'Minimalist low-profile sleep surface.'
  },
  {
    id: 'top1', name: '2" Pure GOLS', type: 'top',
    material: 'latex', thickness: 2,
    priceFactor: { king: 11000, queen: 9000, double: 7200, single: 5500 },
    colorClass: 'bg-yellow-50',
    description: 'Perfect natural cradling. Soft-medium comfort for pain-free sleep.'
  },
  {
    id: 'top2', name: '4" 7-Zone Therapeutic', type: 'top',
    material: 'latex', thickness: 4,
    priceFactor: { king: 21000, queen: 18000, double: 14500, single: 11000 },
    colorClass: 'bg-indigo-50',
    description: 'Seven segmented density zones for head-to-hip pressure distribution.'
  }
];

const FABRICS = [
  {
    id: 'f1', name: '300 GSM Premium Knit',
    price: { king: 2500, queen: 2000, double: 1600, single: 1200 },
    description: 'Soft breathable stretch weave with quilted backing.',
    badge: 'Standard'
  },
  {
    id: 'f2', name: '450 GSM Organic Bamboo',
    price: { king: 4500, queen: 3800, double: 3000, single: 2200 },
    description: 'Ultra-plush premium cover. Natural cooling with heavy quilted clouds.',
    badge: 'Premium'
  }
];

interface MattressBuilderProps {
  onAddToCart: (item: CartItem) => void;
  onNavigate: (page: string) => void;
}

function LayerCircle({ className }: { className?: string }) {
  return <span className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ring-1 ring-white/30 shadow-sm ${className || 'bg-gray-300'}`} />;
}

const ACCORDION_VARIANTS = {
  open: { height: 'auto', opacity: 1 },
  closed: { height: 0, opacity: 0 },
};

export default function MattressBuilder({ onAddToCart, onNavigate }: MattressBuilderProps) {
  const [size, setSize] = useState<MattressSize>('king');
  const [selectedBase, setSelectedBase] = useState<LayerOption>(BASE_LAYERS[0]);
  const [selectedTransition, setSelectedTransition] = useState<LayerOption>(TRANSITION_LAYERS[1]);
  const [selectedTop, setSelectedTop] = useState<LayerOption>(COMFORT_TOPPER_LAYERS[1]);
  const [selectedFabric, setSelectedFabric] = useState(FABRICS[1]);
  const [includeAccessories, setIncludeAccessories] = useState<boolean>(true);
  const [openStep, setOpenStep] = useState<StepKey>('size');

  const toggleStep = (key: StepKey) => {
    setOpenStep(prev => prev === key ? prev : key);
  };

  const SIZE_LABELS = {
    king: 'King Size',
    queen: 'Queen Size',
    double: 'Double Size',
    single: 'Single Size'
  };

  const SIZE_DIMS: Record<MattressSize, string> = {
    king: '72" × 78"',
    queen: '60" × 78"',
    double: '48" × 75"',
    single: '36" × 75"'
  };

  const accessoryPrice = { king: 5000, queen: 4000, double: 3000, single: 2500 };

  const priceBreakdown = useMemo(() => {
    const base = selectedBase.priceFactor[size];
    const trans = selectedTransition.priceFactor[size];
    const top = selectedTop.priceFactor[size];
    const fabric = selectedFabric.price[size];
    const acc = includeAccessories ? accessoryPrice[size] : 0;
    return { base, trans, top, fabric, acc, total: base + trans + top + fabric + acc };
  }, [size, selectedBase, selectedTransition, selectedTop, selectedFabric, includeAccessories]);

  const totalThickness = selectedBase.thickness + selectedTransition.thickness + selectedTop.thickness;

  const [addedToCart, setAddedToCart] = useState(false);

  const buildCartItem = (): CartItem => {
    const layers = [
      selectedBase.name,
      ...(selectedTransition.thickness > 0 ? [selectedTransition.name] : []),
      ...(selectedTop.thickness > 0 ? [selectedTop.name] : [])
    ];
    return {
      id: `custom-${Date.now()}`,
      slug: 'custom-build',
      name: `Custom ${size} Mattress (${layers.join(' + ')})`,
      size,
      price: priceBreakdown.total,
      quantity: 1,
      includeAccessories,
      fabricOption: selectedFabric.name,
      image: 'https://images.unsplash.com/photo-1631549916768-4119b812b1f0?w=800&q=80',
      type: 'custom',
      customLayers: [
        { material: selectedBase.name, thickness: selectedBase.thickness },
        ...(selectedTransition.thickness > 0 ? [{ material: selectedTransition.name, thickness: selectedTransition.thickness }] : []),
        ...(selectedTop.thickness > 0 ? [{ material: selectedTop.name, thickness: selectedTop.thickness }] : []),
      ]
    };
  };

  const handleAddToCart = () => {
    onAddToCart(buildCartItem());
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleBuyNow = () => {
    onAddToCart(buildCartItem());
    onNavigate('cart');
  };

  const handleWhatsAppEnquire = () => {
    const layers = [
      selectedBase.name,
      ...(selectedTransition.thickness > 0 ? [selectedTransition.name] : []),
      ...(selectedTop.thickness > 0 ? [selectedTop.name] : [])
    ];
    const msg = `Hello Suresh, I designed a custom RelaxPro mattress on the website. Configuration: ${layers.join(' + ')}, Size: ${size}, Fabric: ${selectedFabric.name}, Total: \u20B9${priceBreakdown.total.toLocaleString('en-IN')}. Please guide me on this configuration.`;
    window.open(`https://wa.me/918686624494?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const activeLayers = [
    ...(selectedTop.thickness > 0 ? [{ option: selectedTop, label: 'Comfort Topper' }] : []),
    ...(selectedTransition.thickness > 0 ? [{ option: selectedTransition, label: 'Transition' }] : []),
    { option: selectedBase, label: 'Foundation Base' },
  ];

  const getSelectionSummary = (key: StepKey): string => {
    switch (key) {
      case 'size': return `${size} — ${SIZE_DIMS[size]}`;
      case 'base': return selectedBase.name;
      case 'transition': return selectedTransition.name;
      case 'topper': return selectedTop.name;
      case 'cover': return selectedFabric.name;
      case 'accessories': return includeAccessories ? 'Bundle included' : 'Skip';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] font-semibold text-accent uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Direct From Kerala Factory
        </span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-primary leading-tight">
          Build Your Mattress
        </h1>
        <p className="text-neutral-dark/80 mt-3 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
          Choose every layer — from base to cover — and see your custom mattress take shape in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* ========== LEFT COLUMN — Visualizer ========== */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 order-1">
          <div className="bg-white rounded-3xl border border-gray-100/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] overflow-hidden">
            
            {/* Artboard */}
            <div className="p-6 md:p-7">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-base text-primary tracking-tight">Your Build</h3>
                  <p className="text-[11px] text-neutral-dark/60 mt-0.5">Live layer preview</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-white bg-primary/80 px-2.5 py-1 rounded-full tracking-wide">
                    {totalThickness}" Profile
                  </span>
                </div>
              </div>

              {/* Layer Stack */}
              <div className="relative bg-[#0F1A2E] rounded-2xl p-5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                <div className="relative flex flex-col items-center gap-1.5 min-h-[240px] justify-end">
                  
                  {/* Fabric wrapper outline */}
                  <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
                  <div className="absolute -inset-1 rounded-[18px] border border-white/5 pointer-events-none" />

                  <AnimatePresence mode="popLayout">
                    {activeLayers.map((layer, idx) => {
                      const isTop = idx === activeLayers.length - 1;
                      const h = Math.max(48, layer.option.thickness * 16 + 24);
                      return (
                        <motion.div
                          key={layer.option.id}
                          layout
                          initial={{ opacity: 0, scaleY: 0.3, y: 12 }}
                          animate={{ opacity: 1, scaleY: 1, y: 0 }}
                          exit={{ opacity: 0, scaleY: 0.3, y: -12 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          style={{ height: h }}
                          className={`relative w-full rounded-xl flex flex-col items-center justify-center overflow-hidden ${layer.option.colorClass || 'bg-gray-700'}`}
                        >
                          <div className={`absolute inset-0 ${isTop ? 'bg-gradient-to-b from-white/10 to-black/20' : 'bg-gradient-to-b from-white/5 to-black/10'}`} />
                          <span className={`text-xs font-bold relative z-10 ${isTop ? 'text-white' : idx === activeLayers.length - 2 && !layer.option.colorClass.includes('bg-') ? 'text-gray-300' : 'text-gray-800'}`}>
                            {layer.option.name}
                          </span>
                          <span className={`text-[10px] font-medium relative z-10 mt-0.5 ${isTop ? 'text-white/60' : 'text-gray-400'}`}>
                            {layer.option.thickness}"
                          </span>
                          {/* Side label */}
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[8px] font-medium text-white/30 uppercase tracking-wider [writing-mode:vertical-lr]">
                            {layer.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* Fabric indicator */}
                  <motion.div
                    key={selectedFabric.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[8px] font-bold text-white/70 uppercase tracking-widest whitespace-nowrap"
                  >
                    {selectedFabric.name}
                  </motion.div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-neutral-dark/70 py-1">
                  <span>Foundation</span>
                  <span className="font-semibold text-primary"><PriceText>₹{priceBreakdown.base.toLocaleString('en-IN')}</PriceText></span>
                </div>
                {selectedTransition.thickness > 0 && (
                  <div className="flex items-center justify-between text-xs text-neutral-dark/70 py-1">
                    <span>Transition</span>
                    <span className="font-semibold text-primary"><PriceText>₹{priceBreakdown.trans.toLocaleString('en-IN')}</PriceText></span>
                  </div>
                )}
                {selectedTop.thickness > 0 && (
                  <div className="flex items-center justify-between text-xs text-neutral-dark/70 py-1">
                    <span>Comfort Topper</span>
                    <span className="font-semibold text-primary"><PriceText>₹{priceBreakdown.top.toLocaleString('en-IN')}</PriceText></span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-neutral-dark/70 py-1">
                  <span>Cover</span>
                  <span className="font-semibold text-primary"><PriceText>₹{priceBreakdown.fabric.toLocaleString('en-IN')}</PriceText></span>
                </div>
                {includeAccessories && (
                  <div className="flex items-center justify-between text-xs text-neutral-dark/70 py-1">
+                   <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> Accessories</span>
                    <span className="font-semibold text-primary"><PriceText>₹{priceBreakdown.acc.toLocaleString('en-IN')}</PriceText></span>
                  </div>
                )}
              </div>

              {/* Total + CTA */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <span className="text-[10px] font-semibold text-neutral-dark/60 uppercase tracking-wider">Total</span>
                    <div className="text-3xl font-bold text-primary tracking-tight mt-0.5">
                      <PriceText>₹{priceBreakdown.total.toLocaleString('en-IN')}</PriceText>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-neutral-dark/50 block capitalize">{size}</span>
                    <span className="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-0.5">
                      <Truck className="w-3 h-3" /> Free Delivery
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 bg-blue-50/50 rounded-xl px-4 py-2.5 border border-blue-100/50">
                  <Shield className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-[11px] text-blue-900/70 leading-relaxed">10-year warranty • 100-night trial • Certified materials</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      onClick={handleAddToCart}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-primary hover:bg-neutral-dark text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{addedToCart ? 'Added!' : 'Add to Cart'}</span>
                    </motion.button>
                    <motion.button
                      onClick={handleBuyNow}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-accent hover:bg-[#2569A0] text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Buy Now</span>
                    </motion.button>
                  </div>
                  <button
                    onClick={handleWhatsAppEnquire}
                    className="w-full py-3 px-4 rounded-xl border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Enquire on WhatsApp — ₹{priceBreakdown.total.toLocaleString('en-IN')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== RIGHT COLUMN — Configurator ========== */}
        <div className="lg:col-span-7 order-2 space-y-3">

          {STEPS_CONFIG.map((step, idx) => {
            const isOpen = openStep === step.key;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden">
                
                {/* Step Header */}
                <button
                  onClick={() => toggleStep(step.key)}
                  className="w-full flex items-center gap-4 p-4 md:p-5 text-left cursor-pointer transition-colors hover:bg-gray-50/50"
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold transition-colors ${
                    isOpen ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <StepIcon className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-accent' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <span className={`font-bold text-sm block transition-colors ${isOpen ? 'text-primary' : 'text-gray-600'}`}>
                      {step.label}
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {isOpen ? step.desc : getSelectionSummary(step.key)}
                    </span>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                    isOpen ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isOpen ? 'Open' : 'Edit'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Step Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-5 pb-5 md:pb-6 pt-1 border-t border-gray-50">

                        {/* Step 1: Mattress Size */}
                        {step.key === 'size' && (
                          <div>
                            <p className="text-xs text-neutral-dark/60 mb-4">Standard Indian bed dimensions.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {(Object.keys(SIZE_LABELS) as MattressSize[]).map((sz) => {
                                const isActive = size === sz;
                                return (
                                  <motion.button
                                    key={sz}
                                    onClick={() => setSize(sz)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`relative p-4 rounded-xl text-center border-2 transition-all duration-200 cursor-pointer ${
                                      isActive
                                        ? 'border-accent bg-accent/5 shadow-[0_0_0_1px_rgba(49,127,186,0.15)]'
                                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className={`text-center ${isActive ? 'text-accent' : 'text-primary'}`}>
                                      <Bed className="w-5 h-5 mx-auto mb-1.5" />
                                      <span className="font-bold text-sm capitalize block">{sz}</span>
                                    </div>
                                    <span className={`text-[10px] font-medium mt-1 block ${isActive ? 'text-accent/70' : 'text-gray-400'}`}>
                                      {SIZE_DIMS[sz]}
                                    </span>
                                    {isActive && (
                                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center shadow-sm">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Step 2: Foundation Base */}
                        {step.key === 'base' && (
                          <div>
                            <p className="text-xs text-neutral-dark/60 mb-4">The backbone of your mattress.</p>
                            <div className="space-y-2.5">
                              {BASE_LAYERS.map((base) => {
                                const isActive = selectedBase.id === base.id;
                                return (
                                  <motion.button
                                    key={base.id}
                                    onClick={() => setSelectedBase(base)}
                                    whileHover={{ scale: 1.005 }}
                                    whileTap={{ scale: 0.995 }}
                                    className={`relative w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                                      isActive
                                        ? 'border-accent bg-accent/5 shadow-[0_0_0_1px_rgba(49,127,186,0.12)]'
                                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-3 min-w-0">
                                        <LayerCircle className={base.colorClass} />
                                        <div className="min-w-0">
                                          <h4 className="font-bold text-sm text-primary">{base.name}</h4>
                                          <p className={`text-xs mt-0.5 leading-relaxed ${isActive ? 'text-accent/70' : 'text-neutral-dark/70'}`}>
                                            {base.description}
                                          </p>
                                        </div>
                                      </div>
                                      <div className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border ${
                                        isActive ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-gray-50 border-gray-100 text-primary'
                                      }`}>
                                        ₹{base.priceFactor[size].toLocaleString('en-IN')}
                                      </div>
                                    </div>
                                    {isActive && (
                                      <div className="absolute top-3 right-3">
                                        <Check className="w-4 h-4 text-accent" />
                                      </div>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Step 3: Transition Layer */}
                        {step.key === 'transition' && (
                          <div>
                            <p className="text-xs text-neutral-dark/60 mb-4">Acts as a damper to prevent pressure points.</p>
                            <div className="space-y-2.5">
                              {TRANSITION_LAYERS.map((trans) => {
                                const isActive = selectedTransition.id === trans.id;
                                return (
                                  <motion.button
                                    key={trans.id}
                                    onClick={() => setSelectedTransition(trans)}
                                    whileHover={{ scale: 1.005 }}
                                    whileTap={{ scale: 0.995 }}
                                    className={`relative w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                                      isActive
                                        ? 'border-accent bg-accent/5 shadow-[0_0_0_1px_rgba(49,127,186,0.12)]'
                                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-3 min-w-0">
                                        {trans.thickness > 0 ? (
                                          <LayerCircle className={trans.colorClass} />
                                        ) : (
                                          <div className="w-3.5 h-3.5 mt-0.5 shrink-0 rounded-full border-2 border-dashed border-gray-300" />
                                        )}
                                        <div className="min-w-0">
                                          <h4 className="font-bold text-sm text-primary">
                                            {trans.name}
                                            {trans.thickness > 0 && <span className="text-[10px] font-semibold text-gray-400 ml-1.5">({trans.thickness}")</span>}
                                          </h4>
                                          <p className={`text-xs mt-0.5 leading-relaxed ${isActive ? 'text-accent/70' : 'text-neutral-dark/70'}`}>
                                            {trans.description}
                                          </p>
                                        </div>
                                      </div>
                                      <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border ${
                                        isActive ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-gray-50 border-gray-100 text-primary'
                                      }`}>
                                        {trans.priceFactor[size] === 0 ? 'Included' : `+ ₹${trans.priceFactor[size].toLocaleString('en-IN')}`}
                                      </span>
                                    </div>
                                    {isActive && (
                                      <div className="absolute top-3 right-3">
                                        <Check className="w-4 h-4 text-accent" />
                                      </div>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Step 4: Comfort Topper */}
                        {step.key === 'topper' && (
                          <div>
                            <p className="text-xs text-neutral-dark/60 mb-4">100% natural latex for ultimate surface comfort.</p>
                            <div className="space-y-2.5">
                              {COMFORT_TOPPER_LAYERS.map((top) => {
                                const isActive = selectedTop.id === top.id;
                                return (
                                  <motion.button
                                    key={top.id}
                                    onClick={() => setSelectedTop(top)}
                                    whileHover={{ scale: 1.005 }}
                                    whileTap={{ scale: 0.995 }}
                                    className={`relative w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                                      isActive
                                        ? 'border-accent bg-accent/5 shadow-[0_0_0_1px_rgba(49,127,186,0.12)]'
                                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-3 min-w-0">
                                        {top.thickness > 0 ? (
                                          <LayerCircle className={top.colorClass} />
                                        ) : (
                                          <div className="w-3.5 h-3.5 mt-0.5 shrink-0 rounded-full border-2 border-dashed border-gray-300" />
                                        )}
                                        <div className="min-w-0">
                                          <h4 className="font-bold text-sm text-primary">
                                            {top.name}
                                            {top.thickness > 0 && <span className="text-[10px] font-semibold text-gray-400 ml-1.5">({top.thickness}")</span>}
                                          </h4>
                                          <p className={`text-xs mt-0.5 leading-relaxed ${isActive ? 'text-accent/70' : 'text-neutral-dark/70'}`}>
                                            {top.description}
                                          </p>
                                        </div>
                                      </div>
                                      <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border ${
                                        isActive ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-gray-50 border-gray-100 text-primary'
                                      }`}>
                                        {top.priceFactor[size] === 0 ? 'Included' : <PriceText>{`+ ₹${top.priceFactor[size].toLocaleString('en-IN')}`}</PriceText>}
                                      </span>
                                    </div>
                                    {isActive && (
                                      <div className="absolute top-3 right-3">
                                        <Check className="w-4 h-4 text-accent" />
                                      </div>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Step 5: Outer Cover */}
                        {step.key === 'cover' && (
                          <div>
                            <p className="text-xs text-neutral-dark/60 mb-4">The direct touch point of your rest.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {FABRICS.map((fabric) => {
                                const isActive = selectedFabric.id === fabric.id;
                                return (
                                  <motion.button
                                    key={fabric.id}
                                    onClick={() => setSelectedFabric(fabric)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                                      isActive
                                        ? 'border-accent bg-accent/5 shadow-[0_0_0_1px_rgba(49,127,186,0.12)]'
                                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                                    }`}
                                  >
                                    <div className="flex items-start gap-1 mb-3">
                                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${
                                        isActive ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-500'
                                      }`}>
                                        {fabric.badge}
                                      </span>
                                    </div>
                                    <div className="mb-3">
                                      <h4 className="font-bold text-sm text-primary mb-0.5">{fabric.name}</h4>
                                      <p className={`text-xs leading-relaxed ${isActive ? 'text-accent/70' : 'text-neutral-dark/70'}`}>
                                        {fabric.description}
                                      </p>
                                    </div>
                                    <div className={`inline-block text-xs font-bold px-3 py-1.5 rounded-lg border ${
                                      isActive ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-gray-50 border-gray-100 text-primary'
                                    }`}>
                                      <PriceText>+ ₹{fabric.price[size].toLocaleString('en-IN')}</PriceText>
                                    </div>
                                    {isActive && (
                                      <div className="absolute top-3 right-3">
                                        <Check className="w-4 h-4 text-accent" />
                                      </div>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Step 6: Accessories */}
                        {step.key === 'accessories' && (
                          <div>
                            <p className="text-xs text-neutral-dark/60 mb-4">Complete your sleep system.</p>
                            <motion.button
                              onClick={() => setIncludeAccessories(!includeAccessories)}
                              whileHover={{ scale: 1.005 }}
                              whileTap={{ scale: 0.995 }}
                              className={`relative w-full p-4 md:p-5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                                includeAccessories
                                  ? 'border-accent bg-accent/5 shadow-[0_0_0_1px_rgba(49,127,186,0.12)]'
                                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 min-w-0 pr-5">
                                  <div className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border-2 transition-colors ${
                                    includeAccessories ? 'bg-accent border-accent' : 'border-gray-300 bg-white'
                                  }`}>
                                    {includeAccessories && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-bold text-sm text-primary">Premium Bundle Pack</h4>
                                    <p className={`text-xs mt-0.5 leading-relaxed ${includeAccessories ? 'text-accent/70' : 'text-neutral-dark/70'}`}>
                                      2 luxury latex pillows &amp; 1 premium waterproof mattress protector.
                                    </p>
                                  </div>
                                </div>
                                <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border ${
                                  includeAccessories
                                    ? 'bg-accent/10 border-accent/20 text-accent'
                                    : 'bg-gray-50 border-gray-100 text-primary'
                                }`}>
                                  <PriceText>+ ₹{accessoryPrice[size].toLocaleString('en-IN')}</PriceText>
                                </span>
                              </div>
                            </motion.button>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Footer note */}
          <div className="text-center pt-4 pb-2">
            <p className="text-[11px] text-neutral-dark/40">
              Made with care in Kerala, India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
