import React from 'react';
import { Award, Leaf, ShieldAlert, BadgeCheck, FlameKindling, Sparkles, HeartPulse } from 'lucide-react';

const LOGO_ITEMS = [
  { text: "100% GOLS Certified Organic Latex", icon: Leaf },
  { text: "Standard-100 by OEKO-TEX® Verified Safe", icon: Award },
  { text: "German ECO-Institut Chemical Emission Safe", icon: BadgeCheck },
  { text: "Zero Hazardous VOC Off-Gassing Guarantee", icon: ShieldAlert },
  { text: "Direct Western Ghats Plantation Sourcing", icon: Sparkles },
  { text: "101-Night No-Risk Spine Comfort Trial", icon: HeartPulse },
  { text: "Direct Jeedimetla Factory dispatch", icon: FlameKindling }
];

export default function Marquee() {
  const list = [...LOGO_ITEMS, ...LOGO_ITEMS, ...LOGO_ITEMS]; // Duplicate to guarantee fill width

  return (
    <div className="w-full bg-brand-100 border-y border-brand-200 overflow-hidden py-4 select-none">
      <div className="animate-marquee flex items-center gap-16 whitespace-nowrap">
        {list.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center gap-2 text-zinc-700 tracking-wider font-mono text-[10px] uppercase font-bold">
              <Icon className="w-4 h-4 text-brand-500" />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
