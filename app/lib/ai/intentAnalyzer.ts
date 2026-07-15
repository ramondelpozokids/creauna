import type { TemplateCategory } from '../../data/templates';
import { matchSectorFromPrompt } from '../../data/sectorLibrary';
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
  sidebar: boolean;
  documentUpload: boolean;
  vividColors: boolean;
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
  { slug: 'stanton', categoryKey: 'gastronomy', keywords: /recetas|blog de comida|blog gastron|food blog|comida casera|blog culin|libro de recetas|stanton/i, typeEs: 'Blog de Recetas', typeEn: 'Recipe Blog', defaultNameEs: 'Stanton Recetas', defaultNameEn: 'Stanton Recipes' },
  { slug: 'kebab', categoryKey: 'gastronomy', keywords: /kebab|d[öo]ner|doner|durum|falafel/i, typeEs: 'Restaurante Kebab', typeEn: 'Kebab Restaurant', defaultNameEs: 'Kebab Hut Vallecas', defaultNameEn: 'Kebab Hut Vallecas' },
  { slug: 'trattoria', categoryKey: 'gastronomy', keywords: /italian[oa]|trattoria|pizza|pasta|risotto|italiano/i, typeEs: 'Restaurante Italiano', typeEn: 'Italian Restaurant', defaultNameEs: 'Trattoria Bella', defaultNameEn: 'Bella Trattoria' },
  { slug: 'sakura', categoryKey: 'gastronomy', keywords: /japon[eé]s|sushi|ramen|izakaya|japanese/i, typeEs: 'Restaurante Japonés', typeEn: 'Japanese Restaurant', defaultNameEs: 'Sakura House', defaultNameEn: 'Sakura House' },
  { slug: 'mokka', categoryKey: 'gastronomy', keywords: /cafeter[ií]a|caf[eé]|coffee|especialidad|barista|tostad/i, typeEs: 'Cafetería de Especialidad', typeEn: 'Specialty Coffee Shop', defaultNameEs: 'Mokka Coffee', defaultNameEn: 'Mokka Coffee' },
  { slug: 'ember', categoryKey: 'gastronomy', keywords: /parrilla|asador|grill|steakhouse|brasa|barbacoa|bbq/i, typeEs: 'Parrilla & Asador', typeEn: 'Grill & Steakhouse', defaultNameEs: 'Ember Grill', defaultNameEn: 'Ember Grill' },
  { slug: 'sable', categoryKey: 'gastronomy', keywords: /bistro|brasserie|brunch/i, typeEs: 'Bistro & Gastronomía', typeEn: 'Bistro & Gastronomy', defaultNameEs: 'Bistro Sable', defaultNameEn: 'Sable Bistro' },
  { slug: 'vesper', categoryKey: 'gastronomy', keywords: /restaurante|resaurante|restaurant|gourmet|fine dining|alta cocina|comida|gastronom|men[uú]|carta|mesa|comedor|cocina/i, typeEs: 'Restaurante', typeEn: 'Restaurant', defaultNameEs: 'Restaurante Vesper', defaultNameEn: 'Vesper Restaurant' },
  { slug: 'classic-cut', categoryKey: 'services', keywords: /barber[ií]a|barber|barbershop|afeitad|grooming masculin/i, typeEs: 'Barbería Premium', typeEn: 'Premium Barbershop', defaultNameEs: 'Classic Cut', defaultNameEn: 'Classic Cut' },
  { slug: 'lumen', categoryKey: 'services', keywords: /est[eé]tica|cl[ií]nica(?! dental)|spa m[eé]dico|wellness|belleza|peluquer[ií]a|sal[oó]n de belleza|uñas|manicur/i, typeEs: 'Salón de Belleza', typeEn: 'Beauty Salon', defaultNameEs: 'Estilo Belleza', defaultNameEn: 'Style Beauty' },
  { slug: 'iron-ink', categoryKey: 'services', keywords: /tatuaje|tattoo|piercing|tinta|royal bang|gemas dentales/i, typeEs: 'Estudio de Tatuajes', typeEn: 'Tattoo Studio', defaultNameEs: 'Royal Bang Tattoo & Piercing Studio', defaultNameEn: 'Royal Bang Tattoo & Piercing Studio' },
  { slug: 'torque', categoryKey: 'services', keywords: /taller de motos|motorcycle|motocicleta|custom shop/i, typeEs: 'Taller de Motos', typeEn: 'Motorcycle Workshop', defaultNameEs: 'Torque Garage', defaultNameEn: 'Torque Garage' },
  { slug: 'pistons', categoryKey: 'services', keywords: /mec[aá]nic|taller mec|auto repair|automotriz|chapa|veh[ií]culo/i, typeEs: 'Taller Mecánico', typeEn: 'Auto Repair Shop', defaultNameEs: 'Pistons Auto', defaultNameEn: 'Pistons Auto' },
  { slug: 'flow', categoryKey: 'services', keywords: /fontaner[ií]a|plumb|electricista|electric|reforma|reformas|construc|pintor|pintura|carpinter|dom[oó]tica/i, typeEs: 'Fontanería & Reformas', typeEn: 'Plumbing & Renovation', defaultNameEs: 'Flow Reformas', defaultNameEn: 'Flow Renovations' },
  { slug: 'sparkle', categoryKey: 'services', keywords: /limpieza|cleaning|mantenimiento dom/i, typeEs: 'Limpieza Profesional', typeEn: 'Professional Cleaning', defaultNameEs: 'Sparkle Clean', defaultNameEn: 'Sparkle Clean' },
  { slug: 'forge', categoryKey: 'services', keywords: /gimnasio|gym|fitness|crossfit|entrenamiento/i, typeEs: 'Gimnasio & Fitness', typeEn: 'Gym & Fitness', defaultNameEs: 'Forge Fitness', defaultNameEn: 'Forge Fitness' },
  { slug: 'zenith', categoryKey: 'services', keywords: /yoga|pilates|mindfulness|meditaci/i, typeEs: 'Estudio de Yoga', typeEn: 'Yoga Studio', defaultNameEs: 'Zenith Yoga', defaultNameEn: 'Zenith Yoga' },
  { slug: 'paw', categoryKey: 'services', keywords: /peluquer[ií]a canina|mascota|pet grooming|veterin/i, typeEs: 'Peluquería Canina', typeEn: 'Pet Grooming', defaultNameEs: 'Paw Grooming', defaultNameEn: 'Paw Grooming' },
  { slug: 'verde', categoryKey: 'services', keywords: /jardiner[ií]a|landscap|paisaj|vivero/i, typeEs: 'Jardinería & Paisajismo', typeEn: 'Landscaping', defaultNameEs: 'Verde Jardines', defaultNameEn: 'Verde Gardens' },
  { slug: 'lens', categoryKey: 'services', keywords: /fotograf|photograph|video|vide[oó]gra/i, typeEs: 'Estudio Fotográfico', typeEn: 'Photography Studio', defaultNameEs: 'Lens Studio', defaultNameEn: 'Lens Studio' },
  { slug: 'retreat', categoryKey: 'luxury', keywords: /hotel|hostal|boutique hotel|hospedaje/i, typeEs: 'Hotel Boutique', typeEn: 'Boutique Hotel', defaultNameEs: 'Retreat Hotel', defaultNameEn: 'Retreat Hotel' },
  { slug: 'haven', categoryKey: 'luxury', keywords: /casa rural|turismo rural|apartamento tur[ií]stic|camping|agencia de viajes|actividades tur[ií]stic|alquiler vacacional/i, typeEs: 'Alojamiento Turístico', typeEn: 'Tourism Lodging', defaultNameEs: 'Haven Rural', defaultNameEn: 'Haven Rural' },
  { slug: 'serene', categoryKey: 'luxury', keywords: /\bspa\b|wellness de lujo|\bmasaje/i, typeEs: 'Spa de Lujo', typeEn: 'Luxury Spa', defaultNameEs: 'Serene Spa', defaultNameEn: 'Serene Spa' },
  { slug: 'atelier', categoryKey: 'luxury', keywords: /joyer[ií]a|jewelry|reloj|watch/i, typeEs: 'Joyería & Relojería', typeEn: 'Jewelry & Watches', defaultNameEs: 'Atelier Joyas', defaultNameEn: 'Atelier Jewelry' },
  { slug: 'maison', categoryKey: 'luxury', keywords: /moda boutique|fashion|ropa|tienda de ropa/i, typeEs: 'Moda Boutique', typeEn: 'Fashion Boutique', defaultNameEs: 'Maison Mode', defaultNameEn: 'Maison Mode' },
  { slug: 'vows', categoryKey: 'luxury', keywords: /boda|wedding|matrimonio|event planner/i, typeEs: 'Wedding Planner', typeEn: 'Wedding Planner', defaultNameEs: 'Vows Events', defaultNameEn: 'Vows Events' },
  { slug: 'nexus', categoryKey: 'corporate', keywords: /consultor[ií]a|consulting|b2b|asesor[ií]a empres/i, typeEs: 'Consultoría B2B', typeEn: 'B2B Consulting', defaultNameEs: 'Nexus Consulting', defaultNameEn: 'Nexus Consulting' },
  { slug: 'vanguard', categoryKey: 'corporate', keywords: /marketing|publicidad|agencia creativa|social media/i, typeEs: 'Agencia de Marketing', typeEn: 'Marketing Agency', defaultNameEs: 'Vanguard Agency', defaultNameEn: 'Vanguard Agency' },
  { slug: 'habitat', categoryKey: 'corporate', keywords: /inmobiliaria|real estate|propiedad|vivienda|promotora|gesti[oó]n patrimonial/i, typeEs: 'Inmobiliaria', typeEn: 'Real Estate', defaultNameEs: 'Habitat Inmobiliaria', defaultNameEn: 'Habitat Real Estate' },
  { slug: 'blueprint', categoryKey: 'corporate', keywords: /arquitect|interiorismo|estudio de arquitect|urbanismo|proyecto arquitect|diseño de interiores/i, typeEs: 'Estudio de Arquitectura', typeEn: 'Architecture Studio', defaultNameEs: 'Blueprint Arquitectos', defaultNameEn: 'Blueprint Architects' },
  { slug: 'care', categoryKey: 'corporate', keywords: /cl[ií]nica dental|odontolog|ortodon|fisioter|fisio|psicolog|nutrici|medicina est[eé]tica|[óo]ptic|farmacia|cl[ií]nica m[eé]d|rehabilitaci[oó]n/i, typeEs: 'Clínica de Salud', typeEn: 'Health Clinic', defaultNameEs: 'Care Salud', defaultNameEn: 'Care Health' },
  { slug: 'lex', categoryKey: 'corporate', keywords: /abogad|law firm|despacho de abog|bufete|notar[ií]a|jur[ií]dic/i, typeEs: 'Despacho de Abogados', typeEn: 'Law Firm', defaultNameEs: 'Lex Abogados', defaultNameEn: 'Lex Law Firm' },
  { slug: 'ledger', categoryKey: 'corporate', keywords: /gestor[ií]a|asesor[ií]a|fiscal|contabil|tax|finanzas corpor|laboral/i, typeEs: 'Asesoría Fiscal', typeEn: 'Tax Advisory', defaultNameEs: 'Ledger Asesores', defaultNameEn: 'Ledger Advisors' },
  { slug: 'shield', categoryKey: 'corporate', keywords: /seguro|insurance|corredur/i, typeEs: 'Seguros & Correduría', typeEn: 'Insurance Brokerage', defaultNameEs: 'Shield Seguros', defaultNameEn: 'Shield Insurance' },
  { slug: 'arc', categoryKey: 'tech', keywords: /saas|startup|software|app|plataforma/i, typeEs: 'Startup SaaS', typeEn: 'SaaS Startup', defaultNameEs: 'Arc SaaS', defaultNameEn: 'Arc SaaS' },
  { slug: 'vault', categoryKey: 'tech', keywords: /fintech|financier|pagos|banking/i, typeEs: 'Fintech', typeEn: 'Fintech', defaultNameEs: 'Vault Fintech', defaultNameEn: 'Vault Fintech' },
  { slug: 'neural', categoryKey: 'tech', keywords: /\bia\b|inteligencia artificial|machine learning|ml\b|deep learning/i, typeEs: 'IA & Machine Learning', typeEn: 'AI & Machine Learning', defaultNameEs: 'Neural AI', defaultNameEn: 'Neural AI' },
  { slug: 'sentinel', categoryKey: 'tech', keywords: /cibersegur|cybersecurity|seguridad inform/i, typeEs: 'Ciberseguridad', typeEn: 'Cybersecurity', defaultNameEs: 'Sentinel Security', defaultNameEn: 'Sentinel Security' },
  { slug: 'codecraft', categoryKey: 'tech', keywords: /desarrollo web|dev agency|programaci|desarrollo de software/i, typeEs: 'Agencia de Desarrollo', typeEn: 'Development Agency', defaultNameEs: 'Codecraft Dev', defaultNameEn: 'Codecraft Dev' },
  { slug: 'cloudline', categoryKey: 'tech', keywords: /cloud|infraestructura|devops|hosting/i, typeEs: 'Infraestructura Cloud', typeEn: 'Cloud Infrastructure', defaultNameEs: 'Cloudline', defaultNameEn: 'Cloudline' },
  { slug: 'volt', categoryKey: 'tech', keywords: /energ[ií]as?\s+renov|fotovolta|placas\s+solares|autoconsumo|energ[ií]a\s+solar|paneles\s+solares|bater[ií]as\s+solares|eficiencia\s+energ|wallbox|punto[s]?\s+de\s+recarga|cargador.*el[eé]ctric|ritest|bolet[ií]n\s+el[eé]ctric|instalaci[oó]n\s+fotovolta|comunidad\s+energ|aerotermia|instalador.*fotovolta/i, typeEs: 'Energías Renovables', typeEn: 'Renewable Energy', defaultNameEs: 'Helios Energía', defaultNameEn: 'Helios Energy' },
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

