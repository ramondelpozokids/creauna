/**
 * Módulos de sitio CREAUNA — inyección determinista cuando el cliente los pide.
 * Legales, WhatsApp, scroll-up, redes, blog, noticias, servicios, buscador, carrusel, chat.
 */

export type SiteModuleId =
  | 'legal'
  | 'widgets'
  | 'social'
  | 'blog'
  | 'news'
  | 'services'
  | 'search'
  | 'carousel'
  | 'chat';

const MODULE_PATTERNS: Record<SiteModuleId, RegExp> = {
  legal:
    /aviso\s+legal|pol[ií]tica\s+de\s+privacidad|privacidad|cookies|mapa\s+del\s+sitio|sitemap|p[aá]ginas?\s+legales?|t[eé]rminos/i,
  widgets:
    /whatsapp|wa\.me|scroll[\s_-]*up|scoll|volver\s+arriba|bot[oó]n\s+arriba|flotante/i,
  social:
    /redes\s+sociales|instagram|facebook|tiktok|\bx\b|twitter|pinterest|youtube|botones?\s+de\s+redes|iconos?\s+de\s+marca/i,
  blog: /\bblog\b|art[ií]culos?\s+del\s+blog|entradas\s+del\s+blog/i,
  news: /\bnoticias\b|novedades|news\b|actualidad/i,
  services: /\bservicios\b|services\b|qu[eé]\s+ofrecemos/i,
  search: /buscador|buscar\s+en\s+(la\s+)?web|search\s+bar|site\s+search/i,
  carousel: /carousel|carrusel|slider|slide\s+show|galer[ií]a\s+desliz/i,
  chat: /chat\s*assistant|asistente\s+(virtual|de\s+chat)|chatbot|chat\s+en\s+vivo|live\s+chat/i,
};

export function detectRequestedModules(prompt: string): SiteModuleId[] {
  return (Object.keys(MODULE_PATTERNS) as SiteModuleId[]).filter((id) =>
    MODULE_PATTERNS[id].test(prompt)
  );
}

export function promptWantsSiteChrome(prompt: string): boolean {
  return detectRequestedModules(prompt).length > 0;
}

/** @deprecated alias */
export const promptWantsModules = promptWantsSiteChrome;

function extractPhone(prompt: string, html: string): string {
  const fromPrompt =
    prompt.match(/(?:\+34|whatsapp|tel[eé]fono)[^\d]{0,12}(\d[\d\s]{8,14}\d)/i)?.[1] ||
    prompt.match(/(\+34\s?)?[67]\d{2}[\s.]?\d{2}[\s.]?\d{2}[\s.]?\d{2}/)?.[0];
  const fromHtml =
    html.match(/wa\.me\/(\d{9,15})/i)?.[1] ||
    html.match(/(\+34[\s-]?)?[67]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/)?.[0];
  const raw = (fromPrompt || fromHtml || '34622481930').replace(/\D/g, '');
  return raw.startsWith('34') ? raw : `34${raw}`;
}

function extractBrand(html: string, fallback = 'CREAUNA'): string {
  const m =
    html.match(/<title>([^|<]+)/i)?.[1]?.trim() ||
    html.match(/class="[^"]*logo[^"]*"[^>]*>([^<]{2,40})/i)?.[1]?.trim() ||
    html.match(/>(VELORA|[\wÁÉÍÓÚÑ]{3,20})</i)?.[1];
  return (m || fallback).replace(/\s+/g, ' ').slice(0, 40);
}

