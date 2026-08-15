import React from 'react';

export const QUICK_ACTIONS = [
  { label: 'Find My Mattress', prompt: 'Help me find the right mattress.' },
  { label: 'Under ₹20K', prompt: 'Show me the best mattresses under 20000.' },
  { label: 'Compare Mattresses', prompt: 'Compare your mattresses for me.' },
  { label: 'Help Me Choose Size', prompt: 'Help me choose the right mattress size.' },
  { label: 'Latex vs Foam', prompt: 'What is the difference between latex and foam mattresses?' },
  { label: 'Talk to Expert', prompt: 'I would like to talk to a RelaxPro expert.' },
] as const;

interface Props {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export default function QuickActions({ onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3" aria-label="Suggested questions">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(action.prompt)}
          className="rounded-full border border-graphite-200 bg-linen-50 px-3 py-1.5 text-[11px] font-medium text-graphite-700 transition-colors hover:border-brand-500 hover:text-brand-700 disabled:opacity-40"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
