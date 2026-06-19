'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const templates = [
  {
    id: 1,
    name: "Atelier",
    category: "Joyería & Lujo",
    image: "/images/luxury-jewelry-atelier-elegant-interior--1.jpg",
    preview: "/images/luxury-jewelry-atelier-elegant-interior--1.jpg",
    description: "Diseño ultra refinado para marcas de lujo. Espacios generosos, tipografía elegante y detalles exquisitos.",
  },
  {
    id: 2,
    name: "Vesper",
    category: "Restaurante de Lujo",
    image: "/images/fine-dining-restaurant-interior-elegant--1.jpg",
    preview: "/images/fine-dining-restaurant-interior-elegant--1.jpg",
    description: "Elegancia gastronómica. Diseñada para restaurantes de alto nivel, hoteles boutique y experiencias culinarias memorables.",
  },
  {
    id: 3,
    name: "Sable",
    category: "Restaurantes & Gastronomía",
    image: "/images/fine-dining-restaurant-interior-elegant--1.jpg",
    preview: "/images/fine-dining-restaurant-interior-elegant--1.jpg",
    description: "Calidez y sofisticación. Ideal para restaurantes, hoteles boutique y experiencias gastronómicas premium.",
  },
  {
    id: 4,
    name: "Arc",
    category: "Tecnología & SaaS",
    image: "/images/modern-architecture-minimalist-building--2.jpg",
    preview: "/images/modern-architecture-minimalist-building--2.jpg",
    description: "Diseño moderno, limpio y altamente convertible. La elección de startups y empresas tecnológicas.",
  }
];

export default function Templates() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container pt-16 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl font-semibold tracking-tight">Plantillas espectaculares</h1>
          <p className="mt-4 text-xl text-slate-600">
            Cada una diseñada con el más alto nivel de detalle. 
            Elige una y hazla completamente tuya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {templates.map((tpl) => (
            <div 
              key={tpl.id} 
              onClick={() => setSelected(tpl)}
              className="group cursor-pointer overflow-hidden rounded-3xl border bg-white hover:shadow-xl transition-all"
            >
              <div className="relative h-80">
                <img 
                  src={tpl.image} 
                  alt={tpl.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-6">
                <div className="font-semibold text-2xl tracking-tight">{tpl.name}</div>
                <div className="text-sm text-slate-500">{tpl.category}</div>
                <p className="mt-3 text-sm text-slate-600 line-clamp-3">{tpl.description}</p>
                <div className="mt-5 text-sm font-medium text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ver preview detallado <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Beautiful Modal Preview */}
      {selected && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="max-w-6xl w-full bg-white rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-5 border-b">
              <div>
                <div className="font-semibold text-3xl tracking-tight">{selected.name}</div>
                <div className="text-slate-500">{selected.category}</div>
              </div>
              <div className="flex gap-3">
                <Link href="/studio" className="btn-gradient px-8 py-3 rounded-2xl text-sm font-semibold">
                  Usar esta plantilla
                </Link>
                <button onClick={() => setSelected(null)} className="px-6 py-3 text-sm border rounded-2xl">Cerrar</button>
              </div>
            </div>

            <div className="p-6 bg-slate-50">
              <div className="mx-auto max-w-[1080px]">
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border">
                  <div className="h-10 bg-slate-100 border-b flex items-center px-4 text-xs text-slate-500">
                    {selected.name.toLowerCase()}.creauna.com
                  </div>
                  <img 
                    src={selected.preview} 
                    alt={selected.name} 
                    className="w-full" 
                  />
                </div>
              </div>
            </div>

            <div className="p-8 text-center text-sm text-slate-600 border-t">
              Esta es una representación real de cómo se vería tu web usando esta plantilla.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
