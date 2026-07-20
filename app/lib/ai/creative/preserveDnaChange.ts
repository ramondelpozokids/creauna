/**
 * Phase 8 — changes respetan DesignDna (no rebuild genérico).
 */

export function extractCreativeMeta(html: string): {
  dnaId?: string;
  layoutId?: string;
  seed?: string;
  sector?: string;
  isCreative: boolean;
} {
  const dnaId = html.match(/creauna-dna" content="([^"]+)"/i)?.[1]
    || html.match(/data-cua-dna="([^"]+)"/i)?.[1];
  const layoutId = html.match(/creauna-layout" content="([^"]+)"/i)?.[1]
    || html.match(/data-cua-layout="([^"]+)"/i)?.[1];
  const seed = html.match(/creauna-seed" content="([^"]+)"/i)?.[1];
  const sector = html.match(/creauna-sector" content="([^"]+)"/i)?.[1];
  const isCreative = /data-cua-creative="1"/i.test(html) || Boolean(dnaId);
  return { dnaId, layoutId, seed, sector, isCreative };
}

/** Re-aplica meta tags DNA tras un patch quirúrgico. */
export function preserveCreativeMeta(html: string, meta: ReturnType<typeof extractCreativeMeta>): string {
  if (!meta.isCreative) return html;
  let out = html;
  if (!/data-cua-creative=/i.test(out)) {
    out = out.replace(/<body\b([^>]*)>/i, `<body$1 data-cua-creative="1">`);
  }
  const ensureMeta = (name: string, value?: string) => {
    if (!value) return;
    if (new RegExp(`name="${name}"`, 'i').test(out)) {
      out = out.replace(
        new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*/?>`, 'i'),
        `<meta name="${name}" content="${value}" />`
      );
    } else {
      out = out.replace(/<\/head>/i, `<meta name="${name}" content="${value}" />\n</head>`);
    }
  };
  ensureMeta('creauna-dna', meta.dnaId);
  ensureMeta('creauna-layout', meta.layoutId);
  ensureMeta('creauna-seed', meta.seed);
  ensureMeta('creauna-sector', meta.sector);
  if (meta.dnaId && !/data-cua-dna=/i.test(out)) {
    out = out.replace(/<body\b([^>]*)>/i, `<body$1 data-cua-dna="${meta.dnaId}" data-cua-layout="${meta.layoutId || ''}">`);
  }
  return out;
}

/**
 * Si el HTML es creativo y el pedido es cosmético/contenido,
 * NO se debe hacer rebuildFullPage (destruye DNA).
 */
export function shouldBlockFullRebuild(html: string, changePrompt: string): boolean {
  const meta = extractCreativeMeta(html);
  if (!meta.isCreative) return false;
  // Rebuild solo si el usuario pide rediseño total explícito
  if (/redise[nñ]a\s+toda|from\s+scratch|empezar\s+de\s+cero|rebuild\s+everything|nueva\s+web\s+completa/i.test(changePrompt)) {
    return false;
  }
  return true;
}
