import { config } from '../config.js';
import { PREMIUM_I18N, applyPremiumI18n, getLang } from '../i18n.js';

function mapBrowserLang(raw) {
  const base = String(raw || 'es').toLowerCase().slice(0, 2);
  const supported = config.supportedLangs || ['es', 'en', 'fr', 'de', 'it'];
  return supported.includes(base) ? base : 'es';
}

export function initLangDetect() {
  // Inject IT button without editing existing HTML source of ES/EN/FR/DE
  const switcher = document.querySelector('.lang-switcher');
  if (switcher && !switcher.querySelector('[data-lang="it"]')) {
    const it = document.createElement('button');
    it.className = 'lang-btn';
    it.dataset.lang = 'it';
    it.textContent = 'IT';
    it.type = 'button';
    switcher.appendChild(it);
  }

  // Auto-detect only if user has no stored preference
  const stored = localStorage.getItem('ll_lang');
  if (!stored) {
    const detected = mapBrowserLang(navigator.language || (navigator.languages && navigator.languages[0]));
    localStorage.setItem('ll_lang', detected);
  }

  const apply = (lang) => {
    if (window.LL && typeof window.LL.applyI18n === 'function') {
      window.LL.applyI18n(lang);
    } else {
      document.documentElement.lang = lang;
      localStorage.setItem('ll_lang', lang);
    }

    document.querySelectorAll('.lang-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    applyPremiumI18n(document);
    window.dispatchEvent(new CustomEvent('ll:langchange', { detail: { lang: getLang() } }));
  };

  // Wire lang buttons (including injected IT)
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => apply(btn.dataset.lang));
  });

  // Initial
  apply(localStorage.getItem('ll_lang') || 'es');

  // Expose premium dict for debugging / future APIs
  window.LLPremium = window.LLPremium || {};
  window.LLPremium.i18n = PREMIUM_I18N;
  window.LLPremium.applyI18n = () => applyPremiumI18n(document);
}
