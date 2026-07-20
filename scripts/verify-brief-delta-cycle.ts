/**
 * Ciclo brief → build → deltas (gestoría).
 * npx tsx scripts/verify-brief-delta-cycle.ts
 */
import { buildAgencyPlanFromBrief } from '../app/lib/ai/agencyPipeline';
import { buildBriefImagePack } from '../app/lib/ai/promptFirstQuality';
import { buildDeterministicAgencyHtml } from '../app/lib/ai/agencyDeterministicBuild';
import { injectSiteChrome, withAgencyChromePrompt, promptWantsWhatsApp } from '../app/lib/ai/siteChrome';
import { gateProfessionalImages } from '../app/lib/ai/hardenSiteImages';
import { IMAGE_BANK } from '../app/lib/ai/imageBank';
import {
  parseInsertSectionRequest,
  applySurgicalDelta,
  findSectionStartIndex,
} from '../app/lib/ai/surgicalSectionChange';
import { validateFullpageHtml } from '../app/lib/studio/sectionValidator';

function assert(label: string, ok: boolean) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) process.exitCode = 1;
}

function sectionFingerprint(html: string, id: string): string {
  const re = new RegExp(`<section\\b[^>]*id=["']${id}["'][^>]*>[\\s\\S]*?<\\/section>`, 'i');
  return html.match(re)?.[0]?.replace(/\s+/g, ' ').trim() || '';
}

const BRIEF0 = `Crea una página web profesional para una gestoría y asesoría llamada Gestoría Integral López.
La empresa ofrece servicios de asesoría fiscal, contable, laboral, jurídica y creación de empresas para autónomos, pymes y particulares.
El diseño debe transmitir confianza, profesionalidad y modernidad, utilizando colores azul oscuro, blanco y gris con pequeños detalles en verde.
La página debe incluir un hero profesional con una llamada a la acción, una sección de servicios, una sección "Quiénes somos", una explicación del proceso de trabajo, ventajas de contratar la gestoría, preguntas frecuentes, reseñas de clientes, formulario de contacto, mapa de Google, botón flotante de WhatsApp, horario, redes sociales, footer completo y todas las páginas legales (Aviso Legal, Política de Privacidad, Política de Cookies, Accesibilidad y Protección de Datos).
Añade una sección con los modelos fiscales más habituales (IVA, IRPF, Sociedades, Autónomos, etc.) explicando brevemente cada uno.
No debe existir tienda online ni carrito de compra.`;

const BRIEF1 = `Mantén todo el diseño y la estructura actual. Añade una nueva sección llamada "Precios y Planes" después de la sección de servicios. Incluye tres planes orientativos para Autónomos, PYMES y Empresas con una tabla comparativa de servicios. No modifiques ninguna otra parte de la web.`;

const BRIEF2 = `La gestoría ahora también ofrece una plataforma online para que los clientes gestionen su negocio desde cualquier lugar. Sin eliminar nada de la web existente, añade una nueva sección llamada "Plataforma Digital", donde expliques las principales funcionalidades: subida de facturas, consulta de impuestos, acceso a nóminas, firma digital, notificaciones, panel de control y asistencia mediante inteligencia artificial. Actualiza también el hero para destacar este nuevo servicio, manteniendo intacto el resto de la página.`;

