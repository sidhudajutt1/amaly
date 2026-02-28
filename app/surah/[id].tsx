import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { surahs } from '../../src/data/surahs';
import { getSurahData, isSurahAvailable, type AyahData } from '../../src/data/quranText';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import { getQuranFontFamily, getTranslationFontFamily } from '../../src/theme/typography';
import type { Language } from '../../src/types';

function Bismillah({ theme, language }: { theme: Record<string, string>; language: Language }) {
  return (
    <View style={[styles.bismillahContainer, { borderColor: theme.border }]}>
      <Text style={[styles.bismillahText, { color: theme.textArabic, fontFamily: getQuranFontFamily(language) }]}>
        بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ
      </Text>
    </View>
  );
}

function AyahCard({ ayah, language, theme, quranFontSize, translationFontSize }: {
  ayah: AyahData;
  language: Language;
  theme: Record<string, string>;
  quranFontSize: number;
  translationFontSize: number;
}) {
  const getTranslation = () => {
    if (language === 'ur') return ayah.translationUr;
    return ayah.translationEn;
  };

  return (
    <View style={[styles.ayahCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.ayahNumberBadge, { backgroundColor: theme.primaryLight }]}>
        <Text style={[styles.ayahNumber, { color: theme.primary }]}>{ayah.number}</Text>
      </View>
      <Text style={[styles.arabicText, { color: theme.textArabic, fontSize: quranFontSize, lineHeight: quranFontSize * 1.8, fontFamily: getQuranFontFamily(language) }]}>
        {ayah.textAr}
      </Text>
      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
      </View>
      <Text style={[styles.translationText, { color: theme.text, fontSize: translationFontSize, lineHeight: Math.round(translationFontSize * 1.6), fontFamily: getTranslationFontFamily(language) }]}>
        {getTranslation()}
      </Text>
    </View>
  );
}

export default function SurahReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahNumber = parseInt(id || '1', 10);
  const language = useAppStore((s) => s.settings.language);
  const quranFontSize = useAppStore((s) => s.settings.quranFontSize);
  const translationFontSize = useAppStore((s) => s.settings.translationFontSize);
  const { theme } = useTheme();

  const surahMeta = surahs.find((s) => s.number === surahNumber);
  const surahData = getSurahData(surahNumber);
  const available = isSurahAvailable(surahNumber);

  if (!surahMeta) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Surah not found</Text>
      </View>
    );
  }

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
          <Text style={[styles.headerArabic, { color: theme.textArabic }]}>{surahMeta.nameAr}</Text>
          <Text style={[styles.headerEnglish, { color: theme.text }]}>{surahMeta.nameEn}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {`${surahMeta.nameTranslation} • ${surahMeta.ayahCount} ${t(language, 'quran.ayahs')}`}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {available && surahData ? (
        <FlatList
          data={surahData.ayahs}
          keyExtractor={(item) => `${surahNumber}-${item.number}`}
          ListHeaderComponent={surahNumber !== 1 && surahNumber !== 9 ? <Bismillah theme={theme} language={language} /> : null}
          renderItem={({ item }) => (
            <AyahCard
              ayah={item}
              language={language}
              theme={theme}
              quranFontSize={quranFontSize}
              translationFontSize={translationFontSize}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.comingSoon}>
          <MaterialCommunityIcons name="book-open-page-variant-outline" size={48} color={theme.textSecondary} />
          <Text style={[styles.comingSoonTitle, { color: theme.text }]}>
            {surahMeta.nameEn}
          </Text>
          <Text style={[styles.comingSoonText, { color: theme.textSecondary }]}>
            {language === 'ar' ? 'النص الكامل قريباً.\nسورة الفاتحة متاحة الآن.' : language === 'ur' ? 'مکمل متن اگلی تازہ کاری میں۔\nسورۃ الفاتحہ ابھی دستیاب ہے۔' : 'Full text loading in next update.\nAl-Fatihah is available now.'}
          </Text>
          <TouchableOpacity
            style={[styles.goToFatihah, { backgroundColor: theme.primary }]}
            onPress={() => router.replace('/surah/1')}
          >
            <Text style={[styles.goToFatihahText, { color: '#fff' }]}>
              {language === 'ar' ? 'اقرأ الفاتحة' : language === 'ur' ? 'الفاتحہ پڑھیں' : 'Read Al-Fatihah'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  headerArabic: { fontSize: fontSizes.heading2, marginBottom: 2 },
  headerEnglish: { fontSize: fontSizes.body, fontWeight: '700', marginBottom: 2 },
  headerSubtitle: { fontSize: fontSizes.caption },
  headerSpacer: { width: 80 },
  bismillahContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
  },
  bismillahText: { fontSize: 24 },
  listContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  ayahCard: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  ayahNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: spacing.sm,
  },
  ayahNumber: { fontSize: fontSizes.caption, fontWeight: '700' },
  arabicText: {
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  divider: { alignItems: 'center', marginVertical: spacing.sm },
  dividerLine: { height: 1, width: '60%' },
  translationText: {},
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  comingSoonEmoji: { fontSize: 48, marginBottom: spacing.md },
  comingSoonTitle: { fontSize: fontSizes.heading2, fontWeight: '700', marginBottom: spacing.sm },
  comingSoonText: { fontSize: fontSizes.body, textAlign: 'center', lineHeight: 24, marginBottom: spacing.lg },
  goToFatihah: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  goToFatihahText: { fontSize: fontSizes.body, fontWeight: '700' },
});
