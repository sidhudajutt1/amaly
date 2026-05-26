import { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { useLocation } from '../../src/hooks/useLocation';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius, colorThemeMeta, type ColorThemeName } from '../../src/theme';
import type { Language, ColorTheme, CalculationMethod, ReciterId } from '../../src/types';

const FEEDBACK_EMAIL = 'amaly.app.feedback@gmail.com';
const FEEDBACK_FORM_URL = 'https://forms.gle/AmalyFeedback';

async function requestAppReview(language: Language) {
  const available = await StoreReview.isAvailableAsync();
  if (available) {
    await StoreReview.requestReview();
  } else {
    const msg =
      language === 'ar' ? 'شكراً جزيلاً على دعمك! تقييمك يساعدنا كثيراً.' :
      language === 'ur' ? 'آپ کے تعاون کا شکریہ! آپ کا ریویو ہمارے لیے بہت قیمتی ہے۔' :
      'Thank you for your support! Your review helps spread this Sadaqah Jariyah app.';
    Alert.alert(
      language === 'ar' ? 'تقييم التطبيق' : language === 'ur' ? 'ایپ ریویو' : 'Rate Amaly',
      msg,
    );
  }
}

const RECITERS: { id: ReciterId; name: string; nameAr: string }[] = [
  { id: 'alafasy', name: 'Mishary Alafasy', nameAr: 'مشاري العفاسي' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', nameAr: 'محمود خليل الحصري' },
  { id: 'minshawi', name: 'Mohamed Siddiq Al-Minshawi', nameAr: 'محمد صديق المنشاوي' },
  { id: 'abdulbasit', name: 'Abdul Basit Abdul Samad', nameAr: 'عبد الباسط عبد الصمد' },
  { id: 'sudais', name: 'Abdul Rahman Al-Sudais', nameAr: 'عبد الرحمن السديس' },
  { id: 'shuraim', name: 'Saud Al-Shuraim', nameAr: 'سعود الشريم' },
];

const CALC_METHODS: { id: CalculationMethod; label: string }[] = [
  { id: 'UmmAlQura', label: 'Umm al-Qura (Makkah)' },
  { id: 'MuslimWorldLeague', label: 'Muslim World League' },
  { id: 'Egyptian', label: 'Egyptian General Authority' },
  { id: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { id: 'Dubai', label: 'Dubai' },
  { id: 'Kuwait', label: 'Kuwait' },
  { id: 'Qatar', label: 'Qatar' },
  { id: 'Singapore', label: 'MUIS (Singapore)' },
  { id: 'Turkey', label: 'Diyanet (Turkey)' },
  { id: 'Tehran', label: 'Institute of Geophysics, Tehran' },
  { id: 'NorthAmerica', label: 'ISNA (North America)' },
  { id: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
];

function SettingRow({ label, value, onPress, theme }: {
  label: string;
  value?: string;
  onPress?: () => void;
  theme: Record<string, string>;
}) {
  const content = (
    <>
      <Text style={[styles.rowLabel, { color: onPress ? theme.text : theme.textTertiary }]}>{label}</Text>
      {value ? (
        <Text style={[styles.rowValue, { color: theme.textSecondary }]}>{`${value} ›`}</Text>
      ) : onPress ? (
        <Text style={[styles.rowValue, { color: theme.textSecondary }]}>›</Text>
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View style={[styles.row, { borderColor: theme.border }]}>
        {content}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.row, { borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      {content}
    </TouchableOpacity>
  );
}

function ToggleRow({ label, value, onToggle, theme }: {
  label: string;
  value: boolean;
  onToggle: () => void;
  theme: Record<string, string>;
}) {
  return (
    <View style={[styles.row, { borderColor: theme.border }]}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.border, true: theme.primary }}
      />
    </View>
  );
}

function SegmentedControl({ options, selected, onSelect, theme }: {
  options: { key: string; label: string }[];
  selected: string;
  onSelect: (key: string) => void;
  theme: Record<string, string>;
}) {
  return (
    <View style={[styles.segment, { borderColor: theme.border, backgroundColor: theme.surfaceElevated }]}>
      {options.map((opt) => {
        const isSelected = opt.key === selected;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.segmentBtn, isSelected && { backgroundColor: theme.primary }]}
            onPress={() => onSelect(opt.key)}
          >
            <Text style={[styles.segmentText, { color: isSelected ? '#fff' : theme.text }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function SettingsTab() {
  const language = useAppStore((s) => s.settings.language);
  const themeMode = useAppStore((s) => s.settings.theme);
  const calcMethod = useAppStore((s) => s.settings.calculationMethod);
  const showTransliteration = useAppStore((s) => s.settings.showTransliteration);
  const quranFontSize = useAppStore((s) => s.settings.quranFontSize);
  const translationFontSize = useAppStore((s) => s.settings.translationFontSize);
  const selectedReciter = useAppStore((s) => s.settings.selectedReciter);
  const colorThemeId = useAppStore((s) => s.settings.colorTheme);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const setTheme = useAppStore((s) => s.setTheme);
  const setColorTheme = useAppStore((s) => s.setColorTheme);
  const setCalculationMethod = useAppStore((s) => s.setCalculationMethod);
  const toggleTransliteration = useAppStore((s) => s.toggleTransliteration);
  const setQuranFontSize = useAppStore((s) => s.setQuranFontSize);
  const setTranslationFontSize = useAppStore((s) => s.setTranslationFontSize);
  const setReciter = useAppStore((s) => s.setReciter);
  const hijriAdjustment = useAppStore((s) => s.settings.hijriAdjustment);
  const setHijriAdjustment = useAppStore((s) => s.setHijriAdjustment);
  const { locationName, isDetecting, detectLocation, locationAutoDetect } = useLocation();
  const setLocationAutoDetect = useAppStore((s) => s.setLocationAutoDetect);
  const { theme } = useTheme();

  const currentMethodLabel = CALC_METHODS.find((m) => m.id === calcMethod)?.label || calcMethod;

  const handleRateApp = useCallback(() => requestAppReview(language), [language]);
  const handleReportContent = useCallback(() => {
    const subject = encodeURIComponent(
      language === 'ar' ? 'الإبلاغ عن محتوى' : language === 'ur' ? 'مواد کی اطلاع دیں' : 'Report Content — Amaly App',
    );
    const body = encodeURIComponent(
      language === 'ar' ? 'الرجاء وصف المشكلة:\n\n' : language === 'ur' ? 'براہ کرم مسئلہ بیان کریں:\n\n' : 'Please describe the issue:\n\nScreen: \nContent: \nConcern: ',
    );
    Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`);
  }, [language]);
  const handleFeedbackForm = useCallback(() => Linking.openURL(FEEDBACK_FORM_URL), []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.lg, paddingTop: spacing.md }}>
        <Ionicons name="settings-outline" size={24} color={theme.text} />
        <Text style={[styles.title, { color: theme.text, marginBottom: 0 }]}>
          {t(language, 'settings.title')}
        </Text>
      </View>

      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'settings.language')}
      </Text>
      <SegmentedControl
        options={[
          { key: 'en', label: 'English' },
          { key: 'ar', label: 'العربية' },
          { key: 'ur', label: 'اردو' },
        ]}
        selected={language}
        onSelect={(key) => setLanguage(key as Language)}
        theme={theme}
      />

      <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: spacing.lg }]}>
        {t(language, 'settings.appearance')}
      </Text>
      <SegmentedControl
        options={[
          { key: 'light', label: t(language, 'settings.light') },
          { key: 'dark', label: t(language, 'settings.dark') },
          { key: 'auto', label: t(language, 'settings.auto') },
        ]}
        selected={themeMode}
        onSelect={(key) => setTheme(key as 'light' | 'dark' | 'auto')}
        theme={theme}
      />

      <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: spacing.lg }]}>
        {language === 'ar' ? 'نمط الألوان' : language === 'ur' ? 'رنگ تھیم' : 'Color Theme'}
      </Text>
      <View style={styles.themeGrid}>
        {(Object.keys(colorThemeMeta) as ColorThemeName[]).map((key) => {
          const meta = colorThemeMeta[key];
          const isSelected = (colorThemeId || 'emerald') === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.themeCard,
                { borderColor: isSelected ? theme.primary : theme.border, backgroundColor: theme.surface },
              ]}
              onPress={() => setColorTheme(key as ColorTheme)}
            >
              <View style={styles.swatchRow}>
                {meta.swatch.map((c: string, i: number) => (
                  <View key={i} style={[styles.swatch, { backgroundColor: c }]} />
                ))}
              </View>
              <Text style={[styles.themeLabel, { color: theme.text }]}>
                {language === 'ar' ? meta.nameAr : language === 'ur' ? meta.nameUr : meta.nameEn}
              </Text>
              {isSelected && <Ionicons name="checkmark-circle" size={16} color={theme.primary} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: spacing.lg }]}>
        {t(language, 'settings.location')}
      </Text>
      <SettingRow
        label={t(language, 'settings.location')}
        value={isDetecting ? '...' : locationName || t(language, 'settings.detectLocation')}
        onPress={detectLocation}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'location.searchCity')}
        onPress={() => router.push('/city-search')}
        theme={theme}
      />
      <ToggleRow
        label={t(language, 'settings.autoDetectLocation')}
        value={locationAutoDetect ?? true}
        onToggle={() => setLocationAutoDetect(!(locationAutoDetect ?? true))}
        theme={theme}
      />

      <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: spacing.lg }]}>
        {t(language, 'settings.prayerCalculation')}
      </Text>
      <SettingRow
        label={t(language, 'settings.calculationMethod')}
        value={currentMethodLabel}
        onPress={() => {
          const idx = CALC_METHODS.findIndex((m) => m.id === calcMethod);
          const next = CALC_METHODS[(idx + 1) % CALC_METHODS.length];
          setCalculationMethod(next.id);
        }}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'settings.hijriAdjust')}
        value={`${hijriAdjustment >= 0 ? '+' : ''}${hijriAdjustment}`}
        onPress={() => setHijriAdjustment(hijriAdjustment >= 2 ? -2 : hijriAdjustment + 1)}
        theme={theme}
      />

      <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: spacing.lg }]}>
        {t(language, 'settings.quran')}
      </Text>
      <SettingRow
        label={t(language, 'settings.quranFontSize')}
        value={`${quranFontSize}`}
        onPress={() => setQuranFontSize(quranFontSize >= 36 ? 18 : quranFontSize + 2)}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'settings.translationFontSize')}
        value={`${translationFontSize}`}
        onPress={() => setTranslationFontSize(translationFontSize >= 24 ? 12 : translationFontSize + 2)}
        theme={theme}
      />
      <ToggleRow
        label={t(language, 'settings.showTransliteration')}
        value={showTransliteration}
        onToggle={toggleTransliteration}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'settings.reciter')}
        value={RECITERS.find((r) => r.id === selectedReciter)?.name || selectedReciter}
        onPress={() => {
          const idx = RECITERS.findIndex((r) => r.id === selectedReciter);
          const next = RECITERS[(idx + 1) % RECITERS.length];
          setReciter(next.id);
        }}
        theme={theme}
      />

      <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: spacing.lg }]}>
        {t(language, 'settings.more')}
      </Text>
      <SettingRow
        label={t(language, 'settings.notifications')}
        onPress={() => router.push('/notifications')}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'calendar.title')}
        onPress={() => router.push('/calendar')}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'about.title')}
        onPress={() => router.push('/about')}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'settings.privacyPolicy')}
        onPress={() => router.push('/privacy')}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'settings.rateApp')}
        onPress={handleRateApp}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'settings.reportContent')}
        onPress={handleReportContent}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'settings.shareFeedback')}
        onPress={handleFeedbackForm}
        theme={theme}
      />

      <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: spacing.lg }]}>
        {t(language, 'settings.about')}
      </Text>
      <SettingRow label={t(language, 'settings.shariahCompliant')} value="✓" theme={theme} />
      <SettingRow label={t(language, 'settings.version')} value="1.0.0" theme={theme} />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  title: { fontSize: fontSizes.heading1, fontWeight: '700' },
  sectionHeader: { fontSize: fontSizes.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  rowLabel: { fontSize: fontSizes.body, flex: 1 },
  rowValue: { fontSize: fontSizes.body },
  segment: { flexDirection: 'row', borderRadius: borderRadius.md, borderWidth: 1, overflow: 'hidden', marginBottom: spacing.md },
  segmentBtn: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center' },
  segmentText: { fontSize: fontSizes.caption, fontWeight: '600' },
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  themeCard: { width: '30%', borderWidth: 2, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center', gap: 4 },
  swatchRow: { flexDirection: 'row', gap: 4 },
  swatch: { width: 18, height: 18, borderRadius: 9 },
  themeLabel: { fontSize: fontSizes.caption, fontWeight: '500' },
});
