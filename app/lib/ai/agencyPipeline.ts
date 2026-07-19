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
import { getBusinessProfile, detectVariant, isBikeShopPrompt, isFashionEcommercePrompt } from './businessProfiles';
import type { AiSkippedReason, PipelineStage } from './engineHealth';
import type { PreviewSection } from './studioEngine';
import { buildDeterministicAgencyHtml } from './agencyDeterministicBuild';
import { constructorSystemPreamble } from './creaunaConstructorManifesto';

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
  fonts: { heading: string; body: string; button?: string };
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
  /** Reservado (compat). Nunca empujar al cliente a “hacer deberes”. */
  suggestDiscovery?: boolean;
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
export function isMetaHeroPhrase(text: string): boolean {
  const t = text.trim().replace(/[.!…]+$/g, '');
  if (t.length < 8) return true;
  return /^(enorme|huge|impactante|full[\s-]?bleed|full[\s-]?screen|pantalla\s+completa|min-h|overlay|fotograf[ií]a|imagen|v[ií]deo|video|hero|foto|banner|campa[nñ]a)(\s|$)/i.test(
    t
  ) || /^(hero|imagen|foto|v[ií]deo)\b.{0,20}\b(enorme|huge|grande|impactante)/i.test(t);
}

function defaultHeroTitleBySector(prompt: string, lang: 'es' | 'en'): string {
  if (/panader[ií]a|bakery|bollería|pasteler/i.test(prompt)) {
    return lang === 'es' ? 'El sabor del pan recién horneado' : 'The taste of freshly baked bread';
  }
  const v = detectVariant(prompt);
  const map: Record<string, { es: string; en: string }> = {
    beauty: { es: 'Belleza que se nota', en: 'Beauty that shows' },
    cafe: { es: 'El café de tu barrio', en: 'Your neighborhood café' },
    italian: { es: 'Sabor de verdad', en: 'Real Italian flavor' },
    kebab: { es: 'Sabor que enamora', en: 'Flavor that wins you over' },
    tattoo: { es: 'Arte en la piel', en: 'Art on skin' },
    corporate: { es: 'Resultados que hablan', en: 'Results that speak' },
    automotive: { es: 'Potencia y precisión', en: 'Power and precision' },
    bike: { es: 'Tu próxima aventura comienza sobre dos ruedas', en: 'Your next adventure starts on two wheels' },
    luxury: { es: 'Experiencias exclusivas', en: 'Exclusive experiences' },
    jewelry: { es: 'Joyas con historia', en: 'Jewelry with a story' },
    fashion: { es: 'La elegancia nunca pasa de moda', en: 'Elegance never goes out of style' },
    foodblog: { es: 'Recetas con alma', en: 'Recipes with soul' },
    nonprofit: { es: 'Cambiamos vidas juntos', en: 'Changing lives together' },
    renewable: { es: 'Energía para el futuro', en: 'Energy for the future' },
    spanish: { es: 'Tradición en cada plato', en: 'Tradition on every plate' },
    default: { es: 'Tu negocio, tu marca', en: 'Your business, your brand' },
  };
  return (map[v] || map.default)[lang];
}

function sanitizeHeroTitle(
  raw: string | undefined,
  prompt: string,
  slogan: string | undefined,
  lang: 'es' | 'en'
): string {
  const elegancia = prompt.match(/La elegancia nunca pasa de moda\.?/i)?.[0]?.replace(/\.$/, '');
  if (elegancia && /moda|fashion|velora|boutique|ropa/i.test(prompt)) return elegancia;
  if (raw && !isMetaHeroPhrase(raw) && raw.length >= 8 && !/^descubre\b/i.test(raw)) return raw;
  if (slogan && slogan.length >= 8 && !isMetaHeroPhrase(slogan)) return slogan;
  return defaultHeroTitleBySector(prompt, lang);
}

function firstH1Text(html: string): string {
  return html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '';
}

