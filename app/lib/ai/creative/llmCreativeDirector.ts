/**
 * LLM Creative Director — razona el brief completo → CreativeBrief JSON.
 * Distingue negocio real vs metáforas de inspiración. Sin HTML.
 */

import { constructorSystemPreamble } from '../creaunaConstructorManifesto';
import {
  chatCompletion,
  getConfiguredProviders,
  isProviderConfigured,
  type AiProvider,
} from '../providers';
import type {
  ArtDirection,
  BrandTone,
  CreativeBrief,
  CreativeSectorId,
  Density,
  HeroFamily,
  IconStyle,
  Rhythm,
  TypeScale,
  VisualLanguage,
} from './creativeBrief';
import { makeUniquenessSeed } from './uniquenessSeed';

export type CreativeDirectorSource = 'llm' | 'heuristic_fallback';

export interface CreativeDirectorResult {
  brief: CreativeBrief;
  provider: AiProvider | 'rules';
  source: CreativeDirectorSource;
}

const SECTORS: CreativeSectorId[] = [
  'clinic',
  'restaurant',
  'legal',
  'hotel',
  'architecture',
  'cafe',
  'barber',
  'bakery',
  'corporate',
  'fashion',
  'default',
];
const BRAND_TONES: BrandTone[] = [
  'premium',
  'warm',
  'corporate',
  'editorial',
  'playful',
  'minimal',
  'luxury',
  'trust',
];
const ART_DIRS: ArtDirection[] = [
  'clinicalLight',
  'gastronomicEmotion',
  'soberCorporate',
  'aspirationalLuxury',
  'spatialMinimal',
  'darkCraft',
  'warmNeighborhood',
  'techGlass',
  'earthyArtisan',
];
const VIS_LANGS: VisualLanguage[] = [
  'photographyDominant',
  'typeLed',
  'splitEditorial',
  'airAndWhite',
  'darkMoody',
  'colorBlock',
  'glassDepth',
];
const HERO_FAMS: HeroFamily[] = [
  'fullBleedCenter',
  'fullBleedLeft',
  'splitMediaRight',
  'splitMediaLeft',
  'editorialStack',
  'minimalTypeOnly',
  'asymmetricOverlap',
];
const DENSITIES: Density[] = ['sparse', 'balanced', 'dense'];
const RHYTHMS: Rhythm[] = ['alternatingBands', 'continuous', 'cardGrid', 'editorialBreaks'];
const ICON_STYLES: IconStyle[] = ['none', 'line', 'duotone', 'emoji', 'photoOnly'];
const TYPE_SCALES: TypeScale[] = ['intimate', 'editorial', 'billboard'];

function oneOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

function str(v: unknown, fallback: string, max = 200): string {
  if (typeof v !== 'string') return fallback;
  const t = v.replace(/\s+/g, ' ').trim();
  return t ? t.slice(0, max) : fallback;
}

