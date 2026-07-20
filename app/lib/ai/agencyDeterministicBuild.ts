/**
 * Construcción determinista densamente premium desde plan + pack + brief.
 * Último recurso cuando la IA no entrega HTML — NUNCA dejar al cliente sin web.
 * Se arma desde AgencySitePlan + URLs del pack + datos del brief (sector-aware).
 */
import type { AgencySitePlan } from './agencyPipeline';
import type { BriefImagePack } from './promptFirstQuality';
import { extractClientContact } from './siteChrome';
import { promptWantsWhatsApp } from './agencyChromePolicy';
import { isBikeShopPrompt, isBakeryShopPrompt, isBarbershopPrompt } from './businessProfiles';
import { IMAGE_BANK } from './imageBank';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function imgAt(pack: BriefImagePack, i: number): string {
  const urls = pack.urls.length ? pack.urls : [];
  if (!urls.length) {
    if (isBakeryShopPrompt(pack.variant) || pack.variant === 'bakery') {
      return IMAGE_BANK.bakery.gallery[i % IMAGE_BANK.bakery.gallery.length];
    }
    if (pack.variant === 'corporate' || isBikeShopPrompt(pack.variant)) {
      if (isBikeShopPrompt(pack.variant)) {
        return 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1200&q=80';
      }
      const corp = [
        IMAGE_BANK.corporate.hero,
        IMAGE_BANK.corporate.team,
        ...IMAGE_BANK.corporate.office,
        ...IMAGE_BANK.corporate.gallery,
      ];
      return corp[i % corp.length];
    }
    // Fallback genérico: oficina, NUNCA moda
    return IMAGE_BANK.corporate.hero;
  }
  return urls[i % urls.length];
}

function isCorporatePrompt(prompt: string, pack: BriefImagePack): boolean {
  return (
    pack.variant === 'corporate' ||
    /gestor[ií]a|asesor[ií]a|fiscal|contabil|despacho|laboral.*jur[ií]dic/i.test(prompt)
  );
}

interface CatalogProduct {
  name: string;
  desc: string;
  price: string;
  cat: string;
}

