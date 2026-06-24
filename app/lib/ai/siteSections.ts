import type { TemplateItem } from '../../data/templates';
import type { ParsedIntent, SiteFeatures } from './intentAnalyzer';
import type { ContentPreset } from './siteContent';
import type { TemplatePageSection } from '../templatePages';
import type { ServiceItem } from './siteContent';
import { getBusinessProfile, type BusinessProfile } from './businessProfiles';
import type { ParsedGoogleListing } from './googleListingParser';

const GALLERY_BY_CATEGORY: Record<string, string[]> = {
  gastronomy: [
    'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/6248864/pexels-photo-6248864.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  ],
  services: [
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  ],
  luxury: [
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  ],
  corporate: [
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  ],
  tech: [
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  ],
};

function galleryImages(tpl: TemplateItem, profile: BusinessProfile | null): string[] {
  if (profile) return profile.galleryImages;
  const pool = GALLERY_BY_CATEGORY[tpl.categoryKey] ?? GALLERY_BY_CATEGORY.services;
  return [tpl.image, pool[0], pool[1], pool[2]].filter(Boolean);
}

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function accentBg(accent: 'red' | 'indigo'): string {
  return accent === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700';
}

function buildHero(ctx: BuildCtx): TemplatePageSection {
  const { name, tagline, badge, heroImage, ctaPrimary, ctaSecondary, accent, profile, lang } = ctx;
  const es = lang === 'es';
  const rating = profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : undefined;
  return {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="relative min-h-[520px] md:min-h-[580px] bg-slate-950 text-white overflow-hidden rounded-[2rem] shadow-xl">
      <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover" referrerpolicy="no-referrer" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30"></div>
      <div class="relative z-10 p-10 md:p-20 flex flex-col justify-center min-h-[520px] md:min-h-[580px] max-w-4xl">
        <span class="inline-block w-fit px-4 py-1.5 ${accentBg(accent)} text-white text-xs font-bold tracking-widest uppercase rounded-full">${esc(badge)}</span>
        ${rating ? `<div class="mt-4 inline-flex items-center gap-2 text-amber-400 text-sm font-semibold"><span>★★★★★</span><span class="text-slate-200">${esc(rating)}</span></div>` : ''}
        <h1 class="mt-6 text-4xl md:text-6xl lg:text-7xl font-bold font-serif tracking-tight leading-[1.05] drop-shadow-lg">${esc(name)}</h1>
        <p class="mt-6 text-xl md:text-2xl lg:text-3xl text-slate-100 leading-relaxed max-w-3xl font-light drop-shadow-md">${esc(tagline)}</p>
        <div class="mt-10 flex flex-wrap gap-4">
          <span class="px-8 py-4 ${accentBg(accent)} text-white rounded-2xl text-base font-semibold shadow-lg">${esc(ctaPrimary)}</span>
          <span class="px-8 py-4 border-2 border-white/80 text-white rounded-2xl text-base font-medium">${esc(ctaSecondary)}</span>
        </div>
      </div>
    </div>`,
  };
}

function buildMenu(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const items = profile ? (es ? profile.menuItems.es : profile.menuItems.en) : [];
  const isTattoo = profile?.variant === 'tattoo';
  const title = isTattoo ? (es ? 'Servicios y precios' : 'Services & pricing') : (es ? 'Nuestra Carta' : 'Our Menu');
  const subtitle = isTattoo
    ? (es ? 'Tatuajes, piercings y diseños personalizados. Precios orientativos — consulta en estudio.' : 'Tattoos, piercings and custom designs. Guide prices — ask in studio.')
    : (es ? 'Platos preparados al momento con ingredientes frescos y recetas auténticas.' : 'Dishes prepared to order with fresh ingredients and authentic recipes.');
  const btnAccent = profile?.accent === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700';
  return {
    id: 'menu', type: 'menu', navLabelEs: isTattoo ? 'Servicios' : 'Menú', navLabelEn: isTattoo ? 'Services' : 'Menu',
    html: `<div class="bg-white border border-slate-200 rounded-[2rem] p-10 md:p-16 shadow-sm">
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold font-serif tracking-tight text-slate-900">${title}</h2>
        <p class="mt-4 text-lg text-slate-600">${subtitle}</p>
      </div>
      <div class="mt-12 grid sm:grid-cols-2 lg:grid-cols-${items.length >= 4 ? '4' : '3'} gap-8">
        ${items.map((item) => `<article class="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="aspect-[4/3] overflow-hidden"><img src="${item.image}" alt="${esc(item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" referrerpolicy="no-referrer" /></div>
          <div class="p-6"><h3 class="text-xl font-bold font-serif text-slate-900">${esc(item.title)}</h3>${item.price ? `<p class="mt-2 text-lg font-semibold ${profile?.accent === 'red' ? 'text-red-600' : 'text-indigo-600'}">${esc(item.price)}</p>` : ''}<span class="mt-4 inline-block px-5 py-2.5 ${btnAccent} text-white text-sm font-semibold rounded-xl">${esc(item.cta)}</span></div>
        </article>`).join('')}
      </div>
    </div>`,
  };
}

function buildReviews(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const dark = profile?.variant === 'tattoo';
  const reviews = profile ? (es ? profile.reviews.es : profile.reviews.en) : [
    { name: es ? 'María C.' : 'Maria C.', text: es ? 'Excelente experiencia. Volveremos sin duda.' : 'Excellent experience. We will return.', stars: 5 },
    { name: es ? 'Javier L.' : 'Javier L.', text: es ? 'Producto de calidad y buen precio.' : 'Quality product and fair price.', stars: 5 },
    { name: es ? 'Ana L.' : 'Ana L.', text: es ? 'Local limpio y acogedor.' : 'Clean and cozy place.', stars: 4 },
  ];
  if (dark) {
    return {
      id: 'reviews', type: 'reviews', navLabelEs: 'Reseñas', navLabelEn: 'Reviews',
      html: `<div class="bg-black text-white rounded-[2rem] p-10 md:p-16 border border-zinc-800">
        ${tattooHeading(es ? 'Opiniones de clientes' : 'Client reviews')}
        <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          ${reviews.map((r) => `<div class="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <div class="text-amber-400">${'★'.repeat(r.stars)}</div>
            <p class="mt-4 text-zinc-300 italic leading-relaxed">"${esc(r.text)}"</p>
            <div class="mt-6 font-bold text-white tracking-wide">${esc(r.name)}</div>
          </div>`).join('')}
        </div>
      </div>`,
    };
  }
  return {
    id: 'reviews', type: 'reviews', navLabelEs: 'Reseñas', navLabelEn: 'Reviews',
    html: `<div class="bg-white border border-slate-200 rounded-[2rem] p-10 md:p-16">
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="text-4xl font-bold font-serif tracking-tight text-slate-900">${es ? 'Lo que dicen nuestros clientes' : 'What our customers say'}</h2>
        <p class="mt-3 text-lg text-slate-600">${es ? 'Opiniones reales de quienes nos han visitado.' : 'Real opinions from our visitors.'}</p>
      </div>
      <div class="mt-12 grid md:grid-cols-3 gap-6">
        ${reviews.map((r) => `<div class="bg-slate-50 border border-slate-100 rounded-2xl p-8 shadow-sm">
          <div class="text-amber-400 text-lg">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
          <p class="mt-4 text-base text-slate-700 italic leading-relaxed">"${esc(r.text)}"</p>
          <div class="mt-6 font-bold text-slate-900">${esc(r.name)}</div>
        </div>`).join('')}
      </div>
    </div>`,
  };
}

function buildLocation(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang, name } = ctx;
  const es = lang === 'es';
  const address = profile ? (es ? profile.addressEs : profile.addressEn) : 'Madrid, España';
  const hours = profile ? (es ? profile.hoursEs : profile.hoursEn) : (es ? 'Lun – Dom, 12:00 – 23:00' : 'Mon – Sun, 12:00 – 23:00');
  const info = profile ? (es ? profile.infoEs : profile.infoEn) : '';
  const phone = profile?.phone;
  const phoneDigits = phone?.replace(/\D/g, '') ?? '';
  return {
    id: 'location', type: 'location', navLabelEs: 'Ubicación', navLabelEn: 'Location',
    html: `<div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-10 md:p-16">
      <h2 class="text-4xl font-bold font-serif tracking-tight text-slate-900">${es ? 'Visítanos' : 'Visit us'}</h2>
      <p class="mt-3 text-lg text-slate-600">${es ? `Te esperamos en ${name}, Puente de Vallecas.` : `We look forward to seeing you at ${name}, Puente de Vallecas.`}</p>
      <div class="mt-10 grid md:grid-cols-2 gap-10">
        <div class="space-y-6">
          <div><div class="font-semibold text-slate-900">${es ? 'Dirección' : 'Address'}</div><p class="text-slate-600 mt-1">${esc(address)}</p></div>
          ${phone ? `<div><div class="font-semibold text-slate-900">${es ? 'Teléfono' : 'Phone'}</div><p class="text-slate-600 mt-1"><a href="tel:+34${phoneDigits}" class="text-indigo-600 font-medium">${esc(phone)}</a></p></div>` : ''}
          <div><div class="font-semibold text-slate-900">${es ? 'Horario' : 'Hours'}</div><p class="text-slate-600 mt-1">${esc(hours)}</p></div>
          ${info ? `<div><div class="font-semibold text-slate-900">${es ? 'Información' : 'Info'}</div><p class="text-slate-600 mt-1">${esc(info)}</p></div>` : ''}
        </div>
        <div class="rounded-2xl overflow-hidden border border-slate-200 shadow-md min-h-[280px]">
          <iframe title="${es ? 'Mapa' : 'Map'}" src="https://maps.google.com/maps?q=${encodeURIComponent(address)}&amp;output=embed" class="w-full h-full min-h-[280px] border-0" loading="lazy" referrerpolicy="no-referrer"></iframe>
        </div>
      </div>
    </div>`,
  };
}

function buildServices(ctx: BuildCtx): TemplatePageSection {
  const { services, tagline, lang } = ctx;
  const title = lang === 'es' ? 'Nuestros servicios' : 'Our services';
  return {
    id: 'services', type: 'services', navLabelEs: 'Servicios', navLabelEn: 'Services',
    html: `<div class="bg-white border border-slate-200 rounded-[2rem] p-10 md:p-14">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900">${title}</h2>
      <p class="mt-3 text-slate-600 max-w-2xl">${esc(tagline)}</p>
      <div class="mt-8 grid md:grid-cols-3 gap-5">
        ${services.map((svc) => `<div class="bg-slate-50 border border-slate-100 rounded-2xl p-6">
          <div class="text-sm font-bold text-indigo-600">${esc(svc.title)}</div>
          <p class="mt-2 text-sm text-slate-600">${esc(svc.desc)}</p>
        </div>`).join('')}
      </div>
    </div>`,
  };
}

function buildAbout(ctx: BuildCtx): TemplatePageSection {
  const { name, lang, businessType, profile } = ctx;
  const es = lang === 'es';
  const text = profile?.aboutEs && es
    ? profile.aboutEs
    : profile?.aboutEn && !es
      ? profile.aboutEn
      : es
        ? `${name} nace de la pasión por ofrecer una experiencia excepcional en ${businessType.toLowerCase()}. Nuestro equipo combina tradición, producto de calidad y un servicio cercano para que cada visita sea memorable.`
        : `${name} was born from a passion for delivering an exceptional ${businessType.toLowerCase()} experience. Our team combines tradition, quality products, and warm service to make every visit memorable.`;
  const values = profile?.variant === 'tattoo'
    ? (es ? ['Arte único', 'Higiene total', 'Trato cercano'] : ['Unique art', 'Total hygiene', 'Warm service'])
    : (es ? ['Experiencia', 'Calidad', 'Cercanía'] : ['Experience', 'Quality', 'Closeness']);
  return {
    id: 'about', type: 'about', navLabelEs: 'Sobre nosotros', navLabelEn: 'About us',
    html: `<div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-10 md:p-14">
      <h2 class="text-3xl md:text-4xl font-bold font-serif tracking-tight text-slate-900">${es ? 'Sobre nosotros' : 'About us'}</h2>
      <p class="mt-6 text-slate-600 leading-relaxed max-w-3xl text-lg">${esc(text)}</p>
      <div class="mt-8 grid md:grid-cols-3 gap-4">
        ${values.map((v) =>
          `<div class="bg-white border border-slate-100 rounded-2xl p-5 text-center"><div class="text-2xl font-bold text-indigo-600">${v}</div><p class="text-xs text-slate-500 mt-1">${es ? 'Nuestro valor' : 'Our value'}</p></div>`
        ).join('')}
      </div>
    </div>`,
  };
}

function buildGallery(ctx: BuildCtx): TemplatePageSection {
  const { images, lang } = ctx;
  const es = lang === 'es';
  const title = es ? 'Galería' : 'Gallery';
  const main = images[0];
  return {
    id: 'gallery', type: 'gallery', navLabelEs: 'Galería', navLabelEn: 'Gallery',
    html: `<div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-10 md:p-16">
      <div class="text-center"><h2 class="text-4xl font-bold font-serif tracking-tight text-slate-900">${title}</h2><p class="mt-3 text-lg text-slate-600">${es ? 'Fotografías reales de nuestros platos.' : 'Real photos of our dishes.'}</p></div>
      <div class="mt-10 max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-lg"><img src="${main}" alt="${title}" class="w-full aspect-[16/10] object-cover" loading="lazy" referrerpolicy="no-referrer" /></div>
      <div class="mt-6 grid grid-cols-3 gap-4 max-w-4xl mx-auto">${images.slice(1, 4).map((img) => `<div class="rounded-xl overflow-hidden border border-slate-200 shadow-sm"><img src="${img}" alt="" class="w-full aspect-square object-cover" loading="lazy" referrerpolicy="no-referrer" /></div>`).join('')}</div>
    </div>`,
  };
}

function buildBlog(ctx: BuildCtx): TemplatePageSection {
  const { name, lang } = ctx;
  const es = lang === 'es';
  const posts = es
    ? [
        { title: 'Novedades de temporada en carta', date: '12 Mar 2026', excerpt: 'Descubre los platos de autor que hemos incorporado este mes.' },
        { title: 'Eventos privados y celebraciones', date: '28 Feb 2026', excerpt: 'Organiza tu cena de empresa o celebración familiar con menú a medida.' },
        { title: 'Producto local de kilómetro cero', date: '15 Feb 2026', excerpt: 'Trabajamos con productores de la zona para garantizar frescura y sabor.' },
      ]
    : [
        { title: 'Seasonal menu updates', date: 'Mar 12, 2026', excerpt: 'Discover the signature dishes we added this month.' },
        { title: 'Private events & celebrations', date: 'Feb 28, 2026', excerpt: 'Host your company dinner or family celebration with a bespoke menu.' },
        { title: 'Local farm-to-table produce', date: 'Feb 15, 2026', excerpt: 'We partner with local producers for freshness and flavor.' },
      ];
  return {
    id: 'blog', type: 'blog', navLabelEs: 'Blog', navLabelEn: 'Blog',
    html: `<div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-10 md:p-14">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Blog</h2>
      <p class="mt-2 text-slate-600">${es ? `Noticias y novedades de ${name}` : `News and updates from ${name}`}</p>
      <div class="mt-8 grid md:grid-cols-3 gap-5">
        ${posts.map((p) => `<article class="bg-white border border-slate-100 rounded-2xl p-6">
          <div class="text-xs text-indigo-600 font-semibold">${esc(p.date)}</div>
          <h3 class="mt-2 font-semibold text-slate-900">${esc(p.title)}</h3>
          <p class="mt-2 text-sm text-slate-600">${esc(p.excerpt)}</p>
          <span class="mt-4 inline-block text-sm text-indigo-600 font-medium">${es ? 'Leer más →' : 'Read more →'}</span>
        </article>`).join('')}
      </div>
    </div>`,
  };
}

function buildReservation(ctx: BuildCtx): TemplatePageSection {
  const { lang } = ctx;
  const es = lang === 'es';
  const days = es ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return {
    id: 'reservation', type: 'reservation', navLabelEs: 'Reservas', navLabelEn: 'Booking',
    html: `<div class="bg-white border border-slate-200 rounded-[2rem] p-10 md:p-14">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900">${es ? 'Reserva de mesa' : 'Table booking'}</h2>
      <p class="mt-3 text-slate-600">${es ? 'Selecciona fecha, hora y número de comensales.' : 'Select date, time, and number of guests.'}</p>
      <div class="mt-8 grid md:grid-cols-2 gap-8">
        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-6">
          <div class="text-sm font-bold text-slate-700 mb-4">${es ? 'Calendario' : 'Calendar'}</div>
          <div class="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">${days.map((d) => `<span>${d}</span>`).join('')}</div>
          <div class="grid grid-cols-7 gap-1">
            ${Array.from({ length: 28 }, (_, i) => `<div class="aspect-square flex items-center justify-center text-sm rounded-lg ${i === 14 ? 'bg-indigo-600 text-white font-bold' : i > 4 ? 'hover:bg-indigo-50 text-slate-700' : 'text-slate-300'}">${i > 4 ? i - 4 : ''}</div>`).join('')}
          </div>
        </div>
        <div class="space-y-4">
          <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-500">${es ? 'Nombre completo' : 'Full name'}</div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-500">${es ? 'Teléfono' : 'Phone'}</div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-500">${es ? 'Fecha' : 'Date'}</div>
            <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-500">${es ? 'Hora' : 'Time'}</div>
          </div>
          <div class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-500">${es ? 'Nº comensales' : 'Guests'}</div>
          <div class="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-semibold text-center">${es ? 'Confirmar reserva' : 'Confirm booking'}</div>
        </div>
      </div>
    </div>`,
  };
}

function buildContact(ctx: BuildCtx): TemplatePageSection {
  const { lang, businessType } = ctx;
  const es = lang === 'es';
  const subtitle = es
    ? `¿Tienes alguna pregunta sobre ${businessType.toLowerCase()}? Escríbenos y te responderemos lo antes posible.`
    : `Have a question about our ${businessType.toLowerCase()}? Write to us and we will reply as soon as possible.`;
  return {
    id: 'contact', type: 'contact', navLabelEs: 'Contacto', navLabelEn: 'Contact',
    html: `<div class="bg-white border border-slate-200 rounded-[2rem] p-10 md:p-16 shadow-sm">
      <h2 class="text-4xl font-bold font-serif tracking-tight text-slate-900">${es ? 'Contacto' : 'Contact'}</h2>
      <p class="mt-4 text-lg text-slate-600">${esc(subtitle)}</p>
      <div class="mt-10 grid md:grid-cols-2 gap-4 max-w-2xl">
        <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500">${es ? 'Nombre' : 'Name'}</div>
        <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500">Email</div>
        <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500">${es ? 'Teléfono' : 'Phone'}</div>
        <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500">${es ? 'Asunto' : 'Subject'}</div>
        <div class="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500 h-28">${es ? 'Mensaje' : 'Message'}</div>
        <div class="md:col-span-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-base font-semibold text-center">${es ? 'Enviar mensaje' : 'Send message'}</div>
      </div>
    </div>`,
  };
}

function buildLegalFooter(ctx: BuildCtx): TemplatePageSection {
  const { name, lang, profile } = ctx;
  const es = lang === 'es';
  const year = new Date().getFullYear();
  const blocks = es
    ? [
        { title: 'Aviso Legal', text: `${name} es titular de este sitio web.` },
        { title: 'Política de Privacidad', text: 'Recogemos datos solo para gestionar reservas y consultas.' },
        { title: 'Política de Cookies', text: 'Utilizamos cookies técnicas y analíticas.' },
      ]
    : [
        { title: 'Legal Notice', text: `${name} owns this website.` },
        { title: 'Privacy Policy', text: 'We collect data only for bookings and inquiries.' },
        { title: 'Cookie Policy', text: 'We use technical and analytics cookies.' },
      ];
  const social = profile?.variant === 'kebab' || profile?.variant === 'tattoo';
  const accentText = profile?.accent === 'red' ? 'text-red-500' : 'text-indigo-400';
  const socialBtn = profile?.accent === 'red' ? 'bg-red-600' : 'bg-indigo-600';
  const desc = profile?.variant === 'tattoo'
    ? (es ? 'Estudio de tatuajes, piercings y gemas dentales en Puente de Vallecas. Arte único, sin plantillas genéricas.' : 'Tattoo, piercing and tooth gem studio in Puente de Vallecas. Unique art, no generic flash.')
    : (es ? 'Sabores auténticos, ingredientes frescos y ambiente urbano.' : 'Authentic flavors, fresh ingredients, urban vibe.');
  return {
    id: 'footer', type: 'footer', navLabelEs: 'Footer', navLabelEn: 'Footer',
    html: `<div class="bg-slate-950 text-slate-400 rounded-[2rem] p-10 md:p-16">
      <div class="grid md:grid-cols-3 gap-10">
        <div><h3 class="text-xl font-bold ${accentText}">${esc(name)}</h3><p class="mt-4 text-sm leading-relaxed">${desc}</p>
        ${social ? `<div class="mt-6 flex gap-3"><span class="w-10 h-10 rounded-full ${socialBtn} text-white flex items-center justify-center text-xs font-bold">G</span><span class="w-10 h-10 rounded-full ${socialBtn} text-white flex items-center justify-center text-xs font-bold">📍</span><span class="w-10 h-10 rounded-full ${socialBtn} text-white flex items-center justify-center text-xs font-bold">📞</span></div>` : ''}</div>
        <div><h4 class="text-white font-semibold text-sm uppercase tracking-wider">${es ? 'Navegación' : 'Navigation'}</h4><div class="mt-4 space-y-2 text-sm"><div>${es ? 'Inicio' : 'Home'}</div><div>${es ? 'Menú' : 'Menu'}</div><div>${es ? 'Galería' : 'Gallery'}</div><div>${es ? 'Reseñas' : 'Reviews'}</div><div>${es ? 'Ubicación' : 'Location'}</div></div></div>
        <div><h4 class="text-white font-semibold text-sm uppercase tracking-wider">${es ? 'Legal' : 'Legal'}</h4><div class="mt-4 space-y-3">${blocks.map((b) => `<div><div class="text-white text-sm font-medium">${esc(b.title)}</div><p class="mt-1 text-xs leading-relaxed">${esc(b.text)}</p></div>`).join('')}</div></div>
      </div>
      <div class="mt-10 pt-6 border-t border-slate-800 text-center text-xs">© ${year} ${esc(name)}. ${es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</div>
    </div>`,
  };
}

function buildWidgets(ctx: BuildCtx): TemplatePageSection {
  const { lang, profile } = ctx;
  const es = lang === 'es';
  const phoneDigits = profile?.phone?.replace(/\D/g, '') ?? '722545442';
  return {
    id: 'widgets', type: 'widgets', navLabelEs: 'Accesos', navLabelEn: 'Shortcuts',
    html: `<div class="relative pointer-events-none">
      <a href="https://wa.me/34${phoneDigits}" target="_blank" rel="noopener" class="pointer-events-auto fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center text-xs font-bold" aria-label="WhatsApp">WA</a>
      <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="pointer-events-auto fixed bottom-6 left-6 z-50 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xl flex items-center justify-center text-sm font-bold" aria-label="${es ? 'Subir' : 'Scroll up'}">↑</button>
    </div>`,
  };
}

function tattooHeading(title: string): string {
  return `<div class="text-center mb-12"><h2 class="text-2xl md:text-3xl font-bold tracking-[0.25em] text-white uppercase">${esc(title)}</h2><div class="mt-4 mx-auto h-1 w-14 bg-red-600"></div></div>`;
}

function shortBrand(name: string): string {
  const m = name.match(/Royal Bang/i);
  if (m) return 'ROYAL BANG';
  return name.split(' ').slice(0, 2).join(' ').toUpperCase();
}

function buildTattooHero(ctx: BuildCtx): TemplatePageSection {
  const { heroImage, tagline, ctaPrimary, ctaSecondary, profile, lang } = ctx;
  const es = lang === 'es';
  const brand = shortBrand(ctx.name);
  const rating = profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : '5.0 · 177 reseñas';
  const phoneDigits = profile?.phone?.replace(/\D/g, '') ?? '722545442';
  const [a, b] = brand.includes(' ') ? brand.split(' ') : [brand, ''];
  return {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="bg-black text-white overflow-hidden rounded-[2rem] border border-zinc-800">
      <div class="flex items-center justify-between px-6 md:px-10 py-4 border-b-2 border-red-600">
        <div class="font-bold tracking-[0.2em] text-sm md:text-base"><span class="text-red-600">♛</span> ${esc(a)}${b ? ` <span class="text-red-600">${esc(b)}</span>` : ''}</div>
        <div class="hidden md:flex gap-6 text-xs tracking-[0.15em] uppercase text-zinc-300">
          <span>Inicio</span><span>Nosotros</span><span>Servicios</span><span>Galería</span><span>Reservas</span><span>Contacto</span>
        </div>
      </div>
      <div class="relative min-h-[520px] md:min-h-[600px] flex items-center justify-center text-center">
        <img src="${heroImage}" alt="${esc(ctx.name)}" class="absolute inset-0 w-full h-full object-cover opacity-60" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"></div>
        <div class="relative z-10 px-6 py-16 max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.15em] uppercase drop-shadow-2xl">
            <span class="text-white">${esc(a)}</span>${b ? ` <span class="text-red-600">${esc(b)}</span>` : ''}
          </h1>
          <div class="mt-4 flex items-center justify-center gap-2 text-amber-400 text-sm font-semibold"><span>★★★★★</span><span class="text-zinc-200">${esc(rating ?? '')}</span></div>
          <p class="mt-6 text-lg md:text-2xl text-zinc-200 font-light tracking-wide">${esc(tagline)}</p>
          <div class="mt-10 flex flex-wrap justify-center gap-4">
            <span class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-sm text-sm font-bold tracking-[0.15em] uppercase">${esc(ctaPrimary)}</span>
            <span class="px-8 py-4 border border-white/80 text-white rounded-sm text-sm font-bold tracking-[0.15em] uppercase">📱 ${esc(ctaSecondary)}</span>
          </div>
        </div>
      </div>
      <a href="https://wa.me/34${phoneDigits}" class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-2xl" aria-label="WhatsApp">WA</a>
    </div>`,
  };
}

function buildTattooAbout(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang, images } = ctx;
  const es = lang === 'es';
  const text = es ? profile?.aboutEs : profile?.aboutEn;
  const extra = es
    ? 'Llevamos años especializándonos en tatuajes tradicionales, fotorrealismo, puntillismo y mandalas. Priorizamos la seguridad e higiene con material esterilizado de un solo uso.'
    : 'Years of experience in traditional tattoos, photorealism, dotwork and mandalas. Safety and hygiene first with single-use sterilized materials.';
  return {
    id: 'about', type: 'about', navLabelEs: 'Nosotros', navLabelEn: 'About',
    html: `<div class="bg-black text-white rounded-[2rem] p-10 md:p-16 border border-zinc-800">
      ${tattooHeading(es ? 'Sobre nosotros' : 'About us')}
      <div class="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
        <div class="space-y-5 text-zinc-300 leading-relaxed text-base md:text-lg">
          <p>${esc(text ?? '')}</p>
          <p>${esc(extra)}</p>
          <span class="inline-block mt-4 px-8 py-3 bg-red-600 text-white text-sm font-bold tracking-[0.15em] uppercase rounded-sm">${es ? 'Conócenos' : 'Learn more'}</span>
        </div>
        <div class="rounded-2xl overflow-hidden border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.25)]">
          <img src="${images[1] ?? images[0]}" alt="${es ? 'Tatuaje' : 'Tattoo'}" class="w-full aspect-[4/5] object-cover" loading="lazy" referrerpolicy="no-referrer" />
        </div>
      </div>
    </div>`,
  };
}

const TATTOO_SVC_ES = [
  { title: 'Tatuajes personalizados', desc: 'Diseños únicos: color, negro, línea fina y fotorrealismo 3D.', icon: '🎨' },
  { title: 'Piercings', desc: 'Oreja, nariz, ceja, industriales y más. Material de alta calidad.', icon: '💎' },
  { title: 'Coberturas y retoques', desc: 'Rediseñamos tatuajes antiguos y mantenemos tu arte perfecto.', icon: '🔄' },
  { title: 'Gemas dentales', desc: 'Brillantes y gemas para dientes. Un toque especial para tu sonrisa.', icon: '🦷' },
  { title: 'Estilos especiales', desc: 'Maorí, asiático tradicional, mandalas, puntillismo y mangas.', icon: '🐉' },
  { title: 'Cuidados posteriores', desc: 'Asesoramiento para que tu tatuaje o piercing luzca perfecto.', icon: '❤️' },
];

function buildTattooServices(ctx: BuildCtx): TemplatePageSection {
  const es = ctx.lang === 'es';
  const items = es ? TATTOO_SVC_ES : TATTOO_SVC_ES.map((s) => ({ ...s, title: s.title, desc: s.desc }));
  return {
    id: 'services', type: 'services', navLabelEs: 'Servicios', navLabelEn: 'Services',
    html: `<div class="bg-black text-white rounded-[2rem] p-10 md:p-16 border border-zinc-800">
      ${tattooHeading(es ? 'Nuestros servicios' : 'Our services')}
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        ${items.map((s) => `<div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-red-600/50 transition-colors">
          <div class="text-2xl text-red-600">${s.icon}</div>
          <h3 class="mt-4 text-sm font-bold tracking-[0.12em] uppercase text-white">${esc(s.title)}</h3>
          <p class="mt-3 text-sm text-zinc-400 leading-relaxed">${esc(s.desc)}</p>
        </div>`).join('')}
      </div>
    </div>`,
  };
}

function buildTattooGallery(ctx: BuildCtx): TemplatePageSection {
  const { images, lang } = ctx;
  const es = lang === 'es';
  return {
    id: 'gallery', type: 'gallery', navLabelEs: 'Galería', navLabelEn: 'Gallery',
    html: `<div class="bg-black text-white rounded-[2rem] p-10 md:p-16 border border-zinc-800">
      ${tattooHeading(es ? 'Galería de trabajos' : 'Work gallery')}
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
        ${images.slice(0, 10).map((img, i) => `<div class="rounded-lg overflow-hidden border border-zinc-800 ${i === 0 ? 'col-span-2 row-span-2' : ''}"><img src="${img}" alt="" class="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500" loading="lazy" referrerpolicy="no-referrer" /></div>`).join('')}
      </div>
    </div>`,
  };
}

function buildTattooBooking(ctx: BuildCtx): TemplatePageSection {
  const es = ctx.lang === 'es';
  return {
    id: 'reservation', type: 'reservation', navLabelEs: 'Reservas', navLabelEn: 'Booking',
    html: `<div class="bg-black text-white rounded-[2rem] p-10 md:p-16 border border-zinc-800">
      ${tattooHeading(es ? 'Reserva tu cita' : 'Book your appointment')}
      <div class="max-w-2xl mx-auto border-2 border-red-600 rounded-xl p-8 md:p-10 bg-zinc-950 space-y-5">
        <div><label class="text-xs font-bold tracking-[0.15em] uppercase text-zinc-300">${es ? 'Nombre completo *' : 'Full name *'}</label><div class="mt-2 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-500">${es ? 'Tu nombre' : 'Your name'}</div></div>
        <div class="grid md:grid-cols-2 gap-5">
          <div><label class="text-xs font-bold tracking-[0.15em] uppercase text-zinc-300">${es ? 'Teléfono *' : 'Phone *'}</label><div class="mt-2 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-500">6XX XXX XXX</div></div>
          <div><label class="text-xs font-bold tracking-[0.15em] uppercase text-zinc-300">Email</label><div class="mt-2 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-500">tu@email.com</div></div>
        </div>
        <div><label class="text-xs font-bold tracking-[0.15em] uppercase text-zinc-300">${es ? 'Tipo de servicio *' : 'Service type *'}</label><div class="mt-2 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-500">${es ? 'Selecciona un servicio' : 'Select a service'}</div></div>
        <div><label class="text-xs font-bold tracking-[0.15em] uppercase text-zinc-300">${es ? 'Fecha preferida *' : 'Preferred date *'}</label><div class="mt-2 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-500">dd/mm/aaaa</div></div>
        <div><label class="text-xs font-bold tracking-[0.15em] uppercase text-zinc-300">${es ? 'Descripción de tu idea' : 'Describe your idea'}</label><div class="mt-2 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-500 h-24">${es ? 'Cuéntanos tu idea, tamaño aproximado, zona del cuerpo…' : 'Tell us your idea, approximate size, body area…'}</div></div>
        <div class="px-6 py-4 bg-red-600 text-white text-sm font-bold tracking-[0.15em] uppercase text-center rounded-sm">${es ? '📅 Solicitar reserva' : '📅 Request booking'}</div>
      </div>
    </div>`,
  };
}

function buildTattooContact(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const address = profile ? (es ? profile.addressEs : profile.addressEn) : '';
  const phone = profile?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');
  const hours = profile ? (es ? profile.hoursEs : profile.hoursEn) : '';
  const ig = profile?.instagram ?? '@royalbang_tattoo';
  return {
    id: 'location', type: 'location', navLabelEs: 'Contacto', navLabelEn: 'Contact',
    html: `<div class="bg-black text-white rounded-[2rem] p-10 md:p-16 border border-zinc-800">
      ${tattooHeading(es ? 'Contacto y ubicación' : 'Contact & location')}
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center"><div class="text-red-600 text-xl">📍</div><div class="mt-3 text-xs font-bold tracking-[0.15em] uppercase">${es ? 'Dirección' : 'Address'}</div><p class="mt-3 text-sm text-zinc-400 leading-relaxed">${esc(address)}</p></div>
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center"><div class="text-red-600 text-xl">📞</div><div class="mt-3 text-xs font-bold tracking-[0.15em] uppercase">${es ? 'Teléfono' : 'Phone'}</div><p class="mt-3 text-sm"><a href="tel:+34${phoneDigits}" class="text-white underline">${esc(phone)}</a></p></div>
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center"><div class="text-red-600 text-xl">🕐</div><div class="mt-3 text-xs font-bold tracking-[0.15em] uppercase">${es ? 'Horario' : 'Hours'}</div><p class="mt-3 text-sm text-zinc-400">${esc(hours)}</p></div>
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center"><div class="text-red-600 text-xl">📷</div><div class="mt-3 text-xs font-bold tracking-[0.15em] uppercase">Instagram</div><p class="mt-3 text-sm text-white underline">${esc(ig)}</p></div>
      </div>
      <div class="rounded-2xl overflow-hidden border border-zinc-800 max-w-6xl mx-auto min-h-[300px]">
        <iframe title="Mapa" src="https://maps.google.com/maps?q=${encodeURIComponent(address)}&amp;output=embed" class="w-full min-h-[300px] border-0 grayscale contrast-125" loading="lazy" referrerpolicy="no-referrer"></iframe>
      </div>
    </div>`,
  };
}

function buildTattooFooter(ctx: BuildCtx): TemplatePageSection {
  const { name, lang, profile } = ctx;
  const es = lang === 'es';
  const year = new Date().getFullYear();
  const phone = profile?.phone ?? '';
  const email = profile?.email ?? 'info@royalbangtattoo.com';
  const brand = shortBrand(name);
  return {
    id: 'footer', type: 'footer', navLabelEs: 'Footer', navLabelEn: 'Footer',
    html: `<div class="bg-black text-zinc-400 rounded-[2rem] p-10 md:p-16 border border-zinc-800">
      <div class="grid md:grid-cols-4 gap-10">
        <div><h3 class="text-red-600 font-bold tracking-[0.15em] uppercase">${esc(brand)}</h3><p class="mt-4 text-sm leading-relaxed">${es ? 'Estudio profesional de tatuajes y piercings en Madrid. Arte, calidad e higiene garantizada.' : 'Professional tattoo and piercing studio in Madrid.'}</p>
        <div class="mt-4 flex gap-2"><span class="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs">IG</span><span class="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs">WA</span><span class="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs">✉</span></div></div>
        <div><h4 class="text-red-600 text-xs font-bold tracking-[0.15em] uppercase">${es ? 'Enlaces' : 'Links'}</h4><div class="mt-4 space-y-2 text-sm"><div>Inicio</div><div>Nosotros</div><div>Servicios</div><div>Galería</div><div>Reservas</div></div></div>
        <div><h4 class="text-red-600 text-xs font-bold tracking-[0.15em] uppercase">Legal</h4><div class="mt-4 space-y-2 text-sm underline"><div>Aviso Legal</div><div>Política de Privacidad</div><div>Política de Cookies</div><div>Protección de Datos</div></div></div>
        <div><h4 class="text-red-600 text-xs font-bold tracking-[0.15em] uppercase">Contacto</h4><div class="mt-4 space-y-2 text-sm"><div>📍 C. Alto del León, 8</div><div>📞 ${esc(phone)}</div><div>✉ ${esc(email)}</div></div></div>
      </div>
      <div class="mt-10 pt-6 border-t border-zinc-800 text-center text-xs">© ${year} ${esc(name)}. ${es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</div>
    </div>`,
  };
}

function buildTattooSite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  const sections: TemplatePageSection[] = [buildTattooHero(ctx)];
  if (features.about || ctx.profile?.aboutEs) sections.push(buildTattooAbout(ctx));
  sections.push(buildTattooServices(ctx));
  if (features.gallery) sections.push(buildTattooGallery(ctx));
  if (features.reviews) sections.push(buildReviews(ctx));
  if (features.reservation || features.calendar) sections.push(buildTattooBooking(ctx));
  if (features.location || features.contact) sections.push(buildTattooContact(ctx));
  if (features.legalFooter || features.social) sections.push(buildTattooFooter(ctx));
  if (features.whatsapp || features.scrollUp) sections.push(buildWidgets(ctx));
  return sections;
}

