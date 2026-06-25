import type { SectorEntry } from '../../data/sectorLibrary';
import { getSectorById, matchSectorFromPrompt, SECTOR_CATALOG } from '../../data/sectorLibrary';

/** Secciones que los agentes deben respetar por plantilla base */
const TEMPLATE_SECTIONS: Record<string, { es: string; en: string }> = {
  volt: {
    es: 'Hero impactante (energía/solar), bloque stats confianza, grid servicios (solar, baterías, EV, eficiencia, mantenimiento), por qué elegirnos, proceso 5 pasos, galería proyectos reales, testimonios, FAQ, CTA estudio gratuito, footer corporativo.',
    en: 'Impactful hero (energy/solar), trust stats, services grid, why us, 5-step process, project gallery, testimonials, FAQ, free assessment CTA, corporate footer.',
  },
  ledger: {
    es: 'Navbar, sidebar opcional, servicios (fiscal/laboral/contable), sobre nosotros, reseñas, galería despacho, contacto con formulario, mapa, footer legal, WhatsApp.',
    en: 'Navbar, optional sidebar, services, about, reviews, office gallery, contact form, map, legal footer, WhatsApp.',
  },
  lex: {
    es: 'Hero corporativo, áreas de práctica/servicios, equipo o sobre nosotros, testimonios, contacto, footer legal.',
    en: 'Corporate hero, practice areas, team/about, testimonials, contact, legal footer.',
  },
  flow: {
    es: 'Hero con CTA presupuesto, servicios (reformas/fontanería/electricidad), galería de obras, zona de actuación, contacto urgencias, reseñas.',
    en: 'Hero with quote CTA, services, project gallery, service area, emergency contact, reviews.',
  },
  habitat: {
    es: 'Hero, listado propiedades destacadas, servicios inmobiliarios, sobre agencia, contacto, mapa.',
    en: 'Hero, featured properties, agency services, about, contact, map.',
  },
  care: {
    es: 'Hero clínica, servicios/tratamientos, equipo, reserva de cita, testimonios, contacto y horarios.',
    en: 'Clinic hero, treatments, team, appointment booking, testimonials, contact and hours.',
  },
  vesper: {
    es: 'Hero restaurante, carta/menú, galería, reservas, reseñas, ubicación, contacto.',
    en: 'Restaurant hero, menu, gallery, reservations, reviews, location, contact.',
  },
  blueprint: {
    es: 'Hero portfolio arquitectura, proyectos destacados, servicios (residencial/comercial/interiorismo), sobre estudio, contacto.',
    en: 'Architecture portfolio hero, featured projects, services, about studio, contact.',
  },
  forge: {
    es: 'Hero gimnasio, planes/tarifas, instalaciones, horarios, matrícula online, testimonios.',
    en: 'Gym hero, plans, facilities, schedule, online signup, testimonials.',
  },
  haven: {
    es: 'Hero alojamiento, habitaciones, entorno/experiencias, reservas, galería, contacto.',
    en: 'Lodging hero, rooms, experiences, booking, gallery, contact.',
  },
  lumen: {
    es: 'Hero salón, servicios con precios, galería trabajos, reserva online, testimonios.',
    en: 'Salon hero, priced services, work gallery, online booking, testimonials.',
  },
  pistons: {
    es: 'Hero taller, servicios mecánicos, citas online, galería, contacto, reseñas.',
    en: 'Workshop hero, mechanical services, online appointments, gallery, contact, reviews.',
  },
  arc: {
    es: 'Hero SaaS, producto/features, pricing, demo/CTA, testimonios, footer tech.',
    en: 'SaaS hero, product/features, pricing, demo CTA, testimonials, tech footer.',
  },
};

const TEMPLATE_FORBIDDEN: Record<string, { es: string; en: string }> = {
  volt: { es: 'spa, masajes, hotel lujo, restaurante, comida', en: 'spa, massages, luxury hotel, restaurant, food' },
  ledger: { es: 'restaurante, kebab, menú degustación, spa', en: 'restaurant, kebab, tasting menu, spa' },
  care: { es: 'restaurante, taller mecánico, inmobiliaria genérica', en: 'restaurant, auto shop, generic real estate' },
  vesper: { es: 'gestoría, despacho abogados, placas solares', en: 'tax advisory, law firm, solar panels' },
};

export function resolveStudioSector(prompt: string, sectorId?: string | null): SectorEntry | null {
  if (sectorId) {
    const picked = getSectorById(sectorId);
    if (picked) return picked;
  }
  return matchSectorFromPrompt(prompt);
}

export function buildSectorAgentPlaybook(sector: SectorEntry, lang: 'es' | 'en'): string {
  const label = lang === 'es' ? sector.labelEs : sector.labelEn;
  const group = lang === 'es' ? sector.groupEs : sector.groupEn;
  const hint = lang === 'es' ? sector.promptHintEs : sector.promptHintEn;
  const sections =
    TEMPLATE_SECTIONS[sector.templateSlug]?.[lang] ??
    (lang === 'es'
      ? 'Hero, servicios, sobre nosotros, galería, contacto, footer legal.'
      : 'Hero, services, about, gallery, contact, legal footer.');
  const forbidden =
    TEMPLATE_FORBIDDEN[sector.templateSlug]?.[lang] ??
    (lang === 'es' ? 'mezclar otro sector (ej. spa en solar, comida en gestoría)' : 'mixing wrong sector (e.g. spa on solar site)');

  return lang === 'es'
    ? `[BIBLIOTECA CREAUNA · ${sector.id}]
Sector: ${label} (${group})
Plantilla base: ${sector.templateSlug}
Prioridad mercado: ${sector.tier === 'priority' ? 'alta' : 'estándar'}

MISIÓN AGENTES: Crear web corporativa premium SOLO para ${label}. Contenido real del negocio, nunca placeholders genéricos.

ESTRUCTURA OBLIGATORIA: ${sections}

TONO: Profesional, confianza, conversión. Espacio en blanco, tipografía clara, imágenes del sector.

PROHIBIDO: ${forbidden}. No copiar webs de referencia pixel a pixel.

PROMPT CLIENTE (referencia): ${hint ?? `Web para ${label}`}`
    : `[CREAUNA LIBRARY · ${sector.id}]
Sector: ${label} (${group})
Base template: ${sector.templateSlug}
Market priority: ${sector.tier === 'priority' ? 'high' : 'standard'}

AGENT MISSION: Build a premium corporate site ONLY for ${label}. Real business content, never generic placeholders.

REQUIRED STRUCTURE: ${sections}

TONE: Professional, trust, conversion. White space, clear typography, sector-appropriate images.

FORBIDDEN: ${forbidden}. Do not copy reference sites pixel-perfect.

CLIENT PROMPT (reference): ${hint ?? `Website for ${label}`}`;
}

export function listSectorIds(): string[] {
  return SECTOR_CATALOG.map((s) => s.id);
}
