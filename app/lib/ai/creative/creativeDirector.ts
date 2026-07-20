/**
 * Creative Director — fallback heurístico frío (sin providers / JSON inválido).
 * El camino de producto es `runCreativeDirectorAsync` → LLM.
 * PROHIBIDO: reglas ad-hoc por cliente o «parches» de metáforas (hotel vs clínica).
 */

import type {
  CreativeBrief,
  CreativeSectorId,
  ArtDirection,
  VisualLanguage,
  HeroFamily,
} from './creativeBrief';
import { makeUniquenessSeed, pickSeeded, seededRandom } from './uniquenessSeed';
import {
  runLlmCreativeDirector,
  type CreativeDirectorResult,
} from './llmCreativeDirector';

function detectSector(prompt: string): CreativeSectorId {
  const p = prompt.toLowerCase();
  if (/cl[ií]nica|odontolog|dentista|dental|est[eé]tica|hialur/.test(p)) return 'clinic';
  if (/abogad|bufete|mercantil|despacho/.test(p)) return 'legal';
  if (/hotel|boutique\s+hotel|turismo\s+rural|resort/.test(p)) return 'hotel';
  if (/arquitect|estudio\s+de\s+arquitectura|blueprint/.test(p)) return 'architecture';
  if (/restaurante|trattoria|pizzer|italiano|italian/.test(p)) return 'restaurant';
  if (/cafeter[ií]a|caf[eé]\b|coffee/.test(p)) return 'cafe';
  if (/barber|peluquer[ií]a\s+(?:de\s+)?caballer|afeitad/.test(p)) return 'barber';
  if (/panader|bollería|pasteler|bakery/.test(p)) return 'bakery';
  if (/gestor[ií]a|asesor[ií]a|contable|fiscal/.test(p)) return 'corporate';
  if (/moda|fashion|boutique\s+de\s+ropa|e-?commerce\s+moda/.test(p)) return 'fashion';
  return 'default';
}

