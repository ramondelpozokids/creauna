import type { TemplateItem } from '../../data/templates';
import type { ParsedIntent, SiteFeatures } from './intentAnalyzer';
import type { ContentPreset } from './siteContent';
import type { TemplatePageSection } from '../templatePages';
import type { ServiceItem } from './siteContent';
import { getBusinessProfile, type AccentColor, type BusinessProfile } from './businessProfiles';
import type { ParsedGoogleListing } from './googleListingParser';
import { IMAGE_BANK } from './imageBank';

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

function accentBg(accent: AccentColor): string {
  const map: Record<string, string> = {
    red: 'bg-red-600 hover:bg-red-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    gold: 'bg-amber-700 hover:bg-amber-600',
    blue: 'bg-blue-800 hover:bg-blue-900',
    rose: 'bg-rose-400 hover:bg-rose-500',
  };
  return map[accent] ?? map.indigo;
}

function premiumWidgets(ctx: BuildCtx, dark = false): TemplatePageSection {
  const es = ctx.lang === 'es';
  const phone = ctx.profile?.phone?.replace(/\D/g, '') ?? '';
  return {
    id: 'widgets', type: 'widgets', navLabelEs: 'Accesos', navLabelEn: 'Shortcuts',
    html: `<div class="relative pointer-events-none">
      ${phone ? `<a href="https://wa.me/34${phone}" class="pointer-events-auto fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center text-xs font-bold animate-pulse" aria-label="WhatsApp">WA</a>` : ''}
      <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="pointer-events-auto fixed ${phone ? 'bottom-24' : 'bottom-6'} right-6 z-50 w-11 h-11 ${dark ? 'bg-white text-stone-900' : 'bg-stone-950 text-white'} hover:opacity-80 rounded-full shadow-xl flex items-center justify-center text-sm" aria-label="${es ? 'Subir' : 'Scroll up'}">↑</button>
    </div>`,
  };
}

function sectionHead(title: string, subtitle?: string, accentClass = 'bg-orange-700/80'): string {
  return `<div class="text-center mb-14">
    <h2 class="text-3xl md:text-4xl font-bold font-serif text-stone-900 tracking-tight">${esc(title)}</h2>
    ${subtitle ? `<p class="mt-3 text-stone-500 text-base md:text-lg max-w-2xl mx-auto">${esc(subtitle)}</p>` : ''}
    <div class="mt-5 mx-auto h-0.5 w-16 ${accentClass}"></div>
  </div>`;
}

