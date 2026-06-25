/** CSS embebido: móvil real (@media) + preview estrecho en Studio (@container). */
export const CUA_SITE_RESPONSIVE_CSS = `<style>
.cua-site { max-width: 100%; overflow-x: hidden; }
.cua-site img, .cua-site iframe { max-width: 100%; }
.cua-site h1, .cua-site h2 { overflow-wrap: break-word; word-break: break-word; }

@container cua-preview (max-width: 640px) {
  .cua-site .cua-nav-desktop { display: none !important; }
  .cua-site .cua-nav-mobile { display: flex !important; }
  .cua-site .cua-section-pad { padding: 1.25rem !important; }
  .cua-site .cua-hero-pad { padding: 1.25rem !important; }
  .cua-site .cua-hero-title { font-size: 1.75rem !important; line-height: 1.15 !important; }
  .cua-site .cua-hero-minh { min-height: 420px !important; }
  .cua-site .cua-cta-row { flex-direction: column !important; align-items: stretch !important; }
  .cua-site .cua-cta-row > * { width: 100% !important; text-align: center !important; }
  .cua-site .cua-contact-grid,
  .cua-site .cua-grid-2col,
  .cua-site .cua-grid-3col { grid-template-columns: 1fr !important; }
  .cua-site .cua-map-wrap { min-height: 220px !important; width: 100% !important; }
}

@media (max-width: 767px) {
  .cua-site .cua-nav-desktop { display: none !important; }
  .cua-site .cua-nav-mobile { display: flex !important; }
  .cua-site .cua-section-pad { padding: 1.25rem !important; }
  .cua-site .cua-hero-pad { padding: 1.25rem !important; }
  .cua-site .cua-hero-title { font-size: 1.75rem !important; line-height: 1.15 !important; }
  .cua-site .cua-hero-minh { min-height: 420px !important; }
  .cua-site .cua-cta-row { flex-direction: column !important; align-items: stretch !important; }
  .cua-site .cua-cta-row > * { width: 100% !important; text-align: center !important; }
  .cua-site .cua-contact-grid,
  .cua-site .cua-grid-2col,
  .cua-site .cua-grid-3col { grid-template-columns: 1fr !important; }
  .cua-site .cua-map-wrap { min-height: 220px !important; width: 100% !important; }
}
</style>`;

export function buildMobilePreviewDocument(sectionsHtml: string, lang: 'es' | 'en'): string {
  const responsiveCss = CUA_SITE_RESPONSIVE_CSS.replace('<style>', '<style>').replace('</style>', '</style>');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="https://cdn.tailwindcss.com"><\/script>
${responsiveCss}
<style>
  html, body { margin: 0; padding: 0; overflow-x: hidden; background: #fff; }
  body { padding: 12px 10px 20px; font-family: ui-sans-serif, system-ui, sans-serif; }
  * { box-sizing: border-box; }
  h1, h2, h3, p { overflow-wrap: break-word; word-break: break-word; }
  img, iframe { max-width: 100%; }
  section + section { margin-top: 1.5rem; }
</style>
</head>
<body>${sectionsHtml}</body>
</html>`;
}
