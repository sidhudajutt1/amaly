import { useState } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { JUZ_BOUNDARIES, getJuzName } from '../../src/data/juz';
import { getMushafPagesForJuz } from '../../src/data/mushafPages';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import { getQuranArabicFontFamily, getQuranArabicLineHeightMultiplier } from '../../src/utils/quranArabicText';

export default function MushafScreen() {
  const language = useAppStore((s) => s.settings.language);
  const quranFontSize = useAppStore((s) => s.settings.quranFontSize);
  const { theme } = useTheme();
  const [selectedJuz, setSelectedJuz] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);

  const pages = getMushafPagesForJuz(selectedJuz, language);
  const page = pages[pageIndex];

  const selectJuz = (n: number) => {
    setSelectedJuz(n);
    setPageIndex(0);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={t(language, 'quran.mushafView')} language={language} theme={theme} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.juzStrip} contentContainerStyle={styles.juzContent}>
        {JUZ_BOUNDARIES.map((j) => (
          <TouchableOpacity
            key={j.number}
            style={[
              styles.juzChip,
              {
                backgroundColor: selectedJuz === j.number ? theme.primary : theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => selectJuz(j.number)}
          >
            <Text style={{ color: selectedJuz === j.number ? '#fff' : theme.text, fontWeight: '600', fontSize: fontSizes.caption }}>
              {j.number}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.pageMeta, { borderColor: theme.border }]}>
        <Text style={[styles.metaText, { color: theme.textSecondary }]}>
          {getJuzName(JUZ_BOUNDARIES[selectedJuz - 1]!, language)} •{' '}
          {t(language, 'mushaf.page')} {pageIndex + 1}/{pages.length || 1}
        </Text>
        <View style={styles.navRow}>
          <TouchableOpacity
            disabled={pageIndex <= 0}
            onPress={() => setPageIndex((p) => Math.max(0, p - 1))}
            style={[styles.navBtn, { opacity: pageIndex <= 0 ? 0.4 : 1 }]}
          >
            <Text style={{ color: theme.primary, fontWeight: '600' }}>{t(language, 'common.back')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={pageIndex >= pages.length - 1}
            onPress={() => setPageIndex((p) => Math.min(pages.length - 1, p + 1))}
            style={[styles.navBtn, { opacity: pageIndex >= pages.length - 1 ? 0.4 : 1 }]}
          >
            <Text style={{ color: theme.primary, fontWeight: '600' }}>{t(language, 'common.next')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        {page ? (
          <View style={[styles.mushafPage, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {page.lines.map((line) => (
              <TouchableOpacity
                key={`${line.surah}-${line.ayah}`}
                onPress={() => router.push(`/surah/${line.surah}?ayah=${line.ayah}`)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.lineText,
                    {
                      color: theme.textArabic,
                      fontSize: quranFontSize,
                      lineHeight: quranFontSize * getQuranArabicLineHeightMultiplier(language),
                      fontFamily: getQuranArabicFontFamily(language),
                    },
                  ]}
                >
                  {line.text}
                  <Text style={[styles.ayahMarker, { color: theme.primary }]}>{` ﴿${line.ayah}﴾`}</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>{t(language, 'common.error')}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  juzStrip: { maxHeight: 48, borderBottomWidth: 1, borderBottomColor: 'transparent' },
  juzContent: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 6 },
  juzChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 36,
    alignItems: 'center',
  },
  pageMeta: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: { fontSize: fontSizes.bodySmall, flex: 1 },
  navRow: { flexDirection: 'row', gap: spacing.md },
  navBtn: { paddingHorizontal: spacing.sm },
  pageContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  mushafPage: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  lineText: { textAlign: 'right', marginBottom: spacing.md },
  ayahMarker: { fontSize: fontSizes.caption },
  empty: { textAlign: 'center', marginTop: spacing.xl },
});
