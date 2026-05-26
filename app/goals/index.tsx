import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import type { GoalConfig } from '../../src/types';

function ToggleRow({ label, value, onToggle, disabled, theme }: {
  label: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
  theme: Record<string, string>;
}) {
  return (
    <View style={[styles.row, { borderColor: theme.border }]}>
      <Text style={[styles.rowLabel, { color: disabled ? theme.textTertiary : theme.text }]}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={disabled ? undefined : onToggle}
        disabled={disabled}
        trackColor={{ false: theme.border, true: theme.primary }}
      />
    </View>
  );
}

export default function GoalsSettingsScreen() {
  const language = useAppStore((s) => s.settings.language);
  const currentConfig = useAppStore((s) => s.goalConfig);
  const setGoalConfig = useAppStore((s) => s.setGoalConfig);
  const { theme } = useTheme();

  const [config, setConfig] = useState<GoalConfig>({ ...currentConfig });

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(currentConfig),
    [config, currentConfig],
  );

  const updateConfig = (partial: Partial<GoalConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const save = useCallback(() => {
    setGoalConfig(config);
    router.back();
  }, [config, setGoalConfig]);

  const handleBack = useCallback(() => {
    if (!hasUnsavedChanges) {
      router.back();
      return;
    }
    Alert.alert(
      t(language, 'goals.unsavedTitle'),
      t(language, 'goals.unsavedMessage'),
      [
        { text: t(language, 'common.cancel'), style: 'cancel' },
        { text: t(language, 'goals.discard'), style: 'destructive', onPress: () => router.back() },
        { text: t(language, 'goals.saveChanges'), onPress: save },
      ],
    );
  }, [hasUnsavedChanges, language, save]);

  const versesOptions = [1, 3, 5, 10];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons
            name={language === 'ar' || language === 'ur' ? 'arrow-forward' : 'arrow-back'}
            size={24}
            color={theme.primary}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {t(language, 'goals.settings')}
        </Text>
        <TouchableOpacity onPress={save}>
          <Ionicons name="checkmark" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Prayer Goal */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'goals.prayers')}
      </Text>
      <ToggleRow
        label={t(language, 'goals.trackPrayers')}
        value={config.prayerGoalEnabled}
        onToggle={() => {}}
        disabled
        theme={theme}
      />

      {/* Quran Goal */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'goals.quran')}
      </Text>
      <ToggleRow
        label={t(language, 'goals.trackQuran')}
        value={config.quranGoalEnabled}
        onToggle={() => updateConfig({ quranGoalEnabled: !config.quranGoalEnabled })}
        theme={theme}
      />
      {config.quranGoalEnabled && (
        <View style={[styles.versesRow, { borderColor: theme.border }]}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>
            {t(language, 'goals.versesPerDay')}
          </Text>
          <View style={styles.versesOptions}>
            {versesOptions.map((v) => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.verseOption,
                  {
                    backgroundColor: config.quranVersesPerDay === v ? theme.primary : theme.surface,
                    borderColor: config.quranVersesPerDay === v ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => updateConfig({ quranVersesPerDay: v })}
              >
                <Text style={[
                  styles.verseOptionText,
                  { color: config.quranVersesPerDay === v ? '#fff' : theme.text },
                ]}>
                  {v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Dhikr Goals */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'goals.dhikr')}
      </Text>
      <ToggleRow
        label={t(language, 'goals.morningAdhkar')}
        value={config.morningAdhkarEnabled}
        onToggle={() => updateConfig({ morningAdhkarEnabled: !config.morningAdhkarEnabled })}
        theme={theme}
      />
      <ToggleRow
        label={t(language, 'goals.eveningAdhkar')}
        value={config.eveningAdhkarEnabled}
        onToggle={() => updateConfig({ eveningAdhkarEnabled: !config.eveningAdhkarEnabled })}
        theme={theme}
      />

      {/* Fasting */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'goals.fasting')}
      </Text>
      <ToggleRow
        label={t(language, 'goals.fasting')}
        value={config.fastingGoalEnabled}
        onToggle={() => updateConfig({ fastingGoalEnabled: !config.fastingGoalEnabled })}
        theme={theme}
      />

      {/* Sadaqah */}
      <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>
        {t(language, 'goals.sadaqah')}
      </Text>
      <ToggleRow
        label={t(language, 'goals.sadaqah')}
        value={config.sadaqahGoalEnabled}
        onToggle={() => updateConfig({ sadaqahGoalEnabled: !config.sadaqahGoalEnabled })}
        theme={theme}
      />

      <View style={{ height: spacing.xxl * 2 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: { fontSize: fontSizes.heading2, fontWeight: '700' },
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
  versesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  versesOptions: { flexDirection: 'row', gap: spacing.sm },
  verseOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseOptionText: { fontSize: fontSizes.body, fontWeight: '700' },
});
