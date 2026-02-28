import { toHijri as convertToHijri, toGregorian as convertToGregorian } from 'hijri-converter';
import type { Language } from '../types';

export interface HijriDate {
  day: number;
  month: number;
  year: number;
}

const HIJRI_MONTH_NAMES: Record<Language, string[]> = {
  en: ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhul Qi\'dah', 'Dhul Hijjah'],
  ar: ['محرّم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان', 'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجة'],
  ur: ['محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ'],
};

export function toHijri(date: Date, adjustment: number = 0): HijriDate {
  const adjusted = new Date(date);
  adjusted.setDate(adjusted.getDate() + adjustment);

  const result = convertToHijri(
    adjusted.getFullYear(),
    adjusted.getMonth() + 1,
    adjusted.getDate()
  );

  return {
    day: result.hd,
    month: result.hm,
    year: result.hy,
  };
}

export function getHijriMonthName(month: number, language: Language): string {
  return HIJRI_MONTH_NAMES[language][month - 1] || '';
}

export function formatHijriDate(hijri: HijriDate, language: Language): string {
  const monthName = getHijriMonthName(hijri.month, language);
  if (language === 'ar' || language === 'ur') {
    return `${hijri.day} ${monthName} ${hijri.year}`;
  }
  return `${hijri.day} ${monthName}, ${hijri.year}`;
}

export function isRamadan(hijri: HijriDate): boolean {
  return hijri.month === 9;
}

export function getRamadanDay(hijri: HijriDate): number | null {
  return hijri.month === 9 ? hijri.day : null;
}

export function getRamadanThird(hijri: HijriDate): { third: 1 | 2 | 3; nameEn: string; nameAr: string; nameUr: string } | null {
  if (hijri.month !== 9) return null;
  if (hijri.day <= 10) return { third: 1, nameEn: 'Days of Mercy', nameAr: 'أيام الرحمة', nameUr: 'رحمت کے دن' };
  if (hijri.day <= 20) return { third: 2, nameEn: 'Days of Forgiveness', nameAr: 'أيام المغفرة', nameUr: 'مغفرت کے دن' };
  return { third: 3, nameEn: 'Days of Freedom from Fire', nameAr: 'أيام العتق من النار', nameUr: 'جہنم سے آزادی کے دن' };
}

export function getIslamicEvent(hijri: HijriDate): { nameEn: string; nameAr: string; nameUr: string } | null {
  const key = `${hijri.month}-${hijri.day}`;
  const events: Record<string, { nameEn: string; nameAr: string; nameUr: string }> = {
    '1-1': { nameEn: 'Islamic New Year', nameAr: 'رأس السنة الهجرية', nameUr: 'اسلامی نیا سال' },
    '1-10': { nameEn: 'Day of Ashura', nameAr: 'يوم عاشوراء', nameUr: 'یوم عاشورہ' },
    '3-12': { nameEn: 'Mawlid al-Nabi', nameAr: 'المولد النبوي', nameUr: 'عید میلاد النبی' },
    '7-27': { nameEn: 'Isra and Mi\'raj', nameAr: 'الإسراء والمعراج', nameUr: 'شب معراج' },
    '8-15': { nameEn: 'Shab-e-Barat', nameAr: 'ليلة النصف من شعبان', nameUr: 'شب برات' },
    '9-1': { nameEn: 'Start of Ramadan', nameAr: 'بداية رمضان', nameUr: 'رمضان کی شروعات' },
    '9-27': { nameEn: 'Laylat al-Qadr (est.)', nameAr: 'ليلة القدر (تقريباً)', nameUr: 'شب قدر (تخمینا)' },
    '10-1': { nameEn: 'Eid al-Fitr', nameAr: 'عيد الفطر', nameUr: 'عید الفطر' },
    '10-2': { nameEn: 'Eid al-Fitr (Day 2)', nameAr: 'عيد الفطر (اليوم الثاني)', nameUr: 'عید الفطر (دوسرا دن)' },
    '10-3': { nameEn: 'Eid al-Fitr (Day 3)', nameAr: 'عيد الفطر (اليوم الثالث)', nameUr: 'عید الفطر (تیسرا دن)' },
    '12-8': { nameEn: 'Day of Tarwiyah', nameAr: 'يوم التروية', nameUr: 'یوم الترویہ' },
    '12-9': { nameEn: 'Day of Arafah', nameAr: 'يوم عرفة', nameUr: 'یوم عرفہ' },
    '12-10': { nameEn: 'Eid al-Adha', nameAr: 'عيد الأضحى', nameUr: 'عید الاضحی' },
    '12-11': { nameEn: 'Eid al-Adha (Day 2)', nameAr: 'عيد الأضحى (اليوم الثاني)', nameUr: 'عید الاضحی (دوسرا دن)' },
    '12-12': { nameEn: 'Eid al-Adha (Day 3)', nameAr: 'عيد الأضحى (اليوم الثالث)', nameUr: 'عید الاضحی (تیسرا دن)' },
  };
  return events[key] || null;
}

export function toGregorian(hijri: HijriDate, adjustment: number = 0): Date {
  const result = convertToGregorian(hijri.year, hijri.month, hijri.day);
  const date = new Date(result.gy, result.gm - 1, result.gd);
  date.setDate(date.getDate() + adjustment);
  return date;
}

export function getHijriMonthDays(year: number, month: number): number {
  const startOfMonth = convertToGregorian(year, month, 1);
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const startOfNextMonth = convertToGregorian(nextYear, nextMonth, 1);

  const d1 = new Date(startOfMonth.gy, startOfMonth.gm - 1, startOfMonth.gd);
  const d2 = new Date(startOfNextMonth.gy, startOfNextMonth.gm - 1, startOfNextMonth.gd);

  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}
