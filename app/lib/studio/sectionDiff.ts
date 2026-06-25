export type DiffSection = { id: number; type: string; html: string };

/** Resumen compacto de diff entre estados (Sprint D). */
export function summarizeSectionDiff(
  before: DiffSection[],
  after: DiffSection[],
  changedSectionIds: number[]
): string {
  if (changedSectionIds.length === 0) return 'Sin cambios en secciones';

  const parts = changedSectionIds.map((id) => {
    const prev = before.find((s) => s.id === id);
    const next = after.find((s) => s.id === id);
    if (!prev || !next) return `#${id}: desconocido`;
    const lenDelta = next.html.length - prev.html.length;
    const sign = lenDelta >= 0 ? '+' : '';
    return `${next.type}#${id} (${sign}${lenDelta} chars)`;
  });

  return parts.join('; ');
}

function normalizeHtml(html: string): string {
  return html.replace(/\s+/g, ' ').trim();
}

/** True si al menos una sección marcada como cambiada tiene HTML distinto. */
export function hasMeaningfulSectionChanges(
  before: DiffSection[],
  after: DiffSection[],
  changedSectionIds: number[]
): boolean {
  if (changedSectionIds.length === 0) return false;
  return changedSectionIds.some((id) => {
    const prev = before.find((s) => s.id === id);
    const next = after.find((s) => s.id === id);
    if (!prev || !next) return false;
    return normalizeHtml(prev.html) !== normalizeHtml(next.html);
  });
}
