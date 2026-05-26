import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t, isRTL } from '../../src/i18n';
import { fontSizes, spacing, borderRadius } from '../../src/theme';

const SECTIONS = [
  { titleKey: 'privacy.intro', bodyKey: null },
  { titleKey: 'privacy.collectionTitle', bodyKey: 'privacy.collectionBody' },
  { titleKey: 'privacy.noSaleTitle', bodyKey: 'privacy.noSaleBody' },
  { titleKey: 'privacy.analyticsTitle', bodyKey: 'privacy.analyticsBody' },
  { titleKey: 'privacy.contactTitle', bodyKey: 'privacy.contactBody' },
] as const;

export default function PrivacyScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const rtl = isRTL(language);
  const textAlign = rtl ? ('right' as const) : ('left' as const);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
        <Text style={[styles.backText, { color: theme.primary }]}>
          {`${rtl ? '→' : '←'} ${t(language, 'common.back')}`}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.text, textAlign }]}>
        {t(language, 'privacy.title')}
      </Text>

      {SECTIONS.map((section) => (
        <View
          key={section.titleKey}
          style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text, textAlign }]}>
            {t(language, section.titleKey)}
          </Text>
          {section.bodyKey && (
            <Text style={[styles.sectionBody, { color: theme.textSecondary, textAlign }]}>
              {t(language, section.bodyKey)}
            </Text>
          )}
        </View>
      ))}

      <View style={{ height: spacing.xxl * 2 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  backText: { fontSize: fontSizes.bodySmall, fontWeight: '600', marginBottom: spacing.sm },
  title: { fontSize: fontSizes.heading1, fontWeight: '800', marginBottom: spacing.lg },
  section: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: fontSizes.body, fontWeight: '700', marginBottom: spacing.xs },
  sectionBody: { fontSize: fontSizes.bodySmall, lineHeight: fontSizes.bodySmall * 1.6 },
});
