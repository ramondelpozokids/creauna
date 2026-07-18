/**
 * Calidad de generación prompt-first: el brief manda estructura y copy;
 * este módulo solo evita wireframes y aporta URLs de imagen fiables (no plantillas).
 */

import { analyzeIntent } from './intentAnalyzer';
import { imageBriefForVariant, imagesForVariant } from './imageBank';
import { ensureMinimumGallery, hardenSiteImages, reliableImagePool } from './hardenSiteImages';

export interface BriefImagePack {
  variant: string;
  briefBlock: string;
  urls: string[];
}

/** Empaqueta URLs reales según el sector detectado en el brief — assets, no layout. */
export function buildBriefImagePack(prompt: string, lang: 'es' | 'en'): BriefImagePack {
  const intent = analyzeIntent(prompt, lang);
  const bank = imagesForVariant(intent.variant);
  const urls: string[] = [];
  for (const val of Object.values(bank)) {
    if (typeof val === 'string') urls.push(val);
    else if (Array.isArray(val)) urls.push(...val);
  }
  return {
    variant: intent.variant,
    briefBlock: imageBriefForVariant(intent.variant),
    urls: [...new Set(urls)].slice(0, 24),
  };
}

export function countHtmlImages(html: string): number {
  const imgs = (html.match(/<img\b/gi) || []).length;
  const bgs = (html.match(/background-image\s*:\s*url\(/gi) || []).length;
  return imgs + bgs;
}

/** El cliente prohíbe plantillas / Bootstrap / “generado automático”. */
export function clientRejectsTemplates(prompt: string): boolean {
  return /no\s+quiero\s+(una\s+)?plantilla|sin\s+plantilla|no\s+plantilla|no\s+quiero\s+bootstrap|sin\s+bootstrap|no\s+bootstrap|generado\s+autom[aá]ticamente|nada\s+que\s+parezca\s+generado|no\s+copiar|construir\s+no\s+copiar/i.test(
    prompt
  );
}

/** Texto visible aproximado (sin scripts/estilos/tags). */
export function visibleTextLength(html: string): number {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;
}

/**
 * Caso tipo hero gris: navbar + bloque vacío y casi nada más.
 * Aunque el HTML sea “largo” por CDN/CSS, el contenido útil es nulo.
 */
export function isSkeletonLanding(html: string): boolean {
  const textLen = visibleTextLength(html);
  if (textLen < 280) return true;

  const sections = (html.match(/<section\b/gi) || []).length;
  const h1 = (html.match(/<h1\b/gi) || []).length;
  const imgs = countHtmlImages(html);

  if (h1 === 0 && textLen < 600) return true;
  if (sections <= 1 && imgs < 2 && textLen < 900) return true;
  if (sections < 3 && imgs < 3 && textLen < 1200) return true;

  return false;
}

/**
 * Extrae textos literales del brief que DEBEN aparecer en el HTML.
 * No inventa copy: solo levanta lo que el cliente ya escribió.
 */
export function extractBriefMustHaves(prompt: string): string[] {
  const must: string[] = [];
  const nextLineAfter = (label: RegExp): string | null => {
    const lines = prompt.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (!label.test(lines[i].trim())) continue;
      const same = lines[i].replace(label, '').replace(/^[:\s]+/, '').trim();
      if (same.length >= 4) return same.replace(/^["«]+|["»]+$/g, '').trim();
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const t = lines[j].trim().replace(/^["«]+|["»]+$/g, '').trim();
        if (!t || /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]{2,}$/.test(t)) continue;
        if (t.length >= 4) return t;
      }
    }
    return null;
  };

  const title = nextLineAfter(/^t[ií]tulo\b/i);
  const badge = nextLineAfter(/^badge\b/i);
  const subtitle = nextLineAfter(/^subt[ií]tulo\b/i);
  const name = nextLineAfter(/^nombre\b/i);
  if (title) must.push(title);
  if (badge) must.push(badge);
  if (subtitle && subtitle.length <= 180) must.push(subtitle.slice(0, 80));
  if (name) must.push(name);

  const espIdx = prompt.search(/especialidades|especiality|specialt/i);
  if (espIdx >= 0) {
    const chunk = prompt.slice(espIdx, espIdx + 800);
    for (const line of chunk.split(/\r?\n/)) {
      const t = line.trim();
      if (/^(doner|döner|durum|box|falafel|platos?|men[uú]s?)/i.test(t) && t.length < 40) {
        must.push(t.replace(/^[-•*]\s*/, ''));
      }
    }
  }

  const street = prompt.match(/Calle\s+[A-Za-zÁÉÍÓÚáéíóúñÑ][^\n,]{3,40}/);
  if (street) must.push(street[0].trim());

  return [...new Set(must.map((s) => s.trim()).filter((s) => s.length >= 4))].slice(0, 14);
}

export function missingBriefRequirements(html: string, prompt: string): string[] {
  const must = extractBriefMustHaves(prompt);
  const lower = html.toLowerCase();
  return must.filter((m) => !lower.includes(m.toLowerCase()));
}

