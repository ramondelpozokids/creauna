'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import ModernizationPricing from '../components/ModernizationPricing';
import { useLanguage } from '../components/LanguageProvider';
import {
  Check, X, Sparkles, Coins, Globe, Zap, Users, Building2, Palette,
  MessageCircle, HelpCircle, ArrowRight,
} from 'lucide-react';

type BillingCycle = 'monthly' | 'yearly';

const translations = {
  es: {
    badge: 'PRECIOS CREAUNA',
    title: 'Planes claros. Tu web, cuando quieras.',
    subtitle:
      'CREAUNA es una plataforma de IA — no una agencia. Empieza gratis, escala con créditos de Studio incluidos y sin permanencia.',
    monthly: 'Mensual',
    yearly: 'Anual',
    yearlySave: '−20%',
    billedYearly: 'facturado al año',
    perMonth: '/mes',
    forever: 'para siempre',
    mostPopular: 'MÁS ELEGIDO',
    trialNote: '14 días de prueba en Pro · Sin permanencia · Cancela cuando quieras',
    useCaseTitle: '¿Qué plan necesitas?',
    useCases: [
      { icon: Palette, label: 'Probar o portfolio', plan: 'Gratis' },
      { icon: Building2, label: 'Autónomo o pyme', plan: 'Pro' },
      { icon: Users, label: 'Agencia o equipo', plan: 'Business' },
    ],
    compareMarketTitle: 'Cómo se compara CREAUNA',
    compareMarketSubtitle:
      'Misma categoría de producto — plataforma IA para webs de negocio — con planes transparentes en euros.',
    compareColPlatform: 'Plataforma',
    compareColEntry: 'Plan de entrada',
    compareColPrice: 'Desde',
    compareColAi: 'Qué incluye',
    marketDisclaimer:
      'Precios orientativos en euros (jul. 2026), convertidos desde USD cuando aplica. Comprueba siempre la web oficial de cada plataforma.',
    marketRows: [
      {
        platform: 'Lovable',
        plan: 'Pro · 100 créditos/mes',
        price: '~23€/mes',
        ai: 'Generación por prompt · Dominio propio · Export código',
        highlight: false,
      },
      {
        platform: 'Emergent',
        plan: 'Standard · 100 créditos/mes',
        price: '~18€/mes',
        ai: 'Apps web y móvil · GitHub · Hosting privado',
        highlight: false,
      },
      {
        platform: 'Bolt.new',
        plan: 'Pro · tokens mensuales',
        price: '~23€/mes',
        ai: 'IDE en navegador · Dominio · Sin marca en sitio',
        highlight: false,
      },
      {
        platform: 'Durable',
        plan: 'Launch · 1 negocio',
        price: '~20€/mes',
        ai: 'Web en segundos · CRM · Facturación básica',
        highlight: false,
      },
      {
        platform: 'Framer',
        plan: 'Basic · diseño visual',
        price: '~9€/mes',
        ai: 'Editor visual · CMS limitado · Sin muestras sectoriales',
        highlight: false,
      },
      {
        platform: 'CREAUNA',
        plan: 'Pro · 120 créditos/mes',
        price: '15€/mes',
        ai: '9 muestras sectoriales · Legal y SEO · Export HTML · Dominio propio',
        highlight: true,
      },
    ],
    plansSummaryTitle: 'Planes CREAUNA',
    creditCompareTitle: 'Coste por edición IA (plan de pago)',
    creditCompareRows: [
      { name: 'Lovable Pro', detail: '100 créd./mes · ~23€', cost: '~0,23€' },
      { name: 'Emergent Standard', detail: '100 créd./mes · ~18€', cost: '~0,18€' },
      { name: 'CREAUNA Pro', detail: '120 créd./mes · 15€ (anual)', cost: '~0,13€', highlight: true },
    ],
    creaunaEdgeTitle: 'Por qué encaja CREAUNA en este mercado',
    creaunaEdgePoints: [
      {
        title: 'Muestras terminadas por sector',
        body: 'Empiezas desde una web real (restaurante, clínica, hotel…) y personalizas — no desde una página en blanco.',
      },
      {
        title: 'Precio de entrada claro',
        body: 'Pro desde 15€/mes (anual): por debajo del rango habitual de 20–25€/mes de plataformas similares, con más créditos incluidos.',
      },
      {
        title: 'Créditos predecibles',
        body: '1 crédito = 1 cambio visible. Sin sorpresas de tokens, despliegues extra ni asientos de editor ocultos.',
      },
      {
        title: 'Entrega profesional',
        body: 'SEO, aviso legal, cookies, formularios y exportación HTML lista para publicar — pensado para negocios locales en España.',
      },
    ],
    featuresTitle: 'Comparativa detallada',
    featuresCol: 'Característica',
    featureRows: [
      ['Sitios web activos', '1', '3', 'Ilimitados'],
      ['Páginas por sitio', 'Hasta 5', 'Ilimitadas', 'Ilimitadas'],
      ['Dominio personalizado', '—', '✓', '✓'],
      ['Quitar marca CREAUNA', '—', '✓', '✓'],
      ['Muestras profesionales por sector', '9', '9', '9'],
      ['Plantillas del catálogo', '36', '36', '36'],
      ['Créditos Studio IA / mes', '15', '120', '300'],
      ['Coste por cambio IA', '0€', '~0,13€', '~0,13€'],
      ['Generación inicial con IA', '✓', '✓', '✓'],
      ['Formularios de contacto', '✓', '✓', '✓'],
      ['SEO básico', '✓', '✓', '✓'],
      ['Blog integrado', '—', '✓', '✓'],
      ['Tienda / reservas básica', '—', '✓', '✓'],
      ['Analíticas', 'Básicas', 'Estándar', 'Avanzadas'],
      ['Exportar código (HTML/CSS/JS)', 'Vista previa', 'Completo', 'Completo'],
      ['Hosting incluido', 'Subdominio', 'Tu dominio', '1 año incluido'],
      ['Colaboración en equipo', '—', '—', 'Ilimitada'],
      ['Soporte', 'Comunidad', 'Prioritario (4h)', 'VIP + SLA'],
      ['Web a medida', '—', '−10%', '−20% + prioridad'],
    ],
    creditsTitle: 'Créditos Studio: edición con IA incluida',
    creditsSubtitle:
      'Cada plan incluye créditos para pedir cambios por chat: textos, colores, secciones y estilos con IA.',
    creditsPerChange: '1 crédito = 1 cambio visible en el Studio',
    creditsNote:
      'Los créditos se renuevan cada mes. No caducan dentro del mes. Publicar y exportar no consume créditos extra (en planes de pago).',
    whatCostsTitle: 'Qué consume 1 crédito',
    costsCredits: [
      'Un mensaje en el chat del Studio',
      'Pulsar «Mejorar» en una sección',
      'Cambiar estilo (Elegante / Minimal / Moderno)',
      'Regenerar el diseño',
      'Usar una sugerencia rápida',
    ],
    noCredits: [
      'Ver plantillas y previsualizaciones',
      'Cargar plantilla sin editar',
      'Exportar código (plan de pago)',
      'Mantener la web publicada',
      'Soporte y presupuestos',
    ],
    customWebTitle: 'Web a Medida — 1.790€',
    customWebSubtitle:
      'Web premium exclusiva cuando el Studio no basta. Mismo techo de precio que nuestro rescate premium: diseño de nivel internacional, precio cerrado.',
    customWebPrice: '1.790€',
    customWebPriceNote: 'Pago único · Máximo web premium · IVA no incluido',
    customWebIncludes:
      'Briefing, 2 propuestas, desarrollo, SEO, publicación y 3 meses de soporte supervisados por Ramón del Pozo Rott.',
    customWebLink: 'Ver proceso completo',
    helpTitle: '¿Tienes más preguntas?',
    helpSubtitle: 'Consulta la FAQ completa o escríbenos — respondemos en menos de 24h.',
    helpFaq: 'Ver preguntas frecuentes',
    helpContact: 'Contactar',
    resultsLabel: 'TU NEGOCIO, ONLINE DE VERDAD',
    resultsTitle: 'Una web profesional. Terminada. Publicable.',
    resultsSubtitle: 'Elige una muestra de tu sector o descríbenos tu idea — en minutos, no en meses.',
  },
  en: {
    badge: 'CREAUNA PRICING',
    title: 'Clear plans. Your site, on your terms.',
    subtitle:
      'CREAUNA is an AI platform — not an agency. Start free, scale with included Studio credits and no lock-in.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    yearlySave: '−20%',
    billedYearly: 'billed yearly',
    perMonth: '/mo',
    forever: 'forever',
    mostPopular: 'MOST POPULAR',
    trialNote: '14-day Pro trial · No lock-in · Cancel anytime',
    useCaseTitle: 'Which plan do you need?',
    useCases: [
      { icon: Palette, label: 'Try or portfolio', plan: 'Free' },
      { icon: Building2, label: 'Freelancer or SMB', plan: 'Pro' },
      { icon: Users, label: 'Agency or team', plan: 'Business' },
    ],
    compareMarketTitle: 'How CREAUNA compares',
    compareMarketSubtitle:
      'Same product category — AI platform for business websites — with transparent euro pricing.',
    compareColPlatform: 'Platform',
    compareColEntry: 'Entry plan',
    compareColPrice: 'From',
    compareColAi: 'Includes',
    marketDisclaimer:
      'Indicative prices in euros (Jul 2026), converted from USD where applicable. Always check each platform’s official site.',
    marketRows: [
      {
        platform: 'Lovable',
        plan: 'Pro · 100 credits/mo',
        price: '~€23/mo',
        ai: 'Prompt generation · Custom domain · Code export',
        highlight: false,
      },
      {
        platform: 'Emergent',
        plan: 'Standard · 100 credits/mo',
        price: '~€18/mo',
        ai: 'Web & mobile apps · GitHub · Private hosting',
        highlight: false,
      },
      {
        platform: 'Bolt.new',
        plan: 'Pro · monthly tokens',
        price: '~€23/mo',
        ai: 'Browser IDE · Custom domain · No site branding',
        highlight: false,
      },
      {
        platform: 'Durable',
        plan: 'Launch · 1 business',
        price: '~€20/mo',
        ai: 'Instant site · CRM · Basic invoicing',
        highlight: false,
      },
      {
        platform: 'Framer',
        plan: 'Basic · visual design',
        price: '~€9/mo',
        ai: 'Visual editor · Limited CMS · No sector samples',
        highlight: false,
      },
      {
        platform: 'CREAUNA',
        plan: 'Pro · 120 credits/mo',
        price: '€15/mo',
        ai: '9 sector samples · Legal & SEO · HTML export · Custom domain',
        highlight: true,
      },
    ],
    plansSummaryTitle: 'CREAUNA plans',
    creditCompareTitle: 'Cost per AI edit (paid plan)',
    creditCompareRows: [
      { name: 'Lovable Pro', detail: '100 cred./mo · ~€23', cost: '~€0.23' },
      { name: 'Emergent Standard', detail: '100 cred./mo · ~€18', cost: '~€0.18' },
      { name: 'CREAUNA Pro', detail: '120 cred./mo · €15 (annual)', cost: '~€0.13', highlight: true },
    ],
    creaunaEdgeTitle: 'Why CREAUNA fits this market',
    creaunaEdgePoints: [
      {
        title: 'Finished sector samples',
        body: 'Start from a real site (restaurant, clinic, hotel…) and customize — not from a blank canvas.',
      },
      {
        title: 'Clear entry price',
        body: 'Pro from €15/mo (annual): below the usual €20–25/mo range, with more included credits.',
      },
      {
        title: 'Predictable credits',
        body: '1 credit = 1 visible change. No token surprises, extra deploy fees or hidden editor seats.',
      },
      {
        title: 'Professional delivery',
        body: 'SEO, legal pages, forms and HTML export ready to publish — built for local businesses in Spain.',
      },
    ],
    featuresTitle: 'Full comparison',
    featuresCol: 'Feature',
    featureRows: [
      ['Active websites', '1', '3', 'Unlimited'],
      ['Pages per site', 'Up to 5', 'Unlimited', 'Unlimited'],
      ['Custom domain', '—', '✓', '✓'],
      ['Remove CREAUNA branding', '—', '✓', '✓'],
      ['Professional sector samples', '9', '9', '9'],
      ['Catalog templates', '36', '36', '36'],
      ['Studio AI credits / month', '15', '120', '300'],
      ['Cost per AI change', '€0', '~€0.13', '~€0.13'],
      ['Initial AI generation', '✓', '✓', '✓'],
      ['Contact forms', '✓', '✓', '✓'],
      ['Basic SEO', '✓', '✓', '✓'],
      ['Built-in blog', '—', '✓', '✓'],
      ['Shop / basic booking', '—', '✓', '✓'],
      ['Analytics', 'Basic', 'Standard', 'Advanced'],
      ['Export code (HTML/CSS/JS)', 'Preview', 'Full', 'Full'],
      ['Hosting included', 'Subdomain', 'Your domain', '1 year included'],
      ['Team collaboration', '—', '—', 'Unlimited'],
      ['Support', 'Community', 'Priority (4h)', 'VIP + SLA'],
      ['Custom web project', '—', '−10%', '−20% + priority'],
    ],
    creditsTitle: 'Studio credits: AI editing included',
    creditsSubtitle:
      'Every plan includes credits to request chat-driven changes: copy, colors, sections and styles with AI.',
    creditsPerChange: '1 credit = 1 visible change in Studio',
    creditsNote:
      'Credits renew monthly. They do not roll over. Publishing and exporting do not use extra credits (on paid plans).',
    whatCostsTitle: 'What uses 1 credit',
    costsCredits: [
      'One message in Studio chat',
      'Clicking «Improve» on a section',
      'Changing style (Elegant / Minimal / Modern)',
      'Regenerating the design',
      'Using a quick suggestion',
    ],
    noCredits: [
      'Browsing templates and previews',
      'Loading a template without editing',
      'Exporting code (paid plan)',
      'Keeping your site live',
      'Support and quotes',
    ],
    customWebTitle: 'Custom Web — €1,790',
    customWebSubtitle:
      'Exclusive premium web when Studio is not enough. Same price cap as our premium rescue: international-grade design, fixed price.',
    customWebPrice: '€1,790',
    customWebPriceNote: 'One-time · Premium web cap · VAT not included',
    customWebIncludes:
      'Briefing, 2 proposals, development, SEO, launch and 3 months of supervised support by Ramón del Pozo Rott.',
    customWebLink: 'See full process',
    helpTitle: 'Still have questions?',
    helpSubtitle: 'Browse the full FAQ or get in touch — we reply within 24 hours.',
    helpFaq: 'View FAQ',
    helpContact: 'Contact us',
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
    taglineEs: 'Para probar y publicar tu primera web',
    taglineEn: 'Try CREAUNA and publish your first site',
    priceMonthly: 0,
    priceYearly: 0,
    yearlyTotal: 0,
    credits: 15,
    perChangeEs: '0€ / cambio',
    perChangeEn: '€0 / change',
    cta: 'Empezar gratis',
    ctaEn: 'Start free',
    href: '/studio',
    popular: false,
    featuresEs: [
      '1 sitio · subdominio creauna.app',
      'Hasta 5 páginas',
      '15 ediciones IA al mes',
      '9 muestras profesionales + 36 plantillas',
      'Vista previa en tiempo real',
      'Marca CREAUNA visible',
    ],
    featuresEn: [
      '1 site · creauna.app subdomain',
      'Up to 5 pages',
      '15 AI edits per month',
      '9 professional samples + 36 templates',
      'Live preview',
      'CREAUNA branding visible',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    nameEn: 'Pro',
    taglineEs: 'Para autónomos y pymes en crecimiento',
    taglineEn: 'For freelancers and growing SMBs',
    priceMonthly: 19,
    priceYearly: 15,
    yearlyTotal: 180,
    credits: 120,
    perChangeEs: '~0,13€ / cambio',
    perChangeEn: '~€0.13 / change',
    cta: 'Probar 14 días gratis',
    ctaEn: 'Start 14-day trial',
    href: '/studio',
    popular: true,
    featuresEs: [
      'Hasta 3 sitios activos',
      '9 muestras profesionales por sector',
      'Dominio propio conectado',
      '120 ediciones IA al mes',
      'Sin marca CREAUNA',
      'Exportación código completa',
      'Blog, formularios y SEO',
      'Soporte prioritario (4h)',
    ],
    featuresEn: [
      'Up to 3 active sites',
      '9 professional sector samples',
      'Connect your own domain',
      '120 AI edits per month',
      'No CREAUNA branding',
      'Full code export',
      'Blog, forms and SEO',
      'Priority support (4h)',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    nameEn: 'Business',
    taglineEs: 'Para agencias y equipos con varios proyectos',
    taglineEn: 'For agencies and teams with multiple projects',
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
      'Sitios ilimitados',
      '300 ediciones IA al mes',
      'Hosting + dominio 1 año',
      'Equipo colaborativo ilimitado',
      'Analíticas avanzadas',
      'Soporte VIP + SLA',
      '−20% en web a medida',
    ],
    featuresEn: [
      'Unlimited sites',
      '300 AI edits per month',
      'Hosting + domain 1 year',
      'Unlimited team seats',
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
      <div className="container pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          {t.badge}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-950 max-w-3xl mx-auto leading-[1.08] text-gradient">
          {t.title}
        </h1>
        <p className="text-lg text-slate-600 mt-5 max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>

        <div className="flex items-center justify-center mt-10 gap-3">
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
        <p className="mt-4 text-xs text-slate-500">{t.trialNote}</p>
      </div>

      {/* Use cases */}
      <div className="container max-w-3xl mb-8">
        <p className="text-center text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">{t.useCaseTitle}</p>
        <div className="grid grid-cols-3 gap-3">
          {t.useCases.map(({ icon: Icon, label, plan }) => (
            <div key={plan} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-200 text-center">
              <Icon className="w-5 h-5 text-indigo-600" />
              <span className="text-xs text-slate-600 leading-snug">{label}</span>
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">{plan}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div className="container pb-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
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
                  isPro ? 'ring-2 ring-indigo-500 md:scale-[1.02] shadow-xl md:z-10 bg-white' : 'bg-white'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] px-4 py-1 rounded-full font-bold tracking-widest">
                    {t.mostPopular}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xl font-bold tracking-tight">{lang === 'es' ? plan.name : plan.nameEn}</span>
                    {!isFree && isYearly && (
                      <span className="text-xs text-slate-400 line-through">{plan.priceMonthly}€</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{lang === 'es' ? plan.taglineEs : plan.taglineEn}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tighter text-slate-950">{displayPrice}€</span>
                    <span className="text-xs text-slate-500">
                      {isFree ? t.forever : t.perMonth}
                    </span>
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
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      <Zap className="w-3 h-3" />
                      {lang === 'es' ? plan.perChangeEs : plan.perChangeEn}
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

      {/* Market comparison */}
      <div className="container py-16 max-w-5xl">
        <div className="text-center mb-8">
          <Globe className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950">{t.compareMarketTitle}</h2>
          <p className="mt-3 text-sm text-slate-600 max-w-2xl mx-auto">{t.compareMarketSubtitle}</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-semibold">{t.compareColPlatform}</th>
                <th className="px-4 py-3 text-left font-semibold">{t.compareColEntry}</th>
                <th className="px-4 py-3 text-center font-semibold">{t.compareColPrice}</th>
                <th className="px-5 py-3 text-left font-semibold">{t.compareColAi}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {t.marketRows.map((row) => (
                <tr
                  key={row.platform}
                  className={row.highlight ? 'bg-indigo-50/80 font-semibold' : 'hover:bg-slate-50/50'}
                >
                  <td className="px-5 py-3.5 text-slate-900">{row.platform}</td>
                  <td className="px-4 py-3.5 text-slate-600">{row.plan}</td>
                  <td className="px-4 py-3.5 text-center text-slate-800">{row.price}</td>
                  <td className="px-5 py-3.5 text-slate-600 text-xs">{row.ai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400 max-w-3xl mx-auto">{t.marketDisclaimer}</p>

        <h3 className="mt-12 mb-6 text-center text-lg font-bold text-slate-900">{t.creaunaEdgeTitle}</h3>
        <div className="grid md:grid-cols-2 gap-5">
          {t.creaunaEdgePoints.map((point) => (
            <div key={point.title} className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
              <h4 className="font-semibold text-slate-900">{point.title}</h4>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{point.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CREAUNA plans summary */}
      <div className="container pb-8 max-w-5xl">
        <h2 className="text-xl font-bold text-slate-950 mb-4 text-center">{t.plansSummaryTitle}</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 text-left font-semibold">{lang === 'es' ? 'Plan CREAUNA' : 'CREAUNA plan'}</th>
                <th className="px-4 py-3 text-left font-semibold">{lang === 'es' ? 'Incluye' : 'Includes'}</th>
                <th className="px-4 py-3 text-center font-semibold">{lang === 'es' ? 'Desde' : 'From'}</th>
                <th className="px-5 py-3 text-left font-semibold">{lang === 'es' ? 'Créditos Studio' : 'Studio credits'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-medium text-slate-900">{lang === 'es' ? 'Gratis' : 'Free'}</td>
                <td className="px-4 py-3.5 text-slate-600">{lang === 'es' ? '1 sitio · subdominio' : '1 site · subdomain'}</td>
                <td className="px-4 py-3.5 text-center text-slate-800">0€</td>
                <td className="px-5 py-3.5 text-slate-600 text-xs">15 {lang === 'es' ? 'créd./mes' : 'cred./mo'}</td>
              </tr>
              <tr className="bg-indigo-50/80 font-semibold">
                <td className="px-5 py-3.5 text-slate-900">Pro</td>
                <td className="px-4 py-3.5 text-slate-600">{lang === 'es' ? '3 sitios · dominio propio' : '3 sites · custom domain'}</td>
                <td className="px-4 py-3.5 text-center text-indigo-700">15€/{lang === 'es' ? 'mes' : 'mo'}</td>
                <td className="px-5 py-3.5 text-indigo-700 text-xs">120 {lang === 'es' ? 'créd./mes' : 'cred./mo'}</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-5 py-3.5 font-medium text-slate-900">Business</td>
                <td className="px-4 py-3.5 text-slate-600">{lang === 'es' ? 'Sitios ilimitados · equipo' : 'Unlimited sites · team'}</td>
                <td className="px-4 py-3.5 text-center text-slate-800">39€/{lang === 'es' ? 'mes' : 'mo'}</td>
                <td className="px-5 py-3.5 text-slate-600 text-xs">300 {lang === 'es' ? 'créd./mes' : 'cred./mo'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Full feature matrix */}
      <div className="bg-white border-y border-slate-200 py-16">
        <div className="container max-w-5xl">
          <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight text-slate-950 mb-10">
            {t.featuresTitle}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-slate-50/70 text-slate-500">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">{t.featuresCol}</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider">Free</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-indigo-700">Pro</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {t.featureRows.map((row) => (
                  <tr key={row[0]} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3.5 font-medium text-slate-900">{row[0]}</td>
                    <td className="px-4 py-3.5 text-center text-slate-500">{row[1]}</td>
                    <td className="px-4 py-3.5 text-center text-indigo-700 font-medium">{row[2]}</td>
                    <td className="px-4 py-3.5 text-center text-slate-800 font-semibold">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Credits (CREAUNA differentiator) */}
      <div className="container py-16 max-w-5xl">
        <div className="text-center mb-10">
          <Coins className="w-9 h-9 text-indigo-600 mx-auto mb-2" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950">{t.creditsTitle}</h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm leading-relaxed">{t.creditsSubtitle}</p>
          <p className="mt-2 text-sm font-semibold text-indigo-700">{t.creditsPerChange}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <div className="font-bold text-slate-900">{lang === 'es' ? plan.name : plan.nameEn}</div>
              <div className="text-3xl font-bold text-indigo-700 mt-2">{plan.credits}</div>
              <div className="text-xs text-slate-500">{lang === 'es' ? 'créditos/mes' : 'credits/month'}</div>
              <div className="text-sm text-emerald-700 font-semibold mt-2">
                {lang === 'es' ? plan.perChangeEs : plan.perChangeEn}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 mb-8">{t.creditsNote}</p>

        <h3 className="text-center text-sm font-bold text-slate-800 mb-4">{t.creditCompareTitle}</h3>
        <div className="grid md:grid-cols-3 gap-3 mb-8 max-w-3xl mx-auto">
          {t.creditCompareRows.map((row) => (
            <div
              key={row.name}
              className={`rounded-xl border p-4 text-center text-sm ${
                row.highlight ? 'border-indigo-300 bg-indigo-50 font-semibold' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="text-slate-900">{row.name}</div>
              <div className="text-xs text-slate-500 mt-1">{row.detail}</div>
              <div className={`text-lg mt-2 ${row.highlight ? 'text-indigo-700' : 'text-slate-800'}`}>{row.cost}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{lang === 'es' ? 'por cambio' : 'per edit'}</div>
            </div>
          ))}
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
      </div>

      {/* Modernization one-time plans */}
      <div className="bg-slate-50 border-y border-slate-200 py-14">
        <div className="container max-w-6xl">
          <ModernizationPricing />
        </div>
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

      {/* Help — FAQ & contact */}
      <div className="container py-16 max-w-3xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 text-center shadow-sm">
          <HelpCircle className="w-9 h-9 text-indigo-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">{t.helpTitle}</h2>
          <p className="mt-2 text-slate-600 text-sm">{t.helpSubtitle}</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/faq"
              className="btn-gradient px-8 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md"
            >
              {t.helpFaq}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contacto"
              className="px-8 py-3.5 rounded-2xl text-sm font-semibold border border-slate-200 bg-slate-50 hover:bg-white inline-flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {t.helpContact}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
