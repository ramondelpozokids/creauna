import { CUA_SITE_RESPONSIVE_CSS } from './responsiveSiteCss';

let cssInjected = false;

/** Marca cada sección para reglas responsive y evita desbordes horizontales. */
export function wrapSectionHtml(html: string, injectCss = false): string {
  let out = html;
  if (!html.includes('cua-site')) {
    if (/^\s*<div class="/.test(html)) {
      out = html.replace(/^(\s*)<div class="/, '$1<div class="cua-site ');
    } else if (/^\s*<div[\s>]/.test(html)) {
      out = html.replace(/^(\s*)<div/, '$1<div class="cua-site"');
    }
  }

  if (injectCss && !cssInjected && !out.includes('cua-site-responsive')) {
    cssInjected = true;
    out = CUA_SITE_RESPONSIVE_CSS.replace('<style>', '<style>/* cua-site-responsive */') + out;
  }
  return out;
}

export function wrapSectionsForPreview<T extends { html: string }>(sections: T[]): T[] {
  cssInjected = false;
  return sections.map((s, i) => ({
    ...s,
    html: wrapSectionHtml(s.html, i === 0),
  }));
}
