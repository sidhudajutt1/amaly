import { useState, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { t } from '../../src/i18n';
import { useTheme } from '../../src/hooks/useTheme';
import { useLocation } from '../../src/hooks/useLocation';
import { usePrayerTimes } from '../../src/hooks/usePrayerTimes';
import { formatTime } from '../../src/services/prayerService';
import { toHijri, formatHijriDate, getRamadanDay, getRamadanThird, getIslamicEvent, isRamadan } from '../../src/services/hijriService';
import { generateDailyGoals, getGoalsSummary, getStreakMilestone } from '../../src/services/goalsService';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getQuranFontFamily, getArabicFontFamily } from '../../src/theme/typography';
import type { Language, GoalType } from '../../src/types';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const QUICK_SURAHS = [
  { id: 18, nameKey: 'surah.alKahf' },
  { id: 67, nameKey: 'surah.alMulk' },
  { id: 36, nameKey: 'surah.yasin' },
  { id: 55, nameKey: 'surah.arRahman' },
  { id: 56, nameKey: 'surah.alWaqiah' },
  { id: 0, nameKey: 'surah.ayatAlKursi' },
];

const SAMPLE_REFLECTION = {
  ayahAr: 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
  ayahRef: 'Surah Hud 11:115',
  hadithAr: 'إِنَّمَا الصَّبْرُ عِنْدَ الصَّدْمَةِ الْأُولَى',
  hadithSource: 'Sahih al-Bukhari 1283',
};

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
  const { nextPrayer, countdown } = usePrayerTimes();

  const now = new Date();
  const hijri = toHijri(now, hijriAdjustment);
  const hijriStr = formatHijriDate(hijri, language);
  const ramadanDay = getRamadanDay(hijri);
  const ramadanThird = getRamadanThird(hijri);
  const islamicEvent = getIslamicEvent(hijri);
  const dayOfWeek = now.getDay();

  const goals = useMemo(
    () => generateDailyGoals(goalConfig, todayProgress, hijri, dayOfWeek),
    [goalConfig, todayProgress, hijri, dayOfWeek]
  );
  const summary = useMemo(() => getGoalsSummary(goals), [goals]);

  const streakMilestone = getStreakMilestone(streakData.currentStreak);
  const showCelebration = streakMilestone !== null && !todayProgress.streakCelebrationShown && streakData.currentStreak > 0;
  const [celebrationVisible, setCelebrationVisible] = useState(showCelebration);

  const textAlign = language === 'ar' || language === 'ur' ? 'right' as const : 'left' as const;

  const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const handleGoalPress = (goalId: string) => {
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
  };

  const dismissCelebration = () => {
    setCelebrationVisible(false);
    markStreakCelebrationShown();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Date Header */}
      <View style={styles.dateHeader}>
        <Text style={[styles.locationLabel, { color: theme.textSecondary }]}>{locationName}</Text>
        <Text style={[styles.hijriDate, { color: theme.text }]}>{hijriStr}</Text>
        <Text style={[styles.gregorianDate, { color: theme.textTertiary }]}>
          {now.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </Text>
        {ramadanDay !== null && (
          <View style={[styles.ramadanBadge, { backgroundColor: theme.primaryLight }]}>
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
          <View style={[styles.eventBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.eventText, { color: theme.primary }]}>
              {language === 'ar' ? islamicEvent.nameAr : language === 'ur' ? islamicEvent.nameUr : islamicEvent.nameEn}
            </Text>
          </View>
        )}
      </View>

      {/* Goals Summary Card */}
      <View style={[styles.summaryCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={[styles.summaryTitle, { color: theme.primary }]}>
              {`${t(language, 'goals.complete')} ${summary.total} ${t(language, 'goals.goalsToday')}`}
            </Text>
            <View style={styles.summaryDots}>
              <View style={styles.summaryDotItem}>
                <View style={[styles.dot, { backgroundColor: theme.success }]} />
                <Text style={[styles.dotLabel, { color: theme.textSecondary }]}>
                  {`${summary.prayersDone}/${summary.prayersTotal} ${t(language, 'goals.prayers')}`}
                </Text>
              </View>
              <View style={styles.summaryDotItem}>
                <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                <Text style={[styles.dotLabel, { color: theme.textSecondary }]}>
                  {`${summary.quranDone ? '1' : '0'}/1 ${t(language, 'goals.quran')}`}
                </Text>
              </View>
              <View style={styles.summaryDotItem}>
                <View style={[styles.dot, { backgroundColor: '#E8A838' }]} />
                <Text style={[styles.dotLabel, { color: theme.textSecondary }]}>
                  {`${summary.dhikrDone}/${summary.dhikrTotal} ${t(language, 'goals.dhikr')}`}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/goals')}>
            <Ionicons name="settings-outline" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: theme.primary,
                width: `${summary.total > 0 ? (summary.completed / summary.total) * 100 : 0}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
          {`${summary.completed}/${summary.total}`}
        </Text>
      </View>

      {/* Week Calendar Row */}
      <View style={styles.weekRow}>
        {WEEKDAYS.map((day, i) => (
          <View
            key={i}
            style={[
              styles.weekDay,
              i === todayIdx && { backgroundColor: theme.primary },
            ]}
          >
            <Text style={[styles.weekDayText, { color: i === todayIdx ? '#fff' : theme.textSecondary }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Next Prayer Mini Card */}
      {nextPrayer && countdown && (
        <TouchableOpacity
          style={[styles.nextPrayerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => router.push('/prayer')}
        >
          <MaterialCommunityIcons name="mosque" size={20} color={theme.primary} />
          <View style={{ flex: 1, marginStart: spacing.sm }}>
            <Text style={[styles.nextPrayerLabel, { color: theme.textSecondary }]}>
              {t(language, 'prayer.nextPrayer')}
            </Text>
            <Text style={[styles.nextPrayerName, { color: theme.text }]}>
              {t(language, `prayer.${nextPrayer.name}`)}
            </Text>
          </View>
          <Text style={[styles.nextPrayerTime, { color: theme.primary }]}>
            {formatTime(nextPrayer.time)}
          </Text>
          <Text style={[styles.nextPrayerCountdown, { color: theme.textSecondary }]}>
            {`${countdown.hours > 0 ? `${countdown.hours}h ` : ''}${countdown.minutes}m`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Quick Access Surah Chips */}
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
                if (surah.id > 0) router.push(`/surah/${surah.id}`);
              }}
            >
              <Text style={[styles.chipText, { color: theme.primary }]}>
                {t(language, surah.nameKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Goal Cards */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {t(language, 'goals.title')}
      </Text>
      {goals.map((goal) => {
        const icon = getGoalIcon(goal.type);
        const title = language === 'ar' ? goal.titleAr : language === 'ur' ? goal.titleUr : goal.titleEn;
        const canToggle = !goal.isCompleted && goal.id !== 'prayers' && goal.id !== 'quran' && goal.id !== 'friday-kahf' && goal.id !== 'mulk' && goal.id !== 'taraweeh';

        return (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              {
                backgroundColor: goal.isCompleted ? theme.primaryLight : theme.surface,
                borderColor: goal.isCompleted ? theme.primary : theme.border,
              },
            ]}
            onPress={() => canToggle && handleGoalPress(goal.id)}
            disabled={!canToggle}
            activeOpacity={canToggle ? 0.6 : 1}
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
          </TouchableOpacity>
        );
      })}

      {/* Bismillah */}
      <Text style={[styles.bismillah, { color: theme.textArabic }]}>
        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
      </Text>

      {/* Quran Ayah Card */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Text style={[styles.arabicText, { color: theme.textArabic, fontFamily: getQuranFontFamily(language) }]}>
          {SAMPLE_REFLECTION.ayahAr}
        </Text>
        <Text style={[styles.translationText, { color: theme.text, textAlign }]}>
          {language === 'ur'
            ? 'اور صبر کرو کیونکہ بے شک اللہ نیکی کرنے والوں کا اجر ضائع نہیں کرتا'
            : language === 'ar'
            ? 'أمر بالصبر مع وعد بأن الله لا يضيع ثواب من أحسن عملاً'
            : '"And be patient, for indeed Allah does not allow to be lost the reward of those who do good."'}
        </Text>
        <Text style={[styles.reference, { color: theme.textTertiary, textAlign }]}>
          — {SAMPLE_REFLECTION.ayahRef}
        </Text>
      </View>

      {/* Hadith Card */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
          <Ionicons name="book-outline" size={18} color={theme.primary} />
          <Text style={[styles.cardTitle, { color: theme.primary }]}>
            {t(language, 'today.fromSunnah')}
          </Text>
        </View>
        <Text style={[styles.hadithArabic, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>
          {SAMPLE_REFLECTION.hadithAr}
        </Text>
        <Text style={[styles.translationText, { color: theme.text, textAlign }]}>
          {language === 'ur'
            ? 'صبر تو پہلے صدمے کے وقت ہوتا ہے'
            : language === 'ar'
            ? 'إنما الصبر الحقيقي هو عند أول صدمة'
            : '"Patience is at the first stroke of calamity."'}
        </Text>
        <Text style={[styles.reference, { color: theme.textTertiary, textAlign }]}>
          — {SAMPLE_REFLECTION.hadithSource}
        </Text>
      </View>

      {/* Niyyah Card */}
      <View style={[styles.niyyahCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
          <Ionicons name="flag-outline" size={18} color={theme.primary} />
          <Text style={[styles.cardTitle, { color: theme.primary }]}>
            {t(language, 'today.todaysNiyyah')}
          </Text>
        </View>
        <Text style={[styles.niyyahText, { color: theme.text, textAlign }]}>
          {language === 'ur'
            ? 'اگر آج کوئی بات آپ کی مرضی کے خلاف ہو تو ردعمل سے پہلے رک کر دل میں کہیں "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ"'
            : language === 'ar'
            ? 'إذا لم تسر الأمور كما تريد اليوم، توقف قبل أن تتفاعل وقل "إنا لله وإنا إليه راجعون" في نفسك.'
            : 'If something doesn\'t go your way today, before reacting, pause and say "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ" silently to yourself.'}
        </Text>
        <TouchableOpacity
          style={[styles.niyyahButton, { backgroundColor: todayProgress.niyyahCompleted ? theme.success : theme.primary }]}
          onPress={markNiyyahCompleted}
          disabled={todayProgress.niyyahCompleted}
        >
          <Text style={styles.niyyahButtonText}>
            {todayProgress.niyyahCompleted ? t(language, 'today.alreadyDone') : t(language, 'today.iDidThis')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: spacing.xxl }} />

      {/* Streak Celebration Modal */}
      <Modal visible={celebrationVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.celebrationCard, { backgroundColor: theme.cardBackground }]}>
            <MaterialCommunityIcons name="star-four-points" size={64} color={theme.primary} />
            <Text style={[styles.celebrationTitle, { color: theme.primary }]}>
              {t(language, 'streak.celebration')}
            </Text>
            <Text style={[styles.celebrationStreak, { color: theme.text }]}>
              {`${streakData.currentStreak} ${t(language, 'streak.dayStreak')}`}
            </Text>
            <Text style={[styles.celebrationKeep, { color: theme.textSecondary }]}>
              {t(language, 'streak.keepGoing')}
            </Text>
            <View style={[styles.weekRow, { marginTop: spacing.lg }]}>
              {WEEKDAYS.map((day, i) => (
                <View
                  key={i}
                  style={[styles.weekDay, i === todayIdx && { backgroundColor: theme.primary }]}
                >
                  <Text style={[styles.weekDayText, { color: i === todayIdx ? '#fff' : theme.textSecondary }]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.celebrationButton, { backgroundColor: theme.primary }]}
              onPress={dismissCelebration}
            >
              <Text style={styles.celebrationButtonText}>
                {t(language, 'streak.celebration')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },

  dateHeader: { alignItems: 'center', marginBottom: spacing.lg },
  locationLabel: { fontSize: fontSizes.caption, marginBottom: spacing.xs },
  hijriDate: { fontSize: fontSizes.heading2, fontWeight: '700', marginBottom: spacing.xs },
  gregorianDate: { fontSize: fontSizes.bodySmall, marginBottom: spacing.sm },
  ramadanBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999, marginTop: spacing.xs },
  ramadanBadgeText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  ramadanThirdText: { fontSize: fontSizes.caption, marginTop: spacing.xs, fontStyle: 'italic' },
  eventBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999, marginTop: spacing.xs },
  eventText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },

  summaryCard: { borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryTitle: { fontSize: fontSizes.body, fontWeight: '700', marginBottom: spacing.sm },
  summaryDots: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  summaryDotItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotLabel: { fontSize: fontSizes.caption },
  progressBarBg: { height: 6, borderRadius: 3, marginTop: spacing.md },
  progressBarFill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: fontSizes.caption, textAlign: 'right', marginTop: spacing.xs },

  weekRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.lg },
  weekDay: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  weekDayText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },

  nextPrayerCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, marginBottom: spacing.md },
  nextPrayerLabel: { fontSize: fontSizes.caption },
  nextPrayerName: { fontSize: fontSizes.body, fontWeight: '700' },
  nextPrayerTime: { fontSize: fontSizes.body, fontWeight: '700', marginEnd: spacing.sm },
  nextPrayerCountdown: { fontSize: fontSizes.caption },

  chipsSection: { marginBottom: spacing.lg },
  chipsSectionTitle: { fontSize: fontSizes.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  chipsRow: { flexDirection: 'row' },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 999, borderWidth: 1, marginEnd: spacing.sm },
  chipText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },

  sectionTitle: { fontSize: fontSizes.heading3, fontWeight: '700', marginBottom: spacing.md },
  goalCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, marginBottom: spacing.sm },
  goalTitle: { fontSize: fontSizes.body },
  goalProgress: { fontSize: fontSizes.caption, marginTop: 2 },
  goalCheck: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },

  bismillah: { fontSize: fontSizes.bismillah, textAlign: 'center', marginVertical: spacing.lg, lineHeight: fontSizes.bismillah * lineHeights.arabic },
  card: { borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1 },
  arabicText: { fontSize: fontSizes.quranArabic, textAlign: 'right', lineHeight: fontSizes.quranArabic * lineHeights.arabic, marginBottom: spacing.md },
  hadithArabic: { fontSize: fontSizes.hadithArabic, textAlign: 'right', lineHeight: fontSizes.hadithArabic * lineHeights.arabic, marginBottom: spacing.md },
  translationText: { fontSize: fontSizes.translationDefault, lineHeight: fontSizes.translationDefault * lineHeights.latin, marginBottom: spacing.sm },
  reference: { fontSize: fontSizes.caption, fontStyle: 'italic' },
  cardTitle: { fontSize: fontSizes.heading3, fontWeight: '700' },

  niyyahCard: { borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 2 },
  niyyahText: { fontSize: fontSizes.body, lineHeight: fontSizes.body * 1.7, marginBottom: spacing.lg },
  niyyahButton: { borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center' },
  niyyahButtonText: { color: '#FFFFFF', fontSize: fontSizes.body, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  celebrationCard: { borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center', width: '100%', maxWidth: 340 },
  celebrationTitle: { fontSize: fontSizes.heading1, fontWeight: '800', marginTop: spacing.md },
  celebrationStreak: { fontSize: fontSizes.heading2, fontWeight: '700', marginTop: spacing.sm },
  celebrationKeep: { fontSize: fontSizes.body, marginTop: spacing.xs },
  celebrationButton: { borderRadius: borderRadius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  celebrationButtonText: { color: '#fff', fontSize: fontSizes.body, fontWeight: '700' },
});
