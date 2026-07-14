export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  answer: string;
}

export const quickTopics = [
  { label: 'Precios', query: '¿Cuánto cuesta CREAUNA?' },
  { label: 'Cómo funciona', query: '¿Cómo creo mi web?' },
  { label: 'Plantillas', query: '¿Qué plantillas tenéis?' },
  { label: 'Guía', query: '¿Dónde está la guía completa?' },
  { label: 'Contacto', query: '¿Cómo os contacto?' },
];

export const quickTopicsEn = [
  { label: 'Pricing', query: 'How much does CREAUNA cost?' },
  { label: 'How it works', query: 'How do I create my website?' },
  { label: 'Templates', query: 'What templates do you have?' },
  { label: 'Guide', query: 'Where is the full guide?' },
  { label: 'Contact', query: 'How can I contact you?' },
];

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: 'guide',
    keywords: ['guía', 'guia', 'tutorial', 'manual', 'paso a paso', 'aprender', 'documentación', 'documentacion', 'ayuda completa'],
    answer: 'Tenemos una guía completa que explica todo el proceso: crear web, plantillas, créditos, refinado, entrega, modernización, pago y contacto. Accede en /guia',
  },
  {
    id: 'greeting',
    keywords: ['hola', 'buenas', 'hey', 'saludos', 'buenos días', 'buenas tardes', 'buenas noches'],
    answer: '¡Hola! Soy el Asistente CREAUNA. Puedo ayudarte con precios, plantillas, el Studio, créditos, modernización de webs y mucho más. ¿Qué necesitas saber?',
  },
  {
    id: 'pricing',
    keywords: ['precio', 'precios', 'plan', 'planes', 'cuanto cuesta', 'cuánto cuesta', 'tarifa', 'coste', 'costo', 'gratis', 'pago', 'suscripción', 'mensual', 'anual'],
    answer: 'Dos caminos en /precios:\n\n**Opción 1 — Studio (tú la haces):**\n• Gratis — 0€, probar sin tarjeta (15 cambios/mes, sin exportación completa)\n• Pro — desde 15€/mes (anual) o 19€/mes, exportas archivos y publicas tú\n• Business — desde 39€/mes, equipos y agencias\n\n**Opción 2 — Te la hacemos (pago único):**\n• Web nueva particular — desde 690€\n• Autónomo — 890€ · PYME — 1.290€\n• Web a Medida — 1.790€ + IVA\n\nDominio y hosting no incluidos (presupuesto aparte si lo pides).',
  },
  {
    id: 'credits',
    keywords: ['crédito', 'créditos', 'credito', 'creditos', 'consumen', 'gastan', 'cuantos cambios', 'cuántos cambios', 'ediciones'],
    answer: '1 crédito = 1 cambio en el Studio. Coste en euros:\n\n• Gratis: 0€ por cambio (15/mes)\n• Pro: ~0,16€ por cambio (19€ ÷ 120 créditos)\n• Business: ~0,16€ por cambio (49€ ÷ 300 créditos)\n\nLos créditos se renuevan cada mes. No cobramos extra por mantener tu web publicada. Detalle en /precios',
  },
  {
    id: 'how-it-works',
    keywords: ['cómo funciona', 'como funciona', 'crear web', 'crear mi web', 'empezar', 'primeros pasos', 'proceso', 'pasos'],
    answer: 'El proceso es sencillo:\n\n1. Abre el Studio (/studio)\n2. Describe tu negocio o elige una plantilla (/templates)\n3. La IA genera tu web en minutos\n4. Refina con cambios (cada uno = 1 crédito)\n5. Cuando estés satisfecho, exporta o solicita entrega\n\nGuía paso a paso en /guia',
  },
  {
    id: 'studio',
    keywords: ['studio', 'editor', 'editar', 'diseñar', 'generar', 'preview', 'vista previa', 'demo'],
    answer: 'El Studio es el motor de CREAUNA. Describes lo que quieres y ves una preview en tiempo real. Cada cambio es instantáneo y consume 1 crédito. Accede gratis en /studio',
  },
  {
    id: 'templates',
    keywords: ['plantilla', 'plantillas', 'template', 'templates', 'catálogo', 'catalogo', 'diseños', 'modelos'],
    answer: 'Tenemos 60 plantillas premium organizadas en 5 categorías: Gastronomía (12), Servicios (12), Lujo & Estilo (12), Corporativo (12) y Tecnología (12). Cada una con imagen acorde al sector. Explóralas en /templates',
  },
  {
    id: 'ai-tech',
    keywords: ['ia', 'inteligencia artificial', 'motores', 'tecnología', 'tecnologia', 'automático', 'automatico'],
    answer: 'CREAUNA orquesta varios motores de IA especializados (visual, redacción, código y experiencia de usuario) trabajando en equipo bajo la supervisión de Ramón del Pozo Rott. Sin conflictos entre ellos: cada uno cumple su misión.',
  },
  {
    id: 'speed',
    keywords: ['rápido', 'rapido', 'tiempo', 'minutos', 'cuanto tarda', 'cuánto tarda', 'velocidad', 'inmediato', 'instantáneo', 'instantaneo'],
    answer: 'La mayoría de webs se generan en menos de 8 minutos. Los cambios en el Studio son instantáneos: describes el ajuste y ves el resultado al momento.',
  },
  {
    id: 'modernization',
    keywords: ['modernizar', 'modernización', 'modernizacion', 'web antigua', 'web vieja', 'rescate', 'before after', 'antes después', 'antigua'],
    answer: 'Modernizar solo compensa si ya tienes web antigua con contenido que migrar. Si puedes empezar de cero, suele salir más barato:\n\n• Web nueva en Studio — desde 15€/mes\n• Web nueva hecha por nosotros — desde 690€ pago único\n\nModernización (migrar web vieja):\n• Particular — 690€ · Autónomo — 890€ · PYME — 1.290€ · Premium — 1.790€\n\nDetalle en /modernizacion y /precios',
  },
  {
    id: 'custom-web',
    keywords: ['medida', 'personalizada', 'personalizado', 'exclusivo', 'agencia', 'proyecto especial'],
    answer: 'Web a Medida: precio cerrado 1.790€ + IVA (máximo web premium). Incluye diseño exclusivo, copywriting, desarrollo, SEO, publicación y 3 meses de soporte. Proceso completo en /web-a-medida. Ramón del Pozo Rott supervisa cada proyecto. Contacto en /contacto',
  },
  {
    id: 'export',
    keywords: ['exportar', 'exportación', 'exportacion', 'código', 'codigo', 'html', 'descargar', 'archivos', 'entrega', 'entregar'],
    answer: 'En planes Pro y Business puedes exportar el código completo (HTML/CSS/JS). Al finalizar, te entregamos la web en el formato que prefieras: enlace privado, paquete de archivos o código exportable. La publicación en tu dominio la haces tú.',
  },
  {
    id: 'domain',
    keywords: ['dominio', 'hosting', 'publicar', 'subir', 'servidor', 'url propia', 'creauna.com'],
    answer: 'CREAUNA crea la web y te entrega los archivos (HTML/CSS/JS). Dominio y hosting no están incluidos: los contratas tú (~10€/año dominio, ~5–15€/mes hosting). Si quieres que lo gestionemos nosotros, pídelo en /contacto — presupuesto aparte.',
  },
  {
    id: 'payment',
    keywords: ['stripe', 'tarjeta', 'pagar', 'cobro', 'factura', 'facturación', 'facturacion', 'método de pago', 'metodo de pago'],
    answer: 'Estamos integrando Stripe como método de pago. De momento los cobros no están activos (estamos preparando la cuenta empresarial). Cuando esté listo, podrás pagar con tarjeta de forma segura desde la página de precios.',
  },
  {
    id: 'competitors',
    keywords: ['emergent', 'lovable', 'competencia', 'comparar', 'comparativa', 'alternativa', 'mejor que'],
    answer: 'En CREAUNA no comparamos con otras plataformas: tú eliges el plan que encaje contigo. Precios claros en /precios — cada cambio en el Studio = 1 crédito, con coste en euros visible. Studio desde 0€ o Web a Medida desde 1.790€.',
  },
  {
    id: 'free-trial',
    keywords: ['prueba', 'trial', 'probar', 'demo', 'test', 'sin tarjeta', 'gratuito'],
    answer: 'Gratis = probar el Studio sin tarjeta: ver muestras, personalizar y hacer hasta 15 cambios al mes. No incluye exportación completa ni entrega final. Para la web terminada: Pro (desde 15€/mes) o pago único desde 690€ si te la hacemos nosotros.',
  },
  {
    id: 'cancel',
    keywords: ['cancelar', 'baja', 'darme de baja', 'permanencia', 'compromiso', 'contrato'],
    answer: 'No hay permanencia. Puedes cancelar tu plan en cualquier momento sin penalización. Los cambios se aplican de forma proporcional en tu factura.',
  },
  {
    id: 'support',
    keywords: ['soporte', 'ayuda', 'atención', 'atencion', 'respuesta', 'horario', '24 horas', '24h'],
    answer: 'El asistente (yo) resuelve consultas al instante. Para soporte humano: formulario en /contacto (respuesta en 24h) o email a info@ramondelpozorott.es. No atendemos WhatsApp 24h: solo para urgencias reales.',
  },
  {
    id: 'contact',
    keywords: ['contacto', 'contactar', 'email', 'correo', 'escribir', 'formulario', 'hablar', 'llamar'],
    answer: 'Puedes contactarnos así:\n\n• Formulario: /contacto (recomendado, respuesta en 24h)\n• Email: info@ramondelpozorott.es\n• WhatsApp +34 656 398 640 — solo urgencias\n\nEl formulario y este asistente cubren el 95% de consultas sin necesidad de llamada.',
  },
  {
    id: 'whatsapp',
    keywords: ['whatsapp', 'wasap', 'guasap', 'teléfono', 'telefono', 'móvil', 'movil', 'llamada', 'urgente', 'urgencia'],
    answer: 'WhatsApp: +34 656 398 640 — exclusivamente para urgencias reales. Para consultas normales usa este chat, el formulario en /contacto o el email info@ramondelpozorott.es',
  },
  {
    id: 'email',
    keywords: ['info@', 'ramondelpozo', 'mail'],
    answer: 'Nuestro email es info@ramondelpozorott.es. Escríbenos con tu consulta y te respondemos en menos de 24 horas laborables. También puedes usar el formulario en /contacto',
  },
  {
    id: 'founder',
    keywords: ['ramón', 'ramon', 'fundador', 'creador', 'quién está detrás', 'quien esta detras', 'supervisor', 'supervisado'],
    answer: 'CREAUNA está supervisado por Ramón del Pozo Rott, con más de 12 años de experiencia en diseño web premium. Un equipo de especialistas e IA trabaja bajo su dirección creativa. Más en /about',
  },
  {
    id: 'language',
    keywords: ['español', 'espanol', 'idioma', 'inglés', 'ingles', 'language'],
    answer: 'CREAUNA está pensada para el mercado español: interfaz, soporte y plantillas en español. También disponemos de versión en inglés desde el selector ES/EN del menú.',
  },
  {
    id: 'business-plan',
    keywords: ['business', 'empresa', 'agencia', 'equipo', 'colaboración', 'colaboracion', 'hosting incluido'],
    answer: 'El plan Business (desde 39€/mes anual, 300 créditos) es para agencias y equipos: proyectos ilimitados, colaboración, soporte VIP con SLA y −20% en web a medida. Dominio y hosting no incluidos — te entregamos archivos. Detalle en /precios',
  },
  {
    id: 'pro-plan',
    keywords: ['plan pro', 'pro plan', ' suscripcion pro', 'suscripción pro'],
    answer: 'Plan Pro: 19€/mes (15€ anual), 120 créditos/mes, webs ilimitadas, 60 plantillas, exportación de código, soporte prioritario y 3 meses de ajustes. El más popular. Empieza en /studio',
  },
  {
    id: 'free-plan',
    keywords: ['plan gratis', 'plan gratuito', 'plan free', 'cuenta gratis', 'version gratis', 'versión gratis'],
    answer: 'Plan Gratis: 0€ para siempre, 15 créditos/mes, hasta 3 webs activas y acceso a plantillas. Perfecto para probar sin tarjeta. Empieza en /studio',
  },
  {
    id: 'seo',
    keywords: ['seo', 'google', 'posicionamiento', 'buscadores', 'visibilidad'],
    answer: 'Todas las webs de CREAUNA incluyen estructura SEO optimizada: meta tags, textos persuasivos generados por IA y rendimiento rápido. En modernización también migramos tu SEO existente.',
  },
  {
    id: 'mobile',
    keywords: ['móvil', 'movil', 'responsive', 'celular', 'tablet', 'adaptable'],
    answer: 'Todas las plantillas y webs generadas son 100% responsive: se adaptan perfectamente a móvil, tablet y escritorio automáticamente.',
  },
  {
    id: 'security',
    keywords: ['seguridad', 'ssl', 'https', 'privacidad', 'datos', 'rgpd', 'gdpr'],
    answer: 'Cumplimos RGPD. Puedes consultar nuestras políticas en /privacidad, /cookies y /datos. Las webs generadas incluyen buenas prácticas de seguridad estándar.',
  },
  {
    id: 'thanks',
    keywords: ['gracias', 'thank', 'perfecto', 'genial', 'vale', 'ok', 'entendido'],
    answer: '¡De nada! Si tienes más preguntas, aquí estaré. Y recuerda: para temas que no pueda resolver, usa /contacto o info@ramondelpozorott.es',
  },
];

