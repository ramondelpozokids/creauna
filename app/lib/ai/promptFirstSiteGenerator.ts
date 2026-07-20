import { chatCompletion, getConfiguredProviders, type AiProvider } from './providers';
import type { PreviewSection } from './studioEngine';
import type { AiSkippedReason, PipelineStage } from './engineHealth';
import { getBusinessProfile } from './businessProfiles';
import { buildSiteBrief } from './siteAiEnhancer';
import { analyzeIntent } from './intentAnalyzer';
import {
  assessBriefQuality,
  buildBriefImagePack,
  ensureBriefImagesInHtml,
  isUnacceptableAgencyHtml,
  wireframeRejectHint,
  type BriefImagePack,
} from './promptFirstQuality';
import { runAgencyPipeline } from './agencyPipeline';
import { constructorSystemPreamble } from './creaunaConstructorManifesto';

export interface PromptFirstResult {
  ok: boolean;
  previewSections: PreviewSection[];
  businessName: string;
  message: string;
  source: 'ai' | 'hybrid' | 'rules';
  motorsUsed: string[];
  providersUsed: string[];
  pipelineStage: PipelineStage;
  aiSkippedReason?: AiSkippedReason;
  falImages?: number;
  templateSlug?: string;
  suggestDiscovery?: boolean;
}

const PROMPT_FIRST_PROVIDERS: AiProvider[] = ['qwen', 'openai', 'gemini', 'claude'];
const REWRITE_MAX_TOKENS = 32768;

export function extractHtmlFromAiResponse(raw: string): string | null {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:html)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const docMatch = candidate.match(/(<!DOCTYPE[\s\S]*<\/html>)/i);
  if (docMatch) return docMatch[1].trim();
  if (candidate.startsWith('<!DOCTYPE') || candidate.startsWith('<html')) {
    const end = candidate.lastIndexOf('</html>');
    return end > 0 ? candidate.slice(0, end + 7) : candidate;
  }
  return null;
}

export function extractBusinessNameFromPrompt(prompt: string, lang: 'es' | 'en'): string {
  const patterns = [
    /(?:marca|negocio|tienda|llamad[oa]|named|brand)\s*[:\-]?\s*["']?([A-ZÁÉÍÓÚÑ][\wáéíóúñ\s&'-]{2,40})/i,
    /(?:se\s+llama|called)\s+["']([^"']+)["']/i,
    /^#\s*([A-ZÁÉÍÓÚÑ][\w\s&'-]{2,30})\s*$/m,
  ];
  for (const re of patterns) {
    const m = prompt.match(re);
    if (m?.[1] && m[1].trim().length >= 3) return m[1].trim();
  }
  if (/maison|moda|fashion|ecommerce|e-commerce|luxe/i.test(prompt)) {
    return lang === 'es' ? 'Maison' : 'Maison';
  }
  const firstLine = prompt.split('\n').find((l) => l.trim().length > 8 && !l.startsWith('#'));
  if (firstLine && firstLine.length < 60) return firstLine.trim().slice(0, 40);
  return lang === 'es' ? 'Tu proyecto' : 'Your project';
}

async function applyFalToFullPage(
  html: string,
  prompt: string,
  lang: 'es' | 'en',
  clientImageUrls?: string[]
): Promise<{ html: string; falImages: number }> {
  const intent = analyzeIntent(prompt, lang);
  const profile = getBusinessProfile(intent.variant);
  const brief = buildSiteBrief(intent, profile, null, lang, prompt);
  const pack = buildBriefImagePack(prompt, lang, clientImageUrls);
  const { ensureVisibleSiteImages } = await import('./ensureVisibleSiteImages');
  const ensured = await ensureVisibleSiteImages(html, pack.urls, brief, {
    maxAiImages: 6,
    preferAiHero: true,
    forceAiFill: true,
    clientImageUrls,
  });
  const { polishCatalogLayout } = await import('./polishCatalogLayout');
  const polished = polishCatalogLayout(ensured.html, {
    prompt,
    packUrls: pack.urls,
    variant: pack.variant,
  });
  return { html: polished, falImages: ensured.aiImages };
}

/** Para HTML grandes: CSS :root + head + hero + pedido, no cortar a 28KB a ciegas. */
export function packHtmlForRewrite(currentHtml: string, maxChars = 70000): string {
  if (currentHtml.length <= maxChars) return currentHtml;
  const head = currentHtml.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? currentHtml.slice(0, 8000);
  const style =
    currentHtml.match(/<style[\s\S]*?<\/style>/gi)?.join('\n') ??
    currentHtml.match(/:root\s*\{[\s\S]*?\}/)?.[0] ??
    '';
  const hero =
    currentHtml.match(/<section[^>]*(?:hero|inicio|home)[^>]*>[\s\S]{0,8000}?<\/section>/i)?.[0] ??
    currentHtml.match(/<header[\s\S]{0,6000}?<\/header>/i)?.[0] ??
    '';
  const bodyStart = currentHtml.search(/<body[^>]*>/i);
  const bodyChunk =
    bodyStart >= 0 ? currentHtml.slice(bodyStart, bodyStart + Math.floor(maxChars * 0.55)) : currentHtml.slice(0, Math.floor(maxChars * 0.55));
  const tail = currentHtml.slice(-12000);
  return `<!-- CREAUNA: HTML original ${currentHtml.length} chars; extracto para edición -->\n${head}\n${style}\n${hero}\n${bodyChunk}\n<!-- …medio omitido… -->\n${tail}`;
}

async function continueRewriteHtml(
  partial: string,
  provider: AiProvider,
  prompt: string,
  lang: 'es' | 'en'
): Promise<string> {
  let html = partial;
  for (let i = 0; i < 2; i++) {
    if (/<\/html>/i.test(html) && html.length > 20000) break;
    const motor = provider === 'qwen' || provider === 'openai' ? 'code' : 'visual';
    const cont = await chatCompletion(
      [
        {
          role: 'system',
          content:
            lang === 'es'
              ? 'Continúa el HTML donde quedó. No repitas el inicio. Cierra con </body></html>. SOLO continuación HTML.'
              : 'Continue the HTML where it left off. End with </body></html>. ONLY HTML continuation.',
        },
        {
          role: 'user',
          content: `Últimos 5000 caracteres:\n${html.slice(-5000)}\n\nContinúa hasta cerrar el documento.`,
        },
      ],
      { motor, maxTokens: REWRITE_MAX_TOKENS, temperature: 0.2, prompt, preferProvider: provider }
    );
    if (!cont.content) break;
    const extracted = extractHtmlFromAiResponse(cont.content);
    if (extracted && extracted.length > html.length) {
      html = extracted;
      break;
    }
    html += '\n' + cont.content.replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/i, '');
    const end = html.lastIndexOf('</html>');
    if (end > 0) {
      html = html.slice(0, end + 7);
      break;
    }
  }
  return html;
}