const SOCIAL_SVGS: Record<string, { label: string; href: string; bg: string; path: string }> = {
  instagram: {
    label: 'Instagram',
    href: 'https://instagram.com/',
    bg: 'background:radial-gradient(circle at 30% 107%,#fdf497 0%,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285AEB 90%)',
    path: '<rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="white" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/>',
  },
  facebook: {
    label: 'Facebook',
    href: 'https://facebook.com/',
    bg: 'background:#1877F2',
    path: '<path fill="white" d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13V9c0-.6.4-1 1-1z"/>',
  },
  tiktok: {
    label: 'TikTok',
    href: 'https://tiktok.com/',
    bg: 'background:#010101',
    path: '<path fill="white" d="M19 8.2c-1.4-.1-2.7-.7-3.7-1.7V15a5 5 0 11-5-5c.3 0 .7 0 1 .1v2.3a2.7 2.7 0 100 5.3 2.7 2.7 0 002.7-2.7V2h2.4c.2 1.5 1.1 2.8 2.4 3.5.7.4 1.5.6 2.2.6v2.1z"/>',
  },
  x: {
    label: 'X',
    href: 'https://x.com/',
    bg: 'background:#000',
    path: '<path fill="white" d="M17.3 3h2.6l-5.7 6.5L21 21h-5.5l-4.3-5.6L6.2 21H3.6l6.1-7L3 3h5.6l3.9 5.2L17.3 3zm-.9 16.2h1.4L7.7 4.7H6.2l10.2 14.5z"/>',
  },
  pinterest: {
    label: 'Pinterest',
    href: 'https://pinterest.com/',
    bg: 'background:#E60023',
    path: '<path fill="white" d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.2-.1-.8-.2-2 0-2.9.2-.8 1.3-5.4 1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.5 1.9 1.5 1.9 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.8-4.2-4.3-4.2-2.9 0-4.7 2.2-4.7 4.5 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.1c0 .2-.1.2-.3.1-1.2-.6-2-2.3-2-3.7 0-3 2.2-5.8 6.3-5.8 3.3 0 5.9 2.4 5.9 5.5 0 3.3-2.1 6-5 6-.9 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.8-.8 1.8-1.2 2.4 1 .3 2 .5 3.1.5 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>',
  },
  youtube: {
    label: 'YouTube',
    href: 'https://youtube.com/',
    bg: 'background:#FF0000',
    path: '<path fill="white" d="M23.5 7.5s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C17 4 12 4 12 4s-5 0-8.3.2c-.5.1-1.5.1-2.3 1-.7.7-.9 2.3-.9 2.3S0 9.4 0 11.2v1.6c0 1.9.2 3.7.2 3.7s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 8.4.2 8.4.2s5 0 8.3-.2c.5-.1 1.5-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.7v-1.6c0-1.8-.2-3.7-.2-3.7zM9.5 15.2V8.8l6.2 3.2-6.2 3.2z"/>',
  },
};

