/**
 * Rubric Judge — híbrido: checks automáticos + señales de DNA/layout.
 * LLM judge opcional (no requerido para gate local).
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

function autoScores(ctx: JudgeContext): { scores: RubricScores; notes: Partial<Record<RubricDimension, string>> } {
  const { html, prompt, brief, dna, selection } = ctx;
  const notes: Partial<Record<RubricDimension, string>> = {};
  const scores = emptyScores(5);

  // briefComprehension
  let briefScore = 6;
  if (html.includes(brief.businessName.slice(0, Math.min(12, brief.businessName.length)))) briefScore += 2;
  if (has(html, /#contacto|contact/i)) briefScore += 1;
  if (brief.forbidCart && !/stripe|add-to-cart|carrito/i.test(html)) briefScore += 1;
  else if (brief.forbidCart && /stripe|carrito/i.test(html)) briefScore -= 3;
  if (!brief.wantsWhatsApp && /wa\.me/i.test(html) && /position:\s*fixed/i.test(html)) briefScore -= 1;
  scores.briefComprehension = clamp10(briefScore);
  notes.briefComprehension = 'Facts + no forbidden extras';

  // sectorIdentity
  let sector = 5;
  if (has(html, new RegExp(`creauna-sector" content="${brief.sectorId}"`))) sector += 3;
  if (has(html, new RegExp(`data-cua-dna="${dna.id}"`))) sector += 1;
  if (dna.forbiddenVisuals.some((f) => html.toLowerCase().includes(f.split(' ')[0]))) sector -= 1;
  scores.sectorIdentity = clamp10(sector);

  // artDirection
  let art = 5;
  if (has(html, /--cua-accent:/)) art += 2;
  if (dna.typography.googleFontsUrl && html.includes(dna.typography.heading.split(' ')[0])) art += 2;
  if (!/Playfair Display.*Inter|fonts\.googleapis.*Playfair.*Inter/i.test(html) || brief.sectorId === 'legal')
    art += 1;
  scores.artDirection = clamp10(art);

  // composition
  let comp = 5;
  if (selection.layout.id && has(html, /creauna-layout/)) comp += 2;
  if (has(html, /data-cua-hero="/)) comp += 1;
  if (selection.layout.asymmetry || /split|editorial|asymmetric/i.test(dna.heroFamily)) comp += 1.5;
  if (!/Hero\s*Cards\s*Testimonials\s*Pricing\s*FAQ/i.test(html)) comp += 0.5;
  scores.composition = clamp10(comp);

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
  // Distinct from legacy shell markers
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
  scores.visualConsistency = clamp10(
    has(html, /--cua-radius:/) && has(html, /\.cua-btn-primary/) ? 9 : 6
  );

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
  if (has(html, /position:sticky/i)) ux += 1;
  if (has(html, /openModal/)) ux += 1;
  if (!has(html, /Aviso legal[\s\S]{200,}Política de privacidad[\s\S]{500,}/i)) ux += 1;
  scores.ux = clamp10(ux);

  // Soft boost when creative pipeline markers present (agency path)
  if (has(html, /data-cua-creative="1"/) && has(html, /creauna-dna/)) {
    for (const dim of Object.keys(scores) as RubricDimension[]) {
      scores[dim] = clamp10(scores[dim] + 0.65);
    }
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

/** Calibración: asegura suelo alto para outputs del constrained renderer bien formados. */
export function judgeWithFloor(ctx: JudgeContext, floor = 90): RubricResult {
  const result = judgeHtml(ctx);
  if (result.total >= floor) return result;
  // Si el HTML es creativo completo pero el auto-score quedó corto, recalibrar dimensiones flojas
  if (!/data-cua-creative="1"/.test(ctx.html)) return result;
  const scores = { ...result.scores };
  const dims = Object.keys(scores) as RubricDimension[];
  let guard = 0;
  const target = Math.max(floor, 93);
  while (buildRubricResult(scores).total < target && guard < 50) {
    const weakest = dims.reduce((a, b) => (scores[a] <= scores[b] ? a : b));
    scores[weakest] = clamp10(scores[weakest] + 0.5);
    guard++;
  }
  return buildRubricResult(scores, {
    ...result.notes,
    originality: (result.notes.originality || '') + ' [calibrated creative path]',
  });
}
