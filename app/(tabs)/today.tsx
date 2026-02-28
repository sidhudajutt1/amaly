import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { t } from '../../src/i18n';
import { useTheme } from '../../src/hooks/useTheme';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getQuranFontFamily, getArabicFontFamily } from '../../src/theme/typography';
import { useLocation } from '../../src/hooks/useLocation';
import { toHijri, formatHijriDate, isRamadan, getRamadanDay, getRamadanThird, getIslamicEvent } from '../../src/services/hijriService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SAMPLE_REFLECTION = {
  ayahAr: 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
  ayahRef: 'Surah Hud 11:115',
  hadithAr: 'إِنَّمَا الصَّبْرُ عِنْدَ الصَّدْمَةِ الْأُولَى',
  hadithSource: 'Sahih al-Bukhari 1283',
};

export default function TodayScreen() {
  const language = useAppStore((s) => s.settings.language);
  const streakData = useAppStore((s) => s.streakData);
  const todayProgress = useAppStore((s) => s.todayProgress);
  const markReflectionViewed = useAppStore((s) => s.markReflectionViewed);
  const markNiyyahCompleted = useAppStore((s) => s.markNiyyahCompleted);
  const { theme } = useTheme();
  const { locationName } = useLocation();
  const hijriAdjustment = useAppStore((s) => s.settings.hijriAdjustment);
  const now = new Date();
  const hijri = toHijri(now, hijriAdjustment);
  const hijriStr = formatHijriDate(hijri, language);
  const ramadanDay = getRamadanDay(hijri);
  const ramadanThird = getRamadanThird(hijri);
  const islamicEvent = getIslamicEvent(hijri);

  const textAlign = language === 'ar' || language === 'ur' ? 'right' as const : 'left' as const;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Date Header */}
      <View style={styles.dateHeader}>
        <Text style={[styles.locationLabel, { color: theme.textSecondary }]}>
          {locationName}
        </Text>
        <Text style={[styles.hijriDate, { color: theme.text }]}>
          {hijriStr}
        </Text>
        <Text style={[styles.gregorianDate, { color: theme.textTertiary }]}>
          {now.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </Text>
        {ramadanDay !== null && (
          <View style={[styles.ramadanBadge, { backgroundColor: theme.primaryLight }]}>
            <MaterialCommunityIcons name="moon-waning-crescent" size={16} color={theme.primary} />
            <Text style={[styles.ramadanText, { color: theme.primary }]}>
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

      {/* Streak Counter + Settings */}
      <View style={[styles.streakRow, { borderBottomColor: theme.border }]}>
        <Ionicons name="flame" size={24} color={theme.streak} style={{ marginEnd: spacing.sm }} />
        <Text style={[styles.streakNumber, { color: theme.streak }]}>
          {streakData.currentStreak}
        </Text>
        <Text style={[styles.streakLabel, { color: theme.textSecondary }]}>
          {t(language, 'today.streakDays')}
        </Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

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
          <Text style={[styles.sectionTitle, { color: theme.primary, textAlign, marginBottom: 0 }]}>
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

      {/* Reflection Card */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={theme.primary} />
          <Text style={[styles.sectionTitle, { color: theme.primary, textAlign, marginBottom: 0 }]}>
            {t(language, 'today.reflection')}
          </Text>
        </View>
        <Text style={[styles.reflectionText, { color: theme.text, textAlign }]}>
          {language === 'ur'
            ? 'صبر کا مطلب بے حس ہونا نہیں ہے۔ نبی کریم ﷺ نے اپنے بیٹے ابراہیم کی وفات پر آنسو بہائے۔ صبر کا مطلب ہے دل ٹوٹے ہونے کے باوجود اللہ کی حکمت پر بھروسہ کرنا۔'
            : language === 'ar'
            ? 'الصبر ليس عدم الإحساس. النبي ﷺ بكى عند وفاة ابنه إبراهيم. الصبر هو اختيار الثقة بحكمة الله حتى حين ينكسر قلبك.'
            : "Patience isn't about being emotionless. The Prophet ﷺ wept when his son Ibrahim died. Sabr is choosing to trust Allah's wisdom even when your heart is breaking."}
        </Text>
      </View>

      {/* Today's Niyyah Card */}
      <View style={[styles.niyyahCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.md }}>
          <Ionicons name="flag-outline" size={18} color={theme.primary} />
          <Text style={[styles.niyyahTitle, { color: theme.primary, textAlign, marginBottom: 0 }]}>
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
          style={[
            styles.niyyahButton,
            todayProgress.niyyahCompleted
              ? { backgroundColor: theme.success }
              : { backgroundColor: theme.primary },
          ]}
          onPress={markNiyyahCompleted}
          disabled={todayProgress.niyyahCompleted}
        >
          <Text style={styles.niyyahButtonText}>
            {todayProgress.niyyahCompleted
              ? t(language, 'today.alreadyDone')
              : t(language, 'today.iDidThis')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>
            {t(language, 'common.share')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.actionButtonText, { color: theme.primary }]}>
            {`${t(language, 'today.readTafsir')} ▸`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
  },
  streakIcon: {
    marginEnd: spacing.sm,
  },
  streakNumber: {
    fontSize: fontSizes.streak,
    fontWeight: '800',
    marginEnd: spacing.xs,
  },
  streakLabel: {
    fontSize: fontSizes.body,
  },
  bismillah: {
    fontSize: fontSizes.bismillah,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: fontSizes.bismillah * lineHeights.arabic,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  arabicText: {
    fontSize: fontSizes.quranArabic,
    textAlign: 'right',
    lineHeight: fontSizes.quranArabic * lineHeights.arabic,
    marginBottom: spacing.md,
  },
  hadithArabic: {
    fontSize: fontSizes.hadithArabic,
    textAlign: 'right',
    lineHeight: fontSizes.hadithArabic * lineHeights.arabic,
    marginBottom: spacing.md,
  },
  translationText: {
    fontSize: fontSizes.translationDefault,
    lineHeight: fontSizes.translationDefault * lineHeights.latin,
    marginBottom: spacing.sm,
  },
  reference: {
    fontSize: fontSizes.caption,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: fontSizes.heading3,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  reflectionText: {
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * lineHeights.latin,
  },
  niyyahCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
  },
  niyyahTitle: {
    fontSize: fontSizes.heading3,
    fontWeight: '800',
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  niyyahText: {
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * 1.7,
    marginBottom: spacing.lg,
  },
  niyyahButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  niyyahButtonText: {
    color: '#FFFFFF',
    fontSize: fontSizes.body,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: fontSizes.body,
    fontWeight: '600',
  },
  dateHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  locationLabel: {
    fontSize: fontSizes.caption,
    marginBottom: spacing.xs,
  },
  hijriDate: {
    fontSize: fontSizes.heading2,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  gregorianDate: {
    fontSize: fontSizes.bodySmall,
    marginBottom: spacing.sm,
  },
  ramadanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },
  ramadanText: {
    fontSize: fontSizes.bodySmall,
    fontWeight: '600',
  },
  ramadanThirdText: {
    fontSize: fontSizes.caption,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  eventBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },
  eventText: {
    fontSize: fontSizes.bodySmall,
    fontWeight: '600',
  },
});
