import type { TemplateItem } from '../../data/templates';
import type { ParsedIntent, SiteFeatures } from './intentAnalyzer';
import { toStudioSections } from '../templatePages';
import type { StudioPreviewSection } from '../templatePages';
import type { ContentPreset } from './siteContent';
import type { TemplatePageSection } from '../templatePages';
import type { ServiceItem } from './siteContent';
import { getBusinessProfile, type AccentColor, type BusinessProfile } from './businessProfiles';
import type { ParsedGoogleListing } from './googleListingParser';
import { IMAGE_BANK } from './imageBank';
import { wrapSectionHtml } from './siteSectionWrap';

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
    'https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
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
  const phone = profile?.phone ?? '';
  const legalLinks = es
    ? [
        { href: '/legal', label: 'Aviso legal' },
        { href: '/privacidad', label: 'Política de privacidad' },
        { href: '/cookies', label: 'Política de cookies' },
        { href: '/datos', label: 'Protección de datos' },
      ]
    : [
        { href: '/legal', label: 'Legal notice' },
        { href: '/privacidad', label: 'Privacy policy' },
        { href: '/cookies', label: 'Cookie policy' },
        { href: '/datos', label: 'Data protection' },
      ];
  const navLinks = es
    ? ['Inicio', 'Servicios', 'Nosotros', 'Galería', 'Contacto', 'Ubicación']
    : ['Home', 'Services', 'About', 'Gallery', 'Contact', 'Location'];
  return {
    id: 'footer', type: 'footer', navLabelEs: 'Footer', navLabelEn: 'Footer',
    html: `<div class="bg-[#050810] text-slate-400 rounded-[2rem] p-10 md:p-16 border border-white/5">
      <div class="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto">
        <div class="md:col-span-1">
          <div class="font-serif text-xl text-white tracking-wide">${esc(name)}</div>
          <p class="mt-4 text-xs leading-relaxed text-slate-500">${esc((profile ? (es ? profile.aboutEs : profile.aboutEn) : '').slice(0, 120))}</p>
          <p class="mt-4 text-xs text-slate-500">📍 ${esc(address)}</p>
          ${phone ? `<p class="mt-2 text-xs text-amber-500/90">${esc(phone)}</p>` : ''}
        </div>
        <div>
          <h4 class="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-500/80 mb-4">${es ? 'Navegación' : 'Navigation'}</h4>
          <ul class="space-y-2 text-sm text-slate-500">${navLinks.map((l) => `<li><a href="#" class="hover:text-white transition-colors">${l}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h4 class="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-500/80 mb-4">${es ? 'Contacto' : 'Contact'}</h4>
          <ul class="space-y-2 text-xs text-slate-500">
            ${email ? `<li><a href="mailto:${esc(email)}" class="hover:text-amber-400 transition-colors">${esc(email)}</a></li>` : ''}
            <li>${es ? 'Madrid, España' : 'Madrid, Spain'}</li>
          </ul>
          <div class="mt-6 flex gap-3">
            <span class="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-slate-500 hover:border-amber-500/40 hover:text-amber-400 transition-colors cursor-pointer">in</span>
            <span class="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[10px] text-slate-500 hover:border-amber-500/40 hover:text-amber-400 transition-colors cursor-pointer">𝕏</span>
          </div>
        </div>
        <div>
          <h4 class="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-500/80 mb-4">${es ? 'Legal' : 'Legal'}</h4>
          <ul class="space-y-2 text-sm">${legalLinks.map((l) => `<li><a href="${l.href}" class="text-slate-500 hover:text-white transition-colors">${l.label}</a></li>`).join('')}</ul>
        </div>
      </div>
      <div class="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-wider uppercase text-slate-600">
        <span>© ${year} ${esc(name)}</span>
        <span>${es ? 'Asesoría premium · Madrid' : 'Premium advisory · Madrid'}</span>
      </div>
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

const PREMIUM_GESTORIA_CSS = `<style>
@keyframes cua-kenburns{0%{transform:scale(1.06) translateY(0)}100%{transform:scale(1.16) translateY(-1.5%)}}
@keyframes cua-fade-up{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
@keyframes cua-scroll{0%{transform:translateX(0)}100%{transform:translateX(calc(-50% - 0.75rem))}}
@keyframes cua-float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-10px) rotate(2deg)}}
@keyframes cua-shimmer{0%,100%{opacity:.35}50%{opacity:.75}}
.cua-hero-zoom{animation:cua-kenburns 24s ease-in-out infinite alternate}
.cua-fade-up{animation:cua-fade-up 1.15s cubic-bezier(.22,1,.36,1) both}
.cua-fade-d1{animation-delay:.18s}.cua-fade-d2{animation-delay:.36s}.cua-fade-d3{animation-delay:.54s}
.cua-carousel-track{display:flex;gap:1.25rem;width:max-content;animation:cua-scroll 50s linear infinite}
.cua-carousel-track:hover{animation-play-state:paused}
.cua-glass{background:rgba(255,255,255,.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08)}
.cua-btn-gold{background:linear-gradient(135deg,#b8922a 0%,#e8c547 45%,#c9a227 100%);transition:box-shadow .4s,transform .3s}
.cua-btn-gold:hover{box-shadow:0 0 32px rgba(201,162,39,.45);transform:translateY(-1px)}
.cua-btn-ghost{border:1px solid rgba(255,255,255,.35);transition:background .3s,border-color .3s,transform .3s}
.cua-btn-ghost:hover{background:rgba(255,255,255,.06);border-color:rgba(201,162,39,.55);transform:translateY(-1px)}
.cua-particle{position:absolute;border-radius:50%;background:rgba(201,162,39,.25);animation:cua-float 6s ease-in-out infinite}
.cua-reveal{opacity:0;transform:translateY(20px);transition:opacity .8s ease,transform .8s ease}
</style>`;

function premiumGestoriaServices(es: boolean, images: readonly string[]) {
  const list = es
    ? [
        ['Asesoría fiscal', 'Planificación tributaria y cumplimiento normativo', '◆'],
        ['Asesoría laboral', 'Nóminas, contratos y relaciones laborales', '◇'],
        ['Contabilidad avanzada', 'Informes financieros y cuentas anuales', '◈'],
        ['Gestión empresarial', 'Control de gestión y reporting ejecutivo', '◆'],
        ['Creación de empresas', 'Constitución, estatutos y puesta en marcha', '◇'],
        ['Consultoría estratégica', 'Crecimiento, financiación y decisiones clave', '◈'],
      ]
    : [
        ['Tax advisory', 'Tax planning and regulatory compliance', '◆'],
        ['Labor advisory', 'Payroll, contracts and labor relations', '◇'],
        ['Advanced accounting', 'Financial reports and annual accounts', '◈'],
        ['Business management', 'Management control and executive reporting', '◆'],
        ['Company formation', 'Incorporation, bylaws and launch', '◇'],
        ['Strategic consulting', 'Growth, financing and key decisions', '◈'],
      ];
  return list.map(([title, desc, icon], i) => ({
    title, desc, icon, image: images[i % images.length] ?? images[0],
  }));
}

function buildPremiumDocumentUpload(ctx: BuildCtx): TemplatePageSection {
  const { lang, name } = ctx;
  const es = lang === 'es';
  return {
    id: 'documents', type: 'contact', navLabelEs: 'Documentos', navLabelEn: 'Documents',
    html: `<div class="bg-[#050810] rounded-[2rem] p-10 md:p-16 border border-white/5 max-w-5xl mx-auto">
      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-400 text-[10px] tracking-[0.2em] uppercase">🔒 ${es ? 'Envío seguro' : 'Secure upload'}</span>
        <h2 class="mt-6 text-3xl md:text-4xl font-serif font-light text-white">${es ? 'Documentación encriptada' : 'Encrypted documentation'}</h2>
        <p class="mt-4 text-slate-400 text-sm max-w-xl mx-auto">${es ? `Transfiere nóminas, facturas o modelos fiscales a ${name} con cifrado extremo a extremo.` : `Transfer payroll, invoices or tax forms to ${name} with end-to-end encryption.`}</p>
      </div>
      <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <div class="cua-glass rounded-2xl p-10 text-center border-dashed border-amber-500/20">
          <div class="text-4xl opacity-60">📄</div>
          <p class="mt-4 text-sm text-slate-400">${es ? 'Arrastra PDF, Excel o ZIP' : 'Drag PDF, Excel or ZIP'}</p>
          <span class="mt-6 inline-block px-6 py-3 cua-btn-gold text-[#050810] text-xs font-bold tracking-wider uppercase rounded-lg cursor-pointer">${es ? 'Seleccionar archivos' : 'Select files'}</span>
        </div>
        <div class="space-y-4">
          <div class="cua-glass rounded-xl px-4 py-3.5 text-sm text-slate-500">${es ? 'Referencia / NIF' : 'Reference / Tax ID'}</div>
          <div class="cua-glass rounded-xl px-4 py-3.5 text-sm text-slate-500">${es ? 'Email de confirmación' : 'Confirmation email'}</div>
          <div class="px-6 py-4 bg-emerald-700/80 hover:bg-emerald-600 text-white font-semibold text-center rounded-xl text-sm tracking-wide transition-colors cursor-pointer">${es ? 'Enviar con cifrado AES-256' : 'Send with AES-256 encryption'}</div>
        </div>
      </div>
    </div>`,
  };
}

function buildPremiumGestoriaSite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  const { name, heroImage, tagline, profile, lang, ctaPrimary, ctaSecondary, images } = ctx;
  const es = lang === 'es';
  const phone = profile?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');
  const reviews = profile ? (es ? profile.reviews.es : profile.reviews.en) : [];
  const aboutText = profile ? (es ? profile.aboutEs : profile.aboutEn) : '';
  const heroHeadline = es ? 'Tu tranquilidad financiera empieza aquí' : 'Your financial peace of mind starts here';
  const bank = IMAGE_BANK.corporate;
  const galleryImgs: readonly string[] = images.length >= 6 ? images : bank.gallery;
  const services = premiumGestoriaServices(es, galleryImgs);
  const navItems = es
    ? ['Inicio', 'Servicios', 'Nosotros', 'Galería', 'Contacto', 'Ubicación']
    : ['Home', 'Services', 'About', 'Gallery', 'Contact', 'Location'];
  const officeImg = bank.office[0] ?? heroImage;

  const hero: TemplatePageSection = {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `${PREMIUM_GESTORIA_CSS}
    <div class="overflow-hidden rounded-[2rem] shadow-2xl border border-white/5 bg-[#050810]">
      <div class="bg-[#050810]/95 backdrop-blur-md border-b border-white/5 text-slate-400 text-[11px] tracking-wider px-6 md:px-10 py-2.5 flex flex-wrap justify-between gap-2">
        <span>${es ? 'Asesoría integral · Fiscal · Laboral · Contable' : 'Full advisory · Tax · Labor · Accounting'}</span>
        ${phone ? `<a href="tel:+34${phoneDigits}" class="text-amber-400/90 hover:text-amber-300 transition-colors font-medium">📞 ${esc(phone)}</a>` : ''}
      </div>
      <nav class="bg-[#050810]/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-5 border-b border-white/5" aria-label="${es ? 'Navegación principal' : 'Main navigation'}">
        <div class="font-serif text-xl md:text-2xl text-white tracking-wide">${esc(name)}</div>
        <div class="hidden lg:flex gap-10 text-[10px] tracking-[0.25em] uppercase text-slate-500 font-medium">
          ${navItems.map((n) => `<span class="hover:text-amber-400 transition-colors cursor-pointer">${n}</span>`).join('')}
        </div>
        <span class="px-5 py-2.5 cua-btn-gold text-[#050810] text-[10px] font-bold tracking-[0.15em] uppercase rounded-lg cursor-pointer">${esc(ctaPrimary)}</span>
      </nav>
      <div class="relative min-h-[580px] md:min-h-[680px] flex items-center justify-center text-center overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <img src="${bank.skyline ?? heroImage}" alt="Madrid" class="absolute inset-0 w-full h-full object-cover cua-hero-zoom opacity-90" loading="eager" referrerpolicy="no-referrer" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-b from-[#050810]/70 via-[#0a1628]/75 to-[#050810]/95"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#050810]/40 via-transparent to-[#050810]/40"></div>
        <span class="cua-particle w-1 h-1 top-[20%] left-[15%]" style="animation-delay:0s"></span>
        <span class="cua-particle w-1.5 h-1.5 top-[35%] right-[20%]" style="animation-delay:1.2s"></span>
        <span class="cua-particle w-1 h-1 bottom-[30%] left-[25%]" style="animation-delay:2.4s"></span>
        <span class="cua-particle w-2 h-2 top-[15%] right-[35%] opacity-40" style="animation-delay:0.8s"></span>
        <div class="relative z-10 px-6 py-20 max-w-4xl mx-auto">
          <span class="cua-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-[10px] tracking-[0.2em] uppercase mb-8">${profile ? esc(es ? profile.badgeEs : profile.badgeEn) : 'Madrid · Premium'}</span>
          <h1 class="cua-fade-up cua-fade-d1 text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white tracking-tight leading-[1.08]">${esc(heroHeadline)}</h1>
          <p class="cua-fade-up cua-fade-d2 mt-8 text-base md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-light">${esc(tagline)}</p>
          <div class="cua-fade-up cua-fade-d3 mt-12 flex flex-wrap justify-center gap-4">
            <span class="px-8 py-4 cua-btn-gold text-[#050810] rounded-lg font-bold text-xs tracking-[0.15em] uppercase cursor-pointer">${esc(ctaPrimary)}</span>
            <span class="px-8 py-4 cua-btn-ghost text-white rounded-lg font-semibold text-xs tracking-[0.15em] uppercase cursor-pointer">${esc(ctaSecondary)}</span>
          </div>
          <p class="mt-14 text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-slate-600">${es ? 'Madrid · Confianza · Innovación · Exclusividad' : 'Madrid · Trust · Innovation · Exclusivity'}</p>
        </div>
      </div>
    </div>`,
  };

  const stats: TemplatePageSection = {
    id: 'stats', type: 'about', navLabelEs: 'Confianza', navLabelEn: 'Trust',
    html: `<div class="bg-[#0a1628] rounded-[2rem] p-12 md:p-20 border border-white/5">
      <p class="text-center text-[10px] tracking-[0.35em] uppercase text-amber-500/70 mb-3">${es ? 'Por qué elegirnos' : 'Why choose us'}</p>
      <h2 class="text-center text-3xl md:text-4xl font-serif font-light text-white mb-14">${es ? 'Números que representan confianza' : 'Numbers that represent trust'}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-4xl mx-auto divide-y md:divide-y-0 md:divide-x divide-white/10">
        ${[
          { v: '+20', l: es ? 'Años de experiencia' : 'Years of experience' },
          { v: '+500', l: es ? 'Clientes satisfechos' : 'Satisfied clients' },
          { v: '+99%', l: es ? 'Tranquilidad empresarial' : 'Business peace of mind' },
        ].map((s) => `<div class="py-10 md:py-6 px-8 text-center">
          <div class="text-5xl md:text-6xl font-serif font-light text-amber-400 tracking-tight">${s.v}</div>
          <div class="mt-3 text-[10px] tracking-[0.25em] uppercase text-slate-500">${s.l}</div>
        </div>`).join('')}
      </div>
    </div>`,
  };

  const servicesSec: TemplatePageSection = {
    id: 'services', type: 'services', navLabelEs: 'Servicios', navLabelEn: 'Services',
    html: `<div class="bg-[#050810] rounded-[2rem] p-12 md:p-20 border border-white/5">
      <p class="text-[10px] tracking-[0.35em] uppercase text-amber-500/70 mb-3">${es ? 'Áreas de expertise' : 'Areas of expertise'}</p>
      <h2 class="text-3xl md:text-5xl font-serif font-light text-white max-w-2xl">${es ? 'Servicios de asesoría premium' : 'Premium advisory services'}</h2>
      <p class="mt-4 text-slate-400 max-w-xl text-sm leading-relaxed">${es ? 'Soluciones integrales con el rigor de una firma financiera internacional.' : 'Integrated solutions with the rigor of an international financial firm.'}</p>
      <div class="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${services.map((s, i) => `<article class="group cua-glass rounded-2xl p-8 hover:border-amber-500/25 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,.4)]" style="animation:cua-fade-up .8s ease both;animation-delay:${(i * 0.08).toFixed(2)}s">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg group-hover:scale-110 transition-transform duration-500">${s.icon}</div>
          <h3 class="mt-6 font-serif text-lg text-white">${esc(s.title)}</h3>
          <p class="mt-2 text-sm text-slate-500 leading-relaxed">${esc(s.desc)}</p>
          <span class="mt-6 inline-block text-[10px] tracking-[0.2em] uppercase text-amber-500/80 group-hover:text-amber-400 transition-colors">${es ? 'Más información →' : 'Learn more →'}</span>
        </article>`).join('')}
      </div>
    </div>`,
  };

  const about: TemplatePageSection = {
    id: 'about', type: 'about', navLabelEs: 'Nosotros', navLabelEn: 'About',
    html: `<div class="bg-white rounded-[2rem] p-12 md:p-20 border border-slate-100">
      <div class="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
        <div>
          <p class="text-[10px] tracking-[0.35em] uppercase text-slate-400 mb-4">${es ? 'Nuestra firma' : 'Our firm'}</p>
          <h2 class="text-3xl md:text-4xl font-serif font-light text-[#050810]">${es ? 'Excelencia con trato personal' : 'Excellence with a personal touch'}</h2>
          <p class="mt-6 text-slate-600 leading-relaxed text-sm md:text-base">${esc(aboutText ?? '')}</p>
          <div class="mt-10 space-y-4">${(es ? ['Más de 20 años de trayectoria en Madrid', 'Especialistas en autónomos, PYMES y patrimonio', 'Respuesta garantizada en 24 horas'] : ['Over 20 years serving Madrid', 'Specialists in freelancers, SMEs and wealth', 'Guaranteed response within 24 hours']).map((f) => `<div class="flex items-start gap-3 text-sm text-slate-700"><span class="text-amber-600 mt-0.5">—</span>${f}</div>`).join('')}</div>
        </div>
        <div class="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
          <img src="${bank.team ?? heroImage}" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]" loading="lazy" referrerpolicy="no-referrer" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#050810]/60 to-transparent"></div>
        </div>
      </div>
    </div>`,
  };

  const officeSec: TemplatePageSection = {
    id: 'office', type: 'gallery', navLabelEs: 'Oficina', navLabelEn: 'Office',
    html: `<div class="relative rounded-[2rem] overflow-hidden min-h-[420px] md:min-h-[520px] border border-white/5">
      <img src="${officeImg}" alt="${es ? 'Oficinas premium' : 'Premium offices'}" class="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[2s]" loading="lazy" referrerpolicy="no-referrer" />
      <div class="absolute inset-0 bg-gradient-to-r from-[#050810]/90 via-[#050810]/50 to-transparent"></div>
      <div class="relative z-10 p-12 md:p-20 max-w-xl">
        <p class="text-[10px] tracking-[0.35em] uppercase text-amber-400/80 mb-4">${es ? 'Sede Madrid' : 'Madrid HQ'}</p>
        <h2 class="text-3xl md:text-4xl font-serif font-light text-white leading-snug">${es ? 'Un espacio creado para tomar mejores decisiones.' : 'A space designed for better decisions.'}</h2>
        <p class="mt-6 text-slate-400 text-sm leading-relaxed">${es ? 'Oficinas con cristalera, luz natural y vistas que inspiran claridad estratégica.' : 'Offices with glass façades, natural light and views that inspire strategic clarity.'}</p>
      </div>
    </div>`,
  };

  const carouselImgs = [...galleryImgs, ...galleryImgs];
  const gallerySec: TemplatePageSection = {
    id: 'gallery', type: 'gallery', navLabelEs: 'Galería', navLabelEn: 'Gallery',
    html: `<div class="bg-[#0a1628] rounded-[2rem] p-12 md:p-16 border border-white/5 overflow-hidden">
      <div class="flex justify-between items-end mb-10 max-w-6xl mx-auto">
        <div>
          <p class="text-[10px] tracking-[0.35em] uppercase text-amber-500/70 mb-2">${es ? 'Nuestro entorno' : 'Our environment'}</p>
          <h2 class="text-2xl md:text-3xl font-serif font-light text-white">${es ? 'Galería corporativa' : 'Corporate gallery'}</h2>
        </div>
        <div class="hidden md:flex gap-2">
          <span class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:border-amber-500/40 hover:text-amber-400 transition-colors cursor-pointer">←</span>
          <span class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:border-amber-500/40 hover:text-amber-400 transition-colors cursor-pointer">→</span>
        </div>
      </div>
      <div class="overflow-hidden -mx-4 px-4">
        <div class="cua-carousel-track">
          ${carouselImgs.map((img, i) => `<div class="shrink-0 w-[280px] md:w-[360px] group">
            <div class="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/5 shadow-xl transition-transform duration-500 group-hover:scale-[1.03] group-hover:-translate-y-1">
              <img src="${img}" alt="${es ? 'Galería' : 'Gallery'} ${i + 1}" class="w-full h-full object-cover" loading="lazy" referrerpolicy="no-referrer" />
              <div class="absolute inset-0 bg-gradient-to-t from-[#050810]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>`,
  };

  const reviewMeta = es
    ? ['Directora, Pyme tecnológica', 'CEO, Grupo inmobiliario', 'Fundador, startup']
    : ['Director, Tech SME', 'CEO, Real estate group', 'Founder, startup'];
  const reviewsSec: TemplatePageSection = {
    id: 'reviews', type: 'reviews', navLabelEs: 'Testimonios', navLabelEn: 'Testimonials',
    html: `<div class="bg-white rounded-[2rem] p-12 md:p-20 border border-slate-100">
      <p class="text-center text-[10px] tracking-[0.35em] uppercase text-slate-400 mb-3">${profile ? esc(es ? profile.ratingLabelEs : profile.ratingLabelEn) : '4.9 · Google'}</p>
      <h2 class="text-center text-3xl md:text-4xl font-serif font-light text-[#050810] mb-14">${es ? 'Lo que dicen nuestros clientes' : 'What our clients say'}</h2>
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        ${reviews.map((r, i) => {
          const initials = r.name.replace(/[^A-ZÁÉÍÓÚ]/gi, '').slice(0, 2).toUpperCase() || 'CL';
          return `<article class="relative p-8 md:p-10 border border-slate-100 rounded-2xl hover:shadow-lg transition-shadow duration-500 bg-slate-50/50">
            <span class="absolute top-6 right-8 text-5xl font-serif text-amber-200/80 leading-none">"</span>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-[#050810] text-amber-400 flex items-center justify-center text-xs font-bold">${initials}</div>
              <div>
                <div class="font-semibold text-[#050810] text-sm">${esc(r.name)}</div>
                <div class="text-[10px] tracking-wider uppercase text-slate-400 mt-0.5">${reviewMeta[i] ?? reviewMeta[0]}</div>
              </div>
            </div>
            <p class="mt-6 text-slate-600 text-sm leading-relaxed italic">"${esc(r.text)}"</p>
            <div class="mt-4 text-amber-500 text-xs">${'★'.repeat(r.stars)}</div>
          </article>`;
        }).join('')}
      </div>
    </div>`,
  };

  const contact: TemplatePageSection = {
    id: 'contact', type: 'contact', navLabelEs: 'Contacto', navLabelEn: 'Contact',
    html: `<div class="bg-[#050810] rounded-[2rem] p-12 md:p-20 border border-white/5 max-w-5xl mx-auto">
      <div class="grid md:grid-cols-2 gap-12">
        <div>
          <p class="text-[10px] tracking-[0.35em] uppercase text-amber-500/70 mb-4">${es ? 'Contacto' : 'Contact'}</p>
          <h2 class="text-3xl font-serif font-light text-white">${es ? 'Hablemos de tu próximo paso' : 'Let\'s talk about your next step'}</h2>
          <div class="mt-8 space-y-4 text-sm text-slate-400">
            <p>📍 ${esc(profile ? (es ? profile.addressEs : profile.addressEn) : '')}</p>
            <p>🕐 ${esc(profile ? (es ? profile.hoursEs : profile.hoursEn) : '')}</p>
            ${phone ? `<p class="text-amber-400 font-medium">📞 ${esc(phone)}</p>` : ''}
            ${profile?.email ? `<p><a href="mailto:${esc(profile.email)}" class="text-amber-400/90 hover:text-amber-300">${esc(profile.email)}</a></p>` : ''}
          </div>
        </div>
        <div class="space-y-4">
          <div class="cua-glass rounded-xl px-4 py-3.5 text-sm text-slate-500">${es ? 'Tu nombre' : 'Your name'}</div>
          <div class="cua-glass rounded-xl px-4 py-3.5 text-sm text-slate-500">${es ? 'Tu email' : 'Your email'}</div>
          <div class="cua-glass rounded-xl px-4 py-3.5 text-sm text-slate-500 h-28">${es ? 'Tu consulta...' : 'Your enquiry...'}</div>
          <div class="px-6 py-4 cua-btn-gold text-[#050810] font-bold text-center rounded-xl text-xs tracking-[0.15em] uppercase cursor-pointer">${es ? 'Enviar consulta' : 'Send enquiry'}</div>
        </div>
      </div>
    </div>`,
  };

  const footer = buildCorporateLegalFooter(ctx);

  return [
    hero,
    stats,
    servicesSec,
    about,
    officeSec,
    ...(features.gallery ? [gallerySec] : []),
    ...(features.reviews ? [reviewsSec] : []),
    ...(features.location ? [buildLocation(ctx)] : []),
    ...(features.contact ? [contact] : []),
    ...(features.documentUpload ? [buildPremiumDocumentUpload(ctx)] : []),
    ...(features.legalFooter || features.social ? [footer] : []),
    premiumWidgets(ctx, true),
  ];
}

