import { Platform } from 'react-native';
import type { Language } from '../types';

export const fonts = {
  quranMushaf: 'AmiriQuran',
  arabic: {
    regular: Platform.select({
      ios: 'Geeza Pro',
      android: 'noto-naskh-arabic',
      default: 'serif',
    }),
    bold: Platform.select({
      ios: 'Geeza Pro Bold',
      android: 'noto-naskh-arabic',
      default: 'serif',
    }),
  },
  urdu: {
    regular: 'NotoNastaliqUrdu',
    bold: 'NotoNastaliqUrduBold',
  },
  latin: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },
};

/**
 * Returns the correct font family for Quran Arabic text based on user language:
 * - Urdu users: Amiri Quran (Mushaf-style, closer to Indo-Pak Naskh)
 * - Arabic users: System Naskh (standard digital Arabic)
 * - Others: Amiri Quran (Mushaf-style for the beautiful calligraphic look)
 */
export function getQuranFontFamily(language: Language): string {
  if (language === 'ar') return fonts.arabic.regular || 'serif';
  return fonts.quranMushaf;
}

/**
 * Returns the correct font for dua/hadith Arabic text (non-Quran sacred text)
 */
export function getArabicFontFamily(language: Language): string {
  if (language === 'ur') return fonts.urdu.regular;
  return fonts.arabic.regular || 'serif';
}

/**
 * Returns the correct font for translation text
 */
export function getTranslationFontFamily(language: Language): string | undefined {
  if (language === 'ur') return fonts.urdu.regular;
  if (language === 'ar') return fonts.arabic.regular || undefined;
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
