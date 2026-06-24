import type { TemplateCategory } from '../../data/templates';
import { detectVariant, type BusinessVariant } from './businessProfiles';
import { isGoogleListingPrompt, parseGoogleListing } from './googleListingParser';

export interface SiteFeatures {
  menu: boolean;
  services: boolean;
  about: boolean;
  blog: boolean;
  gallery: boolean;
  reviews: boolean;
  location: boolean;
  contact: boolean;
  reservation: boolean;
  calendar: boolean;
  legalFooter: boolean;
  social: boolean;
  whatsapp: boolean;
  scrollUp: boolean;
}

export interface ParsedIntent {
  templateSlug: string;
  businessName: string;
  businessType: string;
  categoryKey: TemplateCategory;
  features: SiteFeatures;
  variant: BusinessVariant;
}

type IntentRule = {
  slug: string;
  categoryKey: TemplateCategory;
  keywords: RegExp;
  typeEs: string;
  typeEn: string;
  defaultNameEs: string;
  defaultNameEn: string;
};

const INTENT_RULES: IntentRule[] = [
  { slug: 'vesper', categoryKey: 'gastronomy', keywords: /kebab|d[öo]ner|doner|durum|falafel/i, typeEs: 'Restaurante Kebab', typeEn: 'Kebab Restaurant', defaultNameEs: 'Kebab Hut Vallecas', defaultNameEn: 'Kebab Hut Vallecas' },
  { slug: 'trattoria', categoryKey: 'gastronomy', keywords: /italian[oa]|trattoria|pizza|pasta|risotto|italiano/i, typeEs: 'Restaurante Italiano', typeEn: 'Italian Restaurant', defaultNameEs: 'Trattoria Bella', defaultNameEn: 'Bella Trattoria' },
  { slug: 'sakura', categoryKey: 'gastronomy', keywords: /japon[eé]s|sushi|ramen|izakaya|japanese/i, typeEs: 'Restaurante Japonés', typeEn: 'Japanese Restaurant', defaultNameEs: 'Sakura House', defaultNameEn: 'Sakura House' },
  { slug: 'mokka', categoryKey: 'gastronomy', keywords: /cafeter[ií]a|caf[eé]|coffee|especialidad|barista|tostad/i, typeEs: 'Cafetería de Especialidad', typeEn: 'Specialty Coffee Shop', defaultNameEs: 'Mokka Coffee', defaultNameEn: 'Mokka Coffee' },
  { slug: 'ember', categoryKey: 'gastronomy', keywords: /parrilla|asador|grill|steakhouse|brasa|barbacoa|bbq/i, typeEs: 'Parrilla & Asador', typeEn: 'Grill & Steakhouse', defaultNameEs: 'Ember Grill', defaultNameEn: 'Ember Grill' },
  { slug: 'sable', categoryKey: 'gastronomy', keywords: /bistro|brasserie|brunch/i, typeEs: 'Bistro & Gastronomía', typeEn: 'Bistro & Gastronomy', defaultNameEs: 'Bistro Sable', defaultNameEn: 'Sable Bistro' },
  { slug: 'vesper', categoryKey: 'gastronomy', keywords: /restaurante|resaurante|restaurant|gourmet|fine dining|alta cocina|comida|gastronom|men[uú]|carta|mesa|comedor|cocina/i, typeEs: 'Restaurante', typeEn: 'Restaurant', defaultNameEs: 'Restaurante Vesper', defaultNameEn: 'Vesper Restaurant' },
  { slug: 'classic-cut', categoryKey: 'services', keywords: /barber[ií]a|barber|barbershop|afeitad|grooming masculin/i, typeEs: 'Barbería Premium', typeEn: 'Premium Barbershop', defaultNameEs: 'Classic Cut', defaultNameEn: 'Classic Cut' },
  { slug: 'lumen', categoryKey: 'services', keywords: /est[eé]tica|cl[ií]nica|dental|spa m[eé]dico|wellness|belleza/i, typeEs: 'Clínica de Estética', typeEn: 'Aesthetic Clinic', defaultNameEs: 'Clínica Lumen', defaultNameEn: 'Lumen Clinic' },
  { slug: 'iron-ink', categoryKey: 'services', keywords: /tatuaje|tattoo|piercing|tinta|royal bang|gemas dentales/i, typeEs: 'Estudio de Tatuajes', typeEn: 'Tattoo Studio', defaultNameEs: 'Royal Bang Tattoo & Piercing Studio', defaultNameEn: 'Royal Bang Tattoo & Piercing Studio' },
  { slug: 'torque', categoryKey: 'services', keywords: /taller de motos|motorcycle|motocicleta|custom shop/i, typeEs: 'Taller de Motos', typeEn: 'Motorcycle Workshop', defaultNameEs: 'Torque Garage', defaultNameEn: 'Torque Garage' },
  { slug: 'pistons', categoryKey: 'services', keywords: /mec[aá]nic|taller mec|auto repair|automotriz|chapa|veh[ií]culo/i, typeEs: 'Taller Mecánico', typeEn: 'Auto Repair Shop', defaultNameEs: 'Pistons Auto', defaultNameEn: 'Pistons Auto' },
  { slug: 'flow', categoryKey: 'services', keywords: /fontaner[ií]a|plumb|electric|reforma|reformas|construc/i, typeEs: 'Fontanería & Reformas', typeEn: 'Plumbing & Renovation', defaultNameEs: 'Flow Reformas', defaultNameEn: 'Flow Renovations' },
  { slug: 'sparkle', categoryKey: 'services', keywords: /limpieza|cleaning|mantenimiento dom/i, typeEs: 'Limpieza Profesional', typeEn: 'Professional Cleaning', defaultNameEs: 'Sparkle Clean', defaultNameEn: 'Sparkle Clean' },
  { slug: 'forge', categoryKey: 'services', keywords: /gimnasio|gym|fitness|crossfit|entrenamiento/i, typeEs: 'Gimnasio & Fitness', typeEn: 'Gym & Fitness', defaultNameEs: 'Forge Fitness', defaultNameEn: 'Forge Fitness' },
  { slug: 'zenith', categoryKey: 'services', keywords: /yoga|pilates|mindfulness|meditaci/i, typeEs: 'Estudio de Yoga', typeEn: 'Yoga Studio', defaultNameEs: 'Zenith Yoga', defaultNameEn: 'Zenith Yoga' },
  { slug: 'paw', categoryKey: 'services', keywords: /peluquer[ií]a canina|mascota|pet grooming|veterin/i, typeEs: 'Peluquería Canina', typeEn: 'Pet Grooming', defaultNameEs: 'Paw Grooming', defaultNameEn: 'Paw Grooming' },
  { slug: 'verde', categoryKey: 'services', keywords: /jardiner[ií]a|landscap|paisaj|vivero/i, typeEs: 'Jardinería & Paisajismo', typeEn: 'Landscaping', defaultNameEs: 'Verde Jardines', defaultNameEn: 'Verde Gardens' },
  { slug: 'lens', categoryKey: 'services', keywords: /fotograf|photograph|video|vide[oó]gra/i, typeEs: 'Estudio Fotográfico', typeEn: 'Photography Studio', defaultNameEs: 'Lens Studio', defaultNameEn: 'Lens Studio' },
  { slug: 'retreat', categoryKey: 'luxury', keywords: /hotel|hostal|alojamiento|boutique hotel|hospedaje/i, typeEs: 'Hotel Boutique', typeEn: 'Boutique Hotel', defaultNameEs: 'Retreat Hotel', defaultNameEn: 'Retreat Hotel' },
  { slug: 'serene', categoryKey: 'luxury', keywords: /spa|wellness de lujo|masaje/i, typeEs: 'Spa de Lujo', typeEn: 'Luxury Spa', defaultNameEs: 'Serene Spa', defaultNameEn: 'Serene Spa' },
  { slug: 'atelier', categoryKey: 'luxury', keywords: /joyer[ií]a|jewelry|reloj|watch/i, typeEs: 'Joyería & Relojería', typeEn: 'Jewelry & Watches', defaultNameEs: 'Atelier Joyas', defaultNameEn: 'Atelier Jewelry' },
  { slug: 'maison', categoryKey: 'luxury', keywords: /moda boutique|fashion|ropa|tienda de ropa/i, typeEs: 'Moda Boutique', typeEn: 'Fashion Boutique', defaultNameEs: 'Maison Mode', defaultNameEn: 'Maison Mode' },
  { slug: 'vows', categoryKey: 'luxury', keywords: /boda|wedding|matrimonio|event planner/i, typeEs: 'Wedding Planner', typeEn: 'Wedding Planner', defaultNameEs: 'Vows Events', defaultNameEn: 'Vows Events' },
  { slug: 'nexus', categoryKey: 'corporate', keywords: /consultor[ií]a|consulting|b2b|asesor[ií]a empres/i, typeEs: 'Consultoría B2B', typeEn: 'B2B Consulting', defaultNameEs: 'Nexus Consulting', defaultNameEn: 'Nexus Consulting' },
  { slug: 'vanguard', categoryKey: 'corporate', keywords: /marketing|publicidad|agencia creativa|social media/i, typeEs: 'Agencia de Marketing', typeEn: 'Marketing Agency', defaultNameEs: 'Vanguard Agency', defaultNameEn: 'Vanguard Agency' },
  { slug: 'habitat', categoryKey: 'corporate', keywords: /inmobiliaria|real estate|propiedad|vivienda/i, typeEs: 'Inmobiliaria', typeEn: 'Real Estate', defaultNameEs: 'Habitat Inmobiliaria', defaultNameEn: 'Habitat Real Estate' },
  { slug: 'lex', categoryKey: 'corporate', keywords: /abogad|law firm|despacho de abog|bufete|notar[ií]a|jur[ií]dic/i, typeEs: 'Despacho de Abogados', typeEn: 'Law Firm', defaultNameEs: 'Lex Abogados', defaultNameEn: 'Lex Law Firm' },
  { slug: 'ledger', categoryKey: 'corporate', keywords: /fiscal|contabil|tax|finanzas corpor/i, typeEs: 'Asesoría Fiscal', typeEn: 'Tax Advisory', defaultNameEs: 'Ledger Asesores', defaultNameEn: 'Ledger Advisors' },
  { slug: 'shield', categoryKey: 'corporate', keywords: /seguro|insurance|corredur/i, typeEs: 'Seguros & Correduría', typeEn: 'Insurance Brokerage', defaultNameEs: 'Shield Seguros', defaultNameEn: 'Shield Insurance' },
  { slug: 'arc', categoryKey: 'tech', keywords: /saas|startup|software|app|plataforma/i, typeEs: 'Startup SaaS', typeEn: 'SaaS Startup', defaultNameEs: 'Arc SaaS', defaultNameEn: 'Arc SaaS' },
  { slug: 'vault', categoryKey: 'tech', keywords: /fintech|financier|pagos|banking/i, typeEs: 'Fintech', typeEn: 'Fintech', defaultNameEs: 'Vault Fintech', defaultNameEn: 'Vault Fintech' },
  { slug: 'neural', categoryKey: 'tech', keywords: /\bia\b|inteligencia artificial|machine learning|ml\b|deep learning/i, typeEs: 'IA & Machine Learning', typeEn: 'AI & Machine Learning', defaultNameEs: 'Neural AI', defaultNameEn: 'Neural AI' },
  { slug: 'sentinel', categoryKey: 'tech', keywords: /cibersegur|cybersecurity|seguridad inform/i, typeEs: 'Ciberseguridad', typeEn: 'Cybersecurity', defaultNameEs: 'Sentinel Security', defaultNameEn: 'Sentinel Security' },
  { slug: 'codecraft', categoryKey: 'tech', keywords: /desarrollo web|dev agency|programaci|desarrollo de software/i, typeEs: 'Agencia de Desarrollo', typeEn: 'Development Agency', defaultNameEs: 'Codecraft Dev', defaultNameEn: 'Codecraft Dev' },
  { slug: 'cloudline', categoryKey: 'tech', keywords: /cloud|infraestructura|devops|hosting/i, typeEs: 'Infraestructura Cloud', typeEn: 'Cloud Infrastructure', defaultNameEs: 'Cloudline', defaultNameEn: 'Cloudline' },
];

