import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Ruler, Layers, Shirt, Check, MessageSquare, ShoppingCart,
  ChevronDown, Sparkles, Bed, Info, X, Plus, Minus,
  Ruler as RulerIcon, Shield, Truck, Clock, Heart,
  ChevronRight, Palette, Feather, Snowflake, Zap,
  Maximize2, Maximize, Leaf
} from 'lucide-react';
import { CartItem, MattressSize, SizeCategory } from '../../types';
import { STANDARD_SIZES, SIZE_CATEGORIES } from '../../types/sizes';
import { getBuilderData } from '../../lib/queries';
import { WHATSAPP_NUMBER } from '../../lib/site';

/* ──────────────────────────────────────────────────────────────
   Types (identical to Sanity data — no schema changes)
   ────────────────────────────────────────────────────────────── */
interface ThicknessOption {
  label: string;
  valueInches: number;
  addPrice: number;
  note?: string;
}

interface BuilderMaterial {
  name: string;
  slug: string;
  slot: 'comfort' | 'support';
  brand?: string;
  density?: string;
  ild?: string;
  feelTag?: string;
  benefit?: string;
  tooltip?: string;
  thicknessOptions: ThicknessOption[];
  stackColor?: string;
  isRecommended?: boolean;
  image?: any;
}

interface BuilderFabric {
  name: string;
  slug: string;
  role: 'primaryCover' | 'quiltingUpgrade';
  gsm?: string;
  quiltingMm?: string;
  benefit?: string;
  addPrice: number;
  isRecommended?: boolean;
  image?: any;
}

interface BuilderSize {
  name: string;
  lengthInches: number;
  widthInches: number;
  basePrice: number;
  popular?: boolean;
}

interface BuilderConfig {
  header: { title: string; subtitle: string; trustChips: string[] };
  sizes: BuilderSize[];
  customSize: {
    enabled: boolean; unit: string;
    minLength: number; maxLength: number;
    minWidth: number; maxWidth: number;
    pricePerSqInch: number; cutCharge: number;
    helper: string;
  };
  steps: {
    sizeTitle: string; sizeHelper: string;
    comfortTitle: string; comfortHelper: string;
    supportTitle: string; supportHelper: string;
    coverTitle: string; coverHelper: string;
  };
  summaryPanel: { heading: string; emptySlotText: string; perks: string[] };
  ctas: { primaryLabel: string; secondaryLabel: string; disabledHint: string };
  defaults: {
    sizeName: string;
    comfortMaterialSlug: string; comfortThickness: number;
    supportMaterialSlug: string; supportThickness: number;
    coverFabricSlug: string; quiltingSlug: string;
  };
  materials: BuilderMaterial[];
  fabrics: BuilderFabric[];
  seo: any;
}

interface BuildState {
  size: { kind: 'preset' | 'custom'; name?: string; length: number; width: number; sizeCategory?: SizeCategory };
  comfort: { materialSlug: string; thickness: number }[];
  support: { materialSlug: string; thickness: number }[];
  cover: { fabricSlug: string; quiltingSlug?: string };
}

/* ──────────────────────────────────────────────────────────────
   Step definitions (5 steps matching user's spec)
   ────────────────────────────────────────────────────────────── */
const STEP_DEFS = [
  { key: 'size',    icon: Bed,    color: '#2563EB', label: 'Size' },
  { key: 'support', icon: Layers, color: '#0F172A', label: 'Base Layer' },
  { key: 'comfort', icon: Feather, color: '#C8A96A', label: 'Middle Comfort' },
  { key: 'natural', icon: Leaf,   color: '#10B981', label: 'Natural Comfort' },
  { key: 'cover',   icon: Palette, color: '#D4A574', label: 'Cover & Finish' },
] as const;
type StepKey = typeof STEP_DEFS[number]['key'];

// We alias the user-facing step names
const STEP_ALIAS: Record<string, string> = {
  size: '1 · Choose Size',
  support: '2 · Choose Base Layer',
  comfort: '3 · How Soft Should The Middle Be?',
  natural: '4 · How Natural Comfort Should Be?',
  cover: '5 · Pick Your Cover & Finish',
};

const STEP_HELPERS: Record<string, string> = {
  size: 'Select your mattress size or enter custom dimensions.',
  support: 'Choose the foundation that keeps your spine aligned.',
  comfort: 'Choose the comfort layer in the middle for pressure relief.',
  natural: 'Choose your natural comfort layer for cooling, breathability.',
  cover: 'Select the fabric you see and sleep on.',
};

/* ──────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────── */

// Size-dependent pricing: [Single, Double, Queen, King]
type PriceRow = [number, number, number, number];

const SIZE_IDX: Record<string, number> = { single: 0, diwan: 1, queen: 2, king: 3 };

const HARDCODED_PRICES: Record<string, Record<number, PriceRow>> = {
  'pu-rebonded':           { 2: [3000, 2500, 2000, 1500], 4: [6000, 5000, 4000, 3000] },
  'hr-foam':               { 2: [3000, 2500, 2000, 1500] },
  'hr-softy-foam':         { 2: [3000, 2500, 2000, 1500] },
  'latex-rebonded-core':   { 2: [6000, 5000, 4000, 3000], 4: [12000, 10000, 8000, 6000] },
  'pure-natural-latex':    { 1: [6000, 5000, 4000, 3000], 2: [12000, 10000, 8000, 6000], 4: [24000, 20000, 16000, 12000], 6: [36000, 30000, 24000, 18000], 8: [48000, 40000, 32000, 24000] },
};

const QUILT_PRICES: PriceRow = [5000, 4200, 3500, 2500];

