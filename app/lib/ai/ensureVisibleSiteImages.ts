import { generateFalImage, isFalImagesEnabled, buildFalPrompt, type FalImageSize } from './falImages';
import { isFragileUrl, hardenSiteImages, reliableImagePool } from './hardenSiteImages';
import type { SiteBrief } from './siteAiEnhancer';
import { isProviderConfigured } from './providers';

async function generateGeminiImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || !isProviderConfigured('gemini')) return null;

  const models = [
    process.env.GEMINI_IMAGE_MODEL?.trim(),
    'gemini-2.5-flash-image',
    'gemini-2.0-flash-preview-image-generation',
  ].filter(Boolean) as string[];

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
          }),
        }
      );
      if (!res.ok) {
        console.error('gemini image', model, res.status, (await res.text()).slice(0, 160));
        continue;
      }
      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] } }[];
      };
      const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
      const b64 = part?.inlineData?.data;
      const mime = part?.inlineData?.mimeType || 'image/png';
      if (b64) return `data:${mime};base64,${b64}`;
    } catch (err) {
      console.error('gemini image failed:', err instanceof Error ? err.message : err);
    }
  }
  return null;
}

async function generateOneImage(prompt: string, size: FalImageSize): Promise<string | null> {
  if (isFalImagesEnabled()) {
    const fal = await generateFalImage(prompt, size);
    if (fal) return fal;
  }
  return generateGeminiImage(prompt);
}

function countFragileOrMissing(html: string): number {
  const imgs = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((m) => m[1]);
  const fragile = imgs.filter((u) => !u || isFragileUrl(u) || !/pexels\.com|unsplash\.com|pixabay|shopifycdn|stocksnap|kaboompics|fal\.|data:image/i.test(u));
  return fragile.length;
}

/**
 * 1) Endurece con pack Pexels
 * 2) Si aún hay Unsplash/huecos → genera hero (+N) con fal/Gemini y sustituye
 */
export async function ensureVisibleSiteImages(
  html: string,
  packUrls: string[],
  brief: SiteBrief,
  opts?: { maxAiImages?: number }
): Promise<{ html: string; aiImages: number; source: 'bank' | 'fal' | 'gemini' | 'hybrid' }> {
  let out = hardenSiteImages(html, packUrls);
  let aiImages = 0;
  let usedFal = false;
  let usedGemini = false;

  const maxAi = Math.min(Math.max(opts?.maxAiImages ?? 4, 0), 6);
  const needAi =
    countFragileOrMissing(out) > 2 ||
    /source\.unsplash|placehold|picsum\.photos/i.test(out) ||
    (out.match(/<img\b/gi) || []).length < 4;

  if (!needAi || maxAi === 0) {
    return { html: out, aiImages: 0, source: 'bank' };
  }

  const generated: string[] = [];
  const heroPrompt = buildFalPrompt(brief, 'hero');
  const hero = await generateOneImage(heroPrompt, 'landscape_16_9');
  if (hero) {
    generated.push(hero);
    aiImages += 1;
    if (hero.startsWith('data:')) usedGemini = true;
    else usedFal = true;
  }

  for (let i = 0; i < maxAi - 1; i++) {
    const url = await generateOneImage(buildFalPrompt(brief, 'gallery', i), 'square_hd');
    if (!url) continue;
    generated.push(url);
    aiImages += 1;
    if (url.startsWith('data:')) usedGemini = true;
    else usedFal = true;
  }

  if (generated.length) {
    const pool = [...generated, ...reliableImagePool(packUrls)];
    out = hardenSiteImages(out, pool);
    // Hero prioritario: primer img del hero / poster / primera background
    const heroUrl = generated[0];
    out = out.replace(
      /(<section[^>]*id=["']inicio["'][\s\S]*?<img\b[^>]*\bsrc=)(["'])([^"']*)\2/i,
      `$1$2${heroUrl.replace(/\$/g, '$$$$')}$2`
    );
    out = out.replace(
      /(class=["'][^"']*hero[^"']*["'][^>]*>[\s\S]{0,800}?<img\b[^>]*\bsrc=)(["'])([^"']*)\2/i,
      `$1$2${heroUrl.replace(/\$/g, '$$$$')}$2`
    );
  }

  const source =
    usedFal && usedGemini ? 'hybrid' : usedFal ? 'fal' : usedGemini ? 'gemini' : 'bank';
  return { html: out, aiImages, source };
}