function buildCorporateSite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  return buildPremiumGestoriaSite(ctx, features);
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
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 md:px-10 py-4 border-b border-slate-100">
        <div class="font-serif font-bold text-base sm:text-lg text-slate-900 min-w-0 break-words shrink-0 max-w-[45%] sm:max-w-none">${esc(name)}</div>
        <div class="cua-nav-desktop hidden md:flex gap-4 lg:gap-6 text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-slate-500 font-medium">${nav.map((n) => `<span class="whitespace-nowrap">${n}</span>`).join('')}</div>
        <div class="cua-nav-mobile hidden gap-2 overflow-x-auto max-w-full text-[9px] tracking-[0.12em] uppercase text-slate-500 font-medium order-last w-full md:order-none md:w-auto">${nav.map((n) => `<span class="whitespace-nowrap shrink-0 px-1">${n}</span>`).join('')}</div>
        ${phone ? `<span class="text-xs sm:text-sm font-medium text-slate-700 shrink-0">📞 ${esc(profile!.phone!)}</span>` : ''}
      </div>
      <div class="relative cua-hero-minh min-h-[480px] md:min-h-[540px] flex items-center overflow-hidden">
        <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/30"></div>
        <div class="relative z-10 cua-hero-pad p-6 sm:p-10 md:p-16 max-w-4xl w-full">
          <span class="inline-block px-4 py-1.5 ${accentBg(accent)} text-white text-xs font-bold tracking-widest uppercase rounded-full">${esc(badge)}</span>
          ${rating ? `<div class="mt-4 inline-flex flex-wrap items-center gap-2 text-amber-400 text-sm font-semibold"><span>★★★★★</span><span class="text-slate-200">${esc(rating)}</span></div>` : ''}
          <h1 class="cua-hero-title mt-6 text-3xl sm:text-4xl md:text-6xl font-bold font-serif text-white tracking-tight leading-tight drop-shadow-lg break-words">${esc(name)}</h1>
          <p class="mt-5 text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl font-light">${esc(tagline)}</p>
          <div class="cua-cta-row mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
            <span class="px-6 sm:px-8 py-3.5 sm:py-4 ${accentBg(accent)} text-white rounded-xl text-sm font-semibold shadow-lg text-center">${esc(ctaPrimary)}</span>
            <span class="px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-white/80 text-white rounded-xl text-sm font-medium text-center">${esc(ctaSecondary)}</span>
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
    html: `<div class="bg-slate-50 border border-slate-200 rounded-[2rem] cua-section-pad p-6 sm:p-10 md:p-16">
      <h2 class="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-slate-900">${es ? 'Visítanos' : 'Visit us'}</h2>
      <p class="mt-3 text-base sm:text-lg text-slate-600">${es ? `Te esperamos en ${esc(name)}.` : `We look forward to seeing you at ${esc(name)}.`}</p>
      <div class="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 cua-grid-2col gap-8 sm:gap-10">
        <div class="space-y-6 min-w-0">
          <div><div class="font-semibold text-slate-900">${es ? 'Dirección' : 'Address'}</div><p class="text-slate-600 mt-1">${esc(address)}</p></div>
          ${phone ? `<div><div class="font-semibold text-slate-900">${es ? 'Teléfono' : 'Phone'}</div><p class="text-slate-600 mt-1"><a href="tel:+34${phoneDigits}" class="text-indigo-600 font-medium">${esc(phone)}</a></p></div>` : ''}
          <div><div class="font-semibold text-slate-900">${es ? 'Horario' : 'Hours'}</div><p class="text-slate-600 mt-1">${esc(hours)}</p></div>
          ${info ? `<div><div class="font-semibold text-slate-900">${es ? 'Información' : 'Info'}</div><p class="text-slate-600 mt-1">${esc(info)}</p></div>` : ''}
        </div>
        <div class="cua-map-wrap rounded-2xl overflow-hidden border border-slate-200 shadow-md min-h-[240px] sm:min-h-[280px] w-full">
          <iframe title="${es ? 'Mapa' : 'Map'}" src="https://maps.google.com/maps?q=${encodeURIComponent(address)}&amp;output=embed" class="w-full h-full min-h-[240px] sm:min-h-[280px] border-0" loading="lazy" referrerpolicy="no-referrer"></iframe>
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
    html: `<div class="bg-white border border-slate-200 rounded-[2rem] cua-section-pad p-6 sm:p-10 md:p-16 shadow-sm">
      <h2 class="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-slate-900">${es ? 'Contacto' : 'Contact'}</h2>
      <p class="mt-4 text-base sm:text-lg text-slate-600">${esc(subtitle)}</p>
      <div class="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 cua-contact-grid gap-4 max-w-2xl w-full">
        <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500">${es ? 'Nombre' : 'Name'}</div>
        <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500">Email</div>
        <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500">${es ? 'Teléfono' : 'Phone'}</div>
        <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500">${es ? 'Asunto' : 'Subject'}</div>
        <div class="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-500 h-28">${es ? 'Mensaje' : 'Message'}</div>
        <div class="sm:col-span-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-base font-semibold text-center">${es ? 'Enviar mensaje' : 'Send message'}</div>
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
            <p class="mt-2">${profile?.variant === 'cafe' ? (es ? 'Metro: Puente de Vallecas (Línea 1)' : 'Metro: Puente de Vallecas (Line 1)') : profile?.variant === 'italian' ? (es ? 'Metro: Antón Martín (Línea 1) · 3 min' : 'Metro: Antón Martín (Line 1) · 3 min') : (es ? 'Transporte público cercano' : 'Nearby public transport')}</p>
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

