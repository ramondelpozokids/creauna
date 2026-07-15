export type PremiumStarterSector = 'gastronomy' | 'services' | 'retail' | 'corporate';

/** Filtro del catálogo público /templates */
export type PremiumCatalogCategory =
  | 'gastronomy'
  | 'health'
  | 'realestate'
  | 'hospitality'
  | 'sport'
  | 'luxury'
  | 'architecture';

export const premiumCatalogCategories: {
  key: 'all' | PremiumCatalogCategory;
  labelEs: string;
  labelEn: string;
}[] = [
  { key: 'all', labelEs: 'Todos', labelEn: 'All' },
  { key: 'gastronomy', labelEs: 'Gastronomía', labelEn: 'Dining' },
  { key: 'health', labelEs: 'Salud', labelEn: 'Health' },
  { key: 'realestate', labelEs: 'Inmobiliaria', labelEn: 'Real estate' },
  { key: 'hospitality', labelEs: 'Hotel', labelEn: 'Hotel' },
  { key: 'sport', labelEs: 'Deporte', labelEn: 'Sport' },
  { key: 'luxury', labelEs: 'Joyería & lujo', labelEn: 'Jewelry & luxury' },
  { key: 'architecture', labelEs: 'Arquitectura', labelEn: 'Architecture' },
];

/** Campos que el cliente suele cambiar sobre una muestra premium. */
export interface PremiumStarterPersonalization {
  businessName: string;
  subtitle?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  citySeo?: string;
  heroImage?: string;
}

export interface PremiumStarterItem {
  slug: string;
  sector: PremiumStarterSector;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  /** Ruta pública al HTML base (muestra terminada). */
  demoPath: string;
  previewImage: string;
  /** Valores de la muestra original — se reemplazan al personalizar. */
  defaults: Required<PremiumStarterPersonalization> & {
    phoneE164: string;
    metaDescription: string;
    navLogoHtml: string;
  };
  /** Plantilla catálogo más cercana (metadatos / sector). */
  catalogTemplateSlug: string;
  sectorId: string;
  catalogCategoryKey: PremiumCatalogCategory;
  categoryLabelEs: string;
  categoryLabelEn: string;
  customizableFields: (keyof PremiumStarterPersonalization)[];
}

