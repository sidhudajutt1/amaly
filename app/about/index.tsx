import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t, isRTL } from '../../src/i18n';
import { fontSizes, spacing, borderRadius } from '../../src/theme';

const SOURCE_ENTRIES: {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  url?: string;
}[] = [
  { id: 'quranText', icon: 'book', url: 'https://tanzil.net' },
  { id: 'quranTranslations', icon: 'book-outline', url: 'https://tanzil.net' },
  { id: 'quranTafsir', icon: 'library' },
  { id: 'quranAudio', icon: 'mic-outline', url: 'https://everyayah.com' },
  { id: 'hadith', icon: 'document-text-outline', url: 'https://sunnah.com' },
  { id: 'duas', icon: 'hand-left-outline' },
  { id: 'prayerTimes', icon: 'time-outline', url: 'https://github.com/batoulapps/adhan-js' },
  { id: 'qibla', icon: 'navigate-outline' },
  { id: 'hijriCalendar', icon: 'calendar-outline', url: 'https://www.npmjs.com/package/hijri-converter' },
  { id: 'arabicTypography', icon: 'text', url: 'https://www.amirifont.org' },
  { id: 'urduTypography', icon: 'text', url: 'https://fonts.google.com/noto/specimen/Noto+Nastaliq+Urdu' },
];

export default function AboutScreen() {
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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
          <Text style={[styles.backText, { color: theme.primary }]}>
            {`${rtl ? '→' : '←'} ${t(language, 'common.back')}`}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: theme.text, textAlign }]}>
        {t(language, 'about.title')}
      </Text>

      <View style={[styles.jariyahCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
        <MaterialCommunityIcons name="star-crescent" size={20} color={theme.primary} style={{ marginBottom: spacing.sm }} />
        <Text style={[styles.jariyahNote, { color: theme.text, textAlign }]}>
          {t(language, 'about.jariyahNote')}
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary, textAlign }]}>
        {t(language, 'about.contentSources')}
      </Text>

      {SOURCE_ENTRIES.map((source) => {
        const title = t(language, `about.sources.${source.id}.title`);
        const subtitle = t(language, `about.sources.${source.id}.subtitle`);
        const license = t(language, `about.sources.${source.id}.license`);
        const hasLicense = license && !license.startsWith('about.sources.');

        return (
          <TouchableOpacity
            key={source.id}
            style={[styles.sourceCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={source.url ? () => Linking.openURL(source.url!) : undefined}
            activeOpacity={source.url ? 0.7 : 1}
            accessibilityRole={source.url ? 'link' : 'none'}
          >
            <View style={[styles.sourceIconCircle, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name={source.icon} size={18} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.sourceTitle, { color: theme.text, textAlign }]}>{title}</Text>
                {source.url && <Ionicons name="open-outline" size={14} color={theme.textTertiary} />}
              </View>
              <Text style={[styles.sourceSubtitle, { color: theme.textSecondary, textAlign }]}>{subtitle}</Text>
              {hasLicense && (
                <View style={[styles.licenseBadge, { backgroundColor: theme.background }]}>
                  <Text style={[styles.licenseText, { color: theme.primary }]}>{license}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Text style={[styles.footerText, { color: theme.textTertiary, textAlign: 'center' }]}>
          {t(language, 'about.footerTagline')}
        </Text>
        <Text style={[styles.footerVersion, { color: theme.textTertiary, textAlign: 'center' }]}>
          {`${t(language, 'settings.version')} 1.0.0`}
        </Text>
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

  jariyahCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  jariyahNote: {
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * 1.7,
    fontStyle: 'italic',
  },

  sectionLabel: {
    fontSize: fontSizes.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },

  sourceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  sourceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceTitle: { fontSize: fontSizes.body, fontWeight: '700', marginBottom: 2, flex: 1 },
  sourceSubtitle: { fontSize: fontSizes.bodySmall, lineHeight: fontSizes.bodySmall * 1.5, marginTop: 2 },
  licenseBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: spacing.xs,
  },
  licenseText: { fontSize: fontSizes.caption, fontWeight: '600' },

  footer: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
  },
  footerText: { fontSize: fontSizes.bodySmall, fontStyle: 'italic', marginBottom: spacing.xs },
  footerVersion: { fontSize: fontSizes.caption },
});