function socialButtonsHtml(brand: string): string {
  const handle = brand.toLowerCase().replace(/[^a-z0-9]/g, '') || 'creauna';
  return Object.entries(SOCIAL_SVGS)
    .map(([key, s]) => {
      const href =
        key === 'instagram'
          ? `https://instagram.com/${handle}`
          : key === 'tiktok'
            ? `https://tiktok.com/@${handle}`
            : `${s.href}${handle}`;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}" title="${s.label}" style="${s.bg};width:42px;height:42px;border-radius:9999px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.25)">
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${s.path}</svg>
</a>`;
    })
    .join('\n');
}

function legalBlock(brand: string, lang: 'es' | 'en'): string {
  if (lang !== 'es') {
    return `<section id="legal-notice" data-cua-mod="legal" class="py-16 px-6 max-w-3xl mx-auto text-sm"><h2 class="text-2xl mb-3">Legal notice</h2><p>${brand} website ownership and terms. Contact us via the details on this site.</p></section>
<section id="privacy" data-cua-mod="legal" class="py-16 px-6 max-w-3xl mx-auto text-sm border-t border-white/10"><h2 class="text-2xl mb-3">Privacy policy</h2><p>We process data to answer enquiries under applicable law.</p></section>
<section id="cookies" data-cua-mod="legal" class="py-16 px-6 max-w-3xl mx-auto text-sm border-t border-white/10"><h2 class="text-2xl mb-3">Cookie policy</h2><p>Technical cookies plus optional analytics with consent.</p></section>
<section id="sitemap" data-cua-mod="legal" class="py-16 px-6 max-w-3xl mx-auto text-sm border-t border-white/10"><h2 class="text-2xl mb-3">Sitemap</h2><ul class="list-disc pl-5"><li><a href="#inicio">Home</a></li><li><a href="#privacy">Privacy</a></li><li><a href="#cookies">Cookies</a></li></ul></section>`;
  }
  return `<section id="aviso-legal" data-cua-mod="legal" class="py-16 px-6 max-w-3xl mx-auto text-sm leading-relaxed"><h2 class="text-2xl mb-3" style="font-family:Georgia,serif">Aviso legal</h2><p>Titular: <strong>${brand}</strong>. Sitio informativo y comercial. Queda prohibida la reproducción sin autorización.</p></section>
<section id="privacidad" data-cua-mod="legal" class="py-16 px-6 max-w-3xl mx-auto text-sm leading-relaxed border-t border-white/10"><h2 class="text-2xl mb-3" style="font-family:Georgia,serif">Política de privacidad</h2><p>Tratamos datos (nombre, email, teléfono) para consultas y pedidos conforme al RGPD/LOPDGDD. Derechos: acceso, rectificación y supresión vía email de contacto.</p></section>
<section id="cookies" data-cua-mod="legal" class="py-16 px-6 max-w-3xl mx-auto text-sm leading-relaxed border-t border-white/10"><h2 class="text-2xl mb-3" style="font-family:Georgia,serif">Política de cookies</h2><p>Cookies técnicas necesarias y, con consentimiento, analíticas. Puede rechazarlas en el navegador.</p></section>
<section id="mapa-sitio" data-cua-mod="legal" class="py-16 px-6 max-w-3xl mx-auto text-sm leading-relaxed border-t border-white/10"><h2 class="text-2xl mb-3" style="font-family:Georgia,serif">Mapa del sitio</h2><ul class="list-disc pl-5 space-y-1"><li><a href="#inicio" class="underline">Inicio</a></li><li><a href="#nueva-coleccion" class="underline">Colección</a></li><li><a href="#lookbook" class="underline">Lookbook</a></li><li><a href="#contacto" class="underline">Contacto</a></li><li><a href="#aviso-legal" class="underline">Aviso legal</a></li><li><a href="#privacidad" class="underline">Privacidad</a></li><li><a href="#cookies" class="underline">Cookies</a></li></ul></section>`;
}

function footerLegalLinks(lang: 'es' | 'en'): string {
  return lang === 'es'
    ? `<nav data-cua-legal-links class="flex flex-wrap gap-4 justify-center text-xs opacity-80 py-4"><a href="#aviso-legal" class="underline">Aviso legal</a><a href="#privacidad" class="underline">Privacidad</a><a href="#cookies" class="underline">Cookies</a><a href="#mapa-sitio" class="underline">Mapa del sitio</a></nav>`
    : `<nav data-cua-legal-links class="flex flex-wrap gap-4 justify-center text-xs opacity-80 py-4"><a href="#legal-notice" class="underline">Legal</a><a href="#privacy" class="underline">Privacy</a><a href="#cookies" class="underline">Cookies</a><a href="#sitemap" class="underline">Sitemap</a></nav>`;
}

function widgetsHtml(phone: string): string {
  return `<div id="cua-site-widgets" data-cua-mod="widgets">
<a href="https://wa.me/${phone}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:58px;height:58px;border-radius:9999px;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,.5)">
<svg width="30" height="30" viewBox="0 0 24 24"><path fill="#fff" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm4.43 12.39c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>
</a>
<button type="button" id="cua-scroll-top" aria-label="Volver arriba" style="position:fixed;bottom:1.5rem;right:5.5rem;z-index:9999;width:48px;height:48px;border-radius:9999px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.25);display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.4)">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>
</div>
<script>
(function(){var b=document.getElementById('cua-scroll-top');if(!b)return;window.addEventListener('scroll',function(){b.style.display=window.scrollY>320?'inline-flex':'none';});b.onclick=function(){window.scrollTo({top:0,behavior:'smooth'});};})();
</script>`;
}

function blogSection(lang: 'es' | 'en'): string {
  const title = lang === 'es' ? 'Blog' : 'Blog';
  const items =
    lang === 'es'
      ? ['Tendencias de temporada', 'Cómo cuidar tus prendas', 'Lookbook detrás de cámaras']
      : ['Season trends', 'How to care for garments', 'Lookbook behind the scenes'];
  return `<section id="blog" data-cua-mod="blog" class="py-20 px-6 max-w-6xl mx-auto"><h2 class="text-3xl text-center mb-10">${title}</h2><div class="grid md:grid-cols-3 gap-6">${items
    .map(
      (t, i) =>
        `<article class="rounded-2xl overflow-hidden border border-white/10 bg-white/5"><div class="aspect-[4/3] bg-neutral-800"></div><div class="p-5"><h3 class="text-lg mb-2">${t}</h3><p class="text-sm opacity-70">${lang === 'es' ? 'Artículo ' + (i + 1) : 'Post ' + (i + 1)}</p><a href="#blog" class="text-sm underline mt-3 inline-block">${lang === 'es' ? 'Leer más' : 'Read more'}</a></div></article>`
    )
    .join('')}</div></section>`;
}

function newsSection(lang: 'es' | 'en'): string {
  return `<section id="noticias" data-cua-mod="news" class="py-20 px-6 max-w-4xl mx-auto"><h2 class="text-3xl text-center mb-8">${lang === 'es' ? 'Noticias' : 'News'}</h2><ul class="space-y-4 text-sm">${[1, 2, 3]
    .map(
      (n) =>
        `<li class="border-b border-white/10 pb-4"><strong>${lang === 'es' ? 'Novedad' : 'Update'} ${n}</strong> — ${lang === 'es' ? 'Actualización de colección y eventos.' : 'Collection and events update.'}</li>`
    )
    .join('')}</ul></section>`;
}

function servicesSection(lang: 'es' | 'en'): string {
  const items =
    lang === 'es'
      ? ['Asesoramiento de estilo', 'Envíos premium', 'Devoluciones fáciles', 'Personalización']
      : ['Style advice', 'Premium shipping', 'Easy returns', 'Personalization'];
  return `<section id="servicios" data-cua-mod="services" class="py-20 px-6 max-w-6xl mx-auto"><h2 class="text-3xl text-center mb-10">${lang === 'es' ? 'Servicios' : 'Services'}</h2><div class="grid md:grid-cols-4 gap-4">${items
    .map((t) => `<div class="p-6 rounded-2xl border border-white/10 text-center"><h3 class="font-medium">${t}</h3></div>`)
    .join('')}</div></section>`;
}

function searchBar(lang: 'es' | 'en'): string {
  return `<div data-cua-mod="search" id="cua-site-search" style="position:sticky;top:0;z-index:40;padding:0.75rem 1rem;backdrop-filter:blur(10px);background:rgba(0,0,0,.55)">
<form onsubmit="event.preventDefault();var q=this.q.value.toLowerCase();document.querySelectorAll('section,article').forEach(function(el){var t=(el.innerText||'').toLowerCase();el.style.outline=q&&t.indexOf(q)>=0?'2px solid #C6A75E':'';});" style="max-width:640px;margin:0 auto;display:flex;gap:0.5rem">
<input name="q" type="search" placeholder="${lang === 'es' ? 'Buscar en la web…' : 'Search the site…'}" style="flex:1;padding:0.65rem 1rem;border-radius:9999px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:inherit" />
<button type="submit" style="padding:0.65rem 1.25rem;border-radius:9999px;background:#fff;color:#111;font-size:0.8rem;font-weight:600">${lang === 'es' ? 'Buscar' : 'Search'}</button>
</form></div>`;
}

function carouselSection(lang: 'es' | 'en', imageUrls: string[]): string {
  const imgs = (imageUrls.length ? imageUrls : []).slice(0, 5);
  const slides =
    imgs.length > 0
      ? imgs
          .map(
            (src, i) =>
              `<div class="cua-slide" data-i="${i}" style="min-width:100%;height:420px;background:center/cover no-repeat url('${src.replace(/'/g, '%27')}')"></div>`
          )
          .join('')
      : `<div class="cua-slide" style="min-width:100%;height:420px;background:#222;display:flex;align-items:center;justify-content:center;color:#fff">${lang === 'es' ? 'Carrusel' : 'Carousel'}</div>`;
  return `<section id="carrusel" data-cua-mod="carousel" class="py-16"><h2 class="text-3xl text-center mb-6">${lang === 'es' ? 'Galería' : 'Gallery'}</h2>
<div style="overflow:hidden;max-width:1100px;margin:0 auto;border-radius:1rem;position:relative">
<div id="cua-carousel-track" style="display:flex;transition:transform .5s ease">${slides}</div>
<button type="button" onclick="window.__cuaCarPrev&&window.__cuaCarPrev()" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:#fff;border:0;border-radius:9999px;width:40px;height:40px;cursor:pointer">‹</button>
<button type="button" onclick="window.__cuaCarNext&&window.__cuaCarNext()" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:#fff;border:0;border-radius:9999px;width:40px;height:40px;cursor:pointer">›</button>
</div>
<script>
(function(){var i=0,t=document.getElementById('cua-carousel-track');if(!t)return;var n=t.children.length||1;function go(d){i=(i+d+n)%n;t.style.transform='translateX('+(i*-100)+'%)';}window.__cuaCarPrev=function(){go(-1)};window.__cuaCarNext=function(){go(1)};setInterval(function(){go(1)},5000);})();
</script></section>`;
}

function chatWidget(lang: 'es' | 'en'): string {
  return `<div data-cua-mod="chat" id="cua-chat" style="position:fixed;bottom:6.5rem;right:1.5rem;z-index:9998;font-family:system-ui,sans-serif">
<button type="button" id="cua-chat-toggle" aria-label="Chat" style="width:56px;height:56px;border-radius:9999px;background:#4F46E5;color:#fff;border:0;cursor:pointer;box-shadow:0 8px 24px rgba(79,70,229,.45);font-size:1.25rem">💬</button>
<div id="cua-chat-panel" style="display:none;position:absolute;bottom:70px;right:0;width:300px;background:#111;color:#fff;border-radius:1rem;overflow:hidden;border:1px solid rgba(255,255,255,.15);box-shadow:0 12px 40px rgba(0,0,0,.45)">
<div style="padding:0.75rem 1rem;background:#4F46E5;font-weight:600">${lang === 'es' ? 'Asistente' : 'Assistant'}</div>
<div id="cua-chat-log" style="height:200px;overflow:auto;padding:0.75rem;font-size:0.85rem">${lang === 'es' ? 'Hola, ¿en qué podemos ayudarte?' : 'Hi, how can we help?'}</div>
<form id="cua-chat-form" style="display:flex;gap:0.35rem;padding:0.5rem;border-top:1px solid rgba(255,255,255,.1)"><input id="cua-chat-input" style="flex:1;padding:0.5rem;border-radius:0.5rem;border:0" placeholder="${lang === 'es' ? 'Escribe…' : 'Type…'}" /><button style="padding:0.5rem 0.75rem;border-radius:0.5rem;border:0;background:#4F46E5;color:#fff">${lang === 'es' ? 'Enviar' : 'Send'}</button></form>
</div></div>
<script>
(function(){var t=document.getElementById('cua-chat-toggle'),p=document.getElementById('cua-chat-panel'),f=document.getElementById('cua-chat-form'),log=document.getElementById('cua-chat-log'),inp=document.getElementById('cua-chat-input');if(!t||!p)return;t.onclick=function(){p.style.display=p.style.display==='none'?'block':'none';};if(f)f.onsubmit=function(e){e.preventDefault();if(!inp.value.trim())return;log.innerHTML+='<div style="margin:0.5rem 0;text-align:right"><span style="background:#333;padding:0.35rem 0.6rem;border-radius:0.75rem">'+inp.value.replace(/</g,'&lt;')+'</span></div><div style="margin:0.5rem 0;opacity:.85">${lang === 'es' ? 'Gracias, un asesor te responderá pronto.' : 'Thanks — an advisor will reply soon.'}</div>';inp.value='';log.scrollTop=log.scrollHeight;};})();
</script>`;
}

function insertBeforeBodyEnd(html: string, chunk: string): string {
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${chunk}\n</body>`);
  return html + chunk;
}