export const knowledgeBaseEn: KnowledgeEntry[] = [
  {
    id: 'guide',
    keywords: ['guide', 'tutorial', 'manual', 'step by step', 'learn', 'documentation', 'help'],
    answer: 'We have a full guide covering the entire process: creating sites, templates, credits, refinement, delivery, modernization, payment and contact. Visit /guia',
  },
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    answer: 'Hi! I am the CREAUNA Assistant. I can help with pricing, templates, Studio, credits, modernization and more. What do you need?',
  },
  {
    id: 'pricing',
    keywords: ['price', 'pricing', 'cost', 'how much', 'plan', 'subscription', 'credits', 'free', 'pro', 'business'],
    answer: 'Plans: Free €0 (15 credits/month), Pro €19/month (120 credits), Business €49/month (300 credits). Full comparison at /precios',
  },
  {
    id: 'how',
    keywords: ['how', 'create', 'build', 'website', 'process', 'steps', 'start'],
    answer: 'Simple process:\n\n1. Open Studio (/studio)\n2. Describe your business or pick a template (/templates)\n3. AI generates your site in minutes\n4. Refine with changes (1 credit each)\n5. Export or request delivery when ready\n\nFull guide at /guia',
  },
  {
    id: 'templates',
    keywords: ['template', 'templates', 'catalog', 'designs', 'models'],
    answer: 'We have 60 premium templates in 5 categories: Gastronomy (12), Services (12), Luxury (12), Corporate (12), Technology (12). Browse at /templates',
  },
  {
    id: 'studio',
    keywords: ['studio', 'editor', 'design', 'preview', 'live'],
    answer: 'CREAUNA Studio is where you design with AI. Open /studio, describe changes and see live preview. Each change uses 1 credit.',
  },
  {
    id: 'modernization',
    keywords: ['modernize', 'modernization', 'old website', 'redesign', 'before after'],
    answer: 'Modernization for old sites (5+ years). Plans by profile:\n\n• Individual — from €690\n• Freelancer — €890 (Digital Rescue)\n• Business/SMB — €1,290\n• Already have a site (Premium) — €1,790\n\nInteractive Before/After at /modernizacion. Free preview at /studio',
  },
  {
    id: 'custom',
    keywords: ['custom', 'bespoke', 'tailored', 'agency', 'exclusive'],
    answer: 'Custom Web is for exclusive projects supervised by Ramón del Pozo Rott. From €1,790 (premium web cap). Request at /contacto or /web-a-medida',
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'support', 'help', 'whatsapp'],
    answer: 'Contact us at /contacto or info@ramondelpozorott.es — we reply within 24h. WhatsApp +34 656 398 640 for real urgencies only.',
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'perfect', 'great', 'ok', 'got it'],
    answer: 'You are welcome! For anything I cannot resolve, use /contacto or info@ramondelpozorott.es',
  },
];

