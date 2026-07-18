import { chatCompletion, getConfiguredProviders, type AiProvider } from './providers';
import { validateSectionHtml } from '../studio/sectionValidator';
import type { PreviewSection } from './studioEngine';
import type { AiSkippedReason, PipelineStage } from './engineHealth';
import { getBusinessProfile } from './businessProfiles';
import { buildSiteBrief } from './siteAiEnhancer';
import { analyzeIntent } from './intentAnalyzer';
import {
  buildBriefImagePack,
  ensureBriefImagesInHtml,
  isUnacceptableAgencyHtml,
  missingBriefRequirements,
  wireframeRejectHint,
  type BriefImagePack,
} from './promptFirstQuality';
import { runAgencyPipeline } from './agencyPipeline';

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

const PROMPT_FIRST_PROVIDERS: AiProvider[] = ['qwen', 'openai', 'gemini', 'claude'];

function systemPrompt(lang: 'es' | 'en'): string {
  return lang === 'es'
    ? `Eres CREAUNA, estudio web de élite. Construyes la web EXCLUSIVAMENTE según el brief del cliente.

FUENTE DE VERDAD (brief):
- Estructura, secciones, textos, nombre del negocio, funcionalidades y tono: SOLO lo que pide el cliente.
- NO copies plantillas de otros sectores ni inventes páginas que no haya pedido.
- NO uses un diseño genérico de "SaaS" o wireframe.

CALIDAD DE EJECUCIÓN (obligatoria — cobrable como agencia):
- Documento HTML completo <!DOCTYPE html>… con Tailwind CDN.
- Google Fonts acordes al tono del brief (lujo/belleza: Playfair Display + Inter; moderno: DM Sans + Fraunces; etc.).
- Hero impactante: min-h-[85vh], fotografía real a pantalla completa (img o background-image), overlay cinematográfico, marca dominante, un titular, una frase, CTAs.
- Texto del hero SIEMPRE claro sobre la foto (blanco/crema + text-shadow). NUNCA titular negro sobre overlay oscuro.
- PROHIBIDO: hero de bloque sólido gris/slate sin foto; cards blancas solo texto; tipografía system-ui sin Google Fonts; formularios con aspecto nativo feo.
- Si el brief pide servicios/blog: cada tarjeta con imagen + título + descripción.
- Si pide galería o el negocio es visual (peluquería, restaurante, hotel…): grid de ≥6 fotos reales.
- Si pide reservas/contacto: formulario estilizado (labels, padding, bordes, botón premium).
- Si pide redes y legales: enlaces sociales + footer con privacidad/términos.
- Espaciado generoso, jerarquía tipográfica clara, 2–3 animaciones CSS sutiles (fade-in / hover zoom).
- Imágenes: USA ÚNICAMENTE las URLs del bloque «Assets de imagen» (Unsplash + Pexels curados, licencia comercial). PROHIBIDO inventar IDs, placehold.co o source.unsplash.com.
- Si piden eCommerce/carrito/Stripe: JS funcional (localStorage).
- Cero lorem ipsum. Devuelve SOLO el HTML, sin markdown.`
    : `You are CREAUNA, an elite web studio. Build the site EXCLUSIVELY from the client brief.

BRIEF IS SOURCE OF TRUTH:
- Structure, sections, copy, business name, features and tone: ONLY what the client asked.
- Do NOT copy other-sector templates or invent unrequested pages.
- Do NOT ship a generic SaaS/wireframe look.

BILLABLE EXECUTION QUALITY (mandatory):
- Full HTML document with Tailwind CDN + Google Fonts matching the brief tone.
- Impactful hero: min-h-[85vh], real full-bleed photography, cinematic overlay, dominant brand, one headline, one line, CTAs.
- FORBIDDEN: solid grey hero without photo; text-only white cards; system fonts only; ugly native forms.
- Services/blog cards include photos; visual businesses get a ≥6-image gallery when relevant.
- Styled forms; social + legal footer when asked; generous spacing; 2–3 subtle CSS motions.
- Images: USE ONLY URLs from the «Image assets» block (curated Unsplash + Pexels). FORBIDDEN: inventing IDs, placeholders, source.unsplash.com.
- eCommerce if asked: working JS cart. No lorem. Return ONLY HTML.`;
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
  if (/galer/i.test(lower)) bits.push(lang === 'es' ? 'galería' : 'gallery');
  if (/reserva|cita|booking/i.test(lower)) bits.push(lang === 'es' ? 'reservas' : 'booking');
  if (/newsletter/i.test(lower)) bits.push('newsletter');
  if (/panel admin|administrador/i.test(lower)) bits.push(lang === 'es' ? 'panel admin (UI)' : 'admin panel (UI)');
  return bits.length ? bits.join(', ') : lang === 'es' ? 'según tu brief' : 'per your brief';
}

