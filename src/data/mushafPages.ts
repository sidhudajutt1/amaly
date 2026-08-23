import type { Language } from '../types';
import { getDisplayAyahArabic } from '../utils/quranArabicText';
import { getSurahData } from './quranText';
import { getJuzByNumber, type JuzMeta } from './juz';

export interface MushafLine {
  surah: number;
  ayah: number;
  text: string;
}

export interface MushafPage {
  pageNumber: number;
  juzNumber: number;
  lines: MushafLine[];
}

const LINES_PER_PAGE = 15;

/** Build mushaf-style pages for a juz by grouping ayahs into ~15-line pages. */
export function getMushafPagesForJuz(juzNumber: number, language: Language = 'en'): MushafPage[] {
  const juz = getJuzByNumber(juzNumber);
  if (!juz) return [];

  const ayahLines: MushafLine[] = [];
  for (let s = juz.startSurah; s <= juz.endSurah; s++) {
    const surah = getSurahData(s);
    if (!surah) continue;
    for (const ayah of surah.ayahs) {
      if (s === juz.startSurah && ayah.number < juz.startAyah) continue;
      if (s === juz.endSurah && ayah.number > juz.endAyah) continue;
      ayahLines.push({
        surah: s,
        ayah: ayah.number,
        text: getDisplayAyahArabic(language, s, ayah.number, ayah.textAr),
      });
    }
  }

  const pages: MushafPage[] = [];
  for (let i = 0; i < ayahLines.length; i += LINES_PER_PAGE) {
    pages.push({
      pageNumber: pages.length + 1,
      juzNumber,
      lines: ayahLines.slice(i, i + LINES_PER_PAGE),
    });
  }
  return pages;
}

export function getJuzLabel(juz: JuzMeta, language: 'en' | 'ar' | 'ur'): string {
  if (language === 'ar') return juz.nameAr;
  if (language === 'ur') return juz.nameUr;
  return juz.nameEn;
}
