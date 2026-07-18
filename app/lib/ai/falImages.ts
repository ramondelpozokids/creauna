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

function isFashionBrief(brief: SiteBrief): boolean {
  const blob = `${brief.businessType} ${brief.userPrompt} ${brief.designStyle}`.toLowerCase();
  return /moda|fashion|ecommerce|e-commerce|lookbook|colecci|boutique|luxury fashion|tienda online/i.test(blob);
}

export function buildFalPrompt(brief: SiteBrief, role: 'hero' | 'gallery', index = 0): string {
  const fashion = isFashionBrief(brief);
  const biz = `${brief.businessName} — ${brief.businessType}`;
  const noText = 'No text, no logos, no watermarks, no collage, no readable labels.';

  if (role === 'hero') {
    if (fashion) {
      return [
        `Ultra-premium fashion eCommerce hero photograph for ${biz}.`,
        'Editorial minimalist style, Massimo Dutti / COS aesthetic, model in neutral tones, cinematic studio lighting, vast negative space, luxury fashion campaign.',
        brief.tagline ? `Mood: ${brief.tagline}.` : '',
        noText,
      ]
        .filter(Boolean)
        .join(' ');
    }
    return [
      `Professional website hero photograph for ${biz}.`,
      brief.tagline ? `Mood: ${brief.tagline}.` : '',
      `Premium commercial photography, cinematic lighting, shallow depth of field, ultra sharp.`,
      brief.designStyle.slice(0, 200),
      noText,
    ]
      .filter(Boolean)
      .join(' ');
  }

  const fashionVariants = [
    'editorial flat lay of luxury garments',
    'boutique interior minimalist white space',
    'fashion product detail texture close-up',
    'runway-inspired lifestyle shot',
  ];
  const variants = ['interior detail', 'service in action', 'ambient wide shot', 'product close-up'];
  const variant = fashion ? fashionVariants[index % fashionVariants.length] : variants[index % variants.length];

  return [
    `Gallery photo ${index + 1} for ${biz}, ${variant}.`,
    fashion
      ? 'High-end fashion eCommerce, Zara editorial quality, neutral palette black white beige champagne.'
      : `Authentic ${brief.businessType} environment, editorial quality for luxury web design.`,
    brief.designStyle.slice(0, 160),
    noText,
  ]
    .filter(Boolean)
    .join(' ');
}

function extractImageUrl(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const images = d.images as { url?: string }[] | undefined;
  if (images?.[0]?.url?.startsWith('https://')) return images[0].url;
  const image = d.image as { url?: string } | undefined;
  if (image?.url?.startsWith('https://')) return image.url;
  const output = d.output as { url?: string }[] | undefined;
  if (output?.[0]?.url?.startsWith('https://')) return output[0].url;
  return null;
}