function buildItalianHero(ctx: BuildCtx): TemplatePageSection {
  const { heroImage, tagline, ctaPrimary, ctaSecondary, profile, lang, name } = ctx;
  const es = lang === 'es';
  const rating = profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : '4.8 · 312 reseñas';
  const phone = profile?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');
  const nav = es
    ? ['Inicio', 'Carta', 'Vinos', 'Reservas', 'Galería', 'Ubicación']
    : ['Home', 'Menu', 'Wines', 'Booking', 'Gallery', 'Location'];
  return {
    id: 'hero', type: 'hero', navLabelEs: 'Inicio', navLabelEn: 'Home',
    html: `<div class="bg-[#fdf8f3] overflow-hidden rounded-[2rem] shadow-xl border border-amber-100">
      <div class="flex flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-5 border-b border-amber-100">
        <div class="font-serif font-semibold text-xl md:text-2xl text-stone-900 tracking-tight">${esc(name)}</div>
        <div class="hidden lg:flex gap-8 text-[11px] tracking-[0.2em] uppercase text-stone-500 font-medium">
          ${nav.map((n) => `<span>${n}</span>`).join('')}
        </div>
        ${phone ? `<div class="flex items-center gap-3 ml-auto">
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-full">WhatsApp</span>
          <span class="inline-flex items-center gap-2 text-sm font-medium text-stone-700">📞 <a href="tel:+34${phoneDigits}">${esc(phone)}</a></span>
        </div>` : ''}
      </div>
      <div class="relative min-h-[480px] md:min-h-[560px] flex items-center justify-center text-center">
        <img src="${heroImage}" alt="${esc(name)}" class="absolute inset-0 w-full h-full object-cover" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-gradient-to-b from-stone-950/55 via-stone-950/45 to-stone-950/80"></div>
        <div class="relative z-10 px-6 py-16 max-w-3xl mx-auto">
          <p class="text-amber-300/95 text-xl md:text-2xl font-serif italic">${esc(tagline)}</p>
          <h1 class="mt-4 text-5xl md:text-7xl font-bold font-serif text-white tracking-tight drop-shadow-lg">${esc(name)}</h1>
          <div class="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-stone-950/70 backdrop-blur rounded-full border border-white/10">
            <span class="text-amber-400 text-sm">★★★★★</span>
            <span class="text-white/90 text-sm font-medium">${esc(rating)}</span>
          </div>
          <div class="mt-10 flex flex-wrap justify-center gap-4">
            <span class="px-10 py-4 bg-amber-800 hover:bg-amber-700 text-white rounded-md text-sm font-bold tracking-[0.12em] uppercase shadow-lg">${esc(ctaPrimary)}</span>
            <span class="px-10 py-4 bg-white text-stone-900 rounded-md text-sm font-bold tracking-[0.12em] uppercase shadow-lg">${esc(ctaSecondary)}</span>
          </div>
        </div>
      </div>
    </div>`,
  };
}

