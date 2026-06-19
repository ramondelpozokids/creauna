'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export default function WebAMedida() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-rose-500 text-white text-xs px-4 py-1.5 rounded-full font-bold tracking-wider uppercase mb-4 animate-fade-in shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            SERVICIO PREMIUM
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 mt-2 leading-[1.08] text-gradient">
            Web a Medida
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
            No quieres elegir una plantilla. Quieres que tu web sea única, diseñada exclusivamente según tus especificaciones.
          </p>
        </div>
      </div>

      <div className="container max-w-5xl px-6">
        {/* Banner with publi.webp */}
        <div className="relative rounded-[3rem] overflow-hidden h-[340px] mb-12 shadow-xl border border-slate-200">
          <img 
            src="/publi.webp" 
            alt="Web a medida premium" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Tú solo tienes que decirnos qué quieres.</h2>
            <p className="mt-2 text-white/80 text-sm md:text-base">Nosotros nos encargamos del resto con dirección creativa humana experta.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-luxe p-8 rounded-[2.5rem] bg-white border border-slate-200">
            <h3 className="font-bold text-2xl tracking-tight text-slate-950 mb-6">¿Cómo funciona?</h3>
            <div className="space-y-5 text-sm text-slate-600">
              <div className="flex gap-4">
                <span className="font-bold text-indigo-600">1.</span>
                <div>
                  <span className="font-semibold text-slate-950 block">Reunión de briefing</span>
                  Nos reunimos para entender tu marca, tus objetivos y la estética que buscas transmitir.
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-indigo-600">2.</span>
                <div>
                  <span className="font-semibold text-slate-950 block">Propuestas de diseño</span>
                  Te presentamos 2 propuestas visuales completamente diferenciadas en un plazo de 5 a 7 días.
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-indigo-600">3.</span>
                <div>
                  <span className="font-semibold text-slate-950 block">Desarrollo e integración</span>
                  Programamos el diseño definitivo optimizando la carga, el SEO y la adaptabilidad móvil.
                </div>
              </div>
              <div className="flex gap-4">
                <span className="font-bold text-indigo-600">4.</span>
                <div>
                  <span className="font-semibold text-slate-950 block">Entrega final</span>
                  Publicamos la web en tu dominio propio o te entregamos los archivos completos.
                </div>
              </div>
            </div>
          </div>

          <div className="card-luxe p-8 rounded-[2.5rem] bg-white border border-slate-200">
            <h3 className="font-bold text-2xl tracking-tight text-slate-950 mb-6">¿Qué incluye?</h3>
            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                Diseño exclusivo 100% a tu medida
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                Textos escritos profesionalmente (Copywriting)
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                Fotografía y visuales premium integrados
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                Desarrollo técnico optimizado y adaptativo
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                SEO On-Page básico y avanzado
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                Garantía técnica y 3 meses de soporte incluidos
              </li>
            </ul>
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="mt-16 text-center bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-12 shadow-sm mb-16">
          <div className="text-slate-500 font-semibold tracking-wider text-xs uppercase">PRESUPUESTO ESTIMADO</div>
          <div className="text-5xl font-bold tracking-tight text-slate-950 mt-2">Desde 2.900€</div>
          <p className="text-slate-500 text-xs mt-1">Llave en mano. Sin cuotas de permanencia ni sorpresas.</p>

          <div className="mt-8">
            <Link 
              href="/contacto" 
              className="btn-gradient px-12 py-4 rounded-2xl text-base font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              Solicitar proyecto a medida
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-semibold uppercase">Te contactaremos en menos de 24 horas</p>
        </div>
      </div>
    </div>
  );
}
