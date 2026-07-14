
/* Unbreakable Scroll-Up Button */
(function() {
  function initUnbreakableScrollUp() {
    var btn = document.getElementById('scroll-up');
    if (!btn) return;
    function checkScroll() {
      var sy = window.scrollY || window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop) || 0;
      if (sy > 150) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    document.addEventListener('scroll', checkScroll, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('scroll', checkScroll, { passive: true });
    }
    checkScroll();
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (document.documentElement) document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      if (document.body) document.body.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnbreakableScrollUp);
  } else {
    initUnbreakableScrollUp();
  }
  window.addEventListener('load', initUnbreakableScrollUp);
})();


/* Nuclear Vercel Live Feedback Killer */
(function() {
  function destroyVercel() {
    var selectors = [
      'vercel-live-feedback', '#vercel-live-feedback', '[id*="vercel-live"]',
      '[id*="vercel-toolbar"]', 'vercel-toolbar', '.vercel-toolbar',
      'iframe[src*="vercel.live"]', 'iframe[id*="vercel"]', 'div[class*="vercel-toolbar"]'
    ];
    selectors.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        el.remove();
      });
    });
    // Also remove from any shadowRoot if accessible
    document.querySelectorAll('*').forEach(function(el) {
      if (el.shadowRoot) {
        selectors.forEach(function(sel) {
          el.shadowRoot.querySelectorAll(sel).forEach(function(subEl) { subEl.remove(); });
        });
      }
    });
  }
  destroyVercel();
  setInterval(destroyVercel, 300);
  window.addEventListener('DOMContentLoaded', destroyVercel);
  window.addEventListener('load', destroyVercel);
})();


/* Force kill any Vercel Toolbar */
(function() {
  function removeVercelToolbar() {
    document.querySelectorAll('vercel-toolbar, #vercel-toolbar, [data-vercel-toolbar], .vercel-toolbar').forEach(function(el){
      el.remove();
    });
  }
  removeVercelToolbar();
  setInterval(removeVercelToolbar, 500);
  window.addEventListener('DOMContentLoaded', removeVercelToolbar);
})();

/* ============================================================
   MUSEO DIGITAL — Lógica principal + Chat Assistant
   Navegación, scroll, modo museo, favoritos, chat, i18n
   ============================================================ */

