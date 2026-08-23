import type { Language } from '../types';
import { getDisplayAyahArabic } from '../utils/quranArabicText';
import { getSurahData } from './quranText';

export interface WordToken {
  index: number;
  arabic: string;
  transliteration: string;
  glossEn: string;
  glossUr: string;
}

/** Split ayah text into word tokens for word-by-word display (Indo-Pak for Urdu). */
export function getWordsForAyah(surahNumber: number, ayahNumber: number, language: Language = 'en'): WordToken[] {
  const surah = getSurahData(surahNumber);
  if (!surah) return [];
  const ayah = surah.ayahs.find((a) => a.number === ayahNumber);
  if (!ayah) return [];

  const arabicText = getDisplayAyahArabic(language, surahNumber, ayahNumber, ayah.textAr);
  const words = arabicText.split(/\s+/).filter(Boolean);
  const enWords = ayah.translationEn.split(/\s+/).filter(Boolean);
  const urWords = ayah.translationUr.split(/\s+/).filter(Boolean);

  return words.map((arabic, index) => ({
    index: index + 1,
    arabic,
    transliteration: '',
    glossEn: enWords[index] ?? enWords[Math.min(index, enWords.length - 1)] ?? '',
    glossUr: urWords[index] ?? urWords[Math.min(index, urWords.length - 1)] ?? '',
  }));
}

export function getWordGloss(word: WordToken, language: 'en' | 'ar' | 'ur'): string {
  if (language === 'ur') return word.glossUr;
  if (language === 'ar') return word.glossEn;
  return word.glossEn;
}
