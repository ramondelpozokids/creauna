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
    answer: 'Tenemos 3 planes:\n\n• Gratis — 0€, 15 créditos/mes\n• Pro — 19€/mes (15€ anual), 120 créditos/mes\n• Business — 49€/mes (39€ anual), 300 créditos/mes\n\nMás económico que Lovable ($25) y Emergent ($20), sin coste extra por mantener tu web publicada. Detalle completo en /precios',
  },
  {
    id: 'credits',
    keywords: ['crédito', 'créditos', 'credito', 'creditos', 'consumen', 'gastan', 'cuantos cambios', 'cuántos cambios', 'ediciones'],
    answer: 'Cada cambio que haces en el Studio consume 1 crédito. Los créditos se renuevan cada mes según tu plan (15 / 120 / 300). A diferencia de otras plataformas, no gastamos créditos extra solo por tener tu web publicada.',
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
    answer: 'Tenemos 60+ plantillas premium organizadas en 5 categorías: Gastronomía, Servicios, Lujo & Estilo, Corporativo y Tecnología. Cada una con imagen acorde al sector (restaurante, taller de motos, tatuajes, etc.). Explóralas en /templates',
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
    answer: 'El servicio de Modernización transforma webs de 5+ años en diseños actuales. Envías tu URL, la reconstruimos con IA y te entregamos la nueva web. Planes desde 890€. Más info en /modernizacion',
  },
  {
    id: 'custom-web',
    keywords: ['medida', 'personalizada', 'personalizado', 'exclusivo', 'agencia', 'proyecto especial'],
    answer: 'Para webs completamente a medida o proyectos de agencia, visita /web-a-medida. Ramón del Pozo Rott supervisa cada proyecto y te contacta en menos de 24h con una propuesta personalizada.',
  },
  {
    id: 'export',
    keywords: ['exportar', 'exportación', 'exportacion', 'código', 'codigo', 'html', 'descargar', 'archivos', 'entrega', 'entregar'],
    answer: 'En planes Pro y Business puedes exportar el código completo (HTML/CSS/JS). Al finalizar, te entregamos la web en el formato que prefieras: enlace privado, paquete de archivos o código exportable. La publicación en tu dominio la haces tú.',
  },
  {
    id: 'domain',
    keywords: ['dominio', 'hosting', 'publicar', 'subir', 'servidor', 'url propia', 'creauna.com'],
    answer: 'CREAUNA genera y entrega tu web, pero la subida a tu dominio la haces tú (o contratas el plan Business que incluye hosting 1 año). Te damos todos los archivos listos para publicar.',
  },
  {
    id: 'payment',
    keywords: ['stripe', 'tarjeta', 'pagar', 'cobro', 'factura', 'facturación', 'facturacion', 'método de pago', 'metodo de pago'],
    answer: 'Estamos integrando Stripe como método de pago. De momento los cobros no están activos (estamos preparando la cuenta empresarial). Cuando esté listo, podrás pagar con tarjeta de forma segura desde la página de precios.',
  },
  {
    id: 'competitors',
    keywords: ['emergent', 'lovable', 'competencia', 'comparar', 'comparativa', 'alternativa', 'mejor que'],
    answer: 'Frente a Emergent ($20/mes, 100 créditos, ~50 extra por web publicada) y Lovable ($25/mes), CREAUNA ofrece Pro a 19€ con 120 créditos, 60+ plantillas premium, interfaz en español y sin penalización por despliegue. Comparativa en /precios',
  },
  {
    id: 'free-trial',
    keywords: ['prueba', 'trial', 'probar', 'demo', 'test', 'sin tarjeta', 'gratuito'],
    answer: 'Puedes empezar gratis con 15 créditos/mes sin tarjeta. El plan Pro incluye 14 días de prueba. Abre el Studio en /studio y crea tu primera web ahora mismo.',
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
    answer: 'El plan Business (49€/mes, 300 créditos) incluye hosting + dominio 1 año, colaboración en equipo ilimitada, soporte VIP con SLA y descuento en webs a medida. Ideal para agencias. Detalle en /precios',
  },
  {
    id: 'pro-plan',
    keywords: ['plan pro', 'pro plan', ' suscripcion pro', 'suscripción pro'],
    answer: 'Plan Pro: 19€/mes (15€ anual), 120 créditos/mes, webs ilimitadas, 60+ plantillas, exportación de código, soporte prioritario y 3 meses de ajustes. El más popular. Empieza en /studio',
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

export const fallbackAnswer =
  'No tengo una respuesta específica para eso. Como última opción, puedes:\n\n' +
  '1. Rellenar el formulario en /contacto — te respondemos en 24h\n' +
  '2. Escribir a info@ramondelpozorott.es\n\n' +
  'WhatsApp +34 656 398 640 solo para urgencias reales. Este asistente y el formulario resuelven la gran mayoría de consultas sin esperas.';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function findChatAnswer(input: string): { answer: string; matched: boolean } {
  const normalized = normalize(input);
  if (!normalized) {
    return { answer: 'Escribe tu pregunta y te ayudo enseguida.', matched: false };
  }

  let bestScore = 0;
  let bestAnswer = '';

  for (const entry of knowledgeBase) {
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

  return { answer: fallbackAnswer, matched: false };
}
