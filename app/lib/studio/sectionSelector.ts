import type { PreviewSection } from '../ai/studioEngine';

const FULL_SCOPE_ACTIONS = new Set(['initial', 'regenerate', 'style']);

export function isFullScopeAction(action: string): boolean {
  return FULL_SCOPE_ACTIONS.has(action);
}

/** Determina alcance de secciones para generación (equivalente File Selection en CREAUNA). */
export function selectSectionsForTask(
  sections: PreviewSection[],
  action: string,
  sectionId?: number
): { focusSectionId: number | undefined; fullScope: boolean } {
  if (isFullScopeAction(action) || sections.length === 0) {
    return { focusSectionId: undefined, fullScope: true };
  }

  const focus =
    sectionId !== undefined
      ? sections.find((s) => s.id === sectionId)?.id
      : sections.find((s) => s.type === 'hero')?.id ?? sections[0]?.id;

  return { focusSectionId: focus, fullScope: false };
}

/** Resumen ligero de secciones no foco (reduce tokens en prompt IA). */
export function buildSectionOutline(
  sections: PreviewSection[],
  excludeId?: number
): string {
  return sections
    .filter((s) => s.id !== excludeId)
    .map((s) => `${s.type}#${s.id}`)
    .join(', ');
}

/** Payload mínimo desde cliente cuando hay projectId en servidor. */
export function canUseServerSections(projectId?: string, clientSections?: unknown[]): boolean {
  return typeof projectId === 'string' && projectId.length > 0 && (!clientSections || clientSections.length === 0);
}
