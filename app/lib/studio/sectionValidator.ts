import type { PreviewSection } from '../ai/studioEngine';

const FORBIDDEN = [
  /<script\b/i,
  /javascript:/i,
  /\bon\w+\s*=/i,
  /<iframe\b/i,
  /<object\b/i,
  /<embed\b/i,
];

export interface SectionValidationResult {
  ok: boolean;
  errors: string[];
  sectionId?: number;
  sectionType?: string;
}

export function validateSectionHtml(html: string, sectionId?: number, sectionType?: string): SectionValidationResult {
  const errors: string[] = [];

  if (!html || html.trim().length < 20) {
    errors.push('HTML demasiado corto o vacío');
  }
  if (!html.includes('<')) {
    errors.push('HTML inválido: sin etiquetas');
  }
  for (const pattern of FORBIDDEN) {
    if (pattern.test(html)) {
      errors.push(`Contenido no permitido: ${pattern.source}`);
    }
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
