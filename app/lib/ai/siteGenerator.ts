import { getTemplateBySlug } from '../../data/templates';
import { toStudioSections } from '../templatePages';
import { analyzeIntent } from './intentAnalyzer';
import { getContentPreset } from './siteContent';
import { buildCustomSite, describeCreatedSections } from './siteSections';
import { parseGoogleListing } from './googleListingParser';
import { getBusinessProfile } from './businessProfiles';
import { buildSiteBrief, enhanceSiteWithAgents } from './siteAiEnhancer';
import type { PreviewSection } from './studioEngine';

export interface InitialSiteResult {
  message: string;
  previewSections: PreviewSection[];
  templateSlug: string;
  businessName: string;
  changedSectionIds: number[];
  motorsUsed?: string[];
  source: 'rules' | 'ai' | 'hybrid';
}

export async function generateInitialSite(prompt: string, lang: 'es' | 'en'): Promise<InitialSiteResult> {
  const listing = parseGoogleListing(prompt);
  const intent = analyzeIntent(prompt, lang);
  const tpl = getTemplateBySlug(intent.templateSlug) ?? getTemplateBySlug('iron-ink')!;
  const preset = getContentPreset(intent.templateSlug);
  const profile = getBusinessProfile(intent.variant, listing);

  const ruleSections = buildCustomSite(intent, tpl, preset, lang, listing);
  const brief = buildSiteBrief(intent, profile, listing, lang, prompt);
  const { sections, motorsUsed, aiEnhanced } = await enhanceSiteWithAgents(ruleSections, brief);

  const previewSections = toStudioSections(sections);
  const created = describeCreatedSections(intent.features, lang);
  const businessName = listing?.businessName ?? intent.businessName;

  const motorNote = aiEnhanced && motorsUsed.length
    ? (lang === 'es'
      ? ` Motores IA: ${motorsUsed.join(', ')}.`
      : ` AI engines: ${motorsUsed.join(', ')}.`)
    : '';

  const message = lang === 'es'
    ? `He creado la web de «${businessName}» (${intent.businessType}) con: ${created}.${motorNote} Puedes pedirme cambios en cualquier sección.`
    : `I've created the website for «${businessName}» (${intent.businessType}) with: ${created}.${motorNote} Ask me to change any section.`;

  return {
    message,
    previewSections,
    templateSlug: tpl.slug,
    businessName,
    changedSectionIds: previewSections.map((s) => s.id),
    motorsUsed: aiEnhanced ? motorsUsed : ['visual', 'copy', 'ux', 'code'],
    source: aiEnhanced ? 'hybrid' : 'rules',
  };
}
