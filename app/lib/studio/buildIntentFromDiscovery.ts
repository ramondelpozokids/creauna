import { buildIntentFromTemplateSlug } from '../ai/intentAnalyzer';
import type { ParsedIntent } from '../ai/intentAnalyzer';
import { getSectorById } from '../../data/sectorLibrary';
import type { StudioDiscoveryAnswers } from './discoveryTypes';

export function buildIntentFromDiscovery(
  discovery: StudioDiscoveryAnswers,
  lang: 'es' | 'en'
): ParsedIntent {
  const base = buildIntentFromTemplateSlug(discovery.templateSlug, lang);
  const sector = getSectorById(discovery.sectorId);

  return {
    ...base,
    businessName: discovery.businessName.trim() || base.businessName,
    businessType: sector
      ? lang === 'es'
        ? sector.labelEs
        : sector.labelEn
      : base.businessType,
    features: { ...discovery.features },
  };
}

const STYLE_LABELS: Record<string, { es: string; en: string }> = {
  elegante: { es: 'elegante y refinado', en: 'elegant and refined' },
  minimal: { es: 'minimalista y limpio', en: 'minimal and clean' },
  moderno: { es: 'moderno e impactante', en: 'modern and bold' },
};

const PALETTE_LABELS: Record<string, { es: string; en: string }> = {
  indigo: { es: 'índigo profesional', en: 'professional indigo' },
  slate: { es: 'gris pizarra corporativo', en: 'corporate slate' },
  amber: { es: 'tierra y ámbar cálido', en: 'warm earth and amber' },
  emerald: { es: 'verde esmeralda', en: 'emerald green' },
  rose: { es: 'rosa sofisticado', en: 'sophisticated rose' },
  dark: { es: 'oscuro premium', en: 'premium dark' },
};

const HERO_LABELS: Record<string, { es: string; en: string }> = {
  full: { es: 'hero a pantalla completa con imagen', en: 'full-screen hero with image' },
  split: { es: 'hero dividido texto + imagen', en: 'split hero text + image' },
  minimal: { es: 'hero minimalista', en: 'minimal hero' },
  cinematic: { es: 'hero cinematográfico con overlay', en: 'cinematic hero with overlay' },
};

/** Prompt enriquecido para agentes IA a partir de respuestas estructuradas. */
export function synthesizeDiscoveryPrompt(discovery: StudioDiscoveryAnswers, lang: 'es' | 'en'): string {
  const f = discovery.features;
  const sectionParts: string[] = [];
  if (f.menu) sectionParts.push(lang === 'es' ? 'carta/menú' : 'menu');
  if (f.services) sectionParts.push(lang === 'es' ? 'servicios' : 'services');
  if (f.about) sectionParts.push(lang === 'es' ? 'sobre nosotros' : 'about');
  if (f.gallery) sectionParts.push(lang === 'es' ? 'galería' : 'gallery');
  if (f.reviews) sectionParts.push(lang === 'es' ? 'reseñas y testimonios' : 'reviews and testimonials');
  if (f.blog) sectionParts.push(lang === 'es' ? 'blog/noticias' : 'blog/news');
  if (f.contact) sectionParts.push(lang === 'es' ? 'contacto con formulario' : 'contact form');
  if (f.location) sectionParts.push(lang === 'es' ? 'ubicación y mapa' : 'location and map');
  if (f.reservation) sectionParts.push(lang === 'es' ? 'reservas/citas' : 'reservations');
  if (f.legalFooter) sectionParts.push(lang === 'es' ? 'footer legal' : 'legal footer');
  if (f.whatsapp) sectionParts.push('WhatsApp');
  if (f.sidebar) sectionParts.push('sidebar');

  const navLabels = discovery.navPages.join(', ');
  const style = STYLE_LABELS[discovery.style]?.[lang] ?? discovery.style;
  const palette = PALETTE_LABELS[discovery.palette]?.[lang] ?? discovery.palette;
  const hero = HERO_LABELS[discovery.heroStyle]?.[lang] ?? discovery.heroStyle;

  if (lang === 'es') {
    return [
      `Crea la web profesional de «${discovery.businessName}».`,
      discovery.tagline ? `Eslogan: ${discovery.tagline}.` : '',
      `Sector/plantilla base: ${discovery.templateSlug}.`,
      `Estilo visual: ${style}. Paleta: ${palette}. ${hero}.`,
      `Menú de navegación con: ${navLabels}.`,
      `Secciones activas: ${sectionParts.join(', ')}.`,
      discovery.phone || discovery.whatsapp
        ? `WhatsApp/teléfono: ${discovery.whatsapp || discovery.phone}.`
        : '',
      discovery.email ? `Email: ${discovery.email}.` : '',
      discovery.address ? `Dirección: ${discovery.address}.` : '',
      discovery.instagram ? `Instagram: ${discovery.instagram}.` : '',
      discovery.facebook ? `Facebook: ${discovery.facebook}.` : '',
      discovery.tiktok ? `TikTok: ${discovery.tiktok}.` : '',
      discovery.legalName || discovery.cif
        ? `Titular legal: ${discovery.legalName || discovery.businessName}${discovery.cif ? `, CIF ${discovery.cif}` : ''}.`
        : '',
      discovery.extraNotes ? `Notas del cliente: ${discovery.extraNotes}` : '',
      'Calidad de agencia premium (€1.500–3.000). Imágenes profesionales. Diseño responsive. Hero full-bleed min-h-[85vh].',
    ]
      .filter(Boolean)
      .join(' ');
  }

  return [
    `Create the professional website for «${discovery.businessName}».`,
    discovery.tagline ? `Tagline: ${discovery.tagline}.` : '',
    `Sector/base template: ${discovery.templateSlug}.`,
    `Visual style: ${style}. Palette: ${palette}. ${hero}.`,
    `Navigation menu: ${navLabels}.`,
    `Active sections: ${sectionParts.join(', ')}.`,
    discovery.phone || discovery.whatsapp
      ? `WhatsApp/phone: ${discovery.whatsapp || discovery.phone}.`
      : '',
    discovery.email ? `Email: ${discovery.email}.` : '',
    discovery.address ? `Address: ${discovery.address}.` : '',
    discovery.instagram ? `Instagram: ${discovery.instagram}.` : '',
    discovery.facebook ? `Facebook: ${discovery.facebook}.` : '',
    discovery.tiktok ? `TikTok: ${discovery.tiktok}.` : '',
    discovery.legalName || discovery.cif
      ? `Legal entity: ${discovery.legalName || discovery.businessName}${discovery.cif ? `, tax ID ${discovery.cif}` : ''}.`
      : '',
    discovery.extraNotes ? `Client notes: ${discovery.extraNotes}` : '',
    'Agency-grade quality. Professional images. Responsive design. Full-bleed hero min-h-[85vh].',
  ]
    .filter(Boolean)
    .join(' ');
}
