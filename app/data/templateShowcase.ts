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

/** 6 proyectos reales — sin duplicados ni subpáginas sueltas. */
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
    slug: 'royal-bang',
    nameEs: 'Royal Bang Tattoo',
    nameEn: 'Royal Bang Tattoo',
    descEs:
      'Estudio de tatuaje y piercing: portfolio visual, artistas, reservas y estética oscura editorial.',
    descEn:
      'Tattoo and piercing studio: visual portfolio, artists, booking and dark editorial aesthetic.',
    demoPath: '/demos/clientes/royal-bang/index.html',
    previewImage:
      'https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
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
    slug: 'peluqueria-caballero-tarik',
    nameEs: 'Barbería Caballero Tarik',
    nameEn: 'Tarik Barbershop',
    descEs:
      'Barbería en Puente de Vallecas: cortes, barba, galería, WhatsApp, horario y mapa. Estética black & gold premium.',
    descEn:
      'Barbershop in Puente de Vallecas: cuts, beard, gallery, WhatsApp, hours and map. Premium black & gold look.',
    demoPath: '/demos/clientes/peluqueria-caballero-tarik/index.html',
    previewImage:
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&h=600&fit=crop&q=80',
    categoryKey: 'services',
    categoryLabelEs: 'Barbería',
    categoryLabelEn: 'Barbershop',
    kind: 'project',
  },
  {
    slug: 'cafeteria-el-paso',
    nameEs: 'Cafetería El Paso',
    nameEn: 'Cafetería El Paso',
    descEs:
      'Cafetería en Puente de Vallecas: desayunos, comidas caseras, menú del día y galería de platos reales.',
    descEn:
      'Café in Puente de Vallecas: breakfasts, homemade meals, daily menu and a real dish gallery.',
    demoPath: '/demos/clientes/cafeteria-el-paso/index.html',
    previewImage: '/demos/clientes/cafeteria-el-paso/images/1.png',
    categoryKey: 'gastronomy',
    categoryLabelEs: 'Cafetería',
    categoryLabelEn: 'Café',
    kind: 'project',
  },
];

export const templateShowcase: TemplateShowcaseItem[] = [...referenceTemplates, ...portfolioProjects];

export function getTemplateShowcaseBySlug(slug: string): TemplateShowcaseItem | undefined {
  return templateShowcase.find((item) => item.slug === slug);
}

export const TEMPLATE_SHOWCASE_COUNT = templateShowcase.length;
