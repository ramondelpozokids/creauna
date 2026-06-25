import { getConfiguredProviders, isProviderConfigured, MOTOR_PROVIDER } from '../../../lib/ai/providers';

function keyStatus(name: string): 'ok' | 'missing' | 'invalid' {
  const raw = process.env[name]?.trim() ?? '';
  if (!raw) return 'missing';
  if (raw.length < 20 || raw.startsWith('your_') || raw === 'sk-xxxxx') return 'invalid';
  return 'ok';
}

export async function GET() {
  const keys = {
    GEMINI_API_KEY: keyStatus('GEMINI_API_KEY'),
    ANTHROPIC_API_KEY: keyStatus('ANTHROPIC_API_KEY'),
    OPENAI_API_KEY: keyStatus('OPENAI_API_KEY'),
    GROQ_API_KEY: keyStatus('GROQ_API_KEY'),
  };

  return Response.json({
    motors: {
      visual: { provider: MOTOR_PROVIDER.visual, configured: isProviderConfigured(MOTOR_PROVIDER.visual) },
      copy: { provider: MOTOR_PROVIDER.copy, configured: isProviderConfigured(MOTOR_PROVIDER.copy) },
      code: { provider: MOTOR_PROVIDER.code, configured: isProviderConfigured(MOTOR_PROVIDER.code) },
      ux: { provider: MOTOR_PROVIDER.ux, configured: isProviderConfigured(MOTOR_PROVIDER.ux) },
    },
    keys,
    configured: getConfiguredProviders(),
    ping: {
      endpoint: '/api/ai/ping',
      note: 'Prueba real de cada API (latencia + errores). Requiere admin o AI_PING_SECRET.',
    },
    arena: {
      available: false,
      note: 'LMSYS/Arena no ofrece API oficial con claves. No recomendado para producción.',
    },
    manus: {
      configured: isProviderConfigured('manus'),
      note: 'Manus es agente async para tareas complejas, no para preview instantáneo del Studio.',
    },
    composer: {
      note: 'Cursor Composer no tiene API pública. En CREAUNA el Motor de Código usa OpenAI (ChatGPT).',
      provider: MOTOR_PROVIDER.code,
      configured: isProviderConfigured(MOTOR_PROVIDER.code),
    },
  });
}
