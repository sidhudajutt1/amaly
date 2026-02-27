import { en, type TranslationKeys } from './locales/en';
import { ar } from './locales/ar';
import { ur } from './locales/ur';
import type { Language, LayoutDirection } from '../types';

const translations: Record<Language, TranslationKeys> = { en, ar, ur };

export function t(language: Language, path: string): string {
  const keys = path.split('.');
  let current: unknown = translations[language];
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      current = undefined;
      break;
    }
  }
  if (typeof current === 'string') return current;

  // Fallback to English
  let fallback: unknown = translations.en;
  for (const key of keys) {
    if (fallback && typeof fallback === 'object' && key in fallback) {
      fallback = (fallback as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof fallback === 'string' ? fallback : path;
}

export function getLayoutDirection(language: Language): LayoutDirection {
  return language === 'ar' || language === 'ur' ? 'rtl' : 'ltr';
}

export function isRTL(language: Language): boolean {
  return language === 'ar' || language === 'ur';
}

export const languageNames: Record<Language, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  ar: { native: 'العربية', english: 'Arabic' },
  ur: { native: 'اردو', english: 'Urdu' },
};