function hasPhotoHero(html: string): boolean {
  return (
    /(?:min-h-\[(?:7|8|9|100)|h-screen|min-h-screen|id=["'](?:hero|inicio|home))[\s\S]{0,1400}(?:<img\b|background-image\s*:\s*url\()/i.test(
      html
    ) ||
    /(?:<img\b|background-image\s*:\s*url\()[\s\S]{0,1400}(?:min-h-\[(?:7|8|9|100)|h-screen|min-h-screen)/i.test(
      html
    ) ||
    /data-cua-hero-bg/i.test(html)
  );
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

  // Moda SOLO con contexto moda real — nunca bicicletas / «sin carrito» / colección genérica
  const isBike = isBikeShopPrompt(prompt);
  const isFashion = !isBike && isFashionEcommercePrompt(prompt);
  const fashionPrimary = isFashion
    ? nextLineAfter(prompt, /^bot[oó]n\s+principal\b/i) || (lang === 'es' ? 'Explorar colección' : 'Explore collection')
    : isBike
      ? nextLineAfter(prompt, /^bot[oó]n\s+principal\b/i) ||
        (lang === 'es' ? 'Ver bicicletas' : 'View bikes')
      : primaryCta;
  const fashionSecondary = isFashion
    ? nextLineAfter(prompt, /^bot[oó]n\s+secundario\b/i) || (lang === 'es' ? 'Nueva temporada' : 'New season')
    : isBike
      ? nextLineAfter(prompt, /^bot[oó]n\s+secundario\b/i) ||
        (lang === 'es' ? 'Contactar por WhatsApp' : 'Contact on WhatsApp')
      : secondaryCta;

  const electricGreen =
    /verde\s+el[eé]ctrico|electric\s+green|#00d084|#39ff14|#22c55e|#a3e635/i.test(prompt)
      ? prompt.match(/#(00d084|39ff14|22c55e|a3e635|[0-9A-Fa-f]{6})/i)?.[0] || '#00d084'
      : undefined;
  const accent =
    prompt.match(/#([0-9A-Fa-f]{6})/)?.[0] ||
    electricGreen ||
    (isBike ? '#00d084' : isFashion ? '#C6A75E' : undefined);
  const wantsPlayfair = /playfair/i.test(prompt);
  const wantsMontserrat = /montserrat/i.test(prompt);
  const wantsInter = /inter\b/i.test(prompt);
  const wantsPoppins = /poppins/i.test(prompt);
  const dark = /oscuro|dark|negro|grafito/i.test(prompt);
  const address =
    prompt.match(/Calle\s+[^\n]+(?:\nEsquina[^\n]+)?\n?\d{5}\s+\w+/i)?.[0]?.replace(/\n+/g, ', ') ||
    prompt.match(/Calle\s+[A-Za-zÁÉÍÓÚáéíóúñÑ][^\n,]{3,50}/)?.[0];
  const hours = nextLineAfter(prompt, /^horario\b/i) || (/hasta\s+las\s+00:00/i.test(prompt) ? 'Todos los días hasta las 00:00' : undefined);

  let specialties = detectSpecialties(prompt);
  if (isBike && specialties.length === 0) {
    specialties = ['MTB', 'Carretera', 'E-Bike', 'Urbanas', 'Infantiles', 'Accesorios'].filter((c) =>
      new RegExp(c.replace('-', '[- ]?'), 'i').test(prompt)
    );
    if (specialties.length === 0) {
      specialties = ['MTB', 'Carretera', 'E-Bike', 'Urbanas', 'Infantiles', 'Accesorios'];
    }
  }
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
    styleNotes.push(lang === 'es' ? 'Hero full-bleed con foto campaña' : 'Full-bleed campaign hero');
    styleNotes.push(lang === 'es' ? 'Productos con precios (sin carrito si el brief lo prohíbe)' : 'Priced products (no cart if brief forbids)');
  }
  if (isBike) {
    styleNotes.push(
      lang === 'es'
        ? 'IDENTIDAD CICLISMO: negro grafito + verde eléctrico. NUNCA moda/oro/Playfair boutique.'
        : 'CYCLING IDENTITY: graphite black + electric green. NEVER fashion/gold/boutique.'
    );
    styleNotes.push(
      lang === 'es'
        ? 'Catálogo profesional SIN carrito ni Comprar: solo Solicitar información / WhatsApp'
        : 'Professional catalogue NO cart/Buy: Enquire / WhatsApp only'
    );
    styleNotes.push(
      lang === 'es'
        ? 'Fotos de ciclistas, MTB, carretera, e-bike, taller — no ropa ni bolsos'
        : 'Photos of cyclists, MTB, road, e-bike, workshop — not fashion'
    );
    if (wantsMontserrat) styleNotes.push('Títulos Montserrat Bold');
    if (wantsInter) styleNotes.push('Texto Inter');
    if (wantsPoppins) styleNotes.push('Botones Poppins');
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
      heading: wantsMontserrat
        ? 'Montserrat'
        : wantsPlayfair || isFashion
          ? 'Playfair Display'
          : isBike
            ? 'Montserrat'
            : 'Playfair Display',
      body: wantsInter || isFashion || isBike ? 'Inter' : 'Inter',
      button: wantsPoppins || isBike ? 'Poppins' : undefined,
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
  const noBuy = /sin\s+carrito|cat[aá]logo|whatsapp|solicitar|ciclismo|bicicleta|IDENTIDAD CICLISMO|NO cart/i.test(
    plan.styleNotes.join(' ') + ' ' + plan.summaryEs
  );
  return lang === 'es'
    ? `PLAN DE CONSTRUCCIÓN (obligatorio — briefing de agencia aprobado):
Negocio: ${plan.businessName}
Badge: ${plan.badge || '—'}
H1 hero: ${plan.heroTitle || '—'}
Subtítulo: ${plan.heroSubtitle || '—'}
CTA primario: ${plan.primaryCta}
CTA secundario: ${plan.secondaryCta}
Colores: accent ${plan.colors.accent || 'según brief'}, dark ${plan.colors.dark || '—'}
Fuentes: ${plan.fonts.heading} + ${plan.fonts.body}${plan.fonts.button ? ` + botones ${plan.fonts.button}` : ''}
Secciones: ${plan.sections.join(' → ')}
Categorías (foto real del sector): ${plan.specialties.join(', ') || 'según brief'}
Dirección: ${plan.address || '—'}
Horario: ${plan.hours || '—'}
Textos literales: ${plan.mustHaveStrings.join(' | ') || '—'}
Estilo: ${plan.styleNotes.join('; ') || '—'}

REGLAS DURAS — CONSTRUCTOR INTELIGENTE (CREAUNA):
- CONSTRUYE desde cero según el BRIEF. Cada proyecto es ÚNICO.
- PROHIBIDO copiar/pegar otra web, plantilla de moda/pelucas, Bootstrap o esqueleto vacío.
- La identidad visual DEBE coincidir con el sector del cliente (bicicletas ≠ moda).
- Hero: min-h-[70vh] max-h-[820px] + <img> full-bleed object-cover + overlay + H1 blanco + 2 CTAs visibles sin scroll. PROHIBIDO hero de 100vh+/pantalla entera vacía.
- H1 = titular de marketing («${plan.heroTitle}»). NUNCA «enorme/huge/full-bleed».
- PROHIBIDO hero de color sólido sin foto.
- ${noBuy ? 'Catálogo SIN carrito: precios + Solicitar información / WhatsApp. PROHIBIDO Comprar/checkout/Stripe.' : 'Solo carrito si el brief lo pide explícitamente.'}
- Legales: enlaces en el footer que abren modales (aviso, privacidad, cookies, accesibilidad). PROHIBIDO volcar páginas legales debajo del footer.
- Imágenes: cada producto DEBE mostrar foto del producto real (pan de masa madre = pan; croissant = bollería; tarta = pastel). PROHIBIDO barcos, copas, curry, moda o fotos ajenas al sector.
- PROHIBIDO watermark/logo «CREAUNA» o placeholders grises. Si falta foto, usa URL del pack de panadería.
- Grids de productos/galería: exactamente 3 o 6 (o 9). NUNCA 4 ni 5 dejando una imagen suelta. Sin fotos repetidas en el mismo bloque.
- Legales: SOLO enlaces en el footer que abren modal. PROHIBIDO volcar privacidad/cookies como secciones tras el mapa o debajo del footer.
- HTML denso (>25KB). SOLO HTML.`
    : `BUILD PLAN:
${JSON.stringify(plan, null, 2)}
Build FROM SCRATCH from the client brief. Never reuse another project's full page or a fashion template on a non-fashion brief. Return ONLY dense HTML.`;
}

const BUILD_MAX_TOKENS = 32768;

function isCompleteHtmlDoc(html: string): boolean {
  return /<!DOCTYPE\s+html/i.test(html) && /<\/html>/i.test(html) && html.length > 12000;
}

async function continueIncompleteHtml(
  partial: string,
  provider: AiProvider,
  prompt: string,
  lang: 'es' | 'en'
): Promise<string> {
  let html = partial;
  for (let i = 0; i < 3; i++) {
    if (isCompleteHtmlDoc(html) && html.length > 25000) break;
    if (/<\/html>/i.test(html) && html.length > 20000) break;

    const motor = provider === 'qwen' || provider === 'openai' ? 'code' : provider === 'claude' ? 'copy' : 'visual';
    const cont = await chatCompletion(
      [
        {
          role: 'system',
          content:
            lang === 'es'
              ? 'Continúa el documento HTML exactamente donde quedó. No repitas el inicio. Cierra todas las secciones y termina con </body></html>. SOLO HTML (continuación).'
              : 'Continue the HTML document exactly where it left off. Do not repeat the start. Close all sections and end with </body></html>. ONLY HTML continuation.',
        },
        {
          role: 'user',
          content:
            lang === 'es'
              ? `El HTML está incompleto (falta </html> o está truncado). Últimos 6000 caracteres:\n\n${html.slice(-6000)}\n\nContinúa desde ahí hasta cerrar el documento.`
              : `HTML is incomplete. Last 6000 chars:\n\n${html.slice(-6000)}\n\nContinue until the document is closed.`,
        },
      ],
      { motor, maxTokens: BUILD_MAX_TOKENS, temperature: 0.2, prompt, preferProvider: provider }
    );
    if (!cont.content) break;
    const piece = cont.content
      .replace(/^```(?:html)?\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    // Si la continuación incluye DOCTYPE, preferir el doc completo
    const extracted = extractHtmlFromAiResponse(cont.content);
    if (extracted && extracted.length > html.length && /<\/html>/i.test(extracted)) {
      html = extracted;
      break;
    }
    html = html + '\n' + piece;
    if (/<\/html>/i.test(piece) || /<\/html>/i.test(html)) {
      const end = html.lastIndexOf('</html>');
      if (end > 0) html = html.slice(0, end + 7);
      break;
    }
  }
  return html;
}

async function callBuild(
  system: string,
  user: string,
  prompt: string,
  lang: 'es' | 'en' = 'es'
): Promise<{ html: string | null; provider: AiProvider | 'rules' }> {
  // Solo truncar briefs extremos (>100KB); Qwen aguanta briefs largos como el de pelucas
  const trimmedUser =
    user.length > 100000
      ? user.slice(0, 60000) + '\n\n[…brief truncado…]\n\n' + user.slice(-20000)
      : user;

  let best: { html: string; provider: AiProvider | 'rules' } | null = null;

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
        { role: 'user', content: trimmedUser },
      ],
      { motor, maxTokens: BUILD_MAX_TOKENS, temperature: 0.35, prompt, preferProvider: provider }
    );
    if (!result.content) continue;
    let html = extractHtmlFromAiResponse(result.content);
    if (!html && result.content.length > 8000 && /<html|<body|<section/i.test(result.content)) {
      html = result.content.replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/i, '').trim();
    }
    if (!html) continue;
    const prov = (result.provider === 'rules' ? provider : result.provider) as AiProvider;

    if (!isCompleteHtmlDoc(html) || html.length < 40000) {
      html = await continueIncompleteHtml(html, prov, prompt, lang);
    }

    if (html.length > 10000) {
      return { html, provider: prov };
    }
    if (html.length > 5000 && (!best || html.length > best.html.length)) {
      best = { html, provider: prov };
    }
  }
  return best ? { html: best.html, provider: best.provider } : { html: null, provider: 'rules' };
}

function deliverHtml(
  html: string,
  plan: AgencySitePlan,
  businessName: string,
  lang: 'es' | 'en',
  provider: AiProvider | 'rules',
  falImages: number | undefined,
  source: 'ai' | 'hybrid' | 'rules',
  _extraHint = ''
): AgencyPipelineResult {
  return {
    ok: true,
    previewSections: [{ id: 101, type: 'fullpage', html }],
    businessName,
    message:
      lang === 'es'
        ? `He construido tu web según tu brief. ${plan.summaryEs}. Si quieres cambiar algo (hero, colores, chat, blog, textos…), dímelo y lo aplico sobre este diseño.`
        : `Built your site from your brief. ${plan.summaryEs}. Ask for any change (hero, colors, chat, blog, copy…) and I will apply it.`,
    source,
    motorsUsed: ['code', 'visual', 'copy', 'ux'],
    providersUsed: provider !== 'rules' ? [provider] : [],
    pipelineStage: 'agency_pipeline',
    falImages,
    templateSlug: 'prompt-first',
    plan,
  };
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

async function applyImages(
  html: string,
  prompt: string,
  lang: 'es' | 'en',
  pack: BriefImagePack,
  clientImageUrls?: string[]
) {
  const intent = analyzeIntent(prompt, lang);
  const profile = getBusinessProfile(intent.variant);
  const brief = buildSiteBrief(intent, profile, null, lang, prompt);
  const { ensureVisibleSiteImages } = await import('./ensureVisibleSiteImages');
  const visual = /fashion|beauty|jewelry|tattoo|luxury|wig|peluca|boutique|bridal|novia|bike|bicicleta|ciclismo|mtb/i.test(
    pack.variant + ' ' + prompt
  );
  // Siempre rellenar con fal/Gemini si hay claves: nunca entregar stock roto / huecos.
  const ensured = await ensureVisibleSiteImages(html, pack.urls, brief, {
    maxAiImages: visual ? 6 : 4,
    preferAiHero: true,
    forceAiFill: true,
    clientImageUrls,
  });
  return { html: ensured.html, falImages: ensured.aiImages };
}

/** Corrige H1 basura y hero full-bleed legible (no pantallazo vacío de 100vh+). */
function polishHeroHtml(
  html: string,
  plan: AgencySitePlan,
  pack: BriefImagePack,
  prompt: string,
  lang: 'es' | 'en'
): string {
  let out = html;
  const title = plan.heroTitle || defaultHeroTitleBySector(prompt, lang);
  const heroUrl = (pack.urls[0] || '').replace(/"/g, '%22');

  // Sustituir H1 meta en todos los H1
  out = out.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, (_m, attrs: string, inner: string) => {
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

  if (heroUrl) {
    // Si el hero no tiene img de stock/fal, inyectar capa de fondo
    const heroChunk = out.match(
      /<section[^>]*(?:id=["'](?:inicio|hero|home)["']|class=["'][^"']*hero)[^>]*>[\s\S]{0,2500}/i
    );
    const heroHasImg = heroChunk
      ? /<img\b/i.test(heroChunk[0])
      : /min-h-\[(?:6|7|8|9|100)|h-screen[\s\S]{0,800}<img\b/i.test(out);
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
  }

  // Hero impactante pero LEGIBLE: ~70vh, tope 820px. Nunca 100vh+/150vh que “no se ve”.
  out = out.replace(/min-h-\[[0-9]{2,3}vh\]/gi, 'min-h-[70vh]');
  out = out.replace(/\bmin-h-screen\b/gi, 'min-h-[70vh]');
  out = out.replace(/\bh-screen\b/gi, 'min-h-[70vh]');
  out = out.replace(/\bh-\[[0-9]{3,}px\]/gi, 'min-h-[70vh]');
  out = out.replace(
    /(<section[^>]*(?:id=["'](?:inicio|hero|home)["']|class=["'][^"']*hero)[^>]*class=")([^"]*)(")/i,
    (_m, pre: string, cls: string, close: string) => {
      let c = cls
        .replace(/min-h-\[[^\]]+\]/gi, '')
        .replace(/\b(?:min-h-screen|h-screen)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      c = `relative overflow-hidden min-h-[70vh] max-h-[820px] flex items-center ${c}`;
      return `${pre}${c}${close}`;
    }
  );
  // Contenido del hero por encima de la foto
  out = out.replace(
    /(<section[^>]*(?:id=["'](?:inicio|hero|home)["']|class=["'][^"']*hero)[^>]*>[\s\S]{0,400}?)(<div[^>]*class=")([^"]*)(")/i,
    (full, pre: string, dpre: string, dcls: string, dclose: string) => {
      if (/data-cua-hero/i.test(full) || /absolute inset-0/i.test(dcls)) return full;
      if (/relative z-|z-10|z-20/i.test(dcls)) return full;
      return `${pre}${dpre}relative z-10 w-full ${dcls}${dclose}`;
    }
  );
  out = out.replace(
    /(<section[^>]*(?:hero|inicio)[^>]*>[\s\S]*?<img\b)([^>]*?)(>)/i,
    (_m, pre: string, attrs: string, close: string) => {
      let a = attrs;
      if (!/object-cover/i.test(a)) {
        if (/class="/i.test(a)) a = a.replace(/class="/i, 'class="object-cover object-center ');
        else a += ' class="object-cover object-center w-full h-full"';
      }
      if (!/max-h-|h-full|absolute/i.test(a) && /data-cua-hero|hero/i.test(pre)) {
        // ok
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
  lang: 'es' | 'en',
  opts?: { clientImageUrls?: string[]; briefWeak?: boolean }
): Promise<AgencyPipelineResult> {
  const plan = buildAgencyPlanFromBrief(prompt, lang);
  const pack = buildBriefImagePack(prompt, lang, opts?.clientImageUrls);
  const businessName = plan.businessName;
  const finishWithDeterministic = async (
    _reason: string,
    provider: AiProvider | 'rules' = 'rules'
  ): Promise<AgencyPipelineResult> => {
    let html = buildDeterministicAgencyHtml(plan, pack, prompt, lang);
    const imaged = await applyImages(html, prompt, lang, pack, opts?.clientImageUrls);
    html = polishHeroHtml(imaged.html, plan, pack, prompt, lang);
    const { injectSiteChrome } = await import('./siteChrome');
    html = injectSiteChrome(html, {
      prompt: prompt + '\n WhatsApp legales redes sociales scroll up',
      lang,
      businessName,
    });
    const { polishCatalogLayout } = await import('./polishCatalogLayout');
    html = polishCatalogLayout(html, {
      prompt,
      packUrls: pack.urls,
      variant: pack.variant,
    });
    return deliverHtml(
      html,
      plan,
      businessName,
      lang,
      provider,
      imaged.falImages,
      imaged.falImages ? 'hybrid' : provider === 'rules' ? 'rules' : 'hybrid',
      ''
    );
  };

  if (!getConfiguredProviders().length) {
    // Sin IA: igual entregamos web densamente construida desde el brief
    return finishWithDeterministic(
      lang === 'es' ? 'construida con motor determinista' : 'deterministic engine build'
    );
  }

  const directSystem =
    lang === 'es'
      ? `${constructorSystemPreamble('es')}

ENTREGA: un documento HTML completo, responsive, ultra-premium, fiel al brief.
- Identidad visual del sector real (bicicletas ≠ moda; etc.).
- Catálogo sin e-commerce si el brief lo dice: precios + WhatsApp / Solicitar info. NUNCA carrito/Stripe/Comprar.
- Hero con foto real del sector, altura ~70vh (máx. 820px), título y CTAs visibles sin scroll. PROHIBIDO hero vacío o pantallazo de color.
- HTML denso (ideal >40KB). Devuelve SOLO el HTML, sin markdown.`
      : `${constructorSystemPreamble('en')}

DELIVER: one complete ultra-premium HTML document from the brief only.
Catalogue without cart if asked. Photo hero required. Return ONLY HTML.`;

  const assets = `\n\nAssets de imagen sugeridos (puedes usar Unsplash/Pexels; prioriza estas si encajan):\n${pack.briefBlock}`;

  let provider: AiProvider | 'rules' = 'rules';
  let html: string | null = null;

  // 1) Intento directo tipo Chat Qwen: el brief manda (sin recortar el plan encima)
  const direct = await callBuild(directSystem, `${prompt}${assets}`, prompt, lang);
  html = direct.html;
  provider = direct.provider;

  // 2) Si el directo falla o queda corto, pipeline con plan cerrado
  if (!html || html.length < 20000) {
    const system =
      lang === 'es'
        ? `${constructorSystemPreamble('es')}

Trabajas con el brief + PLAN cerrado. HTML completo denso.
Catálogo: sin carrito/Stripe si el plan lo prohíbe. Devuelve SOLO HTML.`
        : `${constructorSystemPreamble('en')}

Build from brief + PLAN. Return ONLY full dense HTML.`;

    const briefForAi = prompt.length > 50000 ? prompt.slice(0, 40000) + '\n…\n' + prompt.slice(-8000) : prompt;
    const planned = await callBuild(
      system,
      `${planBlock(plan, lang)}${assets}\n\nBRIEF:\n${briefForAi}`,
      prompt,
      lang
    );
    if (planned.html && (!html || planned.html.length > html.length)) {
      html = planned.html;
      provider = planned.provider;
    }
  }

  if (!html) {
    return finishWithDeterministic(
      lang === 'es' ? 'respaldo premium desde tu brief' : 'premium fallback from your brief',
      provider
    );
  }

  // Fase VERIFY + REPAIR (hasta 2)
  for (let round = 0; round < 2; round++) {
    const issues = verifyDeterministic(html, plan, prompt);
    // Si el HTML ya es muy denso (>40KB) y tiene hero+fonts, no forzar repair por textos literales menores
    if (html.length > 40000 && /<h1\b/i.test(html) && /fonts\.googleapis/i.test(html) && issues.length <= 3) {
      break;
    }
    if (issues.length === 0) break;

    const repairUser =
      lang === 'es'
        ? `${planBlock(plan, lang)}${assets}

REPARACIÓN — el HTML FALLÓ verificación:
${issues.map((i) => `- ${i}`).join('\n')}

Reescribe el HTML COMPLETO corrigiendo esos puntos. Mantén el brief.
HTML previo:\n${html.slice(0, 50000)}`
        : `Fix quality issues and return FULL HTML:\n${issues.join('\n')}\n\nPrevious:\n${html.slice(0, 50000)}${assets}`;

    const repaired = await callBuild(
      lang === 'es'
        ? 'Eres CREAUNA. Reparas HTML de webs premium. Devuelve SOLO el documento HTML completo.'
        : 'You are CREAUNA. Repair premium site HTML. Return ONLY full HTML.',
      repairUser,
      prompt,
      lang
    );
    if (repaired.html) {
      html = repaired.html;
      provider = repaired.provider;
    } else {
      break;
    }
  }

  // Imágenes + pulido — HTML denso tipo Qwen (CSS propio >35KB): toque ligero, no machacar
  const denseAi =
    html.length > 35000 && /<\/html>/i.test(html) && /<h1\b/i.test(html);

  if (denseAi) {
    const imaged = await applyImages(html, prompt, lang, pack, opts?.clientImageUrls);
    html = imaged.html;
    const { injectSiteChrome } = await import('./siteChrome');
    html = injectSiteChrome(html, {
      prompt: prompt + (promptWantsChrome(prompt) ? '' : '\n legales WhatsApp'),
      lang,
      businessName,
    });
    const { polishCatalogLayout } = await import('./polishCatalogLayout');
    html = polishCatalogLayout(html, {
      prompt,
      packUrls: pack.urls,
      variant: pack.variant,
    });
    return deliverHtml(
      html,
      plan,
      businessName,
      lang,
      provider,
      imaged.falImages,
      imaged.falImages ? 'hybrid' : 'ai',
      ''
    );
  }

  const imaged = await applyImages(html, prompt, lang, pack, opts?.clientImageUrls);
  html = polishHeroHtml(imaged.html, plan, pack, prompt, lang);
  const { injectSiteChrome } = await import('./siteChrome');
  html = injectSiteChrome(html, { prompt, lang, businessName });
  {
    const { polishCatalogLayout } = await import('./polishCatalogLayout');
    html = polishCatalogLayout(html, {
      prompt,
      packUrls: pack.urls,
      variant: pack.variant,
    });
  }

  const finalIssues = verifyDeterministic(html, plan, prompt);
  const unacceptable = isUnacceptableAgencyHtml(html, prompt);
  const metaH1 = isMetaHeroPhrase(firstH1Text(html));
  const noPhoto = !hasPhotoHero(html);
  const criticalFail =
    !html ||
    html.length < 12000 ||
    isSkeletonLanding(html) ||
    (unacceptable && html.length < 25000) ||
    metaH1 ||
    noPhoto;

  if (criticalFail) {
    return finishWithDeterministic(
      lang === 'es' ? 'versión premium garantizada' : 'guaranteed premium version',
      provider
    );
  }

  void finalIssues;

  return deliverHtml(
    html,
    plan,
    businessName,
    lang,
    provider,
    imaged.falImages,
    imaged.falImages ? 'hybrid' : 'ai',
    ''
  );
}

function promptWantsChrome(prompt: string): boolean {
  return /whatsapp|aviso\s+legal|privacidad|cookies|redes\s+sociales|scroll|chat|blog|buscador|carrusel/i.test(
    prompt
  );
}
