import type { SiteFeatures } from './intentAnalyzer';
import type { TemplatePageSection } from '../templatePages';
import type { BusinessProfile } from './businessProfiles';

export type JewelryBuildCtx = {
  name: string;
  tagline: string;
  badge: string;
  heroImage: string;
  ctaPrimary: string;
  ctaSecondary: string;
  images: string[];
  lang: 'es' | 'en';
  profile: BusinessProfile | null;
};

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const LUX_NAV_ES = [
  'Inicio',
  'Relojes',
  'Joyería',
  'Marcas',
  'Servicios',
  'Maestro joyero',
  'Galería',
  'Blog',
  'Contacto',
];
const LUX_NAV_EN = [
  'Home',
  'Watches',
  'Jewelry',
  'Brands',
  'Services',
  'Master jeweler',
  'Gallery',
  'Blog',
  'Contact',
];

/** Web corporativa joyería / relojería — inspiración Rolex, Cartier, Patek. */
export function buildJewelryWatchSite(ctx: JewelryBuildCtx, features: SiteFeatures): TemplatePageSection[] {
  const { name, tagline, heroImage, profile, lang, images, ctaPrimary, ctaSecondary, badge } = ctx;
  const es = lang === 'es';
  const phone = profile?.phone ?? '910 00 00 00';
  const phoneDigits = phone.replace(/\D/g, '');
  const email = profile?.email ?? 'boutique@atelier.com';
  const rating = profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : '5.0 · Google Reviews';
  const aboutText = profile ? (es ? profile.aboutEs : profile.aboutEn) : '';
  const items = profile ? (es ? profile.menuItems.es : profile.menuItems.en) : [];
  const reviews = profile ? (es ? profile.reviews.es : profile.reviews.en) : [];
  const nav = es ? LUX_NAV_ES : LUX_NAV_EN;
  const gal = images.length >= 6 ? images : [...images, ...images].slice(0, 8);

  const brands = es
    ? ['Rolex', 'Omega', 'Cartier', 'Tag Heuer', 'Longines', 'Tudor', 'Breitling', 'Patek Philippe', 'IWC', 'Tissot']
    : ['Rolex', 'Omega', 'Cartier', 'Tag Heuer', 'Longines', 'Tudor', 'Breitling', 'Patek Philippe', 'IWC', 'Tissot'];

  const categories = es
    ? [
        'Relojes Hombre',
        'Relojes Mujer',
        'Alta Relojería',
        'Joyería',
        'Anillos',
        'Alianzas',
        'Diamantes',
        'Compromiso',
        'Ediciones Limitadas',
      ]
    : [
        "Men's Watches",
        "Women's Watches",
        'Haute Horlogerie',
        'Jewelry',
        'Rings',
        'Wedding Bands',
        'Diamonds',
        'Engagement',
        'Limited Editions',
      ];

  const services = es
    ? [
        { t: 'Reparación de relojes', d: 'Taller oficial con piezas certificadas.' },
        { t: 'Restauración y pulido', d: 'Devolvemos el brillo original a su pieza.' },
        { t: 'Tasación y compra', d: 'Valoración profesional con total discreción.' },
        { t: 'Grabados personalizados', d: 'Detalles únicos para momentos irrepetibles.' },
        { t: 'Financiación premium', d: 'Planes flexibles sin comprometer la experiencia.' },
        { t: 'Personal Shopper', d: 'Asesoramiento exclusivo uno a uno.' },
      ]
    : [
        { t: 'Watch repair', d: 'Official workshop with certified parts.' },
        { t: 'Restoration & polishing', d: 'We restore your piece to its original brilliance.' },
        { t: 'Appraisal & purchase', d: 'Professional valuation with full discretion.' },
        { t: 'Custom engraving', d: 'Unique details for unforgettable moments.' },
        { t: 'Premium financing', d: 'Flexible plans without compromising experience.' },
        { t: 'Personal Shopper', d: 'Exclusive one-to-one advisory.' },
      ];

  const stats = es
    ? [
        { v: '35+', l: 'Años de experiencia' },
        { v: '12.000+', l: 'Clientes satisfechos' },
        { v: '8.500+', l: 'Relojes reparados' },
        { v: '4.9', l: 'Valoración media' },
      ]
    : [
        { v: '35+', l: 'Years of experience' },
        { v: '12,000+', l: 'Satisfied clients' },
        { v: '8,500+', l: 'Watches serviced' },
        { v: '4.9', l: 'Average rating' },
      ];

  const faqs = es
    ? [
        { q: '¿Son distribuidor oficial?', a: 'Trabajamos con marcas suizas y garantía oficial en relojes seleccionados.' },
        { q: '¿Ofrecen financiación?', a: 'Sí, con planes personalizados y aprobación ágil.' },
        { q: '¿Cómo reservo cita privada?', a: 'Use el formulario de cita o WhatsApp para una experiencia exclusiva.' },
      ]
    : [
        { q: 'Are you an official dealer?', a: 'We work with Swiss brands and official warranty on selected watches.' },
        { q: 'Do you offer financing?', a: 'Yes, with tailored plans and fast approval.' },
        { q: 'How do I book a private appointment?', a: 'Use the appointment form or WhatsApp for an exclusive experience.' },
      ];

  const hero: TemplatePageSection = {
    id: 'hero',
    type: 'hero',
    navLabelEs: 'Inicio',
    navLabelEn: 'Home',
    html: `<div class="bg-[#0a0a0a] overflow-hidden rounded-[2rem] border border-stone-800/50 shadow-2xl">
      <header class="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0a0a]/90 border-b border-stone-800/40">
        <div class="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-4">
          <div class="font-serif text-lg sm:text-xl tracking-[0.12em] uppercase text-stone-100">${esc(name)}</div>
          <nav class="cua-nav-desktop hidden xl:flex flex-wrap gap-5 text-[9px] tracking-[0.22em] uppercase text-stone-400 font-medium">
            ${nav.slice(0, 7).map((n) => `<span class="hover:text-amber-200/90 transition-colors cursor-pointer whitespace-nowrap">${n}</span>`).join('')}
          </nav>
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <span class="hidden sm:inline text-[10px] tracking-widest text-stone-500 uppercase cursor-pointer">ES · EN</span>
            <span class="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 text-xs cursor-pointer" aria-label="Search">⌕</span>
            ${phoneDigits ? `<a href="https://wa.me/34${phoneDigits}" class="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-green-400 text-[10px] font-bold">WA</a>` : ''}
            <a href="tel:+34${phoneDigits}" class="hidden md:inline text-xs text-stone-300">${esc(phone)}</a>
            <span class="px-3 py-1.5 bg-amber-700/90 text-stone-950 text-[9px] font-bold tracking-[0.15em] uppercase rounded-sm cursor-pointer">${es ? 'Reservar cita' : 'Book visit'}</span>
          </div>
        </div>
      </header>
      <div class="relative min-h-[85vh] flex items-end sm:items-center">
        <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover opacity-70 scale-105" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]/20"></div>
        <div class="relative z-10 w-full px-6 sm:px-12 md:px-20 pb-16 md:pb-24 pt-32 max-w-5xl">
          <p class="text-[10px] tracking-[0.4em] uppercase text-amber-500/90 mb-6">${esc(badge)}</p>
          <h1 class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light text-stone-50 tracking-tight leading-[1.05]">${esc(name)}</h1>
          <p class="mt-8 text-lg md:text-2xl font-serif italic text-stone-300/90 max-w-2xl font-light leading-relaxed">${esc(tagline)}</p>
          <div class="mt-12 flex flex-wrap gap-4">
            <span class="px-10 py-4 bg-stone-50 text-stone-950 text-xs font-bold tracking-[0.2em] uppercase hover:bg-amber-50 transition-colors cursor-pointer">${esc(ctaPrimary)}</span>
            <span class="px-10 py-4 border border-stone-400/60 text-stone-100 text-xs font-bold tracking-[0.2em] uppercase hover:border-amber-500/60 transition-colors cursor-pointer">${esc(ctaSecondary)}</span>
          </div>
          <div class="mt-16 flex items-center gap-3 text-stone-500 text-[10px] tracking-[0.3em] uppercase animate-pulse">
            <span class="w-px h-8 bg-stone-600"></span>${es ? 'Desplazar' : 'Scroll'}
          </div>
        </div>
      </div>
    </div>`,
  };

  const statsSec: TemplatePageSection = {
    id: 'stats',
    type: 'services',
    navLabelEs: 'Experiencia',
    navLabelEn: 'Experience',
    html: `<div class="bg-stone-50 rounded-[2rem] py-16 md:py-24 px-6 md:px-16 border border-stone-100">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto text-center">
        ${stats.map((s) => `<div class="group">
          <div class="text-4xl md:text-5xl font-serif font-light text-stone-900 group-hover:text-amber-800 transition-colors">${s.v}</div>
          <div class="mt-3 text-[10px] md:text-xs tracking-[0.25em] uppercase text-stone-500">${s.l}</div>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const about: TemplatePageSection = {
    id: 'about',
    type: 'about',
    navLabelEs: 'Nuestra historia',
    navLabelEn: 'Our story',
    html: `<div class="bg-white rounded-[2rem] py-20 md:py-32 px-6 md:px-16 border border-stone-100">
      <div class="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
        <div>
          <p class="text-[10px] tracking-[0.35em] uppercase text-amber-700/80 mb-6">${es ? 'Herencia & artesanía' : 'Heritage & craft'}</p>
          <h2 class="text-3xl md:text-5xl font-serif font-light text-stone-900 leading-tight">${es ? 'Pasión por la alta relojería y la joyería de autor' : 'Passion for haute horlogerie and author jewelry'}</h2>
          <p class="mt-8 text-stone-600 leading-relaxed text-base md:text-lg font-light">${esc(aboutText)}</p>
          <div class="mt-10 space-y-4 text-sm text-stone-700">
            ${(es
              ? ['Más de tres décadas de excelencia', 'Autenticidad y garantía oficial', 'Boutique privada en el corazón de la ciudad']
              : ['Over three decades of excellence', 'Authenticity and official warranty', 'Private boutique in the heart of the city']
            ).map((line) => `<div class="flex gap-3"><span class="text-amber-700">—</span><span>${line}</span></div>`).join('')}
          </div>
        </div>
        <div class="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
          <img src="${gal[1] ?? heroImage}" alt="" class="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]" loading="lazy" referrerpolicy="no-referrer" />
        </div>
      </div>
    </div>`,
  };

  const brandsSec: TemplatePageSection = {
    id: 'brands',
    type: 'menu',
    navLabelEs: 'Marcas',
    navLabelEn: 'Brands',
    html: `<div class="bg-[#0a0a0a] rounded-[2rem] py-20 md:py-28 px-6 md:px-16 border border-stone-800/40">
      <p class="text-center text-[10px] tracking-[0.35em] uppercase text-amber-500/70 mb-4">${es ? 'Distribuidor autorizado' : 'Authorized dealer'}</p>
      <h2 class="text-center text-3xl md:text-4xl font-serif font-light text-stone-100 mb-16">${es ? 'Marcas de prestigio internacional' : 'Internationally prestigious brands'}</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
        ${brands.map((b) => `<div class="flex items-center justify-center h-16 md:h-20 border border-stone-800/80 rounded-sm hover:border-amber-700/40 transition-colors group">
          <span class="font-serif text-stone-400 group-hover:text-amber-200/90 text-sm md:text-base tracking-widest uppercase transition-colors">${b}</span>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const categoriesSec: TemplatePageSection = {
    id: 'categories',
    type: 'services',
    navLabelEs: 'Categorías',
    navLabelEn: 'Categories',
    html: `<div class="bg-stone-50 rounded-[2rem] py-20 md:py-28 px-6 md:px-16">
      <h2 class="text-center text-3xl md:text-4xl font-serif font-light text-stone-900 mb-14">${es ? 'Un universo de excelencia' : 'A universe of excellence'}</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        ${categories.map((c, i) => `<article class="group relative overflow-hidden rounded-sm border border-stone-200 bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer">
          <div class="aspect-[16/10] overflow-hidden"><img src="${gal[i % gal.length]}" alt="${esc(c)}" class="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" loading="lazy" referrerpolicy="no-referrer" /></div>
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
          <h3 class="absolute bottom-4 left-4 right-4 font-serif text-lg text-white tracking-wide">${esc(c)}</h3>
        </article>`).join('')}
      </div>
    </div>`,
  };

  const products: TemplatePageSection = {
    id: 'menu',
    type: 'menu',
    navLabelEs: 'Destacados',
    navLabelEn: 'Highlights',
    html: `<div class="bg-white rounded-[2rem] py-20 md:py-32 px-6 md:px-16 border border-stone-100">
      <p class="text-center text-[10px] tracking-[0.35em] uppercase text-stone-400 mb-4">${es ? 'Selección curada' : 'Curated selection'}</p>
      <h2 class="text-center text-3xl md:text-5xl font-serif font-light text-stone-900 mb-16">${es ? 'Piezas destacadas' : 'Featured pieces'}</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        ${items.map((item) => `<article class="group text-center">
          <div class="relative aspect-square overflow-hidden rounded-sm bg-stone-100 mb-6">
            <img src="${item.image}" alt="${esc(item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]" loading="lazy" referrerpolicy="no-referrer" />
            <div class="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/10 transition-colors duration-500"></div>
          </div>
          <h3 class="font-serif text-xl text-stone-900">${esc(item.title)}</h3>
          ${item.price ? `<p class="mt-2 text-amber-800 font-light tracking-wide">${esc(item.price)}</p>` : ''}
          <span class="mt-4 inline-block text-[10px] tracking-[0.25em] uppercase text-stone-500 group-hover:text-amber-800 transition-colors border-b border-transparent group-hover:border-amber-800 pb-0.5">${esc(item.cta)}</span>
        </article>`).join('')}
      </div>
    </div>`,
  };

  const whyUs: TemplatePageSection = {
    id: 'experience',
    type: 'about',
    navLabelEs: 'Por qué elegirnos',
    navLabelEn: 'Why choose us',
    html: `<div class="bg-[#0a0a0a] rounded-[2rem] py-20 md:py-28 px-6 md:px-16 border border-stone-800/40">
      <h2 class="text-center text-3xl md:text-4xl font-serif font-light text-stone-100 mb-16">${es ? 'La experiencia Atelier' : 'The Atelier experience'}</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        ${(es
          ? [
              { t: 'Garantía oficial', d: 'Autenticidad certificada en cada pieza.' },
              { t: 'Taller propio', d: 'Maestro relojero y joyero in-house.' },
              { t: 'Entrega asegurada', d: 'Logística premium y discreción total.' },
              { t: 'Asesoramiento', d: 'Cita privada sin compromiso.' },
            ]
          : [
              { t: 'Official warranty', d: 'Certified authenticity on every piece.' },
              { t: 'In-house workshop', d: 'Master watchmaker and jeweler on site.' },
              { t: 'Insured delivery', d: 'Premium logistics and full discretion.' },
              { t: 'Advisory', d: 'Private appointment, no obligation.' },
            ]
        ).map((x) => `<div class="text-center px-4">
          <div class="w-12 h-px bg-amber-600/60 mx-auto mb-6"></div>
          <h3 class="font-serif text-lg text-stone-100">${x.t}</h3>
          <p class="mt-3 text-sm text-stone-500 leading-relaxed font-light">${x.d}</p>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const servicesSec: TemplatePageSection = {
    id: 'services',
    type: 'services',
    navLabelEs: 'Servicios',
    navLabelEn: 'Services',
    html: `<div class="bg-stone-50 rounded-[2rem] py-20 md:py-28 px-6 md:px-16">
      <h2 class="text-center text-3xl md:text-4xl font-serif font-light text-stone-900 mb-14">${es ? 'Servicios de excelencia' : 'Services of excellence'}</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${services.map((s) => `<article class="p-8 bg-white border border-stone-100 rounded-sm hover:border-amber-200/60 hover:shadow-lg transition-all duration-500">
          <h3 class="font-serif text-lg text-stone-900">${s.t}</h3>
          <p class="mt-3 text-sm text-stone-600 font-light leading-relaxed">${s.d}</p>
        </article>`).join('')}
      </div>
    </div>`,
  };

  const craftsman: TemplatePageSection = {
    id: 'craftsman',
    type: 'about',
    navLabelEs: 'Maestro joyero',
    navLabelEn: 'Master jeweler',
    html: `<div class="bg-white rounded-[2rem] py-20 md:py-32 px-6 md:px-16 border border-stone-100">
      <div class="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
        <div class="relative aspect-[3/4] rounded-sm overflow-hidden order-2 md:order-1 shadow-2xl">
          <img src="${gal[2] ?? heroImage}" alt="${es ? 'Maestro joyero' : 'Master jeweler'}" class="w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer" />
        </div>
        <div class="order-1 md:order-2">
          <p class="text-[10px] tracking-[0.35em] uppercase text-amber-700/80 mb-6">${es ? 'Artesanía' : 'Craftsmanship'}</p>
          <h2 class="text-3xl md:text-4xl font-serif font-light text-stone-900">${es ? 'El maestro detrás de cada pieza' : 'The master behind every piece'}</h2>
          <p class="mt-6 text-stone-600 leading-relaxed font-light">${es ? 'Nuestro maestro relojero cuenta con certificaciones suizas y más de 25 años restaurando piezas de alta gama. Cada reloj y joya recibe el mismo cuidado que en las grandes maisons.' : 'Our master watchmaker holds Swiss certifications and over 25 years restoring haute pieces. Every watch and jewel receives the same care as in the great maisons.'}</p>
          <div class="mt-8 flex flex-wrap gap-3 text-[10px] tracking-[0.2em] uppercase text-stone-500">
            ${(es ? ['Certificación suiza', 'Restauración', 'Alta relojería'] : ['Swiss certified', 'Restoration', 'Haute horlogerie']).map((c) => `<span class="px-4 py-2 border border-stone-200 rounded-sm">${c}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>`,
  };

  const gallerySec: TemplatePageSection = {
    id: 'gallery',
    type: 'gallery',
    navLabelEs: 'Galería',
    navLabelEn: 'Gallery',
    html: `<div class="bg-[#0a0a0a] rounded-[2rem] py-20 md:py-24 px-6 md:px-16 border border-stone-800/40 overflow-hidden">
      <h2 class="text-center text-3xl md:text-4xl font-serif font-light text-stone-100 mb-12">${es ? 'Galería' : 'Gallery'}</h2>
      <div class="flex flex-wrap justify-center gap-3 mb-10 text-[10px] tracking-[0.2em] uppercase">
        ${(es ? ['Todos', 'Relojes', 'Joyería', 'Boutique', 'Taller'] : ['All', 'Watches', 'Jewelry', 'Boutique', 'Workshop']).map((f, i) => `<span class="px-4 py-2 rounded-full border ${i === 0 ? 'border-amber-600/60 text-amber-400' : 'border-stone-700 text-stone-500'} cursor-pointer">${f}</span>`).join('')}
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-6xl mx-auto">
        ${gal.slice(0, 8).map((img, i) => `<div class="group relative aspect-square overflow-hidden rounded-sm cursor-pointer">
          <img src="${img}" alt="" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" referrerpolicy="no-referrer" />
          <div class="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/30 transition-colors"></div>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const reviewsSec: TemplatePageSection = {
    id: 'reviews',
    type: 'reviews',
    navLabelEs: 'Testimonios',
    navLabelEn: 'Testimonials',
    html: `<div class="bg-stone-50 rounded-[2rem] py-20 md:py-28 px-6 md:px-16">
      <p class="text-center text-[10px] tracking-[0.35em] uppercase text-stone-400 mb-2">${esc(rating)}</p>
      <h2 class="text-center text-3xl md:text-4xl font-serif font-light text-stone-900 mb-14">${es ? 'La confianza de nuestros clientes' : 'Our clients\' trust'}</h2>
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        ${reviews.map((r) => `<article class="bg-white p-8 md:p-10 border border-stone-100 rounded-sm shadow-sm hover:shadow-md transition-shadow">
          <div class="text-amber-600 text-sm">${'★'.repeat(r.stars)}</div>
          <p class="mt-6 text-stone-700 font-light italic leading-relaxed">"${esc(r.text)}"</p>
          <div class="mt-8 font-serif text-stone-900">${esc(r.name)}</div>
          <div class="text-[10px] tracking-widest uppercase text-stone-400 mt-1">Google Reviews</div>
        </article>`).join('')}
      </div>
    </div>`,
  };

  const blogSec: TemplatePageSection = {
    id: 'blog',
    type: 'blog',
    navLabelEs: 'Blog',
    navLabelEn: 'Blog',
    html: `<div class="bg-white rounded-[2rem] py-20 md:py-28 px-6 md:px-16 border border-stone-100">
      <h2 class="text-center text-3xl md:text-4xl font-serif font-light text-stone-900 mb-14">${es ? 'Actualidad & tendencias' : 'News & trends'}</h2>
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        ${(es
          ? [
              { t: 'Guía de compra: relojes de inversión 2026', d: 'Piezas que mantienen y aumentan su valor.' },
              { t: 'Cuidado de joyas con diamantes', d: 'Consejos de nuestro maestro joyero.' },
              { t: 'Novedades en alta relojería', d: 'Las marcas que marcan tendencia este año.' },
            ]
          : [
              { t: 'Buying guide: investment watches 2026', d: 'Pieces that hold and increase value.' },
              { t: 'Caring for diamond jewelry', d: 'Tips from our master jeweler.' },
              { t: 'Haute horlogerie news', d: 'Brands setting trends this year.' },
            ]
        ).map((post, i) => `<article class="group cursor-pointer">
          <div class="aspect-[4/3] overflow-hidden rounded-sm mb-5"><img src="${gal[i + 3] ?? gal[0]}" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" referrerpolicy="no-referrer" /></div>
          <h3 class="font-serif text-lg text-stone-900 group-hover:text-amber-900 transition-colors">${post.t}</h3>
          <p class="mt-2 text-sm text-stone-500 font-light">${post.d}</p>
        </article>`).join('')}
      </div>
    </div>`,
  };

  const booking: TemplatePageSection = {
    id: 'reservation',
    type: 'reservation',
    navLabelEs: 'Cita privada',
    navLabelEn: 'Private appointment',
    html: `<div class="bg-[#0a0a0a] rounded-[2rem] py-20 md:py-28 px-6 md:px-16 border border-stone-800/40">
      <div class="max-w-2xl mx-auto text-center">
        <p class="text-[10px] tracking-[0.35em] uppercase text-amber-500/70 mb-4">${es ? 'Experiencia exclusiva' : 'Exclusive experience'}</p>
        <h2 class="text-3xl md:text-4xl font-serif font-light text-stone-100">${es ? 'Reserve su cita privada' : 'Book your private appointment'}</h2>
        <p class="mt-6 text-stone-400 font-light">${es ? 'Asesoramiento personalizado en un entorno reservado. Sin compromiso.' : 'Personal advisory in a private setting. No obligation.'}</p>
        <div class="mt-10 grid sm:grid-cols-2 gap-4 text-left max-w-md mx-auto">
          <div class="cua-glass rounded-sm px-4 py-3 text-sm text-stone-500 border border-stone-800">${es ? 'Nombre completo' : 'Full name'}</div>
          <div class="cua-glass rounded-sm px-4 py-3 text-sm text-stone-500 border border-stone-800">${es ? 'Teléfono' : 'Phone'}</div>
          <div class="cua-glass rounded-sm px-4 py-3 text-sm text-stone-500 border border-stone-800 sm:col-span-2">${es ? 'Fecha preferida' : 'Preferred date'}</div>
          <div class="cua-glass rounded-sm px-4 py-3 text-sm text-stone-500 border border-stone-800 sm:col-span-2 h-24">${es ? 'Motivo de la visita…' : 'Reason for visit…'}</div>
        </div>
        <span class="mt-8 inline-block px-12 py-4 bg-amber-700 text-stone-950 text-xs font-bold tracking-[0.2em] uppercase cursor-pointer">${es ? 'Confirmar cita' : 'Confirm appointment'}</span>
      </div>
    </div>`,
  };

  const contact: TemplatePageSection = {
    id: 'contact',
    type: 'contact',
    navLabelEs: 'Contacto',
    navLabelEn: 'Contact',
    html: `<div class="bg-stone-50 rounded-[2rem] py-20 md:py-28 px-6 md:px-16">
      <div class="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
        <div>
          <h2 class="text-3xl md:text-4xl font-serif font-light text-stone-900">${es ? 'Visítenos' : 'Visit us'}</h2>
          <div class="mt-8 space-y-4 text-stone-600 font-light">
            <p>📍 ${esc(profile ? (es ? profile.addressEs : profile.addressEn) : 'Madrid, España')}</p>
            <p>🕐 ${esc(profile ? (es ? profile.hoursEs : profile.hoursEn) : '')}</p>
            <p>📞 <a href="tel:+34${phoneDigits}" class="text-amber-900">${esc(phone)}</a></p>
            <p>✉ <a href="mailto:${esc(email)}" class="text-amber-900">${esc(email)}</a></p>
          </div>
          <div class="mt-10 rounded-sm overflow-hidden border border-stone-200 aspect-video bg-stone-200 flex items-center justify-center text-stone-400 text-sm">${es ? 'Mapa · Google Maps' : 'Map · Google Maps'}</div>
        </div>
        <div>
          <h3 class="font-serif text-xl text-stone-900 mb-6">${es ? 'Preguntas frecuentes' : 'FAQ'}</h3>
          <div class="space-y-4 mb-10">
            ${faqs.map((f) => `<details class="group border-b border-stone-200 pb-4">
              <summary class="font-medium text-stone-800 cursor-pointer list-none flex justify-between">${f.q}<span class="text-stone-400 group-open:rotate-45 transition-transform">+</span></summary>
              <p class="mt-3 text-sm text-stone-600 font-light leading-relaxed">${f.a}</p>
            </details>`).join('')}
          </div>
          <div class="space-y-3">
            <div class="rounded-sm px-4 py-3 bg-white border border-stone-200 text-sm text-stone-400">${es ? 'Su nombre' : 'Your name'}</div>
            <div class="rounded-sm px-4 py-3 bg-white border border-stone-200 text-sm text-stone-400">${es ? 'Email' : 'Email'}</div>
            <div class="rounded-sm px-4 py-3 bg-white border border-stone-200 text-sm text-stone-400 h-24">${es ? 'Mensaje…' : 'Message…'}</div>
            <span class="block text-center px-8 py-4 bg-stone-900 text-stone-50 text-xs tracking-[0.2em] uppercase cursor-pointer">${es ? 'Enviar mensaje' : 'Send message'}</span>
          </div>
        </div>
      </div>
    </div>`,
  };

  const ctaFinal: TemplatePageSection = {
    id: 'cta',
    type: 'hero',
    navLabelEs: 'Cita',
    navLabelEn: 'Appointment',
    html: `<div class="relative rounded-[2rem] overflow-hidden min-h-[320px] flex items-center justify-center text-center border border-stone-800/30">
      <img src="${gal[0]}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" referrerpolicy="no-referrer" />
      <div class="absolute inset-0 bg-[#0a0a0a]/80"></div>
      <div class="relative z-10 px-8 py-16 max-w-2xl">
        <h2 class="text-3xl md:text-5xl font-serif font-light text-stone-50">${es ? 'Descubra la excelencia' : 'Discover excellence'}</h2>
        <p class="mt-6 text-stone-400 font-light">${es ? 'Reserve una cita privada y viva la experiencia Atelier.' : 'Book a private appointment and live the Atelier experience.'}</p>
        <span class="mt-10 inline-block px-12 py-4 border border-amber-600/60 text-amber-200 text-xs tracking-[0.25em] uppercase cursor-pointer hover:bg-amber-700/20 transition-colors">${es ? 'Reservar cita privada' : 'Book private appointment'}</span>
      </div>
    </div>`,
  };

  const legalLinks = es
    ? ['Aviso Legal', 'Privacidad', 'Cookies', 'RGPD', 'Términos', 'Envíos', 'Devoluciones', 'Accesibilidad', 'Mapa del sitio']
    : ['Legal Notice', 'Privacy', 'Cookies', 'GDPR', 'Terms', 'Shipping', 'Returns', 'Accessibility', 'Sitemap'];

  const footer: TemplatePageSection = {
    id: 'footer',
    type: 'footer',
    navLabelEs: 'Footer',
    navLabelEn: 'Footer',
    html: `<div class="bg-[#0a0a0a] rounded-[2rem] p-10 md:p-16 border border-stone-800/40 text-stone-400">
      <div class="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto">
        <div class="md:col-span-2">
          <div class="font-serif text-xl tracking-[0.15em] uppercase text-stone-100">${esc(name)}</div>
          <p class="mt-4 text-sm font-light leading-relaxed max-w-sm">${es ? 'Joyería y relojería de autor. Excelencia, autenticidad y servicio excepcional desde 1989.' : 'Author jewelry and watchmaking. Excellence, authenticity and exceptional service since 1989.'}</p>
          <div class="mt-6 flex gap-3 text-[10px] tracking-widest uppercase">
            ${['Instagram', 'Facebook', 'LinkedIn'].map((s) => `<span class="cursor-pointer hover:text-amber-400 transition-colors">${s}</span>`).join('')}
          </div>
        </div>
        <div>
          <div class="text-[10px] tracking-[0.25em] uppercase text-stone-500 mb-4">${es ? 'Menú' : 'Menu'}</div>
          <div class="space-y-2 text-sm">${nav.slice(0, 6).map((n) => `<div class="hover:text-stone-200 cursor-pointer">${n}</div>`).join('')}</div>
        </div>
        <div>
          <div class="text-[10px] tracking-[0.25em] uppercase text-stone-500 mb-4">${es ? 'Newsletter' : 'Newsletter'}</div>
          <div class="flex gap-2">
            <div class="flex-1 px-3 py-2 border border-stone-800 rounded-sm text-xs text-stone-600">${es ? 'Su email' : 'Your email'}</div>
            <span class="px-4 py-2 bg-amber-800 text-stone-950 text-[10px] font-bold uppercase cursor-pointer">${es ? 'OK' : 'OK'}</span>
          </div>
        </div>
      </div>
      <div class="mt-12 pt-8 border-t border-stone-800/60 flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] tracking-wider">
        ${legalLinks.map((l) => `<span class="hover:text-amber-500/80 cursor-pointer">${l}</span>`).join('')}
      </div>
      <div class="mt-6 text-center text-[10px] text-stone-600">© ${new Date().getFullYear()} ${esc(name)} · ${es ? 'Todos los derechos reservados' : 'All rights reserved'}</div>
    </div>`,
  };

  const widgets: TemplatePageSection = {
    id: 'widgets',
    type: 'widgets',
    navLabelEs: 'Accesos',
    navLabelEn: 'Shortcuts',
    html: `<div class="relative pointer-events-none">
      ${phoneDigits ? `<a href="https://wa.me/34${phoneDigits}" class="pointer-events-auto fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center text-[10px] font-bold" aria-label="WhatsApp">WA</a>` : ''}
      <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="pointer-events-auto fixed bottom-24 right-6 z-50 w-11 h-11 bg-stone-100 text-stone-900 rounded-full shadow-xl flex items-center justify-center text-sm border border-stone-200" aria-label="${es ? 'Subir' : 'Top'}">↑</button>
    </div>`,
  };

  return [
    hero,
    statsSec,
    about,
    brandsSec,
    categoriesSec,
    products,
    whyUs,
    servicesSec,
    craftsman,
    ...(features.gallery ? [gallerySec] : []),
    ...(features.reviews ? [reviewsSec] : []),
    ...(features.blog ? [blogSec] : []),
    ...(features.reservation ? [booking] : []),
    contact,
    ctaFinal,
    ...(features.legalFooter || features.social ? [footer] : []),
    ...(features.whatsapp || features.scrollUp ? [widgets] : []),
  ];
}
