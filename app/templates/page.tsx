'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { LayoutGrid, ExternalLink, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateDemoPreviewFrame from '../components/TemplateDemoPreviewFrame';
import {
  templateShowcaseByKind,
  TEMPLATE_SHOWCASE_COUNT,
  type TemplateShowcaseItem,
} from '../data/templateShowcase';

type FilterKey = 'all' | 'gastronomy' | 'health' | 'aura' | 'other' | 'premium';

const translations = {
  es: {
    title: 'Plantillas CREAUNA',
    subtitle:
      'CREAUNA es una plataforma de IA: describes tu web en lenguaje natural y la construye contigo. Aquí ves ejemplos reales, también de alto impacto (Velocity X, AEON, PHANTOM). Demos en vivo, sin personalizar desde esta página.',
    viewDemo: 'Ver demo en vivo',
    previewLink: 'Ver en pantalla',
    badge: 'EJEMPLOS CREAUNA',
    countLabel: 'demos',
    templateBadge: 'Plantilla',
    projectBadge: 'Proyecto real',
    premiumBadge: 'Premium',
    premiumFrom: 'desde 4.900€',
    filterAll: 'Todos',
    filterFood: 'Comida',
    filterHealth: 'Salud',
    filterAura: 'Aura',
    filterOther: 'Otros',
    filterPremium: 'Premium',
    sectionFood: 'Comida · por tipo de servicio',
    sectionHealth: 'Salud',
    sectionAura: 'Aura',
    sectionOther: 'Otros ejemplos',
    sectionPremium: 'Premium Experiencia',
    footerTitle: '¿Quieres crear la tuya con IA?',
    footerText:
      'Abre el Studio, escribe en lenguaje natural qué necesitas — sitio web, secciones, estilo — y CREAUNA lo genera. También podemos hacerla por ti con presupuesto cerrado (web normal o Premium).',
    footerContact: 'Pedir presupuesto',
    footerStudio: 'Abrir Studio con IA',
  },
  en: {
    title: 'CREAUNA Templates',
    subtitle:
      'CREAUNA is an AI platform: describe your site in natural language and it builds with you. This page shows real examples, including high-impact demos (Velocity X, AEON, PHANTOM). Live demos only, not customizable from here.',
    viewDemo: 'View live demo',
    previewLink: 'View on screen',
    badge: 'CREAUNA EXAMPLES',
    countLabel: 'demos',
    templateBadge: 'Template',
    projectBadge: 'Real project',
    premiumBadge: 'Premium',
    premiumFrom: 'from €4,900',
    filterAll: 'All',
    filterFood: 'Food',
    filterHealth: 'Health',
    filterAura: 'Aura',
    filterOther: 'Other',
    filterPremium: 'Premium',
    sectionFood: 'Food · by service type',
    sectionHealth: 'Health',
    sectionAura: 'Aura',
    sectionOther: 'Other examples',
    sectionPremium: 'Premium Experience',
    footerTitle: 'Want to create yours with AI?',
    footerText:
      'Open Studio, write in natural language what you need — website, sections, style — and CREAUNA generates it. We can also build it for you with a fixed quote (standard site or Premium).',
    footerContact: 'Request a quote',
    footerStudio: 'Open AI Studio',
  },
};

