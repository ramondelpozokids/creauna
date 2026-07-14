export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  items: MenuItem[];
}

export interface MenuHighlight {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface DailyMenuCard {
  id: string;
  icon: string;
  title: string;
  price: string;
  scheduleTitle: string;
  scheduleDetail: string;
  items: string[];
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export interface FootballFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface FootballSectionContent {
  headline: string;
  introPrefix: string;
  highlightName: string;
  tagline: string;
  features: FootballFeature[];
  ctaText: string;
}

export interface BusinessInfoSection {
  locationLines: string[];
  locationLinkText: string;
  hoursLines: string[];
  hoursStatusOpen: boolean;
  hoursStatusText: string;
  priceLines: string[];
  specialtyItems: string[];
}

export interface ReviewCard {
  id: string;
  author: string;
  badge: string;
  initials: string;
  stars: number;
  date: string;
  text: string;
}

export interface DigitalServicesContent {
  googleRating: string;
  googleReviewCount: string;
  badge24hText: string;
  qrHeadline: string;
  qrSubtitle: string;
  qrTargetUrl: string;
  qrFeatures: string[];
  reservaBannerTitle: string;
  reservaBannerText: string;
  reservaFeatures: string[];
  reviewsHeadline: string;
  reviewsSubtitle: string;
  reviews: ReviewCard[];
  googleMapsUrl: string;
  orderingEnabled: boolean;
  tableCount: number;
  tableSectionHeadline: string;
  tableSectionSubtitle: string;
  orderSendButtonText: string;
}

export interface PremiumStarterContent {
  menu: MenuCategory[];
  highlights: MenuHighlight[];
  dailyMenus: DailyMenuCard[];
  info: BusinessInfoSection;
  football: FootballSectionContent;
  digital: DigitalServicesContent;
  gallery: GalleryImage[];
}

export function emptyPremiumContent(): PremiumStarterContent {
  return {
    menu: [],
    highlights: [],
    dailyMenus: [],
    info: {
      locationLines: [],
      locationLinkText: 'Cómo llegar →',
      hoursLines: [],
      hoursStatusOpen: true,
      hoursStatusText: 'Abierto ahora',
      priceLines: [],
      specialtyItems: [],
    },
    football: {
      headline: '⚽ Llega una Nueva Liga de Fútbol',
      introPrefix: 'Ven a vivir el fútbol en',
      highlightName: 'Tu Restaurante',
      tagline: 'Todos los partidos de Liga y Champions League',
      features: [],
      ctaText: 'Reserva tu Mesa',
    },
    digital: {
      googleRating: '3.7',
      googleReviewCount: '33',
      badge24hText: 'Reserva online',
      qrHeadline: 'Escanea y consulta',
      qrSubtitle: 'Sin app · Sin registro · Siempre actualizada',
      qrTargetUrl: 'pedir.html',
      qrFeatures: [
        'Acceso instantáneo escaneando el QR de mesa',
        'Carta siempre al día con nuestros platos y precios',
        'Pedido directo a WhatsApp con número de mesa',
        'Consulta cómoda desde cualquier dispositivo',
      ],
      reservaBannerTitle: 'Reserva cuando quieras, las 24 horas',
      reservaBannerText:
        'El 60% de las reservas se hacen fuera del horario del restaurante. Reserva ahora y confirma al instante, sin llamadas.',
      reservaFeatures: [
        'Confirmación inmediata online',
        'Disponible 24 horas, todos los días',
        'Cancelación gratuita',
        'Opciones para grupos y eventos',
      ],
      reviewsHeadline: 'Lo que dicen nuestros clientes',
      reviewsSubtitle: 'Opiniones reales en Google',
      reviews: [],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mesón+La+Colonia+Madrid',
      orderingEnabled: true,
      tableCount: 10,
      tableSectionHeadline: '¿Estás en una de nuestras mesas?',
      tableSectionSubtitle: 'Escanea el QR de tu mesa o selecciona el número para pedir por WhatsApp',
      orderSendButtonText: 'Enviar pedido por WhatsApp',
    },
    gallery: [],
  };
}

export function slugifyId(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || `item-${Date.now()}`;
}

export function newMenuItem(name = ''): MenuItem {
  return { id: slugifyId(`item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`), name, price: '' };
}

export function newMenuCategory(name = 'Nueva categoría'): MenuCategory {
  const id = slugifyId(name);
  return { id, name, icon: 'fas fa-utensils', items: [newMenuItem('Nuevo plato')] };
}

export function newMenuHighlight(title = ''): MenuHighlight {
  return {
    id: slugifyId(`highlight-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    icon: 'fas fa-utensils',
    title,
    description: '',
  };
}

export function newDailyMenuCard(title = 'Menú del Día'): DailyMenuCard {
  return {
    id: slugifyId(`daily-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    icon: 'fas fa-calendar-day',
    title,
    price: '14,00 €',
    scheduleTitle: 'Válido de Lunes a Viernes',
    scheduleDetail: '13:00 - 16:00 hrs',
    items: ['Primer plato', 'Segundo plato', 'Postre o café', 'Pan incluido'],
  };
}

export function newGalleryImage(url = '', alt = ''): GalleryImage {
  return {
    id: slugifyId(`img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    url,
    alt,
  };
}

/** Asegura arrays highlights/dailyMenus en contenido antiguo o parcial. */
export function newFootballFeature(title = ''): FootballFeature {
  return {
    id: slugifyId(`football-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    icon: 'fas fa-futbol',
    title,
    description: '',
  };
}

export function newReviewCard(author = ''): ReviewCard {
  const initials = author
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
  return {
    id: slugifyId(`review-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    author,
    badge: 'Cliente',
    initials: initials || 'CL',
    stars: 5,
    date: 'Hace 1 semana',
    text: '',
  };
}

export function normalizePremiumContent(content: Partial<PremiumStarterContent>): PremiumStarterContent {
  const base = emptyPremiumContent();
  return {
    menu: content.menu ?? base.menu,
    highlights: content.highlights ?? base.highlights,
    dailyMenus: content.dailyMenus ?? base.dailyMenus,
    info: { ...base.info, ...content.info },
    football: { ...base.football, ...content.football, features: content.football?.features ?? base.football.features },
    digital: {
      ...base.digital,
      ...content.digital,
      qrFeatures: content.digital?.qrFeatures ?? base.digital.qrFeatures,
      reservaFeatures: content.digital?.reservaFeatures ?? base.digital.reservaFeatures,
      reviews: content.digital?.reviews ?? base.digital.reviews,
    },
    gallery: content.gallery ?? base.gallery,
  };
}
