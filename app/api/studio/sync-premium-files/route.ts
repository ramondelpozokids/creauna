import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { applyRateLimit, getClientIp } from '../../../lib/api/rateLimit';
import { sanitizeText } from '../../../lib/api/validate';
import { getPremiumStarterBySlug } from '../../../data/premiumStarters';
import { buildPedirPageHtml } from '../../../lib/studio/mesonContentBridge';
import { mergePersonalization } from '../../../lib/studio/personalizePremiumStarter';
import { normalizePremiumContent, type PremiumStarterContent } from '../../../lib/studio/premiumContentTypes';

const PREMIUM_PEDIR_PATHS: Record<string, string> = {
  'meson-la-colonia': 'public/demos/starters/meson-la-colonia/pedir.html',
};

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`studio-sync-premium:${ip}`, 30, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const slug = sanitizeText(body.premiumStarterSlug, 80);
    const relativePath = PREMIUM_PEDIR_PATHS[slug];

    if (!relativePath) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'unsupported-slug' });
    }

    const starter = getPremiumStarterBySlug(slug);
    if (!starter) {
      return NextResponse.json({ ok: false, error: 'Muestra no encontrada' }, { status: 404 });
    }

    const content = normalizePremiumContent(body.premiumContent as Partial<PremiumStarterContent>);
    const personalization = mergePersonalization(starter, body.premiumPersonalization);

    if (!content.digital.orderingEnabled || content.menu.length === 0) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'ordering-disabled-or-empty-menu' });
    }

    const pedirHtml = buildPedirPageHtml(content, personalization.businessName, personalization.phoneE164);
    const filePath = path.join(process.cwd(), relativePath);

    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, pedirHtml, 'utf8');
      return NextResponse.json({ ok: true, synced: ['pedir.html'], path: relativePath });
    } catch {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: 'filesystem-readonly',
        pedirHtml,
      });
    }
  } catch (error) {
    console.error('api/studio/sync-premium-files:', error);
    return NextResponse.json({ error: 'Error al sincronizar archivos premium' }, { status: 500 });
  }
}
