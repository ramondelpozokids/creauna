/**
 * Biblioteca de sectores CREAUNA — mapeo negocio → plantilla Studio.
 * Los 15 sectores prioritarios cubren la mayoría de demanda de webs corporativas en España.
 */

export type SectorTier = 'priority' | 'standard' | 'extended';

export interface SectorEntry {
  id: string;
  labelEs: string;
  labelEn: string;
  groupEs: string;
  groupEn: string;
  templateSlug: string;
  tier: SectorTier;
  /** Patrones para detectar el sector en un prompt de cliente */
  keywords: RegExp;
  promptHintEs?: string;
}

export const SECTOR_GROUPS: { id: string; labelEs: string; labelEn: string }[] = [
  { id: 'home', labelEs: 'Hogar y Construcción', labelEn: 'Home & Construction' },
  { id: 'auto', labelEs: 'Automoción', labelEn: 'Automotive' },
  { id: 'health', labelEs: 'Salud y Bienestar', labelEn: 'Health & Wellness' },
  { id: 'food', labelEs: 'Restauración y Alimentación', labelEn: 'Food & Beverage' },
  { id: 'tourism', labelEs: 'Turismo y Ocio', labelEn: 'Tourism & Leisure' },
  { id: 'energy', labelEs: 'Energía y Medio Ambiente', labelEn: 'Energy & Environment' },
  { id: 'realestate', labelEs: 'Inmobiliario', labelEn: 'Real Estate' },
  { id: 'education', labelEs: 'Educación', labelEn: 'Education' },
  { id: 'tech', labelEs: 'Tecnología', labelEn: 'Technology' },
  { id: 'industry', labelEs: 'Industria', labelEn: 'Industry' },
  { id: 'legal', labelEs: 'Legal y Financiero', labelEn: 'Legal & Financial' },
  { id: 'beauty', labelEs: 'Belleza', labelEn: 'Beauty' },
  { id: 'sport', labelEs: 'Deporte', labelEn: 'Sports' },
  { id: 'events', labelEs: 'Eventos', labelEn: 'Events' },
  { id: 'ecommerce', labelEs: 'Ecommerce', labelEn: 'E-commerce' },
  { id: 'b2b', labelEs: 'B2B', labelEn: 'B2B' },
];

