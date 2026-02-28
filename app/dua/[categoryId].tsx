import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { duaCategories } from '../../src/data/duaCategories';
import { duas, type DuaData } from '../../src/data/duas';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import { getArabicFontFamily, getTranslationFontFamily } from '../../src/theme/typography';
import type { Language } from '../../src/types';

function DuaCard({ dua, language, theme, showTransliteration }: {
  dua: DuaData;
  language: Language;
  theme: Record<string, string>;
  showTransliteration: boolean;
}) {
  const [count, setCount] = useState(0);
  const isDone = count >= dua.repetitions;

  const getTranslation = () => {
    if (language === 'ur') return dua.translationUr;
    return dua.translationEn;
  };

  return (
    <View style={[styles.duaCard, { backgroundColor: theme.surface, borderColor: isDone ? theme.success : theme.border }]}>
      {/* Arabic */}
      <Text style={[styles.arabicText, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>
        {dua.textAr}
      </Text>

      {/* Transliteration */}
      {showTransliteration && (
        <Text style={[styles.transliteration, { color: theme.textTertiary }]}>
          {dua.transliteration}
        </Text>
      )}

      {/* Translation */}
      <Text style={[styles.translationText, { color: theme.text, fontFamily: getTranslationFontFamily(language) }]}>
        {getTranslation()}
      </Text>

      {/* Source */}
      <Text style={[styles.source, { color: theme.textTertiary }]}>
        📖 {dua.source}
      </Text>

      {/* Counter */}
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
  const { theme } = useTheme();

  const category = duaCategories.find((c) => c.id === categoryId);
  const categoryDuas = duas.filter((d) => d.categoryId === categoryId);

  const catName = category
    ? language === 'ar' ? category.nameAr : language === 'ur' ? category.nameUr : category.nameEn
    : categoryId;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.primary }]}>
            {`${language === 'ar' || language === 'ur' ? '→' : '←'} ${t(language, 'common.back')}`}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerIcon]}>{category?.icon || '🤲'}</Text>
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
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon]}>📖</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Duas loading in next update.{'\n'}Try Morning or Evening Adhkar.
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
  headerIcon: { fontSize: 24, marginBottom: 2 },
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
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: fontSizes.body, textAlign: 'center', lineHeight: 24 },
});
