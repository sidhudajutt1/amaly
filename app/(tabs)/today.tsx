import { useState, useMemo, useRef, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Share } from 'react-native';
import * as ExpoSharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { t } from '../../src/i18n';
import { useTheme } from '../../src/hooks/useTheme';
import { useLocation } from '../../src/hooks/useLocation';
import { usePrayerTimes } from '../../src/hooks/usePrayerTimes';
import { formatTime } from '../../src/services/prayerService';
import { CircularProgress } from '../../src/components/CircularProgress';
import { StreakCelebration } from '../../src/components/StreakCelebration';
import { IslamicPattern } from '../../src/components/IslamicPattern';
import { toHijri, formatHijriDate, getRamadanDay, getRamadanThird, getIslamicEvent } from '../../src/services/hijriService';
import { generateDailyGoals, getGoalsSummary, getStreakMilestone } from '../../src/services/goalsService';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getQuranFontFamily, getArabicFontFamily } from '../../src/theme/typography';
import { getSmartReflection } from '../../src/data/getReflection';
import { hapticLight, hapticSuccess } from '../../src/utils/haptics';
import type { Language, GoalType } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const QUICK_SURAHS = [
  { id: 18, nameKey: 'surah.alKahf' },
  { id: 67, nameKey: 'surah.alMulk' },
  { id: 36, nameKey: 'surah.yasin' },
  { id: 55, nameKey: 'surah.arRahman' },
  { id: 56, nameKey: 'surah.alWaqiah' },
  { id: 0, nameKey: 'surah.ayatAlKursi' },
];

function getGoalIcon(type: GoalType): { name: string; family: 'ionicons' | 'material' } {
  switch (type) {
    case 'prayer': return { name: 'mosque', family: 'material' };
    case 'quran': return { name: 'book-open-page-variant-outline', family: 'material' };
    case 'dhikr': return { name: 'counter', family: 'material' };
    case 'fasting': return { name: 'moon-waning-crescent', family: 'material' };
    case 'sadaqah': return { name: 'heart-outline', family: 'ionicons' };
    case 'custom': return { name: 'flag-outline', family: 'ionicons' };
    default: return { name: 'checkmark-circle-outline', family: 'ionicons' };
  }
}

function AnimatedPressable({ children, onPress, style, disabled, accessibilityLabel, accessibilityHint }: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 0.97, friction: 8, tension: 100, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start();
  }, [scaleAnim]);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.9}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

function getAutoTrackedHint(goalId: string, language: Language): string | null {
  if (goalId === 'prayers') return t(language, 'goals.autoTrackedPrayers');
  if (goalId === 'quran') return t(language, 'goals.autoTrackedQuran');
  if (goalId === 'friday-kahf' || goalId === 'mulk' || goalId === 'taraweeh') {
    return t(language, 'goals.autoTrackedSurah');
  }
  return null;
}