function isNavMenuRequest(prompt: string): boolean {
  return /menu[\s_-]*(nav|navbar)|navbar|nav[\s-]*bar|men[uú]\s*(de\s+)?navegaci/i.test(prompt);
}

export function parseSiteFeatures(prompt: string): SiteFeatures {
  const lower = prompt.toLowerCase();
  const listing = isGoogleListingPrompt(prompt);
  const hasList = /,|\by\b|con\s+/i.test(prompt);
  const mentioned = (re: RegExp) => re.test(lower);
  const navMenu = isNavMenuRequest(lower);
  const isGestoria = /gestor[ií]a|asesor[ií]a/i.test(lower);
  const isRenewable = /energ[ií]as?\s+renov|fotovolta|placas\s+solares|autoconsumo|energ[ií]a\s+solar|ritest/i.test(lower);
  const isFoodBlog = /recetas|blog de comida|blog gastron|food blog|comida casera|stanton/i.test(lower);
  const isJewelry =
    /joyer[ií]a|relojer[ií]a|jewelry|watchmaker|rolex|cartier|patek|omega|bulgari|tiffany|audemars|alta relojer/i.test(
      lower
    );
  const menu =
    isFoodBlog ||
    (!navMenu &&
      !isGestoria &&
      (mentioned(/carta|producto|men[uú]\s+(del|degustaci)/) ||
        (mentioned(/men[uú]|menu/) && !navMenu) ||
        listing));

  if (isJewelry) {
    return {
      menu: true,
      services: true,
      about: true,
      blog: mentioned(/blog|noticias|news|tendencias|gu[ií]as/) || true,
      gallery: true,
      reviews: true,
      location: true,
      contact: true,
      reservation: true,
      calendar: mentioned(/calendario|calendar/),
      legalFooter: true,
      social: true,
      whatsapp: true,
      scrollUp: true,
      sidebar: false,
      documentUpload: false,
      vividColors: false,
    };
  }

  return {
    menu,
    services: isGestoria || isRenewable || (!menu && (!hasList || mentioned(/servicio|servicos|service|asesor/i))),
    about: isGestoria || isRenewable || mentioned(/sobre nosotros|about us|quienes somos|about/) || listing,
    blog: isFoodBlog || mentioned(/blog|noticias|art[ií]culo|news|publicaciones/i),
    gallery: isGestoria || isRenewable || !hasList || mentioned(/galer[ií]a|gallery|im[aá]gen|foto|ver fotos|proyecto/i) || listing,
    reviews: isGestoria || isRenewable || mentioned(/reseñ|review|testimonio|opinion|opiniones/i) || listing,
    location: isGestoria || isRenewable || mentioned(/ubicaci|location|mapa|direcci|llegar|sitio de ubicaci/i) || listing,
    contact: isGestoria || isRenewable || mentioned(/contacto|contact|formulario|estudio\s+gratuito/i) || listing,
    reservation: mentioned(/reserva|reservar|mesa|booking|table|cita/i) || (listing && /tatuaje|tattoo|piercing|restaurante|caf[ée]|terraza/i.test(lower)),
    calendar: mentioned(/calendario|calendar|fecha|disponibilidad/),
    legalFooter: isGestoria || !hasList || mentioned(/legal|aviso|privacidad|cookies|t[ée]rminos|footer/) || listing,
    social: mentioned(/redes sociales|social|instagram|facebook|google/i) || listing,
    whatsapp: isGestoria || mentioned(/whatsapp|wa\.me/i) || !!listing,
    scrollUp: isGestoria || mentioned(/scroll[\s-]?up|scoll[\s-]?up|volver arriba|subir arriba|bot[oó]n.*subir/i) || !!listing,
    sidebar: mentioned(/sidebar|barra lateral|men[uú]\s*lateral/i),
    documentUpload: isGestoria || mentioned(/document|encriptad|archivo|carga segura|subir.*document/i),
    vividColors: mentioned(/colores?\s+vivos|vibrant|vivid|colorido/i),
  };
}

