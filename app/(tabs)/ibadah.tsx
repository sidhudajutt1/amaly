import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { duaCategories } from '../../src/data/duaCategories';
import { getQiblaDirection, getDistanceToMakkah } from '../../src/services/prayerService';
import { fontSizes, spacing, borderRadius } from '../../src/theme';
import type { Language } from '../../src/types';

function QuickAccessCard({ icon, label, sublabel, theme, onPress }: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  theme: Record<string, string>;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.quickCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.quickIconContainer}>{icon}</View>
      <Text style={[styles.quickLabel, { color: theme.text }]}>{label}</Text>
      {sublabel && <Text style={[styles.quickSublabel, { color: theme.textTertiary }]}>{sublabel}</Text>}
    </TouchableOpacity>
  );
}

function DuaCategoryRow({ cat, language, theme }: {
  cat: typeof duaCategories[0];
  language: Language;
  theme: Record<string, string>;
}) {
  const name = language === 'ar' ? cat.nameAr : language === 'ur' ? cat.nameUr : cat.nameEn;
  return (
    <TouchableOpacity
      style={[styles.duaRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
      activeOpacity={0.7}
      onPress={() => router.push(`/dua/${cat.id}`)}
    >
      <Ionicons name="heart-outline" size={20} color={theme.primary} style={styles.duaIcon} />
      <View style={styles.duaInfo}>
        <Text style={[styles.duaName, { color: theme.text }]}>{name}</Text>
        <Text style={[styles.duaCount, { color: theme.textTertiary }]}>
          {cat.count} {language === 'ar' ? 'دعاء' : language === 'ur' ? 'دعائیں' : 'duas'}
        </Text>
      </View>
      <Text style={[styles.duaArrow, { color: theme.textTertiary }]}>›</Text>
    </TouchableOpacity>
  );
}

export default function IbadahScreen() {
  const language = useAppStore((s) => s.settings.language);
  const locationLat = useAppStore((s) => s.settings.locationLat);
  const locationLng = useAppStore((s) => s.settings.locationLng);
  const { theme } = useTheme();

  const lat = locationLat ?? 21.4225;
  const lng = locationLng ?? 39.8262;
  const qiblaDir = Math.round(getQiblaDirection(lat, lng));
  const distKm = getDistanceToMakkah(lat, lng);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Quick Access Grid */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.sm }}>
        <MaterialCommunityIcons name="hands-pray" size={20} color={theme.text} />
        <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>
          {t(language, 'tabs.ibadah')}
        </Text>
      </View>
      <View style={styles.quickGrid}>
        <QuickAccessCard
          icon={<MaterialCommunityIcons name="compass-outline" size={32} color={theme.primary} />}
          label={t(language, 'ibadah.qibla')}
          sublabel={`${qiblaDir}° • ${distKm} km`}
          theme={theme}
        />
        <QuickAccessCard
          icon={<MaterialCommunityIcons name="counter" size={32} color={theme.primary} />}
          label={t(language, 'ibadah.dhikr')}
          sublabel={t(language, 'ibadah.counter')}
          theme={theme}
          onPress={() => router.push('/dhikr')}
        />
        <QuickAccessCard
          icon={<MaterialCommunityIcons name="star-crescent" size={32} color={theme.primary} />}
          label={t(language, 'ibadah.namesOfAllah')}
          sublabel="99"
          theme={theme}
          onPress={() => router.push('/names')}
        />
        <QuickAccessCard
          icon={<MaterialCommunityIcons name="book-open-outline" size={32} color={theme.primary} />}
          label={t(language, 'ibadah.prayerGuide')}
          theme={theme}
        />
      </View>

      {/* Dua Categories */}
      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: spacing.lg }]}>
        {t(language, 'ibadah.duas')}
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
        {`${t(language, 'ibadah.source')}: Hisnul Muslim`}
      </Text>

      {duaCategories.map((cat) => (
        <DuaCategoryRow key={cat.id} cat={cat} language={language} theme={theme} />
      ))}

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md },
  sectionTitle: { fontSize: fontSizes.heading2, fontWeight: '800', marginBottom: spacing.sm },
  sectionSubtitle: { fontSize: fontSizes.caption, marginBottom: spacing.md },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    flexGrow: 1,
    flexBasis: '46%',
  },
  quickIconContainer: { marginBottom: spacing.sm },
  quickLabel: { fontSize: fontSizes.body, fontWeight: '700', textAlign: 'center' },
  quickSublabel: { fontSize: fontSizes.caption, textAlign: 'center', marginTop: 2 },
  duaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  duaIcon: { marginEnd: spacing.md },
  duaInfo: { flex: 1 },
  duaName: { fontSize: fontSizes.body, fontWeight: '600', marginBottom: 2 },
  duaCount: { fontSize: fontSizes.caption },
  duaArrow: { fontSize: 24, fontWeight: '300' },
});
