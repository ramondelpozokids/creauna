'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

const t = {
  es: {
    badge: 'SERVICIO PREMIUM',
    title: 'Web a Medida',
    subtitle: 'No quieres elegir una plantilla. Quieres que tu web sea única, diseñada exclusivamente según tus especificaciones.',
    bannerTitle: 'Tú solo tienes que decirnos qué quieres.',
    bannerText: 'Nosotros nos encargamos del resto con dirección creativa humana experta.',
    howTitle: '¿Cómo funciona?',
    steps: [
      { title: 'Reunión de briefing', desc: 'Nos reunimos para entender tu marca, tus objetivos y la estética que buscas transmitir.' },
      { title: 'Propuestas de diseño', desc: 'Te presentamos 2 propuestas visuales completamente diferenciadas en un plazo de 5 a 7 días.' },
      { title: 'Desarrollo e integración', desc: 'Programamos el diseño definitivo optimizando la carga, el SEO y la adaptabilidad móvil.' },
      { title: 'Entrega final', desc: 'Publicamos la web en tu dominio propio o te entregamos los archivos completos.' },
    ],
    includesTitle: '¿Qué incluye?',
    includes: [
      'Diseño exclusivo 100% a tu medida',
      'Textos escritos profesionalmente (Copywriting)',
      'Fotografía y visuales premium integrados',
      'Desarrollo técnico optimizado y adaptativo',
      'SEO On-Page básico y avanzado',
      'Garantía técnica y 3 meses de soporte incluidos',
    ],
    priceLabel: 'PRESUPUESTO ESTIMADO',
    price: 'Desde 2.900€',
    priceNote: 'Llave en mano. Sin cuotas de permanencia ni sorpresas.',
    cta: 'Solicitar proyecto a medida',
    ctaNote: 'Te contactaremos en menos de 24 horas',
  },
  en: {
    badge: 'PREMIUM SERVICE',
    title: 'Custom Web',
    subtitle: 'You do not want a template. You want your site to be unique, designed exclusively to your specifications.',
    bannerTitle: 'You just tell us what you want.',
    bannerText: 'We handle the rest with expert human creative direction.',
    howTitle: 'How does it work?',
    steps: [
      { title: 'Briefing meeting', desc: 'We meet to understand your brand, goals and the aesthetic you want to convey.' },
      { title: 'Design proposals', desc: 'We present 2 fully differentiated visual proposals within 5 to 7 days.' },
      { title: 'Development and integration', desc: 'We build the final design optimizing load time, SEO and mobile adaptability.' },
      { title: 'Final delivery', desc: 'We publish on your own domain or deliver the complete files.' },
    ],
    includesTitle: 'What is included?',
    includes: [
      '100% exclusive custom design',
      'Professionally written copy',
      'Integrated premium photography and visuals',
      'Optimized adaptive technical development',
      'Basic and advanced on-page SEO',
      'Technical warranty and 3 months of support included',
    ],
    priceLabel: 'ESTIMATED BUDGET',
    price: 'From €2,900',
    priceNote: 'Turnkey. No lock-in fees or surprises.',
    cta: 'Request custom project',
    ctaNote: 'We will contact you within 24 hours',
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

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-luxe p-8 rounded-[2.5rem] bg-white border border-slate-200">
            <h3 className="font-bold text-2xl tracking-tight text-slate-950 mb-6">{c.howTitle}</h3>
            <div className="space-y-5 text-sm text-slate-600">
              {c.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="font-bold text-indigo-600">{i + 1}.</span>
                  <div>
                    <span className="font-semibold text-slate-950 block">{step.title}</span>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-luxe p-8 rounded-[2.5rem] bg-white border border-slate-200">
            <h3 className="font-bold text-2xl tracking-tight text-slate-950 mb-6">{c.includesTitle}</h3>
            <ul className="space-y-4 text-sm text-slate-700">
              {c.includes.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-12 shadow-sm mb-16">
          <div className="text-slate-500 font-semibold tracking-wider text-xs uppercase">{c.priceLabel}</div>
          <div className="text-5xl font-bold tracking-tight text-slate-950 mt-2">{c.price}</div>
          <p className="text-slate-500 text-xs mt-1">{c.priceNote}</p>
          <div className="mt-8">
            <Link href="/contacto" className="btn-gradient px-12 py-4 rounded-2xl text-base font-semibold inline-flex items-center justify-center gap-2 cursor-pointer">
              {c.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-semibold uppercase">{c.ctaNote}</p>
        </div>
      </div>
    </div>
  );
}
