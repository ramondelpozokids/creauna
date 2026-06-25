import type { AiProvider } from './providers';
import { MOTOR_PROVIDER, isProviderConfigured } from './providers';

export type ProviderPingStatus = 'ok' | 'missing' | 'error';

export interface ProviderPingResult {
  provider: AiProvider;
  label: string;
  configured: boolean;
  status: ProviderPingStatus;
  model: string | null;
  latencyMs: number | null;
  sample: string | null;
  httpStatus: number | null;
  error: string | null;
  bestFor: string[];
  motors: string[];
}

export const PROVIDER_META: Record<
  AiProvider,
  { label: string; bestFor: string[] }
> = {
  gemini: {
    label: 'Gemini',
    bestFor: ['diseño visual', 'layouts', 'multimodal', 'velocidad', 'coste bajo'],
  },
  claude: {
    label: 'Claude',
    bestFor: ['copywriting', 'UX', 'tono premium', 'textos largos', 'edición'],
  },
  openai: {
    label: 'OpenAI',
    bestFor: ['código', 'HTML/CSS', 'estructura', 'refactors', 'tools'],
  },
  groq: {
    label: 'Groq',
    bestFor: ['fallback rápido', 'baja latencia', 'borradores baratos'],
  },
  manus: {
    label: 'Manus',
    bestFor: ['tareas async', 'investigación', 'multi-paso', 'informes largos'],
  },
};

const ALL_PROVIDERS: AiProvider[] = ['gemini', 'claude', 'openai', 'groq', 'manus'];

function motorsForProvider(provider: AiProvider): string[] {
  return (Object.entries(MOTOR_PROVIDER) as [keyof typeof MOTOR_PROVIDER, AiProvider][])
    .filter(([, p]) => p === provider)
    .map(([motor]) => motor);
}

function truncate(text: string, max = 220): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

function parseApiError(status: number, body: string): string {
  try {
    const data = JSON.parse(body) as {
      error?: { message?: string; type?: string };
      message?: string;
    };
    const msg = data.error?.message || data.message;
    if (msg) return truncate(`${status}: ${msg}`);
  } catch {
    /* plain text */
  }
  return truncate(body || `HTTP ${status}`, 180);
}

async function pingGemini(): Promise<Omit<ProviderPingResult, 'provider' | 'label' | 'bestFor' | 'motors'>> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const primary = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
  const models = [...new Set([primary, 'gemini-2.0-flash-lite', 'gemini-1.5-flash'])];
  if (!apiKey) {
    return { configured: false, status: 'missing', model: primary, latencyMs: null, sample: null, httpStatus: null, error: 'GEMINI_API_KEY no configurada' };
  }

  const started = Date.now();
  let lastError: { model: string; status: number; body: string } | null = null;

  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Responde solo: OK' }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 8 },
        }),
      }
    );
    const body = await res.text();

    if (res.ok) {
      try {
        const data = JSON.parse(body) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
        const sample = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
        return {
          configured: true,
          status: sample ? 'ok' : 'error',
          model,
          latencyMs: Date.now() - started,
          sample,
          httpStatus: res.status,
          error: sample ? null : 'Respuesta vacía del modelo',
        };
      } catch {
        return { configured: true, status: 'error', model, latencyMs: Date.now() - started, sample: null, httpStatus: res.status, error: 'JSON inválido en respuesta Gemini' };
      }
    }

    lastError = { model, status: res.status, body };
    if (res.status !== 429 && res.status !== 404) break;
  }

  const latencyMs = Date.now() - started;
  return {
    configured: true,
    status: 'error',
    model: lastError?.model ?? primary,
    latencyMs,
    sample: null,
    httpStatus: lastError?.status ?? null,
    error: lastError ? parseApiError(lastError.status, lastError.body) : 'Error Gemini',
  };
}

async function pingClaude(): Promise<Omit<ProviderPingResult, 'provider' | 'label' | 'bestFor' | 'motors'>> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  const model = process.env.CLAUDE_MODEL?.trim() || 'claude-sonnet-4-6';
  if (!apiKey) {
    return { configured: false, status: 'missing', model, latencyMs: null, sample: null, httpStatus: null, error: 'ANTHROPIC_API_KEY no configurada' };
  }

  const started = Date.now();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8,
      messages: [{ role: 'user', content: 'Responde solo: OK' }],
    }),
  });
  const latencyMs = Date.now() - started;
  const body = await res.text();

  if (!res.ok) {
    return { configured: true, status: 'error', model, latencyMs, sample: null, httpStatus: res.status, error: parseApiError(res.status, body) };
  }

  try {
    const data = JSON.parse(body) as { content?: { type: string; text?: string }[] };
    const sample = data?.content?.find((b) => b.type === 'text')?.text?.trim() || null;
    return { configured: true, status: sample ? 'ok' : 'error', model, latencyMs, sample, httpStatus: res.status, error: sample ? null : 'Respuesta vacía del modelo' };
  } catch {
    return { configured: true, status: 'error', model, latencyMs, sample: null, httpStatus: res.status, error: 'JSON inválido en respuesta Claude' };
  }
}

