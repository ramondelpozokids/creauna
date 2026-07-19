/**
 * Módulos de sitio CREAUNA — inyección determinista cuando el cliente los pide.
 * Legales, WhatsApp, scroll-up, redes, blog, noticias, servicios, buscador, carrusel, chat.
 * Datos de contacto: solo del brief / opts — nunca teléfono demo inventado.
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

export interface ClientContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  legalName?: string;
  cif?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  pinterest?: string;
  youtube?: string;
}

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

function normalizePhone(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 9) return undefined;
  if (digits.startsWith('34') && digits.length >= 11) return digits.slice(0, 11);
  if (digits.length === 9 && /^[6789]/.test(digits)) return `34${digits}`;
  if (digits.length >= 10) return digits;
  return undefined;
}

/** Extrae teléfono real del prompt/HTML — sin fallback demo. */
export function extractPhone(prompt: string, html = ''): string | undefined {
  const fromPrompt =
    prompt.match(/(?:\+34|whatsapp|wa\.me\/|tel[eé]fono|m[oó]vil)[^\d]{0,12}(\d[\d\s.-]{7,14}\d)/i)?.[1] ||
    prompt.match(/(\+34\s?)?[6789]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/)?.[0];
  const fromHtml =
    html.match(/wa\.me\/(\d{9,15})/i)?.[1] ||
    html.match(/(\+34[\s-]?)?[6789]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/)?.[0];
  const raw = fromPrompt || fromHtml;
  return raw ? normalizePhone(raw) : undefined;
}

export function extractClientContact(
  prompt: string,
  html = '',
  override?: Partial<ClientContact>
): ClientContact {
  const phone = override?.phone || override?.whatsapp || extractPhone(prompt, html);
  const email =
    override?.email ||
    prompt.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0] ||
    html.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0];
  const address =
    override?.address ||
    prompt.match(/Calle\s+[A-Za-zÁÉÍÓÚáéíóúñÑ][^\n,]{3,60}(?:,\s*\d{5})?/i)?.[0];
  const cif = override?.cif || prompt.match(/\b(?:CIF|NIF|NIE)\s*[:\-]?\s*([A-Z0-9]{8,12})\b/i)?.[1];
  const legalName =
    override?.legalName ||
    prompt.match(/(?:raz[oó]n\s+social|titular)\s*[:\-]?\s*([^\n]{3,80})/i)?.[1]?.trim();

  const igHandle = prompt.match(/instagram\.com\/([A-Za-z0-9._]{2,30})/i)?.[1];
  const igAt = prompt.match(/(?:^|[\s(,])@([A-Za-z0-9._]{2,30})\b/i)?.[1];
  const ig =
    override?.instagram ||
    (igHandle ? `https://instagram.com/${igHandle}` : undefined) ||
    (igAt && /instagram/i.test(prompt) ? `https://instagram.com/${igAt}` : undefined);
  const fb = override?.facebook || prompt.match(/https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9._/-]+/i)?.[0];
  const tt = override?.tiktok || prompt.match(/https?:\/\/(?:www\.)?tiktok\.com\/@?[A-Za-z0-9._]+/i)?.[0];
  const tw =
    override?.twitter ||
    prompt.match(/https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[A-Za-z0-9_]+/i)?.[0];
  const pin =
    override?.pinterest || prompt.match(/https?:\/\/(?:www\.)?pinterest\.com\/[A-Za-z0-9._/-]+/i)?.[0];
  const yt =
    override?.youtube ||
    prompt.match(/https?:\/\/(?:www\.)?youtube\.com\/(?:@|channel\/|c\/)?[A-Za-z0-9._-]+/i)?.[0];

  return {
    phone,
    whatsapp: override?.whatsapp || phone,
    email,
    address,
    legalName,
    cif,
    instagram: ig,
    facebook: fb,
    tiktok: tt,
    twitter: tw,
    pinterest: pin,
    youtube: yt,
  };
}

