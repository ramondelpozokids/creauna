/**
 * Pipeline de construcción tipo Emergent/Lovable adaptado a CREAUNA Studio.
 * Flujo: plan → build → verify → repair → entrega (solo si pasa calidad).
 * Sin plantillas. Sin revelar proveedores al cliente.
 */
import { chatCompletion, getConfiguredProviders, type AiProvider } from './providers';
import {
  buildBriefImagePack,
  extractBriefMustHaves,
  isSkeletonLanding,
  isUnacceptableAgencyHtml,
  missingBriefRequirements,
  type BriefImagePack,
} from './promptFirstQuality';
import { buildSiteBrief } from './siteAiEnhancer';
import { analyzeIntent } from './intentAnalyzer';
import { getBusinessProfile } from './businessProfiles';
import type { AiSkippedReason, PipelineStage } from './engineHealth';
import type { PreviewSection } from './studioEngine';

function extractHtmlFromAiResponse(raw: string): string | null {
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

function extractBusinessNameFromPrompt(prompt: string, lang: 'es' | 'en'): string {
  const patterns = [
    /(?:marca|negocio|tienda|llamad[oa]|named|brand)\s*[:\-]?\s*["']?([A-ZÁÉÍÓÚÑ][\wáéíóúñ\s&'-]{2,40})/i,
    /(?:se\s+llama|called)\s+["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = prompt.match(re);
    if (m?.[1] && m[1].trim().length >= 3) return m[1].trim();
  }
  const named = prompt.match(/Nombre\s*\n\s*([^\n]{2,60})/i);
  if (named?.[1]) return named[1].trim();
  return lang === 'es' ? 'Tu proyecto' : 'Your project';
}

export interface AgencySitePlan {
  businessName: string;
  badge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
  colors: { accent?: string; dark?: string; light?: string };
  fonts: { heading: string; body: string };
  sections: string[];
  specialties: string[];
  address?: string;
  hours?: string;
  mustHaveStrings: string[];
  styleNotes: string[];
  summaryEs: string;
}

export interface AgencyPipelineResult {
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
  plan?: AgencySitePlan;
}

const PROVIDERS: AiProvider[] = ['qwen', 'openai', 'gemini', 'claude'];

function nextLineAfter(prompt: string, label: RegExp): string | undefined {
  const lines = prompt.split(/\r?\n/);
  const sectionHeaders =
    /^(contexto|datos|objetivo|identidad|paleta|tipograf|hero|sobre|especialidad|galer|por\s+qu|experiencia|rese[nñ]|ubicaci|cta|footer|efectos|responsive|seo|rendimiento|accesibilidad|calidad|horario|nombre|categor|direcci|google|precio|t[ií]tulo|subt[ií]tulo|eslogan|badge|bot[oó]n)/i;

  for (let i = 0; i < lines.length; i++) {
    if (!label.test(lines[i].trim())) continue;
    const same = lines[i].replace(label, '').replace(/^[:\s]+/, '').trim();
    if (same.length >= 3 && !isMetaHeroPhrase(same)) return same.replace(/^["«]+|["»]+$/g, '').trim();
    for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
      const t = lines[j].trim().replace(/^["«]+|["»]+$/g, '').trim();
      if (!t) continue;
      if (sectionHeaders.test(t) && t.length < 40) continue;
      if (isMetaHeroPhrase(t)) continue;
      if (t.length >= 3) return t;
    }
  }
  return undefined;
}

/** Evita que "hero enorme / impactante / full bleed" se convierta en el H1. */
function isMetaHeroPhrase(text: string): boolean {
  const t = text.trim().replace(/[.!…]+$/g, '');
  if (t.length < 8) return true;
  return /^(enorme|huge|impactante|full[\s-]?bleed|full[\s-]?screen|pantalla\s+completa|min-h|overlay|fotograf[ií]a|imagen|v[ií]deo|video|hero|foto|banner|campa[nñ]a)(\s|$)/i.test(
    t
  ) || /^(hero|imagen|foto|v[ií]deo)\b.{0,20}\b(enorme|huge|grande|impactante)/i.test(t);
}

function sanitizeHeroTitle(
  raw: string | undefined,
  prompt: string,
  slogan: string | undefined,
  lang: 'es' | 'en'
): string {
  const elegancia = prompt.match(/La elegancia nunca pasa de moda\.?/i)?.[0]?.replace(/\.$/, '');
  if (elegancia) return elegancia;
  if (raw && !isMetaHeroPhrase(raw) && raw.length >= 8 && !/^descubre\b/i.test(raw)) return raw;
  if (slogan && slogan.length >= 8) return slogan;
  return lang === 'es' ? 'La elegancia nunca pasa de moda' : 'Elegance never goes out of style';
}

function detectSections(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const sections: string[] = ['nav', 'hero'];
  if (/sobre\s+nosotros|about|nuestra\s+historia|experiencia/i.test(lower)) sections.push('about');
  if (/especialidad|servicio|men[uú]|carta/i.test(lower) && !/tienda de (moda|ropa)|lookbook|colecci/i.test(lower)) {
    sections.push('specialties');
  }
  if (/nueva\s+colecci|colecci[oó]n/i.test(lower)) sections.push('collection');
  if (/lookbook/i.test(lower)) sections.push('lookbook');
  if (/categor[ií]as|hombre|mujer|accesorios|calzado/i.test(lower) && /moda|ropa|boutique|fashion|lookbook/i.test(lower)) {
    sections.push('categories');
  }
  if (/productos?\s+destacados|destacados/i.test(lower)) sections.push('products');
  if (/galer|instagram/i.test(lower)) sections.push('gallery');
  if (/por\s+qu[eé]|why\s+(choose|us)/i.test(lower)) sections.push('why');
  if (/promoci[oó]n|banner|oto[nñ]o/i.test(lower)) sections.push('promo');
  if (/newsletter|[uú]nete/i.test(lower)) sections.push('newsletter');
  if (/rese[nñ]a|testimon|review/i.test(lower)) sections.push('reviews');
  if (/ubicaci|mapa|direcci[oó]n|location|contacto/i.test(lower)) sections.push('location');
  if (/cta|preparado|ven a visit|descubrir ahora/i.test(lower)) sections.push('cta');
  if (/carrito|checkout|comprar/i.test(lower)) sections.push('cart');
  if (/aviso\s+legal|privacidad|cookies|mapa\s+del\s+sitio|sitemap|legales/i.test(lower)) {
    sections.push('legal', 'sitemap');
  }
  if (/whatsapp|scroll\s*up|redes\s+sociales/i.test(lower)) sections.push('widgets');
  sections.push('footer');
  return [...new Set(sections)];
}

function detectSpecialties(prompt: string): string[] {
  const espIdx = prompt.search(/especialidades|especiality|specialt/i);
  if (espIdx < 0) return [];
  const chunk = prompt.slice(espIdx, espIdx + 900);
  const stop = /^(galer|por\s+qu|experiencia|rese[nñ]|ubicaci|cta|footer|efectos|hero|sobre\s+nosotros|identidad|paleta)/i;
  const out: string[] = [];
  let started = false;
  for (const line of chunk.split(/\r?\n/)) {
    const t = line.trim().replace(/^[-•*]\s*/, '');
    if (/especialidades/i.test(t)) {
      started = true;
      continue;
    }
    if (!started) continue;
    if (stop.test(t)) break;
    if (
      t.length >= 3 &&
      t.length < 40 &&
      !/^(mostrar|cada|imagen|nombre|descripci|hover|tarjeta|premium)/i.test(t) &&
      !/^calle\b|^#|playfair|inter\b|no\s+quiero|plantilla|bootstrap|tipograf|paleta/i.test(t)
    ) {
      out.push(t);
    }
  }
  return [...new Set(out)].slice(0, 8);
}

/** Fase PLAN — como Emergent: cerrar decisiones antes de construir. */
export function buildAgencyPlanFromBrief(prompt: string, lang: 'es' | 'en'): AgencySitePlan {
  const businessName = extractBusinessNameFromPrompt(prompt, lang);
  const nameField = nextLineAfter(prompt, /^nombre\b/i);
  const badge = nextLineAfter(prompt, /^badge\b/i);
  const slogan = nextLineAfter(prompt, /^eslogan\b/i);
  const heroTitle = sanitizeHeroTitle(nextLineAfter(prompt, /^t[ií]tulo\b/i), prompt, slogan, lang);
  const heroSubtitle = nextLineAfter(prompt, /^subt[ií]tulo\b/i);
  const primaryCta =
    nextLineAfter(prompt, /^bot[oó]n\s+principal\b/i) ||
    (lang === 'es' ? 'Ver Menú' : 'View Menu');
  const secondaryCta =
    nextLineAfter(prompt, /^bot[oó]n\s+secundario\b/i) ||
    (lang === 'es' ? 'Cómo llegar' : 'Get directions');

  // Moda: CTAs por defecto distintos
  const isFashion = /moda|lookbook|colecci|ropa|boutique|fashion|velora|carrito/i.test(prompt);
  const fashionPrimary = isFashion
    ? nextLineAfter(prompt, /^bot[oó]n\s+principal\b/i) || (lang === 'es' ? 'Explorar colección' : 'Explore collection')
    : primaryCta;
  const fashionSecondary = isFashion
    ? nextLineAfter(prompt, /^bot[oó]n\s+secundario\b/i) || (lang === 'es' ? 'Nueva temporada' : 'New season')
    : secondaryCta;

  const accent = prompt.match(/#([0-9A-Fa-f]{6})/)?.[0] || (isFashion ? '#C6A75E' : undefined);
  const wantsPlayfair = /playfair/i.test(prompt);
  const wantsInter = /inter\b/i.test(prompt);
  const dark = /oscuro|dark|negro/i.test(prompt);
  const address =
    prompt.match(/Calle\s+[^\n]+(?:\nEsquina[^\n]+)?\n?\d{5}\s+\w+/i)?.[0]?.replace(/\n+/g, ', ') ||
    prompt.match(/Calle\s+[A-Za-zÁÉÍÓÚáéíóúñÑ][^\n,]{3,50}/)?.[0];
  const hours = nextLineAfter(prompt, /^horario\b/i) || (/hasta\s+las\s+00:00/i.test(prompt) ? 'Todos los días hasta las 00:00' : undefined);

  let specialties = detectSpecialties(prompt);
  if (isFashion && specialties.length === 0) {
    specialties = ['Hombre', 'Mujer', 'Calzado', 'Accesorios'].filter((c) =>
      new RegExp(c, 'i').test(prompt)
    );
  }
  const mustHaveStrings = extractBriefMustHaves(prompt);
  if (slogan && !mustHaveStrings.includes(slogan)) mustHaveStrings.unshift(slogan);
  if (heroTitle && !mustHaveStrings.some((m) => m.includes(heroTitle.slice(0, 20)))) {
    mustHaveStrings.unshift(heroTitle);
  }

  const styleNotes: string[] = [];
  if (dark) styleNotes.push(lang === 'es' ? 'Estética oscura premium' : 'Dark premium aesthetic');
  if (/minimal|elegante|premium|fotograf/i.test(prompt)) styleNotes.push(lang === 'es' ? 'Fotografía protagonista' : 'Photography-led');
  if (/glass|cristal|navbar/i.test(prompt)) styleNotes.push('Navbar glass on scroll');
  if (/parallax|intersection|fade|microanim|scroll reveal/i.test(prompt)) styleNotes.push('Subtle motion / IO');
  if (/no\s+plantilla|no\s+bootstrap/i.test(prompt)) styleNotes.push(lang === 'es' ? 'Sin plantilla ni Bootstrap' : 'No template / Bootstrap');
  if (isFashion) {
    styleNotes.push(lang === 'es' ? 'Lookbook editorial tipo revista' : 'Editorial lookbook');
    styleNotes.push(lang === 'es' ? 'Hero full-bleed con vídeo o foto campaña + poster' : 'Full-bleed hero video or campaign still');
    styleNotes.push(lang === 'es' ? 'Productos con hover swap de imagen + Comprar' : 'Product cards with hover image swap + Buy');
  }
  if (/aviso\s+legal|privacidad|cookies|mapa\s+del\s+sitio|sitemap/i.test(prompt)) {
    styleNotes.push(
      lang === 'es'
        ? 'Páginas/secciones: Aviso legal, Privacidad, Cookies, Mapa del sitio + enlaces en footer'
        : 'Legal notice, Privacy, Cookies, Sitemap + footer links'
    );
  }
  if (/whatsapp|scroll|redes\s+sociales/i.test(prompt)) {
    styleNotes.push(
      lang === 'es'
        ? 'Botón WhatsApp flotante (verde oficial), scroll-up y redes con iconos de marca (Instagram, Facebook, TikTok, X, Pinterest, YouTube)'
        : 'WhatsApp FAB, scroll-up, brand social icon buttons'
    );
  }

  const sections = detectSections(prompt);

  return {
    businessName: nameField || businessName,
    badge: badge || slogan,
    heroTitle,
    heroSubtitle,
    primaryCta: fashionPrimary,
    secondaryCta: fashionSecondary,
    colors: {
      accent: accent || (dark ? '#D62828' : undefined),
      dark: dark ? '#0A0A0A' : undefined,
      light: '#FFFFFF',
    },
    fonts: {
      heading: wantsPlayfair || isFashion ? 'Playfair Display' : 'Playfair Display',
      body: wantsInter || isFashion ? 'Inter' : 'Inter',
    },
    sections,
    specialties,
    address,
    hours,
    mustHaveStrings: [...new Set(mustHaveStrings.map((s) => s.trim()).filter((s) => s.length >= 4))].slice(0, 14),
    styleNotes,
    summaryEs: [
      `${nameField || businessName}`,
      slogan ? `«${slogan}»` : null,
      heroTitle ? `Hero: «${heroTitle}»` : null,
      specialties.length ? `Categorías: ${specialties.join(', ')}` : null,
      sections.filter((s) => !['nav', 'hero', 'footer'].includes(s)).join(' · ') || null,
    ]
      .filter(Boolean)
      .join(' · '),
  };
}

function planBlock(plan: AgencySitePlan, lang: 'es' | 'en'): string {
  return lang === 'es'
    ? `PLAN DE CONSTRUCCIÓN (obligatorio — como briefing de agencia aprobado):
Negocio: ${plan.businessName}
Badge: ${plan.badge || '—'}
H1 hero: ${plan.heroTitle || '—'}
Subtítulo: ${plan.heroSubtitle || '—'}
CTA primario: ${plan.primaryCta}
CTA secundario: ${plan.secondaryCta}
Colores: accent ${plan.colors.accent || 'según brief'}, dark ${plan.colors.dark || '—'}
Fuentes: ${plan.fonts.heading} + ${plan.fonts.body}
Secciones en orden: ${plan.sections.join(' → ')}
Especialidades (cada una con FOTO): ${plan.specialties.join(', ') || 'según brief'}
Dirección: ${plan.address || '—'}
Horario: ${plan.hours || '—'}
Textos literales obligatorios: ${plan.mustHaveStrings.join(' | ') || '—'}
Notas de estilo: ${plan.styleNotes.join('; ') || '—'}

REGLAS DURAS:
- CONSTRUIR desde el brief, NO plantilla, NO Bootstrap, NO esqueleto.
- Hero: min-h-[78vh] max-h-[100vh] con <img> full-bleed (object-cover) usando la URL hero del pack de assets + overlay oscuro + H1 BLANCO (text-white) + subtítulo + 2 CTAs.
- El H1 es el titular de marketing («${plan.heroTitle}»). NUNCA uses como H1 palabras de tamaño (enorme, huge, impactante, full-bleed).
- PROHIBIDO hero de color sólido sin foto; PROHIBIDO zoom extremo / crop absurdo de la imagen.
- Si hay lookbook/colección/productos: fotos grandes, hover swap donde el brief lo pida, botones Comprar.
- NO implementes Stripe ni carrito de pago real. Catálogo visual sí; cobros = presupuesto en /contacto.
- Si el plan incluye legales/widgets: secciones #aviso-legal #privacidad #cookies #mapa-sitio, botón WhatsApp #25D366, scroll-up y redes con colores oficiales.
- HTML completo denso (>25KB ideal).
- Devuelve SOLO el HTML.`
    : `BUILD PLAN (mandatory):
${JSON.stringify(plan, null, 2)}
Build from brief only. No templates. Full dense HTML. Photo hero with object-cover required. H1 must be marketing headline not size adjectives. Legal + WhatsApp + scroll-up + brand socials if in plan. Return ONLY HTML.`;
}

async function callBuild(
  system: string,
  user: string,
  prompt: string
): Promise<{ html: string | null; provider: AiProvider | 'rules' }> {
  for (const provider of PROVIDERS) {
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
      { motor, maxTokens: 16384, temperature: 0.35, prompt, preferProvider: provider }
    );
    if (!result.content) continue;
    const html = extractHtmlFromAiResponse(result.content);
    if (html && html.length > 10000) {
      return { html, provider: result.provider === 'rules' ? provider : result.provider };
    }
  }
  return { html: null, provider: 'rules' };
}

function verifyDeterministic(html: string, plan: AgencySitePlan, prompt: string): string[] {
  const issues: string[] = [];
  if (isUnacceptableAgencyHtml(html, prompt)) {
    issues.push('Calidad insuficiente: wireframe / hero vacío / falta densidad');
  }
  if (plan.heroTitle && !html.toLowerCase().includes(plan.heroTitle.toLowerCase())) {
    issues.push(`Falta el H1 del brief: «${plan.heroTitle}»`);
  }
  if (plan.badge && !html.toLowerCase().includes(plan.badge.toLowerCase().slice(0, 20))) {
    issues.push(`Falta el badge: «${plan.badge}»`);
  }
  for (const s of plan.specialties.slice(0, 4)) {
    if (!html.toLowerCase().includes(s.toLowerCase())) {
      issues.push(`Falta especialidad: «${s}»`);
    }
  }
  if (plan.address && !/Pilar Nogueiro|Puerto Canfranc|Calle\s+/i.test(html) && plan.address.length > 8) {
    const fragment = plan.address.slice(0, 18);
    if (!html.includes(fragment)) issues.push(`Falta dirección del brief`);
  }
  if (!/fonts\.googleapis\.com/i.test(html)) issues.push('Faltan Google Fonts');
  if ((html.match(/<img\b/gi) || []).length + (html.match(/background-image\s*:\s*url\(/gi) || []).length < 5) {
    issues.push('Pocas imágenes reales');
  }
  if (!/<h1\b/i.test(html)) issues.push('Falta H1');
  const missing = missingBriefRequirements(html, prompt);
  for (const m of missing.slice(0, 4)) issues.push(`Falta texto del brief: «${m}»`);
  return [...new Set(issues)];
}

async function applyImages(html: string, prompt: string, lang: 'es' | 'en', pack: BriefImagePack) {
  const intent = analyzeIntent(prompt, lang);
  const profile = getBusinessProfile(intent.variant);
  const brief = buildSiteBrief(intent, profile, null, lang, prompt);
  const { ensureVisibleSiteImages } = await import('./ensureVisibleSiteImages');
  const ensured = await ensureVisibleSiteImages(html, pack.urls, brief, { maxAiImages: 4 });
  return { html: ensured.html, falImages: ensured.aiImages };
}

/** Corrige H1 basura («Enorme.») y asegura foto hero del pack con altura controlada. */
function polishHeroHtml(html: string, plan: AgencySitePlan, pack: BriefImagePack): string {
  let out = html;
  const title = plan.heroTitle || 'La elegancia nunca pasa de moda';
  const heroUrl = (pack.urls[0] || '').replace(/"/g, '%22');

  // Sustituir H1 meta (enorme / huge / una sola palabra corta)
  out = out.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/i, (_m, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    if (isMetaHeroPhrase(text) || /^enorme\.?$/i.test(text)) {
      let a = attrs;
      if (!/text-white/i.test(a)) {
        if (/class="/i.test(a)) a = a.replace(/class="/i, 'class="text-white drop-shadow-lg ');
        else a += ' class="text-white drop-shadow-lg"';
      }
      return `<h1${a}>${title}</h1>`;
    }
    let a = attrs;
    if (!/text-white|text-\[#f/i.test(a)) {
      if (/class="/i.test(a)) a = a.replace(/class="/i, 'class="text-white ');
      else a += ' class="text-white"';
    }
    return `<h1${a}>${inner}</h1>`;
  });

  if (!heroUrl) return out;

  // Si el hero no tiene img de stock/fal, inyectar capa de fondo
  const heroChunk = out.match(/<section[^>]*(?:id=["'](?:inicio|hero|home)["']|class=["'][^"']*hero)[^>]*>[\s\S]{0,2500}/i);
  const heroHasImg = heroChunk ? /<img\b/i.test(heroChunk[0]) : /min-h-\[(?:7|8|9|100)|h-screen[\s\S]{0,800}<img\b/i.test(out);
  if (!heroHasImg || /background(?:-color)?:\s*(?:#|rgb|olive|khaki|solid)/i.test(heroChunk?.[0] || '')) {
    const layer = `<div class="absolute inset-0 -z-10 overflow-hidden" data-cua-hero-fix>
  <img src="${heroUrl}" alt="" class="w-full h-full object-cover object-center" fetchpriority="high" referrerpolicy="no-referrer" />
  <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/65"></div>
</div>`;
    if (/<section[^>]*(?:id=["'](?:inicio|hero|home)["']|class=["'][^"']*hero)[^>]*>/i.test(out)) {
      out = out.replace(
        /(<section[^>]*(?:id=["'](?:inicio|hero|home)["']|class=["'][^"']*hero)[^>]*>)/i,
        `$1\n${layer}`
      );
      // relative positioning
      out = out.replace(
        /(<section)([^>]*(?:id=["'](?:inicio|hero|home)["']|class=["'][^"']*hero)[^>]*>)/i,
        (_m, tag: string, rest: string) => {
          if (/relative/i.test(rest)) return `${tag}${rest}`;
          if (/class="/i.test(rest)) return `${tag}${rest.replace(/class="/i, 'class="relative overflow-hidden ')}`;
          return `${tag} class="relative overflow-hidden"${rest.replace(/^/, '')}`;
        }
      );
    }
  }

  // Limitar altura monstruosa
  out = out.replace(/min-h-\[(?:95|100|110|120)vh\]/gi, 'min-h-[82vh]');
  out = out.replace(/min-h-screen/gi, 'min-h-[82vh]');
  // Imágenes hero: object-cover + max height
  out = out.replace(
    /(<section[^>]*(?:hero|inicio)[^>]*>[\s\S]*?<img\b)([^>]*?)(>)/i,
    (_m, pre: string, attrs: string, close: string) => {
      let a = attrs;
      if (!/object-cover/i.test(a)) {
        if (/class="/i.test(a)) a = a.replace(/class="/i, 'class="object-cover object-center ');
        else a += ' class="object-cover object-center w-full h-full"';
      }
      return `${pre}${a}${close}`;
    }
  );

  return out;
}

/**
 * Pipeline completo (Emergent-style):
 * 1) Plan desde brief
 * 2) Build HTML con plan cerrado
 * 3) Verify determinista
 * 4) Repair si falla (1–2 pases)
 * 5) Imágenes
 * 6) Verify final — si falla, NO entregar
 */
export async function runAgencyPipeline(
  prompt: string,
  lang: 'es' | 'en'
): Promise<AgencyPipelineResult> {
  const plan = buildAgencyPlanFromBrief(prompt, lang);
  const pack = buildBriefImagePack(prompt, lang);
  const businessName = plan.businessName;

  if (!getConfiguredProviders().length) {
    return {
      ok: false,
      previewSections: [],
      businessName,
      message:
        lang === 'es'
          ? 'No se puede construir ahora: el Studio no está listo. Inténtalo de nuevo más tarde.'
          : 'Cannot build now: Studio is not ready. Please try again later.',
      source: 'rules',
      motorsUsed: [],
      providersUsed: [],
      pipelineStage: 'agency_pipeline',
      aiSkippedReason: 'no_api_keys',
      plan,
    };
  }

  const system =
    lang === 'es'
      ? `Eres el director creativo y desarrollador de CREAUNA. Construyes webs de negocio cobrables (nivel agencia 2.000–5.000 €).
Trabajas SOLO desde el brief y el PLAN aprobado. No uses plantillas. No inventes otra marca.
Entregas UN documento HTML completo con Tailwind CDN, Google Fonts, foto hero, secciones densas y JS mínimo para navbar/scroll/lightbox si el plan lo pide.
Devuelve SOLO HTML.`
      : `You are CREAUNA's creative director/developer. Build billable agency-grade business sites from the brief + approved PLAN only. No templates. Return ONLY full HTML.`;

  const assets = `\n\nAssets de imagen (USA SOLO ESTAS URLs — Unsplash/Pexels curados, licencia comercial. NO inventes IDs):\n${pack.briefBlock}`;
  const briefBlock = `\n\nBRIEF COMPLETO DEL CLIENTE:\n${prompt}`;

  let provider: AiProvider | 'rules' = 'rules';
  let html: string | null = null;

  // Fase BUILD
  const built = await callBuild(
    system,
    `${planBlock(plan, lang)}${assets}${briefBlock}`,
    prompt
  );
  html = built.html;
  provider = built.provider;

  if (!html) {
    return {
      ok: false,
      previewSections: [],
      businessName,
      message:
        lang === 'es'
          ? 'No pude generar la web desde tu brief. Sin plantillas. Vuelve a intentarlo.'
          : 'Could not generate the site from your brief. No templates. Please retry.',
      source: 'rules',
      motorsUsed: [],
      providersUsed: [],
      pipelineStage: 'agency_pipeline',
      aiSkippedReason: 'ai_parse_failed',
      plan,
    };
  }

  // Fase VERIFY + REPAIR (hasta 2)
  for (let round = 0; round < 2; round++) {
    const issues = verifyDeterministic(html, plan, prompt);
    if (issues.length === 0) break;

    const repairUser =
      lang === 'es'
        ? `${planBlock(plan, lang)}${assets}

REPARACIÓN OBLIGATORIA — el HTML anterior FALLÓ la verificación de calidad:
${issues.map((i) => `- ${i}`).join('\n')}

Reescribe el documento HTML COMPLETO corrigiendo TODOS los puntos. Mantén el negocio y el brief. No entregues esqueleto.
HTML previo (referencia, mejóralo):\n${html.slice(0, 22000)}`
        : `Fix ALL quality issues and return FULL HTML:\n${issues.join('\n')}\n\nPrevious HTML:\n${html.slice(0, 22000)}${assets}`;

    const repaired = await callBuild(system, repairUser, prompt);
    if (repaired.html) {
      html = repaired.html;
      provider = repaired.provider;
    } else {
      break;
    }
  }

  // Imágenes + pulido hero (titular + foto + altura)
  const imaged = await applyImages(html, prompt, lang, pack);
  html = polishHeroHtml(imaged.html, plan, pack);
  const { injectSiteChrome } = await import('./siteChrome');
  html = injectSiteChrome(html, { prompt, lang, businessName });

  // Verify final — solo bloquear esqueletos; si hay HTML denso, entregar con aviso
  const finalIssues = verifyDeterministic(html, plan, prompt);
  const unacceptable = isUnacceptableAgencyHtml(html, prompt);
  const isJunk =
    !html ||
    html.length < 12000 ||
    isSkeletonLanding(html) ||
    (unacceptable && finalIssues.length >= 4);

  if (isJunk && (finalIssues.length > 0 || unacceptable)) {
    return {
      ok: false,
      previewSections: [],
      businessName,
      message:
        lang === 'es'
          ? 'He construido y verificado tu web, pero no alcanzó el nivel de calidad que exigimos (como en una agencia). No entrego ese resultado. Pulsa Regenerar para un nuevo intento.'
          : 'Built and verified, but it did not meet our agency quality bar. Not delivering. Press Regenerate for a new attempt.',
      source: 'ai',
      motorsUsed: ['code', 'visual'],
      providersUsed: provider !== 'rules' ? [provider] : [],
      pipelineStage: 'agency_pipeline',
      aiSkippedReason: 'validation_failed',
      plan,
    };
  }

  const qualityNote =
    finalIssues.length > 0 || unacceptable
      ? lang === 'es'
        ? ' Hay detalles por pulir: pide cambios concretos (hero, lookbook, tipografía…) y los aplico.'
        : ' Some polish may remain: ask for specific changes and I will apply them.'
      : '';


  return {
    ok: true,
    previewSections: [{ id: 101, type: 'fullpage', html }],
    businessName,
    message:
      lang === 'es'
        ? `He construido tu web desde tu brief (plan → construcción → verificación). ${plan.summaryEs}.${qualityNote} Pide cambios concretos y los aplico sobre este diseño.`
        : `Built your site from your brief (plan → build → verify).${qualityNote} Ask for specific changes.`,
    source: imaged.falImages ? 'hybrid' : 'ai',
    motorsUsed: ['code', 'visual', 'copy', 'ux'],
    providersUsed: provider !== 'rules' ? [provider] : [],
    pipelineStage: 'agency_pipeline',
    falImages: imaged.falImages,
    templateSlug: 'prompt-first',
    plan,
  };
}
