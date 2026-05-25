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
import { hapticLight } from '../src/utils/haptics';
import type { Language, GrowthCategory } from '../src/types';

type IconFamily = 'ionicons' | 'material';
const TOTAL_STEPS = 4;

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

function ProgressDots({ current, total, color }: { current: number; total: number; color: string }) {
  return (
    <View style={styles.dotsRow} accessibilityLabel={`Step ${current + 1} of ${total}`}>
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
  const [isLoading, setIsLoading] = useState(false);

  const setLanguage = useAppStore((s) => s.setLanguage);
  const setGrowthCategories = useAppStore((s) => s.setGrowthCategories);
  const setOnboardingCompleted = useAppStore((s) => s.setOnboardingCompleted);
  const setLocation = useAppStore((s) => s.setLocation);
  const setGoalConfig = useAppStore((s) => s.setGoalConfig);
  const { theme } = useTheme();

  const lang = selectedLang;

  const toggleCategory = (cat: GrowthCategory) => {
    hapticLight();
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleLocationRequest = async () => {
    if (Platform.OS === 'web') {
      setStep(2);
      return;
    }
    const granted = await requestLocationPermission();
    if (granted) {
      const loc = await getCurrentLocation();
      if (loc) {
        setLocation(loc.lat, loc.lng, `${loc.cityName}, ${loc.countryName}`);
      }
    }
    setStep(2);
  };

  const finishOnboarding = () => {
    setIsLoading(true);
    setLanguage(selectedLang);
    setGrowthCategories(selectedCategories);
    setGoalConfig({ ...DEFAULT_GOAL_CONFIG, quranVersesPerDay: 5 });
    setOnboardingCompleted();

    const shouldBeRTL = isRTL(selectedLang);
    if (Platform.OS !== 'web' && I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      I18nManager.allowRTL(shouldBeRTL);
    }

    setTimeout(() => {
      router.replace('/(tabs)/today');
    }, 1800);
  };

  const canGoNext = () => {
    if (step === 2) return selectedCategories.length >= 3;
    return true;
  };

  const goNext = () => {
    if (step === 3) {
      finishOnboarding();
      return;
    }
    if (step === 1) {
      handleLocationRequest();
      return;
    }
    setStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // ── Step 0: Welcome + Language ─────────────────────────────────
  if (step === 0) {
    const languages: Language[] = ['en', 'ar', 'ur'];
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ProgressDots current={0} total={TOTAL_STEPS} color={theme.primary} />
        <View style={styles.centerContent}>
          <Text style={[styles.appName, { color: theme.primary }]}>عَمَلِي</Text>
          <Text style={[styles.appNameLatin, { color: theme.primary }]}>AMALY</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            {lang === 'ar' ? 'ابدأ يومك بعملٍ صالح' : lang === 'ur' ? 'اپنا دن ایک نیک عمل سے شروع کرو' : 'Begin your day\nwith a good deed.'}
          </Text>

          <View style={styles.langRow}>
            {languages.map((l) => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.langChip,
                  {
                    backgroundColor: selectedLang === l ? theme.primary : theme.surface,
                    borderColor: selectedLang === l ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => { hapticLight(); setSelectedLang(l); }}
                accessibilityLabel={`Select ${languageNames[l].english}`}
                accessibilityRole="button"
              >
                <Text style={[styles.langNative, { color: selectedLang === l ? '#fff' : theme.text }]}>
                  {languageNames[l].native}
                </Text>
                <Text style={[styles.langEnglish, { color: selectedLang === l ? 'rgba(255,255,255,0.7)' : theme.textSecondary }]}>
                  {languageNames[l].english}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={() => setStep(1)}
          accessibilityLabel="Continue"
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            {lang === 'ar' ? 'ابدأ رحلتك' : lang === 'ur' ? 'سفر شروع کریں' : 'Start Your Journey'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Step 1: Location ───────────────────────────────────────────
  if (step === 1) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack} accessibilityLabel="Go back" accessibilityRole="button">
            <Ionicons name={lang === 'ar' || lang === 'ur' ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.text} />
          </TouchableOpacity>
          <ProgressDots current={1} total={TOTAL_STEPS} color={theme.primary} />
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centerContent}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="location" size={48} color={theme.primary} />
          </View>
          <Text style={[styles.stepTitle, { color: theme.text, marginTop: spacing.lg }]}>
            {lang === 'ar' ? 'تحديد الموقع' : lang === 'ur' ? 'مقام کا تعین' : 'Enable Location'}
          </Text>
          <Text style={[styles.stepSubtitle, { color: theme.textSecondary }]}>
            {lang === 'ar' ? 'لحساب أوقات الصلاة الدقيقة واتجاه القبلة' : lang === 'ur' ? 'نماز کے درست اوقات اور قبلے کی سمت کے لیے' : 'For accurate prayer times\nand Qibla direction'}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={goNext}
            accessibilityLabel="Enable location"
            accessibilityRole="button"
          >
            <Ionicons name="location" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>{t(lang, 'location.autoDetect')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={() => setStep(2)} accessibilityLabel="Skip location" accessibilityRole="button">
            <Text style={[styles.skipText, { color: theme.textTertiary }]}>
              {lang === 'ar' ? 'تخطي' : lang === 'ur' ? 'چھوڑیں' : 'Skip for now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Step 2: Growth Categories ──────────────────────────────────
  if (step === 2) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack} accessibilityLabel="Go back" accessibilityRole="button">
            <Ionicons name={lang === 'ar' || lang === 'ur' ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.text} />
          </TouchableOpacity>
          <ProgressDots current={2} total={TOTAL_STEPS} color={theme.primary} />
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                  accessibilityLabel={`${t(lang, `categories.${cat.id}`)}: ${isSelected ? 'selected' : 'not selected'}`}
                  accessibilityRole="button"
                >
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                  {cat.iconFamily === 'ionicons' ? (
                    <Ionicons name={cat.iconName as any} size={28} color={isSelected ? theme.primary : theme.textSecondary} />
                  ) : (
                    <MaterialCommunityIcons name={cat.iconName as any} size={28} color={isSelected ? theme.primary : theme.textSecondary} />
                  )}
                  <Text style={[styles.categoryName, { color: isSelected ? theme.primary : theme.text }]}>
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
          accessibilityLabel="Continue"
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>{t(lang, 'common.next')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Step 3: All Set ────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ProgressDots current={3} total={TOTAL_STEPS} color={theme.primary} />
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
            <View style={[styles.doneIconCircle, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="checkmark-circle" size={64} color={theme.primary} />
            </View>
            <Text style={[styles.doneTitle, { color: theme.text }]}>
              {t(lang, 'onboarding.allSet')}
            </Text>
            <Text style={[styles.doneSubtitle, { color: theme.textSecondary }]}>
              {t(lang, 'onboarding.firstReflection')}
            </Text>
            <Text style={[styles.settingsHint, { color: theme.textTertiary }]}>
              {lang === 'ar' ? 'يمكنك تخصيص الخط وطريقة الحساب والمزيد من الإعدادات'
                : lang === 'ur' ? 'آپ فونٹ، حساب کا طریقہ اور مزید سیٹنگز سے تبدیل کر سکتے ہیں'
                : 'You can customize font, calculation method, and more in Settings'}
            </Text>
          </>
        )}
      </View>
      {!isLoading && (
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={finishOnboarding}
          accessibilityLabel="Get started"
          accessibilityRole="button"
        >
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
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 24, borderRadius: 4 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: spacing.xl },
  appName: { fontSize: 72, fontWeight: '300', marginBottom: spacing.xs },
  appNameLatin: { fontSize: fontSizes.heading3, fontWeight: '600', letterSpacing: 6, marginBottom: spacing.xl },
  tagline: { fontSize: fontSizes.heading2, textAlign: 'center', lineHeight: fontSizes.heading2 * 1.5, marginBottom: spacing.xl },

  langRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  langChip: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 90,
  },
  langNative: { fontSize: fontSizes.heading3, fontWeight: '700', marginBottom: 2 },
  langEnglish: { fontSize: fontSizes.caption },

  iconCircle: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center' },
  stepTitle: {
    fontSize: fontSizes.heading2,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: fontSizes.heading2 * 1.5,
  },
  stepSubtitle: { fontSize: fontSizes.body, textAlign: 'center', marginBottom: spacing.xl, lineHeight: fontSizes.body * 1.6 },

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
    position: 'relative',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: { fontSize: fontSizes.bodySmall, fontWeight: '600', marginTop: spacing.xs },
  hint: { textAlign: 'center', fontSize: fontSizes.bodySmall, marginTop: spacing.lg },

  primaryButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: fontSizes.body, fontWeight: '700' },
  skipButton: { paddingVertical: spacing.md, alignItems: 'center' },
  skipText: { fontSize: fontSizes.body },

  doneIconCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  doneTitle: { fontSize: fontSizes.heading1, fontWeight: '700', marginBottom: spacing.sm, textAlign: 'center' },
  doneSubtitle: { fontSize: fontSizes.body, textAlign: 'center', marginBottom: spacing.md },
  settingsHint: { fontSize: fontSizes.caption, textAlign: 'center', lineHeight: fontSizes.caption * 1.6 },
  loadingText: { fontSize: fontSizes.body, marginTop: spacing.lg, textAlign: 'center' },
});
