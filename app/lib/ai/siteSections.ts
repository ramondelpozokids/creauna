import type { TemplateItem } from '../../data/templates';
import type { ParsedIntent, SiteFeatures } from './intentAnalyzer';
import type { ContentPreset } from './siteContent';
import type { TemplatePageSection } from '../templatePages';
import type { ServiceItem } from './siteContent';

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

function galleryImages(tpl: TemplateItem): string[] {
  const pool = GALLERY_BY_CATEGORY[tpl.categoryKey] ?? GALLERY_BY_CATEGORY.services;
  return [tpl.image, pool[0], pool[1], pool[2], pool[3], pool[4]].filter(Boolean);
}

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function buildHero(ctx: BuildCtx): TemplatePageSection {
  const { name, businessType, tagline, heroImage, ctaPrimary, ctaSecondary, lang } = ctx;
  return {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="relative min-h-[420px] bg-slate-900 text-white overflow-hidden rounded-[2rem]">
      <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover opacity-50" referrerpolicy="no-referrer" />
      <div class="relative z-10 p-10 md:p-16 flex flex-col justify-end min-h-[420px]">
        <div class="text-xs tracking-[3px] text-slate-300 uppercase">${esc(businessType)}</div>
        <h1 class="text-4xl md:text-6xl font-semibold tracking-tight mt-3 leading-none">${esc(name)}</h1>
        <p class="mt-4 text-lg text-slate-200 max-w-xl">${esc(tagline)}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <span class="px-6 py-3 bg-white text-slate-900 rounded-2xl text-sm font-semibold">${esc(ctaPrimary)}</span>
          <span class="px-6 py-3 border border-white/40 rounded-2xl text-sm">${esc(ctaSecondary)}</span>
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
  const { name, lang, businessType } = ctx;
  const es = lang === 'es';
  const text = es
    ? `${name} nace de la pasión por ofrecer una experiencia excepcional en ${businessType.toLowerCase()}. Nuestro equipo combina tradición, producto de calidad y un servicio cercano para que cada visita sea memorable.`
    : `${name} was born from a passion for delivering an exceptional ${businessType.toLowerCase()} experience. Our team combines tradition, quality products, and warm service to make every visit memorable.`;
  return {
    id: 'about', type: 'about', navLabelEs: 'Sobre nosotros', navLabelEn: 'About us',
    html: `<div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-10 md:p-14">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900">${es ? 'Sobre nosotros' : 'About us'}</h2>
      <p class="mt-6 text-slate-600 leading-relaxed max-w-3xl text-lg">${esc(text)}</p>
      <div class="mt-8 grid md:grid-cols-3 gap-4">
        ${(es ? ['Experiencia', 'Calidad', 'Cercanía'] : ['Experience', 'Quality', 'Closeness']).map((v) =>
          `<div class="bg-white border border-slate-100 rounded-2xl p-5 text-center"><div class="text-2xl font-bold text-indigo-600">${v}</div><p class="text-xs text-slate-500 mt-1">${es ? 'Nuestro valor' : 'Our value'}</p></div>`
        ).join('')}
      </div>
    </div>`,
  };
}

function buildGallery(ctx: BuildCtx): TemplatePageSection {
  const { images, lang } = ctx;
  const title = lang === 'es' ? 'Galería' : 'Gallery';
  return {
    id: 'gallery', type: 'gallery', navLabelEs: 'Galería', navLabelEn: 'Gallery',
    html: `<div class="bg-white border border-slate-200 rounded-[2rem] p-10 md:p-14">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900">${title}</h2>
      <div class="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        ${images.slice(0, 6).map((img) => `<div class="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200">
          <img src="${img}" alt="" class="w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer" />
        </div>`).join('')}
      </div>
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
    html: `<div class="bg-slate-900 text-white rounded-[2rem] p-10 md:p-14">
      <h2 class="text-3xl font-semibold tracking-tight">${es ? 'Contacto' : 'Contact'}</h2>
      <p class="mt-3 text-slate-300">${esc(subtitle)}</p>
      <div class="mt-8 grid md:grid-cols-2 gap-4 max-w-xl">
        <div class="bg-white/10 rounded-xl px-4 py-3 text-sm text-slate-300">${es ? 'Nombre' : 'Name'}</div>
        <div class="bg-white/10 rounded-xl px-4 py-3 text-sm text-slate-300">Email</div>
        <div class="bg-white/10 rounded-xl px-4 py-3 text-sm text-slate-300">${es ? 'Teléfono' : 'Phone'}</div>
        <div class="bg-white/10 rounded-xl px-4 py-3 text-sm text-slate-300">${es ? 'Asunto' : 'Subject'}</div>
        <div class="md:col-span-2 bg-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 h-24">${es ? 'Mensaje' : 'Message'}</div>
        <div class="md:col-span-2 px-6 py-3 bg-indigo-500 text-white rounded-2xl text-sm font-semibold text-center">${es ? 'Enviar mensaje' : 'Send message'}</div>
      </div>
    </div>`,
  };
}

function buildLegalFooter(ctx: BuildCtx): TemplatePageSection {
  const { name, lang } = ctx;
  const es = lang === 'es';
  const year = new Date().getFullYear();
  const blocks = es
    ? [
        { title: 'Aviso Legal', text: `${name} es titular del sitio web. Queda prohibida la reproducción total o parcial sin autorización expresa. Los contenidos tienen carácter informativo.` },
        { title: 'Política de Privacidad', text: 'Recogemos datos personales (nombre, email, teléfono) únicamente para gestionar reservas y consultas. Puedes ejercer tus derechos de acceso, rectificación y supresión contactándonos.' },
        { title: 'Política de Cookies', text: 'Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y cookies analíticas para mejorar la experiencia. Puedes configurar o rechazar cookies no esenciales.' },
        { title: 'Términos y Condiciones', text: 'El uso de este sitio implica la aceptación de estas condiciones. Las reservas están sujetas a disponibilidad y confirmación. Nos reservamos el derecho de modificar la carta y horarios.' },
      ]
    : [
        { title: 'Legal Notice', text: `${name} owns this website. Total or partial reproduction is prohibited without express authorization. Content is for informational purposes.` },
        { title: 'Privacy Policy', text: 'We collect personal data (name, email, phone) solely to manage bookings and inquiries. You may exercise your access, rectification, and deletion rights by contacting us.' },
        { title: 'Cookie Policy', text: 'We use essential technical cookies and analytics cookies to improve the experience. You can configure or reject non-essential cookies.' },
        { title: 'Terms & Conditions', text: 'Using this site implies acceptance of these terms. Bookings are subject to availability and confirmation. We reserve the right to modify the menu and hours.' },
      ];
  return {
    id: 'footer', type: 'footer', navLabelEs: 'Legal', navLabelEn: 'Legal',
    html: `<div class="bg-slate-950 text-slate-400 rounded-[2rem] p-10 md:p-14">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        ${blocks.map((b) => `<div>
          <h3 class="text-white font-semibold text-sm">${esc(b.title)}</h3>
          <p class="mt-3 text-xs leading-relaxed">${esc(b.text)}</p>
        </div>`).join('')}
      </div>
      <div class="mt-10 pt-6 border-t border-slate-800 flex flex-wrap justify-between gap-4 text-xs">
        <span>© ${year} ${esc(name)}. ${es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</span>
        <div class="flex gap-4">
          ${blocks.map((b) => `<span class="hover:text-white">${esc(b.title)}</span>`).join('')}
        </div>
      </div>
    </div>`,
  };
}

function buildWidgets(ctx: BuildCtx): TemplatePageSection {
  const { lang } = ctx;
  const es = lang === 'es';
  return {
    id: 'widgets', type: 'widgets', navLabelEs: 'Accesos', navLabelEn: 'Shortcuts',
    html: `<div class="relative pointer-events-none">
      <a href="https://wa.me/34600000000" target="_blank" rel="noopener" class="pointer-events-auto fixed bottom-24 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center text-xs font-bold" aria-label="WhatsApp">WA</a>
      <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="pointer-events-auto fixed bottom-6 right-6 z-50 w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-xl flex items-center justify-center text-lg font-bold" aria-label="${es ? 'Subir' : 'Scroll up'}">↑</button>
    </div>`,
  };
}

interface BuildCtx {
  name: string;
  businessType: string;
  tagline: string;
  heroImage: string;
  ctaPrimary: string;
  ctaSecondary: string;
  services: ServiceItem[];
  images: string[];
  lang: 'es' | 'en';
}

export function buildCustomSite(
  intent: ParsedIntent,
  tpl: TemplateItem,
  preset: ContentPreset,
  lang: 'es' | 'en'
): TemplatePageSection[] {
  const { features } = intent;
  const services = lang === 'es' ? preset.es : preset.en;

  const ctx: BuildCtx = {
    name: intent.businessName,
    businessType: intent.businessType,
    tagline: lang === 'es' ? preset.taglineEs : preset.taglineEn,
    heroImage: tpl.image,
    ctaPrimary: lang === 'es' ? preset.ctaPrimaryEs : preset.ctaPrimaryEn,
    ctaSecondary: lang === 'es' ? preset.ctaSecondaryEs : preset.ctaSecondaryEn,
    services,
    images: galleryImages(tpl),
    lang,
  };

  const sections: TemplatePageSection[] = [buildHero(ctx)];

  if (features.services) sections.push(buildServices(ctx));
  if (features.about) sections.push(buildAbout(ctx));
  if (features.gallery) sections.push(buildGallery(ctx));
  if (features.blog) sections.push(buildBlog(ctx));
  if (features.reservation || features.calendar) sections.push(buildReservation(ctx));
  if (features.contact) sections.push(buildContact(ctx));
  if (features.legalFooter) sections.push(buildLegalFooter(ctx));
  if (features.whatsapp || features.scrollUp) sections.push(buildWidgets(ctx));

  return sections;
}

export function describeCreatedSections(features: SiteFeatures, lang: 'es' | 'en'): string {
  const labels = lang === 'es'
    ? { hero: 'Inicio', services: 'Servicios', about: 'Sobre nosotros', gallery: 'Galería', blog: 'Blog', reservation: 'Reservas', contact: 'Contacto', footer: 'Footer legal', widgets: 'WhatsApp y scroll up' }
    : { hero: 'Home', services: 'Services', about: 'About us', gallery: 'Gallery', blog: 'Blog', reservation: 'Booking', contact: 'Contact', footer: 'Legal footer', widgets: 'WhatsApp & scroll up' };

  const list = [labels.hero];
  if (features.services) list.push(labels.services);
  if (features.about) list.push(labels.about);
  if (features.gallery) list.push(labels.gallery);
  if (features.blog) list.push(labels.blog);
  if (features.reservation || features.calendar) list.push(labels.reservation);
  if (features.contact) list.push(labels.contact);
  if (features.legalFooter) list.push(labels.footer);
  if (features.whatsapp || features.scrollUp) list.push(labels.widgets);

  return list.join(', ');
}
