export type Language = 'en' | 'ar' | 'ur';

export type LayoutDirection = 'ltr' | 'rtl';

export type GrowthCategory =
  | 'sabr'
  | 'shukr'
  | 'family'
  | 'worship'
  | 'character'
  | 'knowledge'
  | 'generosity'
  | 'tawakkul'
  | 'justice'
  | 'death_remembrance';

export interface GrowthCategoryInfo {
  id: GrowthCategory;
  nameAr: string;
  nameEn: string;
  nameUr: string;
  icon: string;
}

export interface DailyReflection {
  id: string;
  date: string;
  categories: GrowthCategory[];
  ayah: {
    surahNumber: number;
    surahNameAr: string;
    surahNameEn: string;
    ayahNumber: number;
    textAr: string;
    translationEn: string;
    translationUr: string;
  };
  hadith: {
    textAr: string;
    translationEn: string;
    translationUr: string;
    source: string;
    collection: string;
    number: number;
    grading: 'sahih' | 'hasan';
  };
  reflection: {
    en: string;
    ar: string;
    ur: string;
  };
  niyyah: {
    en: string;
    ar: string;
    ur: string;
  };
}

export interface UserProgress {
  date: string;
  reflectionViewed: boolean;
  niyyahCompleted: boolean;
  prayersCompleted: PrayerName[];
  tafsirRead: boolean;
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTime {
  name: PrayerName;
  time: Date;
  notificationEnabled: boolean;
}

export interface PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export type CalculationMethod =
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'MoonsightingCommittee'
  | 'NorthAmerica'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Turkey'
  | 'Tehran';

export interface DuaItem {
  id: string;
  categoryId: string;
  textAr: string;
  translationEn: string;
  translationUr: string;
  transliteration: string;
  source: string;
  repetitions: number;
  audioUrl?: string;
}

export interface DuaCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  nameUr: string;
  icon: string;
  count: number;
}

export interface HadithItem {
  id: string;
  collectionId: string;
  bookNumber: number;
  hadithNumber: number;
  textAr: string;
  translationEn: string;
  translationUr: string;
  grading: 'sahih' | 'hasan' | 'daif';
  narrator: string;
}

export interface HadithCollection {
  id: string;
  nameEn: string;
  nameAr: string;
  nameUr: string;
  totalHadiths: number;
  totalBooks: number;
}

export interface AllahName {
  id: number;
  nameAr: string;
  transliteration: string;
  meaningEn: string;
  meaningUr: string;
  explanationEn: string;
  explanationUr: string;
}

export interface UserSettings {
  language: Language;
  growthCategories: GrowthCategory[];
  notificationTime: string;
  calculationMethod: CalculationMethod;
  locationLat?: number;
  locationLng?: number;
  locationName?: string;
  onboardingCompleted: boolean;
  theme: 'light' | 'dark' | 'auto';
  quranFontSize: number;
  translationFontSize: number;
  showTransliteration: boolean;
  locationAutoDetect?: boolean;
  hijriAdjustment: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalReflections: number;
  totalNiyyahsCompleted: number;
  totalTafsirRead: number;
  categoryProgress: Record<GrowthCategory, number>;
}

export interface SupportTier {
  id: 'sadaqah' | 'supporter' | 'patron' | 'lifetime';
  nameEn: string;
  nameAr: string;
  nameUr: string;
  price: string;
  descriptionEn: string;
  descriptionAr: string;
  descriptionUr: string;
}

export interface HijriDate {
  day: number;
  month: number;
  year: number;
}
