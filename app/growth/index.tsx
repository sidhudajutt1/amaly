import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import type { GrowthCategory } from '../../src/types';

const CATEGORY_ICONS: Record<GrowthCategory, { name: string; family: 'ionicons' | 'material' }> = {
  sabr: { name: 'shield-outline', family: 'material' },
  shukr: { name: 'hand-heart', family: 'material' },
  family: { name: 'people-outline', family: 'ionicons' },
  worship: { name: 'mosque', family: 'material' },
  character: { name: 'star-outline', family: 'ionicons' },
  knowledge: { name: 'library-outline', family: 'ionicons' },
  generosity: { name: 'hand-heart-outline', family: 'material' },
  tawakkul: { name: 'heart-outline', family: 'ionicons' },
  justice: { name: 'scale-balance', family: 'material' },
  death_remembrance: { name: 'dove', family: 'material' },
};

function StatCard({ label, value, theme }: { label: string; value: number | string; theme: Record<string, string> }) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.statValue, { color: theme.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

export default function GrowthScreen() {
  const language = useAppStore((s) => s.settings.language);
  const streakData = useAppStore((s) => s.streakData);
  const growthCategories = useAppStore((s) => s.settings.growthCategories);
  const { theme } = useTheme();

  const milestones = [
    { key: 'firstReflection', done: streakData.totalReflections >= 1 },
    { key: 'sevenDayStreak', done: streakData.longestStreak >= 7 },
    { key: 'thirtyDayStreak', done: streakData.longestStreak >= 30 },
    { key: 'hundredNiyyahs', done: streakData.totalNiyyahsCompleted >= 100 },
    {
      key: 'allCategories',
      done: Object.values(streakData.categoryProgress).filter((v) => v > 0).length >= 10,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={t(language, 'growth.title')} language={language} theme={theme} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.streakHero, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
          <MaterialCommunityIcons name="fire" size={32} color={theme.primary} />
          <Text style={[styles.streakNumber, { color: theme.primary }]}>{streakData.currentStreak}</Text>
          <Text style={[styles.streakLabel, { color: theme.text }]}>
            {t(language, 'growth.dayStreak').replace('-Day', '')}
          </Text>
          <Text style={[styles.longest, { color: theme.textSecondary }]}>
            {t(language, 'growth.streak')}: {streakData.longestStreak} • {t(language, 'growth.thisMonth')}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label={t(language, 'growth.reflections')} value={streakData.totalReflections} theme={theme} />
          <StatCard label={t(language, 'growth.niyyahDone')} value={streakData.totalNiyyahsCompleted} theme={theme} />
          <StatCard label={t(language, 'growth.tafsirRead')} value={streakData.totalTafsirRead} theme={theme} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t(language, 'growth.growthAreas')}</Text>
        {(growthCategories.length > 0 ? growthCategories : (Object.keys(streakData.categoryProgress) as GrowthCategory[])).map(
          (cat) => {
            const progress = streakData.categoryProgress[cat] ?? 0;
            const icon = CATEGORY_ICONS[cat];
            const name = t(language, `categories.${cat}`);
            return (
              <View key={cat} style={[styles.progressRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {icon.family === 'material' ? (
                  <MaterialCommunityIcons name={icon.name as keyof typeof MaterialCommunityIcons.glyphMap} size={20} color={theme.primary} />
                ) : (
                  <Ionicons name={icon.name as keyof typeof Ionicons.glyphMap} size={20} color={theme.primary} />
                )}
                <View style={styles.progressInfo}>
                  <Text style={[styles.catName, { color: theme.text }]}>{name}</Text>
                  <View style={[styles.barTrack, { backgroundColor: theme.border }]}>
                    <View
                      style={[
                        styles.barFill,
                        { backgroundColor: theme.primary, width: `${Math.min(100, progress * 5)}%` },
                      ]}
                    />
                  </View>
                </View>
                <Text style={[styles.count, { color: theme.textSecondary }]}>{progress}</Text>
              </View>
            );
          }
        )}

        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: spacing.lg }]}>
          {t(language, 'growth.milestones')}
        </Text>
        {milestones.map((m) => (
          <View key={m.key} style={[styles.milestoneRow, { borderColor: theme.border }]}>
            <Ionicons name={m.done ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={m.done ? theme.primary : theme.textTertiary} />
            <Text style={[styles.milestoneText, { color: m.done ? theme.text : theme.textTertiary }]}>
              {t(language, `growth.${m.key}` as 'growth.firstReflection')}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  streakHero: {
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  streakNumber: { fontSize: 48, fontWeight: '800', marginTop: spacing.sm },
  streakLabel: { fontSize: fontSizes.body, fontWeight: '600' },
  longest: { fontSize: fontSizes.caption, marginTop: spacing.xs },
  statsGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: { fontSize: fontSizes.heading2, fontWeight: '800' },
  statLabel: { fontSize: fontSizes.caption, marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: fontSizes.body, fontWeight: '700', marginBottom: spacing.sm },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  progressInfo: { flex: 1 },
  catName: { fontSize: fontSizes.bodySmall, fontWeight: '600', marginBottom: 6 },
  barTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  count: { fontSize: fontSizes.bodySmall, fontWeight: '700', minWidth: 28, textAlign: 'right' },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  milestoneText: { fontSize: fontSizes.bodySmall, flex: 1 },
});
