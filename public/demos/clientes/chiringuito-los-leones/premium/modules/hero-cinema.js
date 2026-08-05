/**
 * Enhances existing hero/seascape videos without changing composition.
 * Adds poster fallback, optimized preload, playsinline, error → image/bg fallback.
 */
export function initHeroCinema() {
  const videos = document.querySelectorAll('.hero video.video-background, .video-section video.video-background');
  videos.forEach((video) => {
    if (!(video instanceof HTMLVideoElement)) return;
    if (video.dataset.llCinema === '1') return;
    video.dataset.llCinema = '1';

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    if (!video.getAttribute('preload')) video.preload = 'metadata';

    const section = video.closest('.hero, .video-section');
    if (section && !section.style.backgroundColor) {
      section.style.backgroundColor = '#0a1628';
    }

    if (!video.getAttribute('poster')) {
      video.setAttribute('poster', 'images/logo_sin.png');
    }

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    video.addEventListener('error', () => {
      video.style.display = 'none';
      if (section) {
        section.style.backgroundImage = 'linear-gradient(160deg,#0a1628,#1e3a5f)';
      }
    }, { once: true });

    if (video.readyState >= 2) tryPlay();
    else video.addEventListener('loadeddata', tryPlay, { once: true });

    // Pause when off-screen (performance)
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      });
    }, { threshold: 0.35 });
    if (section) obs.observe(section);
  });
}
