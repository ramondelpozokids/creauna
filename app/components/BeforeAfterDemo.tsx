'use client';

import { useState } from 'react';

export default function BeforeAfterDemo() {
  const [position, setPosition] = useState(50);

  return (
    <div className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
      {/* Barra de navegador */}
      <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
        <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
        <span className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
        <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
        <div className="flex-1 text-center">
          <span className="text-[10px] font-mono text-slate-500 bg-white px-4 py-0.5 rounded-md border border-slate-200">
            restaurante-elrincon.es
          </span>
        </div>
      </div>

      {/* Comparador */}
      <div className="relative h-[420px] overflow-hidden select-none">
        {/* DESPUÉS (fondo) */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-10">
          <div className="text-[10px] tracking-[3px] text-indigo-300 uppercase">Restaurante Gourmet • Madrid</div>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 leading-tight">
            Sabores que<br />enamoran.
          </h3>
          <p className="mt-4 text-sm text-slate-300 max-w-xs leading-relaxed">
            Cocina de autor con producto local. Reserva tu mesa y vive una experiencia inolvidable.
          </p>
          <div className="mt-6 flex gap-3">
            <span className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-semibold">Reservar mesa</span>
            <span className="px-5 py-2.5 border border-white/30 rounded-xl text-xs font-medium">Ver carta</span>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm">
            {['Carta de temporada', 'Chef premiado', 'Terraza privada'].map((item) => (
              <div key={item} className="bg-white/10 rounded-xl p-3 text-[10px] font-medium text-center backdrop-blur-sm">
                {item}
              </div>
            ))}
          </div>
          <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">
            DESPUÉS — 2026
          </div>
        </div>

        {/* ANTES (recorte) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <div className="absolute inset-0 bg-[#f0f0f0] text-[#333] p-4 md:p-6" style={{ fontFamily: 'Georgia, serif' }}>
            <div className="bg-[#003366] text-yellow-300 text-center py-2 text-sm font-bold tracking-widest">
              ★ RESTAURANTE EL RINCÓN ★
            </div>
            <div className="mt-3 text-center">
              <div className="text-[11px] text-blue-700 underline">Inicio | Carta | Contacto | Galeria</div>
            </div>
            <div className="mt-4 bg-yellow-100 border-2 border-orange-400 p-3 text-center">
              <p className="text-xs font-bold text-red-700 blink">!!! BIENVENIDOS A NUESTRA PAGINA WEB !!!</p>
              <p className="text-[10px] mt-1 text-slate-600">Estamos en construccion. Ultima actualizacion: 2017</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[9px]">
              <div className="bg-white border border-gray-400 p-2">
                <strong>Nuestra carta</strong>
                <p className="mt-1 text-gray-600">Platos variados. Pregunte al camarero.</p>
              </div>
              <div className="bg-white border border-gray-400 p-2">
                <strong>Horario</strong>
                <p className="mt-1 text-gray-600">Abrimos algunos dias. Llamar antes.</p>
              </div>
            </div>
            <div className="mt-3 text-[8px] text-center text-gray-500">
              Optimizado para Internet Explorer • Resolucion 1024x768
            </div>
            <div className="absolute top-4 left-4 bg-white/95 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow">
              ANTES — 2017
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-indigo-500 flex items-center justify-center">
            <span className="text-indigo-600 text-xs font-bold">⟷</span>
          </div>
        </div>

        {/* Slider invisible */}
        <input
          type="range"
          min="10"
          max="90"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          aria-label="Comparar web antigua y nueva"
        />
      </div>

      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
        Arrastra el control para comparar la web antigua con el rediseño moderno
      </div>
    </div>
  );
}
