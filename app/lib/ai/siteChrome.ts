/**
 * Chrome de sitio: legales, mapa del sitio, WhatsApp, scroll-up y redes con iconos de marca.
 * Se inyecta en HTML fullpage cuando el brief/pedido lo pide (o falta en export).
 */

export function promptWantsSiteChrome(prompt: string): boolean {
  return /aviso\s+legal|privacidad|cookies|mapa\s+del\s+sitio|sitemap|whatsapp|scroll\s*up|volver\s+arriba|redes\s+sociales|instagram|facebook|tiktok|bot[oó]n\s+de\s+whatsapp/i.test(
    prompt
  );
}

function extractPhone(prompt: string, html: string): string {
  const fromPrompt =
    prompt.match(/(?:\+34|whatsapp|tel[eé]fono)[^\d]{0,12}(\d[\d\s]{8,14}\d)/i)?.[1] ||
    prompt.match(/(\+34\s?)?6\d{2}[\s.]?\d{2}[\s.]?\d{2}[\s.]?\d{2}/)?.[0];
  const fromHtml =
    html.match(/wa\.me\/(\d{9,15})/i)?.[1] ||
    html.match(/(\+34[\s-]?)?[67]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/)?.[0];
  const raw = (fromPrompt || fromHtml || '34622481930').replace(/\D/g, '');
  return raw.startsWith('34') ? raw : `34${raw}`;
}

