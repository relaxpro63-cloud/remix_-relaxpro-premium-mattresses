import type { LanguageKey } from './languages';
import type { ChatMessage, ChatResponseBody } from '../types';

export const CONNECTION_ERROR =
  "Sorry, I'm having trouble connecting right now. Please try again or contact our RelaxPro expert on WhatsApp.";

const TIMEOUT_MS = 25_000;

export async function postChat(params: {
  sessionId: string;
  messages: ChatMessage[];
  language: LanguageKey;
}): Promise<ChatResponseBody> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        sessionId: params.sessionId,
        language: params.language,
        messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    // The server returns the fallback copy in its own error body; use it when present.
    const data = (await response.json().catch(() => null)) as ChatResponseBody | null;
    if (!data || typeof data.message !== 'string') {
      return { message: CONNECTION_ERROR, products: [], intent: 'error', language: params.language };
    }
    return { ...data, products: Array.isArray(data.products) ? data.products : [] };
  } catch {
    return { message: CONNECTION_ERROR, products: [], intent: 'error', language: params.language };
  } finally {
    clearTimeout(timer);
  }
}
