import type { LucideIcon } from 'lucide-react';
import {
  Sparkles, LayoutGrid, Coins, Edit3, Download,
  RefreshCw, Paintbrush, CreditCard, MessageCircle,
} from 'lucide-react';

export type GuiaSection = {
  id: string;
  icon: LucideIcon;
  color: string;
  title: string;
  paragraphs: string[];
  steps?: string[];
  list?: string[];
  categories?: string[];
  plans?: { plan: string; price: string; credits: string }[];
  helpCards?: { title: string; text: string }[];
  note?: string;
  example?: string;
  link?: { href: string; label: string };
  cta?: { href: string; label: string };
};

export const guiaI18n = {
  es: {
    badge: 'GUÍA COMPLETA',
    title: 'Todo lo que necesitas saber para crear o mejorar tu web',
    subtitle: 'Esta guía te acompaña paso a paso: desde tu primera web en el Studio hasta la publicación en tu propio dominio. En cada momento sabrás qué hacer y qué esperar.',
    indexTitle: 'Índice de contenidos',
    ctaTitle: '¿Listo para empezar?',
    ctaText: 'Ahora ya sabes todo el proceso. Abre el Studio y crea tu web en minutos.',
    ctaButton: 'Crear mi web ahora',
    sections: [
      {
        id: 'empezar', icon: Sparkles, color: 'text-indigo-600 bg-indigo-50',
        title: '1. Crear tu web desde cero',
        paragraphs: ['La forma más rápida de tener una web profesional es usar el Studio de CREAUNA.'],
        steps: [
          'Entra en /studio (no necesitas tarjeta para empezar).',
          'Describe tu negocio con tus propias palabras: sector, ciudad, estilo, colores, secciones que necesitas.',
          'La IA genera tu web en menos de 8 minutos con diseño de estudio.',
          'Verás una preview en tiempo real de cómo queda.',
        ],
        example: 'Ejemplo: "Quiero una web elegante para mi barbería en Valencia. Estilo masculino, colores oscuros, sección de servicios con precios y botón de reserva por WhatsApp."',
        cta: { href: '/studio', label: 'Abrir el Studio' },
      },
      {
        id: 'plantillas', icon: LayoutGrid, color: 'text-violet-600 bg-violet-50',
        title: '2. Usar una plantilla',
        paragraphs: [
          'Si prefieres empezar con una base visual, tenemos 36 plantillas premium en 5 categorías:',
          'Cada plantilla tiene una imagen acorde al sector. Elige una, ábrela en el Studio y personalízala con tus textos, colores y fotos.',
        ],
        categories: [
          'Gastronomía (6 plantillas)',
          'Servicios (12 plantillas)',
          'Lujo & Estilo (6 plantillas)',
          'Corporativo (6 plantillas)',
          'Tecnología (6 plantillas)',
        ],
        link: { href: '/templates', label: 'Ver catálogo de plantillas' },
      },
      {
        id: 'creditos', icon: Coins, color: 'text-amber-600 bg-amber-50',
        title: '3. Créditos y precios',
        paragraphs: [
          'Cada cambio que pides en el Studio consume 1 crédito. Los créditos se renuevan cada mes.',
          'A diferencia de otras plataformas como Emergent, no gastamos créditos extra solo por tener tu web publicada. Cuanto más refinada quieras tu diseño, más créditos usarás — tú controlas el proceso.',
        ],
        plans: [
          { plan: 'Gratis', price: '0€', credits: '15 créditos/mes' },
          { plan: 'Pro', price: '19€/mes', credits: '120 créditos/mes' },
          { plan: 'Business', price: '49€/mes', credits: '300 créditos/mes' },
        ],
        link: { href: '/precios', label: 'Ver precios y comparativa' },
      },
      {
        id: 'refinar', icon: Edit3, color: 'text-emerald-600 bg-emerald-50',
        title: '4. Refinar tu diseño',
        paragraphs: ['En el Studio puedes pedir cambios de forma conversacional. Cada cambio es instantáneo y ves el resultado al momento:', 'Sigue refinando hasta que quedes satisfecho. Recuerda: cada cambio = 1 crédito.'],
        list: [
          '"Hazla más elegante y con más espacio en blanco"',
          '"Cambia los colores a tonos tierra"',
          '"Añade una sección de testimonios"',
          '"Haz el botón de contacto más visible"',
          '"Optimiza la versión móvil"',
        ],
      },
      {
        id: 'entrega', icon: Download, color: 'text-rose-600 bg-rose-50',
        title: '5. Recibir y publicar tu web',
        note: 'Importante: CREAUNA diseña y te entrega tu web. La publicación en tu dominio la haces tú (o tu técnico de confianza).',
        paragraphs: [
          'Cuando tu diseño esté finalizado y hayas completado el pago, te entregamos la web de una de estas formas:',
          'Para publicar: sube los archivos a tu hosting, conecta tu dominio (.com, .es…) y listo. Si contratas el plan Business, incluimos hosting durante 1 año con guía paso a paso.',
        ],
        steps: [
          'Enlace privado de preview para revisión final.',
          'Paquete de archivos completo (HTML, CSS, JS, imágenes).',
          'Exportación de código limpio (planes Pro y Business).',
          'Recibes la web en el mismo formato en que nos enviaste la antigua (si es modernización).',
        ],
      },
      {
        id: 'modernizar', icon: RefreshCw, color: 'text-orange-600 bg-orange-50',
        title: '6. Modernizar una web antigua',
        paragraphs: ['¿Tu web tiene 5, 8 o más años? El servicio de Modernización la transforma por completo:', 'Incluye comparativa Antes/Después, archivo de tu web antigua y 3 meses de ajustes menores. Planes desde 890€.'],
        steps: [
          'Nos envías la URL o capturas de tu web actual.',
          'Analizamos todo y te enviamos un informe en 24h.',
          'Reconstruimos la web desde cero con IA + supervisión creativa humana.',
          'Te entregamos la nueva web en menos de 72h para que la revises.',
          'Tú la publicas en tu dominio con los archivos que te entregamos.',
        ],
        link: { href: '/modernizacion', label: 'Ver servicio de modernización' },
      },
      {
        id: 'medida', icon: Paintbrush, color: 'text-cyan-600 bg-cyan-50',
        title: '7. Web completamente a medida',
        paragraphs: [
          'Para proyectos exclusivos, agencias o necesidades especiales que van más allá del Studio, ofrecemos Web a Medida supervisada personalmente por Ramón del Pozo Rott.',
          'Rellena el formulario de contacto, cuéntanos tu proyecto y recibirás una propuesta personalizada en menos de 24 horas.',
        ],
        link: { href: '/web-a-medida', label: 'Solicitar web a medida' },
      },
      {
        id: 'pago', icon: CreditCard, color: 'text-slate-600 bg-slate-100',
        title: '8. Pago y suscripción',
        paragraphs: [
          'Estamos integrando Stripe como pasarela de pago segura. De momento los cobros no están activos mientras preparamos la cuenta empresarial.',
          'Cuando esté disponible:',
        ],
        list: [
          'Pago con tarjeta desde la página de precios.',
          'Sin permanencia: cancela cuando quieras.',
          'La entrega de la web final solo se realiza tras completar el pago.',
        ],
      },
      {
        id: 'ayuda', icon: MessageCircle, color: 'text-indigo-600 bg-indigo-50',
        title: '9. Ayuda y contacto',
        paragraphs: ['¿Tienes dudas? Estamos aquí para ayudarte:'],
        helpCards: [
          { title: 'Asistente CREAUNA', text: 'Chat en la esquina inferior derecha. Responde al instante, 24/7.' },
          { title: 'Formulario de contacto', text: '/contacto — Respuesta personal en menos de 24h.' },
          { title: 'Email', text: 'info@ramondelpozorott.es' },
          { title: 'WhatsApp (solo urgencias)', text: '+34 656 398 640' },
        ],
      },
    ] as GuiaSection[],
  },
  en: {
    badge: 'FULL GUIDE',
    title: 'Everything you need to create or improve your website',
    subtitle: 'This guide walks you step by step: from your first site in Studio to publishing on your own domain. You will always know what to do and what to expect.',
    indexTitle: 'Table of contents',
    ctaTitle: 'Ready to get started?',
    ctaText: 'You now know the full process. Open Studio and create your site in minutes.',
    ctaButton: 'Create my site now',
    sections: [
      {
        id: 'empezar', icon: Sparkles, color: 'text-indigo-600 bg-indigo-50',
        title: '1. Create your site from scratch',
        paragraphs: ['The fastest way to get a professional website is CREAUNA Studio.'],
        steps: [
          'Go to /studio (no card required to start).',
          'Describe your business in your own words: industry, city, style, colors, sections you need.',
          'AI generates your site in under 8 minutes with studio-grade design.',
          'You will see a live preview of the result.',
        ],
        example: 'Example: "I want an elegant site for my barbershop in Valencia. Masculine style, dark colors, services with prices and WhatsApp booking button."',
        cta: { href: '/studio', label: 'Open Studio' },
      },
      {
        id: 'plantillas', icon: LayoutGrid, color: 'text-violet-600 bg-violet-50',
        title: '2. Use a template',
        paragraphs: [
          'If you prefer a visual starting point, we offer 36 premium templates in 5 categories:',
          'Each template has an image matching its sector. Pick one, open it in Studio and customize text, colors and photos.',
        ],
        categories: [
          'Gastronomy (6 templates)',
          'Services (12 templates)',
          'Luxury & Style (6 templates)',
          'Corporate (6 templates)',
          'Technology (6 templates)',
        ],
        link: { href: '/templates', label: 'Browse template catalog' },
      },
      {
        id: 'creditos', icon: Coins, color: 'text-amber-600 bg-amber-50',
        title: '3. Credits and pricing',
        paragraphs: [
          'Each change you request in Studio uses 1 credit. Credits renew every month.',
          'Unlike platforms like Emergent, we do not charge extra credits just for keeping your site live. The more refined you want your design, the more credits you use — you control the process.',
        ],
        plans: [
          { plan: 'Free', price: '€0', credits: '15 credits/month' },
          { plan: 'Pro', price: '€19/month', credits: '120 credits/month' },
          { plan: 'Business', price: '€49/month', credits: '300 credits/month' },
        ],
        link: { href: '/precios', label: 'View pricing and comparison' },
      },
      {
        id: 'refinar', icon: Edit3, color: 'text-emerald-600 bg-emerald-50',
        title: '4. Refine your design',
        paragraphs: ['In Studio you can request changes conversationally. Each change is instant and you see the result immediately:', 'Keep refining until you are satisfied. Remember: each change = 1 credit.'],
        list: [
          '"Make it more elegant with more white space"',
          '"Change colors to earth tones"',
          '"Add a testimonials section"',
          '"Make the contact button more visible"',
          '"Optimize the mobile version"',
        ],
      },
      {
        id: 'entrega', icon: Download, color: 'text-rose-600 bg-rose-50',
        title: '5. Receive and publish your site',
        note: 'Important: CREAUNA designs and delivers your site. You publish it on your domain (or your trusted technician).',
        paragraphs: [
          'When your design is finalized and payment is complete, we deliver your site in one of these ways:',
          'To publish: upload files to your hosting, connect your domain (.com, .es…) and you are done. Business plan includes 1 year of hosting with step-by-step guidance.',
        ],
        steps: [
          'Private preview link for final review.',
          'Full file package (HTML, CSS, JS, images).',
          'Clean code export (Pro and Business plans).',
          'You receive the site in the same format you sent the old one (for modernization).',
        ],
      },
      {
        id: 'modernizar', icon: RefreshCw, color: 'text-orange-600 bg-orange-50',
        title: '6. Modernize an old website',
        paragraphs: ['Is your site 5, 8 or more years old? Our Modernization service transforms it completely:', 'Includes Before/After comparison, archive of your old site and 3 months of minor adjustments. Plans from €890.'],
        steps: [
          'Send us your current site URL or screenshots.',
          'We analyze everything and send a report within 24h.',
          'We rebuild the site from scratch with AI + human creative supervision.',
          'We deliver the new site within 72h for your review.',
          'You publish it on your domain with the files we provide.',
        ],
        link: { href: '/modernizacion', label: 'View modernization service' },
      },
      {
        id: 'medida', icon: Paintbrush, color: 'text-cyan-600 bg-cyan-50',
        title: '7. Fully custom website',
        paragraphs: [
          'For exclusive projects, agencies or special needs beyond Studio, we offer Custom Web personally supervised by Ramón del Pozo Rott.',
          'Fill out the contact form, tell us about your project and receive a personalized proposal within 24 hours.',
        ],
        link: { href: '/web-a-medida', label: 'Request custom web' },
      },
      {
        id: 'pago', icon: CreditCard, color: 'text-slate-600 bg-slate-100',
        title: '8. Payment and subscription',
        paragraphs: [
          'We are integrating Stripe as a secure payment gateway. Charges are not active yet while we prepare the business account.',
          'When available:',
        ],
        list: [
          'Card payment from the pricing page.',
          'No lock-in: cancel anytime.',
          'Final site delivery only after payment is complete.',
        ],
      },
      {
        id: 'ayuda', icon: MessageCircle, color: 'text-indigo-600 bg-indigo-50',
        title: '9. Help and contact',
        paragraphs: ['Have questions? We are here to help:'],
        helpCards: [
          { title: 'CREAUNA Assistant', text: 'Chat in the bottom-right corner. Instant replies, 24/7.' },
          { title: 'Contact form', text: '/contacto — Personal reply within 24h.' },
          { title: 'Email', text: 'info@ramondelpozorott.es' },
          { title: 'WhatsApp (urgencies only)', text: '+34 656 398 640' },
        ],
      },
    ] as GuiaSection[],
  },
} as const;
