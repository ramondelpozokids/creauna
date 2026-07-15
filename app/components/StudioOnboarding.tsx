'use client';

import Link from 'next/link';
import { LayoutGrid, MessageSquareText, PenLine, Sparkles } from 'lucide-react';

type Lang = 'es' | 'en';

const copy = {
  es: {
    title: '¿Qué quieres crear?',
    subtitle:
      'CREAUNA es una plataforma de desarrollo web con IA. Escribe en lenguaje natural qué necesitas — sitio web, secciones, estilo — y la construimos contigo.',
    step1: 'Paso 1 · Empieza con tus palabras',
    promptTitle: 'Escribir un prompt',
    promptDesc:
      'Describe tu negocio o tu idea como se lo contarías a una persona. La IA genera la primera versión al instante.',
    promptCta: 'Empezar con prompt',
    promptExample: 'Ej: «Web elegante para mi clínica dental en Madrid, con citas online y equipo médico»',
    wizardTitle: 'Asistente guiado',
    wizardDesc: 'Prefieres preguntas paso a paso: sector, secciones, colores y menú antes de generar.',
    wizardCta: 'Usar asistente',
    catalogTitle: 'Ver ejemplos de calidad',
    catalogDesc: '15 demos en /templates — solo para inspirarte, no para editar desde ahí.',
    catalogCta: 'Ver plantillas demo',
    hint: 'No partimos de plantillas prehechas: tu web nace de tu descripción.',
  },
  en: {
    title: 'What do you want to create?',
    subtitle:
      'CREAUNA is an AI web development platform. Write in natural language what you need — website, sections, style — and we build it with you.',
    step1: 'Step 1 · Start with your words',
    promptTitle: 'Write a prompt',
    promptDesc:
      'Describe your business or idea as you would to a person. AI generates the first version instantly.',
    promptCta: 'Start with a prompt',
    promptExample: 'E.g. «Elegant site for my dental clinic in Madrid, with online booking and medical team»',
    wizardTitle: 'Guided assistant',
    wizardDesc: 'Prefer step-by-step questions: sector, sections, colors and menu before generating.',
    wizardCta: 'Use assistant',
    catalogTitle: 'Browse quality examples',
    catalogDesc: '15 demos at /templates — for inspiration only, not editable from there.',
    catalogCta: 'View demo templates',
    hint: 'We do not start from pre-built templates: your site is born from your description.',
  },
} as const;

type Props = {
  lang: Lang;
  onChoosePrompt: () => void;
  onChooseWizard: () => void;
};

export default function StudioOnboarding({ lang, onChoosePrompt, onChooseWizard }: Props) {
  const t = copy[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-8 md:p-14 text-center">
      <p className="text-[10px] font-bold tracking-[0.25em] text-indigo-600 uppercase mb-3">{t.step1}</p>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 max-w-xl">{t.title}</h2>
      <p className="mt-4 text-slate-600 max-w-lg leading-relaxed">{t.subtitle}</p>

      <div className="grid md:grid-cols-2 gap-4 mt-10 w-full max-w-3xl text-left">
        <button
          type="button"
          onClick={onChoosePrompt}
          className="group rounded-3xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 to-white p-6 hover:shadow-lg transition-all text-left cursor-pointer md:col-span-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-4">
            <MessageSquareText className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900">{t.promptTitle}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.promptDesc}</p>
          <p className="mt-3 text-xs text-slate-500 italic">{t.promptExample}</p>
          <span className="inline-block mt-4 text-sm font-semibold text-indigo-700 group-hover:underline">
            {t.promptCta} →
          </span>
        </button>

        <button
          type="button"
          onClick={onChooseWizard}
          className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-slate-900 hover:shadow-lg transition-all text-left cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4">
            <PenLine className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900">{t.wizardTitle}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.wizardDesc}</p>
          <span className="inline-block mt-4 text-sm font-semibold text-slate-900 group-hover:underline">
            {t.wizardCta} →
          </span>
        </button>

        <Link
          href="/templates"
          className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-slate-400 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900">{t.catalogTitle}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.catalogDesc}</p>
          <span className="inline-block mt-4 text-sm font-semibold text-slate-600 group-hover:underline">
            {t.catalogCta} →
          </span>
        </Link>
      </div>

      <p className="mt-8 text-xs text-slate-400 flex items-center gap-2 max-w-md">
        <Sparkles className="w-3.5 h-3.5 shrink-0" /> {t.hint}
      </p>
    </div>
  );
}
