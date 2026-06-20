import { NextResponse } from 'next/server';
import { generateStudioChange } from '../../lib/ai/studioEngine';
import { checkRateLimit, getClientIp, rateLimitResponse } from '../../lib/api/rateLimit';
import { sanitizeText } from '../../lib/api/validate';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`studio:${ip}`, 40, 60_000);
  if (!rate.ok) return rateLimitResponse(rate.retryAfterSec);

  try {
    const body = await req.json();
    const prompt = sanitizeText(body.prompt, 2000);
    const lang = body.lang === 'en' ? 'en' : 'es';
    const action = body.action || 'change';
    const style = body.style;
    const sectionId = typeof body.sectionId === 'number' ? body.sectionId : undefined;
    const previewSections = Array.isArray(body.previewSections) ? body.previewSections : [];

    if (!prompt && action === 'change') {
      return NextResponse.json({ error: 'Prompt requerido' }, { status: 400 });
    }

    const result = await generateStudioChange({
      prompt: prompt || 'regenerar',
      lang,
      previewSections,
      action,
      style,
      sectionId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('api/studio/generate:', error);
    return NextResponse.json({ error: 'Error al generar el diseño' }, { status: 500 });
  }
}
