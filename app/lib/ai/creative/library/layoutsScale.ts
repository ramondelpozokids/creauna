/**
 * Layout scale — genera variantes adicionales hasta ≥120 total (Fase 7).
 */

import type { LayoutMeta, LayoutGoal, LayoutStyle } from './types';
import { LAYOUT_LIBRARY as BASE } from './layouts';

const HEROES = [
  'fullBleedCenter',
  'fullBleedLeft',
  'splitMediaRight',
  'splitMediaLeft',
  'editorialStack',
  'minimalTypeOnly',
  'asymmetricOverlap',
] as const;

const SECTORS = [
  'clinic',
  'restaurant',
  'legal',
  'hotel',
  'architecture',
  'cafe',
  'barber',
  'bakery',
  'corporate',
  'fashion',
  'default',
] as const;

const ARCS: string[][] = [
  ['hero', 'about', 'services', 'gallery', 'testimonials', 'contact'],
  ['hero', 'services', 'process', 'gallery', 'faq', 'contact'],
  ['hero', 'philosophy', 'projects', 'about', 'contact'],
  ['hero', 'atmosphere', 'rooms', 'dining', 'gallery', 'contact'],
  ['hero', 'practices', 'method', 'insights', 'contact'],
  ['hero', 'menu', 'experience', 'gallery', 'reservations', 'contact'],
  ['hero', 'trust', 'services', 'team', 'faq', 'contact'],
  ['hero', 'story', 'products', 'process', 'gallery', 'contact'],
];

const STYLES: LayoutStyle[] = ['editorial', 'corporate', 'luxury', 'warm', 'minimal', 'dark', 'clinical'];
const GOALS: LayoutGoal[] = ['conversion', 'brand', 'storytelling', 'booking', 'lead'];

function buildScaledLayouts(target = 120): LayoutMeta[] {
  const out: LayoutMeta[] = [...BASE];
  const existing = new Set(out.map((l) => l.id));
  let n = 0;
  while (out.length < target && n < 500) {
    const sector = SECTORS[n % SECTORS.length];
    const hero = HEROES[n % HEROES.length];
    const arc = ARCS[n % ARCS.length];
    const id = `layout-scale-${sector}-${hero}-${n}`;
    n++;
    if (existing.has(id)) continue;
    existing.add(id);
    out.push({
      id,
      name: `Scaled ${sector} ${hero} #${n}`,
      sectors: [sector, '*'],
      goals: [GOALS[n % GOALS.length], GOALS[(n + 2) % GOALS.length]],
      styles: [STYLES[n % STYLES.length], STYLES[(n + 3) % STYLES.length]],
      conversion: ((n % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      storytelling: (((n + 2) % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      heroFamily: hero,
      sectionOrder: arc,
      asymmetry: n % 3 === 0,
    });
  }
  return out;
}

export const LAYOUT_LIBRARY_SCALED = buildScaledLayouts(120);

export function listAllLayouts(): LayoutMeta[] {
  return LAYOUT_LIBRARY_SCALED;
}
