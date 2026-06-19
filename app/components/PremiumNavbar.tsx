'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { Sparkles } from 'lucide-react';

export default function PremiumNavbar() {
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-2xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl overflow-hidden ring-1 ring-slate-200">
              <img 
                src="/images/luxury-jewelry-atelier-elegant-interior--2.jpg" 
                alt="CREAUNA" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="font-semibold tracking-tight text-2xl text-slate-900">CREAUNA</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
          <Link href="/como-funciona" className="hover:text-slate-900">{t('nav.how')}</Link>
          <Link href="/templates" className="hover:text-slate-900">{t('nav.templates')}</Link>
          <Link href="/precios" className="hover:text-slate-900">{t('nav.pricing')}</Link>
          <Link href="/web-a-medida" className="hover:text-slate-900">{t('nav.custom')}</Link>
          <Link href="/modernizacion" className="hover:text-slate-900">{t('nav.modernize')}</Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher - Fully functional */}
          <div className="flex items-center border border-slate-200 rounded-2xl text-xs bg-white">
            <button 
              onClick={() => setLang('es')} 
              className={`px-3 py-1.5 rounded-2xl transition ${lang === 'es' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
            >
              ES
            </button>
            <button 
              onClick={() => setLang('en')} 
              className={`px-3 py-1.5 rounded-2xl transition ${lang === 'en' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
            >
              EN
            </button>
          </div>

          <Link href="/login" className="text-sm px-4 py-2 font-medium">{t('nav.login')}</Link>
          <Link href="/studio" className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-medium hover:bg-black">
            {t('nav.studio')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
