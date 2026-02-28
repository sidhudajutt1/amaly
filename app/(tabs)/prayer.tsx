import { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { usePrayerTimes } from '../../src/hooks/usePrayerTimes';
import { formatTime } from '../../src/services/prayerService';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import { useLocation } from '../../src/hooks/useLocation';
import { toHijri, formatHijriDate, isRamadan, getRamadanDay } from '../../src/services/hijriService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CircularProgress } from '../../src/components/CircularProgress';
import type { PrayerName } from '../../src/types';

const PRAYER_ORDER: (PrayerName | 'sunrise')[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function PrayerScreen() {
  const language = useAppStore((s) => s.settings.language);
  const todayProgress = useAppStore((s) => s.todayProgress);
  const markPrayerCompleted = useAppStore((s) => s.markPrayerCompleted);
  const locationName = useAppStore((s) => s.settings.locationName);
  const { theme } = useTheme();
  const { prayerTimes, nextPrayer, countdown, currentPrayer } = usePrayerTimes();
  const { locationName: detectedLocation } = useLocation();
  const hijriAdjustment = useAppStore((s) => s.settings.hijriAdjustment);
  const now = new Date();
  const hijri = toHijri(now, hijriAdjustment);
  const hijriStr = formatHijriDate(hijri, language);
  const ramadanDay = getRamadanDay(hijri);

  const textAlign = language === 'ar' || language === 'ur' ? 'right' as const : 'left' as const;

  const countdownProgress = useMemo(() => {
    if (!prayerTimes || !nextPrayer || !currentPrayer) return 0;
    const prayerOrder = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
    const currentIdx = prayerOrder.indexOf(currentPrayer as any);
    const nextIdx = prayerOrder.indexOf(nextPrayer.name as any);
    if (currentIdx < 0 || nextIdx < 0) return 0;

    const currentTime = prayerTimes[prayerOrder[currentIdx] as keyof typeof prayerTimes];
    const nextTime = nextPrayer.time;
    if (!currentTime || !nextTime) return 0;

    const total = nextTime.getTime() - currentTime.getTime();
    const elapsed = new Date().getTime() - currentTime.getTime();
    if (total <= 0) return 0;
    return Math.min(Math.max(elapsed / total, 0), 1);
  }, [prayerTimes, nextPrayer, currentPrayer]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Location */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.locationText, { color: theme.textSecondary }]}>
          {detectedLocation}
        </Text>
      </View>

      {/* Next Prayer Countdown */}
      {nextPrayer && countdown && (
        <View style={[styles.countdownCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
          <View style={styles.countdownRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.countdownLabel, { color: theme.textSecondary }]}>
                {t(language, 'prayer.nextPrayer')}
              </Text>
              <Text style={[styles.countdownPrayer, { color: theme.primary }]}>
                {t(language, `prayer.${nextPrayer.name}`)}
              </Text>
              <Text style={[styles.countdownTimeText, { color: theme.text }]}>
                {formatTime(nextPrayer.time)}
              </Text>
            </View>
            <CircularProgress
              size={80}
              strokeWidth={6}
              progress={countdownProgress}
              color={theme.primary}
              backgroundColor={theme.border}
            >
              <Text style={[styles.countdownInner, { color: theme.primary }]}>
                {`${countdown.hours > 0 ? `${countdown.hours}h` : ''}${countdown.minutes}m`}
              </Text>
            </CircularProgress>
          </View>
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
                <Ionicons name="radio-button-on" size={8} color={theme.primary} />
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

      {/* Hijri + Gregorian Date */}
      <View style={[styles.hijriCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.hijriDateText, { color: theme.text }]}>
          {hijriStr}
        </Text>
        <Text style={[styles.gregorianDateText, { color: theme.textTertiary }]}>
          {now.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </Text>
        {ramadanDay !== null && (
          <View style={[styles.ramadanInfo, { borderTopColor: theme.border }]}>
            <MaterialCommunityIcons name="moon-waning-crescent" size={14} color={theme.primary} />
            <Text style={[styles.ramadanLabel, { color: theme.primary }]}>
              {`${t(language, 'ramadan.day')} ${ramadanDay} ${t(language, 'ramadan.ofRamadan')}`}
            </Text>
          </View>
        )}
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
  locationIcon: { fontSize: 16, marginEnd: spacing.xs },
  locationText: { fontSize: fontSizes.bodySmall },
  countdownCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 2,
  },
  countdownRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countdownLabel: { fontSize: fontSizes.bodySmall, marginBottom: spacing.xs },
  countdownPrayer: { fontSize: fontSizes.heading1, fontWeight: '800', marginBottom: spacing.xs },
  countdownTimeText: { fontSize: fontSizes.bodySmall, marginTop: spacing.xs },
  countdownInner: { fontSize: fontSizes.caption, fontWeight: '700', textAlign: 'center' },
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
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayedText: { fontSize: 18, fontWeight: '700' },
  hijriCard: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  hijriDateText: { fontSize: fontSizes.body, fontWeight: '600', marginBottom: spacing.xs },
  gregorianDateText: { fontSize: fontSizes.bodySmall },
  ramadanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  ramadanLabel: { fontSize: fontSizes.caption, fontWeight: '600' },
});
