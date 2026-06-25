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

export function validateSectionHtml(html: string, sectionId?: number, sectionType?: string): SectionValidationResult {
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
