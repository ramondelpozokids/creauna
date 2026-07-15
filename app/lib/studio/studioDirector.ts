import { analyzeIntent, buildIntentFromTemplateSlug } from '../ai/intentAnalyzer';
import { detectVariant, getBusinessProfile } from '../ai/businessProfiles';
import { buildSiteBrief, enhanceSelectedSections, type SiteBrief } from '../ai/siteAiEnhancer';
import type { StudioGenerateInput, StudioGenerateResult, PreviewSection } from '../ai/studioEngine';
import { generateInitialSite } from '../ai/siteGenerator';
import { resolveStudioSector, buildSectorAgentPlaybook } from './sectorAgentPlaybook';
import type { TemplatePageSection } from '../templatePages';
import { wrapSectionHtml } from '../ai/siteSectionWrap';
import { hasMeaningfulSectionChanges } from './sectionDiff';
import {
  appendMissingSections,
  isTemplateContextLocked,
  regenerateFromLockedTemplate,
  resolveStudioBusinessName,
} from './studioContextLock';
import {
  buildOrchestraManifest,
  resolveMotorForSection,
  orchestraSummary,
  type OrchestraManifest,
} from '../ai/orchestra';

export type DirectorStrategy =
  | 'full_regenerate'
  | 'add_section'
  | 'multi_agent'
  | 'visual'
  | 'copy'
  | 'ux'
  | 'code';

export interface DirectorPlan {
  strategy: DirectorStrategy;
  targetTypes: string[];
  motorLabels: string[];
  reasonEs: string;
  reasonEn: string;
}

const VISUAL_TYPES = new Set(['hero', 'gallery', 'about']);
const COPY_TYPES = new Set(['hero', 'about', 'reviews', 'blog']);
const UX_TYPES = new Set(['contact', 'location', 'reservation']);
const CODE_TYPES = new Set(['services', 'menu', 'carta', 'footer']);
const DEFAULT_IMPROVE = new Set(['hero', 'services', 'reviews', 'contact', 'gallery']);

function previewBlob(sections: PreviewSection[]): string {
  return sections.map((s) => s.html).join(' ');
}

function previewToTemplate(sections: PreviewSection[]): TemplatePageSection[] {
  return sections.map((s) => ({
    id: String(s.id),
    type: s.type,
    navLabelEs: s.type,
    navLabelEn: s.type,
    html: s.html,
  }));
}

function templateToPreview(
  before: PreviewSection[],
  templateSections: TemplatePageSection[]
): PreviewSection[] {
  const byType = new Map(templateSections.map((s) => [s.type, s]));
  return before.map((prev) => {
    const next = byType.get(prev.type);
    if (!next) return prev;
    return { ...prev, html: wrapSectionHtml(next.html) };
  });
}

function existingTypes(sections: PreviewSection[]): Set<string> {
  return new Set(sections.map((s) => s.type));
}

function filterExisting(types: Set<string>, available: Set<string>): string[] {
  return [...types].filter((t) => available.has(t));
}

