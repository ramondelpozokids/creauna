'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { contactoI18n } from '../data/i18n/marketing';
import { toast } from 'sonner';
import { ShieldCheck, Mail, MessageSquare, ArrowRight } from 'lucide-react';

export default function Contacto() {
  const { lang } = useLanguage();
  const t = contactoI18n[lang];

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'web-a-medida',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.toastError);

      toast.success(t.toastSuccess, { description: t.toastSuccessDesc });
      setForm({ name: '', email: '', phone: '', type: 'web-a-medida', message: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.toastError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-20 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12 items-start mt-6">
          <div className="lg:col-span-7 bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950">{t.title}</h1>
            <p className="mt-4 text-slate-600 text-base leading-relaxed">{t.subtitle}</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">{t.name}</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required
                    className="w-full border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-2xl px-5 py-3.5 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">{t.email}</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required
                    className="w-full border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-2xl px-5 py-3.5 focus:outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">{t.phone}</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-2xl px-5 py-3.5 focus:outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">{t.type}</label>
                <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}
                  className="w-full border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-2xl px-5 py-3.5 focus:outline-none transition-colors cursor-pointer">
                  {(Object.keys(t.types) as Array<keyof typeof t.types>).map((key) => (
                    <option key={key} value={key}>{t.types[key]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">{t.message}</label>
                <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} required rows={6}
                  className="w-full border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-[1.5rem] px-5 py-4 resize-y focus:outline-none transition-colors"
                  placeholder={t.messagePlaceholder} />
              </div>

              <button type="submit" disabled={loading}
                className="btn-gradient w-full py-4.5 rounded-2xl text-base font-semibold disabled:opacity-70 cursor-pointer shadow-md flex items-center justify-center gap-2">
                {loading ? t.sending : t.submit}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-slate-500 font-medium">{t.footer}</p>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="card-luxe bg-[#f8f7f4] border border-slate-200/80 p-8 rounded-[2.5rem] text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-xl mx-auto mb-4 transition-transform hover:scale-105 duration-300">
                <img src="/creador.webp" alt="Ramón del Pozo Rott" className="w-full h-full object-cover" />
              </div>
              <div className="text-[10px] tracking-[3px] text-slate-500 font-bold uppercase">{t.supervised}</div>
              <h2 className="font-medium text-sm tracking-tight text-slate-700 mt-1">Ramón del Pozo Rott</h2>
              <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                {t.supervisor}
              </p>
              <blockquote className="mt-6 text-slate-700 italic text-sm leading-relaxed border-t border-slate-200/60 pt-6">
                {t.quote}
              </blockquote>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-950">{t.contactInfo}</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border text-slate-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase">{t.emailDirect}</div>
                    <a href="mailto:info@ramondelpozorott.es" className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors">info@ramondelpozorott.es</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border text-slate-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase">{t.whatsapp}</div>
                    <a href="https://wa.me/34656398640" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors">+34 656 398 640</a>
                    <p className="text-xs text-slate-500 mt-0.5">{t.whatsappNote}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
