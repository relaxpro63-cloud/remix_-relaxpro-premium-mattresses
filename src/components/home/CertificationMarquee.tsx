import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const ITEMS = [
  'GOLS Certified Organic',
  'Oeko-Tex Standard 100',
  'FSC Certified Wood',
  'Zero VOC Emissions',
  'Eco-Institut Verified',
  'ISO 9001 Certified'
];

export default function CertificationMarquee() {
  const list = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS]; // Sufficiently duplicate to fill screen

  return (
    <section className="bg-secondary border-y border-brand-200/30 overflow-hidden py-6 md:py-8">
      <div className="relative flex w-full">
        {/* Left/Right Fades */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

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
              <span className="text-lg md:text-2xl font-heading text-primary/80 select-none px-6 md:px-12">
                {item}
              </span>
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-accent/60 mx-2" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
