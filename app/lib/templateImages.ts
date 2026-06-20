import type { TemplateCategory } from '../data/templates';

/** Miniatura fiable por plantilla (estilo catálogo Canva/Nicepage). */
export function templateImageUrl(slug: string): string {
  return `https://picsum.photos/seed/creauna-${encodeURIComponent(slug)}/900/600`;
}

const CATEGORY_GRADIENT: Record<TemplateCategory, [string, string]> = {
  gastronomy: ['#78350f', '#451a03'],
  services: ['#1e3a5f', '#0f172a'],
  luxury: ['#4c1d95', '#1e1b4b'],
  corporate: ['#334155', '#0f172a'],
  tech: ['#0e7490', '#164e63'],
};

/** Fallback SVG si la red falla (nunca imagen rota). */
export function categoryFallbackDataUrl(categoryKey: TemplateCategory, label: string): string {
  const [c1, c2] = CATEGORY_GRADIENT[categoryKey] ?? CATEGORY_GRADIENT.corporate;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs>
    <rect width="900" height="600" fill="url(#g)"/>
    <text x="450" y="300" fill="white" font-family="system-ui,sans-serif" font-size="42" font-weight="600" text-anchor="middle" opacity="0.9">${label.replace(/&/g, '&amp;')}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
