'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { aboutI18n } from '../data/i18n/secondary';

export default function About() {
  const { lang } = useLanguage();
  const t = aboutI18n[lang];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container pt-20 pb-16 max-w-5xl">
        <div className="max-w-3xl">
          <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-xs font-semibold tracking-wider mb-6">{t.badge}</div>
          <h1 className="text-7xl font-semibold tracking-tight leading-none">{t.title}</h1>
          <p className="mt-6 text-2xl text-slate-600">{t.subtitle}</p>
        </div>
      </div>

      <div className="bg-[#f8f7f4] py-20 border-y border-slate-200">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-12 gap-x-16 items-center">
            <div className="md:col-span-5">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
                <img src="/creador.webp" alt="Ramón del Pozo Rott" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/75" />
                <div className="absolute bottom-6 left-0 right-0 text-center text-white">
                  <div className="text-[10px] tracking-[3px] font-medium opacity-75">{t.supervised}</div>
                  <div className="text-sm font-medium tracking-tight mt-1">Ramón del Pozo Rott</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 mt-10 md:mt-0">
              <div className="max-w-[560px]">
                <div className="uppercase tracking-[3px] text-xs font-semibold text-slate-500">{t.behind}</div>
                <h2 className="mt-3 text-5xl font-semibold tracking-[-1.5px] leading-none">{t.headline}</h2>
                <div className="mt-8 text-[17px] leading-relaxed text-slate-700 space-y-6">
                  <p>{t.p1}</p>
                  <p><span className="font-medium text-slate-900">{t.p2q}</span></p>
                  <p>{t.p3}</p>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                  <div className="text-[10px] tracking-[2px] text-slate-500 uppercase">{lang === 'es' ? 'Supervisado por' : 'Supervised by'}</div>
                  <div className="text-sm font-medium text-slate-800 mt-1">Ramón del Pozo Rott</div>
                  <div className="text-xs text-slate-500">{t.supervisor}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-20 max-w-5xl">
        <div className="text-center mb-14">
          <div className="text-sm font-semibold tracking-[2px] text-indigo-600">{t.approach}</div>
          <h2 className="text-5xl font-semibold tracking-tight mt-3">{t.diffTitle}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {t.diff.map((item) => (
            <div key={item.title} className="p-8 border border-slate-200 rounded-3xl">
              <div className="text-3xl font-semibold tracking-tight">{item.title}</div>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 text-white py-20">
        <div className="container max-w-3xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight">{t.commitment}</h2>
          <p className="mt-6 text-xl text-white/80">{t.commitmentText}</p>
          <div className="mt-10">
            <Link href="/studio" className="inline-block px-10 py-4 rounded-3xl bg-white text-black font-semibold text-lg">{t.cta}</Link>
          </div>
        </div>
      </div>
      <div className="container py-16 text-center text-sm text-slate-500">{t.footer}</div>
    </div>
  );
}
