import { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Linking, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { useLocation } from '../../src/hooks/useLocation';
import { t, isRTL } from '../../src/i18n';
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

function SettingRow({ label, value, onPress, theme, accessibilityHint }: {
  label: string;
  value?: string;
  onPress?: () => void;
  theme: Record<string, string>;
  accessibilityHint?: string;
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
      <View style={[styles.row, { borderColor: theme.border }]} accessibilityLabel={label}>
        {content}
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.row, { borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
    >
      {content}
    </TouchableOpacity>
  );
}

function InfoRow({ label, value, theme }: {
  label: string;
  value: string;
  theme: Record<string, string>;
}) {
  return (
    <View style={[styles.infoRow, { borderColor: theme.border, backgroundColor: theme.surfaceElevated }]} accessibilityLabel={`${label}: ${value}`}>
      <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.textSecondary }]}>{value}</Text>
    </View>
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
        accessibilityLabel={label}
        accessibilityRole="switch"
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

type ExpandedSection = 'calc' | 'reciter' | 'quranFont' | 'translationFont' | null;

const QURAN_FONT_SIZES = [18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
const TRANSLATION_FONT_SIZES = [12, 14, 16, 18, 20, 22, 24];

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
  const { locationName, isDetecting, detectLocation, locationAutoDetect, permissionDenied } = useLocation();
  const setLocationAutoDetect = useAppStore((s) => s.setLocationAutoDetect);
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState<ExpandedSection>(null);

  const currentMethodLabel = CALC_METHODS.find((m) => m.id === calcMethod)?.label || calcMethod;
  const currentReciter = RECITERS.find((r) => r.id === selectedReciter);
  const reciterLabel = language === 'ar' || language === 'ur'
    ? currentReciter?.nameAr
    : currentReciter?.name;

  const handleLanguageChange = useCallback((key: string) => {
    const next = key as Language;
    const wasRtl = isRTL(language);
    const willRtl = isRTL(next);
    setLanguage(next);
    if (Platform.OS !== 'web' && wasRtl !== willRtl) {
      Alert.alert(
        t(next, 'settings.restartTitle'),
        t(next, 'settings.restartMessage'),
        [{ text: t(next, 'common.done') }],
      );
    }
  }, [language, setLanguage]);

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
        onSelect={handleLanguageChange}
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
        value={(locationAutoDetect ?? true) && !permissionDenied}
        onToggle={async () => {
          if (permissionDenied) {
            await detectLocation();
            return;
          }
          setLocationAutoDetect(!(locationAutoDetect ?? true));
        }}
        theme={theme}
      />
      {permissionDenied && (
        <Text style={[styles.hintText, { color: theme.error || '#C62828' }]}>
          {t(language, 'location.permissionDenied')}
        </Text>
      )}

      <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: spacing.lg }]}>
        {t(language, 'settings.prayerCalculation')}
      </Text>
      <SettingRow
        label={t(language, 'settings.calculationMethod')}
        value={currentMethodLabel}
        onPress={() => setExpanded(expanded === 'calc' ? null : 'calc')}
        theme={theme}
        accessibilityHint={t(language, 'settings.tapToChoose')}
      />
      {expanded === 'calc' && CALC_METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[styles.pickerRow, { borderColor: theme.border }]}
          onPress={() => {
            setCalculationMethod(method.id);
            setExpanded(null);
          }}
          accessibilityRole="button"
          accessibilityLabel={method.label}
        >
          <Text style={[styles.pickerLabel, { color: theme.text }]}>{method.label}</Text>
          {calcMethod === method.id && (
            <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
          )}
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: spacing.md }]}>
        {t(language, 'settings.hijriAdjust')}
      </Text>
      <SegmentedControl
        options={[
          { key: '-2', label: '-2' },
          { key: '-1', label: '-1' },
          { key: '0', label: t(language, 'hijri.noChange') },
          { key: '1', label: '+1' },
          { key: '2', label: '+2' },
        ]}
        selected={String(hijriAdjustment)}
        onSelect={(key) => setHijriAdjustment(Number(key))}
        theme={theme}
      />

      <Text style={[styles.sectionHeader, { color: theme.textSecondary, marginTop: spacing.lg }]}>
        {t(language, 'settings.quran')}
      </Text>
      <SettingRow
        label={t(language, 'settings.quranFontSize')}
        value={`${quranFontSize}`}
        onPress={() => setExpanded(expanded === 'quranFont' ? null : 'quranFont')}
        theme={theme}
        accessibilityHint={t(language, 'settings.tapToChoose')}
      />
      {expanded === 'quranFont' && QURAN_FONT_SIZES.map((size) => (
        <TouchableOpacity
          key={size}
          style={[styles.pickerRow, { borderColor: theme.border }]}
          onPress={() => { setQuranFontSize(size); setExpanded(null); }}
          accessibilityRole="button"
          accessibilityLabel={`${size}`}
        >
          <Text style={[styles.pickerLabel, { color: theme.text }]}>{size}</Text>
          {quranFontSize === size && <Ionicons name="checkmark-circle" size={22} color={theme.primary} />}
        </TouchableOpacity>
      ))}
      <SettingRow
        label={t(language, 'settings.translationFontSize')}
        value={`${translationFontSize}`}
        onPress={() => setExpanded(expanded === 'translationFont' ? null : 'translationFont')}
        theme={theme}
        accessibilityHint={t(language, 'settings.tapToChoose')}
      />
      {expanded === 'translationFont' && TRANSLATION_FONT_SIZES.map((size) => (
        <TouchableOpacity
          key={size}
          style={[styles.pickerRow, { borderColor: theme.border }]}
          onPress={() => { setTranslationFontSize(size); setExpanded(null); }}
          accessibilityRole="button"
          accessibilityLabel={`${size}`}
        >
          <Text style={[styles.pickerLabel, { color: theme.text }]}>{size}</Text>
          {translationFontSize === size && <Ionicons name="checkmark-circle" size={22} color={theme.primary} />}
        </TouchableOpacity>
      ))}
      <ToggleRow
        label={t(language, 'settings.showTransliteration')}
        value={showTransliteration}
        onToggle={toggleTransliteration}
        theme={theme}
      />
      <SettingRow
        label={t(language, 'settings.reciter')}
        value={reciterLabel || selectedReciter}
        onPress={() => setExpanded(expanded === 'reciter' ? null : 'reciter')}
        theme={theme}
        accessibilityHint={t(language, 'settings.tapToChoose')}
      />
      {expanded === 'reciter' && RECITERS.map((reciter) => (
        <TouchableOpacity
          key={reciter.id}
          style={[styles.pickerRow, { borderColor: theme.border }]}
          onPress={() => {
            setReciter(reciter.id);
            setExpanded(null);
          }}
          accessibilityRole="button"
          accessibilityLabel={language === 'ar' || language === 'ur' ? reciter.nameAr : reciter.name}
        >
          <Text style={[styles.pickerLabel, { color: theme.text }]}>
            {language === 'ar' || language === 'ur' ? reciter.nameAr : reciter.name}
          </Text>
          {selectedReciter === reciter.id && (
            <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
          )}
        </TouchableOpacity>
      ))}

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
      <InfoRow label={t(language, 'settings.shariahCompliant')} value="✓" theme={theme} />
      <InfoRow label={t(language, 'settings.version')} value="1.0.0" theme={theme} />

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
  themeCard: { width: '31%', minWidth: 96, borderWidth: 2, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center', gap: 4 },
  swatchRow: { flexDirection: 'row', gap: 4 },
  swatch: { width: 18, height: 18, borderRadius: 9 },
  themeLabel: { fontSize: fontSizes.caption, fontWeight: '500' },
  hintText: { fontSize: fontSizes.caption, marginBottom: spacing.sm, lineHeight: fontSizes.caption * 1.5 },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerLabel: { fontSize: fontSizes.bodySmall, flex: 1 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  infoLabel: { fontSize: fontSizes.body, flex: 1 },
  infoValue: { fontSize: fontSizes.body, fontWeight: '600' },
});
