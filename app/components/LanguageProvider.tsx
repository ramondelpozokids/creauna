'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navbar
    'nav.how': 'Cómo funciona',
    'nav.templates': 'Plantillas',
    'nav.pricing': 'Precios',
    'nav.custom': 'Web a Medida',
    'nav.modernize': 'Modernización',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contacto',
    'nav.studio': 'Abrir Studio',
    'nav.login': 'Iniciar sesión',

    // Hero
    'hero.title': 'Webs que enamoran.',
    'hero.subtitle': 'Diseño de nivel agencia con tecnología avanzada en minutos.',
    'cta.open': 'Abrir Studio Gratis',
    'cta.templates': 'Ver plantillas',

    // Common
    'common.start': 'Empezar gratis',
    'common.contact': 'Contactar',
  },
  en: {
    // Navbar
    'nav.how': 'How it works',
    'nav.templates': 'Templates',
    'nav.pricing': 'Pricing',
    'nav.custom': 'Custom Web',
    'nav.modernize': 'Modernization',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.studio': 'Open Studio',
    'nav.login': 'Log in',

    // Hero
    'hero.title': 'Websites that captivate.',
    'hero.subtitle': 'Agency-level design powered by advanced technology in minutes.',
    'cta.open': 'Open Studio for Free',
    'cta.templates': 'Browse templates',

    // Common
    'common.start': 'Start for free',
    'common.contact': 'Contact us',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('es');

  useEffect(() => {
    const saved = localStorage.getItem('creauna-lang') as Language | null;
    if (saved === 'es' || saved === 'en') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('creauna-lang', newLang);
    // Trigger re-render on other components
    window.dispatchEvent(new CustomEvent('creauna-language-change', { detail: newLang }));
  };

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return { 
      lang: 'es' as Language, 
      setLang: () => {}, 
      t: (key: string) => key 
    };
  }
  return context;
}
