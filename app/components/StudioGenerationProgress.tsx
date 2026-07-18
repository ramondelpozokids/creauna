'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Progreso al estilo Emergent/Lovable: fases de construcción.
 * Sin revelar proveedores ni stack interno.
 */
const STAGES = {
  es: [
    'Analizando tu brief…',
    'Cerrando el plan de la web…',
    'Construyendo la base y tipografía…',
    'Diseñando el hero impactante…',
    'Montando secciones y contenido…',
    'Integrando fotografía e identidad…',
    'Verificando calidad de agencia…',
    'Corrigiendo detalles y ensamblando…',
  ],
  en: [
    'Analyzing your brief…',
    'Locking the site plan…',
    'Building foundation and typography…',
    'Designing the impactful hero…',
    'Assembling sections and content…',
    'Integrating photography and identity…',
    'Running agency quality checks…',
    'Fixing details and assembling…',
  ],
} as const;

type Props = {
  lang: 'es' | 'en';
  startedAt: number;
};

export default function StudioGenerationProgress({ lang, startedAt }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const stages = STAGES[lang];

  useEffect(() => {
    setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    const tick = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    const stage = window.setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, stages.length - 1));
    }, 5500);
    return () => {
      window.clearInterval(tick);
      window.clearInterval(stage);
    };
  }, [startedAt, stages.length]);

  const progress = Math.min(94, 6 + elapsed * 1.05 + stageIndex * 4);

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/92 backdrop-blur-md rounded-[2.5rem] px-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="w-14 h-14 text-indigo-600 animate-spin mb-6" aria-hidden />
      <p className="text-lg md:text-xl font-semibold text-slate-900 text-center max-w-md">
        {stages[stageIndex]}
      </p>
      <p className="mt-3 text-sm text-slate-500 text-center">
        {lang === 'es'
          ? `${elapsed}s · Plan → construcción → verificación — no cierres esta pestaña`
          : `${elapsed}s · Plan → build → verify — keep this tab open`}
      </p>
      <div className="mt-8 w-full max-w-xs h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-[11px] text-slate-400 tracking-wide uppercase">
        {lang === 'es' ? 'Vista en tiempo real al terminar' : 'Live preview when ready'}
      </p>
    </div>
  );
}
