'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import ModernizationPricing from '../components/ModernizationPricing';
import { useLanguage } from '../components/LanguageProvider';
import {
  Check, X, Sparkles, Coins,
  MessageCircle, HelpCircle, ArrowRight, FileCode, Download, Server,
} from 'lucide-react';

type BillingCycle = 'monthly' | 'yearly';

const translations = {
  es: {
    badge: 'PRECIOS CREAUNA',
    title: '¿Cuánto cuesta tu web? Depende de cómo quieras hacerla.',
    subtitle:
      'Dos caminos claros: creas tú en el Studio (suscripción mensual) o te la entregamos hecha (pago único). En ambos casos te pasamos los archivos — dominio y hosting van por tu cuenta, salvo que nos lo pidas aparte.',
    monthly: 'Mensual',
    yearly: 'Anual',
    yearlySave: '−20%',
    billedYearly: 'facturado al año',
    perMonth: '/mes',
    forever: 'sin tarjeta',
    mostPopular: 'MÁS ELEGIDO',
    trialNote: 'Los precios mensuales son solo para usar el Studio · Sin permanencia',
    quickTitle: 'Respuestas directas',
    quickItems: [
      {
        q: '¿Cuánto me cuesta una web como particular?',
        a: 'Si la haces tú en el Studio: 0€ para probar y ver cómo queda; desde 15€/mes (Pro) cuando quieras exportarla terminada. Si te la hacemos nosotros: pago único desde 690€ — diseño profesional y archivos listos para publicar.',
      },
      {
        q: '¿Por qué pagar por meses?',
        a: 'Solo si eliges el Studio: pagas el acceso a la herramienta de IA para crear y editar tu web. No es alquiler de dominio ni de hosting. Cuando la tengas lista, exportas y cancelas si quieres.',
      },
      {
        q: '¿Qué es «Gratis»?',
        a: 'Probar el Studio sin tarjeta: elegir muestra, personalizar, ver la preview y hacer hasta 15 cambios al mes. No incluye entrega final ni exportación completa — es para probar antes de decidir.',
      },
      {
        q: '¿Dominio y hosting?',
        a: 'No los incluimos por defecto. Te entregamos la web (archivos HTML/CSS/JS); tú compras el dominio y contratas el hosting donde prefieras. Si quieres que lo gestionemos nosotros, dímelo en el contacto — presupuesto aparte.',
      },
    ],
    pathStudioBadge: 'OPCIÓN 1',
    pathStudioTitle: 'Creas tú en el Studio',
    pathStudioDesc:
      'Suscripción mensual = acceso a la plataforma de IA para diseñar, personalizar y exportar tu web. Tú publicas en tu dominio cuando quieras.',
    pathDoneBadge: 'OPCIÓN 2',
    pathDoneTitle: 'Te la creamos y te la entregamos',
    pathDoneDesc:
      'Pago único. Nosotros diseñamos, revisamos y te pasamos la web terminada en archivos. Sin cuotas mensuales obligatorias.',
    domainTitle: 'Dominio y hosting: qué incluye CREAUNA y qué no',
    domainIntro:
      'CREAUNA crea webs profesionales y te las entrega. No regalamos subdominios ni dominios: eso es tuyo, en el proveedor que elijas.',
    domainIncluded: 'Qué sí incluimos',
    domainIncludedItems: [
      'Diseño y desarrollo de la web',
      'Archivos listos para subir (HTML, CSS, JS, imágenes)',
      'SEO básico, aviso legal y formularios (según plan)',
      'Guía de publicación paso a paso',
    ],
    domainNotIncluded: 'Qué no incluimos (salvo que lo pidas aparte)',
    domainNotIncludedItems: [
      'Compra del dominio (.com, .es…) — ~10–15€/año en cualquier registrador',
      'Hosting / servidor — ~5–15€/mes según proveedor',
      'Correo profesional @tudominio.com',
      'Gestión técnica continua del servidor',
    ],
    domainOptional:
      '¿Quieres que nosotros compremos el dominio, configuremos el hosting y publiquemos la web por ti? Escríbenos en /contacto — te damos presupuesto cerrado aparte del precio de la web.',
    modernizeTitle: '¿Modernizar o web nueva?',
    modernizeBody:
      'Modernizar tiene sentido cuando ya tienes web antigua con textos, fotos, clientes y posicionamiento en Google que hay que rescatar y migrar. Ese trabajo extra (analizar lo viejo, no perder contenido, rehacer sin romper nada) cuesta más que empezar de cero.',
    modernizeNew:
      'Si no tienes web o puedes empezar limpio: suele salir más barato crear una nueva en el Studio (desde 15€/mes) o pedirnos una web nueva (desde 690€ pago único).',
    modernizeLink: 'Ver servicio de modernización',
    creditsTitle: 'Créditos del Studio (solo Opción 1)',
    creditsSubtitle:
      'Cada cambio que pides por chat consume 1 crédito. Los créditos se renuevan cada mes con tu plan.',
    creditsPerChange: '1 crédito = 1 cambio visible',
    creditsNote: 'Exportar la web y descargar archivos no consume créditos extra (plan Pro o Business).',
    whatCostsTitle: 'Consume 1 crédito',
    costsCredits: [
      'Un mensaje en el chat del Studio',
      'Pulsar «Mejorar» en una sección',
      'Cambiar estilo o regenerar diseño',
    ],
    noCredits: [
      'Ver muestras y previsualizaciones',
      'Exportar archivos (plan de pago)',
      'Descargar la web terminada',
    ],
    customWebTitle: 'Web a Medida — 1.790€',
    customWebSubtitle:
      'Proyecto exclusivo sin plantilla: briefing, 2 propuestas, desarrollo premium y 3 meses de soporte. Precio cerrado, pago único.',
    customWebPrice: '1.790€',
    customWebPriceNote: 'Pago único · IVA no incluido · Dominio y hosting aparte',
    customWebIncludes:
      'Supervisado por Ramón del Pozo Rott. Te entregamos archivos listos; publicación en tu dominio o gestionada por nosotros bajo presupuesto adicional.',
    customWebLink: 'Ver proceso completo',
    helpTitle: '¿Sigues con dudas?',
    helpSubtitle: 'FAQ completa o contacto directo — respondemos en menos de 24h.',
    helpFaq: 'Ver preguntas frecuentes',
    helpContact: 'Pedir presupuesto',
    resultsLabel: 'TU NEGOCIO, ONLINE DE VERDAD',
    resultsTitle: 'Una web profesional. Terminada. Publicable.',
    resultsSubtitle: 'Elige una muestra de tu sector o descríbenos tu idea — en minutos, no en meses.',
  },
  en: {
    badge: 'CREAUNA PRICING',
    title: 'How much does your site cost? It depends how you build it.',
    subtitle:
      'Two clear paths: build it yourself in Studio (monthly subscription) or we deliver it ready (one-time payment). Either way you get the files — domain and hosting are yours unless you ask us to manage them separately.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    yearlySave: '−20%',
    billedYearly: 'billed yearly',
    perMonth: '/mo',
    forever: 'no card',
    mostPopular: 'MOST POPULAR',
    trialNote: 'Monthly prices are for Studio access only · No lock-in',
    quickTitle: 'Straight answers',
    quickItems: [
      {
        q: 'How much for a personal website?',
        a: 'DIY in Studio: €0 to try and preview; from €15/mo (Pro) when you want a finished, exportable site. We build it for you: one-time from €690 — professional design and files ready to publish.',
      },
      {
        q: 'Why pay monthly?',
        a: 'Only if you choose Studio: you pay for access to the AI tool to create and edit your site. It is not domain or hosting rent. When you are done, export and cancel if you want.',
      },
      {
        q: 'What is «Free»?',
        a: 'Try Studio without a card: pick a sample, customize, preview and make up to 15 changes per month. No final delivery or full export — it is to test before you decide.',
      },
      {
        q: 'Domain and hosting?',
        a: 'Not included by default. We deliver the site (HTML/CSS/JS files); you buy the domain and hosting wherever you prefer. Want us to manage it? Contact us — separate quote.',
      },
    ],
    pathStudioBadge: 'OPTION 1',
    pathStudioTitle: 'Build it yourself in Studio',
    pathStudioDesc:
      'Monthly subscription = access to the AI platform to design, customize and export your site. You publish on your domain when ready.',
    pathDoneBadge: 'OPTION 2',
    pathDoneTitle: 'We create and deliver it',
    pathDoneDesc:
      'One-time payment. We design, review and hand over finished files. No mandatory monthly fees.',
    domainTitle: 'Domain and hosting: what CREAUNA includes and what it does not',
    domainIntro:
      'CREAUNA builds professional websites and delivers them. We do not give away subdomains or domains — those are yours at the provider you choose.',
    domainIncluded: 'What we include',
    domainIncludedItems: [
      'Website design and development',
      'Files ready to upload (HTML, CSS, JS, images)',
      'Basic SEO, legal pages and forms (per plan)',
      'Step-by-step publishing guide',
    ],
    domainNotIncluded: 'What we do not include (unless you ask separately)',
    domainNotIncludedItems: [
      'Domain purchase (.com, .es…) — ~€10–15/year at any registrar',
      'Hosting / server — ~€5–15/mo depending on provider',
      'Professional email @yourdomain.com',
      'Ongoing server management',
    ],
    domainOptional:
      'Want us to buy the domain, set up hosting and publish for you? Contact us at /contacto — separate fixed quote on top of the website price.',
    modernizeTitle: 'Modernize or new site?',
    modernizeBody:
      'Modernizing makes sense when you have an old site with copy, photos, customers and Google rankings that must be rescued and migrated. That extra work costs more than starting fresh.',
    modernizeNew:
      'If you have no site or can start clean: a new site in Studio (from €15/mo) or our done-for-you new site (from €690 one-time) is usually cheaper.',
    modernizeLink: 'View modernization service',
    creditsTitle: 'Studio credits (Option 1 only)',
    creditsSubtitle: 'Each chat-driven change uses 1 credit. Credits renew monthly with your plan.',
    creditsPerChange: '1 credit = 1 visible change',
    creditsNote: 'Exporting and downloading files does not use extra credits (Pro or Business).',
    whatCostsTitle: 'Uses 1 credit',
    costsCredits: [
      'One message in Studio chat',
      'Clicking Improve on a section',
      'Changing style or regenerating design',
    ],
    noCredits: [
      'Browsing samples and previews',
      'Exporting files (paid plan)',
      'Downloading the finished site',
    ],
    customWebTitle: 'Custom Web — €1,790',
    customWebSubtitle:
      'Exclusive non-template project: briefing, 2 proposals, premium development and 3 months support. Fixed one-time price.',
    customWebPrice: '€1,790',
    customWebPriceNote: 'One-time · VAT not included · Domain and hosting separate',
    customWebIncludes:
      'Supervised by Ramón del Pozo Rott. We deliver ready files; publishing on your domain or managed by us is an additional quote.',
    customWebLink: 'See full process',
    helpTitle: 'Still unsure?',
    helpSubtitle: 'Full FAQ or direct contact — we reply within 24 hours.',
    helpFaq: 'View FAQ',
    helpContact: 'Request a quote',
    resultsLabel: 'YOUR BUSINESS, TRULY ONLINE',
    resultsTitle: 'A professional website. Finished. Ready to publish.',
    resultsSubtitle: 'Pick a sample in your industry or describe your idea — in minutes, not months.',
  },
};