function parseProductsFromBrief(prompt: string, lang: 'es' | 'en'): CatalogProduct[] {
  const out: CatalogProduct[] = [];
  const bike = isBikeShopPrompt(prompt);
  const bakery = isBakeryShopPrompt(prompt);
  // «Nombre» + precio con € delante o detrás (1.499 € / €245)
  const priceLine =
    /([A-ZÁÉÍÓÚÑa-z0-9][^\n€$]{2,48})\s*\n?\s*(?:€\s*(\d+[.,]?\d*)|(\d+[.,]\d{2,3})\s*€)/gi;
  let m: RegExpExecArray | null;
  while ((m = priceLine.exec(prompt)) && out.length < 18) {
    const name = m[1].replace(/^[#*\-\d.]+\s*/, '').trim();
    const priceNum = m[2] || m[3];
    if (name.length < 3 || /example|ejemplo|each product|incluye|aproximada/i.test(name)) continue;
    if (/^#|paleta|tipograf|montserrat|inter\b|poppins/i.test(name)) continue;
    out.push({
      name,
      desc: bakery
        ? lang === 'es'
          ? 'Elaboración artesanal del día. Solicita información o encargo por WhatsApp.'
          : 'Fresh artisan bake. Enquire or order via WhatsApp.'
        : bike
          ? lang === 'es'
            ? 'Modelo de catálogo. Solicita información en tienda o WhatsApp.'
            : 'Catalogue model. Enquire in store or WhatsApp.'
          : lang === 'es'
            ? 'Pieza de catálogo premium.'
            : 'Premium catalogue piece.',
      price: `${priceNum} €`,
      cat: bakery
        ? /tarta|pastel|cake|queso|manzana|zanahoria/i.test(name)
          ? 'pasteles'
          : /croissant|napolitan|palmera|caracol|boll|ensaimad|magdalena|hojaldre/i.test(name)
            ? 'bolleria'
            : 'panes'
        : bike
          ? /casco|maillot|guante|mochila|luz|candado|pedal|portabid/i.test(name)
            ? 'accessories'
            : /e-?bike|el[eé]ctric/i.test(name)
              ? 'ebike'
              : /infantil|niñ/i.test(name)
                ? 'kids'
                : /road|carretera|carbon/i.test(name)
                  ? 'road'
                  : 'mtb'
          : /wig|peluca/i.test(name)
            ? 'wigs'
            : /dress|blazer|blouse|trouser|vestido|blusa/i.test(name)
              ? 'clothing'
              : 'accessories',
    });
  }
  if (out.length >= 6) {
    const n = out.length - (out.length % 3);
    return out.slice(0, n || out.length);
  }

  if (bakery) {
    return [
      { name: 'Pan de Masa Madre', desc: 'Corteza crujiente, miga alveolada.', price: '3,50 €', cat: 'panes' },
      { name: 'Baguette Rústica', desc: 'Larga fermentación, harina de fuerza.', price: '1,80 €', cat: 'panes' },
      { name: 'Pan de Centeno', desc: 'Sabor intenso y denso.', price: '4,20 €', cat: 'panes' },
      { name: 'Croissant Artesanal', desc: 'Mantequilla de primera, hojaldre perfecto.', price: '1,50 €', cat: 'bolleria' },
      { name: 'Napolitana de Chocolate', desc: 'Relleno generoso de cacao.', price: '1,80 €', cat: 'bolleria' },
      { name: 'Palmera de Hojaldre', desc: 'Caramelizada y crujiente.', price: '1,60 €', cat: 'bolleria' },
      { name: 'Tarta de Queso Casera', desc: 'Cremosa, al horno.', price: '18,00 €', cat: 'pasteles' },
      { name: 'Tarta de Manzana', desc: 'Receta tradicional.', price: '16,00 €', cat: 'pasteles' },
      { name: 'Pastel de Zanahoria', desc: 'Especiado y esponjoso.', price: '15,00 €', cat: 'pasteles' },
    ];
  }

  if (bike) {
    const bikeDefaults: CatalogProduct[] = [
      { name: 'Mountain Pro X1', desc: 'MTB aluminio, listo para senderos.', price: '1.499 €', cat: 'mtb' },
      { name: 'Carbon Road Elite', desc: 'Carretera carbono, rendimiento.', price: '2.899 €', cat: 'road' },
      { name: 'E-Bike Urban Plus', desc: 'Asistencia eléctrica urbana.', price: '2.350 €', cat: 'ebike' },
      { name: 'Bicicleta Infantil 20"', desc: 'Segura y ligera para niños.', price: '399 €', cat: 'kids' },
      { name: 'Casco Aero', desc: 'Protección certificada.', price: '89 €', cat: 'accessories' },
      { name: 'Maillot Premium', desc: 'Transpirable, corte pro.', price: '69 €', cat: 'accessories' },
      { name: 'Guantes', desc: 'Agarre y confort.', price: '25 €', cat: 'accessories' },
      { name: 'Mochila de hidratación', desc: 'Rutas largas.', price: '59 €', cat: 'accessories' },
      { name: 'Luces LED', desc: 'Visibilidad día/noche.', price: '35 €', cat: 'accessories' },
      { name: 'Candado de seguridad', desc: 'Antirrobo reforzado.', price: '45 €', cat: 'accessories' },
      { name: 'Portabidón', desc: 'Ligero y firme.', price: '15 €', cat: 'accessories' },
      { name: 'Pedales automáticos', desc: 'Transferencia eficiente.', price: '99 €', cat: 'accessories' },
    ];
    return bikeDefaults;
  }

  const defaultsEs: CatalogProduct[] = [
    { name: 'Luxury Blonde Wig', desc: 'Peluca natural look, fibra premium.', price: '245 €', cat: 'wigs' },
    { name: 'Natural Brown Wig', desc: 'Acabado realista, fácil peinado.', price: '185 €', cat: 'wigs' },
    { name: 'Long Black Wig', desc: 'Largo sofisticado para ocasión.', price: '210 €', cat: 'wigs' },
    { name: 'Curly Wig', desc: 'Rizos definidos, volumen controlado.', price: '195 €', cat: 'wigs' },
    { name: 'Short Bob Wig', desc: 'Bob corto elegante y moderno.', price: '170 €', cat: 'wigs' },
    { name: 'Elegant Dress', desc: 'Vestido limpio de silueta premium.', price: '69 €', cat: 'clothing' },
    { name: 'Luxury Blazer', desc: 'Blazer estructurado rose-gold vibe.', price: '95 €', cat: 'clothing' },
    { name: 'Premium Blouse', desc: 'Blusa ligera de corte impecable.', price: '49 €', cat: 'clothing' },
    { name: 'Modern Trousers', desc: 'Pantalón fluido de línea limpia.', price: '59 €', cat: 'clothing' },
    { name: 'Handbag', desc: 'Bolso compacto de acabado lujo.', price: '55 €', cat: 'accessories' },
    { name: 'Necklace', desc: 'Collar delicado rose gold.', price: '29 €', cat: 'accessories' },
    { name: 'Scarf', desc: 'Pañuelo seda-touch beige suave.', price: '24 €', cat: 'accessories' },
  ];
  return lang === 'es' ? defaultsEs : defaultsEs.map((p) => ({ ...p, desc: 'Premium boutique piece.' }));
}

function parseReviewsFromBrief(prompt: string): { name: string; text: string }[] {
  const out: { name: string; text: string }[] = [];
  const re =
    /([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚáéíóúñÑ.\s-]{1,40})\s*\n\s*["«]([^"»]{20,280})["»]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(prompt)) && out.length < 8) {
    const name = m[1].trim();
    if (/^(Opiniones|Contacto|Horario|Servicios|Hero|Sobre|Tarik es|Llevo|Gran)/i.test(name)) continue;
    if (name.length < 2 || name.length > 40) continue;
    out.push({ name, text: m[2].trim() });
  }
  return out;
}

function parseReviews(lang: 'es' | 'en', bike: boolean, bakery = false, prompt = ''): { name: string; text: string }[] {
  const fromBrief = parseReviewsFromBrief(prompt);
  if (fromBrief.length >= 2) return fromBrief;
  if (bakery) {
    return lang === 'es'
      ? [
          { name: 'María G.', text: 'El mejor pan de masa madre que he probado en años.' },
          { name: 'Carlos R.', text: 'Sus tartas son una delicia. Frescura inigualable.' },
          { name: 'Ana P.', text: 'La bollería es espectacular, sobre todo los croissants.' },
          { name: 'Laura S.', text: 'Encargamos el pan del fin de semana y siempre llega perfecto.' },
          { name: 'Jorge M.', text: 'Sabor de verdad, harinas de calidad.' },
          { name: 'Elena V.', text: 'Ambiente cálido y producto impecable.' },
        ]
      : [
          { name: 'Maria G.', text: 'Best sourdough I have tasted in years.' },
          { name: 'Carlos R.', text: 'Their cakes are a delight.' },
          { name: 'Ana P.', text: 'Pastries are spectacular, especially croissants.' },
          { name: 'Laura S.', text: 'Weekend bread orders always perfect.' },
          { name: 'Jorge M.', text: 'Real flavour, quality flours.' },
          { name: 'Elena V.', text: 'Warm atmosphere and flawless product.' },
        ];
  }
  if (bike) {
    return lang === 'es'
      ? [
          { name: 'Carlos M.', text: 'Excelente atención desde el primer momento.' },
          { name: 'Laura P.', text: 'El mejor taller de bicicletas de la zona.' },
          { name: 'Jorge R.', text: 'Grandes profesionales.' },
          { name: 'Ana S.', text: 'Volvería sin dudarlo.' },
          { name: 'Elena V.', text: 'La bicicleta llegó perfectamente ajustada.' },
          { name: 'Miguel T.', text: 'Asesoramiento real de ciclistas.' },
          { name: 'Sofía M.', text: 'Catálogo claro y sin presión de compra online.' },
          { name: 'David L.', text: 'WhatsApp rápido y muy profesional.' },
          { name: 'Irene L.', text: 'Financiación y garantía bien explicadas.' },
          { name: 'Pablo N.', text: 'Pasión por el ciclismo se nota.' },
        ]
      : [
          { name: 'Carlos M.', text: 'Excellent service from the first moment.' },
          { name: 'Laura P.', text: 'Best bike workshop in the area.' },
          { name: 'Jorge R.', text: 'True professionals.' },
          { name: 'Ana S.', text: 'Would return without hesitation.' },
          { name: 'Elena V.', text: 'Bike arrived perfectly tuned.' },
          { name: 'Miguel T.', text: 'Real cyclist advice.' },
          { name: 'Sofia M.', text: 'Clear catalogue, no online-cart pressure.' },
          { name: 'David L.', text: 'Fast professional WhatsApp.' },
          { name: 'Irene L.', text: 'Financing and warranty clearly explained.' },
          { name: 'Pablo N.', text: 'You feel the passion for cycling.' },
        ];
  }
  return lang === 'es'
    ? [
        { name: 'María G.', text: 'La calidad superó mis expectativas.' },
        { name: 'Laura P.', text: 'El servicio fue excepcional.' },
        { name: 'Carmen R.', text: 'Encontré la peluca perfecta.' },
        { name: 'Ana S.', text: 'Ropa preciosa y asesoramiento excelente.' },
        { name: 'Elena V.', text: 'Volveré sin duda.' },
        { name: 'Sofía M.', text: 'Atención personalizada de verdad.' },
        { name: 'Irene L.', text: 'Todo se siente boutique de lujo.' },
        { name: 'Paula N.', text: 'WhatsApp rápido y muy profesional.' },
        { name: 'Lucía T.', text: 'Los accesorios son preciosos.' },
        { name: 'Nuria B.', text: 'Ambiente elegante y de confianza.' },
      ]
    : [
        { name: 'Maria G.', text: 'The quality exceeded my expectations.' },
        { name: 'Laura P.', text: 'The service was exceptional.' },
        { name: 'Carmen R.', text: 'I found the perfect wig.' },
        { name: 'Ana S.', text: 'Beautiful clothing and excellent advice.' },
        { name: 'Elena V.', text: 'I will definitely come back.' },
        { name: 'Sofia M.', text: 'Truly personalized attention.' },
        { name: 'Irene L.', text: 'Feels like a luxury boutique.' },
        { name: 'Paula N.', text: 'Fast and professional WhatsApp.' },
        { name: 'Lucia T.', text: 'The accessories are gorgeous.' },
        { name: 'Nuria B.', text: 'Elegant and trustworthy.' },
      ];
}

/**
 * HTML completo cobrable (catálogo + leads WhatsApp). Sin carrito / Stripe.
 */
export function buildDeterministicAgencyHtml(
  plan: AgencySitePlan,
  pack: BriefImagePack,
  prompt: string,
  lang: 'es' | 'en'
): string {
  const bike = isBikeShopPrompt(prompt) || pack.variant === 'bike';
  const bakery = isBakeryShopPrompt(prompt) || pack.variant === 'bakery';
  const corporate = isCorporatePrompt(prompt, pack);
  const barber = isBarbershopPrompt(prompt);
  const brand = esc(
    plan.businessName ||
      (bakery
        ? 'El Trigo Dorado'
        : bike
          ? 'Bike Studio'
          : barber
            ? 'Barbería'
            : corporate
              ? 'Asesoría'
              : 'Maison')
  );
  const title = esc(
    plan.heroTitle ||
      (bakery
        ? lang === 'es'
          ? 'El aroma del pan recién horneado.'
          : 'The aroma of freshly baked bread.'
        : bike
          ? lang === 'es'
            ? 'Tu próxima aventura comienza sobre dos ruedas.'
            : 'Your next adventure starts on two wheels.'
          : barber
            ? lang === 'es'
              ? 'Más que un corte de pelo, una experiencia de barbería.'
              : 'More than a haircut — a barbershop experience.'
            : corporate
              ? lang === 'es'
                ? 'Tu socio estratégico en asesoría'
                : 'Your strategic advisory partner'
              : lang === 'es'
                ? 'Elegancia que se nota'
                : 'Elegance you can feel')
  );
  const sub = esc(
    plan.heroSubtitle ||
      (bakery
        ? lang === 'es'
          ? 'Pan de masa madre, bollería y pasteles artesanales. Precios claros. Sin carrito online.'
          : 'Sourdough, pastries and artisan cakes. Clear prices. No online cart.'
        : bike
          ? lang === 'es'
            ? 'Catálogo profesional de bicicletas y accesorios. Precios claros. Sin carrito online.'
            : 'Professional bike catalogue. Clear prices. No online cart.'
          : barber
            ? lang === 'es'
              ? 'Cortes de caballero, barba y estilismo en Puente de Vallecas. Reserva tu cita.'
              : 'Men’s cuts, beard and styling. Book your appointment.'
            : corporate
              ? lang === 'es'
                ? 'Asesoría fiscal, contable, laboral y jurídica para autónomos, pymes y particulares.'
                : 'Tax, accounting, labour and legal advisory for freelancers, SMEs and individuals.'
              : lang === 'es'
                ? 'Pelucas, moda y accesorios de boutique. Catálogo con precios. Contacto fácil.'
                : 'Wigs, fashion and accessories. Catalogue with prices. Easy contact.')
  );
  const contact = extractClientContact(prompt);
  const phone = contact.whatsapp || contact.phone;
  const wantsWa = promptWantsWhatsApp(prompt);
  const waHref = wantsWa && phone ? `https://wa.me/${phone}` : '#contacto';
  const waLabel =
    wantsWa && phone
      ? 'WhatsApp'
      : lang === 'es'
        ? 'Contactar'
        : 'Contact';
  const email = contact.email || 'hola@' + brand.toLowerCase().replace(/[^a-z0-9]/g, '') + '.es';
  const address = contact.address || (lang === 'es' ? 'España' : 'Spain');
  const accent =
    plan.colors.accent ||
    (bakery ? '#8B5E3C' : bike ? '#00d084' : barber ? '#C6A75E' : corporate ? '#2ecc71' : '#C68E6B');
  const products = parseProductsFromBrief(prompt, lang);
  const reviews = parseReviews(lang, bike, bakery, prompt);
  const hero = bakery
    ? IMAGE_BANK.bakery.hero
    : corporate
      ? IMAGE_BANK.corporate.hero
      : barber
        ? IMAGE_BANK.barber.hero
        : pack.variant === 'beauty'
          ? IMAGE_BANK.beauty.hero
          : imgAt(pack, 0);
  const col1 = bakery ? IMAGE_BANK.bakery.bread[0] : imgAt(pack, 1);
  const col2 = bakery ? IMAGE_BANK.bakery.pastry[0] : imgAt(pack, 2);
  const col3 = bakery ? IMAGE_BANK.bakery.cakes[0] : imgAt(pack, 3);

  const why = bakery
    ? lang === 'es'
      ? [
          ['Masa madre propia', 'Fermentación lenta y sabor auténtico.'],
          ['Horneado diario', 'Pan y bollería frescos cada mañana.'],
          ['Ingredientes de calidad', 'Harinas seleccionadas y mantequilla real.'],
          ['Encargos a medida', 'Eventos, negocios y celebraciones.'],
        ]
      : [
          ['Own sourdough', 'Slow fermentation, authentic flavour.'],
          ['Daily bake', 'Fresh bread and pastries every morning.'],
          ['Quality ingredients', 'Selected flours and real butter.'],
          ['Custom orders', 'Events, wholesale and celebrations.'],
        ]
    : bike
    ? lang === 'es'
      ? [
          ['Asesoramiento personalizado', 'Te ayudamos a elegir la bici ideal.'],
          ['Primeras marcas', 'Specialized, Trek, Orbea, Scott, Giant…'],
          ['Taller especializado', 'Mecánica y puesta a punto pro.'],
          ['Garantía oficial', 'Postventa y confianza.'],
        ]
      : [
          ['Personal advice', 'We help you choose the right bike.'],
          ['Top brands', 'Specialized, Trek, Orbea, Scott, Giant…'],
          ['Pro workshop', 'Service and tuning.'],
          ['Official warranty', 'After-sales you can trust.'],
        ]
    : corporate
      ? lang === 'es'
        ? [
            ['Confianza y ética', 'Transparencia y cumplimiento en cada trámite.'],
            ['Experiencia sectorial', 'Fiscal, laboral, contable y jurídica.'],
            ['Respuesta clara', 'Plazos y lenguaje comprensible.'],
            ['Cercanía', 'Autónomos, pymes y particulares.'],
          ]
        : [
            ['Trust & ethics', 'Transparency and compliance on every filing.'],
            ['Sector experience', 'Tax, labour, accounting and legal.'],
            ['Clear answers', 'Deadlines explained in plain language.'],
            ['Close support', 'Freelancers, SMEs and individuals.'],
          ]
    : barber
      ? lang === 'es'
        ? [
            ['Atención personalizada', 'Cada cliente, un corte a medida.'],
            ['Más de una década', 'Experiencia y fidelidad en el barrio.'],
            ['Modernos y clásicos', 'El estilo que buscas, con precisión.'],
            ['Calidad-precio', 'Excelente relación sin renunciar a calidad.'],
            ['Ambiente cercano', 'Trato amable, como en casa.'],
            ['Ubicación céntrica', 'En el corazón de Puente de Vallecas.'],
          ]
        : [
            ['Personal care', 'Every client gets a tailored cut.'],
            ['A decade+', 'Experience and loyalty in the neighborhood.'],
            ['Modern & classic', 'The style you want, with precision.'],
            ['Value', 'Great quality without overpaying.'],
            ['Welcoming space', 'Friendly service, feel at home.'],
            ['Central location', 'In the heart of the neighborhood.'],
          ]
    : lang === 'es'
      ? [
          ['Calidad premium', 'Materiales y acabados de boutique.'],
          ['Asesoramiento', 'Consejo personalizado por WhatsApp.'],
          ['Look natural', 'Pelucas realistas y tendencias.'],
          ['Servicio pro', 'Reserva e información sin carrito online.'],
        ]
      : [
          ['Premium quality', 'Boutique-grade materials and finish.'],
          ['Advice', 'Personalized guidance via WhatsApp.'],
          ['Natural look', 'Realistic wigs and fashion trends.'],
          ['Pro service', 'Reserve and enquire — no online cart.'],
        ];

  const services =
    plan.specialties.length >= 3
      ? plan.specialties
      : bakery
    ? lang === 'es'
      ? [
          'Encargos personalizados',
          'Catering para eventos',
          'Pan por encargo para negocios',
          'Tartas de celebración',
          'Bollería para reuniones',
          'Asesoramiento de producto',
        ]
      : [
          'Custom orders',
          'Event catering',
          'Wholesale bread',
          'Celebration cakes',
          'Pastries for meetings',
          'Product advice',
        ]
    : bike
      ? lang === 'es'
        ? [
            'Reparación de bicicletas',
            'Mantenimiento',
            'Puesta a punto',
            'Cambio de neumáticos',
            'Ajuste de suspensión',
            'Transmisión',
            'Lavado profesional',
            'Montaje de bicicletas',
            'Venta de accesorios',
            'Asesoramiento personalizado',
          ]
        : [
            'Bike repair',
            'Maintenance',
            'Tune-up',
            'Tyre change',
            'Suspension setup',
            'Drivetrain',
            'Pro wash',
            'Bike build',
            'Accessories',
            'Personal advice',
          ]
      : corporate
        ? lang === 'es'
          ? [
              'Asesoría fiscal',
              'Asesoría contable',
              'Asesoría laboral',
              'Asesoría jurídica',
              'Creación de empresas',
              'Protección de datos',
            ]
          : [
              'Tax advisory',
              'Accounting',
              'Labour advisory',
              'Legal advisory',
              'Company formation',
              'Data protection',
            ]
        : lang === 'es'
          ? [
              'Asesoramiento personalizado',
              'Prueba de pelucas',
              'Estilismo de moda',
              'Personal shopper',
              'Recomendaciones',
              'Tarjetas regalo',
              'Postventa',
              'Reservas de producto',
            ]
          : [
              'Personalized advice',
              'Wig fitting',
              'Fashion styling',
              'Personal shopper',
              'Recommendations',
              'Gift cards',
              'After-sales',
              'Product reservations',
            ];

  const productCards = products
    .map((p, i) => {
      const src = bakery
        ? p.cat === 'pasteles'
          ? IMAGE_BANK.bakery.cakes[i % IMAGE_BANK.bakery.cakes.length]
          : p.cat === 'bolleria'
            ? IMAGE_BANK.bakery.pastry[i % IMAGE_BANK.bakery.pastry.length]
            : IMAGE_BANK.bakery.bread[i % IMAGE_BANK.bakery.bread.length]
        : imgAt(pack, i + 4);
      const msg = encodeURIComponent(
        lang === 'es'
          ? `Hola, me interesa «${p.name}» (${p.price}). Me das informacion?`
          : `Hi, I am interested in «${p.name}» (${p.price}). Can you help?`
      );
      const href = wantsWa && phone ? `https://wa.me/${phone}?text=${msg}` : '#contacto';
      const askLabel = wantsWa
        ? waLabel
        : lang === 'es'
          ? 'Consultar'
          : 'Enquire';
      return `<article class="group rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-xl transition duration-500">
  <div class="aspect-[3/4] overflow-hidden bg-[#F5EFE8]">
    <img src="${src}" alt="${esc(p.name)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" referrerpolicy="no-referrer" />
  </div>
  <div class="p-5">
    <p class="text-[10px] uppercase tracking-[0.2em] text-[#C68E6B] mb-1">${esc(p.cat)}</p>
    <h3 class="font-[Playfair_Display] text-xl text-[#111]">${esc(p.name)}</h3>
    <p class="text-sm text-neutral-600 mt-2">${esc(p.desc)}</p>
    <p class="mt-3 text-lg font-medium">${esc(p.price)}</p>
    <div class="mt-4 flex flex-wrap gap-2">
      <a href="${href}" class="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#111] text-white text-xs tracking-wide hover:bg-[#C68E6B] transition">${askLabel}</a>
      <a href="#contacto" class="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#111]/20 text-xs hover:border-[#C68E6B] hover:text-[#C68E6B] transition">${lang === 'es' ? 'Pedir información' : 'Request info'}</a>
      <a href="${href}" class="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#111]/20 text-xs hover:border-[#C68E6B] transition">${lang === 'es' ? 'Reservar' : 'Reserve'}</a>
    </div>
  </div>
</article>`;
    })
    .join('\n');

  const galleryImgs = Array.from({ length: bakery || barber ? 6 : 12 }, (_, i) =>
    bakery
      ? IMAGE_BANK.bakery.gallery[i % IMAGE_BANK.bakery.gallery.length]
      : barber
        ? IMAGE_BANK.barber.gallery[i % IMAGE_BANK.barber.gallery.length]
        : imgAt(pack, i)
  )
    .map(
      (src, i) =>
        `<a href="${src}" class="block aspect-square overflow-hidden rounded-xl group" data-lightbox>
  <img src="${src}" alt="${lang === 'es' ? 'Galería' : 'Gallery'} ${i + 1}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" referrerpolicy="no-referrer" />
</a>`
    )
    .join('\n');

  const t = (es: string, en: string) => (lang === 'es' ? es : en);

  const metaDesc = bakery
    ? t(
        'Panadería artesanal: masa madre, bollería y pasteles. Contacto. Sin carrito online.',
        'Artisan bakery: sourdough, pastries and cakes. Contact. No online cart.'
      )
    : bike
      ? t(
          'Tienda de bicicletas premium: MTB, carretera, e-bike y accesorios. Contacto. Sin carrito online.',
          'Premium bike shop: MTB, road, e-bike and accessories. Contact. No online cart.'
        )
      : t(
          'Boutique de lujo: pelucas, moda femenina y accesorios. Catalogo con precios. Contacto.',
          'Luxury boutique: wigs, womens fashion and accessories. Catalogue with prices. Contact.'
        );
  const aboutBody = bakery
    ? t(
        plan.businessName +
          ' elabora pan de masa madre, bollería y pasteles con harinas de calidad y horneado diario. Catálogo con precios claros. Sin compra online: visita o contacta.',
        plan.businessName +
          ' bakes sourdough, pastries and cakes with quality flours and a daily bake. Clear-price catalogue. No online checkout — visit or get in touch.'
      )
    : bike
      ? t(
          plan.businessName +
            ' es una tienda especializada en bicicletas y accesorios. Pasión por el ciclismo, taller profesional y catálogo con precios claros. Sin compra online: visita la tienda o contacta.',
          plan.businessName +
            ' is a specialist bike shop. Passion for cycling, pro workshop and clear-price catalogue. No online checkout — visit or get in touch.'
        )
      : t(
          plan.businessName +
            ' es una boutique de pelucas, moda femenina y accesorios. Nuestra filosofia: elegancia minimalista, asesoramiento humano y catalogo con precios claros. Sin compra online: te acompanamos hasta reservar tu pieza.',
          plan.businessName +
            ' is a boutique for wigs, womens fashion and accessories. Philosophy: minimalist elegance, human advice and a clear-price catalogue. No online checkout — we guide you until you reserve.'
        );
  const titleSuffix = bakery
    ? t('Panadería artesanal', 'Artisan bakery')
    : bike
      ? t('Tienda de bicicletas', 'Bicycle shop')
      : t('Boutique de pelucas, moda y accesorios', 'Wigs, fashion and accessories boutique');

  const badgeHtml = plan.badge
    ? `<p class="text-[${accent}] text-xs uppercase tracking-[0.3em] mb-4">${esc(plan.badge)}</p>`
    : `<p class="text-[${accent}] text-xs uppercase tracking-[0.3em] mb-4">${bakery ? t('Horneado diario', 'Daily bake') : bike ? t('Especialistas en ciclismo', 'Cycling specialists') : t('Boutique de lujo', 'Luxury boutique')}</p>`;

  const whyCards = why
    .map(
      ([h, d]) =>
        `<div class="rounded-2xl bg-white border border-black/5 p-6 shadow-sm reveal">
      <h3 class="font-display text-xl mb-2">${esc(h)}</h3>
      <p class="text-sm text-neutral-600">${esc(d)}</p>
    </div>`
    )
    .join('\n');

  const collectionCards = (
    bakery
      ? [
          [t('Panes', 'Breads'), col1, t('Masa madre y hogazas.', 'Sourdough and loaves.')],
          [t('Bollería', 'Pastries'), col2, t('Croissants y hojaldres.', 'Croissants and puff pastry.')],
          [t('Pasteles', 'Cakes'), col3, t('Tartas y celebraciones.', 'Tarts and celebrations.')],
        ]
      : bike
        ? [
            [t('MTB', 'MTB'), col1, t('Montaña y senderos.', 'Mountain trails.')],
            [t('Carretera', 'Road'), col2, t('Rendimiento y ligereza.', 'Performance and light weight.')],
            [t('E-Bike', 'E-Bike'), col3, t('Asistencia eléctrica moderna.', 'Modern electric assist.')],
          ]
        : [
            [t('Pelucas', 'Wigs'), col1, t('Look natural y fibra premium.', 'Natural look, premium fibre.')],
            [t('Moda', 'Clothing'), col2, t('Piezas limpias y sofisticadas.', 'Clean, sophisticated pieces.')],
            [t('Accesorios', 'Accessories'), col3, t('Detalles rose gold y beige.', 'Rose gold and soft beige details.')],
          ]
  )
    .map(
      ([name, src, desc]) =>
        `<a href="#productos" class="group relative min-h-[420px] rounded-3xl overflow-hidden reveal block">
      <img src="${src}" alt="${esc(String(name))}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" referrerpolicy="no-referrer" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
      <div class="absolute bottom-0 p-6 text-white">
        <h3 class="font-display text-2xl">${esc(String(name))}</h3>
        <p class="text-sm text-white/80 mt-1">${esc(String(desc))}</p>
        <span class="inline-block mt-4 text-xs uppercase tracking-widest border-b border-white/50 pb-1">${t('Ver coleccion', 'View collection')}</span>
      </div>
    </a>`
    )
    .join('\n');

  const serviceCards = services
    .map(
      (s) =>
        `<div class="rounded-2xl border border-black/5 bg-white p-5 text-center reveal">
      <p class="text-[#C68E6B] text-lg mb-2">✔</p>
      <h3 class="text-sm font-medium">${esc(s)}</h3>
    </div>`
    )
    .join('\n');

  const socialSpans = ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'YouTube']
    .map((s) => `<span class="text-xs text-white/50">${s}</span>`)
    .join(' · ');

  const processSteps = bakery
    ? lang === 'es'
      ? [
          ['1. Elige', 'Escoge panes, bollería o pasteles del catálogo.'],
          ['2. Consulta', 'Escríbenos o pásate por el obrador.'],
          ['3. Encargo', 'Confirmamos cantidad, fecha y recogida.'],
          ['4. Horneado', 'Preparamos tu pedido con masa madre y calidad.'],
          ['5. Disfruta', 'Recoge en tienda o coordinamos la entrega acordada.'],
        ]
      : [
          ['1. Choose', 'Pick breads, pastries or cakes from the catalogue.'],
          ['2. Ask', 'Message us or visit the bakery.'],
          ['3. Order', 'We confirm quantity, date and pickup.'],
          ['4. Bake', 'We prepare your order with care.'],
          ['5. Enjoy', 'Pickup in store or arranged delivery.'],
        ]
    : bike
      ? lang === 'es'
        ? [
            ['1. Contacto', 'Cuéntanos qué buscas o qué hay que reparar.'],
            ['2. Asesoramiento', 'Te orientamos sobre modelo o diagnóstico.'],
            ['3. Presupuesto', 'Precio claro, sin sorpresas.'],
            ['4. Ejecución', 'Montaje, ajuste o reparación profesional.'],
            ['5. Seguimiento', 'Revisión y garantías oficiales.'],
          ]
        : [
            ['1. Contact', 'Tell us what you need or what to fix.'],
            ['2. Advice', 'Model guidance or diagnosis.'],
            ['3. Quote', 'Clear price, no surprises.'],
            ['4. Work', 'Build, tune or professional repair.'],
            ['5. Follow-up', 'Checks and official warranties.'],
          ]
      : lang === 'es'
        ? [
            ['1. Contacto', 'Cuéntanos qué necesitas.'],
            ['2. Asesoramiento', 'Te orientamos con opciones claras.'],
            ['3. Presupuesto', 'Propuesta transparente.'],
            ['4. Ejecución', 'Preparamos tu pedido o servicio.'],
            ['5. Seguimiento', 'Estamos disponibles después de la entrega.'],
          ]
        : [
            ['1. Contact', 'Tell us what you need.'],
            ['2. Advice', 'We guide you with clear options.'],
            ['3. Quote', 'Transparent proposal.'],
            ['4. Delivery', 'We prepare your order or service.'],
            ['5. Follow-up', 'We stay available after delivery.'],
          ];

  const processCards = processSteps
    .map(
      ([h, d]) =>
        `<div class="rounded-2xl bg-white border border-black/5 p-6 reveal">
      <p class="text-[#C68E6B] text-xs uppercase tracking-[0.2em] mb-2">${esc(h.split('.')[0] || '•')}</p>
      <h3 class="font-display text-xl mb-2">${esc(h)}</h3>
      <p class="text-sm text-neutral-600">${esc(d)}</p>
    </div>`
    )
    .join('\n');

  const faqItems = bakery
    ? lang === 'es'
      ? [
          ['¿Hacéis encargos?', 'Sí. Tartas, pan para negocios y catering con aviso previo.'],
          ['¿Hay compra online?', 'No. Catálogo con precios y contacto para encargar o reservar.'],
          ['¿Horario del obrador?', plan.hours || 'Lun–Sáb mañana y tarde. Pregunta en contacto.'],
          ['¿Alergenos?', 'Indicamos alérgenos en tienda. Consúltanos antes del encargo.'],
        ]
      : [
          ['Do you take custom orders?', 'Yes — cakes, wholesale bread and catering with notice.'],
          ['Online checkout?', 'No. Catalogue with prices; contact to order or reserve.'],
          ['Opening hours?', plan.hours || 'Mon–Sat. Ask via contact.'],
          ['Allergens?', 'We list allergens in store. Ask before ordering.'],
        ]
    : lang === 'es'
      ? [
          ['¿Cómo os contacto?', 'Formulario, email o teléfono. WhatsApp solo si lo indicamos.'],
          ['¿Hay carrito online?', 'No, salvo que lo pidas. Catálogo + contacto.'],
          ['¿Cuánto tarda un presupuesto?', 'Normalmente en 24–48 h laborables.'],
          ['¿Dónde estáis?', address],
        ]
      : [
          ['How do I reach you?', 'Form, email or phone. WhatsApp only if listed.'],
          ['Online cart?', 'No, unless you ask. Catalogue + contact.'],
          ['Quote turnaround?', 'Usually within 24–48 business hours.'],
          ['Where are you?', address],
        ];

  const faqHtml = faqItems
    .map(
      ([q, a]) =>
        `<details class="group border-b border-black/10 py-4">
      <summary class="font-medium cursor-pointer list-none flex justify-between gap-4">${esc(q)}<span class="text-[#C68E6B] group-open:rotate-45 transition">+</span></summary>
      <p class="mt-3 text-sm text-neutral-600 leading-relaxed pr-8">${esc(a)}</p>
    </details>`
    )
    .join('\n');

  const aboutImg = bakery
    ? IMAGE_BANK.bakery.about
    : corporate
      ? IMAGE_BANK.corporate.office[0] || IMAGE_BANK.corporate.team
      : barber
        ? IMAGE_BANK.barber.about
        : pack.variant === 'beauty'
          ? IMAGE_BANK.beauty.gallery[0]
          : imgAt(pack, 5);
  const reviewAvatar = (i: number) =>
    bakery
      ? IMAGE_BANK.bakery.gallery[i % IMAGE_BANK.bakery.gallery.length]
      : imgAt(pack, i + 8);

  const reviewCardsFixed = reviews
    .map(
      (r, i) => `<blockquote class="rounded-2xl bg-white/80 backdrop-blur border border-black/5 p-6 shadow-sm">
  <div class="flex items-center gap-3 mb-3">
    <img src="${reviewAvatar(i)}" alt="" class="w-12 h-12 rounded-full object-cover" loading="lazy" referrerpolicy="no-referrer" />
    <div><p class="font-medium text-sm">${esc(r.name)}</p><p class="text-[#C68E6B] text-xs">★★★★★</p></div>
  </div>
  <p class="text-sm text-neutral-700 leading-relaxed">“${esc(r.text)}”</p>
</blockquote>`
    )
    .join('\n');

  const has = (id: string) => plan.sections.includes(id);
  const navItems: { href: string; label: string; key: string }[] = [
    { key: 'collections', href: '#colecciones', label: t('Colecciones', 'Collections') },
    { key: 'products', href: '#productos', label: t('Productos', 'Products') },
    { key: 'services', href: '#servicios', label: t('Servicios', 'Services') },
    { key: 'tax_models', href: '#modelos', label: t('Modelos fiscales', 'Tax models') },
    { key: 'why', href: '#por-que', label: t('Beneficios', 'Benefits') },
    { key: 'process', href: '#proceso', label: t('Proceso', 'Process') },
    { key: 'gallery', href: '#galeria', label: t('Galería', 'Gallery') },
    { key: 'reviews', href: '#reseñas', label: t('Opiniones', 'Reviews') },
    { key: 'faq', href: '#faq', label: 'FAQ' },
    { key: 'about', href: '#nosotros', label: t('Nosotros', 'About') },
    { key: 'contact', href: '#contacto', label: t('Contacto', 'Contact') },
  ].filter((n) => has(n.key));

  const navLinks = navItems
    .map((n) => `<a href="${n.href}" class="hover:text-[#C68E6B]">${n.label}</a>`)
    .join('\n      ');

  const sectionHtml: Record<string, string> = {
    hero: `<section id="inicio" class="relative min-h-[70vh] max-h-[820px] flex items-center overflow-hidden">
  <div class="absolute inset-0 -z-10" data-cua-hero-bg>
    <img src="${hero}" alt="${brand} hero" class="w-full h-full object-cover object-center" fetchpriority="high" referrerpolicy="no-referrer" />
    <div class="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/70"></div>
  </div>
  <div class="max-w-6xl mx-auto px-6 pb-20 pt-32 w-full reveal">
    ${badgeHtml}
    <h1 class="font-display text-white text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-3xl drop-shadow-lg">${title}</h1>
    <p class="mt-5 text-white/85 text-base md:text-lg max-w-xl">${sub}</p>
    <div class="mt-8 flex flex-wrap gap-3">
      <a href="${has('products') ? '#productos' : has('services') ? '#servicios' : '#contacto'}" class="font-btn px-6 py-3 rounded-full bg-white text-[#111] text-sm hover:bg-[#C68E6B] hover:text-white transition">${esc(plan.primaryCta || t('Ver productos', 'View products'))}</a>
      <a href="${waHref}" class="font-btn px-6 py-3 rounded-full border border-white/70 text-white text-sm hover:bg-white/10 transition">${wantsWa ? t('Contactar por WhatsApp', 'Contact via WhatsApp') : t('Contactar', 'Contact')}</a>
    </div>
  </div>
</section>`,

    about: `<section id="nosotros" class="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
  <div class="reveal">
    <img src="${aboutImg}" alt="${brand}" class="rounded-3xl w-full aspect-[4/5] object-cover shadow-lg" loading="lazy" referrerpolicy="no-referrer" />
  </div>
  <div class="reveal">
    <h2 class="font-display text-3xl md:text-4xl mb-4">${t('Sobre nosotros', 'About us')}</h2>
    <p class="text-neutral-700 leading-relaxed mb-4">${aboutBody}</p>
    <p class="text-neutral-600 text-sm">${bakery ? t('Misión: pan de verdad, tradición y cercanía.', 'Mission: real bread, tradition and warmth.') : t('Misión: generar confianza y resultados con servicio de nivel agencia.', 'Mission: build trust and results with agency-level service.')}</p>
  </div>
</section>`,

    why: `<section id="por-que" class="py-20 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Por qué elegirnos', 'Why choose us')}</h2>
  <div class="grid sm:grid-cols-2 ${barber || why.length === 6 ? 'md:grid-cols-3' : 'lg:grid-cols-4'} gap-6">
    ${whyCards}
  </div>
</section>`,

    collections: `<section id="colecciones" class="py-10 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Colecciones destacadas', 'Featured collections')}</h2>
  <div class="grid md:grid-cols-3 gap-6">
    ${collectionCards}
  </div>
</section>`,

    products: `<section id="productos" class="py-20 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-4 reveal">${t('Productos destacados', 'Featured products')}</h2>
  <p class="text-center text-sm text-neutral-600 mb-12 max-w-xl mx-auto reveal">${t('Catálogo con precios. Sin carrito online: reserva o consulta desde contacto.', 'Catalogue with prices. No online cart — reserve or enquire via contact.')}</p>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    ${productCards}
  </div>
</section>`,

    services: `<section id="servicios" class="py-20 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Servicios', 'Services')}</h2>
  <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
    ${serviceCards}
  </div>
</section>`,

    tax_models: `<section id="modelos" class="py-20 px-6 max-w-6xl mx-auto bg-[#FAFAFA]">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-4 reveal">${t('Modelos fiscales', 'Tax models')}</h2>
  <p class="text-center text-sm text-neutral-600 mb-12 max-w-2xl mx-auto reveal">${t('Los regímenes más habituales, explicados con claridad. Te orientamos según tu caso.', 'The most common regimes, explained clearly. We guide you for your situation.')}</p>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    ${[
      lang === 'es'
        ? [
            ['IVA', 'Impuesto sobre el Valor Añadido: declaraciones periódicas y gestión de repercutido/soportado.'],
            ['IRPF', 'Renta de las personas físicas: estimación directa/objetiva y retenciones.'],
            ['Sociedades', 'IS para sociedades: contabilidad, pagos fraccionados y cuentas anuales.'],
            ['Autónomos', 'Alta, cuotas, obligaciones formales y calendario del trabajador por cuenta propia.'],
            ['Retenciones', 'Modelos de retenciones e ingresos a cuenta (nóminas, profesionales, alquileres).'],
            ['RGPD / LOPDGDD', 'Cumplimiento de protección de datos alineado con tu actividad.'],
          ]
        : [
            ['VAT', 'Value Added Tax: periodic returns and input/output management.'],
            ['Personal tax', 'Income tax filings and withholdings for individuals.'],
            ['Corporate tax', 'Company tax, instalments and annual accounts.'],
            ['Freelancers', 'Registration, contributions and formal obligations.'],
            ['Withholdings', 'Payroll, professional and rental withholding returns.'],
            ['Data protection', 'GDPR-aligned compliance for your activity.'],
          ],
    ][0]
      .map(
        ([n, d]) => `<article class="rounded-2xl bg-white border border-black/5 p-6 shadow-sm reveal">
  <h3 class="font-display text-xl mb-2 text-[#0b2545]">${esc(n)}</h3>
  <p class="text-sm text-neutral-600 leading-relaxed">${esc(d)}</p>
</article>`
      )
      .join('\n    ')}
  </div>
</section>`,

    process: `<section id="proceso" class="py-20 px-6 bg-[#FAFAFA]">
  <div class="max-w-6xl mx-auto">
    <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Cómo trabajamos', 'How we work')}</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
      ${processCards}
    </div>
  </div>
</section>`,

    gallery: `<section id="galeria" class="py-20 px-6 bg-[#F5EFE8]">
  <div class="max-w-6xl mx-auto">
    <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Galería', 'Gallery')}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      ${galleryImgs}
    </div>
  </div>
</section>`,

    reviews: `<section id="reseñas" class="py-20 px-6 bg-[#FAFAFA]">
  <div class="max-w-6xl mx-auto">
    <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Opiniones', 'Reviews')}</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      ${reviewCardsFixed}
    </div>
  </div>
</section>`,

    faq: `<section id="faq" class="py-20 px-6 max-w-3xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-10 reveal">${t('Preguntas frecuentes', 'FAQ')}</h2>
  <div class="reveal">${faqHtml}</div>
</section>`,

    cta: `<section id="cta" class="py-16 px-6 bg-[#111] text-white text-center">
  <div class="max-w-3xl mx-auto reveal">
    <h2 class="font-display text-3xl md:text-4xl mb-4">${t('¿Listo para dar el siguiente paso?', 'Ready for the next step?')}</h2>
    <p class="text-white/70 mb-8">${t('Cuéntanos qué necesitas y te respondemos con claridad.', 'Tell us what you need — we reply clearly.')}</p>
    <a href="#contacto" class="font-btn inline-flex px-8 py-3 rounded-full bg-white text-[#111] text-sm hover:bg-[#C68E6B] hover:text-white transition">${esc(plan.primaryCta || t('Contactar', 'Contact'))}</a>
  </div>
</section>`,

    contact: `<section id="contacto" class="py-20 px-6 bg-[#111] text-white">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
    <div class="reveal">
      <h2 class="font-display text-3xl md:text-4xl mb-4">${t('Contacta hoy', 'Contact us today')}</h2>
      <p class="text-white/70 text-sm mb-6">${wantsWa ? t('Formulario o WhatsApp. Respuesta rápida.', 'Form or WhatsApp. Fast reply.') : t('Formulario de contacto. Respuesta rápida.', 'Contact form. Fast reply.')}</p>
      <ul class="space-y-2 text-sm text-white/80">
        <li>${t('Email', 'Email')}: <a class="underline" href="mailto:${esc(email)}">${esc(email)}</a></li>
        <li>${t('Teléfono', 'Phone')}: ${phone ? `+${phone}` : t('Indica tu número en el brief', 'Add your number in the brief')}</li>
        ${wantsWa ? `<li>WhatsApp: <a class="underline" href="${waHref}">${waLabel}</a></li>` : ''}
        <li>${t('Dirección', 'Address')}: ${esc(address)}</li>
        <li>${t('Horario', 'Hours')}: ${esc(plan.hours || (lang === 'es' ? 'Lun–Sáb 10:00–20:00' : 'Mon–Sat 10:00–20:00'))}</li>
      </ul>
      <div class="mt-6 rounded-2xl overflow-hidden border border-white/10 aspect-video bg-neutral-800">
        <iframe title="map" class="w-full h-full" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed"></iframe>
      </div>
    </div>
    <form class="reveal space-y-4 bg-white/5 border border-white/10 rounded-3xl p-6" onsubmit="event.preventDefault();${wantsWa ? `window.location.href='${waHref}';` : `var o=document.getElementById('cua-contact-ok');if(o)o.hidden=false;`}">
      <label class="block text-xs uppercase tracking-widest text-white/60">${t('Nombre', 'Name')}<input required name="name" class="mt-1 w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm" /></label>
      <label class="block text-xs uppercase tracking-widest text-white/60">Email<input required type="email" name="email" class="mt-1 w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm" /></label>
      <label class="block text-xs uppercase tracking-widest text-white/60">${t('Teléfono', 'Phone')}<input name="phone" class="mt-1 w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm" /></label>
      <label class="block text-xs uppercase tracking-widest text-white/60">${t('Mensaje', 'Message')}<textarea required name="msg" rows="4" class="mt-1 w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm"></textarea></label>
      <button type="submit" class="font-btn w-full rounded-full bg-white text-[#111] py-3 text-sm hover:bg-[#C68E6B] hover:text-white transition">${wantsWa ? t('Enviar / WhatsApp', 'Send / WhatsApp') : t('Enviar mensaje', 'Send message')}</button>
      <p id="cua-contact-ok" hidden class="text-center text-xs text-emerald-300">${t('Gracias. Te responderemos pronto.', 'Thanks. We will reply soon.')}</p>
    </form>
  </div>
</section>`,
  };

  // Orden profesional (guía): hero → about → oferta → beneficios → proceso → prueba social → FAQ → CTA → contacto
  const BODY_ORDER = [
    'hero',
    'about',
    'collections',
    'products',
    'services',
    'tax_models',
    'why',
    'process',
    'gallery',
    'reviews',
    'faq',
    'cta',
    'contact',
  ];
  const bodySections = BODY_ORDER.filter((id) => has(id) && sectionHtml[id])
    .map((id) => sectionHtml[id])
    .join('\n\n');

  const footerLinks = [
    has('products') ? `<a href="#productos" class="block hover:text-[#C68E6B]">${t('Productos', 'Products')}</a>` : '',
    has('services') ? `<a href="#servicios" class="block hover:text-[#C68E6B]">${t('Servicios', 'Services')}</a>` : '',
    has('about') ? `<a href="#nosotros" class="block hover:text-[#C68E6B]">${t('Nosotros', 'About')}</a>` : '',
    `<a href="#contacto" class="block hover:text-[#C68E6B]">${t('Contacto', 'Contact')}</a>`,
  ]
    .filter(Boolean)
    .join('\n        ');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${brand} | ${titleSuffix}</title>
<meta name="description" content="${metaDesc}" />
<meta property="og:title" content="${brand}" />
<meta property="og:description" content="${sub}" />
<meta property="og:image" content="${hero}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=${bike ? 'Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&family=Poppins:wght@500;600' : 'Inter:wght@400;500;600&family=Playfair+Display:wght@500;600;700&family=Poppins:wght@500;600'}&display=swap" rel="stylesheet" />
<script src="https://cdn.tailwindcss.com"></script>
<style>
  :root { --accent: ${accent}; }
  html { scroll-behavior: smooth; }
  body { font-family: Inter, system-ui, sans-serif; background: #FAFAFA; color: #111111; }
  .font-display { font-family: ${bike ? '"Montserrat"' : '"Playfair Display"'}, system-ui, sans-serif; }
  .font-btn { font-family: Poppins, Inter, sans-serif; }
  .reveal { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease; }
  .reveal.on { opacity: 1; transform: none; }
  #cua-lb { display:none; position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,.88); align-items:center; justify-content:center; padding:1.5rem; }
  #cua-lb.open { display:flex; }
  #cua-lb img { max-width:min(960px,96vw); max-height:90vh; object-fit:contain; border-radius:1rem; }
</style>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Store","name":"${brand}","description":"${sub}","url":"#","telephone":"${phone || ''}","address":{"@type":"PostalAddress","streetAddress":"${esc(address)}"}}
</script>
</head>
<body class="antialiased">
<a href="#inicio" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 z-50">${t('Saltar al contenido', 'Skip to content')}</a>

<nav class="fixed top-0 inset-x-0 z-50 transition-all duration-300" id="cua-nav">
  <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
    <a href="#inicio" class="font-display text-xl tracking-wide">${brand}</a>
    <div class="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.18em]">
      ${navLinks}
    </div>
    <div class="flex items-center gap-2">
      <button type="button" id="cua-nav-toggle" class="md:hidden px-3 py-2 text-xs border border-black/15 rounded-full" aria-expanded="false" aria-controls="cua-nav-mobile">${t('Menú', 'Menu')}</button>
      <a href="${waHref}" class="font-btn text-xs px-4 py-2 rounded-full bg-[#111] text-white hover:bg-[#C68E6B] transition">${waLabel}</a>
    </div>
  </div>
  <div id="cua-nav-mobile" class="md:hidden hidden border-t border-black/5 bg-white/95 backdrop-blur px-4 py-3 space-y-2 text-sm">
    ${navItems.map((n) => `<a href="${n.href}" class="block py-2">${n.label}</a>`).join('\n    ')}
  </div>
</nav>

${bodySections}

<footer class="bg-[#111] text-white py-16 px-6">
  <div class="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
    <div>
      <p class="font-display text-xl mb-3">${brand}</p>
      <p class="text-white/60">${bakery ? t('Panadería artesanal con masa madre.', 'Artisan bakery with sourdough.') : bike ? t('Tienda de bicicletas y accesorios.', 'Bike shop & accessories.') : corporate ? t('Gestoría y asesoría de confianza para autónomos, pymes y particulares.', 'Trusted advisory for freelancers, SMEs and individuals.') : t('Boutique profesional con catálogo claro.', 'Professional boutique with a clear catalogue.')}</p>
    </div>
    <div>
      <p class="uppercase tracking-widest text-xs text-white/50 mb-3">${t('Enlaces', 'Links')}</p>
      <div class="space-y-2 text-white/80">
        ${footerLinks}
      </div>
    </div>
    <div>
      <p class="uppercase tracking-widest text-xs text-white/50 mb-3">${t('Horario', 'Hours')}</p>
      <p class="text-white/80">${esc(plan.hours || (lang === 'es' ? 'Lun–Sáb 10:00–20:00' : 'Mon–Sat 10:00–20:00'))}</p>
      <p class="text-white/80 mt-2">${esc(email)}</p>
      <p class="text-white/80">${esc(address)}</p>
    </div>
    <div>
      <p class="uppercase tracking-widest text-xs text-white/50 mb-3">${t('Contacto rápido', 'Quick contact')}</p>
      <a href="#contacto" class="inline-flex mt-1 rounded-full bg-white text-[#111] px-4 py-2 text-xs font-btn hover:bg-[#C68E6B] hover:text-white transition">${t('Escribirnos', 'Message us')}</a>
      <div class="flex flex-wrap gap-3 mt-4" data-cua-socials>
        ${socialSpans}
      </div>
    </div>
  </div>
  <p class="text-center text-xs text-white/40 mt-12">© ${new Date().getFullYear()} ${brand}. ${t('Todos los derechos reservados.', 'All rights reserved.')}</p>
</footer>

<div id="cua-site-widgets" data-cua-mod="widgets">
  ${
    wantsWa
      ? `<a href="${waHref}" ${phone ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="WhatsApp"
    style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:58px;height:58px;border-radius:9999px;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,.5);animation:cuaPulse 2.4s ease-in-out infinite">
    <svg width="30" height="30" viewBox="0 0 24 24"><path fill="#fff" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm4.43 12.39c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.20-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>
  </a>`
      : ''
  }
  <button type="button" id="cua-scroll-top" aria-label="Top" style="position:fixed;bottom:1.5rem;right:${wantsWa ? '5.5rem' : '1.5rem'};z-index:9999;width:48px;height:48px;border-radius:9999px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.25);display:none;align-items:center;justify-content:center;cursor:pointer">↑</button>
</div>
<div id="cua-lb" role="dialog" aria-modal="true"><img alt="" /></div>
<style>@keyframes cuaPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}</style>
<script>
(function(){
  var nav=document.getElementById('cua-nav');
  var toggle=document.getElementById('cua-nav-toggle');
  var mobile=document.getElementById('cua-nav-mobile');
  if(toggle&&mobile){toggle.addEventListener('click',function(){var open=mobile.classList.toggle('hidden')===false;toggle.setAttribute('aria-expanded',open?'true':'false');});mobile.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mobile.classList.add('hidden');toggle.setAttribute('aria-expanded','false');});});}
  window.addEventListener('scroll',function(){
    if(!nav)return;
    if(window.scrollY>40){nav.style.background='rgba(250,250,250,.85)';nav.style.backdropFilter='blur(12px)';nav.style.boxShadow='0 1px 0 rgba(0,0,0,.06)';}
    else{nav.style.background='transparent';nav.style.backdropFilter='none';nav.style.boxShadow='none';}
  });
  var b=document.getElementById('cua-scroll-top');
  if(b){window.addEventListener('scroll',function(){b.style.display=window.scrollY>320?'inline-flex':'none';});b.onclick=function(){window.scrollTo({top:0,behavior:'smooth'});};}
  var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('on');});},{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  var lb=document.getElementById('cua-lb');
  if(lb){document.querySelectorAll('[data-lightbox]').forEach(function(a){a.addEventListener('click',function(ev){ev.preventDefault();var img=lb.querySelector('img');img.src=a.getAttribute('href');lb.classList.add('open');});});lb.addEventListener('click',function(){lb.classList.remove('open');});}
})();
</script>
</body>
</html>`;
}
