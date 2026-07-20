import type { PreviewSection } from '../ai/studioEngine';

const FORBIDDEN = [
  /<script\b/i,
  /javascript:/i,
  /<object\b/i,
  /<embed\b/i,
];

function stripGoogleMapIframes(html: string): string {
  return html.replace(/<iframe[\s\S]*?(?:\/>|<\/iframe>)/gi, (tag) =>
    isGoogleMapIframe(tag) ? '' : tag
  );
}

function isGoogleMapIframe(tag: string): boolean {
  if (!/<iframe\b/i.test(tag)) return false;
  const srcMatch = tag.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
  if (!srcMatch?.[1]) return false;
  const src = srcMatch[1].toLowerCase();
  return (
    src.includes('maps.google.com') ||
    src.includes('google.com/maps') ||
    src.includes('maps.googleapis.com')
  );
}

function isScrollToOnclick(handler: string): boolean {
  const h = handler.trim();
  return /^window\.scrollTo\s*\(/i.test(h) || /^scrollTo\s*\(/i.test(h);
}

function hasDisallowedInlineHandlers(html: string): boolean {
  for (const m of html.matchAll(/\bonclick\s*=\s*["']([^"']*)["']/gi)) {
    if (!isScrollToOnclick(m[1])) return true;
  }
  const stripped = html.replace(/\bonclick\s*=\s*["'][^"']*["']/gi, '');
  return /\bon\w+\s*=/i.test(stripped);
}

function hasDisallowedIframe(html: string): boolean {
  const iframes = html.match(/<iframe[\s\S]*?(?:\/>|<\/iframe>)/gi) ?? [];
  return iframes.some((tag) => !isGoogleMapIframe(tag));
}

export interface SectionValidationResult {
  ok: boolean;
  errors: string[];
  sectionId?: number;
  sectionType?: string;
}

/** Gate fullpage (agency + starters): densidad mínima + hero/CTA/legales. No bloquea <script> de chrome. */
export function validateFullpageHtml(html: string): string[] {
  const errors: string[] = [];
  if (!html || html.length < 5000) errors.push('HTML fullpage demasiado corto');
  if (!/<!DOCTYPE\s+html/i.test(html)) errors.push('Falta <!DOCTYPE html>');
  if (!/<\/html>/i.test(html)) errors.push('Falta cierre </html>');
  if (!/<h1\b/i.test(html)) errors.push('Falta H1');
  const hasCta =
    /wa\.me|#contacto|WhatsApp|mailto:|tel:|#reserv|pedir\.html|Contactar|Book|Reservar/i.test(html);
  if (!hasCta) errors.push('Falta CTA de contacto');
  const hasLegal =
    /privacidad|cookies|aviso[\s-]?legal|data-cua-legal|pol[ií]tica\s+de\s+privacidad/i.test(html);
  if (!hasLegal) errors.push('Faltan enlaces legales');
  return errors;
}

export function validateSectionHtml(html: string, sectionId?: number, sectionType?: string): SectionValidationResult {
  if (sectionType === 'fullpage') {
    const errors = validateFullpageHtml(html || '');
    return {
      ok: errors.length === 0,
      errors: errors.length ? errors : [],
      sectionId,
      sectionType,
    };
  }

  const errors: string[] = [];
  const cleaned = stripGoogleMapIframes(html);

  if (!html || html.trim().length < 20) {
    errors.push('HTML demasiado corto o vacío');
  }
  if (!html.includes('<')) {
    errors.push('HTML inválido: sin etiquetas');
  }
  for (const pattern of FORBIDDEN) {
    if (pattern.test(cleaned)) {
      errors.push(`Contenido no permitido: ${pattern.source}`);
    }
  }
  if (hasDisallowedIframe(html)) {
    errors.push('iframe no permitido (solo mapas Google embebidos)');
  }
  if (hasDisallowedInlineHandlers(html)) {
    errors.push('manejadores inline no permitidos');
  }

  return {
    ok: errors.length === 0,
    errors,
    sectionId,
    sectionType,
  };
}

export function validatePreviewSections(
  sections: PreviewSection[],
  changedIds?: number[]
): { ok: boolean; errors: string[] } {
  const targets =
    changedIds && changedIds.length > 0
      ? sections.filter((s) => changedIds.includes(s.id))
      : sections;

  const allErrors: string[] = [];
  for (const sec of targets) {
    const result = validateSectionHtml(sec.html, sec.id, sec.type);
    if (!result.ok) {
      allErrors.push(
        ...result.errors.map((e) => (sec.type ? `[${sec.type}#${sec.id}] ${e}` : e))
      );
    }
  }

  return { ok: allErrors.length === 0, errors: allErrors };
}
