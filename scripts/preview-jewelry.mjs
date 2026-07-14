import { writeFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Compilar vía tsx si existe; fallback: generamos con import dinámico
async function main() {
  const { register } = await import('tsx/esm/api').catch(() => null);
  if (register) register();

  const { buildIntentFromTemplateSlug } = await import('../app/lib/ai/intentAnalyzer.ts');
  const { getTemplateBySlug } = await import('../app/data/templates.ts');
  const { getContentPreset } = await import('../app/lib/ai/siteContent.ts');
  const { buildCustomSite } = await import('../app/lib/ai/siteSections.ts');

  const intent = buildIntentFromTemplateSlug('atelier', 'es');
  intent.businessName = 'Atelier Joyas & Relojería';

  const tpl = getTemplateBySlug('atelier');
  const preset = getContentPreset('atelier');
  const sections = buildCustomSite(intent, tpl, preset, 'es');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${intent.businessName} — Preview CREAUNA</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Inter, system-ui, sans-serif; background: #e7e5e4; margin: 0; }
    .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
    .preview-banner {
      position: sticky; top: 0; z-index: 9999;
      background: #0a0a0a; color: #d6d3d1;
      text-align: center; padding: 10px 16px;
      font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
      border-bottom: 1px solid #292524;
    }
    .preview-banner strong { color: #d97706; }
    main { max-width: 1280px; margin: 0 auto; padding: 24px 16px 48px; }
    .section-wrap { margin-bottom: 24px; }
    .section-label {
      font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
      color: #78716c; margin-bottom: 8px; padding-left: 4px;
    }
    details summary { cursor: pointer; }
  </style>
</head>
<body>
  <div class="preview-banner">
    <strong>CREAUNA</strong> · Motor joyería/relojería · ${sections.length} secciones · Plantilla Atelier
  </div>
  <main>
    ${sections
      .map(
        (s) => `<div class="section-wrap">
      <div class="section-label">${s.type} · ${s.navLabelEs ?? s.id}</div>
      ${s.html}
    </div>`
      )
      .join('\n')}
  </main>
</body>
</html>`;

  const outPath = new URL('../public/preview-joyeria.html', import.meta.url);
  writeFileSync(outPath, html, 'utf8');
  console.log('Secciones:', sections.map((s) => s.type).join(' → '));
  console.log('Archivo:', outPath.pathname.replace(/^\/([A-Z]:)/, '$1'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