export const fallbackAnswer =
  'No tengo una respuesta específica para eso. Como última opción, puedes:\n\n' +
  '1. Rellenar el formulario en /contacto — te respondemos en 24h\n' +
  '2. Escribir a info@ramondelpozorott.es\n\n' +
  'WhatsApp +34 656 398 640 solo para urgencias reales. Este asistente y el formulario resuelven la gran mayoría de consultas sin esperas.';

export const fallbackAnswerEn =
  "I don't have a specific answer for that. As a last resort:\n\n" +
  '1. Fill out the form at /contacto — we reply within 24h\n' +
  '2. Email info@ramondelpozorott.es\n\n' +
  'WhatsApp +34 656 398 640 is for real emergencies only. This assistant and the contact form handle most questions without waiting.';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function findChatAnswer(input: string, lang: 'es' | 'en' = 'es'): { answer: string; matched: boolean } {
  const normalized = normalize(input);
  if (!normalized) {
    return {
      answer: lang === 'en' ? 'Type your question and I will help right away.' : 'Escribe tu pregunta y te ayudo enseguida.',
      matched: false,
    };
  }

  let bestScore = 0;
  let bestAnswer = '';

  for (const entry of (lang === 'en' ? knowledgeBaseEn : knowledgeBase)) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const nk = normalize(keyword);
      if (normalized.includes(nk)) {
        score += nk.split(' ').length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = entry.answer;
    }
  }

  if (bestScore > 0) {
    return { answer: bestAnswer, matched: true };
  }

  return { answer: lang === 'en' ? fallbackAnswerEn : fallbackAnswer, matched: false };
}