export const premiumStarters: PremiumStarterItem[] = [
  {
    slug: 'meson-la-colonia',
    sector: 'gastronomy',
    nameEs: 'Mesón La Colonia',
    nameEn: 'Mesón La Colonia',
    descEs:
      'Restaurante español completo: carta QR, pedidos por WhatsApp desde mesa, reservas 24h, menú del día, reseñas Google, galería, fútbol y mapa.',
    descEn:
      'Full Spanish restaurant: QR menu, WhatsApp table ordering, 24h booking, daily specials, Google reviews, gallery, sports section and map.',
    demoPath: '/demos/starters/meson-la-colonia/index.html',
    previewImage:
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    catalogTemplateSlug: 'tapas',
    sectorId: 'restaurante',
    catalogCategoryKey: 'gastronomy',
    categoryLabelEs: 'Restauración',
    categoryLabelEn: 'Restaurant',
    customizableFields: [
      'businessName',
      'subtitle',
      'tagline',
      'phone',
      'email',
      'address',
      'citySeo',
      'heroImage',
    ],
    defaults: {
      businessName: 'Mesón La Colonia',
      subtitle: 'Tapas y Comida Española',
      tagline: '"Comida casera muy bien preparada en un ambiente acogedor"',
      phone: '624 69 19 30',
      phoneE164: '34624691930',
      email: 'lacolonia.meson@gmail.com',
      address: 'C. Puerto de Canencia, 7, Puente de Vallecas, 28038 Madrid',
      citySeo: 'Madrid - Comida Española en Vallecas',
      heroImage:
        'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      metaDescription:
        'Mesón La Colonia en Puente de Vallecas. Comida española casera, tapas, raciones, menú del día. Ven a ver el fútbol: Liga y Champions. Reserva: 624 69 19 30',
      navLogoHtml: 'Mesón <span>La Colonia</span>',
    },
  },
  {
    slug: 'lumina-dental',
    sector: 'services',
    nameEs: 'Lumina Dental',
    nameEn: 'Lumina Dental',
    descEs:
      'Clínica dental premium: especialidades, equipo médico, tecnología 3D, urgencias 24h, formulario de cita y legal completo.',
    descEn:
      'Premium dental clinic: specialties, medical team, 3D technology, 24h emergencies, appointment form and full legal pages.',
    demoPath: '/demos/starters/lumina-dental/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=900&h=600&auto=format&fit=crop',
    catalogTemplateSlug: 'care',
    sectorId: 'dental',
    catalogCategoryKey: 'health',
    categoryLabelEs: 'Clínica dental',
    categoryLabelEn: 'Dental clinic',
    customizableFields: [
      'businessName',
      'subtitle',
      'phone',
      'email',
      'address',
      'citySeo',
      'heroImage',
    ],
    defaults: {
      businessName: 'Lumina Dental Institute',
      subtitle: 'Excelencia en Odontología desde 2005',
      tagline: '',
      phone: '910 000 000',
      phoneE164: '34910000000',
      email: 'concierge@luminadental.com',
      address: 'Paseo de la Castellana, 100, 28046 Madrid, España',
      citySeo: 'Madrid - Odontología de Vanguardia',
      heroImage:
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2668&auto=format&fit=crop',
      metaDescription:
        'Odontología de precisión y estética de vanguardia. Diagnóstico digital 3D, implantes, urgencias 24h y equipo de élite en Madrid.',
      navLogoHtml: 'LUMINA <span>DENTAL</span>',
    },
  },
  {
    slug: 'aura-estates',
    sector: 'services',
    nameEs: 'Aura Estates',
    nameEn: 'Aura Estates',
    descEs:
      'Inmobiliaria de lujo: propiedades exclusivas, valoración gratuita, calculadora hipotecaria, comparador y contacto WhatsApp.',
    descEn:
      'Luxury real estate: exclusive properties, free valuation, mortgage calculator, comparator and WhatsApp contact.',
    demoPath: '/demos/starters/aura-estates/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=900&h=600&auto=format&fit=crop',
    catalogTemplateSlug: 'habitat',
    sectorId: 'inmobiliaria',
    catalogCategoryKey: 'realestate',
    categoryLabelEs: 'Inmobiliaria',
    categoryLabelEn: 'Real estate',
    customizableFields: [
      'businessName',
      'subtitle',
      'phone',
      'email',
      'address',
      'citySeo',
      'heroImage',
    ],
    defaults: {
      businessName: 'Aura Estates',
      subtitle: 'Real Estate de Alto Standing',
      tagline: '',
      phone: '900 100 200',
      phoneE164: '34900100200',
      email: 'concierge@auraestates.com',
      address: 'Paseo de la Castellana, 250, 28046 Madrid, España',
      citySeo: 'Madrid - Inmobiliaria de Lujo',
      heroImage:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop',
      metaDescription:
        'Propiedades de lujo en España. Villas, áticos y fincas exclusivas. Valoración gratuita y asesoramiento patrimonial de alto standing.',
      navLogoHtml: 'AURA <span>ESTATES</span>',
    },
  },
  {
    slug: 'aura-sanctuary',
    sector: 'corporate',
    nameEs: 'Aura Sanctuary',
    nameEn: 'Aura Sanctuary',
    descEs:
      'Hotel 5 estrellas Gran Lujo: habitaciones, experiencias, widget de reservas, spa, gastronomía y conserjería WhatsApp.',
    descEn:
      '5-star luxury hotel: rooms, experiences, booking widget, spa, dining and WhatsApp concierge.',
    demoPath: '/demos/starters/aura-sanctuary/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=900&h=600&auto=format&fit=crop',
    catalogTemplateSlug: 'haven',
    sectorId: 'turismo-rural',
    catalogCategoryKey: 'hospitality',
    categoryLabelEs: 'Hotel 5 estrellas',
    categoryLabelEn: '5-star hotel',
    customizableFields: [
      'businessName',
      'subtitle',
      'phone',
      'email',
      'address',
      'citySeo',
      'heroImage',
    ],
    defaults: {
      businessName: 'Aura Sanctuary',
      subtitle: '5 Estrellas Gran Lujo',
      tagline: '',
      phone: '900 800 900',
      phoneE164: '34900800900',
      email: 'reservas@aurasanctuary.com',
      address: 'Paseo Marítimo de la Serena, 1, 29602 Marbella, España',
      citySeo: 'Marbella - Hotel 5 Estrellas Gran Lujo',
      heroImage:
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2670&auto=format&fit=crop',
      metaDescription:
        'Refugio de lujo 5 estrellas Gran Lujo. Suites exclusivas, gastronomía Michelin, spa de bienestar y experiencias únicas en Marbella.',
      navLogoHtml: 'AURA <span>SANCTUARY</span>',
    },
  },
  {
    slug: 'apex-athletics',
    sector: 'services',
    nameEs: 'Apex Athletics',
    nameEn: 'Apex Athletics',
    descEs:
      'Gimnasio premium: planes de membresía, instalaciones, entrenadores, prueba gratis y contacto por WhatsApp.',
    descEn:
      'Premium gym: membership plans, facilities, coaches, free trial and WhatsApp contact.',
    demoPath: '/demos/starters/apex-athletics/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&h=600&auto=format&fit=crop',
    catalogTemplateSlug: 'forge',
    sectorId: 'gimnasio',
    catalogCategoryKey: 'sport',
    categoryLabelEs: 'Gimnasio',
    categoryLabelEn: 'Gym',
    customizableFields: [
      'businessName',
      'subtitle',
      'phone',
      'email',
      'address',
      'citySeo',
      'heroImage',
    ],
    defaults: {
      businessName: 'Apex Athletics',
      subtitle: 'Redefine Tus Límites',
      tagline: '',
      phone: '900 555 100',
      phoneE164: '34900555100',
      email: 'hola@apexathletics.com',
      address: 'Avenida del Deporte, 100, 28020 Madrid, España',
      citySeo: 'Madrid - Gimnasio de Alto Rendimiento',
      heroImage:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop',
      metaDescription:
        'Club deportivo de alto rendimiento. Entrenamiento funcional, tecnología Technogym y planes personalizados en Madrid.',
      navLogoHtml: 'APEX<span>.</span>',
    },
  },
  {
    slug: 'aeterna-co',
    sector: 'retail',
    nameEs: 'Aeterna & Co.',
    nameEn: 'Aeterna & Co.',
    descEs:
      'Joyería y alta relojería de lujo: colecciones Rolex/Patek/Cartier, taller propio, cita privada y autenticidad garantizada.',
    descEn:
      'Luxury jewelry and haute horlogerie: Rolex/Patek/Cartier collections, in-house workshop, private appointments and guaranteed authenticity.',
    demoPath: '/demos/starters/aeterna-co/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=900&h=600&auto=format&fit=crop',
    catalogTemplateSlug: 'atelier',
    sectorId: 'joyeria',
    catalogCategoryKey: 'luxury',
    categoryLabelEs: 'Joyería & relojería',
    categoryLabelEn: 'Jewelry & watches',
    customizableFields: [
      'businessName',
      'subtitle',
      'phone',
      'email',
      'address',
      'citySeo',
      'heroImage',
    ],
    defaults: {
      businessName: 'Aeterna & Co.',
      subtitle: 'Desde 1924',
      tagline: '',
      phone: '900 123 456',
      phoneE164: '34900123456',
      email: 'concierge@aeternaco.com',
      address: 'Paseo de la Castellana, 45, 28046 Madrid, España',
      citySeo: 'Madrid - Alta Relojería y Joyería de Lujo',
      heroImage:
        'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2574&auto=format&fit=crop',
      metaDescription:
        'Alta relojería y joyería de autor. Rolex, Patek Philippe, Cartier. Taller propio, autenticidad garantizada y asesoramiento exclusivo en Madrid.',
      navLogoHtml: 'AETERNA & CO.',
    },
  },
  {
    slug: 'vitalis-fisio',
    sector: 'services',
    nameEs: 'Vitalis Fisioterapia',
    nameEn: 'Vitalis Physiotherapy',
    descEs:
      'Clínica de fisioterapia premium: tratamientos, equipo, tecnología Indiba, urgencias, reserva de cita y legal completo.',
    descEn:
      'Premium physiotherapy clinic: treatments, team, Indiba technology, emergencies, booking form and full legal pages.',
    demoPath: '/demos/starters/vitalis-fisio/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=900&h=600&auto=format&fit=crop',
    catalogTemplateSlug: 'care',
    sectorId: 'fisioterapia',
    catalogCategoryKey: 'health',
    categoryLabelEs: 'Fisioterapia',
    categoryLabelEn: 'Physiotherapy',
    customizableFields: [
      'businessName',
      'subtitle',
      'phone',
      'email',
      'address',
      'citySeo',
      'heroImage',
    ],
    defaults: {
      businessName: 'Vitalis Clínica de Fisioterapia',
      subtitle: 'Clínica de Fisioterapia y Rehabilitación',
      tagline: '',
      phone: '910 200 300',
      phoneE164: '34910200300',
      email: 'info@vitalisclinics.com',
      address: 'Calle de la Salud, 45, 28001 Madrid, España',
      citySeo: 'Madrid - Fisioterapia y Rehabilitación de Vanguardia',
      heroImage:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670&auto=format&fit=crop',
      metaDescription:
        'Clínica de fisioterapia premium. Rehabilitación deportiva, osteopatía, punción seca y tecnología Indiba. Diagnóstico ecográfico y recuperación personalizada.',
      navLogoHtml: 'VITALIS<span>.</span>',
    },
  },
  {
    slug: 'armonia-vital',
    sector: 'services',
    nameEs: 'Armonía Vital',
    nameEn: 'Armonía Vital',
    descEs:
      'Clínica de acupuntura y medicina tradicional china: tratamientos holísticos, especialidades, reserva de cita y contacto WhatsApp.',
    descEn:
      'Acupuncture and traditional Chinese medicine clinic: holistic treatments, specialties, booking form and WhatsApp contact.',
    demoPath: '/demos/starters/armonia-vital/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=900&h=600&auto=format&fit=crop',
    catalogTemplateSlug: 'care',
    sectorId: 'acupuntura',
    catalogCategoryKey: 'health',
    categoryLabelEs: 'Acupuntura / MTC',
    categoryLabelEn: 'Acupuncture / TCM',
    customizableFields: [
      'businessName',
      'subtitle',
      'phone',
      'email',
      'address',
      'citySeo',
      'heroImage',
    ],
    defaults: {
      businessName: 'Armonía Vital',
      subtitle: 'Medicina Tradicional China & Bienestar Integral',
      tagline: '',
      phone: '910 300 400',
      phoneE164: '34910300400',
      email: 'info@armoniavital.com',
      address: 'Calle del Bienestar, 28, 28001 Madrid, España',
      citySeo: 'Madrid - Acupuntura y Medicina Tradicional China',
      heroImage:
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2574&auto=format&fit=crop',
      metaDescription:
        'Clínica premium de acupuntura y medicina tradicional china. Tratamientos personalizados para dolor, estrés, fertilidad y bienestar integral.',
      navLogoHtml: 'ARMONÍA <span>VITAL</span>',
    },
  },
  {
    slug: 'aura-architects',
    sector: 'services',
    nameEs: 'Aura Architects',
    nameEn: 'Aura Architects',
    descEs:
      'Estudio de arquitectura de lujo: portfolio de proyectos, servicios, proceso de obra, sostenibilidad BIM y presupuesto.',
    descEn:
      'Luxury architecture studio: project portfolio, services, build process, BIM sustainability and quote request.',
    demoPath: '/demos/starters/aura-architects/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&h=600&auto=format&fit=crop',
    catalogTemplateSlug: 'blueprint',
    sectorId: 'arquitectura',
    catalogCategoryKey: 'architecture',
    categoryLabelEs: 'Arquitectura',
    categoryLabelEn: 'Architecture',
    customizableFields: [
      'businessName',
      'subtitle',
      'phone',
      'email',
      'address',
      'citySeo',
      'heroImage',
    ],
    defaults: {
      businessName: 'Aura Architects',
      subtitle: 'Estudio de Arquitectura & Interiorismo',
      tagline: '',
      phone: '910 700 800',
      phoneE164: '34910700800',
      email: 'hola@auraarchitects.com',
      address: 'Calle de la Arquitectura, 12, 28001 Madrid, España',
      citySeo: 'Madrid - Arquitectura de Lujo y Diseño Sostenible',
      heroImage:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
      metaDescription:
        'Estudio de arquitectura premiado especializado en viviendas de lujo, villas sostenibles e interiorismo de alta gama. Diseño bioclimático, tecnología BIM y excelencia constructiva.',
      navLogoHtml: 'AURA <span>ARCHITECTS</span>',
    },
  },
];

export function getPremiumStarterBySlug(slug: string): PremiumStarterItem | undefined {
  return premiumStarters.find((s) => s.slug === slug);
}

export function resolvePremiumStarterSlug(raw: string): string | undefined {
  const normalized = raw.trim().toLowerCase();
  return premiumStarters.find((s) => s.slug === normalized)?.slug;
}
