import { config } from '../config.js';
import { el, insertBefore, sectionShell, whenVisible } from '../utils.js';
import { applyPremiumI18n } from '../i18n.js';

export function initTiktok() {
  const ig = document.getElementById('ll-instagram');
  const footer = document.querySelector('footer.site-footer');
  const anchor = ig || footer;
  if (!anchor) return;

  const { section, container } = sectionShell({
    id: 'll-tiktok',
    className: 'll-section ll-section--dark',
    titleKey: 'll_tt_title',
    subKey: 'll_tt_sub'
  });

  const grid = el('div', { className: 'll-social-grid', id: 'll-tt-grid' });
  const cta = el('div', { className: 'll-cta-row' });
  const profile = (config.tiktok && config.tiktok.profileUrl) || '';
  if (profile) {
    cta.appendChild(el('a', {
      className: 'll-btn',
      href: profile,
      target: '_blank',
      rel: 'noopener noreferrer',
      'data-ll-i18n': 'll_tt_cta'
    }));
  }
  container.append(grid, cta);

  if (ig) insertBefore(footer, section); // after IG which is before footer — insert before footer keeps order if IG already there
  else insertBefore(footer, section);

  // Ensure TikTok sits after Instagram
  if (ig && ig.nextSibling !== section) {
    ig.parentNode.insertBefore(section, ig.nextSibling);
  }

  applyPremiumI18n(section);

  whenVisible(section, () => {
    const embeds = (config.tiktok && config.tiktok.embedUrls) || [];
    grid.innerHTML = '';
    if (!embeds.length) {
      const card = el('div', {
        className: 'll-social-card',
        'data-ll-i18n': 'll_tt_na',
        style: { gridColumn: '1 / -1', aspectRatio: '21 / 9' }
      });
      grid.appendChild(card);
      applyPremiumI18n(grid);
      return;
    }
    embeds.slice(0, 3).forEach((url) => {
      const card = el('div', { className: 'll-social-card' });
      card.appendChild(el('iframe', {
        src: url,
        loading: 'lazy',
        title: 'TikTok',
        allow: 'encrypted-media; fullscreen'
      }));
      grid.appendChild(card);
    });
  });
}
