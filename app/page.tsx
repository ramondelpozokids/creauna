'use client';

import Link from 'next/link';
import PremiumNavbar from './components/PremiumNavbar';
import { useLanguage } from './components/LanguageProvider';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const translations = {
  es: {
    heroTag: "Elegancia • Rapidez • Calidad",
    heroTitle: "Convierte una idea en una web profesional en minutos.",
    heroSubtitle:
      "CREAUNA coordina un equipo de inteligencia artificial especializado en diseño, desarrollo, contenido y optimización para crear webs de nivel agencia desde una simple conversación.",
    ctaStudio: "Crear mi web gratis",
    ctaDemo: "Ver una demostración",
    heroFooter: "Sin tarjeta • En español • Listo para publicar",
    diff: {
      tag: "POR QUÉ CREAUNA",
      title: "Transformamos ideas en negocios digitales.",
      subtitle:
        "Escribe tu idea y obtén una web profesional lista para publicar. Sin meses de espera ni procesos opacos.",
      card1Title: "Diseño profesional",
      card1Desc:
        "Tipografía, composición y detalle cuidados. Una presencia digital que transmite confianza desde el primer vistazo.",
      card2Title: "Listo en minutos",
      card2Desc:
        "Crea, refina y publica sin ciclos de desarrollo interminables. Tu negocio digital, operativo cuando lo necesitas.",
      card3Title: "Resultados que importan",
      card3Desc:
        "Más confianza, mejor conversión y una web que representa tu marca con claridad. Eso es lo que buscamos.",
    },
    aiTeam: {
      tag: "CÓMO LO HACEMOS",
      title: "Una plataforma que coordina especialistas por ti",
      desc: "CREAUNA no es una agencia: es una plataforma de IA que orquesta agentes especializados en diseño, contenido, código y optimización. Cada uno aporta lo suyo; tú obtienes un resultado completo y coherente.",
      feature1: "Diseño visual y estructura profesional",
      feature2: "Contenido y copy orientado a conversión",
      feature3: "Código limpio y rendimiento real",
      feature4: "UX pensada para tu negocio",
    },
    templatesSection: {
      catalogTag: "CATÁLOGO SELECCIONADO",
      title: "Plantillas profesionales",
      subtitle: "Elige un punto de partida y conviértelo en tu negocio digital en minutos.",
      viewMore: "Ver catálogo completo →",
      atelierCat: "Joyería & Lujo",
      vesperCat: "Arquitectura & Diseño",
      sableCat: "Restaurantes & Gastronomía",
    },
    future: {
      tag: "MÁS SIMPLE, MÁS CLARO",
      title: "Tu web profesional, sin la complejidad de siempre",
      desc: "Olvídate de presupuestos opacos y plazos interminables. CREAUNA simplifica el camino: de la idea a una web lista para publicar, con calidad y criterio en cada paso.",
      processLink: "Ver demo interactiva en 3 pasos",
    },
    founder: {
      tag: "UNA VISIÓN PERSONAL",
      supervisedBy: "Supervisado por Ramón del Pozo Rott",
      quote:
        "“Una buena presencia digital ya no debería costar meses ni fortunas. Ahora cualquiera con una idea clara puede tenerla online con calidad real.”",
      creativeSupervisor: "Supervisor Creativo de CREAUNA",
    },
    ctaSection: {
      title: "Tu idea merece estar online. Empieza hoy.",
      button: "Crear mi web gratis",
      signature: "Supervisado por Ramón del Pozo Rott",
    },
  },
  en: {
    heroTag: "Elegance • Speed • Quality",
    heroTitle: "Turn an idea into a professional website in minutes.",
    heroSubtitle:
      "CREAUNA coordinates a specialized AI team for design, development, content, and optimization—to build agency-grade websites from a simple conversation.",
    ctaStudio: "Create my website free",
    ctaDemo: "Watch a demo",
    heroFooter: "No card required • English & Spanish • Ready to publish",
    diff: {
      tag: "WHY CREAUNA",
      title: "We turn ideas into digital businesses.",
      subtitle:
        "Describe your idea and get a professional website ready to publish. No months of waiting, no opaque processes.",
      card1Title: "Professional design",
      card1Desc:
        "Typography, layout, and thoughtful detail. A digital presence that builds trust from the first glance.",
      card2Title: "Ready in minutes",
      card2Desc:
        "Create, refine, and publish without endless development cycles. Your digital business, live when you need it.",
      card3Title: "Results that matter",
      card3Desc:
        "More trust, better conversion, and a site that represents your brand clearly. That is what we aim for.",
    },
    aiTeam: {
      tag: "HOW IT WORKS",
      title: "A platform that coordinates specialists for you",
      desc: "CREAUNA is not an agency: it is an AI platform that orchestrates specialized agents for design, content, code, and optimization. Each contributes its strength; you get a complete, coherent result.",
      feature1: "Visual design and professional structure",
      feature2: "Content and conversion-focused copy",
      feature3: "Clean code and real performance",
      feature4: "UX built around your business",
    },
    templatesSection: {
      catalogTag: "SELECTED CATALOG",
      title: "Professional templates",
      subtitle: "Pick a starting point and turn it into your digital business in minutes.",
      viewMore: "View full catalog →",
      atelierCat: "Jewelry & Luxury",
      vesperCat: "Architecture & Design",
      sableCat: "Gastronomy & Restaurants",
    },
    future: {
      tag: "SIMPLER, CLEARER",
      title: "Your professional website, without the usual complexity",
      desc: "Forget opaque quotes and endless timelines. CREAUNA shortens the path: from idea to a publish-ready site, with quality and judgment at every step.",
      processLink: "Watch the interactive 3-step demo",
    },
    founder: {
      tag: "A PERSONAL VISION",
      supervisedBy: "Supervised by Ramón del Pozo Rott",
      quote:
        "“A strong digital presence should not take months or cost a fortune. Anyone with a clear idea can now be online with real quality.”",
      creativeSupervisor: "Creative Supervisor at CREAUNA",
    },
    ctaSection: {
      title: "Your idea deserves to be online. Start today.",
      button: "Create my website free",
      signature: "Supervised by Ramón del Pozo Rott",
    },
  },
};

