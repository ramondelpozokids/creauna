'use client';

import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { equipoI18n } from '../data/i18n/secondary';

export default function EquipoIAs() {
  const { lang } = useLanguage();
  const t = equipoI18n[lang];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container pt-16 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm font-medium text-indigo-600">{t.badge}</div>
          <h1 className="text-6xl font-semibold tracking-tight mt-3">{t.title}</h1>
          <p className="mt-6 text-xl text-slate-600">{t.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {t.motores.map((motor, index) => (
            <div key={motor.name} className="premium-card p-8 rounded-3xl border">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.colors[index]} mb-6`} />
              <div className="font-semibold text-2xl">{motor.name}</div>
              <div className="text-sm text-indigo-600 font-medium mt-1">{motor.role}</div>
              <p className="mt-4 text-slate-600">{motor.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center bg-slate-50 rounded-3xl p-12">
          <div className="text-2xl font-medium">{t.quote}</div>
          <div className="mt-6 text-sm text-slate-500">{t.quoteAuthor}</div>
        </div>
      </div>
    </div>
  );
}
