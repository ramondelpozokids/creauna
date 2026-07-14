import fs from 'fs';
import path from 'path';
import { getPremiumStarterBySlug } from '../../data/premiumStarters';
import { getTemplateBySlug } from '../../data/templates';
import { buildIntentFromTemplateSlug, isExistingSiteSections, resolveTemplateSlug } from '../ai/intentAnalyzer';
import { getContentPreset } from '../ai/siteContent';
import { buildCustomSite, extractPreviewBusinessName } from '../ai/siteSections';
import type { PreviewSection, StudioGenerateInput, StudioGenerateResult } from '../ai/studioEngine';
import { toStudioSections } from '../templatePages';
import { wrapSectionHtml } from '../ai/siteSectionWrap';
import {
  mergePersonalization,
  parsePersonalizationFromPrompt,
  personalizePremiumStarterHtml,
} from './personalizePremiumStarter';
import type { PremiumStarterPersonalization } from '../../data/premiumStarters';
import { applyPremiumContent } from './loadPremiumStarter';
import { normalizePremiumContent } from './premiumContentTypes';

/** Plantilla cargada + sitio ya generado → no re-analizar sector ni cambiar variant. */
export function isPremiumStarterContextLocked(input: StudioGenerateInput): boolean {
  if (!input.premiumStarterSlug) return false;
  if (input.lockedTemplate === false) return false;
  return input.previewSections.some((s) => s.type === 'fullpage');
}

export function isTemplateContextLocked(input: StudioGenerateInput): boolean {
  if (isPremiumStarterContextLocked(input)) return true;
  if (!input.templateSlug) return false;
  if (input.lockedTemplate === false) return false;
  return isExistingSiteSections(input.previewSections);
}

