import type { TemplatePageSection } from '../templatePages';
import type { BusinessVariant, BusinessProfile } from './businessProfiles';
import type { ParsedIntent } from './intentAnalyzer';
import type { ParsedGoogleListing } from './googleListingParser';
import {
  chatCompletion,
  getConfiguredProviders,
  type MotorId,
  MOTOR_PROVIDER,
  type AiProvider,
} from './providers';
import { imageBriefForVariant } from './imageBank';
import { validateSectionHtml } from '../studio/sectionValidator';

export interface SiteBrief {
  businessName: string;
  businessType: string;
  variant: BusinessVariant;
  lang: 'es' | 'en';
  tagline?: string;
  phone?: string;
  address?: string;
  designStyle: string;
  userPrompt: string;
  imageBrief: string;
  sectorId?: string;
  sectorLabel?: string;
  sectorPlaybook?: string;
}

const VARIANT_DESIGN: Partial<Record<BusinessVariant, string>> = {
  cafe: 'Restaurante premium (Rest Art Café / Mesón La Colonia): header blanco, terracota/dorado, Playfair serif, rating Google, menú del día, barra info 3 columnas, WhatsApp.',
  foodblog: 'Blog de recetas estilo Squarespace Stanton: fondo beige #f4f0eb, acento coral/salmón, hero split imagen+texto, grid 3 columnas de posts, newsletter full-width, footer taupe, tipografía serif limpia.',
  beauty: 'Salón luxury (Elite Beauty / Estilo de Belleza): cream #FDF8F3, rose gold, tarjetas servicio con foto, reserva split oscuro/blanco.',
  corporate: 'Asesoría (Campón Asesores): azul corporativo #004080, barra superior, grid servicios con bullets, reseñas, formulario contacto.',
  automotive: 'Concesionario (Motos Cortés/Yamaha): fondo #0a0a0a, acento rojo #e60012, tipografía uppercase bold, stats, taller/venta/recambios.',
  tattoo: 'Estudio tatuajes (Royal Bang): negro/rojo, galería portfolio, reservar cita.',
  kebab: 'Kebab premium urbano: fotos apetitosas, carta real, ambiente Vallecas.',
  luxury: 'Fine dining (La Maison Dorée): negro #1a1a1a + oro #c8a97e, script decorativo, cinematográfico, alta cocina.',
  jewelry: 'Joyería/relojería lujo (Rolex/Cartier): negro #0a0a0a, marfil, champagne, oro cepillado, font-serif editorial, mucho espacio en blanco, hero cinematográfico, mega menú, marcas suizas, galería premium, cita privada. PROHIBIDO estilo restaurante o plantilla genérica.',
  nonprofit: 'ONG/accesibilidad (InfoSordos): azul #0a3bf6, misión clara, inclusivo, recursos LSE, subtítulos.',
  renewable: 'Empresa energías renovables premium (referencia ritest.es): hero oscuro con parque solar, verde energético #16a34a, azul tech #0f172a, grid sutil, stats confianza, tarjetas servicios fotovoltaica/baterías/EV, proceso 5 pasos, proyectos reales, FAQ acordeón, footer corporativo. PROHIBIDO spa, masajes, hotel, piscina, belleza, restaurante.',
  default: 'Web de agencia premium: Playfair + sans, mucho aire, sombras suaves, rounded-[2rem]. Cero placeholders genéricos.',
};

const SECTION_MOTOR: Record<string, MotorId> = {
  hero: 'visual',
  gallery: 'visual',
  about: 'copy',
  reviews: 'copy',
  menu: 'code',
  services: 'code',
  carta: 'code',
  reservation: 'ux',
  location: 'ux',
  contact: 'ux',
  footer: 'code',
};

const ENHANCE_TYPES = new Set(['hero', 'menu', 'services', 'carta', 'about', 'reviews', 'gallery', 'blog']);

function providerToMotor(provider: string): string {
  for (const [motor, prov] of Object.entries(MOTOR_PROVIDER)) {
    if (prov === provider) return motor;
  }
  return 'code';
}

export function buildSiteBrief(
  intent: ParsedIntent,
  profile: BusinessProfile | null,
  listing: ParsedGoogleListing | null,
  lang: 'es' | 'en',
  userPrompt: string,
  sectorMeta?: { id: string; label: string; playbook: string }
): SiteBrief {
  const designStyle = VARIANT_DESIGN[intent.variant] ?? VARIANT_DESIGN.default!;
  return {
    businessName: listing?.businessName ?? intent.businessName,
    businessType: sectorMeta?.label ?? intent.businessType,
    variant: intent.variant,
    lang,
    tagline: profile ? (lang === 'es' ? profile.taglineEs : profile.taglineEn) : undefined,
    phone: profile?.phone ?? listing?.phone,
    address: profile ? (lang === 'es' ? profile.addressEs : profile.addressEn) : listing?.address,
    designStyle,
    userPrompt,
    imageBrief: imageBriefForVariant(intent.variant),
    sectorId: sectorMeta?.id,
    sectorLabel: sectorMeta?.label,
    sectorPlaybook: sectorMeta?.playbook,
  };
}

