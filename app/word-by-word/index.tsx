import { useState } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { surahs } from '../../src/data/surahs';
import { isSurahAvailable, getSurahData } from '../../src/data/quranText';
import { getWordsForAyah, getWordGloss, type WordToken } from '../../src/data/wordByWordLoader';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getTranslationFontFamily } from '../../src/theme/typography';
import { getQuranArabicFontFamily, getQuranArabicLineHeightMultiplier } from '../../src/utils/quranArabicText';

function WordChip({ word, language, theme }: { word: WordToken; language: 'en' | 'ar' | 'ur'; theme: Record<string, string> }) {
  return (
    <View style={[styles.wordChip, { backgroundColor: theme.primaryLight, borderColor: theme.border }]}>
      <Text style={[styles.wordAr, { color: theme.textArabic, fontFamily: getQuranArabicFontFamily(language), lineHeight: 20 * getQuranArabicLineHeightMultiplier(language) }]}>{word.arabic}</Text>
      <Text style={[styles.wordGloss, { color: theme.textSecondary, fontFamily: getTranslationFontFamily(language) }]}>
        {getWordGloss(word, language)}
      </Text>
    </View>
  );
}

export default function WordByWordScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [ayahNumber, setAyahNumber] = useState(1);

  const available = surahs.filter((s) => isSurahAvailable(s.number));

  if (selectedSurah === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScreenHeader title={t(language, 'quran.wordByWord')} language={language} theme={theme} />
        <FlatList
          data={available}
          keyExtractor={(item) => item.number.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.surahRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => {
                setSelectedSurah(item.number);
                setAyahNumber(1);
              }}
            >
              <Text style={[styles.surahName, { color: theme.text }]}>{item.nameEn}</Text>
              <Text style={[styles.surahMeta, { color: theme.textTertiary }]}>
                {item.ayahCount} {t(language, 'quran.ayahs')}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  const surah = getSurahData(selectedSurah);
  const words = getWordsForAyah(selectedSurah, ayahNumber, language);
  const meta = surahs.find((s) => s.number === selectedSurah);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title={`${meta?.nameEn ?? ''} — ${t(language, 'quran.wordByWord')}`}
        language={language}
        theme={theme}
      />
      <View style={[styles.ayahNav, { borderColor: theme.border }]}>
        <TouchableOpacity
          disabled={ayahNumber <= 1}
          onPress={() => setAyahNumber((n) => n - 1)}
          style={{ opacity: ayahNumber <= 1 ? 0.4 : 1 }}
        >
          <Text style={{ color: theme.primary, fontWeight: '600' }}>{t(language, 'common.back')}</Text>
        </TouchableOpacity>
        <Text style={[styles.ayahLabel, { color: theme.text }]}>
          {t(language, 'quran.ayah')} {ayahNumber}/{surah?.ayahs.length ?? 0}
        </Text>
        <TouchableOpacity
          disabled={!surah || ayahNumber >= surah.ayahs.length}
          onPress={() => setAyahNumber((n) => n + 1)}
          style={{ opacity: !surah || ayahNumber >= surah.ayahs.length ? 0.4 : 1 }}
        >
          <Text style={{ color: theme.primary, fontWeight: '600' }}>{t(language, 'common.next')}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setSelectedSurah(null)} style={styles.changeSurah}>
        <Text style={{ color: theme.primary, fontSize: fontSizes.bodySmall }}>{t(language, 'wordByWord.changeSurah')}</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.wordGrid} showsVerticalScrollIndicator={false}>
        <View style={styles.wordsRow}>
          {words.map((w) => (
            <WordChip key={w.index} word={w} language={language} theme={theme} />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.openSurah, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
          onPress={() => router.push(`/surah/${selectedSurah}?ayah=${ayahNumber}`)}
        >
          <Text style={{ color: theme.primary, fontWeight: '600' }}>{t(language, 'wordByWord.openInReader')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  surahRow: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  surahName: { fontSize: fontSizes.body, fontWeight: '700' },
  surahMeta: { fontSize: fontSizes.caption, marginTop: 2 },
  ayahNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  ayahLabel: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  changeSurah: { alignSelf: 'center', paddingVertical: spacing.sm },
  wordGrid: { padding: spacing.md, paddingBottom: spacing.xxl },
  wordsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'flex-start',
  },
  wordChip: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.sm,
    minWidth: 72,
    alignItems: 'center',
  },
  wordAr: { fontSize: 20, lineHeight: 20 * lineHeights.arabic, textAlign: 'center' },
  wordGloss: { fontSize: fontSizes.caption, marginTop: 4, textAlign: 'center' },
  openSurah: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
});
