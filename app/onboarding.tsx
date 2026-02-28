import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  I18nManager,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';
import { useTheme } from '../src/hooks/useTheme';
import { t, languageNames, isRTL } from '../src/i18n';
import { fontSizes, spacing, borderRadius } from '../src/theme';
import { requestLocationPermission, getCurrentLocation } from '../src/services/locationService';
import { DEFAULT_GOAL_CONFIG } from '../src/services/goalsService';
import type { Language, GrowthCategory, CalculationMethod } from '../src/types';

type IconFamily = 'ionicons' | 'material';

const TOTAL_STEPS = 8;

const GROWTH_CATEGORIES: {
  id: GrowthCategory;
  iconName: string;
  iconFamily: IconFamily;
}[] = [
  { id: 'sabr', iconName: 'shield-outline', iconFamily: 'material' },
  { id: 'shukr', iconName: 'hand-heart', iconFamily: 'material' },
  { id: 'family', iconName: 'people-outline', iconFamily: 'ionicons' },
  { id: 'worship', iconName: 'mosque', iconFamily: 'material' },
  { id: 'character', iconName: 'star-outline', iconFamily: 'ionicons' },
  { id: 'knowledge', iconName: 'library-outline', iconFamily: 'ionicons' },
  { id: 'generosity', iconName: 'hand-heart-outline', iconFamily: 'material' },
  { id: 'tawakkul', iconName: 'heart-outline', iconFamily: 'ionicons' },
  { id: 'justice', iconName: 'scale-balance', iconFamily: 'material' },
  { id: 'death_remembrance', iconName: 'dove', iconFamily: 'material' },
];

const CALC_METHODS: { id: CalculationMethod; label: string; region: string }[] = [
  { id: 'UmmAlQura', label: 'Umm al-Qura', region: 'Saudi Arabia' },
  { id: 'MuslimWorldLeague', label: 'Muslim World League', region: 'Global' },
  { id: 'Egyptian', label: 'Egyptian General Authority', region: 'Egypt / Africa' },
  { id: 'Karachi', label: 'University of Islamic Sciences', region: 'Pakistan' },
  { id: 'NorthAmerica', label: 'ISNA', region: 'North America' },
  { id: 'Turkey', label: 'Diyanet', region: 'Turkey' },
  { id: 'Dubai', label: 'Dubai', region: 'UAE' },
  { id: 'Singapore', label: 'MUIS', region: 'Singapore / SE Asia' },
  { id: 'Tehran', label: 'Geophysics Institute', region: 'Iran' },
  { id: 'Kuwait', label: 'Kuwait', region: 'Kuwait' },
];

const VERSE_OPTIONS = [1, 3, 5, 10];

const FONT_CHOICES = [
  { id: 'standard', fontFamily: undefined },
  { id: 'mushaf', fontFamily: 'AmiriQuran' },
  { id: 'indopak', fontFamily: 'NotoNastaliqUrdu' },
] as const;

function getFontLabel(id: string, lang: Language): string {
  if (id === 'standard') return lang === 'ar' ? 'خط نسخ' : lang === 'ur' ? 'نسخ' : 'Standard Naskh';
  if (id === 'mushaf') return lang === 'ar' ? 'خط المصحف' : lang === 'ur' ? 'مصحف' : 'Mushaf (Amiri)';
  return lang === 'ar' ? 'خط هندي-باكستاني' : lang === 'ur' ? 'انڈو پاک نستعلیق' : 'Indo-Pak Nastaliq';
}

