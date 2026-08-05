/**
 * Wooden menu cover under "Nuestra Carta".
 * Click opens the full waiter-style carta in a modal.
 * Large sectioned menu stays on the page.
 */
import { CARTA_CATEGORIES } from '../data/carta-completa.js';
import { el } from '../utils.js';
import { applyPremiumI18n, getLang } from '../i18n.js';

const HIDE_DISH_IDS = new Set([
  'd_ensalada_tropical',
  'd_hamburguesa_de_ternera',
  'd_fruta_de_temporada'
]);

function translatedName(id, fallback) {
  const lang = getLang();
  const dict = (window.MENU_I18N && window.MENU_I18N[lang]) || {};
  return dict[id] || fallback;
}

function translatedCat(key, fallback) {
  const lang = getLang();
  const dict = (window.MENU_I18N && window.MENU_I18N[lang]) || {};
  return dict[key] || fallback;
}

function tidyOriginalSections() {
  document.querySelectorAll('.menu-item, .wine-item, .cocktail-item').forEach((item) => {
    const idEl = item.querySelector('[data-i18n^="d_"]');
    const key = idEl && idEl.getAttribute('data-i18n');
    if (key && HIDE_DISH_IDS.has(key)) {
      item.hidden = true;
      item.style.display = 'none';
    }
  });

  // Hide Espumosos block on the large wines page — still listed in the full carta modal
  document.querySelectorAll('#vinos .wine-category').forEach((cat) => {
    if (cat.querySelector('[data-i18n="c_espumosos_y_generosos"]')) {
      cat.hidden = true;
      cat.style.display = 'none';
    }
  });
}

function buildCartaSheet() {
  const sheet = el('div', { className: 'll-carta' });

  const head = el('header', { className: 'll-carta__head' });
  head.append(
    el('p', { className: 'll-carta__brand', text: 'Chiringuito Los Leones' }),
    el('p', { className: 'll-carta__since', text: 'Desde 1962 · La Carihuela' }),
    el('h3', { className: 'll-carta__title', 'data-ll-i18n': 'll_carta_title' })
  );
  sheet.appendChild(head);

  const body = el('div', { className: 'll-carta__body' });
  CARTA_CATEGORIES.forEach((cat) => {
    const block = el('section', { className: 'll-carta__cat' });
    block.appendChild(el('h4', {
      className: 'll-carta__cat-title',
      text: translatedCat(cat.key, cat.title),
      dataset: { llCatKey: cat.key, llCatFallback: cat.title }
    }));
    const list = el('ul', { className: 'll-carta__list' });
    cat.items.forEach((item) => {
      const li = el('li', { className: 'll-carta__row' });
      li.append(
        el('span', {
          className: 'll-carta__name',
          text: translatedName(item.id, item.name),
          dataset: { llDishId: item.id, llDishFallback: item.name }
        }),
        el('span', { className: 'll-carta__dots', 'aria-hidden': 'true' }),
        el('span', { className: 'll-carta__price', text: item.price })
      );
      list.appendChild(li);
    });
    block.appendChild(list);
    body.appendChild(block);
  });
  sheet.appendChild(body);
  sheet.appendChild(el('p', {
    className: 'll-carta__foot',
    'data-ll-i18n': 'll_carta_foot'
  }));
  return sheet;
}

function refreshLabels(root) {
  root.querySelectorAll('[data-ll-cat-key]').forEach((node) => {
    node.textContent = translatedCat(node.dataset.llCatKey, node.dataset.llCatFallback);
  });
  root.querySelectorAll('[data-ll-dish-id]').forEach((node) => {
    node.textContent = translatedName(node.dataset.llDishId, node.dataset.llDishFallback);
  });
  applyPremiumI18n(root);
}

export function initCartaCompleta() {
  const menu = document.getElementById('menu');
  if (!menu) return;
  const container = menu.querySelector('.container');
  if (!container) return;

  tidyOriginalSections();
  container.querySelector('#ll-carta-cover')?.remove();
  document.getElementById('ll-carta-modal')?.remove();

  // Cover button
  const coverWrap = el('div', { className: 'll-carta-cover', id: 'll-carta-cover' });
  const coverBtn = el('button', {
    type: 'button',
    className: 'll-carta-cover__btn',
    'data-ll-i18n-aria': 'll_carta_open',
    'data-ll-i18n-title': 'll_carta_open'
  });
  coverBtn.append(
    el('img', {
      className: 'll-carta-cover__img',
      src: 'images/carta-portada.png',
      alt: 'Chiringuito Los Leones — 1962',
      loading: 'lazy',
      decoding: 'async'
    }),
    el('span', { className: 'll-carta-cover__hint', 'data-ll-i18n': 'll_carta_open' })
  );
  coverWrap.appendChild(coverBtn);

  const subtitle = container.querySelector('.section-subtitle');
  const title = container.querySelector('.section-title');
  const anchor = subtitle || title;
  if (anchor && anchor.parentNode === container) {
    anchor.insertAdjacentElement('afterend', coverWrap);
  } else {
    container.insertBefore(coverWrap, container.querySelector('.menu-category'));
  }

  // Modal with full carta
  const modal = el('div', {
    className: 'll-carta-modal',
    id: 'll-carta-modal',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-hidden': 'true'
  });
  const backdrop = el('div', { className: 'll-carta-modal__backdrop' });
  const panel = el('div', { className: 'll-carta-modal__panel' });
  const closeBtn = el('button', {
    type: 'button',
    className: 'll-carta-modal__close',
    'data-ll-i18n-aria': 'll_carta_close',
    html: '&times;'
  });
  const sheet = buildCartaSheet();
  panel.append(closeBtn, sheet);
  modal.append(backdrop, panel);
  document.body.appendChild(modal);

  const open = () => {
    refreshLabels(sheet);
    applyPremiumI18n(modal);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ll-carta-open');
    closeBtn.focus({ preventScroll: true });
  };
  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ll-carta-open');
    coverBtn.focus({ preventScroll: true });
  };

  coverBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  applyPremiumI18n(coverWrap);
  window.addEventListener('ll:langchange', () => {
    applyPremiumI18n(coverWrap);
    if (modal.classList.contains('is-open')) refreshLabels(sheet);
  });
}
