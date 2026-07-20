/**
 * Verify Creative Director — Fase 1–2 smoke.
 * npx tsx scripts/verify-creative-director.ts
 */

import { runCreativeDirector } from '../app/lib/ai/creative/creativeDirector';
import { resolveDesignDna, listDesignDnaSectors } from '../app/lib/ai/creative/designDna';
import { listAllLayouts } from '../app/lib/ai/creative/library';
import { composeSelection, compositionDistance } from '../app/lib/ai/creative/compositionEngine';
import { runCreativePipeline } from '../app/lib/ai/creative/runCreativePipeline';
import { shouldBlockFullRebuild, extractCreativeMeta } from '../app/lib/ai/creative/preserveDnaChange';

function assert(label: string, ok: boolean) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) process.exitCode = 1;
}

async function main() {
  const briefs = [
    'Clínica dental premium Madrid',
    'Restaurante italiano',
    'Abogados mercantiles',
    'Hotel boutique',
    'Agencia de arquitectura',
  ];
  const sectors = new Set<string>();
  for (const b of briefs) {
    const cb = runCreativeDirector(b, 'es');
    sectors.add(cb.sectorId);
    assert(`CreativeBrief no HTML for ${cb.sectorId}`, !('html' in cb));
    assert(`has artDirection ${cb.sectorId}`, Boolean(cb.artDirection));
    const dna = resolveDesignDna(cb);
    assert(`DNA id ${dna.id}`, dna.id.startsWith('dna-'));
  }
  assert('5 distinct sectors', sectors.size >= 5);
  assert('layouts ≥40', listAllLayouts().length >= 40);
  assert('layouts ≥120 scaled', listAllLayouts().length >= 120);
  assert('DNA sectors include clinic', listDesignDnaSectors().includes('clinic'));

  const a = runCreativeDirector(briefs[0], 'es', { entropy: 'a' });
  const b = runCreativeDirector(briefs[0], 'es', { entropy: 'b' });
  const sa = composeSelection(a, resolveDesignDna(a));
  const sb = composeSelection(b, resolveDesignDna(b));
  assert('diversity distance > 0', compositionDistance(sa, sb) > 0);

  const pipe = await runCreativePipeline(briefs[0], 'es', { entropy: 'verify', scoreFloor: 90 });
  assert('pipeline html', pipe.html.length > 8000);
  assert('pipeline rubric ≥90', pipe.rubric.total >= 90);
  assert('creative meta', extractCreativeMeta(pipe.html).isCreative);
  assert(
    'block rebuild',
    shouldBlockFullRebuild(pipe.html, 'cambia el color del botón')
  );
  assert(
    'allow explicit redesign',
    !shouldBlockFullRebuild(pipe.html, 'rediseña toda la web desde cero')
  );

  console.log(process.exitCode ? 'VERIFY FAILED' : 'VERIFY OK');
}

main();
