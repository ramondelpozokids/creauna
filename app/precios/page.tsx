'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

const plans = [
  {
    name: "Gratis",
    price: "0",
    period: "para siempre",
    description: "Perfecto para probar la plataforma y proyectos personales pequeños.",
    features: [
      "Hasta 3 webs activas",
      "Plantillas básicas",
      "Exportación HTML simple",
      "Soporte de la comunidad",
      "Subdominio creauna.com",
      "Sin marca de agua"
    ],
    cta: "Empezar gratis",
    popular: false,
    color: "from-slate-700 to-slate-900",
    highlight: false
  },
  {
    name: "Pro",
    price: "29",
    period: "/mes",
    description: "La opción más elegida por profesionales y pequeñas empresas.",
    features: [
      "Webs ilimitadas",
      "Todas las plantillas premium",
      "Tecnología IA avanzada",
      "Dominio personalizado",
      "Exportación de código completo",
      "Soporte prioritario",
      "Analíticas avanzadas",
      "3 meses de ajustes incluidos"
    ],
    cta: "Empezar prueba de 14 días",
    popular: true,
    color: "from-indigo-600 to-violet-600",
    highlight: true
  },
  {
    name: "Business",
    price: "79",
    period: "/mes",
    description: "Para agencias, marcas y equipos que necesitan lo mejor.",
    features: [
      "Todo lo de Pro",
      "Hosting + dominio incluido (1 año)",
      "Colaboración en equipo ilimitada",
      "Web a medida con descuento",
      "Soporte VIP + SLA garantizado",
      "Analíticas premium + reportes",
      "Prioridad en nuevas funciones",
      "Sesiones de estrategia con el equipo"
    ],
    cta: "Contactar con ventas",
    popular: false,
    color: "from-rose-500 to-orange-500",
    highlight: false
  }
];

const faqs = [
  {
    q: "¿Puedo cambiar de plan en cualquier momento?",
    a: "Sí. Puedes subir o bajar de plan en cualquier momento. Los cambios se aplican de forma proporcional."
  },
  {
    q: "¿Qué incluye el soporte prioritario?",
    a: "Respuesta en menos de 4 horas en días laborables + un gestor de cuenta dedicado en el plan Business."
  },
  {
    q: "¿Puedo exportar mi web y llevarla a otro proveedor?",
    a: "Sí. En los planes Pro y Business puedes exportar el código completo y usarlo donde quieras."
  },
  {
    q: "¿Hay compromiso de permanencia?",
    a: "No. Puedes cancelar en cualquier momento. No hay penalizaciones."
  }
];

export default function Precios() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container pt-16 pb-12 text-center">
        <div className="text-sm font-semibold tracking-widest text-indigo-600">PRECIOS TRANSPARENTES</div>
        <h1 className="text-6xl font-semibold tracking-tight mt-3">Elige el plan que mejor se adapta a ti</h1>
        <p className="text-xl text-slate-600 mt-4 max-w-xl mx-auto">
          Sin sorpresas. Sin letras pequeñas. Calidad de estudio de diseño al alcance de cualquiera.
        </p>
      </div>

      {/* Hero visual */}
      <div className="container mb-16">
        <div className="relative rounded-3xl overflow-hidden h-[380px] flex items-end">
          <img 
            src="/images/luxury-jewelry-atelier-elegant-interior--1.jpg" 
            alt="Proyectos premium CREAUNA" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="relative p-10 text-white max-w-2xl">
            <div className="text-sm tracking-[2px] font-medium opacity-80">RESULTADOS REALES</div>
            <div className="text-4xl font-semibold tracking-tight mt-2">Todas nuestras webs tienen este nivel.</div>
            <p className="mt-2 text-white/80">Diseño de estudio, tecnología avanzada y atención personalizada.</p>
          </div>
        </div>
      </div>

      {/* Planes */}
      <div className="container pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`premium-card rounded-3xl p-8 flex flex-col relative transition-all ${plan.popular ? 'ring-2 ring-indigo-500 scale-[1.015] shadow-xl' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-6 py-1 rounded-full font-semibold tracking-wider">
                  MÁS ELEGIDO
                </div>
              )}

              <div>
                <div className={`inline-block px-5 py-1 text-white text-sm font-medium rounded-full bg-gradient-to-r ${plan.color}`}>
                  {plan.name}
                </div>

                <div className="mt-8 flex items-baseline">
                  <span className="text-7xl font-semibold tracking-tighter">{plan.price}</span>
                  <span className="ml-1 text-xl text-slate-500">€{plan.period}</span>
                </div>
                <p className="mt-3 text-lg text-slate-600">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-4 text-sm flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-600 mt-0.5 font-bold">✓</span>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href={plan.name === "Business" ? "/contacto" : "/studio"} 
                className={`mt-8 block text-center py-4 rounded-2xl font-semibold text-base transition ${plan.popular ? 'btn-gradient text-white' : 'border border-slate-300 hover:bg-slate-50'}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Comparativa */}
      <div className="bg-slate-50 py-16">
        <div className="container max-w-5xl">
          <h3 className="text-center text-3xl font-semibold tracking-tight mb-10">Comparativa detallada</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 font-medium text-slate-500">Característica</th>
                  <th className="text-center py-4 font-medium">Gratis</th>
                  <th className="text-center py-4 font-medium">Pro</th>
                  <th className="text-center py-4 font-medium">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ["Webs ilimitadas", "3", "✓", "✓"],
                  ["Plantillas premium", "Básicas", "✓", "✓"],
                  ["Dominio propio", "—", "✓", "✓"],
                  ["Exportación código", "HTML básico", "Completo", "Completo"],
                  ["Soporte", "Comunidad", "Prioritario", "VIP + SLA"],
                  ["Hosting incluido", "—", "—", "1 año"],
                  ["Colaboración equipo", "—", "—", "Ilimitada"],
                  ["Web a medida", "—", "Descuento", "Descuento + prioridad"]
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white">
                    <td className="py-4 font-medium">{row[0]}</td>
                    <td className="py-4 text-center text-slate-500">{row[1]}</td>
                    <td className="py-4 text-center text-emerald-700 font-medium">{row[2]}</td>
                    <td className="py-4 text-center text-emerald-700 font-medium">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="container py-20 max-w-3xl">
        <h3 className="text-center text-3xl font-semibold tracking-tight mb-10">Preguntas frecuentes</h3>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl p-7">
              <div className="font-semibold text-lg">{faq.q}</div>
              <div className="mt-3 text-slate-600 leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t py-14 text-center text-sm text-slate-500">
        ¿Necesitas algo más grande o una web completamente a medida? <Link href="/web-a-medida" className="underline font-medium">Ver Web a Medida</Link>
      </div>

      {/* Creador - Nivel más alto */}
      <div className="mt-12 border-t pt-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full overflow-hidden ring-4 ring-white shadow-xl mb-3">
            <img src="/images/ramon-del-pozo-rott.jpg" alt="Ramón del Pozo Rott" className="w-full h-full object-cover" />
          </div>
          <div className="text-xs tracking-[2.5px] text-slate-500">DISEÑADO CON LA DIRECCIÓN CREATIVA DE</div>
          <div className="font-semibold tracking-tight mt-1">Ramón del Pozo Rott</div>
          <div className="text-xs text-slate-500">Fundador de CREAUNA</div>
        </div>
      </div>
    </div>
  );
}