function ShowcaseCard({
  item,
  lang,
  t,
  onPreview,
}: {
  item: TemplateShowcaseItem;
  lang: 'es' | 'en';
  t: (typeof translations)['es'];
  onPreview: (item: TemplateShowcaseItem) => void;
}) {
  const name = lang === 'es' ? item.nameEs : item.nameEn;
  const category = lang === 'es' ? item.categoryLabelEs : item.categoryLabelEn;
  const description = lang === 'es' ? item.descEs : item.descEn;
  const kindBadge =
    item.kind === 'premium'
      ? t.premiumBadge
      : item.kind === 'template'
        ? t.templateBadge
        : t.projectBadge;

  return (
    <article
      className={`card-luxe group overflow-hidden rounded-[2rem] border bg-white flex flex-col ${
        item.kind === 'premium' ? 'border-amber-300/80 ring-1 ring-amber-200/60' : 'border-slate-200'
      }`}
    >
      <button
        type="button"
        onClick={() => onPreview(item)}
        className="relative h-72 overflow-hidden w-full text-left cursor-pointer"
      >
        <img
          src={item.previewImage}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
              item.kind === 'premium' ? 'bg-amber-500 text-white' : 'bg-white/95 text-slate-900'
            }`}
          >
            {kindBadge}
          </span>
          {item.kind === 'premium' && (
            <span className="bg-slate-950/80 text-amber-200 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-amber-400/30">
              {t.premiumFrom}
            </span>
          )}
        </div>
        <div className="absolute bottom-5 left-6 right-6 text-white z-10">
          <span className="bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20">
            {category}
          </span>
        </div>
      </button>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-2xl tracking-tight text-slate-950">{name}</h3>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">{description}</p>
        <div className="h-px bg-slate-100 my-5" />
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={item.demoPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {t.viewDemo}
          </a>
          <button
            type="button"
            onClick={() => onPreview(item)}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            {t.previewLink}
          </button>
        </div>
      </div>
    </article>
  );
}

function CardGrid({
  items,
  lang,
  t,
  onPreview,
}: {
  items: TemplateShowcaseItem[];
  lang: 'es' | 'en';
  t: (typeof translations)['es'];
  onPreview: (item: TemplateShowcaseItem) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {items.map((item) => (
        <ShowcaseCard key={item.slug} item={item} lang={lang} t={t} onPreview={onPreview} />
      ))}
    </div>
  );
}

export default function Templates() {
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('all');
  const [selectedItem, setSelectedItem] = useState<TemplateShowcaseItem | null>(null);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    try {
      const cat = new URLSearchParams(window.location.search).get('cat');
      if (cat === 'premium') setSelectedFilter('premium');
      if (cat === 'gastronomy' || cat === 'comida') setSelectedFilter('gastronomy');
      if (cat === 'health' || cat === 'salud') setSelectedFilter('health');
      if (cat === 'aura') setSelectedFilter('aura');
    } catch {
      /* ignore */
    }
  }, []);

  const filters = useMemo(
    () =>
      [
        { key: 'all' as const, label: t.filterAll, count: TEMPLATE_SHOWCASE_COUNT },
        {
          key: 'gastronomy' as const,
          label: t.filterFood,
          count: templateShowcaseByKind.gastronomy.length,
        },
        {
          key: 'health' as const,
          label: t.filterHealth,
          count: templateShowcaseByKind.health.length,
        },
        {
          key: 'aura' as const,
          label: t.filterAura,
          count: templateShowcaseByKind.aura.length,
        },
        {
          key: 'other' as const,
          label: t.filterOther,
          count: templateShowcaseByKind.other.length,
        },
        {
          key: 'premium' as const,
          label: t.filterPremium,
          count: templateShowcaseByKind.premium.length,
        },
      ].filter((f) => f.count > 0 && f.count % 3 === 0),
    [t]
  );

  const sections =
    selectedFilter === 'all'
      ? [
          {
            key: 'gastronomy',
            title: t.sectionFood,
            items: templateShowcaseByKind.gastronomy,
          },
          {
            key: 'health',
            title: t.sectionHealth,
            items: templateShowcaseByKind.health,
          },
          {
            key: 'aura',
            title: t.sectionAura,
            items: templateShowcaseByKind.aura,
          },
          {
            key: 'other',
            title: t.sectionOther,
            items: templateShowcaseByKind.other,
          },
          {
            key: 'premium',
            title: t.sectionPremium,
            items: templateShowcaseByKind.premium,
          },
        ]
      : [
          {
            key: selectedFilter,
            title: null as string | null,
            items:
              selectedFilter === 'gastronomy'
                ? templateShowcaseByKind.gastronomy
                : selectedFilter === 'health'
                  ? templateShowcaseByKind.health
                  : selectedFilter === 'aura'
                    ? templateShowcaseByKind.aura
                    : selectedFilter === 'other'
                      ? templateShowcaseByKind.other
                      : templateShowcaseByKind.premium,
          },
        ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4">
            <LayoutGrid className="w-3.5 h-3.5" />
            {t.badge} • {TEMPLATE_SHOWCASE_COUNT} {t.countLabel}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 mt-2 leading-[1.08] text-gradient">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mt-5 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 max-w-3xl mx-auto mb-14 bg-white border border-slate-200/80 p-2 rounded-3xl shadow-sm">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setSelectedFilter(f.key)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                selectedFilter === f.key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 ${selectedFilter === f.key ? 'text-white/70' : 'text-slate-400'}`}>
                ({f.count})
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.key}>
              {section.title && (
                <div className="max-w-6xl mx-auto mb-6 flex items-end justify-between gap-4 px-1">
                  <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-950">
                    {section.title}
                  </h2>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {section.items.length}
                  </span>
                </div>
              )}
              <CardGrid items={section.items} lang={lang} t={t} onPreview={setSelectedItem} />
            </section>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-16 text-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">{t.footerTitle}</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.footerText}</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/contacto"
              className="btn-gradient px-8 py-3.5 rounded-2xl text-sm font-semibold shadow-md"
            >
              {t.footerContact}
            </Link>
            <Link
              href="/studio"
              className="px-8 py-3.5 rounded-2xl text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {t.footerStudio}
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${previewFullscreen ? '' : 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4'}`}
            onClick={() => !previewFullscreen && setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`${previewFullscreen ? 'fixed inset-0 z-[300]' : 'max-w-6xl w-full rounded-[2.5rem] shadow-2xl border border-slate-200 max-h-[90vh]'} bg-white overflow-hidden flex flex-col`}
              onClick={(e) => e.stopPropagation()}
            >
              <TemplateDemoPreviewFrame
                item={selectedItem}
                lang={lang}
                fullscreen={previewFullscreen}
                onToggleFullscreen={() => setPreviewFullscreen((v) => !v)}
                onClose={() => {
                  setPreviewFullscreen(false);
                  setSelectedItem(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
