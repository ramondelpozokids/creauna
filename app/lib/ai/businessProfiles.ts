import type { ParsedGoogleListing } from './googleListingParser';
import { IMAGE_BANK } from './imageBank';

export type BusinessVariant = 'kebab' | 'tattoo' | 'cafe' | 'bakery' | 'italian' | 'foodblog' | 'beauty' | 'corporate' | 'automotive' | 'bike' | 'luxury' | 'jewelry' | 'fashion' | 'nonprofit' | 'renewable' | 'default';

/** Tienda / catálogo de bicicletas (NO moda, NO motos). */
export function isBikeShopPrompt(prompt: string): boolean {
  return /bicicleta|bicicletas|\bbicis?\b|ciclismo|\bmtb\b|e-?bike|ebike|mountain\s*bike|bicicleta\s+el[eé]ctrica|tienda\s+de\s+bicis|ciclismo\s+de\s+(monta[nñ]a|carretera)|orbea|specialized|trek\b|canyon|scott\b|giant\b|cannondale|rockshox/i.test(
    prompt
  );
}

/** Panadería / pastelería artesanal (NO restaurante gourmet genérico). */
export function isBakeryShopPrompt(prompt: string): boolean {
  return /panader[ií]a|panaderia|bollería|bolleria|pasteler[ií]a|bakery|bread\s+shop|trigo\s+dorado|masa\s+madre|pan\s+reci[eé]n|horneado|croissants?|magdalenas?|\bpanes?\b.*\bprecios|\bpan\b.*artesanal/i.test(
    prompt
  );
}

/** Brief de tienda online / moda premium (evita confundir con arquitectura por «Arquitecto UX/UI»). */
export function isFashionEcommercePrompt(prompt: string): boolean {
  if (isBikeShopPrompt(prompt)) return false;
  // Gestoría / profesional B2B nunca es moda
  if (/gestor[ií]a|asesor[ií]a|fiscal|contabil|despacho\s+de\s+abog/i.test(prompt)) return false;
  // Barbería / peluquería de caballeros nunca es moda ecommerce
  if (isBarbershopPrompt(prompt)) return false;
  const lower = prompt.toLowerCase();
  // Negaciones: no contar «carrito» / «tienda online» como deseo de ecommerce
  const rejectsCart =
    /sin\s+carrito|ni\s+carrito|no\s+(?:debe\s+)?(?:existir|incluir|tener|haber)[\s\S]{0,40}carrito|no\s+proceso\s+de\s+compra|no\s+pago\s+online|sin\s+compra\s+online|no\s+es\s+una\s+tienda\s+online|no\s+debe\s+existir\s+tienda\s+online|sin\s+tienda\s+online|ni\s+pagos?\s+online/i.test(
      lower
    );
  const wantsCart =
    !rejectsCart &&
    /\bcarrito\b|checkout|pasarela\s+de\s+pago|\bstripe\b|woocommerce|shopify/i.test(lower);
  const tiendaOnline =
    /\btienda\s+online\b/i.test(lower) &&
    !/no\s+(?:debe\s+)?(?:existir|incluir)[\s\S]{0,30}tienda\s+online|sin\s+tienda\s+online|ni\s+tienda\s+online/i.test(
      lower
    );
  return (
    wantsCart ||
    tiendaOnline ||
    /ecommerce|e-commerce|comercio electr[oó]nico|tienda de (moda|ropa)|boutique de moda|lookbook|colecci[oó]n premium|moda premium|luxury fashion|firma internacional|vender miles de productos|nueva colecci[oó]n|explorar colecci[oó]n|productos destacados/i.test(
      lower
    ) ||
    /zara|massimo dutti|\bcos\b|mango|gymshark|balenciaga|dior|gucci|hugo boss|tommy hilfiger|calvin klein|lacoste|ralph lauren|louis vuitton|uniqlo|alo yoga|sandro|armani exchange|velora|chanel|loewe|aesop/i.test(
      lower
    ) ||
    /wig|peluca|pelucas|women'?s?\s+fashion|moda\s+femenina|fashion\s+accessor|accesorios\s+de\s+moda|ultra-?premium.*(?:wig|fashion|moda|boutique)/i.test(
      lower
    )
  );
}

/** Barbería / peluquería masculina (NO moda, NO salón unisex genérico). */
export function isBarbershopPrompt(prompt: string): boolean {
  return /barber[ií]a|barbershop|\bbarber\b|afeitad|grooming\s+masculin|peluquer[ií]a\s+(?:de\s+)?caballer|peluquer[ií]a\s+masculin|caballero\s+tarik|\btarik\b|corte\s+de\s+caballero|arreglo\s+de\s+barba/i.test(
    prompt
  );
}

/** Detecta barbería aunque el pedido sea corto («arregla fotos») mirando también el HTML actual. */
export function isBarbershopContext(prompt: string, html = ''): boolean {
  if (isBarbershopPrompt(prompt)) return true;
  const slice = (html || '').slice(0, 12000);
  return (
    isBarbershopPrompt(slice) ||
    /peluquer[ií]a\s+caballero|experiencia\s+de\s+barber|caballero\s+tarik/i.test(slice)
  );
}

