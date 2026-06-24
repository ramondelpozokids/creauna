import type { TemplateCategory } from '../../data/templates';

export interface ParsedIntent {
  templateSlug: string;
  businessName: string;
  businessType: string;
  categoryKey: TemplateCategory;
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
  { slug: 'trattoria', categoryKey: 'gastronomy', keywords: /italian[oa]|trattoria|pizza|pasta|risotto|italiano/i, typeEs: 'Restaurante Italiano', typeEn: 'Italian Restaurant', defaultNameEs: 'Trattoria Bella', defaultNameEn: 'Bella Trattoria' },
  { slug: 'sakura', categoryKey: 'gastronomy', keywords: /japon[eé]s|sushi|ramen|izakaya|japanese/i, typeEs: 'Restaurante Japonés', typeEn: 'Japanese Restaurant', defaultNameEs: 'Sakura House', defaultNameEn: 'Sakura House' },
  { slug: 'mokka', categoryKey: 'gastronomy', keywords: /cafeter[ií]a|caf[eé]|coffee|especialidad|barista|tostad/i, typeEs: 'Cafetería de Especialidad', typeEn: 'Specialty Coffee Shop', defaultNameEs: 'Mokka Coffee', defaultNameEn: 'Mokka Coffee' },
  { slug: 'ember', categoryKey: 'gastronomy', keywords: /parrilla|asador|grill|steakhouse|brasa|barbacoa|bbq/i, typeEs: 'Parrilla & Asador', typeEn: 'Grill & Steakhouse', defaultNameEs: 'Ember Grill', defaultNameEn: 'Ember Grill' },
  { slug: 'sable', categoryKey: 'gastronomy', keywords: /bistro|brasserie|brunch/i, typeEs: 'Bistro & Gastronomía', typeEn: 'Bistro & Gastronomy', defaultNameEs: 'Bistro Sable', defaultNameEn: 'Sable Bistro' },
  { slug: 'vesper', categoryKey: 'gastronomy', keywords: /restaurante|gourmet|fine dining|alta cocina|comida|gastronom/i, typeEs: 'Restaurante Gourmet', typeEn: 'Gourmet Restaurant', defaultNameEs: 'Restaurante Vesper', defaultNameEn: 'Vesper Restaurant' },
  { slug: 'classic-cut', categoryKey: 'services', keywords: /barber[ií]a|barber|barbershop|afeitad|grooming masculin/i, typeEs: 'Barbería Premium', typeEn: 'Premium Barbershop', defaultNameEs: 'Classic Cut', defaultNameEn: 'Classic Cut' },
  { slug: 'lumen', categoryKey: 'services', keywords: /est[eé]tica|cl[ií]nica|dental|spa m[eé]dico|wellness|belleza/i, typeEs: 'Clínica de Estética', typeEn: 'Aesthetic Clinic', defaultNameEs: 'Clínica Lumen', defaultNameEn: 'Lumen Clinic' },
  { slug: 'iron-ink', categoryKey: 'services', keywords: /tatuaje|tattoo|piercing|tinta/i, typeEs: 'Estudio de Tatuajes', typeEn: 'Tattoo Studio', defaultNameEs: 'Iron & Ink', defaultNameEn: 'Iron & Ink' },
  { slug: 'torque', categoryKey: 'services', keywords: /moto|motorcycle|motocicleta|custom shop/i, typeEs: 'Taller de Motos', typeEn: 'Motorcycle Workshop', defaultNameEs: 'Torque Garage', defaultNameEn: 'Torque Garage' },
  { slug: 'pistons', categoryKey: 'services', keywords: /mec[aá]nic|taller|auto repair|automotriz|chapa|veh[ií]culo|garage/i, typeEs: 'Taller Mecánico', typeEn: 'Auto Repair Shop', defaultNameEs: 'Pistons Auto', defaultNameEn: 'Pistons Auto' },
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
  { slug: 'maison', categoryKey: 'luxury', keywords: /boutique|moda|fashion|ropa|tienda de ropa/i, typeEs: 'Moda Boutique', typeEn: 'Fashion Boutique', defaultNameEs: 'Maison Mode', defaultNameEn: 'Maison Mode' },
  { slug: 'vows', categoryKey: 'luxury', keywords: /boda|wedding|matrimonio|event planner/i, typeEs: 'Wedding Planner', typeEn: 'Wedding Planner', defaultNameEs: 'Vows Events', defaultNameEn: 'Vows Events' },
  { slug: 'nexus', categoryKey: 'corporate', keywords: /consultor[ií]a|consulting|b2b|asesor[ií]a empres/i, typeEs: 'Consultoría B2B', typeEn: 'B2B Consulting', defaultNameEs: 'Nexus Consulting', defaultNameEn: 'Nexus Consulting' },
  { slug: 'vanguard', categoryKey: 'corporate', keywords: /marketing|publicidad|agencia creativa|social media/i, typeEs: 'Agencia de Marketing', typeEn: 'Marketing Agency', defaultNameEs: 'Vanguard Agency', defaultNameEn: 'Vanguard Agency' },
  { slug: 'habitat', categoryKey: 'corporate', keywords: /inmobiliaria|real estate|propiedad|vivienda/i, typeEs: 'Inmobiliaria', typeEn: 'Real Estate', defaultNameEs: 'Habitat Inmobiliaria', defaultNameEn: 'Habitat Real Estate' },
  { slug: 'lex', categoryKey: 'corporate', keywords: /abogad|law firm|legal|despacho/i, typeEs: 'Despacho de Abogados', typeEn: 'Law Firm', defaultNameEs: 'Lex Abogados', defaultNameEn: 'Lex Law Firm' },
  { slug: 'ledger', categoryKey: 'corporate', keywords: /fiscal|contabil|tax|finanzas corpor/i, typeEs: 'Asesoría Fiscal', typeEn: 'Tax Advisory', defaultNameEs: 'Ledger Asesores', defaultNameEn: 'Ledger Advisors' },
  { slug: 'shield', categoryKey: 'corporate', keywords: /seguro|insurance|corredur/i, typeEs: 'Seguros & Correduría', typeEn: 'Insurance Brokerage', defaultNameEs: 'Shield Seguros', defaultNameEn: 'Shield Insurance' },
  { slug: 'arc', categoryKey: 'tech', keywords: /saas|startup|software|app|plataforma/i, typeEs: 'Startup SaaS', typeEn: 'SaaS Startup', defaultNameEs: 'Arc SaaS', defaultNameEn: 'Arc SaaS' },
  { slug: 'vault', categoryKey: 'tech', keywords: /fintech|financier|pagos|banking/i, typeEs: 'Fintech', typeEn: 'Fintech', defaultNameEs: 'Vault Fintech', defaultNameEn: 'Vault Fintech' },
  { slug: 'neural', categoryKey: 'tech', keywords: /\bia\b|inteligencia artificial|machine learning|ml\b|deep learning/i, typeEs: 'IA & Machine Learning', typeEn: 'AI & Machine Learning', defaultNameEs: 'Neural AI', defaultNameEn: 'Neural AI' },
  { slug: 'sentinel', categoryKey: 'tech', keywords: /cibersegur|cybersecurity|seguridad inform/i, typeEs: 'Ciberseguridad', typeEn: 'Cybersecurity', defaultNameEs: 'Sentinel Security', defaultNameEn: 'Sentinel Security' },
  { slug: 'codecraft', categoryKey: 'tech', keywords: /desarrollo web|dev agency|programaci|desarrollo de software/i, typeEs: 'Agencia de Desarrollo', typeEn: 'Development Agency', defaultNameEs: 'Codecraft Dev', defaultNameEn: 'Codecraft Dev' },
  { slug: 'cloudline', categoryKey: 'tech', keywords: /cloud|infraestructura|devops|hosting/i, typeEs: 'Infraestructura Cloud', typeEn: 'Cloud Infrastructure', defaultNameEs: 'Cloudline', defaultNameEn: 'Cloudline' },
];

