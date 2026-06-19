'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function ComoFunciona() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container pt-16 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm font-semibold tracking-[3px] text-indigo-600">EL PROCESO</div>
          <h1 className="text-6xl font-semibold tracking-tight mt-3">Cómo funciona CREAUNA</h1>
          <p className="mt-5 text-xl text-slate-600">
            Crear una web de nivel profesional nunca había sido tan rápido y hermoso.
          </p>
        </div>
      </div>

      <div className="container py-16 border-t">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-semibold tracking-widest text-indigo-600 mb-2">PASO 01</div>
            <h2 className="text-5xl font-semibold tracking-tight">Describe tu visión</h2>
            <p className="mt-5 text-lg text-slate-600">
              Escribe con total libertad lo que necesitas. No hace falta que seas técnico.
            </p>
            <div className="mt-6 bg-slate-50 p-6 rounded-3xl text-slate-700 border">
              “Quiero una web elegante para mi estudio de arquitectura en Madrid. 
              Mucho espacio, tipografía refinada, fotos grandes y que transmita confianza y modernidad.”
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border">
            <img 
              src="/images/modern-architecture-minimalist-building--1.jpg" 
              alt="Describe tu visión" 
              className="w-full h-[380px] object-cover" 
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-16 border-y">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-3xl overflow-hidden border">
              <img 
                src="/images/fine-dining-restaurant-interior-elegant--1.jpg" 
                alt="Refina en tiempo real" 
                className="w-full h-[380px] object-cover" 
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="text-xs font-semibold tracking-widest text-indigo-600 mb-2">PASO 02</div>
              <h2 className="text-5xl font-semibold tracking-tight">Refina en tiempo real</h2>
              <p className="mt-5 text-lg text-slate-600">
                En el Studio ves los cambios al instante. Puedes pedir cualquier cosa:
              </p>
              <ul className="mt-6 space-y-3 text-slate-700">
                <li className="flex gap-3">• “Quiero que sea más elegante y con más blanco”</li>
                <li className="flex gap-3">• “Cambia los colores a tonos tierra”</li>
                <li className="flex gap-3">• “Haz el hero más impactante”</li>
                <li className="flex gap-3">• “Añade una sección de proyectos”</li>
              </ul>
              <p className="mt-6 text-sm text-slate-500">Todo se actualiza en segundos. Sin esperas.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-semibold tracking-widest text-indigo-600 mb-2">PASO 03</div>
            <h2 className="text-5xl font-semibold tracking-tight">Publica o exporta</h2>
            <p className="mt-5 text-lg text-slate-600">
              Cuando estés satisfecho, eliges cómo continuar:
            </p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="flex gap-4"><span className="font-semibold">→</span> Publicar con tu dominio propio</div>
              <div className="flex gap-4"><span className="font-semibold">→</span> Exportar el código completo</div>
              <div className="flex gap-4"><span className="font-semibold">→</span> Dejar que nosotros la subamos y configuremos</div>
            </div>
          </div>
          <div className="bg-slate-900 text-white rounded-3xl p-10">
            <div className="text-4xl font-semibold tracking-tight leading-none">Tu web lista en minutos,<br />no en meses.</div>
            <p className="mt-6 text-white/70">Diseño de estudio de alto nivel. Velocidad de tecnología avanzada.</p>
          </div>
        </div>
      </div>

      <div className="border-t py-14 text-center">
        <Link href="/studio" className="btn-gradient px-12 py-4 rounded-3xl text-xl font-semibold inline-block">
          Empezar ahora en el Studio
        </Link>
      </div>
    </div>
  );
}
