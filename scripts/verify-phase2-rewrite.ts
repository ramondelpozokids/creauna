/**
 * Fase 2 offline: pack rewrite + WhatsApp solo si se pide + inserción quirúrgica.
 * npx tsx scripts/verify-phase2-rewrite.ts
 */
import { packHtmlForRewrite } from '../app/lib/ai/promptFirstSiteGenerator';
import { buildAgencyPlanFromBrief } from '../app/lib/ai/agencyPipeline';
import { buildBriefImagePack } from '../app/lib/ai/promptFirstQuality';
import { buildDeterministicAgencyHtml } from '../app/lib/ai/agencyDeterministicBuild';
import { injectSiteChrome, withAgencyChromePrompt, promptWantsWhatsApp } from '../app/lib/ai/siteChrome';
import {
  parseInsertSectionRequest,
  applySurgicalSectionInsert,
  findSectionStartIndex,
  changeRequestMarkers,
  htmlHasChangeMarkers,
} from '../app/lib/ai/surgicalSectionChange';
import { validateFullpageHtml } from '../app/lib/studio/sectionValidator';

function assert(label: string, ok: boolean) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) process.exitCode = 1;
}

const NO_WA = `Clínica dental Lumina en Madrid.
Hero profesional, servicios, equipo, contacto con formulario y email.
Aviso legal y privacidad. Sin carrito.`;

const WITH_WA = `Boutique moda Velora. Catálogo precios. WhatsApp 600111222. Contacto por WhatsApp.`;

const BAKERY = `Panadería artesanal El Trigo Dorado en Valencia.
Pan de masa madre, bollería y pasteles. Catálogo con precios.
Galería, servicios, nosotros y contacto. Aviso legal y privacidad. Sin carrito ni WhatsApp.`;

const REWRITE_BRIEF = `Primera modificación
Mantén todo el diseño y la estructura actual. Únicamente añade una nueva sección llamada "Productos de temporada" entre "Productos" y "Galería". Incluye productos típicos según la estación del año con sus imágenes, descripción y precio. No modifiques ninguna otra sección.`;

const GESTORIA = `Gestoría Integral RDPR en Madrid.
Asesoría fiscal, laboral y contable para autónomos y empresas.
Servicios profesionales, nosotros, proceso, FAQ, contacto con formulario.
Aviso legal y privacidad. Sin carrito. Sin WhatsApp.`;

const PRICING_REWRITE = `Mantén todo el diseño y la estructura actual. Añade una nueva sección llamada "Precios y Planes" después de la sección de servicios. Incluye tres planes orientativos para Autónomos, PYMES y Empresas con una tabla comparativa de servicios. No modifiques ninguna otra parte de la web.`;

