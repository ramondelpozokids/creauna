import { GALLERY_BEST } from '../data/gallery-best.js';
import { el } from '../utils.js';
import { applyPremiumI18n, t } from '../i18n.js';

/**
 * Replaces gallery thumbs with curated best photos (DOM only)
 * and opens a fullscreen lightbox with prev/next.
 * Does not edit index.html source or existing CSS rules.
 */
export function initGalleryLightbox() {
  const section = document.getElementById('galeria');
  const grid = section && section.querySelector('.gallery-grid');
  if (!grid || !GALLERY_BEST.length) return;

  // Rebuild thumbs with best images only
  grid.innerHTML = '';
  GALLERY_BEST.forEach((item, index) => {
    const wrap = el('div', {
      className: 'gallery-item ll-gallery-item',
      role: 'button',
      tabindex: '0',
      'aria-label': item.alt,
      dataset: { llIndex: String(index) }
    });
    const img = el('img', {
      src: item.src,
      alt: item.alt,
      loading: 'lazy',
      decoding: 'async'
    });
    wrap.appendChild(img);
    wrap.addEventListener('click', () => openAt(index));
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAt(index);
      }
    });
    grid.appendChild(wrap);
  });

  // Lightbox overlay
  const root = el('div', {
    className: 'll-lightbox',
    id: 'll-lightbox',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-hidden': 'true'
  });

  const backdrop = el('div', { className: 'll-lightbox__backdrop' });
  const stage = el('div', { className: 'll-lightbox__stage' });
  const img = el('img', {
    className: 'll-lightbox__img',
    alt: '',
    decoding: 'async'
  });
  const caption = el('p', { className: 'll-lightbox__caption' });
  const counter = el('div', { className: 'll-lightbox__counter' });

  const btnClose = el('button', {
    type: 'button',
    className: 'll-lightbox__btn ll-lightbox__close',
    'aria-label': 'Cerrar',
    html: '&times;'
  });
  const btnPrev = el('button', {
    type: 'button',
    className: 'll-lightbox__btn ll-lightbox__prev',
    'aria-label': 'Anterior',
    html: '<i class="fas fa-chevron-left" aria-hidden="true"></i>'
  });
  const btnNext = el('button', {
    type: 'button',
    className: 'll-lightbox__btn ll-lightbox__next',
    'aria-label': 'Siguiente',
    html: '<i class="fas fa-chevron-right" aria-hidden="true"></i>'
  });

  stage.append(img, caption, counter);
  root.append(backdrop, btnClose, btnPrev, btnNext, stage);
  document.body.appendChild(root);

  let index = 0;
  let open = false;

  const render = () => {
    const item = GALLERY_BEST[index];
    img.src = item.src;
    img.alt = item.alt;
    caption.textContent = item.alt;
    counter.textContent = `${index + 1} / ${GALLERY_BEST.length}`;
    // Prefetch neighbors
    const prev = GALLERY_BEST[(index - 1 + GALLERY_BEST.length) % GALLERY_BEST.length];
    const next = GALLERY_BEST[(index + 1) % GALLERY_BEST.length];
    [prev, next].forEach((p) => {
      const pre = new Image();
      pre.src = p.src;
    });
  };

  const openAt = (i) => {
    index = ((i % GALLERY_BEST.length) + GALLERY_BEST.length) % GALLERY_BEST.length;
    open = true;
    render();
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ll-lightbox-open');
    btnClose.focus({ preventScroll: true });
  };

  const close = () => {
    open = false;
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ll-lightbox-open');
  };

  const go = (delta) => {
    index = (index + delta + GALLERY_BEST.length) % GALLERY_BEST.length;
    render();
  };

  btnClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));

  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });

  // Touch swipe
  let touchX = null;
  stage.addEventListener('touchstart', (e) => {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) < 40) return;
    go(dx > 0 ? -1 : 1);
  }, { passive: true });

  // i18n labels when lang changes
  const syncAria = () => {
    btnPrev.setAttribute('aria-label', t('ll_gallery_prev') || 'Anterior');
    btnNext.setAttribute('aria-label', t('ll_gallery_next') || 'Siguiente');
    btnClose.setAttribute('aria-label', t('ll_gallery_close') || 'Cerrar');
  };
  syncAria();
  window.addEventListener('ll:langchange', syncAria);
  applyPremiumI18n(root);
}
