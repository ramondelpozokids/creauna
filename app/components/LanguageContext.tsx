'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    'nav.how': 'Cómo funciona',
    'nav.templates': 'Plantillas',
    'nav.pricing': 'Precios',
    'nav.custom': 'Web a Medida',
    'nav.modernize': 'Modernización',
    'nav.studio': 'Abrir Studio',
    'hero.title': 'Crea webs que enamoran.',
    'hero.subtitle': 'Diseño premium con tecnología avanzada en minutos.',
    'cta.open': 'Abrir Studio Gratis',
    'cta.see': 'Ver plantillas',
  },
  en: {
    'nav.how': 'How it works',
    'nav.templates': 'Templates',
    'nav.pricing': 'Pricing',
    'nav.custom': 'Custom Web',
    'nav.modernize': 'Modernization',
    'nav.studio': 'Open Studio',
    'hero.title': 'Create websites that captivate.',
    'hero.subtitle': 'Premium design powered by advanced technology in minutes.',
    'cta.open': 'Open Studio for Free',
    'cta.see': 'Browse templates',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('es');

  useEffect(() => {
    const saved = localStorage.getItem('creauna-lang') as Language;
    if (saved) setLangState(saved);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('creauna-lang', newLang);
  };

  const t = (key: string) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return { lang: 'es' as Language, setLang: () => {}, t: (k: string) => k };
  }
  return context;
}
