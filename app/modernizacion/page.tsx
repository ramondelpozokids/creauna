'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import BeforeAfterDemo from '../components/BeforeAfterDemo';

const t = {
  es: {
    badge: 'SERVICIO ESPECIAL',
    title: 'Modernización de Webs Antiguas',
    subtitle: '¿Tu web tiene 5, 8 o más años? La transformamos en una web moderna, rápida, bonita y profesional.',
    howTitle: 'Cómo funciona',
    steps: [
      { title: 'Envíanos tu web actual', desc: 'Solo necesitamos la URL o capturas de pantalla. Analizamos todo el contenido, estructura y SEO.' },
      { title: 'La reconstruimos desde cero con IA avanzada', desc: 'Diseño actual, textos optimizados, imágenes nuevas, velocidad y experiencia moderna bajo supervisión creativa humana.' },
      { title: 'Te entregamos la nueva web', desc: 'En menos de 72 horas recibes la web renovada en un entorno privado para revisar y pedir cambios.' },
    ],
    benefitsTitle: 'Lo que te llevas a cambio',
    benefitsIntro: 'No solo te entregamos una web nueva. Te damos un proceso completo de rescate de imagen:',
    benefits: [
      'Antes y Después profesional — Presentación comparativa lista para usar en redes o con clientes.',
      'Archivo Legacy — Versión elegante de tu web antigua como recuerdo o archivo histórico.',
      'Migración garantizada — Contenido, textos, imágenes y SEO transferidos correctamente.',
      '3 meses de ajustes incluidos — Cambios menores sin coste adicional.',
      'Garantía de satisfacción — Si no quedas contento, te devolvemos el 50% del importe.',
      'Informe de mejora — Métricas antes/después: velocidad, SEO y experiencia de usuario.',
    ],
    demoLabel: 'TRANSFORMACIÓN REAL',
    demoTitle: 'Antes y Después',
    demoSubtitle: 'Demo interactiva: arrastra para comparar la web antigua con el rediseño moderno',
    beforeTitle: 'Antes (2017)',
    beforeItems: ['Diseño obsoleto y poco profesional', 'Sin versión móvil (no responsive)', 'Textos desactualizados y sin SEO', 'Carga lenta y baja conversión'],
    afterTitle: 'Después (2026)',
    afterItems: ['Diseño premium de estudio', '100% adaptable a móvil y tablet', 'Textos optimizados y SEO actualizado', '+340% visitas y mayor conversión'],
    deliveryLabel: 'CÓMO TE LO ENTREGAMOS',
    deliveryTitle: 'El proceso completo de entrega',
    deliverySteps: [
      { title: '1. Revisión inicial', desc: 'Analizamos tu web actual (URL + capturas). Informe diagnóstico en 24h.' },
      { title: '2. Diseño y reconstrucción', desc: 'Creamos la nueva web con IA + supervisión creativa humana.' },
      { title: '3. Entrega y revisión', desc: 'Te entregamos la web en entorno privado. 72h para revisar y pedir cambios.' },
      { title: '4. Entrega final', desc: 'No subimos la web a tu dominio. Te entregamos todos los archivos y tú (o tu técnico) la publicáis donde queráis. Incluye guía básica de publicación.' },
    ],
    deliveryQ1: '¿Cómo lo recibes?',
    deliveryA1: 'Enlace privado de preview + paquete completo con Antes/Después, informe de mejoras y archivos listos para subir.',
    deliveryQ2: '¿En qué formato?',
    deliveryA2: 'Según cómo nos enviaste la web antigua (URL, ZIP, FTP…), te la devolvemos del mismo modo con la nueva versión.',
    includesTitle: '¿Qué incluye?',
    includes: ['Rediseño completo moderno', 'Textos actualizados y SEO', 'Imágenes profesionales nuevas', 'Versión móvil perfecta', 'Velocidad optimizada', 'Formularios y funcionalidades actuales'],
    pricingTitle: 'Precios de Modernización',
    plans: [
      { name: 'Rescate Digital — 890€', desc: 'Web nueva + Antes/Después + Archivo Legacy' },
      { name: 'Rescate Completo — 1.290€', desc: 'Todo lo anterior + guía de publicación + 3 meses de ajustes' },
      { name: 'Rescate Premium — 1.790€', desc: 'Todo + hosting 1 año + formación para que la gestiones tú' },
    ],
    cta: 'Solicitar presupuesto de modernización',
    ctaNote: 'Te enviaremos una propuesta personalizada en menos de 24h',
    guideLink: 'Consulta la guía completa →',
    supervised: 'SUPERVISADO POR',
  },
  en: {
    badge: 'SPECIAL SERVICE',
    title: 'Old Website Modernization',
    subtitle: 'Is your site 5, 8 or more years old? We transform it into a modern, fast, beautiful and professional website.',
    howTitle: 'How it works',
    steps: [
      { title: 'Send us your current site', desc: 'We only need the URL or screenshots. We analyze all content, structure and SEO.' },
      { title: 'We rebuild from scratch with advanced AI', desc: 'Current design, optimized copy, new images, speed and modern UX under human creative supervision.' },
      { title: 'We deliver your new site', desc: 'Within 72 hours you receive the renewed site in a private environment to review and request changes.' },
    ],
    benefitsTitle: 'What you get in return',
    benefitsIntro: 'We do not just deliver a new site. You get a complete image rescue process:',
    benefits: [
      'Professional Before & After — Comparison ready for social media or clients.',
      'Legacy Archive — Elegant version of your old site as a historical record.',
      'Guaranteed migration — Content, copy, images and SEO transferred correctly.',
      '3 months of adjustments included — Minor changes at no extra cost.',
      'Satisfaction guarantee — If you are not happy, we refund 50% of the amount.',
      'Improvement report — Before/after metrics: speed, SEO and user experience.',
    ],
    demoLabel: 'REAL TRANSFORMATION',
    demoTitle: 'Before & After',
    demoSubtitle: 'Interactive demo: drag to compare the old site with the modern redesign',
    beforeTitle: 'Before (2017)',
    beforeItems: ['Outdated unprofessional design', 'No mobile version (not responsive)', 'Outdated copy without SEO', 'Slow loading and low conversion'],
    afterTitle: 'After (2026)',
    afterItems: ['Studio-grade premium design', '100% mobile and tablet ready', 'Optimized copy and updated SEO', '+340% visits and higher conversion'],
    deliveryLabel: 'HOW WE DELIVER',
    deliveryTitle: 'The complete delivery process',
    deliverySteps: [
      { title: '1. Initial review', desc: 'We analyze your current site (URL + screenshots). Diagnostic report within 24h.' },
      { title: '2. Design and rebuild', desc: 'We create the new site with AI + human creative supervision.' },
      { title: '3. Delivery and review', desc: 'We deliver the site in a private environment. 72h to review and request changes.' },
      { title: '4. Final delivery', desc: 'We do not upload to your domain. We deliver all files and you (or your technician) publish wherever you want. Includes basic publishing guide.' },
    ],
    deliveryQ1: 'How do you receive it?',
    deliveryA1: 'Private preview link + full package with Before/After, improvement report and files ready to upload.',
    deliveryQ2: 'In what format?',
    deliveryA2: 'Depending on how you sent the old site (URL, ZIP, FTP…), we return it the same way with the new version.',
    includesTitle: 'What is included?',
    includes: ['Complete modern redesign', 'Updated copy and SEO', 'New professional images', 'Perfect mobile version', 'Optimized speed', 'Current forms and features'],
    pricingTitle: 'Modernization Pricing',
    plans: [
      { name: 'Digital Rescue — €890', desc: 'New site + Before/After + Legacy Archive' },
      { name: 'Complete Rescue — €1,290', desc: 'All above + publishing guide + 3 months of adjustments' },
      { name: 'Premium Rescue — €1,790', desc: 'All + 1 year hosting + training to manage it yourself' },
    ],
    cta: 'Request modernization quote',
    ctaNote: 'We will send a personalized proposal within 24h',
    guideLink: 'Read the full guide →',
    supervised: 'SUPERVISED BY',
  },
} as const;

