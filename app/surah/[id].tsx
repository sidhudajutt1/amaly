import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { surahs } from '../../src/data/surahs';
import { getSurahData, isSurahAvailable, getAvailableSurahNumbers, type AyahData } from '../../src/data/quranText';
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
  const markQuranVersesRead = useAppStore((s) => s.markQuranVersesRead);
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
          ListFooterComponent={
            <View style={styles.readFooter}>
              <TouchableOpacity
                style={[styles.markReadBtn, { backgroundColor: theme.primary }]}
                onPress={() => {
                  markQuranVersesRead(surahData?.ayahs.length ?? 0);
                  router.back();
                }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.markReadText}>
                  {language === 'ar' ? 'تم القراءة' : language === 'ur' ? 'پڑھ لیا' : 'Mark as Read'}
                </Text>
              </TouchableOpacity>
            </View>
          }
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
            {language === 'ar' ? `${getAvailableSurahNumbers().length} سورة متاحة. المزيد قريباً.` : language === 'ur' ? `${getAvailableSurahNumbers().length} سورتیں دستیاب ہیں۔ مزید جلد آ رہی ہیں۔` : `${getAvailableSurahNumbers().length} surahs available now. More coming soon.`}
          </Text>
          <View style={styles.availableList}>
            {getAvailableSurahNumbers().slice(0, 6).map((num) => {
              const s = surahs.find((x) => x.number === num);
              if (!s) return null;
              return (
                <TouchableOpacity
                  key={num}
                  style={[styles.availableChip, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
                  onPress={() => router.replace(`/surah/${num}`)}
                >
                  <Text style={[styles.availableChipText, { color: theme.primary }]}>{s.nameEn}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
  availableList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 },
  availableChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  availableChipText: { fontSize: 13, fontWeight: '600' },
  readFooter: { alignItems: 'center', paddingVertical: 24 },
  markReadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  markReadText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
