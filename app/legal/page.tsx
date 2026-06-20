'use client';

import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { legalPageI18n, legalSectionsI18n } from '../data/i18n/legal';

export default function Legal() {
  const { lang } = useLanguage();
  const t = legalPageI18n[lang];
  const sections = legalSectionsI18n[lang].legal;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container max-w-4xl py-16">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">{t.legalTitle}</h1>
          <p className="mt-2 text-slate-500">{t.legalUpdated}</p>
        </div>
        <div className="prose max-w-none mt-12 text-slate-700 text-[15px] leading-relaxed space-y-8">
          {sections.map((s) => (
            <div key={s.h}>
              <h3 className="font-semibold text-xl text-slate-900">{s.h}</h3>
              <p className="mt-2">{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