export function readPremiumStarterBaseHtml(slug: string): string {
  const starter = getPremiumStarterBySlug(slug);
  if (!starter) {
    throw new Error(`Muestra premium no encontrada: ${slug}`);
  }
  const relative = starter.demoPath.replace(/^\//, '');
  const filePath = path.join(process.cwd(), 'public', relative);
  return fs.readFileSync(filePath, 'utf-8');
}

export function resolveStudioBusinessName(input: StudioGenerateInput): string {
  return (
    input.businessName?.trim() ||
    input.premiumPersonalization?.businessName?.trim() ||
    extractPreviewBusinessName(input.previewSections) ||
    'Mi negocio'
  );
}

function buildPremiumPersonalization(input: StudioGenerateInput): Partial<PremiumStarterPersonalization> {
  const starter = getPremiumStarterBySlug(input.premiumStarterSlug!);
  const current: PremiumStarterPersonalization = {
    businessName: resolveStudioBusinessName(input),
    subtitle: input.premiumPersonalization?.subtitle ?? starter?.defaults.subtitle,
    tagline: input.premiumPersonalization?.tagline ?? starter?.defaults.tagline,
    phone: input.premiumPersonalization?.phone ?? starter?.defaults.phone,
    email: input.premiumPersonalization?.email ?? starter?.defaults.email,
    address: input.premiumPersonalization?.address ?? starter?.defaults.address,
    citySeo: input.premiumPersonalization?.citySeo ?? starter?.defaults.citySeo,
    heroImage: input.premiumPersonalization?.heroImage ?? starter?.defaults.heroImage,
  };
  const fromPrompt = parsePersonalizationFromPrompt(input.prompt, current);
  return { ...current, ...fromPrompt, businessName: fromPrompt.businessName ?? current.businessName };
}

/** Personaliza la muestra premium desde HTML base (sin regenerar diseño). */
export function personalizeFromPremiumStarter(
  input: StudioGenerateInput,
  lang: 'es' | 'en'
): StudioGenerateResult {
  const slug = input.premiumStarterSlug!;
  const starter = getPremiumStarterBySlug(slug);
  if (!starter) {
    throw new Error(`Muestra premium no encontrada: ${slug}`);
  }

  const baseHtml = readPremiumStarterBaseHtml(slug);
  const personalization = buildPremiumPersonalization(input);
  const merged = mergePersonalization(starter, personalization);
  let html = personalizePremiumStarterHtml(baseHtml, starter, personalization);
  if (input.premiumContent) {
    html = applyPremiumContent(starter.slug, html, normalizePremiumContent(input.premiumContent));
  }

  return {
    message:
      lang === 'es'
        ? `Muestra «${starter.nameEs}» personalizada para «${merged.businessName}». Solo cambiamos datos del negocio — el diseño se mantiene.`
        : `Sample «${starter.nameEn}» customized for «${merged.businessName}». Only business data changed — design preserved.`,
    previewSections: [{ id: 1, type: 'fullpage', html }],
    motorsUsed: ['copy', 'ux'],
    source: 'rules',
    changedSectionIds: [1],
    templateSlug: starter.catalogTemplateSlug,
    businessName: merged.businessName,
    sectorId: starter.sectorId,
  };
}

/** Regenera la web completa respetando plantilla y nombre del negocio. */
export function regenerateFromLockedTemplate(
  input: StudioGenerateInput,
  lang: 'es' | 'en'
): StudioGenerateResult {
  if (isPremiumStarterContextLocked(input)) {
    return personalizeFromPremiumStarter(input, lang);
  }

  const slug = resolveTemplateSlug(input.templateSlug!);
  const template = getTemplateBySlug(slug);
  if (!template) {
    throw new Error(`Plantilla bloqueada no encontrada: ${input.templateSlug}`);
  }

  const businessName = resolveStudioBusinessName(input);
  const intent = buildIntentFromTemplateSlug(slug, lang);
  intent.businessName = businessName;

  const preset = getContentPreset(slug);
  const sections = buildCustomSite(intent, template, preset, lang);
  const previewSections = toStudioSections(sections);

  return {
    message:
      lang === 'es'
        ? `Web regenerada manteniendo la plantilla «${template.nameEs}» y el negocio «${businessName}».`
        : `Site regenerated keeping template «${template.nameEn}» and business «${businessName}».`,
    previewSections,
    motorsUsed: ['visual', 'copy', 'ux', 'code'],
    source: 'rules',
    changedSectionIds: previewSections.map((s) => s.id),
    templateSlug: slug,
    businessName,
  };
}

/** Añade secciones faltantes desde buildCustomSite sin tocar las existentes. */
export function appendMissingSections(
  input: StudioGenerateInput,
  sectionTypes: string[],
  lang: 'es' | 'en',
  reasonEs: string,
  reasonEn: string
): StudioGenerateResult | null {
  if (isPremiumStarterContextLocked(input)) return null;
  if (!input.templateSlug || sectionTypes.length === 0) return null;

  const slug = resolveTemplateSlug(input.templateSlug);
  const template = getTemplateBySlug(slug);
  if (!template) return null;

  const businessName = resolveStudioBusinessName(input);
  const intent = buildIntentFromTemplateSlug(slug, lang);
  intent.businessName = businessName;

  const preset = getContentPreset(slug);
  const fullSite = buildCustomSite(intent, template, preset, lang);
  const existingTypes = new Set(input.previewSections.map((s) => s.type));
  const toAdd = fullSite.filter((s) => sectionTypes.includes(s.type) && !existingTypes.has(s.type));

  if (toAdd.length === 0) return null;

  const maxId = input.previewSections.reduce((m, s) => Math.max(m, s.id), 0);
  const appended: PreviewSection[] = toAdd.map((s, i) => ({
    id: maxId + 1 + i,
    type: s.type,
    html: wrapSectionHtml(s.html),
  }));

  return {
    message: lang === 'es' ? reasonEs : reasonEn,
    previewSections: [...input.previewSections, ...appended],
    motorsUsed: ['copy', 'visual'],
    source: 'rules',
    changedSectionIds: appended.map((s) => s.id),
    templateSlug: slug,
    businessName,
  };
}
