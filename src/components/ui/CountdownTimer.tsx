import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  /** ISO datetime string (e.g. from Sanity `datetime` field) */
  endDate: string;
  /** Label shown above the digits */
  label?: string;
  /** Optional className for the wrapper */
  className?: string;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function parseEndDate(endDate: string): number | null {
  const time = new Date(endDate).getTime();
  return Number.isNaN(time) ? null : time;
}

function computeRemaining(target: number): Remaining {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    expired: diff <= 0,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function CountdownTimer({
  endDate,
  label = 'Ends in',
  className = '',
}: CountdownTimerProps) {
  const target = parseEndDate(endDate);
  const [remaining, setRemaining] = useState<Remaining | null>(() =>
    target ? computeRemaining(target) : null
  );

  useEffect(() => {
    if (!target) return;
    let id = 0;
    const tick = () => {
      const next = computeRemaining(target);
      setRemaining(next);
      if (next.expired) window.clearInterval(id);
    };
    id = window.setInterval(tick, 1000);
    tick();
    return () => window.clearInterval(id);
  }, [target]);

  // Invalid date → render nothing.
  if (!target || !remaining) return null;

  const units = [
    { value: String(remaining.days), label: 'Days' },
    { value: pad(remaining.hours), label: 'Hrs' },
    { value: pad(remaining.minutes), label: 'Min' },
    { value: pad(remaining.seconds), label: 'Sec' },
  ];

  return (
    <div className={className}>
      <div className="flex items-center gap-1.5">
        <Timer className="w-3 h-3 text-brand-300/80" />
        <span className="text-[9px] xs:text-[10px] font-accent font-bold uppercase tracking-[0.18em] text-white/50">
          {remaining.expired ? 'Ended' : label}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 mt-2 max-w-[300px]">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center rounded-lg bg-white/10 border border-white/15 backdrop-blur-sm py-2 px-1"
          >
            <span className="font-mono font-bold text-brand-200 tabular-nums leading-none text-base xs:text-lg md:text-xl">
              {unit.value}
            </span>
            <span className="mt-1 text-[7px] xs:text-[8px] font-accent font-semibold uppercase tracking-[0.12em] text-white/40">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
