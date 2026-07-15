'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { LayoutGrid, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PremiumStarterPreviewFrame from '../components/PremiumStarterPreviewFrame';
import {
  premiumStarters,
  premiumCatalogCategories,
  type PremiumStarterItem,
  type PremiumCatalogCategory,
} from '../data/premiumStarters';

const translations = {
  es: {
    title: 'Muestras profesionales',
    subtitle:
      '9 webs terminadas por sector — diseño real, secciones completas y listas para personalizar con tu nombre, teléfono y fotos.',
    useSample: 'Personalizar en Studio',
    viewDemo: 'Ver demo en vivo',
    close: 'Cerrar',
    previewLink: 'Ver previsualización',
    badge: 'MUESTRAS CREAUNA 2026',
    countLabel: 'muestras terminadas por sector',
    finished: 'Web terminada',
  },
  en: {
    title: 'Professional samples',
    subtitle:
      '9 finished sites by industry — real design, complete sections, ready to customize with your name, phone and photos.',
    useSample: 'Customize in Studio',
    viewDemo: 'View live demo',
    close: 'Close',
    previewLink: 'View preview',
    badge: 'CREAUNA SAMPLES 2026',
    countLabel: 'finished samples by industry',
    finished: 'Finished site',
  },
};

type CategoryKey = 'all' | PremiumCatalogCategory;

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [selectedStarter, setSelectedStarter] = useState<PremiumStarterItem | null>(null);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang];

  const samplesList = useMemo(() => premiumStarters, []);

  const categories = useMemo(
    () =>
      premiumCatalogCategories.map((cat) => ({
        key: cat.key,
        label: lang === 'es' ? cat.labelEs : cat.labelEn,
        count:
          cat.key === 'all'
            ? samplesList.length
            : samplesList.filter((s) => s.catalogCategoryKey === cat.key).length,
      })),
    [lang, samplesList]
  );

  const filteredSamples =
    selectedCategory === 'all'
      ? samplesList
      : samplesList.filter((s) => s.catalogCategoryKey === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4 animate-fade-in">
            <LayoutGrid className="w-3.5 h-3.5" />
            {t.badge} • {samplesList.length} {t.countLabel}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 mt-2 leading-[1.08] text-gradient">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mt-5 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 max-w-5xl mx-auto mb-14 bg-white border border-slate-200/80 p-2 rounded-3xl shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key as CategoryKey)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label}
              <span className={`ml-1.5 ${selectedCategory === cat.key ? 'text-white/70' : 'text-slate-400'}`}>
                ({cat.count})
              </span>
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredSamples.map((starter) => {
              const name = lang === 'es' ? starter.nameEs : starter.nameEn;
              const category = lang === 'es' ? starter.categoryLabelEs : starter.categoryLabelEn;
              const description = lang === 'es' ? starter.descEs : starter.descEn;
              const studioHref = `/studio?starter=${starter.slug}&lang=${lang}`;

              return (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  key={starter.slug}
                  className="card-luxe group overflow-hidden rounded-[2rem] border border-slate-200 bg-white flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedStarter(starter)}
                    className="relative h-72 overflow-hidden w-full text-left cursor-pointer"
                  >
                    <img
                      src={starter.previewImage}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-500/90 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                        {t.finished}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-6 right-6 text-white z-10">
                      <span className="bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20">
                        {category}
                      </span>
                    </div>
                  </button>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-2xl tracking-tight text-slate-950">{name}</h3>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">
                      {description}
                    </p>
                    <div className="h-px bg-slate-100 my-5" />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href={studioHref}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl btn-gradient text-white text-xs font-semibold shadow-sm hover:scale-[1.01] transition-transform"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {t.useSample}
                      </Link>
                      <a
                        href={starter.demoPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {t.viewDemo}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedStarter(starter)}
                      className="mt-3 text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      {t.previewLink} <span>→</span>
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedStarter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${previewFullscreen ? '' : 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4'}`}
            onClick={() => !previewFullscreen && setSelectedStarter(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`${previewFullscreen ? 'fixed inset-0 z-[300]' : 'max-w-6xl w-full rounded-[2.5rem] shadow-2xl border border-slate-200 max-h-[90vh]'} bg-white overflow-hidden flex flex-col`}
              onClick={(e) => e.stopPropagation()}
            >
              <PremiumStarterPreviewFrame
                starter={selectedStarter}
                lang={lang}
                fullscreen={previewFullscreen}
                onToggleFullscreen={() => setPreviewFullscreen((v) => !v)}
                onClose={() => {
                  setPreviewFullscreen(false);
                  setSelectedStarter(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