/** Hero con tipografía real (h1 + CTA), no un bloque gris vacío. */
export function hasHeroWithCopy(html: string): boolean {
  if (!/<h1\b/i.test(html)) return false;

  const blocks = [
    ...html.matchAll(
      /<(?:section|header|div)[^>]*(?:min-h-\[(?:7|8|9|100)|h-screen|min-h-screen|id=["']hero)[^>]*>([\s\S]*?)(?=<\/(?:section|header|div)>)/gi
    ),
  ];

  for (const m of blocks.slice(0, 3)) {
    const text = m[1]
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const hasCta = /ver men[uú]|c[oó]mo llegar|reserv|pedir|visitar|menu|order|visit/i.test(m[1]);
    if (text.length >= 70 && /<h1\b/i.test(m[1]) && hasCta) return true;
    if (text.length >= 100 && /<h1\b/i.test(m[1])) return true;
  }

  const head = html.slice(0, 12000);
  const h1Text = head.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '';
  if (h1Text.length < 12) return false;
  if (!/<a\b|<button\b/i.test(head)) return false;
  return !isEmptyGreyHeroBlock(html);
}

function isEmptyGreyHeroBlock(html: string): boolean {
  const m = html.match(
    /<(?:section|div|header)[^>]*(?:min-h-\[(?:7|8|9|100)|h-screen|min-h-screen)[^>]*>([\s\S]{0,2500})/i
  );
  if (!m) {
    const first = html.match(/<body[^>]*>([\s\S]{0,4000})/i);
    if (!first) return false;
    const text = first[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length < 120;
  }
  const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const grey =
    /bg-(?:slate|gray|zinc|neutral|stone)-(?:[4-9]00|950)/i.test(m[0]) ||
    /background(?:-color)?:\s*#?(?:[4-9a-f]{3}|666|777|888|999|aaa|ccc|6b7280|64748b|1f2937|111827)/i.test(
      m[0]
    );
  return (grey && text.length < 80) || text.length < 40;
}

/**
 * Detecta HTML de "mockup" / wireframe que no se puede cobrar como web premium.
 */
export function isWireframeHtml(html: string): boolean {
  if (!html || html.length < 12000) return true;
  if (isSkeletonLanding(html)) return true;

  const images = countHtmlImages(html);
  if (images < 5) return true;

  const hasFonts = /fonts\.googleapis\.com/i.test(html);
  if (!hasFonts) return true;

  if (!hasHeroWithCopy(html)) return true;
  if (isEmptyGreyHeroBlock(html)) return true;

  const hasHeroPhoto =
    /(?:min-h-\[(?:7|8|9|100)|h-screen|min-h-screen|id=["']hero)[\s\S]{0,1200}(?:<img\b|background-image\s*:\s*url\()/i.test(
      html
    ) ||
    /(?:<img\b|background-image\s*:\s*url\()[\s\S]{0,1200}(?:min-h-\[(?:7|8|9|100)|h-screen|min-h-screen)/i.test(
      html
    );

  if (!hasHeroPhoto) return true;

  const cardBlocks = html.match(/rounded-(?:2xl|3xl|xl)[^>]*(?:border|shadow)/gi) || [];
  if (cardBlocks.length >= 4 && images < 6) return true;

  const sections = (html.match(/<section\b/gi) || []).length;
  if (sections < 4 && html.length < 20000) return true;

  return false;
}

/** Combina wireframe + cumplimiento del brief del cliente. */
export function isUnacceptableAgencyHtml(html: string, prompt: string): boolean {
  if (isSkeletonLanding(html)) return true;
  if (isWireframeHtml(html)) return true;
  if (!hasHeroWithCopy(html)) return true;
  const missing = missingBriefRequirements(html, prompt);
  if (extractBriefMustHaves(prompt).length >= 3 && missing.length >= 2) return true;
  if (prompt.length > 1500 && missing.length >= 3) return true;
  return false;
}

/** Sustituye placeholders/hosts frágiles por pack Unsplash+Pexels + fallback onerror. */
export function ensureBriefImagesInHtml(html: string, urls: string[]): string {
  if (!urls.length) return html;
  let out = hardenSiteImages(html, urls);
  out = ensureMinimumGallery(out, urls);

  if (isEmptyGreyHeroBlock(out) || !hasHeroWithCopy(out)) {
    const heroUrl = reliableImagePool(urls)[0];
    if (heroUrl) {
      out = out.replace(
        /(class="[^"]*(?:min-h-\[(?:7|8|9|100)vh\]|min-h-screen|h-screen)[^"]*")/i,
        `$1 style="background-image:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('${heroUrl.replace(/'/g, '%27')}');background-size:cover;background-position:center"`
      );
    }
  }
  return out;
}

export function wireframeRejectHint(lang: 'es' | 'en', pack: BriefImagePack, missing: string[] = []): string {
  const missBlock =
    missing.length > 0
      ? lang === 'es'
        ? `\nTEXTOS DEL BRIEF QUE FALTAN (deben aparecer literalmente):\n- ${missing.join('\n- ')}\n`
        : `\nMISSING BRIEF STRINGS (must appear literally):\n- ${missing.join('\n- ')}\n`
      : '';

  return lang === 'es'
    ? `RECHAZADO: tu HTML anterior NO es cobrable (hero vacío/gris, sin copy del brief, sin fotos reales o sin tipografía).
Reconstruye la web COMPLETA desde el brief — CONSTRUIR, no plantilla:
- Hero min-h-[85vh] con FOTO real + overlay + badge + H1 del brief + subtítulo + botones «Ver Menú» y «Cómo llegar»
- PROHIBIDO hero gris vacío sin texto
- Especialidades con imagen en cada tarjeta; galería composición moderna ≥6 fotos
- Playfair Display + Inter si el brief lo pide; paleta del brief (ej. #D62828)
- Navbar glass al scroll; secciones storytelling / ubicación / CTA / footer
- USA SOLO estas URLs:\n${pack.briefBlock}${missBlock}
Devuelve SOLO el HTML completo, largo y denso (no un esqueleto).`
    : `REJECTED: previous HTML is not billable (empty/grey hero, missing brief copy, no real photos).
Rebuild the FULL site from the brief — BUILD, do not template.
Hero with real photo + overlay + brief H1 + CTAs. No empty grey heroes.
USE ONLY these URLs:\n${pack.briefBlock}${missBlock}
Return ONLY complete dense HTML.`;
}