function parseAiJson(content: string): { html?: string } | null {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : trimmed;
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as { html?: string };
  } catch {
    return null;
  }
}

function extractImageUrls(html: string): string[] {
  return [...html.matchAll(/src="(https:\/\/[^"]+)"/g)].map((m) => m[1]);
}

function looksLikeWrongSector(html: string, brief: SiteBrief): boolean {
  if (brief.variant === 'renewable') {
    return /\bspa\b|masaje|sauna|wellness|hotel|piscina|balayage|sal[oó]n de belleza|trattoria|kebab|gourmet|chef|men[uú] degustaci|restaurante kebab/i.test(html);
  }
  if (brief.variant !== 'corporate' && brief.variant !== 'nonprofit' && brief.variant !== 'foodblog') return false;
  if (brief.variant === 'foodblog') {
    return /kebab|d[öo]ner|degustaci|men[uú] del d[ií]a|reservar mesa|restaurante kebab/i.test(html);
  }
  return /kebab|d[öo]ner|degustaci|gourmet|chef|carta de vinos|restaurante kebab|alta cocina|men[uú] degustaci|sabores aut[eé]nticos/i.test(html);
}

function sectionSystemPrompt(brief: SiteBrief, sectionType: string, imageUrls: string[]): string {
  const sectorLock =
    brief.variant === 'renewable'
      ? `\nSECTOR OBLIGATORIO: ${brief.businessType} (energías renovables, solar fotovoltaica, autoconsumo, baterías, cargadores EV). Mantén el nombre «${brief.businessName}». PROHIBIDO spa, masajes, hotel, piscina, belleza, restaurante, comida. Usa SOLO imágenes de placas solares, instalaciones técnicas y vehículos eléctricos de la lista.`
      : brief.variant === 'corporate'
      ? `\nSECTOR OBLIGATORIO: ${brief.businessType} (gestoría/asesoría fiscal, laboral y contable). PROHIBIDO cambiar a restaurante, kebab, gastronomía, menú degustación, vinos, chef o comida. Mantén el nombre «${brief.businessName}».`
      : brief.variant === 'foodblog'
        ? `\nSECTOR OBLIGATORIO: blog de recetas y comida casera (${brief.businessName}). Estilo beige + coral. PROHIBIDO convertir en restaurante con reservas, menú degustación o kebab. Mantén grid de publicaciones y newsletter.`
        : brief.variant === 'kebab'
        ? `\nSECTOR: restaurante kebab. No conviertas a asesoría ni despacho profesional.`
        : '';

  return `Eres el motor de diseño de CREAUNA — agencia web premium en Madrid. Reescribes UNA sección para calidad de entrega real (€1.500–3.000), como las hace un desarrollador senior a mano.

ESTILO: ${brief.designStyle}
Negocio: ${brief.businessName} · ${brief.businessType}
Idioma visible: ${brief.lang === 'es' ? 'español' : 'inglés'}
${brief.phone ? `Teléfono: ${brief.phone}` : ''}
${brief.address ? `Dirección: ${brief.address}` : ''}
${sectorLock}

IMÁGENES (usa SOLO estas URLs https — no inventes rutas locales):
${imageUrls.length ? imageUrls.join('\n') : brief.imageBrief}

${brief.sectorPlaybook ? `\n${brief.sectorPlaybook}\n` : ''}
REGLAS ESTRICTAS:
- Solo clases Tailwind CSS (sin <style>, sin <script>, sin badges "HERO MEJORADO" ni "Servicio 1/2/3")
- No uses onclick, onsubmit ni iframes (excepto mapas Google si es sección ubicación)
- font-serif en títulos, padding generoso, rounded-[2rem], bordes sutiles
- Cada <img> debe tener src="https://..." real, loading="lazy", referrerpolicy="no-referrer"
- Contenido REAL del negocio, no lorem ipsum
- Un único div contenedor raíz con clases de sección

Devuelve SOLO JSON válido: {"html":"..."}`;
}