/** Quita roles de equipo del brief antes de puntuar sectores (Arquitecto UX/UI ≠ estudio arquitectura). */
export function stripIntentScoringNoise(prompt: string): string {
  return prompt
    .replace(/#\s*PROYECTO[\s\S]*?(?=#\s|$)/gi, ' ')
    .replace(/(?:director|desarrollador|especialista|copywriter|fot[oó]grafo)\s[^\n•\-#]+/gi, ' ')
    .replace(/arquitecto\s+(?:ux\/ui|backend|frontend)/gi, ' ')
    .replace(/-\s*arquitecto\s+ux\/ui[^\n]*/gi, ' ');
}

export type AccentColor = 'red' | 'indigo' | 'gold' | 'blue' | 'rose';

export interface MenuItem {
  title: string;
  image: string;
  cta: string;
  price?: string;
}

export interface ReviewItem {
  name: string;
  text: string;
  stars: number;
}

export interface BusinessProfile {
  variant: BusinessVariant;
  heroImage: string;
  galleryImages: string[];
  taglineEs: string;
  taglineEn: string;
  typeEs: string;
  typeEn: string;
  ctaPrimaryEs: string;
  ctaPrimaryEn: string;
  ctaSecondaryEs: string;
  ctaSecondaryEn: string;
  badgeEs: string;
  badgeEn: string;
  menuItems: { es: MenuItem[]; en: MenuItem[] };
  reviews: { es: ReviewItem[]; en: ReviewItem[] };
  addressEs: string;
  addressEn: string;
  hoursEs: string;
  hoursEn: string;
  infoEs: string;
  infoEn: string;
  phone?: string;
  instagram?: string;
  email?: string;
  ratingLabelEs?: string;
  ratingLabelEn?: string;
  aboutEs?: string;
  aboutEn?: string;
  accent: AccentColor;
}

const KEBAB_IMAGES = {
  hero: 'https://images.pexels.com/photos/2964195/pexels-photo-2964195.jpeg?auto=compress&cs=tinysrgb&w=1400&h=800&fit=crop',
  menu1: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  menu2: 'https://images.pexels.com/photos/2964168/pexels-photo-2964168.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  menu3: 'https://images.pexels.com/photos/5938421/pexels-photo-5938421.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  menu4: 'https://images.pexels.com/photos/7049655/pexels-photo-7049655.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  menu5: 'https://images.pexels.com/photos/7049655/pexels-photo-7049655.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  menu6: 'https://images.pexels.com/photos/60616/food-plate-dinner-lunch-60616.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  gal1: 'https://images.pexels.com/photos/7049655/pexels-photo-7049655.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal2: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal3: 'https://images.pexels.com/photos/2964168/pexels-photo-2964168.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
};

const TATTOO_IMAGES = {
  hero: 'https://images.pexels.com/photos/1874644/pexels-photo-1874644.jpeg?auto=compress&cs=tinysrgb&w=1400&h=800&fit=crop',
  gal1: 'https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal2: 'https://images.pexels.com/photos/356567/pexels-photo-356567.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal3: 'https://images.pexels.com/photos/6624833/pexels-photo-6624833.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  p1: 'https://images.pexels.com/photos/1874644/pexels-photo-1874644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  p2: 'https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  p3: 'https://images.pexels.com/photos/356567/pexels-photo-356567.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  p4: 'https://images.pexels.com/photos/6624833/pexels-photo-6624833.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
};

export const KEBAB_PROFILE: BusinessProfile = {
  variant: 'kebab',
  heroImage: KEBAB_IMAGES.hero,
  galleryImages: [KEBAB_IMAGES.gal1, KEBAB_IMAGES.gal2, KEBAB_IMAGES.gal3],
  taglineEs: 'Auténticos kebabs y sabores mediterráneos. Ingredientes frescos, recetas tradicionales y ambiente urbano premium.',
  taglineEn: 'Authentic kebabs and Mediterranean flavors. Fresh ingredients, traditional recipes, and a premium urban vibe.',
  typeEs: 'Restaurante Kebab',
  typeEn: 'Kebab Restaurant',
  badgeEs: 'Auténtico Döner Kebab',
  badgeEn: 'Authentic Döner Kebab',
  ctaPrimaryEs: 'Ver menú',
  ctaPrimaryEn: 'View menu',
  ctaSecondaryEs: 'Cómo llegar',
  ctaSecondaryEn: 'Get directions',
  menuItems: {
    es: [
      { title: 'Kebab Clásico', image: KEBAB_IMAGES.menu1, cta: 'Ven a probarlo' },
      { title: 'Durum de Pollo', image: KEBAB_IMAGES.menu2, cta: 'Ven a probarlo' },
      { title: 'Kebab de Falafel', image: KEBAB_IMAGES.menu3, cta: 'Ven a probarlo' },
      { title: 'Pollo Asado', image: KEBAB_IMAGES.menu4, cta: 'Ven a probarlo' },
      { title: 'Menú Familiar', image: KEBAB_IMAGES.menu5, cta: 'Ven a probarlo' },
      { title: 'Alitas & Patatas', image: KEBAB_IMAGES.menu6, cta: 'Ven a probarlo' },
    ],
    en: [
      { title: 'Classic Kebab', image: KEBAB_IMAGES.menu1, cta: 'Come try it' },
      { title: 'Chicken Durum', image: KEBAB_IMAGES.menu2, cta: 'Come try it' },
      { title: 'Falafel Kebab', image: KEBAB_IMAGES.menu3, cta: 'Come try it' },
      { title: 'Roasted Chicken', image: KEBAB_IMAGES.menu4, cta: 'Come try it' },
      { title: 'Family Menu', image: KEBAB_IMAGES.menu5, cta: 'Come try it' },
      { title: 'Wings & Fries', image: KEBAB_IMAGES.menu6, cta: 'Come try it' },
    ],
  },
  reviews: {
    es: [
      { name: 'María C.', text: 'Los kebabs más auténticos del barrio. El local es moderno y el personal muy atento.', stars: 5 },
      { name: 'Javier L.', text: 'Ingredientes de calidad y buen precio. El menú familiar es ideal para compartir.', stars: 5 },
      { name: 'Ana L.', text: 'Me encantó el pollo asado y el local está impecable. Ojalá más opciones vegetarianas.', stars: 4 },
    ],
    en: [
      { name: 'Maria C.', text: 'The most authentic kebabs in the neighborhood. Modern place and very attentive staff.', stars: 5 },
      { name: 'Javier L.', text: 'Quality ingredients and fair prices. The family menu is perfect for sharing.', stars: 5 },
      { name: 'Ana L.', text: 'Loved the roasted chicken and the place is spotless. Wish there were more veggie options.', stars: 4 },
    ],
  },
  addressEs: 'C. Pilar Nogueiro 22, 28038 Madrid (Vallecas)',
  addressEn: 'C. Pilar Nogueiro 22, 28038 Madrid (Vallecas)',
  hoursEs: 'Todos los días, 12:00 – 00:00',
  hoursEn: 'Every day, 12:00 – 00:00',
  infoEs: 'Solo servicio en local. No realizamos entregas a domicilio.',
  infoEn: 'Dine-in only. We do not offer delivery.',
  accent: 'red',
};

export const TATTOO_PROFILE: BusinessProfile = {
  variant: 'tattoo',
  heroImage: TATTOO_IMAGES.hero,
  galleryImages: [
    TATTOO_IMAGES.gal1, TATTOO_IMAGES.gal2, TATTOO_IMAGES.gal3,
    'https://images.pexels.com/photos/6624833/pexels-photo-6624833.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    'https://images.pexels.com/photos/356567/pexels-photo-356567.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    'https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    'https://images.pexels.com/photos/1874644/pexels-photo-1874644.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    'https://images.pexels.com/photos/6624833/pexels-photo-6624833.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  ],
  taglineEs: 'Tatuajes y Piercings Profesionales en Puente de Vallecas',
  taglineEn: 'Professional Tattoos & Piercings in Puente de Vallecas',
  typeEs: 'Estudio de Tatuajes & Piercing',
  typeEn: 'Tattoo & Piercing Studio',
  badgeEs: 'Tatuajes · Piercings · Gemas dentales',
  badgeEn: 'Tattoos · Piercings · Tooth gems',
  ctaPrimaryEs: 'Reservar cita',
  ctaPrimaryEn: 'Book appointment',
  ctaSecondaryEs: 'WhatsApp',
  ctaSecondaryEn: 'WhatsApp',
  menuItems: {
    es: [
      { title: 'Chikitattoo', price: '30,00 €', image: TATTOO_IMAGES.p1, cta: 'Reservar cita' },
      { title: 'Tatuaje Full-Color', price: '100,00 €', image: TATTOO_IMAGES.p2, cta: 'Reservar cita' },
      { title: 'Piercings', price: '10,00–20,00 €', image: TATTOO_IMAGES.p3, cta: 'Reservar cita' },
      { title: 'Tatuaje 20×10 cm a color', price: '150,00 €', image: TATTOO_IMAGES.p4, cta: 'Reservar cita' },
    ],
    en: [
      { title: 'Chikitattoo', price: '€30.00', image: TATTOO_IMAGES.p1, cta: 'Book appointment' },
      { title: 'Full-Color Tattoo', price: '€100.00', image: TATTOO_IMAGES.p2, cta: 'Book appointment' },
      { title: 'Piercings', price: '€10–20', image: TATTOO_IMAGES.p3, cta: 'Book appointment' },
      { title: '20×10 cm color tattoo', price: '€150.00', image: TATTOO_IMAGES.p4, cta: 'Book appointment' },
    ],
  },
  reviews: {
    es: [
      { name: 'Thais', text: 'Mi sitio favorito para hacerme piercings. El trato es incomparable, todos muy profesionales.', stars: 5 },
      { name: 'Diana', text: 'No puedo estar más contenta. Desde el primer momento el trato fue increíble, cercano y profesional.', stars: 5 },
      { name: 'Tito Ortiz', text: 'Experiencia muy buena y totalmente recomendable por atención, limpieza y profesionalidad.', stars: 5 },
    ],
    en: [
      { name: 'Thais', text: 'My favorite place for piercings. Unmatched service and truly professional staff.', stars: 5 },
      { name: 'Diana', text: 'Could not be happier. Warm, close and professional from the very first moment.', stars: 5 },
      { name: 'Tito Ortiz', text: 'Great experience — highly recommended for care, cleanliness and professionalism.', stars: 5 },
    ],
  },
  addressEs: 'C. Alto del León, 8, Loc 1, Puente de Vallecas, 28038 Madrid',
  addressEn: 'C. Alto del León, 8, Loc 1, Puente de Vallecas, 28038 Madrid',
  hoursEs: 'Horario variable — consultar. Abre normalmente a las 17:00.',
  hoursEn: 'Variable hours — please call. Usually opens at 5:00 PM.',
  infoEs: 'Nueva etapa en local recién trasladado. Sin plantillas genéricas: cada pieza es tuya.',
  infoEn: 'New chapter in our freshly relocated studio. No generic flash — every piece is yours.',
  phone: '722 54 54 42',
  ratingLabelEs: '5.0 · 177 reseñas en Google',
  ratingLabelEn: '5.0 · 177 Google reviews',
  aboutEs: 'Royal Bang es el estudio de tatuajes, piercings y gemas dentales de Puente de Vallecas donde tu idea se convierte en arte de verdad. Sin rollos, sin plantillas genéricas: cada pieza es tuya y solo tuya.',
  aboutEn: 'Royal Bang is Puente de Vallecas tattoo, piercing and tooth gem studio where your idea becomes real art. No generic flash — every piece is uniquely yours.',
  accent: 'red',
  instagram: '@royalbang_tattoo',
  email: 'info@royalbangtattoo.com',
};

const CAFE_IMAGES = {
  hero: IMAGE_BANK.cafe.hero,
  gal1: IMAGE_BANK.cafe.gallery[0],
  gal2: IMAGE_BANK.cafe.gallery[1],
  gal3: IMAGE_BANK.cafe.gallery[2],
  gal4: IMAGE_BANK.cafe.gallery[3],
  gal5: IMAGE_BANK.cafe.gallery[4],
  gal6: IMAGE_BANK.cafe.gallery[5],
  m1: IMAGE_BANK.cafe.menu[0],
  m2: IMAGE_BANK.cafe.menu[1],
  m3: IMAGE_BANK.cafe.menu[2],
  m4: IMAGE_BANK.cafe.menu[3],
  m5: IMAGE_BANK.cafe.menu[3],
  m6: IMAGE_BANK.cafe.menu[2],
};

const ITALIAN_IMAGES = {
  hero: IMAGE_BANK.italian.hero,
  gal1: IMAGE_BANK.italian.gallery[0],
  gal2: IMAGE_BANK.italian.gallery[1],
  gal3: IMAGE_BANK.italian.gallery[2],
  gal4: IMAGE_BANK.italian.gallery[3],
  gal5: IMAGE_BANK.italian.gallery[4],
  gal6: IMAGE_BANK.italian.gallery[5],
  m1: IMAGE_BANK.italian.menu[0],
  m2: IMAGE_BANK.italian.menu[1],
  m3: IMAGE_BANK.italian.menu[2],
  m4: IMAGE_BANK.italian.menu[3],
};

export const ITALIAN_PROFILE: BusinessProfile = {
  variant: 'italian',
  heroImage: ITALIAN_IMAGES.hero,
  galleryImages: [
    ITALIAN_IMAGES.gal1, ITALIAN_IMAGES.gal2, ITALIAN_IMAGES.gal3,
    ITALIAN_IMAGES.gal4, ITALIAN_IMAGES.gal5, ITALIAN_IMAGES.gal6,
    ITALIAN_IMAGES.m1, ITALIAN_IMAGES.m2,
  ],
  taglineEs: 'Auténtica cocina italiana · Pasta fresca diaria',
  taglineEn: 'Authentic Italian cuisine · Fresh pasta daily',
  typeEs: 'Trattoria Italiana',
  typeEn: 'Italian Trattoria',
  badgeEs: 'Cocina casera · Vinos DOC',
  badgeEn: 'Home cooking · DOC wines',
  ctaPrimaryEs: 'Reservar mesa',
  ctaPrimaryEn: 'Book a table',
  ctaSecondaryEs: 'Ver carta',
  ctaSecondaryEn: 'View menu',
  menuItems: {
    es: [
      { title: 'Spaghetti alla Carbonara', price: '14,50 €', image: ITALIAN_IMAGES.m1, cta: 'Reservar mesa' },
      { title: 'Tagliatelle al ragù', price: '13,90 €', image: ITALIAN_IMAGES.m2, cta: 'Reservar mesa' },
      { title: 'Risotto ai funghi porcini', price: '15,50 €', image: ITALIAN_IMAGES.m3, cta: 'Ver carta' },
      { title: 'Pizza Margherita DOP', price: '11,90 €', image: ITALIAN_IMAGES.m4, cta: 'Ver carta' },
      { title: 'Saltimbocca alla romana', price: '18,90 €', image: ITALIAN_IMAGES.m1, cta: 'Ver carta' },
      { title: 'Tiramisù della casa', price: '6,50 €', image: ITALIAN_IMAGES.m2, cta: 'Ver carta' },
    ],
    en: [
      { title: 'Spaghetti alla Carbonara', price: '€14.50', image: ITALIAN_IMAGES.m1, cta: 'Book a table' },
      { title: 'Tagliatelle al ragù', price: '€13.90', image: ITALIAN_IMAGES.m2, cta: 'Book a table' },
      { title: 'Porcini mushroom risotto', price: '€15.50', image: ITALIAN_IMAGES.m3, cta: 'View menu' },
      { title: 'Margherita DOP pizza', price: '€11.90', image: ITALIAN_IMAGES.m4, cta: 'View menu' },
      { title: 'Saltimbocca alla romana', price: '€18.90', image: ITALIAN_IMAGES.m1, cta: 'View menu' },
      { title: 'House tiramisù', price: '€6.50', image: ITALIAN_IMAGES.m2, cta: 'View menu' },
    ],
  },
  reviews: {
    es: [
      { name: 'Luca B.', text: 'La carbonara es auténtica, cremosa y con el punto justo de pimienta. Ambiente acogedor y servicio impecable.', stars: 5 },
      { name: 'Elena M.', text: 'Pasta fresca hecha in situ. El risotto de setas porcini es espectacular. Volveremos sin duda.', stars: 5 },
      { name: 'Marco R.', text: 'Trattoria con alma italiana en Madrid. Buena carta de vinos y postres caseros. Muy recomendable.', stars: 5 },
    ],
    en: [
      { name: 'Luca B.', text: 'Authentic carbonara — creamy with the perfect pepper kick. Cozy atmosphere and flawless service.', stars: 5 },
      { name: 'Elena M.', text: 'Fresh pasta made on site. The porcini risotto is spectacular. We will definitely return.', stars: 5 },
      { name: 'Marco R.', text: 'A trattoria with real Italian soul in Madrid. Great wine list and homemade desserts. Highly recommended.', stars: 5 },
    ],
  },
  addressEs: 'Calle de Huertas 15, 28012 Madrid',
  addressEn: 'Calle de Huertas 15, 28012 Madrid',
  hoursEs: 'Martes – Domingo: 13:00 – 16:00 · 20:00 – 23:30',
  hoursEn: 'Tue – Sun: 1:00 PM – 4:00 PM · 8:00 PM – 11:30 PM',
  infoEs: 'Pasta fresca diaria · Vinos italianos DOC · Terraza',
  infoEn: 'Fresh pasta daily · Italian DOC wines · Terrace',
  phone: '91 429 18 76',
  ratingLabelEs: '4.8 · 312 reseñas verificadas',
  ratingLabelEn: '4.8 · 312 verified reviews',
  aboutEs: 'Trattoria de cocina italiana auténtica en el corazón de Madrid. Pasta fresca elaborada cada mañana, recetas de la nonna y una carta de vinos seleccionada de Toscana, Piamonte y Sicilia.',
  aboutEn: 'An authentic Italian trattoria in the heart of Madrid. Fresh pasta made every morning, nonna\'s recipes, and a wine list curated from Tuscany, Piedmont, and Sicily.',
  accent: 'gold',
  instagram: '@trattoriabella',
  email: 'reservas@trattoriabella.es',
};

export const CAFE_PROFILE: BusinessProfile = {
  variant: 'cafe',
  heroImage: CAFE_IMAGES.hero,
  galleryImages: [
    CAFE_IMAGES.gal1, CAFE_IMAGES.gal2, CAFE_IMAGES.gal3,
    CAFE_IMAGES.gal4, CAFE_IMAGES.gal5, CAFE_IMAGES.gal6,
    CAFE_IMAGES.m1, CAFE_IMAGES.m2,
  ],
  taglineEs: 'Restaurante & Terraza',
  taglineEn: 'Restaurant & Terrace',
  typeEs: 'Restaurante & Café',
  typeEn: 'Restaurant & Café',
  badgeEs: 'Terraza · Buenos cócteles',
  badgeEn: 'Terrace · Great cocktails',
  ctaPrimaryEs: 'Reservar mesa',
  ctaPrimaryEn: 'Book a table',
  ctaSecondaryEs: 'Ver carta',
  ctaSecondaryEn: 'View menu',
  menuItems: {
    es: [
      { title: 'Menú fin de semana', price: '18 € sin bebida', image: CAFE_IMAGES.m1, cta: 'Reservar mesa' },
      { title: 'Brunch & desayunos', price: '10-20 €', image: CAFE_IMAGES.m2, cta: 'Reservar mesa' },
      { title: 'Cócteles de autor', price: 'Desde 8 €', image: CAFE_IMAGES.m3, cta: 'Ver carta' },
      { title: 'Carta de tapas', price: '10-20 €', image: CAFE_IMAGES.m4, cta: 'Ver carta' },
      { title: 'Ensaladas & bowls', price: '12-16 €', image: CAFE_IMAGES.m5, cta: 'Ver carta' },
      { title: 'Postres caseros', price: '6-9 €', image: CAFE_IMAGES.m6, cta: 'Ver carta' },
    ],
    en: [
      { title: 'Weekend menu', price: '€18 excl. drinks', image: CAFE_IMAGES.m1, cta: 'Book a table' },
      { title: 'Brunch & breakfast', price: '€10-20', image: CAFE_IMAGES.m2, cta: 'Book a table' },
      { title: 'Signature cocktails', price: 'From €8', image: CAFE_IMAGES.m3, cta: 'View menu' },
      { title: 'Tapas menu', price: '€10-20', image: CAFE_IMAGES.m4, cta: 'View menu' },
      { title: 'Salads & bowls', price: '€12-16', image: CAFE_IMAGES.m5, cta: 'View menu' },
      { title: 'Homemade desserts', price: '€6-9', image: CAFE_IMAGES.m6, cta: 'View menu' },
    ],
  },
  reviews: {
    es: [
      { name: 'Andrea Cayetano', text: 'Local pequeño pero acogedor, con una terraza grande con jardines. Servicio atento y comida casera de calidad en Vallecas.', stars: 5 },
      { name: 'Miguel B.', text: 'Buen menú de fin de semana. La terraza es una maravilla, se está súper a gusto. Buena relación calidad-cantidad.', stars: 5 },
      { name: 'Pedro Aguado', text: 'Servicio agradable, detalle de gominolas de cortesía y una terraza exterior amplia. Muy recomendable.', stars: 5 },
    ],
    en: [
      { name: 'Andrea Cayetano', text: 'Small but cozy place with a large terrace and gardens. Attentive service and quality home cooking in Vallecas.', stars: 5 },
      { name: 'Miguel B.', text: 'Good weekend menu. The terrace is wonderful and very comfortable. Great value for money.', stars: 5 },
      { name: 'Pedro Aguado', text: 'Pleasant service, complimentary gummy bear touch and a spacious outdoor terrace. Highly recommended.', stars: 5 },
    ],
  },
  addressEs: 'C. de Sierra Toledana, 4 / 28038 Madrid, Vallecas',
  addressEn: 'C. de Sierra Toledana, 4 / 28038 Madrid, Vallecas',
  hoursEs: 'Lunes, Miércoles – Domingo: 13:00 – 00:00 · Viernes – Sábado hasta la 01:00',
  hoursEn: 'Mon, Wed – Sun: 1:00 PM – midnight · Fri – Sat until 1:00 AM',
  infoEs: 'Terraza con jardines · Accesible PMR · Para llevar',
  infoEn: 'Terrace with gardens · Wheelchair accessible · Takeaway',
  phone: '910 71 23 22',
  ratingLabelEs: '4.3 · 819 reseñas verificadas',
  ratingLabelEn: '4.3 · 819 verified reviews',
  aboutEs: 'Donde la tradición culinaria se encuentra con la innovación en un ambiente acogedor en Vallecas. Terraza con jardines, cócteles de autor y cocina casera.',
  aboutEn: 'Where culinary tradition meets innovation in a cozy Vallecas atmosphere. Garden terrace, signature cocktails and home-style cooking.',
  accent: 'indigo',
  instagram: '@restartcafe',
  email: 'info@restartcafe.com',
};

const FOOD_BLOG_IMAGES = {
  hero: IMAGE_BANK.foodblog.hero,
  p1: IMAGE_BANK.foodblog.posts[0],
  p2: IMAGE_BANK.foodblog.posts[1],
  p3: IMAGE_BANK.foodblog.posts[2],
  gal1: IMAGE_BANK.foodblog.gallery[0],
  gal2: IMAGE_BANK.foodblog.gallery[1],
  gal3: IMAGE_BANK.foodblog.gallery[2],
};

export const FOOD_BLOG_PROFILE: BusinessProfile = {
  variant: 'foodblog',
  heroImage: FOOD_BLOG_IMAGES.hero,
  galleryImages: [FOOD_BLOG_IMAGES.gal1, FOOD_BLOG_IMAGES.gal2, FOOD_BLOG_IMAGES.gal3, FOOD_BLOG_IMAGES.p1, FOOD_BLOG_IMAGES.p2, FOOD_BLOG_IMAGES.p3],
  taglineEs: 'Comida casera para la vida moderna',
  taglineEn: 'Home cooking for modern life',
  typeEs: 'Blog de recetas',
  typeEn: 'Recipe blog',
  badgeEs: 'Comidas y recetas',
  badgeEn: 'Meals & recipes',
  ctaPrimaryEs: 'Ver recetas',
  ctaPrimaryEn: 'View recipes',
  ctaSecondaryEs: 'Suscribirse',
  ctaSecondaryEn: 'Subscribe',
  menuItems: {
    es: [
      { title: 'Salsa de coliflor asada y ajo', price: '29/6/19', image: FOOD_BLOG_IMAGES.p1, cta: 'Leer más' },
      { title: 'Salmón asado con risotto de cebollín', price: '27/6/19', image: FOOD_BLOG_IMAGES.p2, cta: 'Leer más' },
      { title: 'Pescado a la parrilla con verduras', price: '25/6/19', image: FOOD_BLOG_IMAGES.p3, cta: 'Leer más' },
    ],
    en: [
      { title: 'Roasted cauliflower & garlic sauce', price: '6/29/19', image: FOOD_BLOG_IMAGES.p1, cta: 'Read more' },
      { title: 'Pan-roasted salmon with chive risotto', price: '6/27/19', image: FOOD_BLOG_IMAGES.p2, cta: 'Read more' },
      { title: 'Grilled fish with seasonal vegetables', price: '6/25/19', image: FOOD_BLOG_IMAGES.p3, cta: 'Read more' },
    ],
  },
  reviews: {
    es: [
      { name: 'Laura M.', text: 'Recetas sencillas y deliciosas. Ideal para cocinar entre semana sin complicaciones.', stars: 5 },
      { name: 'Carlos R.', text: 'Fotos preciosas y explicaciones claras. Mi blog de referencia de cocina casera.', stars: 5 },
    ],
    en: [
      { name: 'Laura M.', text: 'Simple, delicious recipes. Perfect for weekday cooking without fuss.', stars: 5 },
      { name: 'Carlos R.', text: 'Beautiful photos and clear steps. My go-to home cooking blog.', stars: 5 },
    ],
  },
  addressEs: 'Madrid, España',
  addressEn: 'Madrid, Spain',
  hoursEs: 'Nuevas recetas cada semana',
  hoursEn: 'New recipes every week',
  infoEs: 'Recetas · Newsletter · Tienda',
  infoEn: 'Recipes · Newsletter · Shop',
  phone: '',
  ratingLabelEs: 'Blog de cocina casera',
  ratingLabelEn: 'Home cooking blog',
  aboutEs: 'Con la gran practicidad de la vida moderna, muchos de nosotros solo podemos usar un microondas. Disfrutar una comida casera no es un lujo, ¡cualquiera puede hacerlo!',
  aboutEn: 'With the practicality of modern life, many of us only have a microwave to hand. Enjoying a home-cooked meal is not a luxury — anyone can do it!',
  accent: 'rose',
  instagram: '@stantonrecipes',
  email: 'hola@stantonrecipes.com',
};

const BEAUTY_IMAGES = {
  hero: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1400&h=800&fit=crop',
  gal1: 'https://images.pexels.com/photos/3992858/pexels-photo-3992858.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal2: 'https://images.pexels.com/photos/373834/pexels-photo-373834.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal3: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal4: 'https://images.pexels.com/photos/3992219/pexels-photo-3992219.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal5: 'https://images.pexels.com/photos/3992876/pexels-photo-3992876.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal6: 'https://images.pexels.com/photos/3992870/pexels-photo-3992870.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  s1: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  s2: 'https://images.pexels.com/photos/373834/pexels-photo-373834.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  s3: 'https://images.pexels.com/photos/3992876/pexels-photo-3992876.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  s4: 'https://images.pexels.com/photos/3992219/pexels-photo-3992219.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
};

export const BEAUTY_PROFILE: BusinessProfile = {
  variant: 'beauty',
  heroImage: BEAUTY_IMAGES.hero,
  galleryImages: [BEAUTY_IMAGES.gal1, BEAUTY_IMAGES.gal2, BEAUTY_IMAGES.gal3, BEAUTY_IMAGES.gal4, BEAUTY_IMAGES.gal5, BEAUTY_IMAGES.gal6],
  taglineEs: 'Salón de belleza de lujo',
  taglineEn: 'Luxury beauty salon',
  typeEs: 'Salón de Belleza',
  typeEn: 'Beauty Salon',
  badgeEs: 'Estilistas expertos · Productos premium',
  badgeEn: 'Expert stylists · Premium products',
  ctaPrimaryEs: 'Reservar cita',
  ctaPrimaryEn: 'Book appointment',
  ctaSecondaryEs: 'Ver servicios',
  ctaSecondaryEn: 'View services',
  menuItems: {
    es: [
      { title: 'Corte & Peinado', price: 'Desde 35 €', image: BEAUTY_IMAGES.s1, cta: 'Reservar cita' },
      { title: 'Coloración', price: 'Desde 55 €', image: BEAUTY_IMAGES.s2, cta: 'Reservar cita' },
      { title: 'Tratamientos capilares', price: 'Desde 45 €', image: BEAUTY_IMAGES.s3, cta: 'Reservar cita' },
      { title: 'Manicura & Pedicura', price: 'Desde 25 €', image: BEAUTY_IMAGES.s4, cta: 'Reservar cita' },
    ],
    en: [
      { title: 'Cut & Styling', price: 'From €35', image: BEAUTY_IMAGES.s1, cta: 'Book appointment' },
      { title: 'Color', price: 'From €55', image: BEAUTY_IMAGES.s2, cta: 'Book appointment' },
      { title: 'Hair treatments', price: 'From €45', image: BEAUTY_IMAGES.s3, cta: 'Book appointment' },
      { title: 'Manicure & Pedicure', price: 'From €25', image: BEAUTY_IMAGES.s4, cta: 'Book appointment' },
    ],
  },
  reviews: {
    es: [
      { name: 'Laura M.', text: 'El mejor salón de Madrid. Me hicieron un balayage perfecto y el trato fue exquisito.', stars: 5 },
      { name: 'Carmen R.', text: 'Ambiente relajante, productos de primera y estilistas que saben lo que hacen. Repetiré sin duda.', stars: 5 },
      { name: 'Sofía G.', text: 'Reservé online y todo fue rapidísimo. Salí con un peinado de revista.', stars: 5 },
    ],
    en: [
      { name: 'Laura M.', text: 'The best salon in Madrid. Perfect balayage and exquisite service.', stars: 5 },
      { name: 'Carmen R.', text: 'Relaxing atmosphere, top products and stylists who know their craft.', stars: 5 },
      { name: 'Sofía G.', text: 'Booked online and everything was seamless. Left with a magazine-worthy look.', stars: 5 },
    ],
  },
  addressEs: 'Madrid, España',
  addressEn: 'Madrid, Spain',
  hoursEs: 'Martes – Sábado: 10:00 – 20:00 · Domingo y Lunes: cerrado',
  hoursEn: 'Tue – Sat: 10:00 AM – 8:00 PM · Sun & Mon: closed',
  infoEs: 'Productos premium · Reserva online · Parking cercano',
  infoEn: 'Premium products · Online booking · Nearby parking',
  phone: '910 00 00 00',
  ratingLabelEs: '4.9 · 312 reseñas verificadas',
  ratingLabelEn: '4.9 · 312 verified reviews',
  aboutEs: 'Un espacio donde la belleza se encuentra con la excelencia. Nuestros estilistas combinan técnica, tendencia y un trato personalizado para realzar tu estilo.',
  aboutEn: 'A space where beauty meets excellence. Our stylists combine technique, trend and personalized care to enhance your style.',
  accent: 'rose',
  instagram: '@estilobelleza',
  email: 'info@estilobelleza.com',
};

const CORPORATE_IMAGES = {
  hero: 'https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
  gal1: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal2: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal3: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal4: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal5: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal6: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
};

export const CORPORATE_PROFILE: BusinessProfile = {
  variant: 'corporate',
  heroImage: CORPORATE_IMAGES.hero,
  galleryImages: [CORPORATE_IMAGES.gal1, CORPORATE_IMAGES.gal2, CORPORATE_IMAGES.gal3, CORPORATE_IMAGES.gal4, CORPORATE_IMAGES.gal5, CORPORATE_IMAGES.gal6],
  taglineEs: 'Gestoría y asesoría estratégica para empresas, autónomos y particulares que buscan crecer con seguridad.',
  taglineEn: 'Strategic advisory for companies, freelancers and individuals who want to grow with confidence.',
  typeEs: 'Asesoría Fiscal, Laboral y Contable',
  typeEn: 'Tax, Labor & Accounting Advisory',
  badgeEs: 'Madrid · Desde 1991',
  badgeEn: 'Madrid · Since 1991',
  ctaPrimaryEs: 'Solicitar asesoramiento',
  ctaPrimaryEn: 'Request advisory',
  ctaSecondaryEs: 'Conocer nuestros servicios',
  ctaSecondaryEn: 'Explore our services',
  menuItems: {
    es: [
      { title: 'Asesoría Fiscal', price: 'Autónomos y empresas', image: CORPORATE_IMAGES.gal1, cta: 'Más información' },
      { title: 'Asesoría Laboral', price: 'Nóminas y contratos', image: CORPORATE_IMAGES.gal2, cta: 'Más información' },
      { title: 'Asesoría Contable', price: 'Cuentas anuales', image: CORPORATE_IMAGES.gal3, cta: 'Más información' },
    ],
    en: [
      { title: 'Tax Advisory', price: 'Freelancers & companies', image: CORPORATE_IMAGES.gal1, cta: 'Learn more' },
      { title: 'Labor Advisory', price: 'Payroll & contracts', image: CORPORATE_IMAGES.gal2, cta: 'Learn more' },
      { title: 'Accounting', price: 'Annual accounts', image: CORPORATE_IMAGES.gal3, cta: 'Learn more' },
    ],
  },
  reviews: {
    es: [
      { name: 'Antonio G.', text: 'Llevamos más de 10 años con ellos. Profesionales, cercanos y siempre al día de la normativa.', stars: 5 },
      { name: 'María P.', text: 'Me ayudaron a montar mi autónomo en un día. Trato excelente y precios justos.', stars: 5 },
      { name: 'Roberto S.', text: 'Asesoría de confianza en Vallecas. Responden rápido y explican todo con claridad.', stars: 5 },
    ],
    en: [
      { name: 'Antonio G.', text: 'We have been with them for over 10 years. Professional, approachable and always up to date.', stars: 5 },
      { name: 'María P.', text: 'They helped me set up my freelance business in one day. Excellent service and fair prices.', stars: 5 },
      { name: 'Roberto S.', text: 'Trusted advisory in Vallecas. Fast responses and clear explanations.', stars: 5 },
    ],
  },
  addressEs: 'C. Alto del León, 12, 28038 Madrid, Puente de Vallecas',
  addressEn: 'C. Alto del León, 12, 28038 Madrid, Puente de Vallecas',
  hoursEs: 'Lunes – Viernes: 9:00 – 18:00',
  hoursEn: 'Mon – Fri: 9:00 AM – 6:00 PM',
  infoEs: 'Autónomos · PYMES · Gestión integral',
  infoEn: 'Freelancers · SMEs · Full management',
  phone: '917 77 00 00',
  ratingLabelEs: '4.8 · 156 reseñas en Google',
  ratingLabelEn: '4.8 · 156 Google reviews',
  aboutEs: 'Más de 30 años asesorando a autónomos y pequeñas empresas en Madrid. Fiscal, laboral y contable con un trato cercano y profesional.',
  aboutEn: 'Over 30 years advising freelancers and small businesses in Madrid. Tax, labor and accounting with a professional, personal touch.',
  accent: 'blue',
  instagram: '@camponasesores',
  email: 'info@camponasesores.com',
};

const AUTO_IMAGES = {
  hero: 'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilot-163210.jpeg?auto=compress&cs=tinysrgb&w=1400&h=800&fit=crop',
  gal1: 'https://images.pexels.com/photos/2116473/pexels-photo-2116473.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal2: 'https://images.pexels.com/photos/2393835/pexels-photo-2393835.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal3: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal4: 'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilot-163210.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal5: 'https://images.pexels.com/photos/2116473/pexels-photo-2116473.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal6: 'https://images.pexels.com/photos/2393835/pexels-photo-2393835.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  s1: 'https://images.pexels.com/photos/2116473/pexels-photo-2116473.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  s2: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  s3: 'https://images.pexels.com/photos/2393835/pexels-photo-2393835.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  s4: 'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilot-163210.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
};

export const AUTOMOTIVE_PROFILE: BusinessProfile = {
  variant: 'automotive',
  heroImage: AUTO_IMAGES.hero,
  galleryImages: [AUTO_IMAGES.gal1, AUTO_IMAGES.gal2, AUTO_IMAGES.gal3, AUTO_IMAGES.gal4, AUTO_IMAGES.gal5, AUTO_IMAGES.gal6],
  taglineEs: 'Concesionario Oficial · Venta, taller y recambios',
  taglineEn: 'Official Dealer · Sales, workshop & parts',
  typeEs: 'Concesionario de Motos',
  typeEn: 'Motorcycle Dealer',
  badgeEs: 'Concesionario Oficial · +40 años',
  badgeEn: 'Official Dealer · 40+ years',
  ctaPrimaryEs: 'Ver modelos',
  ctaPrimaryEn: 'View models',
  ctaSecondaryEs: 'Pedir cita taller',
  ctaSecondaryEn: 'Book service',
  menuItems: {
    es: [
      { title: 'Motos nuevas', price: 'Financiación disponible', image: AUTO_IMAGES.s1, cta: 'Ver catálogo' },
      { title: 'Taller oficial', price: 'Mecánicos certificados', image: AUTO_IMAGES.s2, cta: 'Pedir cita' },
      { title: 'Recambios originales', price: 'Stock permanente', image: AUTO_IMAGES.s3, cta: 'Consultar' },
      { title: 'Accesorios & equipamiento', price: 'Casco, chaquetas y más', image: AUTO_IMAGES.s4, cta: 'Ver tienda' },
    ],
    en: [
      { title: 'New motorcycles', price: 'Financing available', image: AUTO_IMAGES.s1, cta: 'View catalog' },
      { title: 'Official workshop', price: 'Certified mechanics', image: AUTO_IMAGES.s2, cta: 'Book service' },
      { title: 'Genuine parts', price: 'Permanent stock', image: AUTO_IMAGES.s3, cta: 'Enquire' },
      { title: 'Accessories & gear', price: 'Helmets, jackets & more', image: AUTO_IMAGES.s4, cta: 'View shop' },
    ],
  },
  reviews: {
    es: [
      { name: 'Carlos M.', text: 'Compré mi MT-09 aquí. Trato impecable, financiación clara y entrega en el día. Taller de confianza.', stars: 5 },
      { name: 'David L.', text: 'Más de 20 años llevando la moto al taller. Siempre bien atendido y precios honestos.', stars: 5 },
      { name: 'Jorge R.', text: 'El mejor concesionario de la zona. Personal apasionado que conoce cada modelo al detalle.', stars: 5 },
    ],
    en: [
      { name: 'Carlos M.', text: 'Bought my MT-09 here. Impeccable service, clear financing and same-day delivery.', stars: 5 },
      { name: 'David L.', text: 'Over 20 years bringing my bike here for service. Always well treated and fair prices.', stars: 5 },
      { name: 'Jorge R.', text: 'The best dealer in the area. Passionate staff who know every model inside out.', stars: 5 },
    ],
  },
  addressEs: 'Plaza del Dr. Lozano, 14, 28038 Madrid, Puente de Vallecas',
  addressEn: 'Plaza del Dr. Lozano, 14, 28038 Madrid, Puente de Vallecas',
  hoursEs: 'Lunes – Viernes: 9:30 – 19:00 · Sábado: 10:00 – 14:00',
  hoursEn: 'Mon – Fri: 9:30 AM – 7:00 PM · Sat: 10:00 AM – 2:00 PM',
  infoEs: 'Venta · Taller · Recambios · Segunda mano',
  infoEn: 'Sales · Workshop · Parts · Pre-owned',
  phone: '915 52 13 08',
  ratingLabelEs: '4.7 · 1.282 reseñas en Google',
  ratingLabelEn: '4.7 · 1,282 Google reviews',
  aboutEs: 'Tu moto empieza aquí. Concesionario oficial con más de 40 años cuidando cada Yamaha en Puente de Vallecas.',
  aboutEn: 'Your ride starts here. Official dealer with 40+ years caring for every bike in Puente de Vallecas.',
  accent: 'red',
  instagram: '@motoscortes',
  email: 'info@motoscortes.com',
};

const BIKE_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1600&h=900&fit=crop&q=80',
  gal1: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=900&h=600&fit=crop&q=80',
  gal2: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=900&h=600&fit=crop&q=80',
  gal3: 'https://images.unsplash.com/photo-1511994298241-608b331cdf63?w=900&h=600&fit=crop&q=80',
  gal4: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=600&fit=crop&q=80',
  gal5: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal6: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  s1: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=600&h=400&fit=crop&q=80',
  s2: 'https://images.unsplash.com/photo-1505705694340-019e1e335916?w=600&h=400&fit=crop&q=80',
  s3: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=400&fit=crop&q=80',
  s4: 'https://images.unsplash.com/photo-1471506480208-7e4859c702a9?w=600&h=400&fit=crop&q=80',
};

export const BIKE_PROFILE: BusinessProfile = {
  variant: 'bike',
  heroImage: BIKE_IMAGES.hero,
  galleryImages: [BIKE_IMAGES.gal1, BIKE_IMAGES.gal2, BIKE_IMAGES.gal3, BIKE_IMAGES.gal4, BIKE_IMAGES.gal5, BIKE_IMAGES.gal6],
  taglineEs: 'Catálogo profesional · Taller · WhatsApp',
  taglineEn: 'Professional catalogue · Workshop · WhatsApp',
  typeEs: 'Tienda de bicicletas',
  typeEn: 'Bicycle shop',
  badgeEs: 'Especialistas en ciclismo',
  badgeEn: 'Cycling specialists',
  ctaPrimaryEs: 'Ver bicicletas',
  ctaPrimaryEn: 'View bikes',
  ctaSecondaryEs: 'WhatsApp',
  ctaSecondaryEn: 'WhatsApp',
  menuItems: {
    es: [
      { title: 'MTB', price: 'Montaña', image: BIKE_IMAGES.s1, cta: 'Ver modelos' },
      { title: 'Carretera', price: 'Rendimiento', image: BIKE_IMAGES.s2, cta: 'Ver modelos' },
      { title: 'E-Bike', price: 'Asistencia', image: BIKE_IMAGES.s3, cta: 'Ver modelos' },
      { title: 'Accesorios', price: 'Equipamiento', image: BIKE_IMAGES.s4, cta: 'Ver catálogo' },
    ],
    en: [
      { title: 'MTB', price: 'Mountain', image: BIKE_IMAGES.s1, cta: 'View models' },
      { title: 'Road', price: 'Performance', image: BIKE_IMAGES.s2, cta: 'View models' },
      { title: 'E-Bike', price: 'Assisted', image: BIKE_IMAGES.s3, cta: 'View models' },
      { title: 'Accessories', price: 'Gear', image: BIKE_IMAGES.s4, cta: 'View catalogue' },
    ],
  },
  reviews: {
    es: [
      { name: 'Carlos M.', text: 'Excelente atención desde el primer momento. El mejor taller de la zona.', stars: 5 },
      { name: 'Laura P.', text: 'Grandes profesionales. La bicicleta llegó perfectamente ajustada.', stars: 5 },
      { name: 'Jorge R.', text: 'Volvería sin dudarlo. Asesoramiento real de ciclistas.', stars: 5 },
    ],
    en: [
      { name: 'Carlos M.', text: 'Excellent service from the first moment. Best workshop in the area.', stars: 5 },
      { name: 'Laura P.', text: 'True professionals. Bike arrived perfectly tuned.', stars: 5 },
      { name: 'Jorge R.', text: 'Would return without hesitation. Real cyclist advice.', stars: 5 },
    ],
  },
  addressEs: 'España',
  addressEn: 'Spain',
  hoursEs: 'Lunes – Sábado: consulta en tienda',
  hoursEn: 'Mon – Sat: in-store',
  infoEs: 'Catálogo · Taller · Accesorios · Sin carrito online',
  infoEn: 'Catalogue · Workshop · Accessories · No online cart',
  phone: '',
  ratingLabelEs: 'Especialistas en ciclismo',
  ratingLabelEn: 'Cycling specialists',
  aboutEs: 'Pasión por el ciclismo. Catálogo con precios claros y contacto por WhatsApp. Visita la tienda física.',
  aboutEn: 'Passion for cycling. Clear-price catalogue and WhatsApp contact. Visit the physical store.',
  accent: 'indigo',
  email: 'info@bikeshop.es',
};

const LUXURY_IMAGES = {
  hero: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1400&h=800&fit=crop',
  gal1: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal2: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  gal3: 'https://images.pexels.com/photos/6248864/pexels-photo-6248864.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
};

export const LUXURY_PROFILE: BusinessProfile = {
  variant: 'luxury',
  heroImage: LUXURY_IMAGES.hero,
  galleryImages: [LUXURY_IMAGES.gal1, LUXURY_IMAGES.gal2, LUXURY_IMAGES.gal3],
  taglineEs: 'Alta cocina · Experiencia gastronómica',
  taglineEn: 'Fine dining · Gastronomic experience',
  typeEs: 'Restaurante Gourmet',
  typeEn: 'Fine Dining Restaurant',
  badgeEs: 'Reservas recomendadas',
  badgeEn: 'Reservations recommended',
  ctaPrimaryEs: 'Reservar mesa',
  ctaPrimaryEn: 'Book a table',
  ctaSecondaryEs: 'Ver menú degustación',
  ctaSecondaryEn: 'Tasting menu',
  menuItems: {
    es: [
      { title: 'Menú degustación', price: '95 €', image: LUXURY_IMAGES.gal1, cta: 'Reservar' },
      { title: 'Carta de autor', price: '45–80 €', image: LUXURY_IMAGES.gal2, cta: 'Ver carta' },
      { title: 'Maridaje premium', price: 'Desde 35 €', image: LUXURY_IMAGES.gal3, cta: 'Consultar' },
    ],
    en: [
      { title: 'Tasting menu', price: '€95', image: LUXURY_IMAGES.gal1, cta: 'Book' },
      { title: 'Signature menu', price: '€45–80', image: LUXURY_IMAGES.gal2, cta: 'View menu' },
      { title: 'Premium pairing', price: 'From €35', image: LUXURY_IMAGES.gal3, cta: 'Enquire' },
    ],
  },
  reviews: {
    es: [
      { name: 'Elena V.', text: 'Una experiencia inolvidable. Cada plato es una obra de arte y el servicio impecable.', stars: 5 },
      { name: 'Roberto M.', text: 'El mejor restaurante de la ciudad. Ambiente íntimo y cocina de altísimo nivel.', stars: 5 },
      { name: 'Isabel T.', text: 'Perfecto para una ocasión especial. El menú degustación superó expectativas.', stars: 5 },
    ],
    en: [
      { name: 'Elena V.', text: 'An unforgettable experience. Every dish is a work of art and service is flawless.', stars: 5 },
      { name: 'Roberto M.', text: 'The best restaurant in the city. Intimate atmosphere and top-level cuisine.', stars: 5 },
      { name: 'Isabel T.', text: 'Perfect for a special occasion. The tasting menu exceeded expectations.', stars: 5 },
    ],
  },
  addressEs: 'Madrid, España',
  addressEn: 'Madrid, Spain',
  hoursEs: 'Martes – Sábado: 13:30 – 16:00 · 20:30 – 23:30',
  hoursEn: 'Tue – Sat: 1:30 – 4:00 PM · 8:30 – 11:30 PM',
  infoEs: 'Código de vestimenta smart casual · Reserva obligatoria',
  infoEn: 'Smart casual dress code · Reservation required',
  phone: '910 00 00 00',
  ratingLabelEs: '4.9 · 428 reseñas',
  ratingLabelEn: '4.9 · 428 reviews',
  aboutEs: 'Donde la tradición culinaria se encuentra con la innovación. Un espacio íntimo para vivir la alta gastronomía con todos los sentidos.',
  aboutEn: 'Where culinary tradition meets innovation. An intimate space to experience fine dining with all your senses.',
  accent: 'gold',
  email: 'reservas@lamaisondoree.com',
};

const JEWELRY_IMAGES = {
  hero: 'https://images.pexels.com/photos/2779107/pexels-photo-2779107.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
  gal1: 'https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  gal2: 'https://images.pexels.com/photos/1573407/pexels-photo-1573407.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  gal3: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  gal4: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  gal5: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  gal6: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  p1: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  p2: 'https://images.pexels.com/photos/2779107/pexels-photo-2779107.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  p3: 'https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  p4: 'https://images.pexels.com/photos/1573407/pexels-photo-1573407.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  p5: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  p6: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
};

const FASHION_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&h=1080&q=80',
  p1: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
  p2: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
  p3: 'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
  p4: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
  p5: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
  p6: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
  gal1: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&h=1000&q=80',
  gal2: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&h=1000&q=80',
  gal3: 'https://images.pexels.com/photos/2983468/pexels-photo-2983468.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
};

export const FASHION_PROFILE: BusinessProfile = {
  variant: 'fashion',
  heroImage: FASHION_IMAGES.hero,
  galleryImages: [FASHION_IMAGES.gal1, FASHION_IMAGES.gal2, FASHION_IMAGES.gal3, FASHION_IMAGES.p1, FASHION_IMAGES.p2, FASHION_IMAGES.p3],
  taglineEs: 'Moda internacional con diseño editorial, envíos premium y checkout seguro.',
  taglineEn: 'International fashion with editorial design, premium shipping and secure checkout.',
  typeEs: 'Moda & eCommerce Premium',
  typeEn: 'Premium Fashion eCommerce',
  badgeEs: 'Nueva colección · Envío express',
  badgeEn: 'New collection · Express shipping',
  ctaPrimaryEs: 'Comprar ahora',
  ctaPrimaryEn: 'Shop now',
  ctaSecondaryEs: 'Nueva colección',
  ctaSecondaryEn: 'New collection',
  menuItems: {
    es: [
      { title: 'Abrigo lana premium', price: '289 €', image: FASHION_IMAGES.p1, cta: 'Añadir al carrito' },
      { title: 'Vestido satinado negro', price: '195 €', image: FASHION_IMAGES.p2, cta: 'Añadir al carrito' },
      { title: 'Blazer estructura arena', price: '245 €', image: FASHION_IMAGES.p3, cta: 'Añadir al carrito' },
      { title: 'Pantalón wide leg', price: '129 €', image: FASHION_IMAGES.p4, cta: 'Añadir al carrito' },
      { title: 'Bolso piel champagne', price: '420 €', image: FASHION_IMAGES.p5, cta: 'Añadir al carrito' },
      { title: 'Zapatillas cuero blanco', price: '165 €', image: FASHION_IMAGES.p6, cta: 'Añadir al carrito' },
    ],
    en: [
      { title: 'Premium wool coat', price: '€289', image: FASHION_IMAGES.p1, cta: 'Add to bag' },
      { title: 'Black satin dress', price: '€195', image: FASHION_IMAGES.p2, cta: 'Add to bag' },
      { title: 'Sand structured blazer', price: '€245', image: FASHION_IMAGES.p3, cta: 'Add to bag' },
      { title: 'Wide leg trousers', price: '€129', image: FASHION_IMAGES.p4, cta: 'Add to bag' },
      { title: 'Champagne leather bag', price: '€420', image: FASHION_IMAGES.p5, cta: 'Add to bag' },
      { title: 'White leather sneakers', price: '€165', image: FASHION_IMAGES.p6, cta: 'Add to bag' },
    ],
  },
  reviews: {
    es: [
      { name: 'Lucía M.', text: 'Calidad excepcional y entrega en 24h. La experiencia de compra se siente de lujo.', stars: 5 },
      { name: 'Carlos R.', text: 'Diseño impecable y checkout rapidísimo con Stripe. Repetiré sin duda.', stars: 5 },
      { name: 'Elena S.', text: 'Por fin una tienda online que transmite confianza y exclusividad.', stars: 5 },
    ],
    en: [
      { name: 'Lucía M.', text: 'Exceptional quality and 24h delivery. The shopping experience feels luxurious.', stars: 5 },
      { name: 'Carlos R.', text: 'Impeccable design and lightning-fast Stripe checkout. Will shop again.', stars: 5 },
      { name: 'Elena S.', text: 'Finally an online store that conveys trust and exclusivity.', stars: 5 },
    ],
  },
  addressEs: 'Madrid · Envíos internacionales',
  addressEn: 'Madrid · International shipping',
  hoursEs: 'Atención online 24/7',
  hoursEn: 'Online support 24/7',
  infoEs: 'Devoluciones 30 días · Pago seguro Stripe',
  infoEn: '30-day returns · Secure Stripe payments',
  phone: '910 00 00 00',
  ratingLabelEs: '4.9 · 2.400+ reseñas',
  ratingLabelEn: '4.9 · 2,400+ reviews',
  aboutEs:
    'Maison de moda internacional con estética editorial minimalista. Curamos piezas atemporales con la precisión de las grandes firmas, combinando fotografía de campaña, UX de conversión y tecnología de pago de nivel enterprise.',
  aboutEn:
    'International fashion maison with minimalist editorial aesthetics. We curate timeless pieces with the precision of global luxury houses, combining campaign photography, conversion UX and enterprise-grade payments.',
  accent: 'gold',
  email: 'hello@maisonmode.com',
};

export const JEWELRY_PROFILE: BusinessProfile = {
  variant: 'jewelry',
  heroImage: JEWELRY_IMAGES.hero,
  galleryImages: [
    JEWELRY_IMAGES.gal1,
    JEWELRY_IMAGES.gal2,
    JEWELRY_IMAGES.gal3,
    JEWELRY_IMAGES.gal4,
    JEWELRY_IMAGES.gal5,
    JEWELRY_IMAGES.gal6,
  ],
  taglineEs: 'Alta relojería y joyería de autor · Desde 1989',
  taglineEn: 'Haute horlogerie and author jewelry · Since 1989',
  typeEs: 'Joyería & Relojería de Lujo',
  typeEn: 'Luxury Jewelry & Watches',
  badgeEs: 'Distribuidor autorizado · Cita privada',
  badgeEn: 'Authorized dealer · Private appointment',
  ctaPrimaryEs: 'Reservar cita privada',
  ctaPrimaryEn: 'Book private appointment',
  ctaSecondaryEs: 'Descubrir colección',
  ctaSecondaryEn: 'Discover collection',
  menuItems: {
    es: [
      { title: 'Rolex Submariner Date', price: 'Desde 12.500 €', image: JEWELRY_IMAGES.p1, cta: 'Descubrir' },
      { title: 'Omega Speedmaster', price: 'Desde 7.800 €', image: JEWELRY_IMAGES.p2, cta: 'Descubrir' },
      { title: 'Anillo diamante solitario', price: 'Desde 4.200 €', image: JEWELRY_IMAGES.p3, cta: 'Descubrir' },
      { title: 'Cartier Tank Must', price: 'Desde 3.950 €', image: JEWELRY_IMAGES.p4, cta: 'Descubrir' },
      { title: 'Collar oro 18k', price: 'Desde 2.100 €', image: JEWELRY_IMAGES.p5, cta: 'Descubrir' },
      { title: 'Breitling Navitimer', price: 'Desde 8.400 €', image: JEWELRY_IMAGES.p6, cta: 'Descubrir' },
    ],
    en: [
      { title: 'Rolex Submariner Date', price: 'From €12,500', image: JEWELRY_IMAGES.p1, cta: 'Discover' },
      { title: 'Omega Speedmaster', price: 'From €7,800', image: JEWELRY_IMAGES.p2, cta: 'Discover' },
      { title: 'Solitaire diamond ring', price: 'From €4,200', image: JEWELRY_IMAGES.p3, cta: 'Discover' },
      { title: 'Cartier Tank Must', price: 'From €3,950', image: JEWELRY_IMAGES.p4, cta: 'Discover' },
      { title: '18k gold necklace', price: 'From €2,100', image: JEWELRY_IMAGES.p5, cta: 'Discover' },
      { title: 'Breitling Navitimer', price: 'From €8,400', image: JEWELRY_IMAGES.p6, cta: 'Discover' },
    ],
  },
  reviews: {
    es: [
      { name: 'Elena M.', text: 'Compré mi Rolex aquí. Trato impecable, autenticidad garantizada y una experiencia digna de las mejores boutiques de Europa.', stars: 5 },
      { name: 'Carlos R.', text: 'Restauraron un reloj de mi abuelo con un acabado espectacular. Profesionalidad y confianza absoluta.', stars: 5 },
      { name: 'Isabel V.', text: 'El anillo de compromiso superó todas mis expectativas. Asesoramiento personalizado de primer nivel.', stars: 5 },
    ],
    en: [
      { name: 'Elena M.', text: 'I bought my Rolex here. Impeccable service, guaranteed authenticity and an experience worthy of Europe\'s finest boutiques.', stars: 5 },
      { name: 'Carlos R.', text: 'They restored my grandfather\'s watch with spectacular finish. Absolute professionalism and trust.', stars: 5 },
      { name: 'Isabel V.', text: 'The engagement ring exceeded all expectations. First-class personal advisory.', stars: 5 },
    ],
  },
  addressEs: 'Calle Serrano 45, 28001 Madrid',
  addressEn: '45 Serrano Street, 28001 Madrid',
  hoursEs: 'Lunes – Sábado: 10:00 – 20:00 · Cita previa recomendada',
  hoursEn: 'Mon – Sat: 10:00 AM – 8:00 PM · Appointment recommended',
  infoEs: 'Distribuidor autorizado · Taller propio · Financiación disponible',
  infoEn: 'Authorized dealer · In-house workshop · Financing available',
  phone: '910 88 22 00',
  ratingLabelEs: '5.0 · 312 reseñas Google',
  ratingLabelEn: '5.0 · 312 Google reviews',
  aboutEs: 'Desde 1989, nuestra boutique reúne la pasión por la alta relojería suiza y la joyería de autor. Cada pieza es seleccionada con el mismo rigor que las grandes maisons de Ginebra y París. Creemos en la artesanía, la autenticidad y en crear momentos irrepetibles.',
  aboutEn: 'Since 1989, our boutique has united passion for Swiss haute horlogerie and author jewelry. Every piece is selected with the same rigor as the great Geneva and Paris maisons. We believe in craftsmanship, authenticity and creating unforgettable moments.',
  accent: 'gold',
  email: 'boutique@atelierjoyas.com',
};

const RENEWABLE_IMAGES = {
  hero: 'https://images.pexels.com/photos/9875446/pexels-photo-9875446.jpeg?auto=compress&cs=tinysrgb&w=1400&h=800&fit=crop',
  gal1: 'https://images.pexels.com/photos/159397/solar-roof-power-159397.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal2: 'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal3: 'https://images.pexels.com/photos/159243/solar-panel-array-power-sun-electricity-159243.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal4: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal5: 'https://images.pexels.com/photos/3860202/pexels-photo-3860202.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  gal6: 'https://images.pexels.com/photos/356049/pexels-photo-356049.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  s1: 'https://images.pexels.com/photos/159397/solar-roof-power-159397.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  s2: 'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  s3: 'https://images.pexels.com/photos/159243/solar-panel-array-power-sun-electricity-159243.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  s4: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  s5: 'https://images.pexels.com/photos/3860202/pexels-photo-3860202.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
};

export const RENEWABLE_PROFILE: BusinessProfile = {
  variant: 'renewable',
  heroImage: RENEWABLE_IMAGES.hero,
  galleryImages: [RENEWABLE_IMAGES.gal1, RENEWABLE_IMAGES.gal2, RENEWABLE_IMAGES.gal3, RENEWABLE_IMAGES.gal4, RENEWABLE_IMAGES.gal5, RENEWABLE_IMAGES.gal6],
  taglineEs: 'Impulsamos el futuro con energía limpia, ahorro y autonomía para hogares y empresas.',
  taglineEn: 'Powering the future with clean energy, savings and independence for homes and businesses.',
  typeEs: 'Energías Renovables & Solar',
  typeEn: 'Renewable Energy & Solar',
  badgeEs: 'Instalador certificado · Autoconsumo · EV',
  badgeEn: 'Certified installer · Self-consumption · EV',
  ctaPrimaryEs: 'Solicitar estudio gratuito',
  ctaPrimaryEn: 'Request free assessment',
  ctaSecondaryEs: 'Ver servicios',
  ctaSecondaryEn: 'View services',
  menuItems: {
    es: [
      { title: 'Energía Solar Fotovoltaica', price: 'Autoconsumo residencial y industrial', image: RENEWABLE_IMAGES.s1, cta: 'Más información' },
      { title: 'Baterías y Almacenamiento', price: 'Independencia energética 24/7', image: RENEWABLE_IMAGES.s3, cta: 'Más información' },
      { title: 'Puntos de Recarga EV', price: 'Wallbox y carga doméstica', image: RENEWABLE_IMAGES.s2, cta: 'Más información' },
      { title: 'Eficiencia Energética', price: 'Auditorías y optimización', image: RENEWABLE_IMAGES.s4, cta: 'Más información' },
      { title: 'Mantenimiento e Instalaciones', price: 'Monitorización y soporte técnico', image: RENEWABLE_IMAGES.s5, cta: 'Más información' },
    ],
    en: [
      { title: 'Solar Photovoltaic Energy', price: 'Residential & industrial self-consumption', image: RENEWABLE_IMAGES.s1, cta: 'Learn more' },
      { title: 'Batteries & Storage', price: '24/7 energy independence', image: RENEWABLE_IMAGES.s3, cta: 'Learn more' },
      { title: 'EV Charging Points', price: 'Wallbox & home charging', image: RENEWABLE_IMAGES.s2, cta: 'Learn more' },
      { title: 'Energy Efficiency', price: 'Audits & optimization', image: RENEWABLE_IMAGES.s4, cta: 'Learn more' },
      { title: 'Maintenance & Installations', price: 'Monitoring & technical support', image: RENEWABLE_IMAGES.s5, cta: 'Learn more' },
    ],
  },
  reviews: {
    es: [
      { name: 'Carlos M.', text: 'Instalación impecable en nuestra nave. Ahorro del 70% en la factura desde el primer mes.', stars: 5 },
      { name: 'Laura P.', text: 'Estudio personalizado, tramitación de subvenciones incluida y equipo muy profesional.', stars: 5 },
      { name: 'Grupo Industrial Vega', text: 'Proyecto de 120 kWp ejecutado en plazo. Monitorización y soporte técnico excelentes.', stars: 5 },
    ],
    en: [
      { name: 'Carlos M.', text: 'Flawless installation at our warehouse. 70% bill savings from month one.', stars: 5 },
      { name: 'Laura P.', text: 'Personalized study, subsidy paperwork included and very professional team.', stars: 5 },
      { name: 'Vega Industrial Group', text: '120 kWp project delivered on time. Excellent monitoring and technical support.', stars: 5 },
    ],
  },
  addressEs: 'Madrid y comunidad autónoma · Cobertura nacional',
  addressEn: 'Madrid and region · National coverage',
  hoursEs: 'Lunes – Viernes: 8:30 – 18:30 · Soporte técnico 24/7',
  hoursEn: 'Mon – Fri: 8:30 AM – 6:30 PM · 24/7 technical support',
  infoEs: 'Ingeniería propia · Instalación certificada · Financiación disponible',
  infoEn: 'In-house engineering · Certified installation · Financing available',
  phone: '910 00 00 00',
  ratingLabelEs: '4,9 · 180 proyectos verificados',
  ratingLabelEn: '4.9 · 180 verified projects',
  aboutEs: 'Somos una empresa de ingeniería e instalación especializada en energía solar, almacenamiento y movilidad eléctrica. Diseñamos soluciones a medida para maximizar tu ahorro, independencia energética y sostenibilidad.',
  aboutEn: 'We are an engineering and installation company specialized in solar energy, storage and electric mobility. We design tailored solutions to maximize your savings, energy independence and sustainability.',
  accent: 'blue',
  email: 'info@heliosenergia.es',
};

export const NONPROFIT_PROFILE: BusinessProfile = {
  variant: 'nonprofit',
  heroImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1400&h=800&fit=crop',
  galleryImages: [
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  ],
  taglineEs: 'Comunicación sin barreras',
  taglineEn: 'Communication without barriers',
  typeEs: 'Plataforma de Accesibilidad',
  typeEn: 'Accessibility Platform',
  badgeEs: '100% accesible · Subtítulos LSE',
  badgeEn: '100% accessible · Sign language captions',
  ctaPrimaryEs: 'Explorar recursos',
  ctaPrimaryEn: 'Explore resources',
  ctaSecondaryEs: 'Aprender LSE',
  ctaSecondaryEn: 'Learn sign language',
  menuItems: {
    es: [
      { title: 'Vídeos en LSE', price: 'Gratuito', image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', cta: 'Ver vídeos' },
      { title: 'Tutoriales dactilológicos', price: 'Gratuito', image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', cta: 'Empezar' },
      { title: 'Noticias accesibles', price: 'Gratuito', image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', cta: 'Leer más' },
    ],
    en: [
      { title: 'Sign language videos', price: 'Free', image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', cta: 'Watch videos' },
      { title: 'Fingerspelling tutorials', price: 'Free', image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', cta: 'Start' },
      { title: 'Accessible news', price: 'Free', image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', cta: 'Read more' },
    ],
  },
  reviews: {
    es: [
      { name: 'Ana L.', text: 'Recursos imprescindibles para familias con personas sordas. Todo con subtítulos y en LSE.', stars: 5 },
      { name: 'Pedro S.', text: 'Aprendí LSE gracias a sus tutoriales. Plataforma clara, inclusiva y muy bien hecha.', stars: 5 },
      { name: 'Marta G.', text: 'Noticias y contenido accesible que no encontraba en ningún otro sitio.', stars: 5 },
    ],
    en: [
      { name: 'Ana L.', text: 'Essential resources for families with deaf members. Everything with captions and sign language.', stars: 5 },
      { name: 'Pedro S.', text: 'I learned sign language thanks to their tutorials. Clear, inclusive and well-made platform.', stars: 5 },
      { name: 'Marta G.', text: 'Accessible news and content I could not find anywhere else.', stars: 5 },
    ],
  },
  addressEs: 'Madrid, España',
  addressEn: 'Madrid, Spain',
  hoursEs: 'Recursos disponibles 24/7 online',
  hoursEn: 'Resources available 24/7 online',
  infoEs: 'LSE · Subtítulos · Comunidad inclusiva',
  infoEn: 'Sign language · Captions · Inclusive community',
  phone: '900 000 000',
  ratingLabelEs: '4.9 · Comunidad verificada',
  ratingLabelEn: '4.9 · Verified community',
  aboutEs: 'Plataforma dedicada a la comunicación accesible en Lengua de Signos Española. Vídeos, tutoriales y noticias 100% inclusivas.',
  aboutEn: 'Platform dedicated to accessible communication in Spanish Sign Language. Videos, tutorials and 100% inclusive news.',
  accent: 'blue',
  email: 'info@infosordos.com',
};

export function detectVariant(prompt: string): BusinessVariant {
  // Bicicletas ANTES que moda (colección/accesorios/carrito disparaban fashion)
  if (isBikeShopPrompt(prompt)) return 'bike';
  // Gestoría / asesoría ANTES que moda («no tienda online» contiene la substring tienda online)
  if (/gestor[ií]a|asesor[ií]a|asesor|fiscal|contab|laboral|campon|despacho/i.test(prompt)) return 'corporate';
  // Barbería / peluquería caballeros → beauty (banco salón/barber), nunca fashion
  if (isBarbershopPrompt(prompt)) return 'beauty';
  if (isFashionEcommercePrompt(prompt)) return 'fashion';
  if (/tatuaje|tattoo|piercing|royal bang|gemas dentales|iron.?ink|tinta/i.test(prompt)) return 'tattoo';
  if (/kebab|d[öo]ner|doner|durum|falafel/i.test(prompt)) return 'kebab';
  if (/infosordos|lengua de signos|\blse\b|sordos|accesibilidad auditiva|comunicaci[oó]n sin barreras/i.test(prompt)) return 'nonprofit';
  if (
    /energ[ií]as?\s+renov|fotovolta|placas\s+solares|autoconsumo|energ[ií]a\s+solar|paneles\s+solares|bater[ií]as\s+solares|eficiencia\s+energ|wallbox|punto[s]?\s+de\s+recarga|cargador.*el[eé]ctric|veh[ií]culo\s+el[eé]ctric|ritest|bolet[ií]n\s+el[eé]ctric|instalaci[oó]n\s+fotovolta/i.test(
      prompt
    )
  ) {
    return 'renewable';
  }
  if (
    /joyer[ií]a|relojer[ií]a|jewelry|watchmaker|alta relojer|reloj de lujo|relojes de lujo|boutique de lujo|rolex|cartier|patek|omega|bulgari|tiffany|audemars|chopard|tag heuer|iwc|breitling|van cleef|richard mille|boucheron|diamante|anillo de compromiso|alianzas/i.test(
      prompt
    )
  ) {
    return 'jewelry';
  }
  if (/maison|fine dining|alta cocina|gourmet|la maison/i.test(prompt)) return 'luxury';
  if (/yamaha|motos?\s+cort|concesionario|motocicleta|motorcycle\s+dealer|taller\s+oficial/i.test(prompt)) return 'automotive';
  if (/abogad|law firm|notar[ií]a|jur[ií]dic|bufete/i.test(prompt)) return 'default';
  if (/barber[ií]a|barbershop|\bbarber\b|afeitad|grooming masculin/i.test(prompt)) return 'beauty';
  if (/peluquer|sal[oó]n\s+de\s+belleza|elite\s+beauty|estilo\s+de\s+belleza|hair\s+salon|manicur|uñas/i.test(prompt)) return 'beauty';
  if (/recetas|blog de comida|blog gastron|food blog|comida casera|blog culin|publicaciones.*receta|stanton|libro de recetas/i.test(prompt)) return 'foodblog';
  if (/trattoria|italian[o]?|pizzer[ií]a|pizza|pasta|risotto|cocina italiana|nonna|antipast|carbonara|bolognese|tiramis/i.test(prompt)) return 'italian';
  if (
    /panader[ií]a|panaderia|horno|bollería|bolleria|pasteler[ií]a|pastelera|bakery|bread\s+shop|trigo|pan\s+reci[eé]n|panes?\b|croissants?|magdalenas?/i.test(
      prompt
    )
  ) {
    return 'bakery';
  }
  if (/rest art|art caf[ée]|mes[oó]n|taberna|caf[ée]|restaurante|terraza|c[óo]ctel|brunch|tapas|comida\s+español/i.test(prompt)) return 'cafe';
  return 'default';
}

function menuCta(variant: BusinessVariant): string {
  if (variant === 'cafe' || variant === 'italian') return 'Reservar mesa';
  if (variant === 'tattoo' || variant === 'beauty') return 'Reservar cita';
  if (variant === 'corporate') return 'Solicitar consulta';
  if (variant === 'automotive' || variant === 'bike') return 'Pedir cita';
  if (variant === 'jewelry' || variant === 'fashion') return 'Descubrir';
  return 'Ver más';
}

function applyListingToProfile(base: BusinessProfile, listing: ParsedGoogleListing): BusinessProfile {
  const cta = menuCta(base.variant);
  const menuEs = listing.products.length > 0
    ? listing.products.map((p) => ({ ...p, cta: p.cta || cta }))
    : base.menuItems.es;
  const tagline = listing.serviceOptions
    ? `${listing.serviceOptions}${listing.priceRange ? ` · ${listing.priceRange}` : ''}`
    : listing.description.slice(0, 160);
  return {
    ...base,
    taglineEs: tagline || base.taglineEs,
    taglineEn: tagline || base.taglineEn,
    aboutEs: listing.description || base.aboutEs,
    aboutEn: listing.description || base.aboutEn,
    addressEs: listing.address,
    addressEn: listing.address,
    hoursEs: listing.hours,
    hoursEn: listing.hours,
    phone: listing.phone || base.phone,
    ratingLabelEs: listing.ratingLabel || base.ratingLabelEs,
    ratingLabelEn: listing.ratingLabel || base.ratingLabelEn,
    menuItems: {
      es: menuEs,
      en: menuEs.map((p) => ({ ...p, cta: base.variant === 'cafe' ? 'Book a table' : 'Book appointment' })),
    },
    reviews: ['cafe', 'italian', 'beauty', 'corporate', 'automotive', 'bike', 'luxury', 'jewelry', 'fashion', 'nonprofit', 'foodblog'].includes(base.variant)
      ? { es: base.reviews.es, en: base.reviews.en }
      : { es: listing.reviews, en: listing.reviews },
    badgeEs: listing.serviceOptions?.slice(0, 40) ?? base.badgeEs,
    badgeEn: listing.serviceOptions?.slice(0, 40) ?? base.badgeEn,
  };
}

export function getBusinessProfile(
  variant: BusinessVariant,
  listing?: ParsedGoogleListing | null
): BusinessProfile | null {
  const base =
    variant === 'kebab' ? KEBAB_PROFILE
      : variant === 'tattoo' ? TATTOO_PROFILE
        : variant === 'cafe' ? CAFE_PROFILE
          : variant === 'bakery' ? {
              ...CAFE_PROFILE,
              variant: 'bakery' as const,
              typeEs: 'Panadería artesanal',
              typeEn: 'Artisan bakery',
              taglineEs: 'Pan de masa madre · Bollería · Encargos',
              taglineEn: 'Sourdough · Pastries · Orders',
              badgeEs: 'Horneado diario · Masa madre',
              badgeEn: 'Daily bake · Sourdough',
              heroImage: IMAGE_BANK.bakery.hero,
              galleryImages: [...IMAGE_BANK.bakery.gallery].slice(0, 9),
              aboutEs: 'Panadería artesanal con masa madre, bollería y pasteles. Catálogo con precios y contacto por WhatsApp.',
              aboutEn: 'Artisan bakery with sourdough, pastries and cakes. Priced catalogue and WhatsApp contact.',
              accent: 'gold' as const,
              menuItems: {
                es: [
                  { title: 'Pan de Masa Madre', price: '3,50 €', image: IMAGE_BANK.bakery.bread[0], cta: 'Solicitar información' },
                  { title: 'Baguette Rústica', price: '1,80 €', image: IMAGE_BANK.bakery.bread[1], cta: 'Solicitar información' },
                  { title: 'Pan de Centeno', price: '4,20 €', image: IMAGE_BANK.bakery.bread[2], cta: 'Solicitar información' },
                  { title: 'Croissant Artesanal', price: '1,50 €', image: IMAGE_BANK.bakery.pastry[0], cta: 'Solicitar información' },
                  { title: 'Napolitana de Chocolate', price: '1,80 €', image: IMAGE_BANK.bakery.pastry[1], cta: 'Solicitar información' },
                  { title: 'Tarta de Queso Casera', price: '18,00 €', image: IMAGE_BANK.bakery.cakes[0], cta: 'Solicitar información' },
                ],
                en: [
                  { title: 'Sourdough Bread', price: '€3.50', image: IMAGE_BANK.bakery.bread[0], cta: 'Request info' },
                  { title: 'Rustic Baguette', price: '€1.80', image: IMAGE_BANK.bakery.bread[1], cta: 'Request info' },
                  { title: 'Rye Bread', price: '€4.20', image: IMAGE_BANK.bakery.bread[2], cta: 'Request info' },
                  { title: 'Artisan Croissant', price: '€1.50', image: IMAGE_BANK.bakery.pastry[0], cta: 'Request info' },
                  { title: 'Chocolate Pastry', price: '€1.80', image: IMAGE_BANK.bakery.pastry[1], cta: 'Request info' },
                  { title: 'Homemade Cheesecake', price: '€18.00', image: IMAGE_BANK.bakery.cakes[0], cta: 'Request info' },
                ],
              },
              reviews: {
                es: [
                  { name: 'María G.', text: 'El mejor pan de masa madre que he probado en años. Cada mañana es un placer.', stars: 5 },
                  { name: 'Carlos R.', text: 'Sus tartas son una delicia. Frescura y sabor inigualables.', stars: 5 },
                  { name: 'Ana P.', text: 'La bollería es espectacular, especialmente los croissants.', stars: 5 },
                ],
                en: [
                  { name: 'Maria G.', text: 'Best sourdough I have tasted in years.', stars: 5 },
                  { name: 'Carlos R.', text: 'Their cakes are a delight — unmatched freshness.', stars: 5 },
                  { name: 'Ana P.', text: 'Pastries are spectacular, especially the croissants.', stars: 5 },
                ],
              },
            }
          : variant === 'italian' ? ITALIAN_PROFILE
            : variant === 'foodblog' ? FOOD_BLOG_PROFILE
            : variant === 'beauty' ? BEAUTY_PROFILE
            : variant === 'corporate' ? CORPORATE_PROFILE
              : variant === 'automotive' ? AUTOMOTIVE_PROFILE
                : variant === 'bike' ? BIKE_PROFILE
                : variant === 'luxury' ? LUXURY_PROFILE
                  : variant === 'fashion' ? FASHION_PROFILE
                  : variant === 'jewelry' ? JEWELRY_PROFILE
                  : variant === 'nonprofit' ? NONPROFIT_PROFILE
                    : variant === 'renewable' ? RENEWABLE_PROFILE
                      : null;
  if (!base) return null;
  if (listing) return applyListingToProfile(base, listing);
  return base;
}
