/**
 * Post-proceso de catálogo: grids 3/6, sin placeholder CREAUNA, sin fotos repetidas,
 * legales fuera del flujo principal.
 */
import { IMAGE_BANK } from './imageBank';
import { isBakeryShopPrompt, isBarbershopContext } from './businessProfiles';
import { promptWantsWhatsApp } from './siteChrome';

const BAKERY_POOL = [
  ...IMAGE_BANK.bakery.bread,
  ...IMAGE_BANK.bakery.pastry,
  ...IMAGE_BANK.bakery.cakes,
  ...IMAGE_BANK.bakery.gallery,
];

const BARBER_POOL = [
  IMAGE_BANK.barber.hero,
  IMAGE_BANK.barber.about,
  ...IMAGE_BANK.barber.gallery,
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
  const pool = [...new Set([...packUrls.filter((u) => /^https?:\/\//i.test(u)), ...BAKERY_POOL, ...BARBER_POOL])];
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
      const head = open + body.slice(0, 500);
      if (
        !/id=["'](?:productos|products|galeria|gallery|panes|bolleria|pasteles|servicios|services|por-que|why|horario|hours)/i.test(
          open
        ) &&
        !/Nuestros Productos|Nuestra Galer[ií]a|Productos Artesanales|\bPanes\b|Boller[ií]a|Pasteles y Tartas|Galería de Sabores|Nuestros Servicios|Por qu[eé] eleg|Nuestro Horario|Horario/i.test(
          head
        )
      ) {
        return full;
      }
      const b = body
        .replace(/\b(?:sm|md|lg|xl):grid-cols-[24567]\b/g, (m) => m.replace(/-[24567]$/, '-3'))
        .replace(/\bgrid-cols-[24567]\b/g, 'grid-cols-3');
      return `${open}${b}${close}`;
    }
  );
}

/** Hero + sobre nosotros + galería barbería — FUERZA banco barber (Unsplash moda no se respeta). */
export function applyBarbershopSectorImages(html: string): string {
  let out = html;
  const hero = IMAGE_BANK.barber.hero;
  const about = IMAGE_BANK.barber.about;
  const gallery = IMAGE_BANK.barber.gallery;
  const pool = [hero, about, ...gallery];
  let cursor = 0;
  const next = () => {
    const u = pool[cursor % pool.length];
    cursor += 1;
    return u;
  };

  // 1) TODAS las <img> → banco barber (moda “trusted” también se pisa)
  out = out.replace(/<img\b([^>]*?)\/?\s*>/gi, (_full, attrs: string) => {
    let a = String(attrs || '').replace(/\s*\/\s*$/, '');
    const url = next().replace(/"/g, '%22');
    if (/\bsrc\s*=/i.test(a)) {
      a = a.replace(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i, `src="${url}"`);
    } else {
      a = ` src="${url}"` + a;
    }
    if (!/\breferrerpolicy\s*=/i.test(a)) a += ` referrerpolicy="no-referrer"`;
    return `<img${a}>`;
  });

  // 2) CSS background url(...) → barber
  out = out.replace(/url\(\s*(['"]?)(https?:\/\/[^)'"\s]+)\1\s*\)/gi, () => {
    return `url('${next().replace(/'/g, '%27')}')`;
  });

  // 3) Hero: primera sección con H1 o id hero → foto hero fija
  out = out.replace(
    /(<section\b[^>]*(?:id=["'](?:inicio|hero|home)["']|class=["'][^"']*hero)[^>]*>[\s\S]{0,6000}?<img\b[^>]*\bsrc=)(["'])([^"']*)\2/i,
    `$1$2${hero}$2`
  );
  out = out.replace(
    /(<section\b[^>]*>)([\s\S]*?<h1\b[\s\S]*?)(<\/section>)/i,
    (full, open: string, body: string, close: string) => {
      const body2 = body.replace(/<img\b([^>]*?)\bsrc=(["'])[^"']*\2/i, `<img$1 src=$2${hero}$2`);
      return `${open}${body2}${close}`;
    }
  );

  // 4) Sobre nosotros → about fijo
  out = out.replace(
    /(<section\b[^>]*(?:id=["'](?:nosotros|about|sobre)["']|Sobre\s+Nosotros)[\s\S]{0,8000}?<img\b[^>]*\bsrc=)(["'])([^"']*)\2/i,
    `$1$2${about}$2`
  );

  // 5) Galería: SIEMPRE 6 fotos barber en grid 3 cols (tira moda / 1 sola img / vacío)
  out = out.replace(
    /(<section\b[^>]*(?:id=["'](?:galeria|gallery)["']|Nuestra\s+Galer[ií]a|Galer[ií]a)[^>]*>)([\s\S]*?)(<\/section>)/i,
    (_full, open: string, body: string, close: string) => {
      const title =
        body.match(/<h[12][^>]*>[\s\S]*?<\/h[12]>/i)?.[0] ||
        '<h2 class="text-3xl text-center mb-4">Nuestra Galería</h2>';
      const sub = body.match(/<p[^>]*>[\s\S]*?<\/p>/i)?.[0] || '';
      const tiles = gallery
        .slice(0, 6)
        .map(
          (src, idx) =>
            `<div class="rounded-xl overflow-hidden aspect-square shadow-sm"><img src="${src}" alt="Trabajo barbería ${idx + 1}" class="w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer" /></div>`
        )
        .join('\n');
      const grid = `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto mt-8">${tiles}</div>`;
      return `${open}\n<div class="max-w-6xl mx-auto px-6 py-16 text-center">${title}\n${sub}\n${grid}</div>\n${close}`;
    }
  );

  // Si no había sección galería, inyectar antes del footer
  if (!/id=["'](?:galeria|gallery)["']/i.test(out)) {
    const tiles = gallery
      .slice(0, 6)
      .map(
        (src, idx) =>
          `<div class="rounded-xl overflow-hidden aspect-square"><img src="${src}" alt="Galería ${idx + 1}" class="w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer" /></div>`
      )
      .join('\n');
    const block = `<section id="galeria" class="py-20 px-6 bg-black"><div class="max-w-6xl mx-auto text-center"><h2 class="text-3xl mb-8">Nuestra Galería</h2><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">${tiles}</div></div></section>`;
    out = /<\/footer>/i.test(out)
      ? out.replace(/<footer\b/i, `${block}\n<footer`)
      : out.replace(/<\/body>/i, `${block}\n</body>`);
  }

  return out;
}

/** Sustituye embeds Google Maps rotos (pb= / Invalid request) por q= + address. */
export function fixGoogleMapsEmbeds(html: string, addressHint?: string): string {
  const fromHtml =
    html.match(/Calle\s+[A-Za-zÁÉÍÓÚáéíóúñÑ][^<]{5,80}/i)?.[0]?.replace(/\s+/g, ' ').trim() ||
    html.match(/\d{5}\s+[A-Za-zÁÉÍÓÚáéíóúñÑ][^<,]{2,40}/)?.[0];
  const address =
    addressHint ||
    fromHtml ||
    'Calle Alto del León, 2, Puente de Vallecas, 28038 Madrid';
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  let out = html.replace(
    /<iframe\b([^>]*?)>/gi,
    (full, attrs: string) => {
      if (!/google\.(?:com|es).*maps|maps\.google/i.test(full + attrs)) return full;
      let a = String(attrs);
      if (/\bsrc\s*=/i.test(a)) {
        a = a.replace(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i, `src="${embed}"`);
      } else {
        a += ` src="${embed}"`;
      }
      if (!/\btitle\s*=/i.test(a)) a += ` title="Mapa"`;
      if (!/\bloading\s*=/i.test(a)) a += ` loading="lazy"`;
      if (!/\breferrerpolicy\s*=/i.test(a)) a += ` referrerpolicy="no-referrer-when-downgrade"`;
      return `<iframe${a}>`;
    }
  );

  // Placeholder / error box sin iframe → inyectar mapa en bloques “dónde encontrarnos / ubicación”
  out = out.replace(
    /(<section\b[^>]*(?:contacto|contact|ubicaci|mapa)[^>]*>[\s\S]*?)(Google Maps Platform rejected|Invalid ['"]pb['"]|D[oó]nde Encontrarnos|Mapa)([\s\S]*?<\/section>)/i,
    (full) => {
      if (/<iframe[^>]*maps\.google/i.test(full)) return full;
      return full.replace(
        /(Google Maps Platform rejected[\s\S]{0,200}|<div[^>]*(?:map|mapa)[^>]*>\s*<\/div>)/i,
        `<iframe title="Mapa" src="${embed}" class="w-full min-h-[280px] border-0 rounded-xl" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
      );
    }
  );

  // Columna mapa vacía / error de texto suelto
  if (/Google Maps Platform rejected|Invalid ['"]?pb['"]?/i.test(out)) {
    out = out.replace(
      /Google Maps Platform rejected your request\.[^<]*/gi,
      ''
    );
    out = out.replace(
      /(D[oó]nde Encontrarnos[\s\S]{0,400}?)(<\/(?:div|section)>)/i,
      `$1<iframe title="Mapa" src="${embed}" class="w-full min-h-[280px] border-0 rounded-xl" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>$2`
    );
  }

  return out;
}

/**
 * Quita páginas legales del flujo (mapa → privacidad → cookies → footer).
 * Solo deben vivir como links/modales en el footer (como Desktop/index.html).
 * Nunca toca el modal overlay #cua-legal-modal ni su script openModal.
 */
export function stripLegalPageDump(html: string): string {
  let out = html;
  const saved: string[] = [];
  const keep = (m: string) => {
    saved.push(m);
    return `<!--CUA_KEEP_LEGAL_${saved.length - 1}-->`;
  };

  out = out.replace(/<dialog\b[\s\S]*?<\/dialog>/gi, keep);
  out = out.replace(/<style[^>]*id=["']cua-legal[^"']*["'][^>]*>[\s\S]*?<\/style>/gi, keep);
  // Modal overlay anidado
  const modalStart = out.search(/<div[^>]*id=["']cua-legal-modal["']/i);
  if (modalStart >= 0) {
    let depth = 0;
    const tagRe = /<\/?div\b[^>]*>/gi;
    tagRe.lastIndex = modalStart;
    let tm: RegExpExecArray | null;
    while ((tm = tagRe.exec(out))) {
      if (/^<\//.test(tm[0])) depth--;
      else depth++;
      if (depth === 0) {
        const block = out.slice(modalStart, tm.index + tm[0].length);
        out = out.slice(0, modalStart) + keep(block) + out.slice(tm.index + tm[0].length);
        break;
      }
    }
  }
  out = out.replace(/<script\b[^>]*>[\s\S]*?openModal[\s\S]*?<\/script>/gi, keep);

  const LEGAL_TITLE =
    'Pol[ií]tica\\s+de\\s+Privacidad|Pol[ií]tica\\s+de\\s+Cookies|Aviso\\s+Legal|Accesibilidad|Mapa\\s+del\\s+[Ss]itio|Privacy\\s+Policy|Cookie\\s+Policy|Pol[ií]tica\\s+de\\s+Protecci[oó]n\\s+de\\s+Datos|Protecci[oó]n\\s+de\\s+Datos|Data\\s+Protection';

  out = out.replace(
    /<section[^>]*(?:id=["'](?:aviso-legal|privacidad|cookies|accesibilidad|mapa-sitio|terminos|legal-notice|privacy|sitemap|proteccion-datos|protecci[oó]n-datos|datos)["']|data-cua-mod=["']legal["'])[^>]*>[\s\S]*?<\/section>/gi,
    ''
  );

  out = out.replace(
    new RegExp(
      `<section\\b[^>]*>\\s*(?:<div[^>]*>\\s*)*<h[12][^>]*>\\s*(?:${LEGAL_TITLE})[\\s\\S]*?<\\/section>`,
      'gi'
    ),
    ''
  );

  out = out.replace(
    new RegExp(
      `<(?:h1|h2)[^>]*>\\s*(?:${LEGAL_TITLE})\\s*<\\/(?:h1|h2)>[\\s\\S]*?(?=<footer\\b|<section\\b[^>]*(?:id=["']contacto|class=["'][^"']*footer)|<!--CUA_KEEP_LEGAL_|<!--CUA_KEEP_DIALOG_|<\\/body>)`,
      'gi'
    ),
    ''
  );

  out = out.replace(
    /<(?:h[23])[^>]*>\s*\d+\.\s*(?:Seguridad de los Datos|Consentimiento|Tipos de Cookies|¿Qué son las cookies\?|Responsable del Tratamiento|Finalidad del Tratamiento|Ejercicio de Derechos|Medidas de Seguridad|Destinatarios de los Datos|Plazo de Conservaci[oó]n)[\s\S]*?(?=<footer\b|<!--CUA_KEEP_LEGAL_|<!--CUA_KEEP_DIALOG_|<\/body>)/gi,
    ''
  );

  out = out.replace(
    /(<\/footer>)([\s\S]*?)(<\/body>)/i,
    (_m, foot: string, between: string, bodyEnd: string) => {
      const cleaned = between
        .replace(/<nav[^>]*data-cua-legal-links[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(
          new RegExp(
            `<section[^>]*>[\\s\\S]*?(?:${LEGAL_TITLE}|Aviso [Ll]egal|Privacidad|Cookies)[\\s\\S]*?<\\/section>`,
            'gi'
          ),
          ''
        )
        .replace(
          new RegExp(
            `<(?:div|article|main)[^>]*>\\s*(?:<h[12][^>]*>\\s*)?(?:${LEGAL_TITLE})[\\s\\S]*?<\\/(?:div|article|main)>`,
            'gi'
          ),
          ''
        );
      return foot + cleaned + bodyEnd;
    }
  );

  out = out.replace(/<!--CUA_KEEP_LEGAL_(\d+)-->/g, (_, i) => saved[Number(i)] || '');
  out = out.replace(/<!--CUA_KEEP_DIALOG_(\d+)-->/g, (_, i) => saved[Number(i)] || '');
  return out;
}

/** Si el footer ya tiene columna legal, no inyectar nav blanca fea; estilo integrado. */
export function styleLegalLinksInFooter(html: string): string {
  return html.replace(
    /<(?:nav|div)([^>]*(?:data-cua-legal-links|footer-legal)[^>]*)>([\s\S]*?)<\/(?:nav|div)>/gi,
    (_m, attrs: string, inner: string) => {
      const styled = inner
        .replace(
          /class="[^"]*"/gi,
          'class="underline bg-transparent border-0 p-0 cursor-pointer text-inherit opacity-90 hover:opacity-100"'
        );
      return `<div${attrs} style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;padding:0.75rem 0;font-size:0.8rem;opacity:0.95">${styled}</div>`;
    }
  );
}

/** Tras el footer solo: modal legal (overlay), scripts, scroll-up. Nada de secciones vacías. */
export function stripJunkAfterFooter(html: string, prompt: string): string {
  const keepWa = promptWantsWhatsApp(prompt);

  return html.replace(
    /(<\/footer>)([\s\S]*?)(<\/body>)/i,
    (_m, foot: string, between: string, bodyEnd: string) => {
      const keep: string[] = [];

      // Modal legal con divs anidados (patrón Desktop/index.html)
      const modalStart = between.search(/<div[^>]*id=["']cua-legal-modal["']/i);
      if (modalStart >= 0) {
        let depth = 0;
        const tagRe = /<\/?div\b[^>]*>/gi;
        tagRe.lastIndex = modalStart;
        let tm: RegExpExecArray | null;
        while ((tm = tagRe.exec(between))) {
          if (/^<\//.test(tm[0])) depth--;
          else depth++;
          if (depth === 0) {
            keep.push(between.slice(modalStart, tm.index + tm[0].length));
            break;
          }
        }
      }

      const re =
        /<(?:dialog|script|style)[\s\S]*?<\/(?:dialog|script|style)>|<div[^>]*(?:cua-site-widgets|cua-chat)[^>]*>[\s\S]*?<\/div>/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(between))) keep.push(m[0]);

      if (keepWa) {
        const floats =
          between.match(/<a[^>]*(?:wa\.me|whatsapp-float|aria-label=["']WhatsApp["'])[^>]*>[\s\S]*?<\/a>/gi) ||
          [];
        keep.push(...floats);
      }

      const cleaned = keep.map((chunk) => {
        if (!keepWa && /cua-site-widgets/i.test(chunk)) {
          return chunk.replace(
            /<a[^>]*(?:wa\.me|whatsapp|aria-label=["']WhatsApp["']|data-cua-wa-placeholder)[^>]*>[\s\S]*?<\/a>/gi,
            ''
          );
        }
        return chunk;
      });

      return `${foot}\n${[...new Set(cleaned)].join('\n')}\n${bodyEnd}`;
    }
  );
}

/** Elimina FAB WhatsApp del documento si el brief no lo pide. */
export function stripUnwantedWhatsApp(html: string, prompt: string): string {
  if (promptWantsWhatsApp(prompt)) return html;
  return html
    .replace(
      /<a[^>]*(?:wa\.me|whatsapp-float|aria-label=["']WhatsApp["']|class=["'][^"']*whatsapp)[^>]*>[\s\S]*?<\/a>/gi,
      ''
    )
    .replace(/<a[^>]*data-cua-wa-placeholder[^>]*>[\s\S]*?<\/a>/gi, '');
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
  } else if (isBarbershopContext(opts.prompt, html)) {
    out = applyBarbershopSectorImages(out);
    out = forceExactThreeOrSixBlocks(out, [...pack, ...BARBER_POOL]);
    out = forceThreeColumnCatalogGrids(out);
    out = fixGoogleMapsEmbeds(
      out,
      opts.prompt.match(/Calle\s+[^\n]+/i)?.[0] ||
        'Calle Alto del León, 2, Puente de Vallecas, 28038 Madrid'
    );
  } else if (pack.length) {
    out = forceExactThreeOrSixBlocks(out, pack);
  }

  // Mapas rotos en cualquier sector
  if (/google\.com\/maps|maps\.google|Invalid ['"]?pb|Google Maps Platform rejected/i.test(out)) {
    out = fixGoogleMapsEmbeds(out);
  }

  out = stripJunkAfterFooter(out, opts.prompt);
  out = stripLegalPageDump(out);
  out = stripUnwantedWhatsApp(out, opts.prompt);
  out = styleLegalLinksInFooter(out);
  // Seguridad: polish nunca debe dejar el documento sin cierre
  if (/<!DOCTYPE\s+html/i.test(out) && !/<\/html>/i.test(out)) {
    if (!/<\/body>/i.test(out)) out += '\n</body>';
    out += '\n</html>';
  }
  return out;
}
