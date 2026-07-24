/**
 * Creative Revision — si score < 90, re-elige layout/componentes (no «más densidad»).
 */

import type { CreativeBrief } from './creativeBrief';
import type { DesignDna } from './designDna';
import { composeSelection, type CompositionSelection } from './compositionEngine';
import { makeUniquenessSeed } from './uniquenessSeed';

export function reviseComposition(
  brief: CreativeBrief,
  dna: DesignDna,
  previous: CompositionSelection,
  attempt: number
): { brief: CreativeBrief; dna: DesignDna; selection: CompositionSelection } {
  const newSeed = makeUniquenessSeed(
    `${brief.businessName}:${brief.sectorId}:${previous.layout.id}`,
    `rev-${attempt}-${brief.uniquenessSeed}`
  );
  const nextBrief: CreativeBrief = {
    ...brief,
    uniquenessSeed: newSeed,
    // Rotate hero family for variety + techo asimétrico
    heroFamily:
      attempt % 3 === 1
        ? 'asymmetricOverlap'
        : attempt % 3 === 2
          ? brief.heroFamily === 'fullBleedCenter'
            ? 'splitMediaRight'
            : brief.heroFamily === 'splitMediaRight'
              ? 'editorialStack'
              : 'fullBleedLeft'
          : brief.heroFamily,
  };
  const nextDna: DesignDna = {
    ...dna,
    id: `dna-${nextBrief.sectorId}-${newSeed.slice(0, 8)}`,
    uniquenessSeed: newSeed,
    heroFamily: nextBrief.heroFamily,
  };
  let selection = composeSelection(nextBrief, nextDna);
  // Force different layout if possible
  if (selection.layout.id === previous.layout.id) {
    selection = composeSelection(
      { ...nextBrief, uniquenessSeed: makeUniquenessSeed(newSeed, `force-${attempt}`) },
      nextDna
    );
  }
  return { brief: nextBrief, dna: nextDna, selection };
}
