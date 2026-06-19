'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { LayoutGrid, Filter, ExternalLink, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const translations = {
  es: {
    title: "Plantillas espectaculares",
    subtitle: "Cada una diseñada con el más alto nivel de detalle. Elige una y hazla completamente tuya.",
    all: "Todos",
    gastronomy: "Gastronomía",
    services: "Servicios",
    luxury: "Lujo & Estilo",
    corporate: "Corporativo",
    tech: "Tecnología",
    useTemplate: "Usar esta plantilla",
    close: "Cerrar",
    previewTitle: "Representación en tiempo real",
    previewSubtitle: "Esta es una vista previa interactiva. Puedes cargarla en el Studio para editar cada detalle.",
    visitStudio: "Abrir en el Studio",
    templates: {
      atelier: {
        name: "Atelier",
        category: "Joyería & Lujo",
        desc: "Diseño ultra refinado para marcas de lujo. Espacios generosos, tipografía elegante y detalles exquisitos."
      },
      vesper: {
        name: "Vesper",
        category: "Restaurante Gourmet",
        desc: "Elegancia gastronómica. Diseñada para restaurantes de alto nivel, bodegas y experiencias culinarias memorables."
      },
      mokka: {
        name: "Mokka",
        category: "Cafetería de Especialidad",
        desc: "Un ambiente acogedor plasmado en la web. Ideal para cafeterías boutique, tostaderos y pastelerías artesanales."
      },
      classicCut: {
        name: "Classic Cut",
        category: "Barbería Premium",
        desc: "Estilo retro-moderno con fuerte identidad visual. Perfecto para barberías, salones de estética y cuidado masculino."
      },
      lumen: {
        name: "Lumen",
        category: "Clínica de Estética",
        desc: "Diseño limpio y profesional que inspira confianza médica. Pensado para clínicas dentales, spas y centros estéticos."
      },
      nexus: {
        name: "Nexus",
        category: "Empresa Profesional",
        desc: "Corporativo moderno para servicios B2B. Estructura corporativa robusta, ideal para consultoras y despachos."
      },
      sable: {
        name: "Sable",
        category: "Bistro & Gastronomía",
        desc: "Calidez y sofisticación. Ideal para restaurantes locales, hoteles boutique y experiencias gastronómicas premium."
      },
      minimalist: {
        name: "Minimalist",
        category: "Portfolio Creativo",
        desc: "Un lienzo en blanco para tu trabajo. Diseñado para fotógrafos, diseñadores y profesionales creativos independientes."
      },
      vanguard: {
        name: "Vanguard",
        category: "Agencia de Marketing",
        desc: "Llamativo, dinámico y con fuertes microinteracciones. La mejor opción para agencias de publicidad y comunicación."
      },
      habitat: {
        name: "Habitat",
        category: "Inmobiliaria Exclusiva",
        desc: "Estructura optimizada para mostrar propiedades de lujo. Ficha detallada y diseño moderno de alta conversión."
      },
      boutique: {
        name: "Boutique Hotel",
        category: "Hotel & Alojamiento",
        desc: "Inmersivo y sugerente. Convierte las visitas en reservas directas. Ideal para hoteles boutique y villas privadas."
      },
      arc: {
        name: "Arc",
        category: "Startup Tecnológica",
        desc: "Diseño moderno, limpio y altamente convertible. La elección preferida de startups, SaaS y empresas tecnológicas."
      }
    }
  },
  en: {
    title: "Spectacular Templates",
    subtitle: "Each crafted with the absolute highest attention to detail. Select one and make it yours.",
    all: "All",
    gastronomy: "Gastronomy",
    services: "Services",
    luxury: "Luxury & Style",
    corporate: "Corporate",
    tech: "Technology",
    useTemplate: "Use this template",
    close: "Close",
    previewTitle: "Real-time Representation",
    previewSubtitle: "This is an interactive preview. You can load it directly into the Studio to customize every aspect.",
    visitStudio: "Open in Studio",
    templates: {
      atelier: {
        name: "Atelier",
        category: "Jewelry & Luxury",
        desc: "Ultra-refined design for luxury brands. Generous spacing, elegant typography, and exquisite detailing."
      },
      vesper: {
        name: "Vesper",
        category: "Gourmet Restaurant",
        desc: "Culinary elegance. Crafted for fine dining establishments, boutique wineries, and memorable food experiences."
      },
      mokka: {
        name: "Mokka",
        category: "Specialty Coffee",
        desc: "Warm atmosphere captured on screen. Ideal for boutique coffee shops, roasters, and artisan bakeries."
      },
      classicCut: {
        name: "Classic Cut",
        category: "Premium Barbershop",
        desc: "Retro-modern styling with a strong identity. Perfect for barbershops, salons, and men's grooming clinics."
      },
      lumen: {
        name: "Lumen",
        category: "Aesthetic Clinic",
        desc: "Clean and professional layout that inspires medical trust. Built for dental clinics, spas, and wellness centers."
      },
      nexus: {
        name: "Nexus",
        category: "Professional Services",
        desc: "Modern corporate layout for B2B services. Structured perfectly for consultancies and professional firms."
      },
      sable: {
        name: "Sable",
        category: "Bistro & Gastronomy",
        desc: "Warm and sophisticated. Ideal for local bistros, boutique hotels, and premium dining experiences."
      },
      minimalist: {
        name: "Minimalist",
        category: "Creative Portfolio",
        desc: "A clean canvas for your craft. Tailored for photographers, designers, and independent creative freelancers."
      },
      vanguard: {
        name: "Vanguard",
        category: "Marketing Agency",
        desc: "Bold, dynamic, and rich in micro-interactions. The best fit for advertising and communication agencies."
      },
      habitat: {
        name: "Habitat",
        category: "Exclusive Real Estate",
        desc: "Optimized grid to highlight luxury properties. Detailed property pages and high-converting modern layout."
      },
      boutique: {
        name: "Boutique Hotel",
        category: "Hotel & Lodging",
        desc: "Immersive and atmospheric. Drive direct bookings. Ideal for boutique hotels, resorts, and private villas."
      },
      arc: {
        name: "Arc",
        category: "Tech Startup",
        desc: "Modern, clean, and highly converting. The preferred choice of startups, SaaS, and technology firms."
      }
    }
  }
};

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const { lang } = useLanguage();
  const t = translations[lang];

  const templatesList = [
    {
      id: 1,
      name: t.templates.atelier.name,
      categoryKey: "luxury",
      category: t.templates.atelier.category,
      image: "/images/luxury-jewelry-atelier-elegant-interior--1.jpg",
      preview: "/images/luxury-jewelry-atelier-elegant-interior--1.jpg",
      description: t.templates.atelier.desc,
    },
    {
      id: 2,
      name: t.templates.vesper.name,
      categoryKey: "gastronomy",
      category: t.templates.vesper.category,
      image: "/images/fine-dining-restaurant-interior-elegant--1.jpg",
      preview: "/images/fine-dining-restaurant-interior-elegant--1.jpg",
      description: t.templates.vesper.desc,
    },
    {
      id: 3,
      name: t.templates.mokka.name,
      categoryKey: "gastronomy",
      category: t.templates.mokka.category,
      image: "/images/fine-dining-restaurant-interior-elegant--2.jpg",
      preview: "/images/fine-dining-restaurant-interior-elegant--2.jpg",
      description: t.templates.mokka.desc,
    },
    {
      id: 4,
      name: t.templates.classicCut.name,
      categoryKey: "services",
      category: t.templates.classicCut.category,
      image: "/images/luxury-jewelry-atelier-elegant-interior--3.jpg",
      preview: "/images/luxury-jewelry-atelier-elegant-interior--3.jpg",
      description: t.templates.classicCut.desc,
    },
    {
      id: 5,
      name: t.templates.lumen.name,
      categoryKey: "services",
      category: t.templates.lumen.category,
      image: "/images/modern-architecture-minimalist-building--2.jpg",
      preview: "/images/modern-architecture-minimalist-building--2.jpg",
      description: t.templates.lumen.desc,
    },
    {
      id: 6,
      name: t.templates.nexus.name,
      categoryKey: "corporate",
      category: t.templates.nexus.category,
      image: "/images/modern-architecture-minimalist-building--1.jpg",
      preview: "/images/modern-architecture-minimalist-building--1.jpg",
      description: t.templates.nexus.desc,
    },
    {
      id: 7,
      name: t.templates.sable.name,
      categoryKey: "gastronomy",
      category: t.templates.sable.category,
      image: "/images/fine-dining-restaurant-interior-elegant--1.jpg",
      preview: "/images/fine-dining-restaurant-interior-elegant--1.jpg",
      description: t.templates.sable.desc,
    },
    {
      id: 8,
      name: t.templates.minimalist.name,
      categoryKey: "luxury",
      category: t.templates.minimalist.category,
      image: "/images/modern-architecture-minimalist-building--2.jpg",
      preview: "/images/modern-architecture-minimalist-building--2.jpg",
      description: t.templates.minimalist.desc,
    },
    {
      id: 9,
      name: t.templates.vanguard.name,
      categoryKey: "corporate",
      category: t.templates.vanguard.category,
      image: "/images/modern-architecture-minimalist-building--1.jpg",
      preview: "/images/modern-architecture-minimalist-building--1.jpg",
      description: t.templates.vanguard.desc,
    },
    {
      id: 10,
      name: t.templates.habitat.name,
      categoryKey: "corporate",
      category: t.templates.habitat.category,
      image: "/images/modern-architecture-minimalist-building--1.jpg",
      preview: "/images/modern-architecture-minimalist-building--1.jpg",
      description: t.templates.habitat.desc,
    },
    {
      id: 11,
      name: t.templates.boutique.name,
      categoryKey: "luxury",
      category: t.templates.boutique.category,
      image: "/images/luxury-jewelry-atelier-elegant-interior--2.jpg",
      preview: "/images/luxury-jewelry-atelier-elegant-interior--2.jpg",
      description: t.templates.boutique.desc,
    },
    {
      id: 12,
      name: t.templates.arc.name,
      categoryKey: "tech",
      category: t.templates.arc.category,
      image: "/images/modern-architecture-minimalist-building--2.jpg",
      preview: "/images/modern-architecture-minimalist-building--2.jpg",
      description: t.templates.arc.desc,
    }
  ];

  const categories = [
    { key: 'all', label: t.all },
    { key: 'gastronomy', label: t.gastronomy },
    { key: 'services', label: t.services },
    { key: 'luxury', label: t.luxury },
    { key: 'corporate', label: t.corporate },
    { key: 'tech', label: t.tech }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templatesList 
    : templatesList.filter(item => item.categoryKey === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4 animate-fade-in">
            <LayoutGrid className="w-3.5 h-3.5" />
            CATÁLOGO PREMIUM 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 mt-2 leading-[1.08] text-gradient">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mt-5 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center items-center gap-2 max-w-4xl mx-auto mb-14 bg-white border border-slate-200/80 p-2 rounded-3xl shadow-sm">
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
            </button>
          ))}
        </div>

        {/* Templates Grid */}
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
                    {lang === 'es' ? 'Ver previsualización en vivo' : 'See live preview'} <span>→</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Beautiful Modal Preview with browser shell mockup */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-4" 
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]" 
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-3xl tracking-tight text-slate-950">{selectedTemplate.name}</span>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {selectedTemplate.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{t.previewSubtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link 
                    href="/studio" 
                    className="btn-gradient px-7 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    {t.useTemplate}
                  </Link>
                  <button 
                    onClick={() => setSelectedTemplate(null)} 
                    className="px-5 py-3 text-xs border border-slate-200 rounded-2xl hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    {t.close}
                  </button>
                </div>
              </div>

              {/* Browser mockup iframe area */}
              <div className="flex-1 overflow-auto p-6 bg-slate-100">
                <div className="mx-auto max-w-[1020px] shadow-2xl rounded-2xl overflow-hidden border border-slate-200/80 bg-white">
                  {/* Browser top-bar */}
                  <div className="h-11 bg-slate-50 border-b border-slate-200/60 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2 w-24">
                      <span className="w-3 h-3 bg-red-400 rounded-full" />
                      <span className="w-3 h-3 bg-amber-400 rounded-full" />
                      <span className="w-3 h-3 bg-green-400 rounded-full" />
                    </div>
                    <div className="bg-slate-200/50 text-[10.5px] font-mono px-6 py-1 rounded-lg text-slate-500 w-[360px] text-center select-none truncate">
                      {selectedTemplate.name.toLowerCase().replace(/\s+/g, '')}.creauna.com
                    </div>
                    <div className="w-24 flex justify-end">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Browser content simulation */}
                  <div className="h-[480px] overflow-y-auto">
                    <img 
                      src={selectedTemplate.preview} 
                      alt={selectedTemplate.name} 
                      className="w-full h-auto object-cover object-top" 
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 text-center text-xs text-slate-500 border-t border-slate-100 bg-slate-50">
                {t.previewTitle} • {lang === 'es' ? 'Simulación en navegador CREAUNA' : 'CREAUNA browser simulation'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
