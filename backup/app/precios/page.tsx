'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

const plans = [
  { 
    name: "Gratis", 
    price: "0", 
    period: "para siempre", 
    color: "from-slate-700 to-slate-900",
    features: ["3 webs", "Plantillas básicas", "Soporte comunidad", "Export HTML"],
    cta: "Empezar gratis"
  },
  { 
    name: "Pro", 
    price: "29", 
    period: "/mes", 
    color: "from-indigo-500 to-violet-600",
    popular: true,
    features: ["Webs ilimitadas", "Todas las plantillas", "Equipo de IAs completo", "Dominio personalizado", "Export código premium", "Soporte prioritario"],
    cta: "Elegir Pro"
  },
  { 
    name: "Business", 
    price: "79", 
    period: "/mes", 
    color: "from-rose-500 to-orange-500",
    features: ["Todo de Pro", "Hosting + Dominio incluido", "Equipo IA personalizado", "Colaboración ilimitada", "Analíticas avanzadas", "Soporte VIP + SLA"],
    cta: "Elegir Business"
  },
];

export default function Precios() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container pt-16 pb-12 text-center">
        <h1 className="text-6xl font-semibold tracking-tight">Planes que se adaptan a ti</h1>
        <p className="text-2xl text-slate-600 mt-4">Elige el nivel de potencia que necesitas.</p>
      </div>

      <div className="container pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`premium-card rounded-3xl p-8 relative ${plan.popular ? 'ring-2 ring-indigo-500 scale-[1.02]' : ''}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-5 py-1 rounded-full font-medium">MÁS POPULAR</div>}
              
              <div className={`inline-block px-4 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${plan.color}`}>
                {plan.name}
              </div>
              
              <div className="mt-6">
                <span className="text-6xl font-semibold">{plan.price}</span>
                <span className="text-xl text-slate-500">€{plan.period}</span>
              </div>

              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-500 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>

              <Link href="/studio" className="mt-8 block text-center py-3.5 rounded-2xl font-semibold btn-gradient">
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">Dominio y alojamiento se pueden añadir por 12€/mes adicionales</p>
      </div>
    </div>
  );
}
