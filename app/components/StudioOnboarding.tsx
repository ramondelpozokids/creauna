'use client';

import Link from 'next/link';
import { LayoutGrid, Sparkles, PenLine } from 'lucide-react';

type Lang = 'es' | 'en';

const copy = {
  es: {
    title: '¿Cómo quieres empezar?',
    subtitle: 'Elige una plantilla de nuestro catálogo o describe tu web desde cero. Después podrás refinarla con el director de diseño.',
    step1: 'Paso 1 · Elige tu punto de partida',
    catalogTitle: 'Elegir plantilla del catálogo',
    catalogDesc: '36 diseños premium por sector. Previsualiza, navega secciones y edítala en el Studio.',
    catalogCta: 'Ver catálogo',
    describeTitle: 'Describir mi web',
    describeDesc: 'Cuéntanos tu negocio, estilo y objetivo. Crearemos una base personalizada.',
    describeCta: 'Empezar con descripción',
    hint: 'Puedes cambiar de plantilla en cualquier momento desde /templates',
  },
  en: {
    title: 'How do you want to start?',
    subtitle: 'Pick a template from our catalog or describe your site from scratch. Then refine it with the design director.',
    step1: 'Step 1 · Choose your starting point',
    catalogTitle: 'Pick a catalog template',
    catalogDesc: '36 premium designs by industry. Preview, browse sections, then edit in Studio.',
    catalogCta: 'Browse catalog',
    describeTitle: 'Describe my website',
    describeDesc: 'Tell us about your business, style and goals. We will build a custom base.',
    describeCta: 'Start with a description',
    hint: 'You can switch templates anytime from /templates',
  },
} as const;

type Props = {
  lang: Lang;
  onChooseDescribe: () => void;
};

export default function StudioOnboarding({ lang, onChooseDescribe }: Props) {
  const t = copy[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-8 md:p-14 text-center">
      <p className="text-[10px] font-bold tracking-[0.25em] text-indigo-600 uppercase mb-3">{t.step1}</p>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 max-w-lg">{t.title}</h2>
      <p className="mt-4 text-slate-600 max-w-md leading-relaxed">{t.subtitle}</p>

      <div className="grid md:grid-cols-2 gap-4 mt-10 w-full max-w-2xl text-left">
        <Link
          href="/templates"
          className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-400 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900">{t.catalogTitle}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.catalogDesc}</p>
          <span className="inline-block mt-4 text-sm font-semibold text-indigo-600 group-hover:underline">{t.catalogCta} →</span>
        </Link>

        <button
          type="button"
          onClick={onChooseDescribe}
          className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-slate-900 hover:shadow-lg transition-all text-left cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4">
            <PenLine className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900">{t.describeTitle}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.describeDesc}</p>
          <span className="inline-block mt-4 text-sm font-semibold text-slate-900 group-hover:underline">{t.describeCta} →</span>
        </button>
      </div>

      <p className="mt-8 text-xs text-slate-400 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5" /> {t.hint}
      </p>
    </div>
  );
}
