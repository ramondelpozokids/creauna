'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { Check, X, ChevronDown, HelpCircle, Sparkles, ShieldCheck, Coins, Euro } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const translations = {
  es: {
    transparentPricing: "PRECIOS TRANSPARENTES",
    title: "Elige el plan que mejor se adapta a ti",
    subtitle: "Sin sorpresas. Sin letras pequeñas. Sabes en todo momento qué cuesta cada cambio y qué incluye tu plan.",
    monthly: "Mensual",
    yearly: "Anual (Ahorra 20%)",
    saveBadge: "20% DESCUENTO",
    mostPopular: "MÁS ELEGIDO",
    periodYearly: "/mes, facturado anualmente",
    periodMonthly: "/mes",
    periodFree: "para siempre",
    resultsLabel: "RESULTADOS REALES",
    resultsTitle: "Todas nuestras webs tienen este nivel.",
    resultsSubtitle: "Diseño de estudio, tecnología avanzada y atención personalizada.",
    featuresTitle: "Comparativa de planes CREAUNA",
    featuresCol: "Característica",
    creditsTitle: "¿Cuánto cuesta cada cambio?",
    creditsSubtitle: "En el Studio, cada mejora que pides (texto, colores, secciones, estilos) consume exactamente 1 crédito. Aquí ves el coste real según tu plan.",
    creditsPerChange: "1 crédito = 1 cambio en el Studio",
    creditsTableCol1: "Plan",
    creditsTableCol2: "Precio mensual",
    creditsTableCol3: "Créditos/mes",
    creditsTableCol4: "Coste por cambio",
    creditsTableCol5: "Ejemplo práctico",
    creditsNote: "Los créditos se renuevan cada mes. No caducan dentro del mes. No cobramos nada extra por mantener tu web publicada ni por exportar (en planes de pago).",
    creditsExamples: [
      { plan: "Gratis", price: "0€", credits: "15", perChange: "0€", example: "15 mejoras gratis para probar el Studio" },
      { plan: "Pro", price: "19€", credits: "120", perChange: "~0,16€", example: "120 cambios ≈ diseño completo refinado" },
      { plan: "Business", price: "49€", credits: "300", perChange: "~0,16€", example: "300 cambios ≈ varias webs o proyectos de cliente" },
    ],
    whatCostsTitle: "Qué consume créditos y qué no",
    costsCredits: [
      "Pedir un cambio en el chat del Studio",
      "Pulsar «Mejorar» en una sección",
      "Cambiar estilo (Elegante / Minimal / Moderno)",
      "Regenerar el diseño",
      "Usar una sugerencia rápida",
    ],
    noCredits: [
      "Navegar plantillas y ver previsualizaciones",
      "Cargar una plantilla en el Studio (sin editar)",
      "Exportar código (tras pagar el proyecto)",
      "Mantener la web publicada en tu dominio",
      "Contactar soporte o solicitar presupuesto",
    ],
    customWebTitle: "Web a Medida — 2.900€",
    customWebSubtitle: "Para proyectos únicos donde no basta una plantilla. Precio cerrado, sin cuotas ocultas.",
    customWebPrice: "2.900€",
    customWebPriceNote: "Pago único · Llave en mano · IVA no incluido",
    customWebIncludes: "Diseño exclusivo, copywriting, desarrollo, SEO, publicación y 3 meses de soporte.",
    customWebLink: "Ver proceso completo",
    faqTitle: "Preguntas frecuentes",
    customNote: "¿Necesitas una web 100% exclusiva, sin plantilla?",
    customLink: "Web a Medida desde 2.900€",
    designedBy: "SUPERVISADO POR",
    founderTitle: "Supervisor Creativo de CREAUNA",
    features: [
      "Hasta 3 webs activas",
      "Webs ilimitadas",
      "60 plantillas premium (12 por sector)",
      "Créditos de edición mensuales",
      "Tecnología IA avanzada",
      "Dominio personalizado",
      "Exportación de código completo",
      "Soporte prioritario",
      "Analíticas avanzadas",
      "3 meses de ajustes incluidos"
    ],
    featureTableRows: [
      ["Webs activas", "Hasta 3", "Ilimitadas", "Ilimitadas"],
      ["Créditos de edición/mes", "15", "120", "300"],
      ["Coste aprox. por cambio", "0€", "~0,16€", "~0,16€"],
      ["Plantillas premium", "60 (12×5)", "60 (todas)", "60 (todas)"],
      ["Dominio personalizado", "—", "✓", "✓"],
      ["Exportación código", "HTML básico", "Completo (HTML/CSS/JS)", "Completo (HTML/CSS/JS)"],
      ["Coste de despliegue", "Sin coste", "Sin coste", "Sin coste"],
      ["Soporte", "Comunidad", "Prioritario (4h)", "VIP + SLA"],
      ["Hosting incluido", "—", "—", "1 año"],
      ["Colaboración equipo", "—", "—", "Ilimitada"],
      ["Web a medida", "—", "Descuento 10%", "Descuento 20% + Prioridad"],
    ],
  },
  en: {
    transparentPricing: "TRANSPARENT PRICING",
    title: "Choose the plan that fits you best",
    subtitle: "No surprises. No fine print. You always know what each change costs and what your plan includes.",
    monthly: "Monthly",
    yearly: "Yearly (Save 20%)",
    saveBadge: "SAVE 20%",
    mostPopular: "MOST POPULAR",
    periodYearly: "/mo, billed annually",
    periodMonthly: "/mo",
    periodFree: "forever",
    resultsLabel: "REAL RESULTS",
    resultsTitle: "All our websites share this level of detail.",
    resultsSubtitle: "Studio design, advanced tech, and personalized creative direction.",
    featuresTitle: "CREAUNA plan comparison",
    featuresCol: "Feature",
    creditsTitle: "How much does each change cost?",
    creditsSubtitle: "In Studio, every improvement you request (copy, colors, sections, styles) uses exactly 1 credit. Here is the real cost per plan.",
    creditsPerChange: "1 credit = 1 change in Studio",
    creditsTableCol1: "Plan",
    creditsTableCol2: "Monthly price",
    creditsTableCol3: "Credits/month",
    creditsTableCol4: "Cost per change",
    creditsTableCol5: "Practical example",
    creditsNote: "Credits renew every month. They do not roll over. We never charge extra to keep your site live or to export (on paid plans).",
    creditsExamples: [
      { plan: "Free", price: "€0", credits: "15", perChange: "€0", example: "15 free improvements to try Studio" },
      { plan: "Pro", price: "€19", credits: "120", perChange: "~€0.16", example: "120 changes ≈ fully refined design" },
      { plan: "Business", price: "€49", credits: "300", perChange: "~€0.16", example: "300 changes ≈ multiple sites or client projects" },
    ],
    whatCostsTitle: "What uses credits and what does not",
    costsCredits: [
      "Requesting a change in Studio chat",
      "Clicking «Improve» on a section",
      "Changing style (Elegant / Minimal / Modern)",
      "Regenerating the design",
      "Using a quick suggestion",
    ],
    noCredits: [
      "Browsing templates and previews",
      "Loading a template in Studio (without editing)",
      "Exporting code (after project payment)",
      "Keeping your site live on your domain",
      "Contacting support or requesting a quote",
    ],
    customWebTitle: "Custom Web — €2,900",
    customWebSubtitle: "For unique projects where templates are not enough. Fixed price, no hidden fees.",
    customWebPrice: "€2,900",
    customWebPriceNote: "One-time payment · Turnkey · VAT not included",
    customWebIncludes: "Exclusive design, copywriting, development, SEO, launch and 3 months of support.",
    customWebLink: "See full process",
    faqTitle: "Frequently Asked Questions",
    customNote: "Need a 100% exclusive site, no template?",
    customLink: "Custom Web from €2,900",
    designedBy: "SUPERVISED BY",
    founderTitle: "Creative Supervisor of CREAUNA",
    features: [
      "Up to 3 active websites",
      "Unlimited websites",
      "60 premium templates (12 per sector)",
      "Monthly editing credits",
      "Advanced AI technology",
      "Custom domain",
      "Full code export",
      "Priority support",
      "Advanced analytics",
      "3 months of adjustments included"
    ],
    featureTableRows: [
      ["Active websites", "Up to 3", "Unlimited", "Unlimited"],
      ["Editing credits/month", "15", "120", "300"],
      ["Approx. cost per change", "€0", "~€0.16", "~€0.16"],
      ["Premium templates", "60 (12×5)", "60 (all)", "60 (all)"],
      ["Custom domain", "—", "✓", "✓"],
      ["Code export", "Basic HTML", "Full (HTML/CSS/JS)", "Full (HTML/CSS/JS)"],
      ["Deployment cost", "No cost", "No cost", "No cost"],
      ["Support", "Community", "Priority (4h)", "VIP + SLA"],
      ["Hosting included", "—", "—", "1 year"],
      ["Team collaboration", "—", "—", "Unlimited"],
      ["Custom web", "—", "10% discount", "20% discount + Priority"],
    ],
  }
};

