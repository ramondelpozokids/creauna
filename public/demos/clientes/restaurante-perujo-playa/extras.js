(function () {
  'use strict';

  const T = {
    es: {
      nav_home: 'Inicio', nav_history: 'Historia', nav_menu: 'Menú',
      nav_gallery: 'Galería', nav_reserve: 'Reservas', nav_contact: 'Contacto',
      hero_subtitle: 'Sabores del Mediterráneo frente al mar',
      hero_cta_reserve: 'Reservar mesa', hero_cta_menu: 'Ver carta',
      about_title: 'La esencia de la cocina marinera malagueña', about_subtitle: 'De Benalmádena a primera línea en Torremolinos',
      about_text: 'Tras una exitosa trayectoria con Marisquería Perujo en Arroyo de la Miel, Antonio Perujo abre Perujo Playa en el paseo marítimo de La Carihuela, frente al Hotel Pez Espada: el mejor marisco y pescado, servicio cercano y un espacio elegante y luminoso a pie de playa. Abiertos también en invierno.',
      menu_title: 'Nuestra Carta', menu_subtitle: 'Pescados, carnes, arroces y guisos',
      gallery_eyebrow: 'Cocina en la mesa', gallery_title: 'Galería', gallery_subtitle: 'Solo platos: arroces, marisco y pescado de La Carihuela',
      contact_title: 'Contacto', contact_subtitle: 'Estamos aquí para ti',
      contact_address: 'Dirección', contact_phone: 'Teléfono', contact_email: 'Email', contact_hours: 'Horario',
      contact_hours_text: 'Abierto todos los días\nCocina orientativa: 12:00 – 23:00\nConsulte por teléfono',
      contact_form_title: 'Envíanos un mensaje',
      form_name: 'Nombre *', form_email: 'Email *', form_phone: 'Teléfono', form_message: 'Mensaje *',
      form_send: 'Enviar mensaje',
      reserve_title: 'Reserva de Mesa', reserve_subtitle: 'Asegura tu mesa frente al mar',
      reserve_intro: 'Reserva fácilmente tu mesa en Restaurante Perujo Playa. Te confirmaremos la reserva lo antes posible.',
      reserve_li1: 'Horario de cocina orientativo: 12:00 – 23:00 (consulte por teléfono)',
      reserve_li2: 'Grupos de más de 10 personas: llámanos al +34 623 45 50 92',
      reserve_li3: 'En temporada alta recomendamos reservar con antelación',
      reserve_name: 'Nombre *', reserve_email: 'Email *', reserve_phone: 'Teléfono *',
      reserve_date: 'Fecha *', reserve_time: 'Hora *', reserve_guests: 'Personas *',
      reserve_notes: 'Notas / alergias', reserve_submit: 'Solicitar reserva',
      reserve_whatsapp: 'Reservar por WhatsApp',
      reserve_note: 'Recibirás confirmación por teléfono o email. No es una reserva automática definitiva.',
      reserve_ok: '¡Solicitud enviada! Te contactaremos para confirmar tu mesa.',
      reserve_wa_missing: 'Completa nombre, teléfono, fecha, hora y personas para enviar la reserva por WhatsApp.',
      contact_ok: '¡Mensaje enviado! Nos pondremos en contacto contigo pronto.',
      footer_legal: 'Aviso Legal', footer_privacy: 'Política de Privacidad',
      footer_cookies: 'Cookies', footer_sitemap: 'Mapa del Sitio',
      footer_copy: '© 2026 Restaurante Perujo Playa. Todos los derechos reservados.',
      scroll_top: 'Volver arriba',
      chat_title: 'Asistente Perujo Playa',
      chat_welcome: '¡Hola! Soy el asistente de Restaurante Perujo Playa. ¿En qué puedo ayudarte?',
      chat_placeholder: 'Escribe tu pregunta...',
      chat_send: 'Enviar',
      chat_q_hours: 'Horario',
      chat_q_address: 'Dirección',
      chat_q_reserve: 'Reservar mesa',
      chat_q_menu: 'Carta',
      chat_q_parking: 'Aparcamiento',
      chat_a_hours: 'Abrimos todos los días. Cocina orientativa de 12:00 a 23:00. Para confirmar horario del día, llámanos al +34 623 45 50 92.',
      chat_a_address: 'Estamos en el Paseo Marítimo de la Carihuela, frente al Hotel Pez Espada, 29620 Torremolinos (Málaga).',
      chat_a_reserve: 'Puedes reservar en la sección Reservas de esta web o por WhatsApp/teléfono al +34 623 45 50 92.',
      chat_a_menu: 'Tenemos pescados y mariscos, carnes, arroces y guisos. Consulta la sección Menú de esta web.',
      chat_a_parking: 'Hay aparcamiento en la zona del paseo marítimo de Torremolinos. En temporada alta conviene llegar con tiempo.',
      chat_a_default: 'Puedo ayudarte con horario, dirección, reservas, carta o aparcamiento. También puedes llamar o escribir por WhatsApp al +34 623 45 50 92.',
      page_legal_back: '← Volver al inicio',
      page_sitemap_title: 'MAPA DEL SITIO',
      wa_label: 'WhatsApp',
      press_eyebrow: 'En la prensa',
      press_title: 'Perujo Playa en Diario SUR',
      press_text: '«La esencia de la cocina marinera malagueña»: el reportaje sobre Antonio Perujo y su nueva etapa en La Carihuela.',
      press_cta: 'Leer el artículo →',
      press_aside: 'Escenario de la final de la VIII Ruta del Espeto · Sabor a Málaga',
      ambient_on: 'Activar ambiente',
      ambient_off: 'Desactivar ambiente',
      ambient_title: 'Música ambiente',
      hero_scroll: 'Descubre',
      about_eyebrow: 'Antonio Perujo · La Carihuela',
      about_cta: 'Reservar tu mesa →',
      exp_sea_title: 'Frente al mar',
      exp_sea_text: 'Primera línea en La Carihuela: brisa, horizonte y mesa con vistas.',
      exp_food_title: 'Cocina de costa',
      exp_food_text: 'Pescado, marisco, arroces y carnes con producto fresco del día.',
      exp_terrace_title: 'Terraza y ambiente',
      exp_terrace_text: 'Un espacio abierto al paseo marítimo para comer sin prisas.',
      spot_eyebrow: 'Lo que nos pide la mesa',
      spot_title: 'Platos que saben a Costa del Sol',
      spot_subtitle: 'Arroces, marisco y especialidades para compartir frente al mar',
      spot_1_title: 'Paellas y arroces',
      spot_1_text: 'Mixta, mariscos y caldosos para dos',
      spot_2_title: 'Mariscos',
      spot_2_text: 'Mejillones, almejas y sabores de bahía',
      spot_3_title: 'Pescado fresco',
      spot_3_text: 'Del día a la mesa, sin rodeos',
      spot_cta: 'Explorar la carta completa',
      reviews_eyebrow: 'Lo que cuentan quienes nos visitan',
      reviews_title: 'Momentos frente al mar',
      review_1_text: '«Terraza con vistas al mar, buen ritmo y platos que saben a Costa del Sol. Ideal para una comida sin prisas.»',
      review_1_author: 'Visitante · Google',
      review_2_text: '«Arroces para compartir, marisco fresco y un servicio cercano. Volveremos con la familia.»',
      review_2_author: 'Visitante · TripAdvisor',
      review_3_text: '«En La Carihuela, Perujo Playa es una mesa segura: ambiente, producto y el Mediterráneo de fondo.»',
      review_3_author: 'Visitante · Instagram',
      vibe_title: 'Tu mesa te espera frente al Mediterráneo',
      vibe_text: 'Reserva por WhatsApp o en la web y ven a disfrutar de La Carihuela.',
      vibe_cta_reserve: 'Reservar ahora',
      vibe_cta_wa: 'WhatsApp'
    },
    en: {
      nav_home: 'Home', nav_history: 'History', nav_menu: 'Menu',
      nav_gallery: 'Gallery', nav_reserve: 'Book a table', nav_contact: 'Contact',
      hero_subtitle: 'Mediterranean flavours by the sea',
      hero_cta_reserve: 'Book a table', hero_cta_menu: 'View menu',
      about_title: 'The essence of Málaga seafood cooking', about_subtitle: 'From Benalmádena to the seafront in Torremolinos',
      about_text: 'After a successful run with Marisquería Perujo in Arroyo de la Miel, Antonio Perujo opens Perujo Playa on La Carihuela promenade, opposite Hotel Pez Espada: top seafood and fish, warm professional service and an elegant, bright space by the beach — open in winter too.',
      menu_title: 'Our Menu', menu_subtitle: 'Fish, meats, rice and stews',
      gallery_eyebrow: 'On the plate', gallery_title: 'Gallery', gallery_subtitle: 'Dishes only: rice, seafood and fish from La Carihuela',
      contact_title: 'Contact', contact_subtitle: 'We are here for you',
      contact_address: 'Address', contact_phone: 'Phone', contact_email: 'Email', contact_hours: 'Hours',
      contact_hours_text: 'Open every day\nKitchen approx. 12:00 – 23:00\nPlease confirm by phone',
      contact_form_title: 'Send us a message',
      form_name: 'Name *', form_email: 'Email *', form_phone: 'Phone', form_message: 'Message *',
      form_send: 'Send message',
      reserve_title: 'Table Reservation', reserve_subtitle: 'Secure your table by the sea',
      reserve_intro: 'Easily book your table at Restaurante Perujo Playa. We will confirm as soon as possible.',
      reserve_li1: 'Kitchen hours (approx.): 12:00 – 23:00 (please confirm by phone)',
      reserve_li2: 'Groups larger than 10: please call +34 623 45 50 92',
      reserve_li3: 'In high season we recommend booking in advance',
      reserve_name: 'Name *', reserve_email: 'Email *', reserve_phone: 'Phone *',
      reserve_date: 'Date *', reserve_time: 'Time *', reserve_guests: 'Guests *',
      reserve_notes: 'Notes / allergies', reserve_submit: 'Request booking',
      reserve_whatsapp: 'Book via WhatsApp',
      reserve_note: 'You will receive confirmation by phone or email. This is not an automatic final booking.',
      reserve_ok: 'Request sent! We will contact you to confirm your table.',
      reserve_wa_missing: 'Please fill name, phone, date, time and guests to send the booking via WhatsApp.',
      contact_ok: 'Message sent! We will get back to you soon.',
      footer_legal: 'Legal Notice', footer_privacy: 'Privacy Policy',
      footer_cookies: 'Cookies', footer_sitemap: 'Sitemap',
      footer_copy: '© 2026 Restaurante Perujo Playa. All rights reserved.',
      scroll_top: 'Back to top',
      chat_title: 'Perujo Playa Assistant',
      chat_welcome: 'Hello! I am the Restaurante Perujo Playa assistant. How can I help you?',
      chat_placeholder: 'Type your question...',
      chat_send: 'Send',
      chat_q_hours: 'Opening hours',
      chat_q_address: 'Address',
      chat_q_reserve: 'Book a table',
      chat_q_menu: 'Menu',
      chat_q_parking: 'Parking',
      chat_a_hours: 'We are open every day. Kitchen roughly from 12:00 to 23:00. Please call +34 623 45 50 92 to confirm.',
      chat_a_address: 'We are on Paseo Marítimo de la Carihuela, opposite Hotel Pez Espada, 29620 Torremolinos (Málaga).',
      chat_a_reserve: 'Book in the Reservations section on this website or via WhatsApp/phone at +34 623 45 50 92.',
      chat_a_menu: 'We offer fish and seafood, meats, rice dishes and stews. See the Menu section on this site.',
      chat_a_parking: 'There is parking around the Torremolinos promenade. In high season arrive early.',
      chat_a_default: 'I can help with hours, address, bookings, menu or parking. You can also call or WhatsApp +34 623 45 50 92.',
      page_legal_back: '← Back to home',
      page_sitemap_title: 'SITEMAP',
      wa_label: 'WhatsApp',
      press_eyebrow: 'In the press',
      press_title: 'Perujo Playa in Diario SUR',
      press_text: '«The essence of Málaga seafood cooking»: the feature on Antonio Perujo and his new chapter in La Carihuela.',
      press_cta: 'Read the article →',
      press_aside: 'Host of the VIII Ruta del Espeto final · Sabor a Málaga',
      ambient_on: 'Turn on ambience',
      ambient_off: 'Turn off ambience',
      ambient_title: 'Ambient music',
      hero_scroll: 'Discover',
      about_eyebrow: 'Antonio Perujo · La Carihuela',
      about_cta: 'Book your table →',
      exp_sea_title: 'By the sea',
      exp_sea_text: 'Front line in La Carihuela: breeze, horizon and a table with views.',
      exp_food_title: 'Coastal cooking',
      exp_food_text: 'Fish, seafood, rice dishes and meats with fresh daily produce.',
      exp_terrace_title: 'Terrace & atmosphere',
      exp_terrace_text: 'An open space on the promenade for unhurried meals.',
      spot_eyebrow: 'What the table asks for',
      spot_title: 'Dishes that taste like the Costa del Sol',
      spot_subtitle: 'Rice, seafood and specialties to share by the sea',
      spot_1_title: 'Paellas & rice',
      spot_1_text: 'Mixed, seafood and brothy rice for two',
      spot_2_title: 'Seafood',
      spot_2_text: 'Mussels, clams and bay flavours',
      spot_3_title: 'Fresh fish',
      spot_3_text: 'From the day to the table',
      spot_cta: 'Explore the full menu',
      reviews_eyebrow: 'What guests say',
      reviews_title: 'Moments by the sea',
      review_1_text: '«Terrace with sea views, good pace and dishes that taste like the Costa del Sol.»',
      review_1_author: 'Guest · Google',
      review_2_text: '«Rice dishes to share, fresh seafood and warm service. We will be back with the family.»',
      review_2_author: 'Guest · TripAdvisor',
      review_3_text: '«In La Carihuela, Perujo Playa is a safe bet: atmosphere, produce and the Mediterranean behind.»',
      review_3_author: 'Guest · Instagram',
      vibe_title: 'Your table awaits by the Mediterranean',
      vibe_text: 'Book via WhatsApp or on the website and enjoy La Carihuela.',
      vibe_cta_reserve: 'Book now',
      vibe_cta_wa: 'WhatsApp'
    },
    fr: {
      nav_home: 'Accueil', nav_history: 'Histoire', nav_menu: 'Menu',
      nav_gallery: 'Galerie', nav_reserve: 'Réservation', nav_contact: 'Contact',
      hero_subtitle: 'Saveurs méditerranéennes face à la mer',
      hero_cta_reserve: 'Réserver', hero_cta_menu: 'Voir la carte',
      about_title: 'L\'essence de la cuisine maritime de Málaga', about_subtitle: 'De Benalmádena au front de mer à Torremolinos',
      about_text: 'Après le succès de Marisquería Perujo à Arroyo de la Miel, Antonio Perujo ouvre Perujo Playa sur la promenade de La Carihuela, face à l\'Hôtel Pez Espada : fruits de mer et poissons d\'excellence, service chaleureux et un espace élégant et lumineux au bord de la plage. Ouvert aussi en hiver.',
      menu_title: 'Notre carte', menu_subtitle: 'Poissons, viandes, riz et ragoûts',
      gallery_eyebrow: 'À table', gallery_title: 'Galerie', gallery_subtitle: 'Uniquement les plats : riz, fruits de mer et poissons',
      contact_title: 'Contact', contact_subtitle: 'Nous sommes là pour vous',
      contact_address: 'Adresse', contact_phone: 'Téléphone', contact_email: 'Email', contact_hours: 'Horaires',
      contact_hours_text: 'Ouvert tous les jours\nCuisine indicative : 12:00 – 23:00\nConfirmez par téléphone',
      contact_form_title: 'Envoyez-nous un message',
      form_name: 'Nom *', form_email: 'Email *', form_phone: 'Téléphone', form_message: 'Message *',
      form_send: 'Envoyer',
      reserve_title: 'Réservation de table', reserve_subtitle: 'Réservez votre table face à la mer',
      reserve_intro: 'Réservez facilement votre table au Restaurante Perujo Playa. Nous confirmerons dès que possible.',
      reserve_li1: 'Cuisine indicative : 12:00 – 23:00 (confirmez par téléphone)',
      reserve_li2: 'Groupes de plus de 10 personnes : appelez le +34 623 45 50 92',
      reserve_li3: 'En haute saison, réservez à l\'avance',
      reserve_name: 'Nom *', reserve_email: 'Email *', reserve_phone: 'Téléphone *',
      reserve_date: 'Date *', reserve_time: 'Heure *', reserve_guests: 'Personnes *',
      reserve_notes: 'Notes / allergies', reserve_submit: 'Demander une réservation',
      reserve_whatsapp: 'Réserver par WhatsApp',
      reserve_note: 'Vous recevrez une confirmation par téléphone ou email. Ce n\'est pas une réservation automatique définitive.',
      reserve_ok: 'Demande envoyée ! Nous vous contacterons pour confirmer.',
      reserve_wa_missing: 'Complétez nom, téléphone, date, heure et personnes pour envoyer la réservation par WhatsApp.',
      contact_ok: 'Message envoyé ! Nous vous répondrons bientôt.',
      footer_legal: 'Mentions légales', footer_privacy: 'Confidentialité',
      footer_cookies: 'Cookies', footer_sitemap: 'Plan du site',
      footer_copy: '© 2026 Restaurante Perujo Playa. Tous droits réservés.',
      scroll_top: 'Haut de page',
      chat_title: 'Assistant Perujo Playa',
      chat_welcome: 'Bonjour ! Je suis l\'assistant de Restaurante Perujo Playa. Comment puis-je vous aider ?',
      chat_placeholder: 'Écrivez votre question...',
      chat_send: 'Envoyer',
      chat_q_hours: 'Horaires',
      chat_q_address: 'Adresse',
      chat_q_reserve: 'Réserver',
      chat_q_menu: 'Carte',
      chat_q_parking: 'Parking',
      chat_a_hours: 'Ouvert tous les jours. Cuisine indicative de 12:00 à 23:00. Confirmez au +34 623 45 50 92.',
      chat_a_address: 'Paseo Marítimo de la Carihuela, face à l\'Hôtel Pez Espada, 29620 Torremolinos (Málaga).',
      chat_a_reserve: 'Réservez dans la section Réservation de ce site ou par WhatsApp/téléphone au +34 623 45 50 92.',
      chat_a_menu: 'Poissons et fruits de mer, viandes, riz et ragoûts. Voir la section Menu.',
      chat_a_parking: 'Parking autour de la promenade de Torremolinos. En haute saison, arrivez tôt.',
      chat_a_default: 'Je peux aider pour horaires, adresse, réservations, carte ou parking. WhatsApp/tél. +34 623 45 50 92.',
      page_legal_back: '← Retour à l\'accueil',
      page_sitemap_title: 'PLAN DU SITE',
      wa_label: 'WhatsApp',
      press_eyebrow: 'Dans la presse',
      press_title: 'Perujo Playa dans Diario SUR',
      press_text: '« L\'essence de la cuisine maritime de Málaga » : le reportage sur Antonio Perujo et sa nouvelle étape à La Carihuela.',
      press_cta: 'Lire l\'article →',
      press_aside: 'Scène de la finale de la VIII Ruta del Espeto · Sabor a Málaga',
      ambient_on: 'Activer l\'ambiance',
      ambient_off: 'Couper l\'ambiance',
      ambient_title: 'Musique d\'ambiance',
      hero_scroll: 'Découvrir',
      about_eyebrow: 'Antonio Perujo · La Carihuela',
      about_cta: 'Réserver votre table →',
      exp_sea_title: 'Face à la mer',
      exp_sea_text: 'Première ligne à La Carihuela : brise, horizon et table avec vue.',
      exp_food_title: 'Cuisine de la côte',
      exp_food_text: 'Poisson, fruits de mer, riz et viandes avec produit frais du jour.',
      exp_terrace_title: 'Terrasse et ambiance',
      exp_terrace_text: 'Un espace ouvert sur la promenade pour manger sans se presser.',
      spot_eyebrow: 'Ce que demande la table',
      spot_title: 'Des plats au goût de Costa del Sol',
      spot_subtitle: 'Riz, fruits de mer et spécialités à partager face à la mer',
      spot_1_title: 'Paellas et riz',
      spot_1_text: 'Mixte, fruits de mer et riz brothy pour deux',
      spot_2_title: 'Fruits de mer',
      spot_2_text: 'Moules, palourdes et saveurs de baie',
      spot_3_title: 'Poisson frais',
      spot_3_text: 'Du jour à la table',
      spot_cta: 'Voir toute la carte',
      reviews_eyebrow: 'Ce que disent les clients',
      reviews_title: 'Moments face à la mer',
      review_1_text: '« Terrasse avec vue mer, bon rythme et plats qui ont le goût de la Costa del Sol. »',
      review_1_author: 'Client · Google',
      review_2_text: '« Riz à partager, fruits de mer frais et service chaleureux. On reviendra en famille. »',
      review_2_author: 'Client · TripAdvisor',
      review_3_text: '« À La Carihuela, Perujo Playa est une valeur sûre : ambiance, produit et Méditerranée. »',
      review_3_author: 'Client · Instagram',
      vibe_title: 'Votre table vous attend face à la Méditerranée',
      vibe_text: 'Réservez par WhatsApp ou sur le site et profitez de La Carihuela.',
      vibe_cta_reserve: 'Réserver maintenant',
      vibe_cta_wa: 'WhatsApp'
    },
    de: {
      nav_home: 'Startseite', nav_history: 'Geschichte', nav_menu: 'Speisekarte',
      nav_gallery: 'Galerie', nav_reserve: 'Reservierung', nav_contact: 'Kontakt',
      hero_subtitle: 'Mediterrane Aromen direkt am Meer',
      hero_cta_reserve: 'Reservieren', hero_cta_menu: 'Speisekarte',
      about_title: 'Die Essenz der malaguenischen Meeresküche', about_subtitle: 'Von Benalmádena an die Strandpromenade in Torremolinos',
      about_text: 'Nach dem Erfolg von Marisquería Perujo in Arroyo de la Miel eröffnet Antonio Perujo Perujo Playa an der Promenade von La Carihuela, gegenüber dem Hotel Pez Espada: beste Meeresfrüchte und Fisch, nahbarer Service und ein elegantes, helles Lokal direkt am Strand — auch im Winter geöffnet.',
      menu_title: 'Unsere Speisekarte', menu_subtitle: 'Fisch, Fleisch, Reis und Eintöpfe',
      gallery_eyebrow: 'Auf dem Teller', gallery_title: 'Galerie', gallery_subtitle: 'Nur Gerichte: Reis, Meeresfrüchte und Fisch',
      contact_title: 'Kontakt', contact_subtitle: 'Wir sind für Sie da',
      contact_address: 'Adresse', contact_phone: 'Telefon', contact_email: 'E-Mail', contact_hours: 'Öffnungszeiten',
      contact_hours_text: 'Täglich geöffnet\nKüche ca. 12:00 – 23:00\nBitte telefonisch bestätigen',
      contact_form_title: 'Nachricht senden',
      form_name: 'Name *', form_email: 'E-Mail *', form_phone: 'Telefon', form_message: 'Nachricht *',
      form_send: 'Senden',
      reserve_title: 'Tischreservierung', reserve_subtitle: 'Sichern Sie sich Ihren Tisch am Meer',
      reserve_intro: 'Reservieren Sie einfach Ihren Tisch im Restaurante Perujo Playa. Wir bestätigen so schnell wie möglich.',
      reserve_li1: 'Küche (orientierend): 12:00 – 23:00 (bitte telefonisch bestätigen)',
      reserve_li2: 'Gruppen über 10 Personen: bitte +34 623 45 50 92 anrufen',
      reserve_li3: 'In der Hochsaison bitte frühzeitig reservieren',
      reserve_name: 'Name *', reserve_email: 'E-Mail *', reserve_phone: 'Telefon *',
      reserve_date: 'Datum *', reserve_time: 'Uhrzeit *', reserve_guests: 'Personen *',
      reserve_notes: 'Notizen / Allergien', reserve_submit: 'Reservierung anfragen',
      reserve_whatsapp: 'Per WhatsApp reservieren',
      reserve_note: 'Sie erhalten eine Bestätigung per Telefon oder E-Mail. Keine automatische endgültige Reservierung.',
      reserve_ok: 'Anfrage gesendet! Wir melden uns zur Bestätigung.',
      reserve_wa_missing: 'Bitte Name, Telefon, Datum, Uhrzeit und Personen ausfüllen, um per WhatsApp zu reservieren.',
      contact_ok: 'Nachricht gesendet! Wir melden uns bald.',
      footer_legal: 'Impressum', footer_privacy: 'Datenschutz',
      footer_cookies: 'Cookies', footer_sitemap: 'Seitenübersicht',
      footer_copy: '© 2026 Restaurante Perujo Playa. Alle Rechte vorbehalten.',
      scroll_top: 'Nach oben',
      chat_title: 'Assistent Perujo Playa',
      chat_welcome: 'Hallo! Ich bin der Assistent von Restaurante Perujo Playa. Wie kann ich helfen?',
      chat_placeholder: 'Ihre Frage...',
      chat_send: 'Senden',
      chat_q_hours: 'Öffnungszeiten',
      chat_q_address: 'Adresse',
      chat_q_reserve: 'Tisch reservieren',
      chat_q_menu: 'Speisekarte',
      chat_q_parking: 'Parken',
      chat_a_hours: 'Täglich geöffnet. Küche etwa von 12:00 bis 23:00. Bitte unter +34 623 45 50 92 bestätigen.',
      chat_a_address: 'Paseo Marítimo de la Carihuela, gegenüber Hotel Pez Espada, 29620 Torremolinos (Málaga).',
      chat_a_reserve: 'Reservieren Sie im Bereich Reservierung oder per WhatsApp/Telefon unter +34 623 45 50 92.',
      chat_a_menu: 'Fisch und Meeresfrüchte, Fleisch, Reis und Eintöpfe. Siehe Speisekarte auf dieser Seite.',
      chat_a_parking: 'Parkplätze rund um die Promenade von Torremolinos. In der Hochsaison früh kommen.',
      chat_a_default: 'Ich helfe bei Zeiten, Adresse, Reservierung, Karte oder Parken. WhatsApp/Tel. +34 623 45 50 92.',
      page_legal_back: '← Zur Startseite',
      page_sitemap_title: 'SEITENÜBERSICHT',
      wa_label: 'WhatsApp',
      press_eyebrow: 'In der Presse',
      press_title: 'Perujo Playa in Diario SUR',
      press_text: '«Die Essenz der malaguenischen Meeresküche»: der Bericht über Antonio Perujo und seinen neuen Abschnitt in La Carihuela.',
      press_cta: 'Artikel lesen →',
      press_aside: 'Austragungsort der VIII Ruta del Espeto · Sabor a Málaga',
      ambient_on: 'Ambiente einschalten',
      ambient_off: 'Ambiente ausschalten',
      ambient_title: 'Ambientemusik',
      hero_scroll: 'Entdecken',
      about_eyebrow: 'Antonio Perujo · La Carihuela',
      about_cta: 'Tisch reservieren →',
      exp_sea_title: 'Direkt am Meer',
      exp_sea_text: 'Erste Reihe in La Carihuela: Brise, Horizont und Tisch mit Blick.',
      exp_food_title: 'Küche der Küste',
      exp_food_text: 'Fisch, Meeresfrüchte, Reisgerichte und Fleisch mit frischen Produkten.',
      exp_terrace_title: 'Terrasse & Atmosphäre',
      exp_terrace_text: 'Ein offener Raum an der Promenade fürs Essen ohne Eile.',
      spot_eyebrow: 'Was der Tisch verlangt',
      spot_title: 'Gerichte mit Costa-del-Sol-Geschmack',
      spot_subtitle: 'Reis, Meeresfrüchte und Spezialitäten zum Teilen am Meer',
      spot_1_title: 'Paellas & Reis',
      spot_1_text: 'Gemischt, Meeresfrüchte und Brühe-Reis für zwei',
      spot_2_title: 'Meeresfrüchte',
      spot_2_text: 'Muscheln, Venusmuscheln und Buchtaromen',
      spot_3_title: 'Frischer Fisch',
      spot_3_text: 'Vom Tag auf den Tisch',
      spot_cta: 'Zur gesamten Speisekarte',
      reviews_eyebrow: 'Was Gäste erzählen',
      reviews_title: 'Momente am Meer',
      review_1_text: '« Terrasse mit Meerblick, gutes Tempo und Gerichte mit Costa-del-Sol-Geschmack. »',
      review_1_author: 'Gast · Google',
      review_2_text: '« Reisgerichte zum Teilen, frische Meeresfrüchte und herzlicher Service. »',
      review_2_author: 'Gast · TripAdvisor',
      review_3_text: '« In La Carihuela ist Perujo Playa eine sichere Wahl: Ambiente, Produkt und Mittelmeer. »',
      review_3_author: 'Gast · Instagram',
      vibe_title: 'Ihr Tisch wartet am Mittelmeer',
      vibe_text: 'Reservieren Sie per WhatsApp oder auf der Website und genießen Sie La Carihuela.',
      vibe_cta_reserve: 'Jetzt reservieren',
      vibe_cta_wa: 'WhatsApp'
    },
    it: {
      nav_home: 'Home', nav_history: 'Storia', nav_menu: 'Menu',
      nav_gallery: 'Galleria', nav_reserve: 'Prenotazioni', nav_contact: 'Contatti',
      hero_subtitle: 'Sapori mediterranei davanti al mare',
      hero_cta_reserve: 'Prenota', hero_cta_menu: 'Vedi il menu',
      about_title: 'L\'essenza della cucina marinara di Malaga', about_subtitle: 'Da Benalmádena alla prima linea a Torremolinos',
      about_text: 'Dopo il successo di Marisquería Perujo ad Arroyo de la Miel, Antonio Perujo apre Perujo Playa sul lungomare di La Carihuela, di fronte all\'Hotel Pez Espada: frutti di mare e pesce d\'eccellenza, servizio cordiale e uno spazio elegante e luminoso sulla spiaggia. Aperti anche in inverno.',
      menu_title: 'La nostra carta', menu_subtitle: 'Pesce, carni, risi e stufati',
      gallery_eyebrow: 'In tavola', gallery_title: 'Galleria', gallery_subtitle: 'Solo piatti: riso, frutti di mare e pesce',
      contact_title: 'Contatti', contact_subtitle: 'Siamo qui per te',
      contact_address: 'Indirizzo', contact_phone: 'Telefono', contact_email: 'Email', contact_hours: 'Orari',
      contact_hours_text: 'Aperti tutti i giorni\nCucina orientativa: 12:00 – 23:00\nConfermare per telefono',
      contact_form_title: 'Inviaci un messaggio',
      form_name: 'Nome *', form_email: 'Email *', form_phone: 'Telefono', form_message: 'Messaggio *',
      form_send: 'Invia messaggio',
      reserve_title: 'Prenotazione tavolo', reserve_subtitle: 'Assicura il tuo tavolo davanti al mare',
      reserve_intro: 'Prenota facilmente il tuo tavolo al Restaurante Perujo Playa. Confermeremo al più presto.',
      reserve_li1: 'Orario cucina orientativo: 12:00 – 23:00 (confermare per telefono)',
      reserve_li2: 'Gruppi di più di 10 persone: chiamaci al +34 623 45 50 92',
      reserve_li3: 'In alta stagione consigliamo di prenotare in anticipo',
      reserve_name: 'Nome *', reserve_email: 'Email *', reserve_phone: 'Telefono *',
      reserve_date: 'Data *', reserve_time: 'Ora *', reserve_guests: 'Persone *',
      reserve_notes: 'Note / allergie', reserve_submit: 'Richiedi prenotazione',
      reserve_whatsapp: 'Prenota via WhatsApp',
      reserve_note: 'Riceverai conferma per telefono o email. Non è una prenotazione automatica definitiva.',
      reserve_ok: 'Richiesta inviata! Ti contatteremo per confermare il tavolo.',
      reserve_wa_missing: 'Compila nome, telefono, data, ora e persone per inviare la prenotazione via WhatsApp.',
      contact_ok: 'Messaggio inviato! Ti risponderemo presto.',
      footer_legal: 'Note legali', footer_privacy: 'Privacy',
      footer_cookies: 'Cookie', footer_sitemap: 'Mappa del sito',
      footer_copy: '© 2026 Restaurante Perujo Playa. Tutti i diritti riservati.',
      scroll_top: 'Torna su',
      chat_title: 'Assistente Perujo Playa',
      chat_welcome: 'Ciao! Sono l\'assistente di Restaurante Perujo Playa. Come posso aiutarti?',
      chat_placeholder: 'Scrivi la tua domanda...',
      chat_send: 'Invia',
      chat_q_hours: 'Orari',
      chat_q_address: 'Indirizzo',
      chat_q_reserve: 'Prenota tavolo',
      chat_q_menu: 'Menu',
      chat_q_parking: 'Parcheggio',
      chat_a_hours: 'Aperti tutti i giorni. Cucina orientativa dalle 12:00 alle 23:00. Conferma al +34 623 45 50 92.',
      chat_a_address: 'Siamo sul Paseo Marítimo de la Carihuela, di fronte all\'Hotel Pez Espada, 29620 Torremolinos (Málaga).',
      chat_a_reserve: 'Puoi prenotare nella sezione Prenotazioni o via WhatsApp/telefono al +34 623 45 50 92.',
      chat_a_menu: 'Pesce e frutti di mare, carni, risi e stufati. Vedi la sezione Menu.',
      chat_a_parking: 'C\'è parcheggio nella zona del lungomare di Torremolinos. In alta stagione conviene arrivare in anticipo.',
      chat_a_default: 'Posso aiutarti con orari, indirizzo, prenotazioni, menu o parcheggio. WhatsApp/tel. +34 623 45 50 92.',
      page_legal_back: '← Torna alla home',
      page_sitemap_title: 'MAPPA DEL SITO',
      wa_label: 'WhatsApp',
      press_eyebrow: 'Sulla stampa',
      press_title: 'Perujo Playa su Diario SUR',
      press_text: '«L\'essenza della cucina marinara di Malaga»: il reportage su Antonio Perujo e la nuova tappa a La Carihuela.',
      press_cta: 'Leggi l\'articolo →',
      press_aside: 'Sede della finale della VIII Ruta del Espeto · Sabor a Málaga',
      ambient_on: 'Attiva ambiente',
      ambient_off: 'Disattiva ambiente',
      ambient_title: 'Musica ambiente',
      hero_scroll: 'Scopri',
      about_eyebrow: 'Antonio Perujo · La Carihuela',
      about_cta: 'Prenota il tuo tavolo →',
      exp_sea_title: 'Davanti al mare',
      exp_sea_text: 'Prima linea a La Carihuela: brezza, orizzonte e tavolo con vista.',
      exp_food_title: 'Cucina di costa',
      exp_food_text: 'Pesce, frutti di mare, risi e carni con prodotto fresco del giorno.',
      exp_terrace_title: 'Terrazza e atmosfera',
      exp_terrace_text: 'Uno spazio aperto sul lungomare per mangiare senza fretta.',
      spot_eyebrow: 'Quello che chiede la tavola',
      spot_title: 'Piatti che sanno di Costa del Sol',
      spot_subtitle: 'Risi, frutti di mare e specialità da condividere davanti al mare',
      spot_1_title: 'Paella e risi',
      spot_1_text: 'Mista, frutti di mare e risotti in brodo per due',
      spot_2_title: 'Frutti di mare',
      spot_2_text: 'Cozze, vongole e sapori di baia',
      spot_3_title: 'Pesce fresco',
      spot_3_text: 'Dal giorno alla tavola',
      spot_cta: 'Esplora tutto il menu',
      reviews_eyebrow: 'Cosa raccontano gli ospiti',
      reviews_title: 'Momenti davanti al mare',
      review_1_text: '« Terrazza con vista mare, buon ritmo e piatti che sanno di Costa del Sol. »',
      review_1_author: 'Ospite · Google',
      review_2_text: '« Risi da condividere, frutti di mare freschi e servizio cordiale. Torneremo in famiglia. »',
      review_2_author: 'Ospite · TripAdvisor',
      review_3_text: '« A La Carihuela, Perujo Playa è una scelta sicura: atmosfera, prodotto e Mediterraneo. »',
      review_3_author: 'Ospite · Instagram',
      vibe_title: 'Il tuo tavolo ti aspetta davanti al Mediterraneo',
      vibe_text: 'Prenota via WhatsApp o sul sito e vivi La Carihuela.',
      vibe_cta_reserve: 'Prenota ora',
      vibe_cta_wa: 'WhatsApp'
    }
  };

  let currentLang = localStorage.getItem('pp_lang') || 'es';

  function t(key) {
    return (T[currentLang] && T[currentLang][key]) || (T.es && T.es[key]) || key;
  }

  function applyI18n(lang) {
    currentLang = lang;
    localStorage.setItem('pp_lang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    const dict = Object.assign({}, T[lang] || {}, (window.MENU_I18N && window.MENU_I18N[lang]) || {});

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key] != null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.innerHTML = String(dict[key]).replace(/\n/g, '<br>');
        }
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (dict[key]) el.placeholder = dict[key];
    });
    const scrollBtn = document.getElementById('scroll-top');
    if (scrollBtn) {
      scrollBtn.title = t('scroll_top');
      scrollBtn.setAttribute('aria-label', t('scroll_top'));
    }
    const waFab = document.querySelector('.wa-fab');
    if (waFab) {
      waFab.setAttribute('aria-label', t('wa_label'));
      waFab.title = t('wa_label');
    }
    document.querySelectorAll('.languages').forEach((el) => {
      el.style.display = lang === 'es' ? '' : 'none';
    });
    if (window.PPAmbient && typeof window.PPAmbient.syncUI === 'function') {
      window.PPAmbient.syncUI();
    }
    refreshChatUI();
  }

  window.PP = { T, t, applyI18n, getLang: () => currentLang };

  function answerFor(text) {
    const q = (text || '').toLowerCase();
    if (/hora|horario|ouvert|open|öffnungs|hours|horaire|orari/.test(q)) return t('chat_a_hours');
    if (/direc|address|adresse|ubicación|ubi|wo\b|location|torremolinos|paseo/.test(q)) return t('chat_a_address');
    if (/reserv|book|mesa|table|tisch|prenot/.test(q)) return t('chat_a_reserve');
    if (/carta|menu|menú|speise|arroz|paella|pescado/.test(q)) return t('chat_a_menu');
    if (/park|aparca|parking|parken|parcheggio/.test(q)) return t('chat_a_parking');
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
    const toggle = document.getElementById('chat-toggle');
    if (toggle) toggle.setAttribute('aria-label', t('chat_title'));
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

  function buildReserveWhatsAppUrl(form) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const email = String(data.get('email') || '').trim();
    const dateVal = String(data.get('date') || '').trim();
    const time = String(data.get('time') || '').trim();
    const guests = String(data.get('guests') || '').trim();
    const notes = String(data.get('notes') || '').trim();
    if (!name || !phone || !dateVal || !time || !guests) return null;
    const lines = [
      'Hola, quiero reservar mesa en Restaurante Perujo Playa:',
      'Nombre: ' + name,
      'Teléfono: ' + phone,
      email ? 'Email: ' + email : '',
      'Fecha: ' + dateVal,
      'Hora: ' + time,
      'Personas: ' + guests,
      notes ? 'Notas: ' + notes : ''
    ].filter(Boolean);
    return 'https://wa.me/34623455092?text=' + encodeURIComponent(lines.join('\n'));
  }

  function initReserve() {
    const form = document.getElementById('reserve-form');
    const date = document.getElementById('reserve-date');
    const waBtn = document.getElementById('reserve-whatsapp');
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
      const url = buildReserveWhatsAppUrl(form);
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        alert(t('reserve_ok'));
        form.reset();
        if (date) {
          const today = new Date();
          date.min = today.toISOString().slice(0, 10);
        }
        return;
      }
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
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const url = buildReserveWhatsAppUrl(form);
        if (!url) {
          alert(t('reserve_wa_missing'));
          return;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    }
  }

  function initLangButtons() {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
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
