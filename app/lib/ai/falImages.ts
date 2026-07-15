import type { TemplatePageSection } from '../templatePages';
import { isProviderConfigured } from './providers';
import { GASTRO_IMAGE_FALLBACK } from './imageFallback';
import type { SiteBrief } from './siteAiEnhancer';

export type FalImageSize = 'landscape_16_9' | 'square_hd';

export interface FalVisualPack {
  hero?: string;
  gallery: string[];
}

export interface FalVisualResult {
  sections: TemplatePageSection[];
  falImages: number;
}

const HERO_MODEL = () => process.env.FAL_HERO_MODEL?.trim() || 'fal-ai/flux/schnell';
const GALLERY_MODEL = () => process.env.FAL_GALLERY_MODEL?.trim() || 'fal-ai/flux/schnell';

/** Motor Visual — imágenes IA vía fal.ai (Flux / Ideogram). Desactivar con CREAUNA_FAL_IMAGES=0 */
export function isFalImagesEnabled(): boolean {
  if (process.env.CREAUNA_FAL_IMAGES === '0') return false;
  return isProviderConfigured('fal');
}

export function shouldRegenerateFalImages(prompt: string): boolean {
  return /nueva[s]?\s+foto|genera[r]?\s+im[aá]gen|fotos?\s+(ia|ai|profesional)|im[aá]genes?\s+nuevas|hero\s+con\s+foto|galer[ií]a\s+nueva|fal\.ai|flux/i.test(
    prompt.toLowerCase()
  );
}

export function buildFalPrompt(brief: SiteBrief, role: 'hero' | 'gallery', index = 0): string {
  const biz = `${brief.businessName} — ${brief.businessType}`;
  const styleHint = brief.designStyle.slice(0, 280);
  const noText = 'No text, no logos, no watermarks, no collage.';

  if (role === 'hero') {
    return [
      `Professional website hero photograph for ${biz}.`,
      brief.tagline ? `Mood: ${brief.tagline}.` : '',
      `Premium commercial photography, cinematic lighting, shallow depth of field, ultra sharp.`,
      styleHint,
      noText,
    ]
      .filter(Boolean)
      .join(' ');
  }

  const variants = ['interior detail', 'service in action', 'ambient wide shot', 'product close-up'];
  const variant = variants[index % variants.length];
  return [
    `Gallery photo ${index + 1} for ${biz}, ${variant}.`,
    `Authentic ${brief.businessType} environment, editorial quality for luxury web design.`,
    styleHint,
    noText,
  ]
    .filter(Boolean)
    .join(' ');
}

async function callFalModel(modelId: string, input: Record<string, unknown>): Promise<string | null> {
  const apiKey = process.env.FAL_KEY?.trim();
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  try {
    const res = await fetch(`https://fal.run/${modelId}`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    const body = await res.text();
    if (!res.ok) {
      console.error(`fal ${modelId} error:`, res.status, body.slice(0, 200));
      return null;
    }

    const data = JSON.parse(body) as {
      images?: { url?: string }[];
      image?: { url?: string };
    };
    const url = data.images?.[0]?.url ?? data.image?.url;
    return typeof url === 'string' && url.startsWith('https://') ? url : null;
  } catch (err) {
    console.error(`fal ${modelId} request failed:`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateFalImage(prompt: string, size: FalImageSize, model?: string): Promise<string | null> {
  const modelId = model ?? (size === 'landscape_16_9' ? HERO_MODEL() : GALLERY_MODEL());
  return callFalModel(modelId, {
    prompt,
    image_size: size,
    num_inference_steps: 4,
    enable_safety_checker: true,
    num_images: 1,
  });
}

/** Paquete hero + galería bajo dirección del Motor Visual. */
export async function generateVisualAssetPack(
  brief: SiteBrief,
  opts?: { galleryCount?: number; includeHero?: boolean }
): Promise<FalVisualPack> {
  const galleryCount = Math.min(Math.max(opts?.galleryCount ?? 2, 0), 3);
  const includeHero = opts?.includeHero !== false;

  const heroPromise = includeHero
    ? generateFalImage(buildFalPrompt(brief, 'hero'), 'landscape_16_9', HERO_MODEL())
    : Promise.resolve(null);

  const galleryPromises = Array.from({ length: galleryCount }, (_, i) =>
    generateFalImage(buildFalPrompt(brief, 'gallery', i), 'square_hd', GALLERY_MODEL())
  );

  const [hero, ...galleryResults] = await Promise.all([heroPromise, ...galleryPromises]);
  const gallery = galleryResults.filter((u): u is string => Boolean(u));

  return { hero: hero ?? undefined, gallery };
}

/** Sustituye src de <img> por URLs generadas (conserva onerror fallback). */
export function injectImageUrls(html: string, urls: string[]): string {
  if (!urls.length) return html;
  let i = 0;
  return html.replace(/src="(https:\/\/[^"]+)"/g, (match) => {
    if (i >= urls.length) return match;
    const safe = urls[i++].replace(/"/g, '%22');
    return `src="${safe}"`;
  });
}

function applyUrlsToSection(section: TemplatePageSection, urls: string[]): TemplatePageSection {
  if (!urls.length) return section;
  const html = injectImageUrls(section.html, urls);
  if (!html.includes('onerror=') && html.includes('<img')) {
    return {
      ...section,
      html: html.replace(/<img /g, `<img onerror="this.onerror=null;this.src='${GASTRO_IMAGE_FALLBACK}'" `),
    };
  }
  return { ...section, html };
}

/**
 * Director Visual → fal.ai: inyecta imágenes generadas en secciones hero/gallery
 * antes de que Gemini refine el HTML.
 */
export async function applyFalVisualAssets(
  sections: TemplatePageSection[],
  brief: SiteBrief,
  onlyTypes?: Set<string>
): Promise<FalVisualResult> {
  if (!isFalImagesEnabled()) {
    return { sections, falImages: 0 };
  }

  const visualTypes = new Set(['hero', 'gallery']);
  const targets = sections.filter(
    (s) => visualTypes.has(s.type) && (!onlyTypes || onlyTypes.has(s.type))
  );
  if (targets.length === 0) {
    return { sections, falImages: 0 };
  }

  const needsHero = targets.some((s) => s.type === 'hero');
  const needsGallery = targets.some((s) => s.type === 'gallery');

  const pack = await generateVisualAssetPack(brief, {
    includeHero: needsHero,
    galleryCount: needsGallery ? 2 : 0,
  });

  let falImages = 0;
  const byId = new Map(sections.map((s) => [s.id, { ...s }]));

  for (const section of targets) {
    if (section.type === 'hero' && pack.hero) {
      byId.set(section.id, applyUrlsToSection(section, [pack.hero]));
      falImages += 1;
    } else if (section.type === 'gallery' && pack.gallery.length > 0) {
      byId.set(section.id, applyUrlsToSection(section, pack.gallery));
      falImages += pack.gallery.length;
    }
  }

  return {
    sections: sections.map((s) => byId.get(s.id) ?? s),
    falImages,
  };
}
