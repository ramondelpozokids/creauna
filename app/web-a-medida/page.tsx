'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { Sparkles, Check, ArrowRight, Euro, Clock, ShieldCheck } from 'lucide-react';

const t = {
  es: {
    badge: 'SERVICIO PREMIUM',
    title: 'Web a Medida',
    subtitle: 'Cuando tu marca necesita algo único que ninguna plantilla puede ofrecer. Precio cerrado, proceso claro, sin sorpresas.',
    bannerTitle: 'Tú defines la visión. Nosotros la construimos.',
    bannerText: 'Dirección creativa humana de Ramón del Pozo Rott, no solo IA. Un proyecto, un precio, un resultado espectacular.',
    studioVsTitle: '¿Studio o Web a Medida?',
    studioVsStudio: 'El Studio (desde 0€/mes) es ideal si partes de una plantilla y quieres refinarla tú mismo con IA. Cada cambio = 1 crédito (~0,16€ en Pro).',
    studioVsCustom: 'La Web a Medida (1.790€) es para marcas que necesitan diseño exclusivo premium, copy profesional, estructura a medida y entrega llave en mano sin tocar el Studio.',
    howTitle: 'Cómo funciona — paso a paso',
    steps: [
      { title: '1. Contacto y briefing (Día 0)', desc: 'Nos escribes en /contacto o por email. En 24h agendamos una reunión (videollamada o presencial) para entender tu negocio, público, referencias visuales y objetivos de conversión.' },
      { title: '2. Propuesta y presupuesto cerrado (Día 1–2)', desc: 'Recibes un documento con alcance, calendario y precio final: 1.790€ + IVA. Sin cuotas mensuales ni costes ocultos. Si encaja, firmamos y arrancamos.' },
      { title: '3. Diseño — 2 propuestas visuales (Día 3–10)', desc: 'Te presentamos 2 direcciones creativas completamente distintas (paleta, tipografía, estructura, mockups). Eliges una o fusionamos lo mejor de ambas.' },
      { title: '4. Desarrollo y contenidos (Día 11–25)', desc: 'Programamos el diseño aprobado, redactamos los textos, optimizamos imágenes, SEO on-page, velocidad y versión móvil. Revisiones incluidas.' },
      { title: '5. Entrega y publicación (Día 26–30)', desc: 'Publicamos en tu dominio o te entregamos archivos + acceso. Formación breve para que sepas gestionar contenidos básicos.' },
      { title: '6. Soporte 3 meses incluido', desc: 'Ajustes menores, correcciones y soporte técnico durante 90 días sin coste adicional.' },
    ],
    includesTitle: 'Qué incluye los 1.790€',
    includes: [
      'Diseño visual 100% exclusivo (sin plantilla)',
      'Hasta 8 secciones personalizadas (Inicio, Servicios, Sobre nosotros, Galería, Testimonios, Blog, Contacto, Legal)',
      'Copywriting profesional en español (textos persuasivos)',
      'Integración de fotografía y visuales premium',
      'Desarrollo responsive (móvil, tablet, escritorio)',
      'SEO on-page básico (títulos, meta, estructura)',
      'Formulario de contacto funcional',
      'Publicación en tu dominio o entrega de archivos',
      '3 meses de soporte y ajustes menores',
      'Propiedad total del diseño y código entregado',
    ],
    notIncludedTitle: 'Qué NO está incluido (presupuesto aparte)',
    notIncluded: [
      'Dominio y hosting (te orientamos; Business incluye 1 año)',
      'Fotografía de estudio o sesión profesional',
      'Tienda online / pasarela de pago compleja',
      'Mantenimiento mensual tras los 3 meses de soporte',
      'IVA (21% en España, se añade al precio)',
    ],
    priceLabel: 'PRECIO CERRADO',
    price: '1.790€',
    priceNote: '+ IVA · Pago único · Precio máximo web premium · Sin cuotas ocultas',
    priceBreakdown: 'Mismo precio tope que nuestro Rescate Premium en modernización: calidad de firma internacional a precio cerrado.',
    paymentTitle: 'Forma de pago',
    payment: '50% al confirmar el proyecto · 50% en la entrega final. Transferencia o tarjeta. Factura con IVA desglosado.',
    timeline: 'Plazo estimado: 4–6 semanas desde el briefing.',
    cta: 'Solicitar Web a Medida',
    ctaNote: 'Respuesta en menos de 24 horas · Sin compromiso en la primera consulta',
    studioLink: '¿Prefieres empezar con plantilla? Ir al Studio',
  },
  en: {
    badge: 'PREMIUM SERVICE',
    title: 'Custom Web',
    subtitle: 'When your brand needs something unique no template can deliver. Fixed price, clear process, no surprises.',
    bannerTitle: 'You define the vision. We build it.',
    bannerText: 'Human creative direction by Ramón del Pozo Rott, not just AI. One project, one price, one spectacular result.',
    studioVsTitle: 'Studio or Custom Web?',
    studioVsStudio: 'Studio (from €0/month) is ideal if you start from a template and refine it yourself with AI. Each change = 1 credit (~€0.16 on Pro).',
    studioVsCustom: 'Custom Web (€1,790) is for brands that need exclusive premium design, professional copy, custom structure and turnkey delivery without using Studio.',
    howTitle: 'How it works — step by step',
    steps: [
      { title: '1. Contact and briefing (Day 0)', desc: 'Write us at /contacto or email. Within 24h we schedule a call to understand your business, audience, visual references and conversion goals.' },
      { title: '2. Proposal and fixed quote (Day 1–2)', desc: 'You receive scope, timeline and final price: €1,790 + VAT. No monthly fees or hidden costs. If it fits, we sign and start.' },
      { title: '3. Design — 2 visual proposals (Day 3–10)', desc: 'We present 2 fully different creative directions (palette, typography, structure, mockups). You pick one or we merge the best of both.' },
      { title: '4. Development and content (Day 11–25)', desc: 'We build the approved design, write copy, optimize images, on-page SEO, speed and mobile. Revisions included.' },
      { title: '5. Delivery and launch (Day 26–30)', desc: 'We publish on your domain or deliver files + access. Short training so you can manage basic content.' },
      { title: '6. 3 months support included', desc: 'Minor adjustments, fixes and technical support for 90 days at no extra cost.' },
    ],
    includesTitle: 'What €1,790 includes',
    includes: [
      '100% exclusive visual design (no template)',
      'Up to 8 custom sections (Home, Services, About, Gallery, Testimonials, Blog, Contact, Legal)',
      'Professional copywriting in Spanish',
      'Premium photography and visual integration',
      'Responsive development (mobile, tablet, desktop)',
      'Basic on-page SEO (titles, meta, structure)',
      'Working contact form',
      'Launch on your domain or file delivery',
      '3 months support and minor adjustments',
      'Full ownership of design and delivered code',
    ],
    notIncludedTitle: 'What is NOT included (quoted separately)',
    notIncluded: [
      'Domain and hosting (we guide you; Business includes 1 year)',
      'Studio photography or professional shoot',
      'Online store / complex payment gateway',
      'Monthly maintenance after 3 months support',
      'VAT (added to price)',
    ],
    priceLabel: 'FIXED PRICE',
    price: '€1,790',
    priceNote: '+ VAT · One-time · Premium web price cap · No hidden fees',
    priceBreakdown: 'Same cap as our Premium Rescue modernization tier: international-grade quality at a fixed price.',
    paymentTitle: 'Payment terms',
    payment: '50% on project confirmation · 50% on final delivery. Bank transfer or card. Invoice with VAT breakdown.',
    timeline: 'Estimated timeline: 4–6 weeks from briefing.',
    cta: 'Request Custom Web',
    ctaNote: 'Reply within 24 hours · No commitment on first consultation',
    studioLink: 'Prefer starting with a template? Go to Studio',
  },
} as const;

