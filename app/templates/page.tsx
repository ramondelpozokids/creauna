'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { LayoutGrid, ExternalLink, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateDemoPreviewFrame from '../components/TemplateDemoPreviewFrame';
import {
  templateShowcase,
  templateShowcaseCategories,
  TEMPLATE_SHOWCASE_COUNT,
  type TemplateShowcaseItem,
  type TemplateShowcaseCategory,
} from '../data/templateShowcase';

const translations = {
  es: {
    title: 'Plantillas CREAUNA',
    subtitle:
      'CREAUNA es una plataforma de IA: describes tu web en lenguaje natural y la construye contigo. Aquí solo ves 18 ejemplos reales de lo que somos capaces de entregar — demos en vivo, sin personalizar desde esta página.',
    viewDemo: 'Ver demo en vivo',
    previewLink: 'Ver en pantalla',
    badge: 'EJEMPLOS CREAUNA',
    countLabel: 'plantillas demo',
    templateBadge: 'Plantilla',
    projectBadge: 'Proyecto real',
    footerTitle: '¿Quieres crear la tuya con IA?',
    footerText:
      'Abre el Studio, escribe en lenguaje natural qué necesitas — sitio web, secciones, estilo — y CREAUNA lo genera. También podemos hacerla por ti con presupuesto cerrado.',
    footerContact: 'Pedir presupuesto',
    footerStudio: 'Abrir Studio con IA',
  },
  en: {
    title: 'CREAUNA Templates',
    subtitle:
      'CREAUNA is an AI platform: describe your site in natural language and it builds with you. This page shows 18 real examples of what we deliver — live demos only, not customizable from here.',
    viewDemo: 'View live demo',
    previewLink: 'View on screen',
    badge: 'CREAUNA EXAMPLES',
    countLabel: 'demo templates',
    templateBadge: 'Template',
    projectBadge: 'Real project',
    footerTitle: 'Want to create yours with AI?',
    footerText:
      'Open Studio, write in natural language what you need — website, sections, style — and CREAUNA generates it. We can also build it for you with a fixed quote.',
    footerContact: 'Request a quote',
    footerStudio: 'Open AI Studio',
  },
};

type CategoryKey = 'all' | TemplateShowcaseCategory;

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [selectedItem, setSelectedItem] = useState<TemplateShowcaseItem | null>(null);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang];

  const categories = useMemo(
    () =>
      templateShowcaseCategories.map((cat) => ({
        key: cat.key,
        label: lang === 'es' ? cat.labelEs : cat.labelEn,
        count:
          cat.key === 'all'
            ? TEMPLATE_SHOWCASE_COUNT
            : templateShowcase.filter((s) => s.categoryKey === cat.key).length,
      })).filter((cat) => cat.key === 'all' || cat.count > 0),
    [lang]
  );

  const filteredItems =
    selectedCategory === 'all'
      ? templateShowcase
      : templateShowcase.filter((s) => s.categoryKey === selectedCategory);

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
            {filteredItems.map((item) => {
              const name = lang === 'es' ? item.nameEs : item.nameEn;
              const category = lang === 'es' ? item.categoryLabelEs : item.categoryLabelEn;
              const description = lang === 'es' ? item.descEs : item.descEn;
              const kindBadge = item.kind === 'template' ? t.templateBadge : t.projectBadge;

              return (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  key={item.slug}
                  className="card-luxe group overflow-hidden rounded-[2rem] border border-slate-200 bg-white flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="relative h-72 overflow-hidden w-full text-left cursor-pointer"
                  >
                    <img
                      src={item.previewImage}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/95 text-slate-900 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                        {kindBadge}
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
                        onClick={() => setSelectedItem(item)}
                        className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {t.previewLink}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

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
