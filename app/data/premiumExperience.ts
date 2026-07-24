import { Sparkles, type LucideIcon } from 'lucide-react';

/** Precio ancla público — Premium Experiencia (webs con 3D / mucho impacto visual). */
export const PREMIUM_EXPERIENCE_PRICE_ES = 'desde 4.900€';
export const PREMIUM_EXPERIENCE_PRICE_EN = 'from €4,900';
export const PREMIUM_EXPERIENCE_PRICE_NOTE_ES = 'Pago único · IVA no incluido · Precio cerrado según lo que pidas';
export const PREMIUM_EXPERIENCE_PRICE_NOTE_EN = 'One-time · VAT not included · Fixed price based on what you need';

export type PremiumExperiencePlan = {
  id: 'experiencia';
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
  demosHref: string;
};

export const premiumExperiencePlan: PremiumExperiencePlan = {
  id: 'experiencia',
  icon: Sparkles,
  nameEs: 'Premium Experiencia',
  nameEn: 'Premium Experience',
  taglineEs: 'Animaciones, 3D e interacción avanzada',
  taglineEn: 'Animation, 3D and advanced interaction',
  priceEs: PREMIUM_EXPERIENCE_PRICE_ES,
  priceEn: PREMIUM_EXPERIENCE_PRICE_EN,
  descEs:
    'Webs con mucho impacto visual, tipo Velocity X, AEON NEXUS o PHANTOM. No es una web de negocio local: es un proyecto especial con 3D e interacción. Te damos precio cerrado cuando sepamos qué necesitas.',
  descEn:
    'High-impact sites like Velocity X, AEON NEXUS or PHANTOM. Not a local business website — a special project with 3D and interaction. We give you a fixed price once we know what you need.',
  featuresEs: [
    'Diseño con animaciones y efecto “película”',
    '3D o interacción avanzada',
    'Configurador u otras herramientas (si las pides)',
    'Precio cerrado · demos en /templates',
  ],
  featuresEn: [
    'Animated, cinematic design',
    '3D or advanced interaction',
    'Configurator or other tools (if you need them)',
    'Fixed price · demos at /templates',
  ],
  ctaEs: 'Pedir presupuesto Premium',
  ctaEn: 'Request Premium quote',
  href: '/contacto?tipo=experiencia-premium',
  demosHref: '/templates?cat=premium',
};
