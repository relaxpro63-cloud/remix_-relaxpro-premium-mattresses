import React from 'react';
import { motion } from 'motion/react';
import { Truck, Leaf } from '@phosphor-icons/react';
import {
  AnimatedCounter,
  FadeUp,
  StaggerChildren,
  staggerItem,
  EASE_LUXURY,
} from '../motion/motionPrimitives';

const features = [
  {
    icon: Truck,
    title: 'White-glove delivery',
    desc: 'We deliver and set up in your bedroom. No hidden fees.',
    span: 'md:col-span-2',
  },
  {
    icon: Leaf,
    title: 'GOLS natural latex',
    desc: 'Kerala Dunlop latex. Zero synthetic fillers. Safe for family sleep.',
    span: 'md:col-span-2',
  },
];

const stats = [
  { value: 12700, suffix: '+', label: 'Sleepers served' },
  { value: 11, suffix: '', label: 'Mattress models' },
  { value: 3, suffix: '', label: 'Generations of craft' },
  { value: 17, suffix: '+', label: 'Years of expertise' },
];

export default function WhyChooseUs() {
  return (
    <>
      <section className="bg-bg px-4 py-20 md:px-8 md:py-32">
        <div className="mx-auto max-w-7xl">
          <FadeUp className="mb-10 max-w-2xl md:mb-14">
            <h2 className="text-3xl font-heading font-normal leading-[1.1] tracking-[-0.02em] text-primary md:text-5xl">
              Engineered for restorative sleep
            </h2>
            <p className="mt-4 max-w-lg font-body text-sm leading-relaxed text-muted md:text-base">
              Generations of mattress craft, pure materials, and policies that respect your night.
            </p>
          </FadeUp>

          <StaggerChildren
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
            stagger={0.07}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={staggerItem}
                  whileHover={{ y: -4, transition: { duration: 0.3, ease: EASE_LUXURY } }}
                  className={`${feature.span} rounded-[1.25rem] p-1.5 bg-primary/[0.03] ring-1 ring-border`}
                >
                  <div className="flex h-full flex-col rounded-[calc(1.25rem-0.25rem)] border border-border/60 bg-surface p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] md:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-primary/[0.04] text-accent">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-lg text-ink md:text-xl">{feature.title}</h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      <section className="border-y border-white/10 bg-primary px-4 py-14 md:px-8 md:py-16">
        <StaggerChildren
          className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-4"
          stagger={0.1}
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className={`text-center ${
                idx < stats.length - 1 ? 'md:border-r md:border-white/10' : ''
              }`}
            >
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                prefix={'prefix' in stat ? (stat as { prefix?: string }).prefix : undefined}
                className="font-heading text-3xl font-normal text-white md:text-4xl"
              />
              <div className="mx-auto mt-2 h-[2px] w-8 rounded-full bg-accent/40" />
              <p className="mt-2 font-accent text-[11px] font-semibold uppercase tracking-wider text-white/45">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </StaggerChildren>
      </section>
    </>
  );
}
