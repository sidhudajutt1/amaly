export interface AyahData {
  number: number;
  textAr: string;
  translationEn: string;
  translationUr: string;
}

export interface SurahData {
  surahNumber: number;
  ayahs: AyahData[];
}

/**
 * Embedded Al-Fatihah for offline-first demo.
 * Full Quran text will be loaded from Tanzil.net dataset once CSR approval is received.
 * Every ayah verified against the Madinah Mushaf / King Fahd Complex text.
 */
export const alFatihah: SurahData = {
  surahNumber: 1,
  ayahs: [
    {
      number: 1,
      textAr: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ',
      translationEn: 'In the Name of Allah, the Most Gracious, the Most Merciful.',
      translationUr: 'اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
    },
    {
      number: 2,
      textAr: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَـٰلَمِينَ',
      translationEn: 'All praise is due to Allah, Lord of all the worlds.',
      translationUr: 'سب تعریف اللہ کے لیے ہے جو تمام جہانوں کا پروردگار ہے',
    },
    {
      number: 3,
      textAr: 'ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ',
      translationEn: 'The Most Gracious, the Most Merciful.',
      translationUr: 'بڑا مہربان نہایت رحم والا',
    },
    {
      number: 4,
      textAr: 'مَـٰلِكِ يَوۡمِ ٱلدِّينِ',
      translationEn: 'Master of the Day of Judgment.',
      translationUr: 'روزِ جزا کا مالک',
    },
    {
      number: 5,
      textAr: 'إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ',
      translationEn: 'You alone we worship, and You alone we ask for help.',
      translationUr: 'ہم تیری ہی عبادت کرتے ہیں اور تجھ سے ہی مدد مانگتے ہیں',
    },
    {
      number: 6,
      textAr: 'ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ',
      translationEn: 'Guide us on the Straight Path.',
      translationUr: 'ہمیں سیدھے راستے کی ہدایت دے',
    },
    {
      number: 7,
      textAr: 'صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ',
      translationEn: 'The path of those You have blessed—not those who have earned Your anger, nor those who have gone astray.',
      translationUr: 'ان لوگوں کا راستہ جن پر تو نے انعام کیا، نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا',
    },
  ],
};

const embeddedSurahs: Record<number, SurahData> = {
  1: alFatihah,
};

export function getSurahData(surahNumber: number): SurahData | null {
  return embeddedSurahs[surahNumber] || null;
}

export function isSurahAvailable(surahNumber: number): boolean {
  return surahNumber in embeddedSurahs;
}
