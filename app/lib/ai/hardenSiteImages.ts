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

  out = out.replace(/<img\b([^>]*?)\/?\s*>/gi, (_full, attrs: string) => {
    let a = String(attrs || '').replace(/\s*\/\s*$/, '');
    const srcMatch = a.match(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i);
    const current = srcMatch ? srcMatch[2] ?? srcMatch[3] ?? '' : '';
    // data: en src (fotos subidas enormes / basura) → pack http; SVG solo vía onerror
    const isDataSrc = /^data:image\//i.test(current);
    const needsSwap =
      !current || isDataSrc || isFragileUrl(current) || !isTrustedUrl(current);
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

/**
 * Gate duro post-build: hero + about con foto real, cero src vacíos / placeholders.
 * Si falla, rellena desde el pack — no entrega “casi bien”.
 */
export function ensureHeroPhoto(html: string, heroUrl: string): string {
  if (!html || !heroUrl) return html;
  let out = html;

  const sectionHasPhoto = (body: string) =>
    /<img[^>]+src=["']https?:\/\//i.test(body) ||
    /background-image\s*:\s*url\(\s*['"]?https?:\/\//i.test(body);

  const injectBg = (body: string) => {
    if (sectionHasPhoto(body)) return body;
    const photo = `<div class="absolute inset-0 -z-10" data-cua-hero-bg style="position:absolute;inset:0;z-index:0">
  <img src="${heroUrl.replace(/"/g, '%22')}" alt="Hero" class="w-full h-full object-cover object-center" style="width:100%;height:100%;object-fit:cover" fetchpriority="high" referrerpolicy="no-referrer" />
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.45),rgba(0,0,0,.65))"></div>
</div>`;
    // Asegurar position relative en la sección vía wrapper interno
    return `${photo}${body}`;
  };

  // 1) section id hero/inicio/home o data-cua-hero
  if (/<section[^>]*(?:id=["'](?:inicio|hero|home)["']|data-cua-hero)/i.test(out)) {
    out = out.replace(
      /(<section[^>]*(?:id=["'](?:inicio|hero|home)["']|data-cua-hero)[^>]*>)([\s\S]*?)(<\/section>)/i,
      (_m, open: string, body: string, close: string) => {
        let o = open;
        if (!/relative/i.test(o) && /class="/i.test(o)) {
          o = o.replace(/class="/i, 'class="relative overflow-hidden ');
        } else if (!/relative/i.test(o)) {
          o = o.replace(/>$/, ' class="relative overflow-hidden">');
        }
        return `${o}${injectBg(body)}${close}`;
      }
    );
    return out;
  }

  // 2) Primera <section> que contiene el H1 principal
  out = out.replace(
    /(<section\b[^>]*>)([\s\S]*?<h1\b[\s\S]*?)(<\/section>)/i,
    (_m, open: string, body: string, close: string) => {
      if (sectionHasPhoto(open + body)) return open + body + close;
      let o = open;
      if (!/relative/i.test(o) && /class="/i.test(o)) {
        o = o.replace(/class="/i, 'class="relative overflow-hidden ');
      } else if (!/relative/i.test(o)) {
        o = o.replace(/>$/, ' class="relative overflow-hidden">');
      }
      return `${o}${injectBg(body)}${close}`;
    }
  );
  return out;
}

export function ensureAboutPhoto(html: string, aboutUrl: string): string {
  if (!html || !aboutUrl) return html;

  // Preferir section con id nosotros/about/quienes
  const byId =
    /(<section\b[^>]*(?:id=["'](?:nosotros|about|quienes-somos|quienes)["'])[^>]*>)([\s\S]*?)(<\/section>)/i;
  const byTitle =
    /(<section\b[^>]*>)([\s\S]*?(?:qui[eé]nes\s+somos|sobre\s+nosotros|about\s+us|nuestra\s+(?:historia|empresa)|who\s+we\s+are)[\s\S]*?)(<\/section>)/i;

  const apply = (_m: string, open: string, body: string, close: string) => {
    if (/<img[^>]+src=["']https?:\/\//i.test(body)) return open + body + close;
    let next = body.replace(
      /<div([^>]*style=["'][^"']*(?:gradient|background)[^"']*["'][^>]*)>\s*<\/div>/i,
      `<div$1><img src="${aboutUrl.replace(/"/g, '%22')}" alt="Equipo" class="w-full h-full object-cover rounded-2xl" style="width:100%;height:100%;object-fit:cover;min-height:240px;border-radius:1rem" loading="lazy" referrerpolicy="no-referrer" /></div>`
    );
    if (next === body) {
      next = body.replace(
        /(<div[^>]*(?:style=["'][^"']*min-height[^"']*["']|class=["'][^"']*(?:image|photo|media|about-img)[^"']*["'])[^>]*>)(\s*)(<\/div>)/i,
        `$1<img src="${aboutUrl.replace(/"/g, '%22')}" alt="Equipo" class="w-full h-full object-cover" style="width:100%;height:100%;object-fit:cover" loading="lazy" referrerpolicy="no-referrer" />$3`
      );
    }
    if (next === body) {
      next = `<div data-cua-about-img class="reveal"><img src="${aboutUrl.replace(/"/g, '%22')}" alt="Quiénes somos" class="rounded-2xl w-full aspect-[4/3] object-cover shadow-lg" loading="lazy" referrerpolicy="no-referrer" /></div>\n${body}`;
    }
    return open + next + close;
  };

  if (byId.test(html)) return html.replace(byId, apply);
  if (byTitle.test(html)) return html.replace(byTitle, apply);
  return html;
}

export function gateProfessionalImages(
  html: string,
  urls: string[]
): { html: string; ok: boolean; issues: string[] } {
  const issues: string[] = [];
  let out = html || '';
  // Solo stock http(s) — nunca data: (pesado / fuera de sector)
  const httpsOnly = urls.filter((u) => /^https?:\/\//i.test(u) && !u.startsWith('data:'));
  const pool = reliableImagePool(httpsOnly.length ? httpsOnly : urls.filter((u) => /^https?:\/\//i.test(u)));
  const heroUrl = pool[0];
  const aboutUrl = pool[Math.min(1, pool.length - 1)] || pool[0];

  if (/src=["']\s*["']/i.test(out) || /src=["'][#]/i.test(out)) {
    issues.push('img_src_vacio');
  }
  if (/CREAUNA|data:image\/svg\+xml.*CREAUNA/i.test(out)) {
    issues.push('placeholder_creauna');
  }

  // Quitar data: enormes ya metidos en hero/about
  out = out.replace(
    /(<img[^>]+src=["'])(data:image\/[^"']+)(["'])/gi,
    (_m, pre: string, _data: string, post: string) => `${pre}${heroUrl || ''}${post}`
  );

  out = hardenSiteImages(out, pool);
  out = ensureMinimumGallery(out, pool);
  if (heroUrl) out = ensureHeroPhoto(out, heroUrl);
  if (aboutUrl) out = ensureAboutPhoto(out, aboutUrl);

  const heroOk =
    /data-cua-hero-bg[\s\S]{0,600}<img[^>]+src=["']https?:\/\//i.test(out) ||
    /<section[^>]*>[\s\S]{0,800}<h1\b[\s\S]{0,2000}<img[^>]+src=["']https?:\/\//i.test(out) ||
    /<section[^>]*>[\s\S]{0,400}<img[^>]+src=["']https?:\/\/[\s\S]{0,1500}<h1\b/i.test(out);

  if (!heroOk) issues.push('hero_sin_foto');

  const stillEmpty = /src=["']\s*["']/i.test(out);
  const stillPlaceholder = /src=["'][^"']*CREAUNA/i.test(out);
  // Solo el atributo src del <img> del hero — no el onerror con SVG de respaldo
  const heroImgAttrs = out.match(/data-cua-hero-bg[\s\S]{0,1200}?<img\b([^>]*)>/i)?.[1] || '';
  const heroSrcMatch = heroImgAttrs.match(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i);
  const heroSrc = heroSrcMatch ? heroSrcMatch[2] ?? heroSrcMatch[3] ?? '' : '';
  const stillDataHero = /^data:image\//i.test(heroSrc);
  const imgCount = (out.match(/<img\b/gi) || []).length;
  if (stillEmpty) issues.push('src_vacio_persistente');
  if (stillPlaceholder) issues.push('placeholder_persistente');
  if (stillDataHero) issues.push('hero_data_url');
  if (imgCount < 3) issues.push('pocas_imagenes');

  const ok = heroOk && !stillEmpty && !stillPlaceholder && !stillDataHero && imgCount >= 3;
  return { html: out, ok, issues: ok ? [] : [...new Set(issues)] };
}

export { LAST_RESORT_SVG };