async function pingOpenAI(): Promise<Omit<ProviderPingResult, 'provider' | 'label' | 'bestFor' | 'motors'>> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';
  if (!apiKey) {
    return { configured: false, status: 'missing', model, latencyMs: null, sample: null, httpStatus: null, error: 'OPENAI_API_KEY no configurada' };
  }

  const started = Date.now();
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Responde solo: OK' }],
      temperature: 0,
      max_tokens: 8,
    }),
  });
  const latencyMs = Date.now() - started;
  const body = await res.text();

  if (!res.ok) {
    return { configured: true, status: 'error', model, latencyMs, sample: null, httpStatus: res.status, error: parseApiError(res.status, body) };
  }

  try {
    const data = JSON.parse(body) as { choices?: { message?: { content?: string } }[] };
    const sample = data?.choices?.[0]?.message?.content?.trim() || null;
    return { configured: true, status: sample ? 'ok' : 'error', model, latencyMs, sample, httpStatus: res.status, error: sample ? null : 'Respuesta vacía del modelo' };
  } catch {
    return { configured: true, status: 'error', model, latencyMs, sample: null, httpStatus: res.status, error: 'JSON inválido en respuesta OpenAI' };
  }
}

async function pingGroq(): Promise<Omit<ProviderPingResult, 'provider' | 'label' | 'bestFor' | 'motors'>> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  const model = process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant';
  if (!apiKey) {
    return { configured: false, status: 'missing', model, latencyMs: null, sample: null, httpStatus: null, error: 'GROQ_API_KEY no configurada' };
  }

  const started = Date.now();
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Responde solo: OK' }],
      temperature: 0,
      max_tokens: 8,
    }),
  });
  const latencyMs = Date.now() - started;
  const body = await res.text();

  if (!res.ok) {
    return { configured: true, status: 'error', model, latencyMs, sample: null, httpStatus: res.status, error: parseApiError(res.status, body) };
  }

  try {
    const data = JSON.parse(body) as { choices?: { message?: { content?: string } }[] };
    const sample = data?.choices?.[0]?.message?.content?.trim() || null;
    return { configured: true, status: sample ? 'ok' : 'error', model, latencyMs, sample, httpStatus: res.status, error: sample ? null : 'Respuesta vacía del modelo' };
  } catch {
    return { configured: true, status: 'error', model, latencyMs, sample: null, httpStatus: res.status, error: 'JSON inválido en respuesta Groq' };
  }
}

async function pingManus(): Promise<Omit<ProviderPingResult, 'provider' | 'label' | 'bestFor' | 'motors'>> {
  const apiKey = process.env.MANUS_API_KEY?.trim();
  const model = 'manus-1.6';
  if (!apiKey) {
    return { configured: false, status: 'missing', model, latencyMs: null, sample: null, httpStatus: null, error: 'MANUS_API_KEY no configurada' };
  }

  const started = Date.now();
  const res = await fetch('https://api.manus.ai/v1/tasks', {
    method: 'POST',
    headers: {
      'x-manus-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: 'Health check: responde internamente OK',
      agentProfile: model,
    }),
  });
  const latencyMs = Date.now() - started;
  const body = await res.text();

  if (!res.ok) {
    return { configured: true, status: 'error', model, latencyMs, sample: null, httpStatus: res.status, error: parseApiError(res.status, body) };
  }

  try {
    const data = JSON.parse(body) as { task_id?: string; id?: string };
    const taskId = data.task_id || data.id || null;
    return {
      configured: true,
      status: taskId ? 'ok' : 'error',
      model,
      latencyMs,
      sample: taskId ? `task:${taskId}` : null,
      httpStatus: res.status,
      error: taskId ? null : 'Sin task_id en respuesta Manus',
    };
  } catch {
    return { configured: true, status: 'error', model, latencyMs, sample: null, httpStatus: res.status, error: 'JSON inválido en respuesta Manus' };
  }
}

async function pingOne(provider: AiProvider): Promise<ProviderPingResult> {
  const meta = PROVIDER_META[provider];
  const base = {
    provider,
    label: meta.label,
    bestFor: meta.bestFor,
    motors: motorsForProvider(provider),
  };

  try {
    let result: Omit<ProviderPingResult, 'provider' | 'label' | 'bestFor' | 'motors'>;
    switch (provider) {
      case 'gemini':
        result = await pingGemini();
        break;
      case 'claude':
        result = await pingClaude();
        break;
      case 'openai':
        result = await pingOpenAI();
        break;
      case 'groq':
        result = await pingGroq();
        break;
      case 'manus':
        result = await pingManus();
        break;
      default:
        result = {
          configured: isProviderConfigured(provider),
          status: 'error',
          model: null,
          latencyMs: null,
          sample: null,
          httpStatus: null,
          error: 'Proveedor desconocido',
        };
    }
    return { ...base, ...result };
  } catch (error) {
    return {
      ...base,
      configured: isProviderConfigured(provider),
      status: 'error',
      model: null,
      latencyMs: null,
      sample: null,
      httpStatus: null,
      error: error instanceof Error ? error.message : 'Error de red',
    };
  }
}

export async function pingAllProviders(): Promise<ProviderPingResult[]> {
  return Promise.all(ALL_PROVIDERS.map((provider) => pingOne(provider)));
}

export function summarizePingResults(results: ProviderPingResult[]) {
  const ok = results.filter((r) => r.status === 'ok');
  const errors = results.filter((r) => r.status === 'error');
  const missing = results.filter((r) => r.status === 'missing');

  const motorHealth = (Object.keys(MOTOR_PROVIDER) as (keyof typeof MOTOR_PROVIDER)[]).map((motor) => {
    const provider = MOTOR_PROVIDER[motor];
    const ping = results.find((r) => r.provider === provider);
    return {
      motor,
      provider,
      ready: ping?.status === 'ok',
      status: ping?.status ?? 'missing',
    };
  });

  return {
    total: results.length,
    ok: ok.length,
    errors: errors.length,
    missing: missing.length,
    allMotorsReady: motorHealth.every((m) => m.ready),
    motorHealth,
    working: ok.map((r) => r.provider),
    failing: errors.map((r) => ({ provider: r.provider, error: r.error })),
  };
}
