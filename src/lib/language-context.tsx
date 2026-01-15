"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import frMessages from '@/i18n/messages/fr.json';
import enMessages from '@/i18n/messages/en.json';

// ============================================
// CONFIGURATION DES LANGUES
// Pour ajouter une nouvelle langue :
// 1. Créer le fichier src/i18n/messages/[code].json
// 2. Importer le fichier ci-dessus
// 3. Ajouter l'entrée dans SUPPORTED_LANGUAGES
// 4. Ajouter l'entrée dans messagesMap
// ============================================

export interface Language {
  code: string;
  label: string;
  flag?: string;
}

// Liste des langues supportées
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  // Ajouter d'autres langues ici :
  // { code: 'es', label: 'Español', flag: '🇪🇸' },
  // { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  // { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  // { code: 'pt', label: 'Português', flag: '🇵🇹' },
  // { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  // { code: 'zh', label: '中文', flag: '🇨🇳' },
];

// Mapping des messages par code de langue
const messagesMap: Record<string, typeof frMessages> = {
  fr: frMessages,
  en: enMessages,
  // Ajouter les imports des autres langues ici :
  // es: esMessages,
  // de: deMessages,
};

// Langue par défaut
export const DEFAULT_LANGUAGE = 'fr';

// ============================================
// CONTEXTE
// ============================================

type Locale = string;
type Messages = typeof frMessages;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  languages: Language[];
  currentLanguage: Language;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof result === 'string' ? result : path;
}

function isValidLocale(locale: string): boolean {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === locale);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && isValidLocale(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    if (isValidLocale(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem('locale', newLocale);
    }
  };

  const t = (key: string): string => {
    const messages = messagesMap[locale] || messagesMap[DEFAULT_LANGUAGE];
    return getNestedValue(messages as unknown as Record<string, unknown>, key);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === locale)
    || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      locale,
      setLocale,
      t,
      languages: SUPPORTED_LANGUAGES,
      currentLanguage
    }}>
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