export async function generateSiteFromUserPrompt(
  prompt: string,
  lang: 'es' | 'en',
  opts?: { clientImageUrls?: string[] }
): Promise<PromptFirstResult> {
  const quality = assessBriefQuality(prompt);
  const agency = await runAgencyPipeline(prompt, lang, {
    clientImageUrls: opts?.clientImageUrls,
    briefWeak: quality.weak,
  });

  return {
    ok: agency.ok,
    previewSections: agency.previewSections,
    businessName: agency.businessName,
    message: agency.message,
    source: agency.source,
    motorsUsed: agency.motorsUsed,
    providersUsed: agency.providersUsed,
    pipelineStage: agency.pipelineStage,
    aiSkippedReason: agency.aiSkippedReason,
    falImages: agency.falImages,
    templateSlug: agency.templateSlug,
    suggestDiscovery: agency.suggestDiscovery ?? false,
  };
}

/**
 * Aplica el pedido del cliente sobre el HTML actual (refinar, no regenerar de cero).
 * CREAUNA = construir + iterar según deseos del cliente.
 */
export async function rewriteFullPageFromRequest(
  currentHtml: string,
  prompt: string,
  lang: 'es' | 'en',
  opts?: { clientImageUrls?: string[] }
): Promise<{ html: string | null; provider: string; falImages: number; repaired?: boolean }> {
  const pack = buildBriefImagePack(prompt + '\n' + currentHtml.slice(0, 2000), lang, opts?.clientImageUrls);
  const system =
    lang === 'es'
      ? `${constructorSystemPreamble('es')}

MODO CAMBIO: el cliente YA tiene su web. Aplica SOLO su pedido.
- No justifiques el diseño anterior: entiende el cambio y reconstruye lo necesario.
- Conserva marca, productos y lo no pedido; si pide sección nueva/colores/hero, hazlo visible.
- NO inventes otra web ni vacíes el catálogo.
Devuelve SOLO el HTML completo actualizado.`
      : `${constructorSystemPreamble('en')}

CHANGE MODE: apply ONLY the client's request to the current HTML. Do not defend the old layout. Return ONLY the full updated HTML.`;

  const htmlPack = packHtmlForRewrite(currentHtml, 70000);
  const user =
    lang === 'es'
      ? `Pedido del cliente (OBLIGATORIO aplicarlo):\n${prompt}\n\nAssets si necesitas fotos nuevas:\n${pack.briefBlock}\n\nHTML actual (edítalo; respeta lo no pedido):\n${htmlPack}`
      : `Client request (MUST apply):\n${prompt}\n\nImage assets:\n${pack.briefBlock}\n\nCurrent HTML:\n${htmlPack}`;

  for (const provider of PROMPT_FIRST_PROVIDERS) {
    if (!getConfiguredProviders().includes(provider)) continue;
    const motor =
      provider === 'qwen' || provider === 'openai'
        ? 'code'
        : provider === 'claude'
          ? 'copy'
          : 'visual';
    const result = await chatCompletion(
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      { motor, maxTokens: REWRITE_MAX_TOKENS, temperature: 0.35, prompt, preferProvider: provider }
    );
    if (!result.content) continue;
    let html = extractHtmlFromAiResponse(result.content);
    if (!html || html.length < 4000) {
      if (result.content.length > 8000 && /<html|<body/i.test(result.content)) {
        html = result.content.replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/i, '').trim();
      } else continue;
    }
    const prov = (result.provider === 'rules' ? provider : result.provider) as AiProvider;
    if (!/<\/html>/i.test(html) || html.length < Math.min(currentHtml.length * 0.5, 30000)) {
      html = await continueRewriteHtml(html, prov, prompt, lang);
    }
    // Si la IA devolvió algo mucho más corto que el original, reintentar con hint
    if (html.length < currentHtml.length * 0.4 && currentHtml.length > 30000) {
      const retry = await chatCompletion(
        [
          { role: 'system', content: system },
          {
            role: 'user',
            content: `${user}\n\nIMPORTANTE: el HTML anterior tenía ${currentHtml.length} caracteres. Debes devolver un documento IGUAL de completo, solo con el cambio pedido. No acortes ni borres secciones.`,
          },
        ],
        { motor, maxTokens: REWRITE_MAX_TOKENS, temperature: 0.25, prompt, preferProvider: provider }
      );
      const retried = retry.content ? extractHtmlFromAiResponse(retry.content) : null;
      if (retried && retried.length > html.length) html = retried;
    }
    html = ensureBriefImagesInHtml(html, pack.urls);
    // Siempre rellenar/editar imágenes con IA (hero incluido); no entregar huecos rotos.
    const { html: finalHtml, falImages } = await applyFalToFullPage(
      html,
      prompt,
      lang,
      opts?.clientImageUrls
    );
    return { html: finalHtml, provider: prov, falImages };
  }
  return { html: null, provider: 'rules', falImages: 0 };
}

