import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { getSiteSettings } from '../../lib/queries';

const defaultItems = [
  'GOLS Certified Organic',
  'Oeko-Tex Standard 100',
  'Zero VOC Emissions',
  'ISO 9001 Certified'
];

// Consumer promises (warranty/trial/shipping) are no longer marketed —
// never surface them in the certification marquee even if present in the CMS.
const REMOVED_PROMISE_TERMS = ['warranty', 'guarantee', 'replacement', 'trial', 'refund', 'return', 'shipping', 'delivery'];

export default function CertificationMarquee() {
  const [items, setItems] = useState(defaultItems);

  useEffect(() => {
    getSiteSettings().then(s => {
      const certs = s?.footer?.certifications;
      if (certs?.length > 0) {
        const cleaned = certs
          .map((c: any) => (typeof c === 'string' ? c : c.name))
          .filter((name: string) => name && !REMOVED_PROMISE_TERMS.some(term => name.toLowerCase().includes(term)));
        if (cleaned.length > 0) {
          setItems(cleaned);
        }
      }
    }).catch(() => {});
  }, []);

  const list = [...items, ...items, ...items, ...items];

  return (
    <section className="bg-sky-100/20 border-y border-brand-200/20 overflow-hidden py-6 md:py-8">
      <div className="relative flex w-full">
        {/* Left/Right Fades */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-sky-100/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-sky-100/30 to-transparent z-10 pointer-events-none" />

        {/* Marquee Content */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 40, // Slow, elegant speed
          }}
          className="flex items-center whitespace-nowrap min-w-max"
        >
          {list.map((item, i) => (
            <div key={i} className="flex items-center">
              <span className="text-lg md:text-2xl font-heading text-ink-900/80 select-none px-6 md:px-12">
                {item}
              </span>
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-brand-600/60 mx-2" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
