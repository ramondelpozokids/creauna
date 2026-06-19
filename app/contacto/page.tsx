'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { toast } from 'sonner';
import { ShieldCheck, Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-20 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12 items-start mt-6">
          
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">Hablemos de tu proyecto</h1>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">
              Ya sea una web a medida, modernización de tu web actual o un proyecto especial, estamos aquí para ayudarte.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Nombre completo</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    required 
                    className="w-full border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-2xl px-5 py-3.5 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Correo electrónico</label>
                  <input 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    required 
                    className="w-full border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-2xl px-5 py-3.5 focus:outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Teléfono (opcional)</label>
                <input 
                  type="tel" 
                  value={form.phone} 
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-2xl px-5 py-3.5 focus:outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">¿Qué tipo de proyecto necesitas?</label>
                <select 
                  value={form.type} 
                  onChange={(e) => setForm({...form, type: e.target.value})}
                  className="w-full border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-2xl px-5 py-3.5 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="web-a-medida">Web a Medida (diseño exclusivo)</option>
                  <option value="modernizacion">Modernización de web antigua</option>
                  <option value="proyecto-especial">Proyecto especial / Agencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Cuéntanos tu proyecto</label>
                <textarea 
                  value={form.message} 
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  required
                  rows={6}
                  className="w-full border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-[1.5rem] px-5 py-4 resize-y focus:outline-none transition-colors"
                  placeholder="Describe lo que tienes en mente, el sector, objetivos, estilo que te gusta..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-gradient w-full py-4.5 rounded-2xl text-base font-semibold disabled:opacity-70 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                {loading ? "Enviando..." : "Enviar solicitud"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-slate-500 font-medium">
                Te responderemos personalmente en menos de 24 horas.
              </p>
            </form>
          </div>

          {/* Info & Trust Column */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Ramón profile Card */}
            <div className="card-luxe bg-[#f8f7f4] border border-slate-200/80 p-8 rounded-[2.5rem] text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-xl mx-auto mb-5 transition-transform hover:scale-105 duration-300">
                <img 
                  src="/creador.webp" 
                  alt="Ramón del Pozo Rott" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="text-[10px] tracking-[3px] text-slate-500 font-bold uppercase">DIRECCIÓN DIRECTA</div>
              <h2 className="font-bold text-2xl tracking-tight text-slate-900 mt-1">Ramón del Pozo Rott</h2>
              <p className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                Fundador &amp; Director Creativo
              </p>
              
              <blockquote className="mt-6 text-slate-700 italic text-sm leading-relaxed border-t border-slate-200/60 pt-6">
                “En CREAUNA tratamos cada solicitud a medida de manera individualizada. Estudiaré tu caso y me pondré en contacto contigo personalmente en un plazo máximo de 24 horas.”
              </blockquote>
            </div>

            {/* Quick contact list */}
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-950">Información de Contacto</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border text-slate-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase">Email directo</div>
                    <a href="mailto:hola@creauna.com" className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors">hola@creauna.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border text-slate-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase">WhatsApp Business</div>
                    <a href="https://wa.me" target="_blank" className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors">Iniciar conversación</a>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 my-2" />

              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 rounded-2xl text-xs text-slate-500 border border-slate-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Protección SSL de nivel bancario activa
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
