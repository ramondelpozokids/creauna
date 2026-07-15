'use client';

import Link from 'next/link';
import { ExternalLink, Maximize2, Minimize2, Sparkles, X } from 'lucide-react';
import type { PremiumStarterItem } from '../data/premiumStarters';

interface Props {
  starter: PremiumStarterItem;
  lang: 'es' | 'en';
  onClose?: () => void;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  showActions?: boolean;
}

export default function PremiumStarterPreviewFrame({
  starter,
  lang,
  onClose,
  fullscreen = false,
  onToggleFullscreen,
  showActions = true,
}: Props) {
  const name = lang === 'es' ? starter.nameEs : starter.nameEn;
  const category = lang === 'es' ? starter.categoryLabelEs : starter.categoryLabelEn;
  const desc = lang === 'es' ? starter.descEs : starter.descEn;

  const t =
    lang === 'es'
      ? {
          use: 'Personalizar en el Studio',
          demo: 'Abrir demo en vivo',
          live: 'Web terminada — vista previa real',
          fullscreen: 'Pantalla completa',
          exitFullscreen: 'Salir pantalla completa',
        }
      : {
          use: 'Customize in Studio',
          demo: 'Open live demo',
          live: 'Finished site — real preview',
          fullscreen: 'Fullscreen',
          exitFullscreen: 'Exit fullscreen',
        };

  const studioHref = `/studio?starter=${starter.slug}&lang=${lang}`;

  return (
    <div className={`flex flex-col bg-white ${fullscreen ? 'fixed inset-0 z-[300]' : 'h-full max-h-[90vh]'}`}>
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-xl md:text-2xl tracking-tight text-slate-950 truncate">{name}</span>
            <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-3 py-1 rounded-full shrink-0">
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
              href={starter.demoPath}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs border border-slate-200 rounded-2xl hover:bg-slate-50 font-semibold flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {t.demo}
            </a>
            <Link
              href={studioHref}
              className="btn-gradient px-6 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              {t.use}
            </Link>
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

      <p className="px-6 py-2 text-xs text-slate-600 border-b border-slate-50 bg-slate-50/50 shrink-0 line-clamp-2">
        {desc}
      </p>

      <div className="flex-1 min-h-0 bg-slate-100">
        <iframe
          title={name}
          src={starter.demoPath}
          className="w-full h-full min-h-[420px] border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
