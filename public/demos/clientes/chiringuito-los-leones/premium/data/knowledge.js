/**
 * Local knowledge base for the assistant.
 * Compatible with future config.aiEndpoint responses.
 */
export const knowledge = [
  {
    id: 'hours',
    topics: ['horario', 'hora', 'abierto', 'hours', 'open', 'öffnungs', 'horaire', 'orario', 'apertura'],
    answer: {
      es: 'Abrimos todos los días de 10:00 a 00:00. Cocina aproximadamente de 12:00 a 23:30.',
      en: 'Open every day from 10:00 to 00:00. Kitchen roughly 12:00–23:30.',
      fr: 'Ouvert tous les jours de 10:00 à 00:00. Cuisine environ 12:00–23:30.',
      de: 'Täglich geöffnet von 10:00 bis 00:00. Küche etwa 12:00–23:30.',
      it: 'Aperti tutti i giorni dalle 10:00 alle 00:00. Cucina circa 12:00–23:30.'
    }
  },
  {
    id: 'reserve',
    topics: ['reserv', 'book', 'mesa', 'table', 'tisch', 'prenot'],
    answer: {
      es: 'Puedes usar la sección Reservas o la Reserva inteligente (personas, zona, alergias, silla infantil). También: +34 952 37 43 13.',
      en: 'Use Reservations or Smart reservation (guests, area, allergies, high chair). Or call +34 952 37 43 13.',
      fr: 'Utilisez Réservation ou Réservation intelligente. Tél. +34 952 37 43 13.',
      de: 'Nutzen Sie Reservierung oder Intelligente Reservierung. Tel. +34 952 37 43 13.',
      it: 'Usa Prenotazioni o Prenotazione intelligente. Tel. +34 952 37 43 13.'
    }
  },
  {
    id: 'menu',
    topics: ['carta', 'menu', 'menú', 'plato', 'speise', 'carte'],
    answer: {
      es: 'Tenemos sugerencias del día, ensaladas, mariscos, pescado a la plancha y espetos, frituras, arroces, carnes, postres, vinos y cócteles. Hay una carta interactiva con filtros y alérgenos.',
      en: 'Daily suggestions, salads, seafood, grilled fish and espetos, fried dishes, rice, meats, desserts, wines and cocktails. Interactive menu with filters and allergens available.',
      fr: 'Suggestions du jour, salades, fruits de mer, poissons et espetos, fritures, riz, viandes, desserts, vins et cocktails. Carte interactive disponible.',
      de: 'Tagesvorschläge, Salate, Meeresfrüchte, Fisch und Espetos, Frittieres, Reis, Fleisch, Desserts, Weine und Cocktails. Interaktive Karte verfügbar.',
      it: 'Suggerimenti del giorno, insalate, frutti di mare, pesce e espetos, fritti, risotti, carni, dessert, vini e cocktail. Menu interattivo disponibile.'
    }
  },
  {
    id: 'allergens',
    topics: ['alergen', 'allerg', 'gluten', 'lactosa', 'celiac', 'intoler'],
    answer: {
      es: 'Indica alergias o intolerancias en la reserva (notas o Reserva inteligente). Nuestro equipo te asesorará en sala. Para dudas graves, llama al +34 952 37 43 13.',
      en: 'Note allergies in the booking form or Smart reservation. Our team will advise on site. For serious concerns call +34 952 37 43 13.',
      fr: 'Indiquez les allergies dans la réservation. Notre équipe vous conseillera. Pour les cas graves : +34 952 37 43 13.',
      de: 'Bitte Allergien bei der Reservierung angeben. Unser Team berät vor Ort. Bei schweren Fällen: +34 952 37 43 13.',
      it: 'Indica le allergie nella prenotazione. Il team ti consiglierà in sala. Per casi gravi: +34 952 37 43 13.'
    }
  },
  {
    id: 'beach',
    topics: ['playa', 'beach', 'plage', 'strand', 'spiaggia', 'carihuela', 'mar'],
    answer: {
      es: 'Estamos en el Paseo Marítimo de La Carihuela (c/ Nerja s/n, Torremolinos), frente a la playa. Terraza con vistas al mar.',
      en: 'On the La Carihuela seafront promenade (c/ Nerja s/n, Torremolinos), beachfront terrace.',
      fr: 'Sur la promenade de La Carihuela (c/ Nerja s/n, Torremolinos), terrasse face à la mer.',
      de: 'An der Strandpromenade La Carihuela (c/ Nerja s/n, Torremolinos), Terrasse mit Meerblick.',
      it: 'Sul lungomare di La Carihuela (c/ Nerja s/n, Torremolinos), terrazza fronte mare.'
    }
  },
  {
    id: 'parking',
    topics: ['park', 'aparca', 'parking', 'parken', 'parcheggio'],
    answer: {
      es: 'Hay aparcamiento en la zona de La Carihuela y el paseo marítimo. En temporada alta conviene llegar con tiempo.',
      en: 'Parking around La Carihuela and the promenade. In high season arrive early.',
      fr: 'Parking autour de La Carihuela et de la promenade. En haute saison, arrivez tôt.',
      de: 'Parkplätze rund um La Carihuela und die Promenade. In der Hochsaison früh kommen.',
      it: 'Parcheggio nella zona di La Carihuela e sul lungomare. In alta stagione conviene arrivare prima.'
    }
  },
  {
    id: 'pets',
    topics: ['mascota', 'perro', 'dog', 'pet', 'hund', 'chien', 'animal', 'cane'],
    answer: {
      es: 'Para mascotas, consulta disponibilidad según zona y aforo llamando al +34 952 37 43 13 o indicando la petición en la reserva.',
      en: 'For pets, check availability by area/capacity at +34 952 37 43 13 or note it in your booking.',
      fr: 'Pour les animaux, vérifiez la disponibilité au +34 952 37 43 13 ou indiquez-le dans la réservation.',
      de: 'Für Haustiere Verfügbarkeit unter +34 952 37 43 13 prüfen oder in der Reservierung anmerken.',
      it: 'Per animali, verifica disponibilità al +34 952 37 43 13 o indicalo nella prenotazione.'
    }
  },
  {
    id: 'events',
    topics: ['evento', 'event', 'celebr', 'cumple', 'birthday', 'grupo', 'group', 'fiesta', 'feste'],
    answer: {
      es: 'Celebramos cumpleaños y grupos. Para más de 10 personas llama al +34 952 37 43 13. Marca cumpleaños o silla infantil en Reserva inteligente.',
      en: 'We host birthdays and groups. Over 10 guests: call +34 952 37 43 13. Mark birthday/high chair in Smart reservation.',
      fr: 'Anniversaires et groupes bienvenus. Plus de 10 personnes : +34 952 37 43 13.',
      de: 'Geburtstage und Gruppen willkommen. Über 10 Personen: +34 952 37 43 13.',
      it: 'Compleanni e gruppi benvenuti. Oltre 10 persone: +34 952 37 43 13.'
    }
  },
  {
    id: 'address',
    topics: ['direc', 'address', 'adresse', 'ubicación', 'location', 'indirizzo', 'wo '],
    answer: {
      es: 'Paseo Marítimo de la Carihuela, c/ Nerja s/n, 29620 Torremolinos (Málaga). Email: losleonesplaya@gmail.com',
      en: 'Paseo Marítimo de la Carihuela, c/ Nerja s/n, 29620 Torremolinos (Málaga). Email: losleonesplaya@gmail.com',
      fr: 'Paseo Marítimo de la Carihuela, c/ Nerja s/n, 29620 Torremolinos (Málaga). Email: losleonesplaya@gmail.com',
      de: 'Paseo Marítimo de la Carihuela, c/ Nerja s/n, 29620 Torremolinos (Málaga). E-Mail: losleonesplaya@gmail.com',
      it: 'Paseo Marítimo de la Carihuela, c/ Nerja s/n, 29620 Torremolinos (Málaga). Email: losleonesplaya@gmail.com'
    }
  }
];

