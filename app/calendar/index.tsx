import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import {
  toHijri,
  toGregorian,
  getHijriMonthName,
  getHijriMonthDays,
  getIslamicEvent,
} from '../../src/services/hijriService';
import { calculatePrayerTimes, formatTime } from '../../src/services/prayerService';

const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_AR = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const WEEKDAYS_UR = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

export default function CalendarScreen() {
  const language = useAppStore((s) => s.settings.language);
  const hijriAdjustment = useAppStore((s) => s.settings.hijriAdjustment);
  const calcMethod = useAppStore((s) => s.settings.calculationMethod);
  const locationLat = useAppStore((s) => s.settings.locationLat) ?? 21.4225;
  const locationLng = useAppStore((s) => s.settings.locationLng) ?? 39.8262;
  const { theme } = useTheme();

  const todayHijri = toHijri(new Date(), hijriAdjustment);
  const [viewMonth, setViewMonth] = useState(todayHijri.month);
  const [viewYear, setViewYear] = useState(todayHijri.year);
  const [selectedDay, setSelectedDay] = useState<number | null>(todayHijri.day);

  const weekdays = language === 'ar' ? WEEKDAYS_AR : language === 'ur' ? WEEKDAYS_UR : WEEKDAYS_EN;

  const daysInMonth = useMemo(() => getHijriMonthDays(viewYear, viewMonth), [viewYear, viewMonth]);

  const firstDayWeekday = useMemo(() => {
    const greg = toGregorian({ day: 1, month: viewMonth, year: viewYear }, hijriAdjustment);
    return greg.getDay();
  }, [viewYear, viewMonth, hijriAdjustment]);

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayWeekday; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [daysInMonth, firstDayWeekday]);

  const isToday = (day: number) =>
    day === todayHijri.day && viewMonth === todayHijri.month && viewYear === todayHijri.year;

  const goNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDay(null);
  };

  const goPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDay(null);
  };

  const goToToday = () => {
    setViewMonth(todayHijri.month);
    setViewYear(todayHijri.year);
    setSelectedDay(todayHijri.day);
  };

  const monthEvents = useMemo(() => {
    const events: { day: number; event: { nameEn: string; nameAr: string; nameUr: string } }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const ev = getIslamicEvent({ day: d, month: viewMonth, year: viewYear });
      if (ev) events.push({ day: d, event: ev });
    }
    return events;
  }, [viewMonth, viewYear, daysInMonth]);

  const selectedPrayerTimes = useMemo(() => {
    if (!selectedDay) return null;
    const greg = toGregorian({ day: selectedDay, month: viewMonth, year: viewYear }, hijriAdjustment);
    return calculatePrayerTimes(locationLat, locationLng, greg, calcMethod);
  }, [selectedDay, viewMonth, viewYear, hijriAdjustment, locationLat, locationLng, calcMethod]);

  const monthName = getHijriMonthName(viewMonth, language);
  const isRtl = language === 'ar' || language === 'ur';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name={language === 'ar' || language === 'ur' ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {t(language, 'calendar.title')}
        </Text>
        <TouchableOpacity onPress={goToToday}>
          <Text style={[styles.todayLink, { color: theme.primary }]}>
            {t(language, 'calendar.today')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Month Navigation */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={goPrevMonth} accessibilityLabel="Previous month">
          <Ionicons name={isRtl ? 'chevron-forward' : 'chevron-back'} size={28} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.monthCenter}>
          <Text style={[styles.monthName, { color: theme.text }]}>{monthName}</Text>
          <Text style={[styles.yearText, { color: theme.textSecondary }]}>{viewYear} AH</Text>
        </View>
        <TouchableOpacity onPress={goNextMonth} accessibilityLabel="Next month">
          <Ionicons name={isRtl ? 'chevron-back' : 'chevron-forward'} size={28} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekRow}>
        {weekdays.map((day, i) => (
          <View key={i} style={styles.weekCell}>
            <Text style={[styles.weekLabel, { color: i === 5 ? theme.primary : theme.textSecondary }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.grid}>
        {calendarDays.map((day, i) => {
          if (day === null) {
            return <View key={i} style={styles.dayCell} />;
          }
          const today = isToday(day);
          const selected = day === selectedDay;
          const event = getIslamicEvent({ day, month: viewMonth, year: viewYear });

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.dayCell,
                today && { backgroundColor: theme.primary },
                selected && !today && { backgroundColor: theme.primaryLight },
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.dayText,
                { color: today ? '#fff' : selected ? theme.primary : theme.text },
                today && { fontWeight: '700' },
              ]}>
                {day}
              </Text>
              {event && (
                <View style={[styles.eventDot, { backgroundColor: today ? '#fff' : theme.primary }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Events for This Month */}
      {monthEvents.length > 0 && (
        <View style={[styles.eventsSection, { borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t(language, 'calendar.events')}
          </Text>
          {monthEvents.map(({ day, event }) => (
            <TouchableOpacity
              key={day}
              style={[styles.eventRow, { borderColor: theme.border }]}
              onPress={() => setSelectedDay(day)}
            >
              <View style={[styles.eventDayBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.eventDayText, { color: theme.primary }]}>{day}</Text>
              </View>
              <Text style={[styles.eventName, { color: theme.text }]}>
                {language === 'ar' ? event.nameAr : language === 'ur' ? event.nameUr : event.nameEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Prayer Times for Selected Day */}
      {selectedDay && selectedPrayerTimes && (
        <View style={[styles.prayerSection, { borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {`${t(language, 'calendar.prayerTimes')} — ${selectedDay} ${monthName}`}
          </Text>
          {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((name) => (
            <View key={name} style={[styles.prayerRow, { borderColor: theme.border }]}>
              <Text style={[styles.prayerName, { color: theme.text }]}>
                {t(language, `prayer.${name}`)}
              </Text>
              <Text style={[styles.prayerTime, { color: theme.text }]}>
                {formatTime(selectedPrayerTimes[name])}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: spacing.xxl * 2 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: { fontSize: fontSizes.heading2, fontWeight: '700' },
  todayLink: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  monthCenter: { alignItems: 'center' },
  monthName: { fontSize: fontSizes.heading2, fontWeight: '700' },
  yearText: { fontSize: fontSizes.bodySmall },
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekCell: { flex: 1, alignItems: 'center' },
  weekLabel: { fontSize: fontSizes.caption, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  dayText: { fontSize: fontSizes.body },
  eventDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  eventsSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: fontSizes.heading3,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  eventDayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDayText: { fontSize: fontSizes.bodySmall, fontWeight: '700' },
  eventName: { fontSize: fontSizes.body, flex: 1 },
  prayerSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  prayerName: { fontSize: fontSizes.body },
  prayerTime: { fontSize: fontSizes.body, fontWeight: '600' },
});