/** Catálogo completo de sectores habituales */
export const SECTOR_CATALOG: SectorEntry[] = [
  // ── PRIORIDAD 15 (demanda real) ──
  { id: 'reformas', labelEs: 'Reformas', labelEn: 'Renovations', groupEs: 'Hogar y Construcción', groupEn: 'Home & Construction', templateSlug: 'flow', tier: 'priority', keywords: /reforma[s]?|rehabilitaci|rehabilitacion|integral/i, promptHintEs: 'Empresa de reformas integrales con galería de obras y presupuesto' },
  { id: 'inmobiliaria', labelEs: 'Inmobiliarias', labelEn: 'Real Estate', groupEs: 'Inmobiliario', groupEn: 'Real Estate', templateSlug: 'habitat', tier: 'priority', keywords: /inmobiliaria|real estate|compraventa.*vivienda|promotora|alquiler vacacional/i, promptHintEs: 'Inmobiliaria con listado de propiedades, contacto y mapa' },
  { id: 'dental', labelEs: 'Clínicas dentales', labelEn: 'Dental Clinics', groupEs: 'Salud y Bienestar', groupEn: 'Health & Wellness', templateSlug: 'care', tier: 'priority', keywords: /cl[ií]nica dental|odontolog|ortodon|dental|implante/i, promptHintEs: 'Clínica dental con servicios, equipo y reserva de cita' },
  { id: 'restaurante', labelEs: 'Restaurantes', labelEn: 'Restaurants', groupEs: 'Restauración', groupEn: 'Food & Beverage', templateSlug: 'vesper', tier: 'priority', keywords: /restaurante|gourmet|men[uú]|carta|cocina/i, promptHintEs: 'Restaurante con carta, reservas y galería' },
  { id: 'taller', labelEs: 'Talleres mecánicos', labelEn: 'Auto Repair', groupEs: 'Automoción', groupEn: 'Automotive', templateSlug: 'pistons', tier: 'priority', keywords: /taller mec|mec[aá]nic|chapa|auto repair|automotriz/i, promptHintEs: 'Taller mecánico con servicios, citas y contacto' },
  { id: 'abogados', labelEs: 'Abogados', labelEn: 'Law Firms', groupEs: 'Legal y Financiero', groupEn: 'Legal & Financial', templateSlug: 'lex', tier: 'priority', keywords: /abogad|bufete|despacho de abog|law firm|jur[ií]dic/i, promptHintEs: 'Despacho de abogados con áreas de práctica y contacto' },
  { id: 'asesoria', labelEs: 'Asesorías', labelEn: 'Tax Advisory', groupEs: 'Legal y Financiero', groupEn: 'Legal & Financial', templateSlug: 'ledger', tier: 'priority', keywords: /gestor[ií]a|asesor[ií]a|fiscal|contabil|laboral/i, promptHintEs: 'Asesoría con servicios, formulario y footer legal' },
  { id: 'solar', labelEs: 'Energía solar', labelEn: 'Solar Energy', groupEs: 'Energía y Medio Ambiente', groupEn: 'Energy & Environment', templateSlug: 'volt', tier: 'priority', keywords: /energ[ií]a solar|fotovolta|placas solares|autoconsumo|renovables|aerotermia|wallbox|cargador.*el[eé]ctric/i, promptHintEs: 'Empresa solar con servicios, proyectos, FAQ y estudio gratuito' },
  { id: 'arquitectura', labelEs: 'Arquitectura', labelEn: 'Architecture', groupEs: 'Hogar y Construcción', groupEn: 'Home & Construction', templateSlug: 'blueprint', tier: 'priority', keywords: /arquitect|interiorismo|estudio de diseño|obra nueva|proyecto arquitect/i, promptHintEs: 'Estudio de arquitectura con portfolio, servicios y contacto' },
  { id: 'fisioterapia', labelEs: 'Fisioterapia', labelEn: 'Physiotherapy', groupEs: 'Salud y Bienestar', groupEn: 'Health & Wellness', templateSlug: 'care', tier: 'priority', keywords: /fisioter|fisio|rehabilitaci[oó]n f[ií]sic/i, promptHintEs: 'Clínica de fisioterapia con tratamientos y reserva' },
  { id: 'gimnasio', labelEs: 'Gimnasios', labelEn: 'Gyms', groupEs: 'Deporte', groupEn: 'Sports', templateSlug: 'forge', tier: 'priority', keywords: /gimnasio|gym|fitness|crossfit|entrenamiento personal/i, promptHintEs: 'Gimnasio con planes, horarios y matrícula' },
  { id: 'turismo-rural', labelEs: 'Hoteles y turismo rural', labelEn: 'Hotels & Rural Tourism', groupEs: 'Turismo y Ocio', groupEn: 'Tourism & Leisure', templateSlug: 'haven', tier: 'priority', keywords: /casa rural|turismo rural|hotel|hostal|apartamento tur[ií]stic|alojamiento/i, promptHintEs: 'Casa rural u hotel con habitaciones, entorno y reservas' },
  { id: 'peluqueria', labelEs: 'Peluquerías y estética', labelEn: 'Hair & Beauty', groupEs: 'Belleza', groupEn: 'Beauty', templateSlug: 'lumen', tier: 'priority', keywords: /peluquer[ií]a|sal[oó]n de belleza|est[eé]tica|uñas|manicur|cosm[eé]tica/i, promptHintEs: 'Salón de belleza con servicios, galería y reserva online' },
  { id: 'electricista', labelEs: 'Electricistas y fontaneros', labelEn: 'Electricians & Plumbers', groupEs: 'Hogar y Construcción', groupEn: 'Home & Construction', templateSlug: 'flow', tier: 'priority', keywords: /electricista|fontaner|fontaner[ií]a|instalador el[eé]ctric|urgencias 24/i, promptHintEs: 'Electricista o fontanero con servicios, zona de actuación y contacto' },
  { id: 'saas', labelEs: 'Empresas tecnológicas / SaaS', labelEn: 'Tech / SaaS', groupEs: 'Tecnología', groupEn: 'Technology', templateSlug: 'arc', tier: 'priority', keywords: /saas|software|startup|app|plataforma|desarrollo web|cibersegur|inteligencia artificial/i, promptHintEs: 'Startup SaaS con producto, pricing y demo' },

  // ── EXTENDIDO (catálogo habitual) ──
  { id: 'construccion', labelEs: 'Construcción', labelEn: 'Construction', groupEs: 'Hogar y Construcción', groupEn: 'Home & Construction', templateSlug: 'summit', tier: 'extended', keywords: /construcci[oó]n|obra civil|promotor/i },
  { id: 'carpinteria', labelEs: 'Carpintería', labelEn: 'Carpentry', groupEs: 'Hogar y Construcción', groupEn: 'Home & Construction', templateSlug: 'flow', tier: 'extended', keywords: /carpinter/i },
  { id: 'pintores', labelEs: 'Pintores', labelEn: 'Painters', groupEs: 'Hogar y Construcción', groupEn: 'Home & Construction', templateSlug: 'flow', tier: 'extended', keywords: /pintor|pintura/i },
  { id: 'jardineria', labelEs: 'Jardinería', labelEn: 'Landscaping', groupEs: 'Hogar y Construcción', groupEn: 'Home & Construction', templateSlug: 'verde', tier: 'extended', keywords: /jardiner[ií]a|paisaj|vivero/i },
  { id: 'piscinas', labelEs: 'Piscinas', labelEn: 'Pools', groupEs: 'Hogar y Construcción', groupEn: 'Home & Construction', templateSlug: 'flow', tier: 'extended', keywords: /piscina/i },
  { id: 'domotica', labelEs: 'Domótica', labelEn: 'Smart Home', groupEs: 'Hogar y Construcción', groupEn: 'Home & Construction', templateSlug: 'volt', tier: 'extended', keywords: /dom[oó]tica|smart home|hogar inteligente/i },
  { id: 'concesionario', labelEs: 'Concesionarios', labelEn: 'Car Dealers', groupEs: 'Automoción', groupEn: 'Automotive', templateSlug: 'pistons', tier: 'extended', keywords: /concesionario|compraventa.*coches|renting/i },
  { id: 'psicologia', labelEs: 'Psicología', labelEn: 'Psychology', groupEs: 'Salud y Bienestar', groupEn: 'Health & Wellness', templateSlug: 'care', tier: 'extended', keywords: /psicolog|terapia/i },
  { id: 'veterinario', labelEs: 'Veterinarios', labelEn: 'Vets', groupEs: 'Salud y Bienestar', groupEn: 'Health & Wellness', templateSlug: 'paw', tier: 'extended', keywords: /veterin|cl[ií]nica veterin/i },
  { id: 'cafeteria', labelEs: 'Cafeterías', labelEn: 'Cafés', groupEs: 'Restauración', groupEn: 'Food & Beverage', templateSlug: 'mokka', tier: 'extended', keywords: /cafeter[ií]a|caf[eé]|coffee shop/i },
  { id: 'pizzeria', labelEs: 'Pizzerías', labelEn: 'Pizzerias', groupEs: 'Restauración', groupEn: 'Food & Beverage', templateSlug: 'trattoria', tier: 'extended', keywords: /pizzer[ií]a|pizza/i },
  { id: 'barberia', labelEs: 'Barberías', labelEn: 'Barbershops', groupEs: 'Belleza', groupEn: 'Beauty', templateSlug: 'classic-cut', tier: 'extended', keywords: /barber[ií]a|barbershop|barber\b/i },
  { id: 'bodas', labelEs: 'Bodas y eventos', labelEn: 'Weddings & Events', groupEs: 'Eventos', groupEn: 'Events', templateSlug: 'vows', tier: 'extended', keywords: /boda|wedding|organizaci[oó]n de eventos|dj\b|fotograf[ií]a de boda/i },
  { id: 'academia', labelEs: 'Academias', labelEn: 'Academies', groupEs: 'Educación', groupEn: 'Education', templateSlug: 'learn', tier: 'extended', keywords: /academia|formaci[oó]n|autoescuela|curso/i },
  { id: 'seguros', labelEs: 'Seguros', labelEn: 'Insurance', groupEs: 'Legal y Financiero', groupEn: 'Legal & Financial', templateSlug: 'shield', tier: 'extended', keywords: /seguro|corredur[ií]a|insurance/i },
  { id: 'marketing', labelEs: 'Agencias marketing', labelEn: 'Marketing Agencies', groupEs: 'B2B', groupEn: 'B2B', templateSlug: 'vanguard', tier: 'extended', keywords: /agencia.*marketing|publicidad|social media/i },
  { id: 'consultora', labelEs: 'Consultoras B2B', labelEn: 'B2B Consulting', groupEs: 'B2B', groupEn: 'B2B', templateSlug: 'nexus', tier: 'extended', keywords: /consultor[ií]a b2b|consultora|outsourcing|recursos humanos/i },
];