export function isSiteBuildPrompt(prompt: string): boolean {
  if (isGoogleListingPrompt(prompt)) return true;
  const lower = prompt.toLowerCase();
  if (/crea(r?)\s+(me\s+)?(una?\s+)?(web|sitio|p[aá]gina|blog)/i.test(lower)) return true;
  if (/genera(r?)\s+(me\s+)?(una?\s+)?(web|sitio|p[aá]gina|blog)/i.test(lower)) return true;
  if (/diseñ(a|ar)\s+(me\s+)?(una?\s+)?(web|sitio|p[aá]gina|blog)/i.test(lower)) return true;
  if (/haz(me)?\s+(me\s+)?(una?\s+)?(web|sitio|p[aá]gina|blog)/i.test(lower)) return true;
  if (/quiero.*(web|sitio|p[aá]gina|blog)/i.test(lower)) return true;
  if (/vi(en)?\s+.*(web|p[aá]gina|squarespace|wix|plantilla)/i.test(lower)) return true;
  if (/he\s+visto.*(web|p[aá]gina|despacho|negocio|restaurante|barber)/i.test(lower)) return true;
  if (/me\s+gust[oó].*(web|p[aá]gina|estilo|diseño)/i.test(lower)) return true;
  if (/(como|parecid[oa]|similar)\s+(a\s+)?(la\s+)?(web|p[aá]gina|de|un)/i.test(lower)) return true;
  if (/estilo\s+(squarespace|wix|stanton|webflow|framer|ritest)/i.test(lower)) return true;
  if (/squarespace|wix\.com|webflow\.io|ritest\.es/i.test(lower)) return true;
  if (/inspirad.*en.*(ritest|web|referencia)/i.test(lower)) return true;
  if (/web\s+de\s+(gestor|asesor|restaur|barber|taller|sal[oó]n|negocio|abogad|despacho)/i.test(lower)) return true;
  if (/(gestor[ií]a|asesor[ií]a).*(navbar|sidebar|footer|formulario|whatsapp)/i.test(lower)) return true;
  if (/que\s+(tenga|se\s+llame)|estilo.*(kebab|d[öo]ner|restaur|tatuaje|tattoo)/i.test(lower)) return true;
  if (/(inicio|men[uú]|galer[ií]a|reseñas|footer).*(inicio|men[uú]|galer[ií]a|reseñas)/i.test(lower)) return true;
  return false;
}

