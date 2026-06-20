'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { beforeAfterI18n } from '../data/i18n/marketing';

export default function BeforeAfterDemo() {
  const { lang } = useLanguage();
  const t = beforeAfterI18n[lang];
  const [position, setPosition] = useState(50);

  return (
    <div className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
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

      <div className="relative h-[480px] md:h-[520px] overflow-hidden select-none touch-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-10">
          <div className="text-[10px] tracking-[3px] text-indigo-300 uppercase">Restaurante Gourmet • Madrid</div>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 leading-tight">{t.afterTitle}</h3>
          <p className="mt-4 text-sm text-slate-300 max-w-xs leading-relaxed">{t.afterDesc}</p>
          <div className="mt-6 flex gap-3">
            <span className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-semibold">{t.afterCta1}</span>
            <span className="px-5 py-2.5 border border-white/30 rounded-xl text-xs font-medium">{t.afterCta2}</span>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm">
            {t.afterItems.map((item) => (
              <div key={item} className="bg-white/10 rounded-xl p-3 text-[10px] font-medium text-center backdrop-blur-sm">{item}</div>
            ))}
          </div>
          <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">{t.afterTag}</div>
        </div>

        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <div className="absolute inset-0 bg-[#f0f0f0] text-[#333] p-4 md:p-6" style={{ fontFamily: 'Georgia, serif' }}>
            <div className="bg-[#003366] text-yellow-300 text-center py-2 text-sm font-bold tracking-widest">★ RESTAURANTE EL RINCÓN ★</div>
            <div className="mt-3 text-center">
              <div className="text-[11px] text-blue-700 underline">Inicio | Carta | Contacto | Galeria</div>
            </div>
            <div className="mt-4 bg-yellow-100 border-2 border-orange-400 p-3 text-center">
              <p className="text-xs font-bold text-red-700 blink">!!! BIENVENIDOS A NUESTRA PAGINA WEB !!!</p>
              <p className="text-[10px] mt-1 text-slate-600">Estamos en construccion. Ultima actualizacion: 2017</p>
            </div>
            <div className="absolute top-4 left-4 bg-white/95 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow">{t.beforeTag}</div>
          </div>
        </div>

        <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-indigo-500 flex items-center justify-center">
            <span className="text-indigo-600 text-xs font-bold">⟷</span>
          </div>
        </div>

        <input type="range" min="10" max="90" value={position} onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" aria-label={t.aria} />
      </div>

      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">{t.footer}</div>
    </div>
  );
}
