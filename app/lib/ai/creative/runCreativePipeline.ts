/**
 * runCreativePipeline — brief → CD (LLM) → DNA → compose → render → tech → judge → revise.
 */

import { runCreativeDirectorAsync } from './creativeDirector';
import { resolveDesignDna, type DesignDna } from './designDna';
import { composeSelection, type CompositionSelection } from './compositionEngine';
import { renderConstrainedHtml } from './constrainedRenderer';
import { applyTechnicalGuarantees } from './technicalGuarantees';
import { judgeWithFloor, judgeHtml } from './rubricJudge';
import { reviseComposition } from './creativeRevision';
import type { CreativeBrief } from './creativeBrief';
import type { RubricResult } from './rubric';
import { PRODUCT_GATES } from './rubric';
import type { AiProvider } from '../providers';
import type { CreativeDirectorSource } from './llmCreativeDirector';

export interface CreativePipelineResult {
  ok: boolean;
  html: string;
  brief: CreativeBrief;
  dna: DesignDna;
  selection: CompositionSelection;
  rubric: RubricResult;
  attempts: number;
  source: 'creative_director';
  directorSource: CreativeDirectorSource;
  directorProvider: AiProvider | 'rules';
}

export async function runCreativePipeline(
  prompt: string,
  lang: 'es' | 'en',
  opts?: {
    clientImageUrls?: string[];
    entropy?: string;
    maxRevisions?: number;
    scoreFloor?: number;
    onProgress?: (step: string, detail?: string) => void;
  }
): Promise<CreativePipelineResult> {
  const maxRevisions = opts?.maxRevisions ?? 3;
  const floor = opts?.scoreFloor ?? PRODUCT_GATES.minPerGeneration;
  const progress = opts?.onProgress;

  progress?.('director', 'Razonando el brief como Director Creativo…');
  const cd = await runCreativeDirectorAsync(prompt, lang, { entropy: opts?.entropy });
  progress?.(
    'director_done',
    cd.source === 'llm'
      ? `Brief resuelto · motor ${cd.provider}`
      : 'Brief resuelto · fallback (sin providers)'
  );

  let brief = cd.brief;
  progress?.('dna', 'Resolviendo Design DNA…');
  let dna = resolveDesignDna(brief);
  progress?.('compose', 'Componiendo layout y componentes…');
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
    progress?.('render', i === 0 ? 'Renderizando bajo contrato…' : `Revisión creativa ${i}…`);
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
    rubric = judgeWithFloor({ html, prompt, brief, dna, selection }, floor);
    if (rubric.total >= floor) break;
    if (i < maxRevisions) {
      const revised = reviseComposition(brief, dna, selection, i + 1);
      brief = revised.brief;
      dna = revised.dna;
      selection = revised.selection;
    }
  }

  progress?.('done', `Director Creativo ${rubric.total}/100`);

  return {
    ok: rubric.total >= floor,
    html,
    brief,
    dna,
    selection,
    rubric,
    attempts,
    source: 'creative_director',
    directorSource: cd.source,
    directorProvider: cd.provider,
  };
}
