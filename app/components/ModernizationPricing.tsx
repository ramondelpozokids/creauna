'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { modernizationPlans, modernizationPricingCopy } from '../data/modernizationPlans';

type Props = {
  showDemoLink?: boolean;
  id?: string;
};

export default function ModernizationPricing({ showDemoLink = true, id = 'modernizacion' }: Props) {
  const { lang } = useLanguage();
  const c = modernizationPricingCopy[lang];

  return (
    <section id={id} className="scroll-mt-24">
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold tracking-wider mb-3">
          {c.badge}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950">{c.title}</h2>
        <p className="text-slate-600 mt-2 text-sm max-w-xl mx-auto">{c.subtitle}</p>
        {showDemoLink && (
          <Link href="/modernizacion" className="inline-block mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            {c.demoLink}
          </Link>
        )}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {modernizationPlans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-6 flex flex-col border ${plan.color} shadow-sm`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] px-3 py-0.5 rounded-full font-bold tracking-wider">
                  {c.popular}
                </div>
              )}
              {plan.premium && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] px-3 py-0.5 rounded-full font-bold tracking-wider">
                  {c.premium}
                </div>
              )}
              <Icon className="w-8 h-8 text-indigo-600 mb-3" />
              <div className="font-bold text-lg">{lang === 'es' ? plan.nameEs : plan.nameEn}</div>
              <div className="text-xs text-slate-500 mt-0.5">{lang === 'es' ? plan.taglineEs : plan.taglineEn}</div>
              <div className="text-3xl font-bold tracking-tight mt-4 text-slate-900">
                {lang === 'es' ? plan.priceEs : plan.priceEn}
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed flex-1">
                {lang === 'es' ? plan.descEs : plan.descEn}
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                {(lang === 'es' ? plan.featuresEs : plan.featuresEn).map((f) => (
                  <li key={f} className="flex gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className="mt-5 block text-center py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-black transition"
              >
                {lang === 'es' ? plan.ctaEs : plan.ctaEn}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
