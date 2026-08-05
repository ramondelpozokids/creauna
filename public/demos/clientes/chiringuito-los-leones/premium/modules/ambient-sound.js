import { config } from '../config.js';
import { el } from '../utils.js';
import { applyPremiumI18n, t } from '../i18n.js';

const STORAGE_KEY = 'll_ambient_on';

export function initAmbientSound() {
  const wrap = el('div', { className: 'll-ambient', id: 'll-ambient' });
  const btn = el('button', {
    type: 'button',
    className: 'll-ambient__btn',
    'data-ll-i18n-aria': 'll_sound_on',
    'data-ll-i18n-title': 'll_sound_on',
    html: '<i class="fas fa-volume-mute" aria-hidden="true"></i>'
  });
  wrap.appendChild(btn);
  document.body.appendChild(wrap);
  applyPremiumI18n(wrap);

  const url = (config.ambientAudioUrl || '').trim();
  if (!url) {
    btn.classList.add('is-disabled');
    btn.title = t('ll_sound_na');
    btn.setAttribute('aria-label', t('ll_sound_na'));
    btn.addEventListener('click', () => {
      btn.title = t('ll_sound_na');
    });
    return;
  }

  const audio = new Audio();
  audio.src = url;
  audio.loop = true;
  audio.preload = 'none';
  audio.volume = 0;

  const targetVol = Math.min(1, Math.max(0, config.ambientVolume || 0.18));
  let fading = null;
  let on = localStorage.getItem(STORAGE_KEY) === '1';

  const setIcon = (active) => {
    btn.classList.toggle('is-on', active);
    btn.innerHTML = active
      ? '<i class="fas fa-volume-up" aria-hidden="true"></i>'
      : '<i class="fas fa-volume-mute" aria-hidden="true"></i>';
    btn.setAttribute('aria-label', t(active ? 'll_sound_off' : 'll_sound_on'));
    btn.title = t(active ? 'll_sound_off' : 'll_sound_on');
  };

  const fadeTo = (vol, ms = 700) => {
    if (fading) cancelAnimationFrame(fading);
    const start = audio.volume;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      audio.volume = start + (vol - start) * p;
      if (p < 1) fading = requestAnimationFrame(step);
      else fading = null;
    };
    fading = requestAnimationFrame(step);
  };

  const enable = async () => {
    try {
      await audio.play();
      fadeTo(targetVol);
      on = true;
      localStorage.setItem(STORAGE_KEY, '1');
      setIcon(true);
    } catch {
      on = false;
      localStorage.setItem(STORAGE_KEY, '0');
      setIcon(false);
    }
  };

  const disable = () => {
    fadeTo(0, 500);
    setTimeout(() => audio.pause(), 520);
    on = false;
    localStorage.setItem(STORAGE_KEY, '0');
    setIcon(false);
  };

  setIcon(false);
  // Never autoplay — only restore preference after explicit prior user choice,
  // still requiring a click if browser blocks. Preference remembered, not auto-started.
  btn.addEventListener('click', () => {
    if (on) disable();
    else enable();
  });
}
