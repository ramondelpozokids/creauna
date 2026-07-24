/**
 * Prueba real del ciclo: brief duro → Qwen index_preview.
 * npx tsx scripts/smoke-qwen-index-preview.ts
 * Solo lectura de .env.local (nunca escribe).
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { runAgencyPipeline } from '../app/lib/ai/agencyPipeline';
import { readBuildPhase } from '../app/lib/ai/creaunaBuildPhases';
import { isProviderConfigured } from '../app/lib/ai/providers';

function loadEnvLocalReadonly() {
  const p = join(process.cwd(), '.env.local');
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvLocalReadonly();

const BRIEF = `Marca de movilidad eléctrica premium VELOCITY X.
Bicicletas e-bike de alta gama. Experiencia interactiva con producto bicicleta futurista legible.
Hero oscuro, titanio y azul eléctrico. Configurador y scroll cinematográfico.
CTA: Configura tu bicicleta. No tienda ecommerce típica — obra de marca.`;

async function main() {
  console.log('qwen configured?', isProviderConfigured('qwen'));
  if (!isProviderConfigured('qwen')) {
    console.error('FAIL: falta QWEN_API_KEY / DASHSCOPE_API_KEY');
    process.exitCode = 1;
    return;
  }

  console.log('Running agency pipeline (index preview)…');
  const t0 = Date.now();
  const result = await runAgencyPipeline(BRIEF, 'es');
  const ms = Date.now() - t0;
  const html = result.previewSections[0]?.html || '';
  const phase = html ? readBuildPhase(html) : null;

  console.log('---');
  console.log('ok', result.ok);
  console.log('templateSlug', result.templateSlug);
  console.log('providers', result.providersUsed);
  console.log('motors', result.motorsUsed);
  console.log('html KB', Math.round(html.length / 1024));
  console.log('phase meta', phase);
  console.log('doctype', /<!DOCTYPE\s+html/i.test(html));
  console.log('html close', /<\/html>/i.test(html));
  console.log('asks changes?', /cambiar|resto de páginas|WhatsApp|fuente|color/i.test(result.message));
  console.log('message:', result.message.slice(0, 280));
  console.log('elapsed s', Math.round(ms / 1000));

  const outDir = join(process.cwd(), 'tmp');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'smoke-velocity-index-preview.html');
  if (html) writeFileSync(outPath, html, 'utf8');
  console.log('wrote', outPath);

  const pass =
    result.ok &&
    html.length > 12000 &&
    /<!DOCTYPE\s+html/i.test(html) &&
    /<\/html>/i.test(html) &&
    /cambiar|resto de páginas|WhatsApp|fuente|color/i.test(result.message);

  console.log(pass ? 'PASS smoke index preview' : 'FAIL smoke index preview');
  if (!pass) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
