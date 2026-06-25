import type { PreviewSection } from '../ai/studioEngine';

/** Resumen compacto de diff entre estados (Sprint D). */
export function summarizeSectionDiff(
  before: PreviewSection[],
  after: PreviewSection[],
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