const plans = [
  {
    id: "gratis",
    name: "Gratis",
    nameEn: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    credits: 15,
    perChangeEs: "0€ por cambio",
    perChangeEn: "€0 per change",
    description: "15 créditos/mes gratis. Cada cambio en el Studio = 1 crédito. Ideal para probar sin tarjeta.",
    descriptionEn: "15 free credits/month. Each Studio change = 1 credit. Perfect to try without a card.",
    featuresIdx: [0, 2, 3, 4],
    cta: "Empezar gratis",
    ctaEn: "Start for free",
    popular: false,
    color: "from-slate-800 to-slate-950",
    highlight: false
  },
  {
    id: "pro",
    name: "Pro",
    nameEn: "Pro",
    priceMonthly: 19,
    priceYearly: 15,
    credits: 120,
    perChangeEs: "~0,16€ por cambio",
    perChangeEn: "~€0.16 per change",
    description: "120 créditos/mes por 19€. Cada mejora en el Studio cuesta ~0,16€. Sin coste extra por publicar.",
    descriptionEn: "120 credits/month for €19. Each Studio improvement costs ~€0.16. No extra fee to publish.",
    featuresIdx: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    cta: "Empezar prueba de 14 días",
    ctaEn: "Start 14-day trial",
    popular: true,
    color: "from-indigo-600 to-violet-700",
    highlight: true
  },
  {
    id: "business",
    name: "Business",
    nameEn: "Business",
    priceMonthly: 49,
    priceYearly: 39,
    credits: 300,
    perChangeEs: "~0,16€ por cambio",
    perChangeEn: "~€0.16 per change",
    description: "300 créditos/mes por 49€. Pensado para agencias y equipos con varios proyectos simultáneos.",
    descriptionEn: "300 credits/month for €49. Built for agencies and teams with multiple projects.",
    featuresIdx: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    extraFeatures: [
      "Hosting + dominio incluido (1 año)",
      "Colaboración en equipo ilimitada",
      "Web a medida con descuento",
      "Soporte VIP + SLA garantizado",
      "Prioridad en nuevas funciones"
    ],
    extraFeaturesEn: [
      "Hosting + domain included (1 year)",
      "Unlimited team collaboration",
      "Discounted custom web design",
      "VIP Support + guaranteed SLA",
      "Priority access to new features"
    ],
    cta: "Contactar con ventas",
    ctaEn: "Contact sales",
    popular: false,
    color: "from-rose-500 to-orange-600",
    highlight: false
  }
];