function extractBusinessName(prompt: string, rule: IntentRule, lang: 'es' | 'en'): string {
  const patterns = [
    /(?:llamad[oa]|named|called)\s+["']([^"']+)["']/i,
    /(?:llamad[oa]|named|called)\s+([A-ZÁÉÍÓÚÑ][\wáéíóúñ\s&'-]{1,40})/i,
    /(?:para|for)\s+(?:un|una|a|an|el|la|the)\s+([A-ZÁÉÍÓÚÑ][\wáéíóúñ\s&'-]{2,40}?)(?:\s+(?:en|in|de|with|con|que|that)|[.,]|$)/i,
    /(?:web|sitio|página|page|site)\s+(?:de|for|para)\s+["']?([^"'.,\n]{3,40})["']?/i,
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) {
      const name = match[1].trim().replace(/\s+(italiano|gourmet|premium|moderno|elegante)$/i, '').trim();
      if (name.length >= 3) return name;
    }
  }

  return lang === 'es' ? rule.defaultNameEs : rule.defaultNameEn;
}

export function analyzeIntent(prompt: string, lang: 'es' | 'en'): ParsedIntent {
  const lower = prompt.toLowerCase();

  for (const rule of INTENT_RULES) {
    if (rule.keywords.test(lower)) {
      return {
        templateSlug: rule.slug,
        businessName: extractBusinessName(prompt, rule, lang),
        businessType: lang === 'es' ? rule.typeEs : rule.typeEn,
        categoryKey: rule.categoryKey,
      };
    }
  }

  const fallback = INTENT_RULES.find((r) => r.slug === 'vesper')!;
  return {
    templateSlug: 'vesper',
    businessName: extractBusinessName(prompt, fallback, lang),
    businessType: lang === 'es' ? fallback.typeEs : fallback.typeEn,
    categoryKey: 'gastronomy',
  };
}
