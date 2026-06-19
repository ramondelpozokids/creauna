'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { Check, X, ChevronDown, HelpCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const translations = {
  es: {
    transparentPricing: "PRECIOS TRANSPARENTES",
    title: "Elige el plan que mejor se adapta a ti",
    subtitle: "Sin sorpresas. Sin letras pequeñas. Calidad de estudio de diseño al alcance de cualquiera.",
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
    featuresTitle: "Comparativa detallada",
    featuresCol: "Característica",
    faqTitle: "Preguntas frecuentes",
    customNote: "¿Necesitas algo más grande o una web completamente a medida?",
    customLink: "Ver Web a Medida",
    designedBy: "DISEÑADO CON LA DIRECCIÓN CREATIVA DE",
    founderTitle: "Fundador de CREAUNA",
    features: [
      "Hasta 3 webs activas",
      "Webs ilimitadas",
      "Todas las plantillas premium",
      "Tecnología IA avanzada",
      "Dominio personalizado",
      "Exportación de código completo",
      "Soporte prioritario",
      "Analíticas avanzadas",
      "3 meses de ajustes incluidos"
    ]
  },
  en: {
    transparentPricing: "TRANSPARENT PRICING",
    title: "Choose the plan that fits you best",
    subtitle: "No surprises. No fine print. Studio-grade design within everyone's reach.",
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
    featuresTitle: "Detailed Comparison",
    featuresCol: "Feature",
    faqTitle: "Frequently Asked Questions",
    customNote: "Need something larger or a fully custom website?",
    customLink: "View Custom Web",
    designedBy: "DESIGNED WITH THE CREATIVE DIRECTION OF",
    founderTitle: "Founder of CREAUNA",
    features: [
      "Up to 3 active websites",
      "Unlimited websites",
      "All premium templates",
      "Advanced AI technology",
      "Custom domain",
      "Full code export",
      "Priority support",
      "Advanced analytics",
      "3 months of adjustments included"
    ]
  }
};

const plans = [
  {
    id: "gratis",
    name: "Gratis",
    nameEn: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Perfecto para probar la plataforma y proyectos personales pequeños.",
    descriptionEn: "Perfect for testing the platform and small personal projects.",
    featuresIdx: [0, 2, 3], // indices from features array
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
    priceMonthly: 29,
    priceYearly: 23,
    description: "La opción más elegida por profesionales y pequeñas empresas.",
    descriptionEn: "The most popular choice for professionals and small businesses.",
    featuresIdx: [1, 2, 3, 4, 5, 6, 7, 8],
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
    priceMonthly: 79,
    priceYearly: 63,
    description: "Para agencias, marcas y equipos que necesitan lo mejor.",
    descriptionEn: "For agencies, brands, and teams who demand the absolute best.",
    featuresIdx: [1, 2, 3, 4, 5, 6, 7, 8],
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
    q: "¿Puedo cambiar de plan en cualquier momento?",
    qEn: "Can I change my plan at any time?",
    a: "Sí. Puedes subir o bajar de plan en cualquier momento. Los cambios se aplican de forma proporcional en tu factura.",
    aEn: "Yes. You can upgrade or downgrade at any time. Changes are applied proportionally to your billing cycle."
  },
  {
    q: "¿Qué incluye el soporte prioritario?",
    qEn: "What does priority support include?",
    a: "Respuesta en menos de 4 horas en días laborables + un gestor de cuenta dedicado en el plan Business.",
    aEn: "Response in less than 4 hours on business days + a dedicated account manager in the Business plan."
  },
  {
    q: "¿Puedo exportar mi web y llevarla a otro proveedor?",
    qEn: "Can I export my website and host it elsewhere?",
    a: "Sí. En los planes Pro y Business puedes exportar el código completo (HTML/CSS/JS limpio y optimizado) y usarlo donde quieras.",
    aEn: "Yes. With the Pro and Business plans, you can export the full code (clean, optimized HTML/CSS/JS) and host it wherever you prefer."
  },
  {
    q: "¿Hay compromiso de permanencia?",
    qEn: "Is there a long-term commitment?",
    a: "No. Puedes cancelar en cualquier momento de forma inmediata y sin ningún tipo de penalización.",
    aEn: "No. You can cancel at any time immediately with no penalty fees or hidden conditions."
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

      {/* Main Header */}
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

        {/* Toggle Billing */}
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

      {/* Pricing Cards */}
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
                  <div className="flex justify-between items-start">
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                      {lang === 'es' ? plan.name : plan.nameEn}
                    </span>
                  </div>

                  <div className="mt-6 flex items-baseline">
                    <span className="text-6xl font-bold tracking-tighter text-slate-950">
                      {price}€
                    </span>
                    <span className="ml-2 text-xs font-semibold text-slate-500 leading-none">
                      {period}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed min-h-[40px]">
                    {lang === 'es' ? plan.description : plan.descriptionEn}
                  </p>
                  
                  <div className="h-px bg-slate-100 my-6" />

                  <ul className="space-y-4 text-sm">
                    {/* General features */}
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

                    {/* Extra business features */}
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

      {/* Visual Banner section */}
      <div className="container mb-24">
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

      {/* Detail Comparison Table */}
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
                {[
                  ["Webs activas", "Hasta 3", "Ilimitadas", "Ilimitadas"],
                  ["Plantillas premium", "Básicas", "Todas (12+)", "Todas (12+)"],
                  ["Dominio personalizado", "—", "✓", "✓"],
                  ["Exportación código", "HTML básico", "Completo (HTML/CSS/JS)", "Completo (HTML/CSS/JS)"],
                  ["Soporte", "Comunidad", "Prioritario (4h)", "VIP + SLA"],
                  ["Hosting incluido", "—", "—", "1 año"],
                  ["Colaboración equipo", "—", "—", "Ilimitada"],
                  ["Web a medida", "—", "Descuento 10%", "Descuento 20% + Prioridad"]
                ].map((row, i) => (
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

      {/* FAQ Accordion Section */}
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

      {/* Secondary CTA */}
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

      {/* Creative Direction Signature - Ramon del Pozo Rott */}
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
            <div className="font-bold text-xl text-slate-900 tracking-tight mt-1">
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
