import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t, isRTL } from '../../src/i18n';
import { duaCategories } from '../../src/data/duaCategories';
import { countDuasInCategory } from '../../src/data/duas';
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
      accessibilityLabel={`${label}${sublabel ? `, ${sublabel}` : ''}`}
      accessibilityRole="button"
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
  const rtl = isRTL(language);
  return (
    <TouchableOpacity
      style={[styles.duaRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
      activeOpacity={0.7}
      onPress={() => router.push(`/dua/${cat.id}`)}
      accessibilityLabel={`${name}, ${cat.count} duas`}
      accessibilityRole="button"
    >
      <Ionicons name="heart-outline" size={20} color={theme.primary} style={styles.duaIcon} />
      <View style={styles.duaInfo}>
        <Text style={[styles.duaName, { color: theme.text }]}>{name}</Text>
        <Text style={[styles.duaCount, { color: theme.textTertiary }]}>
          {cat.count} {language === 'ar' ? 'دعاء' : language === 'ur' ? 'دعائیں' : 'duas'}
        </Text>
      </View>
      <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={18} color={theme.textTertiary} />
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
  const rtl = isRTL(language);

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
          onPress={() => router.push('/qibla')}
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
          onPress={() => router.push('/prayer-guide')}
        />
        <QuickAccessCard
          icon={<MaterialCommunityIcons name="moon-waning-crescent" size={32} color={theme.primary} />}
          label={t(language, 'ibadah.fastingGuide')}
          theme={theme}
          onPress={() => router.push('/fasting-guide')}
        />
      </View>

      {/* Zakat Calculator */}
      <TouchableOpacity
        style={[styles.duaRow, { backgroundColor: theme.surface, borderColor: theme.border, marginTop: spacing.md }]}
        activeOpacity={0.7}
        onPress={() => router.push('/zakat')}
      >
        <MaterialCommunityIcons name="hand-coin" size={20} color={theme.primary} style={styles.duaIcon} />
        <View style={styles.duaInfo}>
          <Text style={[styles.duaName, { color: theme.text }]}>
            {language === 'ar' ? 'حاسبة الزكاة' : language === 'ur' ? 'زکوٰۃ کیلکولیٹر' : 'Zakat Calculator'}
          </Text>
          <Text style={[styles.duaCount, { color: theme.textTertiary }]}>
            {language === 'ar' ? 'احسب زكاتك' : language === 'ur' ? 'اپنی زکوٰۃ حساب کریں' : 'Calculate your obligatory Zakat'}
          </Text>
        </View>
        <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={18} color={theme.textTertiary} />
      </TouchableOpacity>

      {/* Dua Categories */}
      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: spacing.lg }]}>
        {t(language, 'ibadah.duas')}
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
        {`${t(language, 'ibadah.source')}: Hisnul Muslim`}
      </Text>

      {duaCategories.filter((cat) => countDuasInCategory(cat.id) > 0).map((cat) => (
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
});
