/** Datos fiscales y catálogo por defecto para presupuestos / facturas CREAUNA. */

export const companyDefaults = {
  brand: 'CREAUNA',
  legalName: 'Ramón del Pozo Rott',
  nif: '', // rellena tu NIF/CIF aquí o en la UI
  address: '',
  email: 'info@ramondelpozorott.es',
  phone: '+34 656 398 640',
  web: 'https://creauna.com',
  logoSrc: '/images/logo.png',
  ivaRate: 0.21,
  /** Forma de cobro estándar del estudio */
  paymentTerms:
    '50% al aceptar el presupuesto · 50% a la entrega final. Transferencia o tarjeta. Factura con IVA desglosado.',
  validityDays: 30,
  bank: {
    holder: 'Ramón del Pozo Rott',
    iban: '',
    bic: '',
    conceptHint: 'Indicar nº de presupuesto o factura en el concepto',
  },
};

export type CatalogItem = {
  id: string;
  concept: string;
  description: string;
  unitPrice: number;
  unit: string;
};

/** Catálogo: añade / quita líneas al presupuesto desde la UI. */
export const serviceCatalog: CatalogItem[] = [
  {
    id: 'web-medida',
    concept: 'Web a medida (diseño exclusivo)',
    description: 'Diseño premium, desarrollo responsive, SEO on-page, entrega de archivos o publicación.',
    unitPrice: 1790,
    unit: 'ud',
  },
  {
    id: 'web-autonomo',
    concept: 'Web profesional (autónomo / PYME)',
    description: 'Web completa desde Studio o plantilla premium, personalizada y lista para publicar.',
    unitPrice: 890,
    unit: 'ud',
  },
  {
    id: 'modernizacion',
    concept: 'Modernización de web existente',
    description: 'Rescate / rediseño de web antigua con nueva estructura y diseño.',
    unitPrice: 990,
    unit: 'ud',
  },
  {
    id: 'carrito',
    concept: 'Carrito de compra funcional',
    description: 'Catálogo, carrito, checkout y gestión básica de pedidos en la web.',
    unitPrice: 1200,
    unit: 'ud',
  },
  {
    id: 'stripe',
    concept: 'Pasarela de pago (Stripe)',
    description: 'Integración Stripe (cobros, confirmaciones, entorno de prueba y producción).',
    unitPrice: 650,
    unit: 'ud',
  },
  {
    id: 'saas-mvp',
    concept: 'SaaS / MVP a medida',
    description: 'Login, base de datos, panel y flujo principal. Alcance cerrado en briefing.',
    unitPrice: 4500,
    unit: 'ud',
  },
  {
    id: 'hosting',
    concept: 'Dominio + hosting (gestión 1 año)',
    description: 'Alta/configuración de dominio y hosting, DNS y publicación inicial.',
    unitPrice: 180,
    unit: 'año',
  },
  {
    id: 'mantenimiento',
    concept: 'Mantenimiento mensual',
    description: 'Actualizaciones menores, copias de seguridad y soporte prioritario.',
    unitPrice: 79,
    unit: 'mes',
  },
  {
    id: 'extras-ia',
    concept: 'Integraciones / API keys / IA',
    description: 'Conexión de servicios externos, claves API y costes de uso estimados aparte.',
    unitPrice: 350,
    unit: 'ud',
  },
];
