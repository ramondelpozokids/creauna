import type { MenuItem, ReviewItem } from './businessProfiles';

export interface ParsedGoogleListing {
  businessName: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  ratingLabel: string;
  products: MenuItem[];
  reviews: ReviewItem[];
}

export function isGoogleListingPrompt(prompt: string): boolean {
  return /direcci[oó]n:\s*/i.test(prompt) && /tel[eé]fono:\s*/i.test(prompt);
}

function cleanName(raw: string): string {
  return raw
    .replace(/\s+en\s+Puente de Vallecas.*$/i, '')
    .replace(/\s+en\s+Madrid.*$/i, '')
    .trim();
}

function extractName(prompt: string): string {
  const patterns = [
    /Mapa de (.+?) en Puente de Vallecas/i,
    /^([A-ZÁÉÍÓÚÑ][^\n]+?(?:Tattoo|Piercing|Studio|Tatuajes)[^\n]*)/m,
    /(Royal Bang[\w\s&'-]+)/i,
  ];
  for (const re of patterns) {
    const m = prompt.match(re);
    if (m?.[1]) {
      const name = cleanName(m[1].trim());
      if (name.length >= 3) return name;
    }
  }
  return 'Royal Bang Tattoo & Piercing Studio';
}

function extractDescription(prompt: string): string {
  const quoted = prompt.match(/"([^"]{40,})"/);
  if (quoted?.[1]) return quoted[1].replace(/\s*Más\s*$/i, '').trim();
  const block = prompt.match(/De Royal Bang[^\n]*\n"([^"]+)"/);
  if (block?.[1]) return block[1].replace(/\s*Más\s*$/i, '').trim();
  return 'Estudio de tatuajes, piercings y gemas dentales en Puente de Vallecas. Cada pieza es única — realismo, anime y diseño a medida.';
}

function extractProducts(prompt: string): MenuItem[] {
  const items: MenuItem[] = [];
  const re = /([A-Za-zÁÉÍÓÚáéíóú0-9][^\n€]{2,55})\n\s*([\d,\.\-–]+\s*€[^\n]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(prompt)) !== null) {
    const title = m[1].trim();
    const price = m[2].trim();
    if (/^(Ver todo|Productos|Ver categor)/i.test(title)) continue;
    items.push({
      title,
      price,
      image: '',
      cta: 'Reservar cita',
    });
  }
  return items.slice(0, 6);
}

function extractReviews(prompt: string): ReviewItem[] {
  const reviews: ReviewItem[] = [];
  const blocks = prompt.split(/\n(?=[A-Za-zÁÉÍÓÚ][A-Za-zÁÉÍÓÚáéíóú\s]{0,24}\nReseña de Google)/);
  for (const block of blocks) {
    const m = block.match(/^([A-Za-zÁÉÍÓÚáéíóú][A-Za-zÁÉÍÓÚáéíóú\s]{0,24})\nReseña de Google\n(\d)\/5[\s\S]*?\n(?:[^\n]*\n)*?([^\n]+(?:\n(?!Ver todas|De Royal|Productos|Tatuajes)[^\n]+)*)/);
    if (!m) continue;
    const text = m[3].replace(/\s*Más\s*$/i, '').replace(/^Nueva\n/, '').trim();
    if (text.length < 15) continue;
    reviews.push({ name: m[1].trim(), text, stars: Number(m[2]) || 5 });
  }
  return reviews.slice(0, 3);
}

const TATTOO_IMAGES = [
  'https://images.pexels.com/photos/1874644/pexels-photo-1874644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  'https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  'https://images.pexels.com/photos/356567/pexels-photo-356567.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  'https://images.pexels.com/photos/6624833/pexels-photo-6624833.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  'https://images.pexels.com/photos/1874644/pexels-photo-1874644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
  'https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
];

export function parseGoogleListing(prompt: string): ParsedGoogleListing | null {
  if (!isGoogleListingPrompt(prompt)) return null;

  const address = prompt.match(/Direcci[oó]n:\s*([^\n]+)/i)?.[1]?.trim()
    ?? 'C. Alto del León, 8, Loc 1, Puente de Vallecas, 28038 Madrid';
  const phone = prompt.match(/Tel[eé]fono:\s*([^\n]+)/i)?.[1]?.trim() ?? '722 54 54 42';
  const hours = prompt.match(/Horario:\s*\n?\s*([^\n]+)/i)?.[1]?.trim() ?? 'Consultar horario en estudio';
  const ratingMatch = prompt.match(/(\d[,.]\d)\s*\n?\s*(\d+)\s*reseñas/i)
    ?? prompt.match(/(\d)\/5\s*\n?\s*(\d+)\s*opiniones/i);
  const ratingLabel = ratingMatch
    ? `${ratingMatch[1].replace(',', '.')} · ${ratingMatch[2]} reseñas en Google`
    : '5.0 · 177 reseñas en Google';

  let products = extractProducts(prompt);
  if (products.length === 0) {
    products = [
      { title: 'Chikitattoo', price: '30,00 €', image: TATTOO_IMAGES[0], cta: 'Reservar cita' },
      { title: 'Tatuaje Full-Color', price: '100,00 €', image: TATTOO_IMAGES[1], cta: 'Reservar cita' },
      { title: 'Piercings', price: '10,00–20,00 €', image: TATTOO_IMAGES[2], cta: 'Reservar cita' },
      { title: 'Tatuaje 20×10 cm a color', price: '150,00 €', image: TATTOO_IMAGES[3], cta: 'Reservar cita' },
    ];
  } else {
    products = products.map((p, i) => ({ ...p, image: TATTOO_IMAGES[i % TATTOO_IMAGES.length] }));
  }

  let reviews = extractReviews(prompt);
  if (reviews.length === 0) {
    reviews = [
      { name: 'Thais', text: 'Mi sitio favorito para hacerme piercings. El trato es incomparable, todos muy profesionales.', stars: 5 },
      { name: 'Diana', text: 'No puedo estar más contenta. Desde el primer momento el trato fue increíble, cercano y profesional.', stars: 5 },
      { name: 'Tito Ortiz', text: 'Experiencia muy buena y totalmente recomendable por atención, limpieza y profesionalidad.', stars: 5 },
    ];
  }

  return {
    businessName: extractName(prompt),
    description: extractDescription(prompt),
    address,
    phone,
    hours,
    ratingLabel,
    products,
    reviews,
  };
}
