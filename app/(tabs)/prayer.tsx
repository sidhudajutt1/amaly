import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { usePrayerTimes } from '../../src/hooks/usePrayerTimes';
import { formatTime } from '../../src/services/prayerService';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import type { PrayerName } from '../../src/types';

const PRAYER_ORDER: (PrayerName | 'sunrise')[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function PrayerScreen() {
  const language = useAppStore((s) => s.settings.language);
  const todayProgress = useAppStore((s) => s.todayProgress);
  const markPrayerCompleted = useAppStore((s) => s.markPrayerCompleted);
  const locationName = useAppStore((s) => s.settings.locationName);
  const { theme } = useTheme();
  const { prayerTimes, nextPrayer, countdown, currentPrayer } = usePrayerTimes();

  const textAlign = language === 'ar' || language === 'ur' ? 'right' as const : 'left' as const;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Location */}
      <View style={styles.locationRow}>
        <Text style={[styles.locationIcon]}>📍</Text>
        <Text style={[styles.locationText, { color: theme.textSecondary }]}>
          {locationName || 'Makkah, Saudi Arabia'}
        </Text>
      </View>

      {/* Next Prayer Countdown */}
      {nextPrayer && countdown && (
        <View style={[styles.countdownCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
          <Text style={[styles.countdownLabel, { color: theme.textSecondary }]}>
            {t(language, 'prayer.nextPrayer')}
          </Text>
          <Text style={[styles.countdownPrayer, { color: theme.primary }]}>
            {t(language, `prayer.${nextPrayer.name}`)}
          </Text>
          <Text style={[styles.countdownTime, { color: theme.primary }]}>
            {countdown.hours > 0 ? `${countdown.hours}${t(language, 'prayer.hours')} ` : ''}
            {countdown.minutes}{t(language, 'prayer.minutes')}
          </Text>
        </View>
      )}

      {/* Prayer Times List */}
      {prayerTimes && PRAYER_ORDER.map((name) => {
        const time = prayerTimes[name === 'sunrise' ? 'sunrise' : name];
        if (!time) return null;
        const isCurrent = currentPrayer === name;
        const isNext = nextPrayer?.name === name;
        const isPrayer = name !== 'sunrise';
        const isPrayed = isPrayer && todayProgress.prayersCompleted.includes(name as PrayerName);

        return (
          <View
            key={name}
            style={[
              styles.prayerRow,
              {
                backgroundColor: isNext ? theme.primaryLight : theme.surface,
                borderColor: isNext ? theme.primary : theme.border,
              },
            ]}
          >
            <View style={styles.prayerInfo}>
              <Text
                style={[
                  styles.prayerName,
                  {
                    color: isNext ? theme.primary : theme.text,
                    fontWeight: isNext ? '700' : '500',
                  },
                ]}
              >
                {t(language, `prayer.${name}`)}
              </Text>
              {isCurrent && (
                <Text style={[styles.currentBadge, { color: theme.primary }]}>●</Text>
              )}
            </View>
            <View style={styles.prayerActions}>
              <Text style={[styles.prayerTime, { color: isNext ? theme.primary : theme.text }]}>
                {formatTime(time)}
              </Text>
              {isPrayer && (
                <TouchableOpacity
                  onPress={() => markPrayerCompleted(name as PrayerName)}
                  style={[
                    styles.prayedButton,
                    {
                      backgroundColor: isPrayed ? theme.success : 'transparent',
                      borderColor: isPrayed ? theme.success : theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.prayedText, { color: isPrayed ? '#fff' : theme.textTertiary }]}>
                    {isPrayed ? '✓' : '○'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      {/* Hijri Date */}
      <View style={[styles.hijriCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.hijriText, { color: theme.textSecondary }]}>
          {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  locationIcon: { fontSize: 16, marginRight: spacing.xs },
  locationText: { fontSize: fontSizes.bodySmall },
  countdownCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
  },
  countdownLabel: { fontSize: fontSizes.bodySmall, marginBottom: spacing.xs },
  countdownPrayer: { fontSize: fontSizes.heading1, fontWeight: '800', marginBottom: spacing.xs },
  countdownTime: { fontSize: fontSizes.heading2, fontWeight: '600' },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  prayerInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  prayerName: { fontSize: fontSizes.body },
  currentBadge: { fontSize: 8 },
  prayerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  prayerTime: { fontSize: fontSizes.body, fontWeight: '600' },
  prayedButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayedText: { fontSize: 16, fontWeight: '700' },
  hijriCard: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  hijriText: { fontSize: fontSizes.bodySmall },
});