function buildItalianInfoBar(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const address = profile ? (es ? profile.addressEs : profile.addressEn) : '';
  const hours = profile ? (es ? profile.hoursEs : profile.hoursEn) : '';
  const services = es
    ? ['Pasta fresca diaria', 'Vinos italianos DOC', 'Terraza']
    : ['Fresh pasta daily', 'Italian DOC wines', 'Terrace'];
  return {
    id: 'about', type: 'about', navLabelEs: 'Info', navLabelEn: 'Info',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-14 border border-amber-100 shadow-sm">
      <div class="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto divide-y md:divide-y-0 md:divide-x divide-amber-100">
        <div class="text-center px-4 pt-4 md:pt-0">
          <h3 class="font-serif font-bold text-amber-900 text-lg">${es ? 'Ubicación' : 'Location'}</h3>
          <p class="mt-4 text-stone-600 text-sm leading-relaxed">${esc(address)}</p>
          <span class="mt-4 inline-block text-amber-800 text-sm font-medium">${es ? 'Cómo llegar →' : 'Get directions →'}</span>
        </div>
        <div class="text-center px-4 pt-8 md:pt-0">
          <h3 class="font-serif font-bold text-amber-900 text-lg">${es ? 'Horario' : 'Hours'}</h3>
          <p class="mt-4 text-stone-600 text-sm leading-relaxed">${esc(hours)}</p>
        </div>
        <div class="text-center px-4 pt-8 md:pt-0">
          <h3 class="font-serif font-bold text-amber-900 text-lg">${es ? 'Especialidades' : 'Specialties'}</h3>
          <div class="mt-4 space-y-2">${services.map((s) => `<div class="text-stone-600 text-sm">🍝 ${esc(s)}</div>`).join('')}</div>
        </div>
      </div>
    </div>`,
  };
}

function buildItalianCarta(ctx: BuildCtx): TemplatePageSection {
  const es = ctx.lang === 'es';
  type Dish = { name: string; price: string; desc: string };
  const antipasti: Dish[] = es
    ? [
        { name: 'Bruschetta al pomodoro', price: '8,50 €', desc: 'Pan tostado, tomate San Marzano, albahaca fresca y aceite de oliva virgen extra.' },
        { name: 'Carpaccio di manzo', price: '12,90 €', desc: 'Láminas finas de ternera, rúcula, parmigiano reggiano y vinagreta de limón.' },
        { name: 'Burrata con tomate cherry', price: '11,50 €', desc: 'Burrata cremosa de Puglia con tomates confitados y pesto de albahaca.' },
      ]
    : [
        { name: 'Bruschetta al pomodoro', price: '€8.50', desc: 'Toasted bread, San Marzano tomatoes, fresh basil and extra virgin olive oil.' },
        { name: 'Beef carpaccio', price: '€12.90', desc: 'Thin beef slices, arugula, Parmigiano Reggiano and lemon vinaigrette.' },
        { name: 'Burrata with cherry tomatoes', price: '€11.50', desc: 'Creamy Puglia burrata with confit tomatoes and basil pesto.' },
      ];
  const primi: Dish[] = es
    ? [
        { name: 'Spaghetti alla Carbonara', price: '14,50 €', desc: 'Guanciale crujiente, yema de huevo, pecorino romano y pimienta negra.' },
        { name: 'Tagliatelle al ragù bolognese', price: '13,90 €', desc: 'Pasta fresca con ragù cocinado 6 horas a fuego lento.' },
        { name: 'Risotto ai funghi porcini', price: '15,50 €', desc: 'Arborio cremoso con setas porcini, mantequilla y parmigiano.' },
        { name: 'Lasagna della nonna', price: '13,50 €', desc: 'Capas de pasta casera, ragù, bechamel y gratinado al forno.' },
      ]
    : [
        { name: 'Spaghetti alla Carbonara', price: '€14.50', desc: 'Crispy guanciale, egg yolk, Pecorino Romano and black pepper.' },
        { name: 'Tagliatelle al ragù bolognese', price: '€13.90', desc: 'Fresh pasta with ragù slow-cooked for 6 hours.' },
        { name: 'Porcini mushroom risotto', price: '€15.50', desc: 'Creamy Arborio with porcini, butter and Parmigiano.' },
        { name: 'Nonna\'s lasagna', price: '€13.50', desc: 'Homemade pasta layers, ragù, béchamel and oven-gratin.' },
      ];
  const secondi: Dish[] = es
    ? [
        { name: 'Saltimbocca alla romana', price: '18,90 €', desc: 'Ternera con prosciutto, salvia y vino blanco.' },
        { name: 'Pollo alla cacciatora', price: '16,50 €', desc: 'Pollo guisado con tomate, aceitunas y hierbas provenzales.' },
        { name: 'Branzino al forno', price: '19,90 €', desc: 'Lubina al horno con patatas, limón y aceite de oliva.' },
      ]
    : [
        { name: 'Saltimbocca alla romana', price: '€18.90', desc: 'Veal with prosciutto, sage and white wine.' },
        { name: 'Pollo alla cacciatora', price: '€16.50', desc: 'Braised chicken with tomato, olives and herbs.' },
        { name: 'Oven-baked sea bass', price: '€19.90', desc: 'Sea bass with potatoes, lemon and olive oil.' },
      ];
  const dolci: Dish[] = es
    ? [
        { name: 'Tiramisù della casa', price: '6,50 €', desc: 'Mascarpone, café espresso y cacao amargo.' },
        { name: 'Panna cotta', price: '5,90 €', desc: 'Con coulis de frutos rojos.' },
        { name: 'Cannoli siciliani', price: '6,90 €', desc: 'Masa crujiente rellena de ricotta y pistachos.' },
      ]
    : [
        { name: 'House tiramisù', price: '€6.50', desc: 'Mascarpone, espresso coffee and bitter cocoa.' },
        { name: 'Panna cotta', price: '€5.90', desc: 'With red berry coulis.' },
        { name: 'Sicilian cannoli', price: '€6.90', desc: 'Crisp shell filled with ricotta and pistachios.' },
      ];
  const col = (title: string, items: Dish[]) => `<div>
    <h3 class="font-serif font-bold text-amber-900 text-xl pb-3 border-b-2 border-amber-800/30">${title}</h3>
    <div class="mt-6 space-y-6">${items.map((i) => `<div>
      <div class="flex justify-between gap-4"><span class="font-semibold text-stone-900">${esc(i.name)}</span><span class="font-bold text-amber-800 whitespace-nowrap">${esc(i.price)}</span></div>
      <p class="mt-1 text-sm text-stone-500">${esc(i.desc)}</p>
    </div>`).join('')}</div>
  </div>`;
  return {
    id: 'menu', type: 'menu', navLabelEs: 'Carta', navLabelEn: 'Menu',
    html: `<div class="bg-[#fdf8f3] rounded-[2rem] p-10 md:p-16 border border-amber-100 shadow-sm">
      ${cafeHeadingLight(es ? 'La Nostra Carta' : 'Our Menu', es ? 'Cocina italiana auténtica con ingredientes frescos y recetas tradicionales' : 'Authentic Italian cuisine with fresh ingredients and traditional recipes')}
      <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        ${col(es ? '🥗 Antipasti' : '🥗 Antipasti', antipasti)}
        ${col(es ? '🍝 Primi Piatti' : '🍝 Primi Piatti', primi)}
        ${col(es ? '🍖 Secondi Piatti' : '🍖 Secondi Piatti', secondi)}
        ${col(es ? '🍮 Dolci' : '🍮 Dolci', dolci)}
      </div>
      <div class="mt-12 text-center"><span class="inline-block px-8 py-3 border-2 border-amber-800 text-amber-900 font-semibold rounded-md text-sm tracking-wide uppercase">${es ? 'Ver carta de vinos' : 'View wine list'}</span></div>
    </div>`,
  };
}

function buildItalianGallery(ctx: BuildCtx): TemplatePageSection {
  const { images, lang } = ctx;
  const es = lang === 'es';
  return {
    id: 'gallery', type: 'gallery', navLabelEs: 'Galería', navLabelEn: 'Gallery',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-amber-100">
      ${cafeHeadingLight(es ? 'Galería' : 'Gallery', es ? 'Nuestros platos, la pasta fresca y el ambiente de la trattoria' : 'Our dishes, fresh pasta and trattoria atmosphere')}
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        ${images.slice(0, 6).map((img) => `<div class="rounded-xl overflow-hidden shadow-md aspect-[4/3]"><img src="${img}" alt="" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" referrerpolicy="no-referrer" /></div>`).join('')}
      </div>
    </div>`,
  };
}

function buildItalianReviews(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const reviews = profile ? (es ? profile.reviews.es : profile.reviews.en) : [];
  const rating = profile ? (es ? profile.ratingLabelEs : profile.ratingLabelEn) : '';
  const initials = (n: string) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return {
    id: 'reviews', type: 'reviews', navLabelEs: 'Reseñas', navLabelEn: 'Reviews',
    html: `<div class="bg-[#fdf8f3] rounded-[2rem] p-10 md:p-16 border border-amber-100">
      ${cafeHeadingLight(es ? 'Reseñas' : 'Reviews', es ? 'Lo que dicen nuestros comensales' : 'What our guests say')}
      <div class="text-center -mt-8 mb-10"><span class="text-amber-500">★★★★★</span> <span class="text-stone-500 text-sm ml-2">${esc(rating ?? '')}</span></div>
      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        ${reviews.map((r) => `<div class="bg-white rounded-xl p-8 shadow-sm border-l-4 border-amber-800 relative">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-bold">${initials(r.name)}</div>
            <div><div class="font-serif font-bold text-stone-900 text-sm">${esc(r.name)}</div><div class="text-xs text-stone-400">${es ? 'Cliente verificado' : 'Verified guest'}</div></div>
          </div>
          <p class="mt-5 text-stone-600 text-sm leading-relaxed italic">"${esc(r.text)}"</p>
          <div class="mt-4 text-amber-500 text-sm">${'★'.repeat(r.stars)}</div>
        </div>`).join('')}
      </div>
    </div>`,
  };
}

function buildItalianBooking(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const phone = profile?.phone ?? '';
  return {
    id: 'reservation', type: 'reservation', navLabelEs: 'Reservas', navLabelEn: 'Booking',
    html: `<div class="bg-white rounded-[2rem] overflow-hidden border border-amber-200 shadow-lg max-w-5xl mx-auto">
      <div class="grid md:grid-cols-2">
        <div class="bg-stone-950 text-white p-10 md:p-12 flex flex-col justify-center">
          <h2 class="text-3xl font-serif font-bold">${es ? 'Reserva tu Mesa' : 'Book your Table'}</h2>
          <p class="mt-4 text-stone-400 text-sm leading-relaxed">${es ? 'Disfruta de una experiencia italiana auténtica. Confirmación inmediata.' : 'Enjoy an authentic Italian experience. Instant confirmation.'}</p>
          <ul class="mt-8 space-y-3 text-sm text-stone-300">${(es ? ['Confirmación inmediata', 'Cancelación gratuita hasta 2h antes', 'Mesa en terraza bajo petición'] : ['Instant confirmation', 'Free cancellation up to 2h before', 'Terrace table on request']).map((b) => `<li>✅ ${b}</li>`).join('')}</ul>
          ${phone ? `<div class="mt-10 p-5 bg-stone-900 rounded-xl border border-stone-800">
            <div class="text-xs text-stone-500 uppercase tracking-wider">${es ? 'O reserva por teléfono' : 'Or book by phone'}</div>
            <div class="mt-2 text-xl font-bold text-amber-400">📞 ${esc(phone)}</div>
          </div>` : ''}
        </div>
        <div class="p-10 md:p-12 bg-white space-y-5">
          <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Fecha' : 'Date'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">dd/mm/aaaa 📅</div></div>
          <div class="grid grid-cols-2 gap-4">
            <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Hora' : 'Time'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">${es ? 'Seleccionar' : 'Select'}</div></div>
            <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Personas' : 'Guests'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">${es ? 'Seleccionar' : 'Select'}</div></div>
          </div>
          <div><label class="text-[10px] font-bold tracking-widest uppercase text-stone-400">${es ? 'Teléfono' : 'Phone'}</label><div class="mt-2 border border-stone-200 rounded-lg px-4 py-3 text-sm text-stone-400">+34 600 000 000</div></div>
          <div class="px-6 py-4 bg-amber-800 text-white font-serif font-bold text-center rounded-md tracking-wide">${es ? 'Confirmar Reserva' : 'Confirm Booking'}</div>
          <p class="text-[10px] text-stone-400 text-center">${es ? 'Al reservar aceptas nuestra Política de Privacidad.' : 'By booking you accept our Privacy Policy.'}</p>
        </div>
      </div>
    </div>`,
  };
}

function buildItalianContact(ctx: BuildCtx): TemplatePageSection {
  const { profile, lang } = ctx;
  const es = lang === 'es';
  const address = profile ? (es ? profile.addressEs : profile.addressEn) : '';
  const phone = profile?.phone ?? '';
  const phoneDigits = phone.replace(/\D/g, '');
  const email = profile?.email ?? 'reservas@trattoriabella.es';
  return {
    id: 'location', type: 'location', navLabelEs: 'Ubicación', navLabelEn: 'Location',
    html: `<div class="bg-white rounded-[2rem] p-10 md:p-16 border border-amber-100">
      <div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 class="text-3xl font-serif font-bold text-stone-900">${es ? 'Ubicación' : 'Location'}</h2>
          <div class="mt-6 p-6 bg-[#fdf8f3] rounded-xl border border-amber-100">
            <div class="font-semibold text-stone-900">📍 ${es ? 'Dirección' : 'Address'}</div>
            <p class="mt-2 text-stone-600 text-sm">${esc(address)}</p>
            <span class="mt-3 inline-block text-amber-800 text-sm font-medium">${es ? 'Abrir en Google Maps →' : 'Open in Google Maps →'}</span>
          </div>
          <div class="mt-6 text-sm text-stone-600">
            <div class="font-semibold text-stone-900">🚇 ${es ? 'Cómo llegar' : 'Getting here'}</div>
            <p class="mt-2">${es ? 'Metro: Antón Martín (Línea 1) · 3 min a pie' : 'Metro: Antón Martín (Line 1) · 3 min walk'}</p>
          </div>
          <div class="mt-6 rounded-xl overflow-hidden border border-amber-100 min-h-[220px]">
            <iframe title="Mapa" src="https://maps.google.com/maps?q=${encodeURIComponent(address)}&amp;output=embed" class="w-full min-h-[220px] border-0" loading="lazy" referrerpolicy="no-referrer"></iframe>
          </div>
        </div>
        <div>
          <h2 class="text-3xl font-serif font-bold text-stone-900">${es ? 'Contacto' : 'Contact'}</h2>
          <div class="mt-6 space-y-5">
            ${phone ? `<div class="flex items-center gap-4"><span class="text-2xl">📞</span><div><div class="text-xs text-stone-400 uppercase">${es ? 'Teléfono' : 'Phone'}</div><a href="tel:+34${phoneDigits}" class="text-amber-800 font-semibold">${esc(phone)}</a></div></div>` : ''}
            <div class="flex items-center gap-4"><span class="text-2xl">💬</span><div><div class="text-xs text-stone-400 uppercase">WhatsApp</div><span class="text-amber-800 font-semibold">${es ? 'Enviar mensaje' : 'Send message'}</span></div></div>
            <div class="flex items-center gap-4"><span class="text-2xl">✉️</span><div><div class="text-xs text-stone-400 uppercase">Email</div><span class="text-amber-800 font-semibold">${esc(email)}</span></div></div>
          </div>
        </div>
      </div>
    </div>`,
  };
}

function buildItalianFooter(ctx: BuildCtx): TemplatePageSection {
  const { name, lang, profile } = ctx;
  const es = lang === 'es';
  const year = new Date().getFullYear();
  const about = profile ? (es ? profile.aboutEs : profile.aboutEn) : '';
  return {
    id: 'footer', type: 'footer', navLabelEs: 'Footer', navLabelEn: 'Footer',
    html: `<div class="bg-stone-950 text-stone-400 rounded-[2rem] p-10 md:p-16">
      <div class="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        <div><h3 class="text-white font-serif font-bold text-xl">${esc(name)}</h3><p class="mt-4 text-sm leading-relaxed">${esc(about?.slice(0, 140) ?? '')}</p></div>
        <div><h4 class="text-white text-xs font-bold tracking-[0.2em] uppercase">${es ? 'Explorar' : 'Explore'}</h4><div class="mt-4 space-y-2 text-sm">${(es ? ['Inicio', 'Carta', 'Vinos', 'Reservas', 'Galería', 'Ubicación'] : ['Home', 'Menu', 'Wines', 'Booking', 'Gallery', 'Location']).map((l) => `<div>${l}</div>`).join('')}</div></div>
        <div><h4 class="text-white text-xs font-bold tracking-[0.2em] uppercase">Legal</h4><div class="mt-4 space-y-2 text-sm underline"><div>Aviso Legal</div><div>Política de Privacidad</div><div>Política de Cookies</div></div></div>
      </div>
      <div class="mt-10 pt-6 border-t border-stone-800 text-center text-xs">© ${year} ${esc(name)}. ${es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</div>
    </div>`,
  };
}

function buildItalianSite(ctx: BuildCtx, features: SiteFeatures): TemplatePageSection[] {
  return [
    buildItalianHero(ctx),
    buildItalianInfoBar(ctx),
    ...(features.about ? [buildAbout(ctx)] : []),
    ...(features.menu ? [buildItalianCarta(ctx)] : []),
    ...(features.gallery ? [buildItalianGallery(ctx)] : []),
    ...(features.reviews ? [buildItalianReviews(ctx)] : []),
    ...(features.reservation || features.calendar ? [buildItalianBooking(ctx)] : []),
    ...(features.location || features.contact ? [buildItalianContact(ctx)] : []),
    ...(features.legalFooter || features.social ? [buildItalianFooter(ctx)] : []),
    buildCafeWidgets(ctx),
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

function finalizeSiteSections(sections: TemplatePageSection[]): TemplatePageSection[] {
  return sections.map((s) => ({ ...s, html: wrapSectionHtml(s.html) }));
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
    return finalizeSiteSections(buildTattooSite(ctx, features));
  }

  if (profile?.variant === 'foodblog') {
    return finalizeSiteSections(buildFoodBlogSite(ctx, features));
  }

  if (profile?.variant === 'cafe') {
    return finalizeSiteSections(buildCafeSite(ctx, features));
  }

  if (profile?.variant === 'italian') {
    return finalizeSiteSections(buildItalianSite(ctx, features));
  }

  if (profile?.variant === 'beauty') {
    return finalizeSiteSections(buildBeautySite(ctx, features));
  }

  if (profile?.variant === 'corporate') {
    return finalizeSiteSections(buildCorporateSite(ctx, features));
  }

  if (profile?.variant === 'renewable') {
    return finalizeSiteSections(buildRenewableEnergySite(ctx, features));
  }

  if (profile?.variant === 'automotive') {
    return finalizeSiteSections(buildAutomotiveSite(ctx, features));
  }

  if (profile?.variant === 'luxury') {
    return finalizeSiteSections(buildLuxurySite(ctx, features));
  }

  if (profile?.variant === 'nonprofit') {
    return finalizeSiteSections(buildNonprofitSite(ctx, features));
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

  return finalizeSiteSections(sections);
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

export function isCorporatePreviewSite(sections: { html: string }[]): boolean {
  const blob = sections.map((s) => s.html).join(' ');
  return /gestor|asesor|Asesoría|Ledger|fiscal|laboral|contable|blue-900|blue-950|#050810|cua-btn-gold|Solicitar consulta|Solicitar asesoramiento/i.test(blob);
}

export function extractPreviewBusinessName(sections: { type: string; html: string }[]): string {
  const hero = sections.find((s) => s.type === 'hero')?.html ?? '';
  const fromNav = hero.match(/font-serif[^>]*>([^<]+)/)?.[1]?.trim()
    ?? hero.match(/font-bold text-xl[^>]*>([^<]+)/)?.[1]?.trim()
    ?? hero.match(/font-bold[^>]*>([^<]+)/)?.[1]?.trim();
  if (fromNav && fromNav.length < 80) return fromNav;
  const fromH1 = hero.match(/<h1[^>]*>([^<]+)/)?.[1]?.trim();
  if (fromH1 && !/tranquilidad|peace of mind/i.test(fromH1)) return fromH1;
  return 'Ledger Asesores';
}

function inferCorporateFeaturesFromPreview(sections: { type: string; html: string }[]): SiteFeatures {
  const blob = sections.map((s) => s.html).join(' ');
  return {
    menu: false,
    services: true,
    about: sections.some((s) => s.type === 'about'),
    blog: false,
    gallery: sections.some((s) => s.type === 'gallery'),
    reviews: sections.some((s) => s.type === 'reviews'),
    location: /Visítanos|Visit us|google\.com\/maps/i.test(blob),
    contact: sections.some((s) => s.type === 'contact'),
    reservation: false,
    calendar: false,
    legalFooter: sections.some((s) => s.type === 'footer'),
    social: true,
    whatsapp: true,
    scrollUp: true,
    sidebar: false,
    documentUpload: /encriptada|encrypted|documentos/i.test(blob),
    vividColors: false,
  };
}

export function rebuildCorporatePreviewSections(
  sections: { id: number; type: string; html: string }[],
  lang: 'es' | 'en'
): StudioPreviewSection[] {
  const name = extractPreviewBusinessName(sections);
  const profile = getBusinessProfile('corporate');
  const features = inferCorporateFeaturesFromPreview(sections);
  const ctx: BuildCtx = {
    name,
    businessType: lang === 'es' ? profile.typeEs : profile.typeEn,
    tagline: lang === 'es' ? profile.taglineEs : profile.taglineEn,
    badge: lang === 'es' ? profile.badgeEs : profile.badgeEn,
    heroImage: profile.heroImage,
    ctaPrimary: lang === 'es' ? profile.ctaPrimaryEs : profile.ctaPrimaryEn,
    ctaSecondary: lang === 'es' ? profile.ctaSecondaryEs : profile.ctaSecondaryEn,
    services: [],
    images: profile.galleryImages,
    lang,
    profile,
    accent: profile.accent,
  };
  return toStudioSections(buildPremiumGestoriaSite(ctx, features));
}

export function applyVisualEnhancement(html: string, kind: 'elegante' | 'luminosa' | 'tipografia' | 'animacion' | 'hero'): string {
  return applyStrongVisualEnhancement(html, kind);
}

const STUDIO_SUGGESTION_CSS = `<style>
@keyframes cua-s-in{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes cua-s-glow{0%,100%{box-shadow:0 0 0 rgba(99,102,241,0)}50%{box-shadow:0 0 48px rgba(99,102,241,.25)}}
.cua-s-reveal{animation:cua-s-in 1s cubic-bezier(.22,1,.36,1) both}
.cua-s-hover{transition:transform .6s cubic-bezier(.22,1,.36,1),box-shadow .6s ease}
.cua-s-hover:hover{transform:translateY(-4px);box-shadow:0 24px 48px rgba(15,23,42,.12)}
</style>`;

/** Transformaciones visibles para sugerencias del Studio (debe notarse al instante). */
export function applyStrongVisualEnhancement(html: string, kind: 'elegante' | 'luminosa' | 'tipografia' | 'animacion' | 'hero'): string {
  let out = html;
  const injectCss = !out.includes('cua-s-in');

  if (kind === 'elegante' || kind === 'tipografia') {
    out = out
      .replace(/text-3xl/g, 'text-4xl')
      .replace(/text-4xl md:text-6xl/g, 'text-5xl md:text-7xl')
      .replace(/text-5xl md:text-7xl/g, 'text-6xl md:text-[5.25rem]')
      .replace(/font-semibold/g, 'font-bold font-serif tracking-tight')
      .replace(/rounded-\[2rem\]/g, 'rounded-[3rem]')
      .replace(/rounded-\[2\.5rem\]/g, 'rounded-[3rem]')
      .replace(/rounded-2xl/g, 'rounded-3xl')
      .replace(/border border-slate-200/g, 'border border-slate-200/90 shadow-2xl shadow-slate-300/30')
      .replace(/bg-stone-50/g, 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/30')
      .replace(/bg-white(?![\/\w])/g, 'bg-gradient-to-br from-white to-slate-50/80')
      .replace(/py-10 md:p-16/g, 'py-16 md:p-20')
      .replace(/py-10/g, 'py-16')
      .replace(/p-10 md:p-16/g, 'p-12 md:p-20')
      .replace(/text-blue-900/g, 'text-indigo-950')
      .replace(/bg-blue-800/g, 'bg-indigo-700')
      .replace(/bg-blue-900/g, 'bg-slate-950');
    if (!out.includes('cua-s-hover')) {
      out = out.replace(/<div class="/g, '<div class="cua-s-hover ');
    }
  }

  if (kind === 'luminosa') {
    const isHero = /min-h-\[520px\]|min-h-\[560px\]|min-h-\[600px\]|min-h-\[640px\]/.test(out) && out.includes('object-cover');
    if (!isHero) {
      out = out
        .replace(/bg-slate-950/g, 'bg-white')
        .replace(/bg-\[#050810\]/g, 'bg-slate-50')
        .replace(/bg-\[#0a1628\]/g, 'bg-indigo-50/40')
        .replace(/bg-slate-900 text-white/g, 'bg-white border-2 border-slate-100 text-slate-900 shadow-xl')
        .replace(/text-slate-300/g, 'text-slate-600')
        .replace(/text-white(?![\/\w])/g, 'text-slate-900')
        .replace(/bg-white\/10/g, 'bg-white border border-slate-200 shadow-sm');
    }
    out = out
      .replace(/bg-stone-50/g, 'bg-white')
      .replace(/border-slate-800/g, 'border-slate-200')
      .replace(/shadow-sm/g, 'shadow-lg shadow-slate-200/60');
  }

  if (kind === 'animacion') {
    if (!out.includes('cua-s-reveal')) {
      out = out.replace(/<div class="/, '<div class="cua-s-reveal ');
    }
    out = out.replace(/class="/g, 'class="cua-s-hover transition-all duration-700 ');
  }

  if (kind === 'hero') {
    out = out
      .replace(/min-h-\[420px\]/g, 'min-h-[620px]')
      .replace(/min-h-\[480px\]/g, 'min-h-[640px]')
      .replace(/min-h-\[520px\]/g, 'min-h-[680px]')
      .replace(/min-h-\[560px\]/g, 'min-h-[720px]')
      .replace(/min-h-\[580px\]/g, 'min-h-[720px]')
      .replace(/min-h-\[600px\]/g, 'min-h-[740px]')
      .replace(/text-4xl md:text-6xl/g, 'text-5xl md:text-8xl')
      .replace(/text-5xl md:text-7xl/g, 'text-6xl md:text-[5.5rem]')
      .replace(/py-16 md:py-24/g, 'py-24 md:py-32')
      .replace(/py-20/g, 'py-28');
    if (out.includes('object-cover') && !out.includes('cua-hero-overlay')) {
      out = out.replace(
        /(<div class="[^"]*relative[^"]*"[^>]*>)/,
        '$1<div class="cua-hero-overlay absolute inset-0 bg-gradient-to-b from-indigo-950/75 via-slate-900/45 to-slate-950/85 pointer-events-none z-[1]"></div>'
      );
    }
    if (!out.includes('scale-105') && out.includes('object-cover')) {
      out = out.replace(/object-cover opacity-25/g, 'object-cover opacity-40 scale-105');
      out = out.replace(/object-cover opacity-90/g, 'object-cover opacity-95 scale-105');
    }
  }

  if (injectCss && (kind === 'elegante' || kind === 'tipografia' || kind === 'animacion' || kind === 'hero')) {
    out = STUDIO_SUGGESTION_CSS + out;
  }

  return out.replace(/Laura Mendoza|Fundadora, Atelier|✓ Sección mejorada|✓ Section improved|✓ Cambio aplicado/g, '');
}
