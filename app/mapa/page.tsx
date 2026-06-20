'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { mapaI18n } from '../data/i18n/secondary';

export default function Mapa() {
  const { lang } = useLanguage();
  const t = mapaI18n[lang];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container max-w-2xl py-16">
        <h1 className="text-5xl font-semibold tracking-tight">{t.title}</h1>
        <div className="mt-10 grid grid-cols-2 gap-4">
          {t.links.map((link) => (
            <Link key={link.href} href={link.href} className="p-4 border rounded-2xl hover:bg-slate-50">{link.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
