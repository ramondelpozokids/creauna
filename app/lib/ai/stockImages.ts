/**
 * Fuentes stock gratuitas con licencia comercial permisiva.
 * Prioridad CREAUNA: Unsplash → Pexels → Burst/Pixabay → fal/Gemini si fallan.
 *
 * Regla de oro: el LLM NUNCA inventa IDs; solo usa URLs del Image Bank / pack.
 */

/** Unsplash CDN (images.unsplash.com) — calidad premium, uso comercial. */
export const unsplash = (photoId: string, w = 1400, h = 800) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const unsplashSq = (photoId: string, size = 800) => unsplash(photoId, size, size);

/** Pexels — fotos y vídeo, muy estable en hotlink. */
export const pexels = (id: number, w = 1400, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

export const pexelsSq = (id: number, size = 600) => pexels(id, size, size);

/** Hosts permitidos en HTML entregado (stock + IA). */
export const TRUSTED_STOCK_HOST =
  /images\.unsplash\.com|images\.pexels\.com|cdn\.pixabay\.com|burst\.shopifycdn\.com|cdn\.stocksnap\.io|kaboompics\.com|www\.kaboompics\.com|images\.lifeofpix\.com|fal\.media|fal\.ai|cloudinary\.com|images\.creauna|r2\.cloudflarestorage|vercel-storage/i;

/** Hosts/patrones que suelen romper o son placeholders. */
export const FRAGILE_STOCK_HOST =
  /source\.unsplash\.com|plus\.unsplash\.com|placehold(?:er|it)\.|via\.placeholder|picsum\.photos|loremflickr|dummyimage|placekitten|place\.co|via\.placeholder/i;

export function isTrustedStockUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('data:image/')) return true;
  return TRUSTED_STOCK_HOST.test(url);
}

export function isFragileStockUrl(url: string): boolean {
  if (!url) return true;
  if (FRAGILE_STOCK_HOST.test(url)) return true;
  // IDs inventados tipo unsplash sin photo- o URLs basura
  if (/unsplash\.com\/(?!photo-|.*images\.unsplash)/i.test(url) && !/images\.unsplash\.com/i.test(url)) {
    return true;
  }
  return false;
}

export const STOCK_PROMPT_RULE_ES = `Imágenes: USA ÚNICAMENTE las URLs del bloque «Assets de imagen» (Unsplash / Pexels / Burst curados). PROHIBIDO inventar IDs, placehold.co o source.unsplash.com. Si necesitas más fotos, reutiliza las del pack.`;

export const STOCK_PROMPT_RULE_EN = `Images: USE ONLY URLs from the «Image assets» block (curated Unsplash / Pexels / Burst). FORBIDDEN: inventing IDs, placeholders, source.unsplash.com. Reuse pack URLs if you need more photos.`;
