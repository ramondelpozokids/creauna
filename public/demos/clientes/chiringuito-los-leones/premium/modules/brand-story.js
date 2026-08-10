/**
 * Brand mark (barco + espetos + olas as one logo) + story accordions.
 */
import { el, insertAfter, insertBefore } from '../utils.js';
import { applyPremiumI18n } from '../i18n.js';

const BANNER = 'images/banner_azul.png?v=1';

function buildBanner() {
  const wrap = el('div', {
    className: 'll-brand-banner',
    id: 'll-brand-banner'
  });

  const inner = el('div', { className: 'll-brand-banner__inner' });
  inner.appendChild(
    el('img', {
      className: 'll-brand-banner__logo',
      src: BANNER,
      alt: 'Chiringuito Los Leones — barca de espetos',
      decoding: 'async'
    })
  );
  wrap.appendChild(inner);
  return wrap;
}

function buildAccordion(id, titleKey, textKey) {
  const details = el('details', { className: 'll-comienzo', id });
  const summary = el('summary', { className: 'll-comienzo__summary' });
  summary.append(
    el('span', { 'data-ll-i18n': titleKey }),
    el('i', { className: 'fas fa-chevron-down', 'aria-hidden': 'true' })
  );
  const body = el('div', { className: 'll-comienzo__body' });
  body.appendChild(el('p', { 'data-ll-i18n': textKey }));
  details.append(summary, body);
  return details;
}

const STORY_PANELS = [
  { id: 'll-comienzo', titleKey: 'll_comienzo_title', textKey: 'll_comienzo_text' },
  { id: 'll-inicios', titleKey: 'll_inicios_title', textKey: 'll_inicios_text' },
  { id: 'll-espeto', titleKey: 'll_espeto_title', textKey: 'll_espeto_text' }
];

export function initBrandStory() {
  const historia = document.getElementById('historia');
  if (!historia) return;

  document.getElementById('ll-brand-banner')?.remove();
  document.getElementById('ll-brand-waves')?.remove();
  document.getElementById('ll-story-stack')?.remove();

  insertBefore(historia, buildBanner());

  const container = historia.querySelector('.container');
  if (!container) return;

  const orphan = document.getElementById('ll-comienzo');
  if (orphan && !orphan.closest('#ll-story-stack')) orphan.remove();

  const stack = el('div', { className: 'll-story-stack', id: 'll-story-stack' });
  STORY_PANELS.forEach((panel) => {
    stack.appendChild(buildAccordion(panel.id, panel.titleKey, panel.textKey));
  });

  const aboutContent = container.querySelector('.about-content');
  if (aboutContent) insertAfter(aboutContent, stack);
  else container.appendChild(stack);

  applyPremiumI18n(stack);
  window.addEventListener('ll:langchange', () => {
    const node = document.getElementById('ll-story-stack');
    if (node) applyPremiumI18n(node);
  });
}