const plans = [
  {
    id: 'gratis',
    name: 'Gratis',
    nameEn: 'Free',
    taglineEs: 'Probar el Studio — sin tarjeta',
    taglineEn: 'Try Studio — no card required',
    priceMonthly: 0,
    priceYearly: 0,
    yearlyTotal: 0,
    credits: 15,
    perChangeEs: '0€ / cambio',
    perChangeEn: '€0 / change',
    cta: 'Probar gratis',
    ctaEn: 'Try free',
    href: '/studio',
    popular: false,
    featuresEs: [
      'Acceso al Studio sin pagar',
      '1 proyecto · hasta 5 páginas',
      '15 cambios con IA al mes',
      '9 muestras + 36 plantillas',
      'Vista previa en tiempo real',
      'Sin exportación completa ni entrega final',
    ],
    featuresEn: [
      'Studio access at no cost',
      '1 project · up to 5 pages',
      '15 AI changes per month',
      '9 samples + 36 templates',
      'Live preview',
      'No full export or final delivery',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    nameEn: 'Pro',
    taglineEs: 'Tu web terminada — tú la publicas',
    taglineEn: 'Finished site — you publish it',
    priceMonthly: 19,
    priceYearly: 15,
    yearlyTotal: 180,
    credits: 120,
    perChangeEs: '~0,13€ / cambio',
    perChangeEn: '~€0.13 / change',
    cta: 'Empezar con Pro',
    ctaEn: 'Start with Pro',
    href: '/studio',
    popular: true,
    featuresEs: [
      'Exportación HTML/CSS/JS completa',
      '120 cambios con IA al mes',
      'Hasta 3 proyectos',
      '9 muestras profesionales por sector',
      'Sin marca CREAUNA',
      'Blog, formularios y SEO',
      'Tú subes los archivos a tu hosting',
    ],
    featuresEn: [
      'Full HTML/CSS/JS export',
      '120 AI changes per month',
      'Up to 3 projects',
      '9 professional sector samples',
      'No CREAUNA branding',
      'Blog, forms and SEO',
      'You upload files to your hosting',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    nameEn: 'Business',
    taglineEs: 'Equipos y agencias con varios clientes',
    taglineEn: 'Teams and agencies with multiple clients',
    priceMonthly: 49,
    priceYearly: 39,
    yearlyTotal: 468,
    credits: 300,
    perChangeEs: '~0,13€ / cambio',
    perChangeEn: '~€0.13 / change',
    cta: 'Hablar con ventas',
    ctaEn: 'Talk to sales',
    href: '/contacto',
    popular: false,
    featuresEs: [
      'Proyectos ilimitados',
      '300 cambios con IA al mes',
      'Colaboración en equipo',
      'Analíticas avanzadas',
      'Soporte VIP + SLA',
      '−20% en web a medida',
    ],
    featuresEn: [
      'Unlimited projects',
      '300 AI changes per month',
      'Team collaboration',
      'Advanced analytics',
      'VIP support + SLA',
      '−20% on custom web',
    ],
  },
];

export default function Precios() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      {/* Hero */}
      <div className="container pt-20 pb-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          {t.badge}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-950 leading-[1.12] text-gradient">
          {t.title}
        </h1>
        <p className="text-base md:text-lg text-slate-600 mt-5 leading-relaxed">{t.subtitle}</p>
      </div>

      {/* Quick answers */}
      <div className="container max-w-5xl pb-12">
        <h2 className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mb-6">{t.quickTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {t.quickItems.map((item) => (
            <div key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm">{item.q}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Option 1 — Studio */}
      <div className="bg-white border-y border-slate-200 py-14">
        <div className="container max-w-6xl">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="inline-block text-[10px] font-bold tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">
              {t.pathStudioBadge}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950">{t.pathStudioTitle}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.pathStudioDesc}</p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
              {t.monthly}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-slate-900 rounded-full p-1 relative cursor-pointer"
              aria-label="Toggle billing cycle"
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-indigo-600' : 'text-slate-400'}`}>
              {t.yearly}
              <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{t.yearlySave}</span>
            </span>
          </div>
          <p className="text-center text-xs text-slate-500 mb-8">{t.trialNote}</p>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => {
              const isYearly = billingCycle === 'yearly';
              const displayPrice = isYearly ? plan.priceYearly : plan.priceMonthly;
              const isFree = plan.id === 'gratis';
              const isPro = plan.id === 'pro';
              const features = lang === 'es' ? plan.featuresEs : plan.featuresEn;

              return (
                <div
                  key={plan.id}
                  className={`card-luxe relative rounded-[2rem] p-7 flex flex-col ${
                    isPro ? 'ring-2 ring-indigo-500 md:scale-[1.02] shadow-xl md:z-10 bg-white' : 'bg-slate-50/80 border border-slate-200'
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] px-4 py-1 rounded-full font-bold tracking-widest">
                      {t.mostPopular}
                    </div>
                  )}

                  <div className="flex-1">
                    <span className="text-xl font-bold tracking-tight">{lang === 'es' ? plan.name : plan.nameEn}</span>
                    <p className="text-[11px] text-slate-500 mt-1">{lang === 'es' ? plan.taglineEs : plan.taglineEn}</p>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-5xl font-bold tracking-tighter text-slate-950">{displayPrice}€</span>
                      <span className="text-xs text-slate-500">{isFree ? t.forever : t.perMonth}</span>
                    </div>
                    {!isFree && isYearly && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        {plan.yearlyTotal}€ {t.billedYearly}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        <Coins className="w-3 h-3" />
                        {plan.credits} {lang === 'es' ? 'créd./mes' : 'cred./mo'}
                      </span>
                    </div>

                    <div className="h-px bg-slate-100 my-5" />

                    <ul className="space-y-3 text-sm">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={plan.href}
                    className={`mt-7 block text-center py-3.5 rounded-2xl font-semibold text-sm transition hover:scale-[1.01] active:scale-[0.99] ${
                      isPro ? 'btn-gradient text-white shadow-md' : 'bg-slate-900 text-white hover:bg-black'
                    }`}
                  >
                    {lang === 'es' ? plan.cta : plan.ctaEn}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Domain & hosting callout */}
      <div className="container py-14 max-w-5xl">
        <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/60 p-8 md:p-10">
          <div className="flex items-start gap-4">
            <Server className="w-10 h-10 text-amber-700 shrink-0" />
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-slate-950">{t.domainTitle}</h2>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">{t.domainIntro}</p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-emerald-800 text-sm">
                    <FileCode className="w-4 h-4" />
                    {t.domainIncluded}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {t.domainIncludedItems.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-amber-900 text-sm">
                    <Download className="w-4 h-4" />
                    {t.domainNotIncluded}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {t.domainNotIncludedItems.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-slate-700">
                        <X className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-6 text-sm font-medium text-amber-900 bg-white/70 rounded-xl p-4 border border-amber-100">
                {t.domainOptional}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Option 2 — Done for you */}
      <div className="bg-slate-100/80 border-y border-slate-200 py-14">
        <div className="container max-w-6xl">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="inline-block text-[10px] font-bold tracking-widest text-slate-600 bg-white px-3 py-1 rounded-full mb-3 border border-slate-200">
              {t.pathDoneBadge}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950">{t.pathDoneTitle}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.pathDoneDesc}</p>
          </div>
          <ModernizationPricing />
        </div>
      </div>

      {/* Modernize vs new */}
      <div className="container py-12 max-w-3xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h3 className="font-bold text-lg text-slate-950">{t.modernizeTitle}</h3>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">{t.modernizeBody}</p>
          <p className="mt-3 text-sm text-slate-800 font-medium leading-relaxed">{t.modernizeNew}</p>
          <Link href="/modernizacion" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            {t.modernizeLink}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Credits — Studio only */}
      <div className="container py-12 max-w-4xl">
        <div className="text-center mb-8">
          <Coins className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <h2 className="text-xl md:text-2xl font-bold text-slate-950">{t.creditsTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{t.creditsSubtitle}</p>
          <p className="mt-1 text-sm font-semibold text-indigo-700">{t.creditsPerChange}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
            <h4 className="font-bold text-slate-900 mb-3 text-sm">{t.whatCostsTitle}</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              {t.costsCredits.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-slate-200 rounded-2xl p-5 bg-white">
            <h4 className="font-bold text-slate-900 mb-3 text-sm">
              {lang === 'es' ? 'No consume créditos' : 'No credits used'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-700">
              {t.noCredits.map((item) => (
                <li key={item} className="flex gap-2">
                  <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 mt-6">{t.creditsNote}</p>
      </div>

      {/* Custom web */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-14">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t.customWebTitle}</h2>
          <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto">{t.customWebSubtitle}</p>
          <div className="mt-6 text-4xl font-bold">{t.customWebPrice}</div>
          <p className="text-xs text-slate-400 mt-1">{t.customWebPriceNote}</p>
          <p className="text-sm text-indigo-200 mt-3 max-w-lg mx-auto">{t.customWebIncludes}</p>
          <Link href="/web-a-medida" className="inline-block mt-6 px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-semibold text-sm hover:bg-slate-100 transition">
            {t.customWebLink}
          </Link>
        </div>
      </div>

      {/* Results banner */}
      <div className="container my-16">
        <div className="relative rounded-[2.5rem] overflow-hidden h-[320px] flex items-end shadow-lg border border-slate-200/50">
          <img src="/precio.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative p-8 md:p-12 text-white max-w-xl">
            <div className="text-[10px] tracking-widest uppercase mb-2 opacity-80">{t.resultsLabel}</div>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">{t.resultsTitle}</h2>
            <p className="mt-2 text-white/80 text-sm">{t.resultsSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="container pb-16 max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 text-center shadow-sm">
          <HelpCircle className="w-9 h-9 text-indigo-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">{t.helpTitle}</h2>
          <p className="mt-2 text-slate-600 text-sm">{t.helpSubtitle}</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/faq" className="btn-gradient px-8 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md">
              {t.helpFaq}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contacto" className="px-8 py-3.5 rounded-2xl text-sm font-semibold border border-slate-200 bg-slate-50 hover:bg-white inline-flex items-center justify-center gap-2 transition-colors">
              <MessageCircle className="w-4 h-4" />
              {t.helpContact}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
