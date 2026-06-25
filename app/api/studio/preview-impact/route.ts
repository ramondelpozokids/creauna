import { NextResponse } from 'next/server';
import { applyRateLimit, getClientIp } from '../../../lib/api/rateLimit';
import { sanitizeText } from '../../../lib/api/validate';
import { analyzeStudioImpact } from '../../../lib/studio/impactAnalyzer';
import { studioFeatureEnabled } from '../../../lib/studio/contextTypes';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`studio-impact:${ip}`, 80, 60_000);
  if (limited) return limited;

  if (!studioFeatureEnabled('impact')) {
    return NextResponse.json({ disabled: true });
  }

  try {
    const body = await req.json();
    const prompt = sanitizeText(body.prompt, 2000);
    const lang = body.lang === 'en' ? 'en' : 'es';
    const action = sanitizeText(body.action, 40) || 'change';
    const sectionId = typeof body.sectionId === 'number' ? body.sectionId : undefined;
    const previewSections = Array.isArray(body.previewSections)
      ? body.previewSections
          .filter((s: { id?: unknown; type?: unknown }) => typeof s.id === 'number' && typeof s.type === 'string')
          .map((s: { id: number; type: string }) => ({ id: s.id, type: s.type }))
      : [];

    const impact = analyzeStudioImpact({ prompt, lang, action, sectionId, previewSections });

    return NextResponse.json({ impact });
  } catch (error) {
    console.error('api/studio/preview-impact:', error);
    return NextResponse.json({ error: 'Error al analizar impacto' }, { status: 500 });
  }
}