/** Slug de plantilla en data/templates (p. ej. kebab → vesper). */
export function resolveTemplateSlug(ruleSlug: string): string {
  if (ruleSlug === 'kebab') return 'vesper';
  return ruleSlug;
}

const FULL_SITE_FEATURES: SiteFeatures = {
  menu: false,
  services: false,
  about: false,
  blog: false,
  gallery: true,
  reviews: true,
  location: true,
  contact: true,
  reservation: false,
  calendar: false,
  legalFooter: true,
  social: true,
  whatsapp: true,
  scrollUp: true,
  sidebar: false,
  documentUpload: false,
  vividColors: false,
};

const TEMPLATE_VARIANT: Partial<Record<string, BusinessVariant>> = {
  'iron-ink': 'tattoo',
  ledger: 'corporate',
  lex: 'corporate',
  shield: 'corporate',
  nexus: 'corporate',
  vanguard: 'corporate',
  habitat: 'corporate',
  blueprint: 'corporate',
  care: 'corporate',
  volt: 'renewable',
  lumen: 'beauty',
  'classic-cut': 'beauty',
  stanton: 'foodblog',
  mokka: 'cafe',
  sable: 'cafe',
  vesper: 'luxury',
  torque: 'automotive',
  pistons: 'automotive',
  retreat: 'luxury',
  serene: 'luxury',
  atelier: 'jewelry',
  maison: 'luxury',
  vows: 'luxury',
  essence: 'luxury',
  chronicle: 'luxury',
  arc: 'nonprofit',
  kebab: 'kebab',
  trattoria: 'italian',
};

