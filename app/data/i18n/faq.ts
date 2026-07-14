export type FaqItem = { q: string; a: string };

export const faqPageI18n = {
  es: {
    badge: 'AYUDA',
    title: 'Preguntas frecuentes',
    subtitle:
      'Respuestas claras sobre planes, créditos del Studio, publicación y proyectos a medida. Si no encuentras lo que buscas, escríbenos.',
    contactCta: '¿Sigues con dudas?',
    contactBtn: 'Contactar con CREAUNA',
    pricingLink: 'Ver precios y planes',
    items: [
      {
        q: '¿Qué es CREAUNA exactamente?',
        a: 'CREAUNA es una plataforma de IA que coordina agentes especializados en diseño, contenido, código y optimización. Describes tu negocio, el Studio genera tu web y puedes refinarla por chat. No es una agencia tradicional: es una herramienta para crear y publicar webs profesionales tú mismo.',
      },
      {
        q: '¿Puedo empezar sin pagar ni poner tarjeta?',
        a: 'Sí. El plan Gratis te deja probar el Studio: elegir muestra, personalizar y ver la preview con hasta 15 cambios al mes. No incluye exportación completa ni entrega final — es para probar antes de contratar Pro o pedirnos la web hecha.',
      },
      {
        q: '¿Cuánto cuesta cada cambio con IA en el Studio?',
        a: '1 crédito = 1 cambio visible (un mensaje en el chat, pulsar «Mejorar» en una sección, cambiar estilo, etc.). En Gratis el coste efectivo es 0€. En Pro y Business ronda los 0,13€ por cambio con facturación anual (0,16€ en mensual).',
      },
      {
        q: '¿Los créditos se acumulan de un mes a otro?',
        a: 'No. Los créditos se renuevan cada mes con tu plan. Ver publicar plantillas, exportar (en planes de pago) o mantener la web online no consume créditos adicionales.',
      },
      {
        q: '¿Qué incluye el plan Pro frente al Gratis?',
        a: 'Exportación completa de archivos (HTML/CSS/JS), 120 créditos/mes, hasta 3 proyectos, sin marca CREAUNA, blog, formularios, SEO y soporte prioritario. Pagas mientras uses el Studio; cuando tengas la web lista, descargas y publicas en tu hosting.',
      },
      {
        q: '¿Incluís dominio o hosting?',
        a: 'No por defecto. CREAUNA crea la web y te entrega los archivos. Compras el dominio y contratas el hosting donde prefieras. Si quieres que lo gestionemos nosotros, pídelo en /contacto — presupuesto aparte.',
      },
      {
        q: '¿Puedo exportar la web y alojarla donde quiera?',
        a: 'Sí, desde el plan Pro. Exportas HTML, CSS y JS limpio y lo subes a tu hosting. Sin penalización ni permanencia.',
      },
      {
        q: '¿Qué es la Web a Medida de 1.790€?',
        a: 'Un servicio aparte para proyectos exclusivos sin plantilla: briefing, 2 propuestas de diseño, desarrollo, SEO, publicación y 3 meses de soporte. Precio cerrado para web premium. Más detalle en /web-a-medida.',
      },
      {
        q: '¿Ofrecéis modernización de webs antiguas?',
        a: 'Sí. Es un servicio de pago único según el alcance (rescate, rediseño o premium). Puedes ver opciones en /modernizacion o pedir presupuesto en /contacto.',
      },
      {
        q: '¿Dónde se publica la web?',
        a: 'Donde tú decidas. Te entregamos los archivos y una guía para subirlos a tu hosting y conectar tu dominio. Si prefieres que lo hagamos nosotros, es un servicio adicional con presupuesto cerrado.',
      },
      {
        q: '¿Mis datos y proyectos están seguros?',
        a: 'Tus proyectos del Studio se guardan en tu cuenta. No usamos el contenido de tus webs para entrenar modelos públicos. Para detalle legal consulta /privacidad y /datos.',
      },
      {
        q: '¿Cómo contacto si tengo un problema o un proyecto especial?',
        a: 'Usa el formulario en /contacto. Para urgencias hay WhatsApp indicado en esa página. Respondemos personalmente en menos de 24 horas laborables.',
      },
    ] as FaqItem[],
  },
  en: {
    badge: 'HELP',
    title: 'Frequently asked questions',
    subtitle:
      'Clear answers about plans, Studio credits, publishing and custom projects. If you cannot find what you need, get in touch.',
    contactCta: 'Still have questions?',
    contactBtn: 'Contact CREAUNA',
    pricingLink: 'View pricing and plans',
    items: [
      {
        q: 'What is CREAUNA exactly?',
        a: 'CREAUNA is an AI platform that coordinates specialized agents for design, content, code and optimization. You describe your business, the Studio builds your site and you refine it by chat. It is not a traditional agency — it is a tool to create and publish professional websites yourself.',
      },
      {
        q: 'Can I start without paying or adding a card?',
        a: 'Yes. Free lets you try Studio: pick a sample, customize and preview with up to 15 changes per month. No full export or final delivery — it is to test before Pro or a done-for-you project.',
      },
      {
        q: 'How much does each AI change in Studio cost?',
        a: '1 credit = 1 visible change (one chat message, clicking Improve on a section, changing style, etc.). On Free the effective cost is €0. On Pro and Business it is roughly €0.13 per change on annual billing (€0.16 on monthly).',
      },
      {
        q: 'Do credits roll over month to month?',
        a: 'No. Credits renew each month with your plan. Browsing templates, exporting (on paid plans) or keeping your site live does not use extra credits.',
      },
      {
        q: 'What does Pro include compared to Free?',
        a: 'Full file export (HTML/CSS/JS), 120 credits/month, up to 3 projects, no CREAUNA branding, blog, forms, SEO and priority support. Pay while you use Studio; when ready, download and publish on your hosting.',
      },
      {
        q: 'Do you include domain or hosting?',
        a: 'Not by default. CREAUNA builds the site and delivers files. You buy the domain and hosting wherever you prefer. Want us to manage it? Ask at /contacto — separate quote.',
      },
      {
        q: 'Can I export the site and host it elsewhere?',
        a: 'Yes, from the Pro plan. Export clean HTML, CSS and JS and upload to your hosting. No penalty or lock-in.',
      },
      {
        q: 'What is the €1,790 Custom Web service?',
        a: 'A separate service for exclusive non-template projects: briefing, 2 design proposals, development, SEO, launch and 3 months of support. Fixed price for premium web. More at /web-a-medida.',
      },
      {
        q: 'Do you modernize old websites?',
        a: 'Yes. One-time pricing depending on scope (rescue, redesign or premium). See /modernizacion or request a quote at /contacto.',
      },
      {
        q: 'Where is the site published?',
        a: 'Wherever you choose. We deliver files and a guide to upload to your hosting and connect your domain. If you prefer us to handle it, that is an additional service with a fixed quote.',
      },
      {
        q: 'Are my data and projects secure?',
        a: 'Your Studio projects are stored in your account. We do not use your site content to train public models. See /privacidad and /datos for legal detail.',
      },
      {
        q: 'How do I contact you for issues or special projects?',
        a: 'Use the form at /contacto. WhatsApp is listed there for urgencies. We reply personally within 24 business hours.',
      },
    ] as FaqItem[],
  },
} as const;