interface BuildCtx {
  name: string;
  businessType: string;
  tagline: string;
  badge: string;
  heroImage: string;
  ctaPrimary: string;
  ctaSecondary: string;
  services: ServiceItem[];
  images: string[];
  lang: 'es' | 'en';
  profile: BusinessProfile | null;
  accent: 'red' | 'indigo';
}

export function buildCustomSite(
  intent: ParsedIntent,
  tpl: TemplateItem,
  preset: ContentPreset,
  lang: 'es' | 'en',
  listing?: ParsedGoogleListing | null
): TemplatePageSection[] {
  const { features } = intent;
  const profile = getBusinessProfile(intent.variant, listing);
  const services = lang === 'es' ? preset.es : preset.en;
  const displayName = listing?.businessName ?? intent.businessName;

  const ctx: BuildCtx = {
    name: displayName,
    businessType: intent.businessType,
    tagline: profile ? (lang === 'es' ? profile.taglineEs : profile.taglineEn) : (lang === 'es' ? preset.taglineEs : preset.taglineEn),
    badge: profile ? (lang === 'es' ? profile.badgeEs : profile.badgeEn) : intent.businessType.toUpperCase(),
    heroImage: profile?.heroImage ?? tpl.image,
    ctaPrimary: profile ? (lang === 'es' ? profile.ctaPrimaryEs : profile.ctaPrimaryEn) : (lang === 'es' ? preset.ctaPrimaryEs : preset.ctaPrimaryEn),
    ctaSecondary: profile ? (lang === 'es' ? profile.ctaSecondaryEs : profile.ctaSecondaryEn) : (lang === 'es' ? preset.ctaSecondaryEs : preset.ctaSecondaryEn),
    services,
    images: galleryImages(tpl, profile),
    lang,
    profile,
    accent: profile?.accent ?? 'indigo',
  };

  if (profile?.variant === 'tattoo') {
    return buildTattooSite(ctx, features);
  }

  const sections: TemplatePageSection[] = [buildHero(ctx)];
  if (features.menu && profile) sections.push(buildMenu(ctx));
  else if (features.services) sections.push(buildServices(ctx));
  if (features.about || profile?.aboutEs) sections.push(buildAbout(ctx));
  if (features.gallery) sections.push(buildGallery(ctx));
  if (features.reviews) sections.push(buildReviews(ctx));
  if (features.location) sections.push(buildLocation(ctx));
  if (features.blog) sections.push(buildBlog(ctx));
  if (features.reservation || features.calendar) sections.push(buildReservation(ctx));
  if (features.contact) sections.push(buildContact(ctx));
  if (features.legalFooter || features.social) sections.push(buildLegalFooter(ctx));
  if (features.whatsapp || features.scrollUp) sections.push(buildWidgets(ctx));

  return sections;
}

