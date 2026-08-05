import { tourStops } from '../data/tour-stops.js';
import { el, insertAfter, sectionShell, whenVisible } from '../utils.js';
import { applyPremiumI18n, getLang } from '../i18n.js';

export function initVirtualTour() {
  const after = document.getElementById('ll-view360') || document.getElementById('galeria');
  if (!after) return;

  const { section, container } = sectionShell({
    id: 'll-tour',
    className: 'll-section',
    titleKey: 'll_tour_title',
    subKey: 'll_tour_sub'
  });

  const wrap = el('div', { className: 'll-tour' });
  const media = el('div', { className: 'll-media-frame ll-parallax' });
  const side = el('div', { className: 'll-tour__side' });
  const steps = el('div', { className: 'll-tour__steps' });
  const title = el('h3');
  const text = el('p', { className: 'll-muted' });
  const nav = el('div', { className: 'll-tour__nav' });
  const prev = el('button', { type: 'button', className: 'll-btn', 'data-ll-i18n': 'll_tour_prev' });
  const next = el('button', { type: 'button', className: 'll-btn ll-btn--solid', 'data-ll-i18n': 'll_tour_next' });
  nav.append(prev, next);
  side.append(steps, title, text, nav);
  wrap.append(media, side);
  container.appendChild(wrap);
  insertAfter(after, section);
  applyPremiumI18n(section);

  let index = 0;

  const render = () => {
    const lang = getLang();
    const stop = tourStops[index];
    steps.innerHTML = '';
    tourStops.forEach((s, i) => {
      const b = el('button', {
        type: 'button',
        className: `ll-tour__step${i === index ? ' is-active' : ''}`,
        text: (s.title && (s.title[lang] || s.title.es)) || s.id,
        onclick: () => { index = i; render(); }
      });
      steps.appendChild(b);
    });
    media.innerHTML = '';
    media.appendChild(el('img', {
      src: stop.image,
      alt: '',
      loading: 'lazy',
      decoding: 'async'
    }));
    title.textContent = (stop.title && (stop.title[lang] || stop.title.es)) || '';
    text.textContent = (stop.text && (stop.text[lang] || stop.text.es)) || '';
    applyPremiumI18n(nav);
  };

  prev.addEventListener('click', () => {
    index = (index - 1 + tourStops.length) % tourStops.length;
    render();
  });
  next.addEventListener('click', () => {
    index = (index + 1) % tourStops.length;
    render();
  });

  whenVisible(section, () => {
    render();
    window.addEventListener('ll:langchange', render);
  });
}
