/**
 * Módulos de sitio CREAUNA — inyección determinista cuando el cliente los pide.
 * Legales, WhatsApp, scroll-up, redes, blog, noticias, servicios, buscador, carrusel, chat.
 * Datos de contacto: solo del brief / opts — nunca teléfono demo inventado.
 */

import {
  promptWantsWhatsApp,
  withAgencyChromePrompt,
  AGENCY_LEGAL_FORCE_SUFFIX as POLICY_LEGAL_SUFFIX,
} from './agencyChromePolicy';

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
  return (Object.keys(MODULE_PATTERNS) as SiteModuleId[]).filter((id) => {
    if (id === 'widgets') {
      const wantsScroll =
        /scroll[\s_-]*up|scoll|volver\s+arriba|bot[oó]n\s+arriba/i.test(prompt);
      // «Sin WhatsApp» no debe activar el FAB
      return promptWantsWhatsApp(prompt) || wantsScroll;
    }
    return MODULE_PATTERNS[id].test(prompt);
  });
}

export function promptWantsSiteChrome(prompt: string): boolean {
  return detectRequestedModules(prompt).length > 0;
}

/** @deprecated alias */
export const promptWantsModules = promptWantsSiteChrome;

/**
 * Sufijo que fuerza solo legales de baseline profesional (RGPD).
 * WhatsApp, redes y scroll: SOLO si el cliente los pide en el brief.
 */
export const AGENCY_LEGAL_FORCE_SUFFIX = POLICY_LEGAL_SUFFIX;

/** @deprecated usar AGENCY_LEGAL_FORCE_SUFFIX */
export const AGENCY_CHROME_FORCE_SUFFIX = AGENCY_LEGAL_FORCE_SUFFIX;