function buildBeautySite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  const { name, heroImage, tagline, profile, lang, images, ctaPrimary, ctaSecondary } = ctx;
  const es = lang === 'es';
  const rating = profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : '';
  const phone = profile?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');
  const items = profile ? (es ? profile.menuItems.es : profile.menuItems.en) : [];
  const reviews = profile ? (es ? profile.reviews.es : profile.reviews.en) : [];
  const initials = (n: string) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const hero: TemplatePageSection = {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="bg-[#FDF8F3] overflow-hidden rounded-[2rem] shadow-xl border border-stone-100">
      <div class="flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-5 border-b border-stone-100/80 bg-white/90">
        <div class="font-serif font-semibold text-xl text-stone-900">${esc(name)}</div>
        <div class="hidden md:flex gap-8 text-[11px] tracking-[0.2em] uppercase text-stone-500 font-medium">
          ${(es ? ['Inicio', 'Servicios', 'Galería', 'Reservas', 'Contacto'] : ['Home', 'Services', 'Gallery', 'Booking', 'Contact']).map((n) => `<span>${n}</span>`).join('')}
        </div>
        ${phone ? `<span class="text-sm font-medium text-rose-500">📞 <a href="tel:+34${phoneDigits}">${esc(phone)}</a></span>` : ''}
      </div>
      <div class="relative min-h-[480px] flex items-center justify-center text-center">
        <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/50 to-stone-950/70"></div>
        <div class="relative z-10 px-6 py-16 max-w-3xl mx-auto">
          <p class="text-rose-300 text-lg md:text-xl font-serif italic">${esc(tagline)}</p>
          <h1 class="mt-4 text-5xl md:text-6xl font-bold font-serif text-white tracking-tight">${esc(name)}</h1>
          ${rating ? `<div class="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur rounded-full border border-white/20"><span class="text-amber-400 text-sm">★★★★★</span><span class="text-white/90 text-sm">${esc(rating)}</span></div>` : ''}
          <div class="mt-10 flex flex-wrap justify-center gap-4">
            <span class="px-10 py-4 bg-rose-400 hover:bg-rose-500 text-white rounded-full text-sm font-bold tracking-wide uppercase shadow-lg">${esc(ctaPrimary)}</span>
            <span class="px-10 py-4 bg-white/90 text-stone-900 rounded-full text-sm font-bold tracking-wide uppercase shadow-lg">${esc(ctaSecondary)}</span>
          </div>
        </div>
      </div>
    </div>`,
  };

  const services: TemplatePageSection = {
    id: 'menu', type: 'menu', navLabelEs: 'Servicios', navLabelEn: 'Services',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-stone-100 shadow-sm">
      ${sectionHead(es ? 'Nuestros Servicios' : 'Our Services', es ? 'Tratamientos premium con productos de primera calidad' : 'Premium treatments with top-quality products', 'bg-rose-400')}
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        ${items.map((item) => `<article class="group bg-[#FDF8F3] rounded-2xl overflow-hidden border border-stone-100 hover:shadow-lg transition-all hover:-translate-y-1">
          <div class="aspect-[4/3] overflow-hidden"><img src="${item.image}" alt="${esc(item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" referrerpolicy="no-referrer" /></div>
          <div class="p-6"><h3 class="font-serif font-bold text-stone-900 text-lg">${esc(item.title)}</h3>${item.price ? `<p class="mt-2 text-rose-500 font-semibold">${esc(item.price)}</p>` : ''}<span class="mt-4 inline-block text-xs font-bold tracking-widest uppercase text-rose-500">${esc(item.cta)} →</span></div>
        </article>`).join('')}
      </div>
    </div>`,
  };

  const about: TemplatePageSection = {
    id: 'about', type: 'about', navLabelEs: 'Nosotros', navLabelEn: 'About',
    html: `<div class="bg-[#FDF8F3] rounded-[2rem] p-10 md:p-16 border border-stone-100">
      ${sectionHead(es ? 'Tu belleza, nuestra pasión' : 'Your beauty, our passion', profile ? (es ? profile.aboutEs : profile.aboutEn) : '', 'bg-rose-400')}
      <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-4">
        ${(es ? ['Estilistas expertos', 'Productos premium', 'Ambiente de lujo'] : ['Expert stylists', 'Premium products', 'Luxury atmosphere']).map((v) => `<div class="bg-white rounded-xl p-8 text-center shadow-sm border border-stone-100"><div class="text-2xl mb-3">✨</div><div class="font-serif font-bold text-stone-900">${v}</div></div>`).join('')}
      </div>
    </div>`,
  };

  const gallery: TemplatePageSection = {
    id: 'gallery', type: 'gallery', navLabelEs: 'Galería', navLabelEn: 'Gallery',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-stone-100">
      ${sectionHead(es ? 'Galería' : 'Gallery', es ? 'Inspiración, estilo y resultados reales' : 'Inspiration, style and real results', 'bg-rose-400')}
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        ${images.slice(0, 6).map((img) => `<div class="rounded-xl overflow-hidden shadow-md aspect-square"><img src="${img}" alt="" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" referrerpolicy="no-referrer" /></div>`).join('')}
      </div>
    </div>`,
  };

  const reviewsSec: TemplatePageSection = {
    id: 'reviews', type: 'reviews', navLabelEs: 'Reseñas', navLabelEn: 'Reviews',
    html: `<div class="bg-[#FDF8F3] rounded-[2rem] p-10 md:p-16 border border-stone-100">
      ${sectionHead(es ? 'Reseñas' : 'Reviews', es ? 'Lo que dicen nuestras clientas' : 'What our clients say', 'bg-rose-400')}
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${reviews.map((r) => `<div class="bg-white rounded-xl p-8 shadow-sm border-l-4 border-rose-400">
          <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center text-xs font-bold">${initials(r.name)}</div><div class="font-serif font-bold text-stone-900 text-sm">${esc(r.name)}</div></div>
          <div class="mt-3 text-amber-500 text-xs">${'★'.repeat(r.stars)}</div>
          <p class="mt-4 text-stone-600 text-sm italic leading-relaxed">"${esc(r.text)}"</p>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const booking: TemplatePageSection = {
    id: 'reservation', type: 'reservation', navLabelEs: 'Reservas', navLabelEn: 'Booking',
    html: `<div class="bg-white rounded-[2rem] overflow-hidden border border-stone-200 shadow-lg max-w-5xl mx-auto">
      <div class="grid md:grid-cols-2">
        <div class="bg-stone-900 text-white p-10 md:p-12 flex flex-col justify-center">
          <h2 class="text-3xl font-serif font-bold">${es ? 'Reserva tu cita' : 'Book your appointment'}</h2>
          <p class="mt-4 text-stone-400 text-sm">${es ? 'Elige fecha y servicio. Confirmación inmediata.' : 'Pick date and service. Instant confirmation.'}</p>
          <ul class="mt-8 space-y-3 text-sm text-stone-300">${(es ? ['Confirmación inmediata', 'Cancelación gratuita 24h antes', 'Estilistas certificados'] : ['Instant confirmation', 'Free cancellation 24h before', 'Certified stylists']).map((b) => `<li>✅ ${b}</li>`).join('')}</ul>
        </div>
        <div class="p-10 md:p-12 space-y-5">
          <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Servicio' : 'Service'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">${es ? 'Seleccionar' : 'Select'}</div></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Fecha' : 'Date'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">dd/mm/aaaa</div></div>
            <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Hora' : 'Time'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">${es ? 'Seleccionar' : 'Select'}</div></div>
          </div>
          <div class="px-6 py-4 bg-rose-400 text-white font-serif font-bold text-center rounded-full">${es ? 'Confirmar cita' : 'Confirm booking'}</div>
        </div>
      </div>
    </div>`,
  };

  const contact: TemplatePageSection = {
    id: 'location', type: 'location', navLabelEs: 'Contacto', navLabelEn: 'Contact',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-stone-100">
      <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 class="text-3xl font-serif font-bold text-stone-900">${es ? 'Visítanos' : 'Visit us'}</h2>
          <p class="mt-4 text-stone-600">${esc(profile ? (es ? profile.addressEs : profile.addressEn) : '')}</p>
          <p class="mt-2 text-stone-500 text-sm">${esc(profile ? (es ? profile.hoursEs : profile.hoursEn) : '')}</p>
          ${phone ? `<p class="mt-4 text-rose-500 font-semibold">📞 ${esc(phone)}</p>` : ''}
        </div>
        <div class="rounded-xl overflow-hidden border border-stone-200 min-h-[220px]">
          <iframe title="Mapa" src="https://maps.google.com/maps?q=${encodeURIComponent(profile ? (es ? profile.addressEs : profile.addressEn) : 'Madrid')}&amp;output=embed" class="w-full min-h-[220px] border-0" loading="lazy" referrerpolicy="no-referrer"></iframe>
        </div>
      </div>
    </div>`,
  };

  const footer: TemplatePageSection = {
    id: 'footer', type: 'footer', navLabelEs: 'Footer', navLabelEn: 'Footer',
    html: `<div class="bg-stone-900 text-stone-400 rounded-[2rem] p-10 md:p-14">
      <div class="text-center"><h3 class="text-white font-serif font-bold text-xl">${esc(name)}</h3><p class="mt-3 text-sm">© ${new Date().getFullYear()} ${esc(name)}. ${es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p></div>
    </div>`,
  };

  return [
    hero, services, about,
    ...(features.gallery ? [gallery] : []),
    ...(features.reviews ? [reviewsSec] : []),
    ...(features.reservation || features.calendar ? [booking] : []),
    ...(features.location || features.contact ? [contact] : []),
    ...(features.legalFooter || features.social ? [footer] : []),
    premiumWidgets(ctx),
  ];
}

function buildCorporateLegalFooter(ctx: BuildCtx): TemplatePageSection {
  const { name, lang, profile } = ctx;
  const es = lang === 'es';
  const year = new Date().getFullYear();
  const email = profile?.email ?? 'info@example.com';
  const address = profile ? (es ? profile.addressEs : profile.addressEn) : 'Madrid, España';
  const blocks = es
    ? [
        { title: 'Aviso Legal', text: `${name} es titular de este sitio web. Los contenidos tienen carácter informativo y no sustituyen el asesoramiento profesional personalizado.` },
        { title: 'Política de Privacidad', text: `Tratamos tus datos (nombre, email, teléfono y documentación adjunta) únicamente para gestionar consultas, prestación de servicios de asesoría y obligaciones legales. Responsable: ${name}. Contacto: ${email}. Puedes ejercer tus derechos de acceso, rectificación y supresión.` },
        { title: 'Política de Cookies', text: 'Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y cookies analíticas anonimizadas para mejorar la experiencia. Puedes configurar o rechazar las no esenciales desde el banner de cookies.' },
      ]
    : [
        { title: 'Legal Notice', text: `${name} owns this website. Content is for information only and does not replace personalized professional advice.` },
        { title: 'Privacy Policy', text: `We process your data (name, email, phone and attached documents) only to manage enquiries, advisory services and legal obligations. Controller: ${name}. Contact: ${email}.` },
        { title: 'Cookie Policy', text: 'We use essential technical cookies and anonymized analytics cookies. You can configure or reject non-essential cookies from the cookie banner.' },
      ];
  return {
    id: 'footer', type: 'footer', navLabelEs: 'Footer', navLabelEn: 'Footer',
    html: `<div class="bg-blue-950 text-stone-400 rounded-[2rem] p-10 md:p-14">
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div><h3 class="text-white font-bold text-lg">${esc(name)}</h3><p class="mt-3 text-sm leading-relaxed">${esc(profile ? (es ? profile.aboutEs : profile.aboutEn).slice(0, 140) : '')}</p><p class="mt-2 text-xs">📍 ${esc(address)}</p></div>
        <div><h4 class="text-emerald-400 text-xs font-bold tracking-widest uppercase">${es ? 'Navegación' : 'Navigation'}</h4><div class="mt-3 space-y-1 text-sm">${(es ? ['Inicio', 'Servicios', 'Nosotros', 'Contacto', 'Ubicación'] : ['Home', 'Services', 'About', 'Contact', 'Location']).map((l) => `<div>${l}</div>`).join('')}</div></div>
        <div><h4 class="text-emerald-400 text-xs font-bold tracking-widest uppercase">${es ? 'Legal' : 'Legal'}</h4><div class="mt-3 space-y-3">${blocks.map((b) => `<div><div class="text-white text-sm font-medium">${esc(b.title)}</div><p class="mt-1 text-xs leading-relaxed">${esc(b.text)}</p></div>`).join('')}</div></div>
      </div>
      <div class="mt-8 pt-6 border-t border-blue-900 text-center text-xs">© ${year} ${esc(name)}. ${es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</div>
    </div>`,
  };
}

function buildDocumentUploadSection(ctx: BuildCtx): TemplatePageSection {
  const { lang, name } = ctx;
  const es = lang === 'es';
  return {
    id: 'documents', type: 'contact', navLabelEs: 'Documentos', navLabelEn: 'Documents',
    html: `<div class="bg-gradient-to-br from-violet-50 to-emerald-50 rounded-[2rem] p-10 md:p-16 border border-violet-100 max-w-5xl mx-auto">
      <div class="text-center mb-10">
        <span class="inline-block px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-full">🔒 ${es ? 'Envío seguro' : 'Secure upload'}</span>
        <h2 class="mt-4 text-3xl font-bold text-violet-900">${es ? 'Enviar documentación encriptada' : 'Send encrypted documents'}</h2>
        <p class="mt-3 text-stone-600 max-w-xl mx-auto">${es ? `Transfiere nóminas, facturas o modelos fiscales a ${name} con cifrado extremo a extremo.` : `Transfer payroll, invoices or tax forms to ${name} with end-to-end encryption.`}</p>
      </div>
      <div class="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div class="border-2 border-dashed border-violet-300 rounded-xl p-8 text-center bg-white/80">
          <div class="text-4xl">📄</div>
          <p class="mt-3 text-sm text-stone-600">${es ? 'Arrastra archivos PDF, Excel o ZIP' : 'Drag PDF, Excel or ZIP files'}</p>
          <span class="mt-4 inline-block px-5 py-2 bg-violet-600 text-white text-sm font-bold rounded-lg">${es ? 'Seleccionar archivos' : 'Select files'}</span>
        </div>
        <div class="space-y-4">
          <div class="border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">${es ? 'Referencia / NIF' : 'Reference / Tax ID'}</div>
          <div class="border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">${es ? 'Email de confirmación' : 'Confirmation email'}</div>
          <div class="px-6 py-4 bg-emerald-600 text-white font-bold text-center rounded-lg">${es ? 'Enviar con cifrado AES-256' : 'Send with AES-256 encryption'}</div>
        </div>
      </div>
    </div>`,
  };
}

function buildCorporateSidebar(ctx: BuildCtx): TemplatePageSection {
  const { name, lang, profile } = ctx;
  const es = lang === 'es';
  const phone = profile?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');
  const links = es
    ? ['Inicio', 'Servicios', 'Nosotros', 'Galería', 'Contacto', 'Ubicación']
    : ['Home', 'Services', 'About', 'Gallery', 'Contact', 'Location'];
  return {
    id: 'sidebar', type: 'about', navLabelEs: 'Menú lateral', navLabelEn: 'Sidebar',
    html: `<div class="bg-white rounded-[2rem] border border-stone-100 shadow-sm p-6 md:p-8 max-w-5xl mx-auto">
      <div class="flex flex-col md:flex-row gap-8">
        <aside class="md:w-56 shrink-0 md:sticky md:top-4 self-start bg-gradient-to-b from-blue-900 to-violet-800 text-white rounded-xl p-6">
          <div class="font-bold text-lg">${esc(name)}</div>
          <nav class="mt-6 space-y-2 text-sm">${links.map((l) => `<div class="py-1.5 px-2 rounded hover:bg-white/10 cursor-pointer">${l}</div>`).join('')}</nav>
          ${phone ? `<a href="tel:+34${phoneDigits}" class="mt-6 block text-emerald-300 text-sm font-semibold">📞 ${esc(phone)}</a>` : ''}
          ${profile?.email ? `<div class="mt-2 text-blue-200 text-xs">${esc(profile.email)}</div>` : ''}
        </aside>
        <div class="flex-1 text-stone-600 text-sm leading-relaxed">
          <h3 class="text-xl font-bold text-blue-900">${es ? 'Acceso rápido' : 'Quick access'}</h3>
          <p class="mt-3">${es ? 'Desde el menú lateral puedes saltar a servicios, contacto, ubicación y envío seguro de documentos.' : 'Use the sidebar to jump to services, contact, location and secure document upload.'}</p>
        </div>
      </div>
    </div>`,
  };
}

function buildRenewableEnergySite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  const { name, heroImage, tagline, profile, lang, ctaPrimary, ctaSecondary, images } = ctx;
  const es = lang === 'es';
  const phone = profile?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');
  const items = profile ? (es ? profile.menuItems.es : profile.menuItems.en) : [];
  const reviews = profile ? (es ? profile.reviews.es : profile.reviews.en) : [];
  const aboutText = profile ? (es ? profile.aboutEs : profile.aboutEn) : '';
  const gridBg = 'bg-[#f8faf9] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px]';

  const hero: TemplatePageSection = {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="overflow-hidden rounded-[2rem] shadow-xl border border-slate-200">
      <nav class="bg-slate-950/95 backdrop-blur flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-4 text-white" aria-label="${es ? 'Navegación' : 'Navigation'}">
        <div class="font-bold text-xl tracking-tight">${esc(name)}</div>
        <div class="hidden lg:flex gap-8 text-[11px] tracking-widest uppercase text-slate-300 font-medium">
          ${(es ? ['Inicio', 'Servicios', 'Proyectos', 'Proceso', 'Contacto'] : ['Home', 'Services', 'Projects', 'Process', 'Contact']).map((n) => `<span>${n}</span>`).join('')}
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden sm:inline-flex items-center gap-2 text-xs text-emerald-400"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>24/7</span>
          <span class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg">${esc(ctaPrimary)}</span>
        </div>
      </nav>
      <div class="relative min-h-[520px] md:min-h-[600px] flex items-center justify-center text-center">
        <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover" loading="eager" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90"></div>
        <div class="relative z-10 px-6 py-16 max-w-4xl mx-auto">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold rounded-full mb-6">${es ? 'Energía limpia · Autoconsumo · EV' : 'Clean energy · Self-consumption · EV'}</span>
          <h1 class="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">${es ? 'Impulsamos el futuro con energía limpia' : 'Powering the future with clean energy'}</h1>
          <p class="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">${esc(tagline)}</p>
          <div class="mt-10 flex flex-wrap justify-center gap-4">
            <span class="px-8 py-4 bg-emerald-500 text-slate-950 rounded-lg font-bold text-sm shadow-lg">${esc(ctaPrimary)}</span>
            <span class="px-8 py-4 border-2 border-white/60 text-white rounded-lg font-semibold text-sm">${esc(ctaSecondary)}</span>
          </div>
          <p class="mt-8 text-[10px] md:text-xs tracking-[0.25em] uppercase text-slate-400">WALLBOX · TESLA · CERTIFICADO · DG INDUSTRIA · CAE</p>
        </div>
      </div>
    </div>`,
  };

  const stats: TemplatePageSection = {
    id: 'stats', type: 'about', navLabelEs: 'Confianza', navLabelEn: 'Trust',
    html: `<div class="${gridBg} rounded-[2rem] p-10 md:p-14 border border-slate-200">
      <p class="text-center text-xs tracking-[0.2em] uppercase text-emerald-600 font-semibold mb-3">${es ? 'Nuestro impacto' : 'Our impact'}</p>
      <h2 class="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-10">${es ? 'Resultados que hablan por sí solos' : 'Results that speak for themselves'}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-0 max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        ${[
          { v: '20+', l: es ? 'Años de experiencia' : 'Years of experience' },
          { v: '180+', l: es ? 'Proyectos realizados' : 'Projects completed' },
          { v: '12 MW', l: es ? 'Potencia instalada' : 'Installed capacity' },
          { v: '4,9 ★', l: es ? 'Valoración clientes' : 'Client rating' },
        ].map((s, i) => `<div class="p-6 md:p-8 text-center ${i < 3 ? 'border-r border-slate-100' : ''}">
          <div class="text-3xl md:text-4xl font-bold text-emerald-600">${s.v}</div>
          <div class="mt-2 text-[10px] md:text-xs uppercase tracking-wider text-slate-500 font-medium">${s.l}</div>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const services: TemplatePageSection = {
    id: 'services', type: 'services', navLabelEs: 'Servicios', navLabelEn: 'Services',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-slate-100 shadow-sm">
      <p class="text-xs tracking-[0.2em] uppercase text-emerald-600 font-semibold mb-2">— ${es ? 'Áreas de actuación' : 'Areas of expertise'} —</p>
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900">${es ? 'Lo que resolvemos por ti' : 'What we solve for you'}</h2>
      <p class="mt-3 text-slate-500 max-w-2xl">${es ? 'Soluciones integrales en solar, almacenamiento, movilidad eléctrica y eficiencia energética.' : 'Integrated solutions in solar, storage, electric mobility and energy efficiency.'}</p>
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        ${items.map((item) => `<div class="group relative rounded-2xl overflow-hidden min-h-[220px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
          <img src="${item.image}" alt="${esc(item.title)}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" referrerpolicy="no-referrer" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
          <div class="relative z-10 p-5 flex flex-col justify-end min-h-[220px]">
            <h3 class="font-bold text-white text-sm leading-snug">${esc(item.title)}</h3>
            <p class="mt-1 text-[11px] text-slate-300">${esc(item.price ?? '')}</p>
          </div>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const whyUs: TemplatePageSection = {
    id: 'why', type: 'about', navLabelEs: 'Ventajas', navLabelEn: 'Benefits',
    html: `<div class="${gridBg} rounded-[2rem] p-10 md:p-16 border border-slate-200">
      <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
        <div class="rounded-2xl overflow-hidden shadow-lg"><img src="${images[0] ?? heroImage}" alt="" class="w-full aspect-[4/3] object-cover" loading="lazy" referrerpolicy="no-referrer" /></div>
        <div>
          <p class="text-xs tracking-[0.2em] uppercase text-emerald-600 font-semibold mb-2">— ${es ? 'Por qué elegirnos' : 'Why choose us'} —</p>
          <h2 class="text-3xl font-bold text-slate-900">${es ? 'Los beneficios de colaborar con nosotros' : 'Benefits of working with us'}</h2>
          <p class="mt-4 text-slate-600 leading-relaxed">${esc(aboutText ?? '')}</p>
          <div class="mt-8 space-y-4">${(es ? ['Estudio personalizado sin compromiso', 'Ingeniería e instalación certificada', 'Financiación y gestión de subvenciones', 'Monitorización y soporte técnico 24/7'] : ['Free personalized assessment', 'Certified engineering & installation', 'Financing and subsidy management', 'Monitoring and 24/7 technical support']).map((f, i) => `<div class="flex gap-4"><span class="text-2xl font-bold text-emerald-600">0${i + 1}</span><span class="text-sm text-slate-700 pt-1">${f}</span></div>`).join('')}</div>
        </div>
      </div>
    </div>`,
  };

  const processSteps = es
    ? ['Estudio inicial', 'Propuesta personalizada', 'Instalación certificada', 'Puesta en marcha', 'Seguimiento y monitorización']
    : ['Initial assessment', 'Custom proposal', 'Certified installation', 'Commissioning', 'Monitoring & follow-up'];
  const process: TemplatePageSection = {
    id: 'process', type: 'services', navLabelEs: 'Proceso', navLabelEn: 'Process',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-slate-100">
      <h2 class="text-center text-3xl font-bold text-slate-900">${es ? 'Metodología de trabajo' : 'Our methodology'}</h2>
      <div class="mt-4 mx-auto h-0.5 w-12 bg-emerald-500"></div>
      <div class="mt-12 space-y-6 max-w-4xl mx-auto">
        ${processSteps.map((step, i) => `<div class="flex flex-col md:flex-row gap-6 items-center bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}">
          <div class="flex-1">
            <p class="text-xs text-emerald-600 font-mono tracking-wider">— [ ${es ? 'PASO' : 'STEP'} ${String(i + 1).padStart(2, '0')} ] —</p>
            <h3 class="mt-2 text-xl font-bold text-slate-900">${step}</h3>
            <ul class="mt-4 space-y-2 text-sm text-slate-600">${(es ? ['Análisis técnico y económico', 'Tramitación y permisos incluidos', 'Equipo certificado y asegurado'] : ['Technical and economic analysis', 'Permits and paperwork included', 'Certified and insured team']).map((b) => `<li class="flex gap-2"><span class="text-emerald-500">●</span>${b}</li>`).join('')}</ul>
          </div>
          <div class="w-full md:w-64 rounded-xl overflow-hidden shadow-md"><img src="${images[i % images.length] ?? heroImage}" alt="" class="w-full aspect-video object-cover" loading="lazy" referrerpolicy="no-referrer" /></div>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const gallerySec: TemplatePageSection = {
    id: 'gallery', type: 'gallery', navLabelEs: 'Proyectos', navLabelEn: 'Projects',
    html: `<div class="${gridBg} rounded-[2rem] p-10 md:p-16 border border-slate-200">
      ${sectionHead(es ? 'Proyectos realizados' : 'Completed projects', es ? 'Viviendas, empresas, naves industriales y comunidades energéticas' : 'Homes, businesses, industrial sites and energy communities', 'bg-emerald-600')}
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
        ${images.slice(0, 6).map((img, i) => `<div class="group relative rounded-xl overflow-hidden aspect-[4/3] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
          <img src="${img}" alt="${es ? 'Proyecto' : 'Project'} ${i + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" referrerpolicy="no-referrer" />
          <div class="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors duration-300 flex items-end p-4"><span class="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">${es ? ['Vivienda unifamiliar', 'Nave industrial', 'Comunidad energética', 'Empresa', 'Autoconsumo', 'Instalación EV'][i] ?? 'Proyecto' : ['Single-family home', 'Industrial site', 'Energy community', 'Business', 'Self-consumption', 'EV install'][i] ?? 'Project'}</span></div>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const reviewsSec: TemplatePageSection = {
    id: 'reviews', type: 'reviews', navLabelEs: 'Testimonios', navLabelEn: 'Testimonials',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-slate-100">
      <p class="text-center text-xs tracking-[0.2em] uppercase text-emerald-600 font-semibold mb-2">— ${es ? 'Testimonios' : 'Testimonials'} —</p>
      <h2 class="text-center text-3xl font-bold text-slate-900 mb-10">${es ? 'Escucha qué opinan los clientes' : 'What our clients say'}</h2>
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${reviews.map((r, i) => `<div class="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative">
          <span class="absolute top-4 right-4 text-emerald-200 text-4xl font-serif">"</span>
          <span class="text-[10px] text-slate-400 font-mono">0${i + 1}</span>
          <p class="mt-4 text-slate-600 text-sm leading-relaxed italic">"${esc(r.text)}"</p>
          <div class="mt-6 font-bold text-slate-900">${esc(r.name)}</div>
          <div class="text-[10px] uppercase tracking-wider text-emerald-600 mt-1">${es ? 'Cliente verificado' : 'Verified client'}</div>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const faqItems = es
    ? [
        ['¿Cuánto cuesta una instalación solar?', 'Depende de potencia y consumo. El estudio gratuito incluye amortización personalizada.'],
        ['¿Hay subvenciones disponibles?', 'Gestionamos ayudas autonómicas, IBI bonificado y deducciones IRPF aplicables.'],
        ['¿Cuánto puedo ahorrar?', 'En autoconsumo típico entre 50% y 80% de la factura según perfil de consumo.'],
        ['¿Qué mantenimiento requiere?', 'Revisiones anuales y monitorización remota incluida en nuestros planes.'],
        ['¿Cuánto tarda la instalación?', 'Entre 2 y 6 semanas según tamaño, desde la aprobación de la propuesta.'],
      ]
    : [
        ['How much does a solar installation cost?', 'Depends on power and consumption. Free assessment includes personalized payback.'],
        ['Are subsidies available?', 'We manage regional grants, property tax bonuses and applicable tax deductions.'],
        ['How much can I save?', 'Typical self-consumption saves 50–80% on bills depending on usage profile.'],
        ['What maintenance is required?', 'Annual inspections and remote monitoring included in our plans.'],
        ['How long does installation take?', '2–6 weeks depending on size, from proposal approval.'],
      ];
  const faq: TemplatePageSection = {
    id: 'faq', type: 'contact', navLabelEs: 'FAQ', navLabelEn: 'FAQ',
    html: `<div class="${gridBg} rounded-[2rem] p-10 md:p-16 border border-slate-200 max-w-5xl mx-auto">
      <p class="text-xs tracking-[0.2em] uppercase text-emerald-600 font-semibold mb-2">— ${es ? 'Dudas habituales' : 'Common questions'} —</p>
      <h2 class="text-3xl font-bold text-slate-900 mb-8">${es ? 'Preguntas frecuentes' : 'FAQ'}</h2>
      <div class="space-y-0 divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200 px-6">
        ${faqItems.map(([q, a]) => `<details class="group py-5"><summary class="flex justify-between items-center cursor-pointer font-semibold text-slate-900 list-none">${esc(q)}<span class="text-emerald-500 ml-4 group-open:rotate-180 transition-transform">▼</span></summary><p class="mt-3 text-sm text-slate-600 leading-relaxed pr-8">${esc(a)}</p></details>`).join('')}
      </div>
    </div>`,
  };

  const ctaFinal: TemplatePageSection = {
    id: 'cta', type: 'contact', navLabelEs: 'Contacto', navLabelEn: 'Contact',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-slate-100 shadow-lg max-w-5xl mx-auto">
      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p class="text-xs tracking-[0.2em] uppercase text-emerald-600 font-semibold mb-2">— ${es ? 'Contacto' : 'Contact'} —</p>
          <h2 class="text-3xl font-bold text-slate-900">${es ? 'Solicita tu estudio gratuito' : 'Request your free assessment'}</h2>
          <p class="mt-4 text-slate-600">${es ? 'Sin compromiso. Respuesta en menos de 24 horas con propuesta personalizada.' : 'No obligation. Response within 24 hours with a tailored proposal.'}</p>
          ${phone ? `<p class="mt-4 text-emerald-700 font-semibold">📞 ${esc(phone)}</p>` : ''}
        </div>
        <div class="space-y-3">
          <div class="border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-400">${es ? 'Tu nombre' : 'Your name'}</div>
          <div class="border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-400">${es ? 'Email o teléfono' : 'Email or phone'}</div>
          <div class="border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-400 h-20">${es ? 'Cuéntanos tu proyecto...' : 'Tell us about your project...'}</div>
          <div class="px-6 py-4 bg-emerald-500 text-slate-950 font-bold text-center rounded-lg">${esc(ctaPrimary)}</div>
        </div>
      </div>
    </div>`,
  };

  const footer: TemplatePageSection = {
    id: 'footer', type: 'footer', navLabelEs: 'Legal', navLabelEn: 'Legal',
    html: `<div class="bg-slate-950 text-slate-300 rounded-[2rem] p-10 md:p-14">
      <div class="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-sm">
        <div><div class="font-bold text-white text-lg">${esc(name)}</div><p class="mt-3 text-slate-400 text-xs leading-relaxed">${es ? 'Ingeniería e instalación de energías renovables.' : 'Renewable energy engineering and installation.'}</p></div>
        <div><h4 class="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">${es ? 'Servicios' : 'Services'}</h4><ul class="space-y-2 text-xs text-slate-400">${items.slice(0, 4).map((it) => `<li>${esc(it.title)}</li>`).join('')}</ul></div>
        <div><h4 class="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">${es ? 'Contacto' : 'Contact'}</h4><p class="text-xs text-slate-400">${esc(profile ? (es ? profile.addressEs : profile.addressEn) : '')}</p>${profile?.email ? `<p class="mt-2 text-xs">${esc(profile.email)}</p>` : ''}</div>
        <div><h4 class="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">${es ? 'Legal' : 'Legal'}</h4><ul class="space-y-2 text-xs text-slate-400"><li>${es ? 'Aviso legal' : 'Legal notice'}</li><li>${es ? 'Política de privacidad' : 'Privacy policy'}</li><li>${es ? 'Política de cookies' : 'Cookie policy'}</li></ul></div>
      </div>
      <p class="mt-10 text-center text-[10px] text-slate-500 uppercase tracking-wider">© ${new Date().getFullYear()} ${esc(name)} · ${es ? 'Energías renovables' : 'Renewable energy'}</p>
    </div>`,
  };

  const widgets = premiumWidgets(ctx, true);

  return [hero, stats, services, whyUs, process, gallerySec, reviewsSec, faq, ctaFinal, footer, widgets];
}

function buildCorporateSite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  const { name, heroImage, tagline, profile, lang, ctaPrimary, ctaSecondary, images } = ctx;
  const es = lang === 'es';
  const phone = profile?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');
  const items = profile ? (es ? profile.menuItems.es : profile.menuItems.en) : [];
  const reviews = profile ? (es ? profile.reviews.es : profile.reviews.en) : [];
  const aboutText = profile ? (es ? profile.aboutEs : profile.aboutEn) : '';
  const vivid = features.vividColors;
  const heroGrad = vivid
    ? 'from-emerald-600 via-teal-600 to-violet-700'
    : 'from-blue-900 via-blue-800 to-blue-600';
  const accentBtn = vivid ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-blue-900';
  const ctaBtn = vivid ? 'bg-violet-600 text-white' : 'bg-white text-blue-900';

  const hero: TemplatePageSection = {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="overflow-hidden rounded-[2rem] shadow-xl border ${vivid ? 'border-emerald-200' : 'border-blue-100'}">
      <div class="${vivid ? 'bg-violet-900' : 'bg-blue-900'} text-white text-sm px-6 py-2 flex flex-wrap justify-between gap-2">
        <span>${es ? 'Asesoría integral · Fiscal · Laboral · Contable' : 'Full advisory · Tax · Labor · Accounting'}</span>
        ${phone ? `<a href="tel:+34${phoneDigits}" class="font-semibold">📞 ${esc(phone)}</a>` : ''}
      </div>
      <nav class="bg-white flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-5 border-b border-stone-100" aria-label="${es ? 'Navegación principal' : 'Main navigation'}">
        <div class="font-bold text-xl ${vivid ? 'text-violet-900' : 'text-blue-900'}">${esc(name)}</div>
        <div class="hidden lg:flex gap-8 text-xs tracking-wider uppercase text-stone-500 font-semibold">
          ${(es ? ['Inicio', 'Servicios', 'Nosotros', 'Galería', 'Contacto', 'Ubicación'] : ['Home', 'Services', 'About', 'Gallery', 'Contact', 'Location']).map((n) => `<span>${n}</span>`).join('')}
        </div>
        <span class="px-4 py-2 ${vivid ? 'bg-emerald-600' : 'bg-blue-800'} text-white text-xs font-bold rounded-md">${esc(ctaPrimary)}</span>
      </nav>
      <div class="relative bg-gradient-to-br ${heroGrad} text-white text-center px-6 py-16 md:py-24 min-h-[420px] md:min-h-[520px] flex items-center justify-center">
        <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover opacity-25" loading="lazy" referrerpolicy="no-referrer" />
        <div class="relative z-10 max-w-3xl mx-auto">
          <span class="inline-block px-4 py-1 ${accentBtn} text-xs font-bold rounded-full mb-6">${profile ? esc(es ? profile.badgeEs : profile.badgeEn) : (es ? 'ASESORÍA PROFESIONAL' : 'PROFESSIONAL ADVISORY')}</span>
          <h1 class="text-4xl md:text-6xl font-bold font-serif tracking-tight">${esc(name)}</h1>
          <p class="mt-6 text-lg text-white/90 max-w-2xl mx-auto">${esc(tagline)}</p>
          <div class="mt-10 flex flex-wrap justify-center gap-4">
            <span class="px-8 py-4 ${ctaBtn} rounded-md font-bold text-sm shadow-lg">${esc(ctaPrimary)}</span>
            <span class="px-8 py-4 border-2 border-white/70 text-white rounded-md font-semibold text-sm">${esc(ctaSecondary)}</span>
          </div>
        </div>
      </div>
    </div>`,
  };

  const services: TemplatePageSection = {
    id: 'services', type: 'services', navLabelEs: 'Servicios', navLabelEn: 'Services',
    html: `<div class="bg-stone-50 rounded-[2rem] p-10 md:p-16 border border-stone-100">
      ${sectionHead(es ? 'Nuestros Servicios' : 'Our Services', es ? 'Soluciones integrales para autónomos y PYMES' : 'Integrated solutions for freelancers and SMEs', 'bg-blue-800')}
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${items.map((item) => `<div class="bg-white rounded-xl p-8 shadow-sm border border-stone-100 hover:shadow-lg hover:-translate-y-1 transition-all">
          <h3 class="font-bold text-blue-900 text-lg flex items-center gap-2">📋 ${esc(item.title)}</h3>
          <p class="mt-2 text-sm text-stone-500">${esc(item.price ?? '')}</p>
          <ul class="mt-4 space-y-2 text-sm text-stone-600">${(es ? ['Gestión completa', 'Asesor personal', 'Respuesta en 24h'] : ['Full management', 'Personal advisor', '24h response']).map((l) => `<li class="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-blue-800 before:font-bold">${l}</li>`).join('')}</ul>
          <span class="mt-6 inline-block text-blue-800 text-sm font-semibold">${esc(item.cta)} →</span>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const about: TemplatePageSection = {
    id: 'about', type: 'about', navLabelEs: 'Nosotros', navLabelEn: 'About',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-stone-100">
      <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
        <div>
          <h2 class="text-3xl font-bold text-blue-900">${es ? 'Sobre nosotros' : 'About us'}</h2>
          <p class="mt-6 text-stone-600 leading-relaxed">${esc(aboutText ?? '')}</p>
          <div class="mt-8 space-y-3">${(es ? ['Más de 30 años de experiencia', 'Especialistas en autónomos y PYMES', 'Trato cercano y profesional'] : ['Over 30 years of experience', 'Specialists in freelancers and SMEs', 'Professional and personal service']).map((f) => `<div class="flex items-center gap-2 text-sm text-stone-700"><span class="text-green-500">✅</span>${f}</div>`).join('')}</div>
        </div>
        <div class="rounded-xl overflow-hidden shadow-lg"><img src="${heroImage}" alt="" class="w-full aspect-[4/3] object-cover" referrerpolicy="no-referrer" /></div>
      </div>
    </div>`,
  };

  const reviewsSec: TemplatePageSection = {
    id: 'reviews', type: 'reviews', navLabelEs: 'Reseñas', navLabelEn: 'Reviews',
    html: `<div class="bg-stone-50 rounded-[2rem] p-10 md:p-16 border border-stone-100">
      ${sectionHead(es ? 'Opiniones de clientes' : 'Client reviews', profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : '', 'bg-blue-800')}
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${reviews.map((r) => `<div class="bg-white rounded-xl p-8 shadow-sm">
          <div class="text-amber-400">${'★'.repeat(r.stars)}</div>
          <p class="mt-4 text-stone-600 italic text-sm leading-relaxed">"${esc(r.text)}"</p>
          <div class="mt-6 font-bold text-blue-900">${esc(r.name)}</div>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const contact: TemplatePageSection = {
    id: 'contact', type: 'contact', navLabelEs: 'Contacto', navLabelEn: 'Contact',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-stone-100 max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-blue-900 text-center">${es ? 'Contacta con nosotros' : 'Contact us'}</h2>
      <div class="mt-10 grid md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <p class="text-stone-600">📍 ${esc(profile ? (es ? profile.addressEs : profile.addressEn) : '')}</p>
          <p class="text-stone-600">🕐 ${esc(profile ? (es ? profile.hoursEs : profile.hoursEn) : '')}</p>
          ${phone ? `<p class="text-blue-800 font-semibold">📞 ${esc(phone)}</p>` : ''}
          ${profile?.email ? `<p class="text-blue-800">✉️ ${esc(profile.email)}</p>` : ''}
        </div>
        <div class="space-y-4">
          <div class="border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">${es ? 'Tu nombre' : 'Your name'}</div>
          <div class="border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">${es ? 'Tu email' : 'Your email'}</div>
          <div class="border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400 h-24">${es ? 'Tu consulta...' : 'Your enquiry...'}</div>
          <div class="px-6 py-4 bg-blue-800 text-white font-bold text-center rounded-md">${es ? 'Enviar consulta' : 'Send enquiry'}</div>
        </div>
      </div>
    </div>`,
  };

  const footer = buildCorporateLegalFooter(ctx);

  const gallerySec: TemplatePageSection = {
    id: 'gallery', type: 'gallery', navLabelEs: 'Galería', navLabelEn: 'Gallery',
    html: `<div class="bg-stone-50 rounded-[2rem] p-10 md:p-16 border border-stone-100">
      ${sectionHead(es ? 'Nuestro despacho' : 'Our office', es ? 'Un entorno profesional y cercano para autónomos y empresas' : 'A professional, approachable environment for freelancers and businesses', vivid ? 'bg-violet-600' : 'bg-blue-800')}
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
        ${images.slice(0, 6).map((img) => `<div class="rounded-xl overflow-hidden aspect-[4/3] shadow-sm"><img src="${img}" alt="${esc(name)}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" referrerpolicy="no-referrer" /></div>`).join('')}
      </div>
    </div>`,
  };

  return [
    hero,
    ...(features.sidebar ? [buildCorporateSidebar(ctx)] : []),
    services,
    about,
    ...(features.gallery ? [gallerySec] : []),
    ...(features.reviews ? [reviewsSec] : []),
    ...(features.location ? [buildLocation(ctx)] : []),
    ...(features.contact ? [contact] : []),
    ...(features.documentUpload ? [buildDocumentUploadSection(ctx)] : []),
    ...(features.legalFooter || features.social ? [footer] : []),
    premiumWidgets(ctx),
  ];
}

function buildAutomotiveSite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  const { name, heroImage, tagline, profile, lang, images, ctaPrimary, ctaSecondary } = ctx;
  const es = lang === 'es';
  const phone = profile?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');
  const items = profile ? (es ? profile.menuItems.es : profile.menuItems.en) : [];
  const reviews = profile ? (es ? profile.reviews.es : profile.reviews.en) : [];
  const rating = profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : '';

  const hero: TemplatePageSection = {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="bg-stone-950 overflow-hidden rounded-[2rem] shadow-xl border border-stone-800">
      <div class="flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-4 border-b border-stone-800">
        <div class="font-bold text-lg uppercase tracking-[0.15em] text-white">${esc(name)}<div class="text-[10px] text-stone-500 tracking-[0.3em] mt-1">${es ? 'Concesionario Oficial' : 'Official Dealer'}</div></div>
        <div class="hidden md:flex gap-8 text-[10px] tracking-[0.2em] uppercase text-stone-500 font-semibold">
          ${(es ? ['Modelos', 'Taller', 'Recambios', 'Contacto'] : ['Models', 'Workshop', 'Parts', 'Contact']).map((n) => `<span>${n}</span>`).join('')}
        </div>
        ${phone ? `<a href="tel:+34${phoneDigits}" class="text-red-500 font-bold text-sm">📞 ${esc(phone)}</a>` : ''}
      </div>
      <div class="relative min-h-[520px] flex items-center">
        <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover opacity-40" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent"></div>
        <div class="relative z-10 px-8 md:px-16 py-16 max-w-2xl">
          <span class="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-600/40 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded">${profile ? esc(es ? profile.badgeEs : profile.badgeEn) : ''}</span>
          <h1 class="mt-6 text-5xl md:text-7xl font-bold uppercase tracking-tight text-white leading-none">${esc(name.split(' ')[0] ?? name)}<span class="text-red-600"> ${esc(name.split(' ').slice(1).join(' '))}</span></h1>
          <p class="mt-6 text-stone-400 text-lg">${esc(tagline)}</p>
          ${rating ? `<div class="mt-4 text-amber-400 text-sm">★★★★★ <span class="text-stone-500 ml-2">${esc(rating)}</span></div>` : ''}
          <div class="mt-10 flex flex-wrap gap-4">
            <span class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold uppercase tracking-wider">${esc(ctaPrimary)}</span>
            <span class="px-8 py-4 border border-stone-600 text-white rounded text-sm font-bold uppercase tracking-wider">${esc(ctaSecondary)}</span>
          </div>
        </div>
      </div>
    </div>`,
  };

  const stats: TemplatePageSection = {
    id: 'about', type: 'about', navLabelEs: 'Datos', navLabelEn: 'Stats',
    html: `<div class="bg-stone-900 rounded-[2rem] p-8 md:p-12 border border-stone-800">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
        ${(es ? [['+40', 'Años de experiencia'], ['1.282', 'Reseñas Google'], ['100%', 'Recambios originales'], ['24h', 'Respuesta taller']] : [['40+', 'Years experience'], ['1,282', 'Google reviews'], ['100%', 'Genuine parts'], ['24h', 'Workshop response']]).map(([n, l]) => `<div><div class="text-3xl md:text-4xl font-bold text-red-600">${n}</div><div class="mt-2 text-xs uppercase tracking-widest text-stone-500">${l}</div></div>`).join('')}
      </div>
    </div>`,
  };

  const services: TemplatePageSection = {
    id: 'services', type: 'services', navLabelEs: 'Servicios', navLabelEn: 'Services',
    html: `<div class="bg-stone-950 rounded-[2rem] p-10 md:p-16 border border-stone-800 text-white">
      <div class="text-center mb-14"><h2 class="text-3xl md:text-4xl font-bold uppercase tracking-tight">${es ? 'Nuestros Servicios' : 'Our Services'}</h2><div class="mt-4 mx-auto h-0.5 w-16 bg-red-600"></div></div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        ${items.map((item) => `<article class="group bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-red-600/50 transition-colors">
          <div class="aspect-[4/3] overflow-hidden"><img src="${item.image}" alt="${esc(item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" loading="lazy" referrerpolicy="no-referrer" /></div>
          <div class="p-6"><h3 class="font-bold uppercase tracking-wide text-sm">${esc(item.title)}</h3><p class="mt-2 text-stone-500 text-xs">${esc(item.price ?? '')}</p><span class="mt-4 inline-block text-red-500 text-xs font-bold uppercase">${esc(item.cta)} →</span></div>
        </article>`).join('')}
      </div>
    </div>`,
  };

  const gallery: TemplatePageSection = {
    id: 'gallery', type: 'gallery', navLabelEs: 'Galería', navLabelEn: 'Gallery',
    html: `<div class="bg-stone-900 rounded-[2rem] p-10 md:p-16 border border-stone-800">
      <div class="text-center mb-10"><h2 class="text-3xl font-bold uppercase text-white tracking-tight">${es ? 'Galería' : 'Gallery'}</h2></div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto">
        ${images.slice(0, 6).map((img) => `<div class="rounded-lg overflow-hidden aspect-[4/3]"><img src="${img}" alt="" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" referrerpolicy="no-referrer" /></div>`).join('')}
      </div>
    </div>`,
  };

  const reviewsSec: TemplatePageSection = {
    id: 'reviews', type: 'reviews', navLabelEs: 'Reseñas', navLabelEn: 'Reviews',
    html: `<div class="bg-stone-950 rounded-[2rem] p-10 md:p-16 border border-stone-800 text-white">
      <div class="text-center mb-10"><h2 class="text-3xl font-bold uppercase tracking-tight">${es ? 'Opiniones' : 'Reviews'}</h2></div>
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${reviews.map((r) => `<div class="bg-stone-900 border border-stone-800 rounded-xl p-8">
          <div class="text-red-500">${'★'.repeat(r.stars)}</div>
          <p class="mt-4 text-stone-400 italic text-sm">"${esc(r.text)}"</p>
          <div class="mt-6 font-bold uppercase tracking-wide text-sm">${esc(r.name)}</div>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const contact: TemplatePageSection = {
    id: 'location', type: 'location', navLabelEs: 'Contacto', navLabelEn: 'Contact',
    html: `<div class="bg-stone-900 rounded-[2rem] p-10 md:p-16 border border-stone-800 text-white">
      <div class="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <div>
          <h2 class="text-2xl font-bold uppercase">${es ? 'Visítanos' : 'Visit us'}</h2>
          <p class="mt-4 text-stone-400">📍 ${esc(profile ? (es ? profile.addressEs : profile.addressEn) : '')}</p>
          <p class="mt-2 text-stone-400">🕐 ${esc(profile ? (es ? profile.hoursEs : profile.hoursEn) : '')}</p>
          ${phone ? `<p class="mt-4 text-red-500 font-bold text-lg">📞 ${esc(phone)}</p>` : ''}
        </div>
        <div class="rounded-xl overflow-hidden border border-stone-700 min-h-[220px]">
          <iframe title="Mapa" src="https://maps.google.com/maps?q=${encodeURIComponent(profile ? (es ? profile.addressEs : profile.addressEn) : 'Madrid')}&amp;output=embed" class="w-full min-h-[220px] border-0 invert hue-rotate-180" loading="lazy" referrerpolicy="no-referrer"></iframe>
        </div>
      </div>
    </div>`,
  };

  const footer: TemplatePageSection = {
    id: 'footer', type: 'footer', navLabelEs: 'Footer', navLabelEn: 'Footer',
    html: `<div class="bg-stone-950 text-stone-500 rounded-[2rem] p-10 border border-stone-800 text-center text-xs">
      <div class="font-bold uppercase tracking-widest text-white text-sm">${esc(name)}</div>
      <div class="mt-4">© ${new Date().getFullYear()} ${esc(name)}. ${es ? 'Concesionario Oficial.' : 'Official Dealer.'}</div>
    </div>`,
  };

  return [
    hero, stats, services,
    ...(features.gallery ? [gallery] : []),
    ...(features.reviews ? [reviewsSec] : []),
    ...(features.location || features.contact ? [contact] : []),
    ...(features.legalFooter || features.social ? [footer] : []),
    premiumWidgets(ctx, true),
  ];
}

function buildLuxurySite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  const es = ctx.lang === 'es';
  const hero: TemplatePageSection = {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="bg-stone-950 overflow-hidden rounded-[2rem] shadow-2xl border border-amber-900/30">
      <div class="relative min-h-[560px] flex items-center justify-center text-center">
        <img src="${ctx.heroImage}" alt="${esc(ctx.name)}" class="absolute inset-0 w-full h-full object-cover opacity-40" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950/90"></div>
        <div class="relative z-10 px-6 py-20 max-w-3xl">
          <p class="text-amber-400/90 text-2xl md:text-3xl font-serif italic">${esc(ctx.tagline)}</p>
          <h1 class="mt-6 text-5xl md:text-7xl font-serif font-bold text-white tracking-tight">${esc(ctx.name)}</h1>
          <div class="mt-10 flex flex-wrap justify-center gap-4">
            <span class="px-10 py-4 bg-amber-700 hover:bg-amber-600 text-stone-950 rounded-sm text-sm font-bold tracking-[0.15em] uppercase">${esc(ctx.ctaPrimary)}</span>
            <span class="px-10 py-4 border border-amber-600/60 text-amber-200 rounded-sm text-sm font-bold tracking-[0.15em] uppercase">${esc(ctx.ctaSecondary)}</span>
          </div>
        </div>
      </div>
    </div>`,
  };
  const menu = buildMenu({ ...ctx, accent: 'gold' });
  menu.id = 'menu';
  const about = buildAbout(ctx);
  const gallery = buildGallery(ctx);
  const reviews = buildCafeReviews(ctx);
  const booking = buildCafeBooking(ctx);
  const contact = buildCafeContact(ctx);
  const footer = buildCafeFooter(ctx);
  return [
    hero, about, menu,
    ...(features.gallery ? [gallery] : []),
    ...(features.reviews ? [reviews] : []),
    ...(features.reservation ? [booking] : []),
    ...(features.contact || features.location ? [contact] : []),
    ...(features.legalFooter ? [footer] : []),
    premiumWidgets(ctx, true),
  ];
}

function buildNonprofitSite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  const es = ctx.lang === 'es';
  const items = ctx.profile ? (es ? ctx.profile.menuItems.es : ctx.profile.menuItems.en) : [];
  const hero: TemplatePageSection = {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="bg-blue-700 overflow-hidden rounded-[2rem] shadow-xl">
      <div class="relative min-h-[480px] flex items-center px-8 md:px-16">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600"></div>
        <div class="relative z-10 max-w-2xl text-white py-16">
          <span class="inline-block px-4 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-6">${esc(ctx.badge)}</span>
          <h1 class="text-4xl md:text-6xl font-bold tracking-tight">${esc(ctx.name)}</h1>
          <p class="mt-4 text-xl text-blue-100 italic font-serif">${esc(ctx.tagline)}</p>
          <p class="mt-6 text-blue-100/90 leading-relaxed max-w-xl">${esc(ctx.profile ? (es ? ctx.profile.aboutEs : ctx.profile.aboutEn) ?? '' : '')}</p>
          <div class="mt-10 flex flex-wrap gap-4">
            <span class="px-8 py-4 bg-white text-blue-800 rounded-lg font-bold text-sm">${esc(ctx.ctaPrimary)}</span>
            <span class="px-8 py-4 border-2 border-white/50 text-white rounded-lg font-semibold text-sm">${esc(ctx.ctaSecondary)}</span>
          </div>
        </div>
      </div>
    </div>`,
  };
  const services: TemplatePageSection = {
    id: 'services', type: 'services', navLabelEs: 'Recursos', navLabelEn: 'Resources',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-blue-100">
      ${sectionHead(es ? 'Nuestros Recursos' : 'Our Resources', es ? 'Contenido 100% accesible con subtítulos y LSE' : '100% accessible content with captions and sign language', 'bg-blue-700')}
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${items.map((item) => `<article class="bg-blue-50 rounded-xl p-8 border border-blue-100 hover:shadow-lg transition-all">
          <h3 class="font-bold text-blue-900 text-lg">${esc(item.title)}</h3>
          <p class="mt-2 text-blue-600 font-semibold">${esc(item.price ?? '')}</p>
          <span class="mt-4 inline-block text-blue-800 text-sm font-bold">${esc(item.cta)} →</span>
        </article>`).join('')}
      </div>
    </div>`,
  };
  const reviewsSec = buildCafeReviews(ctx);
  const contact = buildLocation(ctx);
  const footer: TemplatePageSection = {
    id: 'footer', type: 'footer', navLabelEs: 'Footer', navLabelEn: 'Footer',
    html: `<div class="bg-blue-950 text-blue-200 rounded-[2rem] p-10 text-center text-sm">
      <div class="font-bold text-white text-lg">${esc(ctx.name)}</div>
      <div class="mt-4">© ${new Date().getFullYear()} · ${es ? 'Comunicación sin barreras' : 'Communication without barriers'}</div>
    </div>`,
  };
  return [
    hero, services,
    ...(features.reviews ? [reviewsSec] : []),
    ...(features.contact ? [contact] : []),
    ...(features.legalFooter ? [footer] : []),
    premiumWidgets(ctx),
  ];
}

function buildHero(ctx: BuildCtx): TemplatePageSection {
  const { name, tagline, badge, heroImage, ctaPrimary, ctaSecondary, accent, profile, lang } = ctx;
  const es = lang === 'es';
  const rating = profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : undefined;
  const phone = profile?.phone?.replace(/\D/g, '') ?? '';
  const nav = es ? ['Inicio', 'Servicios', 'Galería', 'Contacto'] : ['Home', 'Services', 'Gallery', 'Contact'];
  return {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="bg-white overflow-hidden rounded-[2rem] shadow-xl border border-slate-100">
      <div class="flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-4 border-b border-slate-100">
        <div class="font-serif font-bold text-lg text-slate-900">${esc(name)}</div>
        <div class="hidden md:flex gap-6 text-[11px] tracking-[0.15em] uppercase text-slate-500 font-medium">${nav.map((n) => `<span>${n}</span>`).join('')}</div>
        ${phone ? `<span class="text-sm font-medium text-slate-700">📞 ${esc(profile!.phone!)}</span>` : ''}
      </div>
      <div class="relative min-h-[480px] md:min-h-[540px] flex items-center">
        <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/30"></div>
        <div class="relative z-10 p-10 md:p-16 max-w-4xl">
          <span class="inline-block px-4 py-1.5 ${accentBg(accent)} text-white text-xs font-bold tracking-widest uppercase rounded-full">${esc(badge)}</span>
          ${rating ? `<div class="mt-4 inline-flex items-center gap-2 text-amber-400 text-sm font-semibold"><span>★★★★★</span><span class="text-slate-200">${esc(rating)}</span></div>` : ''}
          <h1 class="mt-6 text-4xl md:text-6xl font-bold font-serif text-white tracking-tight leading-tight drop-shadow-lg">${esc(name)}</h1>
          <p class="mt-5 text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl font-light">${esc(tagline)}</p>
          <div class="mt-10 flex flex-wrap gap-4">
            <span class="px-8 py-4 ${accentBg(accent)} text-white rounded-xl text-sm font-semibold shadow-lg">${esc(ctaPrimary)}</span>
            <span class="px-8 py-4 border-2 border-white/80 text-white rounded-xl text-sm font-medium">${esc(ctaSecondary)}</span>
          </div>
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
  const btnAccent = profile?.accent === 'red' ? 'bg-red-600 hover:bg-red-700'
    : profile?.accent === 'gold' ? 'bg-amber-700 hover:bg-amber-600'
      : profile?.accent === 'rose' ? 'bg-rose-400 hover:bg-rose-500'
        : profile?.accent === 'blue' ? 'bg-blue-800 hover:bg-blue-900'
          : 'bg-indigo-600 hover:bg-indigo-700';
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
            <div class="text-amber-400">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
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

function cafeHeadingLight(title: string, subtitle?: string): string {
  return `<div class="text-center mb-14">
    <h2 class="text-3xl md:text-4xl font-bold font-serif text-stone-900 tracking-tight">${esc(title)}</h2>
    ${subtitle ? `<p class="mt-3 text-stone-500 text-base md:text-lg">${esc(subtitle)}</p>` : ''}
    <div class="mt-5 mx-auto h-0.5 w-16 bg-orange-700/80"></div>
  </div>`;
}

function buildCafeHero(ctx: BuildCtx): TemplatePageSection {
  const { heroImage, tagline, ctaPrimary, ctaSecondary, profile, lang, name } = ctx;
  const es = lang === 'es';
  const rating = profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : '4.3 · 819 reseñas verificadas';
  const phone = profile?.phone ?? '910 71 23 22';
  const phoneDigits = phone.replace(/\D/g, '');
  const nav = es
    ? ['Inicio', 'Menú', 'Carta', 'Reservas', 'Galería', 'Ubicación']
    : ['Home', 'Menu', 'Menu', 'Booking', 'Gallery', 'Location'];
  return {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="bg-white overflow-hidden rounded-[2rem] shadow-xl border border-stone-100">
      <div class="flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-5 border-b border-stone-100">
        <div class="font-serif font-semibold text-xl md:text-2xl text-stone-900 tracking-tight">${esc(name)}</div>
        <div class="hidden lg:flex gap-8 text-[11px] tracking-[0.2em] uppercase text-stone-500 font-medium">
          ${nav.map((n) => `<span>${n}</span>`).join('')}
        </div>
        <div class="flex items-center gap-3 ml-auto">
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-full">WhatsApp</span>
          <span class="inline-flex items-center gap-2 text-sm font-medium text-stone-700">📞 <a href="tel:+34${phoneDigits}">${esc(phone)}</a></span>
        </div>
      </div>
      <div class="relative min-h-[480px] md:min-h-[560px] flex items-center justify-center text-center">
        <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-950/40 to-stone-950/75"></div>
        <div class="relative z-10 px-6 py-16 max-w-3xl mx-auto">
          <p class="text-amber-400/90 text-xl md:text-2xl font-serif italic">${esc(tagline)}</p>
          <h1 class="mt-4 text-5xl md:text-7xl font-bold font-serif text-white tracking-tight drop-shadow-lg">${esc(name)}</h1>
          <div class="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-stone-950/70 backdrop-blur rounded-full border border-white/10">
            <span class="text-amber-400 text-sm">★★★★☆</span>
            <span class="text-white/90 text-sm font-medium">${esc(rating)}</span>
          </div>
          <div class="mt-10 flex flex-wrap justify-center gap-4">
            <span class="px-10 py-4 bg-orange-700 hover:bg-orange-600 text-white rounded-md text-sm font-bold tracking-[0.12em] uppercase shadow-lg">${esc(ctaPrimary)}</span>
            <span class="px-10 py-4 bg-white text-stone-900 rounded-md text-sm font-bold tracking-[0.12em] uppercase shadow-lg">${esc(ctaSecondary)}</span>
          </div>
        </div>
      </div>
    </div>`,
  };
}

function buildCafeInfoBar(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const address = profile ? (es ? profile.addressEs : profile.addressEn) : '';
  const hours = profile ? (es ? profile.hoursEs : profile.hoursEn) : '';
  const services = es
    ? ['Terraza con jardines', 'Accesible PMR', 'Para llevar']
    : ['Garden terrace', 'Wheelchair access', 'Takeaway'];
  return {
    id: 'about', type: 'about', navLabelEs: 'Info', navLabelEn: 'Info',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-14 border border-stone-100 shadow-sm">
      <div class="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto divide-y md:divide-y-0 md:divide-x divide-stone-200">
        <div class="text-center px-4 pt-4 md:pt-0">
          <h3 class="font-serif font-bold text-orange-800 text-lg">${es ? 'Ubicación' : 'Location'}</h3>
          <p class="mt-4 text-stone-600 text-sm leading-relaxed">${esc(address)}</p>
          <span class="mt-4 inline-block text-orange-700 text-sm font-medium">${es ? 'Cómo llegar →' : 'Get directions →'}</span>
        </div>
        <div class="text-center px-4 pt-8 md:pt-0">
          <h3 class="font-serif font-bold text-orange-800 text-lg">${es ? 'Horario' : 'Hours'}</h3>
          <p class="mt-4 text-stone-600 text-sm leading-relaxed">${esc(hours)}</p>
        </div>
        <div class="text-center px-4 pt-8 md:pt-0">
          <h3 class="font-serif font-bold text-orange-800 text-lg">${es ? 'Servicios' : 'Services'}</h3>
          <div class="mt-4 space-y-2">${services.map((s) => `<div class="text-stone-600 text-sm">✅ ${esc(s)}</div>`).join('')}</div>
        </div>
      </div>
    </div>`,
  };
}

function buildCafeDailyMenu(ctx: BuildCtx): TemplatePageSection {
  const es = ctx.lang === 'es';
  const cols = es
    ? [
        { title: '🥗 Primeros Platos', items: ['Alubias blancas con matanza asturiana', 'Tallarines con langostinos y verduritas', 'Calabacín relleno de picada de ternera gratinado', 'Ensalada mixta'] },
        { title: '🍖 Segundos Platos', items: ['Entraña de ternera a la plancha', 'Pechuga de pollo crispy', 'Lomo de salmón a la plancha'] },
        { title: '🍮 Postres', items: ['Flan casero', 'Natillas', 'Fruta del tiempo', 'Café o infusión'] },
      ]
    : [
        { title: '🥗 Starters', items: ['White beans with Asturian sausage', 'Noodles with prawns and vegetables', 'Stuffed courgette with beef gratin', 'Mixed salad'] },
        { title: '🍖 Main courses', items: ['Grilled skirt steak', 'Crispy chicken breast', 'Grilled salmon fillet'] },
        { title: '🍮 Desserts', items: ['Homemade flan', 'Custard', 'Seasonal fruit', 'Coffee or tea'] },
      ];
  return {
    id: 'menu', type: 'menu', navLabelEs: 'Menú del día', navLabelEn: 'Daily menu',
    html: `<div class="bg-stone-50 rounded-[2rem] p-10 md:p-16 border border-stone-100">
      <div class="text-center mb-14">
        <p class="text-orange-700/90 text-sm italic font-serif">${es ? 'Lunes a Viernes' : 'Monday – Friday'}</p>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold font-serif text-stone-900 tracking-tight">${es ? 'Menú del Día' : 'Daily Menu'}</h2>
        <p class="mt-3 text-stone-500 text-sm">${es ? 'Disfruta de nuestra cocina casera al mejor precio. Incluye pan, postre o café.' : 'Enjoy our home cooking at the best price. Includes bread, dessert or coffee.'}</p>
      </div>
      <div class="text-center mb-10"><span class="inline-block px-8 py-3 border-2 border-orange-700 text-orange-800 font-serif font-bold text-2xl rounded-sm">12,50 €</span></div>
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${cols.map((col) => `<div class="bg-white rounded-xl p-8 shadow-sm border-t-4 border-orange-700">
          <h3 class="font-serif font-bold text-stone-900 text-lg">${col.title}</h3>
          <ul class="mt-6 space-y-3">${col.items.map((i) => `<li class="text-stone-600 text-sm leading-relaxed border-b border-stone-100 pb-3">${esc(i)}</li>`).join('')}</ul>
        </div>`).join('')}
      </div>
    </div>`,
  };
}

function buildCafeDigitalMenu(ctx: BuildCtx): TemplatePageSection {
  const es = ctx.lang === 'es';
  return {
    id: 'services', type: 'services', navLabelEs: 'Menú digital', navLabelEn: 'Digital menu',
    html: `<div class="relative rounded-[2rem] overflow-hidden min-h-[280px] border border-stone-200">
      <img src="${ctx.images[2] ?? ctx.heroImage}" alt="" class="absolute inset-0 w-full h-full object-cover" referrerpolicy="no-referrer" />
      <div class="absolute inset-0 bg-stone-950/75"></div>
      <div class="relative z-10 p-10 md:p-16 text-center text-white">
        <h2 class="text-2xl md:text-3xl font-serif font-bold">${es ? '¿Estás en una de nuestras mesas?' : 'Are you at one of our tables?'}</h2>
        <p class="mt-3 text-stone-300">${es ? 'Selecciona tu número para acceder al menú digital' : 'Select your table number for the digital menu'}</p>
        <div class="mt-8 flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
          ${Array.from({ length: 10 }, (_, i) => `<span class="w-12 h-12 flex items-center justify-center bg-orange-700 hover:bg-orange-600 text-white font-bold rounded-md cursor-pointer">${i + 1}</span>`).join('')}
        </div>
        <p class="mt-8 text-orange-400 text-sm font-medium">${es ? 'Ver carta completa sin asignar mesa →' : 'View full menu without a table →'}</p>
      </div>
    </div>`,
  };
}

function buildCafeCarta(ctx: BuildCtx): TemplatePageSection {
  const es = ctx.lang === 'es';
  const carnes = es
    ? [
        { name: 'Medallones de solomillo', price: '12,80€', desc: 'Queso cheddar, cebolla caramelizada, crema de P.X.' },
        { name: 'Sartén de Huevos camperos', price: '13,50€', desc: 'Con patatas panaderas, chistorra y pimientos del piquillo.' },
        { name: 'Hamburguesa de vaca madurada', price: '14,90€', desc: 'Pan brioche, bacon crujiente, queso gouda y salsa BBQ.' },
      ]
    : [
        { name: 'Sirloin medallions', price: '€12.80', desc: 'Cheddar, caramelized onion, Pedro Ximénez cream.' },
        { name: 'Farm egg skillet', price: '€13.50', desc: 'With pan-fried potatoes, chorizo and piquillo peppers.' },
        { name: 'Dry-aged beef burger', price: '€14.90', desc: 'Brioche bun, crispy bacon, gouda and BBQ sauce.' },
      ];
  const patatas = es
    ? [
        { name: 'Patatas bravas', price: '8,50€', desc: 'Con alioli casero y salsa brava suave.' },
        { name: 'Patatas gajo al romero', price: '7,90€', desc: 'Con salsa de ajo y perejil.' },
        { name: 'Nachos con guacamole', price: '9,50€', desc: 'Totopos, queso fundido, jalapeños y pico de gallo.' },
      ]
    : [
        { name: 'Patatas bravas', price: '€8.50', desc: 'With homemade aioli and mild brava sauce.' },
        { name: 'Rosemary wedge fries', price: '€7.90', desc: 'With garlic and parsley sauce.' },
        { name: 'Nachos with guacamole', price: '€9.50', desc: 'Tortilla chips, melted cheese, jalapeños and pico de gallo.' },
      ];
  const col = (title: string, items: typeof carnes) => `<div>
    <h3 class="font-serif font-bold text-orange-800 text-xl pb-3 border-b-2 border-orange-700/30">${title}</h3>
    <div class="mt-6 space-y-6">${items.map((i) => `<div>
      <div class="flex justify-between gap-4"><span class="font-semibold text-stone-900">${esc(i.name)}</span><span class="font-bold text-orange-800 whitespace-nowrap">${esc(i.price)}</span></div>
      <p class="mt-1 text-sm text-stone-500">${esc(i.desc)}</p>
    </div>`).join('')}</div>
  </div>`;
  return {
    id: 'carta', type: 'menu', navLabelEs: 'Carta', navLabelEn: 'Menu',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-stone-100 shadow-sm">
      ${cafeHeadingLight(es ? 'Nuestra Carta' : 'Our Menu', es ? 'Una selección de nuestros platos más populares' : 'A selection of our most popular dishes')}
      <div class="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        ${col(es ? '🥩 Carnes' : '🥩 Meats', carnes)}
        ${col(es ? '🍟 De Patatas' : '🍟 Potato dishes', patatas)}
      </div>
      <div class="mt-12 text-center"><span class="inline-block px-8 py-3 border-2 border-orange-700 text-orange-800 font-semibold rounded-md text-sm tracking-wide uppercase">${es ? 'Ver carta completa' : 'View full menu'}</span></div>
    </div>`,
  };
}

function buildCafeGallery(ctx: BuildCtx): TemplatePageSection {
  const { images, lang } = ctx;
  const es = lang === 'es';
  return {
    id: 'gallery', type: 'gallery', navLabelEs: 'Galería', navLabelEn: 'Gallery',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-stone-100">
      ${cafeHeadingLight(es ? 'Galería' : 'Gallery', es ? 'Descubre nuestro espacio, nuestra terraza y nuestros platos' : 'Discover our space, terrace and dishes')}
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        ${images.slice(0, 6).map((img) => `<div class="rounded-xl overflow-hidden shadow-md aspect-[4/3]"><img src="${img}" alt="" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" referrerpolicy="no-referrer" /></div>`).join('')}
      </div>
    </div>`,
  };
}

function buildCafeReviews(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const reviews = profile ? (es ? profile.reviews.es : profile.reviews.en) : [];
  const rating = profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : '';
  const initials = (n: string) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return {
    id: 'reviews', type: 'reviews', navLabelEs: 'Reseñas', navLabelEn: 'Reviews',
    html: `<div class="bg-stone-50 rounded-[2rem] p-10 md:p-16 border border-stone-100">
      ${cafeHeadingLight(es ? 'Reseñas' : 'Reviews', es ? 'Lo que dicen nuestros clientes' : 'What our customers say')}
      <div class="text-center -mt-8 mb-10"><span class="text-amber-500">★★★★☆</span> <span class="text-stone-500 text-sm ml-2">${esc(rating ?? '')}</span></div>
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${reviews.map((r) => `<div class="bg-white rounded-xl p-8 shadow-sm border-l-4 border-orange-700 relative">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-bold">${initials(r.name)}</div>
            <div><div class="font-serif font-bold text-stone-900 text-sm">${esc(r.name)}</div><div class="text-xs text-stone-400">${es ? 'Local Guide' : 'Local Guide'}</div></div>
          </div>
          <div class="mt-3 text-amber-500 text-xs">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
          <p class="mt-4 text-stone-600 text-sm italic leading-relaxed">"${esc(r.text)}"</p>
        </div>`).join('')}
      </div>
    </div>`,
  };
}

function buildCafeBooking(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const phone = profile?.phone ?? '910 71 23 22';
  return {
    id: 'reservation', type: 'reservation', navLabelEs: 'Reservas', navLabelEn: 'Booking',
    html: `<div class="bg-white rounded-[2rem] overflow-hidden border border-stone-200 shadow-lg max-w-5xl mx-auto">
      <div class="grid md:grid-cols-2">
        <div class="bg-stone-950 text-white p-10 md:p-12 flex flex-col justify-center">
          <h2 class="text-3xl font-serif font-bold">${es ? 'Reserva tu Mesa' : 'Book your Table'}</h2>
          <p class="mt-4 text-stone-400 text-sm leading-relaxed">${es ? 'Reserva ahora y asegura tu lugar. Confirmación inmediata.' : 'Book now and secure your spot. Instant confirmation.'}</p>
          <ul class="mt-8 space-y-3 text-sm text-stone-300">${(es ? ['Confirmación inmediata', 'Cancelación gratuita hasta 2h antes', 'Mejor precio garantizado'] : ['Instant confirmation', 'Free cancellation up to 2h before', 'Best price guaranteed']).map((b) => `<li>✅ ${b}</li>`).join('')}</ul>
          <div class="mt-10 p-5 bg-stone-900 rounded-xl border border-stone-800">
            <div class="text-xs text-stone-500 uppercase tracking-wider">${es ? 'O reserva por teléfono' : 'Or book by phone'}</div>
            <div class="mt-2 text-xl font-bold text-orange-400">📞 ${esc(phone)}</div>
          </div>
        </div>
        <div class="p-10 md:p-12 bg-white space-y-5">
          <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Fecha' : 'Date'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">dd/mm/aaaa 📅</div></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Hora' : 'Time'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">${es ? 'Seleccionar' : 'Select'}</div></div>
            <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Personas' : 'Guests'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">${es ? 'Seleccionar' : 'Select'}</div></div>
          </div>
          <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Teléfono' : 'Phone'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">+34 600 000 000</div></div>
          <div class="px-6 py-4 bg-orange-700 text-white font-serif font-bold text-center rounded-md tracking-wide">${es ? 'Confirmar Reserva' : 'Confirm Booking'}</div>
          <p class="text-[10px] text-stone-400 text-center">${es ? 'Al reservar aceptas nuestra Política de Privacidad.' : 'By booking you accept our Privacy Policy.'}</p>
        </div>
      </div>
    </div>`,
  };
}

function buildCafeContact(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const address = profile ? (es ? profile.addressEs : profile.addressEn) : '';
  const phone = profile?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');
  const email = profile?.email ?? 'info@restartcafe.com';
  return {
    id: 'location', type: 'location', navLabelEs: 'Ubicación', navLabelEn: 'Location',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-stone-100">
      <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 class="text-3xl font-serif font-bold text-stone-900">${es ? 'Ubicación' : 'Location'}</h2>
          <div class="mt-6 p-6 bg-stone-50 rounded-xl border border-stone-100">
            <div class="font-semibold text-stone-900">📍 ${es ? 'Dirección' : 'Address'}</div>
            <p class="mt-2 text-stone-600 text-sm">${esc(address)}</p>
            <span class="mt-3 inline-block text-orange-700 text-sm font-medium">${es ? 'Abrir en Google Maps →' : 'Open in Google Maps →'}</span>
          </div>
          <div class="mt-6 text-sm text-stone-600">
            <div class="font-semibold text-stone-900">🚇 ${es ? 'Cómo llegar' : 'Getting here'}</div>
            <p class="mt-2">${es ? 'Metro: Puente de Vallecas (Línea 1)' : 'Metro: Puente de Vallecas (Line 1)'}</p>
            <p>${es ? 'Bus: Líneas de EMT cercanas' : 'Bus: Nearby EMT lines'}</p>
          </div>
          <div class="mt-6 rounded-xl overflow-hidden border border-stone-200 min-h-[220px]">
            <iframe title="Mapa" src="https://maps.google.com/maps?q=${encodeURIComponent(address)}&amp;output=embed" class="w-full min-h-[220px] border-0" loading="lazy" referrerpolicy="no-referrer"></iframe>
          </div>
        </div>
        <div>
          <h2 class="text-3xl font-serif font-bold text-stone-900">${es ? 'Contacto' : 'Contact'}</h2>
          <div class="mt-6 space-y-5">
            <div class="flex items-center gap-4"><span class="text-2xl">📞</span><div><div class="text-xs text-stone-400 uppercase">${es ? 'Teléfono' : 'Phone'}</div><a href="tel:+34${phoneDigits}" class="text-orange-700 font-semibold">${esc(phone)}</a></div></div>
            <div class="flex items-center gap-4"><span class="text-2xl">💬</span><div><div class="text-xs text-stone-400 uppercase">WhatsApp</div><span class="text-orange-700 font-semibold">${es ? 'Enviar mensaje' : 'Send message'}</span></div></div>
            <div class="flex items-center gap-4"><span class="text-2xl">✉️</span><div><div class="text-xs text-stone-400 uppercase">Email</div><span class="text-orange-700 font-semibold">${esc(email)}</span></div></div>
          </div>
          <div class="mt-10"><div class="font-semibold text-stone-900">${es ? 'Síguenos en Redes' : 'Follow us'}</div>
          <div class="mt-4 flex gap-3">${['f', 'ig', 'x', 'yt', 'ta'].map((s) => `<span class="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">${s}</span>`).join('')}</div></div>
        </div>
      </div>
    </div>`,
  };
}

function buildCafeFooter(ctx: BuildCtx): TemplatePageSection {
  const { name, lang, profile } = ctx;
  const es = lang === 'es';
  const year = new Date().getFullYear();
  const about = profile ? (es ? profile.aboutEs : profile.aboutEn) : '';
  return {
    id: 'footer', type: 'footer', navLabelEs: 'Footer', navLabelEn: 'Footer',
    html: `<div class="bg-stone-950 text-stone-400 rounded-[2rem] p-10 md:p-16">
      <div class="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        <div><h3 class="text-white font-serif font-bold text-xl">${esc(name)}</h3><p class="mt-4 text-sm leading-relaxed">${esc(about?.slice(0, 120) ?? '')}</p>
        <div class="mt-5 flex gap-3"><span class="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-xs">IG</span><span class="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-xs">f</span></div></div>
        <div><h4 class="text-white text-xs font-bold tracking-[0.2em] uppercase">${es ? 'Explorar' : 'Explore'}</h4><div class="mt-4 space-y-2 text-sm">${(es ? ['Inicio', 'Menú del Día', 'Carta', 'Reservas', 'Galería', 'Ubicación'] : ['Home', 'Daily Menu', 'Menu', 'Booking', 'Gallery', 'Location']).map((l) => `<div>${l}</div>`).join('')}</div></div>
        <div><h4 class="text-white text-xs font-bold tracking-[0.2em] uppercase">Legal</h4><div class="mt-4 space-y-2 text-sm underline"><div>Aviso Legal</div><div>Política de Privacidad</div><div>Política de Cookies</div><div>Mapa del Sitio</div></div></div>
      </div>
      <div class="mt-10 pt-6 border-t border-stone-800 text-center text-xs space-y-2">
        <div>© ${year} ${esc(name)}. ${es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</div>
        <div class="text-stone-500">${es ? 'Este sitio usa cookies de Google para ofrecer sus servicios y analizar el tráfico.' : 'This site uses Google cookies to provide services and analyze traffic.'}</div>
      </div>
    </div>`,
  };
}

function buildCafeWidgets(ctx: BuildCtx): TemplatePageSection {
  return premiumWidgets(ctx);
}

const CORAL = 'text-[#d4715a]';
const CORAL_BG = 'bg-[#d4715a]';

function buildFoodBlogSite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  const { name, heroImage, tagline, profile, lang, images } = ctx;
  const es = lang === 'es';
  const posts = profile ? (es ? profile.menuItems.es : profile.menuItems.en) : [];
  const badge = profile ? (es ? profile.badgeEs : profile.badgeEn) : '';
  const aboutText = profile ? (es ? profile.aboutEs : profile.aboutEn) : tagline;
  const newsletterImg = IMAGE_BANK.foodblog.newsletter;
  const nav = es
    ? ['Blog', 'Acerca de', 'Contacto', 'Tienda']
    : ['Blog', 'About', 'Contact', 'Shop'];

  const hero: TemplatePageSection = {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="bg-[#f4f0eb] overflow-hidden rounded-[2rem] border border-stone-200/80">
      <nav class="flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-5 bg-[#f4f0eb] border-b border-stone-200/60" aria-label="${es ? 'Navegación' : 'Navigation'}">
        <div class="font-semibold text-lg text-stone-900 tracking-tight">${esc(name)}</div>
        <div class="hidden md:flex items-center gap-8 text-sm text-stone-700">
          ${nav.map((n, i) => `<span class="${i === 0 ? 'underline underline-offset-4' : ''}">${n}</span>`).join('')}
        </div>
        <div class="flex items-center gap-4 text-stone-600 text-xs">
          <span>ig</span><span>yt</span><span>𝕏</span>
          <span class="font-medium">🛒 0</span>
        </div>
      </nav>
      <div class="grid md:grid-cols-2 min-h-[420px] md:min-h-[520px]">
        <div class="relative min-h-[280px] md:min-h-full">
          <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer" />
        </div>
        <div class="flex flex-col justify-center px-8 md:px-14 py-12 bg-[#f4f0eb]">
          <p class="text-xs font-semibold tracking-[0.2em] uppercase ${CORAL}">${esc(badge)}</p>
          <p class="mt-8 text-lg md:text-xl text-stone-800 leading-relaxed font-light">${esc(aboutText)}</p>
        </div>
      </div>
    </div>`,
  };

  const blog: TemplatePageSection = {
    id: 'blog', type: 'blog', navLabelEs: 'Blog', navLabelEn: 'Blog',
    html: `<div class="bg-[#faf8f5] rounded-[2rem] p-10 md:p-16 border border-stone-100">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h2 class="text-3xl md:text-4xl font-serif font-bold ${CORAL}">${es ? 'Publicaciones recientes' : 'Recent posts'}</h2>
        <p class="mt-4 text-stone-500 text-sm leading-relaxed">${es ? 'Recetas sencillas, fotos reales y cocina casera para el día a día.' : 'Simple recipes, real photos and everyday home cooking.'}</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        ${posts.map((post) => `<article class="group">
          <div class="overflow-hidden rounded-sm aspect-[4/5] bg-stone-100">
            <img src="${post.image}" alt="${esc(post.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" referrerpolicy="no-referrer" />
          </div>
          <time class="mt-5 block text-xs text-stone-400">${esc(post.price ?? '')}</time>
          <h3 class="mt-2 text-lg font-serif font-semibold ${CORAL} leading-snug">${esc(post.title)}</h3>
          <p class="mt-3 text-sm text-stone-500 leading-relaxed">${es ? 'Receta casera con ingredientes accesibles y pasos claros para cocinar en casa.' : 'Home recipe with accessible ingredients and clear steps.'}</p>
          <span class="mt-4 inline-block text-sm font-medium ${CORAL}">${esc(post.cta)} →</span>
        </article>`).join('')}
      </div>
    </div>`,
  };

  const newsletter: TemplatePageSection = {
    id: 'about', type: 'about', navLabelEs: 'Newsletter', navLabelEn: 'Newsletter',
    html: `<div class="relative overflow-hidden rounded-[2rem] min-h-[360px] flex items-center justify-center text-center text-white">
      <img src="${newsletterImg}" alt="" class="absolute inset-0 w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer" />
      <div class="absolute inset-0 bg-stone-900/50"></div>
      <div class="relative z-10 px-6 py-16 max-w-xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-serif font-bold">${es ? 'Recibe los detalles.' : 'Get the details.'}</h2>
        <p class="mt-4 text-white/90 text-sm md:text-base">${es ? 'Regístrate con tu correo para recibir recetas y novedades.' : 'Sign up with your email for recipes and updates.'}</p>
        <div class="mt-8 flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
          <div class="flex-1 bg-white/95 text-stone-400 text-sm px-4 py-3 text-left">${es ? 'Correo electrónico' : 'Email address'}</div>
          <span class="px-8 py-3 ${CORAL_BG} text-white text-sm font-bold tracking-wider uppercase shrink-0">${es ? 'Suscribirse' : 'Subscribe'}</span>
        </div>
      </div>
    </div>`,
  };

  const footer: TemplatePageSection = {
    id: 'footer', type: 'footer', navLabelEs: 'Footer', navLabelEn: 'Footer',
    html: `<div class="bg-[#8b8178] text-white/80 rounded-[2rem] p-12 md:p-16 text-center">
      <div class="flex justify-center gap-6 text-sm mb-8">
        <span>Instagram</span><span>YouTube</span><span>Twitter</span>
      </div>
      <div class="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-wider mb-8">
        ${(es ? ['Aviso legal', 'Privacidad', 'Cookies'] : ['Legal', 'Privacy', 'Cookies']).map((l) => `<span>${l}</span>`).join('')}
      </div>
      <p class="text-xs text-white/60">© ${new Date().getFullYear()} ${esc(name)} · ${es ? 'Hecho con CREAUNA' : 'Made with CREAUNA'}</p>
    </div>`,
  };

  const shop: TemplatePageSection = {
    id: 'menu', type: 'menu', navLabelEs: 'Tienda', navLabelEn: 'Shop',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-stone-100 max-w-4xl mx-auto text-center">
      <h2 class="text-2xl font-serif font-bold text-stone-900">${es ? 'Recetas de Stanton, Ed. 1' : 'Stanton Recipes, Ed. 1'}</h2>
      <p class="mt-2 text-stone-500 text-sm">${es ? 'Libro de recetas · EUR 25' : 'Recipe book · EUR 25'}</p>
      <div class="mt-8 mx-auto max-w-xs rounded-lg overflow-hidden shadow-lg">
        <img src="${images[0] ?? heroImage}" alt="${es ? 'Libro de recetas' : 'Recipe book'}" class="w-full aspect-square object-cover" loading="lazy" referrerpolicy="no-referrer" />
      </div>
      <span class="mt-8 inline-block px-8 py-3 ${CORAL_BG} text-white text-sm font-bold tracking-wide uppercase">${es ? 'Comprar' : 'Buy now'}</span>
    </div>`,
  };

  return [
    hero,
    blog,
    newsletter,
    shop,
    footer,
    premiumWidgets(ctx),
  ];
}

function buildCafeSite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  return [
    buildCafeHero(ctx),
    buildCafeInfoBar(ctx),
    buildCafeDailyMenu(ctx),
    buildCafeDigitalMenu(ctx),
    buildCafeCarta(ctx),
    ...(features.gallery ? [buildCafeGallery(ctx)] : []),
    ...(features.reviews ? [buildCafeReviews(ctx)] : []),
    ...(features.reservation || features.calendar ? [buildCafeBooking(ctx)] : []),
    ...(features.location || features.contact ? [buildCafeContact(ctx)] : []),
    ...(features.legalFooter || features.social ? [buildCafeFooter(ctx)] : []),
    buildCafeWidgets(ctx),
  ];
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
  accent: AccentColor;
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

  if (profile?.variant === 'foodblog') {
    return buildFoodBlogSite(ctx, features);
  }

  if (profile?.variant === 'cafe') {
    return buildCafeSite(ctx, features);
  }

  if (profile?.variant === 'beauty') {
    return buildBeautySite(ctx, features);
  }

  if (profile?.variant === 'corporate') {
    return buildCorporateSite(ctx, features);
  }

  if (profile?.variant === 'renewable') {
    return buildRenewableEnergySite(ctx, features);
  }

  if (profile?.variant === 'automotive') {
    return buildAutomotiveSite(ctx, features);
  }

  if (profile?.variant === 'luxury') {
    return buildLuxurySite(ctx, features);
  }

  if (profile?.variant === 'nonprofit') {
    return buildNonprofitSite(ctx, features);
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
    ? { hero: 'Inicio', menu: 'Menú', services: 'Servicios', gallery: 'Galería', reviews: 'Reseñas', location: 'Ubicación', about: 'Sobre nosotros', contact: 'Contacto', documents: 'Documentos seguros', sidebar: 'Sidebar', blog: 'Blog', footer: 'Footer legal', process: 'Proceso', faq: 'FAQ' }
    : { hero: 'Home', menu: 'Menu', services: 'Services', gallery: 'Gallery', reviews: 'Reviews', location: 'Location', about: 'About', contact: 'Contact', documents: 'Secure documents', sidebar: 'Sidebar', blog: 'Blog', footer: 'Legal footer', process: 'Process', faq: 'FAQ' };

  const list = [labels.hero];
  if (features.sidebar) list.push(labels.sidebar);
  if (features.menu) list.push(labels.menu);
  else if (features.services) list.push(labels.services);
  if (features.about) list.push(labels.about);
  if (features.blog) list.push(labels.blog);
  if (features.gallery) list.push(labels.gallery);
  if (features.reviews) list.push(labels.reviews);
  if (features.location) list.push(labels.location);
  if (features.contact) list.push(labels.contact);
  if (features.documentUpload) list.push(labels.documents);
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
