'use client';

import { ExternalLink, Maximize2, Minimize2, X } from 'lucide-react';
import type { TemplateShowcaseItem } from '../data/templateShowcase';

interface Props {
  item: TemplateShowcaseItem;
  lang: 'es' | 'en';
  onClose?: () => void;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  showActions?: boolean;
}

export default function TemplateDemoPreviewFrame({
  item,
  lang,
  onClose,
  fullscreen = false,
  onToggleFullscreen,
  showActions = true,
}: Props) {
  const name = lang === 'es' ? item.nameEs : item.nameEn;
  const category = lang === 'es' ? item.categoryLabelEs : item.categoryLabelEn;
  const desc = lang === 'es' ? item.descEs : item.descEn;

  const t =
    lang === 'es'
      ? {
          demo: 'Abrir demo en nueva pestaña',
          live: 'Demo en vivo — solo visualización',
          note: 'Vitrina de trabajo CREAUNA. No es editable desde aquí.',
          fullscreen: 'Pantalla completa',
          exitFullscreen: 'Salir pantalla completa',
        }
      : {
          demo: 'Open demo in new tab',
          live: 'Live demo — view only',
          note: 'CREAUNA portfolio showcase. Not editable from here.',
          fullscreen: 'Fullscreen',
          exitFullscreen: 'Exit fullscreen',
        };

  return (
    <div className={`flex flex-col bg-white ${fullscreen ? 'fixed inset-0 z-[300]' : 'h-full max-h-[90vh]'}`}>
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-xl md:text-2xl tracking-tight text-slate-950 truncate">{name}</span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                item.kind === 'premium'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {category}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t.live}</p>
        </div>
        {showActions && (
          <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="px-4 py-2.5 text-xs border border-slate-200 rounded-2xl hover:bg-slate-50 font-semibold flex items-center gap-2 cursor-pointer"
              >
                {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                {fullscreen ? t.exitFullscreen : t.fullscreen}
              </button>
            )}
            <a
              href={item.demoPath}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-xs border border-slate-900 bg-slate-900 text-white rounded-2xl hover:bg-black font-semibold flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {t.demo}
            </a>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 border border-slate-200 rounded-2xl hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="px-6 py-2 text-xs text-slate-600 border-b border-slate-50 bg-slate-50/50 shrink-0">
        {desc}
      </p>
      <p className="px-6 py-1.5 text-[10px] text-slate-400 border-b border-slate-50 shrink-0">{t.note}</p>

      <div className="flex-1 min-h-0 bg-slate-100">
        <iframe
          title={name}
          src={item.demoPath}
          className="w-full h-full min-h-[420px] border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