(function () {
  'use strict';

  function _(key) { try { return MuseoI18n.t(key); } catch (_) { return key; } }

  const OBRA = 'assets/obras/';
  const COLECCIONES = [
    {
      id: 'luz-y-sombra', titulo: 'Luz y Sombra',
      obras: [
        { id:'obra-1', titulo:'Amanecer en la Bruma', ano:'2024', tecnica:'Óleo sobre lienzo', medidas:'180×220 cm', img:OBRA+'amanecer-bruma.jpg' },
        { id:'obra-2', titulo:'El Último Rayo',       ano:'2023', tecnica:'Óleo sobre lienzo', medidas:'150×200 cm', img:OBRA+'ultimo-rayo.jpg' },
        { id:'obra-3', titulo:'Interludio',            ano:'2023', tecnica:'Técnica mixta',    medidas:'120×160 cm', img:OBRA+'interludio.jpg' },
        { id:'obra-4', titulo:'Claroscuro No. 7',     ano:'2022', tecnica:'Óleo sobre tabla', medidas:'90×120 cm',   img:OBRA+'claroscuro-7.jpg' }
      ]
    },
    {
      id: 'geometria-sagrada', titulo: 'Geometría Sagrada',
      obras: [
        { id:'obra-5', titulo:'Espiral Áurea',       ano:'2022', tecnica:'Acr. sobre lienzo',   medidas:'200×200 cm', img:OBRA+'espiral-aurea.jpg' },
        { id:'obra-6', titulo:'Vesica Piscis',        ano:'2021', tecnica:'Óleo y pan de oro',   medidas:'140×180 cm', img:OBRA+'vesica-piscis.jpg' },
        { id:'obra-7', titulo:'La Flor de la Vida',   ano:'2021', tecnica:'Técnica mixta',      medidas:'160×160 cm', img:OBRA+'flor-de-la-vida.jpg' }
      ]
    },
    {
      id: 'horizontes-interiores', titulo: 'Horizontes Interiores',
      obras: [
        { id:'obra-8',  titulo:'Memoria del Horizonte', ano:'2020', tecnica:'Óleo sobre lienzo', medidas:'190×240 cm', img:OBRA+'memoria-horizonte.jpg' },
        { id:'obra-9',  titulo:'Tierra Callada',        ano:'2019', tecnica:'Óleo sobre lienzo', medidas:'160×200 cm', img:OBRA+'tierra-callada.jpg' },
        { id:'obra-10', titulo:'Umbral',                 ano:'2018', tecnica:'Óleo sobre tabla', medidas:'100×140 cm', img:OBRA+'umbral.jpg' }
      ]
    }
  ];

  const state = { favoritos: new Set(), museumMode: false, museumIndex: 0, lastScrollY: 0, navVisible: true };

  /* ============ INIT ============ */
    async function init() {
    try { await MuseoDB.init(); const favs = await MuseoDB.getFavoritos(); favs.forEach(f => state.favoritos.add(f.id)); } catch (_) { loadFavsLS(); }
    try { await MuseoI18n.init(); } catch (_) {}
    try { window.addEventListener('museo:langChanged', () => { updateFavButtons(); try { MuseoI18n.applyTranslations(); } catch (_) {} }); } catch (_) {}
    try { const mp = await MuseoDB.getPreferencia('museumMode'); if (mp === 'true') state.museumMode = true; } catch (_) {}
    try { setupNavigation(); } catch (e) { console.error('setupNavigation', e); }
    try { setupScrollReveal(); } catch (e) { console.error('setupScrollReveal', e); }
    try { setupMuseumMode(); } catch (e) { console.error('setupMuseumMode', e); }
    try { setupFavorites(); } catch (e) { console.error('setupFavorites', e); }
    try { setupContactForm(); } catch (e) { console.error('setupContactForm', e); }
    try { setupSmoothScroll(); } catch (e) { console.error('setupSmoothScroll', e); }
    try { setupMuseumModeTrigger(); } catch (e) { console.error('setupMuseumModeTrigger', e); }
    try { setupChatAssistant(); } catch (e) { console.error('setupChatAssistant', e); }
    try { setupScrollUp(); } catch (e) { console.error('setupScrollUp', e); }
    try { updateFavButtons(); } catch (e) { console.error('updateFavButtons', e); }
    console.log('🏛️ Yana Yavorskaya inicializado y blindado');
  }

  function loadFavsLS() { try { const r = localStorage.getItem('museo_favoritos'); if (r) JSON.parse(r).forEach(id => state.favoritos.add(id)); } catch (_) {} }
  function saveFavsLS()   { try { localStorage.setItem('museo_favoritos', JSON.stringify([...state.favoritos])); } catch (_) {} }

  /* ============ NAV ============ */
  function setupNavigation() {
    const nav = document.querySelector('.nav'), toggle = document.querySelector('.nav__toggle'), links = document.querySelector('.nav__links');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      nav.classList.toggle('nav--scrolled', sy > 80);
      if (sy > state.lastScrollY && sy > 300) { if (state.navVisible) { nav.classList.add('nav--hidden'); state.navVisible = false; } }
      else { if (!state.navVisible) { nav.classList.remove('nav--hidden'); state.navVisible = true; } }
      state.lastScrollY = sy;
    }, { passive: true });
    if (toggle && links) {
      toggle.addEventListener('click', () => { links.classList.toggle('is-open'); const e = links.classList.contains('is-open'); toggle.setAttribute('aria-expanded', e); toggle.setAttribute('aria-label', e ? _('nav.close') : _('nav.toggle')); });
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { links.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }));
    }
    const sects = document.querySelectorAll('section[id]'), navL = document.querySelectorAll('.nav__links a[href^="#"]');
    const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) navL.forEach(a => { a.style.color = ''; if (a.getAttribute('href') === '#' + e.target.id) a.style.color = 'var(--accent)'; }); }); }, { rootMargin: '-40% 0px -55% 0px' });
    sects.forEach(s => obs.observe(s));
  }

  /* ============ SCROLL REVEAL ============ */
  function setupScrollReveal() {
    const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } }); }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ============ MODO MUSEO ============ */
  function setupNightSpotlight(root) {
    if (!root || root._nightSpotlight) return;
    root._nightSpotlight = true;
    var spot = root.querySelector('.night-gallery__spotlight');
    if (!spot) return;
    function setSpot(x, y) {
      spot.style.setProperty('--spot-x', x + '%');
      spot.style.setProperty('--spot-y', y + '%');
    }
    root.addEventListener('mousemove', function(e) {
      var r = root.getBoundingClientRect();
      setSpot(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
    });
    root.addEventListener('mouseleave', function() { setSpot(50, 38); });
    setSpot(50, 38);
  }

  function setupMuseumMode() {
    const ov = document.querySelector('.museum-mode'), cb = ov?.querySelector('.museum-mode__close'), pb = ov?.querySelector('.museum-mode__prev'), nb = ov?.querySelector('.museum-mode__next');
    if (!ov) return;
    setupNightSpotlight(ov);
    setupNightSpotlight(document.getElementById('lb-overlay'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.museumMode) closeMuseumMode(); if (state.museumMode && e.key === 'ArrowRight') nextArtwork(); if (state.museumMode && e.key === 'ArrowLeft') prevArtwork(); });
    cb?.addEventListener('click', closeMuseumMode); pb?.addEventListener('click', prevArtwork); nb?.addEventListener('click', nextArtwork);
  }
  function setupMuseumModeTrigger() { document.querySelectorAll('[data-museum-open]').forEach(t => t.addEventListener('click', () => { openMuseumMode(t.getAttribute('data-collection'), parseInt(t.getAttribute('data-obra-index') || '0', 10)); })); }
  function openMuseumMode(cid, oi) {
    const ov = document.querySelector('.museum-mode'), ae = ov?.querySelector('.museum-mode__artwork'); if (!ov || !ae) return;
    state.museumIndex = oi; state.museumMode = true; ov.classList.add('is-active'); document.body.style.overflow = 'hidden';
    MuseoDB.setPreferencia('museumMode', 'true').catch(() => {}); updateMuseumArtwork(ae);
  }
  function closeMuseumMode() { const ov = document.querySelector('.museum-mode'); if (!ov) return; state.museumMode = false; ov.classList.remove('is-active'); document.body.style.overflow = ''; MuseoDB.setPreferencia('museumMode', 'false').catch(() => {}); }
  function nextArtwork() { state.museumIndex++; const ae = document.querySelector('.museum-mode__artwork'); if (ae) updateMuseumArtwork(ae); }
  function prevArtwork() { if (state.museumIndex > 0) { state.museumIndex--; const ae = document.querySelector('.museum-mode__artwork'); if (ae) updateMuseumArtwork(ae); } }

  function updateMuseumArtwork(el) {
    const counter = document.querySelector('.museum-mode__counter');
    const todas = COLECCIONES.flatMap(c => c.obras), total = todas.length, idx = Math.min(state.museumIndex, total - 1), obra = todas[idx];
    if (counter) counter.textContent = `${idx + 1} / ${total}`;
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.backgroundImage = `url(${obra.img})`;
      el.style.backgroundSize = 'contain';
      el.style.backgroundPosition = 'center';
      el.style.opacity = '1';
    }, 350);
    MuseoDB.addVisita(obra).catch(() => {});
  }

  /* ============ FAVORITOS ============ */
  function setupFavorites() {
    document.addEventListener('click', async e => {
      const btn = e.target.closest('.btn--favorite'); if (!btn) return;
      const oid = btn.getAttribute('data-obra-id'), oti = btn.getAttribute('data-obra-titulo') || ''; if (!oid) return;
      try {
        const r = await MuseoDB.toggleFavorito({ id: oid, titulo: oti, fecha: new Date().toISOString() });
        r.action === 'added' ? state.favoritos.add(oid) : state.favoritos.delete(oid);
        saveFavsLS(); updateFavButtons(); showToast(_(r.action === 'added' ? 'toast.favAdded' : 'toast.favRemoved'));
      } catch (_) {
        state.favoritos.has(oid) ? (state.favoritos.delete(oid), showToast(_('toast.favRemoved'))) : (state.favoritos.add(oid), showToast(_('toast.favAdded')));
        saveFavsLS(); updateFavButtons();
      }
    });
  }
  function updateFavButtons() { document.querySelectorAll('.btn--favorite').forEach(btn => { const id = btn.getAttribute('data-obra-id'); const fav = state.favoritos.has(id); btn.classList.toggle('is-fav', fav); btn.textContent = fav ? '✦' : '☆'; btn.setAttribute('aria-label', _('featured.fav')); }); }

  /* ============ TOAST ============ */
  function showToast(msg) { let t = document.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); } t.textContent = msg; t.classList.add('is-visible'); clearTimeout(t._timeout); t._timeout = setTimeout(() => t.classList.remove('is-visible'), 2500); }

  /* ============ CONTACTO ============ */
  function setupContactForm() {
    const f = document.getElementById('contact-form'); if (!f) return;
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const n = f.querySelector('[name="nombre"]')?.value || '', m = f.querySelector('[name="email"]')?.value || '', ms = f.querySelector('[name="mensaje"]')?.value || '';
      if (!n || !m || !ms) { showToast(_('toast.formIncomplete')); return; }
      try { await MuseoDB.saveConsulta({ nombre: n, email: m, mensaje: ms }); } catch (_) {}
      showToast(_('toast.formSent')); f.reset();
    });
  }

  /* ============ SMOOTH SCROLL ============ */
  function setupSmoothScroll() { document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a) return; const t = document.getElementById(a.getAttribute('href').slice(1)); if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); const l = document.querySelector('.nav__links'); if (l?.classList.contains('is-open')) { l.classList.remove('is-open'); document.querySelector('.nav__toggle')?.setAttribute('aria-expanded', 'false'); } } }); }

  /* ============ EXPORT/IMPORT ============ */
  window.museoExport = async function () { try { const d = await MuseoDB.exportAll(); const b = new Blob([JSON.stringify(d,null,2)],{type:'application/json'}); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href=u; a.download=`museo-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(u); showToast(_('toast.exportOk')); } catch (_) { showToast(_('toast.exportError')); } };
  window.museoImport = async function (file) { try { const t = await file.text(); const d = JSON.parse(t); await MuseoDB.importAll(d); const f = await MuseoDB.getFavoritos(); state.favoritos = new Set(f.map(x => x.id)); updateFavButtons(); showToast(_('toast.importOk')); } catch (_) { showToast(_('toast.importError')); } };

  /* ============ CHAT ASSISTANT ============ */
    function setupChatAssistant() {
    const tr = document.getElementById('chat-trigger');
    const pn = document.getElementById('chat-panel');
    if (!tr || !pn) return;
    const cl = pn.querySelector('#chat-close');
    const inp = pn.querySelector('#chat-input');
    const snd = pn.querySelector('#chat-send');
    const msgs = pn.querySelector('#chat-messages');
    const qk = pn.querySelector('#chat-quick');
    if (!msgs) return;

    const _ = function(k) { try { return window.MuseoI18n && MuseoI18n.t ? MuseoI18n.t(k) : k; } catch(e) { return k; } };

    function reply(u) {
      const m = u.toLowerCase();
      
      // 1. Saludos
      if (m.includes('hola')||m.includes('buenas')||m.includes('hello')||m.includes('bonjour')||m.includes('ciao')||m.includes('hallo')||m.includes('bienvenid')) {
        return _('chat.greeting');
      }

      // 2. Precios, tarifas, cuánto cuesta y cómo comprar
      if (m.includes('precio')||m.includes('cuesta')||m.includes('cost')||m.includes('tarif')||m.includes('comprar')||m.includes('adquirir')||m.includes('buy')||m.includes('disponib')||m.includes('catálogo')||m.includes('catalogo')) {
        return 'Contamos con 12 obras originales en obras-disponibles.html con precios entre 2.100 € y 4.200 € (ej. «Aurora Interior» 2.800 €, «Luz de Invierno III» 3.600 €, «Tránsito Nocturno» 3.100 €, «Meditación en Ocre» 2.100 €). Todas incluyen certificado de autenticidad firmado por Yana y envío asegurado en caja de madera. Pulsa «Solicitar información» en cualquier obra o escribe al WhatsApp +34 600 88 99 77.';
      }

      // 3. Obras concretas por título
      if (m.includes('aurora')) return '«Aurora Interior» (2026) · 100 × 80 cm · 2.800 € · Disponible. Acrílico y óleo sobre lienzo de lino de grano fino. Colección Horizontes Suspendidos.';
      if (m.includes('invierno') && !m.includes('luz')) return '«Luz de Invierno III» (2025) · 120 × 120 cm · 3.600 € · Disponible. Óleo sobre bastidor 3D con veladuras de blanco titanio y azul cobalto.';
      if (m.includes('luz') && m.includes('sombra')) return 'La colección «Luz y Sombra» (2022–2024) incluye 4 obras como «Amanecer en la Bruma» (180×220 cm), «El Último Rayo», «Interludio» y «Claroscuro No. 7». Explora contrastes lumínicos al óleo. Puedes verlas en modo inmersivo desde Inicio → Colecciones.';
      if (m.includes('silencio')||m.includes('nocturno')||m.includes('tránsito')||m.includes('transito')) return 'En «Silencios Urbanos» destacan «Silencios Urbanos: Nocturno» (90×110 cm, 2.400 €), «Tránsito Nocturno» (120×90 cm, 3.100 €) y «Geometría del Silencio» (100×100 cm, 2.600 €). Capturan la poesía nocturna de Madrid.';
      if (m.includes('memoria')||m.includes('eco')) return '«Eco de la Memoria» (130×97 cm, 3.200 €) · Reservada. Óleo sobre lienzo. Indaga en la nostalgia y los bosques de la infancia con veladuras sobre verdes musgo.';
      if (m.includes('viento')||m.includes('reposo')) return '«El Reposo del Viento» (150×100 cm, 4.200 €) · Obra vendida. Acrílico, arena de cuarzo y óleo sobre lienzo de gran formato. Colección Horizontes Suspendidos.';
      if (m.includes('ocre')||m.includes('meditaci')) return '«Meditación en Ocre» (80×80 cm, 2.100 €) · Disponible. Óleo y cera fría sobre panel de madera en tonos terrosos. Colección Naturaleza Latente.';
      if (m.includes('blanco') && m.includes('horizonte')) return '«Horizontes Blancos» (140×90 cm, 3.500 €) · Disponible. Acrílico de alta densidad y grafito sobre lienzo. Ensayo minimalista sobre los infinitos matices del blanco.';
      if (m.includes('geometr')||m.includes('espiral')||m.includes('vesica')||m.includes('flor de la vida')) return 'La colección «Geometría Sagrada» (2020–2022) incluye «Espiral Áurea» (200×200 cm), «Vesica Piscis» (140×180 cm) y «La Flor de la Vida» (160×160 cm). Abstracción geomética con pan de oro y acrílico.';
      if (m.includes('horizonte') && m.includes('interior')) return '«Horizontes Interiores» (2018–2020) reúne obras como «Memoria del Horizonte» (190×240 cm), «Tierra Callada» y «Umbral». Paisajes interiores al óleo sobre lienzo y tabla.';
      if (m.includes('alba')) return '«Alba sobre el Mar» (130×90 cm, 3.400 €) · Obra vendida. Óleo sobre lienzo. Auroras mediterráneas en tonos rosa pálido y oro suave.';
      if (m.includes('bruma')) return '«Bruma de Otoño» (110×80 cm, 2.700 €) · Obra vendida. Óleo sobre lienzo con trazos verticales fluidos en ocres y grises violáceos.';
      if (m.includes('sombra') && m.includes('luz')) return '«Sombra y Luz V» (100×100 cm, 2.900 €) · Disponible. Acrílico sobre lienzo bastidor museo. Quinta entrega de la sub-serie sobre el dualismo lumínico.';

      // 4. Colecciones / Series del catálogo
      if (m.includes('colecci')||m.includes('serie')) {
        return 'En la web encontrarás: en Inicio, las colecciones «Luz y Sombra», «Geometría Sagrada» y «Horizontes Interiores»; y en Obras disponibles, las series «Horizontes Suspendidos», «Luz de Invierno», «Silencios Urbanos» y «Naturaleza Latente» con 12 piezas originales en venta o consulta.';
      }

      // 5. Estudio, Ubicación, Dirección, Horario y Citas
      if (m.includes('estudio')||m.includes('taller')||m.includes('direcci')||m.includes('ubicaci')||m.includes('dónde')||m.includes('donde')||m.includes('horario')||m.includes('cita')||m.includes('visita')||m.includes('almagro')||m.includes('madrid')||m.includes('chamberí')||m.includes('chamberi')) {
        return 'El estudio está en Calle de Almagro, 24, Chamberí, 28010 Madrid. Horario: Lunes a Viernes de 10:00 a 19:00 h. Sábados: visitas privadas con reserva previa. Reserva cita en index.html#contacto (pestaña «Reservar Cita Previa») o por WhatsApp +34 600 88 99 77.';
      }

      // 6. Contacto directo
      if (m.includes('contacto')||m.includes('whatsapp')||m.includes('teléfono')||m.includes('telefono')||m.includes('correo')||m.includes('email')||m.includes('llamar')||m.includes('escribir')) {
        return 'Puedes contactar con Yana en: 📞 WhatsApp/Teléfono +34 600 88 99 77 (Lunes a Viernes) · ✉️ estudio@yanayavorskaya.com · 📍 Calle de Almagro, 24, Madrid. También desde la sección Contacto del inicio: formulario de consulta o reserva de cita previa. Respuesta en 24–48 horas.';
      }

      // 7. Exposiciones Internacionales
      if (m.includes('exposi')||m.includes('feria')||m.includes('arco')||m.includes('museo')||m.includes('currículum')||m.includes('trayectoria')||m.includes('gagosian')||m.includes('tate')||m.includes('venecia')||m.includes('basel')) {
        return 'Yana ha acumulado más de 40 exposiciones en 15 países: Hauser & Wirth (Londres, 2026), Gagosian Gallery (Nueva York, 2025), Tate Modern (Londres, 2023), Fondation Louis Vuitton (París, 2022), Bienal de Venecia, ARCOmadrid y Art Madrid. Consulta la cronología completa en index.html#exposiciones.';
      }

      // 8. Técnicas y Materiales
      if (m.includes('técnica')||m.includes('tecnica')||m.includes('material')||m.includes('óleo')||m.includes('oleo')||m.includes('acrílico')||m.includes('acrilico')||m.includes('lino')||m.includes('pigmento')||m.includes('marco')||m.includes('cera')) {
        return 'Yana trabaja con lino belga virgen, paneles de abedul, arena de cuarzo, pigmentos minerales, óleo con aceite de linaza y acrílico diluido. Superpone hasta 7 veladuras con largos secados. Enmarca en molduras de roble macizo tipo caja americana. Más detalles en index.html#estudio y en Noticias.';
      }

      // 9. Noticias y Ensayos
      if (m.includes('noticia')||m.includes('blog')||m.includes('ensayo')||m.includes('artículo')||m.includes('articulo')||m.includes('escribe')) {
        return 'En noticias.html hay 15 ensayos editoriales de Yana: «El silencio de los pigmentos», la luz de Velázquez en el Prado, crónicas de ARCO Madrid, Art Madrid y reflexiones sobre el óleo, el lienzo en blanco y el enmarcado museográfico.';
      }

      // 10. Biografía / Sobre Mí
      if (m.includes('bio')||m.includes('quién es')||m.includes('quien es')||m.includes('yana')||m.includes('filosofía')||m.includes('filosofia')||m.includes('artista')) {
        return 'Yana Yavorskaya es pintora contemporánea afincada en Madrid. Su filosofía: «Pintar es un acto de escucha interior en el que la materia, el silencio y el tiempo construyen un puente sensible con quien contempla la obra». Biografía completa en sobre-mi.html.';
      }

      // 11. Envíos y Logística
      if (m.includes('envío')||m.includes('envio')||m.includes('transporte')||m.includes('logística')||m.includes('logistica')||m.includes('país')||m.includes('pais')||m.includes('internacional')) {
        return 'Envíos nacionales e internacionales puerta a puerta con embalaje profesional de madera tratada y seguro a todo riesgo. Cada pieza incluye certificado de autenticidad en papel de lino algodonado firmado a mano por Yana. Los gastos de envío se informan durante la consulta.';
      }

      // 12. Modo museo / inmersivo / favoritos
      if (m.includes('inmersiv')||m.includes('modo museo')||m.includes('favorito')||m.includes('fullscreen')||m.includes('pantalla completa')) {
        return 'Desde index.html#colecciones puedes abrir el «modo inmersivo» para contemplar cada obra a pantalla completa y navegar con las flechas. También puedes marcar obras como favoritas con el botón ☆ en la obra destacada.';
      }

      // 13. Certificado y autenticidad
      if (m.includes('certificado')||m.includes('autentic')||m.includes('original')||m.includes('falsific')) {
        return 'Todas las obras originales del catálogo incluyen certificado de autenticidad firmado a mano por Yana Yavorskaya en papel de lino algodonado. Se entrega con la obra o puede recogerse en el estudio con cita previa.';
      }

      // 14. Encargos y consultas generales
      if (m.includes('encargo')||m.includes('comisión')||m.includes('comision')||m.includes('personaliz')||m.includes('prensa')) {
        return 'Yana acepta encargos personalizados y consultas de prensa/colaboración. Indícalo en el formulario de Contacto (opción «Encargo personalizado» o «Prensa / Colaboración») o escribe a estudio@yanayavorskaya.com.';
      }

      // 15. Reservada / vendida
      if (m.includes('reservad')||m.includes('vendid')) {
        return 'En el catálogo hay obras Disponibles, Reservadas (ej. «Eco de la Memoria») y Vendidas (ej. «El Reposo del Viento», «Bruma de Otoño», «Alba sobre el Mar»). Aunque una pieza esté vendida, puedes consultar obras similares pulsando «Solicitar información» o contactando al estudio.';
      }

      // 16. Agradecimientos
      if (m.includes('gracias')||m.includes('thank')) {
        return 'Gracias a ti por tu interés en el trabajo de Yana. Si necesitas algo más sobre obras, colecciones, visitas o contacto, pregúntame con total libertad.';
      }

      return _('chat.default');
    }

    function addMsg(txt, sender) {
      const d = document.createElement('div');
      d.className = `chat-panel__message chat-panel__message--${sender}`;
      d.textContent = txt;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function sendMsg() {
      const txt = inp?.value.trim();
      if (!txt) return;
      addMsg(txt, 'user');
      if (inp) inp.value = '';
      setTimeout(() => addMsg(reply(txt), 'bot'), 400 + Math.random() * 350);
    }

    tr.onclick = function(e) {
      e.preventDefault(); e.stopPropagation();
      pn.classList.add('is-open'); pn.setAttribute('aria-hidden', 'false');
      if (msgs.children.length === 0) {
        addMsg(_('chat.greeting'), 'bot');
      }
      var su = document.getElementById('scroll-up'); if(su) su.style.setProperty('display', 'none', 'important');
      var ca = document.querySelector('.chat-assistant'); if(ca) ca.style.setProperty('display', 'none', 'important');
    };
    if (cl) cl.onclick = function(e) {
      e.preventDefault(); e.stopPropagation();
      pn.classList.remove('is-open'); pn.setAttribute('aria-hidden', 'true');
      var su = document.getElementById('scroll-up'); if(su) su.style.removeProperty('display');
      var ca = document.querySelector('.chat-assistant'); if(ca) ca.style.removeProperty('display');
    };
    if (snd) snd.onclick = function(e) { e.preventDefault(); sendMsg(); };
    if (inp) inp.onkeydown = function(e) { if (e.key === 'Enter') { e.preventDefault(); sendMsg(); } };
    
    if (qk) {
      qk.querySelectorAll('.chat-panel__quick-reply').forEach(b => {
        b.onclick = function(e) {
          e.preventDefault();
          const msg = b.getAttribute('data-msg');
          addMsg(msg, 'user');
          setTimeout(() => addMsg(reply(msg), 'bot'), 400);
        };
      });
    }
  }

  /* ============ SCROLL UP ============ */
  function setupScrollUp() {
    const btn = document.getElementById('scroll-up');
    if (!btn) return;
    window.addEventListener('scroll', () => { btn.classList.toggle('is-visible', window.scrollY > 180); }, {passive:true});
    btn.addEventListener('click', () => { window.scrollTo({top:0,behavior:'smooth'}); });
  }

  /* ============ GO ============ */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();



/* Room Simulator logic */
window.openRoomSimulator = function(title, sizeStr, imgSrc, price) {
  var modal = document.getElementById('room-modal');
  if (!modal) return;
  document.getElementById('room-artwork-title').textContent = title || 'Obra original';
  document.getElementById('room-artwork-size').textContent = sizeStr ? (sizeStr + ' — ' + (price ? price + ' €' : '')) : '';
  document.getElementById('room-artwork-img').src = imgSrc || '';

  // Parse width and height from sizeStr (e.g. "120 × 120 cm" or "100 × 80 cm")
  var frame = document.getElementById('room-artwork-frame');
  var w = 120, h = 100;
  if (sizeStr) {
    var nums = sizeStr.match(/(\d+)\s*[×xX]\s*(\d+)/);
    if (nums && nums.length === 3) {
      w = parseInt(nums[1], 10);
      h = parseInt(nums[2], 10);
    }
  }
  // Scale: in our 480px height room where 350px = 1.75m (1cm = 2.0px), sofa 440px = 2.20m (1cm = 2.0px)
  var scalePx = 1.95;
  frame.style.width = Math.round(w * scalePx) + 'px';
  frame.style.height = Math.round(h * scalePx) + 'px';

  // Reset to living room scene initially
  var livingBtn = document.querySelector('.room-scene-btn[onclick*="living"]');
  if (livingBtn) switchRoomScene('living', livingBtn);

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
};

window.closeRoomSimulator = function() {
  var modal = document.getElementById('room-modal');
  if (modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }
};

window.switchRoomScene = function(sceneType, btn) {
  document.querySelectorAll('.room-scene-btn').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  
  var container = document.getElementById('room-scene-container');
  var sofa = document.getElementById('room-living-sofa');
  var human = document.getElementById('room-human-silhouette');
  if (!container) return;

  container.className = 'room-scene room-scene--' + sceneType;
  if (sceneType === 'living') {
    if (sofa) sofa.style.display = 'flex';
    if (human) human.style.display = 'none';
  } else if (sceneType === 'gallery') {
    if (sofa) sofa.style.display = 'none';
    if (human) human.style.display = 'flex';
  } else {
    if (sofa) sofa.style.display = 'none';
    if (human) human.style.display = 'none';
  }
};


/* Auto-select artwork in Contact form when navigated with sessionStorage or ?obra=... */
(function() {
  function prefillContactObra() {
    try {
      var obra = null;
      try {
        obra = sessionStorage.getItem('consulta_obra');
        if (obra) sessionStorage.removeItem('consulta_obra');
      } catch(e) {}
      if (!obra) {
        var params = new URLSearchParams(window.location.search);
        obra = params.get('obra');
      }
      if (obra) {
        var sel = document.querySelector('#contacto select');
        if (sel) {
          var found = false;
          for (var i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value.toLowerCase().includes(obra.toLowerCase()) || sel.options[i].text.toLowerCase().includes(obra.toLowerCase())) {
              sel.selectedIndex = i;
              found = true;
              break;
            }
          }
          if (!found) {
            var opt = document.createElement('option');
            opt.value = 'Obra: ' + obra;
            opt.text = 'Información sobre: «' + obra + '»';
            sel.appendChild(opt);
            sel.value = opt.value;
          }
        }
        var msgBox = document.querySelector('#contacto textarea');
        if (msgBox && !msgBox.value) {
          msgBox.value = 'Desearía recibir información sobre la disponibilidad, precio y opciones de envío de la obra original «' + obra + '». Muchas gracias.';
        }
        // Ensure smooth scroll down to #contacto if URL has #contacto
        if (window.location.hash === '#contacto') {
          setTimeout(function() {
            var el = document.getElementById('contacto');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
    } catch(e) {}
  }
  window.addEventListener('DOMContentLoaded', prefillContactObra);
  window.addEventListener('load', prefillContactObra);
})();
