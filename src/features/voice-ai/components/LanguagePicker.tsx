import React from 'react';
import { enabledLanguages, type LanguageKey } from '../lib/languages';

interface Props {
  value: LanguageKey;
  onChange: (language: LanguageKey) => void;
}

export default function LanguagePicker({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Conversation language"
      className="flex gap-1.5 rounded-full bg-linen-100 p-1"
    >
      {enabledLanguages().map((language) => {
        const selected = language.key === value;
        return (
          <button
            key={language.key}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(language.key)}
            className={[
              'rounded-full px-3 py-1 text-[11px] font-semibold transition-colors',
              selected ? 'bg-brand-600 text-white' : 'text-graphite-600 hover:text-brand-700',
            ].join(' ')}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
}
