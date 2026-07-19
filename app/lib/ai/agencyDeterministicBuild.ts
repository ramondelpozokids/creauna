/**
 * Construcción determinista densamente premium desde plan + pack + brief.
 * Último recurso cuando la IA no entrega HTML — NUNCA dejar al cliente sin web.
 * Se arma desde AgencySitePlan + URLs del pack + datos del brief (sector-aware).
 */
import type { AgencySitePlan } from './agencyPipeline';
import type { BriefImagePack } from './promptFirstQuality';
import { extractClientContact } from './siteChrome';
import { isBikeShopPrompt, isBakeryShopPrompt } from './businessProfiles';
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
    return isBikeShopPrompt(pack.variant)
      ? 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1200&q=80'
      : 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80';
  }
  return urls[i % urls.length];
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

function parseReviews(lang: 'es' | 'en', bike: boolean, bakery = false): { name: string; text: string }[] {
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
  const brand = esc(
    plan.businessName || (bakery ? 'El Trigo Dorado' : bike ? 'Bike Studio' : 'Maison')
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
          : lang === 'es'
            ? 'Elegancia que se nota'
            : 'Elegance you can feel')
  );
  const sub = esc(
    plan.heroSubtitle ||
      (bakery
        ? lang === 'es'
          ? 'Pan de masa madre, bollería y pasteles artesanales. Precios claros · WhatsApp. Sin carrito online.'
          : 'Sourdough, pastries and artisan cakes. Clear prices · WhatsApp. No online cart.'
        : bike
          ? lang === 'es'
            ? 'Catálogo profesional de bicicletas y accesorios. Precios claros · WhatsApp. Sin carrito online.'
            : 'Professional bike catalogue. Clear prices · WhatsApp. No online cart.'
          : lang === 'es'
            ? 'Pelucas, moda y accesorios de boutique. Catálogo con precios · Contacto por WhatsApp.'
            : 'Wigs, fashion and accessories. Catalogue with prices · Contact via WhatsApp.')
  );
  const contact = extractClientContact(prompt);
  const phone = contact.whatsapp || contact.phone;
  const waHref = phone ? `https://wa.me/${phone}` : '#contacto';
  const waLabel = phone
    ? 'WhatsApp'
    : lang === 'es'
      ? 'Contactar'
      : 'Contact';
  const email = contact.email || 'hola@' + brand.toLowerCase().replace(/[^a-z0-9]/g, '') + '.es';
  const address = contact.address || (lang === 'es' ? 'España' : 'Spain');
  const accent = plan.colors.accent || (bakery ? '#8B5E3C' : bike ? '#00d084' : '#C68E6B');
  const products = parseProductsFromBrief(prompt, lang);
  const reviews = parseReviews(lang, bike, bakery);
  const hero = bakery ? IMAGE_BANK.bakery.hero : imgAt(pack, 0);
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

  const services = bakery
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
      const href = phone ? `https://wa.me/${phone}?text=${msg}` : '#contacto';
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
      <a href="${href}" class="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#111] text-white text-xs tracking-wide hover:bg-[#C68E6B] transition">${waLabel}</a>
      <a href="#contacto" class="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#111]/20 text-xs hover:border-[#C68E6B] hover:text-[#C68E6B] transition">${lang === 'es' ? 'Pedir información' : 'Request info'}</a>
      <a href="${href}" class="inline-flex items-center justify-center px-4 py-2 rounded-full border border-[#111]/20 text-xs hover:border-[#C68E6B] transition">${lang === 'es' ? 'Reservar' : 'Reserve'}</a>
    </div>
  </div>
</article>`;
    })
    .join('\n');

  const galleryImgs = Array.from({ length: bakery ? 9 : 12 }, (_, i) =>
    bakery ? IMAGE_BANK.bakery.gallery[i % IMAGE_BANK.bakery.gallery.length] : imgAt(pack, i)
  )
    .map(
      (src, i) =>
        `<a href="${src}" class="block aspect-square overflow-hidden rounded-xl group" data-lightbox>
  <img src="${src}" alt="${lang === 'es' ? 'Galería' : 'Gallery'} ${i + 1}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" referrerpolicy="no-referrer" />
