import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t, isRTL } from '../../src/i18n';
import { quranSubjects, getSubjectName } from '../../src/data/quranSubjects';
import { surahs } from '../../src/data/surahs';
import { getSurahData } from '../../src/data/quranText';
import { getDisplayAyahArabic, getQuranArabicFontFamily, getQuranArabicLineHeightMultiplier } from '../../src/utils/quranArabicText';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getTranslationFontFamily } from '../../src/theme/typography';

export default function SubjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const rtl = isRTL(language);
  const subject = quranSubjects.find((s) => s.id === id);

  if (!subject) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScreenHeader title={t(language, 'quran.subjects')} language={language} theme={theme} />
        <Text style={[styles.empty, { color: theme.textSecondary }]}>{t(language, 'common.error')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={getSubjectName(subject, language)} language={language} theme={theme} />
      <FlatList
        data={subject.ayahs}
        keyExtractor={(item) => `${item.surah}:${item.ayah}`}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const meta = surahs.find((s) => s.number === item.surah);
          const ayahData = getSurahData(item.surah)?.ayahs.find((a) => a.number === item.ayah);
          const translation =
            language === 'ur' ? ayahData?.translationUr : language === 'en' ? ayahData?.translationEn : null;
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => router.push(`/surah/${item.surah}?ayah=${item.ayah}`)}
              activeOpacity={0.7}
            >
              <View style={styles.header}>
                <Text style={[styles.ref, { color: theme.primary }]}>
                  {meta?.nameEn ?? item.surah} {item.surah}:{item.ayah}
                </Text>
                <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={16} color={theme.textTertiary} />
              </View>
              {ayahData ? (
                <>
                  <Text
                    style={[
                      styles.arabic,
                      {
                        color: theme.textArabic,
                        fontFamily: getQuranArabicFontFamily(language),
                        lineHeight: 22 * getQuranArabicLineHeightMultiplier(language),
                      },
                    ]}
                  >
                    {getDisplayAyahArabic(language, item.surah, item.ayah, ayahData.textAr)}
                  </Text>
                  {translation ? (
                    <Text
                      style={[
                        styles.translation,
                        { color: theme.textSecondary, fontFamily: getTranslationFontFamily(language) },
                      ]}
                    >
                      {translation}
                    </Text>
                  ) : null}
                </>
              ) : null}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  empty: { textAlign: 'center', marginTop: spacing.xl, fontSize: fontSizes.body },
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  ref: { fontSize: fontSizes.bodySmall, fontWeight: '700' },
  arabic: {
    fontSize: 22,
    textAlign: 'right',
    lineHeight: 22 * lineHeights.arabic,
    marginBottom: spacing.sm,
  },
  translation: { fontSize: fontSizes.bodySmall, lineHeight: fontSizes.bodySmall * lineHeights.latin },
});
