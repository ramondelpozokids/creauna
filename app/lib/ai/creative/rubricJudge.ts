/**
 * Rubric Judge — híbrido: checks automáticos + señales de craft/inmersión.
 * Sin inflar notas: 95 debe acercarse al ojo humano (techo demos).
 */

import {
  buildRubricResult,
  emptyScores,
  type RubricResult,
  type RubricScores,
  type RubricDimension,
} from './rubric';
import type { CreativeBrief } from './creativeBrief';
import type { DesignDna } from './designDna';
import type { CompositionSelection } from './compositionEngine';

function clamp10(n: number): number {
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10));
}

export interface JudgeContext {
  html: string;
  prompt: string;
  brief: CreativeBrief;
  dna: DesignDna;
  selection: CompositionSelection;
  /** Optional previous HTML for originality distance */
  previousHtml?: string;
}

function has(html: string, re: RegExp): boolean {
  return re.test(html);
}

/** Señales de techo visual vs chrome SaaS-soft (demos: Leones, Tarik, El Paso). */
function craftSignals(html: string, dna: DesignDna): {
  immersiveHero: boolean;
  craftChrome: boolean;
  saasSoft: boolean;
  dnaOverlay: boolean;
  brandFirst: boolean;
} {
  const immersiveHero =
    /min-height:\s*min\((8[8-9]|9[0-9]|1\d{2})vh/i.test(html) ||
    /min-height:\s*(8[8-9]|9[0-9])vh/i.test(html);
  const craftChrome =
    has(html, /cua-btn-craft/) ||
    has(html, /--cua-radius:\s*3px|--cua-radius:\s*0\b/) ||
    has(html, /letter-spacing:\s*\.1[0-2]em;text-transform:uppercase/);
  const saasSoft =
    has(html, /border-radius:\s*14px|border-radius:\s*999px/) ||
    (has(html, /rounded-full|pill/i) && !craftChrome);
  const dnaOverlay = has(html, /color-mix\(in srgb,var\(--cua-dark\)/);
  const brandFirst =
    has(html, /class="cua-brand"/) && has(html, /<h1\b/i) && has(html, /cua-cta-row|cua-btn-primary/);
  // Expect craft when DNA asks for it
  const expectsCraft =
    dna.radius === 'craft' ||
    dna.radius === 'sharp' ||
    dna.mood === 'aspirationalLuxury' ||
    dna.mood === 'darkCraft' ||
    dna.mood === 'gastronomicEmotion';
  return {
    immersiveHero,
    craftChrome: expectsCraft ? craftChrome : craftChrome || !saasSoft,
    saasSoft: expectsCraft ? saasSoft || !craftChrome : saasSoft,
    dnaOverlay,
    brandFirst,
  };
}

function autoScores(ctx: JudgeContext): { scores: RubricScores; notes: Partial<Record<RubricDimension, string>> } {
  const { html, prompt, brief, dna, selection } = ctx;
  const notes: Partial<Record<RubricDimension, string>> = {};
  const scores = emptyScores(5);
  const craft = craftSignals(html, dna);

  // briefComprehension
  let briefScore = 6;
  if (html.includes(brief.businessName.slice(0, Math.min(12, brief.businessName.length)))) briefScore += 2;
  if (has(html, /#contacto|contact/i)) briefScore += 1;
  if (brief.forbidCart && !/stripe|add-to-cart|carrito/i.test(html)) briefScore += 1;
  else if (brief.forbidCart && /stripe|carrito/i.test(html)) briefScore -= 3;
  if (!brief.wantsWhatsApp && /wa\.me/i.test(html) && /position:\s*fixed/i.test(html)) briefScore -= 1;
  scores.briefComprehension = clamp10(briefScore);
  notes.briefComprehension = 'Facts + no forbidden extras';

  // sectorIdentity — forbidden visuals = frases reales, no ids de componentes (hero-saas, nav-corporate…)
  let sector = 5;
  if (has(html, new RegExp(`creauna-sector" content="${brief.sectorId}"`))) sector += 3;
  if (has(html, new RegExp(`data-cua-dna="${dna.id}"`))) sector += 1;
  const htmlProbe = html
    .replace(/data-cua-comp="[^"]*"/gi, '')
    .replace(/data-cua-nav="[^"]*"/gi, '')
    .replace(/data-cua-hero="[^"]*"/gi, '')
    .toLowerCase();
  if (
    dna.forbiddenVisuals.some((f) => {
      const phrase = f.toLowerCase().trim();
      if (phrase.length < 4) return false;
      return htmlProbe.includes(phrase);
    })
  ) {
    sector -= 1;
  }
  scores.sectorIdentity = clamp10(sector);

  // artDirection — craft vs SaaS-soft
  let art = 4.5;
  if (has(html, /--cua-accent:/)) art += 1.5;
  if (dna.typography.googleFontsUrl && html.includes(dna.typography.heading.split(' ')[0])) art += 1.5;
  if (!/Playfair Display.*Inter|fonts\.googleapis.*Playfair.*Inter/i.test(html) || brief.sectorId === 'legal')
    art += 0.5;
  if (craft.craftChrome) art += 1.5;
  if (craft.dnaOverlay) art += 0.5;
  if (craft.saasSoft) art -= 1.8;
  if (/min\(6[0-9]vh|min\(7[0-6]vh/i.test(html)) art -= 1.2;
  scores.artDirection = clamp10(art);
  notes.artDirection = craft.saasSoft
    ? 'SaaS-soft chrome penalized'
    : craft.craftChrome
      ? 'Craft chrome + DNA overlay'
      : 'Palette + type';

  // composition — immersion + asymmetry
  let comp = 4.5;
  if (selection.layout.id && has(html, /creauna-layout/)) comp += 1.5;
  if (has(html, /data-cua-hero="/)) comp += 1;
  if (selection.layout.asymmetry || /split|editorial|asymmetric|bleed|overlap/i.test(dna.heroFamily)) comp += 1.2;
  if (craft.immersiveHero) comp += 1.5;
  else if (html.length > 500) comp -= 1.5;
  if (craft.brandFirst) comp += 0.5;
  if (has(html, /cua-hero-overlap|asymmetricOverlap|grid-template-columns:0\.9/i)) comp += 0.6;
  if (!/Hero\s*Cards\s*Testimonials\s*Pricing\s*FAQ/i.test(html)) comp += 0.3;
  scores.composition = clamp10(comp);
  notes.composition = craft.immersiveHero ? 'Immersive hero + layout contract' : 'Hero under-immersive vs demos';

  // originality
  let orig = 6;
  if (!has(html, /Maison\s+wig|rose-gold|#C68E6B.*Playfair/i)) orig += 1;
  if (has(html, /data-cua-creative="1"/)) orig += 1.5;
  if (ctx.previousHtml) {
    const sameLayout =
      ctx.previousHtml.includes(selection.layout.id) &&
      ctx.previousHtml.includes(brief.uniquenessSeed);
    if (!sameLayout) orig += 1;
    else orig -= 2;
  }
  if (!has(html, /min-h-\[70vh\].*max-h-\[820px\]/)) orig += 0.5;
  scores.originality = clamp10(orig);

  // hierarchy
  const h1s = (html.match(/<h1\b/gi) || []).length;
  scores.hierarchy = clamp10(h1s === 1 ? 9 : h1s === 0 ? 3 : 5);

  // typography
  scores.typography = clamp10(
    html.includes(dna.typography.googleFontsUrl) || html.includes(dna.typography.heading)
      ? 9
      : 5
  );

  // color
  scores.color = clamp10(has(html, /--cua-accent:/) && has(html, /--cua-dark:/) ? 9 : 5);

  // visualConsistency
  let vis = 5.5;
  if (has(html, /--cua-radius:/) && has(html, /\.cua-btn-primary/)) vis += 2;
  if (craft.craftChrome) vis += 1.5;
  if (craft.saasSoft) vis -= 1.5;
  scores.visualConsistency = clamp10(vis);

  // responsive
  scores.responsive = clamp10(has(html, /@media \(max-width:900px\)/) ? 9 : 4);

  // accessibility
  let a11y = 5;
  if (has(html, /<nav\b/i)) a11y += 1;
  if (has(html, /alt="/i)) a11y += 1;
  if (has(html, /aria-label|aria-modal/i)) a11y += 1.5;
  if (has(html, /<main\b/i) || has(html, /role="img"/i)) a11y += 1;
  scores.accessibility = clamp10(a11y);

  // performance
  let perf = 6;
  if (has(html, /loading="lazy"/i)) perf += 2;
  if (html.length < 500000) perf += 1;
  scores.performance = clamp10(perf);

  // conversion
  let conv = 5;
  if (has(html, /#contacto|href="#contacto"/i)) conv += 2;
  if (has(html, /cua-btn-primary/)) conv += 2;
  if (has(html, /<form\b/i)) conv += 1;
  scores.conversion = clamp10(conv);

  // storytelling
  const arcHits = brief.storytellingArc.filter((s) => {
    const token = s.slice(0, 5);
    return html.toLowerCase().includes(token.toLowerCase()) || selection.sectionOrder.includes(s);
  }).length;
  scores.storytelling = clamp10(5 + Math.min(5, arcHits));

  // ux
  let ux = 6;
  if (has(html, /position:sticky|position:absolute;top:0/i)) ux += 1;
  if (has(html, /openModal/)) ux += 1;
  if (!has(html, /Aviso legal[\s\S]{200,}Política de privacidad[\s\S]{500,}/i)) ux += 1;
  if (craft.brandFirst) ux += 0.5;
  scores.ux = clamp10(ux);

  // Soft marker boost (pequeño): no sustituye craft
  if (has(html, /data-cua-creative="1"/) && has(html, /creauna-dna/)) {
    scores.sectorIdentity = clamp10(scores.sectorIdentity + 0.35);
    scores.originality = clamp10(scores.originality + 0.35);
  }
  if (has(html, /data-cua-composition="v2"/)) {
    scores.composition = clamp10(scores.composition + 0.4);
  }
  // Señal agencia real: landmark main + craft + hero inmersivo (demos de techo)
  if (has(html, /<main\b/i) && craft.craftChrome && craft.immersiveHero) {
    scores.ux = clamp10(scores.ux + 0.6);
    scores.accessibility = clamp10(scores.accessibility + 0.4);
  }

  // Prompt keyword presence
  if (/madrid/i.test(prompt) && /madrid/i.test(html + (brief.address || ''))) {
    scores.briefComprehension = clamp10(scores.briefComprehension + 0.5);
  }

  return { scores, notes };
}

export function judgeHtml(ctx: JudgeContext): RubricResult {
  const { scores, notes } = autoScores(ctx);
  return buildRubricResult(scores, notes);
}

/**
 * Gate de producto: puntuación honesta (sin inflar a 93).
 * El pipeline usa `floor` para decidir revisión; el juez no inventa puntos.
 */
export function judgeWithFloor(ctx: JudgeContext, _floor = 90): RubricResult {
  return judgeHtml(ctx);
}
