import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getArabicFontFamily, getTranslationFontFamily } from '../../src/theme/typography';
import type { Language } from '../../src/types';

interface PrayerStep {
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

const PRAYER_STEPS: PrayerStep[] = [
  {
    stepNumber: 1,
    titleEn: 'Intention (Niyyah)',
    titleAr: 'النية',
    titleUr: 'نیت',
    descriptionEn: 'Make the intention in your heart for the specific prayer you are about to perform. The intention does not need to be spoken aloud.',
    descriptionAr: 'اعقد النية في قلبك للصلاة التي تريد أداءها. لا يُشترط التلفظ بالنية.',
    descriptionUr: 'جس نماز کی ادائیگی کا ارادہ ہو اس کی نیت دل میں کریں۔ نیت زبان سے کہنا ضروری نہیں۔',
  },
  {
    stepNumber: 2,
    titleEn: 'Takbeer al-Ihram (Opening)',
    titleAr: 'تكبيرة الإحرام',
    titleUr: 'تکبیر تحریمہ',
    descriptionEn: 'Raise both hands to shoulder or ear level and say "Allahu Akbar" (Allah is the Greatest). This marks the beginning of the prayer.',
    descriptionAr: 'ارفع يديك إلى مستوى الكتفين أو الأذنين وقل "الله أكبر". هذا يبدأ الصلاة.',
    descriptionUr: 'دونوں ہاتھ کانوں یا کندھوں تک اٹھائیں اور "اللہ اکبر" کہیں۔ اس سے نماز شروع ہوتی ہے۔',
    duaAr: 'اللهُ أَكْبَرُ',
    duaTransliterationEn: 'Allaahu Akbar',
  },
  {
    stepNumber: 3,
    titleEn: 'Opening Supplication (Dua al-Istiftah)',
    titleAr: 'دعاء الاستفتاح',
    titleUr: 'دعائے استفتاح',
    descriptionEn: 'Place your right hand over your left on your chest. Recite the opening supplication quietly.',
    descriptionAr: 'ضع يدك اليمنى على اليسرى فوق الصدر. اقرأ دعاء الاستفتاح سرًا.',
    descriptionUr: 'دایاں ہاتھ بائیں ہاتھ پر سینے پر رکھیں۔ آہستہ سے دعائے استفتاح پڑھیں۔',
    duaAr: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَـٰهَ غَيْرُكَ',
    duaTransliterationEn: 'SubhaanakAllaahumma wa bihamdik, wa tabaarakasmuk, wa ta\'aalaa jadduk, wa laa ilaaha ghayruk',
  },
  {
    stepNumber: 4,
    titleEn: 'Recitation of Al-Fatihah',
    titleAr: 'قراءة الفاتحة',
    titleUr: 'سورۃ الفاتحہ کی تلاوت',
    descriptionEn: 'Begin with "A\'udhu billahi min ash-shaytaan ir-rajeem, Bismillah ir-Rahman ir-Raheem" then recite Surah Al-Fatihah. This is obligatory in every unit (rak\'ah) of prayer.',
    descriptionAr: 'ابدأ بالاستعاذة والبسملة ثم اقرأ سورة الفاتحة. هذا واجب في كل ركعة.',
    descriptionUr: 'اعوذ باللہ اور بسم اللہ پڑھ کر سورۃ الفاتحہ کی تلاوت کریں۔ یہ ہر رکعت میں واجب ہے۔',
    duaAr: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۝ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۝ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
  },
  {
    stepNumber: 5,
    titleEn: 'Ruku (Bowing)',
    titleAr: 'الركوع',
    titleUr: 'رکوع',
    descriptionEn: 'Say "Allahu Akbar" and bow with your back straight and hands on knees. Say the dhikr of ruku three times.',
    descriptionAr: 'قل "الله أكبر" واركع بظهر مستقيم ويدين على الركبتين. قل ذكر الركوع ثلاث مرات.',
    descriptionUr: 'اللہ اکبر کہتے ہوئے رکوع میں جائیں، کمر سیدھی رکھیں اور ہاتھ گھٹنوں پر۔ رکوع کی تسبیح تین مرتبہ پڑھیں۔',
    duaAr: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    duaTransliterationEn: 'Subhaana Rabbiyal-\'Adheem',
  },
  {
    stepNumber: 6,
    titleEn: 'Standing from Ruku',
    titleAr: 'الرفع من الركوع',
    titleUr: 'رکوع سے کھڑے ہونا',
    descriptionEn: 'Rise from bowing saying "Sami\'Allahu liman hamidah" then say "Rabbana wa lakal-hamd" while standing straight.',
    descriptionAr: 'قم من الركوع قائلاً "سمع الله لمن حمده" ثم قل "ربنا ولك الحمد" وأنت واقف.',
    descriptionUr: 'رکوع سے اٹھتے ہوئے "سمع اللہ لمن حمدہ" کہیں، پھر سیدھے کھڑے ہو کر "ربنا ولک الحمد" کہیں۔',
    duaAr: 'سَمِعَ اللهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ',
    duaTransliterationEn: "Sami'Allaahu liman hamidah, Rabbanaa wa lakal-hamd",
  },
  {
    stepNumber: 7,
    titleEn: 'Sujood (Prostration)',
    titleAr: 'السجود',
    titleUr: 'سجدہ',
    descriptionEn: 'Say "Allahu Akbar" and go into prostration. Seven body parts touch the ground: forehead with nose, both palms, both knees, and both sets of toes. Say the dhikr three times.',
    descriptionAr: 'قل "الله أكبر" واسجد على سبعة أعضاء: الجبهة مع الأنف، الكفين، الركبتين، وأطراف القدمين. قل الذكر ثلاث مرات.',
    descriptionUr: 'اللہ اکبر کہتے ہوئے سجدے میں جائیں۔ سات اعضاء زمین پر ہوں: پیشانی ناک سمیت، دونوں ہتھیلیاں، دونوں گھٹنے، دونوں پاؤں کی انگلیاں۔ تسبیح تین مرتبہ پڑھیں۔',
    duaAr: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ',
    duaTransliterationEn: "Subhaana Rabbiyal-A'laa",
  },
  {
    stepNumber: 8,
    titleEn: 'Sitting Between Two Sujood',
    titleAr: 'الجلوس بين السجدتين',
    titleUr: 'دو سجدوں کے درمیان بیٹھنا',
    descriptionEn: 'Rise from prostration saying "Allahu Akbar" and sit briefly, then say the supplication before performing the second prostration.',
    descriptionAr: 'ارفع من السجود قائلاً "الله أكبر" واجلس لحظة، ثم ادع قبل السجدة الثانية.',
    descriptionUr: 'اللہ اکبر کہتے ہوئے سجدے سے اٹھیں اور تھوڑی دیر بیٹھیں، دعا پڑھیں پھر دوسرا سجدہ کریں۔',
    duaAr: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
    duaTransliterationEn: 'Rabbighfir lee, Rabbighfir lee',
  },
  {
    stepNumber: 9,
    titleEn: 'Tashahhud (Sitting)',
    titleAr: 'التشهد',
    titleUr: 'تشہد',
    descriptionEn: 'After every two rak\'ahs, sit and recite the Tashahhud. Point your index finger during the declaration of faith.',
    descriptionAr: 'بعد كل ركعتين، اجلس واقرأ التشهد. أشر بالسبابة عند الشهادة.',
    descriptionUr: 'ہر دو رکعتوں کے بعد بیٹھ کر تشہد پڑھیں۔ شہادت کے وقت شہادت کی انگلی سے اشارہ کریں۔',
    duaAr: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَـٰهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    duaTransliterationEn: "At-tahiyyaatu lillaahi was-salawaatu wat-tayyibaat, as-salaamu 'alayka ayyuhan-nabiyyu wa rahmatullaahi wa barakaatuh, as-salaamu 'alaynaa wa 'alaa 'ibaadillaahis-saaliheen, ash-hadu an laa ilaaha illallaah wa ash-hadu anna Muhammadan 'abduhu wa rasooluh",
  },
  {
    stepNumber: 10,
    titleEn: 'Salaam (Ending)',
    titleAr: 'التسليم',
    titleUr: 'سلام',
    descriptionEn: 'After the final Tashahhud and Durood Ibrahim, turn your head to the right saying "As-salamu alaykum wa rahmatullah", then turn to the left and repeat.',
    descriptionAr: 'بعد التشهد الأخير والصلاة الإبراهيمية، التفت يمينًا وقل "السلام عليكم ورحمة الله" ثم يسارًا وأعد.',
    descriptionUr: 'آخری تشہد اور درود ابراہیم کے بعد دائیں طرف سر پھیر کر "السلام علیکم ورحمۃ اللہ" کہیں، پھر بائیں طرف بھی ایسے ہی کہیں۔',
    duaAr: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ',
    duaTransliterationEn: "As-salaamu 'alaykum wa rahmatullaah",
  },
];

const RAKAH_TABLE = [
  { prayer: 'Fajr', fard: 2, sunnah: '2 before' },
  { prayer: 'Dhuhr', fard: 4, sunnah: '4 before, 2 after' },
  { prayer: 'Asr', fard: 4, sunnah: '4 before (optional)' },
  { prayer: 'Maghrib', fard: 3, sunnah: '2 after' },
  { prayer: 'Isha', fard: 4, sunnah: '2 after + 3 Witr' },
];

export default function PrayerGuideScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();