function insertBeforeFooterEnd(html: string, chunk: string): string {
  if (/<\/footer>/i.test(html)) return html.replace(/(<\/footer>)/i, `${chunk}\n$1`);
  return insertBeforeBodyEnd(html, chunk);
}

export function injectSiteChrome(
  html: string,
  opts: { prompt: string; lang: 'es' | 'en'; businessName?: string; imageUrls?: string[] }
): string {
  if (!html) return html;
  const modules = detectRequestedModules(opts.prompt);
  if (!modules.length) return html;

  const brand = opts.businessName || extractBrand(html);
  const phone = extractPhone(opts.prompt, html);
  const lang = opts.lang;
  let out = html;
  const applied: string[] = [];

  if (modules.includes('legal') && !/data-cua-mod=["']legal["']|id=["']aviso-legal["']/i.test(out)) {
    out = insertBeforeFooterEnd(out, legalBlock(brand, lang));
    if (!/data-cua-legal-links/i.test(out)) out = insertBeforeFooterEnd(out, footerLegalLinks(lang));
    applied.push('legal');
  }

  if (modules.includes('social') && !/data-cua-socials/i.test(out)) {
    out = insertBeforeFooterEnd(
      out,
      `<div class="flex flex-wrap gap-3 justify-center py-8" data-cua-socials data-cua-mod="social">${socialButtonsHtml(brand)}</div>`
    );
    applied.push('social');
  }

  if (modules.includes('blog') && !/data-cua-mod=["']blog["']/i.test(out)) {
    out = insertBeforeFooterEnd(out, blogSection(lang));
    applied.push('blog');
  }
  if (modules.includes('news') && !/data-cua-mod=["']news["']/i.test(out)) {
    out = insertBeforeFooterEnd(out, newsSection(lang));
    applied.push('news');
  }
  if (modules.includes('services') && !/data-cua-mod=["']services["']/i.test(out)) {
    out = insertBeforeFooterEnd(out, servicesSection(lang));
    applied.push('services');
  }
  if (modules.includes('search') && !/data-cua-mod=["']search["']/i.test(out)) {
    out = /<body[^>]*>/i.test(out)
      ? out.replace(/<body([^>]*)>/i, `<body$1>\n${searchBar(lang)}`)
      : searchBar(lang) + out;
    applied.push('search');
  }
  if (modules.includes('carousel') && !/data-cua-mod=["']carousel["']/i.test(out)) {
    out = insertBeforeFooterEnd(out, carouselSection(lang, opts.imageUrls || []));
    applied.push('carousel');
  }
  if (modules.includes('chat') && !/data-cua-mod=["']chat["']/i.test(out)) {
    out = insertBeforeBodyEnd(out, chatWidget(lang));
    applied.push('chat');
  }

  if (
    modules.includes('widgets') &&
    (!/data-cua-mod=["']widgets["']|cua-scroll-top/i.test(out) || !/wa\.me\//i.test(out))
  ) {
    // Quitar widgets viejos incompletos
    out = out.replace(/<div id="cua-site-widgets"[\s\S]*?<\/div>\s*<script>[\s\S]*?cua-scroll-top[\s\S]*?<\/script>/i, '');
    out = insertBeforeBodyEnd(out, widgetsHtml(phone));
    applied.push('widgets');
  }

  // Marca de cambio garantizada para el diff de créditos
  if (applied.length && !/data-cua-modules-applied=/i.test(out)) {
    const meta = `<!-- cua-modules:${applied.join(',')} -->`;
    out = /<\/head>/i.test(out) ? out.replace(/<\/head>/i, `${meta}\n</head>`) : meta + out;
  }

  return out;
}

export function describeAppliedModules(prompt: string, lang: 'es' | 'en'): string {
  const mods = detectRequestedModules(prompt);
  const labelsEs: Record<SiteModuleId, string> = {
    legal: 'aviso legal, privacidad, cookies y mapa del sitio',
    widgets: 'WhatsApp flotante y scroll arriba',
    social: 'redes con iconos de marca',
    blog: 'sección blog',
    news: 'noticias',
    services: 'servicios',
    search: 'buscador en la web',
    carousel: 'galería carrusel',
    chat: 'asistente de chat',
  };
  const labelsEn: Record<SiteModuleId, string> = {
    legal: 'legal pages and sitemap',
    widgets: 'WhatsApp and scroll-up',
    social: 'brand social buttons',
    blog: 'blog section',
    news: 'news',
    services: 'services',
    search: 'site search',
    carousel: 'carousel gallery',
    chat: 'chat assistant',
  };
  const labels = lang === 'es' ? labelsEs : labelsEn;
  const list = mods.map((m) => labels[m]).join(', ');
  return lang === 'es'
    ? `He añadido: ${list}.`
    : `Added: ${list}.`;
}
