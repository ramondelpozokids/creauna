import { getSessionUser } from '../../../lib/auth/session';
import { isAdminEmail } from '../../../lib/auth/admin';
import { MOTOR_PROVIDER } from '../../../lib/ai/providers';
import { pingAllProviders, summarizePingResults, PROVIDER_META } from '../../../lib/ai/providerPing';

function isPingAuthorized(req: Request, session: Awaited<ReturnType<typeof getSessionUser>>): boolean {
  const secret = process.env.AI_PING_SECRET?.trim();
  if (secret) {
    const url = new URL(req.url);
    const header = req.headers.get('x-ai-ping-secret');
    const query = url.searchParams.get('secret');
    if (header === secret || query === secret) return true;
  }

  if (session && isAdminEmail(session.email)) return true;

  if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) return true;

  return false;
}

export async function GET(req: Request) {
  const session = await getSessionUser();
  if (!isPingAuthorized(req, session)) {
    return Response.json(
      {
        error: 'No autorizado. Usa sesión admin, header x-ai-ping-secret o ?secret= con AI_PING_SECRET.',
      },
      { status: 401 }
    );
  }

  const started = Date.now();
  const providers = await pingAllProviders();
  const summary = summarizePingResults(providers);

  return Response.json({
    project: process.env.NEXT_PUBLIC_SITE_URL || 'local',
    checkedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    orchestration: {
      motors: MOTOR_PROVIDER,
      roles: PROVIDER_META,
      note: 'Director de orquesta: cada motor usa su proveedor principal; Groq es respaldo rápido; Manus solo tareas async.',
    },
    summary,
    providers,
    reuse: {
      envVars: ['GEMINI_API_KEY', 'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GROQ_API_KEY', 'MANUS_API_KEY', 'AI_PING_SECRET'],
      endpoint: '/api/ai/ping',
      tip: 'Puedes copiar las mismas keys en CourtManager Pro, Editorial, Portfolio-Ramón y RDPR. Usa una key distinta por proyecto si quieres revocar sin afectar al resto.',
    },
  });
}