export const PRIORITY_SECTORS = SECTOR_CATALOG.filter((s) => s.tier === 'priority');

export function getSectorById(id: string): SectorEntry | undefined {
  return SECTOR_CATALOG.find((s) => s.id === id);
}

export type SectorPublic = {
  id: string;
  label: string;
  group: string;
  templateSlug: string;
  tier: SectorTier;
  promptHint?: string;
};

export function toPublicSector(sector: SectorEntry, lang: 'es' | 'en'): SectorPublic {
  return {
    id: sector.id,
    label: lang === 'es' ? sector.labelEs : sector.labelEn,
    group: lang === 'es' ? sector.groupEs : sector.groupEn,
    templateSlug: sector.templateSlug,
    tier: sector.tier,
    promptHint: lang === 'es' ? sector.promptHintEs : sector.promptHintEn,
  };
}

export function listPublicSectors(lang: 'es' | 'en', tier?: SectorTier | 'all'): SectorPublic[] {
  const pool =
    tier === 'priority' ? PRIORITY_SECTORS : tier === 'extended' ? SECTOR_CATALOG.filter((s) => s.tier === 'extended') : SECTOR_CATALOG;
  return pool.map((s) => toPublicSector(s, lang));
}

/** Mejor sector detectado en un prompt de cliente (para Studio / tests) */
export function matchSectorFromPrompt(prompt: string): SectorEntry | null {
  const normalized = prompt.toLowerCase();
  let best: SectorEntry | null = null;
  let bestScore = 0;

  for (const sector of SECTOR_CATALOG) {
    const matches = normalized.match(new RegExp(sector.keywords.source, 'gi'));
    const score = (matches?.length ?? 0) * 10 + (sector.tier === 'priority' ? 5 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = sector;
    }
  }

  return bestScore > 0 ? best : null;
}

export function getSectorByTemplateSlug(slug: string): SectorEntry[] {
  return SECTOR_CATALOG.filter((s) => s.templateSlug === slug);
}

export function priorityPromptExamples(lang: 'es' | 'en'): string[] {
  return PRIORITY_SECTORS.map((s) =>
    lang === 'es' ? (s.promptHintEs ?? `Web para ${s.labelEs}`) : `Website for ${s.labelEn}`
  );
}
