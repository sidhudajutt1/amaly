import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getTranslationFontFamily } from '../../src/theme/typography';

export default function ArchiveScreen() {
  const language = useAppStore((s) => s.settings.language);
  const archive = useAppStore((s) => s.reflectionArchive);
  const { theme } = useTheme();

  const getNiyyah = (entry: typeof archive[0]) => {
    if (language === 'ar') return entry.niyyahAr;
    if (language === 'ur') return entry.niyyahUr;
    return entry.niyyahEn;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={t(language, 'today.archive')} language={language} theme={theme} />
      {archive.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>{t(language, 'archive.emptyTitle')}</Text>
          <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>{t(language, 'archive.emptyHint')}</Text>
        </View>
      ) : (
        <FlatList
          data={archive}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.date, { color: theme.primary }]}>{item.date}</Text>
              {item.ayahRef ? (
                <Text style={[styles.ref, { color: theme.textTertiary }]}>{item.ayahRef}</Text>
              ) : null}
              <Text
                style={[
                  styles.niyyah,
                  { color: theme.text, fontFamily: getTranslationFontFamily(language), lineHeight: fontSizes.body * lineHeights.latin },
                ]}
              >
                {getNiyyah(item)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  emptyWrap: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { fontSize: fontSizes.body, fontWeight: '700', textAlign: 'center', marginBottom: spacing.sm },
  emptyHint: { fontSize: fontSizes.bodySmall, textAlign: 'center', lineHeight: fontSizes.bodySmall * 1.5 },
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  date: { fontSize: fontSizes.bodySmall, fontWeight: '700', marginBottom: 4 },
  ref: { fontSize: fontSizes.caption, marginBottom: spacing.sm },
  niyyah: { fontSize: fontSizes.bodySmall },
});
