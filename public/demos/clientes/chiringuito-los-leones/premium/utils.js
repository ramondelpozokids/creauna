/** Shared DOM helpers for the premium layer (no impact on existing nodes). */

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v == null || v === false) return;
    if (k === 'className') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'style' && typeof v === 'object') {
      Object.assign(node.style, v);
    } else {
      node.setAttribute(k, v === true ? '' : String(v));
    }
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

export function insertAfter(reference, node) {
  if (!reference || !reference.parentNode) return null;
  reference.parentNode.insertBefore(node, reference.nextSibling);
  return node;
}

export function insertBefore(reference, node) {
  if (!reference || !reference.parentNode) return null;
  reference.parentNode.insertBefore(node, reference);
  return node;
}

export function whenVisible(target, callback, options = {}) {
  if (!target) return () => {};
  let done = false;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !done) {
        done = options.once !== false;
        callback(entry);
        if (options.once !== false) obs.disconnect();
      }
    });
  }, { rootMargin: options.rootMargin || '120px 0px', threshold: options.threshold || 0.12 });
  obs.observe(target);
  return () => obs.disconnect();
}

export function lazyImport(factory) {
  let promise;
  return () => {
    if (!promise) promise = factory();
    return promise;
  };
}

export function sectionShell({ id, className = '', titleKey, subKey }) {
  const section = el('section', {
    id,
    className: `ll-section ${className}`.trim(),
    'aria-labelledby': `${id}-title`
  });
  const container = el('div', { className: 'll-container' });
  const title = el('h2', {
    id: `${id}-title`,
    className: 'll-title',
    'data-ll-i18n': titleKey
  });
  const sub = el('p', {
    className: 'll-subtitle',
    'data-ll-i18n': subKey
  });
  container.append(title, sub);
  section.appendChild(container);
  return { section, container, title, sub };
}

export function formatTimeLocal(isoOrDate) {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}

export function countdownTo(targetDate) {
  const now = Date.now();
  const t = targetDate.getTime() - now;
  if (t <= 0) return { done: true, h: 0, m: 0, s: 0 };
  const total = Math.floor(t / 1000);
  return {
    done: false,
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60
  };
}
