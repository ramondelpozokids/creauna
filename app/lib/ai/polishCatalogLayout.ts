/**
 * Post-proceso de catálogo: grids 3/6, sin placeholder CREAUNA, sin fotos repetidas,
 * legales fuera del flujo principal.
 */
import { IMAGE_BANK } from './imageBank';
import { isBakeryShopPrompt } from './businessProfiles';

const BAKERY_POOL = [
  ...IMAGE_BANK.bakery.bread,
  ...IMAGE_BANK.bakery.pastry,
  ...IMAGE_BANK.bakery.cakes,
  ...IMAGE_BANK.bakery.gallery,
];

function isCreaunaPlaceholder(src: string): boolean {
  if (!src || !src.trim()) return true;
  return /CREAUNA|data:image\/svg/i.test(src);
}

function pickBakeryUrl(label: string, i: number, used: Set<string>): string {
  const t = label.toLowerCase();
  const pools = [
    /masa\s*madre|hogaza|centeno|baguette|barra|pan\b|integral|espelta|rustic|rústic|sourdough|rye|loaf|multicereal/i.test(t)
      ? IMAGE_BANK.bakery.bread
      : null,
    /croissant|napolitan|palmera|caracol|boll|ensaimad|magdalena|hojaldre|pastry|brioche|mantequilla/i.test(t)
      ? IMAGE_BANK.bakery.pastry
      : null,
    /tarta|pastel|cake|queso|manzana|zanahoria|cheesecake|pie|tart|chocolate|frutas|milhojas/i.test(t)
      ? IMAGE_BANK.bakery.cakes
      : null,
    /horno|masa|harina|panader|baker|taller|nosotros|about|historia|pasi[oó]n/i.test(t)
      ? [IMAGE_BANK.bakery.about, IMAGE_BANK.bakery.workshop]
      : null,
  ].filter(Boolean) as string[][];

  const pool = pools[0]?.length ? pools[0]! : IMAGE_BANK.bakery.gallery;
  for (let k = 0; k < pool.length; k++) {
    const url = pool[(i + k) % pool.length];
    if (!used.has(url)) {
      used.add(url);
      return url;
    }
  }
  for (const url of BAKERY_POOL) {
    if (!used.has(url)) {
      used.add(url);
      return url;
    }
  }
  return pool[i % pool.length];
}

