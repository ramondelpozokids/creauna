import { getTemplateBySlug } from '../../data/templates';
import { buildTemplateSections, toStudioSections } from '../templatePages';
import { analyzeIntent } from './intentAnalyzer';
import { getContentPreset } from './siteContent';
import type { PreviewSection } from './studioEngine';

export interface InitialSiteResult {
  message: string;
  previewSections: PreviewSection[];
  templateSlug: string;
  businessName: string;
  changedSectionIds: number[];
}

export function generateInitialSite(prompt: string, lang: 'es' | 'en'): InitialSiteResult {
  const intent = analyzeIntent(prompt, lang);
  const tpl = getTemplateBySlug(intent.templateSlug) ?? getTemplateBySlug('vesper')!;
  const preset = getContentPreset(intent.templateSlug);
  const services = lang === 'es' ? preset.es : preset.en;

  const sections = buildTemplateSections(tpl, lang, {
    businessName: intent.businessName,
    tagline: lang === 'es' ? preset.taglineEs : preset.taglineEn,
    services,
    ctaPrimary: lang === 'es' ? preset.ctaPrimaryEs : preset.ctaPrimaryEn,
    ctaSecondary: lang === 'es' ? preset.ctaSecondaryEs : preset.ctaSecondaryEn,
  });

  const previewSections = toStudioSections(sections);

  const message = lang === 'es'
    ? `He creado la web de «${intent.businessName}» (${intent.businessType}) con la plantilla ${tpl.nameEs}. Puedes pedirme cambios en cualquier sección.`
    : `I've created the website for «${intent.businessName}» (${intent.businessType}) using the ${tpl.nameEn} template. Ask me to change any section.`;

  return {
    message,
    previewSections,
    templateSlug: tpl.slug,
    businessName: intent.businessName,
    changedSectionIds: previewSections.map((s) => s.id),
  };
}
