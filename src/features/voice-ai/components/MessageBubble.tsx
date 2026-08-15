import React from 'react';
import { Volume2 } from 'lucide-react';
import type { ChatMessage } from '../types';

interface Props {
  message: ChatMessage;
  onReplay?: (text: string) => void;
}

export default function MessageBubble({ message, onReplay }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-brand-600 text-white rounded-br-sm'
            : 'bg-linen-100 text-graphite-900 rounded-bl-sm',
        ].join(' ')}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && onReplay && (
          <button
            type="button"
            onClick={() => onReplay(message.content)}
            aria-label="Replay this message"
            className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-graphite-500 hover:text-brand-600 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
            Replay
          </button>
        )}
      </div>
    </div>
  );
}
