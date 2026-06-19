'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success("¡Bienvenido de nuevo!");
      window.location.href = '/dashboard';
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl overflow-hidden ring-1 ring-slate-200">
              <img 
                src="/images/luxury-jewelry-atelier-elegant-interior--3.jpg" 
                alt="CREAUNA" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="font-semibold text-3xl tracking-tight text-slate-900">CREAUNA</span>
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight mb-1">Bienvenido de nuevo</h1>
          <p className="text-slate-600 mb-8">Inicia sesión para continuar creando.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="tu@empresa.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-slate-900" /> Recordarme
              </label>
              <Link href="#" className="text-slate-600 hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-medium disabled:opacity-70 mt-2"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">O</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button className="w-full py-3 rounded-2xl border border-slate-200 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50">
            Continuar con Google
          </button>

          <p className="mt-8 text-center text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/signup" className="font-medium text-slate-900 hover:underline">Crea una gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
