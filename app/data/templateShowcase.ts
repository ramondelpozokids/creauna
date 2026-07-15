import { premiumStarters } from './premiumStarters';

/** Categorías del catálogo público /templates (solo demo, sin personalización). */
export type TemplateShowcaseCategory =
  | 'gastronomy'
  | 'health'
  | 'realestate'
  | 'hospitality'
  | 'sport'
  | 'luxury'
  | 'architecture'
  | 'services'
  | 'creative';

export type TemplateShowcaseKind = 'template' | 'project';

export interface TemplateShowcaseItem {
  slug: string;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  demoPath: string;
  previewImage: string;
  categoryKey: TemplateShowcaseCategory;
  categoryLabelEs: string;
  categoryLabelEn: string;
  /** Plantilla de referencia CREAUNA vs proyecto real entregado. */
  kind: TemplateShowcaseKind;
}

export const templateShowcaseCategories: {
  key: 'all' | TemplateShowcaseCategory;
  labelEs: string;
  labelEn: string;
}[] = [
  { key: 'all', labelEs: 'Todos', labelEn: 'All' },
  { key: 'gastronomy', labelEs: 'Gastronomía', labelEn: 'Dining' },
  { key: 'health', labelEs: 'Salud', labelEn: 'Health' },
  { key: 'services', labelEs: 'Servicios', labelEn: 'Services' },
  { key: 'realestate', labelEs: 'Inmobiliaria', labelEn: 'Real estate' },
  { key: 'hospitality', labelEs: 'Hotel', labelEn: 'Hotel' },
  { key: 'sport', labelEs: 'Deporte', labelEn: 'Sport' },
  { key: 'luxury', labelEs: 'Lujo', labelEn: 'Luxury' },
  { key: 'architecture', labelEs: 'Arquitectura', labelEn: 'Architecture' },
  { key: 'creative', labelEs: 'Creativos', labelEn: 'Creative' },
];

/** 9 plantillas de referencia CREAUNA (muestras premium). */
const referenceTemplates: TemplateShowcaseItem[] = premiumStarters.map((s) => ({
  slug: s.slug,
  nameEs: s.nameEs,
  nameEn: s.nameEn,
  descEs: s.descEs,
  descEn: s.descEn,
  demoPath: s.demoPath,
  previewImage: s.previewImage,
  categoryKey: mapPremiumCategory(s.catalogCategoryKey),
  categoryLabelEs: s.categoryLabelEs,
  categoryLabelEn: s.categoryLabelEn,
  kind: 'template' as const,
}));

function mapPremiumCategory(
  key: (typeof premiumStarters)[0]['catalogCategoryKey']
): TemplateShowcaseCategory {
  if (key === 'realestate') return 'realestate';
  if (key === 'hospitality') return 'hospitality';
  if (key === 'sport') return 'sport';
  if (key === 'luxury') return 'luxury';
  if (key === 'architecture') return 'architecture';
  if (key === 'health') return 'health';
  return 'gastronomy';
}

