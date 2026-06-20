'use client';

import { useEffect } from 'react';
import { useLanguage } from './LanguageProvider';

export default function HtmlLangSync() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
