'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import { beforeAfterI18n } from '../data/i18n/marketing';

const BEFORE_SRC = '/demos/modernizacion/gestoria/index.html';
const AFTER_SRC = '/demos/modernizacion/gestoria/index1.html';
const SITE_URL = 'verum-asesores.es';

function hidePreloader(doc: Document) {
  const pre = doc.querySelector('.preloader') as HTMLElement | null;
  if (pre) {
    pre.classList.add('hidden');
    pre.style.display = 'none';
  }
}

function measureIframeDocument(doc: Document): number {
  return Math.max(
    doc.documentElement.scrollHeight,
    doc.body?.scrollHeight ?? 0,
    doc.documentElement.offsetHeight,
    doc.body?.offsetHeight ?? 0,
    640
  );
}

function useIframePageHeight(src: string) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1400);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    const measure = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;
      hidePreloader(doc);
      setHeight(measureIframeDocument(doc));
    };

    const onLoad = () => {
      measure();
      window.setTimeout(measure, 300);
      window.setTimeout(measure, 1000);
    };

    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, [src]);

  return { ref, height };
}

function PageIframe({
  src,
  title,
  height,
  iframeRef,
}: {
  src: string;
  title: string;
  height: number;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      className="absolute top-0 left-0 w-full border-0 bg-white pointer-events-none"
      style={{ height }}
      scrolling="no"
      tabIndex={-1}
    />
  );
}

export default function BeforeAfterDemo() {
  const { lang } = useLanguage();
  const t = beforeAfterI18n[lang];
  const [position, setPosition] = useState(50);
  const outerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const before = useIframePageHeight(BEFORE_SRC);
  const after = useIframePageHeight(AFTER_SRC);
  const pageHeight = Math.max(before.height, after.height);

  const onMove = useCallback((clientX: number, rect: DOMRect) => {
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(92, Math.max(8, pct)));
  }, []);

  const handlePointerMove = useCallback(
    (clientX: number) => {
      const rect = outerRef.current?.getBoundingClientRect();
      if (!rect) return;
      onMove(clientX, rect);
    },
    [onMove]
  );

  useEffect(() => {
    const onWindowPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      handlePointerMove(e.clientX);
    };
    const onWindowPointerUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('pointerup', onWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
    };
  }, [handlePointerMove]);

  const hint =
    lang === 'es'
      ? 'Arrastra ⟷ para comparar · Desplázate ↕ para ver toda la página · Toca las etiquetas para abrir cada versión'
      : 'Drag ⟷ to compare · Scroll ↕ for the full page · Tap labels to open each version';

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

      <div className="p-3 sm:p-4 bg-slate-50">
        <div className="mx-auto w-full max-w-[420px]">
          <div
            ref={outerRef}
            className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-inner"
          >
            <div
              className="overflow-y-auto overscroll-contain"
              style={{ height: 'min(78dvh, 720px)' }}
            >
              <div className="relative w-full bg-white" style={{ height: pageHeight }}>
                <PageIframe
                  src={AFTER_SRC}
                  title={t.afterTag}
                  height={pageHeight}
                  iframeRef={after.ref}
                />
                <div
                  className="absolute inset-0 z-10 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                >
                  <PageIframe
                    src={BEFORE_SRC}
                    title={t.beforeTag}
                    height={pageHeight}
                    iframeRef={before.ref}
                  />
                </div>
              </div>
            </div>

            <a
              href={BEFORE_SRC}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 left-3 z-20 bg-black/80 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow-lg backdrop-blur-sm hover:bg-black transition-colors"
            >
              {t.beforeTag} · index.html
            </a>
            <a
              href={AFTER_SRC}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 z-20 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow-lg hover:bg-emerald-500 transition-colors"
            >
              {t.afterTag} · index1.html
            </a>

            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)] z-20 pointer-events-none"
              style={{ left: `${position}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg border-2 border-indigo-500 flex items-center justify-center">
                <span className="text-indigo-600 text-xs sm:text-sm font-bold" aria-hidden>
                  ⟷
                </span>
              </div>
            </div>

            <div
              className="absolute top-0 bottom-0 z-30 w-12 -translate-x-1/2 cursor-ew-resize touch-none"
              style={{ left: `${position}%` }}
              onPointerDown={(e) => {
                draggingRef.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                handlePointerMove(e.clientX);
              }}
              onPointerMove={(e) => {
                if (!draggingRef.current) return;
                handlePointerMove(e.clientX);
              }}
              onPointerUp={(e) => {
                draggingRef.current = false;
                e.currentTarget.releasePointerCapture(e.pointerId);
              }}
            >
              <input
                type="range"
                min={8}
                max={92}
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                aria-label={t.aria}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 leading-relaxed">
        {hint}
      </div>
    </div>
  );
}
