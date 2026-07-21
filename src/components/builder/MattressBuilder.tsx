import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Ruler, Layers, Shirt, Check, MessageSquare, ShoppingCart,
  ChevronDown, ChevronRight, Sparkles, Bed, Info
} from 'lucide-react';
import { CartItem, MattressSize } from '../../types';
import { getBuilderData } from '../../lib/queries';

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
  summaryPanel: {
    heading: string; emptySlotText: string;
    perks: string[];
  };
  ctas: {
    primaryLabel: string; secondaryLabel: string;
    disabledHint: string;
  };
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
  size: { kind: 'preset' | 'custom'; name?: string; length: number; width: number };
  comfort: { materialSlug: string; thickness: number }[];
  support: { materialSlug: string; thickness: number }[];
  cover: { fabricSlug: string; quiltingSlug?: string };
}

const STEP_KEYS = ['size', 'comfort', 'support', 'cover'] as const;
type StepKey = typeof STEP_KEYS[number];

function totalPrice(build: BuildState, config: BuilderConfig): number {
  const sizeObj = config.sizes.find(s => s.name === build.size.name);
  const sizePrice = build.size.kind === 'preset' && sizeObj ? sizeObj.basePrice : 0;

  const layerPrice = (sels: { materialSlug: string; thickness: number }[]) =>
    sels.reduce((sum, sel) => {
      const m = config.materials.find(x => x.slug === sel.materialSlug);
      const t = m?.thicknessOptions?.find(o => o.valueInches === sel.thickness);
      return sum + (t?.addPrice ?? 0);
    }, 0);

  const coverFab = config.fabrics.find(f => f.slug === build.cover.fabricSlug);
  const quiltFab = config.fabrics.find(f => f.slug === build.cover.quiltingSlug && f.role === 'quiltingUpgrade');

  return sizePrice + layerPrice(build.comfort) + layerPrice(build.support)
    + (coverFab?.addPrice ?? 0) + (quiltFab?.addPrice ?? 0);
}

function initBuild(config: BuilderConfig): BuildState {
  const def = config.defaults;
  const defaultSize = config.sizes.find(s => s.name === def.sizeName) || config.sizes[0];
  return {
    size: { kind: 'preset', name: defaultSize.name, length: defaultSize.lengthInches, width: defaultSize.widthInches },
    comfort: def.comfortMaterialSlug ? [{ materialSlug: def.comfortMaterialSlug, thickness: def.comfortThickness }] : [],
    support: def.supportMaterialSlug ? [{ materialSlug: def.supportMaterialSlug, thickness: def.supportThickness }] : [],
    cover: { fabricSlug: def.coverFabricSlug, quiltingSlug: def.quiltingSlug || undefined },
  };
}

function sizeLabel(s: BuilderSize) {
  return `${s.name} · ${s.widthInches}×${s.lengthInches}`;
}

