/**
 * Protección anti-copia (cliente). No es absoluta, pero dificulta
 * selección, clic derecho, arrastre de imágenes y atajos habituales.
 * Los campos de formulario siguen siendo usables.
 */
(function () {
  'use strict';

  // CSS de respaldo (páginas legales sin styles.css)
  if (!document.getElementById('pp-protect-css')) {
    const s = document.createElement('style');
    s.id = 'pp-protect-css';
    s.textContent =
      'body.pp-protect{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}' +
      'body.pp-protect input,body.pp-protect textarea,body.pp-protect select,body.pp-protect [contenteditable="true"]{-webkit-user-select:text;user-select:text}' +
      'body.pp-protect img,body.pp-protect video{-webkit-user-drag:none;user-drag:none;-webkit-touch-callout:none}';
    document.head.appendChild(s);
  }
  document.documentElement.classList.add('pp-protect');
  if (document.body) document.body.classList.add('pp-protect');

  const ALLOW = 'input, textarea, select, [contenteditable="true"]';

  function isEditable(el) {
    if (!el) return false;
    return !!(el.closest && el.closest(ALLOW));
  }

  document.addEventListener(
    'contextmenu',
    (e) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
    },
    { capture: true }
  );

  document.addEventListener(
    'selectstart',
    (e) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
    },
    { capture: true }
  );

  document.addEventListener(
    'dragstart',
    (e) => {
      if (e.target && (e.target.tagName === 'IMG' || e.target.closest('img'))) {
        e.preventDefault();
      }
    },
    { capture: true }
  );

  document.addEventListener(
    'copy',
    (e) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
    },
    { capture: true }
  );

  document.addEventListener(
    'cut',
    (e) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
    },
    { capture: true }
  );

  document.addEventListener(
    'keydown',
    (e) => {
      if (isEditable(e.target)) return;
      const key = (e.key || '').toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;

      // C / X / A / S / U / P — copia, corte, seleccionar todo, guardar, código, imprimir
      if (['c', 'x', 'a', 's', 'u', 'p'].includes(key)) {
        e.preventDefault();
      }
    },
    { capture: true }
  );

  // Imágenes: sin arrastre nativo
  function hardenImages(root) {
    (root || document).querySelectorAll('img').forEach((img) => {
      img.setAttribute('draggable', 'false');
      img.setAttribute('oncontextmenu', 'return false');
    });
  }

  hardenImages();

  if (typeof MutationObserver !== 'undefined') {
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.tagName === 'IMG') hardenImages(node.parentNode || document);
          else if (node.querySelectorAll) hardenImages(node);
        });
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
