import { chatCompletion, type MotorId } from './providers';
import { generateInitialSite, generateInitialSiteFromDiscovery } from './siteGenerator';
import { rewriteFullPageFromRequest, rebuildFullPageFromChangeRequest } from './promptFirstSiteGenerator';
import {
  parseInsertSectionRequest,
  applySurgicalSectionInsert,
  applySurgicalDelta,
  changeRequestMarkers,
  htmlHasChangeMarkers,
} from './surgicalSectionChange';
import {
  extractCreativeMeta,
  preserveCreativeMeta,
  shouldBlockFullRebuild,
} from './creative/preserveDnaChange';
import { isSiteBuildPrompt, isCosmeticPrompt, shouldGenerateFullSite, isExistingSiteSections } from './intentAnalyzer';
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
import type { AiSkippedReason, PipelineStage } from './engineHealth';
import { getEngineHealth } from './engineHealth';
import type { OrchestraManifest } from './orchestra';
import { SECTION_MOTOR } from './orchestra';
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
  /** Fotos del cliente (URLs) — se anteponen al pack de sector. */
  clientImageUrls?: string[];
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
  /** Etapa del pipeline que produjo el resultado (diagnóstico). */
  pipelineStage?: PipelineStage;
  /** Por qué no intervino IA cuando se esperaba. */
  aiSkippedReason?: AiSkippedReason;
  /** Partitura del director: qué motor tocó cada sección. */
  orchestra?: OrchestraManifest;
  /** Proveedores IA que intervinieron en esta generación. */
  providersUsed?: string[];
  /** Imágenes generadas por fal.ai bajo Motor Visual. */
  falImages?: number;
  /** Pedido fuera de alcance (Stripe/SaaS/hosting…) → /contacto, sin gastar crédito. */
  quoteRedirect?: boolean;
  /** Reservado (compat). No empujar al cliente a wizard/deberes. */
  suggestDiscovery?: boolean;
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

function enrichPromptFromSections(prompt: string, sections: PreviewSection[], forInitial = false): string {
  if (forInitial) return prompt;
  const blob = sections.map((s) => s.html).join(' ');
  const name = blob.match(/<h1[^>]*>([^<]+)/)?.[1]?.trim();
  return [prompt, name].filter(Boolean).join(' ');
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
    lower.includes('bonit') ||
    lower.includes('galer') ||
    lower.includes('imagen') ||
    lower.includes('foto') ||
    lower.includes('gallery') ||
    lower.includes('color') ||
    lower.includes('fondo') ||
    lower.includes('background') ||
    lower.includes('escritur') ||
    lower.includes('fuente') ||
    lower.includes('font') ||
    lower.includes('natural') ||
    lower.includes('cambiar') ||
    lower.includes('cambio') ||
    lower.includes('quiero') ||
    lower.includes('añade') ||
    lower.includes('añadir') ||
    lower.includes('agrega') ||
    lower.includes('pon') ||
    lower.includes('haz') ||
    lower.includes('modifica') ||
    lower.includes('actualiza') ||
    lower.includes('blog') ||
    lower.includes('chat') ||
    lower.includes('asistente') ||
    lower.includes('newsletter') ||
    lower.includes('sección') ||
    lower.includes('seccion')
  );
}

/** Sitio generado desde brief (HTML completo) — los cambios cosméticos por regex mienten al cliente. */
function isFullPagePreview(sections: PreviewSection[]): boolean {
  if (sections.length === 1 && (sections[0].type === 'fullpage' || sections[0].html.includes('<!DOCTYPE'))) {
    return true;
  }
  return sections.some((s) => s.type === 'fullpage' || /<!DOCTYPE\s+html/i.test(s.html));
}

/**
 * Pedidos de cambio sobre fullpage: reescribir con IA.
 * Solo módulos chrome puros (sin otras palabras de diseño) → inyección determinista.
 */
function needsRealRedesign(prompt: string, sections: PreviewSection[]): boolean {
  if (!isFullPagePreview(sections)) return false;
  const lower = prompt.toLowerCase();
  const chromeOnly =
    /aviso\s+legal|privacidad|cookies|mapa\s+del\s+sitio|sitemap|whatsapp|scroll[\s_-]*up|redes\s+sociales/i.test(
      prompt
    ) &&
    !corporateUpgradePrompt(lower) &&
    prompt.trim().length < 120;
  if (chromeOnly) return false;
  // Cualquier pedido de cambio sobre web fullpage → rewrite (CREAUNA sirve para construir Y refinar)
  return (
    corporateUpgradePrompt(lower) ||
    /chat|blog|buscador|carrusel|newsletter|hero|color|fondo|tipograf/i.test(prompt)
  );
}

