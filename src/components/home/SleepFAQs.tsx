import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, Sparkles, HelpCircle, Shield, RefreshCw, PenTool, CheckCircle, Info } from 'lucide-react';
import BlurFade from '../ui/BlurFade';

interface FAQItem {
  id: string;
  category: 'care' | 'durability' | 'customization';
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export default function SleepFAQs() {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'care' | 'durability' | 'customization'>('all');

  const faqs = useMemo<FAQItem[]>(() => [
    {
      id: 'faq-1',
      category: 'durability',
      question: 'How durable is natural organic latex compared to memory foam or spring mattresses?',
      answer: 'Natural latex lasts 15-20 years without sagging, unlike synthetic memory foam (5-7 years) or spring mattresses that quickly weaken.',
      icon: <Shield className="w-5 h-5 text-accent shrink-0" />
    },
    {
      id: 'faq-2',
      category: 'care',
      question: 'How do I clean and care for my RelaxPro 100% natural latex mattress?',
      answer: 'Use a breathable protector. Spot-clean with mild soap, avoid direct sunlight, and rotate 180° every 6 months.',
      icon: <RefreshCw className="w-5 h-5 text-accent shrink-0" />
    },
    {
      id: 'faq-3',
      category: 'customization',
      question: 'Can I request custom sizes, custom thickness profiles, or side-by-side customization?',
      answer: 'Yes! We craft custom sizes, specific thicknesses (4″-10″), and offer Split Dual-Comfort (e.g., firm on one side, soft on the other).',
      icon: <PenTool className="w-5 h-5 text-accent shrink-0" />
    },
    {
      id: 'faq-4',
      category: 'durability',
      question: 'Does natural latex trap body heat or run hot in summer?',
      answer: 'No. Natural latex has an open-cell structure with pincore holes that circulate air naturally, keeping you cool and sweat-free year-round.',
      icon: <Sparkles className="w-5 h-5 text-accent shrink-0" />
    },
    {
      id: 'faq-5',
      category: 'care',
      question: 'What kind of bed base or frame is ideal for a natural latex mattress?',
      answer: 'A flat wooden board or closely slatted frame is ideal. Avoid saggy spring bases or curved frames that compromise alignment.',
      icon: <CheckCircle className="w-5 h-5 text-accent shrink-0" />
    },
    {
      id: 'faq-6',
      category: 'customization',
      question: 'What is the structural difference between GOLS-certified rubber and GOTS-certified textiles?',
      answer: 'GOLS certifies the core is pure organic rubber without synthetic fillers. GOTS certifies the outer cover uses biological organic cotton.',
      icon: <Info className="w-5 h-5 text-accent shrink-0" />
    }
  ], []);

  // Filter FAQs based on category filter and search term
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery, faqs]);

  const toggleFaq = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div id="sleep-faqs-section" className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20">
      <BlurFade delay={0.1}>
        {/* Title and subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] tracking-widest font-accent font-bold text-accent uppercase bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5" /> FACTORY-DIRECT SLEEP EDUCATION
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-6 text-primary leading-tight">
            Sleep FAQs & Latexmax Care Guides
          </h2>
          <p className="text-neutral-dark/70 text-sm md:text-base mt-4 leading-relaxed font-body">
            Have questions about customized dimensions, long-term GOLS durability, or keeping your organic sleep core fresh? Suresh and the engineering team outline everything below.
          </p>
        </div>
      </BlurFade>

      {/* Interactive Toolbar: Search & Categories */}
      <BlurFade delay={0.15}>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] border border-brand-200/50 p-4 md:p-5 shadow-lg shadow-brand-500/5 mb-8 md:mb-10 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6 font-body text-sm relative z-10">
          {/* Categories Tab Group with horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none snap-x snap-mandatory">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-accent tracking-wide transition-all cursor-pointer shadow-sm shrink-0 snap-start ${
                activeCategory === 'all'
                  ? 'bg-primary text-white font-bold'
                  : 'bg-neutral-light hover:bg-brand-100 text-primary/70 border border-brand-200/40'
              }`}
            >
              All Guides
            </button>
            <button
              onClick={() => setActiveCategory('durability')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-accent tracking-wide transition-all cursor-pointer shadow-sm shrink-0 snap-start ${
                activeCategory === 'durability'
                  ? 'bg-primary text-white font-bold'
                  : 'bg-neutral-light hover:bg-brand-100 text-primary/70 border border-brand-200/40'
              }`}
            >
              Durability & Cores
            </button>
            <button
              onClick={() => setActiveCategory('care')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-accent tracking-wide transition-all cursor-pointer shadow-sm shrink-0 snap-start ${
                activeCategory === 'care'
                  ? 'bg-primary text-white font-bold'
                  : 'bg-neutral-light hover:bg-brand-100 text-primary/70 border border-brand-200/40'
              }`}
            >
              Care & Setting Up
            </button>
            <button
              onClick={() => setActiveCategory('customization')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-accent tracking-wide transition-all cursor-pointer shadow-sm shrink-0 snap-start ${
                activeCategory === 'customization'
                  ? 'bg-primary text-white font-bold'
                  : 'bg-neutral-light hover:bg-brand-100 text-primary/70 border border-brand-200/40'
              }`}
            >
              Custom Sizing
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex items-center w-full md:max-w-xs">
            <Search className="absolute left-4 w-4 h-4 text-primary/40" />
            <input
              type="text"
              placeholder="Search Sleep FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-light hover:bg-white focus:bg-white text-sm text-primary border border-brand-200/60 focus:border-accent focus:ring-4 focus:ring-accent/10 rounded-xl outline-none transition-all font-body placeholder:text-primary/40 shadow-sm"
            />
          </div>
        </div>
      </BlurFade>

      {/* Accordion List Container */}
      <BlurFade delay={0.2}>
        <div className="space-y-4 min-h-[160px] relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    layout="position"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`bg-white/90 backdrop-blur-md rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? 'border-brand-300 shadow-xl shadow-brand-500/10 ring-1 ring-brand-300 scale-[1.01]' 
                        : 'border-brand-200/50 hover:border-brand-300 hover:shadow-md shadow-sm'
                    }`}
                  >
                    {/* Header trigger button */}
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 md:px-6 py-4 md:py-5 text-left flex items-start gap-4 md:gap-5 cursor-pointer focus:outline-none select-none group"
                    >
                      <div className={`p-3 rounded-xl transition-all duration-300 mt-1 shadow-sm shrink-0 hidden sm:flex items-center justify-center ${isOpen ? 'bg-primary text-white' : 'bg-neutral-light border border-brand-200/50 group-hover:bg-brand-100 group-hover:scale-110'}`}>
                        {faq.icon}
                      </div>

                      <div className="flex-1 pr-2 pt-1">
                        <span className="font-accent text-[10px] tracking-widest font-bold uppercase text-accent block mb-1.5 opacity-80">
                          {faq.category === 'durability' ? 'Durability Guides' : faq.category === 'care' ? 'Care & Lifespan' : 'Custom Tailoring'}
                        </span>
                        <h3 className="font-heading font-bold text-base md:text-xl text-primary tracking-tight leading-snug group-hover:text-accent transition-colors">
                          {faq.question}
                        </h3>
                      </div>

                      <div className="shrink-0 mt-2 md:mt-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-accent/10' : 'bg-neutral-light group-hover:bg-brand-100'}`}>
                          <ChevronDown 
                            className={`w-4 h-4 md:w-5 h-5 transition-transform duration-500 ease-out ${
                              isOpen ? 'transform rotate-180 text-accent' : 'text-primary/50'
                            }`} 
                          />
                        </div>
                      </div>
                    </button>

                    {/* Animated accordion body content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-4 md:px-6 pb-5 md:pb-6 pt-2 md:ml-[68px] border-t border-brand-200/30">
                            <p className="font-body text-sm md:text-base text-neutral-dark/80 leading-relaxed max-w-3xl">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                layout
                className="text-center py-16 px-4 border-2 border-dashed border-brand-200/60 rounded-3xl bg-neutral-light/50 backdrop-blur-sm"
              >
                <HelpCircle className="w-10 h-10 text-primary/30 mx-auto mb-4" />
                <p className="text-primary/60 font-body text-sm">No matching question found in our knowledge base.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="mt-4 text-[13px] font-accent font-bold tracking-wide text-accent hover:text-primary cursor-pointer transition-colors px-4 py-2 rounded-xl hover:bg-white shadow-sm"
                >
                  Clear search and categories
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BlurFade>
    </div>
  );
}
