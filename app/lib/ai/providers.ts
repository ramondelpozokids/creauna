export type AiProvider = 'gemini' | 'claude' | 'openai' | 'groq' | 'manus';
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
  code: 'openai',   // Motor de Código (rol tipo Composer)
  ux: 'claude',
};

export function isProviderConfigured(provider: AiProvider): boolean {
  const minLen = 20;
  switch (provider) {
    case 'gemini':
      return (process.env.GEMINI_API_KEY?.trim().length ?? 0) >= minLen;
    case 'claude':
      return (process.env.ANTHROPIC_API_KEY?.trim().length ?? 0) >= minLen;
    case 'openai':
      return (process.env.OPENAI_API_KEY?.trim().length ?? 0) >= minLen;
    case 'groq':
      return (process.env.GROQ_API_KEY?.trim().length ?? 0) >= minLen;
    case 'manus':
      return (process.env.MANUS_API_KEY?.trim().length ?? 0) >= minLen;
    default:
      return false;
  }
}

export function getConfiguredProviders(): AiProvider[] {
  return (['gemini', 'claude', 'openai', 'groq', 'manus'] as AiProvider[]).filter(isProviderConfigured);
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

  const primary = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
  const models = [...new Set([primary, 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'])];
  const system = messages.find((m) => m.role === 'system')?.content || '';
  const userParts = messages.filter((m) => m.role !== 'system').map((m) => m.content).join('\n\n');

  for (const model of models) {
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

    if (res.ok) {
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
    }

    const errText = await res.text();
    if (res.status === 429 || res.status === 404) {
      console.error(`gemini ${model} ${res.status}, fallback…`, errText.slice(0, 120));
      continue;
    }
    console.error('gemini error:', res.status, errText);
    return null;
  }

  return null;
}

async function callClaude(messages: AiMessage[], maxTokens: number): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.CLAUDE_MODEL?.trim() || 'claude-sonnet-4-6';
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

async function callOpenAI(messages: AiMessage[], maxTokens: number): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
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
    console.error('openai error:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
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
    case 'openai':
      return callOpenAI(messages, maxTokens);
    case 'groq':
      return callGroq(messages, maxTokens);
    case 'manus':
      return null; // Manus es agente async — no para cambios instantáneos del Studio
    default:
      return null;
  }
}

const FALLBACK_ORDER: AiProvider[] = ['gemini', 'claude', 'openai', 'groq'];

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
