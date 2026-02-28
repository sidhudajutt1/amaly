import type { DailyGoal, GoalConfig, UserProgress, PrayerName } from '../types';
import type { HijriDate } from '../types';

const PRAYER_NAMES: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export function generateDailyGoals(
  config: GoalConfig,
  progress: UserProgress,
  hijri: HijriDate,
  dayOfWeek: number,
): DailyGoal[] {
  const goals: DailyGoal[] = [];
  const isRamadan = hijri.month === 9;
  const isFriday = dayOfWeek === 5;
  const isMondayOrThursday = dayOfWeek === 1 || dayOfWeek === 4;

  if (config.prayerGoalEnabled) {
    goals.push({
      id: 'prayers',
      type: 'prayer',
      titleEn: 'Complete 5 Daily Prayers',
      titleAr: 'أكمل الصلوات الخمس',
      titleUr: 'پانچ نمازیں مکمل کریں',
      target: 5,
      completed: progress.prayersCompleted.length,
      isCompleted: progress.prayersCompleted.length >= 5,
    });
  }

  if (config.quranGoalEnabled) {
    goals.push({
      id: 'quran',
      type: 'quran',
      titleEn: `Read ${config.quranVersesPerDay} Quran verses`,
      titleAr: `اقرأ ${config.quranVersesPerDay} آيات من القرآن`,
      titleUr: `${config.quranVersesPerDay} قرآنی آیات پڑھیں`,
      target: config.quranVersesPerDay,
      completed: progress.quranVersesRead,
      isCompleted: progress.quranVersesRead >= config.quranVersesPerDay,
    });
  }

  if (config.dhikrGoalEnabled && config.morningAdhkarEnabled) {
    goals.push({
      id: 'morning-adhkar',
      type: 'dhikr',
      titleEn: 'Morning Adhkar',
      titleAr: 'أذكار الصباح',
      titleUr: 'صبح کے اذکار',
      target: 1,
      completed: progress.morningAdhkarDone ? 1 : 0,
      isCompleted: progress.morningAdhkarDone,
    });
  }

  if (config.dhikrGoalEnabled && config.eveningAdhkarEnabled) {
    goals.push({
      id: 'evening-adhkar',
      type: 'dhikr',
      titleEn: 'Evening Adhkar',
      titleAr: 'أذكار المساء',
      titleUr: 'شام کے اذکار',
      target: 1,
      completed: progress.eveningAdhkarDone ? 1 : 0,
      isCompleted: progress.eveningAdhkarDone,
    });
  }

  if (isFriday) {
    goals.push({
      id: 'friday-kahf',
      type: 'quran',
      titleEn: 'Recite Surah Al-Kahf',
      titleAr: 'اقرأ سورة الكهف',
      titleUr: 'سورۃ الکہف پڑھیں',
      target: 1,
      completed: 0,
      isCompleted: false,
    });
  }

  if (config.fastingGoalEnabled && isMondayOrThursday && !isRamadan) {
    goals.push({
      id: 'sunnah-fast',
      type: 'fasting',
      titleEn: 'Sunnah Fast (Monday/Thursday)',
      titleAr: 'صيام السنة (الإثنين/الخميس)',
      titleUr: 'سنت روزہ (پیر/جمعرات)',
      target: 1,
      completed: progress.fastingDone ? 1 : 0,
      isCompleted: progress.fastingDone,
    });
  }

  if (isRamadan) {
    goals.push({
      id: 'ramadan-fast',
      type: 'fasting',
      titleEn: 'Ramadan Fast',
      titleAr: 'صيام رمضان',
      titleUr: 'رمضان کا روزہ',
      target: 1,
      completed: progress.fastingDone ? 1 : 0,
      isCompleted: progress.fastingDone,
    });

    goals.push({
      id: 'taraweeh',
      type: 'prayer',
      titleEn: 'Pray Taraweeh',
      titleAr: 'صلاة التراويح',
      titleUr: 'نماز تراویح',
      target: 1,
      completed: 0,
      isCompleted: false,
    });
  }

  if (config.sadaqahGoalEnabled) {
    goals.push({
      id: 'sadaqah',
      type: 'sadaqah',
      titleEn: 'Give Sadaqah',
      titleAr: 'تصدّق',
      titleUr: 'صدقہ دیں',
      target: 1,
      completed: progress.sadaqahDone ? 1 : 0,
      isCompleted: progress.sadaqahDone,
    });
  }

  goals.push({
    id: 'mulk',
    type: 'quran',
    titleEn: 'Recite Surah Al-Mulk before sleeping',
    titleAr: 'اقرأ سورة الملك قبل النوم',
    titleUr: 'سونے سے پہلے سورۃ الملک پڑھیں',
    target: 1,
    completed: 0,
    isCompleted: false,
  });

  config.customGoals.forEach((custom, i) => {
    const customId = `custom-${i}`;
    goals.push({
      id: customId,
      type: 'custom',
      titleEn: custom.titleEn,
      titleAr: custom.titleAr,
      titleUr: custom.titleUr,
      target: 1,
      completed: progress.customGoalsCompleted.includes(customId) ? 1 : 0,
      isCompleted: progress.customGoalsCompleted.includes(customId),
    });
  });

  return goals;
}

export function getGoalsSummary(goals: DailyGoal[]): {
  total: number;
  completed: number;
  prayersDone: number;
  prayersTotal: number;
  quranDone: boolean;
  dhikrDone: number;
  dhikrTotal: number;
} {
  const prayerGoal = goals.find((g) => g.id === 'prayers');
  const quranGoal = goals.find((g) => g.id === 'quran');
  const dhikrGoals = goals.filter((g) => g.type === 'dhikr');

  return {
    total: goals.length,
    completed: goals.filter((g) => g.isCompleted).length,
    prayersDone: prayerGoal?.completed ?? 0,
    prayersTotal: prayerGoal?.target ?? 5,
    quranDone: quranGoal?.isCompleted ?? false,
    dhikrDone: dhikrGoals.filter((g) => g.isCompleted).length,
    dhikrTotal: dhikrGoals.length,
  };
}

export function getStreakMilestone(streak: number): number | null {
  const milestones = [1, 3, 7, 14, 30, 60, 100, 365];
  return milestones.includes(streak) ? streak : null;
}

export const DEFAULT_GOAL_CONFIG: GoalConfig = {
  prayerGoalEnabled: true,
  quranGoalEnabled: true,
  quranVersesPerDay: 5,
  dhikrGoalEnabled: true,
  morningAdhkarEnabled: true,
  eveningAdhkarEnabled: true,
  fastingGoalEnabled: true,
  sadaqahGoalEnabled: false,
  customGoals: [],
};