function getSizeIdx(build: BuildState): number {
  return build.size.kind === 'preset' && build.size.sizeCategory
    ? (SIZE_IDX[build.size.sizeCategory] ?? 0) : 0;
}

function getLayerPrice(slug: string, thickness: number, sizeIdx: number, config: BuilderConfig): number {
  const hardcoded = HARDCODED_PRICES[slug]?.[thickness];
  if (hardcoded) return hardcoded[sizeIdx];
  const m = config.materials.find(x => x.slug === slug);
  const t = m?.thicknessOptions?.find(o => o.valueInches === thickness);
  return t?.addPrice ?? 0;
}

function totalPrice(build: BuildState, config: BuilderConfig): number {
  const sizeIdx = getSizeIdx(build);
  const layerPrice = (sels: { materialSlug: string; thickness: number }[]) =>
    sels.reduce((sum, sel) => sum + getLayerPrice(sel.materialSlug, sel.thickness, sizeIdx, config), 0);
  const quiltPrice = build.cover.quiltingSlug ? QUILT_PRICES[sizeIdx] : 0;
  return layerPrice(build.comfort) + layerPrice(build.support) + quiltPrice;
}

function initBuild(_config: BuilderConfig): BuildState {
  const defaultCat = SIZE_CATEGORIES[0];
  const defaultVariant = STANDARD_SIZES[defaultCat.value].variants[0];
  return {
    size: { kind: 'preset', name: defaultCat.label, length: defaultVariant.dims.length, width: defaultVariant.dims.width, sizeCategory: defaultCat.value },
    comfort: [],
    support: [],
    cover: { fabricSlug: '', quiltingSlug: 'quilting-12mm' },
  };
}

function totalHeight(build: BuildState, config: BuilderConfig): number {
  const comfortH = build.comfort.reduce((s, c) => s + c.thickness, 0);
  const supportH = build.support.reduce((s, c) => s + c.thickness, 0);
  const quilt = build.cover.quiltingSlug ? 0.5 : 0;
  return comfortH + supportH + quilt;
}

/* ──────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   ────────────────────────────────────────────────────────────── */

