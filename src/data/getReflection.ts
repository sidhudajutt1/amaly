import type { HijriDate } from '../services/hijriService';
import { dailyReflections, type DailyReflection } from './dailyReflections';
import { getSpecialDayReflection } from './specialDayReflections';
import { getHijriThemedIndex } from './hijriThemeMap';

export interface EnrichedReflection extends DailyReflection {
  isSpecialDay: boolean;
  specialEventKey?: string;
}

/**
 * Priority chain:
 *   1. Special day override — if today is a major Islamic occasion, use its bespoke niyyah
 *   2. Hijri-month themed — pick from the thematic pool aligned with the current Hijri month
 *   3. Fallback — simple day-of-year modulo (original behaviour)
 */
export function getSmartReflection(gregorian: Date, hijri: HijriDate): EnrichedReflection {
  const special = getSpecialDayReflection(hijri.month, hijri.day);
  if (special) {
    const base = getFallbackReflection(gregorian);
    return {
      ...base,
      niyyahEn: special.niyyahEn,
      niyyahAr: special.niyyahAr,
      niyyahUr: special.niyyahUr,
      ayahAr: special.ayahAr,
      ayahEn: special.ayahEn,
      ayahUr: special.ayahUr,
      ayahRef: special.ayahRef,
      hadithAr: special.hadithAr,
      hadithEn: special.hadithEn,
      hadithUr: special.hadithUr,
      hadithSource: special.hadithSource,
      isSpecialDay: true,
      specialEventKey: special.eventKey,
    };
  }

  const idx = getHijriThemedIndex(hijri.month, hijri.day, dailyReflections.length);
  const themed = dailyReflections[idx];
  if (themed) {
    return { ...themed, isSpecialDay: false };
  }

  return { ...getFallbackReflection(gregorian), isSpecialDay: false };
}

function getFallbackReflection(date: Date): DailyReflection {
  const start = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const index = dayOfYear % dailyReflections.length;
  return dailyReflections[index];
}
