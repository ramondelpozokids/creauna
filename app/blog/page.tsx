'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { blogI18n } from '../data/i18n/secondary';

export default function Blog() {
  const { lang } = useLanguage();
  const t = blogI18n[lang];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container pt-16 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm font-semibold tracking-[3px] text-indigo-600">{t.badge}</div>
          <h1 className="text-7xl font-semibold tracking-tight mt-4">{t.title}</h1>
          <p className="mt-4 text-2xl text-slate-600">{t.subtitle}</p>
        </div>
      </div>

      <div className="border-t">
        <div className="container py-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {t.articles.map((article, index) => (
              <Link key={index} href={`/blog/${index + 1}`}
                className="group block bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="relative h-80">
                  <img src={t.images[index]} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/95 text-xs font-semibold tracking-wider px-4 py-1 rounded-full">{article.category}</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime} {t.readTime}</span>
                  </div>
                  <h3 className="text-3xl font-semibold tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                  <p className="mt-4 text-lg text-slate-600 leading-relaxed">{article.excerpt}</p>
                  <div className="mt-6 text-sm font-medium text-indigo-600 flex items-center gap-1">
                    {t.readArticle} <span className="group-hover:translate-x-1 transition">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 text-white py-16">
        <div className="container text-center max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight">{t.newsletterTitle}</h2>
          <p className="mt-4 text-white/70">{t.newsletterText}</p>
          <div className="mt-8 flex justify-center">
            <Link href="/contacto" className="px-10 py-4 rounded-3xl bg-white text-black font-semibold">{t.newsletterCta}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
