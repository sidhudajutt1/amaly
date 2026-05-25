import type { Language } from '../types';

export const fonts = {
  quranMushaf: 'AmiriQuran',
  quranIndoPak: 'PDMSSaleemQuran',
  arabic: {
    regular: 'Amiri',
    bold: 'AmiriBold',
  },
  urdu: {
    regular: 'NotoNastaliqUrdu',
    bold: 'NotoNastaliqUrduBold',
  },
  latin: {
    regular: undefined,
    medium: undefined,
    bold: undefined,
  },
};

/**
 * Quran Arabic text:
 * - Urdu users: PDMS Saleem (Indo-Pak Naskh — thick calligraphy matching Pakistani/Indian Qurans)
 * - Arabic users: AmiriQuran (Middle Eastern Mushaf style)
 * - English/other: AmiriQuran
 */
export function getQuranFontFamily(language: Language): string {
  if (language === 'ur') return fonts.quranIndoPak;
  return fonts.quranMushaf;
}

/**
 * Dua / hadith / adhkar Arabic text:
 * - Urdu users: PDMS Saleem (consistent Indo-Pak look across all Arabic sacred text)
 * - Others: Amiri Naskh
 */
export function getArabicFontFamily(language: Language): string {
  if (language === 'ur') return fonts.quranIndoPak;
  return fonts.arabic.regular;
}

/**
 * Translation text font: Nastaliq for Urdu, system for others.
 */
export function getTranslationFontFamily(language: Language): string | undefined {
  if (language === 'ur') return fonts.urdu.regular;
  return undefined;
}

export const fontSizes = {
  quranArabic: 28,
  quranArabicLarge: 34,
  hadithArabic: 22,
  duaArabic: 24,
  translationDefault: 16,
  translationLarge: 18,
  heading1: 24,
  heading2: 20,
  heading3: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tabLabel: 10,
  prayerBar: 13,
  streak: 32,
  bismillah: 26,
};

export const lineHeights = {
  arabic: 1.8,
  urdu: 2.0,
  latin: 1.6,
  tight: 1.3,
};