function userBriefContent(prompt: string, lang: 'es' | 'en', pack: BriefImagePack, critique?: string): string {
  const assetsLabel = lang === 'es' ? 'Assets de imagen (úsalas todas las que necesites)' : 'Image assets (use as needed)';
  const checklist =
    lang === 'es'
      ? `CHECKLIST OBLIGATORIO (si falta uno, el HTML será RECHAZADO):
1) Hero pantalla completa CON foto real + overlay + badge + H1 + subtítulo + 2 CTAs (texto del brief, no inventado)
2) PROHIBIDO hero gris vacío sin tipografía
3) Especialidades/servicios con imagen en cada tarjeta si el brief los lista
4) Galería visual si el brief la pide (≥6 fotos, no grid aburrido)
5) Ubicación/dirección literal del brief + footer
6) Google Fonts y colores del brief
7) HTML largo y denso (>20KB), no esqueleto`
      : `MANDATORY CHECKLIST (missing any item = REJECT):
1) Full-bleed photo hero + overlay + badge + H1 + subtitle + 2 CTAs from brief
2) No empty grey hero
3) Photo cards for listed specialties
4) Gallery if asked
5) Literal address + footer
6) Brief fonts/colors
7) Dense HTML (>20KB), not a skeleton`;

  const head =
    lang === 'es'
      ? `Brief del cliente (construye la web EXCLUSIVAMENTE a partir de esto — CONSTRUIR, no plantilla):\n\n${prompt}`
      : `Client brief (build EXCLUSIVELY from this — BUILD, do not template):\n\n${prompt}`;
  const assets = `\n\n${assetsLabel} [sector≈${pack.variant}]:\n${pack.briefBlock}`;
  const crit = critique ? `\n\n${critique}` : '';
  return `${checklist}\n\n${head}${assets}${crit}`;
}

async function generateHtmlFromBrief(
  prompt: string,
  lang: 'es' | 'en',
  pack: BriefImagePack,
  critique?: string
): Promise<{ html: string | null; provider: AiProvider | 'rules' }> {
  const userContent = userBriefContent(prompt, lang, pack, critique);

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
        { role: 'system', content: systemPrompt(lang) },
        { role: 'user', content: userContent },
      ],
      { motor, maxTokens: 16384, temperature: critique ? 0.3 : 0.4, prompt, preferProvider: provider }
    );
    if (!result.content) continue;
    const html = extractHtmlFromAiResponse(result.content);
    if (html && html.length > 8000) {
      return { html, provider: result.provider === 'rules' ? provider : result.provider };
    }
  }
  return { html: null, provider: 'rules' };
}

async function applyFalToFullPage(html: string, prompt: string, lang: 'es' | 'en'): Promise<{ html: string; falImages: number }> {
  const intent = analyzeIntent(prompt, lang);
  const profile = getBusinessProfile(intent.variant);
  const brief = buildSiteBrief(intent, profile, null, lang, prompt);
  const pack = buildBriefImagePack(prompt, lang);
  const { ensureVisibleSiteImages } = await import('./ensureVisibleSiteImages');
  const ensured = await ensureVisibleSiteImages(html, pack.urls, brief, { maxAiImages: 4 });
  return { html: ensured.html, falImages: ensured.aiImages };
}

/**
 * Generación inicial: pipeline tipo Emergent (plan → build → verify → repair).
 * Solo el brief del usuario. Sin plantillas. Sin entregar esqueletos.
 */
