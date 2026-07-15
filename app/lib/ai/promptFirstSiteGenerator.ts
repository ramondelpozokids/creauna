import { chatCompletion, getConfiguredProviders, type AiProvider } from './providers';
import { validateSectionHtml } from '../studio/sectionValidator';
import type { PreviewSection } from './studioEngine';
import type { AiSkippedReason, PipelineStage } from './engineHealth';
import { isFashionEcommercePrompt } from './businessProfiles';
import { buildFashionFullPageHtml } from './fashionFullPageBuilder';
import { applyFalVisualAssets } from './falImages';
import { buildSiteBrief } from './siteAiEnhancer';
import { analyzeIntent } from './intentAnalyzer';
import { getBusinessProfile } from './businessProfiles';
import type { TemplatePageSection } from '../templatePages';

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
}

const PROMPT_FIRST_PROVIDERS: AiProvider[] = ['openai', 'gemini', 'claude'];

function systemPrompt(lang: 'es' | 'en'): string {
  return lang === 'es'
    ? `Eres CREAUNA, estudio web de élite. El brief del cliente es tu ÚNICA fuente de verdad.

REGLAS ABSOLUTAS:
- NO uses plantillas genéricas, sectores inventados ni nombres que el cliente no haya pedido.
- NO impongas arquitectura, restaurante, clínica u otro sector salvo que el brief lo pida explícitamente.
- Cada sección, texto, color, funcionalidad y estructura debe salir SOLO del brief.
- Genera UN documento HTML completo: <!DOCTYPE html>... con Tailwind CDN, fuentes Google (Playfair+Inter para moda/lujo).
- Imágenes: URLs Unsplash reales y coherentes con el sector del brief.
- Si piden eCommerce, carrito, checkout o Stripe: incluye JavaScript funcional (carrito localStorage, vistas producto/carrito/checkout).
- Diseño premium, mucho espacio en blanco, cero "lorem ipsum", cero copy de otro sector.
- Devuelve SOLO el HTML, sin explicación markdown.`
    : `You are CREAUNA, an elite web studio. The client brief is your ONLY source of truth.

ABSOLUTE RULES:
- Do NOT use generic templates, invented sectors, or business names the client did not request.
- Do NOT impose architecture, restaurant, clinic or other sectors unless the brief explicitly asks.
- Every section, copy, color, feature and structure must come ONLY from the brief.
- Output ONE complete HTML document: <!DOCTYPE html>... with Tailwind CDN, Google Fonts (Playfair+Inter for fashion/luxury).
- Images: real coherent Unsplash URLs matching the brief sector.
- If they ask for eCommerce, cart, checkout or Stripe: include working JavaScript (localStorage cart, product/cart/checkout views).
- Premium design, generous whitespace, no lorem ipsum, no wrong-sector copy.
- Return ONLY the HTML, no markdown explanation.`;
}

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

/** Nombre de marca solo si aparece en el brief — nunca inventar plantilla. */
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
  if (/maison|moda|fashion|ecommerce|e-commerce/i.test(prompt)) {
    return lang === 'es' ? 'Maison' : 'Maison';
  }
  const firstLine = prompt.split('\n').find((l) => l.trim().length > 8 && !l.startsWith('#'));
  if (firstLine && firstLine.length < 60) return firstLine.trim().slice(0, 40);
  return lang === 'es' ? 'Tu proyecto' : 'Your project';
}

function summarizeBriefFeatures(prompt: string, lang: 'es' | 'en'): string {
  const lower = prompt.toLowerCase();
  const bits: string[] = [];
  if (/carrito|checkout|stripe|woocommerce|shopify/i.test(lower)) bits.push(lang === 'es' ? 'tienda con carrito' : 'store with cart');
  if (/lookbook|colecci/i.test(lower)) bits.push('lookbook');
  if (/blog|noticias/i.test(lower)) bits.push('blog');
  if (/newsletter/i.test(lower)) bits.push('newsletter');
  if (/panel admin|administrador/i.test(lower)) bits.push(lang === 'es' ? 'panel admin (UI)' : 'admin panel (UI)');
  return bits.length ? bits.join(', ') : lang === 'es' ? 'según tu brief' : 'per your brief';
}

