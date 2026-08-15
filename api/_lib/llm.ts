import Groq from 'groq-sdk';

export const MODEL_ID = 'llama-3.3-70b-versatile';

export interface LlmToolCall {
  id: string;
  name: string;
  /** Raw JSON string as produced by the model. Always validate before use. */
  argumentsJson: string;
}

export type LlmMessage =
  | { role: 'system' | 'user'; content: string }
  | { role: 'assistant'; content: string | null; tool_calls?: any[] }
  | { role: 'tool'; tool_call_id: string; content: string };

export interface ChatCompletionResult {
  content: string;
  toolCalls: LlmToolCall[];
  /** The raw assistant message, to be pushed back into the conversation verbatim. */
  raw: any;
}

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY is not set');
    client = new Groq({ apiKey });
  }
  return client;
}

export async function chatCompletion(params: {
  messages: LlmMessage[];
  tools?: any[];
}): Promise<ChatCompletionResult> {
  const completion = await getClient().chat.completions.create({
    model: MODEL_ID,
    messages: params.messages as any,
    tools: params.tools,
    tool_choice: params.tools?.length ? 'auto' : undefined,
    temperature: 0.5,
    max_completion_tokens: 1024,
  });

  const message = completion.choices[0]?.message;
  const toolCalls: LlmToolCall[] = (message?.tool_calls ?? []).map((c: any) => ({
    id: c.id,
    name: c.function.name,
    argumentsJson: c.function.arguments ?? '{}',
  }));

  return {
    content: message?.content ?? '',
    toolCalls,
    raw: message,
  };
}
