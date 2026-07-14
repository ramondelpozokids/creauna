import { NextResponse } from 'next/server';
import { applyRateLimit, getClientIp } from '../../../lib/api/rateLimit';
import { sanitizeText } from '../../../lib/api/validate';
import { getPremiumStarterBySlug } from '../../../data/premiumStarters';
import { buildPedirPageHtml } from '../../../lib/studio/mesonContentBridge';
import { mergePersonalization } from '../../../lib/studio/personalizePremiumStarter';
import { normalizePremiumContent, type PremiumStarterContent } from '../../../lib/studio/premiumContentTypes';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`studio-export:${ip}`, 10, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const projectName = sanitizeText(body.projectName, 120) || 'mi-proyecto';
    const sections = Array.isArray(body.previewSections) ? body.previewSections : [];
    const premiumStarterSlug = sanitizeText(body.premiumStarterSlug, 80);
    const premiumContent = body.premiumContent as PremiumStarterContent | undefined;

    const fullpage = sections.find((s: { type?: string; html?: string }) => s.type === 'fullpage');
    const indexHtml =
      fullpage?.html ??
      `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${projectName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-slate-900 antialiased">
  <main class="max-w-6xl mx-auto p-8 space-y-8">
    ${sections.map((s: { html?: string }) => s.html || '').join('\n')}
  </main>
  <footer class="text-center text-xs text-slate-400 py-8">Diseñado con CREAUNA · Ramón del Pozo Rott</footer>
</body>
</html>`;

    const files: Record<string, string> = { 'index.html': indexHtml };

    if (premiumStarterSlug === 'meson-la-colonia' && premiumContent) {
      const starter = getPremiumStarterBySlug('meson-la-colonia');
      if (starter) {
        const personalization = mergePersonalization(starter, body.premiumPersonalization);
        const content = normalizePremiumContent(premiumContent);
        if (content.digital.orderingEnabled && content.menu.length > 0) {
          files['pedir.html'] = buildPedirPageHtml(
            content,
            personalization.businessName,
            personalization.phoneE164
          );
        }
      }
    }

    return NextResponse.json({
      ok: true,
      projectName,
      files,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('api/studio/export:', error);
    return NextResponse.json({ error: 'Error al exportar' }, { status: 500 });
  }
}
