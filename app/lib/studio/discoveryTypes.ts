import type { SiteFeatures } from '../ai/intentAnalyzer';

export type StudioStyleMood = 'elegante' | 'minimal' | 'moderno';
export type StudioPalette = 'indigo' | 'slate' | 'amber' | 'emerald' | 'rose' | 'dark';
export type StudioHeroStyle = 'full' | 'split' | 'minimal' | 'cinematic';

/** Respuestas del wizard de descubrimiento — entrada estructurada al motor. */
export interface StudioDiscoveryAnswers {
  sectorId: string;
  templateSlug: string;
  businessName: string;
  tagline?: string;
  style: StudioStyleMood;
  palette: StudioPalette;
  heroStyle: StudioHeroStyle;
  features: SiteFeatures;
  navPages: string[];
  extraNotes?: string;
  /** Contacto real del cliente (motor-ready; la UI puede rellenarlos más adelante). */
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  legalName?: string;
  cif?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

export type NavPageId =
  | 'inicio'
  | 'servicios'
  | 'menu'
  | 'galeria'
  | 'about'
  | 'reviews'
  | 'blog'
  | 'contacto'
  | 'reservas'
  | 'ubicacion';

export const NAV_PAGE_IDS: NavPageId[] = [
  'inicio',
  'servicios',
  'menu',
  'galeria',
  'about',
  'reviews',
  'blog',
  'contacto',
  'reservas',
  'ubicacion',
];

/** Mapea páginas del menú a flags de SiteFeatures. */
export function featuresFromNavPages(pages: NavPageId[], base: SiteFeatures): SiteFeatures {
  const set = new Set(pages);
  return {
    ...base,
    menu: set.has('menu') || base.menu,
    services: set.has('servicios') || base.services,
    gallery: set.has('galeria') || base.gallery,
    about: set.has('about') || base.about,
    reviews: set.has('reviews') || base.reviews,
    blog: set.has('blog') || base.blog,
    contact: set.has('contacto') || base.contact,
    reservation: set.has('reservas') || base.reservation,
    location: set.has('ubicacion') || base.location,
  };
}
