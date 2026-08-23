import { surahs, type SurahMeta } from './surahs';

export interface JuzMeta {
  number: number;
  nameEn: string;
  nameAr: string;
  nameUr: string;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

/** Standard Madinah mushaf juz boundaries (start points). */
export const JUZ_BOUNDARIES: JuzMeta[] = [
  { number: 1, nameEn: 'Juz 1', nameAr: 'الجزء ١', nameUr: 'پara 1', startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
  { number: 2, nameEn: 'Juz 2', nameAr: 'الجزء ٢', nameUr: 'پara 2', startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
  { number: 3, nameEn: 'Juz 3', nameAr: 'الجزء ٣', nameUr: 'پara 3', startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
  { number: 4, nameEn: 'Juz 4', nameAr: 'الجزء ٤', nameUr: 'پara 4', startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
  { number: 5, nameEn: 'Juz 5', nameAr: 'الجزء ٥', nameUr: 'پara 5', startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
  { number: 6, nameEn: 'Juz 6', nameAr: 'الجزء ٦', nameUr: 'پara 6', startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
  { number: 7, nameEn: 'Juz 7', nameAr: 'الجزء ٧', nameUr: 'پara 7', startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
  { number: 8, nameEn: 'Juz 8', nameAr: 'الجزء ٨', nameUr: 'پara 8', startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
  { number: 9, nameEn: 'Juz 9', nameAr: 'الجزء ٩', nameUr: 'پara 9', startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
  { number: 10, nameEn: 'Juz 10', nameAr: 'الجزء ١٠', nameUr: 'پara 10', startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
  { number: 11, nameEn: 'Juz 11', nameAr: 'الجزء ١١', nameUr: 'پara 11', startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
  { number: 12, nameEn: 'Juz 12', nameAr: 'الجزء ١٢', nameUr: 'پara 12', startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
  { number: 13, nameEn: 'Juz 13', nameAr: 'الجزء ١٣', nameUr: 'پara 13', startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
  { number: 14, nameEn: 'Juz 14', nameAr: 'الجزء ١٤', nameUr: 'پara 14', startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128 },
  { number: 15, nameEn: 'Juz 15', nameAr: 'الجزء ١٥', nameUr: 'پara 15', startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
  { number: 16, nameEn: 'Juz 16', nameAr: 'الجزء ١٦', nameUr: 'پara 16', startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
  { number: 17, nameEn: 'Juz 17', nameAr: 'الجزء ١٧', nameUr: 'پara 17', startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
  { number: 18, nameEn: 'Juz 18', nameAr: 'الجزء ١٨', nameUr: 'پara 18', startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
  { number: 19, nameEn: 'Juz 19', nameAr: 'الجزء ١٩', nameUr: 'پara 19', startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
  { number: 20, nameEn: 'Juz 20', nameAr: 'الجزء ٢٠', nameUr: 'پara 20', startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
  { number: 21, nameEn: 'Juz 21', nameAr: 'الجزء ٢١', nameUr: 'پara 21', startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
  { number: 22, nameEn: 'Juz 22', nameAr: 'الجزء ٢٢', nameUr: 'پara 22', startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
  { number: 23, nameEn: 'Juz 23', nameAr: 'الجزء ٢٣', nameUr: 'پara 23', startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
  { number: 24, nameEn: 'Juz 24', nameAr: 'الجزء ٢٤', nameUr: 'پara 24', startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
  { number: 25, nameEn: 'Juz 25', nameAr: 'الجزء ٢٥', nameUr: 'پara 25', startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
  { number: 26, nameEn: 'Juz 26', nameAr: 'الجزء ٢٦', nameUr: 'پara 26', startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
  { number: 27, nameEn: 'Juz 27', nameAr: 'الجزء ٢٧', nameUr: 'پara 27', startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
  { number: 28, nameEn: 'Juz 28', nameAr: 'الجزء ٢٨', nameUr: 'پara 28', startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
  { number: 29, nameEn: 'Juz 29', nameAr: 'الجزء ٢٩', nameUr: 'پara 29', startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
  { number: 30, nameEn: 'Juz 30', nameAr: 'الجزء ٣٠', nameUr: 'پara 30', startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 },
];

export function getJuzName(juz: JuzMeta, language: 'en' | 'ar' | 'ur'): string {
  if (language === 'ar') return juz.nameAr;
  if (language === 'ur') return juz.nameUr;
  return juz.nameEn;
}

export function getSurahsInJuz(juzNumber: number): SurahMeta[] {
  return surahs.filter((s) => s.juz.includes(juzNumber));
}

export function getJuzByNumber(n: number): JuzMeta | undefined {
  return JUZ_BOUNDARIES.find((j) => j.number === n);
}
