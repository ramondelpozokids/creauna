'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { Sparkles, Edit3, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function ComoFunciona() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            EL PROCESO
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 mt-2 leading-[1.08] text-gradient">
            Cómo funciona CREAUNA
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-xl mx-auto">
            Crear una web de nivel profesional nunca había sido tan rápido, intuitivo y hermoso.
          </p>
        </div>
      </div>

      {/* Step 1 */}
      <div className="container py-16 border-t border-slate-200">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <div className="text-xs font-bold tracking-widest text-indigo-600 mb-2">PASO 01</div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950">Describe tu visión</h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Escribe con total libertad lo que necesitas para tu negocio o marca personal. No necesitas saber programación ni tecnicismos.
            </p>
            <div className="mt-6 bg-white p-6 rounded-3xl text-slate-700 border border-slate-200 shadow-sm leading-relaxed text-sm italic">
              “Quiero una web elegante para mi estudio de arquitectura en Madrid. 
              Mucho espacio en blanco, tipografía refinada, fotos grandes y que transmita confianza y modernidad.”
            </div>
          </div>
          <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-lg relative bg-white p-2">
            <img 
              src="/inteligencia.webp" 
              alt="Describe tu visión en CREAUNA" 
              className="w-full h-[320px] object-cover rounded-[2rem]" 
            />
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white py-20 border-y border-slate-200">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="order-2 md:order-1 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-lg relative bg-white p-2">
              <img 
                src="/mockup.webp" 
                alt="Refina tu diseño en tiempo real" 
                className="w-full h-[320px] object-cover rounded-[2rem]" 
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="text-xs font-bold tracking-widest text-indigo-600 mb-2">PASO 02</div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-950">Refina en tiempo real</h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                En el Studio verás los cambios en tiempo real. Puedes conversar con la IA y pedirle cualquier tipo de ajuste de manera conversacional:
              </p>
              <ul className="mt-6 space-y-3.5 text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs">✓</span>
                  “Quiero que sea más elegante y con más blanco”
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs">✓</span>
                  “Cambia los colores a tonos tierra y beige”
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs">✓</span>
                  “Haz el hero principal mucho más impactante”
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs">✓</span>
                  “Añade una nueva sección de servicios”
                </li>
              </ul>
              <p className="mt-6 text-xs text-slate-500 font-semibold tracking-wide">Todo se actualiza en segundos sin tiempos de espera.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="container py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <div className="text-xs font-bold tracking-widest text-indigo-600 mb-2">PASO 03</div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950">Publica o exporta</h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Una vez que el diseño esté tal como deseas, puedes elegir cómo proceder de forma inmediata:
            </p>
            <div className="mt-6 space-y-4 text-sm text-slate-700 font-semibold">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="w-5 h-5 text-indigo-600" />
                Publicar directamente con tu dominio propio (.com, .es, etc.)
              </div>
              <div className="flex items-center gap-3">
                <ArrowUpRight className="w-5 h-5 text-indigo-600" />
                Exportar el código limpio (HTML/CSS/JS optimizado)
              </div>
              <div className="flex items-center gap-3">
                <ArrowUpRight className="w-5 h-5 text-indigo-600" />
                Dejar la configuración técnica del hosting en nuestras manos
              </div>
            </div>
          </div>
          
          <div className="relative rounded-[2.5rem] overflow-hidden h-[340px] flex items-end shadow-xl border border-slate-200">
            <img 
              src="/futuro.webp" 
              alt="Publica tu web en CREAUNA" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="relative p-8 text-white">
              <h3 className="text-2xl font-bold tracking-tight">Tu web lista en minutos, no en meses.</h3>
              <p className="mt-2 text-white/80 text-xs font-medium">Diseño de estudio de alto nivel y tecnología de vanguardia.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="border-t border-slate-200 py-16 text-center bg-white">
        <h3 className="text-2xl font-bold tracking-tight mb-6">¿Listo para crear la web perfecta para tu negocio?</h3>
        <Link href="/studio" className="btn-gradient px-12 py-4 rounded-2xl text-base font-semibold inline-block shadow-md">
          Empezar ahora en el Studio
        </Link>
      </div>
    </div>
  );
}