export default function WebAMedida() {
  const { lang } = useLanguage();
  const c = t[lang];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />
      <div className="container pt-20 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-rose-500 text-white text-xs px-4 py-1.5 rounded-full font-bold tracking-wider uppercase mb-4 animate-fade-in shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            {c.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 mt-2 leading-[1.08] text-gradient">{c.title}</h1>
          <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">{c.subtitle}</p>
        </div>
      </div>

      <div className="container max-w-5xl px-6">
        <div className="relative rounded-[3rem] overflow-hidden h-[340px] mb-12 shadow-xl border border-slate-200">
          <img src="/publi.webp" alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{c.bannerTitle}</h2>
            <p className="mt-2 text-white/80 text-sm md:text-base">{c.bannerText}</p>
          </div>
        </div>

        <div className="card-luxe p-8 rounded-[2.5rem] bg-white border border-slate-200 mb-8">
          <h3 className="font-bold text-xl tracking-tight text-slate-950 mb-4">{c.studioVsTitle}</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
            <p className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">{c.studioVsStudio}</p>
            <p className="p-4 bg-slate-50 rounded-2xl border border-slate-200">{c.studioVsCustom}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-luxe p-8 rounded-[2.5rem] bg-white border border-slate-200 md:col-span-2">
            <h3 className="font-bold text-2xl tracking-tight text-slate-950 mb-6">{c.howTitle}</h3>
            <div className="space-y-5 text-sm text-slate-600">
              {c.steps.map((step, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition">
                  <div>
                    <span className="font-bold text-slate-950 block text-base">{step.title}</span>
                    <p className="mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-luxe p-8 rounded-[2.5rem] bg-white border border-slate-200">
            <h3 className="font-bold text-2xl tracking-tight text-slate-950 mb-6">{c.includesTitle}</h3>
            <ul className="space-y-3 text-sm text-slate-700">
              {c.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-luxe p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-2xl tracking-tight text-slate-950 mb-6">{c.notIncludedTitle}</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              {c.notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-slate-400 shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center bg-white border-2 border-indigo-100 rounded-[2.5rem] p-10 md:p-14 shadow-sm mb-8">
          <div className="text-slate-500 font-semibold tracking-wider text-xs uppercase flex items-center justify-center gap-2">
            <Euro className="w-4 h-4" />
            {c.priceLabel}
          </div>
          <div className="text-6xl font-bold tracking-tight text-slate-950 mt-3">{c.price}</div>
          <p className="text-slate-600 text-sm mt-2 font-medium">{c.priceNote}</p>
          <p className="text-slate-500 text-sm mt-4 max-w-lg mx-auto">{c.priceBreakdown}</p>

          <div className="mt-8 grid md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left text-sm">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                {c.paymentTitle}
              </div>
              <p className="text-slate-600">{c.payment}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                {lang === 'es' ? 'Plazo' : 'Timeline'}
              </div>
              <p className="text-slate-600">{c.timeline}</p>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/contacto" className="btn-gradient px-12 py-4 rounded-2xl text-base font-semibold inline-flex items-center justify-center gap-2 cursor-pointer">
              {c.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-semibold uppercase">{c.ctaNote}</p>
          <Link href="/studio" className="block mt-4 text-sm text-indigo-600 hover:underline font-medium">{c.studioLink}</Link>
        </div>
      </div>
    </div>
  );
}
