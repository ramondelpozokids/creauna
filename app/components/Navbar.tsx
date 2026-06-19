'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ variant = 'landing' }: { variant?: 'landing' | 'dashboard' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  if (variant === 'dashboard') {
    return (
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-2xl overflow-hidden ring-1 ring-slate-200/50 shadow-sm transition-transform duration-500 group-hover:rotate-6">
              <img 
                src="/logo.webp" 
                alt="CREAUNA Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="font-semibold text-xl tracking-tight text-slate-900">CREAUNA</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              href="/studio" 
              className="text-sm font-medium px-4 py-2 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all"
            >
              Studio
            </Link>
            <Link 
              href="/templates" 
              className="text-sm font-medium px-4 py-2 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all"
            >
              Plantillas
            </Link>
            
            <div className="flex items-center gap-1 text-xs border border-slate-200 rounded-2xl p-1 bg-white">
              <button 
                onClick={() => setLang('es')} 
                className={`px-3 py-1 rounded-xl transition ${lang === 'es' ? 'bg-slate-900 text-white font-medium' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                ES
              </button>
              <button 
                onClick={() => setLang('en')} 
                className={`px-3 py-1 rounded-xl transition ${lang === 'en' ? 'bg-slate-900 text-white font-medium' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-slate-100 bg-white/90 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-2xl overflow-hidden ring-1 ring-slate-200/50 shadow-sm transition-transform duration-500 group-hover:rotate-6">
            <img 
              src="/logo.webp" 
              alt="CREAUNA Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="font-semibold text-2xl tracking-tight text-slate-900">CREAUNA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/como-funciona" className="hover:text-slate-950 transition-colors">
            {t('nav.how')}
          </Link>
          <Link href="/templates" className="hover:text-slate-950 transition-colors">
            {t('nav.templates')}
          </Link>
          <Link href="/precios" className="hover:text-slate-950 transition-colors">
            {t('nav.pricing')}
          </Link>
          <Link href="/web-a-medida" className="hover:text-slate-950 transition-colors">
            {t('nav.custom')}
          </Link>
          <Link href="/modernizacion" className="hover:text-slate-950 transition-colors">
            {t('nav.modernize')}
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
          >
            {t('nav.login')}
          </Link>
          <Link 
            href="/studio" 
            className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-sm font-medium hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            {t('nav.studio')}
          </Link>
          
          {/* Language Toggle */}
          <div className="flex items-center text-xs border border-slate-200 rounded-2xl p-1 bg-white ml-2">
            <button 
              onClick={() => setLang('es')} 
              className={`px-3 py-1 rounded-xl transition ${lang === 'es' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              ES
            </button>
            <button 
              onClick={() => setLang('en')} 
              className={`px-3 py-1 rounded-xl transition ${lang === 'en' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-700" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="container py-6 flex flex-col gap-5 text-base font-medium text-slate-700">
              <Link 
                href="/como-funciona" 
                onClick={() => setIsMenuOpen(false)}
                className="py-2 border-b border-slate-50 hover:text-slate-950 flex justify-between items-center"
              >
                {t('nav.how')} <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link 
                href="/templates" 
                onClick={() => setIsMenuOpen(false)}
                className="py-2 border-b border-slate-50 hover:text-slate-950 flex justify-between items-center"
              >
                {t('nav.templates')} <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link 
                href="/precios" 
                onClick={() => setIsMenuOpen(false)}
                className="py-2 border-b border-slate-50 hover:text-slate-950 flex justify-between items-center"
              >
                {t('nav.pricing')} <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link 
                href="/web-a-medida" 
                onClick={() => setIsMenuOpen(false)}
                className="py-2 border-b border-slate-50 hover:text-slate-950 flex justify-between items-center"
              >
                {t('nav.custom')} <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link 
                href="/modernizacion" 
                onClick={() => setIsMenuOpen(false)}
                className="py-2 border-b border-slate-50 hover:text-slate-950 flex justify-between items-center"
              >
                {t('nav.modernize')} <ArrowRight className="w-4 h-4 opacity-50" />
              </Link>
              
              <div className="flex flex-col gap-3 pt-4">
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  href="/studio" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center py-3.5 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {t('nav.studio')}
                </Link>
              </div>

              {/* Mobile Language selector */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500 font-normal">Idioma / Language</span>
                <div className="flex items-center text-xs border border-slate-200 rounded-2xl p-1 bg-white">
                  <button 
                    onClick={() => {
                      setLang('es');
                      setIsMenuOpen(false);
                    }} 
                    className={`px-4 py-1.5 rounded-xl transition ${lang === 'es' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-500'}`}
                  >
                    ES
                  </button>
                  <button 
                    onClick={() => {
                      setLang('en');
                      setIsMenuOpen(false);
                    }} 
                    className={`px-4 py-1.5 rounded-xl transition ${lang === 'en' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-500'}`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
