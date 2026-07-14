'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Palette,
  Layout,
  Sparkles,
  PenLine,
  Menu,
  Eye,
} from 'lucide-react';
import StudioSectorLibrary, { type SectorPublic } from './StudioSectorLibrary';
import { buildIntentFromTemplateSlug } from '../lib/ai/intentAnalyzer';
import type { SiteFeatures } from '../lib/ai/intentAnalyzer';
import type {
  NavPageId,
  StudioDiscoveryAnswers,
  StudioHeroStyle,
  StudioPalette,
  StudioStyleMood,
} from '../lib/studio/discoveryTypes';
import { featuresFromNavPages, NAV_PAGE_IDS } from '../lib/studio/discoveryTypes';

type Lang = 'es' | 'en';

const STEPS = ['sector', 'business', 'sections', 'design', 'nav', 'review'] as const;
type StepId = (typeof STEPS)[number];

const copy = {
  es: {
    title: 'Asistente de creación',
    subtitle: 'Te haremos las mismas preguntas que un diseñador profesional. Al final generamos tu web completa.',
    steps: {
      sector: 'Sector',
      business: 'Negocio',
      sections: 'Secciones',
      design: 'Diseño',
      nav: 'Menú',
      review: 'Revisar',
    },
    sectorHint: 'Paso 1 · ¿Qué tipo de negocio es?',
    businessHint: 'Paso 2 · Nombre y eslogan',
    businessName: 'Nombre del negocio',
    businessNamePh: 'Ej: Trattoria Bella, Royal Bang Tattoo…',
    tagline: 'Eslogan (opcional)',
    taglinePh: 'Ej: Auténtica cocina italiana en el corazón de Madrid',
    sectionsHint: 'Paso 3 · ¿Qué secciones quieres?',
    sectionsSub: 'Activa o desactiva bloques. Puedes cambiarlo después en el chat.',
    designHint: 'Paso 4 · Estilo visual',
    designSub: 'Colores, tipografía y tipo de hero.',
    styleMood: 'Estilo general',
    palette: 'Paleta de color',
    heroStyle: 'Tipo de hero (cabecera)',
    navHint: 'Paso 5 · Páginas del menú',
    navSub: 'Elige qué enlaces aparecen en la navegación.',
    reviewHint: 'Paso 6 · Revisión final',
    reviewSub: 'Comprueba todo antes de generar. Usa 1 crédito.',
    extraNotes: 'Algo más que debamos saber (opcional)',
    extraNotesPh: 'Ej: quiero fotos de comida italiana, tono cercano, CTA de reserva visible…',
    back: 'Atrás',
    next: 'Siguiente',
    generate: 'Generar mi web',
    generating: 'Generando…',
    freeText: 'Prefiero escribirlo libremente',
    requiredSector: 'Elige un sector para continuar',
    requiredName: 'Escribe el nombre del negocio',
    moods: { elegante: 'Elegante', minimal: 'Minimal', moderno: 'Moderno' } as Record<StudioStyleMood, string>,
    palettes: {
      indigo: 'Índigo',
      slate: 'Gris',
      amber: 'Tierra',
      emerald: 'Verde',
      rose: 'Rosa',
      dark: 'Oscuro',
    } as Record<StudioPalette, string>,
    heroes: {
      full: 'Pantalla completa',
      split: 'Dividido',
      minimal: 'Minimal',
      cinematic: 'Cinematográfico',
    } as Record<StudioHeroStyle, string>,
    navLabels: {
      inicio: 'Inicio',
      servicios: 'Servicios',
      menu: 'Carta / Menú',
      galeria: 'Galería',
      about: 'Sobre nosotros',
      reviews: 'Reseñas',
      blog: 'Blog / Noticias',
      contacto: 'Contacto',
      reservas: 'Reservas',
      ubicacion: 'Ubicación',
    } as Record<NavPageId, string>,
    featureLabels: {
      menu: 'Carta / Menú de productos',
      services: 'Servicios',
      about: 'Sobre nosotros',
      gallery: 'Galería de fotos',
      reviews: 'Reseñas y testimonios',
      blog: 'Blog / Noticias',
      contact: 'Formulario de contacto',
      location: 'Ubicación y mapa',
      reservation: 'Reservas / Citas',
      legalFooter: 'Footer legal (aviso, privacidad)',
      whatsapp: 'Botón WhatsApp',
      sidebar: 'Barra lateral (sidebar)',
    } as Partial<Record<keyof SiteFeatures, string>>,
  },
  en: {
    title: 'Creation assistant',
    subtitle: 'We ask the same questions a pro designer would. Then we generate your full site.',
    steps: {
      sector: 'Sector',
      business: 'Business',
      sections: 'Sections',
      design: 'Design',
      nav: 'Menu',
      review: 'Review',
    },
    sectorHint: 'Step 1 · What type of business?',
    businessHint: 'Step 2 · Name and tagline',
    businessName: 'Business name',
    businessNamePh: 'E.g. Bella Trattoria, Royal Bang Tattoo…',
    tagline: 'Tagline (optional)',
    taglinePh: 'E.g. Authentic Italian cuisine in downtown Madrid',
    sectionsHint: 'Step 3 · Which sections?',
    sectionsSub: 'Toggle blocks on or off. You can change them later in chat.',
    designHint: 'Step 4 · Visual style',
    designSub: 'Colors, typography and hero type.',
    styleMood: 'Overall style',
    palette: 'Color palette',
    heroStyle: 'Hero (header) type',
    navHint: 'Step 5 · Menu pages',
    navSub: 'Choose navigation links.',
    reviewHint: 'Step 6 · Final review',
    reviewSub: 'Check everything before generating. Uses 1 credit.',
    extraNotes: 'Anything else we should know (optional)',
    extraNotesPh: 'E.g. Italian food photos, friendly tone, visible booking CTA…',
    back: 'Back',
    next: 'Next',
    generate: 'Generate my site',
    generating: 'Generating…',
    freeText: 'I prefer to write freely',
    requiredSector: 'Pick a sector to continue',
    requiredName: 'Enter your business name',
    moods: { elegante: 'Elegant', minimal: 'Minimal', moderno: 'Modern' } as Record<StudioStyleMood, string>,
    palettes: {
      indigo: 'Indigo',
      slate: 'Slate',
      amber: 'Earth',
      emerald: 'Green',
      rose: 'Rose',
      dark: 'Dark',
    } as Record<StudioPalette, string>,
    heroes: {
      full: 'Full screen',
      split: 'Split',
      minimal: 'Minimal',
      cinematic: 'Cinematic',
    } as Record<StudioHeroStyle, string>,
    navLabels: {
      inicio: 'Home',
      servicios: 'Services',
      menu: 'Menu',
      galeria: 'Gallery',
      about: 'About',
      reviews: 'Reviews',
      blog: 'Blog / News',
      contacto: 'Contact',
      reservas: 'Booking',
      ubicacion: 'Location',
    } as Record<NavPageId, string>,
    featureLabels: {
      menu: 'Menu / Product list',
      services: 'Services',
      about: 'About us',
      gallery: 'Photo gallery',
      reviews: 'Reviews & testimonials',
      blog: 'Blog / News',
      contact: 'Contact form',
      location: 'Location & map',
      reservation: 'Bookings / Appointments',
      legalFooter: 'Legal footer',
      whatsapp: 'WhatsApp button',
      sidebar: 'Sidebar',
    } as Partial<Record<keyof SiteFeatures, string>>,
  },
} as const;

