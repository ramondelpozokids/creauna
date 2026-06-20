'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar');
      toast.success("¡Cuenta creada con éxito!");
      window.location.href = '/dashboard';
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl overflow-hidden ring-1 ring-slate-200">
              <img 
                src="/images/logo.png" 
                alt="CREAUNA Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="font-semibold text-3xl tracking-tight text-slate-900">CREAUNA</span>
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight mb-1">Crea tu cuenta</h1>
          <p className="text-slate-600 mb-8">Empieza a crear webs increíbles hoy mismo.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Nombre completo</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-slate-200 rounded-2xl px-4 py-3" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Empresa</label>
                <input name="company" value={form.company} onChange={handleChange} className="w-full border border-slate-200 rounded-2xl px-4 py-3" placeholder="Tu empresa" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Correo electrónico</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border border-slate-200 rounded-2xl px-4 py-3" placeholder="tu@empresa.com" />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} className="w-full border border-slate-200 rounded-2xl px-4 py-3" placeholder="Crea una contraseña" />
              <p className="text-xs text-slate-500 mt-1">Mínimo 8 caracteres</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-medium mt-2 disabled:opacity-70"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
            </button>
          </form>

          <p className="text-xs text-slate-500 mt-6 text-center">
            Al crear una cuenta aceptas nuestros Términos y Política de Privacidad.
          </p>

          <p className="mt-6 text-center text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-slate-900 hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
