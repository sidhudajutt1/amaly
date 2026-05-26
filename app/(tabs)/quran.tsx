import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t, isRTL } from '../../src/i18n';
import { Ionicons } from '@expo/vector-icons';
import { surahs, type SurahMeta } from '../../src/data/surahs';
import { isSurahAvailable } from '../../src/data/quranText';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import { getArabicFontFamily } from '../../src/theme/typography';
import type { Language } from '../../src/types';

function getSurahDisplayName(surah: SurahMeta, language: Language): string {
  if (language === 'ar') return surah.nameAr;
  if (language === 'ur') return surah.nameTranslation;
  return surah.nameEn;
}

function SurahCard({ surah, theme, language, onPress }: {
  surah: SurahMeta;
  theme: Record<string, string>;
  language: Language;
  onPress: () => void;
}) {
  const textAlign = language === 'ar' || language === 'ur' ? 'right' as const : 'left' as const;
  return (
    <TouchableOpacity
      style={[styles.surahCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${t(language, 'a11y.surahCard')} ${getSurahDisplayName(surah, language)}`}
    >
      <View style={[styles.surahNumber, { backgroundColor: theme.primaryLight }]}>
        <Text style={[styles.surahNumberText, { color: theme.primary }]}>{surah.number}</Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={[styles.surahNameEn, { color: theme.text }]}>{surah.nameEn}</Text>
        <Text style={[styles.surahMeaning, { color: theme.textSecondary }]}>
          {`${surah.nameTranslation} • ${surah.ayahCount} ${t(language, 'quran.ayahs')}`}
        </Text>
      </View>
      <View style={styles.surahArabic}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.surahNameAr, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>{surah.nameAr}</Text>
          {isSurahAvailable(surah.number) && (
            <View style={[styles.availableBadge, { backgroundColor: theme.primary }]}>
              <Ionicons name="book" size={10} color="#fff" />
            </View>
          )}
        </View>
        <Text style={[styles.surahType, { color: theme.textTertiary }]}>
          {surah.revelationType === 'meccan' ? t(language, 'quran.meccan') : t(language, 'quran.medinan')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function QuranScreen() {
  const language = useAppStore((s) => s.settings.language);
  const readingProgress = useAppStore((s) => s.readingProgress);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const ayahBookmarks = useMemo(() => bookmarks.filter((b) => b.type === 'ayah'), [bookmarks]);
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = searchQuery
    ? surahs.filter(
        (s) =>
          s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nameAr.includes(searchQuery) ||
          s.nameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.number.toString() === searchQuery
      )
    : surahs;

  const lastSurah = readingProgress ? surahs.find((s) => s.number === readingProgress.lastSurah) : null;
  const rtl = isRTL(language);

  const emptySearch = searchQuery.length > 0 && filteredSurahs.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          placeholder={`🔍 ${t(language, 'common.search')} ${t(language, 'quran.surah')}...`}
          placeholderTextColor={theme.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        ListHeaderComponent={
          <>
            {lastSurah && !searchQuery ? (
              <TouchableOpacity
                style={[styles.resumeCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
                onPress={() => router.push(`/surah/${lastSurah.number}`)}
                accessibilityLabel={`${t(language, 'a11y.continueReading')} ${getSurahDisplayName(lastSurah, language)}`}
                accessibilityRole="button"
              >
                <Ionicons name="book" size={20} color={theme.primary} />
                <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
                  <Text style={[styles.resumeTitle, { color: theme.primary }]}>
                    {t(language, 'quran.continueReading')}
                  </Text>
                  <Text style={[styles.resumeSubtitle, { color: theme.text }]}>
                    {`${getSurahDisplayName(lastSurah, language)} • ${t(language, 'quran.ayahLabel')} ${readingProgress!.lastAyah}`}
                  </Text>
                </View>
                <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={20} color={theme.primary} />
              </TouchableOpacity>
            ) : null}
            {ayahBookmarks.length > 0 && !searchQuery ? (
              <View style={styles.bookmarkSection}>
                <Text style={[styles.bookmarkHeader, { color: theme.textSecondary }]}>
                  {t(language, 'quran.bookmarks')}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {ayahBookmarks.slice(0, 10).map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.bookmarkChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                      onPress={() => router.push(`/surah/${item.surahNumber}?ayah=${item.ayahNumber ?? 1}`)}
                    >
                      <Ionicons name="bookmark" size={12} color={theme.primary} />
                      <Text style={[styles.bookmarkChipText, { color: theme.text }]}>{item.label ?? `${item.surahNumber}:${item.ayahNumber}`}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}
            {!searchQuery ? (
              <Text style={[styles.availableLegend, { color: theme.textTertiary }]}>
                {t(language, 'quran.availableLegend')}
              </Text>
            ) : null}
          </>
        }
        ListEmptyComponent={
          emptySearch ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={40} color={theme.textTertiary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {t(language, 'quran.noResults')}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <SurahCard
            surah={item}
            theme={theme}
            language={language}
            onPress={() => router.push(`/surah/${item.number}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSizes.body,
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: spacing.md,
  },
  surahNumberText: {
    fontSize: fontSizes.bodySmall,
    fontWeight: '700',
  },
  surahInfo: {
    flex: 1,
  },
  surahNameEn: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  surahMeaning: {
    fontSize: fontSizes.caption,
  },
  surahArabic: {
    alignItems: 'flex-end',
  },
  surahNameAr: {
    fontSize: fontSizes.heading3,
    marginBottom: 2,
  },
  surahType: {
    fontSize: fontSizes.caption,
  },
  availableBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fontSizes.body,
    textAlign: 'center',
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  resumeTitle: {
    fontSize: fontSizes.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resumeSubtitle: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    marginTop: 2,
  },
  bookmarkSection: {
    marginBottom: spacing.md,
  },
  bookmarkHeader: {
    fontSize: fontSizes.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  bookmarkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  bookmarkChipText: {
    fontSize: fontSizes.caption,
    fontWeight: '600',
  },
  availableLegend: {
    fontSize: fontSizes.caption,
    marginBottom: spacing.sm,
    lineHeight: fontSizes.caption * 1.4,
  },
});
