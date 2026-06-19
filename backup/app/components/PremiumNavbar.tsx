'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function PremiumNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-2xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-rose-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-2xl text-slate-900">CREAUNA</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
          <Link href="/equipo-ias" className="hover:text-slate-900">Equipo de IAs</Link>
          <Link href="/templates" className="hover:text-slate-900">Plantillas</Link>
          <Link href="/precios" className="hover:text-slate-900">Precios</Link>
          <Link href="/about" className="hover:text-slate-900">Nosotros</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm px-4 py-2 font-medium">Iniciar sesión</Link>
          <Link href="/studio" className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-medium hover:bg-black">Abrir Studio</Link>
          <Link href="/superadmin" className="text-xs px-3 py-1.5 border rounded-xl">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
