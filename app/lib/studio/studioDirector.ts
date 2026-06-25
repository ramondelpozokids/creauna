import { analyzeIntent } from '../ai/intentAnalyzer';
import { detectVariant, getBusinessProfile } from '../ai/businessProfiles';
import { buildSiteBrief, enhanceSelectedSections, type SiteBrief } from '../ai/siteAiEnhancer';
import { extractPreviewBusinessName } from '../ai/siteSections';
import type { StudioGenerateInput, StudioGenerateResult, PreviewSection } from '../ai/studioEngine';
import { generateInitialSite } from '../ai/siteGenerator';
import { resolveStudioSector, buildSectorAgentPlaybook } from './sectorAgentPlaybook';
import type { TemplatePageSection } from '../templatePages';
import { wrapSectionHtml } from '../ai/siteSectionWrap';
import { hasMeaningfulSectionChanges } from './sectionDiff';

export type DirectorStrategy =
  | 'full_regenerate'
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

  const wantsNewSection =
    /a[nñ]ad(e|ir|a)|agrega|nueva secci|más secci|falta|sin secci|crea.*secci|new section|add section/i.test(lower);
  const wantsPage = /p[aá]gina|page|landing|blog completo/i.test(lower);
  const wantsFull =
    /web completa|todo el sitio|entera|regenera|desde cero|rehaz|rebuild|whole site/i.test(lower);

  if (wantsFull || wantsPage || (wantsNewSection && previewSections.length >= 2)) {
    return {
      strategy: 'full_regenerate',
      targetTypes: [],
      motorLabels: ['visual', 'copy', 'ux', 'code'],
      reasonEs: 'Regeneración completa con biblioteca de sector y plantilla premium.',
      reasonEn: 'Full regeneration using sector library and premium template.',
    };
  }

  if (/testimonio|reseñ|review|opinion/i.test(lower) && !types.has('reviews')) {
    return {
      strategy: 'full_regenerate',
      targetTypes: ['reviews'],
      motorLabels: ['copy', 'visual'],
      reasonEs: 'Añadir bloque de testimonios con agente Copy + Visual.',
      reasonEn: 'Add testimonials block with Copy + Visual agents.',
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
  const businessName = extractPreviewBusinessName(input.previewSections);
  const sector = resolveStudioSector(`${input.prompt} ${blob}`, input.sectorId);
  const intent = analyzeIntent(`${input.prompt} ${businessName} ${blob.slice(0, 500)}`, input.lang);

  if (sector) {
    intent.templateSlug = sector.templateSlug;
    intent.businessType = input.lang === 'es' ? sector.labelEs : sector.labelEn;
  }

  const profile = getBusinessProfile(intent.variant);
  const sectorMeta = sector
    ? {
        id: sector.id,
        label: input.lang === 'es' ? sector.labelEs : sector.labelEn,
        playbook: buildSectorAgentPlaybook(sector, input.lang),
      }
    : undefined;

  const directorNote =
    input.lang === 'es'
      ? `\n[DIRECTOR CREAUNA] El cliente ya tiene una web premium generada. MEJORA lo existente según: «${input.prompt}». Mantén calidad de agencia (€1.500–3.000), imágenes profesionales, secciones completas. Nunca empeores ni simplifiques.`
      : `\n[CREAUNA DIRECTOR] Client already has a premium site. IMPROVE what exists per: «${input.prompt}». Keep agency-grade quality, pro images, full sections. Never downgrade.`;

  const brief = buildSiteBrief(intent, profile, null, input.lang, input.prompt + directorNote, sectorMeta);
  brief.businessName = businessName;
  brief.variant = detectVariant(blob + ' ' + input.prompt);
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
    };
  }

  const templateSections = previewToTemplate(previewSections);
  const targetSet = new Set(plan.targetTypes);
  const { sections, motorsUsed, providersUsed, aiEnhanced } = await enhanceSelectedSections(
    templateSections,
    brief,
    targetSet
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
  const motorNote =
    motorsUsed.length > 0
      ? lang === 'es'
        ? ` Motores: ${motorsUsed.join(', ')}.`
        : ` Engines: ${motorsUsed.join(', ')}.`
      : '';

  return {
    message:
      (lang === 'es' ? plan.reasonEs : plan.reasonEn) +
      motorNote +
      (lang === 'es'
        ? ` Secciones actualizadas: ${ids.length}.`
        : ` Sections updated: ${ids.length}.`),
    previewSections: updated,
    motorsUsed: motorsUsed.length ? motorsUsed : plan.motorLabels,
    source: 'hybrid',
    changedSectionIds: ids,
    sectorId: sector?.id,
    sectorLabel: sector ? (lang === 'es' ? sector.labelEs : sector.labelEn) : undefined,
  };
}
