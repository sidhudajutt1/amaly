import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { namesOfAllah, type AllahNameData } from '../../src/data/namesOfAllah';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import { getArabicFontFamily } from '../../src/theme/typography';
import type { Language } from '../../src/types';

function NameCard({ name, language, theme }: {
  name: AllahNameData;
  language: Language;
  theme: Record<string, string>;
}) {
  const meaning = language === 'ur' ? name.meaningUr : name.meaningEn;
  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.numberBadge, { backgroundColor: theme.primaryLight }]}>
        <Text style={[styles.number, { color: theme.primary }]}>{name.id}</Text>
      </View>
      <Text style={[styles.arabicName, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>{name.nameAr}</Text>
      <Text style={[styles.transliteration, { color: theme.text }]}>{name.transliteration}</Text>
      <Text style={[styles.meaning, { color: theme.textSecondary }]}>{meaning}</Text>
    </View>
  );
}

export default function NamesOfAllahScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backText, { color: theme.primary }]}>
            {`${language === 'ar' || language === 'ur' ? '→' : '←'} ${t(language, 'common.back')}`}
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <MaterialCommunityIcons name="star-crescent" size={20} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text, flex: 0 }]}>
            {t(language, 'ibadah.namesOfAllah')}
          </Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={namesOfAllah}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <NameCard name={item} language={language} theme={theme} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backText: { fontSize: fontSizes.bodySmall, fontWeight: '600', width: 60 },
  title: { fontSize: fontSizes.body, fontWeight: '700', flex: 1, textAlign: 'center' },
  listContent: { padding: spacing.sm, paddingBottom: spacing.xxl },
  row: { justifyContent: 'space-between', paddingHorizontal: spacing.xs },
  card: {
    width: '48%',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  number: { fontSize: fontSizes.caption, fontWeight: '700' },
  arabicName: { fontSize: fontSizes.heading2, marginBottom: spacing.xs },
  transliteration: { fontSize: fontSizes.bodySmall, fontWeight: '600', marginBottom: 2 },
  meaning: { fontSize: fontSizes.caption, textAlign: 'center' },
});
