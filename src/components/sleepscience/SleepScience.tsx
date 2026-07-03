import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Shield, Check, Info, Heart, Airplay, Sparkles, Activity, FileText } from 'lucide-react';

export default function SleepScience() {
  const [activeTab, setActiveTab] = useState<'kerala' | 'postures' | 'certifications'>('kerala');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-24 relative">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
        <span className="text-[11px] tracking-widest font-accent font-bold text-accent uppercase bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full inline-block shadow-sm">
          PHYSIOLOGICAL WELLNESS DATABASE
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight mt-6 text-primary leading-tight">
          The Science of Sleep Orthopedics
        </h1>
        <p className="text-neutral-dark/80 mt-6 leading-relaxed font-body text-base md:text-lg">
          Deep, restorative sleep is not mystical—it is mechanical and thermal. Explore how natural Dunlop rubber latex supports natural posture and thermoregulates your sleeping climate natively.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row bg-neutral-light/50 p-1.5 rounded-2xl md:rounded-full border border-brand-200/50 text-sm font-bold font-accent max-w-2xl mx-auto mb-12 shadow-inner gap-1">
        <button
          onClick={() => setActiveTab('kerala')}
          className={`flex-1 py-3.5 px-6 rounded-xl md:rounded-full transition-all duration-300 cursor-pointer text-center ${
            activeTab === 'kerala' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-primary/60 hover:text-primary hover:bg-white'
          }`}
        >
          Dunlop Latex vs Foam
        </button>
        <button
          onClick={() => setActiveTab('postures')}
          className={`flex-1 py-3.5 px-6 rounded-xl md:rounded-full transition-all duration-300 cursor-pointer text-center ${
            activeTab === 'postures' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-primary/60 hover:text-primary hover:bg-white'
          }`}
        >
          Spine Alignment
        </button>
        <button
          onClick={() => setActiveTab('certifications')}
          className={`flex-1 py-3.5 px-6 rounded-xl md:rounded-full transition-all duration-300 cursor-pointer text-center ${
            activeTab === 'certifications' ? 'bg-primary text-white shadow-md scale-[1.02]' : 'text-primary/60 hover:text-primary hover:bg-white'
          }`}
        >
          Certified Organic
        </button>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-brand-200/50 shadow-xl shadow-brand-500/5"
        >
          {activeTab === 'kerala' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-accent text-accent uppercase tracking-widest bg-accent/10 border border-accent/20 px-3 py-1 rounded-md font-bold mb-4 inline-block">PHYSIOLOGY COMPARSION</span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight mt-2">
                  Why 100% Kerala Dunlop Rubber Latex Core Leads the World
                </h2>
              </div>
              <p className="text-neutral-dark/80 text-sm md:text-base leading-relaxed font-body">
                Conventional polyurethane foams are petrochemical byproducts. They rely on gas-expanding polymers that sink and entrap heat, creating a "sleeping in a ditch" feeling that strains lumbar tendons over several hours.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 bg-neutral-light p-5 rounded-2xl border border-brand-200/40 group hover:border-brand-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-brand-200/60 group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <strong className="font-heading font-bold text-base text-primary block">Instantaneous Spring Back Reaction</strong>
                    <p className="text-sm text-neutral-dark/70 mt-1 leading-relaxed font-body">
                      Latex holds deep natural elasticity. Unlike memory foam which adapts slowly, Dunlop rubber pushes back dynamically according to the force applied, keeping hips afloat.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 bg-neutral-light p-5 rounded-2xl border border-brand-200/40 group hover:border-brand-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-brand-200/60 group-hover:scale-110 transition-transform">
                    <Airplay className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <strong className="font-heading font-bold text-base text-primary block">Open-Cell Honeycomb Microclimate</strong>
                    <p className="text-sm text-neutral-dark/70 mt-1 leading-relaxed font-body">
                      Liquid rubber sap is whipped before setting, resulting in millions of interconnected open micropores. Air flows naturally with your movements, lowering night sweating.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Illustration Card rendering comparisons directly */}
            <div className="bg-gradient-to-br from-brand-50 to-neutral-light p-8 md:p-10 rounded-[2rem] border border-brand-200/60 font-body text-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-8 -mt-8" />
              <h3 className="font-heading font-bold text-primary text-xl mb-6 relative z-10">Direct Science Comparison</h3>
              <div className="space-y-4 relative z-10">
                <div className="grid grid-cols-3 font-bold pb-3 border-b border-brand-200/60 font-accent text-[11px] tracking-wider uppercase text-primary/60">
                  <span>CRITERIA</span>
                  <span className="text-accent">DUNLOP LATEX</span>
                  <span>MEMORY FOAM</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 border-b border-brand-200/40">
                  <span className="font-semibold text-primary">Push-Back Support</span>
                  <span className="text-[#1DA851] font-bold">Excellent (Adaptive)</span>
                  <span className="text-red-500 font-medium">Poor (Sunken Sink-in)</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 border-b border-brand-200/40">
                  <span className="font-semibold text-primary">Heat Dispersion</span>
                  <span className="text-[#1DA851] font-bold">95% (Open-Cell Matrix)</span>
                  <span className="text-red-500 font-medium">15% (Traps Body Heat)</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 border-b border-brand-200/40">
                  <span className="font-semibold text-primary">Life Span / Warranty</span>
                  <span className="text-[#1DA851] font-bold">15+ Years (Dense)</span>
                  <span className="text-red-500 font-medium">3-5 Years (Polymers)</span>
                </div>
                <div className="grid grid-cols-3 py-2.5 border-b border-brand-200/40">
                  <span className="font-semibold text-primary">Off-Gassing / VOC</span>
                  <span className="text-[#1DA851] font-bold">Zero (Food-Grade sap)</span>
                  <span className="text-red-500 font-medium">High (Chemical odor)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'postures' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Posture diagnostics */}
            <div className="space-y-8">
              <div>
                <span className="text-[10px] font-accent text-accent uppercase tracking-widest bg-accent/10 border border-accent/20 px-3 py-1 rounded-md font-bold mb-4 inline-block">ORTHOPEDIC DIAGNOSTICS</span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight mt-2">
                  Maintaining Natural Spine Alignment
                </h2>
              </div>
              <p className="text-neutral-dark/80 text-sm md:text-base leading-relaxed font-body">
                Your spine holds an elongated "S" shaped profile when standing. When sleeping, a bad mattress bends this alignment, causing persistent trigger point pressures. RelaxPro models offer customized orthopedic zones:
              </p>

              <div className="space-y-6 font-body">
                <div className="flex gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-primary text-white font-accent flex items-center justify-center font-bold text-sm shrink-0 shadow-md group-hover:bg-accent transition-colors">1</div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-primary">Side Sleeper Comfort Zone</h4>
                    <p className="text-neutral-dark/70 text-sm md:text-base mt-1.5 leading-relaxed">Requires local indentation for shoulders and pelvis while pushing back on your ribcage. Our <strong className="text-primary font-bold">Amrita</strong> & <strong className="text-primary font-bold">Nirvana</strong> models are optimal.</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-primary text-white font-accent flex items-center justify-center font-bold text-sm shrink-0 shadow-md group-hover:bg-accent transition-colors">2</div>
                  <div>
                    <h4 className="font-heading font-bold text-lg text-primary">Back Sleeper Postures</h4>
                    <p className="text-neutral-dark/70 text-sm md:text-base mt-1.5 leading-relaxed">Requires robust resistance under the lower lumbar area to keep vertebrae floating. Our <strong className="text-primary font-bold">Arogya</strong> & <strong className="text-primary font-bold">Sthira</strong> models prevent back hyperextension.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scientific diagnostic checklist */}
            <div className="bg-neutral-light/60 p-8 md:p-10 rounded-[2rem] border border-brand-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8" />
              <h4 className="font-heading font-bold text-primary text-xl mb-4 relative z-10">Did Suresh Direct You?</h4>
              <p className="text-sm text-neutral-dark/80 leading-relaxed mb-6 font-body relative z-10">
                Suresh coordinates personal back-care recommendations on physical mattress stiffness. He suggests:
              </p>
              
              <ul className="space-y-4 text-sm md:text-base font-body text-neutral-dark/80 relative z-10">
                <li className="flex items-start gap-3 p-3 bg-white/60 rounded-xl border border-brand-200/40">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Choose <strong className="text-primary font-bold">Nirvana 8"</strong> if you have severe spine stiffness and want adjustable 7-Zone target realignment.</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-white/60 rounded-xl border border-brand-200/40">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Choose <strong className="text-primary font-bold">Arogya / Sthira</strong> if doctors recommended a firm orthopedic surface for joint pain relief.</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-white/60 rounded-xl border border-brand-200/40">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Choose <strong className="text-primary font-bold">Amrita 10"</strong> if you prefer the thick, buoyant feel of standard hotel beds with natural elasticity.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-12">
            <div className="max-w-3xl text-left">
              <span className="text-[10px] font-accent text-accent uppercase tracking-widest bg-accent/10 border border-accent/20 px-3 py-1 rounded-md font-bold mb-4 inline-block">SAFETY AUDITS</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight mt-2">
                Certified Safe For Sensitive Skin and Infants
              </h2>
              <p className="text-neutral-dark/80 text-sm md:text-base mt-4 leading-relaxed font-body">
                Sleep products are direct contact points for open skin pores and night respiratory systems. RelaxPro raw rubber latex sap is audited and certified by leading global agencies:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cert 1 */}
              <div className="bg-white p-8 rounded-[2rem] border border-brand-200/60 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF4E5] flex items-center justify-center text-orange-600 font-bold mb-6 font-heading text-lg border border-orange-200 group-hover:scale-110 transition-transform">
                  GOLS
                </div>
                <h4 className="font-heading font-bold text-primary text-xl">Global Organic Latex Standard</h4>
                <p className="text-sm font-body text-neutral-dark/70 leading-relaxed mt-3">
                  Mandates that 100% of latex sap must be grown under organic procedures without synthetic fertilizers or GMOs. Audited at Kerala plantations.
                </p>
              </div>

              {/* Cert 2 */}
              <div className="bg-white p-8 rounded-[2rem] border border-brand-200/60 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F0FE] flex items-center justify-center text-blue-600 font-bold mb-6 font-heading text-sm border border-blue-200 group-hover:scale-110 transition-transform text-center leading-tight">
                  Oeko<br/>Tex
                </div>
                <h4 className="font-heading font-bold text-primary text-xl">Oeko-Tex Standard-100</h4>
                <p className="text-sm font-body text-neutral-dark/70 leading-relaxed mt-3">
                  Guarantees textiles are fully audited to be clear of harmful dyes, heavy heavy-metal residues, toxic formaldehyde, and pesticides. Safe for infants.
                </p>
              </div>

              {/* Cert 3 */}
              <div className="bg-white p-8 rounded-[2rem] border border-brand-200/60 shadow-sm hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-[#E6F4EA] flex items-center justify-center text-emerald-600 font-bold mb-6 font-heading text-lg border border-emerald-200 group-hover:scale-110 transition-transform">
                  ECO
                </div>
                <h4 className="font-heading font-bold text-primary text-xl">Eco-Institut Certified</h4>
                <p className="text-sm font-body text-neutral-dark/70 leading-relaxed mt-3">
                  Direct evaluation of chemical emissions and product purities conducted in Germany. Guarantees zero hazardous off-gassing issues.
                </p>
              </div>
            </div>
          </div>
        )}
        </motion.div>
      </AnimatePresence>

      {/* Mini CTA banner */}
      <section className="bg-primary text-white rounded-[2.5rem] p-10 md:p-12 font-body mt-20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="max-w-2xl relative z-10">
          <span className="text-[11px] tracking-widest text-accent font-accent font-bold block uppercase mb-2">FACTORY DIRECT ASSURANCE</span>
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight">Choose the mattress designed for your back</h3>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mt-3 max-w-xl">
            RelaxPro provides orthopedic clarity by eliminating retail agent costs. Start side-by-side spec comparison to select the exact alignment you need.
          </p>
        </div>
        <Link
          to="/compare"
          className="bg-white hover:bg-neutral-light text-primary px-8 py-4.5 rounded-2xl text-[13px] font-bold font-accent tracking-widest uppercase shrink-0 transition-all cursor-pointer shadow-lg active:scale-95 relative z-10"
        >
          Compare All 13 Models
        </Link>
      </section>
    </div>
  );
}
