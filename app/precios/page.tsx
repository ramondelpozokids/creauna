'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import {
  Check, X, ChevronDown, HelpCircle, Sparkles, ShieldCheck, Coins,
  Globe, Zap, Users, Building2, Palette,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type BillingCycle = 'monthly' | 'yearly';

const translations = {
  es: {
    badge: 'PRECIOS CREAUNA',
    title: 'Elige tu plan. Publica tu web.',
    subtitle:
      'Plan Free para probar, Pro para tu negocio y Business para equipos. Studio IA incluido en todos.',
    monthly: 'Mensual',
    yearly: 'Anual',
    yearlySave: '−20%',
    billedYearly: 'facturado al año',
    perMonth: '/mes',
    forever: 'para siempre',
    mostPopular: 'MÁS ELEGIDO',
    trialNote: '14 días de prueba · Sin permanencia · Cancela cuando quieras',
    allPlansTitle: 'Todos los planes incluyen',
    allPlansItems: [
      '60 plantillas premium por sector',
      'Studio con vista previa en tiempo real',
      'SSL y hosting en creauna.app',
      'Sin permanencia ni penalización',
      'Supervisión creativa CREAUNA',
    ],
    useCaseTitle: '¿Qué plan necesitas?',
    useCases: [
      { icon: Palette, label: 'Probar o portfolio', plan: 'Gratis' },
      { icon: Building2, label: 'Autónomo o pyme', plan: 'Pro' },
      { icon: Users, label: 'Agencia o equipo', plan: 'Business' },
    ],
    compareMarketTitle: 'Resumen de planes CREAUNA',
    compareMarketSubtitle:
      'Edición con IA incluida en cada plan. Sin sorpresas ni permanencia.',
    compareColPlatform: 'Plan',
    compareColEntry: 'Incluye',
    compareColPrice: 'Desde',
    compareColAi: 'IA Studio',
    marketRows: [
      { platform: 'Gratis', plan: '1 sitio · 15 créditos/mes', price: '0€', ai: 'Generación y edición IA', highlight: false },
      { platform: 'Pro', plan: '3 sitios · dominio propio', price: '15€/mes', ai: '120 créditos Studio/mes', highlight: true },
      { platform: 'Business', plan: 'Sitios ilimitados · equipo', price: '39€/mes', ai: '300 créditos Studio/mes', highlight: false },
    ],
    featuresTitle: 'Comparativa detallada',
    featuresCol: 'Característica',
    featureRows: [
      ['Sitios web activos', '1', '3', 'Ilimitados'],
      ['Páginas por sitio', 'Hasta 5', 'Ilimitadas', 'Ilimitadas'],
      ['Dominio personalizado', '—', '✓', '✓'],
      ['Quitar marca CREAUNA', '—', '✓', '✓'],
      ['Plantillas premium', '60', '60', '60'],
      ['Créditos Studio IA / mes', '15', '120', '300'],
      ['Coste por cambio IA', '0€', '~0,16€', '~0,16€'],
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
    customWebTitle: 'Web a Medida — 2.900€',
    customWebSubtitle:
      'Como contratar una agencia: diseño 100% exclusivo cuando el Studio no basta. Precio cerrado, sin cuotas ocultas.',
    customWebPrice: '2.900€',
    customWebPriceNote: 'Pago único · Llave en mano · IVA no incluido',
    customWebIncludes:
      'Briefing, 2 propuestas, desarrollo, SEO, publicación y 3 meses de soporte supervisados por Ramón del Pozo Rott.',
    customWebLink: 'Ver proceso completo',
    faqTitle: 'Preguntas frecuentes',
    customNote: '¿Necesitas una web 100% exclusiva, sin plantilla?',
    customLink: 'Web a Medida desde 2.900€',
    designedBy: 'SUPERVISADO POR',
    founderTitle: 'Supervisor Creativo de CREAUNA',
    resultsLabel: 'RESULTADOS REALES',
    resultsTitle: 'Webs con nivel de estudio, no de plantilla genérica.',
    resultsSubtitle: 'Diseño premium, IA bajo control humano y entrega lista para publicar.',
  },
  en: {
    badge: 'CREAUNA PRICING',
    title: 'Pick your plan. Launch your site.',
    subtitle:
      'Free to try, Pro for your business, Business for teams. AI Studio included on every plan.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    yearlySave: '−20%',
    billedYearly: 'billed yearly',
    perMonth: '/mo',
    forever: 'forever',
    mostPopular: 'MOST POPULAR',
    trialNote: '14-day trial · No lock-in · Cancel anytime',
    allPlansTitle: 'All plans include',
    allPlansItems: [
      '60 premium templates by industry',
      'Studio with live preview',
      'SSL and hosting on creauna.app',
      'No lock-in or cancellation fees',
      'CREAUNA creative supervision',
    ],
    useCaseTitle: 'Which plan do you need?',
    useCases: [
      { icon: Palette, label: 'Try or portfolio', plan: 'Free' },
      { icon: Building2, label: 'Freelancer or SMB', plan: 'Pro' },
      { icon: Users, label: 'Agency or team', plan: 'Business' },
    ],
    compareMarketTitle: 'CREAUNA plans at a glance',
    compareMarketSubtitle:
      'AI editing included on every plan. No lock-in.',
    compareColPlatform: 'Plan',
    compareColEntry: 'Includes',
    compareColPrice: 'From',
    compareColAi: 'AI Studio',
    marketRows: [
      { platform: 'Free', plan: '1 site · 15 credits/mo', price: '€0', ai: 'AI generation & edits', highlight: false },
      { platform: 'Pro', plan: '3 sites · custom domain', price: '€15/mo', ai: '120 Studio credits/mo', highlight: true },
      { platform: 'Business', plan: 'Unlimited sites · team', price: '€39/mo', ai: '300 Studio credits/mo', highlight: false },
    ],
    featuresTitle: 'Full comparison',
    featuresCol: 'Feature',
    featureRows: [
      ['Active websites', '1', '3', 'Unlimited'],
      ['Pages per site', 'Up to 5', 'Unlimited', 'Unlimited'],
      ['Custom domain', '—', '✓', '✓'],
      ['Remove CREAUNA branding', '—', '✓', '✓'],
      ['Premium templates', '60', '60', '60'],
      ['Studio AI credits / month', '15', '120', '300'],
      ['Cost per AI change', '€0', '~€0.16', '~€0.16'],
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
    customWebTitle: 'Custom Web — €2,900',
    customWebSubtitle:
      'Like hiring an agency: 100% exclusive design when Studio is not enough. Fixed price, no hidden fees.',
    customWebPrice: '€2,900',
    customWebPriceNote: 'One-time · Turnkey · VAT not included',
    customWebIncludes:
      'Briefing, 2 proposals, development, SEO, launch and 3 months of supervised support by Ramón del Pozo Rott.',
    customWebLink: 'See full process',
    faqTitle: 'Frequently asked questions',
    customNote: 'Need a 100% exclusive site, no template?',
    customLink: 'Custom Web from €2,900',
    designedBy: 'SUPERVISED BY',
    founderTitle: 'Creative Supervisor of CREAUNA',
    resultsLabel: 'REAL RESULTS',
    resultsTitle: 'Studio-grade websites, not generic templates.',
    resultsSubtitle: 'Premium design, AI under human oversight, ready to publish.',
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
      '60 plantillas premium',
      'Vista previa en tiempo real',
      'Marca CREAUNA visible',
    ],
    featuresEn: [
      '1 site · creauna.app subdomain',
      'Up to 5 pages',
      '15 AI edits per month',
      '60 premium templates',
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
    perChangeEs: '~0,16€ / cambio',
    perChangeEn: '~€0.16 / change',
    cta: 'Probar 14 días gratis',
    ctaEn: 'Start 14-day trial',
    href: '/studio',
    popular: true,
    featuresEs: [
      'Hasta 3 sitios activos',
      'Dominio propio conectado',
      '120 ediciones IA al mes',
      'Sin marca CREAUNA',
      'Exportación código completa',
      'Blog, formularios y SEO',
      'Soporte prioritario (4h)',
    ],
    featuresEn: [
      'Up to 3 active sites',
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
    perChangeEs: '~0,16€ / cambio',
    perChangeEn: '~€0.16 / change',
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

const faqs = [
  {
    q: '¿En qué se diferencia CREAUNA?',
    qEn: 'What makes CREAUNA different?',
    a: 'CREAUNA incluye un Studio con IA: describes cambios en lenguaje natural y ves el resultado al instante. Cada cambio consume 1 crédito incluido en tu plan.',
    aEn: 'CREAUNA includes an AI Studio: describe changes in plain language and see results instantly. Each change uses 1 credit included in your plan.',
  },
  {
    q: '¿Puedo empezar gratis?',
    qEn: 'Can I start for free?',
    a: 'Sí. El plan Gratis no pide tarjeta: 1 sitio, subdominio creauna.app y 15 créditos de edición al mes. Cuando quieras dominio propio y más créditos, subes a Pro.',
    aEn: 'Yes. The Free plan needs no card: 1 site, creauna.app subdomain and 15 editing credits per month. When you want your own domain and more credits, upgrade to Pro.',
  },
  {
    q: '¿Cuánto cuesta cada cambio con IA?',
    qEn: 'How much does each AI change cost?',
    a: '1 crédito = 1 cambio. Gratis: 0€ (15/mes). Pro: ~0,16€ (19€ ÷ 120). Business: ~0,16€ (49€ ÷ 300). Ves el saldo antes de confirmar en el Studio.',
    aEn: '1 credit = 1 change. Free: €0 (15/mo). Pro: ~€0.16 (€19 ÷ 120). Business: ~€0.16 (€49 ÷ 300). You see your balance before confirming in Studio.',
  },
  {
    q: '¿Hay prueba gratis en planes de pago?',
    qEn: 'Is there a free trial on paid plans?',
    a: 'Pro incluye 14 días de prueba sin compromiso. Puedes cancelar antes de que se cobre el primer mes.',
    aEn: 'Pro includes a 14-day no-commitment trial. Cancel before the first charge if it is not for you.',
  },
  {
    q: '¿Puedo exportar y llevarme la web?',
    qEn: 'Can I export and take my site elsewhere?',
    a: 'Sí, en Pro y Business exportas HTML/CSS/JS limpio y lo alojas donde quieras. Sin penalización.',
    aEn: 'Yes, on Pro and Business you export clean HTML/CSS/JS and host it anywhere. No penalty.',
  },
  {
    q: '¿Qué es la Web a Medida (2.900€)?',
    qEn: 'What is Custom Web (€2,900)?',
    a: 'Servicio aparte para proyectos exclusivos: diseño a medida, copy, desarrollo, SEO y 3 meses de soporte. Detalle en /web-a-medida',
    aEn: 'Separate service for exclusive projects: bespoke design, copy, development, SEO and 3 months support. Details at /web-a-medida',
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-sm transition-all duration-300 hover:border-slate-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
      >
        <span className="font-semibold text-lg text-slate-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-slate-900' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 pt-1 text-slate-600 leading-relaxed border-t border-slate-50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

      {/* All plans include */}
      <div className="bg-white border-y border-slate-200 py-10">
        <div className="container max-w-4xl text-center">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">{t.allPlansTitle}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {t.allPlansItems.map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                <Check className="w-4 h-4 text-emerald-600" />
                {item}
              </span>
            ))}
          </div>
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

      {/* FAQ */}
      <div className="container py-16 max-w-3xl">
        <div className="text-center mb-10">
          <HelpCircle className="w-9 h-9 text-indigo-600 mx-auto mb-2" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950">{t.faqTitle}</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              question={lang === 'es' ? faq.q : faq.qEn}
              answer={lang === 'es' ? faq.a : faq.aEn}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white py-10 text-center text-sm text-slate-600">
        <div className="container flex flex-col md:flex-row items-center justify-center gap-3">
          <span>{t.customNote}</span>
          <Link href="/web-a-medida" className="underline font-semibold text-indigo-600 hover:text-indigo-800">
            {t.customLink}
          </Link>
        </div>
      </div>

      <div className="bg-[#f8f7f4] border-t border-slate-200 py-14">
        <div className="container flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-white shadow-lg mb-3">
            <img src="/creador.webp" alt="Ramón del Pozo Rott" className="w-full h-full object-cover" />
          </div>
          <div className="text-[10px] tracking-[3px] text-slate-500 uppercase font-semibold">{t.designedBy}</div>
          <div className="font-semibold text-sm text-slate-700 mt-1">Ramón del Pozo Rott</div>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            {t.founderTitle}
          </div>
        </div>
      </div>
    </div>
  );
}