export async function generateSiteFromUserPrompt(
  prompt: string,
  lang: 'es' | 'en'
): Promise<PromptFirstResult> {
  // Briefs densos / “sin plantilla”: pipeline de agencia completo
  if (prompt.length > 400 || /no\s+quiero\s+(una\s+)?plantilla|no\s+bootstrap|agencia|premium/i.test(prompt)) {
    const agency = await runAgencyPipeline(prompt, lang);
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
    };
  }

  const businessName = extractBusinessNameFromPrompt(prompt, lang);
  const features = summarizeBriefFeatures(prompt, lang);
  const pack = buildBriefImagePack(prompt, lang);

  let aiHtml: string | null = null;
  let provider: AiProvider | 'rules' = 'rules';
  let critique: string | undefined;

  for (let attempt = 0; attempt < 3; attempt++) {
    const gen = await generateHtmlFromBrief(prompt, lang, pack, critique);
    if (!gen.html) break;
    let html = ensureBriefImagesInHtml(gen.html, pack.urls);
    if (!isUnacceptableAgencyHtml(html, prompt)) {
      aiHtml = html;
      provider = gen.provider;
      break;
    }
    const missing = missingBriefRequirements(html, prompt);
    critique = wireframeRejectHint(lang, pack, missing);
    aiHtml = html;
    provider = gen.provider;
  }

  if (aiHtml && !isUnacceptableAgencyHtml(aiHtml, prompt)) {
    const validation = validateSectionHtml(aiHtml, 101, 'fullpage');
    if (validation.ok) {
      const { html: finalHtml, falImages } = await applyFalToFullPage(aiHtml, prompt, lang);
      if (isUnacceptableAgencyHtml(finalHtml, prompt)) {
        const agency = await runAgencyPipeline(prompt, lang);
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
        };
      }
      return {
        ok: true,
        previewSections: [{ id: 101, type: 'fullpage', html: finalHtml }],
        businessName,
        message:
          lang === 'es'
            ? `He construido tu web directamente desde tu brief (${features}). Pide cambios concretos y los aplico sobre este diseño.`
            : `Built your site directly from your brief (${features}). Ask for specific changes and I will apply them.`,
        source: falImages ? 'hybrid' : 'ai',
        motorsUsed: ['code', 'visual'],
        providersUsed: [provider],
        pipelineStage: 'prompt_first',
        falImages,
        templateSlug: 'prompt-first',
      };
    }
  }

  // Fallback: pipeline de agencia en lugar de plantilla
  const agency = await runAgencyPipeline(prompt, lang);
  if (agency.ok || agency.message) {
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
    };
  }

  return {
    ok: false,
    previewSections: [],
    businessName,
    message:
      lang === 'es'
        ? 'No pude construir la web desde tu brief con la calidad exigida. No uso plantillas. Inténtalo de nuevo.'
        : 'Could not build from your brief at the required quality. No templates. Please try again.',
    source: 'rules',
    motorsUsed: [],
    providersUsed: [],
    pipelineStage: 'prompt_first',
    aiSkippedReason: getConfiguredProviders().length ? 'ai_parse_failed' : 'no_api_keys',
  };
}

/**
 * Reescribe el HTML completo (fullpage) según un pedido del cliente.
 * Conserva negocio/contenido del brief implícito en el HTML actual; no usa plantillas.
 */
export async function rewriteFullPageFromRequest(
  currentHtml: string,
  prompt: string,
  lang: 'es' | 'en'
): Promise<{ html: string | null; provider: string; falImages: number }> {
  const pack = buildBriefImagePack(prompt + '\n' + currentHtml.slice(0, 2000), lang);
  const system =
    lang === 'es'
      ? `Eres el motor de refinamiento de CREAUNA. El cliente ya tiene una web construida desde SU brief.
Aplica SU pedido de cambio sobre el HTML actual. No copies otra web ni cambies de sector.
Mantén el nombre del negocio y lo que no haya pedido cambiar.
Entrega calidad de agencia: hero con foto real, tipografía Google, imágenes del asset pack, formularios estilizados.
USA SOLO las URLs de imagen del usuario si necesitas fotos nuevas.
Devuelve SOLO el documento HTML completo.`
      : `You are CREAUNA's refinement engine. Apply the client's change request to the current HTML.
Do not copy another site or change sector. Keep the business name and untouched parts.
Agency quality: photo hero, Google Fonts, asset-pack images, styled forms.
Return ONLY the full HTML document.`;

  const user =
    lang === 'es'
      ? `Pedido del cliente:\n${prompt}\n\nAssets de imagen:\n${pack.briefBlock}\n\nHTML actual (edítalo):\n${currentHtml.slice(0, 28000)}`
      : `Client request:\n${prompt}\n\nImage assets:\n${pack.briefBlock}\n\nCurrent HTML (edit it):\n${currentHtml.slice(0, 28000)}`;

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
      { motor, maxTokens: 16384, temperature: 0.4, prompt, preferProvider: provider }
    );
    if (!result.content) continue;
    let html = extractHtmlFromAiResponse(result.content);
    if (!html || html.length < 4000) continue;
    if (isUnacceptableAgencyHtml(html, prompt + '\n' + currentHtml.slice(0, 500))) {
      const retry = await chatCompletion(
        [
          { role: 'system', content: system },
          { role: 'user', content: `${user}\n\n${wireframeRejectHint(lang, pack)}` },
        ],
        { motor, maxTokens: 16384, temperature: 0.3, prompt, preferProvider: provider }
      );
      const retried = retry.content ? extractHtmlFromAiResponse(retry.content) : null;
      if (retried && retried.length > 4000) html = retried;
    }
    html = ensureBriefImagesInHtml(html, pack.urls);
    const { html: finalHtml, falImages } = await applyFalToFullPage(html, prompt, lang);
    return {
      html: finalHtml,
      provider: result.provider === 'rules' ? provider : result.provider,
      falImages,
    };
  }
  return { html: null, provider: 'rules', falImages: 0 };
}
