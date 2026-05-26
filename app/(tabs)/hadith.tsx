import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { hadithCollections, type HadithCollectionMeta } from '../../src/data/hadithCollections';
import { getHadithsByCollection, hadithStats } from '../../src/data/hadithsLoader';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import { getArabicFontFamily } from '../../src/theme/typography';
import type { Language } from '../../src/types';

function getName(collection: HadithCollectionMeta, lang: Language): string {
  if (lang === 'ar') return collection.nameAr;
  if (lang === 'ur') return collection.nameUr;
  return collection.nameEn;
}

function getCompiler(collection: HadithCollectionMeta, lang: Language): string {
  if (lang === 'ar') return collection.compilerAr;
  if (lang === 'ur') return collection.compilerUr;
  return collection.compiler;
}

function CollectionCard({ collection, theme, language }: {
  collection: HadithCollectionMeta;
  theme: Record<string, string>;
  language: Language;
}) {
  const availableCount = getHadithsByCollection(collection.id).length;
  const hasContent = availableCount > 0;

  if (!hasContent) {
    return (
      <View style={[styles.card, styles.cardDisabled, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <MaterialCommunityIcons name="book-open-variant" size={28} color={theme.textTertiary} style={styles.icon} />
        <View style={styles.cardContent}>
          <Text style={[styles.nameAr, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>{collection.nameAr}</Text>
          <Text style={[styles.nameEn, { color: theme.text }]}>{getName(collection, language)}</Text>
          <Text style={[styles.compiler, { color: theme.textSecondary }]}>{getCompiler(collection, language)}</Text>
          <View style={[styles.comingSoonBadge, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.comingSoonText, { color: theme.textSecondary }]}>
              {t(language, 'hadith.comingSoon')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      activeOpacity={0.7}
      onPress={() => router.push(`/hadith/${collection.id}`)}
      accessibilityRole="button"
      accessibilityLabel={getName(collection, language)}
    >
      <MaterialCommunityIcons name="book-open-variant" size={28} color={theme.primary} style={styles.icon} />
      <View style={styles.cardContent}>
        <Text style={[styles.nameAr, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>{collection.nameAr}</Text>
        <Text style={[styles.nameEn, { color: theme.text }]}>{getName(collection, language)}</Text>
        <Text style={[styles.compiler, { color: theme.textSecondary }]}>{getCompiler(collection, language)}</Text>
        <View style={styles.statsRow}>
          <Text style={[styles.stat, { color: theme.textTertiary }]}>
            {`${collection.totalHadiths.toLocaleString()} ${t(language, 'hadith.hadithNumber')}`}
          </Text>
          <Text style={[styles.stat, { color: theme.textTertiary }]}>
            {`${collection.totalBooks} ${t(language, 'hadith.book')}`}
          </Text>
        </View>
        {hasContent && (
          <View style={[styles.availableBadge, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="checkmark-circle" size={12} color={theme.primary} />
            <Text style={[styles.availableText, { color: theme.primary }]}>
              {`${availableCount} ${t(language, 'hadith.hadithsAvailable')}`}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function HadithScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();

  const totalAvailable = hadithStats.total;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.xs }}>
          <Ionicons name="library-outline" size={20} color={theme.text} />
          <Text style={[styles.title, { color: theme.text, marginBottom: 0 }]}>
            {t(language, 'hadith.collections')}
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {`6 ${t(language, 'hadith.book')} \u2022 ${totalAvailable} ${language === 'ar' ? 'حديث' : language === 'ur' ? 'احادیث' : 'hadiths'}`}
        </Text>
      </View>
      <FlatList
        data={hadithCollections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CollectionCard collection={item} theme={theme} language={language} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: fontSizes.heading2, fontWeight: '800', marginBottom: spacing.xs },
  subtitle: { fontSize: fontSizes.bodySmall },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  cardDisabled: { opacity: 0.85 },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  comingSoonText: { fontSize: fontSizes.caption, fontWeight: '600' },
  icon: { marginEnd: spacing.md, marginTop: 4 },
  cardContent: { flex: 1 },
  nameAr: { fontSize: fontSizes.heading3, textAlign: 'right', marginBottom: 2 },
  nameEn: { fontSize: fontSizes.body, fontWeight: '700', marginBottom: 2 },
  compiler: { fontSize: fontSizes.caption, marginBottom: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  stat: { fontSize: fontSizes.caption },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  availableText: { fontSize: fontSizes.caption, fontWeight: '600' },
});
