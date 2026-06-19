'use client';

import Link from 'next/link';

export default function ColorfulHero() {
  return (
    <div className="colorful-hero text-white pt-20 pb-24">
      <div className="container text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-1 rounded-full text-sm mb-6">
          ✨ Tecnología de IA avanzada
        </div>
        
        <h1 className="text-7xl md:text-[92px] font-semibold tracking-[-7px] leading-none">
          Crea webs<br />que enamoran.<br />Con colores y alma.
        </h1>
        
        <p className="max-w-lg mx-auto mt-6 text-2xl text-white/90">
          Tecnología avanzada para crear la web perfecta para ti.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link href="/studio" className="btn-gradient px-10 py-4 rounded-3xl text-lg font-semibold inline-flex items-center gap-2">
            Abrir Studio Gratis
          </Link>
          <Link href="#templates" className="px-10 py-4 rounded-3xl text-lg font-medium border border-white/40 hover:bg-white/10 inline-flex items-center">
            Ver plantillas
          </Link>
        </div>
      </div>
    </div>
  );
}
