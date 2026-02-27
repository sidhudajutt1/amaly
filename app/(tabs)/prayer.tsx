import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../../src/store/useAppStore';
import { t } from '../../src/i18n';
import { useTheme } from '../../src/hooks/useTheme';
import { fontSizes, spacing } from '../../src/theme';

export default function PrayerScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        🕌 {t(language, 'tabs.prayer')}
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {t(language, 'prayer.prayerTimes')} — {t(language, 'common.loading')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSizes.heading1,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.body,
  },
});
