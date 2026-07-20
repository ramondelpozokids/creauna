/**
 * CreativeBrief — salida estructurada del Director Creativo (pasos 1–14).
 * Cero HTML. Solo decisiones creativas.
 */

export type CreativeSectorId =
  | 'clinic'
  | 'restaurant'
  | 'legal'
  | 'hotel'
  | 'architecture'
  | 'cafe'
  | 'barber'
  | 'bakery'
  | 'corporate'
  | 'fashion'
  | 'default';

export type BrandTone =
  | 'premium'
  | 'warm'
  | 'corporate'
  | 'editorial'
  | 'playful'
  | 'minimal'
  | 'luxury'
  | 'trust';

export type ArtDirection =
  | 'clinicalLight'
  | 'gastronomicEmotion'
  | 'soberCorporate'
  | 'aspirationalLuxury'
  | 'spatialMinimal'
  | 'darkCraft'
  | 'warmNeighborhood'
  | 'techGlass'
  | 'earthyArtisan';

export type VisualLanguage =
  | 'photographyDominant'
  | 'typeLed'
  | 'splitEditorial'
  | 'airAndWhite'
  | 'darkMoody'
  | 'colorBlock'
  | 'glassDepth';

export type HeroFamily =
  | 'fullBleedCenter'
  | 'fullBleedLeft'
  | 'splitMediaRight'
  | 'splitMediaLeft'
  | 'editorialStack'
  | 'minimalTypeOnly'
  | 'asymmetricOverlap';

export type Density = 'sparse' | 'balanced' | 'dense';
export type Rhythm = 'alternatingBands' | 'continuous' | 'cardGrid' | 'editorialBreaks';
export type IconStyle = 'none' | 'line' | 'duotone' | 'emoji' | 'photoOnly';
export type TypeScale = 'intimate' | 'editorial' | 'billboard';

export interface CreativeBrief {
  version: '1.0';
  /** Pasos 1–5 */
  sectorId: CreativeSectorId;
  audience: string;
  positioning: string;
  brandTone: BrandTone;
  /** Pasos 6–10 */
  artDirection: ArtDirection;
  visualLanguage: VisualLanguage;
  heroFamily: HeroFamily;
  density: Density;
  rhythm: Rhythm;
  typeScale: TypeScale;
  /** Pasos 11–13 */
  photoStyle: string;
  iconStyle: IconStyle;
  storytellingArc: string[];
  /** Hechos de negocio (proyección, no estética) */
  businessName: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  services: string[];
  /** Copy de sección nosotros (nunca photoStyle / audience crudos) */
  aboutHeadline: string;
  aboutBody: string;
  address?: string;
  hours?: string;
  wantsWhatsApp: boolean;
  forbidCart: boolean;
  lang: 'es' | 'en';
  /** Semilla de variabilidad (paso composición) */
  uniquenessSeed: string;
  rationale: string;
}

export const CREATIVE_BRIEF_VERSION = '1.0' as const;
