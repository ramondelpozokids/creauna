/**
 * Ciclo CREAUNA: index preview → refinados en index → expandir páginas → final.
 * Qwen solo hace index hasta que el cliente lo pide / está satisfecho.
 */

export type CreaunaBuildPhase =
  | 'index_preview'
  | 'index_refine'
  | 'expand_pages'
  | 'final';

const PHASE_META = 'creauna-build-phase';
const PAGES_SCRIPT_ID = 'creauna-site-pages';

/** El cliente pide construir el resto de páginas (no solo retocar la index). */
export function clientWantsExpandPages(prompt: string): boolean {
  const p = prompt.trim();
  if (!p) return false;
  // Pedidos explícitos de satélites / resto del sitio
  if (
    /resto de (las )?p[aá]ginas|todas las p[aá]ginas|p[aá]ginas (html |del )?sitio|genera(r)? el resto|haz el resto|construye el resto|multip[aá]gina|site map|mapa del sitio\.html|contacto\.html|aviso[- ]legal|p[aá]ginas legales|el resto de html/i.test(
      p
    )
  ) {
    return true;
  }
  // Satisfacción + luz verde para continuar
  if (
    /me (encanta|gusta)|est[aá] (perfect[ao]|genial|list[ao]|bien|brutal)|sin (m[aá]s )?cambios|no (quiero|hace falta) (cambiar|tocar) m[aá]s|adelante con (todo|el resto|las p[aá]ginas)|ya est[aá]|ok,? (haz|genera|construye)/i.test(
      p
    ) &&
    /resto|p[aá]ginas|legales|contacto|multip|sitio completo|final/i.test(p)
  ) {
    return true;
  }
  return false;
}

/** Cambio típico solo sobre la index (color, fuente, texto, WhatsApp, redes…). */
export function clientWantsIndexRefineOnly(prompt: string): boolean {
  if (clientWantsExpandPages(prompt)) return false;
  return /color|fuente|tipograf|texto|t[ií]tulo|hero|whatsapp|redes|instagram|facebook|chat|asistente|bot[oó]n|cta|logo|imagen|foto|espaç|espaci|m[aá]rgen|padding|animaci[oó]n|cambiar|cambia|pon|quita|a[nñ]ade|añade/i.test(
    prompt
  );
}

export function stampBuildPhase(html: string, phase: CreaunaBuildPhase): string {
  let out = html;
  if (/<meta\s+name=["']creauna-build-phase["']/i.test(out)) {
    out = out.replace(
      /<meta\s+name=["']creauna-build-phase["'][^>]*>/i,
      `<meta name="${PHASE_META}" content="${phase}" />`
    );
  } else if (/<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, `<meta name="${PHASE_META}" content="${phase}" />\n</head>`);
  } else {
    out = `<meta name="${PHASE_META}" content="${phase}" />\n${out}`;
  }
  return out;
}

export function readBuildPhase(html: string): CreaunaBuildPhase | null {
  const m = html.match(/<meta\s+name=["']creauna-build-phase["']\s+content=["']([^"']+)["']/i);
  if (!m) return null;
  const v = m[1] as CreaunaBuildPhase;
  if (v === 'index_preview' || v === 'index_refine' || v === 'expand_pages' || v === 'final') return v;
  return null;
}

export function embedSitePages(html: string, pages: Record<string, string>): string {
  const json = JSON.stringify(pages).replace(/</g, '\\u003c');
  const tag = `<script type="application/json" id="${PAGES_SCRIPT_ID}">${json}</script>`;
  let out = html.replace(
    new RegExp(`<script[^>]*id=["']${PAGES_SCRIPT_ID}["'][^>]*>[\\s\\S]*?<\\/script>`, 'i'),
    ''
  );
  if (/<\/body>/i.test(out)) out = out.replace(/<\/body>/i, `${tag}\n</body>`);
  else out = `${out}\n${tag}`;
  return out;
}

export function extractSitePages(html: string): Record<string, string> {
  const m = html.match(
    new RegExp(`<script[^>]*id=["']${PAGES_SCRIPT_ID}["'][^>]*>([\\s\\S]*?)<\\/script>`, 'i')
  );
  if (!m?.[1]) return {};
  try {
    const data = JSON.parse(m[1]) as unknown;
    if (!data || typeof data !== 'object') return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      if (typeof v === 'string' && v.length > 200) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function messageIndexPreview(lang: 'es' | 'en', businessName?: string): string {
  const name = businessName ? ` «${businessName}»` : '';
  return lang === 'es'
    ? `He creado el preview de tu página principal (index)${name} según tu brief. ¿Quieres cambiar algo (color, fuente, textos, WhatsApp, redes, chat…)? Dímelo y lo aplico solo en la index. Cuando te guste, dime y construyo el resto de páginas (contacto, legales, mapa del sitio, etc.).`
    : `I created the preview of your main page (index)${name} from your brief. Want any changes (color, font, copy, WhatsApp, socials, chat…)? Tell me and I’ll update the index only. When you’re happy, tell me and I’ll build the rest of the pages (contact, legal, sitemap, etc.).`;
}

export function messageIndexRefine(lang: 'es' | 'en'): string {
  return lang === 'es'
    ? `He actualizado la index según lo que pediste. ¿Algo más que cambiar? Cuando estés satisfecho/a, dime y genero el resto de páginas HTML del sitio.`
    : `Updated the index with your request. Anything else to change? When you’re satisfied, tell me and I’ll generate the rest of the site’s HTML pages.`;
}

export function messageExpandFinal(
  lang: 'es' | 'en',
  pageNames: string[]
): string {
  const list = pageNames.slice(0, 12).join(', ');
  return lang === 'es'
    ? `He construido el resto de páginas (${list}${pageNames.length > 12 ? '…' : ''}) y revisado el conjunto con la index. Tu web profesional está lista para presentar.`
    : `I built the remaining pages (${list}${pageNames.length > 12 ? '…' : ''}) and reviewed the full set with the index. Your professional site is ready to present.`;
}

/** Páginas satélite típicas a pedir a Qwen tras aprobación de la index. */
export function defaultSatellitePageList(lang: 'es' | 'en', prompt: string): string[] {
  const pages = [
    lang === 'es' ? 'contacto.html' : 'contact.html',
    'aviso-legal.html',
    'privacidad.html',
    'cookies.html',
    'accesibilidad.html',
    lang === 'es' ? 'mapa-sitio.html' : 'sitemap.html',
  ];
  if (/reserva|booking|citas?/i.test(prompt)) {
    pages.push(lang === 'es' ? 'reservas.html' : 'booking.html');
  }
  if (/blog|noticias/i.test(prompt)) {
    pages.push(lang === 'es' ? 'blog.html' : 'news.html');
  }
  if (/servicios|services|modelos|carta|men[uú]/i.test(prompt)) {
    pages.push(lang === 'es' ? 'servicios.html' : 'services.html');
  }
  return [...new Set(pages)];
}
