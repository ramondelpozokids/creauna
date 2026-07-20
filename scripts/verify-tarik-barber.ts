/**
 * Barbería Tarik — fotos = Desktop/barberia.html; detecta contexto corto; sin moda.
 * npx tsx scripts/verify-tarik-barber.ts
 */
import { isBarbershopPrompt, isBarbershopContext } from '../app/lib/ai/businessProfiles';
import { buildAgencyPlanFromBrief, runAgencyPipeline } from '../app/lib/ai/agencyPipeline';
import { buildBriefImagePack } from '../app/lib/ai/promptFirstQuality';
import { buildDeterministicAgencyHtml } from '../app/lib/ai/agencyDeterministicBuild';
import { injectSiteChrome, withAgencyChromePrompt } from '../app/lib/ai/siteChrome';
import {
  polishCatalogLayout,
  applyBarbershopSectorImages,
} from '../app/lib/ai/polishCatalogLayout';
import { IMAGE_BANK } from '../app/lib/ai/imageBank';

function assert(label: string, ok: boolean) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) process.exitCode = 1;
}

const TARIK = `Peluquería Caballero Tarik — barbería en Puente de Vallecas, Madrid.
Calle Alto del León, 2, 28038 Madrid. Tel: 631 81 68 80.
Hero: "Más que un corte de pelo, una experiencia de barbería."
WhatsApp + mapa. Aviso legal y privacidad. Sin carrito.`;

const REF_HERO = 'photo-1585747860715-2ba37e788b70';
const REF_ABOUT = 'photo-1621605815971-fbc98d665033';
const FASHION = 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1600';

async function main() {
  assert('detecta barbería', isBarbershopPrompt(TARIK));
  assert(
    'contexto corto + HTML',
    isBarbershopContext('arregla las fotos', `<h1>Peluquería Caballero Tarik</h1><p>experiencia de barbería</p>`)
  );
  assert('pack hero = referencia Desktop', IMAGE_BANK.barber.hero.includes(REF_HERO));
  assert('pack about = referencia', IMAGE_BANK.barber.about.includes(REF_ABOUT));
  assert('pack urls incluyen hero ref', buildBriefImagePack(TARIK, 'es').urls.some((u) => u.includes(REF_HERO)));

  const plan = buildAgencyPlanFromBrief(TARIK, 'es');
  const pack = buildBriefImagePack(TARIK, 'es');
  let html = buildDeterministicAgencyHtml(plan, pack, TARIK, 'es');
  html = injectSiteChrome(html, {
    prompt: withAgencyChromePrompt(TARIK),
    lang: 'es',
    businessName: plan.businessName,
  });
  html = polishCatalogLayout(html, { prompt: TARIK, packUrls: pack.urls, variant: pack.variant });
  html = applyBarbershopSectorImages(html);

  assert('HTML tiene hero ref', html.includes(REF_HERO));
  assert('HTML tiene about ref', html.includes(REF_ABOUT));
  assert('HTML tiene galería ref', html.includes('photo-1622286342621-4bd786c2447c'));
  assert('sin moda fashion', !html.includes('1529626455594'));

  // Pipeline completo (debe ir a determinista, no IA moda)
  const result = await runAgencyPipeline(TARIK, 'es');
  const full = result.previewSections.find((s) => /<!DOCTYPE/i.test(s.html))?.html || '';
  assert('pipeline ok', result.ok && full.length > 10000);
  assert('pipeline hero ref', full.includes(REF_HERO));
  assert('pipeline sin moda', !full.includes('1529626455594') && !full.includes(FASHION));

  // Pedido corto sobre HTML con moda → polish por contexto
  const broken = `<!DOCTYPE html><html><body>
<section><img src="${FASHION}" /><h1>Más que un corte de pelo, una experiencia de barbería.</h1></section>
<section id="nosotros"><h2>Sobre Nosotros</h2><img src="${FASHION}" /></section>
<section id="galeria"><h2>Galería</h2><img src="${FASHION}" /></section>
<footer>Peluquería Caballero Tarik</footer></body></html>`;
  const fixed = polishCatalogLayout(broken, {
    prompt: 'arregla las imagenes',
    packUrls: pack.urls,
  });
  assert('pedido corto quita moda', !fixed.includes('1529626455594'));
  assert('pedido corto pone hero ref', fixed.includes(REF_HERO));

  console.log(process.exitCode ? '\nFAIL' : '\nALL OK');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
