import { config } from '../config.js';
import { el } from '../utils.js';
import { applyPremiumI18n } from '../i18n.js';

/** Only link to sections that are actually enabled. */
function activeLinks() {
  const f = config.features || {};
  const links = [];
  if (f.generations) links.push({ href: '#ll-generations', key: 'll_gen_title' });
  if (f.interactiveMenu) links.push({ href: '#ll-interactive-menu', key: 'll_menu_title' });
  if (f.weather || f.sunset || f.seaWebcam || f.espetosNow) {
    links.push({ href: '#ll-sea', key: 'll_sea_title' });
  }
  if (f.instagram) links.push({ href: '#ll-instagram', key: 'll_ig_title' });
  links.push({ href: '#reservas', key: 'll_reserve_link' });
  return links;
}

export function initExperiencesPanel() {
  const links = activeLinks();
  if (!links.length) return;

  const root = el('div', { className: 'll-experiences', id: 'll-experiences' });
  const toggle = el('button', {
    type: 'button',
    className: 'll-experiences__toggle',
    'data-ll-i18n-aria': 'll_exp_open',
    'data-ll-i18n-title': 'll_exp_open',
    html: '<i class="fas fa-compass" aria-hidden="true"></i>'
  });
  const panel = el('div', { className: 'll-experiences__panel', id: 'll-experiences-panel' });
  const head = el('div', { className: 'll-experiences__head' });
  head.append(
    el('strong', { 'data-ll-i18n': 'll_exp_title' }),
    el('button', { type: 'button', 'data-ll-i18n-aria': 'll_exp_close', html: '&times;' })
  );
  const list = el('ul', { className: 'll-experiences__list' });
  links.forEach((item) => {
    const li = el('li');
    li.appendChild(el('a', { href: item.href, 'data-ll-i18n': item.key }));
    list.appendChild(li);
  });
  panel.append(head, list);
  root.append(toggle, panel);
  document.body.appendChild(root);
  applyPremiumI18n(root);

  const closeBtn = head.querySelector('button');
  const close = () => panel.classList.remove('open');
  toggle.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', close);
  list.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => close());
  });
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) close();
  });
}
