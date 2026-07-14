'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { getPremiumStarterBySlug } from '../data/premiumStarters';
import type { PremiumStarterPersonalization } from '../data/premiumStarters';

type Lang = 'es' | 'en';

const copy = {
  es: {
    title: 'Personaliza tu muestra',
    subtitle:
      'Partimos de una web profesional terminada. Solo necesitamos los datos de tu negocio — el diseño ya está listo.',
    businessName: 'Nombre del negocio',
    businessNamePh: 'Ej: Clínica Sonrisa / Hotel Mar Azul',
    subtitleField: 'Subtítulo del hero (opcional)',
    subtitlePh: 'Ej: Excelencia desde 2010',
    phone: 'Teléfono / WhatsApp',
    phonePh: 'Ej: 600 12 34 56',
    address: 'Dirección (opcional)',
    addressPh: 'Calle, número, ciudad…',
    tagline: 'Frase destacada (opcional)',
    taglinePh: 'Ej: "Tu bienestar, nuestra prioridad"',
    back: 'Volver',
    continue: 'Cargar mi web',
    hint: 'Después podrás cambiar textos, imágenes y secciones desde el chat.',
  },
  en: {
    title: 'Customize your sample',
    subtitle:
      'We start from a finished professional site. We only need your business details — the design is ready.',
    businessName: 'Business name',
    businessNamePh: 'E.g. Smile Clinic / Blue Sea Hotel',
    subtitleField: 'Hero subtitle (optional)',
    subtitlePh: 'E.g. Excellence since 2010',
    phone: 'Phone / WhatsApp',
    phonePh: 'E.g. 600 12 34 56',
    address: 'Address (optional)',
    addressPh: 'Street, number, city…',
    tagline: 'Featured quote (optional)',
    taglinePh: 'E.g. "Your wellbeing, our priority"',
    back: 'Back',
    continue: 'Load my site',
    hint: 'You can change copy, images and sections from the chat later.',
  },
} as const;

type Props = {
  lang: Lang;
  starterSlug: string;
  onBack: () => void;
  onComplete: (data: PremiumStarterPersonalization) => void;
};

export default function StudioPremiumStarterForm({ lang, starterSlug, onBack, onComplete }: Props) {
  const starter = getPremiumStarterBySlug(starterSlug);
  const t = copy[lang];
  const d = starter?.defaults;

  const [businessName, setBusinessName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [tagline, setTagline] = useState('');

  if (!starter) {
    return (
      <div className="p-8 text-center text-slate-600">
        {lang === 'es' ? 'Muestra no encontrada.' : 'Sample not found.'}
      </div>
    );
  }

  const canSubmit = businessName.trim().length >= 2;

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-8 md:p-14">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold tracking-[0.25em] text-amber-700 uppercase">
              {lang === 'es' ? 'Muestra premium' : 'Premium sample'}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">{starter.nameEs}</h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-8">{t.subtitle}</p>

        <div className="space-y-4 text-left">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.businessName}</span>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t.businessNamePh}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.subtitleField}</span>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder={subtitle || d?.subtitle || t.subtitlePh}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.phone}</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={phone || d?.phone || t.phonePh}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.address}</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={address || d?.address || t.addressPh}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.tagline}</span>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder={tagline || d?.tagline?.replace(/^"|"$/g, '') || t.taglinePh}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </label>
        </div>

        <p className="mt-6 text-xs text-slate-400">{t.hint}</p>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() =>
              onComplete({
                businessName: businessName.trim(),
                subtitle: subtitle.trim() || undefined,
                phone: phone.trim() || undefined,
                address: address.trim() || undefined,
                tagline: tagline.trim() ? `"${tagline.trim()}"` : undefined,
              })
            }
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {t.continue} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
