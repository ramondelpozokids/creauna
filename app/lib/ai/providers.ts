export type AiProvider = 'gemini' | 'claude' | 'groq' | 'manus';
export type MotorId = 'visual' | 'copy' | 'code' | 'ux';

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionResult {
  content: string | null;
  provider: AiProvider | 'rules';
  motor?: MotorId;
}

/** Cada motor usa un proveedor distinto — sin revelar marcas al usuario */
export const MOTOR_PROVIDER: Record<MotorId, AiProvider> = {
  visual: 'gemini',
  copy: 'claude',
  code: 'gemini',
  ux: 'claude',
};

export function isProviderConfigured(provider: AiProvider): boolean {
  switch (provider) {
    case 'gemini':
      return Boolean(process.env.GEMINI_API_KEY?.trim());
    case 'claude':
      return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
    case 'groq':
      return Boolean(process.env.GROQ_API_KEY?.trim());
    case 'manus':
      return Boolean(process.env.MANUS_API_KEY?.trim());
    default:
      return false;
  }
}

export function getConfiguredProviders(): AiProvider[] {
  return (['gemini', 'claude', 'groq', 'manus'] as AiProvider[]).filter(isProviderConfigured);
}

function pickMotorForPrompt(prompt: string): MotorId {
  const lower = prompt.toLowerCase();
  if (/testimonio|texto|copy|seo|redacci|titulo|párrafo|paragraph|headline/i.test(lower)) return 'copy';
  if (/código|code|animaci|html|css|estructura|structure/i.test(lower)) return 'code';
  if (/ux|experiencia|conversi|navegaci|usabilidad|clara|luminosa/i.test(lower)) return 'ux';
  return 'visual';
}

async function callGemini(messages: AiMessage[], maxTokens: number): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
  const system = messages.find((m) => m.role === 'system')?.content || '';
  const userParts = messages.filter((m) => m.role !== 'system').map((m) => m.content).join('\n\n');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents: [{ role: 'user', parts: [{ text: userParts }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: maxTokens },
      }),
    }
  );

  if (!res.ok) {
    console.error('gemini error:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
}

async function callClaude(messages: AiMessage[], maxTokens: number): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.CLAUDE_MODEL?.trim() || 'claude-sonnet-4-20250514';
  const system = messages.find((m) => m.role === 'system')?.content;
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: system || undefined,
      messages: chatMessages,
    }),
  });

  if (!res.ok) {
    console.error('claude error:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const block = data?.content?.find((b: { type: string }) => b.type === 'text');
  return block?.text?.trim() || null;
}

async function callGroq(messages: AiMessage[], maxTokens: number): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant';

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    console.error('groq error:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

async function callProvider(
  provider: AiProvider,
  messages: AiMessage[],
  maxTokens: number
): Promise<string | null> {
  switch (provider) {
    case 'gemini':
      return callGemini(messages, maxTokens);
    case 'claude':
      return callClaude(messages, maxTokens);
    case 'groq':
      return callGroq(messages, maxTokens);
    case 'manus':
      return null; // Manus es agente async — no para cambios instantáneos del Studio
    default:
      return null;
  }
}

const FALLBACK_ORDER: AiProvider[] = ['gemini', 'claude', 'groq'];

export async function chatCompletion(
  messages: AiMessage[],
  options?: { temperature?: number; maxTokens?: number; motor?: MotorId; prompt?: string }
): Promise<AiCompletionResult> {
  const maxTokens = options?.maxTokens ?? 1200;
  const motor = options?.motor || pickMotorForPrompt(options?.prompt || messages.at(-1)?.content || '');
  const primary = MOTOR_PROVIDER[motor];

  const tryOrder = [primary, ...FALLBACK_ORDER.filter((p) => p !== primary)];

  for (const provider of tryOrder) {
    if (!isProviderConfigured(provider)) continue;
    const content = await callProvider(provider, messages, maxTokens);
    if (content) return { content, provider, motor };
  }

  return { content: null, provider: 'rules', motor };
}

/** Manus: agente completo para tareas pesadas (no instantáneo) */
export async function createManusTask(prompt: string): Promise<{ taskId: string } | null> {
  const apiKey = process.env.MANUS_API_KEY?.trim();
  if (!apiKey) return null;

  const res = await fetch('https://api.manus.ai/v1/tasks', {
    method: 'POST',
    headers: {
      'x-manus-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      agentProfile: 'manus-1.6',
    }),
  });

  if (!res.ok) {
    console.error('manus error:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const taskId = data?.task_id || data?.id;
  return taskId ? { taskId } : null;
}
