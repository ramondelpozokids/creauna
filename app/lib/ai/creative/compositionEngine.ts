/**
 * Composition Engine — elige layout + componentes según CreativeBrief + DNA + seed.
 */

import type { CreativeBrief } from './creativeBrief';
import type { DesignDna } from './designDna';
import {
  layoutsForSector,
  listAllLayouts,
  type LayoutMeta,
  type ComponentMeta,
  componentsByFamily,
} from './library';
import { seededRandom } from './uniquenessSeed';

export interface CompositionSelection {
  layout: LayoutMeta;
  navId: string;
  heroId: string;
  cardId: string;
  footerId: string;
  ctaId: string;
  testimonialId: string;
  faqId: string;
  formId: string;
  featuresId: string;
  galleryId: string;
  aboutId: string;
  sectionOrder: string[];
  score: number;
}

function scoreLayout(layout: LayoutMeta, brief: CreativeBrief, dna: DesignDna): number {
  let s = 0;
  const exactSector = layout.sectors.includes(brief.sectorId);
  const wildcard = layout.sectors.includes('*');
  if (exactSector) s += 55;
  else if (wildcard) s += 15;
  else s -= 30;
  // Penalizar layouts de otros verticales fuertes
  const foreign = layout.sectors.filter((x) => x !== '*' && x !== brief.sectorId && x !== 'default');
  if (foreign.length && !exactSector) s -= 25;
  if (layout.heroFamily === brief.heroFamily) s += 25;
  if (layout.heroFamily === dna.heroFamily) s += 10;
  const styleMap: Record<string, string[]> = {
    clinic: ['clinical', 'minimal'],
    restaurant: ['warm', 'editorial'],
    legal: ['corporate', 'minimal'],
    hotel: ['luxury', 'editorial'],
    architecture: ['minimal', 'editorial'],
    cafe: ['warm'],
    barber: ['dark'],
    bakery: ['warm'],
    corporate: ['corporate'],
    fashion: ['editorial', 'luxury'],
    default: ['editorial', 'minimal'],
  };
  const want = styleMap[brief.sectorId] || ['editorial'];
  if (layout.styles.some((st) => want.includes(st))) s += 15;
  s += layout.conversion * 2;
  s += layout.storytelling * 2;
  if (layout.asymmetry && (brief.heroFamily === 'asymmetricOverlap' || brief.density === 'sparse')) s += 8;
  return s;
}

function pickFamily(
  family: ComponentMeta['family'],
  sector: string,
  rng: () => number
): ComponentMeta {
  const all = componentsByFamily(family);
  const sectorFit = all.filter((c) => c.sectors.includes(sector) || c.sectors.includes('*') || c.sectors.includes('default'));
  let pool = sectorFit.length ? sectorFit : all;
  // Evitar chrome SaaS-named en verticales craft (el id no debe filtrarse al HTML de marca)
  const craftSectors = new Set(['restaurant', 'cafe', 'hotel', 'clinic', 'barber', 'bakery', 'fashion']);
  if (family === 'hero' && craftSectors.has(sector)) {
    const filtered = pool.filter((c) => !/saas|startup/i.test(c.id));
    if (filtered.length) pool = filtered;
  }
  return pool[Math.floor(rng() * pool.length) % pool.length];
}

export function composeSelection(brief: CreativeBrief, dna: DesignDna): CompositionSelection {
  const rng = seededRandom(brief.uniquenessSeed);
  // Prefer sector layouts; fall back to full scaled library
  let candidates = layoutsForSector(brief.sectorId).filter((l) =>
    l.sectors.includes(brief.sectorId)
  );
  if (candidates.length < 3) {
    candidates = layoutsForSector(brief.sectorId);
  }
  if (candidates.length < 8) {
    const scaled = listAllLayouts().filter((l) => l.sectors.includes(brief.sectorId));
    candidates = [...candidates, ...scaled];
  }
  if (!candidates.length) candidates = listAllLayouts();

  const ranked = [...candidates]
    .map((layout) => ({ layout, score: scoreLayout(layout, brief, dna) + rng() * 5 }))
    .sort((a, b) => b.score - a.score);

  const top = ranked.slice(0, Math.min(3, ranked.length));
  const chosen = top[Math.floor(rng() * top.length) % top.length] || ranked[0];

  const layout = chosen.layout;
  const sectionOrder =
    brief.storytellingArc.length >= 4 ? [...brief.storytellingArc] : [...layout.sectionOrder];

  if (!sectionOrder.includes('contact')) sectionOrder.push('contact');

  return {
    layout,
    navId: pickFamily('nav', brief.sectorId, rng).id,
    heroId: pickFamily('hero', brief.sectorId, rng).id,
    cardId: pickFamily('card', brief.sectorId, rng).id,
    footerId: pickFamily('footer', brief.sectorId, rng).id,
    ctaId: pickFamily('cta', brief.sectorId, rng).id,
    testimonialId: pickFamily('testimonial', brief.sectorId, rng).id,
    faqId: pickFamily('faq', brief.sectorId, rng).id,
    formId: pickFamily('form', brief.sectorId, rng).id,
    featuresId: pickFamily('features', brief.sectorId, rng).id,
    galleryId: pickFamily('gallery', brief.sectorId, rng).id,
    aboutId: pickFamily('about', brief.sectorId, rng).id,
    sectionOrder,
    score: chosen.score,
  };
}

/** Distancia estructural simple entre dos selecciones (0–1). */
export function compositionDistance(a: CompositionSelection, b: CompositionSelection): number {
  let diff = 0;
  let n = 0;
  const keys: (keyof CompositionSelection)[] = [
    'navId',
    'heroId',
    'cardId',
    'footerId',
    'ctaId',
    'layout',
  ];
  for (const k of keys) {
    n++;
    if (k === 'layout') {
      if (a.layout.id !== b.layout.id) diff++;
    } else if (a[k] !== b[k]) diff++;
  }
  if (a.sectionOrder.join() !== b.sectionOrder.join()) {
    diff += 0.5;
    n += 0.5;
  }
  return diff / n;
}