export function matchKnowledge(text, lang = 'es') {
  const q = (text || '').toLowerCase();
  for (const item of knowledge) {
    if (item.topics.some((t) => q.includes(t))) {
      return item.answer[lang] || item.answer.es;
    }
  }
  return null;
}

export const quickPrompts = [
  { id: 'hours', label: { es: 'Horario', en: 'Hours', fr: 'Horaires', de: 'Zeiten', it: 'Orari' } },
  { id: 'reserve', label: { es: 'Reservar', en: 'Book', fr: 'Réserver', de: 'Reservieren', it: 'Prenota' } },
  { id: 'menu', label: { es: 'Carta', en: 'Menu', fr: 'Carte', de: 'Karte', it: 'Menu' } },
  { id: 'allergens', label: { es: 'Alérgenos', en: 'Allergens', fr: 'Allergènes', de: 'Allergene', it: 'Allergeni' } },
  { id: 'parking', label: { es: 'Parking', en: 'Parking', fr: 'Parking', de: 'Parken', it: 'Parcheggio' } },
  { id: 'pets', label: { es: 'Mascotas', en: 'Pets', fr: 'Animaux', de: 'Haustiere', it: 'Animali' } },
  { id: 'events', label: { es: 'Eventos', en: 'Events', fr: 'Événements', de: 'Events', it: 'Eventi' } },
  { id: 'beach', label: { es: 'Playa', en: 'Beach', fr: 'Plage', de: 'Strand', it: 'Spiaggia' } }
];
