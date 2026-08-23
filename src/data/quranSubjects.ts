export interface QuranSubjectAyah {
  surah: number;
  ayah: number;
  labelEn?: string;
  labelAr?: string;
  labelUr?: string;
}

export interface QuranSubject {
  id: string;
  nameEn: string;
  nameAr: string;
  nameUr: string;
  icon: string;
  ayahs: QuranSubjectAyah[];
}

export const quranSubjects: QuranSubject[] = [
  {
    id: 'mercy',
    nameEn: 'Mercy of Allah',
    nameAr: 'رحمة الله',
    nameUr: 'اللہ کی رحمت',
    icon: 'heart-outline',
    ayahs: [
      { surah: 1, ayah: 1 }, { surah: 1, ayah: 2 }, { surah: 1, ayah: 3 },
      { surah: 6, ayah: 12 }, { surah: 6, ayah: 54 }, { surah: 7, ayah: 156 },
    ],
  },
  {
    id: 'patience',
    nameEn: 'Patience (Sabr)',
    nameAr: 'الصبر',
    nameUr: 'صبر',
    icon: 'hourglass-outline',
    ayahs: [
      { surah: 2, ayah: 153 }, { surah: 2, ayah: 155 }, { surah: 2, ayah: 156 },
      { surah: 3, ayah: 200 }, { surah: 39, ayah: 10 },
    ],
  },
  {
    id: 'gratitude',
    nameEn: 'Gratitude (Shukr)',
    nameAr: 'الشكر',
    nameUr: 'شکر',
    icon: 'gift-outline',
    ayahs: [
      { surah: 14, ayah: 7 }, { surah: 2, ayah: 152 }, { surah: 31, ayah: 12 },
      { surah: 55, ayah: 13 },
    ],
  },
  {
    id: 'prayer',
    nameEn: 'Prayer (Salah)',
    nameAr: 'الصلاة',
    nameUr: 'نماز',
    icon: 'moon-outline',
    ayahs: [
      { surah: 2, ayah: 238 }, { surah: 2, ayah: 3 }, { surah: 29, ayah: 45 },
      { surah: 20, ayah: 14 },
    ],
  },
  {
    id: 'charity',
    nameEn: 'Charity (Sadaqah)',
    nameAr: 'الصدقة',
    nameUr: 'صدقہ',
    icon: 'hand-left-outline',
    ayahs: [
      { surah: 2, ayah: 261 }, { surah: 2, ayah: 262 }, { surah: 57, ayah: 7 },
      { surah: 57, ayah: 18 },
    ],
  },
  {
    id: 'family',
    nameEn: 'Family & Kinship',
    nameAr: 'الأسرة وصلة الرحم',
    nameUr: 'خاندان اور رشتہ داری',
    icon: 'people-outline',
    ayahs: [
      { surah: 4, ayah: 1 }, { surah: 17, ayah: 23 }, { surah: 17, ayah: 24 },
      { surah: 49, ayah: 10 },
    ],
  },
  {
    id: 'justice',
    nameEn: 'Justice & Fairness',
    nameAr: 'العدل',
    nameUr: 'انصاف',
    icon: 'scale-outline',
    ayahs: [
      { surah: 4, ayah: 135 }, { surah: 5, ayah: 8 }, { surah: 16, ayah: 90 },
    ],
  },
  {
    id: 'forgiveness',
    nameEn: 'Forgiveness',
    nameAr: 'المغفرة',
    nameUr: 'مغفرت',
    icon: 'refresh-outline',
    ayahs: [
      { surah: 39, ayah: 53 }, { surah: 3, ayah: 135 }, { surah: 7, ayah: 199 },
      { surah: 42, ayah: 25 },
    ],
  },
  {
    id: 'trust',
    nameEn: 'Trust in Allah (Tawakkul)',
    nameAr: 'التوكل على الله',
    nameUr: 'اللہ پر توکل',
    icon: 'shield-checkmark-outline',
    ayahs: [
      { surah: 3, ayah: 159 }, { surah: 65, ayah: 3 }, { surah: 14, ayah: 11 },
      { surah: 9, ayah: 51 },
    ],
  },
  {
    id: 'knowledge',
    nameEn: 'Knowledge & Wisdom',
    nameAr: 'العلم والحكمة',
    nameUr: 'علم اور حکمت',
    icon: 'book-outline',
    ayahs: [
      { surah: 20, ayah: 114 }, { surah: 39, ayah: 9 }, { surah: 58, ayah: 11 },
      { surah: 96, ayah: 1 },
    ],
  },
  {
    id: 'paradise',
    nameEn: 'Paradise (Jannah)',
    nameAr: 'الجنة',
    nameUr: 'جنت',
    icon: 'sunny-outline',
    ayahs: [
      { surah: 2, ayah: 25 }, { surah: 3, ayah: 15 }, { surah: 55, ayah: 46 },
      { surah: 56, ayah: 10 },
    ],
  },
  {
    id: 'hereafter',
    nameEn: 'Day of Judgment',
    nameAr: 'يوم القيامة',
    nameUr: 'یوم قیامت',
    icon: 'alert-circle-outline',
    ayahs: [
      { surah: 99, ayah: 1 }, { surah: 101, ayah: 1 }, { surah: 82, ayah: 1 },
      { surah: 78, ayah: 1 },
    ],
  },
];

export function getSubjectName(subject: QuranSubject, language: 'en' | 'ar' | 'ur'): string {
  if (language === 'ar') return subject.nameAr;
  if (language === 'ur') return subject.nameUr;
  return subject.nameEn;
}