export function describeCreatedSections(features: SiteFeatures, lang: 'es' | 'en'): string {
  const labels = lang === 'es'
    ? { hero: 'Inicio', menu: 'Menú', services: 'Servicios', gallery: 'Galería', reviews: 'Reseñas', location: 'Ubicación', about: 'Sobre nosotros', footer: 'Footer legal' }
    : { hero: 'Home', menu: 'Menu', services: 'Services', gallery: 'Gallery', reviews: 'Reviews', location: 'Location', about: 'About', footer: 'Legal footer' };

  const list = [labels.hero];
  if (features.menu) list.push(labels.menu);
  else if (features.services) list.push(labels.services);
  if (features.gallery) list.push(labels.gallery);
  if (features.reviews) list.push(labels.reviews);
  if (features.location) list.push(labels.location);
  if (features.about) list.push(labels.about);
  if (features.legalFooter || features.social) list.push(labels.footer);
  return list.join(', ');
}

export function applyVisualEnhancement(html: string, kind: 'elegante' | 'luminosa' | 'tipografia' | 'animacion' | 'hero'): string {
  let out = html;
  if (kind === 'elegante' || kind === 'tipografia') {
    out = out.replace(/text-3xl/g, 'text-4xl').replace(/text-4xl md:text-6xl/g, 'text-5xl md:text-7xl')
      .replace(/font-semibold/g, 'font-bold font-serif').replace(/rounded-\[2rem\]/g, 'rounded-[2.5rem]');
  }
  if (kind === 'luminosa') {
    const isHero = /min-h-\[520px\]|min-h-\[560px\]|min-h-\[600px\]/.test(out) && out.includes('object-cover');
    if (!isHero) {
      out = out
        .replace(/bg-slate-900 text-white/g, 'bg-white border border-slate-200 text-slate-900')
        .replace(/bg-slate-950 text-slate-400/g, 'bg-slate-50 border border-slate-200 text-slate-600')
        .replace(/text-slate-300/g, 'text-slate-600')
        .replace(/bg-white\/10/g, 'bg-slate-50 border border-slate-200');
    }
    out = out.replace(/bg-slate-50 border border-slate-200 rounded-\[2rem\]/g, 'bg-white border border-slate-100 rounded-[2rem] shadow-sm');
  }
  if (kind === 'animacion') out = out.replace(/class="/g, 'class="transition-all duration-500 hover:scale-[1.01] ');
  if (kind === 'hero') {
    out = out.replace(/min-h-\[420px\]/g, 'min-h-[560px]').replace(/min-h-\[520px\]/g, 'min-h-[600px]')
      .replace(/text-5xl md:text-7xl/g, 'text-6xl md:text-8xl')
      .replace(/HERO MEJORADO|HERO ENHANCED/g, '').replace(/<div class="absolute top-4 right-4 bg-amber-400[^<]*<\/div>/g, '');
  }
  return out.replace(/Laura Mendoza|Fundadora, Atelier|✓ Sección mejorada|✓ Section improved|✓ Cambio aplicado/g, '');
}
