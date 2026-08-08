(function () {
  'use strict';

  // Hide loader when page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 800);
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target.classList.contains('reveal-up')) {
          entry.target.classList.add('in');
          entry.target.style.opacity = '';
          entry.target.style.transform = '';
        } else {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.menu-item, .about-images img').forEach((item) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });

  document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));

  // Mobile menu
  const navToggle = document.getElementById('nav-toggle');
  const navDrawer = document.getElementById('nav-drawer');

  function setNavOpen(open) {
    if (!navbar || !navToggle) return;
    navbar.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      setNavOpen(!navbar.classList.contains('nav-open'));
    });
  }

  if (navDrawer) {
    navDrawer.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => setNavOpen(false));
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNavOpen(false);
  });

  // Scroll to top
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Pause hero video when off-screen
  const video = document.querySelector('.hero .video-background');
  const heroSection = document.querySelector('.hero');
  if (video && heroSection) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 }
    );
    videoObserver.observe(heroSection);
  }

  // Gallery lightbox (open / prev / next)
  (function initGalleryLightbox() {
    const items = Array.from(document.querySelectorAll('.gallery-item[data-gallery-src]'));
    const root = document.getElementById('pp-lightbox');
    const img = document.getElementById('pp-lightbox-img');
    const caption = document.getElementById('pp-lightbox-caption');
    const counter = document.getElementById('pp-lightbox-counter');
    if (!items.length || !root || !img) return;

    let index = 0;
    let open = false;

    function render() {
      const el = items[index];
      const src = el.dataset.gallerySrc;
      const alt = el.dataset.galleryAlt || el.querySelector('img')?.alt || '';
      img.src = src;
      img.alt = alt;
      if (caption) caption.textContent = alt;
      if (counter) counter.textContent = `${index + 1} / ${items.length}`;
      const prev = items[(index - 1 + items.length) % items.length];
      const next = items[(index + 1) % items.length];
      [prev, next].forEach((p) => {
        const pre = new Image();
        pre.src = p.dataset.gallerySrc;
      });
    }

    function openAt(i) {
      index = ((i % items.length) + items.length) % items.length;
      open = true;
      render();
      root.hidden = false;
      root.classList.add('is-open');
      root.setAttribute('aria-hidden', 'false');
      document.body.classList.add('pp-lightbox-open');
    }

    function close() {
      open = false;
      root.classList.remove('is-open');
      root.hidden = true;
      root.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('pp-lightbox-open');
    }

    function go(delta) {
      index = (index + delta + items.length) % items.length;
      render();
    }

    items.forEach((item, i) => {
      item.addEventListener('click', () => openAt(i));
    });

    root.querySelectorAll('[data-lightbox-close]').forEach((btn) => {
      btn.addEventListener('click', close);
    });
    const prevBtn = root.querySelector('[data-lightbox-prev]');
    const nextBtn = root.querySelector('[data-lightbox-next]');
    if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(1));

    document.addEventListener('keydown', (e) => {
      if (!open) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });

    let touchX = null;
    const stage = root.querySelector('.pp-lightbox__stage');
    if (stage) {
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
    }
  })();

  // Waves (default on) + optional ambient music
  (function initAmbientAudio() {
    const waveButtons = Array.from(document.querySelectorAll('[data-waves-toggle]'));
    const musicButtons = Array.from(document.querySelectorAll('[data-ambient-toggle]'));
    if (!waveButtons.length && !musicButtons.length) return;

    const waves = new Audio('video/ocean-waves.mp3');
    waves.loop = true;
    waves.preload = 'auto';
    waves.volume = 0;

    const music = new Audio('video/tokyorifft-algarve-highwaycap-dx27antibes-555160.mp3');
    music.loop = true;
    music.preload = 'none';
    music.volume = 0;

    let wavesWanted = true;
    let wavesOn = false;
    let musicOn = false;
    let unlockArmed = false;
    const wavesVol = 0.28;
    const musicVol = 0.32;

    function tKey(key, fallback) {
      const t = window.PP && typeof window.PP.t === 'function' ? window.PP.t : null;
      return t ? t(key) : fallback;
    }

    function fade(audio, fadingRef, vol, ms, onDone) {
      if (fadingRef.id) cancelAnimationFrame(fadingRef.id);
      const start = audio.volume;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / ms);
        audio.volume = start + (vol - start) * p;
        if (p < 1) fadingRef.id = requestAnimationFrame(step);
        else {
          fadingRef.id = null;
          if (onDone) onDone();
        }
      };
      fadingRef.id = requestAnimationFrame(step);
    }

    const wavesFadeRef = { id: null };
    const musicFadeRef = { id: null };

    function syncWavesUI() {
      const onLabel = tKey('waves_on', 'Activar olas');
      const offLabel = tKey('waves_off', 'Silenciar olas');
      const title = tKey('waves_title', 'Sonido del mar');
      waveButtons.forEach((btn) => {
        btn.classList.toggle('is-on', wavesWanted);
        btn.setAttribute('aria-pressed', wavesWanted ? 'true' : 'false');
        btn.setAttribute('aria-label', wavesWanted ? offLabel : onLabel);
        btn.title = title;
        const icon = btn.querySelector('i');
        if (icon) icon.className = wavesWanted ? 'fas fa-water' : 'fas fa-volume-mute';
        const text = btn.querySelector('[data-waves-label]');
        if (text) text.textContent = wavesWanted ? offLabel : onLabel;
      });
    }

    function syncMusicUI() {
      const onLabel = tKey('ambient_on', 'Activar ambiente');
      const offLabel = tKey('ambient_off', 'Desactivar ambiente');
      const title = tKey('ambient_title', 'Música ambiente');
      musicButtons.forEach((btn) => {
        btn.classList.toggle('is-on', musicOn);
        btn.setAttribute('aria-pressed', musicOn ? 'true' : 'false');
        btn.setAttribute('aria-label', musicOn ? offLabel : onLabel);
        btn.title = title;
        const icon = btn.querySelector('i');
        if (icon) icon.className = 'fas fa-music';
        const text = btn.querySelector('[data-ambient-label]');
        if (text) text.textContent = musicOn ? offLabel : onLabel;
      });
    }

    function syncUI() {
      syncWavesUI();
      syncMusicUI();
    }

    function pauseWavesSoft() {
      fade(waves, wavesFadeRef, 0, 400, () => {
        if (!wavesWanted || musicOn) {
          waves.pause();
          wavesOn = false;
        }
      });
    }

    async function startWaves() {
      if (!wavesWanted || musicOn) return;
      try {
        waves.volume = 0;
        if (waves.paused) await waves.play();
        wavesOn = true;
        fade(waves, wavesFadeRef, wavesVol, 900);
        syncWavesUI();
      } catch {
        wavesOn = false;
        armUnlock();
        syncWavesUI();
      }
    }

    function armUnlock() {
      if (unlockArmed || !wavesWanted) return;
      unlockArmed = true;
      const unlock = () => {
        if (!unlockArmed) return;
        unlockArmed = false;
        document.removeEventListener('pointerdown', unlock);
        document.removeEventListener('keydown', unlock);
        if (wavesWanted && !musicOn) startWaves();
      };
      document.addEventListener('pointerdown', unlock, { passive: true });
      document.addEventListener('keydown', unlock);
    }

    function stopMusic() {
      musicOn = false;
      syncMusicUI();
      fade(music, musicFadeRef, 0, 450, () => {
        if (!musicOn) {
          music.pause();
          music.currentTime = 0;
        }
      });
      if (wavesWanted) startWaves();
    }

    async function startMusic() {
      try {
        if (wavesOn || !waves.paused) pauseWavesSoft();
        music.volume = 0;
        if (music.paused) await music.play();
        musicOn = true;
        fade(music, musicFadeRef, musicVol, 900);
        syncMusicUI();
      } catch {
        musicOn = false;
        syncMusicUI();
      }
    }

    waveButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        wavesWanted = !wavesWanted;
        if (!wavesWanted) {
          unlockArmed = false;
          pauseWavesSoft();
          syncWavesUI();
        } else if (!musicOn) {
          startWaves();
        } else {
          syncWavesUI();
        }
      });
    });

    musicButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (musicOn) stopMusic();
        else startMusic();
      });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (musicOn) music.pause();
        else if (wavesOn) waves.pause();
      } else if (musicOn) {
        music.play().catch(() => {});
      } else if (wavesWanted && !musicOn) {
        startWaves();
      }
    });

    window.PPAmbient = { syncUI };
    syncUI();
    startWaves();
  })();
})();
