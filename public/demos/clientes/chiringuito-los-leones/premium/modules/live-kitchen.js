import { config } from '../config.js';
import { el, insertAfter, sectionShell, whenVisible } from '../utils.js';
import { applyPremiumI18n } from '../i18n.js';

function youtubeEmbed(url) {
  const m = String(url).match(/(?:youtu\.be\/|v=|live\/|embed\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=0&rel=0` : url;
}

function vimeoEmbed(url) {
  const m = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? `https://player.vimeo.com/video/${m[1]}` : url;
}

export function initLiveKitchen() {
  const after = document.getElementById('ll-tour') || document.getElementById('galeria');
  if (!after) return;

  const { section, container } = sectionShell({
    id: 'll-live-kitchen',
    className: 'll-section ll-section--dark',
    titleKey: 'll_live_title',
    subKey: 'll_live_sub'
  });

  const frame = el('div', { className: 'll-media-frame' });
  container.appendChild(frame);
  insertAfter(after, section);
  applyPremiumI18n(section);

  whenVisible(section, async () => {
    const cfg = config.liveKitchen || {};
    const url = (cfg.url || '').trim();
    frame.innerHTML = '';

    if (!url) {
      const ph = el('div', {
        className: 'll-placeholder',
        'data-ll-i18n': 'll_live_na',
        style: { backgroundImage: `url('${cfg.poster || 'images/8.png'}')` }
      });
      frame.appendChild(ph);
      applyPremiumI18n(frame);
      return;
    }

    const provider = (cfg.provider || '').toLowerCase();

    if (provider === 'hls' || url.endsWith('.m3u8')) {
      const video = el('video', {
        controls: true,
        playsinline: true,
        poster: cfg.poster || ''
      });
      frame.appendChild(video);
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        try {
          const mod = await import('https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.mjs');
          const Hls = mod.default;
          if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: true });
            hls.loadSource(url);
            hls.attachMedia(video);
          } else {
            video.src = url;
          }
        } catch {
          video.src = url;
        }
      }
      return;
    }

    if (provider === 'rtsp') {
      // Browsers cannot play RTSP natively — show fallback guidance
      const ph = el('div', {
        className: 'll-placeholder',
        'data-ll-i18n': 'll_live_na',
        style: { backgroundImage: `url('${cfg.poster || 'images/8.png'}')` }
      });
      frame.appendChild(ph);
      applyPremiumI18n(frame);
      return;
    }

    let src = url;
    if (provider === 'youtube' || /youtu/.test(url)) src = youtubeEmbed(url);
    if (provider === 'vimeo' || /vimeo/.test(url)) src = vimeoEmbed(url);

    frame.appendChild(el('iframe', {
      src,
      title: 'Live kitchen',
      loading: 'lazy',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen',
      allowfullscreen: true
    }));
  });
}