function buildChangeRebuildPrompt(currentHtml: string, changeRequest: string, lang: 'es' | 'en'): string {
  const titleText = currentHtml.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || '';
  const h1Text =
    currentHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
  const brand =
    (titleText.split(/[|\-–]/)[0] || '').trim() ||
    h1Text ||
    (lang === 'es' ? 'el negocio' : 'the business');
  if (lang === 'en') {
    return `Rebuild the full premium website for «${brand}». Current H1: «${h1Text}».
Apply this client change and keep the same business: ${changeRequest}
Complete HTML document, dense, professional. No cart/Stripe unless asked.`;
  }
  return `Reconstruye la web premium completa de «${brand}». H1 actual: «${h1Text}».
Aplica este cambio del cliente y mantén el mismo negocio: ${changeRequest}
Documento HTML completo, denso, profesional. Sin carrito/Stripe salvo que lo pida.`;
}

/**
 * Si el rewrite falla: reconstruir fullpage desde brief sintético + pedido (no cosmético).
 */
export async function rebuildFullPageFromChangeRequest(
  currentHtml: string,
  changeRequest: string,
  lang: 'es' | 'en',
  opts?: { clientImageUrls?: string[] }
): Promise<PromptFirstResult> {
  const rebuildPrompt = buildChangeRebuildPrompt(currentHtml, changeRequest, lang);
  return generateSiteFromUserPrompt(rebuildPrompt, lang, {
    clientImageUrls: opts?.clientImageUrls,
  });
}