export function planStudioChange(input: StudioGenerateInput): DirectorPlan {
  const { prompt, lang, previewSections } = input;
  const lower = prompt.toLowerCase();
  const types = existingTypes(previewSections);
  const locked = isTemplateContextLocked(input);

  const wantsNewSection =
    /a[nñ]ad(e|ir|a)|agrega|nueva secci|más secci|falta|sin secci|crea.*secci|new section|add section/i.test(lower);
  const wantsPage = /p[aá]gina|page|landing|blog completo/i.test(lower);
  const wantsFull =
    /web completa|todo el sitio|entera|regenera|desde cero|rehaz|rebuild|whole site/i.test(lower);

  if (wantsFull || wantsPage) {
    return {
      strategy: 'full_regenerate',
      targetTypes: [],
      motorLabels: ['visual', 'copy', 'ux', 'code'],
      reasonEs: locked
        ? 'Regeneración completa respetando la plantilla y el negocio cargados.'
        : 'Regeneración completa con biblioteca de sector y plantilla premium.',
      reasonEn: locked
        ? 'Full regeneration keeping the loaded template and business context.'
        : 'Full regeneration using sector library and premium template.',
    };
  }

  if (/testimonio|reseñ|review|opinion/i.test(lower) && !types.has('reviews')) {
    return {
      strategy: 'add_section',
      targetTypes: ['reviews'],
      motorLabels: ['copy', 'visual'],
      reasonEs: 'Añadir bloque de testimonios sin perder el resto de la web.',
      reasonEn: 'Add testimonials block without losing the rest of the site.',
    };
  }

  if (wantsNewSection && !locked && previewSections.length < 2) {
    return {
      strategy: 'full_regenerate',
      targetTypes: [],
      motorLabels: ['visual', 'copy', 'ux', 'code'],
      reasonEs: 'Sitio mínimo: generación completa para añadir la sección pedida.',
      reasonEn: 'Minimal site: full generation to add the requested section.',
    };
  }

  if (
    /servicio|service|men[uú]|carta|estructura|secci[oó]n|section|listado|propiedad/i.test(lower) &&
    (!types.has('services') || wantsNewSection)
  ) {
    return {
      strategy: 'code',
      targetTypes: filterExisting(CODE_TYPES, types),
      motorLabels: ['code'],
      reasonEs: 'Motor Código: servicios, menú o estructura de secciones.',
      reasonEn: 'Code engine: services, menu or section structure.',
    };
  }

  if (
    /contacto|formulario|bot[oó]n|mapa|ubicaci|reserva|cita|m[oó]vil|mobile|clara|luminosa|usabilidad|ux/i.test(
      lower
    )
  ) {
    const targets = filterExisting(UX_TYPES, types);
    if (targets.length) {
      return {
        strategy: 'ux',
        targetTypes: targets,
        motorLabels: ['ux'],
        reasonEs: 'Motor UX: contacto, mapa, formularios y conversión.',
        reasonEn: 'UX engine: contact, map, forms and conversion.',
      };
    }
  }

  if (/testimonio|texto|copy|about|sobre|redacci|titulo|p[aá]rrafo|headline|contenido/i.test(lower)) {
    const targets = filterExisting(COPY_TYPES, types);
    if (targets.length) {
      return {
        strategy: 'copy',
        targetTypes: targets,
        motorLabels: ['copy'],
        reasonEs: 'Motor Copy: textos, testimonios y contenido persuasivo.',
        reasonEn: 'Copy engine: copy, testimonials and persuasive content.',
      };
    }
  }

  if (
    /elegante|hero|impactante|animaci|tipograf|premium|ferrari|modern|visual|imagen|foto|galer|refinad|lujo|profesional/i.test(
      lower
    )
  ) {
    const targets = filterExisting(VISUAL_TYPES, types);
    if (targets.length) {
      return {
        strategy: 'visual',
        targetTypes: targets.length ? targets : ['hero'],
        motorLabels: ['visual'],
        reasonEs: 'Motor Visual: hero, imágenes y acabado premium.',
        reasonEn: 'Visual engine: hero, imagery and premium finish.',
      };
    }
  }

  if (/mejor|improve|calidad|nivel|primera liga|incre[ií]ble|profesional/i.test(lower)) {
    const targets = filterExisting(DEFAULT_IMPROVE, types);
    return {
      strategy: 'multi_agent',
      targetTypes: targets.length ? targets : ['hero'],
      motorLabels: ['visual', 'copy', 'ux', 'code'],
      reasonEs: 'Director CREAUNA: mejora coordinada en varias secciones con agentes especializados.',
      reasonEn: 'CREAUNA Director: coordinated multi-section improvement with specialized agents.',
    };
  }

  const fallback = filterExisting(DEFAULT_IMPROVE, types);
  return {
    strategy: 'multi_agent',
    targetTypes: fallback.length ? fallback : ['hero'],
    motorLabels: ['visual', 'copy', 'ux'],
    reasonEs: 'Director CREAUNA: interpreto tu petición y delego al motor adecuado.',
    reasonEn: 'CREAUNA Director: interpreting your request and delegating to the right engine.',
  };
}

function buildBriefFromPreview(input: StudioGenerateInput): SiteBrief {
  const blob = previewBlob(input.previewSections);
  const businessName = resolveStudioBusinessName(input);
  const locked = isTemplateContextLocked(input);

  let intent;
  let sectorMeta: { id: string; label: string; playbook: string } | undefined;

  if (input.templateSlug) {
    intent = buildIntentFromTemplateSlug(input.templateSlug, input.lang);
    intent.businessName = businessName;
  } else {
    const sector = resolveStudioSector(`${input.prompt} ${blob}`, input.sectorId);
    intent = analyzeIntent(`${input.prompt} ${businessName} ${blob.slice(0, 500)}`, input.lang);
    if (sector) {
      intent.templateSlug = sector.templateSlug;
      intent.businessType = input.lang === 'es' ? sector.labelEs : sector.labelEn;
      sectorMeta = {
        id: sector.id,
        label: input.lang === 'es' ? sector.labelEs : sector.labelEn,
        playbook: buildSectorAgentPlaybook(sector, input.lang),
      };
    }
  }

  if (!sectorMeta && !locked) {
    const sector = resolveStudioSector(`${input.prompt} ${blob}`, input.sectorId);
    if (sector) {
      sectorMeta = {
        id: sector.id,
        label: input.lang === 'es' ? sector.labelEs : sector.labelEn,
        playbook: buildSectorAgentPlaybook(sector, input.lang),
      };
    }
  }

  const profile = getBusinessProfile(intent.variant);

  const directorNote =
    input.lang === 'es'
      ? `\n[DIRECTOR CREAUNA] El cliente ya tiene una web premium generada${locked ? ` (plantilla ${input.templateSlug})` : ''}. MEJORA lo existente según: «${input.prompt}». Mantén calidad de agencia (€1.500–3.000), imágenes profesionales, secciones completas. Nunca empeores ni simplifiques.`
      : `\n[CREAUNA DIRECTOR] Client already has a premium site${locked ? ` (template ${input.templateSlug})` : ''}. IMPROVE what exists per: «${input.prompt}». Keep agency-grade quality, pro images, full sections. Never downgrade.`;

  const brief = buildSiteBrief(intent, profile, null, input.lang, input.prompt + directorNote, sectorMeta);
  brief.businessName = businessName;
  brief.variant = locked ? intent.variant : detectVariant(blob + ' ' + input.prompt);
  return brief;
}

