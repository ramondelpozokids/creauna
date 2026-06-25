import type { PreviewSection } from '../ai/studioEngine';

const FORBIDDEN = [
  /<script\b/i,
  /javascript:/i,
  /<object\b/i,
  /<embed\b/i,
];

/** Patrones permitidos en HTML generado por CREAUNA (mapas, scroll-up). */
const ALLOWED_IFRAME = /<iframe[^>]*\ssrc="https:\/\/(?:maps\.google\.com|www\.google\.com\/maps)[^"]*"[^>]*>\s*<\/iframe>/gi;
const ALLOWED_SCROLL_ONCLICK = /\bonclick="window\.scrollTo\(\{top:0,behavior:'smooth'\}\)"/gi;

function stripAllowedPatterns(html: string): string {
  return html.replace(ALLOWED_IFRAME, '').replace(ALLOWED_SCROLL_ONCLICK, '');
}

function hasDisallowedInlineHandlers(html: string): boolean {
  const stripped = html.replace(ALLOWED_SCROLL_ONCLICK, '');
  return /\bon\w+\s*=/i.test(stripped);
}

function hasDisallowedIframe(html: string): boolean {
  const withoutAllowed = html.replace(ALLOWED_IFRAME, '');
  return /<iframe\b/i.test(withoutAllowed);
}

export interface SectionValidationResult {
  ok: boolean;
  errors: string[];
  sectionId?: number;
  sectionType?: string;
}

export function validateSectionHtml(html: string, sectionId?: number, sectionType?: string): SectionValidationResult {
  const errors: string[] = [];
  const cleaned = stripAllowedPatterns(html);

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
