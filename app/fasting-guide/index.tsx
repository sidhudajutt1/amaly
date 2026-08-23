import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getArabicFontFamily, getTranslationFontFamily } from '../../src/theme/typography';
import type { Language } from '../../src/types';

interface FastingStep {
  stepNumber: number;
  titleEn: string;
  titleAr: string;
  titleUr: string;
  descriptionEn: string;
  descriptionAr: string;
  descriptionUr: string;
  duaAr?: string;
  duaTransliterationEn?: string;
}

const FASTING_STEPS: FastingStep[] = [
  {
    stepNumber: 1,
    titleEn: 'Intention (Niyyah)',
    titleAr: 'النية',
    titleUr: 'نیت',
    descriptionEn: 'Make the intention in your heart to fast for the sake of Allah before Fajr. The intention does not need to be spoken aloud.',
    descriptionAr: 'اعقد النية في قلبك للصيام لله قبل الفجر. لا يُشترط التلفظ بالنية.',
    descriptionUr: 'فجر سے پہلے دل میں اللہ کی رضا کے لیے روزے کی نیت کریں۔ زبان سے کہنا ضروری نہیں۔',
  },
  {
    stepNumber: 2,
    titleEn: 'Suhoor (Pre-dawn meal)',
    titleAr: 'السحور',
    titleUr: 'سحری',
    descriptionEn: 'Eat suhoor before Fajr — even a sip of water. The Prophet ﷺ said suhoor is blessed.',
    descriptionAr: 'تناول السحور قبل الفجر — ولو جرعة ماء. قال النبي ﷺ: تسحروا فإن في السحور بركة.',
    descriptionUr: 'فجر سے پہلے سحری کھائیں — چاہے ایک گھونٹ پانی۔ نبی ﷺ نے فرمایا: سحری میں برکت ہے۔',
    duaAr: 'بِسْمِ اللَّهِ',
    duaTransliterationEn: 'Bismillah',
  },
  {
    stepNumber: 3,
    titleEn: 'Abstain until Maghrib',
    titleAr: 'الامتناع حتى المغرب',
    titleUr: 'مغرب تک پرہیز',
    descriptionEn: 'Refrain from food, drink, and marital relations from Fajr until sunset. Guard your tongue, eyes, and actions.',
    descriptionAr: 'امتنع عن الطعام والشراب والجماع من الفجر حتى غروب الشمس. احفظ لسانك وعينيك وأفعالك.',
    descriptionUr: 'فجر سے غروب تک کھانا، پینا اور ازدواجی تعلقات سے پرہیز کریں۔ زبان، آنکھیں اور اعمال کی حفاظت کریں۔',
  },
  {
    stepNumber: 4,
    titleEn: 'Increase worship',
    titleAr: 'زيادة العبادة',
    titleUr: 'عبادت میں اضافہ',
    descriptionEn: 'Read more Quran, make extra dhikr, give charity, and pray Taraweeh in Ramadan. Fasting is not only hunger — it is spiritual training.',
    descriptionAr: 'اقرأ القرآن أكثر، أكثر من الذكر، تصدق، وصلِّ التراويح في رمضان. الصيام ليس جوعاً فقط — بل تربية روحية.',
    descriptionUr: 'رمضان میں زیادہ قرآن پڑھیں، ذکر کریں، صدقہ دیں اور تراویح پڑھیں۔ روزہ صرف بھوک نہیں — روحانی تربیت ہے۔',
  },
  {
    stepNumber: 5,
    titleEn: 'Break fast at Iftar',
    titleAr: 'الإفطار',
    titleUr: 'افطار',
    descriptionEn: 'Break your fast at Maghrib with dates and water, following the Sunnah. Make dua — the fasting person\'s supplication is not rejected.',
    descriptionAr: 'أفطر عند المغرب بالتمر والماء اتباعاً للسنة. ادعُ — دعوة الصائم لا ترد.',
    descriptionUr: 'مغرب پر کھجور اور پانی سے سنت کے مطابق افطار کریں۔ دعا کریں — روزے دار کی دعا رد نہیں ہوتی۔',
    duaAr: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ',
    duaTransliterationEn: 'Dhahab adh-dhama\'u wabtallatil-`uruqu wa thabatal-ajru in sha Allah',
  },
  {
    stepNumber: 6,
    titleEn: 'Make up missed fasts',
    titleAr: 'قضاء الصوم',
    titleUr: 'قضاء روزے',
    descriptionEn: 'If you miss a fast with a valid excuse, make it up before the next Ramadan. For chronic illness, fidya or kaffarah may apply — consult a scholar.',
    descriptionAr: 'إن فاتك صوم بعذر، قضِّه قبل رمضان التالي. للمرض المزمن قد تجب الفدية أو الكفارة — استشر عالماً.',
    descriptionUr: 'عذر سے روزہ چھوٹ جائے تو اگلے رمضان سے پہلے قضا کریں۔ دائمی بیماری میں فدیہ یا کفارہ — عالم سے پوچھیں۔',
  },
];

function stepTitle(step: FastingStep, language: Language): string {
  if (language === 'ar') return step.titleAr;
  if (language === 'ur') return step.titleUr;
  return step.titleEn;
}

function stepDesc(step: FastingStep, language: Language): string {
  if (language === 'ar') return step.descriptionAr;
  if (language === 'ur') return step.descriptionUr;
  return step.descriptionEn;
}

export default function FastingGuideScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title={t(language, 'fastingGuide.title')}
        language={language}
        theme={theme}
        icon={<MaterialCommunityIcons name="moon-waning-crescent" size={22} color={theme.primary} />}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.intro, { color: theme.textSecondary, fontFamily: getTranslationFontFamily(language) }]}>
          {t(language, 'fastingGuide.intro')}
        </Text>
        {FASTING_STEPS.map((step) => (
          <View key={step.stepNumber} style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.stepNumber, { color: theme.primary }]}>{step.stepNumber}</Text>
              </View>
              <Text style={[styles.stepTitle, { color: theme.text }]}>{stepTitle(step, language)}</Text>
            </View>
            <Text
              style={[
                styles.stepDesc,
                { color: theme.textSecondary, fontFamily: getTranslationFontFamily(language), lineHeight: fontSizes.bodySmall * lineHeights.latin },
              ]}
            >
              {stepDesc(step, language)}
            </Text>
            {step.duaAr ? (
              <View style={[styles.duaBox, { backgroundColor: theme.background }]}>
                <Text style={[styles.duaArabic, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>
                  {step.duaAr}
                </Text>
                {step.duaTransliterationEn ? (
                  <Text style={[styles.duaTranslit, { color: theme.textTertiary }]}>{step.duaTransliterationEn}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  intro: { fontSize: fontSizes.bodySmall, marginBottom: spacing.md, lineHeight: fontSizes.bodySmall * 1.5 },
  stepCard: { borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, marginBottom: spacing.md },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  stepBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginEnd: spacing.md },
  stepNumber: { fontSize: fontSizes.body, fontWeight: '700' },
  stepTitle: { fontSize: fontSizes.body, fontWeight: '700', flex: 1 },
  stepDesc: { fontSize: fontSizes.bodySmall, marginBottom: spacing.sm },
  duaBox: { borderRadius: borderRadius.md, padding: spacing.md },
  duaArabic: { fontSize: 20, textAlign: 'right', lineHeight: 20 * lineHeights.arabic, marginBottom: spacing.xs },
  duaTranslit: { fontSize: fontSizes.caption, fontStyle: 'italic' },
});
