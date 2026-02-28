import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { fontSizes, spacing } from '../../src/theme';

const PRAYER_NAMES = [
  { id: 'fajr', en: 'Fajr', ar: 'الفجر', ur: 'فجر' },
  { id: 'dhuhr', en: 'Dhuhr', ar: 'الظهر', ur: 'ظہر' },
  { id: 'asr', en: 'Asr', ar: 'العصر', ur: 'عصر' },
  { id: 'maghrib', en: 'Maghrib', ar: 'المغرب', ur: 'مغرب' },
  { id: 'isha', en: 'Isha', ar: 'العشاء', ur: 'عشاء' },
] as const;

export default function NotificationsScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();

  const getName = (prayer: typeof PRAYER_NAMES[number]) => {
    return language === 'ar' ? prayer.ar : language === 'ur' ? prayer.ur : prayer.en;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {language === 'ar' ? 'الإشعارات' : language === 'ur' ? 'اطلاعات' : 'Notifications'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={[styles.sectionNote, { color: theme.textSecondary }]}>
        {language === 'ar' ? 'ستتوفر الإشعارات بعد تثبيت التطبيق على هاتفك.' : language === 'ur' ? 'فون پر ایپ انسٹال ہونے کے بعد اطلاعات دستیاب ہوں گی۔' : 'Notifications will be available after installing the app on your phone.'}
      </Text>

      {/* Prayer Adhan Notifications */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {language === 'ar' ? 'تنبيه الأذان' : language === 'ur' ? 'اذان الرٹ' : 'Adhan Alerts'}
      </Text>
      {PRAYER_NAMES.map((prayer) => (
        <View key={prayer.id} style={[styles.row, { borderColor: theme.border }]}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>{getName(prayer)}</Text>
          <Switch
            value={true}
            disabled={true}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </View>
      ))}

      {/* Daily Reminder */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {language === 'ar' ? 'التذكير اليومي' : language === 'ur' ? 'یومیہ یاد دہانی' : 'Daily Reminder'}
      </Text>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>
          {language === 'ar' ? 'تأمل الصباح' : language === 'ur' ? 'صبح کا تأمل' : 'Morning Reflection'}
        </Text>
        <Switch value={true} disabled={true} trackColor={{ false: theme.border, true: theme.primary }} />
      </View>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>
          {language === 'ar' ? 'هدف القرآن' : language === 'ur' ? 'قرآن ہدف' : 'Quran Goal'}
        </Text>
        <Switch value={true} disabled={true} trackColor={{ false: theme.border, true: theme.primary }} />
      </View>

      {/* Ramadan */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {language === 'ar' ? 'رمضان' : language === 'ur' ? 'رمضان' : 'Ramadan'}
      </Text>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>
          {language === 'ar' ? 'تنبيه السحور' : language === 'ur' ? 'سحری الرٹ' : 'Suhoor Alert'}
        </Text>
        <Switch value={true} disabled={true} trackColor={{ false: theme.border, true: theme.primary }} />
      </View>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>
          {language === 'ar' ? 'تنبيه الإفطار' : language === 'ur' ? 'افطار الرٹ' : 'Iftar Alert'}
        </Text>
        <Switch value={true} disabled={true} trackColor={{ false: theme.border, true: theme.primary }} />
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
  sectionNote: { fontSize: fontSizes.bodySmall, textAlign: 'center', marginBottom: spacing.lg, lineHeight: 22 },
  sectionHeader: {
    fontSize: fontSizes.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: fontSizes.body, flex: 1 },
});