async function applyPromptRules(input: StudioGenerateInput): Promise<StudioGenerateResult | null> {
  const { prompt, lang, previewSections, action, sectionId, style } = input;
  const lower = prompt.toLowerCase();
  const target = targetSection(input);
  let sections = cloneSections(previewSections);
  const changedIds: number[] = [];

  if (action === 'regenerate') {
    // Cosmético solo si ya hay HTML; la reconstrucción real va por shouldGenerateFullSite
    if (!sections.length) return null;
    sections = sections.map((s) => ({
      ...s,
      html: applyStyleTransform(s.html, 'moderno'),
    }));
    return {
      message: lang === 'es' ? 'Diseño regenerado con nueva paleta y ritmo.' : 'Design regenerated with new palette and rhythm.',
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
      message: lang === 'es' ? `Estilo «${style}» aplicado a toda la vista.` : `«${style}» style applied to the full view.`,
      previewSections: sections,
      motorsUsed: ['ux', 'visual'],
      source: 'rules',
      changedSectionIds: changedIds,
    };
  }

  // Fullpage desde brief: no mentir con swaps de clases ("más elegante", "hero", "galería"…)
  if (needsRealRedesign(prompt, previewSections)) {
    return null;
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
        ? 'Sitio reconstruido con diseño premium — hero, servicios, carrusel, stats y footer con enlaces legales.'
        : 'Site rebuilt with premium design — hero, services, carousel, stats and legal footer links.',
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
      message: lang === 'es' ? 'Más espacio, tipografía refinada y detalles premium.' : 'More space, refined typography and premium details.',
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
      message: lang === 'es' ? 'Versión más clara y luminosa.' : 'Brighter, lighter version.',
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
      message: lang === 'es' ? 'Paleta tierra y beige aplicada.' : 'Earth and beige palette applied.',
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
      message: lang === 'es' ? 'Tipografía más sofisticada.' : 'More sophisticated typography.',
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
      message: lang === 'es' ? 'Formulario de contacto más visible.' : 'Contact form more visible.',
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

  if (isFullPagePreview(input.previewSections)) {
    const full = input.previewSections.find((s) => s.type === 'fullpage') ?? input.previewSections[0];
    const markers = changeRequestMarkers(input.prompt);
    const insertReq = parseInsertSectionRequest(input.prompt);
    const creativeMeta = extractCreativeMeta(full.html);

    // 1) Delta quirúrgico (insertar sección y/o parchear hero) — sin rewrite completo
    {
      const delta = applySurgicalDelta(full.html, input.prompt, input.lang, {
        imageUrls: input.clientImageUrls,
      });
      if (delta.ok) {
        const patchedHtml = preserveCreativeMeta(delta.html, creativeMeta);
        const validation = validateSectionHtml(patchedHtml, full.id, full.type);
        if (validation.ok) {
          const partsEs: string[] = [];
          const partsEn: string[] = [];
          if (delta.didInsert && delta.title) {
            const placeEs = insertReq?.beforeLabel
              ? insertReq.afterLabel
                ? `entre «${insertReq.afterLabel}» y «${insertReq.beforeLabel}»`
                : `antes de «${insertReq.beforeLabel}»`
              : insertReq?.afterLabel
                ? `después de «${insertReq.afterLabel}»`
                : '';
            partsEs.push(
              placeEs
                ? `He añadido «${delta.title}» ${placeEs}`
                : `He añadido «${delta.title}»`
            );
            partsEn.push(`Added “${delta.title}”`);
          }
          if (delta.didHero) {
            partsEs.push('actualicé el hero');
            partsEn.push('updated the hero');
          }
          return {
            message:
              input.lang === 'es'
                ? `${partsEs.join(' y ')}, sin tocar el resto.`
                : `${partsEn.join(' and ')}, leaving the rest intact.`,
            previewSections: patchSection(cloneSections(input.previewSections), full.id, patchedHtml),
            motorsUsed: ['code', 'ux'],
            source: 'rules',
            changedSectionIds: [full.id],
            pipelineStage: 'rules',
            providersUsed: ['surgical_delta'],
          };
        }
      }
    }

    // 2) Rewrite IA (solo si el resultado incluye los marcadores del pedido)
    const rewritten = await rewriteFullPageFromRequest(full.html, input.prompt, input.lang, {
      clientImageUrls: input.clientImageUrls,
    });
    if (rewritten.html) {
      const rewrittenHtml = preserveCreativeMeta(rewritten.html, creativeMeta);
      const markersOk = htmlHasChangeMarkers(rewrittenHtml, markers);
      const validation = validateSectionHtml(rewrittenHtml, full.id, full.type);
      if (validation.ok && markersOk) {
        return {
          message:
            input.lang === 'es'
              ? rewritten.repaired
                ? 'Cambio aplicado y reparado sobre tu diseño.'
                : 'Cambio aplicado sobre tu diseño, según tu pedido.'
              : rewritten.repaired
                ? 'Change applied and repaired on your design.'
                : 'Change applied on your design, per your request.',
          previewSections: patchSection(cloneSections(input.previewSections), full.id, rewrittenHtml),
          motorsUsed: ['visual', 'code'],
          source: rewritten.falImages ? 'hybrid' : 'ai',
          changedSectionIds: [full.id],
          pipelineStage: 'prompt_first',
          falImages: rewritten.falImages,
          providersUsed: [rewritten.provider],
        };
      }

      // Rewrite devolvió HTML válido pero SIN el cambio pedido → reintentar surgical sobre original
      if (insertReq && !markersOk) {
        const surgicalRetry = applySurgicalSectionInsert(full.html, insertReq, input.lang, {
          imageUrls: input.clientImageUrls,
        });
        if (surgicalRetry.ok) {
          const retryHtml = preserveCreativeMeta(surgicalRetry.html, creativeMeta);
          const validation = validateSectionHtml(retryHtml, full.id, full.type);
          if (validation.ok) {
            return {
              message:
                input.lang === 'es'
                  ? `He insertado «${insertReq.title}» de forma precisa (el rewrite no aplicó el pedido).`
                  : `Inserted “${insertReq.title}” precisely (rewrite missed the request).`,
              previewSections: patchSection(
                cloneSections(input.previewSections),
                full.id,
                retryHtml
              ),
              motorsUsed: ['code', 'ux'],
              source: 'rules',
              changedSectionIds: [full.id],
              pipelineStage: 'rules',
              providersUsed: ['surgical_insert'],
            };
          }
        }
      }
    }

    // 3) Fallback rebuild — BLOQUEADO si hay DesignDna (Fase 8) salvo rediseño total explícito
    if (shouldBlockFullRebuild(full.html, input.prompt)) {
      return {
        message:
          input.lang === 'es'
            ? 'Tu web tiene Design DNA. Indica el cambio concreto (texto, foto, sección) y lo aplico sin destruir el diseño. Si quieres un rediseño total, dilo explícitamente.'
            : 'Your site has Design DNA. Specify a concrete change (copy, photo, section) and I will apply it without destroying the design. Ask explicitly for a full redesign if needed.',
        previewSections: cloneSections(input.previewSections),
        motorsUsed: ['ux'],
        source: 'rules',
        changedSectionIds: [],
        pipelineStage: 'rules',
        providersUsed: ['preserve_dna'],
      };
    }

    // 3b) Rebuild fullpage desde brief sintético + pedido
    const rebuilt = await rebuildFullPageFromChangeRequest(full.html, input.prompt, input.lang, {
      clientImageUrls: input.clientImageUrls,
    });
    if (rebuilt.ok && rebuilt.previewSections[0]?.html) {
      const html = rebuilt.previewSections[0].html;
      const validation = validateSectionHtml(html, full.id, 'fullpage');
      const markersOk = htmlHasChangeMarkers(html, markers);
      if (validation.ok && (markersOk || markers.length === 0)) {
        return {
          message:
            input.lang === 'es'
              ? 'He reconstruido tu web aplicando el cambio pedido.'
              : 'Rebuilt your site applying the requested change.',
          previewSections: patchSection(cloneSections(input.previewSections), full.id, html),
          motorsUsed: rebuilt.motorsUsed,
          source: rebuilt.source,
          changedSectionIds: [full.id],
          pipelineStage: rebuilt.pipelineStage,
          falImages: rebuilt.falImages,
          providersUsed: rebuilt.providersUsed,
        };
      }
    }
    return null;
  }

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
      pipelineStage: 'ai_section',
    };
  } catch {
    return null;
  }
}

