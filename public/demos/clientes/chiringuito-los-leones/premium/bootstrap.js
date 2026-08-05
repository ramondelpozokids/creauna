/**
 * Premium additive layer entry point.
 * Injects new modules without modifying existing sections' markup or styles.
 */
import { config } from './config.js';
import { applyPremiumI18n } from './i18n.js';

async function safe(name, loader) {
  if (!config.features[name]) return;
  try {
    const mod = await loader();
    const init = mod.init || mod.default;
    if (typeof init === 'function') await init();
    else {
      // named inits
      const fn = Object.values(mod).find((v) => typeof v === 'function' && /^init/.test(v.name));
      if (fn) await fn();
    }
  } catch (err) {
    console.warn('[LL Premium]', name, err);
  }
}

function waitForExtras() {
  return new Promise((resolve) => {
    if (window.LL) return resolve();
    const start = Date.now();
    const tick = () => {
      if (window.LL || Date.now() - start > 2000) return resolve();
      requestAnimationFrame(tick);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(tick, 0), { once: true });
    } else {
      setTimeout(tick, 0);
    }
  });
}

async function boot() {
  await waitForExtras();
  window.LLPremium = window.LLPremium || { config };

  // Core UX (immediate, lightweight)
  await safe('heroCinema', () => import('./modules/hero-cinema.js').then((m) => ({ init: m.initHeroCinema })));
  await safe('langDetect', () => import('./modules/lang-detect.js').then((m) => ({ init: m.initLangDetect })));
  await safe('ambientSound', () => import('./modules/ambient-sound.js').then((m) => ({ init: m.initAmbientSound })));
  await safe('experiencesPanel', () => import('./modules/experiences-panel.js').then((m) => ({ init: m.initExperiencesPanel })));
  await safe('aiAssistant', () => import('./modules/ai-assistant.js').then((m) => ({ init: m.initAiAssistant })));

  // Content sections (DOM injection)
  await safe('generations', () => import('./modules/generations.js').then((m) => ({ init: m.initGenerations })));
  await safe('interactiveMenu', () => import('./modules/interactive-menu.js').then((m) => ({ init: m.initInteractiveMenu })));

  // Sea block bundles weather + sunset + webcam + espetos (single injection)
  const seaOn = config.features.weather || config.features.sunset ||
    config.features.seaWebcam || config.features.espetosNow;
  if (seaOn) {
    try {
      const sea = await import('./modules/sea-experience.js');
      sea.initSeaExperience();
    } catch (err) {
      console.warn('[LL Premium] sea', err);
    }
  }

  await safe('view360', () => import('./modules/view360.js').then((m) => ({ init: m.initView360 })));
  await safe('virtualTour', () => import('./modules/virtual-tour.js').then((m) => ({ init: m.initVirtualTour })));
  await safe('liveKitchen', () => import('./modules/live-kitchen.js').then((m) => ({ init: m.initLiveKitchen })));
  await safe('smartReserve', () => import('./modules/smart-reserve.js').then((m) => ({ init: m.initSmartReserve })));
  await safe('instagram', () => import('./modules/social-instagram.js').then((m) => ({ init: m.initInstagram })));
  await safe('tiktok', () => import('./modules/social-tiktok.js').then((m) => ({ init: m.initTiktok })));
  await safe('galleryLightbox', () => import('./modules/gallery-lightbox.js').then((m) => ({ init: m.initGalleryLightbox })));
  await safe('cartaCompleta', () => import('./modules/carta-completa.js').then((m) => ({ init: m.initCartaCompleta })));
  await safe('brandStory', () => import('./modules/brand-story.js').then((m) => ({ init: m.initBrandStory })));

  // Transitions after nodes exist
  await safe('transitions', () => import('./modules/transitions.js').then((m) => ({ init: m.initTransitions })));

  applyPremiumI18n(document);
  window.dispatchEvent(new CustomEvent('ll:premium-ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
