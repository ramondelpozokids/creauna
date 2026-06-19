'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { toast } from 'sonner';

export default function Contacto() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'web-a-medida',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Solicitud enviada correctamente", {
        description: "Ramón del Pozo Rott te contactará en menos de 24h."
      });
      setForm({ name: '', email: '', phone: '', type: 'web-a-medida', message: '' });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container pt-16 pb-20 max-w-2xl">
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight">Hablemos de tu proyecto</h1>
          <p className="mt-4 text-xl text-slate-600">
            Ya sea una web a medida, modernización de tu web actual o un proyecto especial, estamos aquí para ayudarte.
          </p>
        </div>

        {/* Visual premium con imagen local */}
        <div className="mt-10 relative rounded-3xl overflow-hidden h-64">
          <img 
            src="/images/modern-architecture-minimalist-building--1.jpg" 
            alt="Espacio de trabajo CREAUNA" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="text-sm tracking-wider opacity-75">FUNDADO POR RAMÓN DEL POZO ROTT</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre completo</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})}
                required 
                className="w-full border border-slate-200 rounded-2xl px-5 py-3.5" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Correo electrónico</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})}
                required 
                className="w-full border border-slate-200 rounded-2xl px-5 py-3.5" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Teléfono (opcional)</label>
            <input 
              type="tel" 
              value={form.phone} 
              onChange={(e) => setForm({...form, phone: e.target.value})}
              className="w-full border border-slate-200 rounded-2xl px-5 py-3.5" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">¿Qué tipo de proyecto necesitas?</label>
            <select 
              value={form.type} 
              onChange={(e) => setForm({...form, type: e.target.value})}
              className="w-full border border-slate-200 rounded-2xl px-5 py-3.5"
            >
              <option value="web-a-medida">Web a Medida (diseño exclusivo)</option>
              <option value="modernizacion">Modernización de web antigua</option>
              <option value="proyecto-especial">Proyecto especial / Agencia</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cuéntanos tu proyecto</label>
            <textarea 
              value={form.message} 
              onChange={(e) => setForm({...form, message: e.target.value})}
              required
              rows={6}
              className="w-full border border-slate-200 rounded-3xl px-5 py-4 resize-y"
              placeholder="Describe lo que tienes en mente, el sector, objetivos, estilo que te gusta..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-gradient w-full py-4 rounded-2xl text-lg font-semibold disabled:opacity-70"
          >
            {loading ? "Enviando..." : "Enviar solicitud"}
          </button>

          <p className="text-center text-xs text-slate-500">
            Te responderemos personalmente en menos de 24 horas.
          </p>
        </form>
      </div>
    </div>
  );
}
