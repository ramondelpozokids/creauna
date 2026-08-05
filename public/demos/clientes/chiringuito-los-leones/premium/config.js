/**
 * Premium layer configuration — feature flags & external endpoints.
 * Only enable modules that have real content or live data.
 */
export const config = {
  features: {
    heroCinema: true,
    ambientSound: false,      /* no audio file */
    transitions: true,
    aiAssistant: true,
    smartReserve: false,      /* use existing Reserva de mesa only */
    interactiveMenu: false,   /* not enough real matching photos */
    view360: false,           /* no panorama connected */
    virtualTour: false,       /* no quality tour photos */
    generations: false,       /* removed — insufficient real photos */
    liveKitchen: false,       /* no live stream */
    seaWebcam: false,         /* no webcam URL */
    weather: true,            /* Open-Meteo @ Torremolinos / La Carihuela */
    sunset: false,            /* countdown removed — not useful alone */
    espetosNow: false,        /* no live backend */
    instagram: true,
    tiktok: false,            /* no profile/embeds */
    langDetect: true,
    experiencesPanel: false,
    galleryLightbox: true,
    cartaCompleta: true,
    brandStory: true
  },

  ambientAudioUrl: '',
  ambientVolume: 0.18,

  aiEndpoint: '',

  reserveEndpoint: '',
  reserveMailto: 'losleonesplaya@gmail.com',

  /* Torremolinos — La Carihuela (Paseo Marítimo) */
  coords: { lat: 36.6203, lon: -4.5052 },
  weatherCacheMinutes: 20,

  view360: {
    type: '',
    url: '',
    poster: 'images/local-fachada.png'
  },

  liveKitchen: {
    provider: '',
    url: '',
    poster: 'images/local-barra.png'
  },

  webcam: {
    url: '',
    refreshSeconds: 60,
    poster: 'images/local-interior.png'
  },

  espetosNow: {
    endpoint: '',
    image: '',
    video: '',
    live: '',
    fireStatus: '',
    availability: ''
  },

  instagram: {
    profileUrl: 'https://www.instagram.com/chiringuitolosleones/',
    embedUrls: [],
    /* Local photos when feed API is not connected */
    posts: [
      { src: 'images/ig-espetos.png', alt: 'Espetos Chiringuito Los Leones' },
      { src: 'images/ig-cocteles.png', alt: 'Cócteles en la terraza' },
      { src: 'images/ig-postre.png', alt: 'Postre casero' }
    ]
  },
  tiktok: {
    profileUrl: '',
    embedUrls: []
  },

  generationsMedia: {
    g1: 'images/local-fachada.png',
    g2: 'images/local-interior.png',
    g3: 'images/local-espetos-brasa.png',
    g4: 'images/menu-dorada.png'
  },

  supportedLangs: ['es', 'en', 'fr', 'de', 'it']
};

export default config;
