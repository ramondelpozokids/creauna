import { getTemplateBySlug, type TemplateItem } from '../../data/templates';
import { buildIntentFromTemplateSlug, resolveTemplateSlug, type ParsedIntent } from '../ai/intentAnalyzer';
import { getContentPreset } from '../ai/siteContent';
import { buildCustomSite, describeCreatedSections } from '../ai/siteSections';
import { toStudioSections, type StudioPreviewSection } from '../templatePages';

export type CatalogTemplateLoadResult = {
  previewSections: StudioPreviewSection[];
  intent: ParsedIntent;
  template: TemplateItem;
  businessName: string;
  sectionsSummary: string;
};

/** Genera la web completa de una plantilla con buildCustomSite (motor definitivo del Studio). */
export function loadCatalogTemplate(
  templateSlug: string,
  lang: 'es' | 'en'
): CatalogTemplateLoadResult {
  const slug = resolveTemplateSlug(templateSlug);
  const template = getTemplateBySlug(slug);
  if (!template) {
    throw new Error(`Plantilla no encontrada: ${templateSlug}`);
  }

  const intent = buildIntentFromTemplateSlug(slug, lang);
  const preset = getContentPreset(slug);
  const sections = buildCustomSite(intent, template, preset, lang);
  const previewSections = toStudioSections(sections);

  return {
    previewSections,
    intent,
    template,
    businessName: intent.businessName,
    sectionsSummary: describeCreatedSections(intent.features, lang),
  };
}
