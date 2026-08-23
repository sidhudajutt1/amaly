import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t, isRTL } from '../../src/i18n';
import { quranSubjects, getSubjectName } from '../../src/data/quranSubjects';
import { fontSizes, spacing, borderRadius } from '../../src/theme';

export default function SubjectsIndexScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const rtl = isRTL(language);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={t(language, 'quran.subjects')} language={language} theme={theme} />
      <FlatList
        data={quranSubjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => router.push(`/subjects/${item.id}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={22} color={theme.primary} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.title, { color: theme.text }]}>{getSubjectName(item, language)}</Text>
              <Text style={[styles.count, { color: theme.textTertiary }]}>
                {item.ayahs.length} {t(language, 'quran.ayahs')}
              </Text>
            </View>
            <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={18} color={theme.textTertiary} />
          </TouchableOpacity>
        )}
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
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: spacing.md,
  },
  info: { flex: 1 },
  title: { fontSize: fontSizes.body, fontWeight: '700' },
  count: { fontSize: fontSizes.caption, marginTop: 2 },
});
