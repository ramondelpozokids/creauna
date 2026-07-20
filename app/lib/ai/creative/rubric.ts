/**
 * Rúbrica CREAUNA Studio 100/100 — fuente de verdad versionada.
 * Contrato: docs/CREAUNA-STUDIO-100.md
 */

export const RUBRIC_VERSION = '1.0.0';

export const RUBRIC_WEIGHTS = {
  briefComprehension: 10,
  sectorIdentity: 10,
  artDirection: 8,
  composition: 10,
  originality: 10,
  hierarchy: 6,
  typography: 5,
  color: 5,
  visualConsistency: 6,
  responsive: 6,
  accessibility: 5,
  performance: 4,
  conversion: 5,
  storytelling: 5,
  ux: 5,
} as const;

export type RubricDimension = keyof typeof RUBRIC_WEIGHTS;

export type RubricScores = Record<RubricDimension, number>;

export interface RubricResult {
  version: string;
  scores: RubricScores;
  /** 0–100 weighted */
  total: number;
  notes: Partial<Record<RubricDimension, string>>;
  passedGate90: boolean;
  passedGate95: boolean;
}

export const RUBRIC_DIMENSIONS = Object.keys(RUBRIC_WEIGHTS) as RubricDimension[];

export function weightedTotal(scores: RubricScores): number {
  let sum = 0;
  let weightSum = 0;
  for (const dim of RUBRIC_DIMENSIONS) {
    const w = RUBRIC_WEIGHTS[dim];
    const s = Math.max(0, Math.min(10, scores[dim] ?? 0));
    sum += (s / 10) * w;
    weightSum += w;
  }
  return Math.round((sum / weightSum) * 1000) / 10;
}

export function emptyScores(fill = 0): RubricScores {
  const out = {} as RubricScores;
  for (const dim of RUBRIC_DIMENSIONS) out[dim] = fill;
  return out;
}

export function buildRubricResult(
  scores: RubricScores,
  notes: Partial<Record<RubricDimension, string>> = {}
): RubricResult {
  const total = weightedTotal(scores);
  return {
    version: RUBRIC_VERSION,
    scores,
    total,
    notes,
    passedGate90: total >= 90,
    passedGate95: total >= 95,
  };
}

/** Meta de producto (contrato). */
export const PRODUCT_GATES = {
  minPerGeneration: 90,
  avgBenchmark: 95,
} as const;
