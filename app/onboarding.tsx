import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  I18nManager,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';
import { useTheme } from '../src/hooks/useTheme';
import { t, languageNames, isRTL } from '../src/i18n';
import { fontSizes, spacing, borderRadius } from '../src/theme';
import type { Language, GrowthCategory } from '../src/types';

type IconFamily = 'ionicons' | 'material';

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

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [selectedCategories, setSelectedCategories] = useState<GrowthCategory[]>([]);

  const setLanguage = useAppStore((s) => s.setLanguage);
  const setGrowthCategories = useAppStore((s) => s.setGrowthCategories);
  const setOnboardingCompleted = useAppStore((s) => s.setOnboardingCompleted);
  const { theme } = useTheme();

  const lang = selectedLang;

  const toggleCategory = (cat: GrowthCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const finishOnboarding = () => {
    setLanguage(selectedLang);
    setGrowthCategories(selectedCategories);
    setOnboardingCompleted();

    const shouldBeRTL = isRTL(selectedLang);
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      I18nManager.allowRTL(shouldBeRTL);
    }

    router.replace('/(tabs)/today');
  };

  // Step 0: Welcome
  if (step === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
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

  // Step 1: Language Selection
  if (step === 1) {
    const languages: Language[] = ['en', 'ar', 'ur'];
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContent}>
          <Text style={[styles.stepTitle, { color: theme.text }]}>
            Choose your language{'\n'}اختر لغتك{'\n'}اپنی زبان منتخب کریں
          </Text>
          <View style={styles.languageGrid}>
            {languages.map((l) => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.languageCard,
                  {
                    backgroundColor: selectedLang === l ? theme.primaryLight : theme.surface,
                    borderColor: selectedLang === l ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setSelectedLang(l)}
              >
                <Text style={[styles.languageNative, { color: theme.text }]}>
                  {languageNames[l].native}
                </Text>
                <Text style={[styles.languageEnglish, { color: theme.textSecondary }]}>
                  {languageNames[l].english}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={() => setStep(2)}
        >
          <Text style={styles.primaryButtonText}>{t(lang, 'common.next')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Step 2: Growth Categories
  if (step === 2) {
    const textAlign = isRTL(lang) ? 'right' as const : 'left' as const;
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.stepTitle, { color: theme.text, textAlign: 'center' }]}>
            {t(lang, 'onboarding.growthTitle')}
          </Text>
          <Text style={[styles.stepSubtitle, { color: theme.textSecondary, textAlign: 'center' }]}>
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
                  <View style={styles.categoryIcon}>
                    {cat.iconFamily === 'ionicons' ? (
                      <Ionicons name={cat.iconName as any} size={28} color={theme.primary} />
                    ) : (
                      <MaterialCommunityIcons name={cat.iconName as any} size={28} color={theme.primary} />
                    )}
                  </View>
                  <Text style={[styles.categoryName, { color: theme.text, textAlign }]}>
                    {t(lang, `categories.${cat.id}`)}
                  </Text>
                  <Text style={[styles.categoryNameAr, { color: theme.textSecondary }]}>
                    {t(lang, `categoriesAr.${cat.id}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.bottomBar}>
          {selectedCategories.length < 3 && (
            <Text style={[styles.hint, { color: theme.textTertiary }]}>
              {t(lang, 'onboarding.selectAtLeast')}
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: selectedCategories.length >= 3 ? theme.primary : theme.border,
              },
            ]}
            onPress={() => {
              if (selectedCategories.length >= 3) setStep(3);
            }}
            disabled={selectedCategories.length < 3}
          >
            <Text style={styles.primaryButtonText}>{t(lang, 'common.next')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Step 3: Done — go to app
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.centerContent}>
        <Ionicons name="checkmark-circle" size={64} color={theme.primary} style={styles.doneIcon} />
        <Text style={[styles.doneTitle, { color: theme.text }]}>
          {t(lang, 'onboarding.allSet')}
        </Text>
        <Text style={[styles.doneSubtitle, { color: theme.textSecondary }]}>
          {t(lang, 'onboarding.firstReflection')}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: theme.primary }]}
        onPress={finishOnboarding}
      >
        <Text style={styles.primaryButtonText}>{t(lang, 'common.done')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: spacing.xxl,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: spacing.md,
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
    marginBottom: spacing.sm,
    lineHeight: fontSizes.heading2 * 1.5,
  },
  stepSubtitle: {
    fontSize: fontSizes.bodySmall,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  languageGrid: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  languageCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  languageNative: {
    fontSize: fontSizes.heading2,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  languageEnglish: {
    fontSize: fontSizes.bodySmall,
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
  categoryIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: fontSizes.bodySmall,
    fontWeight: '600',
  },
  categoryNameAr: {
    fontSize: fontSizes.caption,
    marginTop: 2,
  },
  bottomBar: {
    paddingTop: spacing.md,
  },
  hint: {
    textAlign: 'center',
    fontSize: fontSizes.bodySmall,
    marginBottom: spacing.sm,
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
  doneIcon: {
    marginBottom: spacing.lg,
  },
  doneTitle: {
    fontSize: fontSizes.heading1,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  doneSubtitle: {
    fontSize: fontSizes.body,
    textAlign: 'center',
  },
});
