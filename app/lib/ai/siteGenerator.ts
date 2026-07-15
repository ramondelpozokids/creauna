import { getTemplateBySlug } from '../../data/templates';
import { toStudioSections } from '../templatePages';
import { analyzeIntent, resolveTemplateSlug } from './intentAnalyzer';
import { getContentPreset } from './siteContent';
import { buildCustomSite, describeCreatedSections } from './siteSections';
import { parseGoogleListing } from './googleListingParser';
import { getBusinessProfile } from './businessProfiles';
import { buildSiteBrief, enhanceSiteWithAgents } from './siteAiEnhancer';
import type { PreviewSection } from './studioEngine';
import type { AiSkippedReason, PipelineStage } from './engineHealth';
import { resolveStudioSector, buildSectorAgentPlaybook } from '../studio/sectorAgentPlaybook';
import { buildIntentFromDiscovery, synthesizeDiscoveryPrompt } from '../studio/buildIntentFromDiscovery';
import type { StudioDiscoveryAnswers } from '../studio/discoveryTypes';

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

export async function generateInitialSite(
  prompt: string,
  lang: 'es' | 'en',
  sectorId?: string | null
): Promise<InitialSiteResult> {
  const listing = parseGoogleListing(prompt);
  const sector = resolveStudioSector(prompt, sectorId);
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
  const { sections, motorsUsed, aiEnhanced, providersUsed, aiSkippedReason, falImages } = await enhanceSiteWithAgents(ruleSections, brief);

  const previewSections = toStudioSections(sections);
  const created = describeCreatedSections(intent.features, lang);
  const businessName = listing?.businessName ?? intent.businessName;

  let motorNote = '';
  if (falImages && falImages > 0) {
    motorNote +=
      lang === 'es'
        ? ` Motor Visual (fal.ai): ${falImages} imagen${falImages > 1 ? 'es' : ''} generada${falImages > 1 ? 's' : ''}.`
        : ` Visual engine (fal.ai): ${falImages} image${falImages > 1 ? 's' : ''} generated.`;
  }
  if (providersUsed.length) {
    motorNote += lang === 'es'
      ? ` Motores IA activos (${providersUsed.join(', ')}${motorsUsed.length ? ` → ${motorsUsed.join(', ')}` : ''}).`
      : ` AI engines active (${providersUsed.join(', ')}${motorsUsed.length ? ` → ${motorsUsed.join(', ')}` : ''}).`;
  } else if (aiSkippedReason === 'no_api_keys' && !falImages) {
    motorNote = lang === 'es'
      ? ' Añade GEMINI/ANTHROPIC/OPENAI/GROQ en .env.local (local) o Vercel → Settings → Environment Variables (producción).'
      : ' Add GEMINI/ANTHROPIC/OPENAI/GROQ to .env.local (local) or Vercel env vars (production).';
  } else if (aiSkippedReason === 'ai_parse_failed') {
    motorNote = lang === 'es'
      ? ' Estructura generada; refinamiento IA no respondió en formato válido (reintenta o mejora una sección).'
      : ' Structure generated; AI refinement did not return valid format (retry or improve a section).';
  }

  const message = lang === 'es'
    ? `He creado la web de «${businessName}» (${intent.businessType}) con: ${created}.${motorNote} Puedes pedirme cambios en cualquier sección.`
    : `I've created the website for «${businessName}» (${intent.businessType}) with: ${created}.${motorNote} Ask me to change any section.`;

  return {
    message,
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

/** Generación inicial desde wizard de descubrimiento (respuestas estructuradas). */
export async function generateInitialSiteFromDiscovery(
  discovery: StudioDiscoveryAnswers,
  lang: 'es' | 'en'
): Promise<InitialSiteResult> {
  const prompt = synthesizeDiscoveryPrompt(discovery, lang);
  const sector = resolveStudioSector(prompt, discovery.sectorId);
  const intent = buildIntentFromDiscovery(discovery, lang);

  const tpl = getTemplateBySlug(resolveTemplateSlug(intent.templateSlug)) ?? getTemplateBySlug('iron-ink')!;
  const preset = getContentPreset(intent.templateSlug);
  const profile = getBusinessProfile(intent.variant);

  const ruleSections = buildCustomSite(intent, tpl, preset, lang);
  const sectorMeta = sector
    ? {
        id: sector.id,
        label: lang === 'es' ? sector.labelEs : sector.labelEn,
        playbook: buildSectorAgentPlaybook(sector, lang),
      }
    : undefined;
  const brief = buildSiteBrief(intent, profile, null, lang, prompt, sectorMeta);
  const { sections, motorsUsed, aiEnhanced, providersUsed, aiSkippedReason, falImages } =
    await enhanceSiteWithAgents(ruleSections, brief);

  const previewSections = toStudioSections(sections);
  const created = describeCreatedSections(intent.features, lang);
  const businessName = intent.businessName;

  let motorNote = '';
  if (falImages && falImages > 0) {
    motorNote +=
      lang === 'es'
        ? ` Motor Visual (fal.ai): ${falImages} imagen${falImages > 1 ? 'es' : ''} generada${falImages > 1 ? 's' : ''}.`
        : ` Visual engine (fal.ai): ${falImages} image${falImages > 1 ? 's' : ''} generated.`;
  }
  if (providersUsed.length) {
    motorNote +=
      lang === 'es'
        ? ` Motores IA activos (${providersUsed.join(', ')}${motorsUsed.length ? ` → ${motorsUsed.join(', ')}` : ''}).`
        : ` AI engines active (${providersUsed.join(', ')}${motorsUsed.length ? ` → ${motorsUsed.join(', ')}` : ''}).`;
  } else if (aiSkippedReason === 'no_api_keys' && !falImages) {
    motorNote =
      lang === 'es'
        ? ' Añade GEMINI/ANTHROPIC/OPENAI/GROQ en .env.local o Vercel env vars.'
        : ' Add GEMINI/ANTHROPIC/OPENAI/GROQ to .env.local or Vercel env vars.';
  }

  const message =
    lang === 'es'
      ? `He creado la web de «${businessName}» según tus respuestas: ${created}.${motorNote} Puedes pedirme cambios en cualquier sección.`
      : `I've created «${businessName}» from your answers: ${created}.${motorNote} Ask me to change any section.`;

  return {
    message,
    previewSections,
    templateSlug: tpl.slug,
    businessName,
    changedSectionIds: previewSections.map((s) => s.id),
    motorsUsed: providersUsed.length ? motorsUsed : ['visual', 'copy', 'ux', 'code'],
    source: providersUsed.length || falImages ? 'hybrid' : 'rules',
    sectorId: sector?.id ?? discovery.sectorId,
    sectorLabel: sectorMeta?.label,
    pipelineStage: 'discovery_initial',
    aiSkippedReason: aiSkippedReason as AiSkippedReason | undefined,
    falImages,
  };
}
