'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLanguage } from '../components/LanguageProvider';
import { guiaI18n } from '../data/i18n/guia';
import { BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function GuiaCompleta() {
  const { lang } = useLanguage();
  const t = guiaI18n[lang];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      <div className="container pt-20 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            {t.badge}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-950 leading-[1.08]">
            {t.title}
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-12 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="font-bold text-lg text-slate-950 mb-4">{t.indexTitle}</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {t.sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
              >
                <s.icon className="w-4 h-4 text-indigo-600 shrink-0" />
                {s.title}
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-4xl pb-24 space-y-16">
        {t.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-2xl ${section.color.split(' ')[1]} flex items-center justify-center`}>
                <section.icon className={`w-5 h-5 ${section.color.split(' ')[0]}`} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">{section.title}</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 text-slate-700 leading-relaxed">
              {section.note && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
                  {section.note}
                </div>
              )}
              {section.paragraphs?.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/Studio/g, '<strong>Studio</strong>').replace(/Modernización|Modernization/g, '<strong>$&</strong>').replace(/Web a Medida|Custom Web/g, '<strong>$&</strong>').replace(/1 crédito|1 credit/g, '<strong>$&</strong>').replace(/Stripe/g, '<strong>Stripe</strong>') }} />
              ))}
              {section.steps && (
                <ol className="space-y-3 list-none">
                  {section.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}
              {section.categories && (
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  {section.categories.map((cat) => (
                    <div key={cat} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                      {cat}
                    </div>
                  ))}
                </div>
              )}
              {section.plans && (
                <div className="grid sm:grid-cols-3 gap-4">
                  {section.plans.map((p) => (
                    <div key={p.plan} className="border border-slate-200 rounded-2xl p-4 text-center">
                      <div className="font-bold text-slate-950">{p.plan}</div>
                      <div className="text-2xl font-bold text-indigo-600 mt-1">{p.price}</div>
                      <div className="text-xs text-slate-500 mt-1">{p.credits}</div>
                    </div>
                  ))}
                </div>
              )}
              {section.list && (
                <ul className="space-y-2 text-sm">
                  {section.list.map((q) => (
                    <li key={q} className="flex gap-2 p-3 bg-slate-50 rounded-xl">
                      <span className="text-emerald-600">→</span> {q}
                    </li>
                  ))}
                </ul>
              )}
              {section.helpCards && (
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {section.helpCards.map((card) => (
                    <div key={card.title} className="p-4 bg-slate-50 rounded-2xl">
                      <div className="font-semibold text-slate-950">{card.title}</div>
                      <p className="mt-1 text-slate-600">{card.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {section.example && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm italic text-slate-600">
                  {section.example}
                </div>
              )}
              {section.cta && (
                <Link href={section.cta.href} className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-2xl text-sm font-semibold">
                  {section.cta.label} <ChevronRight className="w-4 h-4" />
                </Link>
              )}
              {section.link && (
                <Link href={section.link.href} className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-800">
                  {section.link.label} <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </section>
        ))}

        <div className="text-center bg-slate-900 text-white rounded-3xl p-10 md:p-14">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{t.ctaTitle}</h3>
          <p className="mt-3 text-slate-400 max-w-md mx-auto text-sm">{t.ctaText}</p>
          <Link href="/studio" className="mt-6 inline-block btn-gradient px-10 py-4 rounded-2xl text-base font-semibold shadow-lg">
            {t.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
