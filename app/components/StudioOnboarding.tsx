'use client';

import Link from 'next/link';
import {
  Building2,
  Dumbbell,
  Flower2,
  Gem,
  HeartPulse,
  Hotel,
  Landmark,
  LayoutGrid,
  PenLine,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
} from 'lucide-react';
import { premiumStarters, type PremiumStarterItem } from '../data/premiumStarters';

type Lang = 'es' | 'en';

const copy = {
  es: {
    title: '¿Cómo quieres empezar?',
    subtitle:
      'Elige una muestra profesional terminada, una plantilla del catálogo o crea tu web con el asistente guiado.',
    step1: 'Paso 1 · Elige tu punto de partida',
    premiumTitle: 'Muestras profesionales',
    premiumDesc:
      'Webs reales terminadas por sector. Solo cambias nombre, teléfono, textos clave y fotos.',
    premiumCta: 'Elegir muestra',
    catalogTitle: 'Plantillas del catálogo',
    catalogDesc: '36 diseños de inspiración por sector. Previsualiza y edítala en el Studio.',
    catalogCta: 'Ver catálogo',
    describeTitle: 'Crear mi web',
    describeDesc: 'Asistente guiado: sector, secciones, colores, menú y generación completa.',
    describeCta: 'Empezar asistente',
    hint: 'Las muestras profesionales son la opción más rápida para un resultado listo para mercado.',
  },
  en: {
    title: 'How do you want to start?',
    subtitle:
      'Pick a finished professional sample, a catalog template, or create your site with the guided assistant.',
    step1: 'Step 1 · Choose your starting point',
    premiumTitle: 'Professional samples',
    premiumDesc:
      'Real finished sites by industry. Just change name, phone, key copy and photos.',
    premiumCta: 'Choose sample',
    catalogTitle: 'Catalog templates',
    catalogDesc: '36 inspirational designs by industry. Preview and edit in Studio.',
    catalogCta: 'Browse catalog',
    describeTitle: 'Create my website',
    describeDesc: 'Guided assistant: sector, sections, colors, menu and full generation.',
    describeCta: 'Start assistant',
    hint: 'Professional samples are the fastest path to a market-ready result.',
  },
} as const;

const starterIcons: Record<string, typeof UtensilsCrossed> = {
  'meson-la-colonia': UtensilsCrossed,
  'lumina-dental': Stethoscope,
  'aura-estates': Building2,
  'aura-sanctuary': Hotel,
  'apex-athletics': Dumbbell,
  'aeterna-co': Gem,
  'vitalis-fisio': HeartPulse,
  'armonia-vital': Flower2,
  'aura-architects': Landmark,
};

function starterLabel(starter: PremiumStarterItem, lang: Lang): string {
  return lang === 'es' ? starter.nameEs : starter.nameEn;
}

type Props = {
  lang: Lang;
  onChooseDescribe: () => void;
  onChoosePremiumStarter: (slug: string) => void;
};

export default function StudioOnboarding({ lang, onChooseDescribe, onChoosePremiumStarter }: Props) {
  const t = copy[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-8 md:p-14 text-center">
      <p className="text-[10px] font-bold tracking-[0.25em] text-indigo-600 uppercase mb-3">{t.step1}</p>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 max-w-lg">{t.title}</h2>
      <p className="mt-4 text-slate-600 max-w-md leading-relaxed">{t.subtitle}</p>

      <div className="grid md:grid-cols-3 gap-4 mt-10 w-full max-w-4xl text-left">
        <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900">{t.premiumTitle}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.premiumDesc}</p>

          <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
            {premiumStarters.map((starter) => {
              const Icon = starterIcons[starter.slug] ?? Sparkles;
              return (
                <button
                  key={starter.slug}
                  type="button"
                  onClick={() => onChoosePremiumStarter(starter.slug)}
                  className="group w-full flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-white/80 px-3 py-2.5 hover:border-amber-500 hover:bg-white hover:shadow-sm transition-all text-left cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-xl bg-cover bg-center shrink-0 border border-amber-100"
                    style={{ backgroundImage: `url(${starter.previewImage})` }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="font-semibold text-sm text-slate-900 truncate">
                        {starterLabel(starter, lang)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {lang === 'es' ? starter.descEs : starter.descEn}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-amber-800 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Link
          href="/templates"
          className="group rounded-3xl border-2 border-slate-200 bg-white p-6 hover:border-indigo-400 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-lg text-slate-900">{t.catalogTitle}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.catalogDesc}</p>
          <span className="inline-block mt-4 text-sm font-semibold text-indigo-600 group-hover:underline">
            {t.catalogCta} →
          </span>
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
          <span className="inline-block mt-4 text-sm font-semibold text-slate-900 group-hover:underline">
            {t.describeCta} →
          </span>
        </button>
      </div>

      <p className="mt-8 text-xs text-slate-400 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5" /> {t.hint}
      </p>
    </div>
  );
}