/** Sustituye SVG «CREAUNA» y src vacíos/rotos por pack panadería. */
export function replaceCreaunaPlaceholders(html: string, packUrls: string[]): string {
  const pool = [...packUrls.filter((u) => /^https?:\/\//i.test(u)), ...BAKERY_POOL];
  let i = 0;
  return html.replace(/<img\b([^>]*?)>/gi, (full, attrs: string) => {
    const srcMatch = attrs.match(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i);
    const src = srcMatch ? srcMatch[2] ?? srcMatch[3] ?? '' : '';
    if (!isCreaunaPlaceholder(src) && /^https?:\/\//i.test(src) && !/placehold|picsum/i.test(src)) {
      return full;
    }
    const url = pool[i++ % pool.length];
    let a = attrs;
    if (srcMatch) {
      a = a.replace(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i, `src="${url.replace(/"/g, '%22')}"`);
    } else {
      a = ` src="${url.replace(/"/g, '%22')}"` + a;
    }
    a = a.replace(/\bonerror\s*=\s*("[^"]*"|'[^']*')/i, '');
    return `<img${a}>`;
  });
}

/** Asigna foto única por producto según título. */
export function matchBakeryProductImages(html: string): string {
  const used = new Set<string>();
  let i = 0;
  return html.replace(
    /<(article|div)([^>]*class=["'][^"']*(?:group|card|product|rounded)[^"']*["'][^>]*)>([\s\S]*?)<\/\1>/gi,
    (full, tag: string, attrs: string, inner: string) => {
      const title =
        inner.match(/<h[1-4][^>]*>\s*([^<]{3,80})\s*<\/h[1-4]>/i)?.[1]?.replace(/&nbsp;/g, ' ').trim() ||
        '';
      if (!title || /galer[ií]a|gallery|hero|logo|servicio|service/i.test(title)) return full;
      if (
        !/pan|boll|tarta|pastel|croissant|masa|hogaza|baguette|barra|centeno|espelta|napolitan|palmera|caracol|queso|manzana|zanahoria|integral|multicereal|rústic|rustic|cake|bread|pastry|chocolate|frutas|milhojas|ensaimad|magdalena/i.test(
          title
        )
      ) {
        return full;
      }
      const url = pickBakeryUrl(title, i++, used);
      const nextInner = inner.replace(
        /(<img\b[^>]*\bsrc=)(["'])([^"']*)\2/i,
        `$1$2${url.replace(/\$/g, '$$$$')}$2`
      );
      return `<${tag}${attrs}>${nextInner}</${tag}>`;
    }
  );
}

/**
 * Recorta o rellena ítems de un grid a exactamente 3 o 6.
 * 1–2 → 3; 4–5 → 3 (quita sueltos); 7–8 → 6; ≥9 → 9.
 */
function normalizeCount(n: number): number {
  if (n <= 0) return 3;
  if (n <= 3) return 3;
  if (n <= 5) return 3; // «o dejas 3 o pones 6» — con 4/5 mejor 3 limpio
  if (n <= 6) return 6;
  if (n <= 8) return 6;
  return 9;
}

function extractTopLevelCards(inner: string): string[] {
  const cards =
    inner.match(
      /<(?:article|div)(?=[^>]*class=["'][^"']*(?:card|product|group|rounded-2xl|rounded-3xl|gallery)[^"']*["'])[^>]*>[\s\S]*?<\/(?:article|div)>/gi
    ) || [];
  if (cards.length) return cards;
  const imgs =
    inner.match(/<(?:a|figure|div)[^>]*>\s*<img\b[^>]*>[\s\S]*?<\/(?:a|figure|div)>/gi) ||
    inner.match(/<img\b[^>]*>/gi) ||
    [];
  return imgs;
}

function galleryTile(src: string, idx: number): string {
  return `<div class="rounded-xl overflow-hidden aspect-square shadow-sm"><img src="${src}" alt="Galería panadería ${idx + 1}" class="w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer" /></div>`;
}

function productPadCard(src: string, idx: number): string {
  return `<article class="rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm">
  <div class="aspect-[4/3] overflow-hidden"><img src="${src}" alt="Producto artesanal ${idx + 1}" class="w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer" /></div>
  <div class="p-5"><h3 class="text-lg" style="font-family:Georgia,serif">Selección del día</h3><p class="text-sm opacity-70 mt-1">Horneado artesanal diario.</p></div>
</article>`;
}

/** Normaliza un contenedor grid a 3/6/9 ítems sin repetir fotos. */
function rebuildGridInner(
  inner: string,
  target: number,
  pool: string[],
  asProducts: boolean,
  usedGlobal: Set<string>
): string {
  const items = extractTopLevelCards(inner);
  const kept = items.slice(0, Math.min(items.length, target));
  const out: string[] = [...kept];

  // Deduplicar src en kept + rellenar
  const localUsed = new Set<string>();
  const deduped = out.map((block, idx) => {
    const srcM = block.match(/\bsrc=["']([^"']+)["']/i);
    let src = srcM?.[1] || '';
    if (!src || isCreaunaPlaceholder(src) || localUsed.has(src) || usedGlobal.has(src)) {
      src = pool.find((u) => !localUsed.has(u) && !usedGlobal.has(u)) || pool[idx % pool.length];
    }
    localUsed.add(src);
    usedGlobal.add(src);
    if (srcM) {
      return block.replace(/\bsrc=["'][^"']*["']/i, `src="${src}"`);
    }
    return block;
  });

  while (deduped.length < target) {
    const src = pool.find((u) => !localUsed.has(u) && !usedGlobal.has(u)) || pool[deduped.length % pool.length];
    localUsed.add(src);
    usedGlobal.add(src);
    deduped.push(
      asProducts ? productPadCard(src, deduped.length) : galleryTile(src, deduped.length)
    );
  }

  return deduped.slice(0, target).join('\n');
}

/** Secciones de productos / panes / bollería / pasteles / galería → 3 o 6. */
export function forceExactThreeOrSixBlocks(html: string, packUrls: string[]): string {
  const pool = [...new Set([...packUrls.filter((u) => /^https?:\/\//i.test(u)), ...BAKERY_POOL])];
  const usedGlobal = new Set<string>();

  return html.replace(
    /(<section\b[^>]*>)([\s\S]*?)(<\/section>)/gi,
    (full, open: string, body: string, close: string) => {
      const head = (open + body.slice(0, 500)).toLowerCase();
      const isGallery = /galer[ií]a|gallery|sabores/.test(head);
      const isProducts =
        /productos|panes|boller[ií]a|pasteles|tartas|cat[aá]logo|colecciones/.test(head) &&
        !/servicios|testimon|opiniones|reseñas|contacto|nosotros|historia/.test(
          head.slice(0, 200)
        );
      if (!isGallery && !isProducts) return full;

      // Buscar el grid más grande de la sección
      let best: { start: number; end: number; open: string; inner: string } | null = null;
      const gridRe = /<div([^>]*\b(?:grid|products-grid|gallery-grid|productos)[^>]*)>([\s\S]*?)<\/div>/gi;
      let m: RegExpExecArray | null;
      while ((m = gridRe.exec(body))) {
        const cards = extractTopLevelCards(m[2]);
        if (cards.length >= 1 && (!best || cards.length > extractTopLevelCards(best.inner).length)) {
          best = {
            start: m.index,
            end: m.index + m[0].length,
            open: m[1],
            inner: m[2],
          };
        }
      }

      // Galería con una sola img suelta (sin grid)
      if (isGallery && !best) {
        const imgs = body.match(/<img\b[^>]*>/gi) || [];
        if (imgs.length > 0 && imgs.length < 3) {
          const tiles = Array.from({ length: 6 }, (_, i) => {
            const src = pool.find((u) => !usedGlobal.has(u)) || pool[i % pool.length];
            usedGlobal.add(src);
            return galleryTile(src, i);
          }).join('\n');
          const injected = `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto mt-10">${tiles}</div>`;
          const cleaned = body.replace(/<img\b[^>]*>/gi, '');
          return `${open}${cleaned.replace(/(<\/h2>[\s\S]*?(?:<\/p>)?)/i, `$1\n${injected}`)}${close}`;
        }
      }

      if (!best) return full;

      const count = extractTopLevelCards(best.inner).length;
      const target = isGallery ? (count <= 3 ? 3 : count <= 6 ? 6 : 9) : normalizeCount(count);
      // Si ya es 3 o 6 o 9, solo dedupe
      const newInner = rebuildGridInner(best.inner, target, pool, isProducts && !isGallery, usedGlobal);
      const gridClass = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto';
      const newGrid = `<div class="${gridClass}">\n${newInner}\n</div>`;
      const newBody = body.slice(0, best.start) + newGrid + body.slice(best.end);
      return `${open}${newBody}${close}`;
    }
  );
}

/** Hero + sobre nosotros con foto panadería (nunca CREAUNA). */
export function applyBakerySectorImages(html: string): string {
  let out = html;
  const hero = IMAGE_BANK.bakery.hero;
  const about = IMAGE_BANK.bakery.about;

  out = out.replace(
    /(<section[^>]*(?:id=["'](?:inicio|hero|home)["']|class=["'][^"']*hero)[^>]*>[\s\S]{0,3500}?<img\b[^>]*\bsrc=)(["'])([^"']*)\2/i,
    `$1$2${hero}$2`
  );
  // Fondo CSS del hero
  out = out.replace(
    /(background(?:-image)?\s*:\s*[^;]*url\()(['"]?)([^)'"]+)(\2\))/i,
    (full, pre: string, q: string, url: string, close: string) => {
      if (/hero|inicio|cover/i.test(full) || isCreaunaPlaceholder(url)) {
        return `${pre}${q}${hero}${close}`;
      }
      return full;
    }
  );
  out = out.replace(
    /(<section[^>]*(?:id=["'](?:nosotros|about|sobre)["']|Nuestra Historia|Sobre Nosotros)[\s\S]{0,4000}?<img\b[^>]*\bsrc=)(["'])([^"']*)\2/i,
    `$1$2${about}$2`
  );
  // Caja vacía / placeholder en nosotros sin img
  out = out.replace(
    /(<section[^>]*(?:nosotros|about|historia|pasi[oó]n)[^>]*>[\s\S]*?)(<\/section>)/i,
    (full, body: string, close: string) => {
      let b = body;
      // Texto «CREAUNA» suelto en un bloque → sustituir por foto
      if (/>\s*CREAUNA\s*</i.test(b) || /CREAUNA/i.test(b) && !/<img\b/i.test(b)) {
        const img = `<img src="${about}" alt="Elaboración artesanal en panadería" class="w-full h-full min-h-[320px] object-cover rounded-2xl shadow-lg" loading="lazy" referrerpolicy="no-referrer" />`;
        b = b.replace(
          /<(div|aside|figure)([^>]*)>([\s\S]*?CREAUNA[\s\S]*?)<\/\1>/i,
          `<$1$2>${img}</$1>`
        );
        if (/>\s*CREAUNA\s*</i.test(b)) {
          b = b.replace(/>\s*CREAUNA\s*</gi, `>${img}<`);
        }
      }
      if (/<img\b/i.test(b)) return `${b}${close}`;
      if (/bg-neutral|bg-gray|bg-zinc|rounded-.*(?:gray|neutral)/i.test(b)) {
        const img = `<img src="${about}" alt="Panadería artesanal" class="w-full h-full object-cover rounded-2xl" loading="lazy" referrerpolicy="no-referrer" />`;
        return (
          b.replace(
            /<(div|aside)([^>]*(?:rounded|aspect|image|foto|media)[^>]*)>([\s\S]*?)<\/\1>/i,
            `<$1$2>${img}</$1>`
          ) + close
        );
      }
      return full;
    }
  );
  // Cualquier «CREAUNA» visible restante en body (no scripts)
  out = out.replace(
    /(<(?:div|span|p|h[1-6]|td)[^>]*>)\s*CREAUNA\s*(<\/)/gi,
    `$1<img src="${about}" alt="Panadería" class="w-full max-h-80 object-cover rounded-xl" loading="lazy" referrerpolicy="no-referrer" />$2`
  );
  return out;
}

export function forceThreeColumnCatalogGrids(html: string): string {
  return html.replace(
    /(<section\b[^>]*>)([\s\S]*?)(<\/section>)/gi,
    (full, open: string, body: string, close: string) => {
      const head = open + body.slice(0, 400);
      if (
        !/id=["'](?:productos|products|galeria|gallery|panes|bolleria|pasteles)/i.test(open) &&
        !/Nuestros Productos|Nuestra Galer[ií]a|Productos Artesanales|\bPanes\b|Boller[ií]a|Pasteles y Tartas|Galería de Sabores/i.test(
          head
        )
      ) {
        return full;
      }
      const b = body
        .replace(/\b(?:sm|md|lg|xl):grid-cols-[245]\b/g, (m) => m.replace(/-[245]$/, '-3'))
        .replace(/\bgrid-cols-[245]\b/g, 'grid-cols-3');
      return `${open}${b}${close}`;
    }
  );
}

/**
 * Quita páginas legales del flujo (mapa → privacidad → cookies → footer).
 * Solo deben vivir como links/modales en el footer.
 */
export function stripLegalPageDump(html: string): string {
  let out = html;

  // Secciones con ids legales
  out = out.replace(
    /<section[^>]*(?:id=["'](?:aviso-legal|privacidad|cookies|accesibilidad|mapa-sitio|terminos|legal-notice|privacy|sitemap)["']|data-cua-mod=["']legal["'])[^>]*>[\s\S]*?<\/section>/gi,
    ''
  );

  // Bloques por título (IA sin ids)
  out = out.replace(
    /<section\b[^>]*>\s*(?:<div[^>]*>\s*)*<h[12][^>]*>\s*(?:Pol[ií]tica de Privacidad|Pol[ií]tica de Cookies|Aviso Legal|Accesibilidad|Mapa del [Ss]itio|Privacy Policy|Cookie Policy)[\s\S]*?<\/section>/gi,
    ''
  );

  // H1/H2 legales sueltos hasta el siguiente section/footer (dump continuo)
  out = out.replace(
    /<(?:h1|h2)[^>]*>\s*(?:Pol[ií]tica de Privacidad|Pol[ií]tica de Cookies|Aviso Legal|Accesibilidad)\s*<\/(?:h1|h2)>[\s\S]*?(?=<footer\b|<section\b[^>]*(?:id=["']contacto|class=["'][^"']*footer)|$)/gi,
    ''
  );

  // Numerados tipo "7. Seguridad de los Datos" entre mapa y footer
  out = out.replace(
    /<(?:h[23])[^>]*>\s*\d+\.\s*(?:Seguridad de los Datos|Consentimiento|Tipos de Cookies|¿Qué son las cookies\?)[\s\S]*?(?=<footer\b)/gi,
    ''
  );

  // Nav legal duplicada FUERA del footer
  out = out.replace(
    /(<\/footer>)([\s\S]*?)(<\/body>)/i,
    (_m, foot: string, between: string, bodyEnd: string) => {
      const cleaned = between
        .replace(/<nav[^>]*data-cua-legal-links[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<section[^>]*>[\s\S]*?(?:Aviso [Ll]egal|Privacidad|Cookies)[\s\S]*?<\/section>/gi, '')
        .replace(/<(?:div|nav)[^>]*>\s*(?:<a[^>]*>\s*)?(?:Aviso legal|Privacidad|Cookies|Accesibilidad)[\s\S]*?<\/(?:div|nav)>/gi, '');
      // Conservar dialogs, scripts, widgets
      return foot + cleaned + bodyEnd;
    }
  );

  return out;
}

/** Si el footer ya tiene columna legal, no inyectar nav blanca fea; estilo integrado. */
export function styleLegalLinksInFooter(html: string): string {
  return html.replace(
    /<nav([^>]*data-cua-legal-links[^>]*)>([\s\S]*?)<\/nav>/gi,
    (_m, attrs: string, inner: string) => {
      const styled = inner
        .replace(
          /class="[^"]*"/gi,
          'class="underline bg-transparent border-0 p-0 cursor-pointer text-inherit opacity-80 hover:opacity-100"'
        )
        .replace(
          /style="[^"]*"/gi,
          'style="background:transparent;border:0;padding:0;cursor:pointer;color:inherit;text-decoration:underline;font-size:inherit"'
        );
      return `<nav${attrs} style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;padding:0.75rem 0;font-size:0.75rem;opacity:0.9">${styled}</nav>`;
    }
  );
}

export function stripJunkAfterFooter(html: string, _prompt: string): string {
  return html.replace(
    /(<\/footer>)([\s\S]*?)(<\/body>)/i,
    (_m, foot: string, between: string, bodyEnd: string) => {
      // Solo conservar dialog, script, widgets flotantes
      const keep: string[] = [];
      const re =
        /<(?:dialog|script)[\s\S]*?<\/(?:dialog|script)>|<div[^>]*(?:cua-site-widgets|cua-chat|whatsapp)[^>]*>[\s\S]*?<\/div>/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(between))) keep.push(m[0]);
      // botones WA/scroll sueltos
      const floats = between.match(/<a[^>]*(?:wa\.me|whatsapp-float)[^>]*>[\s\S]*?<\/a>/gi) || [];
      keep.push(...floats);
      return `${foot}\n${[...new Set(keep)].join('\n')}\n${bodyEnd}`;
    }
  );
}

export function polishCatalogLayout(
  html: string,
  opts: { prompt: string; packUrls?: string[]; variant?: string }
): string {
  const pack = opts.packUrls ? [...opts.packUrls] : [];
  let out = html;

  out = stripLegalPageDump(out);
  out = forceThreeColumnCatalogGrids(out);

  if (isBakeryShopPrompt(opts.prompt) || opts.variant === 'bakery') {
    out = replaceCreaunaPlaceholders(out, pack);
    out = applyBakerySectorImages(out);
    out = matchBakeryProductImages(out);
    out = forceExactThreeOrSixBlocks(out, pack);
    out = replaceCreaunaPlaceholders(out, pack); // segunda pasada por si rebuild dejó huecos
  } else {
    out = forceExactThreeOrSixBlocks(out, pack.length ? pack : BAKERY_POOL);
  }

  out = stripJunkAfterFooter(out, opts.prompt);
  out = stripLegalPageDump(out);
  out = styleLegalLinksInFooter(out);
  return out;
}