async function callFalSync(modelId: string, input: Record<string, unknown>, timeoutMs = 28_000): Promise<string | null> {
  const apiKey = process.env.FAL_KEY?.trim();
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

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
      console.error(`fal sync ${modelId}:`, res.status, body.slice(0, 240));
      return null;
    }

    return extractImageUrl(JSON.parse(body));
  } catch (err) {
    console.error(`fal sync ${modelId} failed:`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function callFalQueue(modelId: string, input: Record<string, unknown>): Promise<string | null> {
  const apiKey = process.env.FAL_KEY?.trim();
  if (!apiKey) return null;

  try {
    const submitRes = await fetch(`https://queue.fal.run/${modelId}`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    if (!submitRes.ok) {
      console.error('fal queue submit:', submitRes.status, await submitRes.text());
      return null;
    }
    const submit = (await submitRes.json()) as { request_id?: string };
    const requestId = submit.request_id;
    if (!requestId) return null;

    for (let attempt = 0; attempt < 25; attempt++) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusRes = await fetch(
        `https://queue.fal.run/${modelId}/requests/${requestId}/status`,
        { headers: { Authorization: `Key ${apiKey}` } }
      );
      if (!statusRes.ok) continue;
      const status = (await statusRes.json()) as { status?: string };
      if (status.status === 'COMPLETED') {
        const resultRes = await fetch(
          `https://queue.fal.run/${modelId}/requests/${requestId}`,
          { headers: { Authorization: `Key ${apiKey}` } }
        );
        if (!resultRes.ok) return null;
        return extractImageUrl(await resultRes.json());
      }
      if (status.status === 'FAILED') return null;
    }
  } catch (err) {
    console.error('fal queue failed:', err instanceof Error ? err.message : err);
  }
  return null;
}

async function callFalModel(modelId: string, input: Record<string, unknown>): Promise<string | null> {
  const sync = await callFalSync(modelId, input);
  if (sync) return sync;
  return callFalQueue(modelId, input);
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

/** Paquete hero + galería — secuencial para no saturar Vercel/fal. */
export async function generateVisualAssetPack(
  brief: SiteBrief,
  opts?: { galleryCount?: number; includeHero?: boolean }
): Promise<FalVisualPack> {
  const galleryCount = Math.min(Math.max(opts?.galleryCount ?? 1, 0), 2);
  const includeHero = opts?.includeHero !== false;
  const gallery: string[] = [];

  let hero: string | undefined;
  if (includeHero) {
    const url = await generateFalImage(buildFalPrompt(brief, 'hero'), 'landscape_16_9', HERO_MODEL());
    if (url) hero = url;
  }

  for (let i = 0; i < galleryCount; i++) {
    const url = await generateFalImage(buildFalPrompt(brief, 'gallery', i), 'square_hd', GALLERY_MODEL());
    if (url) gallery.push(url);
  }

  return { hero, gallery };
}

/** Sustituye src de <img> (no scripts CDN) y la primera background-image https. */
export function injectImageUrls(html: string, urls: string[]): string {
  if (!urls.length) return html;
  let i = 0;
  let out = html.replace(/<img\b([^>]*?)>/gi, (full, attrs: string) => {
    if (i >= urls.length) return full;
    const url = urls[i++].replace(/"/g, '%22');
    if (/\bsrc\s*=/i.test(attrs)) {
      return `<img${attrs.replace(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i, `src="${url}"`)}>`;
    }
    return `<img src="${url}"${attrs}>`;
  });
  if (urls[0]) {
    out = out.replace(
      /background-image:\s*url\(['"]?(https:\/\/[^'")\s]+)['"]?\)/i,
      `background-image:url('${urls[0].replace(/'/g, '%27')}')`
    );
  }
  return out;
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

export async function applyFalVisualAssets(
  sections: TemplatePageSection[],
  brief: SiteBrief,
  onlyTypes?: Set<string>
): Promise<FalVisualResult> {
  if (!isFalImagesEnabled()) {
    return { sections, falImages: 0 };
  }

  const visualTypes = new Set(['hero', 'gallery', 'fullpage']);
  const targets = sections.filter(
    (s) => visualTypes.has(s.type) && (!onlyTypes || onlyTypes.has(s.type))
  );
  if (targets.length === 0) {
    return { sections, falImages: 0 };
  }

  const needsHero = targets.some((s) => s.type === 'hero' || s.type === 'fullpage');
  const needsGallery = targets.some((s) => s.type === 'gallery');

  const pack = await generateVisualAssetPack(brief, {
    includeHero: needsHero,
    galleryCount: needsGallery ? 1 : 0,
  });

  if (!pack.hero && pack.gallery.length === 0) {
    console.warn('fal: no images generated for', brief.businessName);
    return { sections, falImages: 0 };
  }

  let falImages = 0;
  const byId = new Map(sections.map((s) => [s.id, { ...s }]));

  for (const section of targets) {
    if ((section.type === 'hero' || section.type === 'fullpage') && pack.hero) {
      byId.set(section.id, applyUrlsToSection(section, [pack.hero, ...pack.gallery]));
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