async function enhanceSection(
  section: TemplatePageSection,
  brief: SiteBrief
): Promise<{ section: TemplatePageSection; motor?: string; provider?: AiProvider | 'rules'; changed: boolean }> {
  const motor = SECTION_MOTOR[section.type] ?? 'code';
  const imageUrls = extractImageUrls(section.html);

  const result = await chatCompletion(
    [
      { role: 'system', content: sectionSystemPrompt(brief, section.type, imageUrls) },
      {
        role: 'user',
        content: `Tipo: ${section.type}\nHTML actual:\n${section.html.slice(0, 7000)}\n\nPetición del cliente:\n${brief.userPrompt.slice(0, 1500)}`,
      },
    ],
    { maxTokens: section.type === 'hero' ? 6000 : 3200, motor, prompt: brief.userPrompt }
  );

  if (result.content && result.provider !== 'rules') {
    const parsed = parseAiJson(result.content);
    if (parsed?.html && parsed.html.length > 80 && parsed.html.includes('<')) {
      if (looksLikeWrongSector(parsed.html, brief)) {
        return { section, changed: false };
      }
      const validation = validateSectionHtml(parsed.html, undefined, section.type);
      if (!validation.ok) {
        return { section, changed: false };
      }
      const motorUsed = providerToMotor(result.provider);
      return {
        section: { ...section, html: parsed.html },
        motor: motorUsed,
        provider: result.provider,
        changed: parsed.html !== section.html,
      };
    }
  }

  return { section, changed: false };
}

export async function enhanceSiteWithAgents(
  sections: TemplatePageSection[],
  brief: SiteBrief
): Promise<{ sections: TemplatePageSection[]; motorsUsed: string[]; aiEnhanced: boolean; providersUsed: string[]; aiSkippedReason?: string }> {
  const configured = getConfiguredProviders();
  if (configured.length === 0) {
    return {
      sections,
      motorsUsed: [],
      aiEnhanced: false,
      providersUsed: [],
      aiSkippedReason: 'no_api_keys',
    };
  }

  const targets = sections.filter((s) => ENHANCE_TYPES.has(s.type));
  if (targets.length === 0) {
    return { sections, motorsUsed: [], aiEnhanced: false, providersUsed: [], aiSkippedReason: 'no_targets' };
  }

  const motorsUsed = new Set<string>();
  const providersUsed = new Set<string>();
  const byId = new Map(sections.map((s) => [s.id, { ...s }]));
  let anyChanged = false;
  let anyCalled = false;

  const BATCH = 2;
  for (let i = 0; i < targets.length; i += BATCH) {
    const batch = targets.slice(i, i + BATCH);
    const results = await Promise.all(batch.map((s) => enhanceSection(s, brief)));
    for (const r of results) {
      byId.set(r.section.id, r.section);
      if (r.motor) motorsUsed.add(r.motor);
      if (r.provider && r.provider !== 'rules') {
        providersUsed.add(r.provider);
        anyCalled = true;
      }
      if (r.changed) anyChanged = true;
    }
  }

  return {
    sections: sections.map((s) => byId.get(s.id) ?? s),
    motorsUsed: [...motorsUsed],
    providersUsed: [...providersUsed],
    aiEnhanced: anyChanged || anyCalled,
    aiSkippedReason: anyCalled ? undefined : 'ai_parse_failed',
  };
}

/** Mejora solo las secciones indicadas — cada una con su motor especializado. */
export async function enhanceSelectedSections(
  sections: TemplatePageSection[],
  brief: SiteBrief,
  targetTypes: Set<string>
): Promise<{ sections: TemplatePageSection[]; motorsUsed: string[]; aiEnhanced: boolean; providersUsed: string[]; aiSkippedReason?: string }> {
  const configured = getConfiguredProviders();
  if (configured.length === 0) {
    return { sections, motorsUsed: [], aiEnhanced: false, providersUsed: [], aiSkippedReason: 'no_api_keys' };
  }

  const targets = sections.filter((s) => targetTypes.has(s.type) && ENHANCE_TYPES.has(s.type));
  if (targets.length === 0) {
    return { sections, motorsUsed: [], aiEnhanced: false, providersUsed: [], aiSkippedReason: 'no_targets' };
  }

  const motorsUsed = new Set<string>();
  const providersUsed = new Set<string>();
  const byId = new Map(sections.map((s) => [s.id, { ...s }]));
  let anyChanged = false;
  let anyCalled = false;

  const BATCH = 2;
  for (let i = 0; i < targets.length; i += BATCH) {
    const batch = targets.slice(i, i + BATCH);
    const results = await Promise.all(batch.map((s) => enhanceSection(s, brief)));
    for (const r of results) {
      byId.set(r.section.id, r.section);
      if (r.motor) motorsUsed.add(r.motor);
      if (r.provider && r.provider !== 'rules') {
        providersUsed.add(r.provider);
        anyCalled = true;
      }
      if (r.changed) anyChanged = true;
    }
  }

  return {
    sections: sections.map((s) => byId.get(s.id) ?? s),
    motorsUsed: [...motorsUsed],
    providersUsed: [...providersUsed],
    aiEnhanced: anyChanged || anyCalled,
    aiSkippedReason: anyCalled ? undefined : 'ai_parse_failed',
  };
}