function findIntentRuleForTemplate(slug: string): IntentRule {
  const resolved = resolveTemplateSlug(slug);
  return (
    INTENT_RULES.find((r) => r.slug === resolved) ??
    INTENT_RULES.find((r) => r.slug === slug) ??
    INTENT_RULES.find((r) => r.slug === 'vesper')!
  );
}

function defaultFeaturesForTemplateCategory(category: TemplateCategory, slug: string): SiteFeatures {
  const base = { ...FULL_SITE_FEATURES };

  switch (category) {
    case 'gastronomy':
      return { ...base, menu: true, about: true, reservation: true };
    case 'services':
      return {
        ...base,
        services: true,
        about: true,
        reservation: ['iron-ink', 'classic-cut', 'lumen', 'forge', 'zenith', 'paw', 'lens'].includes(slug),
      };
    case 'luxury':
      return { ...base, services: true, about: true, reservation: true };
    case 'corporate':
      return {
        ...base,
        services: true,
        about: true,
        reservation: ['care', 'lex'].includes(slug),
        documentUpload: slug === 'ledger',
      };
    case 'tech':
      return { ...base, services: true, about: true, gallery: slug !== 'arc' };
    default:
      return { ...base, services: true, about: true };
  }
}

function variantForTemplateSlug(slug: string, rule: IntentRule): BusinessVariant {
  const resolved = resolveTemplateSlug(slug);
  if (TEMPLATE_VARIANT[resolved]) return TEMPLATE_VARIANT[resolved]!;
  if (TEMPLATE_VARIANT[slug]) return TEMPLATE_VARIANT[slug]!;
  return detectVariant(`${rule.typeEs} ${rule.typeEn} ${slug}`);
}

