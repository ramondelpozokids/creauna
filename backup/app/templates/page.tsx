'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../components/Navbar';

const templates = [
  { id: 1, name: "Joyería Premium", category: "Ecommerce", color: "from-rose-500 to-orange-400", desc: "Elegante y sofisticada", price: "Gratis" },
  { id: 2, name: "Startup Moderna", category: "SaaS", color: "from-indigo-500 to-violet-500", desc: "Tecnológica y limpia", price: "Gratis" },
  { id: 3, name: "Restaurante Gourmet", category: "Local", color: "from-amber-400 to-yellow-500", desc: "Calor y apetito", price: "Gratis" },
  { id: 4, name: "Arquitecto Creativo", category: "Portfolio", color: "from-emerald-500 to-teal-500", desc: "Minimal y potente", price: "Pro" },
  { id: 5, name: "Agencia de Marketing", category: "Agencia", color: "from-fuchsia-500 to-purple-600", desc: "Impactante y colorida", price: "Pro" },
  { id: 6, name: "Clínica Estética", category: "Salud", color: "from-sky-400 to-cyan-500", desc: "Confianza y elegancia", price: "Gratis" },
  { id: 7, name: "Boutique de Moda", category: "Ecommerce", color: "from-pink-500 to-rose-500", desc: "Lujo y tendencia", price: "Pro" },
  { id: 8, name: "Coach & Mentor", category: "Personal", color: "from-orange-400 to-amber-500", desc: "Inspiradora y humana", price: "Gratis" },
];

export default function Templates() {
  const [filter, setFilter] = useState("Todos");

  const filtered = filter === "Todos" ? templates : templates.filter(t => t.category === filter);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container pt-16 pb-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-medium text-indigo-600">PLANTILLAS 2026</div>
          <h1 className="text-6xl font-semibold tracking-tight mt-3">Plantillas más bonitas que la competencia</h1>
          <p className="mt-4 text-xl text-slate-600">Diseñadas por nuestro equipo de IAs. Listas para personalizar en minutos.</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-10 mb-8">
          {["Todos", "Ecommerce", "SaaS", "Portfolio", "Agencia", "Local", "Salud"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${filter === cat ? 'bg-slate-900 text-white' : 'border hover:bg-slate-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((template) => (
            <div key={template.id} className="template-card group">
              <div className={`h-52 bg-gradient-to-br ${template.color} rounded-3xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white text-xs tracking-widest opacity-75">{template.category}</div>
                  <div className="text-white text-2xl font-semibold tracking-tight">{template.name}</div>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 text-xs bg-white/90 text-slate-900 rounded-full font-medium">
                  {template.price}
                </div>
              </div>
              <div className="p-5">
                <div className="text-sm text-slate-600">{template.desc}</div>
                <Link 
                  href="/studio" 
                  className="mt-4 block text-center btn-gradient px-6 py-3 rounded-2xl text-sm"
                >
                  Usar esta plantilla
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
