'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { comoFuncionaI18n } from '../data/i18n/marketing';
import { Sparkles, ArrowUpRight, Play } from 'lucide-react';

export default function ComoFunciona() {
  const { lang } = useLanguage();
  const t = comoFuncionaI18n[lang];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            {t.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 mt-2 leading-[1.08] text-gradient">
            {t.title}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-xl mx-auto">{t.subtitle}</p>
          <Link
            href="/demo"
            className="mt-8 inline-flex items-center gap-2 btn-gradient px-8 py-3.5 rounded-2xl text-sm font-semibold shadow-md"
          >
            <Play className="w-4 h-4" />
            {lang === 'es' ? 'Ver demo interactiva' : 'Watch interactive demo'}
          </Link>
        </div>
      </div>

      <div className="container py-16 border-t border-slate-200">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <div className="text-xs font-bold tracking-widest text-indigo-600 mb-2">{t.step1Label}</div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950">{t.step1Title}</h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">{t.step1Text}</p>
            <div className="mt-6 bg-white p-6 rounded-3xl text-slate-700 border border-slate-200 shadow-sm leading-relaxed text-sm italic">
              {t.step1Example}
            </div>
          </div>
          <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-lg relative bg-white p-2">
            <img src="/inteligencia.webp" alt={t.step1Title} className="w-full h-[320px] object-cover rounded-[2rem]" />
          </div>
        </div>
      </div>

      <div className="bg-white py-20 border-y border-slate-200">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="order-2 md:order-1 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-lg relative bg-white p-2">
              <img src="/mockup.webp" alt={t.step2Title} className="w-full h-[320px] object-cover rounded-[2rem]" />
            </div>
            <div className="order-1 md:order-2">
              <div className="text-xs font-bold tracking-widest text-indigo-600 mb-2">{t.step2Label}</div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-950">{t.step2Title}</h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">{t.step2Text}</p>
              <ul className="mt-6 space-y-3.5 text-sm text-slate-700 font-medium">
                {t.step2Items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-slate-500 font-semibold tracking-wide">{t.step2Note}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <div className="text-xs font-bold tracking-widest text-indigo-600 mb-2">{t.step3Label}</div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950">{t.step3Title}</h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">{t.step3Text}</p>
            <div className="mt-6 space-y-4 text-sm text-slate-700 font-semibold">
              {t.step3Items.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <ArrowUpRight className="w-5 h-5 text-indigo-600" />
                  {item}
                </div>
              ))}
            </div>
            <Link href="/guia#entrega" className="mt-6 inline-flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-800">
              {t.step3Link} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative rounded-[2.5rem] overflow-hidden h-[340px] flex items-end shadow-xl border border-slate-200">
            <img src="/futuro.webp" alt={t.step3Title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="relative p-8 text-white">
              <h3 className="text-2xl font-bold tracking-tight">{t.step3CardTitle}</h3>
              <p className="mt-2 text-white/80 text-xs font-medium">{t.step3CardText}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-16 text-center bg-white">
        <h3 className="text-2xl font-bold tracking-tight mb-3">{t.ctaTitle}</h3>
        <p className="text-sm text-slate-500 mb-6">
          {lang === 'es' ? 'Consulta la ' : 'Check the '}
          <Link href="/guia" className="text-indigo-600 font-semibold hover:underline">{lang === 'es' ? 'guía completa' : 'full guide'}</Link>
          {lang === 'es' ? ' si necesitas más detalle.' : ' if you need more detail.'}
        </p>
        <Link href="/studio" className="btn-gradient px-12 py-4 rounded-2xl text-base font-semibold inline-block shadow-md">
          {t.ctaButton}
        </Link>
      </div>
    </div>
  );
}