function strArr(v: unknown, fallback: string[], maxItems = 12): string[] {
  if (!Array.isArray(v)) return fallback;
  const out = v
    .filter((x): x is string => typeof x === 'string')
    .map((x) => x.replace(/\s+/g, ' ').trim())
    .filter((x) => x.length >= 2 && x.length <= 80)
    .slice(0, maxItems);
  return out.length >= 2 ? out : fallback;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

function extractJsonObject(raw: string): unknown | null {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

export function parseCreativeBriefJson(
  raw: string,
  prompt: string,
  lang: 'es' | 'en',
  entropy?: string
): CreativeBrief | null {
  const data = extractJsonObject(raw);
  if (!data || typeof data !== 'object') return null;
  const o = data as Record<string, unknown>;

  const sectorId = oneOf(o.sectorId, SECTORS, 'default');
  const businessName = str(o.businessName, lang === 'es' ? 'Tu marca' : 'Your brand', 48);
  if (businessName.length < 2) return null;

  const heroTitle = str(o.heroTitle, '', 120);
  const heroSubtitle = str(o.heroSubtitle, '', 200);
  const primaryCta = str(o.primaryCta, '', 48);
  const secondaryCta = str(o.secondaryCta, '', 48);
  if (!heroTitle || !primaryCta) return null;

  const services = strArr(o.services, []);
  if (services.length < 2) return null;

  const aboutHeadline = str(o.aboutHeadline, str(o.positioning, businessName, 120), 120);
  const aboutBody = str(
    o.aboutBody,
    lang === 'es'
      ? 'Cada detalle está pensado para transmitir confianza y excelencia.'
      : 'Every detail is designed to convey trust and excellence.',
    320
  );

  // photoStyle is internal — never used as visible copy; still store for DNA/image guidance
  const photoStyle = str(o.photoStyle, 'authentic professional photography for the real business', 160);

  const storytellingArc = strArr(
    o.storytellingArc,
    ['hero', 'about', 'services', 'gallery', 'testimonials', 'contact'],
    14
  );

  const seed = makeUniquenessSeed(`${businessName}:${sectorId}:${heroTitle}`, entropy);

  return {
    version: '1.0',
    sectorId,
    audience: str(o.audience, '', 160),
    positioning: str(o.positioning, aboutHeadline, 160),
    brandTone: oneOf(o.brandTone, BRAND_TONES, 'premium'),
    artDirection: oneOf(o.artDirection, ART_DIRS, 'clinicalLight'),
    visualLanguage: oneOf(o.visualLanguage, VIS_LANGS, 'airAndWhite'),
    heroFamily: oneOf(o.heroFamily, HERO_FAMS, 'editorialStack'),
    density: oneOf(o.density, DENSITIES, 'balanced'),
    rhythm: oneOf(o.rhythm, RHYTHMS, 'editorialBreaks'),
    typeScale: oneOf(o.typeScale, TYPE_SCALES, 'editorial'),
    photoStyle,
    iconStyle: oneOf(o.iconStyle, ICON_STYLES, 'line'),
    storytellingArc,
    businessName,
    heroTitle,
    heroSubtitle:
      heroSubtitle ||
      (lang === 'es' ? 'Excelencia en cada detalle.' : 'Excellence in every detail.'),
    primaryCta,
    secondaryCta:
      secondaryCta || (lang === 'es' ? 'Saber más' : 'Learn more'),
    services,
    aboutHeadline,
    aboutBody,
    address: o.address ? str(o.address, '', 80) || undefined : undefined,
    hours: o.hours ? str(o.hours, '', 60) || undefined : undefined,
    wantsWhatsApp: bool(o.wantsWhatsApp, /whatsapp/i.test(prompt) && !/sin\s+whatsapp/i.test(prompt)),
    forbidCart: bool(
      o.forbidCart,
      !/carrito|stripe|comprar\s+online|checkout/i.test(prompt)
    ),
    lang,
    uniquenessSeed: seed,
    rationale: str(
      o.rationale,
      `LLM Creative Director: sector=${sectorId}, name=${businessName}`,
      280
    ),
  };
}

function buildSystemPrompt(lang: 'es' | 'en'): string {
  const manifesto = constructorSystemPreamble(lang);
  return `${manifesto}

ROL: Eres el Director Creativo de CREAUNA. NO generas HTML. Solo razonas el brief y devuelves UN objeto JSON válido (sin markdown, sin comentarios).

REGLA CRÍTICA — NEGOCIO vs INSPIRACIÓN:
- El sectorId debe reflejar el NEGOCIO REAL del cliente, no metáforas ni referencias de moodboard.
- Si el brief dice clínica / medicina estética / dental y menciona «como un hotel» o «inspiración hotel 5★», el sector es clinic, NUNCA hotel.
- Si el negocio es hotel boutique, sectorId = hotel.
- Extrae el nombre EXACTO del negocio (p.ej. «Aura Clinic»), no el título del documento ni el sector genérico.

CAMPOS OBLIGATORIOS del JSON:
{
  "sectorId": one of ${JSON.stringify(SECTORS)},
  "audience": string,
  "positioning": string,
  "brandTone": one of ${JSON.stringify(BRAND_TONES)},
  "artDirection": one of ${JSON.stringify(ART_DIRS)},
  "visualLanguage": one of ${JSON.stringify(VIS_LANGS)},
  "heroFamily": one of ${JSON.stringify(HERO_FAMS)},
  "density": one of ${JSON.stringify(DENSITIES)},
  "rhythm": one of ${JSON.stringify(RHYTHMS)},
  "typeScale": one of ${JSON.stringify(TYPE_SCALES)},
  "photoStyle": string (guía interna de foto; NUNCA copy visible),
  "iconStyle": one of ${JSON.stringify(ICON_STYLES)},
  "storytellingArc": string[],
  "businessName": string,
  "heroTitle": string,
  "heroSubtitle": string,
  "primaryCta": string,
  "secondaryCta": string,
  "services": string[] (del brief; mínimo 3 si el brief lista servicios),
  "aboutHeadline": string (copy humano para Nosotros),
  "aboutBody": string (copy humano; NUNCA pegues photoStyle ni audiencia cruda),
  "address": string|null,
  "hours": string|null,
  "wantsWhatsApp": boolean,
  "forbidCart": boolean,
  "rationale": string (1-2 frases: por qué estas decisiones)
}

CTAs y servicios: prioriza lo que el brief pide explícitamente (p.ej. «Reservar primera consulta», lista de tratamientos).
Idioma de copy: ${lang === 'es' ? 'español' : 'english'}.
density=sparse → más aire, hero contenido; dense → más contenido. Elige según el brief (lujo minimal → sparse/balanced).`;
}

/**
 * Llama al LLM. Devuelve null si no hay providers o el JSON no valida (tras reintentos).
 */
export async function runLlmCreativeDirector(
  prompt: string,
  lang: 'es' | 'en',
  opts?: { entropy?: string; preferProvider?: AiProvider }
): Promise<CreativeDirectorResult | null> {
  type ChatProvider = 'gemini' | 'claude' | 'openai' | 'qwen' | 'groq';
  const configured = getConfiguredProviders().filter(
    (p): p is ChatProvider => p !== 'manus' && p !== 'fal'
  );
  if (configured.length === 0) return null;

  const prefer: ChatProvider | undefined =
    opts?.preferProvider && configured.includes(opts.preferProvider as ChatProvider)
      ? (opts.preferProvider as ChatProvider)
      : isProviderConfigured('gemini')
        ? 'gemini'
        : isProviderConfigured('openai')
          ? 'openai'
          : isProviderConfigured('groq')
            ? 'groq'
            : configured[0];

  const candidates: Array<ChatProvider | undefined> = [
    prefer,
    'gemini',
    'openai',
    'groq',
    'qwen',
    'claude',
  ];
  const tryOrder = [...new Set(candidates.filter((p): p is ChatProvider => Boolean(p) && configured.includes(p)))];

  const system = buildSystemPrompt(lang);
  const user = `BRIEF DEL CLIENTE:\n\n${prompt.slice(0, 12000)}\n\nDevuelve SOLO el JSON del CreativeBrief.`;

  const messages = [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: user },
  ];

  for (const provider of tryOrder) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const msgs =
        attempt === 0
          ? messages
          : [
              ...messages,
              {
                role: 'user' as const,
                content:
                  'El JSON anterior era inválido. Incluye sectorId, businessName, heroTitle, primaryCta, services (≥2), aboutHeadline, aboutBody. Responde SOLO JSON.',
              },
            ];
      const result = await chatCompletion(msgs, {
        temperature: 0.35,
        maxTokens: 2200,
        motor: 'copy',
        preferProvider: provider,
        prompt: 'creative director brief json',
      });
      if (!result.content || result.provider === 'rules') continue;
      const brief = parseCreativeBriefJson(result.content, prompt, lang, opts?.entropy);
      if (!brief) continue;
      brief.rationale = `${brief.rationale} · provider=${result.provider}`;
      return {
        brief,
        provider: result.provider,
        source: 'llm',
      };
    }
  }

  return null;
}
