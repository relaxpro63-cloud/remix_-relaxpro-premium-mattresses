import React from 'react';
import { Mic, Square } from 'lucide-react';

interface Props {
  isListening: boolean;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function MicButton({ isListening, disabled, onStart, onStop }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={isListening ? onStop : onStart}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      aria-pressed={isListening}
      className={[
        'relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors disabled:opacity-40',
        isListening
          ? 'bg-red-500 text-white'
          : 'bg-linen-100 text-graphite-700 hover:bg-linen-200 hover:text-brand-700',
      ].join(' ')}
    >
      {isListening && (
        <span
          className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-30"
          aria-hidden="true"
        />
      )}
      {isListening ? (
        <Square className="relative h-4 w-4 fill-current" aria-hidden="true" />
      ) : (
        <Mic className="relative h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
