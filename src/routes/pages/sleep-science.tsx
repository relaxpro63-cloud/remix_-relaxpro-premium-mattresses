import React from 'react';
import PageShell from '../../components/layout/PageShell';

export default function SleepSciencePage() {
  return (
    <PageShell
      title="Sleep Science & Orthopedic Spine Support | RelaxPro Education"
      description="Understand standard back alignment, the benefits of pincore ventilated natural latex, and how sleep ergonomics can cure chronic spine pain."
    >
      <div className="rp-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start py-16 md:py-24">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-accent font-bold uppercase tracking-editorial text-accent bg-accent/10 px-4 py-1.5 rounded-full">
              The Science
            </span>
            <h1 className="rp-display text-primary">
              Sleep science and orthopedic spine support
            </h1>
            <p className="rp-body leading-loose drop-cap">
              Understand spine alignment, ventilated natural latex, and how ergonomic support changes everyday sleep quality.
            </p>
            <div className="w-16 h-px bg-brand-200" aria-hidden="true" />
            <div className="space-y-4">
              <p className="rp-body text-neutral-dark/70 leading-loose">
                Standard bedsprings and foam mattresses allow the spine to fall out of neutral alignment under hip and shoulder weight. The result: compressed intervertebral discs, reduced circulation, and morning stiffness that lasts hours.
              </p>
              <p className="rp-body text-neutral-dark/70 leading-loose">
                RelaxPro's 7-zone latex architecture replaces uniform spring response with segmented density. Each zone targets a skeletal landmark — head, shoulders, lumbar, hips, thighs, calves, feet — distributing load without bottoming out.
              </p>
              <p className="rp-body text-neutral-dark/70 leading-loose">
                Natural Dunlop latex from Kerala adds passive ventilation through its open-cell pincore structure. Unlike synthetic foam, it does not trap heat, which keeps cortisol levels low during deep NREM sleep cycles.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <img
                src="https://images.unsplash.com/photo-1542840410-3092f99611a3?auto=format&fit=crop&w=800&q=80"
                alt="Natural latex mattress layer detail showing pincore ventilation structure"
                className="w-full aspect-[4/5] object-cover rounded-[1.5rem] shadow-sm"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-16 md:pb-24">
          {[
            {
              title: '7-Zone Spine Alignment',
              desc: 'Head to hip segmented density zones keep the spine in neutral posture, reducing morning back stiffness and nerve pinch points.',
            },
            {
              title: 'Natural Latex Elasticity',
              desc: "GOLS certified natural latex rebounds instantly and isolates motion, so your partner's movements do not wake you.",
            },
            {
              title: 'Heat Dissipation',
              desc: 'Pincore vent channels and Oeko-Tex quilted covers allow continuous airflow, preventing heat buildup during deep sleep cycles.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white p-6 md:p-8 rounded-3xl border border-brand-200 shadow-sm space-y-3"
            >
              <h3 className="font-heading font-bold text-primary">{item.title}</h3>
              <p className="text-sm text-neutral-dark/70 leading-relaxed font-body">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