async function generateHtmlFromBrief(prompt: string, lang: 'es' | 'en'): Promise<{ html: string | null; provider: AiProvider | 'rules' }> {
  const userContent =
    lang === 'es'
      ? `Brief del cliente (construye la web EXCLUSIVAMENTE a partir de esto):\n\n${prompt}`
      : `Client brief (build the site EXCLUSIVELY from this):\n\n${prompt}`;

  for (const provider of PROMPT_FIRST_PROVIDERS) {
    if (!getConfiguredProviders().includes(provider)) continue;
    const motor = provider === 'openai' ? 'code' : provider === 'claude' ? 'copy' : 'visual';
    const result = await chatCompletion(
      [
        { role: 'system', content: systemPrompt(lang) },
        { role: 'user', content: userContent },
      ],
      { motor, maxTokens: 16384, temperature: 0.45, prompt }
    );
    if (!result.content) continue;
    const html = extractHtmlFromAiResponse(result.content);
    if (html && html.length > 4000) {
      return { html, provider: result.provider === 'rules' ? provider : result.provider };
    }
  }
  return { html: null, provider: 'rules' };
}

async function applyFalToFullPage(html: string, prompt: string, lang: 'es' | 'en'): Promise<{ html: string; falImages: number }> {
  const intent = analyzeIntent(prompt, lang);
  const profile = getBusinessProfile(intent.variant);
  const brief = buildSiteBrief(intent, profile, null, lang, prompt);
  const section: TemplatePageSection = {
    id: 'prompt-first',
    type: 'fullpage',
    navLabelEs: 'Web',
    navLabelEn: 'Site',
    html,
  };
  const { sections, falImages } = await applyFalVisualAssets([section], brief);
  return { html: sections[0]?.html ?? html, falImages };
}

/** Fallback mínimo sin plantillas sectoriales — solo cuando no hay IA y el brief es moda. */
function fashionFallbackFromBrief(prompt: string, lang: 'es' | 'en'): string {
  const name = extractBusinessNameFromPrompt(prompt, lang);
  const tagline =
    prompt.match(/(?:tagline|eslogan|headline)[:\s]+([^\n.]{10,120})/i)?.[1]?.trim() ??
    (lang === 'es'
      ? 'Moda internacional con diseño editorial y checkout seguro.'
      : 'International fashion with editorial design and secure checkout.');
  return buildFashionFullPageHtml({
    brandName: name,
    tagline,
    badge: lang === 'es' ? 'Nueva colección' : 'New collection',
    heroImage: '',
    lang,
    profile: getBusinessProfile('fashion'),
  });
}

/**
 * Generación inicial: SOLO el brief del usuario.
 * Plantillas sectoriales = último recurso desactivado en camino principal.
 */
export async function generateSiteFromUserPrompt(
  prompt: string,
  lang: 'es' | 'en'
): Promise<PromptFirstResult> {
  const businessName = extractBusinessNameFromPrompt(prompt, lang);
  const features = summarizeBriefFeatures(prompt, lang);

  const { html: aiHtml, provider } = await generateHtmlFromBrief(prompt, lang);

  if (aiHtml) {
    const validation = validateSectionHtml(aiHtml, 101, 'fullpage');
    if (validation.ok) {
      const { html: finalHtml, falImages } = await applyFalToFullPage(aiHtml, prompt, lang);
      return {
        ok: true,
        previewSections: [{ id: 101, type: 'fullpage', html: finalHtml }],
        businessName,
        message:
          lang === 'es'
            ? `He construido tu web directamente desde tu brief (${features}). Motor: ${provider}${falImages ? ` · ${falImages} img fal.ai` : ''}. Pide cambios concretos y los aplico sobre este diseño.`
            : `Built your site directly from your brief (${features}). Engine: ${provider}${falImages ? ` · ${falImages} fal.ai img` : ''}. Ask for specific changes.`,
        source: falImages ? 'hybrid' : 'ai',
        motorsUsed: ['code', 'visual'],
        providersUsed: [provider],
        pipelineStage: 'prompt_first',
        falImages,
        templateSlug: 'prompt-first',
      };
    }
  }

  if (isFashionEcommercePrompt(prompt)) {
    const html = fashionFallbackFromBrief(prompt, lang);
    return {
      ok: true,
      previewSections: [{ id: 101, type: 'fullpage', html }],
      businessName,
      message:
        lang === 'es'
          ? `Tu brief es de moda/eCommerce. He generado la tienda desde tu texto (modo sin IA completa — añade OPENAI/GEMINI para generación 100% desde prompt).`
          : `Fashion/eCommerce brief detected. Store built from your text (add OPENAI/GEMINI for full prompt-only generation).`,
      source: 'rules',
      motorsUsed: ['visual'],
      providersUsed: [],
      pipelineStage: 'prompt_first',
      aiSkippedReason: getConfiguredProviders().length ? 'ai_parse_failed' : 'no_api_keys',
      templateSlug: 'maison',
    };
  }

  return {
    ok: false,
    previewSections: [],
    businessName,
    message: '',
    source: 'rules',
    motorsUsed: [],
    providersUsed: [],
    pipelineStage: 'prompt_first',
    aiSkippedReason: getConfiguredProviders().length ? 'ai_parse_failed' : 'no_api_keys',
  };
}