function extractName(prompt: string, lang: 'es' | 'en'): string {
  const patterns = [
    /(?:se\s+llama|llamad[oa]|nombre\s*[:\-]|brand\s*[:\-]|marca\s*[:\-])\s*["']?([A-ZÁÉÍÓÚÑ][\wáéíóúñ\s&'.-]{2,50})/i,
    /(?:cl[ií]nica|restaurante|hotel|bufete|estudio)\s+([A-ZÁÉÍÓÚÑ][\wáéíóúñ\s&'.-]{2,40})/i,
  ];
  for (const re of patterns) {
    const m = prompt.match(re);
    if (m?.[1] && m[1].trim().length >= 3) return m[1].trim().slice(0, 48);
  }
  const defaults: Record<CreativeSectorId, { es: string; en: string }> = {
    clinic: { es: 'Clínica Premium', en: 'Premium Clinic' },
    restaurant: { es: 'Trattoria Nonna', en: 'Trattoria Nonna' },
    legal: { es: 'Despacho Meridian', en: 'Meridian Law' },
    hotel: { es: 'Maison Lumière', en: 'Maison Lumière' },
    architecture: { es: 'Atelier Forma', en: 'Atelier Forma' },
    cafe: { es: 'Café El Paso', en: 'Café El Paso' },
    barber: { es: 'Barbería Tarik', en: 'Tarik Barbershop' },
    bakery: { es: 'Horno de María', en: "Maria's Bakery" },
    corporate: { es: 'Gestoría Integral', en: 'Integral Advisory' },
    fashion: { es: 'Maison', en: 'Maison' },
    default: { es: 'Tu marca', en: 'Your brand' },
  };
  return defaults[detectSector(prompt)][lang];
}

function sectorDefaults(sector: CreativeSectorId, lang: 'es' | 'en') {
  const table: Record<
    CreativeSectorId,
    {
      audience: string;
      positioning: string;
      brandTone: CreativeBrief['brandTone'];
      artDirection: ArtDirection;
      visualLanguage: VisualLanguage;
      heroFamilies: HeroFamily[];
      photoStyle: string;
      aboutHeadline: string;
      aboutBody: string;
      services: { es: string[]; en: string[] };
      hero: { es: [string, string]; en: [string, string] };
      cta: { es: [string, string]; en: [string, string] };
      arc: string[];
    }
  > = {
    clinic: {
      audience:
        lang === 'es'
          ? 'Adultos urbanos que buscan cuidado médico premium'
          : 'Urban adults seeking premium medical care',
      positioning:
        lang === 'es'
          ? 'Clínica premium: confianza, precisión, luz'
          : 'Premium clinic: trust, precision, light',
      brandTone: 'premium',
      artDirection: 'clinicalLight',
      visualLanguage: 'airAndWhite',
      heroFamilies: ['fullBleedLeft', 'splitMediaRight', 'editorialStack'],
      photoStyle: 'bright clinical interiors, calm portraits, soft daylight',
      aboutHeadline:
        lang === 'es'
          ? 'Cuidado premium con calma y precisión'
          : 'Premium care with calm and precision',
      aboutBody:
        lang === 'es'
          ? 'Tecnología actual, protocolos claros y un espacio pensado para que te sientas cuidado desde el primer momento.'
          : 'Modern technology, clear protocols, and a space designed so you feel cared for from the first visit.',
      services: {
        es: ['Consulta', 'Tratamientos', 'Seguimiento', 'Diagnóstico', 'Urgencias'],
        en: ['Consult', 'Treatments', 'Follow-up', 'Diagnostics', 'Emergencies'],
      },
      hero: {
        es: ['Cuidado con precisión y calma', 'Clínica premium con tecnología y trato humano.'],
        en: ['Care with precision and calm', 'Premium clinic with tech and human warmth.'],
      },
      cta: { es: ['Pedir cita', 'Ver tratamientos'], en: ['Book visit', 'View treatments'] },
      arc: ['hero', 'trust', 'services', 'about', 'gallery', 'testimonials', 'faq', 'contact'],
    },
    restaurant: {
      audience:
        lang === 'es'
          ? 'Foodies y parejas que buscan experiencia italiana auténtica'
          : 'Foodies seeking authentic Italian dining',
      positioning:
        lang === 'es' ? 'Gastronomía emocional, fotografía dominante' : 'Emotional gastronomy, photo-led',
      brandTone: 'warm',
      artDirection: 'gastronomicEmotion',
      visualLanguage: 'photographyDominant',
      heroFamilies: ['fullBleedCenter', 'asymmetricOverlap', 'splitMediaLeft'],
      photoStyle: 'plated dishes, warm interiors, hands cooking, wine',
      aboutHeadline:
        lang === 'es' ? 'Cocina con alma y hospitalidad' : 'Cooking with soul and hospitality',
      aboutBody:
        lang === 'es'
          ? 'Pasta, fuego y mesa. Una experiencia pensada para quedarse.'
          : 'Pasta, fire and table. An experience made to linger.',
      services: {
        es: ['Pasta fresca', 'Pizzas al horno', 'Menú degustación', 'Vinos italianos', 'Reservas grupos'],
        en: ['Fresh pasta', 'Wood-fired pizza', 'Tasting menu', 'Italian wines', 'Group bookings'],
      },
      hero: {
        es: ['Italia en cada plato', 'Pasta, fuego y hospitalidad. Reserva tu mesa.'],
        en: ['Italy on every plate', 'Pasta, fire and hospitality. Book your table.'],
      },
      cta: { es: ['Reservar mesa', 'Ver carta'], en: ['Reserve', 'View menu'] },
      arc: ['hero', 'about', 'menu', 'gallery', 'experience', 'testimonials', 'reservations', 'contact'],
    },
    legal: {
      audience:
        lang === 'es'
          ? 'Empresas y directivos que necesitan asesoría mercantil seria'
          : 'Companies needing serious commercial counsel',
      positioning:
        lang === 'es' ? 'Bufete elegante, sobrio, corporativo' : 'Elegant, sober corporate law',
      brandTone: 'corporate',
      artDirection: 'soberCorporate',
      visualLanguage: 'typeLed',
      heroFamilies: ['minimalTypeOnly', 'splitMediaRight', 'editorialStack'],
      photoStyle: 'quiet offices, architecture detail, confident professionals',
      aboutHeadline:
        lang === 'es' ? 'Criterio jurídico con discreción' : 'Legal judgment with discretion',
      aboutBody:
        lang === 'es'
          ? 'Acompañamos decisiones complejas con claridad y sobriedad.'
          : 'We support complex decisions with clarity and sobriety.',
      services: {
        es: ['Mercantil', 'Societario', 'Contratos', 'M&A', 'Compliance'],
        en: ['Commercial', 'Corporate', 'Contracts', 'M&A', 'Compliance'],
      },
      hero: {
        es: ['Claridad jurídica para decidir', 'Abogados mercantiles con criterio y discreción.'],
        en: ['Legal clarity to decide', 'Commercial lawyers with judgment and discretion.'],
      },
      cta: {
        es: ['Consulta confidencial', 'Áreas de práctica'],
        en: ['Confidential consult', 'Practice areas'],
      },
      arc: ['hero', 'positioning', 'practices', 'about', 'method', 'insights', 'testimonials', 'contact'],
    },
    hotel: {
      audience:
        lang === 'es'
          ? 'Viajeros que buscan estancia boutique aspiracional'
          : 'Travelers seeking aspirational boutique stays',
      positioning:
        lang === 'es' ? 'Lujo experiencial, no resort genérico' : 'Experiential luxury, not generic resort',
      brandTone: 'luxury',
      artDirection: 'aspirationalLuxury',
      visualLanguage: 'photographyDominant',
      heroFamilies: ['fullBleedCenter', 'fullBleedLeft', 'asymmetricOverlap'],
      photoStyle: 'rooms with light, textures, spa, city views at dusk',
      aboutHeadline:
        lang === 'es' ? 'Lujo experiencial, no resort genérico' : 'Experiential luxury, not a generic resort',
      aboutBody:
        lang === 'es'
          ? 'Suites, silencio y detalle. Una estancia diseñada para quienes valoran el criterio.'
          : 'Suites, quiet and detail. A stay for those who value judgment.',
      services: {
        es: ['Suites', 'Spa', 'Gastronomía', 'Concierge', 'Experiencias'],
        en: ['Suites', 'Spa', 'Dining', 'Concierge', 'Experiences'],
      },
      hero: {
        es: ['Donde el tiempo se queda', 'Hotel boutique: silencio, diseño y detalle.'],
        en: ['Where time stays', 'Boutique hotel: quiet, design, detail.'],
      },
      cta: { es: ['Reservar estancia', 'Explorar suites'], en: ['Book stay', 'Explore suites'] },
      arc: ['hero', 'atmosphere', 'rooms', 'experiences', 'dining', 'gallery', 'testimonials', 'contact'],
    },
    architecture: {
      audience:
        lang === 'es'
          ? 'Promotores y particulares que valoran espacio y luz'
          : 'Clients who value space and light',
      positioning:
        lang === 'es' ? 'Minimalismo espacial, mucho blanco' : 'Spatial minimalism, generous white',
      brandTone: 'minimal',
      artDirection: 'spatialMinimal',
      visualLanguage: 'airAndWhite',
      heroFamilies: ['editorialStack', 'splitMediaLeft', 'minimalTypeOnly'],
      photoStyle: 'architectural photography, concrete and glass, empty rooms with light',
      aboutHeadline:
        lang === 'es' ? 'Espacios que respiran' : 'Spaces that breathe',
      aboutBody:
        lang === 'es'
          ? 'Arquitectura de luz, proporción y materia.'
          : 'Architecture of light, proportion, material.',
      services: {
        es: ['Vivienda', 'Comercial', 'Rehabilitación', 'Interiorismo', 'Dirección de obra'],
        en: ['Residential', 'Commercial', 'Retrofit', 'Interiors', 'Site direction'],
      },
      hero: {
        es: ['Espacios que respiran', 'Arquitectura de luz, proporción y materia.'],
        en: ['Spaces that breathe', 'Architecture of light, proportion, material.'],
      },
      cta: { es: ['Hablar del proyecto', 'Ver obras'], en: ['Discuss project', 'View work'] },
      arc: ['hero', 'philosophy', 'projects', 'process', 'studio', 'gallery', 'contact'],
    },
    cafe: {
      audience:
        lang === 'es'
          ? 'Vecinos y remotos que buscan café y ambiente'
          : 'Locals seeking coffee and atmosphere',
      positioning: 'Warm neighborhood hospitality',
      brandTone: 'warm',
      artDirection: 'warmNeighborhood',
      visualLanguage: 'photographyDominant',
      heroFamilies: ['fullBleedCenter', 'splitMediaRight'],
      photoStyle: 'coffee, terrace, pastries, community',
      aboutHeadline: lang === 'es' ? 'Café y barrio' : 'Coffee and neighborhood',
      aboutBody:
        lang === 'es'
          ? 'Un lugar para quedarse: café de especialidad y mesa cálida.'
          : 'A place to stay: specialty coffee and a warm table.',
      services: {
        es: ['Desayunos', 'Café de especialidad', 'Menú del día', 'Terraza'],
        en: ['Breakfast', 'Specialty coffee', 'Daily menu', 'Terrace'],
      },
      hero: {
        es: ['El sabor de cada momento', 'Café, comida y barrio.'],
        en: ['Flavor in every moment', 'Coffee, food, neighborhood.'],
      },
      cta: { es: ['Ver carta', 'Cómo llegar'], en: ['View menu', 'Get directions'] },
      arc: ['hero', 'about', 'services', 'gallery', 'why', 'contact'],
    },
    barber: {
      audience:
        lang === 'es'
          ? 'Hombres que buscan corte y ritual de barbería'
          : 'Men seeking cut and barbershop ritual',
      positioning: 'Craft, contrast, gold accents',
      brandTone: 'editorial',
      artDirection: 'darkCraft',
      visualLanguage: 'darkMoody',
      heroFamilies: ['fullBleedCenter', 'splitMediaLeft'],
      photoStyle: 'barber tools, fades, shop atmosphere — never fashion runway',
      aboutHeadline: lang === 'es' ? 'Más que un corte' : 'More than a cut',
      aboutBody:
        lang === 'es'
          ? 'Oficio, detalle y un ritual de barbería con carácter.'
          : 'Craft, detail and a barbershop ritual with character.',
      services: {
        es: ['Corte', 'Barba', 'Afeitado clásico', 'Pack completo'],
        en: ['Cut', 'Beard', 'Classic shave', 'Full pack'],
      },
      hero: {
        es: ['Más que un corte', 'Experiencia de barbería.'],
        en: ['More than a cut', 'Barbershop experience.'],
      },
      cta: { es: ['Reservar', 'Ver servicios'], en: ['Book', 'Services'] },
      arc: ['hero', 'about', 'services', 'gallery', 'hours', 'contact'],
    },
    bakery: {
      audience: 'Neighbors who want real bread and pastry',
      positioning: 'Artisan bakery, warm craft',
      brandTone: 'warm',
      artDirection: 'earthyArtisan',
      visualLanguage: 'photographyDominant',
      heroFamilies: ['fullBleedLeft', 'asymmetricOverlap'],
      photoStyle: 'bread, flour, pastry, oven — never boats/cocktails',
      aboutHeadline: lang === 'es' ? 'Pan de oficio' : 'Bread of craft',
      aboutBody:
        lang === 'es'
          ? 'Masa madre y horno diario. Sabor real, sin atajos.'
          : 'Sourdough and daily oven. Real flavor, no shortcuts.',
      services: {
        es: ['Pan de masa madre', 'Bollería', 'Encargos', 'Tartas'],
        en: ['Sourdough', 'Pastries', 'Orders', 'Cakes'],
      },
      hero: {
        es: ['El sabor del pan recién horneado', 'Masa madre y oficio diario.'],
        en: ['Freshly baked bread', 'Sourdough and daily craft.'],
      },
      cta: { es: ['Ver productos', 'Encargar'], en: ['Products', 'Order'] },
      arc: ['hero', 'about', 'products', 'process', 'gallery', 'contact'],
    },
    corporate: {
      audience: 'SMEs needing fiscal and legal admin trust',
      positioning: 'Clear advisory, corporate calm',
      brandTone: 'trust',
      artDirection: 'soberCorporate',
      visualLanguage: 'typeLed',
      heroFamilies: ['splitMediaRight', 'editorialStack'],
      photoStyle: 'offices, handshake, Madrid skyline, documents calm',
      aboutHeadline: lang === 'es' ? 'Asesoría con criterio' : 'Advisory with judgment',
      aboutBody:
        lang === 'es'
          ? 'Fiscal, contable y laboral con claridad y cercanía.'
          : 'Tax, accounting and labor with clarity and proximity.',
      services: {
        es: ['Fiscal', 'Contable', 'Laboral', 'Mercantil'],
        en: ['Tax', 'Accounting', 'Labor', 'Commercial'],
      },
      hero: {
        es: ['Resultados que hablan', 'Gestoría con criterio.'],
        en: ['Results that speak', 'Advisory with judgment.'],
      },
      cta: { es: ['Solicitar propuesta', 'Servicios'], en: ['Request proposal', 'Services'] },
      arc: ['hero', 'about', 'services', 'why', 'process', 'contact'],
    },
    fashion: {
      audience: 'Style-conscious shoppers',
      positioning: 'Editorial fashion brand',
      brandTone: 'editorial',
      artDirection: 'aspirationalLuxury',
      visualLanguage: 'photographyDominant',
      heroFamilies: ['fullBleedCenter', 'asymmetricOverlap'],
      photoStyle: 'editorial fashion, lookbook, texture',
      aboutHeadline: lang === 'es' ? 'Elegancia con carácter' : 'Elegance with character',
      aboutBody:
        lang === 'es'
          ? 'Colecciones pensadas para quien valora el detalle.'
          : 'Collections for those who value detail.',
      services: {
        es: ['Novedades', 'Lookbook', 'Colección'],
        en: ['New in', 'Lookbook', 'Collection'],
      },
      hero: {
        es: ['La elegancia nunca pasa de moda', 'Moda con carácter.'],
        en: ['Elegance never goes out of style', 'Fashion with character.'],
      },
      cta: { es: ['Ver colección', 'Contactar'], en: ['Shop', 'Contact'] },
      arc: ['hero', 'lookbook', 'products', 'story', 'contact'],
    },
    default: {
      audience: 'Local customers discovering the brand',
      positioning: 'Clear professional presence',
      brandTone: 'trust',
      artDirection: 'warmNeighborhood',
      visualLanguage: 'splitEditorial',
      heroFamilies: ['splitMediaRight', 'fullBleedLeft', 'editorialStack'],
      photoStyle: 'authentic business photography',
      aboutHeadline:
        lang === 'es' ? 'Presencia clara y memorable' : 'Clear, memorable presence',
      aboutBody:
        lang === 'es'
          ? 'Diseñamos cada detalle para que tu marca se sienta alineada con lo que prometes.'
          : 'Every detail is designed so your brand feels aligned with what you promise.',
      services: {
        es: ['Servicio principal', 'Consulta', 'Atención'],
        en: ['Core service', 'Consult', 'Support'],
      },
      hero: {
        es: ['Tu negocio, con presencia clara', 'Web profesional al servicio de tus clientes.'],
        en: ['Your business, clearly present', 'A professional site for your clients.'],
      },
      cta: { es: ['Contactar', 'Saber más'], en: ['Contact', 'Learn more'] },
      arc: ['hero', 'about', 'services', 'why', 'gallery', 'contact'],
    },
  };
  return table[sector];
}

function wantsWa(prompt: string): boolean {
  if (/sin\s+whatsapp|without\s+whatsapp|no\s+whatsapp/i.test(prompt)) return false;
  return /whatsapp|wa\.me|reserva(r)?\s+por\s+whatsapp/i.test(prompt);
}

function forbidCart(prompt: string): boolean {
  return (
    /sin\s+(carrito|ecommerce|e-commerce|tienda\s+online)|without\s+(cart|checkout)/i.test(prompt) ||
    !/carrito|stripe|comprar\s+online|checkout/i.test(prompt)
  );
}

/**
 * Fallback síncrono — solo cuando no hay LLM.
 * No intenta «adivinar» metáforas de brief; el LLM es el responsable.
 */
export function runCreativeDirector(
  prompt: string,
  lang: 'es' | 'en',
  opts?: { entropy?: string }
): CreativeBrief {
  const sectorId = detectSector(prompt);
  const d = sectorDefaults(sectorId, lang);
  const seed = makeUniquenessSeed(prompt, opts?.entropy);
  const rng = seededRandom(seed);
  const heroFamily = pickSeeded(rng, d.heroFamilies);
  const businessName = extractName(prompt, lang);
  const density = pickSeeded(rng, ['sparse', 'balanced', 'balanced', 'dense'] as const);
  const rhythm = pickSeeded(rng, ['alternatingBands', 'editorialBreaks', 'continuous'] as const);
  const typeScale = pickSeeded(rng, ['editorial', 'billboard', 'intimate'] as const);
  const iconStyle = pickSeeded(rng, [
    'line',
    'duotone',
    sectorId === 'restaurant' || sectorId === 'cafe' ? 'emoji' : 'line',
  ] as const);

  const addr =
    prompt.match(/(?:direcci[oó]n|address|ubicaci[oó]n)\s*[:\-]?\s*([^\n]{4,80})/i)?.[1]?.trim() ||
    undefined;

  return {
    version: '1.0',
    sectorId,
    audience: d.audience,
    positioning: d.positioning,
    brandTone: d.brandTone,
    artDirection: d.artDirection,
    visualLanguage: d.visualLanguage,
    heroFamily,
    density,
    rhythm,
    typeScale,
    photoStyle: d.photoStyle,
    iconStyle,
    storytellingArc: d.arc,
    businessName,
    heroTitle: d.hero[lang][0],
    heroSubtitle: d.hero[lang][1],
    primaryCta: d.cta[lang][0],
    secondaryCta: d.cta[lang][1],
    services: d.services[lang],
    aboutHeadline: d.aboutHeadline,
    aboutBody: d.aboutBody,
    address: addr,
    hours: prompt.match(/(?:horario|hours)\s*[:\-]?\s*([^\n]{5,60})/i)?.[1]?.trim(),
    wantsWhatsApp: wantsWa(prompt),
    forbidCart: forbidCart(prompt),
    lang,
    uniquenessSeed: seed,
    rationale: `Fallback heuristic: sector=${sectorId}, art=${d.artDirection}, hero=${heroFamily}, seed=${seed}`,
  };
}

/** API de producto: LLM primero; heurística solo si no hay providers o JSON inválido. */
export async function runCreativeDirectorAsync(
  prompt: string,
  lang: 'es' | 'en',
  opts?: { entropy?: string; preferProvider?: import('../providers').AiProvider }
): Promise<CreativeDirectorResult> {
  const llm = await runLlmCreativeDirector(prompt, lang, {
    entropy: opts?.entropy,
    preferProvider: opts?.preferProvider,
  });
  if (llm) return llm;
  return {
    brief: runCreativeDirector(prompt, lang, { entropy: opts?.entropy }),
    provider: 'rules',
    source: 'heuristic_fallback',
  };
}
