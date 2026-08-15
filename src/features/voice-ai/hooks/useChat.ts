import { useCallback, useRef, useState } from 'react';
import { postChat } from '../lib/api';
import { DEFAULT_LANGUAGE, type LanguageKey } from '../lib/languages';
import type { ChatMessage, RecommendedProduct } from '../types';

const SESSION_KEY = 'relaxpro_ai_session';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

let messageCounter = 0;
function nextId(): string {
  messageCounter += 1;
  return `m${messageCounter}`;
}

export type ChatStatus = 'idle' | 'sending';

export interface UseChatResult {
  messages: ChatMessage[];
  products: RecommendedProduct[];
  status: ChatStatus;
  intent: string;
  language: LanguageKey;
  setLanguage: (language: LanguageKey) => void;
  send: (text: string) => Promise<string | null>;
  reset: () => void;
  sessionId: string;
}

export function useChat(): UseChatResult {
  const sessionIdRef = useRef<string>(getSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [intent, setIntent] = useState('general');
  const [language, setLanguage] = useState<LanguageKey>(DEFAULT_LANGUAGE);

  const send = useCallback(
    async (text: string): Promise<string | null> => {
      const trimmed = text.trim();
      if (!trimmed || status === 'sending') return null;

      const userMessage: ChatMessage = { id: nextId(), role: 'user', content: trimmed };
      const history = [...messages, userMessage];

      setMessages(history);
      setStatus('sending');

      const response = await postChat({
        sessionId: sessionIdRef.current,
        messages: history,
        language,
      });

      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: response.message }]);
      setProducts(response.products);
      setIntent(response.intent);
      setStatus('idle');

      return response.message;
    },
    [messages, status, language],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setProducts([]);
    setIntent('general');
    setStatus('idle');
  }, []);

  return {
    messages,
    products,
    status,
    intent,
    language,
    setLanguage,
    send,
    reset,
    sessionId: sessionIdRef.current,
  };
}
