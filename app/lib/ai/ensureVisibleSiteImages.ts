import { generateFalImage, isFalImagesEnabled, buildFalPrompt, type FalImageSize } from './falImages';
import { isFragileUrl, hardenSiteImages, reliableImagePool, LAST_RESORT_SVG } from './hardenSiteImages';
import type { SiteBrief } from './siteAiEnhancer';
import { isProviderConfigured } from './providers';

async function generateGeminiImage(prompt: string, referenceDataUrl?: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || !isProviderConfigured('gemini')) return null;

  const models = [
    process.env.GEMINI_IMAGE_MODEL?.trim(),
    'gemini-2.5-flash-image',
    'gemini-2.0-flash-preview-image-generation',
  ].filter(Boolean) as string[];

  const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [];
  if (referenceDataUrl?.startsWith('data:image')) {
    const m = referenceDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (m) {
      parts.push({ inlineData: { mimeType: m[1], data: m[2] } });
      parts.push({
        text: `${prompt}\n\nEdit/transform the reference image as described. Return only the new image.`,
      });
    }
  }
  if (!parts.length) parts.push({ text: prompt });

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts }],
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

async function generateOneImage(
  prompt: string,
  size: FalImageSize,
  referenceDataUrl?: string
): Promise<string | null> {
  // Con imagen de referencia: Gemini primero (edición tipo “cambia el vestido”)
  if (referenceDataUrl?.startsWith('data:image')) {
    const edited = await generateGeminiImage(prompt, referenceDataUrl);
    if (edited) return edited;
  }
  if (isFalImagesEnabled()) {
    const fal = await generateFalImage(prompt, size);
    if (fal) return fal;
  }
  return generateGeminiImage(prompt);
}

