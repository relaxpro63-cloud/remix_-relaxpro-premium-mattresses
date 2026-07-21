import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PriceText from '../ui/PriceText';
import { Check, X, Shield, Plus, Minus, FileText, MessageSquare, Info, Award } from 'lucide-react';
import { Product, MattressSize } from '../../types';
import { PRODUCTS } from '../../data/products';

interface CompareTableProps {
  onAddToCartDirect: (product: Product, size: MattressSize, includeAcc: boolean) => void;
  onNavigateToPdp: (slug: string) => void;
  onNavigate: (page: string) => void;
}

export default function CompareTable({ onAddToCartDirect, onNavigateToPdp, onNavigate }: CompareTableProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(['nirvana', 'arogya', 'sthira']);
  const [activeSize, setActiveSize] = useState<MattressSize>('king');

  // Find products based on slugs
  const comparedProducts = PRODUCTS.filter((p) => selectedSlugs.includes(p.slug));

  const availableProducts = PRODUCTS.filter((p) => !selectedSlugs.includes(p.slug));

  const handleAddProduct = (slug: string) => {
    if (selectedSlugs.length >= 4) {
      alert('You can compare a maximum of 4 mattresses side-by-side.');
      return;
    }
    setSelectedSlugs([...selectedSlugs, slug]);
  };

  const handleRemoveProduct = (slug: string) => {
    if (selectedSlugs.length <= 1) {
      alert('Please keep at least 1 mattress selected for comparison.');
      return;
    }
    setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
  };

  // Helper to extract pricing for compared cards
  const getDisplayPrice = (product: Product, size: MattressSize) => {
    if (product.pricingModel === 'with_without_accessories') {
      return product.pricing.withoutAccessories?.[size] || 0;
    } else {
      return product.pricing.fabric300Gsm?.[size] || 0;
    }
  };

  // Helper to check if model has natural rubber latex
  const hasLatex = (product: Product) => {
    return product.layers.some((l) => l.material === 'latex' || l.material === 'latex_rebonded');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs tracking-widest font-mono text-brand-600 uppercase bg-brand-100 px-3 py-1 rounded-full">
          SMART BUYING TOOL
        </span>
        <h1 className="text-4xl font-display font-medium tracking-tight mt-4 text-brand-950">
          Compare Premium Mattresses
        </h1>
        <p className="text-gray-600 mt-4 leading-relaxed font-sans text-md">
          Evaluate construction layers, comfort rankings, solid warranties, and direct-to-consumer pricing side-by-side. Configure comparison criteria to match your sleep patterns.
        </p>
      </div>

      {/* Selector Dashboard */}
      <div className="bg-brand-100/60 p-6 rounded-2xl border border-brand-200/50 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-medium text-brand-950 text-md">Configure Mattress Comparison</h3>
            <p className="text-xs text-gray-500 mt-1">Select up to 4 models. Toggle target mattress sizes below for local pricing charts.</p>
          </div>
          
          {/* Size filter selector */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-zinc-200/80 self-start md:self-auto">
            {(['king', 'queen', 'double', 'single'] as MattressSize[]).map((sz) => (
              <button
                key={sz}
                onClick={() => setActiveSize(sz)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-display capitalize transition-all cursor-pointer ${
                  activeSize === sz
                    ? 'bg-brand-950 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-brand-950 hover:bg-zinc-100'
                }`}
              >
                {sz} Size
              </button>
            ))}
          </div>
        </div>

        {/* Selected Mattresses Tags */}
        <div className="mt-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-brand-800 font-semibold uppercase tracking-wider font-mono mr-2">Currently Comparing:</span>
          {comparedProducts.map((p) => (
            <span
              key={p.slug}
              className="inline-flex items-center gap-1 bg-white pl-3 pr-1.5 py-1 rounded-full text-xs font-medium border border-brand-200 text-brand-950"
            >
              <span className="font-display font-semibold">{p.name}</span>
              <button
                onClick={() => handleRemoveProduct(p.slug)}
                className="w-4 h-4 rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Prompt to add more */}
          {selectedSlugs.length < 4 && availableProducts.length > 0 && (
            <div className="relative inline-block">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddProduct(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="bg-brand-200 text-brand-950 hover:bg-brand-300 transition-all font-display text-xs font-semibold px-3.5 py-1.5 rounded-full border border-brand-300 pr-5 appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>+ Add Mattress to Compare</option>
                {availableProducts.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.totalThickness}" - {p.comfortLevel})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Grid Comparison Matrix */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-md">
        <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="p-4 md:p-6 text-xs font-mono uppercase tracking-widest text-zinc-500 w-1/5 min-w-[150px]">
                Product Features
              </th>
              {comparedProducts.map((p) => (
                <th key={p.slug} className="p-4 md:p-6 text-left border-l border-zinc-200 min-w-[180px]">
                  <div className="relative">
                    {p.badge && (
                      <span className="inline-block text-[9px] font-bold tracking-wider font-mono text-blue-800 bg-blue-100 rounded px-1.5 py-0.5 mb-2 truncate max-w-full">
                        {p.badge}
                      </span>
                    )}
                    <h3 className="font-display font-bold text-lg text-brand-950 leading-tight block">{p.name}</h3>
                    <p className="text-xs text-zinc-500 italic truncate mt-0.5">{p.tagline}</p>
                    
                    <button
                      onClick={() => handleRemoveProduct(p.slug)}
                      className="absolute top-0 right-0 text-zinc-400 hover:text-rose-500 md:hidden cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 text-xs md:text-sm">
            {/* Row: Visual thumbnail */}
            <tr>
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Visual Preview
              </td>
              {comparedProducts.map((p) => (
                <td key={p.slug} className="p-4 border-l border-zinc-200">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-28 object-cover rounded-xl border border-zinc-100 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                </td>
              ))}
            </tr>

            {/* Row: Price */}
            <tr>
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Direct Price
              </td>
              {comparedProducts.map((p) => {
                const price = getDisplayPrice(p, activeSize);
                return (
                  <td key={p.slug} className="p-4 md:p-6 border-l border-zinc-200">
                    <div className="text-md font-mono text-zinc-500 block uppercase tracking-wider">{activeSize} price</div>
                    <div className="text-xl font-bold font-display text-brand-950 mt-1">
                      <PriceText>₹{price.toLocaleString('en-IN')}</PriceText>
                    </div>
                    {p.pricingModel === 'with_without_accessories' && (
                      <span className="text-[10px] text-emerald-800 font-mono bg-emerald-100/80 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                        Accessories Exl.
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Row: Comfort Rating */}
            <tr>
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Comfort Level
              </td>
              {comparedProducts.map((p) => (
                <td key={p.slug} className="p-4 md:p-6 border-l border-zinc-200">
                  <div className="flex items-center gap-1 bg-brand-100 text-brand-950 font-display font-medium text-xs rounded-full px-2.5 py-1 w-fit capitalize">
                    {p.comfortLevel}
                  </div>
                  <div className="flex items-center gap-0.5 mt-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          idx < p.comfortRating ? 'bg-accent' : 'bg-gray-200'
                        }`}
                      ></span>
                    ))}
                    <span className="text-[10px] text-gray-500 ml-1 font-mono">{p.comfortRating}/5 stiffness</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Row: Main Benefit */}
            <tr>
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Primary Sleep Benefit
              </td>
              {comparedProducts.map((p) => (
                <td key={p.slug} className="p-4 md:p-6 border-l border-zinc-200 font-sans text-xs text-stone-700 leading-relaxed">
                  {p.keyBenefit}
                </td>
              ))}
            </tr>

            {/* Row: Total Thickness */}
            <tr>
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Total Thickness
              </td>
              {comparedProducts.map((p) => (
                <td key={p.slug} className="p-4 md:p-6 border-l border-zinc-200 font-sans">
                  <span className="text-base font-bold font-display text-brand-950">{p.totalThickness}"</span>
                  <span className="text-xs text-gray-500 font-mono"> (Inches Composite)</span>
                </td>
              ))}
            </tr>

            {/* Row: Kerala Natural Latex */}
            <tr>
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Kerala Natural Latex?
              </td>
              {comparedProducts.map((p) => {
                const latex = hasLatex(p);
                return (
                  <td key={p.slug} className="p-4 md:p-6 border-l border-zinc-200">
                    <div className="flex items-center gap-1.5">
                      {latex ? (
                        <>
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-zinc-900 font-display">100% Organic Dunlop</span>
                        </>
                      ) : (
                        <>
                          <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                            <X className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-zinc-500">Premium Spine Foam</span>
                        </>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Row: Foundation Layers */}
            <tr>
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Layer Breakdown
              </td>
              {comparedProducts.map((p) => (
                <td key={p.slug} className="p-4 md:p-6 border-l border-zinc-200">
                  <div className="space-y-2">
                    {p.layers.map((l, i) => (
                      <div key={i} className="flex gap-1.5 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                        <div>
                          <strong className="font-semibold text-brand-950 text-xs font-display">{l.thickness}" {l.material.replace('_', ' ').toUpperCase()}</strong>
                          <p className="text-[11px] text-gray-500 leading-tight">{l.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row: Fabric Covering */}
            <tr>
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Cover Mesh Fabric
              </td>
              {comparedProducts.map((p) => (
                <td key={p.slug} className="p-4 md:p-6 border-l border-zinc-200">
                  <span className="font-semibold text-brand-950 text-xs font-mono block">{p.fabricGsm} GSM Cotton</span>
                  <span className="text-xs text-gray-500 leading-tight block mt-0.5">{p.fabricType}</span>
                </td>
              ))}
            </tr>

            {/* Row: Certifications */}
            <tr>
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Pristine Certifications
              </td>
              {comparedProducts.map((p) => (
                <td key={p.slug} className="p-4 md:p-6 border-l border-zinc-200">
                  <div className="flex flex-wrap gap-1">
                    {p.certifications.map((cer) => (
                      <span key={cer} className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                        {cer}
                      </span>
                    ))}
                    {p.certifications.length === 0 && <span className="text-gray-400 font-mono text-xs">Standard Certified</span>}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row: Pure Warranty */}
            <tr>
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Warranty Coverage
              </td>
              {comparedProducts.map((p) => (
                <td key={p.slug} className="p-4 md:p-6 border-l border-zinc-200">
                  <div className="flex items-center gap-1 text-zinc-900 font-medium font-mono text-xs">
                    <Shield className="w-3.5 h-3.5 text-brand-500" />
                    <span>{p.warranty} Years Indian Warranty</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Row: Actions */}
            <tr className="bg-zinc-50/30">
              <td className="p-4 md:p-6 font-mono font-medium text-zinc-600 bg-zinc-50/50">
                Get Your Mattress
              </td>
              {comparedProducts.map((p) => (
                <td key={p.slug} className="p-4 md:p-6 border-l border-zinc-200">
                  <div className="space-y-2">
                    <a
                      href={`https://wa.me/918686624494?text=${encodeURIComponent(`Hello Suresh, I am interested in the RelaxPro ${p.name} Mattress (${activeSize} size) from the Compare page. Please share pricing and delivery info.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2.5 px-3 text-xs font-semibold font-display shadow-xs flex items-center justify-center gap-1 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Enquire on WhatsApp
                    </a>
                    <button
                      onClick={() => onNavigateToPdp(p.slug)}
                      className="w-full border border-zinc-200 hover:border-brand-500 bg-white hover:bg-zinc-50 rounded-lg py-2.5 px-3 text-xs font-semibold text-brand-950 flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Info className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-start gap-3 bg-yellow-50/80 border border-yellow-200 p-4 rounded-xl max-w-2xl">
        <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-900 leading-relaxed font-sans">
          <strong className="font-semibold">Buying Direct Tip:</strong> Comparing mattresses shows how RelaxPro saves you up to 40% vs. retail showroom brands. By cutting national distributor commissions, transport overhead, and retail rents, Suresh delivers luxury latex straight from natural sap units to your home.
        </p>
      </div>
    </div>
  );
}
