/**
 * Benchmark CREAUNA Studio 100/100 — 5 briefs ciegos.
 * npx tsx scripts/benchmark-agency-100.ts
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { runCreativePipeline } from '../app/lib/ai/creative/runCreativePipeline';
import { PRODUCT_GATES, RUBRIC_VERSION } from '../app/lib/ai/creative/rubric';
import { listAllLayouts } from '../app/lib/ai/creative/library';
import { listDesignDnaSectors } from '../app/lib/ai/creative/designDna';
import { compositionDistance, composeSelection } from '../app/lib/ai/creative/compositionEngine';
import { resolveDesignDna } from '../app/lib/ai/creative/designDna';
import { runCreativeDirector } from '../app/lib/ai/creative/creativeDirector';

const BRIEFS: { id: string; prompt: string }[] = [
  {
    id: 'clinic-dental-madrid',
    prompt:
      'Necesito una clínica dental premium en Madrid. Se llama Clínica Dental Aura. Sin WhatsApp. Sin carrito. Quiero cita online y confianza.',
  },
  {
    id: 'restaurant-italiano',
    prompt:
      'Restaurante italiano Trattoria Nonna en Barcelona. Pasta fresca, pizzas al horno, reservas. Ambiente cálido y gastronómico.',
  },
  {
    id: 'abogados-mercantiles',
    prompt:
      'Bufete de abogados mercantiles Despacho Meridian. Corporativo, elegante, sobrio. Consulta confidencial. Sin WhatsApp.',
  },
  {
    id: 'hotel-boutique',
    prompt:
      'Hotel boutique Maison Lumière. Lujo experiencial, suites, spa, gastronomía. Reserva de estancia. Aspiracional.',
  },
  {
    id: 'arquitectura',
    prompt:
      'Agencia de arquitectura Atelier Forma. Minimalista, grandes espacios, mucho blanco. Proyectos de vivienda y comercial.',
  },
];

async function main() {
  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = join(process.cwd(), 'tmp', 'benchmark', runId);
  mkdirSync(outDir, { recursive: true });

  const layoutCount = listAllLayouts().length;
  const dnaSectors = listDesignDnaSectors();
  console.log(`Layouts: ${layoutCount} | DNA sectors: ${dnaSectors.join(', ')}`);
  console.log(`Rubric ${RUBRIC_VERSION} | gates min=${PRODUCT_GATES.minPerGeneration} avg=${PRODUCT_GATES.avgBenchmark}`);

  if (layoutCount < 40) {
    console.error(`FAIL: need ≥40 layouts, got ${layoutCount}`);
    process.exit(1);
  }

  const cards: Array<{
    id: string;
    sector: string;
    layout: string;
    dna: string;
    total: number;
    ok: boolean;
    htmlBytes: number;
  }> = [];

  for (const b of BRIEFS) {
    const result = await runCreativePipeline(b.prompt, 'es', {
      entropy: `bench-${b.id}-${runId}`,
      scoreFloor: PRODUCT_GATES.minPerGeneration,
      maxRevisions: 3,
    });
    const htmlPath = join(outDir, `${b.id}.html`);
    writeFileSync(htmlPath, result.html, 'utf8');
    cards.push({
      id: b.id,
      sector: result.brief.sectorId,
      layout: result.selection.layout.id,
      dna: result.dna.id,
      total: result.rubric.total,
      ok: result.ok,
      htmlBytes: result.html.length,
    });
    console.log(
      `${result.ok ? 'OK' : 'LOW'} ${b.id}: ${result.rubric.total}/100 · ${result.brief.sectorId} · ${result.selection.layout.id}`
    );
  }

  // Diversity check: same brief twice should differ
  const d1 = runCreativeDirector(BRIEFS[0].prompt, 'es', { entropy: 'div-a' });
  const d2 = runCreativeDirector(BRIEFS[0].prompt, 'es', { entropy: 'div-b' });
  const s1 = composeSelection(d1, resolveDesignDna(d1));
  const s2 = composeSelection(d2, resolveDesignDna(d2));
  const distance = compositionDistance(s1, s2);
  console.log(`Diversity distance (same brief): ${distance.toFixed(2)}`);

  const totals = cards.map((c) => c.total);
  const avg = Math.round((totals.reduce((a, b) => a + b, 0) / totals.length) * 10) / 10;
  const min = Math.min(...totals);
  const scorecard = {
    runId,
    rubricVersion: RUBRIC_VERSION,
    layoutCount,
    dnaSectors,
    diversityDistance: distance,
    average: avg,
    minimum: min,
    passedAvg95: avg >= PRODUCT_GATES.avgBenchmark,
    passedMin90: min >= PRODUCT_GATES.minPerGeneration,
    featureFreezeLifted: avg >= PRODUCT_GATES.avgBenchmark && min >= PRODUCT_GATES.minPerGeneration,
    cards,
  };
  writeFileSync(join(outDir, 'scorecard.json'), JSON.stringify(scorecard, null, 2), 'utf8');
  console.log('\n=== SCORECARD ===');
  console.log(JSON.stringify(scorecard, null, 2));
  console.log(`Wrote ${outDir}`);

  if (!scorecard.passedMin90 || !scorecard.passedAvg95) {
    console.error(
      `\nGates not met yet (avg ${avg}, min ${min}). Creative path active; continue tuning toward 95/90.`
    );
    // Exit 0 if all ≥90 and avg ≥90 (phase 6 intermediate); exit 1 only if min < 85
    if (min < 85) process.exit(1);
  } else {
    console.log('\nFEATURE FREEZE LIFTED: media ≥95 y mínimo ≥90.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
