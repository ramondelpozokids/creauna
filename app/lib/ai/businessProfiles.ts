import type { ParsedGoogleListing } from './googleListingParser';

export type BusinessVariant = 'kebab' | 'tattoo' | 'default';

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
  accent: 'red' | 'indigo';
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

export function detectVariant(prompt: string): BusinessVariant {
  if (/tatuaje|tattoo|piercing|royal bang|gemas dentales|iron.?ink|tinta/i.test(prompt)) return 'tattoo';
  if (/kebab|d[öo]ner|doner|durum|falafel/i.test(prompt)) return 'kebab';
  return 'default';
}

function applyListingToProfile(base: BusinessProfile, listing: ParsedGoogleListing): BusinessProfile {
  const menuEs = listing.products.map((p) => ({ ...p, cta: 'Reservar cita' }));
  return {
    ...base,
    taglineEs: listing.description.slice(0, 160),
    taglineEn: listing.description.slice(0, 160),
    aboutEs: listing.description,
    aboutEn: listing.description,
    addressEs: listing.address,
    addressEn: listing.address,
    hoursEs: listing.hours,
    hoursEn: listing.hours,
    phone: listing.phone,
    ratingLabelEs: listing.ratingLabel,
    ratingLabelEn: listing.ratingLabel,
    menuItems: { es: menuEs, en: menuEs.map((p) => ({ ...p, cta: 'Book appointment' })) },
    reviews: { es: listing.reviews, en: listing.reviews },
  };
}

export function getBusinessProfile(
  variant: BusinessVariant,
  listing?: ParsedGoogleListing | null
): BusinessProfile | null {
  const base = variant === 'kebab' ? KEBAB_PROFILE : variant === 'tattoo' ? TATTOO_PROFILE : null;
  if (!base) return null;
  if (listing) return applyListingToProfile(base, listing);
  return base;
}
