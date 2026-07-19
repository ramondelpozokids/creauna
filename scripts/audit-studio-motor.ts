/**
 * Auditoría offline del motor Studio (sin IA): routing, hero, chrome, image bank.
 * npx tsx scripts/audit-studio-motor.ts
 */
import { assessBriefQuality, buildBriefImagePack } from '../app/lib/ai/promptFirstQuality';
import { buildAgencyPlanFromBrief, isMetaHeroPhrase } from '../app/lib/ai/agencyPipeline';
import { extractClientContact, extractPhone, injectSiteChrome } from '../app/lib/ai/siteChrome';
import { imagesForVariant } from '../app/lib/ai/imageBank';
import { detectVariant } from '../app/lib/ai/businessProfiles';

const SHORT: { sector: string; prompt: string }[] = [
  { sector: 'beauty', prompt: 'web para mi peluquería' },
  { sector: 'cafe', prompt: 'necesito web cafetería' },
  { sector: 'tattoo', prompt: 'página para tatuajes' },
  { sector: 'corporate', prompt: 'web empresa reformas' },
  { sector: 'jewelry', prompt: 'web joyería lujo' },
];

const LONG: { sector: string; prompt: string }[] = [
  {
    sector: 'beauty',
    prompt: `Nombre
Studio Nora
Título
Belleza que se nota
WhatsApp 612345678
Instagram https://instagram.com/studionora
Calle Mayor 12, 28013 Madrid
Secciones: hero, servicios, galería, contacto, WhatsApp, aviso legal y privacidad
Calidad de agencia premium`,
  },
  {
    sector: 'fashion',
    prompt: `Marca VELORA boutique moda
Eslogan: La elegancia nunca pasa de moda
Lookbook, colección, productos, carrito visual, redes sociales Instagram https://instagram.com/velora
Hero full-bleed premium con foto
Sin plantilla ni Bootstrap`,
  },
  {
    sector: 'cafe',
    prompt: `Café Aurora en Barcelona
Menú, galería, reservas, ubicación Calle Pau Claris 45
Teléfono 933112233
Horario todos los días
Hero con foto, Google Fonts, calidad agencia`,
  },
  {
    sector: 'jewelry',
    prompt: `Atelier Joyas — alta relojería
Título: Joyas con historia
CIF B12345678
Email hola@atelierjoyas.es
WhatsApp +34 600111222
Aviso legal, privacidad, cookies
Galería productos Rolex Cartier`,
  },
  {
    sector: 'tattoo',
    prompt: `Royal Ink tattoo studio Madrid
Portfolio galería, servicios, reseñas, contacto
Instagram https://instagram.com/royalink
WhatsApp 699887766
Hero arte en la piel, tipografía premium`,
  },
];

function scoreShort(p: string): { ok: boolean; detail: string } {
  const q = assessBriefQuality(p);
  const plan = buildAgencyPlanFromBrief(p, 'es');
  const pack = buildBriefImagePack(p, 'es');
  const variant = detectVariant(p);
  const phone = extractPhone(p);
  const fails: string[] = [];
  if (!q.weak) fails.push('brief corto debería ser weak');
  if (isMetaHeroPhrase(plan.heroTitle || '')) fails.push(`H1 meta: ${plan.heroTitle}`);
  if (!plan.heroTitle || plan.heroTitle.length < 8) fails.push('sin H1 sectorial');
  if (pack.urls.length < 3) fails.push('pocas URLs pack');
  if (phone) fails.push('no debería inventar teléfono en brief corto sin número');
  // short briefs always go agency in code path — we only check plan quality here
  return {
    ok: fails.length === 0,
    detail: fails.length
      ? fails.join('; ')
      : `weak=${q.weak} H1=«${plan.heroTitle}» variant=${variant} pack=${pack.variant}`,
  };
}

function scoreLong(p: string): { ok: boolean; detail: string } {
  const q = assessBriefQuality(p);
  const plan = buildAgencyPlanFromBrief(p, 'es');
  const pack = buildBriefImagePack(p, 'es');
  const contact = extractClientContact(p);
  const chrome = injectSiteChrome(
    `<!DOCTYPE html><html><body><footer></footer></body></html>`,
    { prompt: p, lang: 'es', businessName: plan.businessName }
  );
  const fails: string[] = [];
  if (q.weak) fails.push('brief largo no debería ser weak');
  if (isMetaHeroPhrase(plan.heroTitle || '')) fails.push(`H1 meta: ${plan.heroTitle}`);
  if (!contact.phone && /whatsapp|tel[eé]fono|\+34|[67]\d{8}/i.test(p)) fails.push('no extrajo teléfono');
  if (/34622481930/.test(chrome)) fails.push('teléfono demo hardcoded');
  if (/whatsapp/i.test(p) && contact.phone && !chrome.includes(`wa.me/${contact.phone}`)) {
    fails.push('WA no usa teléfono del brief');
  }
  if (/instagram\.com\//i.test(p) && contact.instagram && !chrome.includes(contact.instagram)) {
    // social only injected if module requested — Instagram keyword triggers social
    if (/instagram/i.test(p) && !/data-cua-socials/i.test(chrome) && !chrome.includes('instagram.com/')) {
      fails.push('redes no inyectadas');
    }
  }
  if (pack.urls.length < 4) fails.push('pack corto');
  return {
    ok: fails.length === 0,
    detail: fails.length
      ? fails.join('; ')
      : `score=${q.score} H1=«${plan.heroTitle}» phone=${contact.phone || '—'} pack=${pack.variant}`,
  };
}

function scoreBank(): { ok: boolean; detail: string } {
  const fails: string[] = [];
  const jew = imagesForVariant('jewelry');
  const unk = imagesForVariant('unknown_sector_xyz');
  const cafe = imagesForVariant('cafe');
  if (!('hero' in jew)) fails.push('jewelry sin hero');
  if (unk === cafe) fails.push('default sigue siendo cafe');
  if (!('hero' in unk)) fails.push('default sin hero');
  return { ok: fails.length === 0, detail: fails.join('; ') || 'jewelry + default≠cafe OK' };
}

async function main() {
  console.log('\n=== Auditoría motor Studio (offline) ===\n');
  let ok = 0;
  let fail = 0;

  console.log('-- Briefs cortos --');
  for (const t of SHORT) {
    const r = scoreShort(t.prompt);
    console.log(`${r.ok ? 'OK' : 'FAIL'} [${t.sector}] ${r.detail}`);
    if (r.ok) ok++;
    else fail++;
  }

  console.log('\n-- Briefs largos --');
  for (const t of LONG) {
    const r = scoreLong(t.prompt);
    console.log(`${r.ok ? 'OK' : 'FAIL'} [${t.sector}] ${r.detail}`);
    if (r.ok) ok++;
    else fail++;
  }

  console.log('\n-- Image bank --');
  const bank = scoreBank();
  console.log(`${bank.ok ? 'OK' : 'FAIL'} ${bank.detail}`);
  if (bank.ok) ok++;
  else fail++;

  const total = ok + fail;
  const pct = Math.round((ok / total) * 100);
  console.log(`\n=== ${ok}/${total} OK · ${pct}% criterios offline ===\n`);
  if (fail > 0) process.exit(1);
}

main();
