/** Imagen de respaldo verificada (HTTP 200) — nunca mostrar icono roto al cliente. */
export const GASTRO_IMAGE_FALLBACK =
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop';

export function galleryImg(src: string, alt: string, className: string): string {
  const safeSrc = src.replace(/'/g, '%27');
  return `<img src="${safeSrc}" alt="${alt.replace(/"/g, '&quot;')}" class="${className}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${GASTRO_IMAGE_FALLBACK}'" />`;
}
