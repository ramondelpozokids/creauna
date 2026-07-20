/**
 * runCreativePipeline — brief → CD → DNA → compose → render → tech → judge → revise.
 */

import { runCreativeDirector } from './creativeDirector';
import { resolveDesignDna, type DesignDna } from './designDna';
import { composeSelection, type CompositionSelection } from './compositionEngine';
import { renderConstrainedHtml } from './constrainedRenderer';
import { applyTechnicalGuarantees } from './technicalGuarantees';
import { judgeWithFloor, judgeHtml } from './rubricJudge';
import { reviseComposition } from './creativeRevision';
import type { CreativeBrief } from './creativeBrief';
import type { RubricResult } from './rubric';
import { PRODUCT_GATES } from './rubric';

export interface CreativePipelineResult {
  ok: boolean;
  html: string;
  brief: CreativeBrief;
  dna: DesignDna;
  selection: CompositionSelection;
  rubric: RubricResult;
  attempts: number;
  source: 'creative_director';
}

export async function runCreativePipeline(
  prompt: string,
  lang: 'es' | 'en',
  opts?: { clientImageUrls?: string[]; entropy?: string; maxRevisions?: number; scoreFloor?: number }
): Promise<CreativePipelineResult> {
  const maxRevisions = opts?.maxRevisions ?? 3;
  const floor = opts?.scoreFloor ?? PRODUCT_GATES.minPerGeneration;

  let brief = runCreativeDirector(prompt, lang, { entropy: opts?.entropy });
  let dna = resolveDesignDna(brief);
  let selection = composeSelection(brief, dna);
  let html = '';
  let rubric = judgeHtml({
    html: '',
    prompt,
    brief,
    dna,
    selection,
  });
  let attempts = 0;

  for (let i = 0; i <= maxRevisions; i++) {
    attempts = i + 1;
    html = renderConstrainedHtml({
      brief,
      dna,
      selection,
      clientImageUrls: opts?.clientImageUrls,
    });
    html = applyTechnicalGuarantees(html, {
      prompt,
      lang,
      businessName: brief.businessName,
      wantsWhatsApp: brief.wantsWhatsApp,
    });
    rubric = judgeWithFloor(
      { html, prompt, brief, dna, selection },
      floor
    );
    if (rubric.total >= floor) break;
    if (i < maxRevisions) {
      const revised = reviseComposition(brief, dna, selection, i + 1);
      brief = revised.brief;
      dna = revised.dna;
      selection = revised.selection;
    }
  }

  return {
    ok: rubric.total >= floor,
    html,
    brief,
    dna,
    selection,
    rubric,
    attempts,
    source: 'creative_director',
  };
}
