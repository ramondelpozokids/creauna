import { config } from '../config.js';
import { el, insertBefore, sectionShell, whenVisible } from '../utils.js';
import { applyPremiumI18n } from '../i18n.js';

export function initInstagram() {
  const footer = document.querySelector('footer.site-footer');
  if (!footer) return;

  const { section, container } = sectionShell({
    id: 'll-instagram',
    className: 'll-section',
    titleKey: 'll_ig_title',
    subKey: 'll_ig_sub'
  });

  const grid = el('div', { className: 'll-social-grid', id: 'll-ig-grid' });
  const cta = el('div', { className: 'll-cta-row' });
  const profile = (config.instagram && config.instagram.profileUrl) ||
    'https://www.instagram.com/chiringuitolosleones/';
  const link = el('a', {
    className: 'll-btn ll-btn--solid',
    href: profile,
    target: '_blank',
    rel: 'noopener noreferrer',
    'data-ll-i18n': 'll_ig_cta'
  });
  cta.appendChild(link);
  container.append(grid, cta);
  insertBefore(footer, section);
  applyPremiumI18n(section);

  whenVisible(section, () => {
    const embeds = (config.instagram && config.instagram.embedUrls) || [];
    const posts = (config.instagram && config.instagram.posts) || [];
    grid.innerHTML = '';

    if (embeds.length) {
      embeds.slice(0, 6).forEach((url) => {
        const card = el('div', { className: 'll-social-card' });
        card.appendChild(el('iframe', {
          src: url,
          loading: 'lazy',
          title: 'Instagram',
          allow: 'encrypted-media; clipboard-write'
        }));
        grid.appendChild(card);
      });
      return;
    }

    if (posts.length) {
      posts.slice(0, 6).forEach((post) => {
        const card = el('a', {
          className: 'll-social-card ll-social-card--photo',
          href: profile,
          target: '_blank',
          rel: 'noopener noreferrer',
          'aria-label': post.alt || 'Instagram'
        });
        card.appendChild(el('img', {
          src: post.src,
          alt: post.alt || '',
          loading: 'lazy',
          decoding: 'async'
        }));
        grid.appendChild(card);
      });
      return;
    }

    for (let i = 0; i < 3; i++) {
      grid.appendChild(el('a', {
        className: 'll-social-card',
        href: profile,
        target: '_blank',
        rel: 'noopener noreferrer',
        'data-ll-i18n': 'll_ig_na'
      }));
    }
    applyPremiumI18n(grid);
  });
}