</a>`
    )
    .join('\n');

  const reviewCards = reviews
    .map(
      (r, i) => `<blockquote class="rounded-2xl bg-white/80 backdrop-blur border border-black/5 p-6 shadow-sm">
  <div class="flex items-center gap-3 mb-3">
    <img src="${imgAt(pack, i + 8)}" alt="" class="w-12 h-12 rounded-full object-cover" loading="lazy" referrerpolicy="no-referrer" />
    <div><p class="font-medium text-sm">${esc(r.name)}</p><p class="text-[#C68E6B] text-xs">★★★★★</p></div>
  </div>
  <p class="text-sm text-neutral-700 leading-relaxed">“${esc(r.text)}”</p>
</blockquote>`
    )
    .join('\n');

  const t = (es: string, en: string) => (lang === 'es' ? es : en);

  const metaDesc = bakery
    ? t(
        'Panadería artesanal: masa madre, bollería y pasteles. Contacto WhatsApp. Sin carrito online.',
        'Artisan bakery: sourdough, pastries and cakes. WhatsApp contact. No online cart.'
      )
    : bike
      ? t(
          'Tienda de bicicletas premium: MTB, carretera, e-bike y accesorios. Contacto WhatsApp. Sin carrito online.',
          'Premium bike shop: MTB, road, e-bike and accessories. WhatsApp contact. No online cart.'
        )
      : t(
          'Boutique de lujo: pelucas, moda femenina y accesorios. Catalogo con precios. Contacto por WhatsApp.',
          'Luxury boutique: wigs, womens fashion and accessories. Catalogue with prices. Contact via WhatsApp.'
        );
  const aboutBody = bakery
    ? t(
        plan.businessName +
          ' elabora pan de masa madre, bollería y pasteles con harinas de calidad y horneado diario. Catálogo con precios claros. Sin compra online: visita o WhatsApp.',
        plan.businessName +
          ' bakes sourdough, pastries and cakes with quality flours and a daily bake. Clear-price catalogue. No online checkout — visit or WhatsApp.'
      )
    : bike
      ? t(
          plan.businessName +
            ' es una tienda especializada en bicicletas y accesorios. Pasión por el ciclismo, taller profesional y catálogo con precios claros. Sin compra online: visita la tienda o WhatsApp.',
          plan.businessName +
            ' is a specialist bike shop. Passion for cycling, pro workshop and clear-price catalogue. No online checkout — visit or WhatsApp.'
        )
      : t(
          plan.businessName +
            ' es una boutique de pelucas, moda femenina y accesorios. Nuestra filosofia: elegancia minimalista, asesoramiento humano y catalogo con precios claros. Sin compra online: te acompanamos por WhatsApp hasta reservar tu pieza.',
          plan.businessName +
            ' is a boutique for wigs, womens fashion and accessories. Philosophy: minimalist elegance, human advice and a clear-price catalogue. No online checkout — we guide you on WhatsApp until you reserve.'
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
      <a href="#colecciones" class="hover:text-[#C68E6B]">${t('Colecciones', 'Collections')}</a>
      <a href="#productos" class="hover:text-[#C68E6B]">${t('Productos', 'Products')}</a>
      <a href="#galeria" class="hover:text-[#C68E6B]">${t('Galería', 'Gallery')}</a>
      <a href="#servicios" class="hover:text-[#C68E6B]">${t('Servicios', 'Services')}</a>
      <a href="#nosotros" class="hover:text-[#C68E6B]">${t('Nosotros', 'About')}</a>
      <a href="#contacto" class="hover:text-[#C68E6B]">${t('Contacto', 'Contact')}</a>
    </div>
    <a href="${waHref}" class="font-btn text-xs px-4 py-2 rounded-full bg-[#111] text-white hover:bg-[#C68E6B] transition">${waLabel}</a>
  </div>
</nav>

<section id="inicio" class="relative min-h-[70vh] max-h-[820px] flex items-center overflow-hidden">
  <div class="absolute inset-0 -z-10" data-cua-hero-bg>
    <img src="${hero}" alt="${brand} hero" class="w-full h-full object-cover object-center" fetchpriority="high" referrerpolicy="no-referrer" />
    <div class="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/70"></div>
  </div>
  <div class="max-w-6xl mx-auto px-6 pb-20 pt-32 w-full reveal">
    ${badgeHtml}
    <h1 class="font-display text-white text-4xl md:text-6xl lg:text-7xl leading-[1.05] max-w-3xl drop-shadow-lg">${title}</h1>
    <p class="mt-5 text-white/85 text-base md:text-lg max-w-xl">${sub}</p>
    <div class="mt-8 flex flex-wrap gap-3">
      <a href="#productos" class="font-btn px-6 py-3 rounded-full bg-white text-[#111] text-sm hover:bg-[#C68E6B] hover:text-white transition">${t('Ver productos', 'View products')}</a>
      <a href="${waHref}" class="font-btn px-6 py-3 rounded-full border border-white/70 text-white text-sm hover:bg-white/10 transition">${t('Contactar por WhatsApp', 'Contact via WhatsApp')}</a>
    </div>
  </div>
</section>

<section id="por-que" class="py-20 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Por qué elegirnos', 'Why choose us')}</h2>
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
    ${whyCards}
  </div>
</section>

<section id="colecciones" class="py-10 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Colecciones destacadas', 'Featured collections')}</h2>
  <div class="grid md:grid-cols-3 gap-6">
    ${collectionCards}
  </div>
</section>

<section id="productos" class="py-20 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-4 reveal">${t('Productos destacados', 'Featured products')}</h2>
  <p class="text-center text-sm text-neutral-600 mb-12 max-w-xl mx-auto reveal">${t('Catálogo con precios. Sin carrito online: reserva o consulta por WhatsApp.', 'Catalogue with prices. No online cart — reserve or enquire via WhatsApp.')}</p>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    ${productCards}
  </div>
</section>

<section id="galeria" class="py-20 px-6 bg-[#F5EFE8]">
  <div class="max-w-6xl mx-auto">
    <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Galería', 'Gallery')}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      ${galleryImgs}
    </div>
  </div>
</section>

<section id="servicios" class="py-20 px-6 max-w-6xl mx-auto">
  <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Servicios', 'Services')}</h2>
  <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
    ${serviceCards}
  </div>
</section>

<section id="reseñas" class="py-20 px-6 bg-[#FAFAFA]">
  <div class="max-w-6xl mx-auto">
    <h2 class="font-display text-3xl md:text-4xl text-center mb-12 reveal">${t('Opiniones', 'Reviews')}</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      ${reviewCards}
    </div>
  </div>
</section>

<section id="nosotros" class="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
  <div class="reveal">
    <img src="${bakery ? IMAGE_BANK.bakery.about : imgAt(pack, 5)}" alt="${brand}" class="rounded-3xl w-full aspect-[4/5] object-cover shadow-lg" loading="lazy" referrerpolicy="no-referrer" />
  </div>
  <div class="reveal">
    <h2 class="font-display text-3xl md:text-4xl mb-4">${t('Sobre nosotros', 'About us')}</h2>
    <p class="text-neutral-700 leading-relaxed mb-4">${aboutBody}</p>
    <p class="text-neutral-600 text-sm">${bakery ? t('Misión: pan de verdad, tradición y cercanía.', 'Mission: real bread, tradition and warmth.') : t('Mision: inspirar confianza y belleza con un servicio de nivel agencia.', 'Mission: inspire trust and beauty with agency-level service.')}</p>
  </div>
</section>

<section id="contacto" class="py-20 px-6 bg-[#111] text-white">
  <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
    <div class="reveal">
      <h2 class="font-display text-3xl md:text-4xl mb-4">${t('Contacta hoy', 'Contact us today')}</h2>
      <p class="text-white/70 text-sm mb-6">${t('Formulario o WhatsApp. Respuesta rápida.', 'Form or WhatsApp. Fast reply.')}</p>
      <ul class="space-y-2 text-sm text-white/80">
        <li>${t('Email', 'Email')}: <a class="underline" href="mailto:${esc(email)}">${esc(email)}</a></li>
        <li>${t('Teléfono', 'Phone')}: ${phone ? `+${phone}` : t('Indica tu número en el brief', 'Add your number in the brief')}</li>
        <li>WhatsApp: <a class="underline" href="${waHref}">${waLabel}</a></li>
        <li>${t('Dirección', 'Address')}: ${esc(address)}</li>
        <li>${t('Horario', 'Hours')}: ${esc(plan.hours || (lang === 'es' ? 'Lun–Sáb 10:00–20:00' : 'Mon–Sat 10:00–20:00'))}</li>
      </ul>
      <div class="mt-6 rounded-2xl overflow-hidden border border-white/10 aspect-video bg-neutral-800">
        <iframe title="map" class="w-full h-full" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed"></iframe>
      </div>
    </div>
    <form class="reveal space-y-4 bg-white/5 border border-white/10 rounded-3xl p-6" onsubmit="event.preventDefault();window.location.href='${waHref}';">
      <label class="block text-xs uppercase tracking-widest text-white/60">${t('Nombre', 'Name')}<input required name="name" class="mt-1 w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm" /></label>
      <label class="block text-xs uppercase tracking-widest text-white/60">Email<input required type="email" name="email" class="mt-1 w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm" /></label>
      <label class="block text-xs uppercase tracking-widest text-white/60">${t('Teléfono', 'Phone')}<input name="phone" class="mt-1 w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm" /></label>
      <label class="block text-xs uppercase tracking-widest text-white/60">${t('Mensaje', 'Message')}<textarea required name="msg" rows="4" class="mt-1 w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm"></textarea></label>
      <button type="submit" class="font-btn w-full rounded-full bg-white text-[#111] py-3 text-sm hover:bg-[#C68E6B] hover:text-white transition">${t('Enviar / WhatsApp', 'Send / WhatsApp')}</button>
    </form>
  </div>
</section>

<footer class="bg-[#111] text-white py-16 px-6">
  <div class="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
    <div>
      <p class="font-display text-xl mb-3">${brand}</p>
      <p class="text-white/60">${bakery ? t('Panadería artesanal con masa madre.', 'Artisan bakery with sourdough.') : bike ? t('Tienda de bicicletas y accesorios.', 'Bike shop & accessories.') : t('Boutique de pelucas, moda y accesorios.', 'Wigs, fashion & accessories boutique.')}</p>
    </div>
    <div>
      <p class="uppercase tracking-widest text-xs text-white/50 mb-3">${t('Enlaces', 'Links')}</p>
      <div class="space-y-2 text-white/80">
        <a href="#productos" class="block hover:text-[#C68E6B]">${t('Productos', 'Products')}</a>
        <a href="#contacto" class="block hover:text-[#C68E6B]">${t('Contacto', 'Contact')}</a>
      </div>
    </div>
    <div>
      <p class="uppercase tracking-widest text-xs text-white/50 mb-3">${t('Horario', 'Hours')}</p>
      <p class="text-white/80">${esc(plan.hours || (lang === 'es' ? 'Lun–Sáb 10:00–20:00' : 'Mon–Sat 10:00–20:00'))}</p>
      <p class="text-white/80 mt-2">${esc(email)}</p>
      <p class="text-white/80">${esc(address)}</p>
    </div>
    <div>
      <p class="uppercase tracking-widest text-xs text-white/50 mb-3">Newsletter</p>
      <form class="flex gap-2" onsubmit="event.preventDefault();">
        <input type="email" required placeholder="Email" class="flex-1 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm" />
        <button class="rounded-full bg-white text-[#111] px-4 text-xs font-btn">${t('OK', 'OK')}</button>
      </form>
      <div class="flex flex-wrap gap-3 mt-4" data-cua-socials>
        ${socialSpans}
      </div>
    </div>
  </div>
  <p class="text-center text-xs text-white/40 mt-12">© ${new Date().getFullYear()} ${brand}. ${t('Todos los derechos reservados.', 'All rights reserved.')}</p>
</footer>

<div id="cua-site-widgets" data-cua-mod="widgets">
  <a href="${waHref}" ${phone ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="WhatsApp"
    style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:58px;height:58px;border-radius:9999px;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,.5);animation:cuaPulse 2.4s ease-in-out infinite">
    <svg width="30" height="30" viewBox="0 0 24 24"><path fill="#fff" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm4.43 12.39c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>
  </a>
  <button type="button" id="cua-scroll-top" aria-label="Top" style="position:fixed;bottom:1.5rem;right:5.5rem;z-index:9999;width:48px;height:48px;border-radius:9999px;background:#111;color:#fff;border:1px solid rgba(255,255,255,.25);display:none;align-items:center;justify-content:center;cursor:pointer">↑</button>
</div>
<div id="cua-lb" role="dialog" aria-modal="true"><img alt="" /></div>
<style>@keyframes cuaPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}</style>
<script>
(function(){
  var nav=document.getElementById('cua-nav');
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