function LayerStack({ build, config }: { build: BuildState; config: BuilderConfig }) {
  const coverFab = config.fabrics.find(f => f.slug === build.cover.fabricSlug);
  const quiltFab = config.fabrics.find(f => f.slug === build.cover.quiltingSlug);
  const comfortMats = build.comfort.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));
  const supportMats = build.support.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));

  const layers = [
    ...(quiltFab ? [{ label: 'Quilted top', mat: quiltFab.name, color: '#D4C5A9', thickness: '12mm', active: true as const }] : []),
    { label: 'Cover fabric', mat: coverFab?.name || null, color: '#C9B99A', thickness: coverFab?.gsm || null, active: true as const },
    ...comfortMats.map(s => ({ label: 'Comfort layer' as const, mat: s.mat?.name || null, color: s.mat?.stackColor || null, thickness: `${s.thickness}"`, active: true as const })),
    ...supportMats.map(s => ({ label: 'Support core' as const, mat: s.mat?.name || null, color: s.mat?.stackColor || null, thickness: `${s.thickness}"`, active: true as const })),
    { label: 'Base fabric', mat: 'Canvas base', color: '#8B7D6B', thickness: null, active: true as const },
  ];

  return (
    <div className="relative bg-[#0F1A2E] rounded-2xl p-5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
      <div className="relative flex flex-col gap-1.5 min-h-[280px] justify-end">
        <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
        <AnimatePresence mode="popLayout">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.label}
              layout
              initial={{ opacity: 0, scaleY: 0.85 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
              className={`relative w-full rounded-xl flex items-center overflow-hidden ${layer.active ? '' : 'opacity-40'}`}
              style={{
                height: layer.active ? 44 : 36,
                backgroundColor: layer.color || '#2A2A3A',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/20 pointer-events-none" />
              {layer.active ? (
                <>
                  <span className="relative z-10 text-[10px] font-bold text-white/70 uppercase tracking-wider ml-3 shrink-0 w-20">
                    {layer.label}
                  </span>
                  <span className="relative z-10 text-xs font-semibold text-white truncate">
                    {layer.mat || config.summaryPanel.emptySlotText}
                  </span>
                  {layer.thickness && (
                    <span className="relative z-10 text-[10px] font-medium text-white/50 ml-auto mr-3 shrink-0">
                      {layer.thickness}
                    </span>
                  )}
                </>
              ) : (
                <span className="relative z-10 text-[10px] text-white/30 italic ml-3">
                  {config.summaryPanel.emptySlotText}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepSize({ config, build, onSelect }: { config: BuilderConfig; build: BuildState; onSelect: (b: BuildState) => void }) {
  const [showCustom, setShowCustom] = useState(build.size.kind === 'custom');
  const [custL, setCustL] = useState(build.size.kind === 'custom' ? build.size.length : 60);
  const [custW, setCustW] = useState(build.size.kind === 'custom' ? build.size.width : 48);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {config.sizes.map(s => {
          const active = build.size.kind === 'preset' && build.size.name === s.name;
          return (
            <motion.button
              key={s.name}
              onClick={() => onSelect({ ...build, size: { kind: 'preset', name: s.name, length: s.lengthInches, width: s.widthInches } })}
              whileTap={{ scale: 0.97 }}
              className={`relative p-4 rounded-xl text-center border-2 transition-all duration-200 cursor-pointer ${
                active ? 'border-accent bg-accent/5 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <Bed className={`w-5 h-5 mx-auto mb-1.5 ${active ? 'text-accent' : 'text-primary'}`} />
              <span className="font-bold text-sm capitalize block text-primary">{s.name}</span>
              <span className="text-[10px] font-medium mt-1 block text-gray-400">{s.widthInches}×{s.lengthInches}</span>
              {s.popular && <span className="text-[9px] font-bold text-accent mt-1 block">Popular</span>}
              {active && <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
            </motion.button>
          );
        })}
        {config.customSize.enabled && (
          <motion.button
            onClick={() => setShowCustom(!showCustom)}
            whileTap={{ scale: 0.97 }}
            className={`relative p-4 rounded-xl text-center border-2 border-dashed transition-all duration-200 cursor-pointer ${
              build.size.kind === 'custom' ? 'border-accent bg-accent/5' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <Ruler className="w-5 h-5 mx-auto mb-1.5 text-gray-400" />
            <span className="font-bold text-xs block text-gray-500">Custom</span>
          </motion.button>
        )}
      </div>
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden"
          >
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Length ({config.customSize.unit})</label>
                  <input type="number" value={custL} onChange={e => setCustL(Number(e.target.value))}
                    min={config.customSize.minLength} max={config.customSize.maxLength}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    onBlur={() => onSelect({ ...build, size: { kind: 'custom', length: custL, width: custW } })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Width ({config.customSize.unit})</label>
                  <input type="number" value={custW} onChange={e => setCustW(Number(e.target.value))}
                    min={config.customSize.minWidth} max={config.customSize.maxWidth}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    onBlur={() => onSelect({ ...build, size: { kind: 'custom', length: custL, width: custW } })}
                  />
                </div>
              </div>
              {config.customSize.helper && (
                <p className="text-[11px] text-gray-400">{config.customSize.helper}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepMaterial({ slotLabel, slot, materials, build, onSelect }: {
  slotLabel: string; slot: 'comfort' | 'support';
  materials: BuilderMaterial[]; build: BuildState;
  onSelect: (b: BuildState) => void;
}) {
  const filtered = materials.filter(m => m.slot === slot);
  const current = slot === 'comfort' ? build.comfort : build.support;

  const toggleMaterial = (slug: string) => {
    const exists = current.some(s => s.materialSlug === slug);
    if (exists) {
      const updated = current.filter(s => s.materialSlug !== slug);
      if (slot === 'comfort') onSelect({ ...build, comfort: updated });
      else onSelect({ ...build, support: updated });
    } else {
      const mat = materials.find(m => m.slug === slug);
      const thickness = mat?.thicknessOptions[0]?.valueInches || 0;
      const updated = [...current, { materialSlug: slug, thickness }];
      if (slot === 'comfort') onSelect({ ...build, comfort: updated });
      else onSelect({ ...build, support: updated });
    }
  };

  const setThickness = (slug: string, thickness: number) => {
    const updated = current.map(s =>
      s.materialSlug === slug ? { ...s, thickness } : s
    );
    if (slot === 'comfort') onSelect({ ...build, comfort: updated });
    else onSelect({ ...build, support: updated });
  };

  return (
    <div>
      <p className="text-[11px] text-gray-400 mb-3">Tap to add, tap again to remove. You can select multiple layers.</p>
      <div className="space-y-2.5">
        {filtered.map(mat => {
          const entry = current.find(s => s.materialSlug === mat.slug);
          const selected = !!entry;
          return (
            <div key={mat.slug}>
              <motion.button
                onClick={() => toggleMaterial(mat.slug)}
                whileTap={{ scale: 0.995 }}
                className={`relative w-full p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  selected ? 'border-accent bg-accent/5 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-4 h-4 rounded-full mt-0.5 shrink-0 ring-1 ring-white/30 flex items-center justify-center"
                      style={{ backgroundColor: selected ? (mat.stackColor || '#CBD5E1') : '#E5E7EB' }}>
                      {selected && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-primary">{mat.name}</h4>
                        {mat.isRecommended && <span className="text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">Recommended</span>}
                      </div>
                      {mat.feelTag && <p className="text-xs text-gray-500 mt-0.5">{mat.feelTag}</p>}
                      {mat.benefit && <p className="text-[11px] text-gray-400 mt-0.5">{mat.benefit}</p>}
                    </div>
                  </div>
                  {(mat.density || mat.ild) && (
                    <span className="shrink-0 text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg flex items-center gap-1">
                      {mat.density}{mat.ild ? ` · ${mat.ild}` : ''}
                      <Info className="w-3 h-3" />
                    </span>
                  )}
                </div>
                {selected && (
                  <span className="text-[10px] text-accent font-semibold mt-2 block">Tap to remove</span>
                )}
              </motion.button>
              <AnimatePresence>
                {selected && mat.thicknessOptions.length > 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden"
                  >
                    <div className="flex gap-2 mt-2 mb-1 ml-6">
                      {mat.thicknessOptions.map(t => {
                        const isActive = entry.thickness === t.valueInches;
                        return (
                          <button
                            key={t.valueInches}
                            onClick={() => setThickness(mat.slug, t.valueInches)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              isActive ? 'border-accent bg-accent/10 text-accent' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepCover({ fabrics, build, onSelect }: {
  fabrics: BuilderFabric[]; build: BuildState;
  onSelect: (b: BuildState) => void;
}) {
  const primaryFabrics = fabrics.filter(f => f.role === 'primaryCover');
  const quiltingFabrics = fabrics.filter(f => f.role === 'quiltingUpgrade');
  const quiltFab = quiltingFabrics[0];

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4">{/* Cover helper */}</p>
      <div className="space-y-3">
        {primaryFabrics.map(fab => {
          const active = build.cover.fabricSlug === fab.slug;
          return (
            <motion.button
              key={fab.slug}
              onClick={() => onSelect({ ...build, cover: { ...build.cover, fabricSlug: fab.slug } })}
              whileTap={{ scale: 0.995 }}
              className={`relative w-full p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                active ? 'border-accent bg-accent/5 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-primary">{fab.name}</span>
                    {fab.isRecommended && <span className="text-[9px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">Recommended</span>}
                  </div>
                  {fab.benefit && <p className="text-xs text-gray-500 mt-0.5">{fab.benefit}</p>}
                  {fab.gsm && <p className="text-[10px] text-gray-400 mt-0.5">{fab.gsm}</p>}
                </div>
              </div>
              {active && <div className="absolute top-3 right-3"><Check className="w-4 h-4 text-accent" /></div>}
            </motion.button>
          );
        })}
        {quiltFab && (
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white cursor-pointer hover:border-gray-200 transition-colors">
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                build.cover.quiltingSlug ? 'bg-accent border-accent' : 'border-gray-300'
              }`}>
                {build.cover.quiltingSlug && <Check className="w-3 h-3 text-white" />}
              </div>
              <input type="checkbox" className="hidden"
                checked={!!build.cover.quiltingSlug}
                onChange={e => onSelect({ ...build, cover: { ...build.cover, quiltingSlug: e.target.checked ? quiltFab.slug : '' } })}
              />
              <div className="flex-1">
                <span className="font-semibold text-sm text-primary">{quiltFab.name}</span>
                <p className="text-xs text-gray-500">{quiltFab.benefit}</p>
              </div>
              {quiltFab.quiltingMm && <span className="text-[10px] font-semibold text-gray-400">{quiltFab.quiltingMm}</span>}
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

function BuilderSummary({ build, config, price, addedToCart, onAddToCart, onWhatsApp }: {
  build: BuildState; config: BuilderConfig; price: number;
  addedToCart: boolean; onAddToCart: () => void; onWhatsApp: () => void;
}) {
  const comfortMats = build.comfort.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));
  const supportMats = build.support.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));
  const coverFab = config.fabrics.find(f => f.slug === build.cover.fabricSlug);
  const quiltFab = config.fabrics.find(f => f.slug === build.cover.quiltingSlug);

  const feelTags = [...comfortMats, ...supportMats].filter(s => s.mat?.feelTag).map(s => s.mat!.feelTag);

  const chips: string[] = [];
  comfortMats.forEach(s => { if (s.mat?.density && !chips.includes(s.mat.density)) chips.push(s.mat.density); if (s.mat?.ild && !chips.includes(s.mat.ild)) chips.push(s.mat.ild); });
  if (coverFab?.gsm) chips.push(coverFab.gsm);
  supportMats.forEach(s => { if (s.mat?.density && !chips.includes(s.mat.density)) chips.push(s.mat.density); });

  const isComplete = build.comfort.length > 0 && build.support.length > 0;

  return (
    <div>
      <h3 className="font-bold text-base text-primary tracking-tight mb-4">{config.summaryPanel.heading}</h3>

      {/* Size */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Ruler className="w-4 h-4 text-accent" />
        <span className="font-semibold text-primary">{build.size.name || 'Custom'}</span>
        <span className="text-gray-400">· {build.size.width}×{build.size.length}</span>
      </div>

      {/* Layer stack */}
      <LayerStack build={build} config={config} />

      {/* Text receipt */}
      {isComplete && (
        <div className="mt-5 pt-4 border-t border-gray-200/60">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-3">Your Build Specs</h4>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-700 shrink-0 w-20">Size:</span>
              <span>{build.size.name || 'Custom'} ({build.size.width}×{build.size.length} in)</span>
            </div>
            {comfortMats.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-gray-700 shrink-0 w-20">Comfort:</span>
                <span>{comfortMats.map(s => `${s.mat?.name || s.materialSlug} (${s.thickness}")`).join(', ')}</span>
              </div>
            )}
            {supportMats.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-gray-700 shrink-0 w-20">Support:</span>
                <span>{supportMats.map(s => `${s.mat?.name || s.materialSlug} (${s.thickness}")`).join(', ')}</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="font-semibold text-gray-700 shrink-0 w-20">Cover:</span>
              <span>{coverFab?.name || 'Not selected'}{quiltFab ? ` + ${quiltFab.name}` : ''}</span>
            </div>
          </div>
        </div>
      )}

      {/* Feel summary */}
      {feelTags.length > 0 && (
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          {feelTags.join(' · ')}
        </p>
      )}

      {/* Spec chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {chips.map(c => (
            <span key={c} className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{c}</span>
          ))}
        </div>
      )}

      {/* Price */}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <div className="text-3xl font-bold text-primary tracking-tight">
          ₹{price.toLocaleString('en-IN')}
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {config.summaryPanel.perks.map(p => (
            <span key={p} className="text-[10px] text-green-600 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> {p}
            </span>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-6 space-y-2">
        <motion.button
          onClick={onAddToCart}
          whileTap={isComplete ? { scale: 0.98 } : {}}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
            isComplete ? 'bg-primary text-white shadow-md cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!isComplete}
        >
          <ShoppingCart className="w-4 h-4" />
          {addedToCart ? 'Added!' : (isComplete ? config.ctas.primaryLabel : config.ctas.disabledHint)}
        </motion.button>
        <motion.button
          onClick={onWhatsApp}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 rounded-xl border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          {config.ctas.secondaryLabel}
        </motion.button>
      </div>
    </div>
  );
}

export default function MattressBuilder({ onAddToCart, onNavigate }: { onAddToCart: (item: CartItem) => void; onNavigate: (page: string) => void }) {
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

  const stepInfo: { key: StepKey; icon: any; title: string; helper: string }[] = config ? [
    { key: 'size', icon: Bed, title: config.steps.sizeTitle, helper: config.steps.sizeHelper },
    { key: 'comfort', icon: Layers, title: config.steps.comfortTitle, helper: config.steps.comfortHelper },
    { key: 'support', icon: Layers, title: config.steps.supportTitle, helper: config.steps.supportHelper },
    { key: 'cover', icon: Shirt, title: config.steps.coverTitle, helper: config.steps.coverHelper },
  ] : [];

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <p className="text-red-500 font-semibold text-sm">Failed to load builder</p>
        <p className="text-gray-400 text-xs mt-1">{error}</p>
      </div>
    </div>
  );

  if (!config || !build) return null;

  const getStepSummary = (key: StepKey): string => {
    switch (key) {
      case 'size': return build.size.kind === 'preset' ? `${build.size.name} · ${build.size.width}×${build.size.length}` : 'Custom';
      case 'comfort': {
        if (build.comfort.length === 0) return 'Not set';
        return build.comfort.map(s => {
          const m = config.materials.find(x => x.slug === s.materialSlug);
          return `${m?.name || s.materialSlug} (${s.thickness}")`;
        }).join(', ');
      }
      case 'support': {
        if (build.support.length === 0) return 'Not set';
        return build.support.map(s => {
          const m = config.materials.find(x => x.slug === s.materialSlug);
          return `${m?.name || s.materialSlug} (${s.thickness}")`;
        }).join(', ');
      }
      case 'cover': {
        const f = config.fabrics.find(x => x.slug === build.cover.fabricSlug);
        const q = build.cover.quiltingSlug ? ' + Quilted' : '';
        return f ? `${f.name}${q}` : 'Not set';
      }
    }
  };

  const handleAddToCart = () => {
    if (build.comfort.length === 0 || build.support.length === 0) return;
    const comfortMats = build.comfort.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));
    const supportMats = build.support.map(s => ({ ...s, mat: config.materials.find(m => m.slug === s.materialSlug) }));
    const coverFab = config.fabrics.find(f => f.slug === build.cover.fabricSlug);
    const quiltFab = config.fabrics.find(f => f.slug === build.cover.quiltingSlug && f.role === 'quiltingUpgrade');
    const layers = [
      ...(quiltFab ? [{ material: '12mm Quilted Top', thickness: 0 }] : []),
      { material: coverFab?.name || 'Cotton Cover', thickness: 0 },
      ...comfortMats.map(s => ({ material: s.mat?.name || s.materialSlug, thickness: s.thickness })),
      ...supportMats.map(s => ({ material: s.mat?.name || s.materialSlug, thickness: s.thickness })),
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
    const coverFab = config.fabrics.find(f => f.slug === build.cover.fabricSlug);
    const quiltFab = config.fabrics.find(f => f.slug === build.cover.quiltingSlug && f.role === 'quiltingUpgrade');
    const comfortDescs = build.comfort.map(s => {
      const m = config.materials.find(x => x.slug === s.materialSlug);
      return `  • ${m?.name || s.materialSlug} — ${s.thickness}"`;
    }).join('\n');
    const supportDescs = build.support.map(s => {
      const m = config.materials.find(x => x.slug === s.materialSlug);
      return `  • ${m?.name || s.materialSlug} — ${s.thickness}"`;
    }).join('\n');
    const msg = [
      'Hi, I would like to order a custom RelaxPro mattress:',
      '',
      `Size: ${build.size.name || 'Custom'} (${build.size.width}×${build.size.length} in)`,
      '',
      'Comfort Layer(s):',
      comfortDescs || '  (none)',
      '',
      'Support Core:',
      supportDescs || '  (none)',
      '',
      `Cover: ${coverFab?.name || 'Not selected'}${quiltFab ? ` + ${quiltFab.name}` : ''}`,
      '',
      `Total: ₹${price.toLocaleString('en-IN')}`,
      '',
      'Please confirm availability and share payment details.',
    ].join('\n');
    window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '918686624494'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] font-semibold text-accent uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Direct From Kerala Factory
        </span>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-primary leading-tight">
          {config.header.title}
        </h1>
        <p className="text-neutral-dark/80 mt-3 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
          {config.header.subtitle}
        </p>
        {config.header.trustChips && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {config.header.trustChips.map(c => (
              <span key={c} className="text-[10px] font-semibold text-accent bg-accent/5 border border-accent/10 px-2.5 py-1 rounded-full">{c}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ========== LEFT COLUMN — Live Preview ========== */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 order-1">
          <div className="bg-white rounded-3xl border border-gray-100/80 shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-6 md:p-7">
            <BuilderSummary build={build} config={config} price={price} addedToCart={addedToCart} onAddToCart={handleAddToCart} onWhatsApp={handleWhatsApp} />
          </div>
        </div>

        {/* ========== RIGHT COLUMN — Configurator ========== */}
        <div className="lg:col-span-7 order-2 space-y-3">
          {/* Progress rail */}
          <div className="flex items-center gap-2 mb-4 px-1">
            {stepInfo.map((s, i) => (
              <button key={s.key} onClick={() => setOpenStep(s.key)}
                className="flex items-center gap-1.5 text-[10px] font-semibold cursor-pointer transition-colors">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  openStep === s.key ? 'bg-accent text-white' : i < stepInfo.indexOf(stepInfo.find(x => x.key === openStep)!) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>{i + 1}</span>
                <span className={`hidden md:inline ${openStep === s.key ? 'text-accent' : 'text-gray-400'}`}>{s.key}</span>
                {i < stepInfo.length - 1 && <ChevronRight className="w-3 h-3 text-gray-300" />}
              </button>
            ))}
          </div>

          {stepInfo.map((step, idx) => {
            const isOpen = openStep === step.key;
            const StepIcon = step.icon;
            return (
              <div key={step.key} className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden">
                <button
                  onClick={() => setOpenStep(step.key)}
                  className="w-full flex items-center gap-4 p-4 md:p-5 text-left cursor-pointer transition-colors hover:bg-gray-50/50"
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold transition-colors ${
                    isOpen ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{idx + 1}</span>
                  <StepIcon className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-accent' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <span className={`font-bold text-sm block transition-colors ${isOpen ? 'text-primary' : 'text-gray-600'}`}>{step.title}</span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">{isOpen ? step.helper : getStepSummary(step.key)}</span>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${isOpen ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-400'}`}>
                    {isOpen ? 'Open' : 'Edit'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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
                      <div className="px-4 md:px-5 pb-5 md:pb-6 pt-1 border-t border-gray-50">
                        {step.key === 'size' && <StepSize config={config} build={build} onSelect={setBuild} />}
                        {step.key === 'comfort' && <StepMaterial slotLabel="comfort" slot="comfort" materials={config.materials} build={build} onSelect={setBuild} />}
                        {step.key === 'support' && <StepMaterial slotLabel="support" slot="support" materials={config.materials} build={build} onSelect={setBuild} />}
                        {step.key === 'cover' && <StepCover fabrics={config.fabrics} build={build} onSelect={setBuild} />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Sticky bottom CTA (mobile) */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-primary">₹{price.toLocaleString('en-IN')}</span>

            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={build.comfort.length === 0 || build.support.length === 0}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  build.comfort.length > 0 && build.support.length > 0 ? 'bg-primary text-white shadow-md cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {addedToCart ? 'Added!' : config.ctas.primaryLabel}
              </button>
              <button onClick={handleWhatsApp}
                className="py-3 px-4 rounded-xl border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Enquire</span>
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