const FEATURE_KEYS: (keyof SiteFeatures)[] = [
  'menu',
  'services',
  'about',
  'gallery',
  'reviews',
  'blog',
  'contact',
  'location',
  'reservation',
  'legalFooter',
  'whatsapp',
  'sidebar',
];

const DEFAULT_NAV: NavPageId[] = ['inicio', 'servicios', 'galeria', 'reviews', 'contacto'];

type Props = {
  lang: Lang;
  onComplete: (answers: StudioDiscoveryAnswers) => void;
  onFreeText: () => void;
  isGenerating?: boolean;
};

export default function StudioDiscoveryWizard({ lang, onComplete, onFreeText, isGenerating }: Props) {
  const t = copy[lang];
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];

  const [sectorId, setSectorId] = useState<string | null>(null);
  const [templateSlug, setTemplateSlug] = useState('vesper');
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [features, setFeatures] = useState<SiteFeatures>(() =>
    buildIntentFromTemplateSlug('vesper', lang).features
  );
  const [style, setStyle] = useState<StudioStyleMood>('elegante');
  const [palette, setPalette] = useState<StudioPalette>('indigo');
  const [heroStyle, setHeroStyle] = useState<StudioHeroStyle>('cinematic');
  const [navPages, setNavPages] = useState<NavPageId[]>(DEFAULT_NAV);
  const [extraNotes, setExtraNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSectorSelect = useCallback(
    (sector: SectorPublic) => {
      setSectorId(sector.id);
      setTemplateSlug(sector.templateSlug);
      const intent = buildIntentFromTemplateSlug(sector.templateSlug, lang);
      setFeatures(intent.features);
      setBusinessName('');
    },
    [lang]
  );

  const toggleFeature = (key: keyof SiteFeatures) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNav = (id: NavPageId) => {
    if (id === 'inicio') return;
    setNavPages((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const mergedFeatures = useMemo(
    () => featuresFromNavPages(navPages, features),
    [navPages, features]
  );

  const canNext = useMemo(() => {
    if (step === 'sector') return !!sectorId;
    if (step === 'business') return businessName.trim().length >= 2;
    return true;
  }, [step, sectorId, businessName]);

  const goNext = () => {
    setError(null);
    if (!canNext) {
      setError(step === 'sector' ? t.requiredSector : t.requiredName);
      return;
    }
    if (stepIdx < STEPS.length - 1) setStepIdx((i) => i + 1);
  };

  const goBack = () => {
    setError(null);
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const handleGenerate = () => {
    if (!sectorId || businessName.trim().length < 2) {
      setError(t.requiredName);
      return;
    }
    const answers: StudioDiscoveryAnswers = {
      sectorId,
      templateSlug,
      businessName: businessName.trim(),
      tagline: tagline.trim() || undefined,
      style,
      palette,
      heroStyle,
      features: mergedFeatures,
      navPages,
      extraNotes: extraNotes.trim() || undefined,
    };
    onComplete(answers);
  };

  const stepIcons: Record<StepId, typeof Sparkles> = {
    sector: Sparkles,
    business: PenLine,
    sections: Layout,
    design: Palette,
    nav: Menu,
    review: Eye,
  };

  return (
    <div className="flex flex-col h-full min-h-[480px] overflow-hidden">
      <div className="px-6 md:px-10 pt-8 pb-4 shrink-0 border-b border-slate-100">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">{t.title}</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">{t.subtitle}</p>

        <div className="flex flex-wrap gap-2 mt-5">
          {STEPS.map((s, i) => {
            const Icon = stepIcons[s];
            const active = i === stepIdx;
            const done = i < stepIdx;
            return (
              <div
                key={s}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : done
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                {t.steps[s]}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 md:px-10 py-6">
        {step === 'sector' && (
          <div>
            <p className="text-sm font-medium text-indigo-600 mb-3">{t.sectorHint}</p>
            <StudioSectorLibrary
              lang={lang}
              selectedId={sectorId}
              onSelect={handleSectorSelect}
              compact
            />
          </div>
        )}

        {step === 'business' && (
          <div className="max-w-lg space-y-5">
            <p className="text-sm font-medium text-indigo-600">{t.businessHint}</p>
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">{t.businessName}</span>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={t.businessNamePh}
                className="mt-2 w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-900"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">{t.tagline}</span>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder={t.taglinePh}
                className="mt-2 w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-900"
              />
            </label>
          </div>
        )}

        {step === 'sections' && (
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-indigo-600">{t.sectionsHint}</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">{t.sectionsSub}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {FEATURE_KEYS.map((key) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition ${
                    features[key]
                      ? 'border-indigo-400 bg-indigo-50/60'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={features[key]}
                    onChange={() => toggleFeature(key)}
                    className="w-4 h-4 rounded accent-indigo-600"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {t.featureLabels[key] ?? key}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 'design' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <p className="text-sm font-medium text-indigo-600">{t.designHint}</p>
              <p className="text-xs text-slate-500 mt-1">{t.designSub}</p>
            </div>
            <section>
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
                {t.styleMood}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(['elegante', 'minimal', 'moderno'] as StudioStyleMood[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setStyle(m)}
                    className={`px-4 py-2 rounded-2xl text-sm font-semibold border-2 cursor-pointer ${
                      style === m
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {t.moods[m]}
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
                {t.palette}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(['indigo', 'slate', 'amber', 'emerald', 'rose', 'dark'] as StudioPalette[]).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPalette(p)}
                      className={`px-4 py-2 rounded-2xl text-sm font-semibold border-2 cursor-pointer ${
                        palette === p
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                          : 'border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      {t.palettes[p]}
                    </button>
                  )
                )}
              </div>
            </section>
            <section>
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
                {t.heroStyle}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(['full', 'split', 'minimal', 'cinematic'] as StudioHeroStyle[]).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHeroStyle(h)}
                    className={`px-4 py-2 rounded-2xl text-sm font-semibold border-2 cursor-pointer ${
                      heroStyle === h
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                        : 'border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    {t.heroes[h]}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {step === 'nav' && (
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-indigo-600">{t.navHint}</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">{t.navSub}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {NAV_PAGE_IDS.map((id) => (
                <label
                  key={id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition ${
                    navPages.includes(id) || id === 'inicio'
                      ? 'border-indigo-400 bg-indigo-50/60'
                      : 'border-slate-200 bg-white'
                  } ${id === 'inicio' ? 'opacity-70 cursor-default' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={navPages.includes(id) || id === 'inicio'}
                    disabled={id === 'inicio'}
                    onChange={() => toggleNav(id)}
                    className="w-4 h-4 rounded accent-indigo-600"
                  />
                  <span className="text-sm font-medium text-slate-800">{t.navLabels[id]}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-medium text-indigo-600">{t.reviewHint}</p>
            <p className="text-xs text-slate-500">{t.reviewSub}</p>
            <dl className="rounded-2xl border border-slate-200 divide-y divide-slate-100 text-sm">
              <div className="flex justify-between px-4 py-3">
                <dt className="text-slate-500">{t.steps.sector}</dt>
                <dd className="font-semibold text-slate-900">{sectorId}</dd>
              </div>
              <div className="flex justify-between px-4 py-3">
                <dt className="text-slate-500">{t.businessName}</dt>
                <dd className="font-semibold text-slate-900">{businessName}</dd>
              </div>
              <div className="flex justify-between px-4 py-3">
                <dt className="text-slate-500">{t.styleMood}</dt>
                <dd className="font-semibold text-slate-900">{t.moods[style]}</dd>
              </div>
              <div className="flex justify-between px-4 py-3">
                <dt className="text-slate-500">{t.palette}</dt>
                <dd className="font-semibold text-slate-900">{t.palettes[palette]}</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-slate-500 mb-1">{t.steps.sections}</dt>
                <dd className="text-slate-800 text-xs leading-relaxed">
                  {FEATURE_KEYS.filter((k) => mergedFeatures[k])
                    .map((k) => t.featureLabels[k])
                    .join(' · ')}
                </dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-slate-500 mb-1">{t.steps.nav}</dt>
                <dd className="text-slate-800 text-xs">
                  {navPages.map((id) => t.navLabels[id]).join(' · ')}
                </dd>
              </div>
            </dl>
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">{t.extraNotes}</span>
              <textarea
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder={t.extraNotesPh}
                rows={3}
                className="mt-2 w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-900 resize-none"
              />
            </label>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}
      </div>

      <div className="shrink-0 px-6 md:px-10 py-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white/80">
        <button
          type="button"
          onClick={onFreeText}
          className="text-xs text-slate-400 hover:text-indigo-600 underline cursor-pointer"
        >
          {t.freeText}
        </button>
        <div className="flex items-center gap-2">
          {stepIdx > 0 && (
            <button
              type="button"
              onClick={goBack}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </button>
          )}
          {step !== 'review' ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 cursor-pointer"
            >
              {t.next}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t.generate}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
