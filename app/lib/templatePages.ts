import type { TemplateItem } from '../data/templates';
import type { ServiceItem } from './ai/siteContent';

export interface TemplatePageSection {
  id: string;
  type: string;
  navLabelEs: string;
  navLabelEn: string;
  html: string;
}

export interface StudioPreviewSection {
  id: number;
  type: string;
  html: string;
}

export interface TemplateCustomization {
  businessName?: string;
  tagline?: string;
  services?: ServiceItem[];
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export function buildTemplateSections(
  tpl: TemplateItem,
  lang: 'es' | 'en',
  customization?: TemplateCustomization
): TemplatePageSection[] {
  const name = customization?.businessName ?? (lang === 'es' ? tpl.nameEs : tpl.nameEn);
  const category = lang === 'es' ? tpl.categoryEs : tpl.categoryEn;
  const desc = customization?.tagline ?? (lang === 'es' ? tpl.descEs : tpl.descEn);

  const nav = lang === 'es'
    ? { home: 'Inicio', services: 'Servicios', gallery: 'Galería', contact: 'Contacto' }
    : { home: 'Home', services: 'Services', gallery: 'Gallery', contact: 'Contact' };

  const ctaPrimary = customization?.ctaPrimary ?? (lang === 'es' ? 'Ver colección' : 'View collection');
  const ctaSecondary = customization?.ctaSecondary ?? (lang === 'es' ? 'Reservar / Contactar' : 'Book / Contact');

  const defaultServices: ServiceItem[] = customization?.services ?? [1, 2, 3].map((i) => ({
    title: lang === 'es' ? `Servicio ${i}` : `Service ${i}`,
    desc: lang === 'es' ? 'Experiencia premium adaptada a tu negocio.' : 'Premium experience tailored to your business.',
  }));

  return [
    {
      id: 'hero',
      type: 'hero',
      navLabelEs: nav.home,
      navLabelEn: nav.home,
      html: `<div class="relative min-h-[420px] bg-slate-900 text-white overflow-hidden rounded-[2rem]">
        <img src="${tpl.image}" alt="${name}" class="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div class="relative z-10 p-10 md:p-16 flex flex-col justify-end min-h-[420px]">
          <div class="text-xs tracking-[3px] text-slate-300 uppercase">${category}</div>
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight mt-3 leading-none">${name}</h1>
          <p class="mt-4 text-lg text-slate-200 max-w-xl">${desc}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <span class="px-6 py-3 bg-white text-slate-900 rounded-2xl text-sm font-semibold">${ctaPrimary}</span>
            <span class="px-6 py-3 border border-white/40 rounded-2xl text-sm">${ctaSecondary}</span>
          </div>
        </div>
      </div>`,
    },
    {
      id: 'services',
      type: 'services',
      navLabelEs: nav.services,
      navLabelEn: nav.services,
      html: `<div class="bg-white border border-slate-200 rounded-[2rem] p-10 md:p-14">
        <h2 class="text-3xl font-semibold tracking-tight text-slate-900">${lang === 'es' ? 'Nuestros servicios' : 'Our services'}</h2>
        <p class="mt-3 text-slate-600 max-w-2xl">${desc}</p>
        <div class="mt-8 grid md:grid-cols-3 gap-5">
          ${defaultServices.map((svc) => `<div class="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <div class="text-sm font-bold text-indigo-600">${svc.title}</div>
            <p class="mt-2 text-sm text-slate-600">${svc.desc}</p>
          </div>`).join('')}
        </div>
      </div>`,
    },
    {
      id: 'gallery',
      type: 'gallery',
      navLabelEs: nav.gallery,
      navLabelEn: nav.gallery,
      html: `<div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-10 md:p-14">
        <h2 class="text-3xl font-semibold tracking-tight text-slate-900">${lang === 'es' ? 'Galería' : 'Gallery'}</h2>
        <div class="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          ${[tpl.image, tpl.image, tpl.image].map((img, i) => `<div class="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200">
            <img src="${img}" alt="" class="w-full h-full object-cover" />
          </div>`).join('')}
        </div>
      </div>`,
    },
    {
      id: 'contact',
      type: 'contact',
      navLabelEs: nav.contact,
      navLabelEn: nav.contact,
      html: `<div class="bg-slate-900 text-white rounded-[2rem] p-10 md:p-14">
        <h2 class="text-3xl font-semibold tracking-tight">${lang === 'es' ? 'Contacto' : 'Contact'}</h2>
        <p class="mt-3 text-slate-300">${lang === 'es' ? 'Cuéntanos tu proyecto y te respondemos en 24h.' : 'Tell us about your project — we reply within 24h.'}</p>
        <div class="mt-8 grid md:grid-cols-2 gap-4 max-w-xl">
          <div class="bg-white/10 rounded-xl px-4 py-3 text-sm">${lang === 'es' ? 'Nombre' : 'Name'}</div>
          <div class="bg-white/10 rounded-xl px-4 py-3 text-sm">Email</div>
          <div class="md:col-span-2 bg-white/10 rounded-xl px-4 py-3 text-sm h-24">${lang === 'es' ? 'Mensaje' : 'Message'}</div>
        </div>
      </div>`,
    },
  ];
}

export function toStudioSections(sections: TemplatePageSection[]): StudioPreviewSection[] {
  return sections.map((s, i) => ({
    id: 100 + i,
    type: s.type,
    html: s.html,
  }));
}