async function main() {
  assert('promptWantsWhatsApp false', !promptWantsWhatsApp(NO_WA));
  assert('promptWantsWhatsApp true', promptWantsWhatsApp(WITH_WA));

  const plan = buildAgencyPlanFromBrief(NO_WA, 'es');
  const pack = buildBriefImagePack(NO_WA, 'es');
  let html = buildDeterministicAgencyHtml(plan, pack, NO_WA, 'es');
  html = injectSiteChrome(html, {
    prompt: withAgencyChromePrompt(NO_WA),
    lang: 'es',
    businessName: plan.businessName,
  });

  assert('sin WA: no FAB verde flotante', !/aria-label="WhatsApp"/i.test(html));
  assert('sin WA: no fuerza wa.me en chrome', !/cua-site-widgets[\s\S]*wa\.me/i.test(html));
  assert('sin WA: tiene legales', /privacidad|data-cua-legal/i.test(html));
  assert('sin WA: tiene contacto', /#contacto|id="contacto"/i.test(html));

  const planWa = buildAgencyPlanFromBrief(WITH_WA, 'es');
  const packWa = buildBriefImagePack(WITH_WA, 'es');
  let htmlWa = buildDeterministicAgencyHtml(planWa, packWa, WITH_WA, 'es');
  htmlWa = injectSiteChrome(htmlWa, {
    prompt: withAgencyChromePrompt(WITH_WA),
    lang: 'es',
    businessName: planWa.businessName,
  });
  assert('con WA: FAB o wa.me', /wa\.me\/600111222|aria-label="WhatsApp"/i.test(htmlWa));

  // Pack rewrite: documento grande artificial
  const big = html + html + html;
  const packed = packHtmlForRewrite(big, 40000);
  assert('pack <= max+2k', packed.length <= 42000);
  assert('pack conserva footer o body', /<footer|<\/body>/i.test(packed));
  assert('pack marca tamaño original', packed.includes(`original ${big.length}`));

  // —— Inserción quirúrgica (caso real El Trigo Dorado) ——
  const parsed = parseInsertSectionRequest(REWRITE_BRIEF);
  assert('parse insert: título', !!parsed && parsed.title === 'Productos de temporada');
  assert('parse insert: after', !!parsed && /productos/i.test(parsed!.afterLabel));
  assert('parse insert: before', !!parsed && /galer[ií]a|gallery/i.test(parsed!.beforeLabel));

  const bakeryPlan = buildAgencyPlanFromBrief(BAKERY, 'es');
  const bakeryPack = buildBriefImagePack(BAKERY, 'es');
  let bakeryHtml = buildDeterministicAgencyHtml(bakeryPlan, bakeryPack, BAKERY, 'es');
  bakeryHtml = injectSiteChrome(bakeryHtml, {
    prompt: withAgencyChromePrompt(BAKERY),
    lang: 'es',
    businessName: bakeryPlan.businessName,
  });

  assert('bakery: tiene #productos', /id=["']productos["']/i.test(bakeryHtml));
  assert('bakery: tiene #galeria', /id=["']galeria["']/i.test(bakeryHtml));
  assert(
    'bakery: productos antes de galería',
    findSectionStartIndex(bakeryHtml, 'Productos') < findSectionStartIndex(bakeryHtml, 'Galería')
  );

  const surgical = applySurgicalSectionInsert(bakeryHtml, parsed!, 'es');
  assert('surgical ok', surgical.ok);
  assert('surgical: título presente', /Productos de temporada/i.test(surgical.html));
  assert('surgical: id sección', /id=["']productos-de-temporada["']/i.test(surgical.html));
  assert('surgical: precios', /€|EUR/i.test(surgical.html));
  assert(
    'surgical: imgs',
    (surgical.html.match(/<img\b/gi) || []).length > (bakeryHtml.match(/<img\b/gi) || []).length
  );

  const prodIdx = findSectionStartIndex(surgical.html, 'Productos');
  const tempIdx = findSectionStartIndex(surgical.html, 'Productos de temporada');
  const galIdx = findSectionStartIndex(surgical.html, 'Galería');
  assert('orden: productos < temporada < galería', prodIdx >= 0 && tempIdx > prodIdx && galIdx > tempIdx);

  assert(
    'resto intacto: mismo H1',
    bakeryHtml.match(/<h1[^>]*>[\s\S]*?<\/h1>/i)?.[0] ===
      surgical.html.match(/<h1[^>]*>[\s\S]*?<\/h1>/i)?.[0]
  );
  assert('nav enlace temporada', /href=["']#productos-de-temporada["']/i.test(surgical.html));

  const gateErrors = validateFullpageHtml(surgical.html);
  assert(`validate fullpage (${gateErrors.join('; ') || 'ok'})`, gateErrors.length === 0);

  const markers = changeRequestMarkers(REWRITE_BRIEF);
  assert('markers del pedido', markers.includes('Productos de temporada'));
  assert('htmlHasChangeMarkers', htmlHasChangeMarkers(surgical.html, markers));
  assert('original sin marcador', !htmlHasChangeMarkers(bakeryHtml, markers));

  // —— Precios y Planes después de servicios (gestoría) ——
  const pricingParsed = parseInsertSectionRequest(PRICING_REWRITE);
  assert('pricing parse: título', !!pricingParsed && pricingParsed.title === 'Precios y Planes');
  assert('pricing parse: after servicios', !!pricingParsed && /servicios/i.test(pricingParsed!.afterLabel));
  assert('pricing parse: sin before', !!pricingParsed && pricingParsed!.beforeLabel === '');
  assert('pricing parse: kind', !!pricingParsed && pricingParsed!.kind === 'pricing_plans');

  const gestPlan = buildAgencyPlanFromBrief(GESTORIA, 'es');
  const gestPack = buildBriefImagePack(GESTORIA, 'es');
  let gestHtml = buildDeterministicAgencyHtml(gestPlan, gestPack, GESTORIA, 'es');
  gestHtml = injectSiteChrome(gestHtml, {
    prompt: withAgencyChromePrompt(GESTORIA),
    lang: 'es',
    businessName: gestPlan.businessName,
  });
  assert('gestoría: tiene #servicios', /id=["']servicios["']/i.test(gestHtml));

  const pricingSurgical = applySurgicalSectionInsert(gestHtml, pricingParsed!, 'es');
  assert('pricing surgical ok', pricingSurgical.ok);
  assert('pricing: título', /Precios y Planes/i.test(pricingSurgical.html));
  assert('pricing: id', /id=["']precios-y-planes["']/i.test(pricingSurgical.html));
  assert('pricing: Autónomos', /Aut[oó]nomos/i.test(pricingSurgical.html));
  assert('pricing: PYMES', /PYMES/i.test(pricingSurgical.html));
  assert('pricing: Empresas', /Empresas/i.test(pricingSurgical.html));
  assert('pricing: tabla', /<table\b/i.test(pricingSurgical.html));

  const svcIdx = findSectionStartIndex(pricingSurgical.html, 'Servicios');
  const priceIdx = findSectionStartIndex(pricingSurgical.html, 'Precios y Planes');
  assert('orden: servicios < precios', svcIdx >= 0 && priceIdx > svcIdx);

  const nextSectionAfterPrice = (() => {
    const re = /<section\b[^>]*>/gi;
    let m: RegExpExecArray | null;
    let next = -1;
    while ((m = re.exec(pricingSurgical.html))) {
      if (m.index > priceIdx) {
        next = m.index;
        break;
      }
    }
    return next;
  })();
  assert(
    'precios antes de la siguiente sección',
    nextSectionAfterPrice < 0 || nextSectionAfterPrice > priceIdx
  );

  assert(
    'pricing: mismo H1',
    gestHtml.match(/<h1[^>]*>[\s\S]*?<\/h1>/i)?.[0] ===
      pricingSurgical.html.match(/<h1[^>]*>[\s\S]*?<\/h1>/i)?.[0]
  );
  assert('pricing: nav enlace', /href=["']#precios-y-planes["']/i.test(pricingSurgical.html));

  const pricingGate = validateFullpageHtml(pricingSurgical.html);
  assert(`pricing validate (${pricingGate.join('; ') || 'ok'})`, pricingGate.length === 0);

  const pricingMarkers = changeRequestMarkers(PRICING_REWRITE);
  assert('pricing markers título', pricingMarkers.includes('Precios y Planes'));
  assert('pricing markers Autónomos', pricingMarkers.some((m) => /aut[oó]nomos/i.test(m)));
  assert('pricing htmlHasChangeMarkers', htmlHasChangeMarkers(pricingSurgical.html, pricingMarkers));

  if (process.exitCode) {
    console.log('\nFase 2 checks FAILED');
    process.exit(1);
  }
  console.log('\nFase 2 offline OK');
}

main();
