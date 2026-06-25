'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import BeforeAfterDemo from '../components/BeforeAfterDemo';
import ModernizationPricing from '../components/ModernizationPricing';
import { useLanguage } from '../components/LanguageProvider';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

const t = {
  es: {
    badge: 'SERVICIO ESPECIAL',
    title: 'Modernización de Webs Antiguas',
    subtitle:
      'Tu web de 2015 no puede competir en 2026. Te mostramos el antes y el después antes de pagar nada — porque el cliente es quien manda.',
    demoLabel: 'TRANSFORMACIÓN REAL',
    demoTitle: 'Antes y Después interactivo',
    demoSubtitle: 'Arrastra el control. Así verás tu web renovada antes de contratar.',
    beforeTitle: 'Antes (2017)',
    beforeItems: [
      'Diseño obsoleto y poco profesional',
      'Sin versión móvil (no responsive)',
      'Textos desactualizados y sin SEO',
      'Carga lenta y baja conversión',
    ],
    afterTitle: 'Después (2026)',
    afterItems: [
      'Diseño premium de estudio',
      '100% adaptable a móvil y tablet',
      'Textos optimizados y SEO actualizado',
      '+340% visitas y mayor conversión',
    ],
    personasTitle: 'Un plan para cada persona',
    personasSubtitle: 'Individual, autónomo, empresa o web antigua: pagas solo lo que necesitas.',
    pricingLink: 'Ver todos los precios en /precios →',
    studioAltTitle: '¿Prefieres ver el resultado tú mismo?',
    studioAltDesc:
      'Abre el Studio gratis, pega la descripción de tu negocio y genera una preview en minutos. Si te gusta, contratas modernización completa o sigues editando con créditos.',
    studioAltCta: 'Probar preview gratis en Studio',
    howTitle: 'Cómo funciona',
    steps: [
      {
        title: 'Envíanos tu web actual',
        desc: 'URL o capturas. En 24h recibes diagnóstico + preview orientativa del resultado.',
      },
      {
        title: 'Apruebas el Antes/Después',
        desc: 'Ves la comparativa real en entorno privado. Solo pagas si te gusta lo que ves.',
      },
      {
        title: 'Entrega en 72 horas',
        desc: 'Web renovada, archivos listos, informe de mejoras y 3 meses de ajustes incluidos.',
      },
    ],
    benefitsTitle: 'Lo que te llevas',
    benefits: [
      'Antes y Después profesional — listo para redes y presentar a clientes',
      'Archivo Legacy de tu web antigua',
      'Migración de contenidos, textos e imágenes',
      '3 meses de ajustes menores sin coste',
      'Garantía: 50% de devolución si no quedas satisfecho',
      'Informe de mejora: velocidad, SEO y UX',
    ],
    deliveryLabel: 'CÓMO TE LO ENTREGAMOS',
    deliveryTitle: 'Proceso completo de entrega',
    deliverySteps: [
      { title: '1. Diagnóstico', desc: 'Analizamos URL + capturas. Informe en 24h con preview.' },
      { title: '2. Reconstrucción', desc: 'IA avanzada + supervisión de Ramón del Pozo Rott.' },
      { title: '3. Revisión privada', desc: '72h para ver el Antes/Después y pedir cambios.' },
      { title: '4. Entrega final', desc: 'Archivos listos para publicar + guía paso a paso.' },
    ],
    cta: 'Quiero ver cómo quedaría mi web',
    ctaNote: 'Respuesta personalizada en menos de 24h · Sin compromiso',
    guideLink: 'Consulta la guía completa →',
    supervised: 'SUPERVISADO POR',
    popular: 'MÁS ELEGIDO',
  },
  en: {
    badge: 'SPECIAL SERVICE',
    title: 'Old Website Modernization',
    subtitle:
      'Your 2015 site cannot compete in 2026. We show you before and after before you pay anything — because the customer comes first.',
    demoLabel: 'REAL TRANSFORMATION',
    demoTitle: 'Interactive Before & After',
    demoSubtitle: 'Drag the slider. This is how your renewed site will look before you hire us.',
    beforeTitle: 'Before (2017)',
    beforeItems: [
      'Outdated unprofessional design',
      'No mobile version (not responsive)',
      'Outdated copy without SEO',
      'Slow loading and low conversion',
    ],
    afterTitle: 'After (2026)',
    afterItems: [
      'Studio-grade premium design',
      '100% mobile and tablet ready',
      'Optimized copy and updated SEO',
      '+340% visits and higher conversion',
    ],
    personasTitle: 'A plan for every profile',
    personasSubtitle: 'Individual, freelancer, business or legacy site: pay only for what you need.',
    pricingLink: 'See all pricing at /precios →',
    studioAltTitle: 'Prefer to see the result yourself?',
    studioAltDesc:
      'Open Studio for free, describe your business and generate a preview in minutes. Like it? Hire full modernization or keep editing with credits.',
    studioAltCta: 'Try free preview in Studio',
    howTitle: 'How it works',
    steps: [
      {
        title: 'Send your current site',
        desc: 'URL or screenshots. Within 24h you get a diagnostic + indicative preview.',
      },
      {
        title: 'Approve Before/After',
        desc: 'See the real comparison in a private environment. Pay only if you like what you see.',
      },
      {
        title: 'Delivery in 72 hours',
        desc: 'Renewed site, ready files, improvement report and 3 months of adjustments.',
      },
    ],
    benefitsTitle: 'What you get',
    benefits: [
      'Professional Before/After — ready for social and clients',
      'Legacy Archive of your old site',
      'Content, copy and image migration',
      '3 months of minor adjustments at no cost',
      'Guarantee: 50% refund if not satisfied',
      'Improvement report: speed, SEO and UX',
    ],
    deliveryLabel: 'HOW WE DELIVER',
    deliveryTitle: 'Complete delivery process',
    deliverySteps: [
      { title: '1. Diagnostic', desc: 'We analyze URL + screenshots. Report in 24h with preview.' },
      { title: '2. Rebuild', desc: 'Advanced AI + supervision by Ramón del Pozo Rott.' },
      { title: '3. Private review', desc: '72h to see Before/After and request changes.' },
      { title: '4. Final delivery', desc: 'Files ready to publish + step-by-step guide.' },
    ],
    cta: 'I want to see how my site would look',
    ctaNote: 'Personalized response within 24h · No commitment',
    guideLink: 'Read the full guide →',
    supervised: 'SUPERVISED BY',
    popular: 'MOST POPULAR',
  },
} as const;

