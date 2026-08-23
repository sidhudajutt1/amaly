import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t, isRTL } from '../../src/i18n';
import { JUZ_BOUNDARIES, getJuzName } from '../../src/data/juz';
import { surahs } from '../../src/data/surahs';
import { fontSizes, spacing, borderRadius } from '../../src/theme';

export default function JuzIndexScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const rtl = isRTL(language);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={t(language, 'quran.juzIndex')} language={language} theme={theme} />
      <FlatList
        data={JUZ_BOUNDARIES}
        keyExtractor={(item) => item.number.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const startSurah = surahs.find((s) => s.number === item.startSurah);
          const endSurah = surahs.find((s) => s.number === item.endSurah);
          const range =
            item.startSurah === item.endSurah
              ? `${item.startSurah}:${item.startAyah}–${item.endAyah}`
              : `${item.startSurah}:${item.startAyah} – ${item.endSurah}:${item.endAyah}`;
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => router.push(`/surah/${item.startSurah}?ayah=${item.startAyah}`)}
              activeOpacity={0.7}
            >
              <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.badgeText, { color: theme.primary }]}>{item.number}</Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.title, { color: theme.text }]}>{getJuzName(item, language)}</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  {startSurah?.nameEn} → {endSurah?.nameEn}
                </Text>
                <Text style={[styles.range, { color: theme.textTertiary }]}>{range}</Text>
              </View>
              <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: spacing.md,
  },
  badgeText: { fontSize: fontSizes.body, fontWeight: '700' },
  info: { flex: 1 },
  title: { fontSize: fontSizes.body, fontWeight: '700' },
  subtitle: { fontSize: fontSizes.bodySmall, marginTop: 2 },
  range: { fontSize: fontSizes.caption, marginTop: 2 },
});
