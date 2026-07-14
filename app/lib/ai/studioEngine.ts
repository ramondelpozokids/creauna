import { chatCompletion, type MotorId } from './providers';
import { generateInitialSite, generateInitialSiteFromDiscovery } from './siteGenerator';
import { isSiteBuildPrompt, isCosmeticPrompt, shouldGenerateFullSite, isExistingSiteSections } from './intentAnalyzer';
import { detectVariant } from './businessProfiles';
import { applyVisualEnhancement, applyStrongVisualEnhancement, isCorporatePreviewSite, rebuildCorporatePreviewSections } from './siteSections';
import { validateSectionHtml } from '../studio/sectionValidator';
import { planStudioChange, executeDirectorPlan } from '../studio/studioDirector';
import { resolveStudioSector, buildSectorAgentPlaybook } from '../studio/sectorAgentPlaybook';
import { extractPreviewBusinessName } from './siteSections';
import {
  appendMissingSections,
  isPremiumStarterContextLocked,
  isTemplateContextLocked,
  personalizeFromPremiumStarter,
  regenerateFromLockedTemplate,
} from '../studio/studioContextLock';
import type { StudioDiscoveryAnswers } from '../studio/discoveryTypes';
import type { PremiumStarterPersonalization } from '../../data/premiumStarters';
import type { PremiumStarterContent } from '../studio/premiumContentTypes';

export interface PreviewSection {
  id: number;
  type: string;
  html: string;
}

export type StudioAction = 'change' | 'regenerate' | 'improve' | 'style' | 'initial';

export interface StudioGenerateInput {
  prompt: string;
  lang: 'es' | 'en';
  previewSections: PreviewSection[];
  style?: 'elegante' | 'minimal' | 'moderno';
  action?: StudioAction;
  sectionId?: number;
  sectorId?: string;
  /** Slug de plantilla del catálogo — bloquea variant/sector en refinamientos. */
  templateSlug?: string;
  /** Muestra premium terminada (HTML real) — personalización acotada, sin regenerar diseño. */
  premiumStarterSlug?: string;
  premiumPersonalization?: Partial<PremiumStarterPersonalization>;
  premiumContent?: PremiumStarterContent;
  businessName?: string;
  /** false = permitir re-análisis de sector aunque haya templateSlug */
  lockedTemplate?: boolean;
  /** Respuestas del wizard de descubrimiento (generación inicial estructurada). */
  discovery?: StudioDiscoveryAnswers;
  recentMessages?: { role: 'user' | 'ai'; content: string }[];
  sectionOutline?: string;
}

export interface StudioGenerateResult {
  message: string;
  previewSections: PreviewSection[];
  motorsUsed: string[];
  source: 'rules' | 'ai' | 'hybrid';
  changedSectionIds: number[];
  templateSlug?: string;
  businessName?: string;
  sectorId?: string;
  sectorLabel?: string;
}

function cloneSections(sections: PreviewSection[]): PreviewSection[] {
  return sections.map((s) => ({ ...s }));
}

function patchSection(
  sections: PreviewSection[],
  id: number,
  html: string
): PreviewSection[] {
  return sections.map((s) => (s.id === id ? { ...s, html } : s));
}

function targetSection(input: StudioGenerateInput): PreviewSection {
  if (input.sectionId) {
    return input.previewSections.find((s) => s.id === input.sectionId) ?? input.previewSections[0];
  }
  return input.previewSections.find((s) => s.type === 'hero') ?? input.previewSections[0];
}

function enrichPromptFromSections(prompt: string, sections: PreviewSection[]): string {
  const blob = sections.map((s) => s.html).join(' ');
  const name = blob.match(/<h1[^>]*>([^<]+)/)?.[1]?.trim();
  const variant = detectVariant(blob + ' ' + prompt);
  const variantHint =
    variant === 'tattoo' ? 'tattoo piercing royal bang'
      : variant === 'cafe' ? 'rest art café restaurante terraza'
        : variant === 'foodblog' ? 'blog recetas comida casera stanton'
          : variant === 'kebab' ? 'kebab döner vallecas'
          : '';
  const hints = [prompt, name, variantHint].filter(Boolean);
  return hints.join(' ');
}

