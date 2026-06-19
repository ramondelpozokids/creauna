'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ variant = 'landing' }: { variant?: 'landing' | 'dashboard' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<'es' | 'en'>('es');

  if (variant === 'dashboard') {
    return (
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">CREAUNA</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/studio" className="text-sm font-medium px-4 py-2 hover:bg-slate-100 rounded-2xl">Studio</Link>
            <Link href="/templates" className="text-sm font-medium px-4 py-2 hover:bg-slate-100 rounded-2xl">Plantillas</Link>
            
            <div className="flex items-center gap-2 text-sm border rounded-2xl px-1 py-1">
              <button onClick={() => setLang('es')} className={`px-3 py-1 rounded-xl ${lang === 'es' ? 'bg-slate-900 text-white' : ''}`}>ES</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-xl ${lang === 'en' ? 'bg-slate-900 text-white' : ''}`}>EN</button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur-lg sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="font-semibold text-xl tracking-tight">CREAUNA</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#como-funciona" className="hover:text-slate-900">Cómo funciona</a>
          <Link href="/templates" className="hover:text-slate-900">Plantillas</Link>
          <a href="#precios" className="hover:text-slate-900">Precios</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium px-4 py-2">Iniciar sesión</Link>
          <Link href="/studio" className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-sm font-medium">Abrir Studio</Link>
          
          <div className="flex items-center text-xs border rounded-2xl px-1 py-1 ml-2">
            <button onClick={() => setLang('es')} className={`px-2.5 py-1 rounded-xl ${lang === 'es' ? 'bg-slate-900 text-white' : ''}`}>ES</button>
            <button onClick={() => setLang('en')} className={`px-2.5 py-1 rounded-xl ${lang === 'en' ? 'bg-slate-900 text-white' : ''}`}>EN</button>
          </div>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
}
