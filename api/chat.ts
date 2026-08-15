import type { VercelRequest, VercelResponse } from '@vercel/node';
import { chatCompletion, type LlmMessage } from './_lib/llm';
import { buildSystemPrompt } from './_lib/prompt';
import { TOOL_SCHEMAS, runTool } from './_lib/tools';
import { checkRateLimit } from './_lib/ratelimit';
import type { ChatRequestBody, ChatResponseBody, LanguageKey, RecommendedProduct } from './_lib/types';

const CONNECTION_ERROR =
  "Sorry, I'm having trouble connecting right now. Please try again or contact our RelaxPro expert on WhatsApp.";

const MAX_TOOL_ROUNDS = 3;
const MAX_HISTORY = 20;
const MAX_MESSAGE_CHARS = 1000;
const LANGUAGES: LanguageKey[] = ['tenglish', 'english', 'telugu', 'hindi'];

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(',')[0]?.trim() || 'unknown';
}

function errorResponse(res: VercelResponse, language: LanguageKey, status = 503) {
  const body: ChatResponseBody = {
    message: CONNECTION_ERROR,
    products: [],
    intent: 'error',
    language,
  };
  return res.status(status).json(body);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as Partial<ChatRequestBody>;
  const language: LanguageKey = LANGUAGES.includes(body?.language as LanguageKey)
    ? (body!.language as LanguageKey)
    : 'english';

  if (!Array.isArray(body?.messages) || body.messages.length === 0) {
    return res.status(400).json({ error: 'messages is required' });
  }

  const history = body.messages
    .slice(-MAX_HISTORY)
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  if (history.length === 0) {
    return res.status(400).json({ error: 'messages is required' });
  }

  const limit = checkRateLimit(clientIp(req));
  if (!limit.allowed) return errorResponse(res, language, 429);

  const messages: LlmMessage[] = [
    { role: 'system', content: buildSystemPrompt(language) },
    ...(history as LlmMessage[]),
  ];

  let products: RecommendedProduct[] = [];
  let intent = 'general';

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const completion = await chatCompletion({ messages, tools: TOOL_SCHEMAS });

      if (completion.toolCalls.length === 0) {
        const body: ChatResponseBody = {
          message: completion.content || CONNECTION_ERROR,
          products,
          intent,
          language,
        };
        return res.status(200).json(body);
      }

      messages.push(completion.raw as LlmMessage);

      for (const call of completion.toolCalls) {
        const result = await runTool(call.name, call.argumentsJson);
        if (result.products.length > 0) products = result.products;
        if (result.intent !== 'error') intent = result.intent;
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result.data),
        });
      }
    }

    // Tool budget exhausted — ask for a final answer with tools withheld.
    const final = await chatCompletion({ messages });
    const body: ChatResponseBody = {
      message: final.content || CONNECTION_ERROR,
      products,
      intent,
      language,
    };
    return res.status(200).json(body);
  } catch (err) {
    console.error('[api/chat]', err);
    return errorResponse(res, language);
  }
}
