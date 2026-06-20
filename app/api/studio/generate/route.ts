import { NextResponse } from 'next/server';
import { generateStudioChange } from '../../../lib/ai/studioEngine';
import { applyRateLimit, getClientIp } from '../../../lib/api/rateLimit';
import { sanitizeText } from '../../../lib/api/validate';
import { getSessionUser } from '../../../lib/auth/session';
import { consumeCredit, refundCredit, resolveCredits } from '../../../lib/credits';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`studio:${ip}`, 40, 60_000);
  if (limited) return limited;

  try {
    const session = await getSessionUser();
    const creditStatus = await resolveCredits(session?.id ?? null, ip);
    const unlimited = creditStatus.unlimited === true;

    if (!unlimited && creditStatus.credits <= 0) {
      return NextResponse.json(
        { error: 'Sin créditos. Regístrate o mejora tu plan en /precios', credits: 0 },
        { status: 402 }
      );
    }

    const spent = unlimited
      ? { ok: true as const, credits: creditStatus.credits }
      : await consumeCredit(session?.id ?? null, ip, 'studio_generate');
    if (!spent.ok) {
      return NextResponse.json({ error: 'Sin créditos disponibles', credits: spent.credits }, { status: 402 });
    }

    const body = await req.json();
    const prompt = sanitizeText(body.prompt, 2000);
    const lang = body.lang === 'en' ? 'en' : 'es';
    const action = body.action || 'change';
    const style = body.style;
    const sectionId = typeof body.sectionId === 'number' ? body.sectionId : undefined;
    const previewSections = Array.isArray(body.previewSections) ? body.previewSections : [];

    if (!prompt && action === 'change') {
      await refundCredit(session?.id ?? null, ip, 'studio_refund_empty_prompt');
      return NextResponse.json({ error: 'Prompt requerido', credits: spent.credits + 1 }, { status: 400 });
    }

    const result = await generateStudioChange({
      prompt: prompt || 'regenerar',
      lang,
      previewSections,
      action,
      style,
      sectionId,
    });

    return NextResponse.json({
      ...result,
      credits: spent.credits,
      unlimited,
    });
  } catch (error) {
    console.error('api/studio/generate:', error);
    const session = await getSessionUser();
    const ip = getClientIp(req);
    const credits = await refundCredit(session?.id ?? null, ip, 'studio_refund_error');
    return NextResponse.json({ error: 'Error al generar el diseño', credits }, { status: 500 });
  }
}
