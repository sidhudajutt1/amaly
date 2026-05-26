import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import { t } from '../../src/i18n';
import {
  requestPermissions,
  cancelAllScheduled,
  scheduleDailyReflection,
  scheduleQuranReminder,
  scheduleAllPrayerNotifications,
  scheduleSuhoorAlert,
  scheduleIftarAlert,
} from '../../src/services/notificationService';
import { calculatePrayerTimes, getRamadanTimes } from '../../src/services/prayerService';
import type { PrayerName, Language } from '../../src/types';

const PRAYER_NAMES: { id: PrayerName; en: string; ar: string; ur: string }[] = [
  { id: 'fajr', en: 'Fajr', ar: 'الفجر', ur: 'فجر' },
  { id: 'dhuhr', en: 'Dhuhr', ar: 'الظهر', ur: 'ظہر' },
  { id: 'asr', en: 'Asr', ar: 'العصر', ur: 'عصر' },
  { id: 'maghrib', en: 'Maghrib', ar: 'المغرب', ur: 'مغرب' },
  { id: 'isha', en: 'Isha', ar: 'العشاء', ur: 'عشاء' },
];

function label(language: Language, en: string, ar: string, ur: string): string {
  return language === 'ar' ? ar : language === 'ur' ? ur : en;
}

export default function NotificationsScreen() {
  const language = useAppStore((s) => s.settings.language);
  const notificationPrefs = useAppStore((s) => s.notificationPrefs);
  const togglePrayerAlert = useAppStore((s) => s.togglePrayerAlert);
  const setNotificationPrefs = useAppStore((s) => s.setNotificationPrefs);
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestPermissions().then(setHasPermission);
    }
  }, []);

  const reschedule = useCallback(async () => {
    await cancelAllScheduled();

    const state = useAppStore.getState();
    const prefs = state.notificationPrefs;
    const { settings } = state;
    const lang = settings.language;

    if (prefs.morningReflection) {
      const [h, m] = (settings.notificationTime || '05:30').split(':').map(Number);
      await scheduleDailyReflection(h, m, lang);
    }
    if (prefs.quranGoal) {
      await scheduleQuranReminder(lang);
    }

    const { locationLat, locationLng, calculationMethod } = settings;
    if (locationLat !== undefined && locationLng !== undefined) {
      const times = calculatePrayerTimes(locationLat, locationLng, new Date(), calculationMethod);
      await scheduleAllPrayerNotifications(times, prefs.prayerAlerts, lang);

      if (prefs.suhoorAlert) {
        const { suhoorEnd } = getRamadanTimes(times);
        await scheduleSuhoorAlert(suhoorEnd, lang);
      }
      if (prefs.iftarAlert) {
        const { iftarTime } = getRamadanTimes(times);
        await scheduleIftarAlert(iftarTime, lang);
      }
    }
  }, []);

  const rescheduleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleReschedule = useCallback(() => {
    if (rescheduleTimer.current) clearTimeout(rescheduleTimer.current);
    rescheduleTimer.current = setTimeout(() => {
      reschedule();
    }, 400);
  }, [reschedule]);

  const handleTogglePrayer = (prayer: PrayerName) => {
    togglePrayerAlert(prayer);
    scheduleReschedule();
  };

  const handleToggle = (key: 'morningReflection' | 'quranGoal' | 'suhoorAlert' | 'iftarAlert') => {
    setNotificationPrefs({ [key]: !notificationPrefs[key] });
    scheduleReschedule();
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermissions();
    setHasPermission(granted);
    if (!granted) {
      Alert.alert(
        label(language, 'Permission Required', 'الإذن مطلوب', 'اجازت درکار ہے'),
        label(language,
          'Please enable notifications in your device settings to receive prayer and reflection reminders.',
          'يرجى تفعيل الإشعارات في إعدادات جهازك.',
          'براہ کرم اپنی ڈیوائس سیٹنگز میں اطلاعات فعال کریں۔'),
      );
    }
  };

  const getName = (prayer: typeof PRAYER_NAMES[number]) => {
    return language === 'ar' ? prayer.ar : language === 'ur' ? prayer.ur : prayer.en;
  };

  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name={language === 'ar' || language === 'ur' ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {label(language, 'Notifications', 'الإشعارات', 'اطلاعات')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {isWeb ? (
        <View style={[styles.webNote, { backgroundColor: theme.surfaceElevated || theme.surface, borderColor: theme.border }]}>
          <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
          <Text style={[styles.webNoteText, { color: theme.textSecondary }]}>
            {t(language, 'notifications.webNote')}
          </Text>
        </View>
      ) : hasPermission === false ? (
        <TouchableOpacity
          style={[styles.permissionBanner, { backgroundColor: `${theme.error || '#C62828'}15`, borderColor: theme.error || '#C62828' }]}
          onPress={handleRequestPermission}
          accessibilityLabel="Enable notifications" accessibilityRole="button"
        >
          <Ionicons name="notifications-off-outline" size={20} color={theme.error || '#C62828'} />
          <Text style={[styles.permissionText, { color: theme.error || '#C62828' }]}>
            {label(language,
              'Notifications are disabled. Tap to enable.',
              'الإشعارات معطلة. اضغط للتفعيل.',
              'اطلاعات غیر فعال ہیں۔ فعال کرنے کے لیے ٹیپ کریں۔')}
          </Text>
        </TouchableOpacity>
      ) : null}

      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {label(language, 'Adhan Alerts', 'تنبيه الأذان', 'اذان الرٹ')}
      </Text>
      <Text style={[styles.sectionDesc, { color: theme.textTertiary || theme.textSecondary }]}>
        {label(language,
          'Get notified when each prayer time arrives.',
          'احصل على إشعار عند حلول وقت كل صلاة.',
          'ہر نماز کے وقت اطلاع حاصل کریں۔')}
      </Text>
      {PRAYER_NAMES.map((prayer) => (
        <View key={prayer.id} style={[styles.row, { borderColor: theme.border }]}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>{getName(prayer)}</Text>
          <Switch
            value={notificationPrefs.prayerAlerts[prayer.id]}
            onValueChange={() => handleTogglePrayer(prayer.id)}
            disabled={isWeb}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </View>
      ))}

      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {label(language, 'Daily Reminders', 'التذكير اليومي', 'یومیہ یاد دہانی')}
      </Text>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>
            {t(language, 'notifications.morningDeed')}
          </Text>
          <Text style={[styles.rowHint, { color: theme.textTertiary || theme.textSecondary }]}>
            {label(language,
              `Daily at ${useAppStore.getState().settings.notificationTime || '05:30'}`,
              `يومياً الساعة ${useAppStore.getState().settings.notificationTime || '05:30'}`,
              `روزانہ ${useAppStore.getState().settings.notificationTime || '05:30'} بجے`)}
          </Text>
        </View>
        <Switch
          value={notificationPrefs.morningReflection}
          onValueChange={() => handleToggle('morningReflection')}
          disabled={isWeb}
          trackColor={{ false: theme.border, true: theme.primary }}
        />
      </View>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>
            {label(language, 'Quran Goal', 'هدف القرآن', 'قرآن ہدف')}
          </Text>
          <Text style={[styles.rowHint, { color: theme.textTertiary || theme.textSecondary }]}>
            {label(language, 'Daily at 8:00 PM', 'يومياً الساعة 8 مساءً', 'روزانہ رات 8 بجے')}
          </Text>
        </View>
        <Switch
          value={notificationPrefs.quranGoal}
          onValueChange={() => handleToggle('quranGoal')}
          disabled={isWeb}
          trackColor={{ false: theme.border, true: theme.primary }}
        />
      </View>

      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {label(language, 'Ramadan', 'رمضان', 'رمضان')}
      </Text>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>
            {label(language, 'Suhoor Alert', 'تنبيه السحور', 'سحری الرٹ')}
          </Text>
          <Text style={[styles.rowHint, { color: theme.textTertiary || theme.textSecondary }]}>
            {label(language, '30 min before Fajr', '30 دقيقة قبل الفجر', 'فجر سے 30 منٹ پہلے')}
          </Text>
        </View>
        <Switch
          value={notificationPrefs.suhoorAlert}
          onValueChange={() => handleToggle('suhoorAlert')}
          disabled={isWeb}
          trackColor={{ false: theme.border, true: theme.primary }}
        />
      </View>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>
            {label(language, 'Iftar Alert', 'تنبيه الإفطار', 'افطار الرٹ')}
          </Text>
          <Text style={[styles.rowHint, { color: theme.textTertiary || theme.textSecondary }]}>
            {label(language, '15 min before Maghrib', '15 دقيقة قبل المغرب', 'مغرب سے 15 منٹ پہلے')}
          </Text>
        </View>
        <Switch
          value={notificationPrefs.iftarAlert}
          onValueChange={() => handleToggle('iftarAlert')}
          disabled={isWeb}
          trackColor={{ false: theme.border, true: theme.primary }}
        />
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: spacing.md,
  },
  title: { fontSize: fontSizes.heading2, fontWeight: '700' },
  webNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  webNoteText: { fontSize: fontSizes.bodySmall, flex: 1, lineHeight: 20 },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  permissionText: { fontSize: fontSizes.bodySmall, fontWeight: '600', flex: 1 },
  sectionHeader: {
    fontSize: fontSizes.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: fontSizes.caption,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: fontSizes.body },
  rowHint: { fontSize: fontSizes.caption, marginTop: 2 },
});
