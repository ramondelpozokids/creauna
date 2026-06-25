'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from './LanguageProvider';
import { beforeAfterI18n } from '../data/i18n/marketing';

type DemoId = 'restaurant' | 'gestoria' | 'autonomo';

const demos: Record<DemoId, { url: string; beforeEs: string; beforeEn: string }> = {
  restaurant: { url: 'restaurante-elrincon.es', beforeEs: 'Restaurante', beforeEn: 'Restaurant' },
  gestoria: { url: 'gestoria-martinez.es', beforeEs: 'Gestoría', beforeEn: 'Tax advisory' },
  autonomo: { url: 'studio-luna.es', beforeEs: 'Autónomo', beforeEn: 'Freelancer' },
};

function BeforePanel({ tag, sector }: { tag: string; sector: string }) {
  return (
    <div
      className="absolute inset-0 bg-[#ececec] text-[#333] overflow-hidden"
      style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
    >
      <div className="bg-[#003366] text-yellow-300 text-center py-2.5 text-xs font-bold tracking-[0.2em] uppercase">
        ★ {sector.toUpperCase()} ★
      </div>
      <div className="px-4 py-3 text-center border-b border-[#ccc] bg-white">
        <div className="text-[11px] text-blue-700 underline decoration-1">
          Inicio | Servicios | Contacto | Galeria
        </div>
      </div>
      <div className="mx-4 mt-4 bg-yellow-100 border-2 border-orange-500 p-4 text-center shadow-inner">
        <p className="text-sm font-bold text-red-700 uppercase blink">
          !!! Bienvenidos a nuestra pagina web !!!
        </p>
        <p className="text-[11px] mt-2 text-slate-600">Estamos en construccion · Actualizado 2017</p>
      </div>
      <table className="mx-4 mt-4 w-[calc(100%-2rem)] border border-[#999] text-[10px] bg-white">
        <tbody>
          <tr className="bg-[#003366] text-white">
            <td className="p-1.5 font-bold" colSpan={2}>Nuestros servicios</td>
          </tr>
          <tr><td className="p-1.5 border border-[#ccc]">Servicio 1</td><td className="p-1.5 border border-[#ccc]">Info</td></tr>
          <tr><td className="p-1.5 border border-[#ccc]">Servicio 2</td><td className="p-1.5 border border-[#ccc]">Info</td></tr>
        </tbody>
      </table>
      <div className="mx-4 mt-4 p-3 bg-[#ffffcc] border border-dashed border-[#999] text-[10px] text-center">
        Mejor resolucion: 1024x768 · IE 8
      </div>
      <div className="absolute top-3 left-3 bg-white/95 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow">
        {tag}
      </div>
    </div>
  );
}

function AfterPanel({
  tag,
  title,
  desc,
  cta1,
  cta2,
  items,
  accent,
}: {
  tag: string;
  title: string;
  desc: string;
  cta1: string;
  cta2: string;
  items: readonly string[];
  accent: string;
}) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 py-8 min-w-0">
          <div className={`text-[10px] tracking-[0.25em] uppercase font-semibold ${accent}`}>CREAUNA · 2026</div>
          <h3 className="text-2xl md:text-4xl font-bold tracking-tight mt-3 leading-tight">{title}</h3>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-md">{desc}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-semibold">{cta1}</span>
            <span className="px-4 py-2 border border-white/30 rounded-xl text-xs font-medium">{cta2}</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 md:p-8 min-w-0">
          <div className="w-full max-w-sm space-y-3">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-xs font-medium">{item}</span>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['98', '100', 'A+'].map((stat, i) => (
                <div key={stat} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                  <div className="text-lg font-bold text-white">{stat}</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wide">
                    {i === 0 ? 'SEO' : i === 1 ? 'Mobile' : 'Speed'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow-lg">
        {tag}
      </div>
    </div>
  );
}

export default function BeforeAfterDemo() {
  const { lang } = useLanguage();
  const t = beforeAfterI18n[lang];
  const [position, setPosition] = useState(50);
  const [demo, setDemo] = useState<DemoId>('restaurant');

  const scenarios = t.scenarios;
  const current = scenarios[demo];
  const meta = demos[demo];

  const onMove = useCallback((clientX: number, rect: DOMRect) => {
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(92, Math.max(8, pct)));
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
      <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border-b border-slate-200">
        {(Object.keys(demos) as DemoId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setDemo(id)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition cursor-pointer ${
              demo === id
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-200'
            }`}
          >
            {lang === 'es' ? demos[id].beforeEs : demos[id].beforeEn}
          </button>
        ))}
      </div>

      <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
        <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
        <span className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
        <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
        <div className="flex-1 text-center">
          <span className="text-[10px] font-mono text-slate-500 bg-white px-4 py-0.5 rounded-md border border-slate-200">
            {meta.url}
          </span>
        </div>
      </div>

      <div
        className="relative h-[480px] md:h-[540px] overflow-hidden select-none touch-none"
        onPointerMove={(e) => {
          if (e.buttons !== 1 && e.pointerType === 'mouse') return;
          onMove(e.clientX, e.currentTarget.getBoundingClientRect());
        }}
        onPointerDown={(e) => onMove(e.clientX, e.currentTarget.getBoundingClientRect())}
      >
        {/* After = fondo completo (visible a la derecha del corte) */}
        <AfterPanel
          tag={t.afterTag}
          title={current.afterTitle}
          desc={current.afterDesc}
          cta1={current.afterCta1}
          cta2={current.afterCta2}
          items={current.afterItems}
          accent={current.accent}
        />

        {/* Before = capa superior recortada a la izquierda */}
        <div
          className="absolute inset-0 z-10 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <BeforePanel tag={t.beforeTag} sector={lang === 'es' ? meta.beforeEs : meta.beforeEn} />
        </div>

        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)] z-20 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-indigo-500 flex items-center justify-center">
            <span className="text-indigo-600 text-sm font-bold" aria-hidden>⟷</span>
          </div>
        </div>

        <input
          type="range"
          min={8}
          max={92}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          aria-label={t.aria}
        />
      </div>

      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
        {t.footer}
      </div>
    </div>
  );
}