async function main() {
  const plan = buildAgencyPlanFromBrief(BRIEF0, 'es');
  const pack = buildBriefImagePack(BRIEF0, 'es');
  assert('v0 variant corporate', pack.variant === 'corporate');
  assert('v0 plan servicios', plan.sections.includes('services'));
  assert('v0 plan tax_models', plan.sections.includes('tax_models'));
  assert('v0 plan about', plan.sections.includes('about'));
  assert('v0 plan process', plan.sections.includes('process'));
  assert('v0 plan faq', plan.sections.includes('faq'));
  assert('v0 plan reviews', plan.sections.includes('reviews'));
  assert('v0 sin carrito', !plan.sections.includes('cart'));

  let v0 = buildDeterministicAgencyHtml(plan, pack, BRIEF0, 'es');
  v0 = injectSiteChrome(v0, {
    prompt: withAgencyChromePrompt(BRIEF0),
    lang: 'es',
    businessName: plan.businessName,
  });
  const pool = [
    IMAGE_BANK.corporate.hero,
    IMAGE_BANK.corporate.team,
    ...IMAGE_BANK.corporate.office,
    ...IMAGE_BANK.corporate.gallery,
  ];
  v0 = gateProfessionalImages(v0, pool).html;

  assert('v0 H1', /<h1\b/i.test(v0));
  assert('v0 servicios', /id=["']servicios["']/i.test(v0));
  assert('v0 modelos', /id=["']modelos["']/i.test(v0) && /IVA|IRPF/i.test(v0));
  assert('v0 nosotros', /id=["']nosotros["']/i.test(v0));
  assert('v0 contacto + form', /id=["']contacto["']/i.test(v0) && /<form\b/i.test(v0));
  assert('v0 mapa', /maps\.google\.com/i.test(v0));
  assert('v0 WA (brief lo pide)', promptWantsWhatsApp(BRIEF0));
  assert('v0 legales texto', /Aviso Legal/i.test(v0) && /Pol[ií]tica de Privacidad/i.test(v0));
  assert('v0 legales modal', /id=["']cua-legal-modal["']/i.test(v0) && /openModal\s*\(/i.test(v0));
  assert('v0 hero corporate http', /data-cua-hero-bg[\s\S]{0,500}src=["']https?:\/\//i.test(v0));
  assert('v0 sin carrito html', !/stripe\.com|add\s+to\s+cart|shopping[\s-]?cart/i.test(v0));
  const v0Gate = validateFullpageHtml(v0);
  assert(`v0 validate (${v0Gate.join('; ') || 'ok'})`, v0Gate.length === 0);

  const h1v0 = v0.match(/<h1[^>]*>[\s\S]*?<\/h1>/i)?.[0] || '';
  const fpServicios0 = sectionFingerprint(v0, 'servicios');
  const fpNosotros0 = sectionFingerprint(v0, 'nosotros');

  // —— Delta 1: Precios y Planes ——
  const p1 = parseInsertSectionRequest(BRIEF1);
  assert('d1 parse precios', !!p1 && p1.title === 'Precios y Planes' && p1.kind === 'pricing_plans');
  const d1 = applySurgicalDelta(v0, BRIEF1, 'es');
  assert('d1 ok insert', d1.ok && d1.didInsert && !d1.didHero);
  const v1 = d1.html;
  assert('d1 sección precios', /id=["']precios-y-planes["']/i.test(v1));
  assert('d1 tabla', /<table\b/i.test(v1));
  assert('d1 mismo H1', (v1.match(/<h1[^>]*>[\s\S]*?<\/h1>/i)?.[0] || '') === h1v0);
  assert('d1 servicios intacto', sectionFingerprint(v1, 'servicios') === fpServicios0);
  assert('d1 nosotros intacto', sectionFingerprint(v1, 'nosotros') === fpNosotros0);
  const svc = findSectionStartIndex(v1, 'Servicios');
  const price = findSectionStartIndex(v1, 'Precios y Planes');
  assert('d1 orden servicios < precios', svc >= 0 && price > svc);

  // —— Delta 2: Plataforma Digital + hero ——
  const p2 = parseInsertSectionRequest(BRIEF2);
  assert('d2 parse plataforma', !!p2 && /plataforma\s+digital/i.test(p2!.title) && p2!.kind === 'digital_platform');
  const d2 = applySurgicalDelta(v1, BRIEF2, 'es');
  assert('d2 ok insert+hero', d2.ok && d2.didInsert && d2.didHero);
  const v2 = d2.html;
  assert('d2 sección plataforma', /id=["']plataforma-digital["']/i.test(v2));
  assert('d2 facturas + nóminas', /facturas/i.test(v2) && /n[oó]minas/i.test(v2));
  assert('d2 hero badge', /data-cua-hero-badge/i.test(v2));
  assert('d2 H1 distinto o badge', /data-cua-hero-badge/i.test(v2));
  assert('d2 precios sigue', /id=["']precios-y-planes["']/i.test(v2));
  assert('d2 servicios intacto', sectionFingerprint(v2, 'servicios') === fpServicios0);
  assert('d2 nosotros intacto', sectionFingerprint(v2, 'nosotros') === fpNosotros0);
  const v2Gate = validateFullpageHtml(v2);
  assert(`d2 validate (${v2Gate.join('; ') || 'ok'})`, v2Gate.length === 0);

  if (process.exitCode) {
    console.log('\nBrief→delta cycle FAILED');
    process.exit(1);
  }
  console.log('\nBrief→delta cycle OK');
}

main();
