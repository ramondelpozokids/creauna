import { toStudioSections } from '../templatePages';
import { analyzeIntent, resolveTemplateSlug } from './intentAnalyzer';
import { getTemplateBySlug } from '../../data/templates';
import { getContentPreset } from './siteContent';
import { buildCustomSite, describeCreatedSections } from './siteSections';
import { parseGoogleListing } from './googleListingParser';
import { getBusinessProfile, isFashionEcommercePrompt } from './businessProfiles';
import { buildSiteBrief, enhanceSiteWithAgents } from './siteAiEnhancer';
import type { PreviewSection } from './studioEngine';
import type { AiSkippedReason, PipelineStage } from './engineHealth';
import { resolveStudioSector, buildSectorAgentPlaybook } from '../studio/sectorAgentPlaybook';
import { buildIntentFromDiscovery, synthesizeDiscoveryPrompt } from '../studio/buildIntentFromDiscovery';
import type { StudioDiscoveryAnswers } from '../studio/discoveryTypes';
import { generateSiteFromUserPrompt } from './promptFirstSiteGenerator';
import { clientRejectsTemplates } from './promptFirstQuality';

export interface InitialSiteResult {
  message: string;
  previewSections: PreviewSection[];
  templateSlug: string;
  businessName: string;
  changedSectionIds: number[];
  motorsUsed?: string[];
  source: 'rules' | 'ai' | 'hybrid';
  sectorId?: string;
  sectorLabel?: string;
  pipelineStage?: PipelineStage;
  aiSkippedReason?: AiSkippedReason;
  falImages?: number;
}

/** Respaldo legacy — solo si prompt-first no puede generar (sin IA y brief no moda). */
async function generateFromTemplateFallback(
  prompt: string,
  lang: 'es' | 'en',
  sectorId?: string | null
): Promise<InitialSiteResult> {
  const listing = parseGoogleListing(prompt);
  const sector = isFashionEcommercePrompt(prompt) ? null : resolveStudioSector(prompt, sectorId);
  let intent = analyzeIntent(prompt, lang);

  if (sector) {
    intent = {
      ...intent,
      templateSlug: sector.templateSlug,
      businessType: lang === 'es' ? sector.labelEs : sector.labelEn,
    };
  }

  const tpl = getTemplateBySlug(resolveTemplateSlug(intent.templateSlug)) ?? getTemplateBySlug('iron-ink')!;
  const preset = getContentPreset(intent.templateSlug);
  const profile = getBusinessProfile(intent.variant, listing);

  const ruleSections = buildCustomSite(intent, tpl, preset, lang, listing);
  const sectorMeta = sector
    ? {
        id: sector.id,
        label: lang === 'es' ? sector.labelEs : sector.labelEn,
        playbook: buildSectorAgentPlaybook(sector, lang),
      }
    : undefined;
  const brief = buildSiteBrief(intent, profile, listing, lang, prompt, sectorMeta);
  const { sections, motorsUsed, providersUsed, aiSkippedReason, falImages } = await enhanceSiteWithAgents(
    ruleSections,
    brief
  );

  const previewSections = toStudioSections(sections);
  const created = describeCreatedSections(intent.features, lang);
  const businessName = listing?.businessName ?? intent.businessName;

  const motorNote =
    lang === 'es'
      ? ' (modo plantilla — configura IA para construir 100% desde tu brief)'
      : ' (template mode — configure AI for 100% prompt-driven builds)';

  return {
    message:
      lang === 'es'
        ? `Web base con: ${created}.${motorNote}`
        : `Base site with: ${created}.${motorNote}`,
    previewSections,
    templateSlug: tpl.slug,
    businessName,
    changedSectionIds: previewSections.map((s) => s.id),
    motorsUsed: providersUsed.length ? motorsUsed : ['visual', 'copy', 'ux', 'code'],
    source: providersUsed.length || falImages ? 'hybrid' : 'rules',
    sectorId: sector?.id,
    sectorLabel: sectorMeta?.label,
    pipelineStage: 'full_site_generate',
    aiSkippedReason: aiSkippedReason as AiSkippedReason | undefined,
    falImages,
  };
}

export async function generateInitialSite(
  prompt: string,
  lang: 'es' | 'en',
  sectorId?: string | null
): Promise<InitialSiteResult> {
  const promptFirst = await generateSiteFromUserPrompt(prompt, lang);

  if (promptFirst.ok) {
    return {
      message: promptFirst.message,
      previewSections: promptFirst.previewSections,
      templateSlug: promptFirst.templateSlug ?? 'prompt-first',
      businessName: promptFirst.businessName,
      changedSectionIds: promptFirst.previewSections.map((s) => s.id),
      motorsUsed: promptFirst.motorsUsed,
      source: promptFirst.source,
      pipelineStage: promptFirst.pipelineStage,
      aiSkippedReason: promptFirst.aiSkippedReason,
      falImages: promptFirst.falImages,
    };
  }

  // El cliente pidió construir, no plantilla — no hacer trampas con fallback de catálogo
  if (clientRejectsTemplates(prompt) || prompt.length > 1200) {
    return {
      message:
        promptFirst.message ||
        (lang === 'es'
          ? 'No pude construir una web de calidad desde tu brief. No uso plantillas. Vuelve a intentarlo.'
          : 'Could not build a quality site from your brief. No templates. Please retry.'),
      previewSections: [],
      templateSlug: 'prompt-first',
      businessName: promptFirst.businessName,
      changedSectionIds: [],
      motorsUsed: promptFirst.motorsUsed,
      source: 'rules',
      pipelineStage: 'prompt_first',
      aiSkippedReason: promptFirst.aiSkippedReason ?? 'ai_parse_failed',
    };
  }

  return generateFromTemplateFallback(prompt, lang, sectorId);
}

/** Generación inicial desde wizard de descubrimiento (respuestas estructuradas). */
export async function generateInitialSiteFromDiscovery(
  discovery: StudioDiscoveryAnswers,
  lang: 'es' | 'en'
): Promise<InitialSiteResult> {
  const prompt = synthesizeDiscoveryPrompt(discovery, lang);
  return generateInitialSite(prompt, lang, discovery.sectorId);
}
