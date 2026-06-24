import { getTemplateBySlug } from '../../data/templates';
import { toStudioSections } from '../templatePages';
import { analyzeIntent } from './intentAnalyzer';
import { getContentPreset } from './siteContent';
import { buildCustomSite, describeCreatedSections } from './siteSections';
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

  const sections = buildCustomSite(intent, tpl, preset, lang);
  const previewSections = toStudioSections(sections);
  const created = describeCreatedSections(intent.features, lang);

  const message = lang === 'es'
    ? `He creado la web de «${intent.businessName}» (${intent.businessType}) con: ${created}. Puedes pedirme cambios en cualquier sección.`
    : `I've created the website for «${intent.businessName}» (${intent.businessType}) with: ${created}. Ask me to change any section.`;

  return {
    message,
    previewSections,
    templateSlug: tpl.slug,
    businessName: intent.businessName,
    changedSectionIds: previewSections.map((s) => s.id),
  };
}