function extractBrand(html: string, fallback = 'CREAUNA'): string {
  const m =
    html.match(/<title>([^|<]+)/i)?.[1]?.trim() ||
    html.match(/class="[^"]*logo[^"]*"[^>]*>([^<]{2,40})/i)?.[1]?.trim() ||
    html.match(/>(VELORA|[\wÁÉÍÓÚÑ]{3,20})</i)?.[1];
  return (m || fallback).replace(/\s+/g, ' ').slice(0, 40);
}

const SOCIAL_SVGS: Record<string, { label: string; bg: string; path: string }> = {
  instagram: {
    label: 'Instagram',
    bg: 'background:radial-gradient(circle at 30% 107%,#fdf497 0%,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285AEB 90%)',
    path: '<rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="white" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/>',
  },
  facebook: {
    label: 'Facebook',
    bg: 'background:#1877F2',
    path: '<path fill="white" d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13V9c0-.6.4-1 1-1z"/>',
  },
  tiktok: {
    label: 'TikTok',
    bg: 'background:#010101',
    path: '<path fill="white" d="M19 8.2c-1.4-.1-2.7-.7-3.7-1.7V15a5 5 0 11-5-5c.3 0 .7 0 1 .1v2.3a2.7 2.7 0 100 5.3 2.7 2.7 0 002.7-2.7V2h2.4c.2 1.5 1.1 2.8 2.4 3.5.7.4 1.5.6 2.2.6v2.1z"/>',
  },
  x: {
    label: 'X',
    bg: 'background:#000',
    path: '<path fill="white" d="M17.3 3h2.6l-5.7 6.5L21 21h-5.5l-4.3-5.6L6.2 21H3.6l6.1-7L3 3h5.6l3.9 5.2L17.3 3zm-.9 16.2h1.4L7.7 4.7H6.2l10.2 14.5z"/>',
  },
  pinterest: {
    label: 'Pinterest',
    bg: 'background:#E60023',
    path: '<path fill="white" d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.2-.1-.8-.2-2 0-2.9.2-.8 1.3-5.4 1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.5 1.9 1.5 1.9 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.8-4.2-4.3-4.2-2.9 0-4.7 2.2-4.7 4.5 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.1c0 .2-.1.2-.3.1-1.2-.6-2-2.3-2-3.7 0-3 2.2-5.8 6.3-5.8 3.3 0 5.9 2.4 5.9 5.5 0 3.3-2.1 6-5 6-.9 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.8-.8 1.8-1.2 2.4 1 .3 2 .5 3.1.5 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>',
  },
  youtube: {
    label: 'YouTube',
    bg: 'background:#FF0000',
    path: '<path fill="white" d="M23.5 7.5s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C17 4 12 4 12 4s-5 0-8.3.2c-.5.1-1.5.1-2.3 1-.7.7-.9 2.3-.9 2.3S0 9.4 0 11.2v1.6c0 1.9.2 3.7.2 3.7s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 8.4.2 8.4.2s5 0 8.3-.2c.5-.1 1.5-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.7v-1.6c0-1.8-.2-3.7-.2-3.7zM9.5 15.2V8.8l6.2 3.2-6.2 3.2z"/>',
  },
};

