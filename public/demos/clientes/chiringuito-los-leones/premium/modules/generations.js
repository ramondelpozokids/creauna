import { config } from '../config.js';
import { generations } from '../data/generations.js';
import { el, insertAfter, sectionShell, whenVisible } from '../utils.js';
import { applyPremiumI18n, getLang } from '../i18n.js';

export function initGenerations() {
  const hist = document.getElementById('historia');
  if (!hist) return;

  const { section, container } = sectionShell({
    id: 'll-generations',
    className: 'll-section',
    titleKey: 'll_gen_title',
    subKey: 'll_gen_sub'
  });

  const timeline = el('div', { className: 'll-timeline' });
  container.appendChild(timeline);
  insertAfter(hist, section);
  applyPremiumI18n(section);

  const render = () => {
    const lang = getLang();
    timeline.innerHTML = '';
    generations.forEach((g) => {
      const item = el('div', { className: 'll-timeline__item ll-reveal' });
      item.appendChild(el('div', { className: 'll-timeline__dot' }));
      const card = el('div', { className: 'll-timeline__card' });
      card.append(
        el('div', { className: 'll-timeline__year', text: g.year }),
        el('h3', { text: (g.title && (g.title[lang] || g.title.es)) || '' }),
        el('p', { text: (g.text && (g.text[lang] || g.text.es)) || '' })
      );
      const mediaUrl = (config.generationsMedia && config.generationsMedia[g.id]) || '';
      const media = el('div', {
        className: `ll-timeline__media${mediaUrl ? '' : ' ll-timeline__media--empty'}`
      });
      if (mediaUrl) {
        media.appendChild(el('img', { src: mediaUrl, alt: '', loading: 'lazy', decoding: 'async' }));
      } else {
        media.textContent = 'Photo';
      }
      card.appendChild(media);
      item.appendChild(card);
      timeline.appendChild(item);
    });
  };

  whenVisible(section, () => {
    render();
    window.addEventListener('ll:langchange', render);
  });
}
