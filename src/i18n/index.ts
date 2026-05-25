import { en, type TranslationKeys } from './locales/en';
import { ar } from './locales/ar';
import { ur } from './locales/ur';
import type { Language, LayoutDirection } from '../types';

const translations: Record<Language, TranslationKeys> = { en, ar, ur };

export function t(language: Language, path: string): string {
  const lang = translations[language] as Record<string, unknown>;
  const en = translations.en as Record<string, unknown>;

  // Try direct flat key first (handles 'ramadan.suhoor' style keys)
  if (path in lang && typeof lang[path] === 'string') return lang[path] as string;
  if (path in en && typeof en[path] === 'string') return en[path] as string;

  // Fall back to nested dot-traversal (handles 'common.appName' nested objects)
  const keys = path.split('.');
  let current: unknown = lang;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      current = undefined;
      break;
    }
  }
  if (typeof current === 'string') return current;

  let fallback: unknown = en;
  for (const key of keys) {
    if (fallback && typeof fallback === 'object' && key in (fallback as Record<string, unknown>)) {
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
