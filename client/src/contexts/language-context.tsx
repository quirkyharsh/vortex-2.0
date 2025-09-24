import React, { createContext, useContext, useState, useEffect } from 'react';
import translations, { type SupportedLanguage, type Translations } from '@/lib/i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // Get from localStorage or default to English
    const saved = localStorage.getItem('ui-language') as SupportedLanguage;
    const supportedLanguages: SupportedLanguage[] = ['en', 'hi', 'mr', 'ta', 'kn', 'te', 'ml'];
    return supportedLanguages.includes(saved) ? saved : 'en';
  });

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    localStorage.setItem('ui-language', newLanguage);
  };

  const t = translations[language];

  useEffect(() => {
    // Set document lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}