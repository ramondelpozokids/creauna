'use client';

import { useLanguage } from './LanguageProvider';

export default function LegalLangNotice() {
  const { lang } = useLanguage();
  if (lang === 'es') return null;

  return (
    <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm text-indigo-900">
      This legal document is provided in Spanish as required for the Spanish market. For assistance in English, contact{' '}
      <a href="mailto:info@ramondelpozorott.es" className="font-semibold underline">info@ramondelpozorott.es</a>.
    </div>
  );
}
