import { NextResponse } from 'next/server';
import { applyRateLimit, getClientIp } from '../../../lib/api/rateLimit';
import { sanitizeText } from '../../../lib/api/validate';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`studio-export:${ip}`, 10, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const projectName = sanitizeText(body.projectName, 120) || 'mi-proyecto';
    const sections = Array.isArray(body.previewSections) ? body.previewSections : [];

    const html = `<!DOCTYPE html>
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

    return NextResponse.json({
      ok: true,
      projectName,
      files: {
        'index.html': html,
      },
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('api/studio/export:', error);
    return NextResponse.json({ error: 'Error al exportar' }, { status: 500 });
  }
}
