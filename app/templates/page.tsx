'use client';

import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { LayoutGrid, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplatePreviewFrame from '../components/TemplatePreviewFrame';
import { getPublishedTemplates, getTemplateBySlug, type TemplateItem } from '../data/templates';

const translations = {
  es: {
    title: "Plantillas espectaculares",
    subtitle: "60 diseños premium — 12 por categoría. Cada imagen coincide con el negocio que representa.",
    all: "Todos",
    gastronomy: "Gastronomía",
    services: "Servicios",
    luxury: "Lujo & Estilo",
    corporate: "Corporativo",
    tech: "Tecnología",
    useTemplate: "Usar esta plantilla",
    close: "Cerrar",
    previewTitle: "Representación en tiempo real",
    previewSubtitle: "Vista previa interactiva. Cárgala en el Studio para editar cada detalle.",
    visitStudio: "Abrir en el Studio",
    countLabel: "plantillas premium",
    previewLink: "Ver previsualización en vivo",
  },
  en: {
    title: "Spectacular Templates",
    subtitle: "60 premium designs — 12 per category. Every image matches the business it represents.",
    all: "All",
    gastronomy: "Gastronomy",
    services: "Services",
    luxury: "Luxury & Style",
    corporate: "Corporate",
    tech: "Technology",
    useTemplate: "Use this template",
    close: "Close",
    previewTitle: "Real-time Representation",
    previewSubtitle: "Interactive preview. Load it into the Studio to customize every detail.",
    visitStudio: "Open in Studio",
    countLabel: "premium templates",
    previewLink: "See live preview",
  }
};

type DisplayTemplate = {
  id: number;
  slug: string;
  name: string;
  categoryKey: string;
  category: string;
  image: string;
  preview: string;
  description: string;
};

function toDisplayTemplate(tpl: TemplateItem, lang: 'es' | 'en'): DisplayTemplate {
  return {
    id: tpl.id,
    slug: tpl.slug,
    name: lang === 'es' ? tpl.nameEs : tpl.nameEn,
    categoryKey: tpl.categoryKey,
    category: lang === 'es' ? tpl.categoryEs : tpl.categoryEn,
    image: tpl.image,
    preview: tpl.image,
    description: lang === 'es' ? tpl.descEs : tpl.descEn,
  };
}

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<DisplayTemplate | null>(null);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang];

  const templatesList = useMemo(
    () => getPublishedTemplates().map(tpl => toDisplayTemplate(tpl, lang)),
    [lang]
  );

  const selectedTemplateItem = selectedTemplate
    ? getTemplateBySlug(selectedTemplate.slug)
    : undefined;

  const categories = [
    { key: 'all', label: t.all, count: templatesList.length },
    { key: 'gastronomy', label: t.gastronomy, count: templatesList.filter(i => i.categoryKey === 'gastronomy').length },
    { key: 'services', label: t.services, count: templatesList.filter(i => i.categoryKey === 'services').length },
    { key: 'luxury', label: t.luxury, count: templatesList.filter(i => i.categoryKey === 'luxury').length },
    { key: 'corporate', label: t.corporate, count: templatesList.filter(i => i.categoryKey === 'corporate').length },
    { key: 'tech', label: t.tech, count: templatesList.filter(i => i.categoryKey === 'tech').length },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templatesList
    : templatesList.filter(item => item.categoryKey === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4 animate-fade-in">
            <LayoutGrid className="w-3.5 h-3.5" />
            CATÁLOGO PREMIUM 2026 • {templatesList.length} {t.countLabel}
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
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
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

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((tpl) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className="card-luxe group cursor-pointer overflow-hidden rounded-[2rem] border border-slate-200 bg-white"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={tpl.image}
                    alt={tpl.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-65" />
                  <div className="absolute bottom-5 left-6 text-white z-10">
                    <span className="bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20">
                      {tpl.category}
                    </span>
                  </div>
                </div>
                <div className="p-6.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-2xl tracking-tight text-slate-950">{tpl.name}</h3>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3 min-h-[60px]">
                    {tpl.description}
                  </p>
                  <div className="h-px bg-slate-100 my-5" />
                  <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {t.previewLink} <span>→</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedTemplate && selectedTemplateItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${previewFullscreen ? '' : 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4'}`}
            onClick={() => !previewFullscreen && setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className={`${previewFullscreen ? 'fixed inset-0 z-[300]' : 'max-w-6xl w-full rounded-[2.5rem] shadow-2xl border border-slate-200 max-h-[90vh]'} bg-white overflow-hidden flex flex-col`}
              onClick={e => e.stopPropagation()}
            >
              <TemplatePreviewFrame
                template={selectedTemplateItem}
                lang={lang}
                fullscreen={previewFullscreen}
                onToggleFullscreen={() => setPreviewFullscreen((v) => !v)}
                onClose={() => {
                  setPreviewFullscreen(false);
                  setSelectedTemplate(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
