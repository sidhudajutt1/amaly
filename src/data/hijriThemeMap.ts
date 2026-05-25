/**
 * Maps each Hijri month (1-12) to preferred day indices from dailyReflections[].
 *
 * The 365 daily reflections are organized by theme in their batch origins:
 *   Days 1-16:   Sabr (Patience)         | Days 17-29:  Shukr (Gratitude)
 *   Days 30-45:  Tawakkul (Trust)         | Days 46-54:  Tawbah (Repentance)
 *   Days 55-61:  Ikhlas (Sincerity)       | Days 62-83:  Salah (Prayer)
 *   Days 84-99:  Quran                    | Days 100-115: Dhikr
 *   Days 116-131: Dua                     | Days 132-144: Sadaqah
 *   Days 145-157: Family                  | Days 158-167: Kinship
 *   Days 168-179: Brotherhood             | Days 180-194: Kindness
 *   Days 195-205: Humility                | Days 206-216: Honesty
 *   Days 217-227: Forgiveness             | Days 228-240: Tongue (Speech)
 *   Days 241-253: Ilm (Knowledge)         | Days 254-264: Akhirah (Hereafter)
 *   Days 265-273: Qanaah (Contentment)    | Days 274-281: Siyam (Fasting)
 *   Days 282-287: Qiyam (Night Prayer)    | Days 288-299: Sunnah (Prophetic Way)
 *   Days 300-312: Taqwa (God-consciousness) | Days 313-317: Hilm (Forbearance)
 *   Days 318-325: Rahmah (Mercy)          | Days 326-331: Haya (Modesty)
 *   Days 332-365: Mixed supplemental themes
 *
 * Each Hijri month is assigned thematically aligned day-indices so the niyyah
 * shown to the user resonates with the Islamic significance of that month.
 */

function range(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

export const hijriMonthDayIndices: Record<number, number[]> = {
  // Muharram: patience through trials, repentance for a new year
  1:  [...range(1, 16), ...range(46, 54), ...range(313, 317)],

  // Safar: trust in Allah, seeking protection, forgiveness
  2:  [...range(30, 45), ...range(217, 227)],

  // Rabi al-Awwal: following the Sunnah, mercy (Prophetic month)
  3:  [...range(288, 299), ...range(318, 325), ...range(168, 179)],

  // Rabi al-Thani: seeking knowledge, humility
  4:  [...range(241, 253), ...range(195, 205)],

  // Jumada al-Ula: gratitude, contentment
  5:  [...range(17, 29), ...range(265, 273), ...range(326, 331)],

  // Jumada al-Thani: sincerity, honesty, forbearance
  6:  [...range(55, 61), ...range(206, 216), ...range(313, 317)],

  // Rajab: worship intensification (sacred month) — dua, dhikr
  7:  [...range(116, 131), ...range(100, 115)],

  // Sha'ban: night worship, taqwa, preparing for Ramadan
  8:  [...range(282, 287), ...range(300, 312), ...range(254, 264)],

  // Ramadan: fasting, Quran, salah, qiyam
  9:  [...range(274, 281), ...range(84, 99), ...range(62, 83), ...range(282, 287)],

  // Shawwal: gratitude after Ramadan, kindness, sadaqah
  10: [...range(17, 29), ...range(180, 194)],

  // Dhul Qi'dah: family, kinship, guarding the tongue (sacred month, pre-Hajj)
  11: [...range(145, 157), ...range(158, 167), ...range(228, 240)],

  // Dhul Hijjah: sadaqah/sacrifice, brotherhood, hereafter (Hajj month)
  12: [...range(132, 144), ...range(168, 179), ...range(254, 264)],
};

/**
 * Given a Hijri month (1-12) and day (1-30), returns the preferred
 * dailyReflections[] index (0-based) for that date.
 * Falls back to day-of-year modulo if the theme pool is exhausted.
 */
export function getHijriThemedIndex(hijriMonth: number, hijriDay: number, totalReflections: number): number {
  const pool = hijriMonthDayIndices[hijriMonth];
  if (!pool || pool.length === 0) {
    return (hijriDay - 1) % totalReflections;
  }
  const idx = (hijriDay - 1) % pool.length;
  return (pool[idx] - 1) % totalReflections;
}
