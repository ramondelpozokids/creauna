import {
  getPremiumStarterBySlug,
  resolvePremiumStarterSlug,
  type PremiumStarterItem,
  type PremiumStarterPersonalization,
} from '../../data/premiumStarters';
import { applyMesonContent, extractMesonContent } from './mesonContentBridge';
import { personalizePremiumStarterHtml, mergePersonalization } from './personalizePremiumStarter';
import type { PremiumStarterContent } from './premiumContentTypes';
import { emptyPremiumContent, normalizePremiumContent } from './premiumContentTypes';
import type { StudioPreviewSection } from '../templatePages';

export type PremiumStarterLoadResult = {
  previewSections: StudioPreviewSection[];
  starter: PremiumStarterItem;
  businessName: string;
  sectionsSummary: string;
  personalization: ReturnType<typeof mergePersonalization>;
  baseHtml: string;
  content: PremiumStarterContent;
};

export async function fetchPremiumStarterHtml(starter: PremiumStarterItem): Promise<string> {
  const res = await fetch(starter.demoPath);
  if (!res.ok) {
    throw new Error(`No se pudo cargar la muestra: ${starter.slug}`);
  }
  return res.text();
}

export function extractPremiumContent(starterSlug: string, html: string): PremiumStarterContent {
  if (starterSlug === 'meson-la-colonia') {
    return extractMesonContent(html);
  }
  return emptyPremiumContent();
}

export function applyPremiumContent(
  starterSlug: string,
  html: string,
  content: PremiumStarterContent
): string {
  if (starterSlug === 'meson-la-colonia') {
    return applyMesonContent(html, content);
  }
  return html;
}

export function buildPremiumStarterHtml(
  baseHtml: string,
  starter: PremiumStarterItem,
  input: Partial<PremiumStarterPersonalization> | undefined,
  content: PremiumStarterContent
): string {
  const personalizedHtml = personalizePremiumStarterHtml(baseHtml, starter, input);
  return applyPremiumContent(starter.slug, personalizedHtml, content);
}

export function buildPremiumStarterSections(
  html: string,
  starter: PremiumStarterItem,
  input?: Partial<PremiumStarterPersonalization>,
  contentOverride?: PremiumStarterContent
): PremiumStarterLoadResult {
  const personalization = mergePersonalization(starter, input);
  const content = contentOverride ?? extractPremiumContent(starter.slug, html);
  const finalHtml = buildPremiumStarterHtml(html, starter, input, normalizePremiumContent(content));

  return {
    previewSections: [{ id: 1, type: 'fullpage', html: finalHtml }],
    starter,
    businessName: personalization.businessName,
    sectionsSummary: `muestra premium ${starter.nameEs}`,
    personalization,
    baseHtml: html,
    content,
  };
}

export async function loadPremiumStarter(
  starterSlug: string,
  lang: 'es' | 'en',
  input?: Partial<PremiumStarterPersonalization>
): Promise<PremiumStarterLoadResult> {
  const slug = resolvePremiumStarterSlug(starterSlug);
  if (!slug) throw new Error(`Muestra premium no encontrada: ${starterSlug}`);
  const starter = getPremiumStarterBySlug(slug)!;
  const html = await fetchPremiumStarterHtml(starter);
  const result = buildPremiumStarterSections(html, starter, input);
  const summaryEs = starter.descEs.split('.')[0];
  const summaryEn = starter.descEn.split('.')[0];
  result.sectionsSummary =
    lang === 'es'
      ? `muestra premium «${starter.nameEs}»: ${summaryEs} — lista para personalizar`
      : `premium sample «${starter.nameEn}»: ${summaryEn} — ready to customize`;
  return result;
}
