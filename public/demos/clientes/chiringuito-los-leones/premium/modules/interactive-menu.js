import { MENU_ITEMS, CATEGORIES } from '../data/menu-catalog.js';
import { el, insertAfter, sectionShell, whenVisible } from '../utils.js';
import { applyPremiumI18n, getLang, t } from '../i18n.js';

const FAV_KEY = 'll_menu_favs';

function getFavs() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function saveFavs(set) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
}

function catLabel(cat) {
  const lang = getLang();
  return (cat.label && (cat.label[lang] || cat.label.es)) || cat.id;
}

export function initInteractiveMenu() {
  const menu = document.getElementById('menu');
  if (!menu) return;

  const { section, container } = sectionShell({
    id: 'll-interactive-menu',
    className: 'll-section',
    titleKey: 'll_menu_title',
    subKey: 'll_menu_sub'
  });

  const toolbar = el('div', { className: 'll-imenu__toolbar' });
  const search = el('input', {
    type: 'search',
    className: 'll-imenu__search',
    'data-ll-i18n': 'll_menu_search',
    autocomplete: 'off'
  });
  const chips = el('div', { className: 'll-imenu__chips' });
  const grid = el('div', { className: 'll-imenu__grid', id: 'll-imenu-grid' });
  const empty = el('p', { className: 'll-imenu__empty', 'data-ll-i18n': 'll_menu_empty', style: { display: 'none' } });

  toolbar.append(search, chips);
  container.append(toolbar, grid, empty);
  insertAfter(menu, section);
  applyPremiumI18n(section);

  let filter = 'all';
  let q = '';
  let favs = getFavs();
  let mounted = false;

  const buildChips = () => {
    chips.innerHTML = '';
    const defs = [
      { id: 'all', label: t('ll_menu_all') },
      { id: 'recommended', label: t('ll_menu_rec') },
      { id: 'favs', label: t('ll_menu_favs') },
      ...CATEGORIES.map((c) => ({ id: c.id, label: catLabel(c) }))
    ];
    defs.forEach((d) => {
      const b = el('button', {
        type: 'button',
        className: `ll-chip${filter === d.id ? ' is-active' : ''}`,
        text: d.label,
        onclick: () => {
          filter = d.id;
          render();
        }
      });
      chips.appendChild(b);
    });
  };

  const render = () => {
    buildChips();
    applyPremiumI18n(section);
    let items = MENU_ITEMS.slice();
    if (filter === 'recommended') items = items.filter((i) => i.recommended);
    else if (filter === 'favs') items = items.filter((i) => favs.has(i.id));
    else if (filter !== 'all') items = items.filter((i) => i.category === filter);

    if (q) {
      const qq = q.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(qq) || i.price.toLowerCase().includes(qq));
    }

    grid.innerHTML = '';
    empty.style.display = items.length ? 'none' : 'block';

    items.forEach((item) => {
      const hasPhoto = !!(item.image && String(item.image).trim());
      const card = el('article', {
        className: `ll-imenu__card ll-reveal is-visible${hasPhoto ? '' : ' ll-imenu__card--text'}`
      });
      const body = el('div', { className: 'll-imenu__body' });
      body.appendChild(el('h3', { text: item.name }));
      const meta = el('div', { className: 'll-imenu__meta' });
      meta.appendChild(el('span', { className: 'll-imenu__price', text: item.price }));
      const favBtn = el('button', {
        type: 'button',
        className: `ll-imenu__fav${favs.has(item.id) ? ' is-on' : ''}`,
        'aria-label': 'Favourite',
        html: `<i class="fas fa-heart" aria-hidden="true"></i>`,
        onclick: () => {
          if (favs.has(item.id)) favs.delete(item.id);
          else favs.add(item.id);
          saveFavs(favs);
          render();
        }
      });
      meta.appendChild(favBtn);
      body.appendChild(meta);
      if (item.allergens && item.allergens.length) {
        body.appendChild(el('div', {
          className: 'll-imenu__tags',
          text: `${t('ll_allergens')}: ${item.allergens.join(', ')}`
        }));
      }
      if (hasPhoto) {
        const media = el('div', { className: 'll-imenu__media' });
        media.appendChild(el('img', {
          src: item.image,
          alt: item.name,
          loading: 'lazy',
          decoding: 'async'
        }));
        card.append(media, body);
      } else {
        card.appendChild(body);
      }
      grid.appendChild(card);
    });
  };

  search.addEventListener('input', () => {
    q = search.value.trim();
    render();
  });

  window.addEventListener('ll:langchange', () => {
    if (mounted) render();
  });

  whenVisible(section, () => {
    mounted = true;
    render();
  });
}
