import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { Ionicons } from '@expo/vector-icons';
import { surahs, type SurahMeta } from '../../src/data/surahs';
import { isSurahAvailable } from '../../src/data/quranText';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import type { Language } from '../../src/types';

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
          <Text style={[styles.surahNameAr, { color: theme.textArabic }]}>{surah.nameAr}</Text>
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          placeholder={`🔍 ${t(language, 'common.search')} ${t(language, 'quran.surah')}...`}
          placeholderTextColor={theme.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Surah List */}
      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
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
    marginLeft: 8,
  },
});