export default function Modernizacion() {
  const { lang } = useLanguage();
  const c = t[lang];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">{c.badge}</div>
          <h1 className="text-6xl font-semibold tracking-tight">{c.title}</h1>
          <p className="text-2xl text-slate-600 mt-4">{c.subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-slate-50 rounded-3xl p-10">
            <h3 className="font-semibold text-2xl mb-6">{c.howTitle}</h3>
            <div className="space-y-8">
              {c.steps.map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-9 h-9 flex-shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">{i + 1}</div>
                  <div>
                    <div className="font-semibold">{step.title}</div>
                    <div className="text-slate-600 mt-1">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 p-8 border border-amber-200 bg-amber-50 rounded-3xl">
            <div className="font-semibold text-xl mb-3 text-amber-800">{c.benefitsTitle}</div>
            <p className="text-slate-700 mb-4">{c.benefitsIntro}</p>
            <ul className="space-y-3 text-sm">
              {c.benefits.map((b) => (
                <li key={b} className="flex gap-2">• <span>{b}</span></li>
              ))}
            </ul>
          </div>

          <div className="mt-12">
            <div className="text-center mb-8">
              <div className="text-sm font-semibold tracking-widest text-amber-600">{c.demoLabel}</div>
              <h3 className="text-3xl font-semibold tracking-tight mt-2">{c.demoTitle}</h3>
              <p className="text-slate-600 mt-1">{c.demoSubtitle}</p>
            </div>
            <BeforeAfterDemo />
            <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <div className="font-semibold text-red-800">{c.beforeTitle}</div>
                <ul className="mt-2 space-y-1 text-red-700/80 text-xs">
                  {c.beforeItems.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="font-semibold text-emerald-800">{c.afterTitle}</div>
                <ul className="mt-2 space-y-1 text-emerald-700/80 text-xs">
                  {c.afterItems.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 bg-white border border-slate-200 rounded-3xl p-10">
            <div className="text-center mb-8">
              <div className="text-sm font-semibold tracking-widest text-indigo-600">{c.deliveryLabel}</div>
              <h3 className="text-3xl font-semibold tracking-tight mt-2">{c.deliveryTitle}</h3>
            </div>
            <div className="grid md:grid-cols-4 gap-6 text-sm">
              {c.deliverySteps.map((step) => (
                <div key={step.title} className="space-y-2">
                  <div className="font-semibold text-lg">{step.title}</div>
                  <div className="text-slate-600">{step.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t text-sm text-slate-600 space-y-2">
              <p><strong>{c.deliveryQ1}</strong> {c.deliveryA1}</p>
              <p><strong>{c.deliveryQ2}</strong> {c.deliveryA2}</p>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="premium-card p-7 rounded-3xl">
              <div className="font-semibold text-lg">{c.includesTitle}</div>
              <ul className="mt-4 space-y-2 text-sm">
                {c.includes.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </div>
            <div className="premium-card p-7 rounded-3xl">
              <div className="font-semibold text-lg mb-4">{c.pricingTitle}</div>
              <div className="space-y-4 text-sm">
                {c.plans.map((p) => (
                  <div key={p.name}>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-slate-600">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/contacto" className="btn-gradient inline-block px-10 py-4 rounded-3xl text-lg font-semibold">{c.cta}</Link>
            <p className="text-xs text-slate-500 mt-3">{c.ctaNote}</p>
            <Link href="/guia" className="block mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">{c.guideLink}</Link>
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
    </div>
  );
}
