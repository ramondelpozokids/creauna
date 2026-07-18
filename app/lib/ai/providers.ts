export type AiProvider = 'gemini' | 'claude' | 'openai' | 'qwen' | 'groq' | 'manus' | 'fal';
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

/** Cada motor = un instrumento de la orquesta CREAUNA (proveedor distinto). */
export const MOTOR_PROVIDER: Record<MotorId, AiProvider> = {
  visual: 'gemini',
  copy: 'claude',
  code: 'qwen',
  ux: 'groq',
};

export function isProviderConfigured(provider: AiProvider): boolean {
  const minLen = 20;
  const isPlaceholder = (key: string | undefined) => {
    const v = key?.trim() ?? '';
    if (!v) return true;
    if (v.length < minLen) return true;
    if (/^(your_|tu_api_key|sk-xxxxx|xxx)/i.test(v)) return true;
    return false;
  };
  switch (provider) {
    case 'gemini':
      return !isPlaceholder(process.env.GEMINI_API_KEY);
    case 'claude':
      return !isPlaceholder(process.env.ANTHROPIC_API_KEY);
    case 'openai':
      return !isPlaceholder(process.env.OPENAI_API_KEY);
    case 'qwen':
      return !isPlaceholder(process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY);
    case 'groq':
      return !isPlaceholder(process.env.GROQ_API_KEY);
    case 'manus':
      return !isPlaceholder(process.env.MANUS_API_KEY);
    case 'fal':
      return (process.env.FAL_KEY?.trim().length ?? 0) >= 10;
    default:
      return false;
  }
}

export function getConfiguredProviders(): AiProvider[] {
  return (['qwen', 'gemini', 'claude', 'openai', 'groq', 'manus', 'fal'] as AiProvider[]).filter(
    isProviderConfigured
  );
}

function pickMotorForPrompt(prompt: string): MotorId {
  const lower = prompt.toLowerCase();
  if (/testimonio|texto|copy|seo|redacci|titulo|párrafo|paragraph|headline/i.test(lower)) return 'copy';
  if (/código|code|animaci|html|css|estructura|structure/i.test(lower)) return 'code';
  if (/ux|experiencia|conversi|navegaci|usabilidad|clara|luminosa/i.test(lower)) return 'ux';
  return 'visual';
}

async function callGemini(messages: AiMessage[], maxTokens: number, temperature = 0.6): Promise<string | null> {
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
          generationConfig: { temperature, maxOutputTokens: maxTokens },
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

async function callClaude(messages: AiMessage[], maxTokens: number, temperature = 0.6): Promise<string | null> {
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
      temperature,
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

async function callOpenAI(messages: AiMessage[], maxTokens: number, temperature = 0.6): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const model =
    process.env.OPENAI_MODEL?.trim() ||
    (maxTokens >= 8000 ? 'gpt-4o' : 'gpt-4o-mini');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
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

async function callGroq(messages: AiMessage[], maxTokens: number, temperature = 0.6): Promise<string | null> {
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
      temperature,
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

/** Qwen vía DashScope (compatible OpenAI). Ideal para HTML largo de calidad. */
async function callQwen(messages: AiMessage[], maxTokens: number, temperature = 0.6): Promise<string | null> {
  const apiKey = (process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY)?.trim();
  if (!apiKey) return null;

  const base =
    process.env.QWEN_BASE_URL?.trim() ||
    process.env.DASHSCOPE_BASE_URL?.trim() ||
    'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';
  const model =
    process.env.QWEN_MODEL?.trim() ||
    (maxTokens >= 8000 ? 'qwen3.7-plus' : 'qwen-plus');

  const res = await fetch(`${base.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    console.error('qwen error:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

async function callProvider(
  provider: AiProvider,
  messages: AiMessage[],
  maxTokens: number,
  temperature = 0.6
): Promise<string | null> {
  switch (provider) {
    case 'gemini':
      return callGemini(messages, maxTokens, temperature);
    case 'claude':
      return callClaude(messages, maxTokens, temperature);
    case 'openai':
      return callOpenAI(messages, maxTokens, temperature);
    case 'qwen':
      return callQwen(messages, maxTokens, temperature);
    case 'groq':
      return callGroq(messages, maxTokens, temperature);
    case 'manus':
      return null;
    case 'fal':
      return null;
    default:
      return null;
  }
}


async function callProviderWithRetry(
  provider: AiProvider,
  messages: AiMessage[],
  maxTokens: number,
  temperature: number
): Promise<string | null> {
  const content = await callProvider(provider, messages, maxTokens, temperature);
  if (content) return content;
  await new Promise((r) => setTimeout(r, 600));
  return callProvider(provider, messages, maxTokens, temperature);
}

const FALLBACK_ORDER: AiProvider[] = ['qwen', 'openai', 'gemini', 'claude', 'groq'];

export async function chatCompletion(
  messages: AiMessage[],
  options?: { temperature?: number; maxTokens?: number; motor?: MotorId; prompt?: string; preferProvider?: AiProvider }
): Promise<AiCompletionResult> {
  const maxTokens = options?.maxTokens ?? 1200;
  const temperature = options?.temperature ?? 0.6;
  const motor = options?.motor || pickMotorForPrompt(options?.prompt || messages.at(-1)?.content || '');
  const primary = options?.preferProvider || MOTOR_PROVIDER[motor];

  const tryOrder = [primary, ...FALLBACK_ORDER.filter((p) => p !== primary)];

  for (const provider of tryOrder) {
    if (!isProviderConfigured(provider)) continue;
    const content = await callProviderWithRetry(provider, messages, maxTokens, temperature);
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