/** 9 proyectos reales — ampliación del catálogo demo. */
const portfolioProjects: TemplateShowcaseItem[] = [
  {
    slug: 'rest-art-cafe',
    nameEs: 'Rest Art Café',
    nameEn: 'Rest Art Café',
    descEs:
      'Restaurante con terraza en Vallecas: menú del día, reservas, galería y reseñas. Web real entregada al cliente.',
    descEn:
      'Terrace restaurant in Vallecas: daily menu, reservations, gallery and reviews. Real delivered client site.',
    demoPath: '/demos/clientes/rest-art-cafe/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&h=600&fit=crop&q=80',
    categoryKey: 'gastronomy',
    categoryLabelEs: 'Restaurante',
    categoryLabelEn: 'Restaurant',
    kind: 'project',
  },
  {
    slug: 'la-perla-oriental',
    nameEs: 'La Perla Oriental',
    nameEn: 'La Perla Oriental',
    descEs:
      'Restaurante chino premium: carta completa, especialidades, galería y reservas. Proyecto real en Puente de Vallecas.',
    descEn:
      'Premium Chinese restaurant: full menu, specialties, gallery and bookings. Real project in Vallecas.',
    demoPath: '/demos/clientes/la-perla-oriental/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&h=600&fit=crop&q=80',
    categoryKey: 'gastronomy',
    categoryLabelEs: 'Restaurante asiático',
    categoryLabelEn: 'Asian restaurant',
    kind: 'project',
  },
  {
    slug: 'kebab-hut',
    nameEs: 'Kebab Hut Vallecas',
    nameEn: 'Kebab Hut Vallecas',
    descEs:
      'Kebab urbano premium: carta visual, fotos reales del local y ambiente contemporáneo. Web entregada lista para publicar.',
    descEn:
      'Premium urban kebab: visual menu, real venue photos and contemporary feel. Delivered site ready to publish.',
    demoPath: '/demos/clientes/kebab-hut/index.html',
    previewImage:
      'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    categoryKey: 'gastronomy',
    categoryLabelEs: 'Kebab & fast casual',
    categoryLabelEn: 'Kebab & fast casual',
    kind: 'project',
  },
  {
    slug: 'campon-asesores',
    nameEs: 'Campón Asesores',
    nameEn: 'Campón Asesores',
    descEs:
      'Gestoría y asesoría fiscal desde 1991: servicios, equipo, tarifas y formulario de contacto. Confianza profesional.',
    descEn:
      'Tax and business advisory since 1991: services, team, pricing and contact form. Professional trust.',
    demoPath: '/demos/clientes/campon-asesores/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=600&fit=crop&q=80',
    categoryKey: 'services',
    categoryLabelEs: 'Gestoría & asesoría',
    categoryLabelEn: 'Tax & advisory',
    kind: 'project',
  },
  {
    slug: 'verum-gestoria',
    nameEs: 'VERUM Gestoría',
    nameEn: 'VERUM Tax Advisory',
    descEs:
      'Modernización completa de web de gestoría: diseño premium, servicios detallados y captación de leads.',
    descEn:
      'Full modernization of an accounting firm site: premium design, detailed services and lead capture.',
    demoPath: '/demos/modernizacion/gestoria/index1.html',
    previewImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&h=600&fit=crop&q=80',
    categoryKey: 'services',
    categoryLabelEs: 'Modernización',
    categoryLabelEn: 'Modernization',
    kind: 'project',
  },
  {
    slug: 'royal-bang',
    nameEs: 'Royal Bang Tattoo',
    nameEn: 'Royal Bang Tattoo',
    descEs:
      'Estudio de tatuaje y piercing: portfolio visual, artistas, reservas y estética oscura editorial.',
    descEn:
      'Tattoo and piercing studio: visual portfolio, artists, booking and dark editorial aesthetic.',
    demoPath: '/demos/clientes/royal-bang/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1590246814880-486cccb8392e?w=900&h=600&fit=crop&q=80',
    categoryKey: 'creative',
    categoryLabelEs: 'Tatuaje & piercing',
    categoryLabelEn: 'Tattoo & piercing',
    kind: 'project',
  },
  {
    slug: 'yana-yavorskaya',
    nameEs: 'Yana Yavorskaya',
    nameEn: 'Yana Yavorskaya',
    descEs:
      'Artista contemporánea: obras disponibles, exposiciones internacionales, galería museística y contacto.',
    descEn:
      'Contemporary artist: available works, international exhibitions, museum-style gallery and contact.',
    demoPath: '/demos/clientes/yana-yavorskaya/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&h=600&fit=crop&q=80',
    categoryKey: 'creative',
    categoryLabelEs: 'Arte contemporáneo',
    categoryLabelEn: 'Contemporary art',
    kind: 'project',
  },
  {
    slug: 'rest-art-carta',
    nameEs: 'Rest Art — Carta digital',
    nameEn: 'Rest Art — Digital menu',
    descEs:
      'Carta interactiva optimizada para móvil: categorías, platos y diseño gastronómico coherente con la web principal.',
    descEn:
      'Mobile-optimized interactive menu: categories, dishes and gastronomy design aligned with the main site.',
    demoPath: '/demos/clientes/rest-art-cafe/carta.html',
    previewImage:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=600&fit=crop&q=80',
    categoryKey: 'gastronomy',
    categoryLabelEs: 'Carta digital',
    categoryLabelEn: 'Digital menu',
    kind: 'project',
  },
  {
    slug: 'campon-servicios',
    nameEs: 'Campón — Servicios',
    nameEn: 'Campón — Services',
    descEs:
      'Página de servicios detallada: fiscal, laboral, contable y mercantil con estructura clara para conversión.',
    descEn:
      'Detailed services page: tax, payroll, accounting and corporate with clear conversion structure.',
    demoPath: '/demos/clientes/campon-asesores/servicios.html',
    previewImage:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&h=600&fit=crop&q=80',
    categoryKey: 'services',
    categoryLabelEs: 'Página de servicios',
    categoryLabelEn: 'Services page',
    kind: 'project',
  },
];

export const templateShowcase: TemplateShowcaseItem[] = [...referenceTemplates, ...portfolioProjects];

export function getTemplateShowcaseBySlug(slug: string): TemplateShowcaseItem | undefined {
  return templateShowcase.find((item) => item.slug === slug);
}

export const TEMPLATE_SHOWCASE_COUNT = templateShowcase.length;