function enrichRegeneratePrompt(input: StudioGenerateInput, brief: SiteBrief): string {
  const sector = resolveStudioSector(input.prompt, input.sectorId);
  const playbook = sector ? buildSectorAgentPlaybook(sector, input.lang) : '';
  return [
    input.prompt,
    `Negocio: ${brief.businessName}`,
    brief.sectorLabel ? `Sector: ${brief.sectorLabel}` : '',
    playbook,
    input.lang === 'es'
      ? 'Mejora o amplía la web manteniendo calidad premium CREAUNA (referencias: gestoría Madrid, inmobiliaria Habitat, energía solar ritest).'
      : 'Improve or extend the site keeping CREAUNA premium quality.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

function changedIds(before: PreviewSection[], after: PreviewSection[]): number[] {
  return after
    .filter((next) => {
      const prev = before.find((p) => p.id === next.id);
      return prev && prev.html !== next.html;
    })
    .map((s) => s.id);
}

export async function executeDirectorPlan(
  input: StudioGenerateInput,
  plan: DirectorPlan
): Promise<StudioGenerateResult | null> {
  const { lang, previewSections } = input;
  const brief = buildBriefFromPreview(input);

  if (plan.strategy === 'full_regenerate') {
    if (isTemplateContextLocked(input)) {
      const result = regenerateFromLockedTemplate(input, lang);
      return {
        ...result,
        message:
          lang === 'es'
            ? `${plan.reasonEs} ${result.message}`
            : `${plan.reasonEn} ${result.message}`,
        motorsUsed: plan.motorLabels,
      };
    }
    const enriched = enrichRegeneratePrompt(input, brief);
    const result = await generateInitialSite(enriched, lang, input.sectorId ?? brief.sectorId);
    return {
      message:
        lang === 'es'
          ? `${plan.reasonEs} ${result.message}`
          : `${plan.reasonEn} ${result.message}`,
      previewSections: result.previewSections,
      motorsUsed: result.motorsUsed ?? plan.motorLabels,
      source: result.source,
      changedSectionIds: result.changedSectionIds,
      templateSlug: result.templateSlug,
      businessName: result.businessName,
      sectorId: result.sectorId,
      sectorLabel: result.sectorLabel,
      falImages: result.falImages,
    };
  }

  if (plan.strategy === 'add_section') {
    const added = appendMissingSections(
      input,
      plan.targetTypes,
      lang,
      plan.reasonEs,
      plan.reasonEn
    );
    if (added) {
      return {
        ...added,
        motorsUsed: plan.motorLabels,
      };
    }
  }

  const templateSections = previewToTemplate(previewSections);
  const targetSet = new Set(plan.targetTypes);
  const orchestra = buildOrchestraManifest(plan, plan.targetTypes);

  const { sections, motorsUsed, providersUsed, aiEnhanced, falImages } = await enhanceSelectedSections(
    templateSections,
    brief,
    targetSet,
    (sectionType) => resolveMotorForSection(sectionType, plan)
  );

  if (!aiEnhanced && providersUsed.length === 0) {
    return null;
  }

  const updated = templateToPreview(previewSections, sections);
  const ids = changedIds(previewSections, updated);

  if (!hasMeaningfulSectionChanges(previewSections, updated, ids)) {
    return null;
  }

  const sector = resolveStudioSector(input.prompt, input.sectorId);
  const orchestraResult: OrchestraManifest = {
    ...orchestra,
    motorsUsed: [...new Set(motorsUsed.length ? (motorsUsed as OrchestraManifest['motorsUsed']) : orchestra.motorsUsed)],
    providersUsed: providersUsed.length
      ? ([...new Set(providersUsed)] as OrchestraManifest['providersUsed'])
      : orchestra.providersUsed,
  };

  return {
    message:
      (lang === 'es' ? plan.reasonEs : plan.reasonEn) +
      (lang === 'es'
        ? ` ${orchestraSummary(orchestraResult, lang)}. Secciones: ${ids.length}.`
        : ` ${orchestraSummary(orchestraResult, lang)}. Sections: ${ids.length}.`),
    previewSections: updated,
    motorsUsed: motorsUsed.length ? motorsUsed : plan.motorLabels,
    source: 'hybrid',
    changedSectionIds: ids,
    templateSlug: input.templateSlug,
    businessName: resolveStudioBusinessName(input),
    sectorId: sector?.id,
    sectorLabel: sector ? (lang === 'es' ? sector.labelEs : sector.labelEn) : undefined,
    orchestra: orchestraResult,
    providersUsed: orchestraResult.providersUsed,
    falImages,
  };
}
