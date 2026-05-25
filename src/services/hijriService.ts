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

export type EventSignificance = 'major' | 'notable' | 'period';

export interface IslamicEvent {
  nameEn: string;
  nameAr: string;
  nameUr: string;
  significance: EventSignificance;
}

const ISLAMIC_EVENTS: Record<string, IslamicEvent> = {
  // ── Muharram (1) ──
  '1-1':  { nameEn: 'Islamic New Year', nameAr: 'رأس السنة الهجرية', nameUr: 'اسلامی نیا سال', significance: 'major' },
  '1-9':  { nameEn: 'Tasu\'a', nameAr: 'تاسوعاء', nameUr: 'تاسوعا', significance: 'notable' },
  '1-10': { nameEn: 'Day of Ashura', nameAr: 'يوم عاشوراء', nameUr: 'یوم عاشورہ', significance: 'major' },

  // ── Safar (2) ──
  '2-28': { nameEn: 'Wafat of Prophet ﷺ (narration)', nameAr: 'وفاة النبي ﷺ (رواية)', nameUr: 'وصال نبی ﷺ (روایت)', significance: 'notable' },

  // ── Rajab (7) ──
  '7-1':  { nameEn: 'Start of Sacred Months', nameAr: 'بداية الأشهر الحرم', nameUr: 'حرمت والے مہینوں کی شروعات', significance: 'period' },
  '7-27': { nameEn: 'Isra and Mi\'raj', nameAr: 'الإسراء والمعراج', nameUr: 'شب معراج', significance: 'major' },

  // ── Sha'ban (8) ──
  '8-1':  { nameEn: 'Start of Sha\'ban', nameAr: 'بداية شعبان', nameUr: 'شعبان کا آغاز', significance: 'period' },
  '8-15': { nameEn: 'Shab-e-Barat (Laylat al-Bara\'ah)', nameAr: 'ليلة النصف من شعبان', nameUr: 'شب برات', significance: 'major' },

  // ── Ramadan (9) ──
  '9-1':  { nameEn: 'Start of Ramadan', nameAr: 'بداية رمضان المبارك', nameUr: 'رمضان المبارک کا آغاز', significance: 'major' },
  '9-17': { nameEn: 'Battle of Badr', nameAr: 'غزوة بدر الكبرى', nameUr: 'غزوہ بدر', significance: 'notable' },
  '9-21': { nameEn: 'Laylat al-Qadr (odd night)', nameAr: 'ليلة القدر (ليلة وتر)', nameUr: 'شب قدر (طاق رات)', significance: 'notable' },
  '9-23': { nameEn: 'Laylat al-Qadr (odd night)', nameAr: 'ليلة القدر (ليلة وتر)', nameUr: 'شب قدر (طاق رات)', significance: 'notable' },
  '9-25': { nameEn: 'Laylat al-Qadr (odd night)', nameAr: 'ليلة القدر (ليلة وتر)', nameUr: 'شب قدر (طاق رات)', significance: 'notable' },
  '9-27': { nameEn: 'Laylat al-Qadr (most likely)', nameAr: 'ليلة القدر (الأرجح)', nameUr: 'شب قدر (سب سے زیادہ متوقع)', significance: 'major' },
  '9-29': { nameEn: 'Laylat al-Qadr (odd night)', nameAr: 'ليلة القدر (ليلة وتر)', nameUr: 'شب قدر (طاق رات)', significance: 'notable' },

  // ── Shawwal (10) ──
  '10-1': { nameEn: 'Eid al-Fitr', nameAr: 'عيد الفطر المبارك', nameUr: 'عید الفطر', significance: 'major' },
  '10-2': { nameEn: 'Eid al-Fitr (Day 2)', nameAr: 'عيد الفطر (اليوم الثاني)', nameUr: 'عید الفطر (دوسرا دن)', significance: 'major' },
  '10-3': { nameEn: 'Eid al-Fitr (Day 3)', nameAr: 'عيد الفطر (اليوم الثالث)', nameUr: 'عید الفطر (تیسرا دن)', significance: 'major' },

  // ── Dhul Qi'dah (11) ──
  '11-1': { nameEn: 'Start of Dhul Qi\'dah', nameAr: 'بداية ذو القعدة', nameUr: 'ذوالقعدہ کا آغاز', significance: 'period' },

  // ── Dhul Hijjah (12) ──
  '12-1': { nameEn: 'Start of Dhul Hijjah', nameAr: 'بداية ذو الحجة', nameUr: 'ذوالحجہ کا آغاز', significance: 'period' },
  '12-8': { nameEn: 'Day of Tarwiyah', nameAr: 'يوم التروية', nameUr: 'یوم الترویہ', significance: 'notable' },
  '12-9': { nameEn: 'Day of Arafah', nameAr: 'يوم عرفة', nameUr: 'یوم عرفہ', significance: 'major' },
  '12-10': { nameEn: 'Eid al-Adha', nameAr: 'عيد الأضحى المبارك', nameUr: 'عید الاضحی', significance: 'major' },
  '12-11': { nameEn: 'Eid al-Adha (Day 2)', nameAr: 'عيد الأضحى (اليوم الثاني)', nameUr: 'عید الاضحی (دوسرا دن)', significance: 'major' },
  '12-12': { nameEn: 'Eid al-Adha (Day 3)', nameAr: 'عيد الأضحى (اليوم الثالث)', nameUr: 'عید الاضحی (تیسرا دن)', significance: 'major' },
  '12-13': { nameEn: 'Last Day of Tashreeq', nameAr: 'آخر أيام التشريق', nameUr: 'ایام تشریق کا آخری دن', significance: 'notable' },
};

export function getIslamicEvent(hijri: HijriDate): IslamicEvent | null {
  const key = `${hijri.month}-${hijri.day}`;
  return ISLAMIC_EVENTS[key] || null;
}

export function isFirstTenDhulHijjah(hijri: HijriDate): boolean {
  return hijri.month === 12 && hijri.day >= 1 && hijri.day <= 10;
}

export function isDayOfTashreeq(hijri: HijriDate): boolean {
  return hijri.month === 12 && hijri.day >= 11 && hijri.day <= 13;
}

export function isLastTenRamadan(hijri: HijriDate): boolean {
  return hijri.month === 9 && hijri.day >= 21;
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
