/**
 * Build profesional desde brief: arquitectura + imágenes + legales.
 * npx tsx scripts/verify-professional-build.ts
 */
import { buildAgencyPlanFromBrief } from '../app/lib/ai/agencyPipeline';
import { buildBriefImagePack } from '../app/lib/ai/promptFirstQuality';
import { buildDeterministicAgencyHtml } from '../app/lib/ai/agencyDeterministicBuild';
import { injectSiteChrome, withAgencyChromePrompt, promptWantsWhatsApp } from '../app/lib/ai/siteChrome';
import { gateProfessionalImages } from '../app/lib/ai/hardenSiteImages';
import { validateFullpageHtml } from '../app/lib/studio/sectionValidator';
import { IMAGE_BANK } from '../app/lib/ai/imageBank';

function assert(label: string, ok: boolean) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) process.exitCode = 1;
}

const BAKERY = `Panadería artesanal El Trigo Dorado en Valencia.
Pan de masa madre, bollería y pasteles. Catálogo con precios claros.
Colecciones, galería, servicios de encargos, sobre nosotros y contacto con formulario.
Aviso legal y privacidad. Sin carrito online. Sin WhatsApp.`;

async function main() {
  const plan = buildAgencyPlanFromBrief(BAKERY, 'es');
  const pack = buildBriefImagePack(BAKERY, 'es');

  const need = ['nav', 'hero', 'about', 'products', 'why', 'gallery', 'reviews', 'cta', 'contact', 'footer', 'legal'];
  for (const s of need) {
    assert(`plan incluye «${s}»`, plan.sections.includes(s));
  }
  assert('plan: products o services', plan.sections.includes('products') || plan.sections.includes('services'));
  assert('plan: process o faq (profesionales)', plan.sections.includes('process') || plan.sections.includes('faq'));

  let html = buildDeterministicAgencyHtml(plan, pack, BAKERY, 'es');
  html = injectSiteChrome(html, {
    prompt: withAgencyChromePrompt(BAKERY),
    lang: 'es',
    businessName: plan.businessName,
  });

  const pool = [
    ...pack.urls,
    IMAGE_BANK.bakery.hero,
    ...IMAGE_BANK.bakery.bread,
    ...IMAGE_BANK.bakery.pastry,
    ...IMAGE_BANK.bakery.cakes,
    ...IMAGE_BANK.bakery.gallery,
  ];
  const gated = gateProfessionalImages(html, pool);
  html = gated.html;

  assert('gate imágenes ok', gated.ok);
  assert('html denso > 20KB', html.length > 20000);
  assert('H1', /<h1\b/i.test(html));
  assert('hero foto http', /data-cua-hero-bg[\s\S]{0,400}<img[^>]+src=["']https?:\/\//i.test(html));
  assert('productos', /id=["']productos["']/i.test(html));
  assert('nosotros', /id=["']nosotros["']/i.test(html));
  assert('galería', /id=["']galeria["']/i.test(html));
  assert('reseñas', /id=["']reseñas["']/i.test(html));
  assert('cta', /id=["']cta["']/i.test(html));
  assert('contacto + form', /id=["']contacto["']/i.test(html) && /<form\b/i.test(html));
  assert('mapa embed', /maps\.google\.com/i.test(html));
  assert('footer', /<footer\b/i.test(html));
  assert('legales', /privacidad|data-cua-legal/i.test(html));
  assert('nav sticky', /id=["']cua-nav["']/i.test(html) && /fixed top-0/i.test(html));
  assert('menú móvil', /cua-nav-toggle|cua-nav-mobile/i.test(html));
  assert('precios', /€/.test(html));
  assert(
    'sin WA FAB',
    !promptWantsWhatsApp(BAKERY) && !/aria-label=["']WhatsApp["']/i.test(html)
  );
  assert('sin carrito', !/stripe\.com|add\s+to\s+cart|shopping[\s-]?cart/i.test(html));
  assert('sin src vacío', !/src=["']\s*["']/i.test(html));
  assert('sin placeholder CREAUNA en img', !/<img[^>]+src=["'][^"']*CREAUNA/i.test(html));
  assert('≥6 imágenes', (html.match(/<img\b/gi) || []).length >= 6);

  if (plan.sections.includes('process')) {
    assert('proceso', /id=["']proceso["']/i.test(html));
  }
  if (plan.sections.includes('faq')) {
    assert('faq', /id=["']faq["']/i.test(html));
  }

  const gateErrors = validateFullpageHtml(html);
  assert(`validateFullpage (${gateErrors.join('; ') || 'ok'})`, gateErrors.length === 0);

  if (process.exitCode) {
    console.log('\nProfessional build FAILED');
    process.exit(1);
  }
  console.log(`\nProfessional build OK · ${html.length} chars · sections=${plan.sections.join('→')}`);
}

main();
