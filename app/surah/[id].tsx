import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { Audio } from 'expo-av';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { surahs } from '../../src/data/surahs';
import { getSurahData, isSurahAvailable, getAvailableSurahNumbers, type AyahData } from '../../src/data/quranText';
import { getIndoPakAyahText } from '../../src/data/quranTextIndoPak';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import { getQuranFontFamily, getTranslationFontFamily, fonts } from '../../src/theme/typography';
import { createAudioPlayer, type PlaybackState, type AudioPlayer } from '../../src/services/audioService';
import { getTafsirForAyah } from '../../src/data/tafsirLoader';
import type { Language, ReciterId } from '../../src/types';

const BISMILLAH_INDOPAK = 'بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِيۡمِ';
const BISMILLAH_UTHMANI = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِيمِ';

function Bismillah({ theme, language }: { theme: Record<string, string>; language: Language }) {
  return (
    <View style={[styles.bismillahContainer, { borderColor: theme.border }]}>
      <Text style={[styles.bismillahText, { color: theme.textArabic, fontFamily: getQuranFontFamily(language) }]}>
        {language === 'ur' ? BISMILLAH_INDOPAK : BISMILLAH_UTHMANI}
      </Text>
    </View>
  );
}

function AyahCard({ ayah, surahNumber, language, theme, quranFontSize, translationFontSize, isPlaying, onPlayAyah, isBookmarked, onToggleBookmark }: {
  ayah: AyahData;
  surahNumber: number;
  language: Language;
  theme: Record<string, string>;
  quranFontSize: number;
  translationFontSize: number;
  isPlaying: boolean;
  onPlayAyah: (ayah: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  const [tafsirOpen, setTafsirOpen] = useState(false);

  const getTranslation = () => {
    if (language === 'ur') return ayah.translationUr;
    return ayah.translationEn;
  };

  const indoPakText = language === 'ur' ? getIndoPakAyahText(surahNumber, ayah.number) : null;
  const arabicDisplayText = indoPakText ?? ayah.textAr;
  const arabicFontFamily = language === 'ur' ? fonts.quranIndoPak : fonts.quranMushaf;

  const tafsir = tafsirOpen ? getTafsirForAyah(surahNumber, ayah.number) : undefined;
  const tafsirText = tafsir ? (language === 'ur' && tafsir.ur ? tafsir.ur : tafsir.en) : '';
  const hasTafsir = !!getTafsirForAyah(surahNumber, ayah.number);

  return (
    <View style={[styles.ayahCard, { backgroundColor: theme.surface, borderColor: isPlaying ? theme.primary : theme.border, borderWidth: isPlaying ? 2 : 1 }]}>
      <View style={styles.ayahTopRow}>
        <View style={[styles.ayahNumberBadge, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.ayahNumber, { color: theme.primary }]}>{ayah.number}</Text>
        </View>
        <View style={styles.ayahActions}>
          <TouchableOpacity
            onPress={() => onPlayAyah(ayah.number)}
            style={[styles.actionBtn, { backgroundColor: isPlaying ? theme.primary : theme.primaryLight }]}
            accessibilityLabel={isPlaying ? 'Playing ayah' : 'Play ayah'}
            accessibilityRole="button"
          >
            <Ionicons name={isPlaying ? 'volume-high' : 'play'} size={14} color={isPlaying ? '#fff' : theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onToggleBookmark}
            style={[styles.actionBtn, { backgroundColor: isBookmarked ? theme.primary : theme.primaryLight }]}
            accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark ayah'}
            accessibilityRole="button"
          >
            <Ionicons name={isBookmarked ? 'bookmark' : 'bookmark-outline'} size={14} color={isBookmarked ? '#fff' : theme.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.arabicText, { color: theme.textArabic, fontSize: quranFontSize, lineHeight: quranFontSize * (language === 'ur' ? 2.0 : 1.8), fontFamily: arabicFontFamily }]}>
        {arabicDisplayText}
      </Text>
      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
      </View>
      <Text style={[styles.translationText, { color: theme.text, fontSize: translationFontSize, lineHeight: Math.round(translationFontSize * (language === 'ur' ? 2.0 : 1.6)), fontFamily: getTranslationFontFamily(language) }]}>
        {getTranslation()}
      </Text>

      {hasTafsir && (
        <TouchableOpacity
          style={[styles.tafsirToggle, { borderColor: theme.border }]}
          onPress={() => setTafsirOpen((o) => !o)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="book-open-page-variant" size={14} color={theme.primary} />
          <Text style={[styles.tafsirToggleText, { color: theme.primary }]}>
            {tafsirOpen
              ? (language === 'ar' ? 'إخفاء التفسير' : language === 'ur' ? 'تفسیر چھپائیں' : 'Hide Tafsir')
              : (language === 'ar' ? 'تفسير ابن كثير' : language === 'ur' ? 'تفسیر ابن کثیر' : 'Ibn Kathir Tafsir')}
          </Text>
          <Ionicons name={tafsirOpen ? 'chevron-up' : 'chevron-down'} size={14} color={theme.primary} />
        </TouchableOpacity>
      )}

      {tafsirOpen && tafsirText ? (
        <View style={[styles.tafsirBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Text style={[styles.tafsirSource, { color: theme.textTertiary }]}>
            {language === 'ar' ? 'تفسير ابن كثير' : language === 'ur' ? 'تفسیر ابن کثیر' : 'Tafsir Ibn Kathir'}
          </Text>
          <Text style={[styles.tafsirText, { color: theme.text, fontFamily: getTranslationFontFamily(language), lineHeight: fontSizes.body * (language === 'ur' ? 2.0 : 1.6) }]}>
            {tafsirText}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function AudioControlBar({ playbackState, currentAyah, totalAyahs, surahName, onPlayAll, onPause, onResume, onStop, theme, language }: {
  playbackState: PlaybackState;
  currentAyah: number | null;
  totalAyahs: number;
  surahName: string;
  onPlayAll: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  theme: Record<string, string>;
  language: Language;
}) {
  const isActive = playbackState !== 'idle' && playbackState !== 'error';

  return (
    <View style={[styles.audioBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {isActive ? (
        <>
          <View style={styles.audioInfo}>
            {playbackState === 'loading' ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Ionicons name="musical-notes" size={16} color={theme.primary} />
            )}
            <Text style={[styles.audioText, { color: theme.text }]} numberOfLines={1}>
              {playbackState === 'loading'
                ? (language === 'ar' ? 'جاري التحميل...' : language === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...')
                : `${language === 'ar' ? 'آية' : language === 'ur' ? 'آیت' : 'Ayah'} ${currentAyah ?? '?'} / ${totalAyahs}`}
            </Text>
          </View>
          <View style={styles.audioControls}>
            {playbackState === 'playing' ? (
              <TouchableOpacity onPress={onPause} style={[styles.audioBtn, { backgroundColor: theme.primaryLight }]} accessibilityLabel="Pause" accessibilityRole="button">
                <Ionicons name="pause" size={20} color={theme.primary} />
              </TouchableOpacity>
            ) : playbackState === 'paused' ? (
              <TouchableOpacity onPress={onResume} style={[styles.audioBtn, { backgroundColor: theme.primaryLight }]} accessibilityLabel="Resume" accessibilityRole="button">
                <Ionicons name="play" size={20} color={theme.primary} />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={onStop} style={[styles.audioBtn, { backgroundColor: `${theme.error || '#C62828'}20` }]} accessibilityLabel="Stop" accessibilityRole="button">
              <Ionicons name="stop" size={20} color={theme.error || '#C62828'} />
            </TouchableOpacity>
          </View>
        </>
      ) : playbackState === 'error' ? (
        <View style={styles.audioInfo}>
          <Ionicons name="wifi-outline" size={16} color={theme.error || '#C62828'} />
          <Text style={[styles.audioText, { color: theme.error || '#C62828', flex: 1 }]}>
            {language === 'ar' ? 'الصوت غير متاح — تحقق من اتصالك' : language === 'ur' ? 'آڈیو دستیاب نہیں — کنکشن چیک کریں' : 'Audio unavailable — check your connection'}
          </Text>
        </View>
      ) : (
        <TouchableOpacity onPress={onPlayAll} style={[styles.playAllBtn, { backgroundColor: theme.primary }]} accessibilityLabel="Play full surah" accessibilityRole="button">
          <Ionicons name="play" size={18} color="#fff" />
          <Text style={styles.playAllText}>
            {language === 'ar' ? 'تشغيل السورة' : language === 'ur' ? 'سورت چلائیں' : 'Play Surah'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function SurahReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const surahNumber = parseInt(id || '1', 10);
  const language = useAppStore((s) => s.settings.language);
  const quranFontSize = useAppStore((s) => s.settings.quranFontSize);
  const translationFontSize = useAppStore((s) => s.settings.translationFontSize);
  const selectedReciter = useAppStore((s) => s.settings.selectedReciter);
  const markQuranVersesRead = useAppStore((s) => s.markQuranVersesRead);
  const updateReadingProgress = useAppStore((s) => s.updateReadingProgress);
  const addBookmark = useAppStore((s) => s.addBookmark);
  const removeBookmark = useAppStore((s) => s.removeBookmark);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const { theme } = useTheme();

  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);

  const surahMeta = surahs.find((s) => s.number === surahNumber);
  const surahData = getSurahData(surahNumber);
  const available = isSurahAvailable(surahNumber);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
  }, []);

  useEffect(() => {
    return () => {
      playerRef.current?.cleanup();
    };
  }, []);

  const getPlayer = useCallback(() => {
    if (!playerRef.current) {
      playerRef.current = createAudioPlayer(selectedReciter, (state, ayah) => {
        setPlaybackState(state);
        setCurrentAyah(ayah);
        if (ayah && state === 'playing') {
          updateReadingProgress(surahNumber, ayah);
        }
      });
    }
    return playerRef.current;
  }, [selectedReciter, surahNumber, updateReadingProgress]);

  const handlePlayAyah = useCallback((ayah: number) => {
    const player = getPlayer();
    if (playbackState === 'playing' && currentAyah === ayah) {
      player.pause();
    } else {
      player.play(surahNumber, ayah);
    }
  }, [getPlayer, playbackState, currentAyah, surahNumber]);

  const handlePlayAll = useCallback(() => {
    const player = getPlayer();
    player.playFullSurah(surahNumber, surahMeta?.ayahCount ?? 1);
  }, [getPlayer, surahNumber, surahMeta]);

  const isAyahBookmarked = useCallback((ayahNum: number) => {
    return bookmarks.some((b) => b.type === 'ayah' && b.surahNumber === surahNumber && b.ayahNumber === ayahNum);
  }, [bookmarks, surahNumber]);

  const toggleBookmark = useCallback((ayahNum: number) => {
    const existing = bookmarks.find((b) => b.type === 'ayah' && b.surahNumber === surahNumber && b.ayahNumber === ayahNum);
    if (existing) {
      removeBookmark(existing.id);
    } else {
      addBookmark({
        type: 'ayah',
        surahNumber,
        ayahNumber: ayahNum,
        label: `${surahMeta?.nameEn ?? 'Surah'} ${surahNumber}:${ayahNum}`,
      });
    }
  }, [bookmarks, surahNumber, surahMeta, addBookmark, removeBookmark]);

  if (!surahMeta) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Surah not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity onPress={() => { playerRef.current?.cleanup(); router.back(); }} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.primary }]}>
            {`${language === 'ar' || language === 'ur' ? '→' : '←'} ${t(language, 'common.back')}`}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerArabic, { color: theme.textArabic, fontFamily: getQuranFontFamily(language) }]}>{surahMeta.nameAr}</Text>
          <Text style={[styles.headerEnglish, { color: theme.text }]}>{surahMeta.nameEn}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {`${surahMeta.nameTranslation} • ${surahMeta.ayahCount} ${t(language, 'quran.ayahs')}`}
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {available && surahData ? (
        <>
          <AudioControlBar
            playbackState={playbackState}
            currentAyah={currentAyah}
            totalAyahs={surahData.ayahs.length}
            surahName={surahMeta.nameEn}
            onPlayAll={handlePlayAll}
            onPause={() => playerRef.current?.pause()}
            onResume={() => playerRef.current?.resume()}
            onStop={() => playerRef.current?.stop()}
            theme={theme}
            language={language}
          />
          <FlatList
            data={surahData.ayahs}
            keyExtractor={(item) => `${surahNumber}-${item.number}`}
            ListHeaderComponent={surahNumber !== 1 && surahNumber !== 9 ? <Bismillah theme={theme} language={language} /> : null}
            renderItem={({ item }) => (
              <AyahCard
                ayah={item}
                surahNumber={surahNumber}
                language={language}
                theme={theme}
                quranFontSize={quranFontSize}
                translationFontSize={translationFontSize}
                isPlaying={playbackState === 'playing' && currentAyah === item.number}
                onPlayAyah={handlePlayAyah}
                isBookmarked={isAyahBookmarked(item.number)}
                onToggleBookmark={() => toggleBookmark(item.number)}
              />
            )}
            ListFooterComponent={
              <View style={styles.readFooter}>
                <TouchableOpacity
                  style={[styles.markReadBtn, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    playerRef.current?.cleanup();
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
        </>
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
  },
  ayahTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ayahNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayahActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayahNumber: { fontSize: fontSizes.caption, fontWeight: '700' },
  arabicText: {
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  divider: { alignItems: 'center', marginVertical: spacing.sm },
  dividerLine: { height: 1, width: '60%' },
  translationText: {},
  tafsirToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tafsirToggleText: { fontSize: fontSizes.bodySmall, fontWeight: '600', flex: 1 },
  tafsirBox: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  tafsirSource: {
    fontSize: fontSizes.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  tafsirText: {
    fontSize: fontSizes.body,
  },
  audioBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  audioText: { fontSize: fontSizes.bodySmall, fontWeight: '600' },
  audioControls: { flexDirection: 'row', gap: 8 },
  audioBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  playAllText: { color: '#fff', fontWeight: '700', fontSize: fontSizes.bodySmall },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  comingSoonTitle: { fontSize: fontSizes.heading2, fontWeight: '700', marginBottom: spacing.sm },
  comingSoonText: { fontSize: fontSizes.body, textAlign: 'center', lineHeight: 24, marginBottom: spacing.lg },
  availableList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 },
  availableChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  availableChipText: { fontSize: 13, fontWeight: '600' },
  readFooter: { alignItems: 'center', paddingVertical: 24 },
  markReadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  markReadText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
