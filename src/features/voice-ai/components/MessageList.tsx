import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { ChatMessage } from '../types';

interface Props {
  messages: ChatMessage[];
  isSending: boolean;
  onReplay?: (text: string) => void;
  children?: React.ReactNode;
}

export default function MessageList({ messages, isSending, onReplay, children }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isSending]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      role="log"
      aria-live="polite"
      aria-label="Conversation with RelaxPro AI"
    >
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          <MessageBubble message={message} onReplay={onReplay} />
        </React.Fragment>
      ))}

      {children}

      {isSending && (
        <div className="flex justify-start" aria-label="RelaxPro AI is typing">
          <div className="bg-linen-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="w-1.5 h-1.5 rounded-full bg-graphite-400 animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
