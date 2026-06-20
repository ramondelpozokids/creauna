'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SuperAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [biometric, setBiometric] = useState(false);

  const handleBiometric = () => {
    setBiometric(true);
    setTimeout(() => {
      setAuthenticated(true);
      setBiometric(false);
    }, 1800);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="max-w-md text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/30 mb-6">
            <img 
              src="/creador.webp" 
              alt="Ramón del Pozo Rott" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className="text-3xl font-semibold">Acceso Superadmin</h1>
          <p className="text-slate-400 mt-2">Ramón del Pozo Rott</p>

          <div className="mt-10">
            <button 
              onClick={handleBiometric}
              disabled={biometric}
              className="w-full py-4 bg-white text-black rounded-2xl font-semibold flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {biometric ? "Escaneando huella..." : "🔓 Entrar con Huella / Biométrica"}
            </button>
            <p className="text-xs text-slate-500 mt-4">4 capas de seguridad activas</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-semibold text-2xl">CREAUNA</div>
            <div className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-full">SUPERADMIN</div>
          </div>
          <Link href="/" className="text-sm">Salir del panel</Link>
        </div>
      </div>

      <div className="container py-10">
        <h1 className="text-5xl font-semibold tracking-tight">Panel de Control — Ramón del Pozo Rott</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          {/* Analytics */}
          <div className="premium-card p-6 col-span-2">
            <div className="text-sm text-slate-500">ANALÍTICAS EN TIEMPO REAL</div>
            <div className="text-6xl font-semibold mt-2">47,892</div>
            <div className="text-emerald-600">+18% esta semana</div>
            
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              <div>Usuarios activos: <span className="font-semibold">8,421</span></div>
              <div>Webs creadas hoy: <span className="font-semibold">312</span></div>
              <div>Ingresos MRR: <span className="font-semibold">€124k</span></div>
            </div>
          </div>

          <div className="premium-card p-6">
            <div className="text-sm text-slate-500">PLANES ACTIVOS</div>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between"><span>Gratis</span><span className="font-medium">31,204</span></div>
              <div className="flex justify-between"><span>Pro</span><span className="font-medium">12,874</span></div>
              <div className="flex justify-between"><span>Business</span><span className="font-medium">3,814</span></div>
            </div>
          </div>

          <div className="premium-card p-6">
            <div className="text-sm text-slate-500">MOTORES DE IA</div>
            <div className="mt-6 space-y-3 text-sm">
              <div>✅ Motor Visual — Imágenes (98%)</div>
              <div>✅ Motor de Redacción — Textos (100%)</div>
              <div>✅ Motor de Código — Estructura (94%)</div>
              <div>✅ Motor de Experiencia — UX (99%)</div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="font-semibold text-xl mb-4">Acciones Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl">Actualizar precios</button>
            <button className="px-6 py-3 border rounded-2xl">Ver todas las webs</button>
            <button className="px-6 py-3 border rounded-2xl">Añadir nueva plantilla premium</button>
            <button className="px-6 py-3 border rounded-2xl">Gestionar tecnología IA</button>
          </div>
        </div>
      </div>
    </div>
  );
}