function extractBrand(html: string, fallback = 'VELORA'): string {
  const m =
    html.match(/<title>([^|<]+)/i)?.[1]?.trim() ||
    html.match(/class="[^"]*logo[^"]*"[^>]*>([^<]{2,40})/i)?.[1]?.trim();
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
  const handle = brand.toLowerCase().replace(/\s+/g, '');
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

function legalSectionsHtml(brand: string, lang: 'es' | 'en'): string {
  if (lang === 'en') {
    return `
<section id="legal-notice" class="py-20 px-6 max-w-3xl mx-auto text-sm leading-relaxed">
  <h2 class="text-2xl font-serif mb-4">Legal notice</h2>
  <p>${brand} — website information and ownership. Contact via the details published on this site.</p>
</section>
<section id="privacy" class="py-20 px-6 max-w-3xl mx-auto text-sm leading-relaxed border-t border-white/10">
  <h2 class="text-2xl font-serif mb-4">Privacy policy</h2>
  <p>We process personal data to respond to enquiries and provide services, in line with applicable data-protection law. Contact us to exercise your rights.</p>
</section>
<section id="cookies" class="py-20 px-6 max-w-3xl mx-auto text-sm leading-relaxed border-t border-white/10">
  <h2 class="text-2xl font-serif mb-4">Cookie policy</h2>
  <p>We use technical cookies required for the site to work, and optional analytics cookies with your consent.</p>
</section>
<section id="sitemap" class="py-20 px-6 max-w-3xl mx-auto text-sm leading-relaxed border-t border-white/10">
  <h2 class="text-2xl font-serif mb-4">Sitemap</h2>
  <ul class="list-disc pl-5 space-y-1">
    <li><a href="#inicio" class="underline">Home</a></li>
    <li><a href="#nueva-coleccion" class="underline">Collection</a></li>
    <li><a href="#lookbook" class="underline">Lookbook</a></li>
    <li><a href="#contacto" class="underline">Contact</a></li>
    <li><a href="#privacy" class="underline">Privacy</a></li>
    <li><a href="#cookies" class="underline">Cookies</a></li>
  </ul>
</section>`;
  }
  return `
<section id="aviso-legal" class="py-20 px-6 max-w-3xl mx-auto text-sm leading-relaxed text-inherit">
  <h2 class="text-2xl mb-4" style="font-family:Georgia,serif">Aviso legal</h2>
  <p>Titular: <strong>${brand}</strong>. Este sitio web tiene carácter informativo y comercial. Para ejercer derechos o consultas legales, use los datos de contacto publicados en esta web.</p>
  <p class="mt-3">Queda prohibida la reproducción total o parcial de contenidos sin autorización del titular.</p>
</section>
<section id="privacidad" class="py-20 px-6 max-w-3xl mx-auto text-sm leading-relaxed border-t border-white/10">
  <h2 class="text-2xl mb-4" style="font-family:Georgia,serif">Política de privacidad</h2>
  <p>Tratamos datos personales (nombre, email, teléfono) para responder consultas, pedidos y newsletter, conforme al RGPD y la LOPDGDD. Puede solicitar acceso, rectificación o supresión en el email de contacto del sitio.</p>
</section>
<section id="cookies" class="py-20 px-6 max-w-3xl mx-auto text-sm leading-relaxed border-t border-white/10">
  <h2 class="text-2xl mb-4" style="font-family:Georgia,serif">Política de cookies</h2>
  <p>Usamos cookies técnicas necesarias y, con su consentimiento, cookies analíticas para mejorar la experiencia. Puede configurar su navegador para rechazar cookies no esenciales.</p>
</section>
<section id="mapa-sitio" class="py-20 px-6 max-w-3xl mx-auto text-sm leading-relaxed border-t border-white/10">
  <h2 class="text-2xl mb-4" style="font-family:Georgia,serif">Mapa del sitio</h2>
  <ul class="list-disc pl-5 space-y-1">
    <li><a href="#inicio" class="underline hover:opacity-80">Inicio</a></li>
    <li><a href="#nueva-coleccion" class="underline hover:opacity-80">Nueva colección</a></li>
    <li><a href="#lookbook" class="underline hover:opacity-80">Lookbook</a></li>
    <li><a href="#contacto" class="underline hover:opacity-80">Contacto</a></li>
    <li><a href="#aviso-legal" class="underline hover:opacity-80">Aviso legal</a></li>
    <li><a href="#privacidad" class="underline hover:opacity-80">Privacidad</a></li>
    <li><a href="#cookies" class="underline hover:opacity-80">Cookies</a></li>
  </ul>
</section>`;
}

function widgetsHtml(phoneE164: string): string {
  return `
<div id="cua-site-widgets" data-cua-chrome="widgets">
  <a href="https://wa.me/${phoneE164}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
     style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:60;width:56px;height:56px;border-radius:9999px;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,.45)">
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 1.82c4.46 0 8.09 3.63 8.09 8.09 0 4.46-3.63 8.09-8.09 8.09-1.42 0-2.8-.37-4.01-1.07l-.29-.17-3.12.82.83-3.04-.19-.31a8.03 8.03 0 01-1.22-4.32c0-4.46 3.63-8.09 8.09-8.09zm4.43 10.57c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>
  </a>
  <button type="button" id="cua-scroll-top" aria-label="Volver arriba"
    style="position:fixed;bottom:1.5rem;right:5.25rem;z-index:60;width:48px;height:48px;border-radius:9999px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.2);display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.35)">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
  </button>
</div>
<script>
(function(){
  var btn=document.getElementById('cua-scroll-top');
  if(!btn)return;
  window.addEventListener('scroll',function(){
    btn.style.display=window.scrollY>400?'inline-flex':'none';
  });
  btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
})();
</script>`;
}

function footerLegalLinks(lang: 'es' | 'en'): string {
  return lang === 'es'
    ? `<nav class="flex flex-wrap gap-3 justify-center text-xs opacity-80" data-cua-legal-links>
  <a href="#aviso-legal" class="underline">Aviso legal</a>
  <a href="#privacidad" class="underline">Política de privacidad</a>
  <a href="#cookies" class="underline">Política de cookies</a>
  <a href="#mapa-sitio" class="underline">Mapa del sitio</a>
</nav>`
    : `<nav class="flex flex-wrap gap-3 justify-center text-xs opacity-80" data-cua-legal-links>
  <a href="#legal-notice" class="underline">Legal notice</a>
  <a href="#privacy" class="underline">Privacy</a>
  <a href="#cookies" class="underline">Cookies</a>
  <a href="#sitemap" class="underline">Sitemap</a>
</nav>`;
}

/** Inyecta legales, redes de marca, WhatsApp y scroll-up si faltan. */
export function injectSiteChrome(
  html: string,
  opts: { prompt: string; lang: 'es' | 'en'; businessName?: string }
): string {
  if (!html) return html;
  if (!promptWantsSiteChrome(opts.prompt)) return html;

  const brand = opts.businessName || extractBrand(html);
  const phone = extractPhone(opts.prompt, html);
  let out = html;

  if (!/id=["']aviso-legal["']|id=["']legal-notice["']/i.test(out)) {
    const block = legalSectionsHtml(brand, opts.lang);
    if (/<\/footer>/i.test(out)) {
      out = out.replace(/<\/footer>/i, `</footer>\n${block}`);
    } else if (/<\/body>/i.test(out)) {
      out = out.replace(/<\/body>/i, `${block}\n</body>`);
    } else {
      out += block;
    }
  }

  if (!/data-cua-legal-links/i.test(out)) {
    const links = footerLegalLinks(opts.lang);
    if (/<\/footer>/i.test(out)) {
      out = out.replace(/(<footer[\s\S]*?)(<\/footer>)/i, `$1\n${links}\n$2`);
    }
  }

  if (!/data-cua-socials|instagram\.com|tiktok\.com/i.test(out) || promptWantsSiteChrome(opts.prompt)) {
    if (!/data-cua-socials/i.test(out)) {
      const socials = `<div class="flex flex-wrap gap-3 justify-center py-8" data-cua-socials>${socialButtonsHtml(brand)}</div>`;
      if (/<\/footer>/i.test(out)) {
        out = out.replace(/(<footer[\s\S]*?)(<\/footer>)/i, `$1\n${socials}\n$2`);
      } else if (/<\/body>/i.test(out)) {
        out = out.replace(/<\/body>/i, `${socials}\n</body>`);
      }
    }
  }

  if (!/cua-site-widgets|wa\.me\//i.test(out) || !/cua-scroll-top/i.test(out)) {
    const widgets = widgetsHtml(phone);
    if (/<\/body>/i.test(out)) out = out.replace(/<\/body>/i, `${widgets}\n</body>`);
    else out += widgets;
  }

  return out;
}
