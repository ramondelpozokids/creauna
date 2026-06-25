'use client';

import Image from 'next/image';
import { useLanguage } from './LanguageProvider';
import { beforeAfterI18n } from '../data/i18n/marketing';

const BEFORE_SRC = '/demos/modernizacion/gestoria/index.html';
const AFTER_SRC = '/demos/modernizacion/gestoria/index1.html';
const BEFORE_IMG = '/demos/modernizacion/gestoria/before-preview.png';
const AFTER_IMG = '/demos/modernizacion/gestoria/after-preview.png';
const SITE_URL = 'verum-asesores.es';

export default function BeforeAfterDemo() {
  const { lang } = useLanguage();
  const t = beforeAfterI18n[lang];
  const isEs = lang === 'es';

  return (
    <div className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
      <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
        <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
        <span className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
        <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
        <div className="flex-1 text-center min-w-0">
          <span className="text-[10px] font-mono text-slate-500 bg-white px-3 py-0.5 rounded-md border border-slate-200 truncate inline-block max-w-full">
            {SITE_URL}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-px bg-slate-200">
        {/* Antes */}
        <div className="bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">
              {t.beforeTag}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">index.html</span>
          </div>
          <a
            href={BEFORE_SRC}
            target="_blank"
            rel="noopener noreferrer"
            className="block group rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[16/10] bg-slate-100">
              <Image
                src={BEFORE_IMG}
                alt={isEs ? 'Web antigua VERUM — vista previa' : 'Old VERUM site — preview'}
                fill
                className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </a>
          <a
            href={BEFORE_SRC}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {isEs ? 'Ver index.html completo →' : 'Open full index.html →'}
          </a>
        </div>

        {/* Después */}
        <div className="bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">
              {t.afterTag}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">index1.html</span>
          </div>
          <a
            href={AFTER_SRC}
            target="_blank"
            rel="noopener noreferrer"
            className="block group rounded-2xl overflow-hidden border border-emerald-200 shadow-sm hover:shadow-md transition-shadow ring-1 ring-emerald-100"
          >
            <div className="relative aspect-[16/10] bg-slate-100">
              <Image
                src={AFTER_IMG}
                alt={isEs ? 'Web modernizada VERUM — vista previa' : 'Modernized VERUM site — preview'}
                fill
                className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </a>
          <a
            href={AFTER_SRC}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors"
          >
            {isEs ? 'Ver index1.html completo →' : 'Open full index1.html →'}
          </a>
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 leading-relaxed">
        {isEs
          ? 'Caso real VERUM · Gestoría. Toca cada imagen o enlace para abrir la página entera en otra pestaña.'
          : 'Real VERUM tax advisory case. Tap each image or link to open the full page in a new tab.'}
      </div>
    </div>
  );
}
