'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function WebAMedida() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container pt-16 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline px-4 py-1 bg-gradient-to-r from-indigo-600 to-rose-500 text-white rounded-full text-sm font-medium mb-4">
            SERVICIO PREMIUM
          </div>
          <h1 className="text-6xl font-semibold tracking-tight">Web a Medida</h1>
          <p className="mt-5 text-2xl text-slate-600">
            No quieres elegir plantilla. Quieres que tu web sea única, hecha exactamente como la imaginas.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl">
        <div className="relative rounded-3xl overflow-hidden h-[320px] mb-12">
          <img 
            src="/images/luxury-jewelry-atelier-elegant-interior--1.jpg" 
            alt="Web a medida premium" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-10 text-white max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight">Tú solo tienes que decirnos qué quieres.</h2>
            <p className="mt-3 text-xl text-white/85">Nosotros nos encargamos del resto.</p>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="premium-card p-8 rounded-3xl">
            <h3 className="font-semibold text-2xl">¿Cómo funciona?</h3>
            <div className="mt-8 space-y-6 text-sm">
              <div><span className="font-semibold">1.</span> Rellenas un breve formulario con tu visión.</div>
              <div><span className="font-semibold">2.</span> Nos reunimos (o por escrito) para entender perfectamente lo que buscas.</div>
              <div><span className="font-semibold">3.</span> Te presentamos 2-3 propuestas de diseño en 5-7 días.</div>
              <div><span className="font-semibold">4.</span> Iteramos hasta que quede perfecta.</div>
              <div><span className="font-semibold">5.</span> Te entregamos la web terminada (o la subimos nosotros).</div>
            </div>
          </div>

          <div className="premium-card p-8 rounded-3xl">
            <h3 className="font-semibold text-2xl">¿Qué incluye?</h3>
            <ul className="mt-6 space-y-3 text-sm">
              <li>✓ Diseño exclusivo 100% a tu medida</li>
              <li>✓ Textos escritos profesionalmente</li>
              <li>✓ Fotografía y visuales de alta calidad</li>
              <li>✓ Desarrollo técnico premium</li>
              <li>✓ Optimización SEO avanzada</li>
              <li>✓ Versión móvil impecable</li>
              <li>✓ Formación para que puedas gestionarla</li>
              <li>✓ 3 meses de ajustes incluidos</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <div className="text-5xl font-semibold tracking-tight">Desde 2.900€</div>
          <p className="text-slate-500 mt-1">Proyecto completo. Sin sorpresas.</p>

          <Link href="/contacto" className="mt-8 inline-block btn-gradient px-12 py-4 rounded-3xl text-lg font-semibold">
            Solicitar proyecto a medida
          </Link>
          <p className="text-xs text-slate-500 mt-3">Te contactaremos en menos de 24 horas</p>
        </div>
      </div>
    </div>
  );
}