export async function generateStudioChange(input: StudioGenerateInput): Promise<StudioGenerateResult> {
  // Stripe / carrito real / SaaS / hosting / API keys → formulario de presupuesto (/contacto)
  {
    const { isCustomQuoteRequest, customQuoteStudioMessage } = await import('./customQuoteGate');
    if (isCustomQuoteRequest(input.prompt)) {
      const isChangeOnExisting =
        input.action === 'change' && input.previewSections.length > 0;
      const isShortOrAddonAsk =
        input.prompt.length < 700 ||
        /^(quiero|necesito|añade|agrega|ponme|pon|activa|integr|implementa|mete)/i.test(
          input.prompt.trim()
        );
      const redesignOnly =
        /redise[nñ]a|regenera|cambia\s+el\s+hero|m[aá]s\s+elegante|tipograf|paleta|colores/i.test(
          input.prompt
        ) && !/stripe|pasarela|carrito\s+de\s+compra|saas|hosting|alojamiento|api\s*keys?/i.test(input.prompt);

      if ((isChangeOnExisting || isShortOrAddonAsk || input.action === 'initial') && !redesignOnly) {
        // En briefs largos de web que mencionan Stripe de pasada, seguimos generando la web
        // y el mensaje de entrega puede apuntar a /contacto; aquí cortamos pedidos claros de extras.
        const longWebBrief =
          input.action === 'initial' &&
          input.prompt.length > 700 &&
          /(hero|lookbook|secci[oó]n|dise[nñ]o|tipograf|galer[ií]a|web\s+(para|de)|landing)/i.test(
            input.prompt
          );
        if (!longWebBrief || isChangeOnExisting || isShortOrAddonAsk) {
          return {
            message: customQuoteStudioMessage(input.prompt, input.lang),
            previewSections: cloneSections(input.previewSections),
            motorsUsed: ['ux'],
            source: 'rules',
            changedSectionIds: [],
            pipelineStage: 'rules',
            quoteRedirect: true,
          };
        }
      }
    }
  }

  // Módulos pedidos (legales, WhatsApp, blog, buscador, carrusel, chat…) → inyección determinista
  if (input.action === 'change' && input.previewSections.length > 0) {
    const { injectSiteChrome, promptWantsSiteChrome, describeAppliedModules, detectRequestedModules } =
      await import('./siteChrome');
    if (promptWantsSiteChrome(input.prompt)) {
      const full =
        input.previewSections.find((s) => s.type === 'fullpage') ||
        input.previewSections.find((s) => /<!DOCTYPE\s+html/i.test(s.html)) ||
        [...input.previewSections].sort((a, b) => b.html.length - a.html.length)[0];
      if (full && full.html.length > 500) {
        const nextHtml = injectSiteChrome(full.html, {
          prompt: input.prompt,
          lang: input.lang,
          businessName: input.businessName,
        });
        if (nextHtml.length !== full.html.length || /cua-modules:/i.test(nextHtml)) {
          return {
            message: describeAppliedModules(input.prompt, input.lang),
            previewSections: patchSection(cloneSections(input.previewSections), full.id, nextHtml),
            motorsUsed: ['ux', 'code'],
            source: 'rules',
            changedSectionIds: [full.id],
            pipelineStage: 'rules',
            providersUsed: detectRequestedModules(input.prompt),
          };
        }
      }
    }
  }

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
      pipelineStage: result.pipelineStage ?? 'discovery_initial',
      aiSkippedReason: result.aiSkippedReason,
      falImages: result.falImages,
      suggestDiscovery: result.suggestDiscovery,
    };
  }

  if (shouldGenerateFullSite(input.prompt, input.action, input.previewSections)) {
    if (isTemplateContextLocked(input) && input.action !== 'regenerate' && input.action !== 'initial') {
      const locked = regenerateFromLockedTemplate(input, input.lang);
      return { ...locked, pipelineStage: 'rules' };
    }
    // Regenerar = nuevo build desde brief (no plantilla bloqueada)
    const buildPrompt =
      input.action === 'regenerate' && input.prompt.length < 120
        ? enrichPromptFromSections(input.prompt, input.previewSections) || input.prompt
        : input.prompt;
    const result = await generateInitialSite(buildPrompt, input.lang, input.sectorId, {
      clientImageUrls: input.clientImageUrls,
    });
    // Rechazo de calidad: no sustituir la preview por vacío ni colar plantilla
    if (!result.previewSections.length) {
      return {
        message:
          result.message ||
          (input.lang === 'es'
            ? 'Estoy listo para construir o ajustar tu web. Dime qué necesitas.'
            : 'Ready to build or adjust your site. Tell me what you need.'),
        previewSections: cloneSections(input.previewSections),
        motorsUsed: result.motorsUsed ?? [],
        source: 'rules',
        changedSectionIds: [],
        templateSlug: result.templateSlug,
        businessName: result.businessName,
        sectorId: result.sectorId,
        sectorLabel: result.sectorLabel,
        pipelineStage: result.pipelineStage ?? 'prompt_first',
        aiSkippedReason: result.aiSkippedReason,
        suggestDiscovery: false,
      };
    }
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
      pipelineStage: result.pipelineStage ?? 'full_site_generate',
      aiSkippedReason: result.aiSkippedReason,
      falImages: result.falImages,
      suggestDiscovery: result.suggestDiscovery,
    };
  }

  if (isPremiumStarterContextLocked(input) && input.action === 'change') {
    const premium = personalizeFromPremiumStarter(input, input.lang);
    return { ...premium, pipelineStage: 'premium_personalize' };
  }

  // Brief fullpage: rediseños reales ANTES de reglas cosméticas (que solo cambian clases)
  if (input.action === 'change' && isFullPagePreview(input.previewSections)) {
    if (needsRealRedesign(input.prompt, input.previewSections)) {
      const aiFull = await applyAIChange(input);
      if (aiFull) return aiFull;
    }
  }

  // Fullpage: NUNCA cosméticos por regex (mienten al cliente en CSS propio)
  if (input.action === 'change' && isFullPagePreview(input.previewSections)) {
    const aiFull = await applyAIChange(input);
    if (aiFull) return aiFull;
  }

  if (input.action === 'change' && isTemplateContextLocked(input) && isCosmeticPrompt(input.prompt)) {
    if (!isFullPagePreview(input.previewSections)) {
      const ruleResult = await applyPromptRules(input);
      if (ruleResult) return ruleResult;
    }
  }

  if (input.action === 'change' && (isCosmeticPrompt(input.prompt) || isSiteBuildPrompt(input.prompt))) {
    if (!isFullPagePreview(input.previewSections)) {
      const ruleResult = await applyPromptRules(input);
      if (ruleResult) return ruleResult;
    }
  }

  if (!isFullPagePreview(input.previewSections)) {
    const ruleResult = await applyPromptRules(input);
    if (ruleResult && ruleResult.changedSectionIds.length > 0) {
      return { ...ruleResult, pipelineStage: 'rules' };
    }
  }

  const plan = planStudioChange(input);
  const directorResult = await executeDirectorPlan(input, plan);
  if (directorResult) {
    return { ...directorResult, pipelineStage: 'director' };
  }

  const aiResult = await applyAIChange(input);
  if (aiResult) return aiResult;

  // Fullpage: nunca maquillaje cosmético si el rewrite/rebuild falló
  if (isFullPagePreview(input.previewSections)) {
    const health = getEngineHealth();
    return {
      message:
        input.lang === 'es'
          ? 'No pude aplicar ese cambio sobre tu web completa. Reformúlalo (qué sección, qué color, qué texto) y lo intento de nuevo.'
          : 'Could not apply that change on your full site. Rephrase (which section, color, copy) and I will try again.',
      previewSections: cloneSections(input.previewSections),
      motorsUsed: [],
      source: 'rules',
      changedSectionIds: [],
      pipelineStage: health.aiEnabled ? 'rules_fallback' : 'rules_only',
      aiSkippedReason: health.aiEnabled ? 'ai_parse_failed' : 'no_api_keys',
    };
  }

  const health = getEngineHealth();
  const target = targetSection(input);
  const enhanced = applyStrongVisualEnhancement(target.html, 'elegante');
  const sections = patchSection(cloneSections(input.previewSections), target.id, enhanced);

  if (enhanced === target.html) {
    return {
      message:
        input.lang === 'es'
          ? 'No se pudo aplicar tu cambio. Sé más específico (sección, color, texto) o reformula.'
          : 'Could not apply your change. Be more specific (section, color, copy) or rephrase.',
      previewSections: cloneSections(input.previewSections),
      motorsUsed: health.aiEnabled ? [] : ['visual'],
      source: 'rules',
      changedSectionIds: [],
      pipelineStage: health.aiEnabled ? 'rules_fallback' : 'rules_only',
      aiSkippedReason: health.aiEnabled ? 'ai_parse_failed' : 'no_api_keys',
    };
  }

  return {
    message:
      input.lang === 'es'
        ? `Ajuste aplicado — «${input.prompt.slice(0, 50)}». Si necesitas más precisión, reformula el pedido.`
        : `Update applied — «${input.prompt.slice(0, 50)}». Rephrase if you need more precision.`,
    previewSections: sections,
    motorsUsed: ['visual'],
    source: 'rules',
    changedSectionIds: [target.id],
    pipelineStage: health.aiEnabled ? 'rules_fallback' : 'rules_only',
    aiSkippedReason: health.aiEnabled ? 'ai_parse_failed' : 'no_api_keys',
  };
}
