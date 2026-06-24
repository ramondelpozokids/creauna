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
}

const VARIANT_DESIGN: Partial<Record<BusinessVariant, string>> = {
  cafe: 'Restaurante premium (Rest Art Café / Mesón La Colonia): header blanco, terracota/dorado, Playfair serif, rating Google, menú del día, barra info 3 columnas, WhatsApp.',
  beauty: 'Salón luxury (Elite Beauty / Estilo de Belleza): cream #FDF8F3, rose gold, tarjetas servicio con foto, reserva split oscuro/blanco.',
  corporate: 'Asesoría (Campón Asesores): azul corporativo #004080, barra superior, grid servicios con bullets, reseñas, formulario contacto.',
  automotive: 'Concesionario (Motos Cortés/Yamaha): fondo #0a0a0a, acento rojo #e60012, tipografía uppercase bold, stats, taller/venta/recambios.',
  tattoo: 'Estudio tatuajes (Royal Bang): negro/rojo, galería portfolio, reservar cita.',
  kebab: 'Kebab premium urbano: fotos apetitosas, carta real, ambiente Vallecas.',
  luxury: 'Fine dining (La Maison Dorée): negro #1a1a1a + oro #c8a97e, script decorativo, cinematográfico, alta cocina.',
  nonprofit: 'ONG/accesibilidad (InfoSordos): azul #0a3bf6, misión clara, inclusivo, recursos LSE, subtítulos.',
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

const ENHANCE_TYPES = new Set(['hero', 'menu', 'services', 'carta', 'about', 'reviews', 'gallery']);

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
  userPrompt: string
): SiteBrief {
  const designStyle = VARIANT_DESIGN[intent.variant] ?? VARIANT_DESIGN.default!;
  return {
    businessName: listing?.businessName ?? intent.businessName,
    businessType: intent.businessType,
    variant: intent.variant,
    lang,
    tagline: profile ? (lang === 'es' ? profile.taglineEs : profile.taglineEn) : undefined,
    phone: profile?.phone ?? listing?.phone,
    address: profile ? (lang === 'es' ? profile.addressEs : profile.addressEn) : listing?.address,
    designStyle,
    userPrompt,
    imageBrief: imageBriefForVariant(intent.variant),
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

function sectionSystemPrompt(brief: SiteBrief, sectionType: string, imageUrls: string[]): string {
  return `Eres el motor de diseño de CREAUNA — agencia web premium en Madrid. Reescribes UNA sección para calidad de entrega real (€1.500–3.000), como las hace un desarrollador senior a mano.

ESTILO: ${brief.designStyle}
Negocio: ${brief.businessName} · ${brief.businessType}
Idioma visible: ${brief.lang === 'es' ? 'español' : 'inglés'}
${brief.phone ? `Teléfono: ${brief.phone}` : ''}
${brief.address ? `Dirección: ${brief.address}` : ''}

IMÁGENES (usa SOLO estas URLs https — no inventes rutas locales):
${imageUrls.length ? imageUrls.join('\n') : brief.imageBrief}

REGLAS ESTRICTAS:
- Solo clases Tailwind CSS (sin <style>, sin <script>, sin badges "HERO MEJORADO" ni "Servicio 1/2/3")
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

  const motorsToTry: MotorId[] = [motor, 'code', 'visual', 'copy'];
  const seen = new Set<MotorId>();

  for (const tryMotor of motorsToTry) {
    if (seen.has(tryMotor)) continue;
    seen.add(tryMotor);

    const result = await chatCompletion(
      [
        { role: 'system', content: sectionSystemPrompt(brief, section.type, imageUrls) },
        {
          role: 'user',
          content: `Tipo: ${section.type}\nHTML actual:\n${section.html.slice(0, 7000)}\n\nPetición del cliente:\n${brief.userPrompt.slice(0, 1500)}`,
        },
      ],
      { maxTokens: section.type === 'hero' ? 6000 : 3200, motor: tryMotor, prompt: brief.userPrompt }
    );

    if (!result.content || result.provider === 'rules') continue;

    const parsed = parseAiJson(result.content);
    if (parsed?.html && parsed.html.length > 80 && parsed.html.includes('<')) {
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

  const batches: TemplatePageSection[][] = [
    targets.filter((s) => ['hero', 'gallery'].includes(s.type)),
    targets.filter((s) => ['about', 'reviews'].includes(s.type)),
    targets.filter((s) => ['menu', 'services', 'carta'].includes(s.type)),
  ].filter((b) => b.length > 0);

  for (const batch of batches) {
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