/** Solo redes con URL real del cliente — no inventa handles. */
function socialButtonsHtml(contact: ClientContact): string {
  const map: Record<string, string | undefined> = {
    instagram: contact.instagram,
    facebook: contact.facebook,
    tiktok: contact.tiktok,
    x: contact.twitter,
    pinterest: contact.pinterest,
    youtube: contact.youtube,
  };
  const entries = Object.entries(map).filter(([, href]) => href && /^https?:\/\//i.test(href));
  if (!entries.length) return '';
  return entries
    .map(([key, href]) => {
      const s = SOCIAL_SVGS[key];
      if (!s || !href) return '';
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}" title="${s.label}" style="${s.bg};width:42px;height:42px;border-radius:9999px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.25)">
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${s.path}</svg>
</a>`;
    })
    .filter(Boolean)
    .join('\n');
}

function legalModals(brand: string, lang: 'es' | 'en', contact: ClientContact): {
  links: string;
  dialogsAndScript: string;
} {
  const titular = contact.legalName || brand;
  const extrasEs = [
    contact.cif ? `CIF/NIF: ${contact.cif}.` : '',
    contact.address ? `Domicilio: ${contact.address}.` : '',
    contact.email ? `Email: ${contact.email}.` : '',
    contact.phone ? `Teléfono: +${contact.phone}.` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const extrasEn = [
    contact.cif ? `Tax ID: ${contact.cif}.` : '',
    contact.address ? `Address: ${contact.address}.` : '',
    contact.email ? `Email: ${contact.email}.` : '',
    contact.phone ? `Phone: +${contact.phone}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const pages =
    lang === 'es'
      ? [
          {
            id: 'aviso',
            title: 'Aviso legal',
            body: `<p>Titular: <strong>${titular}</strong>. ${extrasEs}</p><p>Sitio informativo y de catálogo. No se realizan compras ni pagos online en esta web. Queda prohibida la reproducción sin autorización.</p>`,
          },
          {
            id: 'privacidad',
            title: 'Política de privacidad',
            body: `<p>Tratamos datos (nombre, email, teléfono) para responder consultas y encargos conforme al RGPD/LOPDGDD.</p><p>Derechos de acceso, rectificación y supresión${contact.email ? ` vía ${contact.email}` : ' vía el email de contacto'}.</p>`,
          },
          {
            id: 'cookies',
            title: 'Política de cookies',
            body: `<p>Cookies técnicas necesarias y, con consentimiento, analíticas. Puede configurar o rechazar cookies no esenciales en el navegador.</p>`,
          },
          {
            id: 'accesibilidad',
            title: 'Accesibilidad',
            body: `<p>Buscamos cumplimiento WCAG 2.1 AA (contraste, navegación por teclado, textos alternativos). Si detecta barreras, contáctenos.</p>`,
          },
        ]
      : [
          {
            id: 'aviso',
            title: 'Legal notice',
            body: `<p>Owner: <strong>${titular}</strong>. ${extrasEn}</p><p>Informative catalogue site. No online payments.</p>`,
          },
          {
            id: 'privacidad',
            title: 'Privacy policy',
            body: `<p>We process contact data to answer enquiries under applicable law.${contact.email ? ` Contact: ${contact.email}.` : ''}</p>`,
          },
          {
            id: 'cookies',
            title: 'Cookie policy',
            body: `<p>Essential technical cookies and optional analytics with consent.</p>`,
          },
          {
            id: 'accesibilidad',
            title: 'Accessibility',
            body: `<p>We aim for WCAG 2.1 AA. Contact us if you find barriers.</p>`,
          },
        ];

  const dialogs = pages
    .map(
      (p) => `<dialog id="cua-legal-${p.id}" data-cua-mod="legal" class="cua-legal-dialog" style="border:0;border-radius:1rem;padding:0;max-width:640px;width:calc(100% - 2rem);box-shadow:0 25px 50px rgba(0,0,0,.35)">
  <div style="padding:1.5rem 1.75rem 1.25rem;max-height:min(70vh,560px);overflow:auto">
    <div style="display:flex;justify-content:space-between;align-items:start;gap:1rem;margin-bottom:1rem">
      <h2 style="margin:0;font-size:1.35rem;font-family:Georgia,serif">${p.title}</h2>
      <button type="button" data-cua-legal-close style="border:0;background:transparent;font-size:1.5rem;line-height:1;cursor:pointer;opacity:.7" aria-label="Cerrar">×</button>
    </div>
    <div style="font-size:.9rem;line-height:1.65;opacity:.92">${p.body}</div>
  </div>
</dialog>`
    )
    .join('\n');

  const links =
    lang === 'es'
      ? `<nav data-cua-legal-links class="flex flex-wrap gap-4 text-xs opacity-90 py-2">
  <button type="button" data-cua-legal-open="aviso" class="underline bg-transparent border-0 p-0 cursor-pointer text-inherit">Aviso legal</button>
  <button type="button" data-cua-legal-open="privacidad" class="underline bg-transparent border-0 p-0 cursor-pointer text-inherit">Privacidad</button>
  <button type="button" data-cua-legal-open="cookies" class="underline bg-transparent border-0 p-0 cursor-pointer text-inherit">Cookies</button>
  <button type="button" data-cua-legal-open="accesibilidad" class="underline bg-transparent border-0 p-0 cursor-pointer text-inherit">Accesibilidad</button>
</nav>`
      : `<nav data-cua-legal-links class="flex flex-wrap gap-4 text-xs opacity-90 py-2">
  <button type="button" data-cua-legal-open="aviso" class="underline bg-transparent border-0 p-0 cursor-pointer text-inherit">Legal</button>
  <button type="button" data-cua-legal-open="privacidad" class="underline bg-transparent border-0 p-0 cursor-pointer text-inherit">Privacy</button>
  <button type="button" data-cua-legal-open="cookies" class="underline bg-transparent border-0 p-0 cursor-pointer text-inherit">Cookies</button>
  <button type="button" data-cua-legal-open="accesibilidad" class="underline bg-transparent border-0 p-0 cursor-pointer text-inherit">Accessibility</button>
</nav>`;

  const script = `<script>
(function(){
  function openId(id){var d=document.getElementById('cua-legal-'+id);if(d&&d.showModal)d.showModal();else if(d)d.setAttribute('open','');}
  function closeEl(d){if(d&&d.close)d.close();else if(d)d.removeAttribute('open');}
  document.querySelectorAll('[data-cua-legal-open]').forEach(function(btn){
    btn.addEventListener('click',function(e){e.preventDefault();openId(btn.getAttribute('data-cua-legal-open'));});
  });
  document.querySelectorAll('[data-cua-legal-close]').forEach(function(btn){
    btn.addEventListener('click',function(){closeEl(btn.closest('dialog'));});
  });
  document.querySelectorAll('dialog[data-cua-mod=legal]').forEach(function(d){
    d.addEventListener('click',function(e){if(e.target===d)closeEl(d);});
  });
  document.querySelectorAll('a[href="#aviso-legal"],a[href="#privacidad"],a[href="#cookies"],a[href="#accesibilidad"],a[href="#mapa-sitio"],a[href="#legal-notice"],a[href="#privacy"],a[href="#sitemap"],a[href*="aviso-legal"],a[href*="privacidad"],a[href*="cookies"],a[href*="accesibilidad"]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var h=(a.getAttribute('href')||'').toLowerCase();
      if(h.indexOf('aviso')>=0||h.indexOf('legal-notice')>=0||h.indexOf('legal')>=0&&h.indexOf('priv')<0)openId('aviso');
      else if(h.indexOf('priv')>=0||h==='privacy')openId('privacidad');
      else if(h.indexOf('cookie')>=0)openId('cookies');
      else if(h.indexOf('acces')>=0)openId('accesibilidad');
      else openId('aviso');
    });
  });
})();
</script>`;

  return { links, dialogsAndScript: `${dialogs}\n${script}` };
}

/** Quita bloques legales a pantalla completa (van en modales del footer). */
function stripInlineLegalSections(html: string): string {
  let out = html
    .replace(
      /<section[^>]*(?:id=["'](?:aviso-legal|privacidad|cookies|accesibilidad|mapa-sitio|terminos|legal-notice|privacy|sitemap)["']|data-cua-mod=["']legal["'])[^>]*>[\s\S]*?<\/section>/gi,
      ''
    )
    .replace(
      /<section\b[^>]*>\s*(?:<div[^>]*>\s*)*<h[12][^>]*>\s*(?:Pol[ií]tica de Privacidad|Pol[ií]tica de Cookies|Aviso Legal|Accesibilidad|Mapa del [Ss]itio)[\s\S]*?<\/section>/gi,
      ''
    )
    .replace(
      /<(?:h1|h2)[^>]*>\s*(?:Pol[ií]tica de Privacidad|Pol[ií]tica de Cookies|Aviso Legal|Accesibilidad)\s*<\/(?:h1|h2)>[\s\S]*?(?=<footer\b|<section\b|$)/gi,
      ''
    );
  // Nav legal suelta fuera del footer (botones blancos feos)
  out = out.replace(
    /(<\/footer>)([\s\S]*?)(<\/body>)/i,
    (_m, foot: string, between: string, bodyEnd: string) => {
      const cleaned = between.replace(/<nav[^>]*data-cua-legal-links[^>]*>[\s\S]*?<\/nav>/gi, '');
      return foot + cleaned + bodyEnd;
    }
  );
  return out;
}

function footerAlreadyHasLegalLinks(html: string): boolean {
  const foot = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] || '';
  return /aviso\s*legal|privacidad|cookies|accesibilidad/i.test(foot);
}

function widgetsHtml(phone: string | undefined, lang: 'es' | 'en'): string {
  const wa = phone
    ? `<a href="https://wa.me/${phone}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:58px;height:58px;border-radius:9999px;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,.5)">
<svg width="30" height="30" viewBox="0 0 24 24"><path fill="#fff" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm4.43 12.39c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>
</a>`
    : `<a href="#contacto" data-cua-wa-placeholder aria-label="${lang === 'es' ? 'Añade tu WhatsApp' : 'Add your WhatsApp'}" title="${lang === 'es' ? 'Añade tu WhatsApp en el brief' : 'Add WhatsApp in your brief'}" style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:58px;height:58px;border-radius:9999px;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,.5);opacity:.85;font-size:11px;color:#fff;font-weight:700;text-align:center;padding:4px;line-height:1.1;text-decoration:none">${lang === 'es' ? 'Añade<br/>WA' : 'Add<br/>WA'}</a>`;

  return `<div id="cua-site-widgets" data-cua-mod="widgets">
${wa}
<button type="button" id="cua-scroll-top" aria-label="Volver arriba" style="position:fixed;bottom:1.5rem;right:5.5rem;z-index:9999;width:48px;height:48px;border-radius:9999px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.25);display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.4)">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>
</div>
<script>
(function(){var b=document.getElementById('cua-scroll-top');if(!b)return;window.addEventListener('scroll',function(){b.style.display=window.scrollY>320?'inline-flex':'none';});b.onclick=function(){window.scrollTo({top:0,behavior:'smooth'});};})();
</script>`;
}

function blogSection(lang: 'es' | 'en'): string {
  const items =
    lang === 'es'
      ? ['Tendencias de temporada', 'Cómo cuidar tus prendas', 'Lookbook detrás de cámaras']
      : ['Season trends', 'How to care for garments', 'Lookbook behind the scenes'];
  return `<section id="blog" data-cua-mod="blog" class="py-20 px-6 max-w-6xl mx-auto"><h2 class="text-3xl text-center mb-10">Blog</h2><div class="grid md:grid-cols-3 gap-6">${items
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

function servicesSection(lang: 'es' | 'en', prompt = ''): string {
  const bakery = /panader|bollería|pasteler|bakery|masa madre/i.test(prompt);
  const items = bakery
    ? lang === 'es'
      ? ['Encargos personalizados', 'Catering para eventos', 'Pan por encargo para negocios', 'Asesoramiento de producto']
      : ['Custom orders', 'Event catering', 'Wholesale bread', 'Product advice']
    : lang === 'es'
      ? ['Asesoramiento de estilo', 'Envíos premium', 'Devoluciones fáciles', 'Personalización']
      : ['Style advice', 'Premium shipping', 'Easy returns', 'Personalization'];
  return `<section id="servicios" data-cua-mod="services" class="py-20 px-6 max-w-6xl mx-auto"><h2 class="text-3xl text-center mb-10">${lang === 'es' ? 'Servicios' : 'Services'}</h2><div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">${items
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
  opts: {
    prompt: string;
    lang: 'es' | 'en';
    businessName?: string;
    imageUrls?: string[];
    contact?: Partial<ClientContact>;
  }
): string {
  if (!html) return html;
  const modules = detectRequestedModules(opts.prompt);
  if (!modules.length) return html;

  const brand = opts.businessName || extractBrand(html);
  const contact = extractClientContact(opts.prompt, html, opts.contact);
  const lang = opts.lang;
  let out = html;
  const applied: string[] = [];

  if (modules.includes('legal')) {
    out = stripInlineLegalSections(out);
    const legal = legalModals(brand, lang, contact);
    const hasOpeners = /data-cua-legal-open=/i.test(out);
    if (!hasOpeners) {
      if (footerAlreadyHasLegalLinks(out)) {
        // Footer ya tiene columna legal: solo modales + cablear <a href="#…">
        out = insertBeforeBodyEnd(out, legal.dialogsAndScript);
      } else {
        // Insertar links DENTRO del footer, antes del copyright si existe
        if (/<\/footer>/i.test(out)) {
          if (/©|todos los derechos|all rights reserved/i.test(out)) {
            out = out.replace(
              /(<p[^>]*>[^<]*(?:©|todos los derechos|all rights reserved)[^<]*<\/p>)/i,
              `${legal.links}\n$1`
            );
          } else {
            out = insertBeforeFooterEnd(out, legal.links);
          }
        } else {
          out = insertBeforeBodyEnd(out, legal.links);
        }
        out = insertBeforeBodyEnd(out, legal.dialogsAndScript);
      }
    } else if (!/<dialog[^>]*id=["']cua-legal-/i.test(out)) {
      out = insertBeforeBodyEnd(out, legal.dialogsAndScript);
    }
    applied.push('legal');
  }

  if (modules.includes('social') && !/data-cua-socials/i.test(out)) {
    const socials = socialButtonsHtml(contact);
    if (socials) {
      out = insertBeforeFooterEnd(
        out,
        `<div class="flex flex-wrap gap-3 justify-center py-8" data-cua-socials data-cua-mod="social">${socials}</div>`
      );
      applied.push('social');
    }
  }

  if (modules.includes('blog') && !/data-cua-mod=["']blog["']/i.test(out)) {
    out = insertBeforeFooterEnd(out, blogSection(lang));
    applied.push('blog');
  }
  if (modules.includes('news') && !/data-cua-mod=["']news["']/i.test(out)) {
    out = insertBeforeFooterEnd(out, newsSection(lang));
    applied.push('news');
  }
  if (
    modules.includes('services') &&
    !/data-cua-mod=["']services["']/i.test(out) &&
    !/id=["']servicios["']/i.test(out) &&
    !/Nuestros Servicios|Our Services/i.test(out)
  ) {
    out = insertBeforeFooterEnd(out, servicesSection(lang, opts.prompt));
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
    (!/data-cua-mod=["']widgets["']|cua-scroll-top/i.test(out) ||
      (!/wa\.me\//i.test(out) && !/data-cua-wa-placeholder/i.test(out)))
  ) {
    out = out.replace(
      /<div id="cua-site-widgets"[\s\S]*?<\/div>\s*<script>[\s\S]*?cua-scroll-top[\s\S]*?<\/script>/i,
      ''
    );
    out = insertBeforeBodyEnd(out, widgetsHtml(contact.whatsapp || contact.phone, lang));
    applied.push('widgets');
  }

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
  return lang === 'es' ? `He añadido: ${list}.` : `Added: ${list}.`;
}
