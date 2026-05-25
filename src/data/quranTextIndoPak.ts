/**
 * Indo-Pak script Quran text loader for Urdu-language users.
 * Source: Quran.com API v4 (text_indopak field) — all 114 surahs.
 * Font:   PDMS Saleem QuranFont (PDMSSaleemQuran)
 *
 * Uses a static require() map for Metro bundler compatibility.
 * Each surah is loaded once and cached in memory.
 */

type SurahLoader = () => Record<string, string>;

// Static map required by Metro bundler — dynamic require() is not resolvable at build time.
const SURAH_LOADERS: Record<number, SurahLoader> = {
  1: () => require('../../assets/indopak-text/1.json'),
  2: () => require('../../assets/indopak-text/2.json'),
  3: () => require('../../assets/indopak-text/3.json'),
  4: () => require('../../assets/indopak-text/4.json'),
  5: () => require('../../assets/indopak-text/5.json'),
  6: () => require('../../assets/indopak-text/6.json'),
  7: () => require('../../assets/indopak-text/7.json'),
  8: () => require('../../assets/indopak-text/8.json'),
  9: () => require('../../assets/indopak-text/9.json'),
  10: () => require('../../assets/indopak-text/10.json'),
  11: () => require('../../assets/indopak-text/11.json'),
  12: () => require('../../assets/indopak-text/12.json'),
  13: () => require('../../assets/indopak-text/13.json'),
  14: () => require('../../assets/indopak-text/14.json'),
  15: () => require('../../assets/indopak-text/15.json'),
  16: () => require('../../assets/indopak-text/16.json'),
  17: () => require('../../assets/indopak-text/17.json'),
  18: () => require('../../assets/indopak-text/18.json'),
  19: () => require('../../assets/indopak-text/19.json'),
  20: () => require('../../assets/indopak-text/20.json'),
  21: () => require('../../assets/indopak-text/21.json'),
  22: () => require('../../assets/indopak-text/22.json'),
  23: () => require('../../assets/indopak-text/23.json'),
  24: () => require('../../assets/indopak-text/24.json'),
  25: () => require('../../assets/indopak-text/25.json'),
  26: () => require('../../assets/indopak-text/26.json'),
  27: () => require('../../assets/indopak-text/27.json'),
  28: () => require('../../assets/indopak-text/28.json'),
  29: () => require('../../assets/indopak-text/29.json'),
  30: () => require('../../assets/indopak-text/30.json'),
  31: () => require('../../assets/indopak-text/31.json'),
  32: () => require('../../assets/indopak-text/32.json'),
  33: () => require('../../assets/indopak-text/33.json'),
  34: () => require('../../assets/indopak-text/34.json'),
  35: () => require('../../assets/indopak-text/35.json'),
  36: () => require('../../assets/indopak-text/36.json'),
  37: () => require('../../assets/indopak-text/37.json'),
  38: () => require('../../assets/indopak-text/38.json'),
  39: () => require('../../assets/indopak-text/39.json'),
  40: () => require('../../assets/indopak-text/40.json'),
  41: () => require('../../assets/indopak-text/41.json'),
  42: () => require('../../assets/indopak-text/42.json'),
  43: () => require('../../assets/indopak-text/43.json'),
  44: () => require('../../assets/indopak-text/44.json'),
  45: () => require('../../assets/indopak-text/45.json'),
  46: () => require('../../assets/indopak-text/46.json'),
  47: () => require('../../assets/indopak-text/47.json'),
  48: () => require('../../assets/indopak-text/48.json'),
  49: () => require('../../assets/indopak-text/49.json'),
  50: () => require('../../assets/indopak-text/50.json'),
  51: () => require('../../assets/indopak-text/51.json'),
  52: () => require('../../assets/indopak-text/52.json'),
  53: () => require('../../assets/indopak-text/53.json'),
  54: () => require('../../assets/indopak-text/54.json'),
  55: () => require('../../assets/indopak-text/55.json'),
  56: () => require('../../assets/indopak-text/56.json'),
  57: () => require('../../assets/indopak-text/57.json'),
  58: () => require('../../assets/indopak-text/58.json'),
  59: () => require('../../assets/indopak-text/59.json'),
  60: () => require('../../assets/indopak-text/60.json'),
  61: () => require('../../assets/indopak-text/61.json'),
  62: () => require('../../assets/indopak-text/62.json'),
  63: () => require('../../assets/indopak-text/63.json'),
  64: () => require('../../assets/indopak-text/64.json'),
  65: () => require('../../assets/indopak-text/65.json'),
  66: () => require('../../assets/indopak-text/66.json'),
  67: () => require('../../assets/indopak-text/67.json'),
  68: () => require('../../assets/indopak-text/68.json'),
  69: () => require('../../assets/indopak-text/69.json'),
  70: () => require('../../assets/indopak-text/70.json'),
  71: () => require('../../assets/indopak-text/71.json'),
  72: () => require('../../assets/indopak-text/72.json'),
  73: () => require('../../assets/indopak-text/73.json'),
  74: () => require('../../assets/indopak-text/74.json'),
  75: () => require('../../assets/indopak-text/75.json'),
  76: () => require('../../assets/indopak-text/76.json'),
  77: () => require('../../assets/indopak-text/77.json'),
  78: () => require('../../assets/indopak-text/78.json'),
  79: () => require('../../assets/indopak-text/79.json'),
  80: () => require('../../assets/indopak-text/80.json'),
  81: () => require('../../assets/indopak-text/81.json'),
  82: () => require('../../assets/indopak-text/82.json'),
  83: () => require('../../assets/indopak-text/83.json'),
  84: () => require('../../assets/indopak-text/84.json'),
  85: () => require('../../assets/indopak-text/85.json'),
  86: () => require('../../assets/indopak-text/86.json'),
  87: () => require('../../assets/indopak-text/87.json'),
  88: () => require('../../assets/indopak-text/88.json'),
  89: () => require('../../assets/indopak-text/89.json'),
  90: () => require('../../assets/indopak-text/90.json'),
  91: () => require('../../assets/indopak-text/91.json'),
  92: () => require('../../assets/indopak-text/92.json'),
  93: () => require('../../assets/indopak-text/93.json'),
  94: () => require('../../assets/indopak-text/94.json'),
  95: () => require('../../assets/indopak-text/95.json'),
  96: () => require('../../assets/indopak-text/96.json'),
  97: () => require('../../assets/indopak-text/97.json'),
  98: () => require('../../assets/indopak-text/98.json'),
  99: () => require('../../assets/indopak-text/99.json'),
  100: () => require('../../assets/indopak-text/100.json'),
  101: () => require('../../assets/indopak-text/101.json'),
  102: () => require('../../assets/indopak-text/102.json'),
  103: () => require('../../assets/indopak-text/103.json'),
  104: () => require('../../assets/indopak-text/104.json'),
  105: () => require('../../assets/indopak-text/105.json'),
  106: () => require('../../assets/indopak-text/106.json'),
  107: () => require('../../assets/indopak-text/107.json'),
  108: () => require('../../assets/indopak-text/108.json'),
  109: () => require('../../assets/indopak-text/109.json'),
  110: () => require('../../assets/indopak-text/110.json'),
  111: () => require('../../assets/indopak-text/111.json'),
  112: () => require('../../assets/indopak-text/112.json'),
  113: () => require('../../assets/indopak-text/113.json'),
  114: () => require('../../assets/indopak-text/114.json'),
};

const cache: Record<number, Record<string, string>> = {};

function loadSurah(surahNumber: number): Record<string, string> | null {
  if (cache[surahNumber]) return cache[surahNumber];
  const loader = SURAH_LOADERS[surahNumber];
  if (!loader) return null;
  const data = loader();
  cache[surahNumber] = data;
  return data;
}

export function getIndoPakAyahText(surahNumber: number, ayahNumber: number): string | undefined {
  const surah = loadSurah(surahNumber);
  return surah?.[String(ayahNumber)];
}

export function hasIndoPakText(surahNumber: number): boolean {
  return surahNumber >= 1 && surahNumber <= 114;
}
