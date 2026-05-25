import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { duaCategories } from '../../src/data/duaCategories';
import { duas, type DuaData } from '../../src/data/duas';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import { getArabicFontFamily, getTranslationFontFamily } from '../../src/theme/typography';
import type { Language } from '../../src/types';

function DuaCard({ dua, language, theme, showTransliteration, isBookmarked, onToggleBookmark }: {
  dua: DuaData;
  language: Language;
  theme: Record<string, string>;
  showTransliteration: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  const [count, setCount] = useState(0);
  const isDone = count >= dua.repetitions;

  const getTranslation = () => {
    if (language === 'ur') return dua.translationUr;
    return dua.translationEn;
  };

  return (
    <View style={[styles.duaCard, { backgroundColor: theme.surface, borderColor: isDone ? theme.success : theme.border }]}>
      <View style={styles.duaTopRow}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={onToggleBookmark}
          style={[styles.bookmarkBtn, { backgroundColor: isBookmarked ? theme.primary : theme.primaryLight }]}
          accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark dua'}
          accessibilityRole="button"
        >
          <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={14} color={isBookmarked ? '#fff' : theme.primary} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.arabicText, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>
        {dua.textAr}
      </Text>

      {showTransliteration && (
        <Text style={[styles.transliteration, { color: theme.textTertiary }]}>
          {dua.transliteration}
        </Text>
      )}

      <Text style={[styles.translationText, { color: theme.text, fontFamily: getTranslationFontFamily(language) }]}>
        {getTranslation()}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.sm }}>
        <Ionicons name="book-outline" size={14} color={theme.textTertiary} />
        <Text style={[styles.source, { color: theme.textTertiary, marginBottom: 0 }]}>
          {dua.source}
        </Text>
      </View>

      {dua.repetitions > 1 && (
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={[styles.counterBtn, { backgroundColor: isDone ? theme.success : theme.primary }]}
            onPress={() => setCount((c) => Math.min(c + 1, dua.repetitions))}
          >
            <Text style={styles.counterBtnText}>
              {isDone ? '✓' : `${count} / ${dua.repetitions}`}
            </Text>
          </TouchableOpacity>
          {count > 0 && !isDone && (
            <TouchableOpacity onPress={() => setCount(0)}>
              <Text style={[styles.resetText, { color: theme.textTertiary }]}>
                {t(language, 'ibadah.reset')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export default function DuaReaderScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const language = useAppStore((s) => s.settings.language);
  const showTransliteration = useAppStore((s) => s.settings.showTransliteration);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const addBookmark = useAppStore((s) => s.addBookmark);
  const removeBookmark = useAppStore((s) => s.removeBookmark);
  const { theme } = useTheme();

  const category = duaCategories.find((c) => c.id === categoryId);
  const categoryDuas = duas.filter((d) => d.categoryId === categoryId);

  const catName = category
    ? language === 'ar' ? category.nameAr : language === 'ur' ? category.nameUr : category.nameEn
    : categoryId;

  const isDuaBookmarked = useCallback((duaId: string) => {
    return bookmarks.some((b) => b.type === 'dua' && b.duaId === duaId);
  }, [bookmarks]);

  const toggleBookmark = useCallback((dua: DuaData) => {
    const existing = bookmarks.find((b) => b.type === 'dua' && b.duaId === dua.id);
    if (existing) {
      removeBookmark(existing.id);
    } else {
      addBookmark({
        type: 'dua',
        duaId: dua.id,
        categoryId: dua.categoryId,
        label: category?.nameEn ?? dua.categoryId,
      });
    }
  }, [bookmarks, category, addBookmark, removeBookmark]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.primary }]}>
            {`${language === 'ar' || language === 'ur' ? '→' : '←'} ${t(language, 'common.back')}`}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <MaterialCommunityIcons name="book-open-page-variant-outline" size={24} color={theme.primary} />
          <Text style={[styles.headerTitle, { color: theme.text }]}>{catName}</Text>
          <Text style={[styles.headerCount, { color: theme.textSecondary }]}>
            {categoryDuas.length} {language === 'ar' ? 'دعاء' : language === 'ur' ? 'دعائیں' : 'duas'}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {categoryDuas.length > 0 ? (
        <FlatList
          data={categoryDuas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuaCard
              dua={item}
              language={language}
              theme={theme}
              showTransliteration={showTransliteration}
              isBookmarked={isDuaBookmarked(item.id)}
              onToggleBookmark={() => toggleBookmark(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={48} color={theme.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {language === 'ar' ? 'الأدعية قريباً.\nجرّب أذكار الصباح أو المساء.' : language === 'ur' ? 'دعائیں اگلی تازہ کاری میں۔\nصبح یا شام کے اذکار آزمائیں۔' : 'Duas loading in next update.\nTry Morning or Evening Adhkar.'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  headerTitle: { fontSize: fontSizes.body, fontWeight: '700' },
  headerCount: { fontSize: fontSizes.caption },
  headerSpacer: { width: 80 },
  listContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  duaCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  duaTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 24,
    textAlign: 'right',
    lineHeight: 44,
    marginBottom: spacing.md,
  },
  transliteration: {
    fontSize: fontSizes.bodySmall,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  translationText: {
    fontSize: fontSizes.body,
    lineHeight: 26,
    marginBottom: spacing.sm,
  },
  source: { fontSize: fontSizes.caption, marginBottom: spacing.sm },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  counterBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  counterBtnText: { color: '#fff', fontWeight: '700', fontSize: fontSizes.body },
  resetText: { fontSize: fontSizes.caption },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { fontSize: fontSizes.body, textAlign: 'center', lineHeight: 24 },
});
