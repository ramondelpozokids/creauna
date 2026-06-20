'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Maximize2, Minimize2, Sparkles, X } from 'lucide-react';
import type { TemplateItem } from '../data/templates';
import { buildTemplateSections } from '../lib/templatePages';

interface Props {
  template: TemplateItem;
  lang: 'es' | 'en';
  onClose?: () => void;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  showActions?: boolean;
}

export default function TemplatePreviewFrame({
  template,
  lang,
  onClose,
  fullscreen = false,
  onToggleFullscreen,
  showActions = true,
}: Props) {
  const sections = buildTemplateSections(template, lang);
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? 'hero');
  const name = lang === 'es' ? template.nameEs : template.nameEn;
  const category = lang === 'es' ? template.categoryEs : template.categoryEn;
  const active = sections.find((s) => s.id === activeSection) ?? sections[0];

  const t = lang === 'es'
    ? {
        use: 'Usar esta plantilla',
        fullscreen: 'Pantalla completa',
        exitFullscreen: 'Salir pantalla completa',
        nav: 'Secciones',
        demo: 'Vista demo completa',
      }
    : {
        use: 'Use this template',
        fullscreen: 'Fullscreen',
        exitFullscreen: 'Exit fullscreen',
        nav: 'Sections',
        demo: 'Full demo view',
      };

  const studioHref = `/studio?template=${template.slug}&lang=${lang}`;

  return (
    <div className={`flex flex-col bg-white ${fullscreen ? 'fixed inset-0 z-[300]' : 'h-full'}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-2xl tracking-tight text-slate-950">{name}</span>
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{category}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t.demo}</p>
        </div>
        {showActions && (
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="px-4 py-2.5 text-xs border border-slate-200 rounded-2xl hover:bg-slate-50 font-semibold flex items-center gap-2 cursor-pointer"
              >
                {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                {fullscreen ? t.exitFullscreen : t.fullscreen}
              </button>
            )}
            <Link
              href={studioHref}
              className="btn-gradient px-6 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              {t.use}
            </Link>
            {onClose && (
              <button onClick={onClose} className="p-2.5 border border-slate-200 rounded-2xl hover:bg-slate-50 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <nav className="w-44 shrink-0 border-r border-slate-100 bg-slate-50 p-4 hidden sm:block overflow-y-auto">
          <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">{t.nav}</div>
          <div className="space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeSection === sec.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white'
                }`}
              >
                {lang === 'es' ? sec.navLabelEs : sec.navLabelEn}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-6">
          <div className="mx-auto max-w-[1100px]">
            <div className="sm:hidden flex gap-2 mb-4 overflow-x-auto pb-1">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    activeSection === sec.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200'
                  }`}
                >
                  {lang === 'es' ? sec.navLabelEs : sec.navLabelEn}
                </button>
              ))}
            </div>
            <div className="shadow-2xl rounded-2xl overflow-hidden border border-slate-200/80 bg-white">
              <div className="h-11 bg-slate-50 border-b border-slate-200/60 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-400 rounded-full" />
                  <span className="w-3 h-3 bg-amber-400 rounded-full" />
                  <span className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <div className="text-[10px] font-mono text-slate-500 truncate max-w-[50%]">
                  {template.slug}.creauna.com
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div dangerouslySetInnerHTML={{ __html: active.html }} />
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-4 tracking-widest uppercase">
              {lang === 'es' ? 'Navega por secciones • Amplía a pantalla completa' : 'Browse sections • Go fullscreen'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
