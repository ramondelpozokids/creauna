/**
 * Verifica que todas las muestras premium registradas tengan index.html y carguen.
 * Ejecutar: npx tsx scripts/verify-premium-starters.ts
 */
import fs from 'fs';
import path from 'path';
import { premiumStarters } from '../app/data/premiumStarters';
import { buildPremiumStarterSections } from '../app/lib/studio/loadPremiumStarter';
import { validateFullpageHtml } from '../app/lib/studio/sectionValidator';

const root = process.cwd();
let ok = 0;
let fail = 0;

for (const starter of premiumStarters) {
  const relative = starter.demoPath.replace(/^\//, '');
  const filePath = path.join(root, 'public', relative);
  const label = starter.slug;

  if (!fs.existsSync(filePath)) {
    console.error(`FAIL  ${label}: no existe ${relative}`);
    fail++;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  if (html.length < 5000) {
    console.error(`FAIL  ${label}: HTML demasiado corto (${html.length} bytes)`);
    fail++;
    continue;
  }

  const gateErrors = validateFullpageHtml(html);
  if (gateErrors.length) {
    console.error(`FAIL  ${label}: gate fullpage — ${gateErrors.join('; ')}`);
    fail++;
    continue;
  }

  const result = buildPremiumStarterSections(html, starter);
  if (!result.previewSections[0]?.html?.includes(starter.defaults.businessName.split(' ')[0])) {
    console.warn(`WARN  ${label}: personalización base podría no coincidir con el HTML`);
  }

  console.log(`OK    ${label} (${Math.round(html.length / 1024)} KB)`);
  ok++;
}

console.log(`\n${ok}/${premiumStarters.length} muestras verificadas${fail ? `, ${fail} fallos` : ''}`);
process.exit(fail > 0 ? 1 : 0);