export { promptWantsWhatsApp, withAgencyChromePrompt };

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
  const titular = (contact.legalName || brand).replace(/'/g, "\\'");
  const address = (contact.address || '').replace(/'/g, "\\'");
  const email = (contact.email || '').replace(/'/g, "\\'");
  const phone = contact.phone
    ? contact.phone.startsWith('34')
      ? contact.phone.replace(/^34/, '').replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4')
      : contact.phone
    : '';
  const phoneDisp = phone || '';
  const emailDisp = email || '';
  const addrDisp = address || '';

  const pagesEs: Record<string, { title: string; content: string }> = {
    aviso: {
      title: 'Aviso Legal',
      content: `
      <h3>1. Datos identificativos</h3>
      <p>En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002 (LSSICE), se informan los siguientes datos:</p>
      <ul>
        <li>Titular: ${titular}</li>
        ${addrDisp ? `<li>Domicilio: ${addrDisp}</li>` : ''}
        ${phoneDisp ? `<li>Teléfono: ${phoneDisp}</li>` : ''}
        ${emailDisp ? `<li>Email: ${emailDisp}</li>` : ''}
        ${contact.cif ? `<li>CIF/NIF: ${contact.cif}</li>` : ''}
      </ul>
      <h3>2. Objeto</h3>
      <p>El presente sitio web tiene por objeto proporcionar información sobre los servicios ofrecidos por ${titular}.</p>
      <h3>3. Propiedad intelectual</h3>
      <p>Todos los contenidos del sitio web (textos, imágenes, diseños, logotipos, etc.) son propiedad de ${titular} o cuentan con la correspondiente autorización. Queda prohibida su reproducción sin autorización previa.</p>
      <h3>4. Responsabilidad</h3>
      <p>${titular} no se responsabiliza del uso indebido de los contenidos del sitio web. La información tiene carácter meramente informativo. No se realizan compras ni pagos online en esta web.</p>
      <h3>5. Legislación aplicable</h3>
      <p>Las presentes condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales competentes.</p>`,
    },
    privacidad: {
      title: 'Política de Privacidad',
      content: `
      <h3>1. Responsable del tratamiento</h3>
      <ul>
        <li>Identidad: ${titular}</li>
        ${addrDisp ? `<li>Dirección: ${addrDisp}</li>` : ''}
        ${phoneDisp ? `<li>Teléfono: ${phoneDisp}</li>` : ''}
        ${emailDisp ? `<li>Email: ${emailDisp}</li>` : ''}
      </ul>
      <h3>2. Finalidad del tratamiento</h3>
      <p>Los datos personales recogidos serán tratados para:</p>
      <ul>
        <li>Gestionar reservas y consultas</li>
        <li>Atender solicitudes</li>
        <li>Enviar comunicaciones comerciales (solo con consentimiento)</li>
        <li>Cumplir obligaciones legales</li>
      </ul>
      <h3>3. Legitimación</h3>
      <p>La base legal es el consentimiento del interesado, la ejecución de un contrato y el cumplimiento de obligaciones legales.</p>
      <h3>4. Conservación</h3>
      <p>Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad y determinar posibles responsabilidades.</p>
      <h3>5. Destinatarios</h3>
      <p>No se cederán datos a terceros salvo obligación legal.</p>
      <h3>6. Derechos</h3>
      <p>Puede ejercer sus derechos de acceso, rectificación, supresión, limitación, oposición y portabilidad${emailDisp ? ` enviando un email a ${emailDisp}` : ' a través del formulario de contacto'}.</p>
      <p>Puede presentar reclamación ante la AEPD (www.aepd.es).</p>`,
    },
    cookies: {
      title: 'Política de Cookies',
      content: `
      <h3>1. ¿Qué son las cookies?</h3>
      <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo para recoger información sobre su navegación.</p>
      <h3>2. Cookies utilizadas</h3>
      <ul>
        <li><strong>Cookies técnicas:</strong> necesarias para el funcionamiento del sitio</li>
        <li><strong>Cookies analíticas:</strong> para medir y analizar la navegación (con consentimiento)</li>
      </ul>
      <h3>3. Gestión de cookies</h3>
      <p>Puede configurar su navegador para rechazar las cookies, aunque esto puede afectar al funcionamiento del sitio.</p>`,
    },
    datos: {
      title: 'Política de Protección de Datos',
      content: `
      <h3>1. Compromiso</h3>
      <p>Cumplimos estrictamente con el RGPD y la LOPDGDD.</p>
      <h3>2. Medidas de seguridad</h3>
      <ul>
        <li>Cifrado SSL/TLS</li>
        <li>Control de accesos</li>
        <li>Copias de seguridad</li>
        <li>Formación del personal</li>
      </ul>
      <h3>3. Violaciones</h3>
      <p>En caso de violación de seguridad, notificaremos a la autoridad en 72 horas cuando proceda.</p>
      <h3>4. Transferencias</h3>
      <p>No realizamos transferencias internacionales sin garantías adecuadas.</p>`,
    },
    accesibilidad: {
      title: 'Política de Accesibilidad',
      content: `
      <h3>Compromiso</h3>
      <p>Nos comprometemos a hacer nuestro sitio accesible conforme al Real Decreto 1112/2018 y WCAG 2.1 nivel AA.</p>
      <h3>Medidas</h3>
      <ul>
        <li>HTML semántico</li>
        <li>Contrastes adecuados</li>
        <li>Navegación por teclado</li>
        <li>Textos alternativos</li>
        <li>Diseño responsive</li>
      </ul>
      <h3>Feedback</h3>
      <p>Si encuentra barreras de accesibilidad, contáctenos${emailDisp ? ` en ${emailDisp}` : ''}.</p>`,
    },
  };

  const pagesEn: Record<string, { title: string; content: string }> = {
    aviso: {
      title: 'Legal notice',
      content: `<h3>1. Owner</h3><p><strong>${titular}</strong>. ${addrDisp} ${emailDisp} ${phoneDisp}</p><h3>2. Purpose</h3><p>Informative catalogue site. No online payments.</p>`,
    },
    privacidad: {
      title: 'Privacy policy',
      content: `<h3>1. Controller</h3><p>${titular}</p><h3>2. Purpose</h3><p>We process contact data to answer enquiries under applicable law.${emailDisp ? ` Contact: ${emailDisp}.` : ''}</p>`,
    },
    cookies: {
      title: 'Cookie policy',
      content: `<p>Essential technical cookies and optional analytics with consent. You may reject non-essential cookies in your browser.</p>`,
    },
    datos: {
      title: 'Data protection',
      content: `<p>We comply with applicable data protection law. Contact us to exercise your rights.${emailDisp ? ` Email: ${emailDisp}.` : ''}</p>`,
    },
    accesibilidad: {
      title: 'Accessibility',
      content: `<p>We aim for WCAG 2.1 AA. Contact us if you find barriers.</p>`,
    },
  };

  const pages = lang === 'es' ? pagesEs : pagesEn;

  // Escape for embedding in JS template literals — use JSON
  const modalesJson = JSON.stringify(pages);

  const links =
    lang === 'es'
      ? `<div class="footer-legal" data-cua-legal-links style="display:flex;flex-wrap:wrap;gap:0.75rem 1.25rem;justify-content:center;padding:0.75rem 0;font-size:0.8rem;color:inherit;opacity:0.95">
  <a href="#" role="button" onclick="event.preventDefault();openModal('aviso')" style="cursor:pointer;color:inherit;text-decoration:none">Aviso Legal</a>
  <a href="#" role="button" onclick="event.preventDefault();openModal('privacidad')" style="cursor:pointer;color:inherit;text-decoration:none">Política de Privacidad</a>
  <a href="#" role="button" onclick="event.preventDefault();openModal('cookies')" style="cursor:pointer;color:inherit;text-decoration:none">Política de Cookies</a>
  <a href="#" role="button" onclick="event.preventDefault();openModal('datos')" style="cursor:pointer;color:inherit;text-decoration:none">Protección de Datos</a>
  <a href="#" role="button" onclick="event.preventDefault();openModal('accesibilidad')" style="cursor:pointer;color:inherit;text-decoration:none">Accesibilidad</a>
</div>`
      : `<div class="footer-legal" data-cua-legal-links style="display:flex;flex-wrap:wrap;gap:0.75rem 1.25rem;justify-content:center;padding:0.75rem 0;font-size:0.8rem;color:inherit;opacity:0.95">
  <a href="#" role="button" onclick="event.preventDefault();openModal('aviso')" style="cursor:pointer;color:inherit;text-decoration:none">Legal notice</a>
  <a href="#" role="button" onclick="event.preventDefault();openModal('privacidad')" style="cursor:pointer;color:inherit;text-decoration:none">Privacy policy</a>
  <a href="#" role="button" onclick="event.preventDefault();openModal('cookies')" style="cursor:pointer;color:inherit;text-decoration:none">Cookie policy</a>
  <a href="#" role="button" onclick="event.preventDefault();openModal('datos')" style="cursor:pointer;color:inherit;text-decoration:none">Data protection</a>
  <a href="#" role="button" onclick="event.preventDefault();openModal('accesibilidad')" style="cursor:pointer;color:inherit;text-decoration:none">Accessibility</a>
</div>`;

  // Patrón Desktop/index.html: overlay .modal + openModal(key) — NO <dialog>
  const dialogsAndScript = `<style id="cua-legal-css">
#cua-legal-modal.modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:2000;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(5px)}
#cua-legal-modal.modal.active{display:flex}
#cua-legal-modal .modal-content{background:#1a1a1a;color:#eee;border-radius:5px;max-width:800px;width:100%;max-height:85vh;overflow-y:auto;padding:40px 50px;position:relative;border:1px solid rgba(198,167,94,.3)}
#cua-legal-modal .modal-close{position:absolute;top:16px;right:20px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;line-height:1}
#cua-legal-modal .modal-close:hover{color:#C6A75E}
#cua-legal-modal .modal-content h2{color:#C6A75E;margin:0 0 1.25rem;padding-bottom:1rem;border-bottom:2px solid rgba(198,167,94,.3);font-size:1.75rem}
#cua-legal-modal .modal-content h3{color:#fff;margin:1.5rem 0 .75rem;font-size:1.15rem}
#cua-legal-modal .modal-content p,#cua-legal-modal .modal-content li{color:#c8c8c8;margin-bottom:.75rem;line-height:1.75}
#cua-legal-modal .modal-content ul{padding-left:1.25rem;margin:0 0 1rem}
.footer-legal a{cursor:pointer}
</style>
<div class="modal" id="cua-legal-modal" data-cua-mod="legal" aria-hidden="true">
  <div class="modal-content" role="dialog" aria-modal="true">
    <button type="button" class="modal-close" onclick="closeModal()" aria-label="Cerrar">×</button>
    <div id="cua-legal-modal-body"></div>
  </div>
</div>
<script>
(function(){
  var modales = ${modalesJson};
  function openModal(key){
    var m = modales[key];
    if(!m) return;
    var body = document.getElementById('cua-legal-modal-body');
    var box = document.getElementById('cua-legal-modal');
    if(!body||!box) return;
    body.innerHTML = '<h2>'+m.title+'</h2>'+m.content;
    box.classList.add('active');
    box.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    var box = document.getElementById('cua-legal-modal');
    if(!box) return;
    box.classList.remove('active');
    box.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  window.openModal = openModal;
  window.closeModal = closeModal;
  var box = document.getElementById('cua-legal-modal');
  if(box) box.addEventListener('click', function(e){ if(e.target===box) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
  function resolveLegalKey(text,href){
    var t=((text||'')+' '+(href||'')).toLowerCase();
    if(/protecci[oó]n\\s+de\\s+datos|data\\s+protection|#datos|lopd|rgpd/.test(t))return 'datos';
    if(/privacidad|privacy/.test(t))return 'privacidad';
    if(/cookies?/.test(t))return 'cookies';
    if(/accesib/.test(t))return 'accesibilidad';
    if(/aviso|legal\\s*notice|t[eé]rminos/.test(t))return 'aviso';
    return null;
  }
  document.querySelectorAll('footer a, .footer-legal a, [data-cua-legal-links] a').forEach(function(a){
    if(/openModal\\s*\\(/.test(a.getAttribute('onclick')||'')) return;
    var key=resolveLegalKey(a.textContent,a.getAttribute('href'));
    if(!key)return;
    a.style.cursor='pointer';
    a.addEventListener('click',function(e){e.preventDefault();openModal(key);});
  });
})();
</script>`;

  return { links, dialogsAndScript };
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

/** Convierte texto/enlaces muertos del footer en onclick openModal (como Desktop/index.html). */
function wireFooterLegalTextToOpeners(html: string): string {
  const footM = html.match(/<footer\b[\s\S]*?<\/footer>/i);
  if (!footM) return html;
  let foot = footM[0];

  const link = (id: string, label: string) =>
    `<a href="#" role="button" onclick="event.preventDefault();openModal('${id}')" style="cursor:pointer;color:inherit;text-decoration:none">${label}</a>`;

  foot = foot.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    (full, _attrs: string, inner: string) => {
      if (/openModal\s*\(/i.test(full)) return full;
      const text = inner.replace(/<[^>]+>/g, '').trim();
      const href = full.match(/\bhref=["']([^"']*)["']/i)?.[1] || '';
      const blob = `${text} ${href}`.toLowerCase();
      if (/protecci[oó]n\s+de\s+datos|data\s+protection|#datos|lopd|rgpd/.test(blob))
        return link('datos', text || 'Protección de Datos');
      if (/privacidad|privacy/.test(blob)) return link('privacidad', text || 'Política de Privacidad');
      if (/cookies?/.test(blob)) return link('cookies', text || 'Política de Cookies');
      if (/accesib/.test(blob)) return link('accesibilidad', text || 'Accesibilidad');
      if (/aviso\s*legal|legal\s*notice|t[eé]rminos/.test(blob)) return link('aviso', text || 'Aviso Legal');
      return full;
    }
  );

  // Botones data-cua-legal-open antiguos → onclick openModal
  foot = foot.replace(
    /<button\b[^>]*data-cua-legal-open=["']([^"']+)["'][^>]*>([\s\S]*?)<\/button>/gi,
    (_m, id: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, '').trim() || id;
      return link(id, text);
    }
  );

  if (!/openModal\s*\(/i.test(foot) && /aviso\s*legal/i.test(foot) && /privacidad/i.test(foot)) {
    foot = foot.replace(
      /(?:Aviso\s*Legal)\s*[|·•]\s*(?:Pol[ií]tica\s+de\s+)?Privacidad\s*[|·•]\s*(?:Pol[ií]tica\s+de\s+)?Cookies(?:\s*[|·•]\s*Protecci[oó]n\s+de\s+Datos)?(?:\s*[|·•]\s*Accesibilidad)?/gi,
      () =>
        [
          link('aviso', 'Aviso Legal'),
          ' | ',
          link('privacidad', 'Política de Privacidad'),
          ' | ',
          link('cookies', 'Política de Cookies'),
          ' | ',
          link('datos', 'Protección de Datos'),
          ' | ',
          link('accesibilidad', 'Accesibilidad'),
        ].join('')
    );
  }

  return html.replace(footM[0], foot);
}

function widgetsHtml(
  phone: string | undefined,
  lang: 'es' | 'en',
  includeWhatsApp: boolean
): string {
  const wa = !includeWhatsApp
    ? ''
    : phone
      ? `<a href="https://wa.me/${phone}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:58px;height:58px;border-radius:9999px;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,.5)">
<svg width="30" height="30" viewBox="0 0 24 24"><path fill="#fff" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm4.43 12.39c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>
</a>`
      : `<a href="#contacto" data-cua-wa-placeholder aria-label="${lang === 'es' ? 'Añade tu WhatsApp' : 'Add your WhatsApp'}" title="${lang === 'es' ? 'Añade tu WhatsApp en el brief' : 'Add WhatsApp in your brief'}" style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:58px;height:58px;border-radius:9999px;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,.5);opacity:.85;font-size:11px;color:#fff;font-weight:700;text-align:center;padding:4px;line-height:1.1;text-decoration:none">${lang === 'es' ? 'Añade<br/>WA' : 'Add<br/>WA'}</a>`;

  const scrollRight = includeWhatsApp ? '5.5rem' : '1.5rem';
  return `<div id="cua-site-widgets" data-cua-mod="widgets">
${wa}
<button type="button" id="cua-scroll-top" aria-label="Volver arriba" style="position:fixed;bottom:1.5rem;right:${scrollRight};z-index:9999;width:48px;height:48px;border-radius:9999px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.25);display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.4)">
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
    out = out.replace(
      /<(?:div|nav)[^>]*(?:footer-legal|data-cua-legal-links)[^>]*>\s*(?:\|?\s*)*<\/(?:div|nav)>/gi,
      ''
    );
    // Quitar dialogs legales viejos (rompían preview / “fuera de la página”)
    out = out.replace(/<dialog[^>]*(?:cua-legal-|data-cua-mod=["']legal["'])[^>]*>[\s\S]*?<\/dialog>/gi, '');
    out = out.replace(/<style[^>]*id=["']cua-legal[^"']*["'][^>]*>[\s\S]*?<\/style>/gi, '');
    out = out.replace(/<div[^>]*id=["']cua-legal-modal["'][^>]*>[\s\S]*?<\/div>\s*(?=<script|<style|<\/body>)/gi, '');
    out = wireFooterLegalTextToOpeners(out);
    const legal = legalModals(brand, lang, contact);
    const hasOpeners = /openModal\s*\(\s*['"]aviso['"]/i.test(out) || /data-cua-legal-open=/i.test(out);
    if (!hasOpeners) {
      if (/<\/footer>/i.test(out)) {
        if (/©|todos los derechos|all rights reserved/i.test(out)) {
          out = out.replace(
            /(<p[^>]*>[^<]*(?:©|todos los derechos|all rights reserved)[^<]*<\/p>|(?:<div[^>]*>)\s*©[\s\S]*?<\/div>)/i,
            `${legal.links}\n$1`
          );
        } else {
          out = insertBeforeFooterEnd(out, legal.links);
        }
      } else {
        out = insertBeforeBodyEnd(out, legal.links);
      }
    }
    if (!/id=["']cua-legal-modal["']/i.test(out) || !/function\s+openModal|window\.openModal\s*=/i.test(out)) {
      // Evitar duplicar script si ya hay modal incompleto
      out = out.replace(/<div[^>]*id=["']cua-legal-modal["'][\s\S]*?<\/div>/gi, '');
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

  const wantsWa = promptWantsWhatsApp(opts.prompt);
  if (
    modules.includes('widgets') &&
    (!/data-cua-mod=["']widgets["']|cua-scroll-top/i.test(out) ||
      (wantsWa && !/wa\.me\//i.test(out) && !/data-cua-wa-placeholder/i.test(out)))
  ) {
    out = out.replace(
      /<div id="cua-site-widgets"[\s\S]*?<\/div>\s*<script>[\s\S]*?cua-scroll-top[\s\S]*?<\/script>/i,
      ''
    );
    out = insertBeforeBodyEnd(
      out,
      widgetsHtml(contact.whatsapp || contact.phone, lang, wantsWa)
    );
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
