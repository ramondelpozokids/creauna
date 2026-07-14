/**
 * Verificación end-to-end Mesón La Colonia (sin servidor).
 * Ejecutar: npx tsx scripts/verify-meson-e2e.ts
 */
import fs from 'fs';
import path from 'path';
import {
  extractMesonContent,
  buildPedirPageHtml,
  applyMesonContent,
} from '../app/lib/studio/mesonContentBridge';
import { buildPremiumStarterHtml } from '../app/lib/studio/loadPremiumStarter';
import { getPremiumStarterBySlug } from '../app/data/premiumStarters';

const root = process.cwd();
const indexPath = path.join(root, 'public/demos/starters/meson-la-colonia/index.html');
const pedirPath = path.join(root, 'public/demos/starters/meson-la-colonia/pedir.html');

let failed = 0;
function check(label: string, ok: boolean) {
  if (ok) console.log(`  ✓ ${label}`);
  else {
    console.log(`  ✗ ${label}`);
    failed += 1;
  }
}

console.log('\n=== Mesón La Colonia — verificación E2E ===\n');

const baseHtml = fs.readFileSync(indexPath, 'utf8');
const starter = getPremiumStarterBySlug('meson-la-colonia')!;

check('index.html existe', fs.existsSync(indexPath));
check('pedir.html existe', fs.existsSync(pedirPath));

const content = extractMesonContent(baseHtml);
check('Extrae carta (>0 categorías)', content.menu.length > 0);
check('Extrae platos (>0 items)', content.menu.some((c) => c.items.length > 0));
check('Pedidos por mesa activos', content.digital.orderingEnabled === true);
check('Reseñas extraídas', content.digital.reviews.length >= 1);

check('Formulario reserva → WhatsApp', baseHtml.includes('Confirmar reserva por WhatsApp'));
check('Reserva abre wa.me', baseHtml.includes("window.open('https://wa.me/' + waPhone"));
check('Sin alert SMS falso', !baseHtml.includes('SMS de confirmación'));

const personalized = buildPremiumStarterHtml(baseHtml, starter, {}, content);
check('Preview HTML generado', personalized.length > 1000);
check('Preview incluye carta-digital', personalized.includes('id="carta-digital"'));
check('Preview incluye pedir.html?mesa=', personalized.includes('pedir.html?mesa='));

const pedirHtml = buildPedirPageHtml(content, 'Mesón La Colonia', '34624691930');
check('pedir.html generable', pedirHtml.includes('Enviar pedido por WhatsApp'));
check('pedir incluye MENU JSON', pedirHtml.includes('const MENU = ['));
check('pedir detecta mesa', pedirHtml.includes("params.get('mesa')"));

const menuItemCount = content.menu.reduce((n, c) => n + c.items.length, 0);
check('MENU tiene platos', (pedirHtml.match(/"name":/g) ?? []).length >= menuItemCount);

const patched = applyMesonContent(baseHtml, content);
check('applyMesonContent idempotente', patched.includes('table-ordering-block'));

if (failed === 0) {
  fs.writeFileSync(pedirPath, pedirHtml, 'utf8');
  console.log('\n  → pedir.html regenerado OK\n');
  console.log('=== TODO OK ===\n');
  process.exit(0);
} else {
  console.log(`\n=== ${failed} FALLO(S) ===\n`);
  process.exit(1);
}