function extractImgSrcs(html: string): string[] {
  return [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((m) => m[1]);
}

function needsAiReplacement(url: string): boolean {
  if (!url || url.startsWith('data:image/svg')) return true;
  if (isFragileUrl(url)) return true;
  if (/placehold|picsum|via\.placeholder|source\.unsplash/i.test(url)) return true;
  // Stock remoto (Unsplash/Pexels/…) puede 404 — con forceAiFill se regenera con IA
  if (/images\.unsplash|pexels\.com|pixabay\.com|burst\.shopify/i.test(url)) return true;
  return false;
}

function visualVertical(brief: SiteBrief, packVariant?: string): boolean {
  const blob = `${brief.businessType} ${brief.userPrompt} ${packVariant || ''}`.toLowerCase();
  if (/bicicleta|ciclismo|\bmtb\b|e-?bike|bike/i.test(blob)) return true;
  if (/panader|bollería|bolleria|pasteler|bakery|masa madre|sourdough|trigo dorado/i.test(blob)) return true;
  return (
    /fashion|moda|jewelry|tattoo|luxury|wig|peluca|boutique|bridal|novia/i.test(blob) &&
    !/barber|caballero|peluquer[ií]a\s+de\s+caballer/i.test(blob) &&
    !/accesorios\s+de\s+cicl|casco|mtb/i.test(blob)
  );
}

/**
 * Garantiza imágenes visibles. Nunca entregar huecos rotos.
 * 1) harden pack + onerror → SVG
 * 2) Siempre IA en hero en verticales visuales (si hay fal/Gemini)
 * 3) Rellena frágiles / pocos imgs con fal/Gemini
 * 4) clientImageUrls[0] data: como referencia de edición de hero
 */
export async function ensureVisibleSiteImages(
  html: string,
  packUrls: string[],
  brief: SiteBrief,
  opts?: {
    maxAiImages?: number;
    preferAiHero?: boolean;
    forceAiFill?: boolean;
    clientImageUrls?: string[];
  }
): Promise<{ html: string; aiImages: number; source: 'bank' | 'fal' | 'gemini' | 'hybrid' }> {
  let out = hardenSiteImages(html, packUrls);
  let aiImages = 0;
  let usedFal = false;
  let usedGemini = false;

  const maxAi = Math.min(Math.max(opts?.maxAiImages ?? 6, 0), 8);
  const visual = visualVertical(brief, undefined);
  // data: solo como ref de edición en moda; gestoría/corporate usa banco de oficina
  const isCorporateish = /corporate|gestor|asesor|fiscal|despacho|ledger/i.test(
    `${brief.variant} ${brief.userPrompt || ''}`
  );
  const isBarberish =
    /barber|peluquer|caballero|afeitad|grooming/i.test(`${brief.variant} ${brief.userPrompt || ''}`) &&
    !/canina|dog|pet/i.test(brief.userPrompt || '');
  const refHero = isCorporateish || isBarberish
    ? undefined
    : (opts?.clientImageUrls || []).find((u) => u.startsWith('data:image'));
  const canAi = isFalImagesEnabled() || isProviderConfigured('gemini');

  // Gestoría / corporate: solo banco de oficina — nunca IA moda/lifestyle
  if (isCorporateish) {
    const { IMAGE_BANK } = await import('./imageBank');
    const { ensureHeroPhoto, ensureAboutPhoto } = await import('./hardenSiteImages');
    const pool = reliableImagePool([
      ...packUrls,
      IMAGE_BANK.corporate.hero,
      IMAGE_BANK.corporate.team,
      ...IMAGE_BANK.corporate.office,
      ...IMAGE_BANK.corporate.gallery,
    ]);
    out = hardenSiteImages(out, pool);
    if (pool[0]) out = ensureHeroPhoto(out, pool[0]);
    if (pool[1] || pool[0]) out = ensureAboutPhoto(out, pool[1] || pool[0]);
    return { html: out, aiImages: 0, source: 'bank' };
  }

  // Barbería: solo banco barber — nunca IA moda
  if (isBarberish) {
    const { IMAGE_BANK } = await import('./imageBank');
    const { ensureHeroPhoto, ensureAboutPhoto, ensureMinimumGallery } = await import('./hardenSiteImages');
    const pool = reliableImagePool([
      ...packUrls,
      IMAGE_BANK.barber.hero,
      IMAGE_BANK.barber.about,
      ...IMAGE_BANK.barber.gallery,
    ]);
    out = hardenSiteImages(out, pool);
    if (pool[0]) out = ensureHeroPhoto(out, IMAGE_BANK.barber.hero);
    out = ensureAboutPhoto(out, IMAGE_BANK.barber.about);
    out = ensureMinimumGallery(out, pool);
    return { html: out, aiImages: 0, source: 'bank' };
  }

  const fragileCount = extractImgSrcs(out).filter(needsAiReplacement).length;
  const imgCount = (out.match(/<img\b/gi) || []).length;
  const force =
    opts?.forceAiFill === true ||
    opts?.preferAiHero === true ||
    visual ||
    fragileCount > 0 ||
    imgCount < 4 ||
    /source\.unsplash|placehold|picsum/i.test(out);

  if (!canAi || maxAi === 0) {
    // Sin claves de imagen: pack + guard SVG (nunca vacío)
    out = hardenSiteImages(out, [...packUrls, LAST_RESORT_SVG]);
    return { html: out, aiImages: 0, source: 'bank' };
  }

  if (!force && fragileCount === 0 && imgCount >= 6 && !visual) {
    out = hardenSiteImages(out, [...packUrls, LAST_RESORT_SVG]);
    return { html: out, aiImages: 0, source: 'bank' };
  }

  const generated: string[] = [];
  let heroPrompt = buildFalPrompt(brief, 'hero');
  if (refHero) {
    // Edición tipo Gemini: “cambia el vestido a novia blanca” sobre la foto del cliente
    heroPrompt = [
      `Edit this reference hero photograph for ${brief.businessName}.`,
      brief.userPrompt.slice(0, 500),
      'Keep composition and model identity when possible; apply the requested visual change clearly.',
      'Ultra-premium fashion campaign still, cinematic light. No text, no logos, no watermarks.',
    ].join(' ');
  }
  const hero = await generateOneImage(heroPrompt, 'landscape_16_9', refHero);
  if (hero) {
    generated.push(hero);
    aiImages += 1;
    if (hero.startsWith('data:')) usedGemini = true;
    else usedFal = true;
  }

  const galleryCount = Math.max(0, maxAi - 1);
  for (let i = 0; i < galleryCount; i++) {
    const url = await generateOneImage(buildFalPrompt(brief, 'gallery', i), 'square_hd');
    if (!url) continue;
    generated.push(url);
    aiImages += 1;
    if (url.startsWith('data:')) usedGemini = true;
    else usedFal = true;
  }

  if (generated.length) {
    const pool = [...generated, ...reliableImagePool(packUrls), LAST_RESORT_SVG];
    out = hardenSiteImages(out, pool);

    const heroUrl = generated[0];
    const safe = heroUrl.replace(/\$/g, '$$$$');
    // Sustituir primera imagen del hero / inicio / home / section.hero
    out = out.replace(
      /(<section[^>]*(?:id=["'](?:inicio|hero|home)["']|class=["'][^"']*hero)[^>]*>[\s\S]{0,2500}?<img\b[^>]*\bsrc=)(["'])([^"']*)\2/i,
      `$1$2${safe}$2`
    );
    out = out.replace(
      /(id=["'](?:inicio|hero|home)["'][\s\S]{0,2000}?<img\b[^>]*\bsrc=)(["'])([^"']*)\2/i,
      `$1$2${safe}$2`
    );
    // background-image del hero
    out = out.replace(
      /(<section[^>]*(?:hero|inicio)[^>]*style=["'][^"']*background-image:\s*url\()([^)]+)(\))/i,
      `$1'${heroUrl.replace(/'/g, '%27')}'$3`
    );
    // Primera img del documento si aún no se tocó hero
    if (!out.includes(heroUrl.slice(0, 40)) && /<img\b/i.test(out)) {
      out = out.replace(/(<img\b[^>]*\bsrc=)(["'])([^"']*)\2/i, `$1$2${safe}$2`);
    }
  } else {
    out = hardenSiteImages(out, [...packUrls, LAST_RESORT_SVG]);
  }

  const source =
    usedFal && usedGemini ? 'hybrid' : usedFal ? 'fal' : usedGemini ? 'gemini' : 'bank';
  return { html: out, aiImages, source };
}