/* ── Live Mattress Preview ── */
function MattressPreview({ build, config, price }: {
  build: BuildState; config: BuilderConfig; price: number;
}) {
  const quiltFab = config.fabrics.find(f => f.slug === build.cover.quiltingSlug);
  const coverFab = config.fabrics.find(f => f.slug === build.cover.fabricSlug);
  const comfortMats = build.comfort.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));
  const supportMats = build.support.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));

  const layers = [
    ...(quiltFab ? [{ label: 'Quilted Top', mat: quiltFab.name, color: '#D4C5A9', thickness: quiltFab.quiltingMm || '12mm' }] : []),
    ...comfortMats.map(s => ({ label: s.mat?.name || 'Comfort', mat: s.mat?.feelTag || '', color: s.mat?.stackColor || '#A8D5BA', thickness: `${s.thickness}"` })),
    ...supportMats.map(s => ({ label: s.mat?.name || 'Support', mat: s.mat?.feelTag || '', color: s.mat?.stackColor || '#7FA0C0', thickness: `${s.thickness}"` })),
  ];

  const height = totalHeight(build, config);

  return (
    <div className="space-y-6">
      {/* Live total badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-graphite-400 font-medium">
          <RulerIcon className="w-3.5 h-3.5" />
          <span>{build.size.name || 'Custom'}</span>
          <span className="text-graphite-300">·</span>
          <span>{build.size.width}×{build.size.length}"</span>
          <span className="text-graphite-300">·</span>
          <span className="font-semibold text-ink-900">{height.toFixed(1)}"</span>
          <span className="text-graphite-400 font-normal">thick</span>
        </div>
      </div>

      {/* Mattress visualization - glassmorphism refined */}
      <div className="relative bg-gradient-to-b from-ink-900 to-ink-950 rounded-[1.5rem] p-5 overflow-hidden min-h-[300px] flex flex-col justify-end shadow-[0_4px_40px_rgba(0,0,0,0.15),0_1px_4px_rgba(0,0,0,0.08)] border border-white/5">
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-600/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-400/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Floating layer labels on right side */}
        <div className="absolute right-5 top-6 flex flex-col gap-4 pointer-events-none z-10">
          {layers.slice(0, 4).map((layer, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-white/20" />
              <span className="text-[9px] font-medium text-white/50 tracking-wider whitespace-nowrap">
                {layer.thickness ? `${layer.label} (${layer.thickness})` : layer.label}
              </span>
            </div>
          ))}
        </div>

        <div className="relative flex flex-col gap-1 justify-end">
          <AnimatePresence mode="popLayout">
            {layers.map((layer, i) => (
              <motion.div
                key={`${layer.label}-${layer.color}`}
                layout
                initial={{ opacity: 0, scaleY: 0.7, y: -8 }}
                animate={{ opacity: 1, scaleY: 1, y: 0 }}
                exit={{ opacity: 0, scaleY: 0.7, y: -8 }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.04,
                }}
                className="relative w-full rounded-lg overflow-hidden"
                style={{ height: 40, backgroundColor: layer.color || '#3A3A4A' }}
              >
                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] to-black/20 pointer-events-none" />
                {/* Left accent stripe */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                />
                <div className="relative z-10 flex items-center h-full px-3 gap-2">
                  <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider w-[80px] shrink-0">
                    {layer.label}
                  </span>
                  <span className="text-[11px] font-medium text-white/90 truncate">
                    {layer.mat}
                  </span>
                  {layer.thickness && (
                    <span className="text-[9px] font-medium text-white/40 ml-auto shrink-0">
                      {layer.thickness}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Live price */}
      <div className="text-center">
        <span className="text-[11px] font-medium text-graphite-400 uppercase tracking-wider">Total Price</span>
        <div className="flex items-baseline justify-center gap-2 mt-1">
          <span className="text-4xl font-bold text-ink-900 tracking-tight">
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-medium bg-green-50 border border-green-200/50 px-2 py-1 rounded-full">
            <Shield className="w-3 h-3" /> 10-Yr Warranty
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-brand-600 font-medium bg-brand-50 border border-brand-200/50 px-2 py-1 rounded-full">
            <Truck className="w-3 h-3" /> Free Delivery
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Material Detail Drawer ── */
function MaterialDrawer({ material, onClose }: { material: BuilderMaterial; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full sm:max-w-lg max-h-[80vh] overflow-y-auto bg-white sm:rounded-2xl rounded-t-2xl p-6 sm:p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-graphite-100 hover:bg-graphite-200 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-graphite-500" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: material.stackColor || '#2563EB' }}
          >
            {material.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-ink-900">{material.name}</h3>
            {material.brand && <p className="text-xs text-graphite-400">{material.brand}</p>}
          </div>
        </div>

        {material.benefit && (
          <p className="text-sm text-graphite-600 leading-relaxed mb-5">{material.benefit}</p>
        )}

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {material.density && (
            <div className="bg-graphite-100 rounded-xl p-3">
              <span className="text-[10px] font-medium text-graphite-400 uppercase tracking-wider">Density</span>
              <p className="font-semibold text-ink-900 text-sm mt-1">{material.density}</p>
            </div>
          )}
          {material.ild && (
            <div className="bg-graphite-100 rounded-xl p-3">
              <span className="text-[10px] font-medium text-graphite-400 uppercase tracking-wider">ILD Rating</span>
              <p className="font-semibold text-ink-900 text-sm mt-1">{material.ild}</p>
            </div>
          )}
          {material.feelTag && (
            <div className="bg-graphite-100 rounded-xl p-3 col-span-2">
              <span className="text-[10px] font-medium text-graphite-400 uppercase tracking-wider">Feel</span>
              <p className="font-semibold text-ink-900 text-sm mt-1 flex items-center gap-2">
                <Feather className="w-4 h-4 text-brand-500" /> {material.feelTag}
              </p>
            </div>
          )}
        </div>

        {/* Thickness & pricing */}
        <h4 className="font-bold text-sm text-ink-900 mb-3">Available Thickness</h4>
        <div className="space-y-2">
          {material.thicknessOptions.map(t => (
            <div key={t.valueInches} className="flex items-center justify-between bg-graphite-100 rounded-xl px-4 py-3">
              <span className="font-semibold text-ink-900 text-sm">{t.label}</span>
              <span className="font-bold text-brand-600">₹{t.addPrice.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Thickness Pill Selector ── */
function ThicknessPills({ options, active, onChange }: {
  options: ThicknessOption[]; active: number; onChange: (v: number) => void;
}) {
  if (options.length <= 1) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3 ml-6">
      {options.map(t => {
        const isActive = active === t.valueInches;
        return (
          <button
            key={t.valueInches}
            onClick={() => onChange(t.valueInches)}
            className={`px-5 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-200 cursor-pointer ${
              isActive
                ? 'border-ink-900 bg-ink-900/5 text-ink-900 shadow-sm'
                : 'border-graphite-200 bg-white text-graphite-500 hover:border-ink-900/30 hover:text-ink-900'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Premium Material Card ── */
function MaterialCard({ mat, selected, thickness, onToggle, onThicknessChange, onDetail }: {
  mat: BuilderMaterial; selected: boolean; thickness: number;
  onToggle: () => void; onThicknessChange: (v: number) => void; onDetail: () => void;
}) {
  return (
    <div>
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.99 }}
        className={`relative w-full text-left rounded-xl border-2 transition-all duration-300 overflow-hidden cursor-pointer ${
          selected
            ? 'border-ink-900 bg-ink-900/[0.03] shadow-lg shadow-ink-900/5'
            : 'border-graphite-100 bg-white hover:border-graphite-200 hover:shadow-md'
        }`}
      >
        {/* Selected indicator */}
        {selected && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-ink-900" />
        )}

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {/* Color dot */}
              <div
                className={`w-[18px] h-[18px] rounded-full mt-0.5 shrink-0 ring-2 transition-all duration-300 ${
                  selected ? 'ring-ink-900/30 scale-110' : 'ring-white'
                }`}
                style={{ backgroundColor: mat.stackColor || '#CBD5E1' }}
              >
                {selected && (
                  <Check className="w-[10px] h-[10px] text-white mx-auto mt-[3px]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-ink-900">{mat.name}</h4>
                  {mat.isRecommended && !selected && (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                  {selected && (
                    <span className="text-[9px] font-bold text-green-700 bg-green-50 border border-green-200/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Selected
                    </span>
                  )}
                </div>
                {mat.feelTag && (
                  <p className="text-xs text-graphite-500 mt-0.5 flex items-center gap-1.5">
                    <Feather className="w-3 h-3 text-graphite-400" />
                    {mat.feelTag}
                  </p>
                )}
                {mat.benefit && selected && (
                  <p className="text-[11px] text-graphite-400 mt-1 leading-relaxed">{mat.benefit}</p>
                )}
                {/* Spec attribute chips - inspired by stitch reference */}
                {selected && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {mat.density && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-medium text-graphite-500 bg-graphite-100/70 px-2 py-0.5 rounded-full">
                        {mat.density}
                      </span>
                    )}
                    {mat.brand && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-medium text-graphite-500 bg-graphite-100/70 px-2 py-0.5 rounded-full">
                        {mat.brand}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[9px] font-medium text-graphite-500 bg-graphite-100/70 px-2 py-0.5 rounded-full">
                      {mat.slot === 'support' ? 'Firm' : 'Comfort'}
                    </span>
                    {mat.ild && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-medium text-graphite-500 bg-graphite-100/70 px-2 py-0.5 rounded-full">
                        ILD {mat.ild}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Detail + Density chips */}
            <div className="flex items-center gap-2 shrink-0">
              {(mat.density || mat.ild) && (
                <span className="hidden sm:inline-flex text-[9px] font-semibold text-graphite-400 bg-graphite-100 px-2 py-1 rounded-lg">
                  {mat.density}{mat.ild ? ` · ${mat.ild}` : ''}
                </span>
              )}
              <button
                onClick={e => { e.stopPropagation(); onDetail(); }}
                className="w-7 h-7 rounded-full bg-graphite-100 hover:bg-graphite-200 text-graphite-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-graphite-400" />
              </button>
            </div>
          </div>
        </div>
      </motion.button>

      {/* Thickness selector */}
      <AnimatePresence>
        {selected && mat.thicknessOptions.length > 1 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ThicknessPills
              options={mat.thicknessOptions}
              active={thickness}
              onChange={onThicknessChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Step Accordion ── */
function StepAccordion({ step, isOpen, summary, children, onToggle, stepIdx }: {
  step: typeof STEP_DEFS[number]; isOpen: boolean; summary: string;
  onToggle: () => void; children: React.ReactNode; stepIdx: number;
}) {
  const Icon = step.icon;
  return (
    <div className={`bg-white rounded-[1.5rem] border transition-all duration-300 ${
      isOpen ? 'border-ink-900/20 shadow-lg shadow-ink-900/5' : 'border-graphite-100 hover:border-graphite-200 shadow-sm'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left cursor-pointer transition-colors"
      >
        {/* Step number */}
        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-300 ${
          isOpen ? 'bg-ink-900 text-white shadow-md' : 'bg-graphite-100 text-graphite-500'
        }`}>
          {stepIdx + 1}
        </span>

        {/* Icon */}
        <Icon className={`w-4 h-4 shrink-0 transition-colors ${
          isOpen ? 'text-ink-900' : 'text-graphite-400'
        }`} />

        {/* Title + Summary */}
        <div className="flex-1 min-w-0">
          <span className={`font-bold text-sm block transition-colors ${
            isOpen ? 'text-ink-900' : 'text-graphite-600'
          }`}>
            {STEP_ALIAS[step.key] || step.label}
          </span>
          <span className="text-[11px] text-graphite-400 block mt-0.5 truncate">
            {isOpen ? STEP_HELPERS[step.key] || '' : summary || 'Tap to configure'}
          </span>
        </div>

        {/* Status badge */}
        <span className={`text-[10px] font-semibold px-3 py-1 rounded-full shrink-0 transition-all ${
          isOpen
            ? 'bg-ink-900/10 text-ink-900'
            : summary && summary !== 'Not set'
              ? 'bg-green-50 text-green-700 border border-green-200/50'
              : 'bg-graphite-100 text-graphite-400'
        }`}>
          {isOpen ? 'Editing' : (summary && summary !== 'Not set' ? 'Done' : 'Set')}
        </span>

        {/* Chevron */}
        <ChevronDown className={`w-4 h-4 text-graphite-400 transition-transform duration-300 shrink-0 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

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
            <div className="px-4 sm:px-5 pb-5 sm:pb-6 pt-1 border-t border-graphite-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Step: Size ── */
function StepSize({ config, build, onSelect }: {
  config: BuilderConfig; build: BuildState; onSelect: (b: BuildState) => void;
}) {
  const [showCustom, setShowCustom] = useState(build.size.kind === 'custom');
  const [custL, setCustL] = useState<string>(String(build.size.kind === 'custom' ? build.size.length : 78));
  const [custW, setCustW] = useState<string>(String(build.size.kind === 'custom' ? build.size.width : 60));

  const selectedCat = build.size.sizeCategory;

  return (
    <div className="space-y-4">
      {/* Step 1: Category selector */}
      <div>
        <p className="text-[10px] font-bold text-graphite-500 uppercase tracking-wider mb-2">Select Category</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {SIZE_CATEGORIES.map(cat => {
            const active = selectedCat === cat.value && !showCustom && build.size.kind !== 'custom';
            return (
              <motion.button
                key={cat.value}
                onClick={() => {
                  setShowCustom(false);
                  const variant = STANDARD_SIZES[cat.value].variants[0];
                  onSelect({ ...build, size: { kind: 'preset', name: cat.label, length: variant.dims.length, width: variant.dims.width, sizeCategory: cat.value } });
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`relative p-3 rounded-xl text-center border-2 transition-all duration-200 cursor-pointer ${
                  active
                    ? 'border-ink-900 bg-ink-900/[0.03] shadow-lg shadow-ink-900/5'
                    : 'border-graphite-100 bg-white hover:border-brand-600/40 hover:bg-sky-100 hover:shadow-md'
                }`}
              >
                <span className={`font-bold text-xs block ${active ? 'text-ink-900' : 'text-graphite-700'}`}>{cat.label}</span>
                <span className="text-[9px] font-medium mt-0.5 block text-graphite-400">{cat.hint}</span>
                {active && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-ink-900 flex items-center justify-center shadow-md">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Variant selector */}
      {selectedCat && !showCustom && build.size.kind !== 'custom' && (
        <div>
          <p className="text-[10px] font-bold text-graphite-500 uppercase tracking-wider mb-2">
            Select Size — {STANDARD_SIZES[selectedCat].label}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {STANDARD_SIZES[selectedCat].variants.map((variant) => {
              const active = build.size.kind === 'preset' && build.size.length === variant.dims.length && build.size.width === variant.dims.width;
              return (
                <motion.button
                  key={variant.legacyKey}
                  onClick={() => onSelect({ ...build, size: { kind: 'preset', name: STANDARD_SIZES[selectedCat].label, length: variant.dims.length, width: variant.dims.width, sizeCategory: selectedCat } })}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative p-3 rounded-xl text-center border-2 transition-all duration-200 cursor-pointer ${
                    active
                      ? 'border-ink-900 bg-ink-900/[0.03] shadow-lg shadow-ink-900/5'
                      : 'border-graphite-100 bg-white hover:border-brand-600/40 hover:bg-sky-100 hover:shadow-md'
                  }`}
                >
                  <span className={`font-semibold text-xs block ${active ? 'text-ink-900' : 'text-graphite-700'}`}>{variant.label}</span>
                  {active && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-ink-900 flex items-center justify-center shadow-md">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Size */}
      {config.customSize.enabled && (
        <div className="border-t border-graphite-100 pt-3 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setShowCustom(!showCustom)}
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${showCustom || build.size.kind === 'custom' ? 'border-ink-900 bg-ink-900 text-white' : 'border-graphite-300 bg-white'}`}
            >
              {(showCustom || build.size.kind === 'custom') && <Check className="w-2.5 h-2.5" />}
            </div>
            <span className="text-[10px] font-bold text-graphite-500 uppercase tracking-wider">Need a Custom Size?</span>
          </label>

          <AnimatePresence>
            {(showCustom || build.size.kind === 'custom') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-br from-white to-white rounded-xl border border-graphite-200/60 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-ink-900 uppercase tracking-wider block mb-1">Length ({config.customSize.unit})</label>
                      <input
                        type="number"
                        value={custL}
                        onChange={e => setCustL(e.target.value)}
                        min={config.customSize.minLength}
                        max={config.customSize.maxLength}
                        className="w-full px-3 py-2.5 rounded-xl border border-graphite-200 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900 bg-white transition-all outline-none"
                        onBlur={() => {
                          if (custL === '') return;
                          const num = Number(custL);
                          const clamped = Math.max(config.customSize.minLength, Math.min(config.customSize.maxLength, num));
                          setCustL(String(clamped));
                          onSelect({ ...build, size: { kind: 'custom', length: clamped, width: Number(custW) || 0 } });
                        }}
                      />
                      <p className="text-[8px] text-graphite-400 mt-1">Min {config.customSize.minLength} – Max {config.customSize.maxLength}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-ink-900 uppercase tracking-wider block mb-1">Width ({config.customSize.unit})</label>
                      <input
                        type="number"
                        value={custW}
                        onChange={e => setCustW(e.target.value)}
                        min={config.customSize.minWidth}
                        max={config.customSize.maxWidth}
                        className="w-full px-3 py-2.5 rounded-xl border border-graphite-200 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900 bg-white transition-all outline-none"
                        onBlur={() => {
                          if (custW === '') return;
                          const num = Number(custW);
                          const clamped = Math.max(config.customSize.minWidth, Math.min(config.customSize.maxWidth, num));
                          setCustW(String(clamped));
                          onSelect({ ...build, size: { kind: 'custom', length: Number(custL) || 0, width: clamped } });
                        }}
                      />
                      <p className="text-[8px] text-graphite-400 mt-1">Min {config.customSize.minWidth} – Max {config.customSize.maxWidth}</p>
                    </div>
                  </div>
                  {config.customSize.helper && (
                    <p className="text-[10px] text-graphite-400 leading-relaxed">{config.customSize.helper}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ── Step: Material (generic for base/comfort/natural) ── */
function StepMaterialGroup({ materials, build, onSelect, slot }: {
  materials: BuilderMaterial[]; build: BuildState;
  onSelect: (b: BuildState) => void; slot: 'comfort' | 'support' | 'natural';
}) {
  const [detailMat, setDetailMat] = useState<BuilderMaterial | null>(null);

  // Determine which build key to use based on slot
  const isNatural = slot === 'natural';
  const buildKey = slot === 'support' ? 'support' : 'comfort';
  const current = build[buildKey];

  const toggleMaterial = (slug: string) => {
    const exists = current.some(s => s.materialSlug === slug);
    if (exists) {
      const updated = current.filter(s => s.materialSlug !== slug);
      onSelect({ ...build, [buildKey]: updated });
    } else {
      const mat = materials.find(m => m.slug === slug);
      const thickness = mat?.thicknessOptions[0]?.valueInches || 0;
      const updated = [...current, { materialSlug: slug, thickness }];
      onSelect({ ...build, [buildKey]: updated });
    }
  };

  const setThickness = (slug: string, thickness: number) => {
    const updated = current.map(s =>
      s.materialSlug === slug ? { ...s, thickness } : s
    );
    onSelect({ ...build, [buildKey]: updated });
  };

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] text-graphite-400 mb-3">
        {isNatural
          ? 'Select a natural comfort layer for breathability and cooling.'
          : slot === 'support'
            ? 'Choose the foundation of your mattress. This keeps your spine aligned.'
            : 'Choose the comfort layer for pressure relief.'}
      </p>

      {materials.map(mat => {
        const entry = current.find(s => s.materialSlug === mat.slug);
        return (
          <MaterialCard
            key={mat.slug}
            mat={mat}
            selected={!!entry}
            thickness={entry?.thickness ?? mat.thicknessOptions[0]?.valueInches ?? 0}
            onToggle={() => toggleMaterial(mat.slug)}
            onThicknessChange={(v) => setThickness(mat.slug, v)}
            onDetail={() => setDetailMat(mat)}
          />
        );
      })}

      {/* Detail drawer */}
      <AnimatePresence>
        {detailMat && <MaterialDrawer material={detailMat} onClose={() => setDetailMat(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Step: Cover ── */
function StepCover({ build, onSelect }: {
  build: BuildState;
  onSelect: (b: BuildState) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="p-5 sm:p-6 bg-gradient-to-br from-white to-ink-50/20 rounded-xl border border-ink-900/10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-ink-900/10 flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5 text-ink-900" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-ink-900">12mm Deep Quilting (Premium)</h4>
            <p className="text-xs text-graphite-500 mt-0.5">
              Deep 12mm quilting for a luxurious pillow-top feel with enhanced pressure relief.
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <Check className="w-3 h-3" /> Included
            </span>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-graphite-400 text-center pt-1">
        12mm quilted top is automatically included in your mattress. Pricing varies by size.
      </p>
    </div>
  );
}

/* ── Price Breakdown Panel ── */
function PriceBreakdown({ build, config, price }: {
  build: BuildState; config: BuilderConfig; price: number;
}) {
  const sizeIdx = getSizeIdx(build);
  const comfortMats = build.comfort.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));
  const supportMats = build.support.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));
  const coverFab = config.fabrics.find(f => f.slug === build.cover.fabricSlug);
  const quiltFab = config.fabrics.find(f => f.slug === build.cover.quiltingSlug);

  const breakdown: { label: string; price: number }[] = [];
  supportMats.forEach(s => {
    const p = getLayerPrice(s.materialSlug, s.thickness, sizeIdx, config);
    if (p > 0) breakdown.push({ label: `${s.mat?.name || 'Base'} (${s.thickness}")`, price: p });
  });
  comfortMats.forEach(s => {
    const p = getLayerPrice(s.materialSlug, s.thickness, sizeIdx, config);
    if (p > 0) breakdown.push({ label: `${s.mat?.name || 'Comfort'} (${s.thickness}")`, price: p });
  });
  if (coverFab && coverFab.addPrice > 0) {
    breakdown.push({ label: coverFab.name, price: coverFab.addPrice });
  }
  if (quiltFab) {
    breakdown.push({ label: quiltFab.name, price: QUILT_PRICES[sizeIdx] });
  }

  return (
    <div className="bg-ink-900/5 rounded-xl p-4 space-y-2">
      <h4 className="text-[10px] font-bold text-graphite-500 uppercase tracking-wider mb-2">Price Breakdown</h4>
      {breakdown.map((item, i) => (
        <div key={i} className="flex items-center justify-between text-xs">
          <span className="text-graphite-500">{item.label}</span>
          <span className="font-semibold text-ink-900">₹{item.price.toLocaleString('en-IN')}</span>
        </div>
      ))}
      <div className="flex items-center justify-between text-sm font-bold text-ink-900 pt-2 border-t border-graphite-200/60">
        <span>Total</span>
        <span>₹{price.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

/* ── Price Counter (animated) ── */
function PriceCounter({ value }: { value: number }) {
  const [displayVal, setDisplayVal] = useState(value);
  
  useEffect(() => {
    const duration = 400;
    const start = performance.now();
    const from = displayVal;
    const diff = value - from;
    if (diff === 0) return;
    
    const raf = requestAnimationFrame(function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.round(from + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>&#8377;{displayVal.toLocaleString('en-IN')}</>;
}

/* ──────────────────────────────────────────────────────────────
   MAIN BUILDER COMPONENT
   ────────────────────────────────────────────────────────────── */
export default function MattressBuilder({ onAddToCart, onNavigate }: {
  onAddToCart: (item: CartItem) => void; onNavigate: (page: string) => void;
}) {
  const [config, setConfig] = useState<BuilderConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [build, setBuild] = useState<BuildState | null>(null);
  const [openStep, setOpenStep] = useState<StepKey>('size');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    getBuilderData()
      .then(data => {
        if (!data) { setError('Builder config not found in Sanity. Run the seed script.'); setLoading(false); return; }
        setConfig(data);
        setBuild(initBuild(data));
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const price = useMemo(() => build && config ? totalPrice(build, config) : 0, [build, config]);
  const height = useMemo(() => build && config ? totalHeight(build, config) : 0, [build, config]);

  const getStepSummary = useCallback((key: StepKey): string => {
    if (!config || !build) return '';
    switch (key) {
      case 'size':
        return build.size.kind === 'preset'
          ? `${build.size.name} · ${build.size.width}×${build.size.length}"`
          : `Custom · ${build.size.width}×${build.size.length}"`;
      case 'support': {
        if (build.support.length === 0) return 'Not set';
        return build.support.map(s => {
          const m = config.materials.find(x => x.slug === s.materialSlug);
          return `${m?.name || s.materialSlug} (${s.thickness}")`;
        }).join(', ');
      }
      case 'comfort': {
        // Show middle comfort: HR Foam / HR Softy only
        const foamMats = build.comfort.filter(s =>
          s.materialSlug === 'hr-foam' || s.materialSlug === 'hr-softy-foam'
        );
        if (foamMats.length === 0) return 'Not set';
        return foamMats.map(s => {
          const m = config.materials.find(x => x.slug === s.materialSlug);
          return `${m?.name || s.materialSlug} (${s.thickness}")`;
        }).join(', ');
      }
      case 'natural': {
        // Show natural comfort: Latex Foam only
        const naturalMats = build.comfort.filter(s =>
          s.materialSlug === 'pure-natural-latex'
        );
        if (naturalMats.length === 0) return 'Not set';
        return naturalMats.map(s => {
          const m = config.materials.find(x => x.slug === s.materialSlug);
          return `${m?.name || s.materialSlug} (${s.thickness}")`;
        }).join(', ');
      }
      case 'cover': {
        return build.cover.quiltingSlug ? '12mm Deep Quilting (Premium)' : 'Not set';
      }
    }
  }, [build, config]);

  // Filter materials for each step
  const supportMats = useMemo(() =>
    config?.materials.filter(m =>
      m.slug === 'pu-rebonded' || m.slug === 'latex-rebonded-core'
    ) || [], [config]);
  const foamComfortMats = useMemo(() =>
    config?.materials.filter(m =>
      m.slug === 'hr-foam' || m.slug === 'hr-softy-foam'
    ) || [], [config]);
  const naturalComfortMats = useMemo(() =>
    config?.materials.filter(m =>
      m.slug === 'pure-natural-latex'
    ) || [], [config]);

  const handleAddToCart = () => {
    if (!build || !config) return;
    if (build.comfort.length === 0 && build.support.length === 0) return;

    const comfortMats = build.comfort.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));
    const supportMats2 = build.support.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));
    const quiltFab = config.fabrics.find(f => f.slug === build.cover.quiltingSlug && f.role === 'quiltingUpgrade');

    const layers = [
      ...(quiltFab ? [{ material: '12mm Quilted Top', thickness: 0 }] : []),
      ...comfortMats.map(s => ({ material: s.mat?.name || s.materialSlug, thickness: s.thickness })),
      ...supportMats2.map(s => ({ material: s.mat?.name || s.materialSlug, thickness: s.thickness })),
    ];

    const item: CartItem = {
      id: `custom-${Date.now()}`,
      slug: 'custom-build',
      name: `Custom ${build.size.name || 'Size'} Mattress`,
      size: build.size.name?.toLowerCase() as MattressSize || 'custom',
      price,
      quantity: 1,
      includeAccessories: false,
      image: 'https://images.unsplash.com/photo-1631549916768-4119b812b1f0?w=800&q=80',
      type: 'custom',
      customLayers: layers,
      customSize: build.size.kind === 'custom' ? { length: build.size.length, width: build.size.width } : undefined,
    };

    onAddToCart(item);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!build || !config) return;
    const quiltFab = config.fabrics.find(f => f.slug === build.cover.quiltingSlug && f.role === 'quiltingUpgrade');
    const comfortDescs = build.comfort.map(s => {
      const m = config.materials.find(x => x.slug === s.materialSlug);
      return `  \u2022 ${m?.name || s.materialSlug} \u2014 ${s.thickness}"`;
    }).join('\n');
    const supportDescs = build.support.map(s => {
      const m = config.materials.find(x => x.slug === s.materialSlug);
      return `  \u2022 ${m?.name || s.materialSlug} \u2014 ${s.thickness}"`;
    }).join('\n');

    const msg = [
      'Hi, I would like to order a custom RelaxPro mattress:',
      '',
      `Size: ${build.size.name || 'Custom'} (${build.size.width}\u00d7${build.size.length} in)`,
      '',
      'Comfort Layer(s):',
      comfortDescs || '  (none)',
      '',
      'Support Core:',
      supportDescs || '  (none)',
      '',
      `Cover: 12mm Deep Quilting (Premium)${quiltFab ? '' : ''}`,
      '',
      `Total: \u20b9${price.toLocaleString('en-IN')}`,
      '',
      'Please confirm availability and share payment details.',
    ].join('\n');

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-[3px] border-ink-900/20 border-t-ink-900 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-graphite-500 font-medium">Loading builder...</p>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-md space-y-3">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <X className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-sm font-semibold text-ink-900">Failed to load builder</p>
          <p className="text-xs text-graphite-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!config || !build) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ========== TOP HEADER (Premium Redesign) ========== */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-graphite-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-4 py-3 sm:py-4">
            {/* Left: Brand + specs */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-ink-900 flex items-center justify-center shrink-0">
                <Bed className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-sm sm:text-base text-ink-900 truncate font-heading">Build Your Dream Mattress</h1>
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-graphite-400 mt-0.5">
                  <span className="font-semibold text-ink-900/70">{build.size.name || 'Custom'}</span>
                  <span className="text-graphite-300" aria-hidden="true">|</span>
                  <span>{build.size.width}&times;{build.size.length}"</span>
                  <span className="text-graphite-300" aria-hidden="true">|</span>
                  <span className="font-medium">{height.toFixed(1)}" thick</span>
                </div>
              </div>
            </div>

            {/* Center: Trust chips (medium screens+) */}
            <div className="hidden md:flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[10px] text-green-700 font-medium bg-green-50 border border-green-200/40 px-2.5 py-1 rounded-full">
                <Shield className="w-3 h-3" /> 10-Yr Warranty
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-brand-700 font-medium bg-brand-50 border border-brand-200/40 px-2.5 py-1 rounded-full">
                <Truck className="w-3 h-3" /> Free Delivery
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium bg-amber-50 border border-amber-200/40 px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" /> 10-14 Days
              </span>
            </div>

            {/* Right: Price + CTA */}
            <div className="hidden sm:flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-[9px] font-medium text-graphite-400 uppercase tracking-[0.12em]">Total</span>
                <div className="text-xl font-bold text-ink-900 tabular-nums">
                  <PriceCounter value={price} />
                </div>
              </div>
              <motion.button
                onClick={handleAddToCart}
                disabled={build.comfort.length === 0 || build.support.length === 0}
                whileTap={build.comfort.length > 0 && build.support.length > 0 ? { scale: 0.97 } : {}}
                className={`hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  build.comfort.length > 0 && build.support.length > 0
                    ? 'bg-ink-900 text-white hover:bg-ink-800 shadow-md shadow-ink-900/10 cursor-pointer'
                    : 'bg-graphite-200 text-graphite-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {addedToCart ? 'Added!' : config.ctas.primaryLabel}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Step progress indicator */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:pt-6 md:pb-2">
        <div className="flex items-center gap-2 sm:gap-3">
          {STEP_DEFS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = getStepSummary(step.key) !== 'Not set' && getStepSummary(step.key) !== '';
            const isActiveStep = openStep === step.key;
            return (
              <button
                key={step.key}
                onClick={() => setOpenStep(step.key as StepKey)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-semibold transition-all duration-300 cursor-pointer ${
                  isActiveStep
                    ? 'bg-ink-900 text-white shadow-md'
                    : isCompleted
                      ? 'bg-green-50 text-green-700 border border-green-200/50'
                      : 'bg-white text-graphite-400 border border-graphite-200'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActiveStep ? 'text-white' : isCompleted ? 'text-green-600' : 'text-graphite-400'}`} />
                <span className="hidden sm:inline">{step.label}</span>
                {isCompleted && <Check className="w-2.5 h-2.5 text-green-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── LEFT: Sticky Preview (40%) ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-28 order-1 space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-white/30 shadow-[0_4px_40px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)] p-5 sm:p-6">
              <MattressPreview build={build} config={config} price={price} />
            </div>

            {/* Price breakdown (desktop) */}
            <div className="hidden lg:block bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-white/30 shadow-[0_4px_40px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)] p-5 sm:p-6">
              <PriceBreakdown build={build} config={config} price={price} />
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block space-y-2">
              <motion.button
                onClick={handleAddToCart}
                whileTap={build.comfort.length > 0 && build.support.length > 0 ? { scale: 0.98 } : {}}
                disabled={build.comfort.length === 0 || build.support.length === 0}
                className={`w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                  build.comfort.length > 0 && build.support.length > 0
                    ? 'bg-ink-900 text-white shadow-lg hover:bg-ink-800 cursor-pointer'
                    : 'bg-graphite-200 text-graphite-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {addedToCart ? 'Added to Cart!' : (build.comfort.length > 0 && build.support.length > 0 ? config.ctas.primaryLabel : config.ctas.disabledHint)}
              </motion.button>

              <motion.button
                onClick={handleWhatsApp}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-6 rounded-xl border-2 border-eco-500/20 text-eco-600 hover:bg-eco-50 font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                {config.ctas.secondaryLabel}
              </motion.button>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] text-graphite-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> 10-Yr Warranty
                </span>
                <span className="text-[10px] text-graphite-400 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Free Delivery
                </span>
                <span className="text-[10px] text-graphite-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 10&ndash;14 Days
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Configurator (60%) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-7 order-2 space-y-3 pb-24 lg:pb-0"
          >
            {STEP_DEFS.map((step, idx) => {
              const isOpen = openStep === step.key;
              const summary = getStepSummary(step.key);

              return (
                <StepAccordion
                  key={step.key}
                  step={step}
                  isOpen={isOpen}
                  summary={summary}
                  stepIdx={idx}
                  onToggle={() => setOpenStep(isOpen ? step.key : step.key)}
                >
                  {step.key === 'size' && (
                    <StepSize config={config} build={build} onSelect={setBuild} />
                  )}
                  {step.key === 'support' && (
                    <StepMaterialGroup
                      materials={supportMats}
                      build={build}
                      onSelect={setBuild}
                      slot="support"
                    />
                  )}
                  {step.key === 'comfort' && (
                    <StepMaterialGroup
                      materials={foamComfortMats}
                      build={build}
                      onSelect={setBuild}
                      slot="comfort"
                    />
                  )}
                  {step.key === 'natural' && (
                    <StepMaterialGroup
                      materials={naturalComfortMats}
                      build={build}
                      onSelect={setBuild}
                      slot="natural"
                    />
                  )}
                  {step.key === 'cover' && (
                    <StepCover fabrics={config.fabrics} build={build} onSelect={setBuild} />
                  )}
                </StepAccordion>
              );
            })}
        </motion.div>
      </div>
      </div>

      {/* ========== MOBILE BOTTOM BAR ========== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-graphite-100 p-4 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[9px] font-medium text-graphite-400 uppercase tracking-wider block">Total</span>
            <span className="text-2xl font-bold text-ink-900">&#8377;{price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-graphite-400">
            <RulerIcon className="w-3 h-3" />
            <span>{build.size.name || 'Custom'} &middot; {height.toFixed(1)}"</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={build.comfort.length === 0 || build.support.length === 0}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              build.comfort.length > 0 && build.support.length > 0
                ? 'bg-ink-900 text-white shadow-md cursor-pointer'
                : 'bg-graphite-200 text-graphite-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {addedToCart ? 'Added!' : (build.comfort.length > 0 && build.support.length > 0 ? config.ctas.primaryLabel : config.ctas.disabledHint)}
          </button>
          <button
            onClick={handleWhatsApp}
            className="py-3.5 px-5 rounded-xl border-2 border-eco-500/20 text-eco-600 hover:bg-eco-50 font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-colors shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