function applyStyleTransform(html: string, style: 'elegante' | 'minimal' | 'moderno'): string {
  if (style === 'elegante') {
    return html
      .replace(/bg-slate-900/g, 'bg-slate-950')
      .replace(/rounded-\[2rem\]/g, 'rounded-[2.5rem]')
      .replace(/text-4xl/g, 'text-5xl')
      .replace(/font-semibold/g, 'font-semibold tracking-tight');
  }
  if (style === 'minimal') {
    return html
      .replace(/bg-slate-900/g, 'bg-white')
      .replace(/text-white/g, 'text-slate-900')
      .replace(/border border-slate-200/g, 'border-2 border-slate-900')
      .replace(/rounded-\[2rem\]/g, 'rounded-xl');
  }
  return html
    .replace(/bg-slate-900/g, 'bg-gradient-to-br from-indigo-600 to-violet-700')
    .replace(/bg-slate-50/g, 'bg-indigo-50')
    .replace(/rounded-\[2rem\]/g, 'rounded-3xl');
}

function corporateUpgradePrompt(lower: string): boolean {
  return (
    lower.includes('elegante') ||
    lower.includes('refinad') ||
    lower.includes('elegant') ||
    lower.includes('premium') ||
    lower.includes('hero') ||
    lower.includes('impactante') ||
    lower.includes('impactful') ||
    lower.includes('cabecera') ||
    lower.includes('animacion') ||
    lower.includes('animaci') ||
    lower.includes('animation') ||
    lower.includes('modern') ||
    lower.includes('lujo') ||
    lower.includes('luxury') ||
    lower.includes('ferrari') ||
    lower.includes('cinemat') ||
    lower.includes('tipograf') ||
    lower.includes('sofisticad') ||
    lower.includes('luminosa') ||
    lower.includes('clara') ||
    lower.includes('bonit')
  );
}