  const getTitle = (step: PrayerStep) =>
    language === 'ar' ? step.titleAr : language === 'ur' ? step.titleUr : step.titleEn;
  const getDesc = (step: PrayerStep) =>
    language === 'ar' ? step.descriptionAr : language === 'ur' ? step.descriptionUr : step.descriptionEn;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.primary }]}>
            {`${language === 'ar' || language === 'ur' ? '\u2192' : '\u2190'} ${t(language, 'common.back')}`}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <MaterialCommunityIcons name="book-open-outline" size={24} color={theme.primary} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {language === 'ar' ? 'دليل الصلاة' : language === 'ur' ? 'نماز کی رہنمائی' : 'Prayer Guide'}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rak'ah Reference */}
        <View style={[styles.tableCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionLabel, { color: theme.primary }]}>
            {language === 'ar' ? 'عدد الركعات' : language === 'ur' ? 'رکعات کی تعداد' : "Rak'ah Count"}
          </Text>
          {RAKAH_TABLE.map((row) => (
            <View key={row.prayer} style={[styles.tableRow, { borderColor: theme.border }]}>
              <Text style={[styles.tablePrayer, { color: theme.text }]}>{row.prayer}</Text>
              <Text style={[styles.tableFard, { color: theme.primary }]}>
                {`${row.fard} ${language === 'ar' ? 'فرض' : language === 'ur' ? 'فرض' : 'Fard'}`}
              </Text>
              <Text style={[styles.tableSunnah, { color: theme.textSecondary }]}>{row.sunnah}</Text>
            </View>
          ))}
        </View>

        {/* Step-by-Step */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {language === 'ar' ? 'خطوات الصلاة' : language === 'ur' ? 'نماز کے مراحل' : 'Step-by-Step Guide'}
        </Text>

        {PRAYER_STEPS.map((step) => (
          <View key={step.stepNumber} style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.stepNumber, { color: theme.primary }]}>{step.stepNumber}</Text>
              </View>
              <Text style={[styles.stepTitle, { color: theme.text }]}>{getTitle(step)}</Text>
            </View>

            <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>{getDesc(step)}</Text>

            {step.duaAr && (
              <View style={[styles.duaBox, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.duaArabic, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>
                  {step.duaAr}
                </Text>
                {step.duaTransliterationEn && language !== 'ar' && (
                  <Text style={[styles.duaTranslit, { color: theme.textTertiary }]}>
                    {step.duaTransliterationEn}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  backButton: { width: 80 },
  backText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: fontSizes.body, fontWeight: '700', marginTop: 2 },
  headerSpacer: { width: 80 },
  content: { padding: spacing.md },
  sectionTitle: { fontSize: fontSizes.heading2, fontWeight: '800', marginBottom: spacing.md, marginTop: spacing.md },
  sectionLabel: { fontSize: fontSizes.heading3, fontWeight: '700', marginBottom: spacing.md },
  tableCard: { borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, marginBottom: spacing.md },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderTopWidth: 1 },
  tablePrayer: { flex: 1, fontSize: fontSizes.body, fontWeight: '600' },
  tableFard: { flex: 1, fontSize: fontSizes.bodySmall, fontWeight: '700', textAlign: 'center' },
  tableSunnah: { flex: 1.5, fontSize: fontSizes.caption, textAlign: 'right' },
  stepCard: { borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, marginBottom: spacing.md },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  stepBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginEnd: spacing.md },
  stepNumber: { fontSize: fontSizes.body, fontWeight: '700' },
  stepTitle: { fontSize: fontSizes.body, fontWeight: '700', flex: 1 },
  stepDesc: { fontSize: fontSizes.bodySmall, lineHeight: fontSizes.bodySmall * lineHeights.latin, marginBottom: spacing.sm },
  duaBox: { borderRadius: borderRadius.md, padding: spacing.md },
  duaArabic: { fontSize: 20, textAlign: 'right', lineHeight: 20 * lineHeights.arabic, marginBottom: spacing.xs },
  duaTranslit: { fontSize: fontSizes.caption, fontStyle: 'italic', lineHeight: 20 },
});
