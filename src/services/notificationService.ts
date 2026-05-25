import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { PrayerName } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelAllScheduled(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

const PRAYER_LABELS: Record<PrayerName, { en: string; ar: string; ur: string }> = {
  fajr:    { en: 'Fajr',    ar: 'الفجر',   ur: 'فجر' },
  dhuhr:   { en: 'Dhuhr',   ar: 'الظهر',   ur: 'ظہر' },
  asr:     { en: 'Asr',     ar: 'العصر',   ur: 'عصر' },
  maghrib: { en: 'Maghrib', ar: 'المغرب',  ur: 'مغرب' },
  isha:    { en: 'Isha',    ar: 'العشاء',  ur: 'عشاء' },
};

export async function schedulePrayerNotification(
  prayer: PrayerName,
  time: Date,
  language: 'en' | 'ar' | 'ur',
): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  const now = new Date();
  if (time <= now) return null;

  const label = PRAYER_LABELS[prayer];
  const title = language === 'ar'
    ? `حان وقت ${label.ar}`
    : language === 'ur'
      ? `${label.ur} کا وقت ہو گیا`
      : `Time for ${label.en}`;
  const body = language === 'ar'
    ? 'حي على الصلاة'
    : language === 'ur'
      ? 'نماز کی طرف آؤ'
      : 'Hayya alas salah';

  const secondsUntil = Math.max(1, Math.floor((time.getTime() - now.getTime()) / 1000));

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      data: { type: 'prayer', prayer },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: secondsUntil },
  });
  return id;
}

export async function scheduleDailyReflection(
  hour: number,
  minute: number,
  language: 'en' | 'ar' | 'ur',
): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const title = language === 'ar'
    ? 'تأمل الصباح ✨'
    : language === 'ur'
      ? 'صبح کا تأمل ✨'
      : 'Morning Reflection ✨';
  const body = language === 'ar'
    ? 'نيتك اليومية جاهزة. ابدأ يومك بهدف.'
    : language === 'ur'
      ? 'آپ کی آج کی نیت تیار ہے۔ مقصد کے ساتھ دن کا آغاز کریں۔'
      : 'Your daily niyyah is ready. Start your day with purpose.';

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      data: { type: 'reflection' },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
  return id;
}

export async function scheduleQuranReminder(
  language: 'en' | 'ar' | 'ur',
): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  const title = language === 'ar'
    ? 'هدف القرآن 📖'
    : language === 'ur'
      ? 'قرآن ہدف 📖'
      : 'Quran Goal 📖';
  const body = language === 'ar'
    ? 'لا تنسَ قراءة آيات اليوم.'
    : language === 'ur'
      ? 'آج کی آیات پڑھنا نہ بھولیں۔'
      : "Don't forget to read today's verses.";

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      data: { type: 'quran' },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 20, minute: 0 },
  });
  return id;
}

export async function scheduleSuhoorAlert(
  suhoorTime: Date,
  language: 'en' | 'ar' | 'ur',
): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  const alertTime = new Date(suhoorTime.getTime() - 30 * 60 * 1000);
  const now = new Date();
  if (alertTime <= now) return null;

  const secondsUntil = Math.max(1, Math.floor((alertTime.getTime() - now.getTime()) / 1000));

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: language === 'ar' ? 'وقت السحور 🌙' : language === 'ur' ? 'سحری کا وقت 🌙' : 'Suhoor Time 🌙',
      body: language === 'ar' ? 'السحور بعد 30 دقيقة' : language === 'ur' ? 'سحری 30 منٹ میں' : 'Suhoor in 30 minutes',
      sound: 'default',
      data: { type: 'suhoor' },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: secondsUntil },
  });
  return id;
}

export async function scheduleIftarAlert(
  iftarTime: Date,
  language: 'en' | 'ar' | 'ur',
): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  const alertTime = new Date(iftarTime.getTime() - 15 * 60 * 1000);
  const now = new Date();
  if (alertTime <= now) return null;

  const secondsUntil = Math.max(1, Math.floor((alertTime.getTime() - now.getTime()) / 1000));

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: language === 'ar' ? 'وقت الإفطار 🌅' : language === 'ur' ? 'افطار کا وقت 🌅' : 'Iftar Time 🌅',
      body: language === 'ar' ? 'الإفطار بعد 15 دقيقة' : language === 'ur' ? 'افطار 15 منٹ میں' : 'Iftar in 15 minutes',
      sound: 'default',
      data: { type: 'iftar' },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: secondsUntil },
  });
  return id;
}

export async function scheduleAllPrayerNotifications(
  prayerTimes: Record<PrayerName, Date>,
  enabledPrayers: Record<PrayerName, boolean>,
  language: 'en' | 'ar' | 'ur',
): Promise<void> {
  const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  for (const prayer of prayers) {
    if (enabledPrayers[prayer]) {
      await schedulePrayerNotification(prayer, prayerTimes[prayer], language);
    }
  }
}
