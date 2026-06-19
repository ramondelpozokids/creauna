'use client';

import Link from 'next/link';
import PremiumNavbar from './components/PremiumNavbar';

export default function CreaunaLanding() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PremiumNavbar />

      {/* Spectacular Hero */}
      <div className="colorful-hero pt-20 pb-20 text-white">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-1 rounded-full text-sm font-medium mb-6">
            Tecnología avanzada • Diseño de estudio de alto nivel
          </div>

          <h1 className="text-7xl md:text-[90px] font-semibold tracking-[-7px] leading-none">
            Webs que enamoran.<br />Diseño que deja huella.
          </h1>
          <p className="max-w-xl mx-auto mt-6 text-2xl text-white/90">
            Creamos páginas web espectaculares con tecnología de vanguardia. 
            Rápidas, modernas y tan bonitas que tus clientes se quedarán mirando.
          </p>

          {/* Hero image premium justo debajo del titular */}
          <div className="mt-14 max-w-6xl mx-auto">
            <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl ring-1 ring-white/20">
              <img 
                src="/images/luxury-jewelry-atelier-elegant-interior--1.jpg" 
                alt="CREAUNA — Web premium que enamora" 
                className="w-full h-[620px] object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/70" />
              <div className="absolute bottom-10 left-10 text-white">
                <div className="uppercase tracking-[3px] text-xs font-medium opacity-75">PROYECTO REAL • ATELIER</div>
                <div className="text-5xl font-semibold tracking-tight mt-2">Diseño que se siente.</div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-4">
            <Link href="/studio" className="btn-gradient px-10 py-4 rounded-3xl text-lg font-semibold inline-flex items-center gap-3">
              Abrir Studio Gratis
            </Link>
            <Link href="/templates" className="px-10 py-4 rounded-3xl border border-white/40 hover:bg-white/10 text-lg font-medium">
              Ver plantillas
            </Link>
          </div>
          <div className="mt-4 text-xs text-white/60">Sin tarjeta • En español • Resultados en minutos</div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-b bg-white py-5">
        <div className="container flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm text-slate-500">
          <div>Usado por más de <span className="font-semibold text-slate-700">12.800</span> profesionales</div>
          <div>4.98/5 valoración media</div>
          <div>Web de referencia en diseño con IA</div>
        </div>
      </div>

      {/* Why we're different - Professional copy */}
      <div className="container py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-5xl font-semibold tracking-tight">No hacemos webs funcionales.<br />Hacemos webs espectaculares.</h2>
          <p className="mt-5 text-xl text-slate-600">
            Si nos dedicamos a crear páginas web de alto nivel, nuestra propia web tiene que demostrarlo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Diseño de estudio", desc: "Cada detalle está pensado. Colores, tipografía, composición y micro-interacciones de nivel agencia." },
            { title: "Velocidad real", desc: "Olvídate de meses de desarrollo. Crea, refina y publica en minutos con tecnología avanzada." },
            { title: "Resultado que impacta", desc: "Webs que generan confianza, conversión y que la gente recuerda. Eso es lo que entregamos." },
          ].map((item, i) => (
            <div key={i} className="premium-card p-8 rounded-3xl">
              <div className="font-semibold text-2xl tracking-tight mb-3">{item.title}</div>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Spectacular Templates */}
      <div className="bg-slate-50 py-16">
        <div className="container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-4xl font-semibold tracking-tight">Plantillas espectaculares</h3>
              <p className="text-slate-600 mt-1">Elige una y conviértela en tu marca en minutos.</p>
            </div>
            <Link href="/templates" className="text-sm font-medium text-indigo-600 hover:underline">Ver catálogo completo →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: "/images/luxury-jewelry-atelier-elegant-interior--1.jpg", name: "Atelier", cat: "Joyería & Lujo" },
              { img: "/images/modern-architecture-minimalist-building--1.jpg", name: "Vesper", cat: "Arquitectura & Diseño" },
              { img: "/images/fine-dining-restaurant-interior-elegant--1.jpg", name: "Sable", cat: "Restaurantes & Gastronomía" },
            ].map((t, i) => (
              <Link key={i} href="/templates" className="group block rounded-3xl overflow-hidden border bg-white shadow-sm">
                <div className="h-72 relative">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="text-3xl font-semibold tracking-tight">{t.name}</div>
                    <div className="text-sm opacity-80 mt-1">{t.cat}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="container py-20 text-center">
        <h2 className="text-5xl font-semibold tracking-tight">Si tu web representa tu marca,<br />que sea espectacular.</h2>
        <Link href="/studio" className="mt-8 inline-block btn-gradient px-14 py-4 rounded-3xl text-xl font-semibold">
          Crear mi web ahora
        </Link>
        <div className="mt-3 text-xs text-slate-500">Fundado por Ramón del Pozo Rott</div>
      </div>

      {/* Founder Signature - Ultra Premium */}
      <div className="border-t bg-[#f8f7f4] py-16">
        <div className="container max-w-3xl text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
              <img 
                src="/images/ramon-del-pozo-rott.jpg" 
                alt="Ramón del Pozo Rott" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          <div className="text-sm tracking-[2px] font-medium text-slate-500">UNA VISIÓN PERSONAL</div>
          <p className="mt-4 text-2xl font-medium tracking-tight text-slate-800">
            “El mejor diseño ya no tiene por qué costar meses ni fortunas.<br /> 
            Ahora está al alcance de quienes lo valoran de verdad.”
          </p>
          <div className="mt-6">
            <div className="font-semibold">Ramón del Pozo Rott</div>
            <div className="text-xs text-slate-500 tracking-wider">Fundador &amp; Director Creativo</div>
          </div>
        </div>
      </div>
    </div>
  );
}
