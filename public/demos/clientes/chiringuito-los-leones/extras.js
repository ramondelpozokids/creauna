(function () {
  'use strict';

  const T = {
    es: {
      nav_home: 'Inicio', nav_history: 'Historia', nav_suggestions: 'Sugerencias',
      nav_menu: 'Menú', nav_wines: 'Vinos', nav_cocktails: 'Cócteles',
      nav_reserve: 'Reservas', nav_contact: 'Contacto',
      hero_subtitle: 'Lo mejor del mar en tu mesa',
      about_title: 'Tradición y Modernidad', about_subtitle: '60 años de cocina e historia',
      about_text: 'Cuatro generaciones criadas entre arena, sol y playa y el mejor pescado de la Costa del Sol. Un negocio que vivió los años de oro de Torremolinos y se convirtió en un referente histórico reconocido en la costa del sol por sus años de trayectoria repleta de recuerdos.',
      suggestions_title: 'Sugerencias del Día', suggestions_subtitle: 'Productos frescos del mercado',
      menu_title: 'Nuestra Carta', menu_subtitle: 'Lo mejor de la gastronomía mediterránea',
      wines_title: 'Carta de Vinos', wines_subtitle: 'Selección de los mejores caldos',
      cocktails_title: 'Carta de Cócteles', cocktails_subtitle: 'Refrescantes combinados para disfrutar',
      gallery_title: 'Galería',
      contact_title: 'Contacto', contact_subtitle: 'Estamos aquí para ti',
      contact_address: 'Dirección', contact_phone: 'Teléfono', contact_email: 'Email', contact_hours: 'Horario',
      contact_hours_text: 'Abierto todos los días\nDe 10:00 a 00:00 horas',
      contact_form_title: 'Envíanos un mensaje',
      form_name: 'Nombre *', form_email: 'Email *', form_phone: 'Teléfono', form_message: 'Mensaje *',
      form_send: 'Enviar mensaje',
      reserve_title: 'Reserva de Mesa', reserve_subtitle: 'Asegura tu mesa frente al mar',
      reserve_intro: 'Reserva fácilmente tu mesa en Chiringuito Los Leones. Te confirmaremos la reserva lo antes posible.',
      reserve_li1: 'Horario de cocina: 12:00 – 23:30',
      reserve_li2: 'Grupos de más de 10 personas: llámanos al +34 952 37 43 13',
      reserve_li3: 'En temporada alta recomendamos reservar con antelación',
      reserve_name: 'Nombre *', reserve_email: 'Email *', reserve_phone: 'Teléfono *',
      reserve_date: 'Fecha *', reserve_time: 'Hora *', reserve_guests: 'Personas *',
      reserve_notes: 'Notas / alergias', reserve_submit: 'Solicitar reserva',
      reserve_note: 'Recibirás confirmación por teléfono o email. No es una reserva automática definitiva.',
      reserve_ok: '¡Solicitud enviada! Te contactaremos para confirmar tu mesa.',
      contact_ok: '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.',
      footer_legal: 'Aviso Legal', footer_privacy: 'Política de Privacidad',
      footer_cookies: 'Cookies', footer_sitemap: 'Mapa del Sitio',
      footer_copy: '© 2024 Chiringuito Los Leones - Desde 1962. Todos los derechos reservados.',
      scroll_top: 'Volver arriba',
      chat_title: 'Asistente Los Leones',
      chat_welcome: '¡Hola! Soy el asistente de Chiringuito Los Leones. ¿En qué puedo ayudarte?',
      chat_placeholder: 'Escribe tu pregunta...',
      chat_send: 'Enviar',
      chat_q_hours: 'Horario',
      chat_q_address: 'Dirección',
      chat_q_reserve: 'Reservar mesa',
      chat_q_menu: 'Carta',
      chat_q_parking: 'Aparcamiento',
      chat_a_hours: 'Abrimos todos los días de 10:00 a 00:00. Cocina aproximadamente de 12:00 a 23:30.',
      chat_a_address: 'Estamos en el Paseo Marítimo de la Carihuela, c/ Nerja s/n, 29620 Torremolinos (Málaga).',
      chat_a_reserve: 'Puedes reservar en la sección Reservas de esta web (fecha, hora y personas) o llamando al +34 952 37 43 13.',
      chat_a_menu: 'Tenemos sugerencias del día, carta de pescados y mariscos, vinos y cócteles. Usa el menú superior para verlas.',
      chat_a_parking: 'Hay aparcamiento en la zona de La Carihuela y paseo marítimo. En temporada alta conviene llegar con tiempo.',
      chat_a_default: 'Puedo ayudarte con horario, dirección, reservas, carta o aparcamiento. También puedes escribir a losleonesplaya@gmail.com o llamar al +34 952 37 43 13.',
      page_legal_back: '← Volver al inicio',
      page_sitemap_title: 'MAPA DEL SITIO'
    },
    en: {
      nav_home: 'Home', nav_history: 'History', nav_suggestions: 'Suggestions',
      nav_menu: 'Menu', nav_wines: 'Wines', nav_cocktails: 'Cocktails',
      nav_reserve: 'Book a table', nav_contact: 'Contact',
      hero_subtitle: 'The best of the sea on your table',
      about_title: 'Tradition and Modernity', about_subtitle: '60 years of cuisine and history',
      about_text: 'Four generations raised between sand, sun and beach and the best fish on the Costa del Sol. A business that lived through the golden years of Torremolinos and became a historical reference recognized on the Costa del Sol for its years of trajectory full of memories.',
      suggestions_title: 'Daily Suggestions', suggestions_subtitle: 'Fresh market products',
      menu_title: 'Our Menu', menu_subtitle: 'The best of Mediterranean cuisine',
      wines_title: 'Wine List', wines_subtitle: 'A selection of fine wines',
      cocktails_title: 'Cocktail Menu', cocktails_subtitle: 'Refreshing mixed drinks to enjoy',
      gallery_title: 'Gallery',
      contact_title: 'Contact', contact_subtitle: 'We are here for you',
      contact_address: 'Address', contact_phone: 'Phone', contact_email: 'Email', contact_hours: 'Hours',
      contact_hours_text: 'Open every day\nFrom 10:00 to 00:00',
      contact_form_title: 'Send us a message',
      form_name: 'Name *', form_email: 'Email *', form_phone: 'Phone', form_message: 'Message *',
      form_send: 'Send message',
      reserve_title: 'Table Reservation', reserve_subtitle: 'Secure your table by the sea',
      reserve_intro: 'Easily book your table at Chiringuito Los Leones. We will confirm as soon as possible.',
      reserve_li1: 'Kitchen hours: 12:00 – 23:30',
      reserve_li2: 'Groups larger than 10: please call +34 952 37 43 13',
      reserve_li3: 'In high season we recommend booking in advance',
      reserve_name: 'Name *', reserve_email: 'Email *', reserve_phone: 'Phone *',
      reserve_date: 'Date *', reserve_time: 'Time *', reserve_guests: 'Guests *',
      reserve_notes: 'Notes / allergies', reserve_submit: 'Request booking',
      reserve_note: 'You will receive confirmation by phone or email. This is not an automatic final booking.',
      reserve_ok: 'Request sent! We will contact you to confirm your table.',
      contact_ok: 'Message sent! We will get back to you soon.',
      footer_legal: 'Legal Notice', footer_privacy: 'Privacy Policy',
      footer_cookies: 'Cookies', footer_sitemap: 'Sitemap',
      footer_copy: '© 2024 Chiringuito Los Leones - Since 1962. All rights reserved.',
      scroll_top: 'Back to top',
      chat_title: 'Los Leones Assistant',
      chat_welcome: 'Hello! I am the Chiringuito Los Leones assistant. How can I help you?',
      chat_placeholder: 'Type your question...',
      chat_send: 'Send',
      chat_q_hours: 'Opening hours',
      chat_q_address: 'Address',
      chat_q_reserve: 'Book a table',
      chat_q_menu: 'Menu',
      chat_q_parking: 'Parking',
      chat_a_hours: 'We are open every day from 10:00 to 00:00. Kitchen roughly from 12:00 to 23:30.',
      chat_a_address: 'We are at Paseo Marítimo de la Carihuela, c/ Nerja s/n, 29620 Torremolinos (Málaga).',
      chat_a_reserve: 'Book in the Reservations section on this website (date, time and guests) or call +34 952 37 43 13.',
      chat_a_menu: 'We offer daily suggestions, seafood and fish, wines and cocktails. Use the top menu to browse.',
      chat_a_parking: 'There is parking around La Carihuela and the promenade. In high season arrive early.',
      chat_a_default: 'I can help with hours, address, bookings, menu or parking. You can also email losleonesplaya@gmail.com or call +34 952 37 43 13.',
      page_legal_back: '← Back to home',
      page_sitemap_title: 'SITEMAP'
    },
    fr: {
      nav_home: 'Accueil', nav_history: 'Histoire', nav_suggestions: 'Suggestions',
      nav_menu: 'Menu', nav_wines: 'Vins', nav_cocktails: 'Cocktails',
      nav_reserve: 'Réservation', nav_contact: 'Contact',
      hero_subtitle: 'Le meilleur de la mer sur votre table',
      about_title: 'Tradition et Modernité', about_subtitle: '60 ans de cuisine et d\'histoire',
      about_text: 'Quatre générations élevées entre sable, soleil et plage et le meilleur poisson de la Costa del Sol. Une entreprise qui a vécu les années dorées de Torremolinos et est devenue une référence historique reconnue sur la Costa del Sol pour ses années de trajectoire pleine de souvenirs.',
      suggestions_title: 'Suggestions du jour', suggestions_subtitle: 'Produits frais du marché',
      menu_title: 'Notre carte', menu_subtitle: 'Le meilleur de la cuisine méditerranéenne',
      wines_title: 'Carte des vins', wines_subtitle: 'Une sélection de grands vins',
      cocktails_title: 'Carte des cocktails', cocktails_subtitle: 'Cocktails rafraîchissants à savourer',
      gallery_title: 'Galerie',
      contact_title: 'Contact', contact_subtitle: 'Nous sommes là pour vous',
      contact_address: 'Adresse', contact_phone: 'Téléphone', contact_email: 'Email', contact_hours: 'Horaires',
      contact_hours_text: 'Ouvert tous les jours\nDe 10:00 à 00:00',
      contact_form_title: 'Envoyez-nous un message',
      form_name: 'Nom *', form_email: 'Email *', form_phone: 'Téléphone', form_message: 'Message *',
      form_send: 'Envoyer',
      reserve_title: 'Réservation de table', reserve_subtitle: 'Réservez votre table face à la mer',
      reserve_intro: 'Réservez facilement votre table au Chiringuito Los Leones. Nous confirmerons dès que possible.',
      reserve_li1: 'Cuisine : 12:00 – 23:30',
      reserve_li2: 'Groupes de plus de 10 personnes : appelez le +34 952 37 43 13',
      reserve_li3: 'En haute saison, réservez à l\'avance',
      reserve_name: 'Nom *', reserve_email: 'Email *', reserve_phone: 'Téléphone *',
      reserve_date: 'Date *', reserve_time: 'Heure *', reserve_guests: 'Personnes *',
      reserve_notes: 'Notes / allergies', reserve_submit: 'Demander une réservation',
      reserve_note: 'Vous recevrez une confirmation par téléphone ou email. Ce n\'est pas une réservation automatique définitive.',
      reserve_ok: 'Demande envoyée ! Nous vous contacterons pour confirmer.',
      contact_ok: 'Message envoyé ! Nous vous répondrons bientôt.',
      footer_legal: 'Mentions légales', footer_privacy: 'Confidentialité',
      footer_cookies: 'Cookies', footer_sitemap: 'Plan du site',
      footer_copy: '© 2024 Chiringuito Los Leones - Depuis 1962. Tous droits réservés.',
      scroll_top: 'Haut de page',
      chat_title: 'Assistant Los Leones',
      chat_welcome: 'Bonjour ! Je suis l\'assistant de Chiringuito Los Leones. Comment puis-je vous aider ?',
      chat_placeholder: 'Écrivez votre question...',
      chat_send: 'Envoyer',
      chat_q_hours: 'Horaires',
      chat_q_address: 'Adresse',
      chat_q_reserve: 'Réserver',
      chat_q_menu: 'Carte',
      chat_q_parking: 'Parking',
      chat_a_hours: 'Ouvert tous les jours de 10:00 à 00:00. Cuisine environ de 12:00 à 23:30.',
      chat_a_address: 'Paseo Marítimo de la Carihuela, c/ Nerja s/n, 29620 Torremolinos (Málaga).',
      chat_a_reserve: 'Réservez dans la section Réservation de ce site (date, heure, personnes) ou appelez le +34 952 37 43 13.',
      chat_a_menu: 'Suggestions du jour, poissons et fruits de mer, vins et cocktails. Utilisez le menu du haut.',
      chat_a_parking: 'Parking autour de La Carihuela et du promenade. En haute saison, arrivez tôt.',
      chat_a_default: 'Je peux aider pour horaires, adresse, réservations, carte ou parking. Email : losleonesplaya@gmail.com / tél. +34 952 37 43 13.',
      page_legal_back: '← Retour à l\'accueil',
      page_sitemap_title: 'PLAN DU SITE'
    },
    de: {
      nav_home: 'Startseite', nav_history: 'Geschichte', nav_suggestions: 'Vorschläge',
      nav_menu: 'Speisekarte', nav_wines: 'Weine', nav_cocktails: 'Cocktails',
      nav_reserve: 'Reservierung', nav_contact: 'Kontakt',
      hero_subtitle: 'Das Beste vom Meer auf Ihrem Tisch',
      about_title: 'Tradition und Moderne', about_subtitle: '60 Jahre Küche und Geschichte',
      about_text: 'Vier Generationen aufgewachsen zwischen Sand, Sonne und Strand und dem besten Fisch der Costa del Sol. Ein Unternehmen, das die goldenen Jahre von Torremolinos miterlebt hat und zu einer historischen Referenz auf der Costa del Sol geworden ist.',
      suggestions_title: 'Tagesvorschläge', suggestions_subtitle: 'Frische Marktprodukte',
      menu_title: 'Unsere Speisekarte', menu_subtitle: 'Das Beste der mediterranen Küche',
      wines_title: 'Weinkarte', wines_subtitle: 'Eine Auswahl feiner Weine',
      cocktails_title: 'Cocktailkarte', cocktails_subtitle: 'Erfrischende Mixgetränke zum Genießen',
      gallery_title: 'Galerie',
      contact_title: 'Kontakt', contact_subtitle: 'Wir sind für Sie da',
      contact_address: 'Adresse', contact_phone: 'Telefon', contact_email: 'E-Mail', contact_hours: 'Öffnungszeiten',
      contact_hours_text: 'Täglich geöffnet\nVon 10:00 bis 00:00 Uhr',
      contact_form_title: 'Nachricht senden',
      form_name: 'Name *', form_email: 'E-Mail *', form_phone: 'Telefon', form_message: 'Nachricht *',
      form_send: 'Senden',
      reserve_title: 'Tischreservierung', reserve_subtitle: 'Sichern Sie sich Ihren Tisch am Meer',
      reserve_intro: 'Reservieren Sie einfach Ihren Tisch im Chiringuito Los Leones. Wir bestätigen so schnell wie möglich.',
      reserve_li1: 'Küche: 12:00 – 23:30',
      reserve_li2: 'Gruppen über 10 Personen: bitte +34 952 37 43 13 anrufen',
      reserve_li3: 'In der Hochsaison bitte frühzeitig reservieren',
      reserve_name: 'Name *', reserve_email: 'E-Mail *', reserve_phone: 'Telefon *',
      reserve_date: 'Datum *', reserve_time: 'Uhrzeit *', reserve_guests: 'Personen *',
      reserve_notes: 'Notizen / Allergien', reserve_submit: 'Reservierung anfragen',
      reserve_note: 'Sie erhalten eine Bestätigung per Telefon oder E-Mail. Keine automatische Endgültige Reservierung.',
      reserve_ok: 'Anfrage gesendet! Wir melden uns zur Bestätigung.',
      contact_ok: 'Nachricht gesendet! Wir melden uns bald.',
      footer_legal: 'Impressum', footer_privacy: 'Datenschutz',
      footer_cookies: 'Cookies', footer_sitemap: 'Seitenübersicht',
      footer_copy: '© 2024 Chiringuito Los Leones - Seit 1962. Alle Rechte vorbehalten.',
      scroll_top: 'Nach oben',
      chat_title: 'Assistent Los Leones',
      chat_welcome: 'Hallo! Ich bin der Assistent von Chiringuito Los Leones. Wie kann ich helfen?',
      chat_placeholder: 'Ihre Frage...',
      chat_send: 'Senden',
      chat_q_hours: 'Öffnungszeiten',
      chat_q_address: 'Adresse',
      chat_q_reserve: 'Tisch reservieren',
      chat_q_menu: 'Speisekarte',
      chat_q_parking: 'Parken',
      chat_a_hours: 'Täglich geöffnet von 10:00 bis 00:00. Küche etwa von 12:00 bis 23:30.',
      chat_a_address: 'Paseo Marítimo de la Carihuela, c/ Nerja s/n, 29620 Torremolinos (Málaga).',
      chat_a_reserve: 'Reservieren Sie im Bereich Reservierung (Datum, Uhrzeit, Personen) oder rufen Sie +34 952 37 43 13 an.',
      chat_a_menu: 'Tagesvorschläge, Fisch und Meeresfrüchte, Weine und Cocktails. Nutzen Sie das Menü oben.',
      chat_a_parking: 'Parkplätze rund um La Carihuela und die Promenade. In der Hochsaison früh kommen.',
      chat_a_default: 'Ich helfe bei Zeiten, Adresse, Reservierung, Karte oder Parken. E-Mail: losleonesplaya@gmail.com / Tel. +34 952 37 43 13.',
      page_legal_back: '← Zur Startseite',
      page_sitemap_title: 'SEITENÜBERSICHT'
    }
  };

  let currentLang = localStorage.getItem('ll_lang') || 'es';

  function t(key) {
    return (T[currentLang] && T[currentLang][key]) || (T.es && T.es[key]) || key;
  }

  function applyI18n(lang) {
    currentLang = lang;
    localStorage.setItem('ll_lang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    const dict = Object.assign({}, T[lang] || {}, (window.MENU_I18N && window.MENU_I18N[lang]) || {});

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] != null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.innerHTML = String(dict[key]).replace(/\n/g, '<br>');
        }
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key]) el.placeholder = dict[key];
    });
    const scrollBtn = document.getElementById('scroll-top');
    if (scrollBtn) {
      scrollBtn.title = t('scroll_top');
      scrollBtn.setAttribute('aria-label', t('scroll_top'));
    }
    document.querySelectorAll('.languages').forEach(el => {
      el.style.display = lang === 'es' ? '' : 'none';
    });
    refreshChatUI();
  }

  window.LL = { T, t, applyI18n, getLang: () => currentLang };

  function answerFor(text) {
    const q = (text || '').toLowerCase();
    if (/hora|horario|ouvert|open|öffnungs|hours|horaire/.test(q)) return t('chat_a_hours');
    if (/direc|address|adresse|ubicación|ubi|wo\b|location|carihuela|torremolinos/.test(q)) return t('chat_a_address');
    if (/reserv|book|mesa|table|tisch/.test(q)) return t('chat_a_reserve');
    if (/carta|menu|menú|speise|wein|wine|cocktail|cóctel/.test(q)) return t('chat_a_menu');
    if (/park|aparca|parking|parken/.test(q)) return t('chat_a_parking');
    return t('chat_a_default');
  }

  function addBubble(text, who) {
    const box = document.getElementById('chat-messages');
    if (!box) return;
    const div = document.createElement('div');
    div.className = 'chat-bubble ' + who;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function refreshChatUI() {
    const title = document.getElementById('chat-title');
    if (title) title.textContent = t('chat_title');
    const input = document.getElementById('chat-input');
    if (input) input.placeholder = t('chat_placeholder');
    const send = document.getElementById('chat-send');
    if (send) send.textContent = t('chat_send');
    const sugg = document.getElementById('chat-suggestions');
    if (sugg) {
      sugg.innerHTML = '';
      [
        ['chat_q_hours', 'chat_a_hours'],
        ['chat_q_address', 'chat_a_address'],
        ['chat_q_reserve', 'chat_a_reserve'],
        ['chat_q_menu', 'chat_a_menu'],
        ['chat_q_parking', 'chat_a_parking']
      ].forEach(([qk, ak]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = t(qk);
        b.addEventListener('click', () => {
          addBubble(t(qk), 'user');
          addBubble(t(ak), 'bot');
        });
        sugg.appendChild(b);
      });
    }
  }

  function initChat() {
    const toggle = document.getElementById('chat-toggle');
    const panel = document.getElementById('chat-panel');
    const close = document.getElementById('chat-close');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    if (!toggle || !panel) return;

    let welcomed = false;
    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open') && !welcomed) {
        addBubble(t('chat_welcome'), 'bot');
        welcomed = true;
        refreshChatUI();
      }
    });
    if (close) close.addEventListener('click', () => panel.classList.remove('open'));
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = (input.value || '').trim();
        if (!val) return;
        addBubble(val, 'user');
        input.value = '';
        setTimeout(() => addBubble(answerFor(val), 'bot'), 250);
      });
    }
    refreshChatUI();
  }

  function initReserve() {
    const form = document.getElementById('reserve-form');
    const date = document.getElementById('reserve-date');
    if (date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      date.min = `${yyyy}-${mm}-${dd}`;
    }
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const summary =
        `${data.get('name')} | ${data.get('date')} ${data.get('time')} | ${data.get('guests')} pax | ${data.get('phone')}`;
      alert(t('reserve_ok') + '\n\n' + summary);
      form.reset();
      if (date) {
        const today = new Date();
        date.min = today.toISOString().slice(0, 10);
      }
    });
  }

  function initLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        applyI18n(this.dataset.lang);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLangButtons();
    applyI18n(currentLang);
    initChat();
    initReserve();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert(t('contact_ok'));
        this.reset();
      });
    }
  });
})();
