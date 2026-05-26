import { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { hadithCollections } from '../../src/data/hadithCollections';
import { type HadithData } from '../../src/data/hadiths';
import { getHadithsByCollection } from '../../src/data/hadithsLoader';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getArabicFontFamily, getTranslationFontFamily } from '../../src/theme/typography';
import type { Language } from '../../src/types';

function getGradeColor(grade: string, theme: Record<string, string>): string {
  if (grade === 'sahih') return theme.success ?? theme.primary;
  if (grade === 'hasan') return theme.warning;
  return theme.error;
}

function getGradeLabel(grade: string, gradeLabel: string, language: Language): string {
  if (language === 'en') return gradeLabel;
  if (grade === 'sahih') return language === 'ar' ? 'صحيح' : 'صحیح';
  if (grade === 'hasan') return language === 'ar' ? 'حسن' : 'حسن';
  return language === 'ar' ? 'ضعيف' : 'ضعیف';
}

function getCompilerName(collection: { compiler: string; compilerAr: string; compilerUr: string }, language: Language): string {
  if (language === 'ar') return collection.compilerAr;
  if (language === 'ur') return collection.compilerUr;
  return collection.compiler;
}

function HadithCard({ hadith, language, theme, showTransliteration, isBookmarked, onToggleBookmark }: {
  hadith: HadithData;
  language: Language;
  theme: Record<string, string>;
  showTransliteration: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  const isRTL = language === 'ar' || language === 'ur';
  const translation =
    language === 'ur' ? hadith.translationUr : language === 'en' ? hadith.translationEn : null;

  const collectionMeta = hadithCollections.find((c) => c.id === hadith.collectionId);
  const bookLabel = collectionMeta
    ? (language === 'ar' ? collectionMeta.nameAr : language === 'ur' ? collectionMeta.nameUr : collectionMeta.nameEn)
    : hadith.bookName;

  return (
    <View style={[styles.hadithCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.headerRow}>
        <View style={[styles.numberBadge, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.numberText, { color: theme.primary }]}>{hadith.hadithNumber}</Text>
        </View>
        <View style={{ flex: 1, marginStart: spacing.sm }}>
          <Text style={[styles.bookName, { color: theme.textSecondary }]}>{bookLabel}</Text>
        </View>
        <View style={[styles.gradeBadge, { backgroundColor: `${getGradeColor(hadith.grade, theme)}15` }]}>
          <Text style={[styles.gradeText, { color: getGradeColor(hadith.grade, theme) }]}>
            {getGradeLabel(hadith.grade, hadith.gradeLabel, language)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onToggleBookmark}
          style={[styles.bookmarkBtn, { backgroundColor: isBookmarked ? theme.primary : theme.primaryLight, marginStart: 8 }]}
          accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark hadith'}
          accessibilityRole="button"
        >
          <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={16} color={isBookmarked ? '#fff' : theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.narratorRow, { borderColor: theme.borderLight }]}>
        <Ionicons name="person-outline" size={13} color={theme.textSecondary} />
        <Text style={[styles.narratorText, { color: theme.textSecondary }]}>{hadith.narrator}</Text>
      </View>

      <Text style={[styles.arabicText, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>
        {hadith.textAr}
      </Text>

      {showTransliteration && language === 'en' && hadith.narrator ? (
        <Text style={[styles.transliteration, { color: theme.textTertiary }]}>
          {hadith.narrator}
        </Text>
      ) : null}

      <View style={styles.ornamentRow}>
        <View style={[styles.ornamentLine, { backgroundColor: theme.border }]} />
        <Text style={[styles.ornamentDot, { color: theme.primary }]}>{'\u066D'}</Text>
        <View style={[styles.ornamentLine, { backgroundColor: theme.border }]} />
      </View>

      {translation ? (
        <View style={[styles.translationSection, { backgroundColor: theme.surfaceElevated, borderStartColor: theme.primary }]}>
          <Text style={[styles.translationLabel, { color: theme.textTertiary }]}>
            {language === 'ur' ? 'ترجمہ' : 'Translation'}
          </Text>
          <Text style={[
            styles.translationText,
            {
              color: theme.text,
              fontFamily: getTranslationFontFamily(language),
              textAlign: isRTL ? 'right' : 'left',
              lineHeight: language === 'ur' ? 20 * 2.0 : 20 * 1.6,
            },
          ]}>
            {translation}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default function HadithReaderScreen() {
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
  const language = useAppStore((s) => s.settings.language);
  const showTransliteration = useAppStore((s) => s.settings.showTransliteration);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const addBookmark = useAppStore((s) => s.addBookmark);
  const removeBookmark = useAppStore((s) => s.removeBookmark);
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const collection = hadithCollections.find((c) => c.id === collectionId);
  const collectionHadiths = getHadithsByCollection(collectionId ?? '');

  const filteredHadiths = useMemo(() => {
    if (!searchQuery.trim()) return collectionHadiths;
    const q = searchQuery.toLowerCase();
    return collectionHadiths.filter((h) =>
      h.textAr.includes(searchQuery) ||
      h.translationEn.toLowerCase().includes(q) ||
      h.translationUr.includes(searchQuery) ||
      h.narrator.toLowerCase().includes(q) ||
      h.hadithNumber.toString() === searchQuery.trim()
    );
  }, [searchQuery, collectionHadiths]);

  const colName = collection
    ? language === 'ar' ? collection.nameAr : language === 'ur' ? collection.nameUr : collection.nameEn
    : collectionId ?? '';

  const isHadithBookmarked = useCallback((hadithId: string) => {
    return bookmarks.some((b) => b.type === 'hadith' && b.hadithId === hadithId);
  }, [bookmarks]);

  const toggleBookmark = useCallback((hadith: HadithData) => {
    const existing = bookmarks.find((b) => b.type === 'hadith' && b.hadithId === hadith.id);
    if (existing) {
      removeBookmark(existing.id);
    } else {
      addBookmark({
        type: 'hadith',
        hadithId: hadith.id,
        collectionId: hadith.collectionId,
        label: `${colName} #${hadith.hadithNumber}`,
      });
    }
  }, [bookmarks, collection, collectionId, addBookmark, removeBookmark]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.primary }]}>
            {`${language === 'ar' || language === 'ur' ? '\u2192' : '\u2190'} ${t(language, 'common.back')}`}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <MaterialCommunityIcons name="book-open-variant" size={24} color={theme.primary} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>{colName}</Text>
          {collection && (
            <Text style={[styles.headerCount, { color: theme.textSecondary }]}>
              {getCompilerName(collection, language)}
            </Text>
          )}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {collectionHadiths.length > 0 ? (
        <>
          <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="search" size={16} color={theme.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder={language === 'ar' ? 'ابحث في الأحاديث...' : language === 'ur' ? 'احادیث میں تلاش کریں...' : 'Search hadiths...'}
              placeholderTextColor={theme.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityLabel="Clear search">
                <Ionicons name="close-circle" size={16} color={theme.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filteredHadiths}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HadithCard
              hadith={item}
              language={language}
              theme={theme}
              showTransliteration={showTransliteration}
              isBookmarked={isHadithBookmarked(item.id)}
              onToggleBookmark={() => toggleBookmark(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search" size={40} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {language === 'ar' ? 'لا توجد نتائج' : language === 'ur' ? 'کوئی نتیجہ نہیں' : 'No results found'}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        </>
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="book-open-variant" size={48} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {language === 'ar' ? 'الأحاديث قادمة قريباً إن شاء الله' : language === 'ur' ? 'احادیث جلد آ رہی ہیں ان شاء اللہ' : 'Hadiths coming soon, In Sha Allah'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: fontSizes.body, paddingVertical: 0 },
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
  headerTitle: { fontSize: fontSizes.body, fontWeight: '700', marginTop: 2 },
  headerCount: { fontSize: fontSizes.caption },
  headerSpacer: { width: 80 },
  listContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  hadithCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: { fontSize: fontSizes.bodySmall, fontWeight: '700' },
  bookName: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  narratorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  narratorText: { fontSize: fontSizes.bodySmall, fontWeight: '500', flex: 1 },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
  },
  gradeText: { fontSize: fontSizes.caption, fontWeight: '700' },
  arabicText: {
    fontSize: 22,
    textAlign: 'right',
    lineHeight: 22 * lineHeights.arabic,
    marginBottom: spacing.sm,
  },
  transliteration: {
    fontSize: fontSizes.bodySmall,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    lineHeight: fontSizes.bodySmall * 1.5,
  },
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  ornamentLine: { flex: 1, height: StyleSheet.hairlineWidth },
  ornamentDot: { fontSize: 16 },
  translationSection: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderStartWidth: 3,
  },
  translationLabel: {
    fontSize: fontSizes.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  translationText: {
    fontSize: 20,
  },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { fontSize: fontSizes.body, textAlign: 'center', lineHeight: 24, marginTop: spacing.md },
});