async function applyPromptRules(input: StudioGenerateInput): Promise<StudioGenerateResult | null> {
  const { prompt, lang, previewSections, action, sectionId, style } = input;
  const lower = prompt.toLowerCase();
  const target = targetSection(input);
  let sections = cloneSections(previewSections);
  const changedIds: number[] = [];

  if (action === 'regenerate') {
    sections = sections.map((s) => ({
      ...s,
      html: applyStyleTransform(s.html, 'moderno'),
    }));
    return {
      message: lang === 'es' ? 'Motor Visual: diseño regenerado con nueva paleta y ritmo.' : 'Visual engine: design regenerated with new palette and rhythm.',
      previewSections: sections,
      motorsUsed: ['visual', 'ux'],
      source: 'rules',
      changedSectionIds: sections.map((s) => s.id),
    };
  }

  if (action === 'improve' && sectionId) {
    const sec = sections.find((s) => s.id === sectionId);
    if (sec) {
      const improved = applyVisualEnhancement(applyStyleTransform(sec.html, 'elegante'), 'elegante');
      sections = patchSection(sections, sectionId, improved);
      changedIds.push(sectionId);
      return {
        message: lang === 'es' ? 'Sección refinada con tipografía y espaciado premium.' : 'Section refined with premium typography and spacing.',
        previewSections: sections,
        motorsUsed: ['visual', 'ux', 'copy'],
        source: 'rules',
        changedSectionIds: changedIds,
      };
    }
  }

  if (action === 'style' && style) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return { ...s, html: applyStyleTransform(s.html, style) };
    });
    return {
      message: lang === 'es' ? `Motor de Experiencia: estilo «${style}» aplicado a toda la vista.` : `UX engine: «${style}» style applied to the full view.`,
      previewSections: sections,
      motorsUsed: ['ux', 'visual'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (
    (lower.includes('testimonio') || lower.includes('testimonial') || lower.includes('reseñ')) &&
    isExistingSiteSections(previewSections)
  ) {
    const reviewsSec = sections.find((s) => s.type === 'reviews');
    if (reviewsSec) {
      let enhanced = applyStrongVisualEnhancement(reviewsSec.html, 'elegante');
      enhanced = enhanced
        .replace(/rounded-xl/g, 'rounded-3xl')
        .replace(/shadow-sm/g, 'shadow-xl shadow-indigo-100/50')
        .replace(/bg-white/g, 'bg-gradient-to-br from-white to-indigo-50/40');
      sections = patchSection(sections, reviewsSec.id, enhanced);
      changedIds.push(reviewsSec.id);
      return {
        message: lang === 'es' ? 'Testimonios rediseñados con tarjetas premium visibles.' : 'Testimonials redesigned with visible premium cards.',
        previewSections: sections,
        motorsUsed: ['visual', 'ux'],
        source: 'rules',
        changedSectionIds: changedIds,
      };
    }
  }

  if (
    (lower.includes('testimonio') || lower.includes('testimonial') || lower.includes('reseñ')) &&
    !sections.find((s) => s.type === 'reviews')
  ) {
    if (input.templateSlug) {
      const added = appendMissingSections(
        input,
        ['reviews'],
        lang,
        'Bloque de reseñas añadido con opiniones reales.',
        'Reviews section added with real testimonials.'
      );
      if (added) return added;
    }
    if (!isExistingSiteSections(previewSections)) {
      const result = await generateInitialSite(enrichPromptFromSections(input.prompt, sections), lang, input.sectorId);
      return {
        message: lang === 'es' ? 'Bloque de reseñas añadido con opiniones reales.' : 'Reviews section added with real testimonials.',
        previewSections: result.previewSections,
        motorsUsed: result.motorsUsed ?? ['copy'],
        source: result.source,
        changedSectionIds: result.changedSectionIds,
        templateSlug: result.templateSlug,
        businessName: result.businessName,
        sectorId: result.sectorId,
        sectorLabel: result.sectorLabel,
      };
    }
  }

  if (isCorporatePreviewSite(previewSections) && corporateUpgradePrompt(lower)) {
    const upgraded = rebuildCorporatePreviewSections(previewSections, lang);
    return {
      message: lang === 'es'
        ? 'Motor Visual: sitio reconstruido con diseño premium — hero Madrid, servicios glassmorphism, carrusel, stats y footer con enlaces legales.'
        : 'Visual engine: site rebuilt with premium design — Madrid hero, glassmorphism services, carousel, stats and legal footer links.',
      previewSections: upgraded,
      motorsUsed: ['visual', 'ux'],
      source: 'rules',
      changedSectionIds: upgraded.map((s) => s.id),
    };
  }

  if (lower.includes('elegante') || lower.includes('refinad') || lower.includes('elegant') || lower.includes('premium')) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return { ...s, html: applyStrongVisualEnhancement(applyStyleTransform(s.html, 'elegante'), 'elegante') };
    });
    return {
      message: lang === 'es' ? 'Motor Visual + UX: más espacio, tipografía refinada y detalles premium.' : 'Visual + UX: more space, refined typography and premium details.',
      previewSections: sections,
      motorsUsed: ['visual', 'ux'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('hero') || lower.includes('impactante') || lower.includes('impactful') || lower.includes('cabecera')) {
    const hero = sections.find((s) => s.type === 'hero') ?? target;
    const newHero = applyStrongVisualEnhancement(hero.html, 'hero');
    sections = patchSection(sections, hero.id, newHero);
    changedIds.push(hero.id);
    sections = sections.map((s) => {
      if (s.id === hero.id) return s;
      changedIds.push(s.id);
      return { ...s, html: applyStrongVisualEnhancement(s.html, 'animacion') };
    });
    return {
      message: lang === 'es' ? 'Hero ampliado con overlay cinematográfico y animación en el resto de secciones.' : 'Expanded hero with cinematic overlay and animation on other sections.',
      previewSections: sections,
      motorsUsed: ['visual'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('clara') || lower.includes('luminosa') || lower.includes('bright') || lower.includes('blanco')) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return { ...s, html: applyStrongVisualEnhancement(s.html, 'luminosa') };
    });
    return {
      message: lang === 'es' ? 'Motor de Experiencia: versión más clara y luminosa.' : 'UX engine: brighter, lighter version.',
      previewSections: sections,
      motorsUsed: ['ux'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('color') || lower.includes('tierra') || lower.includes('earth') || lower.includes('beige')) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return {
        ...s,
        html: s.html
          .replace(/indigo-600/g, 'amber-700')
          .replace(/indigo-500/g, 'amber-600')
          .replace(/bg-slate-900/g, 'bg-stone-800')
          .replace(/violet/g, 'amber'),
      };
    });
    return {
      message: lang === 'es' ? 'Motor Visual: paleta tierra y beige aplicada.' : 'Visual engine: earth and beige palette applied.',
      previewSections: sections,
      motorsUsed: ['visual', 'ux'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('animac') || lower.includes('animat')) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return { ...s, html: applyStrongVisualEnhancement(s.html, 'animacion') };
    });
    return {
      message: lang === 'es' ? 'Animaciones sutiles añadidas.' : 'Subtle animations added.',
      previewSections: sections,
      motorsUsed: ['code'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (lower.includes('tipograf') || lower.includes('typography') || lower.includes('font')) {
    sections = sections.map((s) => {
      changedIds.push(s.id);
      return { ...s, html: applyStrongVisualEnhancement(s.html, 'tipografia') };
    });
    return {
      message: lang === 'es' ? 'Motor Visual: tipografía más sofisticada.' : 'Visual engine: more sophisticated typography.',
      previewSections: sections,
      motorsUsed: ['visual'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  if (
    (lower.includes('servicio') || lower.includes('service') || lower.includes('sección') || lower.includes('section')) &&
    !isExistingSiteSections(previewSections)
  ) {
    const result = await generateInitialSite(enrichPromptFromSections(input.prompt, sections), lang, input.sectorId);
    return {
      message: lang === 'es' ? 'Secciones actualizadas con contenido real.' : 'Sections updated with real content.',
      previewSections: result.previewSections,
      motorsUsed: result.motorsUsed ?? ['copy', 'ux'],
      source: result.source,
      changedSectionIds: result.changedSectionIds,
      templateSlug: result.templateSlug,
      businessName: result.businessName,
      sectorId: result.sectorId,
      sectorLabel: result.sectorLabel,
    };
  }

  if (lower.includes('contacto') || lower.includes('contact') || lower.includes('botón') || lower.includes('button')) {
    const contact = sections.find((s) => s.type === 'contact') ?? target;
    sections = patchSection(
      sections,
      contact.id,
      contact.html.replace(/bg-white\/10/g, 'bg-indigo-500').replace(/rounded-xl/g, 'rounded-2xl ring-2 ring-indigo-300')
    );
    changedIds.push(contact.id);
    return {
      message: lang === 'es' ? 'Motor UX: formulario de contacto más visible.' : 'UX engine: contact form more visible.',
      previewSections: sections,
      motorsUsed: ['ux'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  return null;
}

function previewBlob(sections: PreviewSection[]): string {
  return sections.map((s) => s.html).join(' ');
}

const SECTION_MOTOR: Record<string, MotorId> = {
  hero: 'visual',
  gallery: 'visual',
  about: 'copy',
  reviews: 'copy',
  blog: 'copy',
  menu: 'code',
  services: 'code',
  carta: 'code',
  reservation: 'ux',
  location: 'ux',
  contact: 'ux',
  footer: 'code',
};

function pickMotorForSection(prompt: string, sectionType: string): MotorId {
  const lower = prompt.toLowerCase();
  if (/testimonio|texto|copy|redacci|about|sobre/i.test(lower)) return 'copy';
  if (/contacto|formulario|mapa|ubicaci|reserva|ux|móvil|mobile/i.test(lower)) return 'ux';
  if (/servicio|menú|menu|carta|código|estructura/i.test(lower)) return 'code';
  if (/elegante|hero|visual|imagen|animaci|tipograf/i.test(lower)) return 'visual';
  return SECTION_MOTOR[sectionType] ?? 'visual';
}

async function applyAIChange(input: StudioGenerateInput): Promise<StudioGenerateResult | null> {
  if (isPremiumStarterContextLocked(input)) return null;
  const target = targetSection(input);
  if (!target) return null;

  const sector = resolveStudioSector(input.prompt + previewBlob(input.previewSections), input.sectorId);
  const playbook = sector ? buildSectorAgentPlaybook(sector, input.lang) : '';
  const businessName = extractPreviewBusinessName(input.previewSections);

  const chatBlock =
    input.recentMessages && input.recentMessages.length > 0
      ? `\nRecent conversation:\n${input.recentMessages
          .slice(-6)
          .map((m) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content.slice(0, 300)}`)
          .join('\n')}\n`
      : '';
  const outlineBlock = input.sectionOutline
    ? `\nOther sections on page (do not rewrite): ${input.sectionOutline}\n`
    : '';

  const motor = pickMotorForSection(input.prompt, target.type);

  const aiResult = await chatCompletion(
    [
      {
        role: 'system',
        content: `You are CREAUNA's ${motor} design engine. Modify ONE website section HTML.
The client already has a premium agency-grade site for «${businessName}». IMPROVE it — never downgrade.
${playbook ? `\n${playbook}\n` : ''}
Return ONLY valid JSON: {"message":"short user-facing message","html":"complete updated section HTML"}
Use Tailwind CSS classes only. No <script>. Make changes VISIBLY obvious (colors, sizes, spacing, mobile-friendly).
Language for visible text: ${input.lang === 'es' ? 'Spanish' : 'English'}.`,
      },
      {
        role: 'user',
        content: `Section type: ${target.type}
Current HTML:
${target.html.slice(0, 4000)}
${outlineBlock}${chatBlock}
User request: ${input.prompt}
Action: ${input.action || 'change'}`,
      },
    ],
    { temperature: 0.6, maxTokens: 2000, motor, prompt: input.prompt }
  );

  if (!aiResult.content) return null;

  try {
    const match = aiResult.content.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]) as { message?: string; html?: string };
    if (!parsed.html || !parsed.message) return null;
    const validation = validateSectionHtml(parsed.html, target.id, target.type);
    if (!validation.ok) return null;

    const sections = patchSection(cloneSections(input.previewSections), target.id, parsed.html);
    return {
      message: parsed.message,
      previewSections: sections,
      motorsUsed: [motor],
      source: 'ai',
      changedSectionIds: [target.id],
    };
  } catch {
    return null;
  }
}

export async function generateStudioChange(input: StudioGenerateInput): Promise<StudioGenerateResult> {
  if (input.discovery && input.action === 'initial') {
    const result = await generateInitialSiteFromDiscovery(input.discovery, input.lang);
    return {
      message: result.message,
      previewSections: result.previewSections,
      motorsUsed: result.motorsUsed ?? ['visual', 'copy', 'ux', 'code'],
      source: result.source,
      changedSectionIds: result.changedSectionIds,
      templateSlug: result.templateSlug,
      businessName: result.businessName,
      sectorId: result.sectorId,
      sectorLabel: result.sectorLabel,
    };
  }

  if (shouldGenerateFullSite(input.prompt, input.action, input.previewSections)) {
    if (isTemplateContextLocked(input)) {
      return regenerateFromLockedTemplate(input, input.lang);
    }
    const result = await generateInitialSite(input.prompt, input.lang, input.sectorId);
    return {
      message: result.message,
      previewSections: result.previewSections,
      motorsUsed: result.motorsUsed ?? ['visual', 'copy', 'ux', 'code'],
      source: result.source,
      changedSectionIds: result.changedSectionIds,
      templateSlug: result.templateSlug,
      businessName: result.businessName,
      sectorId: result.sectorId,
      sectorLabel: result.sectorLabel,
    };
  }

  if (isPremiumStarterContextLocked(input) && input.action === 'change') {
    return personalizeFromPremiumStarter(input, input.lang);
  }

  if (input.action === 'change' && isTemplateContextLocked(input) && isCosmeticPrompt(input.prompt)) {
    const ruleResult = await applyPromptRules(input);
    if (ruleResult) return ruleResult;
  }

  if (input.action === 'change' && (isCosmeticPrompt(input.prompt) || isSiteBuildPrompt(input.prompt))) {
    const ruleResult = await applyPromptRules(input);
    if (ruleResult) return ruleResult;
  }

  const ruleResult = await applyPromptRules(input);
  if (ruleResult && ruleResult.changedSectionIds.length > 0) {
    return ruleResult;
  }

  const plan = planStudioChange(input);
  const directorResult = await executeDirectorPlan(input, plan);
  if (directorResult) {
    return directorResult;
  }

  const aiResult = await applyAIChange(input);
  if (aiResult) return aiResult;

  const target = targetSection(input);
  const sections = patchSection(
    cloneSections(input.previewSections),
    target.id,
    applyStrongVisualEnhancement(target.html, 'elegante')
  );

  return {
    message: input.lang === 'es'
      ? `Cambio aplicado — «${input.prompt.slice(0, 50)}»`
      : `Change applied — «${input.prompt.slice(0, 50)}»`,
    previewSections: sections,
    motorsUsed: ['visual', 'copy', 'code', 'ux'],
    source: 'rules',
    changedSectionIds: [target.id],
  };
}
