import { User, Briefcase, Building2, RefreshCw, type LucideIcon } from 'lucide-react';

/** Precio máximo web premium / web a medida (pago único). */
export const PREMIUM_WEB_PRICE_ES = '1.790€';
export const PREMIUM_WEB_PRICE_EN = '€1,790';

export type ModernizationPlanId = 'particular' | 'autonomo' | 'empresa' | 'modernizar';

export type ModernizationPlan = {
  id: ModernizationPlanId;
  icon: LucideIcon;
  nameEs: string;
  nameEn: string;
  taglineEs: string;
  taglineEn: string;
  priceEs: string;
  priceEn: string;
  descEs: string;
  descEn: string;
  featuresEs: string[];
  featuresEn: string[];
  ctaEs: string;
  ctaEn: string;
  href: string;
  color: string;
  popular?: boolean;
  premium?: boolean;
};

export const modernizationPlans: ModernizationPlan[] = [
  {
    id: 'particular',
    icon: User,
    nameEs: 'Particular',
    nameEn: 'Individual',
    taglineEs: 'Web nueva sencilla — pago único',
    taglineEn: 'Simple new site — one-time payment',
    priceEs: '690€',
    priceEn: '€690',
    descEs: 'Te creamos la web y te entregamos los archivos. Tú eliges dominio y hosting (o nos lo pides aparte).',
    descEn: 'We build your site and deliver the files. You choose domain and hosting (or ask us separately).',
    featuresEs: ['Diseño profesional', 'Archivos listos para publicar', 'Versión móvil', 'Entrega en 72h'],
    featuresEn: ['Professional design', 'Files ready to publish', 'Mobile version', '72h delivery'],
    ctaEs: 'Solicitar presupuesto',
    ctaEn: 'Request quote',
    href: '/contacto?plan=particular',
    color: 'border-slate-200',
  },
  {
    id: 'autonomo',
    icon: Briefcase,
    nameEs: 'Autónomo',
    nameEn: 'Freelancer',
    taglineEs: 'Profesional liberal o freelancer',
    taglineEn: 'Self-employed professional',
    priceEs: '890€',
    priceEn: '€890',
    descEs: 'Web profesional para tu negocio: formularios, WhatsApp, SEO. Archivos entregados — dominio y hosting por tu cuenta.',
    descEn: 'Professional business site: forms, WhatsApp, SEO. Files delivered — domain and hosting on you.',
    featuresEs: ['Todo lo anterior', 'Archivo Legacy', 'Migración de contenidos', '3 meses de ajustes'],
    featuresEn: ['All above', 'Legacy Archive', 'Content migration', '3 months adjustments'],
    ctaEs: 'Empezar rescate',
    ctaEn: 'Start rescue',
    href: '/contacto?plan=autonomo',
    color: 'border-indigo-300 ring-2 ring-indigo-500/30',
    popular: true,
  },
  {
    id: 'empresa',
    icon: Building2,
    nameEs: 'Empresa / PYME',
    nameEn: 'Business / SMB',
    taglineEs: 'Negocio local o equipo pequeño',
    taglineEn: 'Local business or small team',
    priceEs: '1.290€',
    priceEn: '€1,290',
    descEs: 'Web completa para PYME: varias secciones, blog o reservas. Entrega en archivos; tú publicas o lo gestionamos aparte.',
    descEn: 'Full SMB site: multiple sections, blog or booking. Files delivered; you publish or we manage separately.',
    featuresEs: ['Todo Rescate Digital', 'Guía de publicación', 'Informe SEO completo', 'Soporte prioritario'],
    featuresEn: ['All Digital Rescue', 'Publishing guide', 'Full SEO report', 'Priority support'],
    ctaEs: 'Hablar con ventas',
    ctaEn: 'Talk to sales',
    href: '/contacto?plan=empresa',
    color: 'border-slate-200',
  },
  {
    id: 'modernizar',
    icon: RefreshCw,
    nameEs: 'Ya tengo web',
    nameEn: 'Already have a site',
    taglineEs: 'Modernizar sin empezar de cero',
    taglineEn: 'Modernize without starting over',
    priceEs: PREMIUM_WEB_PRICE_ES,
    priceEn: PREMIUM_WEB_PRICE_EN,
    descEs: 'Modernizar web antigua con migración de contenidos y diseño premium. Archivos entregados; publicación opcional aparte.',
    descEn: 'Modernize legacy site with content migration and premium design. Files delivered; optional publishing quote.',
    featuresEs: ['Todo Rescate Completo', 'Migración de contenidos', 'Formación gestión', 'SLA garantizado'],
    featuresEn: ['All Complete Rescue', 'Content migration', 'Management training', 'Guaranteed SLA'],
    ctaEs: 'Modernizar mi web',
    ctaEn: 'Modernize my site',
    href: '/contacto?plan=modernizar',
    color: 'border-amber-300 ring-2 ring-amber-500/30',
    premium: true,
  },
];

export const modernizationPricingCopy = {
  es: {
    badge: 'MODERNIZACIÓN',
    title: 'Te la hacemos nosotros — pago único',
    subtitle: 'Web nueva o modernización de una antigua. Precio cerrado, archivos entregados. Dominio y hosting no incluidos (presupuesto aparte si lo necesitas).',
    demoLink: 'Ver comparativa Antes/Después interactiva →',
    popular: 'MÁS ELEGIDO',
    premium: 'PREMIUM',
  },
  en: {
    badge: 'MODERNIZATION',
    title: 'We build it for you — one-time payment',
    subtitle: 'New site or modernization of an old one. Fixed price, files delivered. Domain and hosting not included (separate quote if needed).',
    demoLink: 'See interactive Before/After comparison →',
    popular: 'MOST POPULAR',
    premium: 'PREMIUM',
  },
} as const;
