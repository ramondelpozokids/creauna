/**
 * Garantiza imágenes visibles en HTML generado.
 *
 * Stock de confianza (licencia comercial): Unsplash, Pexels, Pixabay, Burst…
 * Se sustituyen placeholders / source.unsplash / URLs inventadas por el pack.
 * onerror + script de rescate para que nunca quede un hueco vacío.
 * Si el pack falla en runtime → fal.ai / Gemini (ensureVisibleSiteImages).
 */

import {
  FRAGILE_STOCK_HOST,
  isFragileStockUrl,
  isTrustedStockUrl,
} from './stockImages';

const LAST_RESORT_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#3E2723"/><stop offset="100%" stop-color="#8B6F4E"/>
      </linearGradient></defs>
      <rect width="1200" height="800" fill="url(#g)"/>
    </svg>`
  );

export function isFragileUrl(url: string): boolean {
  return isFragileStockUrl(url) || FRAGILE_STOCK_HOST.test(url);
}

export function isTrustedUrl(url: string): boolean {
  return isTrustedStockUrl(url);
}

/** Pool de URLs fiables del pack (Unsplash/Pexels/…) + fal/data. */
export function reliableImagePool(urls: string[]): string[] {
  const trusted = urls.filter((u) => isTrustedUrl(u) && !isFragileUrl(u));
  const unique = [...new Set(trusted.length ? trusted : urls.filter((u) => !isFragileUrl(u)))];
  return unique.length ? unique : [LAST_RESORT_SVG];
}

function nextUrl(pool: string[], i: { n: number }): string {
  const url = pool[i.n % pool.length];
  i.n += 1;
  return url;
}

/**
 * 1) Sustituye placeholders / hosts frágiles por URLs del pack
 * 2) Solo toca <img>, poster= y url() de CSS — no scripts CDN
 * 3) Inyecta onerror + script de rescate + referrerpolicy (ayuda Unsplash)
 */
export function hardenSiteImages(html: string, urls: string[]): string {
  if (!html) return html;
  const pool = reliableImagePool(urls);
  const cursor = { n: 0 };
  let out = html;

  out = out.replace(/<img\b([^>]*?)>/gi, (full, attrs: string) => {
    let a = attrs;
    const srcMatch = a.match(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i);
    const current = srcMatch ? srcMatch[2] ?? srcMatch[3] ?? '' : '';
    const needsSwap = !current || isFragileUrl(current) || !isTrustedUrl(current);
    const url = needsSwap ? nextUrl(pool, cursor) : current;
    if (srcMatch) {
      a = a.replace(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i, `src="${url.replace(/"/g, '%22')}"`);
    } else {
      a = ` src="${url.replace(/"/g, '%22')}"` + a;
    }
    if (!/\bonerror\s*=/i.test(a)) {
      const fb = LAST_RESORT_SVG.replace(/'/g, '%27');
      a += ` onerror="this.onerror=null;this.src='${fb}'"`;
    }
    if (!/\breferrerpolicy\s*=/i.test(a)) {
      a += ` referrerpolicy="no-referrer"`;
    }
    if (!/\bloading\s*=/i.test(a) && !/\bfetchpriority\s*=\s*["']high/i.test(a)) {
      a += ` loading="lazy"`;
    }
    return `<img${a}>`;
  });

  out = out.replace(/\bposter\s*=\s*("([^"]*)"|'([^']*)')/gi, (_m, _q, d1?: string, d2?: string) => {
    const current = d1 ?? d2 ?? '';
    if (!current || isFragileUrl(current) || !isTrustedUrl(current)) {
      return `poster="${nextUrl(pool, cursor).replace(/"/g, '%22')}"`;
    }
    return `poster="${current.replace(/"/g, '%22')}"`;
  });

  out = out.replace(/url\(\s*(['"]?)(https?:\/\/[^)'"\s]+)\1\s*\)/gi, (full, _q: string, url: string) => {
    if (isFragileUrl(url) || !isTrustedUrl(url)) {
      return `url('${nextUrl(pool, cursor).replace(/'/g, '%27')}')`;
    }
    return full;
  });

  out = out.replace(
    /(<meta\b[^>]*(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*content=)(["'])([^"']*)\2/gi,
    (full, pre: string, q: string, url: string) => {
      if (isFragileUrl(url) || !isTrustedUrl(url)) {
        return `${pre}${q}${nextUrl(pool, cursor)}${q}`;
      }
      return full;
    }
  );

  if (!out.includes('__CUA_IMG_GUARD__') && pool.length > 0) {
    const json = JSON.stringify([...pool.slice(0, 23), LAST_RESORT_SVG]);
    const script = `<script>/*__CUA_IMG_GUARD__*/
(function(){
  var P=${json};
  if(!P||!P.length)return;
  var i=0;
  function rescue(el){
    if(!el||el.getAttribute('data-cua-rescued')==='2')return;
    var n=el.getAttribute('data-cua-rescued')==='1'?'2':'1';
    el.setAttribute('data-cua-rescued',n);
    el.src=n==='2'?P[P.length-1]:P[i++%Math.max(1,P.length-1)];
  }
  document.addEventListener('error',function(e){
    var t=e.target;
    if(t&&t.tagName==='IMG')rescue(t);
  },true);
  document.querySelectorAll('img').forEach(function(img){
    if(img.complete&&img.naturalWidth===0)rescue(img);
  });
})();
</script>`;
    if (/<\/body>/i.test(out)) out = out.replace(/<\/body>/i, `${script}\n</body>`);
    else out += script;
  }

  return out;
}

export function ensureMinimumGallery(html: string, urls: string[]): string {
  const pool = reliableImagePool(urls);
  if (pool.length < 2) return html;
  const imgCount = (html.match(/<img\b/gi) || []).length;
  if (imgCount >= 5) return html;

  const galleryImgs = pool
    .slice(0, 6)
    .map(
      (u, idx) =>
        `<img src="${u.replace(/"/g, '%22')}" alt="" class="w-full h-64 object-cover rounded-2xl" loading="lazy" referrerpolicy="no-referrer" data-cua-pack="${idx}" />`
    )
    .join('\n');
  const block = `
<section id="galeria" class="py-20 px-6 max-w-6xl mx-auto" data-cua-gallery>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    ${galleryImgs}
  </div>
</section>`;

  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${block}\n</body>`);
  return html + block;
}

export { LAST_RESORT_SVG };