export default function CreaunaLanding() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-900 font-sans antialiased overflow-x-hidden">
      <PremiumNavbar />

      {/* Spectacular Hero */}
      <section className="colorful-hero pt-28 pb-24 text-white relative">
        <div className="container text-center relative z-10 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
            {t.heroTag}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.05] max-w-5xl mx-auto"
            style={{ letterSpacing: '-0.04em' }}
          >
            {t.heroTitle}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto mt-8 text-lg md:text-xl text-white/90 leading-relaxed font-normal"
          >
            {t.heroSubtitle}
          </motion.p>

          {/* Hero browser mockup preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 100, delay: 0.3 }}
            className="mt-16 max-w-5xl mx-auto relative px-4"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md p-1 pb-0">
              {/* Browser bar */}
              <div className="h-10 border-b border-white/10 flex items-center px-5 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
                </div>
                <div className="bg-white/10 text-[10px] font-mono px-6 py-0.5 rounded-md text-white/60 select-none">
                  studio.creauna.com
                </div>
                <div className="w-16" />
              </div>
              <img 
                src="/hero.webp" 
                alt="CREAUNA Studio Interface" 
                className="w-full h-[320px] md:h-[500px] object-cover object-top hover:scale-[1.005] transition-transform duration-700" 
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 flex flex-col md:flex-row justify-center items-center gap-4"
          >
            <Link 
              href="/studio" 
              className="btn-gradient w-full md:w-auto px-10 py-4 rounded-2xl text-base font-semibold inline-flex items-center justify-center gap-3 shadow-lg"
            >
              {t.ctaStudio}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/demo" 
              className="w-full md:w-auto px-10 py-4 rounded-2xl border border-white/30 hover:bg-white/10 text-base font-medium transition text-center"
            >
              {t.ctaDemo}
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-5 text-[11px] text-white/60 tracking-wider uppercase font-semibold"
          >
            {t.heroFooter}
          </motion.div>
        </div>

        {/* Diagonal cut design */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50/50 clip-path-diagonal" />
      </section>

      {/* Why we're different - Card Deck */}
      <section className="container py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="text-xs font-bold tracking-[3px] text-indigo-600 uppercase mb-2">
            {t.diff.tag}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight">
            {t.diff.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            {t.diff.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: t.diff.card1Title, desc: t.diff.card1Desc, icon: Sparkles },
            { title: t.diff.card2Title, desc: t.diff.card2Desc, icon: Zap },
            { title: t.diff.card3Title, desc: t.diff.card3Desc, icon: Heart },
          ].map((item, i) => (
            <div key={i} className="card-luxe p-8 rounded-3xl border border-slate-200 bg-white">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-2xl tracking-tight text-slate-950 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Revolutionary AI Tech Section (New Premium Section) */}
      <section className="bg-white border-y border-slate-200 py-24">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Visual asset */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 bg-slate-50">
                <img 
                  src="/inteligencia.webp" 
                  alt="CREAUNA AI Intelligence Matrix" 
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>

            {/* AI description */}
            <div className="lg:col-span-7">
              <div className="text-xs font-bold tracking-[3px] text-indigo-600 uppercase mb-2">
                {t.aiTeam.tag}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight">
                {t.aiTeam.title}
              </h2>
              <p className="mt-6 text-slate-600 leading-relaxed text-base">
                {t.aiTeam.desc}
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-8">
                {[
                  t.aiTeam.feature1,
                  t.aiTeam.feature2,
                  t.aiTeam.feature3,
                  t.aiTeam.feature4
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="text-xs font-bold tracking-[3px] text-indigo-600 uppercase mb-2">
              {t.templatesSection.catalogTag}
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950">{t.templatesSection.title}</h2>
            <p className="text-slate-600 mt-2">{t.templatesSection.subtitle}</p>
          </div>
          <Link 
            href="/templates" 
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2 shrink-0 transition"
          >
            {t.templatesSection.viewMore}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { img: "/images/luxury-jewelry-atelier-elegant-interior--1.jpg", name: "Atelier", cat: t.templatesSection.atelierCat },
            { img: "/images/modern-architecture-minimalist-building--1.jpg", name: "Vesper", cat: t.templatesSection.vesperCat },
            { img: "/images/fine-dining-restaurant-interior-elegant--1.jpg", name: "Sable", cat: t.templatesSection.sableCat },
          ].map((t, i) => (
            <Link 
              key={i} 
              href="/templates" 
              className="card-luxe group block rounded-[2rem] overflow-hidden border border-slate-200 bg-white"
            >
              <div className="h-72 relative overflow-hidden">
                <img 
                  src={t.img} 
                  alt={t.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-2xl font-bold tracking-tight">{t.name}</div>
                  <div className="text-xs font-semibold opacity-85 mt-1.5 uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 w-fit">
                    {t.cat}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Future of web design Section (New Premium Section) */}
      <section className="bg-slate-950 text-white py-24 relative overflow-hidden border-t border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-700/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-rose-700/20 blur-[100px] pointer-events-none" />

        <div className="container max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="text-xs font-bold tracking-[3px] text-indigo-400 uppercase mb-2">
                {t.future.tag}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                {t.future.title}
              </h2>
              <p className="mt-6 text-slate-300 leading-relaxed text-base max-w-xl">
                {t.future.desc}
              </p>
              
              <div className="mt-8">
                <Link 
                  href="/demo" 
                  className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition"
                >
                  {t.future.processLink}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/60">
                <img 
                  src="/futuro.webp" 
                  alt="CREAUNA Future Web Builder Mockup" 
                  className="w-full h-[320px] object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Signature & Quote - Ultra Premium */}
      <section className="bg-slate-50 border-b border-slate-200 py-24">
        <div className="container max-w-4xl text-center px-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-xl transition-transform hover:scale-105 duration-300">
              <img 
                src="/creador.webp" 
                alt="Ramón del Pozo Rott" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          <div className="text-xs tracking-[3px] font-bold text-slate-500 uppercase">
            {t.founder.supervisedBy}
          </div>
          <p className="mt-6 text-2xl md:text-3xl font-medium tracking-tight text-slate-800 leading-snug italic">
            {t.founder.quote}
          </p>
          <div className="mt-8">
            <div className="text-sm font-medium text-slate-700">
              Ramón del Pozo Rott
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              {t.founder.creativeSupervisor}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-24 text-center">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-950 max-w-3xl mx-auto leading-tight">
          {t.ctaSection.title}
        </h2>
        <div className="mt-10">
          <Link 
            href="/studio" 
            className="inline-block btn-gradient px-14 py-4.5 rounded-2xl text-lg font-semibold shadow-xl"
          >
            {t.ctaSection.button}
          </Link>
        </div>
        <div className="mt-4 text-xs text-slate-500 font-semibold tracking-wide uppercase">
          {t.ctaSection.signature}
        </div>
      </section>
    </div>
  );
}
