'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import PremiumNavbar from './components/PremiumNavbar';

export default function CreaunaLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PremiumNavbar />

      {/* Vibrant Hero with Unsplash */}
      <div className="colorful-hero text-white pt-24 pb-20">
        <div className="container text-center">
          <div className="inline px-4 py-1 bg-white/20 rounded-full text-sm mb-6">Impulsado por Gemini + Claude + Composer + GPT</div>
          
          <h1 className="text-7xl md:text-[90px] font-semibold tracking-[-7px] leading-none">
            Webs que enamoran.<br />Con color y alma.
          </h1>
          <p className="max-w-lg mx-auto mt-6 text-2xl text-white/90">Un equipo de 4 inteligencias artificiales trabajando para crear la web perfecta para ti.</p>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/studio" className="btn-gradient px-10 py-4 rounded-3xl text-lg font-semibold inline-flex items-center gap-2">
              Abrir Studio Gratis <ArrowRight />
            </Link>
            <Link href="/templates" className="px-10 py-4 rounded-3xl border border-white/40 hover:bg-white/10 text-lg font-medium">Ver plantillas</Link>
          </div>
        </div>
      </div>

      {/* Unsplash Showcase - Colorful */}
      <div className="container py-16">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-semibold tracking-tight">Diseños que destacan</h2>
          <p className="text-xl text-slate-600 mt-2">Ejemplos reales creados con nuestro equipo de IAs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800", title: "Joyería de Lujo", desc: "Elegancia en cada detalle" },
            { img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", title: "Restaurante Gourmet", desc: "Experiencia sensorial" },
            { img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800", title: "Startup Tecnológica", desc: "Innovación y claridad" },
          ].map((item, i) => (
            <div key={i} className="group rounded-3xl overflow-hidden border shadow-sm">
              <img src={item.img} alt={item.title} className="w-full h-72 object-cover group-hover:scale-105 transition-transform" />
              <div className="p-6">
                <div className="font-semibold text-xl">{item.title}</div>
                <div className="text-slate-600">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team of IAs */}
      <div id="equipo" className="bg-slate-900 text-white py-16">
        <div className="container">
          <div className="text-center mb-10">
            <div className="text-indigo-400 text-sm tracking-widest">EL EQUIPO DETRÁS DE TODO</div>
            <h2 className="text-5xl font-semibold tracking-tight mt-3">4 IAs especializadas trabajando como un solo equipo</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Gemini", role: "Imágenes", desc: "Fotos y visuales de alta calidad" },
              { name: "Claude 3.5", role: "Textos", desc: "Copywriting y SEO" },
              { name: "Composer", role: "Código", desc: "Estructura y componentes" },
              { name: "GPT-4o", role: "Diseño", desc: "Colores, tipografía y UX" },
            ].map((ia, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-3xl">
                <div className="font-semibold text-xl">{ia.name}</div>
                <div className="text-indigo-400">{ia.role}</div>
                <p className="mt-3 text-white/70">{ia.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="container py-20 text-center">
        <h2 className="text-6xl font-semibold tracking-tight">¿Listo para crear tu web más bonita?</h2>
        <Link href="/studio" className="mt-8 inline-block btn-gradient px-14 py-4 rounded-3xl text-xl font-semibold">
          Abrir CREAUNA Studio
        </Link>
        <p className="text-sm text-slate-500 mt-4">Fundado por Ramón del Pozo Rott</p>
      </div>
    </div>
  );
}
