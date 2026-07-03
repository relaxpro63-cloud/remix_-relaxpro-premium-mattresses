import React from 'react';
import PageShell from '../../components/layout/PageShell';

export default function SleepSciencePage() {
  return (
    <PageShell
      title="Sleep Science & Orthopedic Spine Support | RelaxPro Education"
      description="Understand standard back alignment, the benefits of pincore ventilated natural latex, and how sleep ergonomics can cure chronic spine pain."
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] tracking-widest font-accent text-accent uppercase font-bold bg-accent/10 px-4 py-1.5 rounded-full inline-block">Sleep Education</span>
          <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight mt-4 text-brand-950">Sleep Science & Orthopedic Spine Support</h1>
          <p className="text-gray-500 text-sm mt-3 font-sans leading-relaxed">Understand standard back alignment, the benefits of pincore ventilated natural latex, and how sleep ergonomics can cure chronic spine pain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '7-Zone Spine Alignment', desc: 'Head to hip segmented density zones keep the spine in neutral posture, reducing morning back stiffness and nerve pinch points.' },
            { title: 'Natural Latex Elasticity', desc: 'GOLS certified natural latex rebounds instantly and isolates motion, so your partner’s movements do not wake you.' },
            { title: 'Heat Dissipation', desc: 'Pincore vent channels and Oeko-Tex quilted covers allow continuous airflow, preventing heat buildup during deep sleep cycles.' },
          ].map((item) => (
            <div key={item.title} className="bg-white p-6 md:p-8 rounded-2xl border border-brand-200/40 shadow-sm space-y-3">
              <h3 className="font-heading font-bold text-primary">{item.title}</h3>
              <p className="text-sm text-neutral-dark/70 leading-relaxed font-body">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