export default function Modernizacion() {
  const { lang } = useLanguage();
  const c = t[lang];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="container pt-16 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
            {c.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">{c.title}</h1>
          <p className="text-lg md:text-xl text-slate-600 mt-4 leading-relaxed">{c.subtitle}</p>
        </div>
      </div>

      {/* Before/After — above the fold priority */}
      <div className="container pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-xs font-semibold tracking-widest text-amber-600">{c.demoLabel}</div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-2">{c.demoTitle}</h2>
            <p className="text-slate-600 mt-1 text-sm">{c.demoSubtitle}</p>
          </div>
          <BeforeAfterDemo />
          <div className="mt-5 grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
              <div className="font-semibold text-red-800">{c.beforeTitle}</div>
              <ul className="mt-2 space-y-1 text-red-700/80 text-xs">
                {c.beforeItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <div className="font-semibold text-emerald-800">{c.afterTitle}</div>
              <ul className="mt-2 space-y-1 text-emerald-700/80 text-xs">
                {c.afterItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Persona plans — same block as /precios#modernizacion */}
      <div className="bg-slate-50 border-y border-slate-200 py-14">
        <div className="container max-w-6xl">
          <ModernizationPricing showDemoLink={false} />
          <p className="text-center mt-6">
            <Link href="/precios#modernizacion" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
              {c.pricingLink}
            </Link>
          </p>
        </div>
      </div>

      {/* Studio alternative */}
      <div className="container py-12 max-w-3xl">
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-8 text-center">
          <Sparkles className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold">{c.studioAltTitle}</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{c.studioAltDesc}</p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-semibold hover:bg-indigo-700 transition"
          >
            {c.studioAltCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="container pb-16 max-w-3xl">
        <div className="bg-slate-50 rounded-3xl p-8 md:p-10">
          <h3 className="font-semibold text-xl mb-6">{c.howTitle}</h3>
          <div className="space-y-6">
            {c.steps.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="w-8 h-8 shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-sm text-slate-600 mt-1">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 border border-amber-200 bg-amber-50 rounded-2xl">
          <div className="font-semibold text-lg mb-3 text-amber-900">{c.benefitsTitle}</div>
          <ul className="space-y-2 text-sm text-slate-700">
            {c.benefits.map((b) => (
              <li key={b} className="flex gap-2">
                <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 bg-white border border-slate-200 rounded-3xl p-8">
          <div className="text-center mb-6">
            <div className="text-xs font-semibold tracking-widest text-indigo-600">{c.deliveryLabel}</div>
            <h3 className="text-xl font-semibold mt-1">{c.deliveryTitle}</h3>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 text-sm">
            {c.deliverySteps.map((step) => (
              <div key={step.title}>
                <div className="font-semibold">{step.title}</div>
                <div className="text-slate-600 mt-1 text-xs leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/contacto" className="btn-gradient inline-block px-10 py-4 rounded-3xl text-lg font-semibold">
            {c.cta}
          </Link>
          <p className="text-xs text-slate-500 mt-3">{c.ctaNote}</p>
          <Link href="/guia" className="block mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            {c.guideLink}
          </Link>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow">
              <img src="/creador.webp" alt="Ramón del Pozo Rott" className="w-full h-full object-cover" />
            </div>
            <div className="text-[10px] text-slate-500 tracking-wider mt-2">{c.supervised}</div>
            <div className="text-sm font-medium text-slate-700">Ramón del Pozo Rott</div>
          </div>
        </div>
      </div>
    </div>
  );
}
