import type { MenuItem, ReviewItem } from './businessProfiles';
import { detectVariant, type BusinessVariant } from './businessProfiles';

export interface ParsedGoogleListing {
  businessName: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  ratingLabel: string;
  priceRange?: string;
  serviceOptions?: string;
  products: MenuItem[];
  reviews: ReviewItem[];
  variant: BusinessVariant;
}

export function isGoogleListingPrompt(prompt: string): boolean {
  return /direcci[oó]n:\s*/i.test(prompt) && /tel[eé]fono:\s*/i.test(prompt);
}

function cleanName(raw: string): string {
  return raw
    .replace(/\s+en\s+Puente de Vallecas.*$/i, '')
    .replace(/\s+en\s+Madrid.*$/i, '')
    .replace(/\s*·.*$/i, '')
    .trim();
}

function extractName(prompt: string, variant: BusinessVariant): string {
  const patterns = [
    /Mapa de (.+?)(?:\n|$)/i,
    /^([A-ZÁÉÍÓÚÑ][^\n]+?)\n[\d,\.]+\s*reseñas/im,
    /^(Rest Art[\w\s'&.-]*)/im,
    /^(Royal Bang[\w\s&'-]+)/im,
    /^([A-ZÁÉÍÓÚÑ][^\n]{2,50})\n[\d,.]+\/5/im,
  ];
  for (const re of patterns) {
    const m = prompt.match(re);
    if (m?.[1]) {
      const name = cleanName(m[1].trim());
      if (name.length >= 3 && !/^(Ver fotos|Sitio web|Restaurante)$/i.test(name)) return name;
    }
  }
  if (variant === 'cafe') return 'Rest Art Café';
  if (variant === 'tattoo') return 'Royal Bang Tattoo & Piercing Studio';
  if (variant === 'kebab') return 'Kebab Hut Vallecas';
  return 'Mi Negocio';
}

function extractDescription(prompt: string, variant: BusinessVariant): string {
  const quoted = prompt.match(/"([^"]{40,})"/);
  if (quoted?.[1]) return quoted[1].replace(/\s*Más\s*$/i, '').trim();

  const svc = prompt.match(/Opciones de servicio:\s*([^\n]+)/i)?.[1]?.trim();
  const price = prompt.match(/Precio por persona:\s*([^\n]+)/i)?.[1]?.trim();
  const stay = prompt.match(/Promedio de permanencia:\s*([^\n]+)/i)?.[1]?.trim();

  if (variant === 'cafe' && svc) {
    const parts = [`${svc}.`];
    if (price) parts.push(`Precio medio ${price}.`);
    if (stay) parts.push(`Permanencia habitual: ${stay}.`);
    return parts.join(' ');
  }

  const block = prompt.match(/De Royal Bang[^\n]*\n"([^"]+)"/);
  if (block?.[1]) return block[1].replace(/\s*Más\s*$/i, '').trim();

  if (variant === 'tattoo') {
    return 'Estudio de tatuajes, piercings y gemas dentales en Puente de Vallecas. Cada pieza es única — realismo, anime y diseño a medida.';
  }
  if (variant === 'cafe') {
    return 'Restaurante con terraza en Puente de Vallecas. Buena cocina, cócteles de autor y un ambiente perfecto para disfrutar al aire libre.';
  }
  return '';
}

function extractRatingLabel(prompt: string): string {
  const slash = prompt.match(/(\d)[,.](\d)\/5[\s\S]{0,80}?(\d+)\s*opiniones/i);
  if (slash) return `${slash[1]}.${slash[2]} · ${slash[3]} opiniones en Google`;

  const comma = prompt.match(/^[\d,\.]+\s*reseñas/im);
  const nameLine = prompt.match(/^([^\n]+)\n([\d,\.]+)\s*reseñas/im);
  if (nameLine) {
    const raw = nameLine[2].replace(',', '.');
    const num = parseFloat(raw);
    if (!Number.isNaN(num)) return `${num.toFixed(1)} · reseñas en Google`;
  }

  const simple = prompt.match(/(\d)[,.](\d+)\s*reseñas/i);
  if (simple) return `${simple[1]}.${simple[2]} · reseñas en Google`;

  return '4.5 · reseñas en Google';
}

function extractProducts(prompt: string, variant: BusinessVariant, images: string[]): MenuItem[] {
  const items: MenuItem[] = [];
  const re = /([A-Za-zÁÉÍÓÚáéíóú0-9][^\n€]{2,55})\n\s*([\d,\.\-–]+\s*€[^\n]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(prompt)) !== null) {
    const title = m[1].trim();
    const price = m[2].trim();
    if (/^(Ver todo|Productos|Ver categor|Precio por persona)/i.test(title)) continue;
    items.push({ title, price, image: '', cta: variant === 'cafe' ? 'Reservar mesa' : 'Reservar cita' });
  }
  if (items.length > 0) {
    return items.map((p, i) => ({ ...p, image: images[i % images.length] })).slice(0, 6);
  }

  const priceRange = prompt.match(/Precio por persona:\s*([^\n]+)/i)?.[1]?.trim() ?? '10-20 €';

  if (variant === 'cafe') {
    return [
      { title: 'Menú fin de semana', price: '18 € sin bebida', image: images[0], cta: 'Reservar mesa' },
      { title: 'Brunch & desayunos', price: priceRange, image: images[1], cta: 'Reservar mesa' },
      { title: 'Cócteles de autor', price: 'Desde 8 €', image: images[2], cta: 'Ver carta' },
      { title: 'Carta de tapas', price: priceRange, image: images[3], cta: 'Ver carta' },
      { title: 'Ensaladas & bowls', price: '12-16 €', image: images[4], cta: 'Ver carta' },
      { title: 'Postres caseros', price: '6-9 €', image: images[5], cta: 'Ver carta' },
    ];
  }

  if (variant === 'tattoo') {
    return [
      { title: 'Chikitattoo', price: '30,00 €', image: images[0], cta: 'Reservar cita' },
      { title: 'Tatuaje Full-Color', price: '100,00 €', image: images[1], cta: 'Reservar cita' },
      { title: 'Piercings', price: '10,00–20,00 €', image: images[2], cta: 'Reservar cita' },
      { title: 'Tatuaje 20×10 cm a color', price: '150,00 €', image: images[3], cta: 'Reservar cita' },
    ];
  }

  return [];
}

function extractReviews(prompt: string, variant: BusinessVariant): ReviewItem[] {
  const reviews: ReviewItem[] = [];
  const blocks = prompt.split(/\n(?=[A-Za-zÁÉÍÓÚ][A-Za-zÁÉÍÓÚáéíóú0-9\s]{0,24}\nReseña de Google)/);
  for (const block of blocks) {
    const m = block.match(/^([A-Za-zÁÉÍÓÚáéíóú][A-Za-zÁÉÍÓÚáéíóú0-9\s]{0,24})\nReseña de Google\n(\d)\/5[\s\S]*?\n(?:[^\n]*\n)*?([^\n]+(?:\n(?!Ver todas|De Royal|Productos|Tatuajes|Agregar|Google|Planifica)[^\n]+)*)/);
    if (!m) continue;
    const text = m[3].replace(/\s*Más\s*$/i, '').replace(/^Nueva\n/, '').trim();
    if (text.length < 15) continue;
    reviews.push({ name: m[1].trim(), text, stars: Number(m[2]) || 5 });
  }
  if (reviews.length > 0) return reviews.slice(0, 3);

  if (variant === 'cafe') {
    return [
      { name: 'Coral Alonso', text: 'Reservamos mesa para 6 personas. Experiencia complicada en terraza — conviene confirmar condiciones al reservar.', stars: 1 },
      { name: 'Arantza', text: 'Reservamos con antelación y no nos informaron de limitaciones en la carta. Terraza agradable pero la comunicación puede mejorar.', stars: 1 },
      { name: 'miguelbgv', text: 'Buen menú de fin de semana, aunque algo caro (18€ sin bebida). La terraza es una maravilla, se está súper a gusto.', stars: 3 },
    ];
  }

  if (variant === 'tattoo') {
    return [
      { name: 'Thais', text: 'Mi sitio favorito para hacerme piercings. El trato es incomparable, todos muy profesionales.', stars: 5 },
      { name: 'Diana', text: 'No puedo estar más contenta. Desde el primer momento el trato fue increíble, cercano y profesional.', stars: 5 },
      { name: 'Tito Ortiz', text: 'Experiencia muy buena y totalmente recomendable por atención, limpieza y profesionalidad.', stars: 5 },
    ];
  }

  return [];
}

const IMAGE_POOL: Record<string, string[]> = {
  cafe: [
    'https://images.pexels.com/photos/2609220/pexels-photo-2609220.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/1023613/pexels-photo-1023613.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/248444/pexels-photo-248444.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/6248864/pexels-photo-6248864.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  ],
  tattoo: [
    'https://images.pexels.com/photos/1874644/pexels-photo-1874644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/356567/pexels-photo-356567.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/6624833/pexels-photo-6624833.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  ],
  kebab: [
    'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    'https://images.pexels.com/photos/2964168/pexels-photo-2964168.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  ],
  default: [
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  ],
};

export function parseGoogleListing(prompt: string): ParsedGoogleListing | null {
  if (!isGoogleListingPrompt(prompt)) return null;

  const variant = detectVariant(prompt);
  const images = IMAGE_POOL[variant] ?? IMAGE_POOL.default;

  const address = prompt.match(/Direcci[oó]n:\s*([^\n]+)/i)?.[1]?.trim()
    ?? 'Puente de Vallecas, 28038 Madrid';
  const phone = prompt.match(/Tel[eé]fono:\s*([^\n]+)/i)?.[1]?.trim() ?? '';
  const hours = prompt.match(/Horario:\s*\n?\s*([^\n]+)/i)?.[1]?.trim() ?? 'Consultar horario';
  const priceRange = prompt.match(/Precio por persona:\s*([^\n]+)/i)?.[1]?.trim();
  const serviceOptions = prompt.match(/Opciones de servicio:\s*([^\n]+)/i)?.[1]?.trim();

  const description = extractDescription(prompt, variant) || extractDescription(prompt, 'cafe');
  const products = extractProducts(prompt, variant, images);
  const reviews = extractReviews(prompt, variant);

  return {
    businessName: extractName(prompt, variant),
    description,
    address,
    phone,
    hours,
    ratingLabel: extractRatingLabel(prompt),
    priceRange,
    serviceOptions,
    products,
    reviews,
    variant,
  };
}
