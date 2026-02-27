export interface HadithCollectionMeta {
  id: string;
  nameEn: string;
  nameAr: string;
  nameUr: string;
  compiler: string;
  totalHadiths: number;
  totalBooks: number;
  icon: string;
  description: string;
}

export const hadithCollections: HadithCollectionMeta[] = [
  {
    id: 'bukhari',
    nameEn: 'Sahih al-Bukhari',
    nameAr: 'صحيح البخاري',
    nameUr: 'صحیح بخاری',
    compiler: 'Imam Muhammad ibn Ismail al-Bukhari',
    totalHadiths: 7563,
    totalBooks: 97,
    icon: '📗',
    description: 'The most authentic collection of Hadith, compiled by Imam al-Bukhari (194–256 AH).',
  },
  {
    id: 'muslim',
    nameEn: 'Sahih Muslim',
    nameAr: 'صحيح مسلم',
    nameUr: 'صحیح مسلم',
    compiler: 'Imam Muslim ibn al-Hajjaj',
    totalHadiths: 7500,
    totalBooks: 56,
    icon: '📗',
    description: 'The second most authentic collection, compiled by Imam Muslim (206–261 AH).',
  },
  {
    id: 'tirmidhi',
    nameEn: "Jami' at-Tirmidhi",
    nameAr: 'جامع الترمذي',
    nameUr: 'جامع ترمذی',
    compiler: 'Imam Abu Isa at-Tirmidhi',
    totalHadiths: 3956,
    totalBooks: 49,
    icon: '📕',
    description: 'Known for including grading of each hadith, compiled by Imam at-Tirmidhi (209–279 AH).',
  },
  {
    id: 'abudawud',
    nameEn: 'Sunan Abu Dawud',
    nameAr: 'سنن أبي داود',
    nameUr: 'سنن ابوداؤد',
    compiler: 'Imam Abu Dawud as-Sijistani',
    totalHadiths: 5274,
    totalBooks: 43,
    icon: '📕',
    description: 'Focused on legal hadiths, compiled by Imam Abu Dawud (202–275 AH).',
  },
  {
    id: 'nasai',
    nameEn: "Sunan an-Nasa'i",
    nameAr: 'سنن النسائي',
    nameUr: 'سنن نسائی',
    compiler: "Imam Ahmad an-Nasa'i",
    totalHadiths: 5758,
    totalBooks: 51,
    icon: '📙',
    description: "Known for strict criteria, compiled by Imam an-Nasa'i (214–303 AH).",
  },
  {
    id: 'ibnmajah',
    nameEn: 'Sunan Ibn Majah',
    nameAr: 'سنن ابن ماجه',
    nameUr: 'سنن ابن ماجہ',
    compiler: 'Imam Ibn Majah al-Qazwini',
    totalHadiths: 4341,
    totalBooks: 37,
    icon: '📙',
    description: 'The sixth of the major collections, compiled by Imam Ibn Majah (209–273 AH).',
  },
];
