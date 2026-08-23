import type { Language } from '../types';
import { getIndoPakAyahText } from '../data/quranTextIndoPak';
import { fonts, lineHeights, getQuranFontFamily } from '../theme/typography';

export const BISMILLAH_INDOPAK = 'بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِيۡمِ';
export const BISMILLAH_UTHMANI = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';

/** Parse refs like "Al-Baqarah 2:153" → { surah: 2, ayah: 153 } */
export function parseAyahRef(ref: string): { surah: number; ayah: number } | null {
  const match = ref.match(/(\d+):(\d+)\s*$/);
  if (!match) return null;
  return { surah: parseInt(match[1]!, 10), ayah: parseInt(match[2]!, 10) };
}

export function getBismillahText(language: Language): string {
  return language === 'ur' ? BISMILLAH_INDOPAK : BISMILLAH_UTHMANI;
}

/** Quran ayah Arabic — Indo-Pak script for Urdu, Uthmani otherwise. */
export function getDisplayAyahArabic(
  language: Language,
  surahNumber: number,
  ayahNumber: number,
  uthmaniFallback: string,
): string {
  if (language === 'ur') {
    return getIndoPakAyahText(surahNumber, ayahNumber) ?? uthmaniFallback;
  }
  return uthmaniFallback;
}

/** Resolve ayah Arabic from a human ref string (e.g. daily reflection ayahRef). */
export function getDisplayAyahArabicFromRef(
  language: Language,
  ayahRef: string,
  uthmaniFallback: string,
): string {
  const parsed = parseAyahRef(ayahRef);
  if (!parsed) return uthmaniFallback;
  return getDisplayAyahArabic(language, parsed.surah, parsed.ayah, uthmaniFallback);
}

export function getQuranArabicFontFamily(language: Language): string {
  return getQuranFontFamily(language);
}

export function getQuranArabicLineHeightMultiplier(language: Language): number {
  return language === 'ur' ? lineHeights.urdu : lineHeights.arabic;
}

export { fonts as quranFonts };
