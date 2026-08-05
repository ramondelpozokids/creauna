import { config } from '../config.js';
import { el, insertAfter, sectionShell, whenVisible } from '../utils.js';
import { applyPremiumI18n } from '../i18n.js';

export function initView360() {
  const after = document.getElementById('ll-sea') || document.getElementById('galeria');
  if (!after) return;

  const { section, container } = sectionShell({
    id: 'll-view360',
    className: 'll-section ll-section--dark',
    titleKey: 'll_360_title',
    subKey: 'll_360_sub'
  });

  const frame = el('div', { className: 'll-media-frame ll-parallax' });
  container.appendChild(frame);
  insertAfter(after, section);
  applyPremiumI18n(section);

  whenVisible(section, () => {
    const cfg = config.view360 || {};
    const url = (cfg.url || '').trim();
    frame.innerHTML = '';
    if (!url) {
      const ph = el('div', {
        className: 'll-placeholder',
        'data-ll-i18n': 'll_360_na',
        style: { backgroundImage: `url('${cfg.poster || 'images/1.png'}')` }
      });
      frame.appendChild(ph);
      applyPremiumI18n(frame);
      return;
    }

    if (cfg.type === 'image') {
      frame.appendChild(el('img', { src: url, alt: '360', loading: 'lazy' }));
    } else {
      // matterport / iframe / vr
      frame.appendChild(el('iframe', {
        src: url,
        title: '360',
        loading: 'lazy',
        allow: 'xr-spatial-tracking; gyroscope; accelerometer; fullscreen',
        allowfullscreen: true,
        referrerpolicy: 'no-referrer-when-downgrade'
      }));
    }
  });
}