/** Intent completo al cargar una plantilla del catálogo en Studio (mismo motor que «describir web»). */
export function buildIntentFromTemplateSlug(templateSlug: string, lang: 'es' | 'en'): ParsedIntent {
  const slug = resolveTemplateSlug(templateSlug);
  const rule = findIntentRuleForTemplate(slug);
  const features = defaultFeaturesForTemplateCategory(rule.categoryKey, slug);
  const variant = variantForTemplateSlug(slug, rule);

  return {
    templateSlug: slug,
    businessName: lang === 'es' ? rule.defaultNameEs : rule.defaultNameEn,
    businessType: lang === 'es' ? rule.typeEs : rule.typeEn,
    categoryKey: rule.categoryKey,
    features,
    variant,
  };
}

export function isExistingSiteSections(sections: { type: string; html?: string }[]): boolean {
  if (sections.some((s) => s.type === 'fullpage' && (s.html?.length ?? 0) > 5000)) {
    return true;
  }
  if (sections.length <= 1) return false;
  const substantive = sections.filter(
    (s) => s.type !== 'widgets' && (s.html?.length ?? 0) > 200
  );
  return substantive.length >= 2;
}

export function shouldGenerateFullSite(
  prompt: string,
  action: string | undefined,
  previewSections: { type: string; html?: string }[]
): boolean {
  if (action === 'initial') return true;
  if (action !== 'change') return false;
  if (!isSiteBuildPrompt(prompt)) return false;
  return !isExistingSiteSections(previewSections);
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

function mergeSiteFeatures(defaults: SiteFeatures, parsed: SiteFeatures): SiteFeatures {
  const keys = Object.keys(defaults) as (keyof SiteFeatures)[];
  const merged = { ...defaults };
  for (const key of keys) {
    merged[key] = defaults[key] || parsed[key];
  }
  return merged;
}

export function analyzeIntent(prompt: string, lang: 'es' | 'en'): ParsedIntent {
  const parsedFeatures = parseSiteFeatures(prompt);
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

  const sectorMatch = matchSectorFromPrompt(prompt);
  if (sectorMatch) {
    const sectorRule = INTENT_RULES.find((r) => r.slug === sectorMatch.templateSlug);
    if (sectorRule) {
      const boosted = scoreRule(sectorRule, normalized) + (sectorMatch.tier === 'priority' ? 20 : 5);
      if (boosted > bestScore) {
        bestScore = boosted;
        bestRule = sectorRule;
      }
    }
  }

  const profileRule =
    variant === 'kebab'
      ? INTENT_RULES.find((r) => r.slug === 'kebab')!
      : variant === 'tattoo'
        ? INTENT_RULES.find((r) => r.slug === 'iron-ink')!
            : variant === 'cafe'
              ? INTENT_RULES.find((r) => r.slug === 'sable')!
              : variant === 'foodblog'
                ? INTENT_RULES.find((r) => r.slug === 'stanton')!
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
                    : variant === 'renewable'
                      ? INTENT_RULES.find((r) => r.slug === 'volt')!
                      : bestRule;

  const listing = parseGoogleListing(prompt);
  const businessName = listing?.businessName ?? extractBusinessName(prompt, profileRule, lang);
  const templateSlug = resolveTemplateSlug(profileRule.slug);
  const features = mergeSiteFeatures(
    defaultFeaturesForTemplateCategory(profileRule.categoryKey, templateSlug),
    parsedFeatures
  );

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
            : variant === 'foodblog'
              ? (lang === 'es' ? 'Blog de Recetas & Comida Casera' : 'Recipe & Home Cooking Blog')
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
                      : variant === 'renewable'
                        ? (lang === 'es' ? 'Energías Renovables & Solar' : 'Renewable Energy & Solar')
                        : (lang === 'es' ? profileRule.typeEs : profileRule.typeEn),
    categoryKey: profileRule.categoryKey,
    features,
    variant,
  };
}
