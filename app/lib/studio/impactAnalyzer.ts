import { isCosmeticPrompt, isSiteBuildPrompt } from '../ai/intentAnalyzer';
import type { ImpactInput, ImpactResult, ImpactRisk, ImpactScope, SectionMeta } from './contextTypes';

function allSectionIds(sections: SectionMeta[]): number[] {
  return sections.map((s) => s.id);
}

function allSectionTypes(sections: SectionMeta[]): string[] {
  return sections.map((s) => s.type);
}

function singleSection(
  sections: SectionMeta[],
  sectionId: number | undefined,
  fallbackType = 'hero'
): { ids: number[]; types: string[] } {
  const target =
    (sectionId !== undefined ? sections.find((s) => s.id === sectionId) : undefined) ??
    sections.find((s) => s.type === fallbackType) ??
    sections[0];
  if (!target) return { ids: [], types: [] };
  return { ids: [target.id], types: [target.type] };
}

function cosmeticScope(prompt: string, sections: SectionMeta[]): { scope: ImpactScope; ids: number[] } {
  const lower = prompt.toLowerCase();
  const ids = allSectionIds(sections);

  if (
    lower.includes('hero') ||
    lower.includes('impactante') ||
    lower.includes('impactful') ||
    lower.includes('cabecera')
  ) {
    const hero = sections.find((s) => s.type === 'hero');
    return { scope: 'single', ids: hero ? [hero.id] : ids.slice(0, 1) };
  }

  if (
    lower.includes('contacto') ||
    lower.includes('contact') ||
    lower.includes('botón') ||
    lower.includes('button')
  ) {
    const contact = sections.find((s) => s.type === 'contact');
    return { scope: 'single', ids: contact ? [contact.id] : ids.slice(0, 1) };
  }

  if (
    lower.includes('testimonio') ||
    lower.includes('testimonial') ||
    lower.includes('reseñ') ||
    lower.includes('servicio') ||
    lower.includes('service') ||
    lower.includes('sección') ||
    lower.includes('section')
  ) {
    return { scope: 'full', ids };
  }

  return { scope: 'multi', ids };
}

function riskForScope(scope: ImpactScope, action: string): ImpactRisk {
  if (scope === 'full' || action === 'regenerate' || action === 'initial') return 'high';
  if (scope === 'multi' || action === 'style') return 'medium';
  return 'low';
}

function reason(
  lang: 'es' | 'en',
  scope: ImpactScope,
  action: string,
  count: number
): { es: string; en: string } {
  if (action === 'regenerate') {
    return {
      es: 'Regeneración completa: todas las secciones pueden cambiar.',
      en: 'Full regeneration: all sections may change.',
    };
  }
  if (action === 'style') {
    return {
      es: 'Cambio de estilo global aplicado a toda la vista.',
      en: 'Global style change applied to the full view.',
    };
  }
  if (action === 'initial') {
    return {
      es: 'Generación inicial: se creará o reemplazará la estructura completa.',
      en: 'Initial generation: full structure will be created or replaced.',
    };
  }
  if (scope === 'single') {
    return {
      es: `Edición quirúrgica: 1 sección afectada.`,
      en: `Surgical edit: 1 section affected.`,
    };
  }
  if (scope === 'multi') {
    return {
      es: `Varias secciones pueden cambiar (≈${count}).`,
      en: `Multiple sections may change (≈${count}).`,
    };
  }
  return {
    es: `Impacto amplio: ${count} secciones en juego.`,
    en: `Wide impact: ${count} sections involved.`,
  };
}

/** Analiza alcance y riesgo antes de consumir crédito o mutar estado. */
export function analyzeStudioImpact(input: ImpactInput): ImpactResult {
  const { prompt, lang, action, sectionId, previewSections } = input;
  const sections = previewSections ?? [];
  const warnings: { es: string; en: string }[] = [];

  let scope: ImpactScope = 'single';
  let affectedSectionIds: number[] = [];

  if (action === 'initial' || (action === 'change' && isSiteBuildPrompt(prompt))) {
    scope = 'full';
    affectedSectionIds = allSectionIds(sections);
  } else if (action === 'regenerate' || action === 'style') {
    scope = 'full';
    affectedSectionIds = allSectionIds(sections);
  } else if (action === 'improve') {
    scope = 'single';
    const single = singleSection(sections, sectionId);
    affectedSectionIds = single.ids;
    if (!sectionId) {
      warnings.push({
        es: 'No se indicó sección; se mejorará la sección principal.',
        en: 'No section specified; the main section will be improved.',
      });
    }
  } else if (action === 'change' && isCosmeticPrompt(prompt)) {
    const cosmetic = cosmeticScope(prompt, sections);
    scope = cosmetic.scope;
    affectedSectionIds = cosmetic.ids;
  } else if (action === 'change') {
    scope = 'single';
    affectedSectionIds = singleSection(sections, sectionId).ids;
  } else {
    scope = 'single';
    affectedSectionIds = singleSection(sections, sectionId).ids;
  }

  const risk = riskForScope(scope, action);
  const texts = reason(lang, scope, action, affectedSectionIds.length);
  const affectedSectionTypes = sections
    .filter((s) => affectedSectionIds.includes(s.id))
    .map((s) => s.type);

  if (scope === 'full') {
    warnings.push({
      es: 'Se recomienda confirmar: este cambio puede alterar todo el diseño.',
      en: 'Confirmation recommended: this change may alter the entire design.',
    });
  }

  return {
    scope,
    affectedSectionIds,
    affectedSectionTypes,
    risk,
    willConsumeCredit: true,
    reasonEs: texts.es,
    reasonEn: texts.en,
    warnings,
  };
}
