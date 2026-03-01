import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { hadithCollections } from '../../src/data/hadithCollections';
import { hadiths, type HadithData } from '../../src/data/hadiths';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getArabicFontFamily, getTranslationFontFamily } from '../../src/theme/typography';
import type { Language } from '../../src/types';

const GRADE_COLORS: Record<string, string> = {
  sahih: '#2E7D32',
  hasan: '#F57F17',
  daif: '#C62828',
};

function HadithCard({ hadith, language, theme, showTransliteration }: {
  hadith: HadithData;
  language: Language;
  theme: Record<string, string>;
  showTransliteration: boolean;
}) {
  const getTranslation = () => {
    if (language === 'ur') return hadith.translationUr;
    return hadith.translationEn;
  };

  return (
    <View style={[styles.hadithCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.headerRow}>
        <View style={[styles.numberBadge, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.numberText, { color: theme.primary }]}>{hadith.hadithNumber}</Text>
        </View>
        <View style={{ flex: 1, marginStart: spacing.sm }}>
          <Text style={[styles.bookName, { color: theme.textSecondary }]}>{hadith.bookName}</Text>
          <Text style={[styles.narratorText, { color: theme.textTertiary }]}>{hadith.narrator}</Text>
        </View>
        <View style={[styles.gradeBadge, { backgroundColor: `${GRADE_COLORS[hadith.grade]}15` }]}>
          <Text style={[styles.gradeText, { color: GRADE_COLORS[hadith.grade] }]}>{hadith.gradeLabel}</Text>
        </View>
      </View>

      <Text style={[styles.arabicText, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>
        {hadith.textAr}
      </Text>

      <Text style={[styles.translationText, { color: theme.text, fontFamily: getTranslationFontFamily(language) }]}>
        {getTranslation()}
      </Text>
    </View>
  );
}

export default function HadithReaderScreen() {
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
  const language = useAppStore((s) => s.settings.language);
  const showTransliteration = useAppStore((s) => s.settings.showTransliteration);
  const { theme } = useTheme();

  const collection = hadithCollections.find((c) => c.id === collectionId);
  const collectionHadiths = hadiths.filter((h) => h.collectionId === collectionId);

  const colName = collection
    ? language === 'ar' ? collection.nameAr : language === 'ur' ? collection.nameUr : collection.nameEn
    : collectionId ?? '';

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
              {collection.compiler}
            </Text>
          )}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {collectionHadiths.length > 0 ? (
        <FlatList
          data={collectionHadiths}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HadithCard
              hadith={item}
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
    marginBottom: spacing.md,
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
  narratorText: { fontSize: fontSizes.caption },
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
    marginBottom: spacing.md,
  },
  translationText: {
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * lineHeights.latin,
  },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { fontSize: fontSizes.body, textAlign: 'center', lineHeight: 24, marginTop: spacing.md },
});
