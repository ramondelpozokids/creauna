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
    taglineEs: 'Portfolio, blog o web personal',
    taglineEn: 'Portfolio, blog or personal site',
    priceEs: '690€',
    priceEn: '€690',
    descEs: 'Ideal si tienes 1 web sencilla que quieres renovar sin complicaciones.',
    descEn: 'Ideal for a simple site you want renewed without hassle.',
    featuresEs: ['Rediseño moderno', 'Versión móvil', 'Antes/Después', 'Entrega en 72h'],
    featuresEn: ['Modern redesign', 'Mobile version', 'Before/After', '72h delivery'],
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
    descEs: 'Rescate Digital: tu marca profesional con formularios, WhatsApp y SEO.',
    descEn: 'Digital Rescue: professional brand with forms, WhatsApp and SEO.',
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
    descEs: 'Rescate Completo: varias secciones, blog, tienda básica o reservas.',
    descEn: 'Complete Rescue: multiple sections, blog, basic shop or booking.',
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
    descEs: 'Rescate Premium: diseño de nivel internacional, hosting 1 año y prioridad máxima.',
    descEn: 'Premium Rescue: international-grade design, 1 year hosting and top priority.',
    featuresEs: ['Todo Rescate Completo', 'Hosting + dominio 1 año', 'Formación gestión', 'SLA garantizado'],
    featuresEn: ['All Complete Rescue', 'Hosting + domain 1 year', 'Management training', 'Guaranteed SLA'],
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
    title: 'Modernización de webs antiguas',
    subtitle: 'Individual, autónomo, empresa o web antigua: pagas solo lo que necesitas. Máximo 1.790€ por web premium.',
    demoLink: 'Ver comparativa Antes/Después interactiva →',
    popular: 'MÁS ELEGIDO',
    premium: 'PREMIUM',
  },
  en: {
    badge: 'MODERNIZATION',
    title: 'Old website modernization',
    subtitle: 'Individual, freelancer, business or legacy site: pay only for what you need. Up to €1,790 for premium web.',
    demoLink: 'See interactive Before/After comparison →',
    popular: 'MOST POPULAR',
    premium: 'PREMIUM',
  },
} as const;