function ProgressDots({ current, total, color }: { current: number; total: number; color: string }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i <= current ? color : '#D9D9D9' },
            i === current && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [selectedCategories, setSelectedCategories] = useState<GrowthCategory[]>([]);
  const [selectedVersesPerDay, setSelectedVersesPerDay] = useState(5);
  const [selectedCalcMethod, setSelectedCalcMethod] = useState<CalculationMethod>('MuslimWorldLeague');
  const [selectedFont, setSelectedFont] = useState('standard');
  const [locationGranted, setLocationGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setLanguage = useAppStore((s) => s.setLanguage);
  const setGrowthCategories = useAppStore((s) => s.setGrowthCategories);
  const setOnboardingCompleted = useAppStore((s) => s.setOnboardingCompleted);
  const setCalculationMethod = useAppStore((s) => s.setCalculationMethod);
  const setLocation = useAppStore((s) => s.setLocation);
  const setGoalConfig = useAppStore((s) => s.setGoalConfig);
  const { theme } = useTheme();

  const lang = selectedLang;

  const toggleCategory = (cat: GrowthCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleLocationRequest = async () => {
    if (Platform.OS === 'web') {
      setLocationGranted(true);
      setStep(3);
      return;
    }
    const granted = await requestLocationPermission();
    setLocationGranted(granted);
    if (granted) {
      const loc = await getCurrentLocation();
      if (loc) {
        setLocation(loc.lat, loc.lng, `${loc.cityName}, ${loc.countryName}`);
      }
    }
    setStep(3);
  };

  const finishOnboarding = () => {
    setIsLoading(true);
    setLanguage(selectedLang);
    setGrowthCategories(selectedCategories);
    setCalculationMethod(selectedCalcMethod);
    setGoalConfig({
      ...DEFAULT_GOAL_CONFIG,
      quranVersesPerDay: selectedVersesPerDay,
    });
    setOnboardingCompleted();

    const shouldBeRTL = isRTL(selectedLang);
    if (Platform.OS !== 'web' && I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      I18nManager.allowRTL(shouldBeRTL);
    }

    setTimeout(() => {
      router.replace('/(tabs)/today');
    }, 2000);
  };

  const canGoNext = () => {
    if (step === 6) return selectedCategories.length >= 3;
    return true;
  };

  const goNext = () => {
    if (step === 7) {
      finishOnboarding();
      return;
    }
    if (step === 2) {
      handleLocationRequest();
      return;
    }
    setStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // Step 0: Welcome
  if (step === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ProgressDots current={0} total={TOTAL_STEPS} color={theme.primary} />
        <View style={styles.centerContent}>
          <Text style={[styles.appName, { color: theme.primary }]}>نية</Text>
          <Text style={[styles.appNameLatin, { color: theme.primary }]}>Niyyah</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Begin every day{'\n'}with intention.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={() => setStep(1)}
        >
          <Text style={styles.primaryButtonText}>Start Your Journey</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Step 1: Language
  if (step === 1) {
    const languages: Language[] = ['en', 'ar', 'ur'];
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <ProgressDots current={1} total={TOTAL_STEPS} color={theme.primary} />
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <Text style={[styles.stepTitle, { color: theme.text }]}>
            {`Choose your language\nاختر لغتك\nاپنی زبان منتخب کریں`}
          </Text>
          <View style={styles.optionGrid}>
            {languages.map((l) => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: selectedLang === l ? theme.primaryLight : theme.surface,
                    borderColor: selectedLang === l ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setSelectedLang(l)}
              >
                <Text style={[styles.optionTitle, { color: theme.text }]}>{languageNames[l].native}</Text>
                <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>{languageNames[l].english}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={goNext}>
          <Text style={styles.primaryButtonText}>{t(lang, 'common.next')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Step 2: Location
  if (step === 2) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <ProgressDots current={2} total={TOTAL_STEPS} color={theme.primary} />
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="location-outline" size={64} color={theme.primary} />
          <Text style={[styles.stepTitle, { color: theme.text, marginTop: spacing.lg }]}>
            {lang === 'ar' ? 'تحديد الموقع' : lang === 'ur' ? 'مقام کا تعین' : 'Enable Location'}
          </Text>
          <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>
            {lang === 'ar' ? 'لحساب أوقات الصلاة الدقيقة واتجاه القبلة' : lang === 'ur' ? 'نماز کے درست اوقات اور قبلے کی سمت کے لیے' : 'For accurate prayer times and Qibla direction'}
          </Text>
        </View>
        <View>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={goNext}>
            <Text style={styles.primaryButtonText}>{t(lang, 'location.autoDetect')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={() => setStep(3)}>
            <Text style={[styles.skipText, { color: theme.textTertiary }]}>
              {lang === 'ar' ? 'تخطي' : lang === 'ur' ? 'چھوڑیں' : 'Skip for now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Step 3: Font Preference
  if (step === 3) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <ProgressDots current={3} total={TOTAL_STEPS} color={theme.primary} />
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <Text style={[styles.stepTitle, { color: theme.text }]}>
            {lang === 'ar' ? 'اختر الخط' : lang === 'ur' ? 'فونٹ منتخب کریں' : 'Choose a font'}
          </Text>
          <View style={styles.optionGrid}>
            {FONT_CHOICES.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: selectedFont === f.id ? theme.primaryLight : theme.surface,
                    borderColor: selectedFont === f.id ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setSelectedFont(f.id)}
              >
                <Text style={[styles.optionTitle, { color: theme.text }]}>{getFontLabel(f.id, lang)}</Text>
                <Text style={[styles.fontPreview, { color: theme.textArabic, fontFamily: f.fontFamily }]}>
                  بِسْمِ ٱللَّهِ
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={goNext}>
          <Text style={styles.primaryButtonText}>{t(lang, 'common.next')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Step 4: Daily Quran Goal
  if (step === 4) {
    const getEncouragement = () => {
      if (selectedVersesPerDay <= 3) {
        return lang === 'ar'
          ? 'أحب الأعمال إلى الله أدومها وإن قل — صحيح البخاري'
          : lang === 'ur'
          ? 'اللہ کو سب سے پسندیدہ عمل وہ ہے جو مسلسل ہو چاہے تھوڑا ہو — صحیح بخاری'
          : 'The most beloved deed to Allah is that which is regular, even if it is little. — Sahih al-Bukhari';
      }
      if (selectedVersesPerDay === 5) {
        return lang === 'ar' ? 'خيار ممتاز! المداومة هي الأهم.' : lang === 'ur' ? 'بہترین انتخاب! مسلسل رہنا اہم ہے۔' : 'Great choice! Consistency is what matters.';
      }
      return lang === 'ar'
        ? 'البداية بهدف عالٍ قد يصعّب الاستمرار على المدى الطويل!'
        : lang === 'ur'
        ? 'زیادہ ہدف سے شروع کرنا طویل مدت میں مشکل ہو سکتا ہے!'
        : 'Starting with a high target makes it difficult to maintain long term!';
    };

    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <ProgressDots current={4} total={TOTAL_STEPS} color={theme.primary} />
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <Text style={[styles.stepTitle, { color: theme.text }]}>
            {lang === 'ar' ? 'هدفك اليومي' : lang === 'ur' ? 'آپ کا روزانہ ہدف' : 'Your daily goal'}
          </Text>
          <View style={styles.versesGrid}>
            {VERSE_OPTIONS.map((v) => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.verseCard,
                  {
                    backgroundColor: selectedVersesPerDay === v ? theme.primaryLight : theme.surface,
                    borderColor: selectedVersesPerDay === v ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setSelectedVersesPerDay(v)}
              >
                <Text style={[styles.verseNumber, { color: selectedVersesPerDay === v ? theme.primary : theme.text }]}>
                  {v}
                </Text>
                <Text style={[styles.verseLabel, { color: selectedVersesPerDay === v ? theme.primary : theme.textSecondary }]}>
                  {lang === 'ar' ? 'آية يومياً' : lang === 'ur' ? 'آیات روزانہ' : `Verse${v > 1 ? 's' : ''} per day`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.encouragement, { borderColor: theme.primary }]}>
            <Text style={[styles.encouragementText, { color: theme.text }]}>
              {getEncouragement()}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={goNext}>
          <Text style={styles.primaryButtonText}>{t(lang, 'common.next')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Step 5: Calculation Method
  if (step === 5) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <ProgressDots current={5} total={TOTAL_STEPS} color={theme.primary} />
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.stepTitle, { color: theme.text }]}>
            {t(lang, 'settings.calculationMethod')}
          </Text>
          {CALC_METHODS.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.calcCard,
                {
                  backgroundColor: selectedCalcMethod === m.id ? theme.primaryLight : theme.surface,
                  borderColor: selectedCalcMethod === m.id ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setSelectedCalcMethod(m.id)}
            >
              <Text style={[styles.calcLabel, { color: theme.text }]}>{m.label}</Text>
              <Text style={[styles.calcRegion, { color: theme.textSecondary }]}>{m.region}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={goNext}>
          <Text style={styles.primaryButtonText}>{t(lang, 'common.next')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Step 6: Growth Categories
  if (step === 6) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <ProgressDots current={6} total={TOTAL_STEPS} color={theme.primary} />
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.stepTitle, { color: theme.text }]}>
            {t(lang, 'onboarding.growthTitle')}
          </Text>
          <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>
            {t(lang, 'onboarding.growthSubtitle')}
          </Text>
          <View style={styles.categoryGrid}>
            {GROWTH_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected ? theme.primaryLight : theme.surface,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => toggleCategory(cat.id)}
                >
                  {cat.iconFamily === 'ionicons' ? (
                    <Ionicons name={cat.iconName as any} size={28} color={theme.primary} />
                  ) : (
                    <MaterialCommunityIcons name={cat.iconName as any} size={28} color={theme.primary} />
                  )}
                  <Text style={[styles.categoryName, { color: theme.text }]}>
                    {t(lang, `categories.${cat.id}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedCategories.length < 3 && (
            <Text style={[styles.hint, { color: theme.textTertiary }]}>
              {t(lang, 'onboarding.selectAtLeast')}
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: canGoNext() ? theme.primary : theme.border }]}
          onPress={goNext}
          disabled={!canGoNext()}
        >
          <Text style={styles.primaryButtonText}>{t(lang, 'common.next')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Step 7: All Set / Loading
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ProgressDots current={7} total={TOTAL_STEPS} color={theme.primary} />
      <View style={styles.centerContent}>
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.text }]}>
              {lang === 'ar' ? 'جارٍ بناء خطتك...' : lang === 'ur' ? 'آپ کا منصوبہ تیار ہو رہا ہے...' : 'Building your personalized plan...'}
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={64} color={theme.primary} />
            <Text style={[styles.doneTitle, { color: theme.text }]}>
              {t(lang, 'onboarding.allSet')}
            </Text>
            <Text style={[styles.doneSubtitle, { color: theme.textSecondary }]}>
              {t(lang, 'onboarding.firstReflection')}
            </Text>
          </>
        )}
      </View>
      {!isLoading && (
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={finishOnboarding}>
          <Text style={styles.primaryButtonText}>{t(lang, 'common.done')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  appName: {
    fontSize: 72,
    fontWeight: '300',
    marginBottom: spacing.sm,
  },
  appNameLatin: {
    fontSize: fontSizes.heading1,
    fontWeight: '300',
    letterSpacing: 4,
    marginBottom: spacing.xl,
  },
  tagline: {
    fontSize: fontSizes.heading2,
    textAlign: 'center',
    lineHeight: fontSizes.heading2 * 1.5,
  },
  stepTitle: {
    fontSize: fontSizes.heading2,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: fontSizes.heading2 * 1.5,
  },
  stepSubtitle: {
    fontSize: fontSizes.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  optionGrid: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  optionCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: fontSizes.heading3,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  optionSubtitle: {
    fontSize: fontSizes.bodySmall,
  },
  fontPreview: {
    fontSize: 28,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  versesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  verseCard: {
    width: '45%',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  verseNumber: {
    fontSize: 36,
    fontWeight: '700',
  },
  verseLabel: {
    fontSize: fontSizes.bodySmall,
    marginTop: spacing.xs,
  },
  encouragement: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.xl,
    width: '100%',
  },
  encouragementText: {
    fontSize: fontSizes.body,
    textAlign: 'center',
    lineHeight: fontSizes.body * 1.6,
  },
  calcCard: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    marginBottom: spacing.sm,
  },
  calcLabel: {
    fontSize: fontSizes.body,
    fontWeight: '600',
  },
  calcRegion: {
    fontSize: fontSizes.caption,
    marginTop: 2,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  categoryChip: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
    width: '47%',
  },
  categoryName: {
    fontSize: fontSizes.bodySmall,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  hint: {
    textAlign: 'center',
    fontSize: fontSizes.bodySmall,
    marginTop: spacing.lg,
  },
  primaryButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: fontSizes.body,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  skipText: {
    fontSize: fontSizes.body,
  },
  doneTitle: {
    fontSize: fontSizes.heading1,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  doneSubtitle: {
    fontSize: fontSizes.body,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: fontSizes.body,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
