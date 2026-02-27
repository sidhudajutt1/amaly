import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { t } from '../../src/i18n';
import { useTheme } from '../../src/hooks/useTheme';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';

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

  const textAlign = language === 'ar' || language === 'ur' ? 'right' as const : 'left' as const;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Streak Counter */}
      <View style={[styles.streakRow, { borderBottomColor: theme.border }]}>
        <Text style={[styles.streakIcon]}>🔥</Text>
        <Text style={[styles.streakNumber, { color: theme.streak }]}>
          {streakData.currentStreak}
        </Text>
        <Text style={[styles.streakLabel, { color: theme.textSecondary }]}>
          {t(language, 'today.streakDays')}
        </Text>
      </View>

      {/* Bismillah */}
      <Text style={[styles.bismillah, { color: theme.textArabic }]}>
        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
      </Text>

      {/* Quran Ayah Card */}
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Text style={[styles.arabicText, { color: theme.textArabic }]}>
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
        <Text style={[styles.sectionTitle, { color: theme.primary, textAlign }]}>
          📖 {t(language, 'today.fromSunnah')}
        </Text>
        <Text style={[styles.hadithArabic, { color: theme.textArabic }]}>
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
        <Text style={[styles.sectionTitle, { color: theme.primary, textAlign }]}>
          💭 {t(language, 'today.reflection')}
        </Text>
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
        <Text style={[styles.niyyahTitle, { color: theme.primary, textAlign }]}>
          🎯 {t(language, 'today.todaysNiyyah')}
        </Text>
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
            {t(language, 'today.readTafsir')} ▸
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
    fontSize: 24,
    marginRight: spacing.sm,
  },
  streakNumber: {
    fontSize: fontSizes.streak,
    fontWeight: '800',
    marginRight: spacing.xs,
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
});