const faqs = [
  {
    q: "¿Cuánto cuesta cada crédito en euros?",
    qEn: "How much does each credit cost in euros?",
    a: "En el plan Gratis cada crédito cuesta 0€ (15 gratis al mes). En Pro (19€/120 créditos) y Business (49€/300 créditos), cada cambio equivale a aproximadamente 0,16€. Siempre ves tus créditos restantes en el Studio antes de confirmar.",
    aEn: "On the Free plan each credit costs €0 (15 free per month). On Pro (€19/120 credits) and Business (€49/300 credits), each change is roughly €0.16. You always see remaining credits in Studio before confirming."
  },
  {
    q: "¿Cómo funcionan los créditos?",
    qEn: "How do credits work?",
    a: "1 crédito = 1 cambio visible en el Studio (chat, botón Mejorar, cambio de estilo o regenerar). Los créditos se renuevan cada mes según tu plan. No cobramos créditos extra por mantener tu web publicada.",
    aEn: "1 credit = 1 visible change in Studio (chat, Improve button, style change or regenerate). Credits renew monthly per your plan. We never charge extra credits just to keep your site live."
  },
  {
    q: "¿Qué es la Web a Medida y cuánto cuesta?",
    qEn: "What is Custom Web and how much does it cost?",
    a: "Es un servicio aparte del Studio: diseño 100% exclusivo dirigido por Ramón del Pozo Rott. Precio cerrado desde 2.900€ (IVA no incluido), incluye briefing, 2 propuestas, desarrollo, SEO, publicación y 3 meses de soporte. Detalle en /web-a-medida",
    aEn: "A separate service from Studio: 100% exclusive design led by Ramón del Pozo Rott. Fixed price from €2,900 (VAT not included), including briefing, 2 proposals, development, SEO, launch and 3 months support. Details at /web-a-medida"
  },
  {
    q: "¿Puedo exportar mi web y llevarla a otro proveedor?",
    qEn: "Can I export my website and host it elsewhere?",
    a: "Sí. En los planes Pro y Business puedes exportar el código completo (HTML/CSS/JS limpio y optimizado) y usarlo donde quieras, sin penalización.",
    aEn: "Yes. With Pro and Business you can export full code (clean HTML/CSS/JS) and host it anywhere, with no penalty."
  },
  {
    q: "¿Hay compromiso de permanencia?",
    qEn: "Is there a long-term commitment?",
    a: "No. Puedes cancelar en cualquier momento sin penalización. Los créditos no usados del mes no se acumulan al siguiente.",
    aEn: "No. Cancel anytime with no penalty. Unused monthly credits do not roll over."
  }
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          {t.transparentPricing}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 max-w-3xl mx-auto mt-2 leading-[1.08] text-gradient">
          {t.title}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mt-6 max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>

        <div className="flex items-center justify-center mt-12 gap-4">
          <span className={`text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
            {t.monthly}
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-slate-900 rounded-full p-1 transition-all duration-300 relative cursor-pointer"
            aria-label="Toggle billing cycle"
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-sm font-semibold flex items-center gap-2 transition-colors ${billingCycle === 'yearly' ? 'text-indigo-600' : 'text-slate-400'}`}>
            {t.yearly}
            <span className="bg-indigo-100 border border-indigo-200/50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {t.saveBadge}
            </span>
          </span>
        </div>
      </div>

      <div className="container pb-20 mt-10">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => {
            const isYearly = billingCycle === 'yearly';
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            const period = plan.id === 'gratis' ? t.periodFree : (isYearly ? t.periodYearly : t.periodMonthly);
            const isPro = plan.id === 'pro';

            return (
              <div 
                key={plan.id} 
                className={`card-luxe relative rounded-[2.5rem] p-8 flex flex-col justify-between ${
                  isPro ? 'ring-2 ring-indigo-500 scale-[1.025] shadow-xl md:z-10' : 'bg-white'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] px-5 py-1.5 rounded-full font-bold tracking-widest shadow-md">
                    {t.mostPopular}
                  </div>
                )}

                <div>
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    {lang === 'es' ? plan.name : plan.nameEn}
                  </span>

                  <div className="mt-6 flex items-baseline">
                    <span className="text-6xl font-bold tracking-tighter text-slate-950">
                      {price}€
                    </span>
                    <span className="ml-2 text-xs font-semibold text-slate-500 leading-none">
                      {period}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed min-h-[48px]">
                    {lang === 'es' ? plan.description : plan.descriptionEn}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                      <Coins className="w-3 h-3" />
                      {plan.credits} {lang === 'es' ? 'créditos/mes' : 'credits/mo'}
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
                      <Euro className="w-3 h-3" />
                      {lang === 'es' ? plan.perChangeEs : plan.perChangeEn}
                    </div>
                  </div>
                  
                  <div className="h-px bg-slate-100 my-6" />

                  <ul className="space-y-4 text-sm">
                    {t.features.map((feature, i) => {
                      const included = plan.featuresIdx.includes(i) || plan.id === 'business';
                      return (
                        <li key={i} className="flex items-start gap-3">
                          {included ? (
                            <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                          )}
                          <span className={included ? "text-slate-700 font-medium" : "text-slate-400 line-through"}>
                            {feature}
                          </span>
                        </li>
                      );
                    })}

                    {plan.id === 'business' && (
                      (lang === 'es' ? plan.extraFeatures : plan.extraFeaturesEn)?.map((extra, idx) => (
                        <li key={`extra-${idx}`} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="text-slate-800 font-semibold">{extra}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link 
                    href={plan.id === "business" ? "/contacto" : "/studio"} 
                    className={`block text-center py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
                      isPro 
                        ? 'btn-gradient text-white shadow-md' 
                        : 'bg-slate-900 text-white hover:bg-black'
                    }`}
                  >
                    {lang === 'es' ? plan.cta : plan.ctaEn}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Credits transparency */}
      <div className="bg-white border-y border-slate-200 py-20">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <Coins className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
              {t.creditsTitle}
            </h3>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t.creditsSubtitle}
            </p>
            <p className="mt-2 text-sm font-semibold text-indigo-700">{t.creditsPerChange}</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white mb-8">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50/70 text-slate-500">
                  <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">{t.creditsTableCol1}</th>
                  <th className="px-4 py-4 text-center font-semibold text-xs tracking-wider uppercase">{t.creditsTableCol2}</th>
                  <th className="px-4 py-4 text-center font-semibold text-xs tracking-wider uppercase">{t.creditsTableCol3}</th>
                  <th className="px-4 py-4 text-center font-semibold text-xs tracking-wider uppercase">{t.creditsTableCol4}</th>
                  <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">{t.creditsTableCol5}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {t.creditsExamples.map((row) => (
                  <tr key={row.plan} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">{row.plan}</td>
                    <td className="px-4 py-4 text-center text-slate-700">{row.price}</td>
                    <td className="px-4 py-4 text-center text-indigo-700 font-semibold">{row.credits}</td>
                    <td className="px-4 py-4 text-center text-emerald-700 font-semibold">{row.perChange}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-slate-500 mb-10">{t.creditsNote}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-4">{t.whatCostsTitle} — {lang === 'es' ? 'Sí consume' : 'Uses credits'}</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {t.costsCredits.map((item) => (
                  <li key={item} className="flex gap-2"><Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="border border-slate-200 rounded-2xl p-6 bg-white">
              <h4 className="font-bold text-slate-900 mb-4">{lang === 'es' ? 'No consume créditos' : 'No credits used'}</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {t.noCredits.map((item) => (
                  <li key={item} className="flex gap-2"><X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Custom web CTA */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-16">
        <div className="container max-w-4xl text-center">
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{t.customWebTitle}</h3>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto leading-relaxed">{t.customWebSubtitle}</p>
          <div className="mt-8 text-5xl font-bold tracking-tight text-white">{t.customWebPrice}</div>
          <p className="text-sm text-slate-400 mt-2">{t.customWebPriceNote}</p>
          <p className="text-sm text-indigo-200 mt-4 max-w-xl mx-auto">{t.customWebIncludes}</p>
          <Link href="/web-a-medida" className="inline-block mt-8 px-10 py-4 bg-white text-slate-900 rounded-2xl font-semibold hover:bg-slate-100 transition">
            {t.customWebLink}
          </Link>
        </div>
      </div>

      <div className="container mb-24 mt-20">
        <div className="relative rounded-[3rem] overflow-hidden h-[400px] flex items-end shadow-xl border border-slate-200/50">
          <img 
            src="/precio.webp" 
            alt="Proyectos premium CREAUNA" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative p-10 md:p-14 text-white max-w-2xl">
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
              {t.resultsLabel}
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
              {t.resultsTitle}
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed text-sm md:text-base">
              {t.resultsSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border-y border-slate-200 py-20">
        <div className="container max-w-5xl">
          <h3 className="text-center text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mb-12">
            {t.featuresTitle}
          </h3>
          
          <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-50/70 text-slate-500">
                  <th className="px-8 py-5 font-semibold text-xs tracking-wider uppercase">{t.featuresCol}</th>
                  <th className="px-6 py-5 text-center font-semibold text-xs tracking-wider uppercase">Free</th>
                  <th className="px-6 py-5 text-center font-semibold text-xs tracking-wider uppercase">Pro</th>
                  <th className="px-6 py-5 text-center font-semibold text-xs tracking-wider uppercase">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {t.featureTableRows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4.5 font-medium text-slate-900">{row[0]}</td>
                    <td className="px-6 py-4.5 text-center text-slate-500">{row[1]}</td>
                    <td className="px-6 py-4.5 text-center text-indigo-700 font-semibold">{row[2]}</td>
                    <td className="px-6 py-4.5 text-center text-indigo-900 font-bold">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="container py-24 max-w-3xl">
        <div className="text-center mb-12">
          <HelpCircle className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
            {t.faqTitle}
          </h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FaqItem 
              key={i} 
              question={lang === 'es' ? faq.q : faq.qEn} 
              answer={lang === 'es' ? faq.a : faq.aEn} 
            />
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-600">
        <div className="container flex flex-col md:flex-row items-center justify-center gap-4">
          <span>{t.customNote}</span>
          <Link 
            href="/web-a-medida" 
            className="underline font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            {t.customLink}
          </Link>
        </div>
      </div>

      <div className="bg-[#f8f7f4] border-t border-slate-200 py-16">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-xl mb-4 transition-transform hover:scale-105 duration-300">
              <img 
                src="/creador.webp" 
                alt="Ramón del Pozo Rott" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="text-[10px] tracking-[3px] text-slate-500 uppercase font-semibold">
              {t.designedBy}
            </div>
            <div className="font-semibold text-sm text-slate-700 tracking-tight mt-1">
              Ramón del Pozo Rott
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              {t.founderTitle}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
