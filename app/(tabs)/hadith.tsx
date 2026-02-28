import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { hadithCollections, type HadithCollectionMeta } from '../../src/data/hadithCollections';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import type { Language } from '../../src/types';

function getName(collection: HadithCollectionMeta, lang: Language): string {
  if (lang === 'ar') return collection.nameAr;
  if (lang === 'ur') return collection.nameUr;
  return collection.nameEn;
}

function CollectionCard({ collection, theme, language }: {
  collection: HadithCollectionMeta;
  theme: Record<string, string>;
  language: Language;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, opacity: 0.5 }]}
      activeOpacity={0.7}
      disabled
    >
      <MaterialCommunityIcons name="book-open-variant" size={28} color={theme.primary} style={styles.icon} />
      <View style={styles.cardContent}>
        <Text style={[styles.nameAr, { color: theme.textArabic }]}>{collection.nameAr}</Text>
        <Text style={[styles.nameEn, { color: theme.text }]}>{getName(collection, language)}</Text>
        <Text style={[styles.compiler, { color: theme.textSecondary }]}>{collection.compiler}</Text>
        <View style={styles.statsRow}>
          <Text style={[styles.stat, { color: theme.textTertiary }]}>
            {`${collection.totalHadiths.toLocaleString()} ${t(language, 'hadith.hadithNumber')}`}
          </Text>
          <Text style={[styles.stat, { color: theme.textTertiary }]}>
            {`${collection.totalBooks} ${t(language, 'hadith.book')}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HadithScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();

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
          {`${t(language, 'hadith.collections')} — 6 ${t(language, 'hadith.book')}`}
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
  icon: { marginEnd: spacing.md, marginTop: 4 },
  cardContent: { flex: 1 },
  nameAr: { fontSize: fontSizes.heading3, textAlign: 'right', marginBottom: 2 },
  nameEn: { fontSize: fontSizes.body, fontWeight: '700', marginBottom: 2 },
  compiler: { fontSize: fontSizes.caption, marginBottom: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  stat: { fontSize: fontSizes.caption },
});