export default function TodayScreen() {
  const language = useAppStore((s) => s.settings.language);
  const streakData = useAppStore((s) => s.streakData);
  const todayProgress = useAppStore((s) => s.todayProgress);
  const goalConfig = useAppStore((s) => s.goalConfig);
  const hijriAdjustment = useAppStore((s) => s.settings.hijriAdjustment);
  const markNiyyahCompleted = useAppStore((s) => s.markNiyyahCompleted);
  const markMorningAdhkar = useAppStore((s) => s.markMorningAdhkar);
  const markEveningAdhkar = useAppStore((s) => s.markEveningAdhkar);
  const markFasting = useAppStore((s) => s.markFasting);
  const markSadaqah = useAppStore((s) => s.markSadaqah);
  const markStreakCelebrationShown = useAppStore((s) => s.markStreakCelebrationShown);
  const { theme } = useTheme();
  const { locationName } = useLocation();
  const { prayerTimes, nextPrayer, countdown, currentPrayer } = usePrayerTimes();

  const progressAnim = useRef(new Animated.Value(0)).current;
  const niyyahCardRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);

  const now = new Date();
  const hijri = toHijri(now, hijriAdjustment);
  const hijriStr = formatHijriDate(hijri, language);
  const ramadanDay = getRamadanDay(hijri);
  const ramadanThird = getRamadanThird(hijri);
  const islamicEvent = getIslamicEvent(hijri);
  const dayOfWeek = now.getDay();

  const goals = useMemo(
    () => generateDailyGoals(goalConfig, todayProgress, hijri, dayOfWeek),
    [goalConfig, todayProgress, hijri.month, hijri.day, hijri.year, dayOfWeek]
  );
  const summary = useMemo(() => getGoalsSummary(goals), [goals]);

  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const maybeCelebrate = useCallback(() => {
    if (useAppStore.getState().todayProgress.streakCelebrationShown) return;
    const progress = useAppStore.getState().todayProgress;
    const config = useAppStore.getState().goalConfig;
    const streak = useAppStore.getState().streakData;
    const freshGoals = generateDailyGoals(config, progress, hijri, dayOfWeek);
    const freshSummary = getGoalsSummary(freshGoals);
    const allDone = freshSummary.total > 0 && freshSummary.completed === freshSummary.total;
    const milestone = getStreakMilestone(streak.currentStreak);
    if (allDone || (milestone !== null && streak.currentStreak > 0)) {
      setCelebrationVisible(true);
    }
  }, [hijri, dayOfWeek]);

  const countdownProgress = useMemo(() => {
    if (!prayerTimes || !nextPrayer || !currentPrayer) return 0;
    const prayerOrder = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
    const currentIdx = prayerOrder.indexOf(currentPrayer as any);
    if (currentIdx < 0) return 0;
    const currentTime = prayerTimes[prayerOrder[currentIdx] as keyof typeof prayerTimes];
    if (!currentTime) return 0;
    const total = nextPrayer.time.getTime() - currentTime.getTime();
    const elapsed = new Date().getTime() - currentTime.getTime();
    if (total <= 0) return 0;
    return Math.min(Math.max(elapsed / total, 0), 1);
  }, [prayerTimes, nextPrayer, currentPrayer]);

  const reflection = useMemo(() => getSmartReflection(now, hijri), [now.toDateString(), hijri.month, hijri.day]);

  const handleShareNiyyah = useCallback(async () => {
    setSharing(true);
    try {
      const isAvailable = await ExpoSharing.isAvailableAsync();
      if (isAvailable && niyyahCardRef.current) {
        const uri = await captureRef(niyyahCardRef, { format: 'png', quality: 1 });
        await ExpoSharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: "Share today's deed" });
      } else {
        const niyyahText = language === 'ur' ? reflection.niyyahUr : language === 'ar' ? reflection.niyyahAr : reflection.niyyahEn;
        await Share.share({ message: `${niyyahText}\n\n— Amaly App`, title: "Today's Deed" });
      }
    } catch {
      // user cancelled or silently dismissed
    } finally {
      setSharing(false);
    }
  }, [language, reflection]);
  const textAlign = language === 'ar' || language === 'ur' ? 'right' as const : 'left' as const;
  const isRtl = language === 'ar' || language === 'ur';
  const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const handleGoalPress = (goalId: string) => {
    hapticLight();
    switch (goalId) {
      case 'morning-adhkar': markMorningAdhkar(); break;
      case 'evening-adhkar': markEveningAdhkar(); break;
      case 'ramadan-fast':
      case 'sunnah-fast': markFasting(); break;
      case 'sadaqah': markSadaqah(); break;
      default:
        if (goalId.startsWith('custom-')) {
          useAppStore.getState().markCustomGoal(goalId);
        }
        break;
    }
    setTimeout(maybeCelebrate, 0);
  };

  const handleNiyyahPress = () => {
    hapticSuccess();
    markNiyyahCompleted();
    setTimeout(maybeCelebrate, 0);
  };

  const dismissCelebration = () => {
    setCelebrationVisible(false);
    markStreakCelebrationShown();
  };

  const progressPercent = summary.total > 0 ? (summary.completed / summary.total) * 100 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Date Header ─────────────────────────────────────────────── */}
      <View style={styles.dateHeader} accessibilityRole="header">
        <Text style={[styles.locationLabel, { color: theme.textSecondary }]} accessibilityLabel={`Location: ${locationName}`}>
          {locationName}
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/calendar')}
          accessibilityRole="button"
          accessibilityLabel={`${t(language, 'calendar.title')}: ${hijriStr}`}
        >
          <Text style={[styles.hijriDate, { color: theme.text }]} accessibilityLabel={`Hijri date: ${hijriStr}`}>
            {hijriStr}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.gregorianDate, { color: theme.textTertiary }]}>
          {now.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </Text>
        {ramadanDay !== null && (
          <View style={[styles.ramadanBadge, { backgroundColor: theme.primaryLight }]} accessibilityLabel={`Ramadan day ${ramadanDay}`}>
            <MaterialCommunityIcons name="moon-waning-crescent" size={16} color={theme.primary} />
            <Text style={[styles.ramadanBadgeText, { color: theme.primary }]}>
              {`${t(language, 'ramadan.day')} ${ramadanDay} ${t(language, 'ramadan.ofRamadan')}`}
            </Text>
          </View>
        )}
        {ramadanThird && (
          <Text style={[styles.ramadanThirdText, { color: theme.textSecondary }]}>
            {language === 'ar' ? ramadanThird.nameAr : language === 'ur' ? ramadanThird.nameUr : ramadanThird.nameEn}
          </Text>
        )}
        {islamicEvent && !ramadanDay && (
          <View style={[styles.eventBadge, { backgroundColor: theme.primaryLight }]} accessibilityLabel={islamicEvent.nameEn}>
            <Text style={[styles.eventText, { color: theme.primary }]}>
              {language === 'ar' ? islamicEvent.nameAr : language === 'ur' ? islamicEvent.nameUr : islamicEvent.nameEn}
            </Text>
          </View>
        )}
      </View>

      {/* ── HERO: Niyyah Card (above the fold) ───────────────────── */}
      <View style={[styles.niyyahCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
        <IslamicPattern
          width={SCREEN_WIDTH - spacing.md * 2}
          height={200}
          color={theme.primary}
          opacity={0.06}
          variant="arch"
        />
        <IslamicPattern
          width={60}
          height={60}
          color={theme.primary}
          opacity={0.05}
          variant="corner"
        />
        <View ref={niyyahCardRef} collapsable={false}>
        <View style={styles.niyyahHeader}>
          <View style={[styles.niyyahIconCircle, { backgroundColor: theme.primary + '20' }]}>
            <MaterialCommunityIcons name="star-crescent" size={20} color={theme.primary} />
          </View>
          <Text style={[styles.niyyahLabel, { color: theme.primary }]}>
            {t(language, 'today.todaysNiyyah')}
          </Text>
          {todayProgress.niyyahCompleted && (
            <View style={[styles.niyyahDoneBadge, { backgroundColor: theme.success }]}>
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
          )}
          <TouchableOpacity
            onPress={handleShareNiyyah}
            style={[styles.shareIconBtn, { backgroundColor: theme.primary + '20' }]}
            accessibilityLabel="Share today's deed"
            accessibilityRole="button"
            disabled={sharing}
          >
            <Ionicons name={sharing ? 'hourglass-outline' : 'share-outline'} size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.niyyahText, { color: theme.text, textAlign }]}>
          {language === 'ur' ? reflection.niyyahUr : language === 'ar' ? reflection.niyyahAr : reflection.niyyahEn}
        </Text>
        <View style={[styles.reflectionRow, { borderTopColor: theme.primary + '25' }]}>
          <Ionicons name="help-circle-outline" size={14} color={theme.primary} style={{ marginTop: 2 }} />
          <Text style={[styles.reflectionText, { color: theme.primary + 'CC', textAlign }]}>
            {language === 'ur' ? reflection.reflectionUr : language === 'ar' ? reflection.reflectionAr : reflection.reflectionEn}
          </Text>
        </View>
        </View>
        {!todayProgress.niyyahCompleted ? (
          <TouchableOpacity
            onPress={handleNiyyahPress}
            style={[styles.niyyahButton, { backgroundColor: theme.primary }]}
            accessibilityLabel="I did this today"
            accessibilityRole="button"
          >
            <Text style={styles.niyyahButtonText}>
              {t(language, 'today.iDidThis')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ── Next Prayer ──────────────────────────────────────────── */}
      {nextPrayer && countdown && (
        <AnimatedPressable
          onPress={() => router.push('/prayer')}
          accessibilityLabel={`Next prayer: ${nextPrayer.name} in ${countdown.hours > 0 ? `${countdown.hours} hours ` : ''}${countdown.minutes} minutes`}
          accessibilityHint="Tap for full prayer times"
          style={[styles.nextPrayerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <View style={[styles.prayerIconCircle, { backgroundColor: theme.primary + '15' }]}>
            <MaterialCommunityIcons name="mosque" size={22} color={theme.primary} />
          </View>
          <View style={{ flex: 1, marginStart: spacing.md }}>
            <Text style={[styles.nextPrayerLabel, { color: theme.textSecondary }]}>
              {t(language, 'prayer.nextPrayer')}
            </Text>
            <Text style={[styles.nextPrayerName, { color: theme.text }]}>
              {t(language, `prayer.${nextPrayer.name}`)}
            </Text>
          </View>
          <CircularProgress
            size={52}
            strokeWidth={4}
            progress={countdownProgress}
            color={theme.primary}
            backgroundColor={theme.border}
          >
            <Text style={[styles.miniCountdown, { color: theme.primary }]}>
              {`${countdown.hours > 0 ? `${countdown.hours}h` : ''}${countdown.minutes}m`}
            </Text>
          </CircularProgress>
        </AnimatedPressable>
      )}

      {/* ── Goals Summary (compact) ──────────────────────────────── */}
      <AnimatedPressable
        onPress={() => router.push('/goals')}
        accessibilityLabel={`Daily goals: ${summary.completed} of ${summary.total} completed`}
        accessibilityHint="Tap to customize goals"
        style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <View style={styles.summaryRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>
              {t(language, 'goals.title')}
            </Text>
            <View style={styles.summaryDots}>
              <View style={styles.summaryDotItem}>
                <View style={[styles.dot, { backgroundColor: theme.success }]} />
                <Text style={[styles.dotLabel, { color: theme.textSecondary }]}>
                  {`${summary.prayersDone}/${summary.prayersTotal}`}
                </Text>
              </View>
              <View style={styles.summaryDotItem}>
                <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                <Text style={[styles.dotLabel, { color: theme.textSecondary }]}>
                  {`${summary.quranDone ? '1' : '0'}/1`}
                </Text>
              </View>
              <View style={styles.summaryDotItem}>
                <View style={[styles.dot, { backgroundColor: theme.warning }]} />
                <Text style={[styles.dotLabel, { color: theme.textSecondary }]}>
                  {`${summary.dhikrDone}/${summary.dhikrTotal}`}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.summaryRight}>
            <Text style={[styles.summaryPercent, { color: theme.primary }]}>
              {`${Math.round(progressPercent)}%`}
            </Text>
            <Ionicons name={isRtl ? 'chevron-back' : 'chevron-forward'} size={16} color={theme.textTertiary} />
          </View>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.progressBarFill,
              { backgroundColor: theme.primary, width: `${progressPercent}%` },
            ]}
          />
        </View>
      </AnimatedPressable>

      {/* ── Goal Checklist ────────────────────────────────────────── */}
      {goals.map((goal) => {
        const icon = getGoalIcon(goal.type);
        const title = language === 'ar' ? goal.titleAr : language === 'ur' ? goal.titleUr : goal.titleEn;
        const canToggle = !goal.isCompleted && goal.id !== 'prayers' && goal.id !== 'quran' && goal.id !== 'friday-kahf' && goal.id !== 'mulk' && goal.id !== 'taraweeh';
        const autoHint = !canToggle && !goal.isCompleted ? getAutoTrackedHint(goal.id, language) : null;

        return (
          <AnimatedPressable
            key={goal.id}
            onPress={() => canToggle && handleGoalPress(goal.id)}
            disabled={!canToggle}
            accessibilityLabel={`${title}: ${goal.isCompleted ? 'completed' : 'not completed'}`}
            accessibilityHint={canToggle ? 'Tap to mark as done' : undefined}
            style={[
              styles.goalCard,
              {
                backgroundColor: goal.isCompleted ? theme.primaryLight : theme.surface,
                borderColor: goal.isCompleted ? theme.primary : theme.border,
              },
            ]}
          >
            {icon.family === 'material' ? (
              <MaterialCommunityIcons name={icon.name as any} size={22} color={goal.isCompleted ? theme.primary : theme.textSecondary} />
            ) : (
              <Ionicons name={icon.name as any} size={22} color={goal.isCompleted ? theme.primary : theme.textSecondary} />
            )}
            <View style={{ flex: 1, marginStart: spacing.md }}>
              <Text style={[styles.goalTitle, { color: theme.text, textDecorationLine: goal.isCompleted ? 'line-through' : 'none' }]}>
                {title}
              </Text>
              {autoHint ? (
                <Text style={[styles.goalHint, { color: theme.textTertiary, textAlign }]}>
                  {autoHint}
                </Text>
              ) : null}
              {goal.target > 1 && (
                <Text style={[styles.goalProgress, { color: theme.textTertiary }]}>
                  {`${goal.completed}/${goal.target}`}
                </Text>
              )}
            </View>
            <View style={[
              styles.goalCheck,
              {
                backgroundColor: goal.isCompleted ? theme.success : 'transparent',
                borderColor: goal.isCompleted ? theme.success : theme.border,
              },
            ]}>
              {goal.isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
          </AnimatedPressable>
        );
      })}

      {/* ── Decorative divider ───────────────────────────────────── */}
      <View style={styles.dividerContainer}>
        <IslamicPattern width={SCREEN_WIDTH - spacing.md * 4} height={8} color={theme.primary} opacity={0.12} variant="border" />
      </View>

      {/* ── Quran Ayah Card ──────────────────────────────────────── */}
      <View
        style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
        accessibilityLabel={`Quran verse: ${reflection.ayahRef}`}
      >
        <IslamicPattern width={SCREEN_WIDTH - spacing.md * 2} height={160} color={theme.primary} opacity={0.04} variant="arch" />
        <Text style={[styles.bismillah, { color: theme.textArabic, fontFamily: getQuranFontFamily(language), lineHeight: fontSizes.bismillah * 0.8 * (language === 'ur' ? lineHeights.urdu : lineHeights.arabic) }]}>
          {language === 'ur' ? 'بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِيۡمِ' : 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ'}
        </Text>
        <Text style={[styles.arabicText, { color: theme.textArabic, fontFamily: getQuranFontFamily(language), lineHeight: fontSizes.quranArabic * (language === 'ur' ? lineHeights.urdu : lineHeights.arabic) }]}>
          {reflection.ayahAr}
        </Text>
        <Text style={[styles.translationText, { color: theme.text, textAlign, lineHeight: fontSizes.translationDefault * (language === 'ur' ? lineHeights.urdu : lineHeights.latin) }]}>
          {language === 'ur' ? reflection.ayahUr : language === 'ar' ? reflection.ayahAr : reflection.ayahEn}
        </Text>
        <Text style={[styles.reference, { color: theme.textTertiary, textAlign }]}>
          {`\u2014 ${reflection.ayahRef}`}
        </Text>
      </View>

      {/* ── Hadith Card ──────────────────────────────────────────── */}
      <View
        style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
        accessibilityLabel={`Hadith from ${reflection.hadithSource}`}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconCircle, { backgroundColor: theme.primary + '15' }]}>
            <Ionicons name="book-outline" size={16} color={theme.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: theme.primary }]}>
            {t(language, 'today.fromSunnah')}
          </Text>
        </View>
        <Text style={[styles.hadithArabic, { color: theme.textArabic, fontFamily: getArabicFontFamily(language), lineHeight: fontSizes.hadithArabic * (language === 'ur' ? lineHeights.urdu : lineHeights.arabic) }]}>
          {reflection.hadithAr}
        </Text>
        <Text style={[styles.translationText, { color: theme.text, textAlign, lineHeight: fontSizes.translationDefault * (language === 'ur' ? lineHeights.urdu : lineHeights.latin) }]}>
          {language === 'ur' ? reflection.hadithUr : language === 'ar' ? reflection.hadithAr : reflection.hadithEn}
        </Text>
        <Text style={[styles.reference, { color: theme.textTertiary, textAlign }]}>
          {`\u2014 ${reflection.hadithSource}`}
        </Text>
      </View>

      {/* ── Dua of the Day ───────────────────────────────────────── */}
      <View
        style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
        accessibilityLabel="Dua of the day"
      >
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconCircle, { backgroundColor: theme.primary + '15' }]}>
            <Ionicons name="hand-left-outline" size={16} color={theme.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: theme.primary }]}>
            {t(language, 'today.duaOfDay')}
          </Text>
        </View>
        <Text style={[styles.duaArabic, { color: theme.textArabic, fontFamily: getArabicFontFamily(language), lineHeight: fontSizes.duaArabic * (language === 'ur' ? lineHeights.urdu : lineHeights.arabic) }]}>
          {reflection.duaAr}
        </Text>
        <Text style={[styles.translationText, { color: theme.text, textAlign, lineHeight: fontSizes.translationDefault * (language === 'ur' ? lineHeights.urdu : lineHeights.latin) }]}>
          {language === 'ur' ? reflection.duaUr : language === 'ar' ? reflection.duaAr : reflection.duaEn}
        </Text>
        <Text style={[styles.reference, { color: theme.textTertiary, textAlign }]}>
          {`\u2014 ${reflection.duaSource}`}
        </Text>
      </View>

      {/* ── Quick Surah Chips ────────────────────────────────────── */}
      <View style={styles.chipsSection}>
        <Text style={[styles.chipsSectionTitle, { color: theme.textSecondary }]}>
          {t(language, 'surah.quickAccess')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {QUICK_SURAHS.map((surah) => (
            <TouchableOpacity
              key={surah.id}
              style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => {
                hapticLight();
                if (surah.id === 0) {
                  router.push('/surah/2?ayah=255');
                } else {
                  router.push(`/surah/${surah.id}`);
                }
              }}
              accessibilityLabel={t(language, surah.nameKey)}
              accessibilityRole="button"
            >
              <Text style={[styles.chipText, { color: theme.primary }]}>
                {t(language, surah.nameKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: spacing.xxl }} />

      <StreakCelebration
        visible={celebrationVisible}
        streak={streakData.currentStreak}
        language={language}
        theme={theme}
        onDismiss={dismissCelebration}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },

  dateHeader: { alignItems: 'center', marginBottom: spacing.md },
  locationLabel: { fontSize: fontSizes.caption, marginBottom: spacing.xs },
  hijriDate: { fontSize: fontSizes.heading2, fontWeight: '700', marginBottom: spacing.xs },
  gregorianDate: { fontSize: fontSizes.bodySmall, marginBottom: spacing.sm },
  ramadanBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999, marginTop: spacing.xs },
  ramadanBadgeText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  ramadanThirdText: { fontSize: fontSizes.caption, marginTop: spacing.xs, fontStyle: 'italic' },
  eventBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999, marginTop: spacing.xs },
  eventText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },

  niyyahCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  niyyahHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md, zIndex: 1 },
  niyyahIconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  niyyahLabel: { fontSize: fontSizes.heading3, fontWeight: '700', flex: 1 },
  niyyahDoneBadge: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  niyyahText: { fontSize: fontSizes.body, lineHeight: fontSizes.body * 1.7, marginBottom: spacing.lg, zIndex: 1 },
  niyyahButton: { borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center', zIndex: 1 },
  niyyahButtonText: { color: '#FFFFFF', fontSize: fontSizes.body, fontWeight: '700' },
  shareIconBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },

  nextPrayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  prayerIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  nextPrayerLabel: { fontSize: fontSizes.caption },
  nextPrayerName: { fontSize: fontSizes.body, fontWeight: '700' },
  miniCountdown: { fontSize: 10, fontWeight: '700' },

  summaryCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { fontSize: fontSizes.body, fontWeight: '700', marginBottom: spacing.xs },
  summaryDots: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  summaryDotItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotLabel: { fontSize: fontSizes.caption },
  summaryRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  summaryPercent: { fontSize: fontSizes.heading3, fontWeight: '800' },
  progressBarBg: { height: 4, borderRadius: 2, marginTop: spacing.sm },
  progressBarFill: { height: 4, borderRadius: 2 },

  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  goalTitle: { fontSize: fontSizes.body },
  goalProgress: { fontSize: fontSizes.caption, marginTop: 2 },
  goalHint: { fontSize: fontSizes.caption, marginTop: 4, lineHeight: fontSizes.caption * 1.4 },
  goalCheck: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },

  dividerContainer: { alignItems: 'center', marginVertical: spacing.lg },

  card: { borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  cardIconCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: fontSizes.heading3, fontWeight: '700' },
  bismillah: { fontSize: fontSizes.bismillah * 0.8, textAlign: 'center', marginBottom: spacing.md, lineHeight: fontSizes.bismillah * lineHeights.arabic * 0.8 },
  arabicText: { fontSize: fontSizes.quranArabic, textAlign: 'right', lineHeight: fontSizes.quranArabic * lineHeights.arabic, marginBottom: spacing.md },
  hadithArabic: { fontSize: fontSizes.hadithArabic, textAlign: 'right', lineHeight: fontSizes.hadithArabic * lineHeights.arabic, marginBottom: spacing.md },
  duaArabic: { fontSize: fontSizes.duaArabic, textAlign: 'right', lineHeight: fontSizes.duaArabic * 2.3, letterSpacing: 0.8, marginBottom: spacing.md },
  translationText: { fontSize: fontSizes.translationDefault, lineHeight: fontSizes.translationDefault * lineHeights.latin, marginBottom: spacing.sm },
  reference: { fontSize: fontSizes.caption, fontStyle: 'italic' },

  chipsSection: { marginBottom: spacing.lg },
  chipsSectionTitle: { fontSize: fontSizes.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  chipsRow: { flexDirection: 'row' },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999, borderWidth: 1, marginEnd: spacing.sm },
  chipText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },

  reflectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  reflectionText: {
    flex: 1,
    fontSize: fontSizes.bodySmall,
    fontStyle: 'italic',
    lineHeight: fontSizes.bodySmall * 1.55,
  },
});
