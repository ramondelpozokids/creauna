'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import FaqAccordion from '../components/FaqAccordion';
import { useLanguage } from '../components/LanguageProvider';
import { faqPageI18n } from '../data/i18n/faq';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function FaqPage() {
  const { lang } = useLanguage();
  const t = faqPageI18n[lang];

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-24 pb-20 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-white border border-stone-200 text-stone-600 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-5">
            {t.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">{t.title}</h1>
          <p className="mt-4 text-slate-600 text-base leading-relaxed max-w-xl mx-auto">{t.subtitle}</p>
        </div>

        <FaqAccordion items={t.items} variant="minimal" />

        <div className="mt-14 rounded-3xl border border-stone-200 bg-white p-8 md:p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">{t.contactCta}</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/contacto"
              className="btn-gradient px-8 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              {t.contactBtn}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/precios"
              className="px-8 py-3.5 rounded-2xl text-sm font-semibold border border-slate-200 bg-slate-50 hover:bg-white inline-flex items-center justify-center gap-2 transition-colors"
            >
              {t.pricingLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
