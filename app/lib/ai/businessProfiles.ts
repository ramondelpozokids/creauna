import type { ParsedGoogleListing } from './googleListingParser';
import { IMAGE_BANK } from './imageBank';

export type BusinessVariant = 'kebab' | 'tattoo' | 'cafe' | 'foodblog' | 'beauty' | 'corporate' | 'automotive' | 'luxury' | 'nonprofit' | 'default';

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
  hero: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1400&h=800&fit=crop',
  gal1: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  gal2: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  gal3: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
};

export const CORPORATE_PROFILE: BusinessProfile = {
  variant: 'corporate',
  heroImage: CORPORATE_IMAGES.hero,
  galleryImages: [CORPORATE_IMAGES.gal1, CORPORATE_IMAGES.gal2, CORPORATE_IMAGES.gal3],
  taglineEs: 'Asesoría integral para autónomos y PYMES',
  taglineEn: 'Full advisory for freelancers and SMEs',
  typeEs: 'Asesoría Fiscal, Laboral y Contable',
  typeEn: 'Tax, Labor & Accounting Advisory',
  badgeEs: 'Desde 1991 · Puente de Vallecas',
  badgeEn: 'Since 1991 · Puente de Vallecas',
  ctaPrimaryEs: 'Solicitar consulta',
  ctaPrimaryEn: 'Request consultation',
  ctaSecondaryEs: 'Nuestros servicios',
  ctaSecondaryEn: 'Our services',
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
  if (/tatuaje|tattoo|piercing|royal bang|gemas dentales|iron.?ink|tinta/i.test(prompt)) return 'tattoo';
  if (/kebab|d[öo]ner|doner|durum|falafel/i.test(prompt)) return 'kebab';
  if (/infosordos|lengua de signos|\blse\b|sordos|accesibilidad auditiva|comunicaci[oó]n sin barreras/i.test(prompt)) return 'nonprofit';
  if (/maison|fine dining|alta cocina|gourmet|la maison/i.test(prompt)) return 'luxury';
  if (/yamaha|motos?\s+cort|concesionario|motocicleta|motorcycle\s+dealer|taller\s+oficial/i.test(prompt)) return 'automotive';
  if (/gestor[ií]a|asesor[ií]a|asesor|fiscal|contab|laboral|campon|despacho|bufete|abogad/i.test(prompt)) return 'corporate';
  if (/peluquer|sal[oó]n\s+de\s+belleza|elite\s+beauty|estilo\s+de\s+belleza|hair\s+salon|manicur|uñas|barber[ií]a/i.test(prompt)) return 'beauty';
  if (/recetas|blog de comida|blog gastron|food blog|comida casera|blog culin|publicaciones.*receta|stanton|libro de recetas/i.test(prompt)) return 'foodblog';
  if (/rest art|art caf[ée]|mes[oó]n|taberna|caf[ée]|restaurante|terraza|c[óo]ctel|brunch|tapas|comida\s+español/i.test(prompt)) return 'cafe';
  return 'default';
}

function menuCta(variant: BusinessVariant): string {
  if (variant === 'cafe') return 'Reservar mesa';
  if (variant === 'tattoo' || variant === 'beauty') return 'Reservar cita';
  if (variant === 'corporate') return 'Solicitar consulta';
  if (variant === 'automotive') return 'Pedir cita';
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
    reviews: ['cafe', 'beauty', 'corporate', 'automotive', 'luxury', 'nonprofit', 'foodblog'].includes(base.variant)
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
          : variant === 'foodblog' ? FOOD_BLOG_PROFILE
            : variant === 'beauty' ? BEAUTY_PROFILE
            : variant === 'corporate' ? CORPORATE_PROFILE
              : variant === 'automotive' ? AUTOMOTIVE_PROFILE
                : variant === 'luxury' ? LUXURY_PROFILE
                  : variant === 'nonprofit' ? NONPROFIT_PROFILE
                    : null;
  if (!base) return null;
  if (listing) return applyListingToProfile(base, listing);
  return base;
}
