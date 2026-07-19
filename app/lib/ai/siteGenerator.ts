import type { PreviewSection } from './studioEngine';
import type { AiSkippedReason, PipelineStage } from './engineHealth';
import { resolveStudioSector } from '../studio/sectorAgentPlaybook';
import { synthesizeDiscoveryPrompt } from '../studio/buildIntentFromDiscovery';
import type { StudioDiscoveryAnswers } from '../studio/discoveryTypes';
import { generateSiteFromUserPrompt } from './promptFirstSiteGenerator';

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
  suggestDiscovery?: boolean;
}

export async function generateInitialSite(
  prompt: string,
  lang: 'es' | 'en',
  sectorId?: string | null,
  opts?: { clientImageUrls?: string[] }
): Promise<InitialSiteResult> {
  const promptFirst = await generateSiteFromUserPrompt(prompt, lang, {
    clientImageUrls: opts?.clientImageUrls,
  });

  if (promptFirst.ok) {
    const sector = resolveStudioSector(prompt, sectorId);
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
      suggestDiscovery: promptFirst.suggestDiscovery,
      sectorId: sector?.id,
      sectorLabel: sector ? (lang === 'es' ? sector.labelEs : sector.labelEn) : undefined,
    };
  }

  // Studio marketing: siempre intentar haber entregado algo vía agency; mensaje sin deberes al cliente
  return {
    message:
      promptFirst.message ||
      (lang === 'es'
        ? 'He preparado tu web. Si quieres cualquier cambio, dímelo y lo aplico.'
        : 'Your site is ready. Ask for any change and I will apply it.'),
    previewSections: promptFirst.previewSections,
    templateSlug: 'prompt-first',
    businessName: promptFirst.businessName,
    changedSectionIds: promptFirst.previewSections.map((s) => s.id),
    motorsUsed: promptFirst.motorsUsed,
    source: promptFirst.source,
    pipelineStage: 'prompt_first',
    aiSkippedReason: promptFirst.aiSkippedReason,
    suggestDiscovery: false,
  };
}

/** Generación inicial desde wizard de descubrimiento (respuestas estructuradas). */
export async function generateInitialSiteFromDiscovery(
  discovery: StudioDiscoveryAnswers,
  lang: 'es' | 'en'
): Promise<InitialSiteResult> {
  const prompt = synthesizeDiscoveryPrompt(discovery, lang);
  return generateInitialSite(prompt, lang, discovery.sectorId);
}
