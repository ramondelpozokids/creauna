/**
 * Tras aprobación de la index: Qwen construye el resto de HTML (contacto, legales…).
 */

import {
  chatCompletion,
  isProviderConfigured,
} from './providers';
import { constructorSystemPreamble } from './creaunaConstructorManifesto';
import {
  defaultSatellitePageList,
  embedSitePages,
  stampBuildPhase,
  type CreaunaBuildPhase,
} from './creaunaBuildPhases';
import { extractHtmlFromAiResponse } from './promptFirstSiteGenerator';

const MAX_TOKENS = 16384;

function stripFences(raw: string): string {
  return raw.replace(/^```(?:html|json)?\s*/i, '').replace(/```\s*$/i, '').trim();
}

function extractOneHtml(raw: string): string | null {
  const fromHelper = extractHtmlFromAiResponse(raw);
  if (fromHelper && fromHelper.length > 400) return fromHelper;
  const m = raw.match(/(<!DOCTYPE[\s\S]*<\/html>)/i);
  return m?.[1] || null;
}

async function buildOnePage(
  pageName: string,
  indexHtml: string,
  prompt: string,
  lang: 'es' | 'en',
  businessName: string
): Promise<string | null> {
  if (!isProviderConfigured('qwen')) return null;

  const system = `${constructorSystemPreamble(lang)}

ROL: Constructor Qwen de CREAUNA. Ya existe una index.html aprobada. Ahora creas UNA página satélite: ${pageName}.
- HTML5 completo único (<!DOCTYPE>…</html>).
- Misma marca, tipografía y paleta que la index (infiere del HTML de referencia).
- Navegación coherente; enlace claro de vuelta a index.html.
- Contenido real según el brief; no inventes Stripe/carrito si no se pide.
- SOLO HTML de ${pageName}. Sin markdown.`;

  const user =
    lang === 'es'
      ? `BRIEF:\n${prompt.slice(0, 12000)}\n\nMarca: ${businessName}\nPágina pedida: ${pageName}\n\nFragmento de la index (referencia de estilo, ~12KB):\n${indexHtml.slice(0, 12000)}\n\nDevuelve SOLO el HTML completo de ${pageName}.`
      : `BRIEF:\n${prompt.slice(0, 12000)}\n\nBrand: ${businessName}\nPage: ${pageName}\n\nIndex excerpt (~12KB):\n${indexHtml.slice(0, 12000)}\n\nReturn ONLY full HTML for ${pageName}.`;

  const res = await chatCompletion(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    {
      motor: 'code',
      preferProvider: 'qwen',
      maxTokens: MAX_TOKENS,
      temperature: 0.35,
      prompt,
    }
  );
  if (!res.content) return null;
  return extractOneHtml(stripFences(res.content));
}

export interface SatelliteExpandResult {
  ok: boolean;
  indexHtml: string;
  pages: Record<string, string>;
  phase: CreaunaBuildPhase;
  provider: string;
}

/**
 * Construye satélites con Qwen y los embebe en la index (paquete multipágina).
 */
export async function expandSitePagesWithQwen(opts: {
  indexHtml: string;
  prompt: string;
  lang: 'es' | 'en';
  businessName?: string;
}): Promise<SatelliteExpandResult> {
  const businessName = opts.businessName || 'Marca';
  const wanted = defaultSatellitePageList(opts.lang, opts.prompt);
  const pages: Record<string, string> = {};

  // Secuencial para no saturar la API; calidad > paralelismo aquí
  for (const page of wanted) {
    try {
      const html = await buildOnePage(page, opts.indexHtml, opts.prompt, opts.lang, businessName);
      if (html && html.length > 800 && /<\/html>/i.test(html)) {
        pages[page] = html;
      }
    } catch (err) {
      console.warn('[expandSitePagesWithQwen] page failed', page, err);
    }
  }

  let indexHtml = opts.indexHtml;
  // Asegurar enlaces relativos típicos en footer/nav
  for (const name of Object.keys(pages)) {
    const bare = name.replace(/\.html$/i, '');
    const re = new RegExp(`(href=["'])(?:#|javascript:[^"']*)?(${bare}|${name})(["'])`, 'gi');
    indexHtml = indexHtml.replace(re, `$1${name}$3`);
  }

  indexHtml = embedSitePages(indexHtml, pages);
  const phase: CreaunaBuildPhase = Object.keys(pages).length >= 3 ? 'final' : 'expand_pages';
  indexHtml = stampBuildPhase(indexHtml, phase);

  return {
    ok: Object.keys(pages).length >= 2,
    indexHtml,
    pages,
    phase,
    provider: 'qwen',
  };
}