const GENERIC_NAMES = /^(restaurante|resaurante|restaurant|cafeter[ií]a|caf[eé]|web|sitio|p[aá]gina|negocio|empresa|tienda|d[öo]ner kebab|kebab)$/i;

function stripLegalPageNoise(prompt: string): string {
  return prompt.replace(
    /\b(p[áa]ginas?\s+legales?|aviso\s+legal|pol[íi]tica\s+de\s+(privacidad|cookies)|pol[íi]tica\s+legal|t[ée]rminos\s+y\s+condiciones|footer\s+legal|legal\s+pages?|rgpd|gdpr)\b/gi,
    ' '
  );
}

function extractBusinessName(prompt: string, rule: IntentRule, lang: 'es' | 'en'): string {
  const patterns = [
    /(?:que\s+)?se\s+llama\s+([A-ZÁÉÍÓÚÑ][\wáéíóúñ0-9\s&'-]{2,50}?)(?:\s*,|\s+que|\s+y|\s+con|\.|$)/i,
    /(?:llamad[oa]|named|called)\s+["']([^"']+)["']/i,
    /(?:llamad[oa]|named|called)\s+([A-ZÁÉÍÓÚÑ][\wáéíóúñ0-9\s&'-]{2,40})/i,
    /(Royal Bang[\w\s&'-]+(?:Studio)?)/i,
    /(Rest Art[\w\s'&.-]*)/i,
    /(Kebab Hut[\w\s]*Vallecas?)/i,
    /(Kebab Hut[\w\s]*)/i,
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) {
      const name = match[1].trim().replace(/\s+(que|con|y)$/i, '').trim();
      if (name.length >= 3 && !GENERIC_NAMES.test(name)) return name;
    }
  }

  return lang === 'es' ? rule.defaultNameEs : rule.defaultNameEn;
}

export function parseSiteFeatures(prompt: string): SiteFeatures {
  const lower = prompt.toLowerCase();
  const listing = isGoogleListingPrompt(prompt);
  const hasList = /,|\by\b|con\s+/i.test(prompt);
  const mentioned = (re: RegExp) => re.test(lower);
  const menu = mentioned(/men[uú]|menu|carta|producto|tatuaje|piercing|servicio/i) || listing;

  return {
    menu,
    services: !menu && (!hasList || mentioned(/servicio|servicos|service/)),
    about: mentioned(/sobre nosotros|about us|quienes somos|about/) || listing,
    blog: mentioned(/blog|noticias|art[ií]culo|news/),
    gallery: !hasList || mentioned(/galer[ií]a|gallery|im[aá]gen|foto|ver fotos/i) || listing,
    reviews: mentioned(/reseñ|review|testimonio|opinion|opiniones/i) || listing,
    location: mentioned(/ubicaci|location|mapa|direcci|llegar|puente de vallecas/i) || listing,
    contact: mentioned(/contacto|contact|formulario|tel[eé]fono|llamar/i) || listing,
    reservation: mentioned(/reserva|reservar|mesa|booking|table|cita/i) || (listing && /tatuaje|tattoo|piercing|restaurante|caf[ée]|terraza/i.test(lower)),
    calendar: mentioned(/calendario|calendar|fecha|disponibilidad/),
    legalFooter: !hasList || mentioned(/legal|aviso|privacidad|cookies|t[ée]rminos|footer/) || listing,
    social: mentioned(/redes sociales|social|instagram|facebook|google/i) || listing,
    whatsapp: mentioned(/whatsapp|wa\.me/i) || !!listing,
    scrollUp: mentioned(/scroll up|scroll-up|subir|volver arriba/i) || !!listing,
  };
}

export function isSiteBuildPrompt(prompt: string): boolean {
  if (isGoogleListingPrompt(prompt)) return true;
  const lower = prompt.toLowerCase();
  if (/crea(r?)|genera|diseña|haz(me)?|quiero.*(web|sitio|p[aá]gina)/i.test(lower)) return true;
  if (/que\s+(tenga|se\s+llame)|estilo.*(kebab|d[öo]ner|restaur|tatuaje|tattoo)/i.test(lower)) return true;
  if (/(inicio|men[uú]|galer[ií]a|reseñas|footer).*(inicio|men[uú]|galer[ií]a|reseñas)/i.test(lower)) return true;
  return false;
}

export function isCosmeticPrompt(prompt: string): boolean {
  if (isSiteBuildPrompt(prompt)) return false;
  const lower = prompt.toLowerCase();
  return /elegante|refinad|testimonio|tipograf|luminosa|clara|animac|impactante|cabecera|hero|color|tierra|premium|sofisticad/.test(lower);
}

function scoreRule(rule: IntentRule, normalized: string): number {
  const re = new RegExp(rule.keywords.source, 'gi');
  const matches = normalized.match(re);
  if (!matches) return 0;
  return matches.length * 10;
}

export function analyzeIntent(prompt: string, lang: 'es' | 'en'): ParsedIntent {
  const features = parseSiteFeatures(prompt);
  const variant = detectVariant(prompt);
  const normalized = stripLegalPageNoise(prompt).toLowerCase();

  let bestRule = INTENT_RULES.find((r) => r.slug === 'vesper')!;
  let bestScore = 0;

  for (const rule of INTENT_RULES) {
    const score = scoreRule(rule, normalized);
    if (score > bestScore) {
      bestScore = score;
      bestRule = rule;
    }
  }

  const profileRule =
    variant === 'kebab'
      ? INTENT_RULES.find((r) => r.keywords.test('kebab'))!
      : variant === 'tattoo'
        ? INTENT_RULES.find((r) => r.slug === 'iron-ink')!
        : variant === 'cafe'
          ? INTENT_RULES.find((r) => r.slug === 'sable')!
          : variant === 'beauty'
            ? INTENT_RULES.find((r) => r.slug === 'lumen')!
            : variant === 'corporate'
              ? INTENT_RULES.find((r) => r.slug === 'ledger')!
              : variant === 'automotive'
                ? INTENT_RULES.find((r) => r.slug === 'torque')!
                : variant === 'luxury'
                  ? INTENT_RULES.find((r) => r.slug === 'vesper')!
                  : variant === 'nonprofit'
                    ? INTENT_RULES.find((r) => r.slug === 'arc')!
                    : bestRule;

  const listing = parseGoogleListing(prompt);
  const businessName = listing?.businessName ?? extractBusinessName(prompt, profileRule, lang);

  return {
    templateSlug: profileRule.slug,
    businessName,
    businessType:
      variant === 'kebab'
        ? (lang === 'es' ? 'Restaurante Kebab' : 'Kebab Restaurant')
        : variant === 'tattoo'
          ? (lang === 'es' ? 'Estudio de Tatuajes & Piercing' : 'Tattoo & Piercing Studio')
          : variant === 'cafe'
            ? (lang === 'es' ? 'Restaurante & Café' : 'Restaurant & Café')
            : variant === 'beauty'
              ? (lang === 'es' ? 'Salón de Belleza' : 'Beauty Salon')
              : variant === 'corporate'
                ? (lang === 'es' ? 'Asesoría Fiscal & Contable' : 'Tax & Accounting Advisory')
                : variant === 'automotive'
                  ? (lang === 'es' ? 'Concesionario de Motos' : 'Motorcycle Dealer')
                  : variant === 'luxury'
                    ? (lang === 'es' ? 'Restaurante Gourmet' : 'Fine Dining Restaurant')
                    : variant === 'nonprofit'
                      ? (lang === 'es' ? 'Plataforma de Accesibilidad' : 'Accessibility Platform')
                      : (lang === 'es' ? profileRule.typeEs : profileRule.typeEn),
    categoryKey: profileRule.categoryKey,
    features,
    variant,
  };
}
