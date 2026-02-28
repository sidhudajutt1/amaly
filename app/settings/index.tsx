import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t, languageNames } from '../../src/i18n';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import type { Language, CalculationMethod } from '../../src/types';

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
  return (
    <TouchableOpacity
      style={[styles.row, { borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      {value && (
        <Text style={[styles.rowValue, { color: theme.textSecondary }]}>{`${value} ›`}</Text>
      )}
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
  options: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string) => void;
  theme: Record<string, string>;
}) {
  return (
    <View style={[styles.segmented, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={[
            styles.segment,
            selected === opt.id && { backgroundColor: theme.primary },
          ]}
          onPress={() => onSelect(opt.id)}
        >
          <Text
            style={[
              styles.segmentText,
              { color: selected === opt.id ? '#fff' : theme.text },
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function SettingsScreen() {
  const language = useAppStore((s) => s.settings.language);
  const themeMode = useAppStore((s) => s.settings.theme);
  const calcMethod = useAppStore((s) => s.settings.calculationMethod);
  const showTransliteration = useAppStore((s) => s.settings.showTransliteration);
  const quranFontSize = useAppStore((s) => s.settings.quranFontSize);

  const setLanguage = useAppStore((s) => s.setLanguage);
  const setTheme = useAppStore((s) => s.setTheme);
  const setCalculationMethod = useAppStore((s) => s.setCalculationMethod);
  const toggleTransliteration = useAppStore((s) => s.toggleTransliteration);
  const setQuranFontSize = useAppStore((s) => s.setQuranFontSize);

  const { theme } = useTheme();

  const currentMethodLabel = CALC_METHODS.find((m) => m.id === calcMethod)?.label || calcMethod;
  const currentLangLabel = languageNames[language]?.native || language;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backText, { color: theme.primary }]}>
            {`${language === 'ar' || language === 'ur' ? '→' : '←'} ${t(language, 'common.back')}`}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { color: theme.text }]}>
        {`⚙️ ${t(language, 'settings.title')}`}
      </Text>

      {/* Language */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'settings.language')}
      </Text>
      <SegmentedControl
        options={[
          { id: 'en', label: 'English' },
          { id: 'ar', label: 'العربية' },
          { id: 'ur', label: 'اردو' },
        ]}
        selected={language}
        onSelect={(id) => setLanguage(id as Language)}
        theme={theme}
      />

      {/* Theme */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'settings.appearance')}
      </Text>
      <SegmentedControl
        options={[
          { id: 'light', label: t(language, 'settings.light') },
          { id: 'dark', label: t(language, 'settings.dark') },
          { id: 'auto', label: t(language, 'settings.auto') },
        ]}
        selected={themeMode}
        onSelect={(id) => setTheme(id as 'light' | 'dark' | 'auto')}
        theme={theme}
      />

      {/* Prayer */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'prayer.prayerTimes')}
      </Text>
      <SettingRow
        label={t(language, 'settings.calculationMethod')}
        value={currentMethodLabel}
        theme={theme}
      />

      {/* Quran */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'tabs.quran')}
      </Text>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.text }]}>
          {t(language, 'settings.quranFontSize')}
        </Text>
        <View style={styles.fontSizeControls}>
          <TouchableOpacity
            onPress={() => setQuranFontSize(Math.max(20, quranFontSize - 2))}
            style={[styles.fontBtn, { borderColor: theme.border }]}
          >
            <Text style={[styles.fontBtnText, { color: theme.text }]}>A-</Text>
          </TouchableOpacity>
          <Text style={[styles.fontSizeValue, { color: theme.text }]}>{quranFontSize}</Text>
          <TouchableOpacity
            onPress={() => setQuranFontSize(Math.min(40, quranFontSize + 2))}
            style={[styles.fontBtn, { borderColor: theme.border }]}
          >
            <Text style={[styles.fontBtnText, { color: theme.text }]}>A+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ToggleRow
        label={t(language, 'settings.showTransliteration')}
        value={showTransliteration}
        onToggle={toggleTransliteration}
        theme={theme}
      />

      {/* About */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'settings.about')}
      </Text>
      <SettingRow label={t(language, 'settings.privacyPolicy')} value="" theme={theme} />
      <SettingRow label={t(language, 'settings.reportIssue')} value="" theme={theme} />
      <View style={[styles.row, { borderColor: theme.border }]}>
        <Text style={[styles.rowLabel, { color: theme.textTertiary }]}>
          {t(language, 'settings.version')}
        </Text>
        <Text style={[styles.rowValue, { color: theme.textTertiary }]}>1.0.0</Text>
      </View>

      <View style={{ height: spacing.xxl * 2 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  headerRow: { marginBottom: spacing.sm },
  backText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  title: { fontSize: fontSizes.heading1, fontWeight: '800', marginBottom: spacing.lg },
  sectionHeader: {
    fontSize: fontSizes.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: fontSizes.body, flex: 1 },
  rowValue: { fontSize: fontSizes.bodySmall },
  segmented: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  segmentText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  fontSizeControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  fontBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontBtnText: { fontSize: fontSizes.bodySmall, fontWeight: '700' },
  fontSizeValue: { fontSize: fontSizes.body, fontWeight: '600', minWidth: 30, textAlign: 'center' },
});
