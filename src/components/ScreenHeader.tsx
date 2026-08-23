import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { t, isRTL } from '../i18n';
import { fontSizes, spacing } from '../theme';
import type { Language } from '../types';

export function ScreenHeader({
  title,
  language,
  theme,
  icon,
}: {
  title: string;
  language: Language;
  theme: Record<string, string>;
  icon?: React.ReactNode;
}) {
  const rtl = isRTL(language);
  return (
    <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={[styles.backText, { color: theme.primary }]}>
          {`${rtl ? '\u2192' : '\u2190'} ${t(language, 'common.back')}`}
        </Text>
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        {icon}
        <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.headerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
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
  headerTitle: { fontSize: fontSizes.body, fontWeight: '700', marginTop: 2, textAlign: 'center' },
  headerSpacer: { width: 80 },
});
