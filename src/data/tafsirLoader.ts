/**
 * Tafsir loader — Ibn Kathir (English + Urdu), per-surah JSON files.
 * Uses a static require map so Metro bundler can resolve all assets at build time.
 * Files are lazy-loaded per surah and cached. Fully offline, no network required.
 */

export interface TafsirAyah {
  ayah: number;
  en: string;
  ur: string;
}

type SurahLoader = () => TafsirAyah[];

const SURAH_LOADERS: Record<number, SurahLoader> = {
  1: () => require('../../assets/tafsir/1.json'),
  2: () => require('../../assets/tafsir/2.json'),
  3: () => require('../../assets/tafsir/3.json'),
  4: () => require('../../assets/tafsir/4.json'),
  5: () => require('../../assets/tafsir/5.json'),
  6: () => require('../../assets/tafsir/6.json'),
  7: () => require('../../assets/tafsir/7.json'),
  8: () => require('../../assets/tafsir/8.json'),
  9: () => require('../../assets/tafsir/9.json'),
  10: () => require('../../assets/tafsir/10.json'),
  11: () => require('../../assets/tafsir/11.json'),
  12: () => require('../../assets/tafsir/12.json'),
  13: () => require('../../assets/tafsir/13.json'),
  14: () => require('../../assets/tafsir/14.json'),
  15: () => require('../../assets/tafsir/15.json'),
  16: () => require('../../assets/tafsir/16.json'),
  17: () => require('../../assets/tafsir/17.json'),
  18: () => require('../../assets/tafsir/18.json'),
  19: () => require('../../assets/tafsir/19.json'),
  20: () => require('../../assets/tafsir/20.json'),
  21: () => require('../../assets/tafsir/21.json'),
  22: () => require('../../assets/tafsir/22.json'),
  23: () => require('../../assets/tafsir/23.json'),
  24: () => require('../../assets/tafsir/24.json'),
  25: () => require('../../assets/tafsir/25.json'),
  26: () => require('../../assets/tafsir/26.json'),
  27: () => require('../../assets/tafsir/27.json'),
  28: () => require('../../assets/tafsir/28.json'),
  29: () => require('../../assets/tafsir/29.json'),
  30: () => require('../../assets/tafsir/30.json'),
  31: () => require('../../assets/tafsir/31.json'),
  32: () => require('../../assets/tafsir/32.json'),
  33: () => require('../../assets/tafsir/33.json'),
  34: () => require('../../assets/tafsir/34.json'),
  35: () => require('../../assets/tafsir/35.json'),
  36: () => require('../../assets/tafsir/36.json'),
  37: () => require('../../assets/tafsir/37.json'),
  38: () => require('../../assets/tafsir/38.json'),
  39: () => require('../../assets/tafsir/39.json'),
  40: () => require('../../assets/tafsir/40.json'),
  41: () => require('../../assets/tafsir/41.json'),
  42: () => require('../../assets/tafsir/42.json'),
  43: () => require('../../assets/tafsir/43.json'),
  44: () => require('../../assets/tafsir/44.json'),
  45: () => require('../../assets/tafsir/45.json'),
  46: () => require('../../assets/tafsir/46.json'),
  47: () => require('../../assets/tafsir/47.json'),
  48: () => require('../../assets/tafsir/48.json'),
  49: () => require('../../assets/tafsir/49.json'),
  50: () => require('../../assets/tafsir/50.json'),
  51: () => require('../../assets/tafsir/51.json'),
  52: () => require('../../assets/tafsir/52.json'),
  53: () => require('../../assets/tafsir/53.json'),
  54: () => require('../../assets/tafsir/54.json'),
  55: () => require('../../assets/tafsir/55.json'),
  56: () => require('../../assets/tafsir/56.json'),
  57: () => require('../../assets/tafsir/57.json'),
  58: () => require('../../assets/tafsir/58.json'),
  59: () => require('../../assets/tafsir/59.json'),
  60: () => require('../../assets/tafsir/60.json'),
  61: () => require('../../assets/tafsir/61.json'),
  62: () => require('../../assets/tafsir/62.json'),
  63: () => require('../../assets/tafsir/63.json'),
  64: () => require('../../assets/tafsir/64.json'),
  65: () => require('../../assets/tafsir/65.json'),
  66: () => require('../../assets/tafsir/66.json'),
  67: () => require('../../assets/tafsir/67.json'),
  68: () => require('../../assets/tafsir/68.json'),
  69: () => require('../../assets/tafsir/69.json'),
  70: () => require('../../assets/tafsir/70.json'),
  71: () => require('../../assets/tafsir/71.json'),
  72: () => require('../../assets/tafsir/72.json'),
  73: () => require('../../assets/tafsir/73.json'),
  74: () => require('../../assets/tafsir/74.json'),
  75: () => require('../../assets/tafsir/75.json'),
  76: () => require('../../assets/tafsir/76.json'),
  77: () => require('../../assets/tafsir/77.json'),
  78: () => require('../../assets/tafsir/78.json'),
  79: () => require('../../assets/tafsir/79.json'),
  80: () => require('../../assets/tafsir/80.json'),
  81: () => require('../../assets/tafsir/81.json'),
  82: () => require('../../assets/tafsir/82.json'),
  83: () => require('../../assets/tafsir/83.json'),
  84: () => require('../../assets/tafsir/84.json'),
  85: () => require('../../assets/tafsir/85.json'),
  86: () => require('../../assets/tafsir/86.json'),
  87: () => require('../../assets/tafsir/87.json'),
  88: () => require('../../assets/tafsir/88.json'),
  89: () => require('../../assets/tafsir/89.json'),
  90: () => require('../../assets/tafsir/90.json'),
  91: () => require('../../assets/tafsir/91.json'),
  92: () => require('../../assets/tafsir/92.json'),
  93: () => require('../../assets/tafsir/93.json'),
  94: () => require('../../assets/tafsir/94.json'),
  95: () => require('../../assets/tafsir/95.json'),
  96: () => require('../../assets/tafsir/96.json'),
  97: () => require('../../assets/tafsir/97.json'),
  98: () => require('../../assets/tafsir/98.json'),
  99: () => require('../../assets/tafsir/99.json'),
  100: () => require('../../assets/tafsir/100.json'),
  101: () => require('../../assets/tafsir/101.json'),
  102: () => require('../../assets/tafsir/102.json'),
  103: () => require('../../assets/tafsir/103.json'),
  104: () => require('../../assets/tafsir/104.json'),
  105: () => require('../../assets/tafsir/105.json'),
  106: () => require('../../assets/tafsir/106.json'),
  107: () => require('../../assets/tafsir/107.json'),
  108: () => require('../../assets/tafsir/108.json'),
  109: () => require('../../assets/tafsir/109.json'),
  110: () => require('../../assets/tafsir/110.json'),
  111: () => require('../../assets/tafsir/111.json'),
  112: () => require('../../assets/tafsir/112.json'),
  113: () => require('../../assets/tafsir/113.json'),
  114: () => require('../../assets/tafsir/114.json'),
};

const cache: Record<number, TafsirAyah[]> = {};

export function getTafsirForSurah(surahNumber: number): TafsirAyah[] {
  if (cache[surahNumber] !== undefined) return cache[surahNumber];
  try {
    const loader = SURAH_LOADERS[surahNumber];
    const data = loader ? loader() : [];
    cache[surahNumber] = data;
    return data;
  } catch {
    cache[surahNumber] = [];
    return [];
  }
}

export function getTafsirForAyah(surahNumber: number, ayahNumber: number): TafsirAyah | undefined {
  return getTafsirForSurah(surahNumber).find((t) => t.ayah === ayahNumber);
}
