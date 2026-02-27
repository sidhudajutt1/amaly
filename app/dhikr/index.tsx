import { useState } from 'react';
import { View, Text, TouchableOpacity, Vibration, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius } from '../../src/theme';

const DHIKR_PRESETS = [
  { id: 'subhanallah', ar: 'سُبْحَانَ ٱللَّهِ', en: 'SubhanAllah', target: 33 },
  { id: 'alhamdulillah', ar: 'ٱلْحَمْدُ لِلَّهِ', en: 'Alhamdulillah', target: 33 },
  { id: 'allahuakbar', ar: 'ٱللَّهُ أَكْبَرُ', en: 'Allahu Akbar', target: 34 },
  { id: 'lailahaillallah', ar: 'لَا إِلَٰهَ إِلَّا ٱللَّهُ', en: 'La ilaha illallah', target: 100 },
  { id: 'astaghfirullah', ar: 'أَسْتَغْفِرُ ٱللَّهَ', en: 'Astaghfirullah', target: 100 },
  { id: 'subhanallahi', ar: 'سُبْحَانَ ٱللَّهِ وَبِحَمْدِهِ', en: 'SubhanAllahi wa bihamdihi', target: 100 },
];

export default function DhikrScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);
  const [totalSession, setTotalSession] = useState(0);

  const current = DHIKR_PRESETS[selected];
  const isDone = count >= current.target;
  const progress = Math.min(count / current.target, 1);

  const handleTap = () => {
    if (count < current.target) {
      setCount((c) => c + 1);
      setTotalSession((t) => t + 1);
      Vibration.vibrate(10);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleNext = () => {
    const next = (selected + 1) % DHIKR_PRESETS.length;
    setSelected(next);
    setCount(0);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backText, { color: theme.primary }]}>
            {language === 'ar' || language === 'ur' ? '→' : '←'} {t(language, 'common.back')}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          📿 {t(language, 'ibadah.dhikr')}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Preset Selector */}
      <View style={styles.presetRow}>
        {DHIKR_PRESETS.map((preset, idx) => (
          <TouchableOpacity
            key={preset.id}
            style={[
              styles.presetChip,
              {
                backgroundColor: idx === selected ? theme.primary : theme.surface,
                borderColor: idx === selected ? theme.primary : theme.border,
              },
            ]}
            onPress={() => { setSelected(idx); setCount(0); }}
          >
            <Text style={[styles.presetText, { color: idx === selected ? '#fff' : theme.text }]}>
              {preset.en.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Counter */}
      <View style={styles.counterArea}>
        <Text style={[styles.arabicDhikr, { color: theme.textArabic }]}>
          {current.ar}
        </Text>
        <Text style={[styles.enDhikr, { color: theme.textSecondary }]}>
          {current.en}
        </Text>

        {/* Tap Circle */}
        <TouchableOpacity
          style={[
            styles.tapCircle,
            {
              backgroundColor: isDone ? theme.success : theme.primary,
              shadowColor: isDone ? theme.success : theme.primary,
            },
          ]}
          onPress={handleTap}
          activeOpacity={0.8}
        >
          <Text style={styles.countText}>
            {count}
          </Text>
          <Text style={styles.targetText}>
            / {current.target}
          </Text>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: isDone ? theme.success : theme.primary,
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>

        {isDone && (
          <Text style={[styles.doneText, { color: theme.success }]}>
            ✓ {language === 'ar' ? 'تم' : language === 'ur' ? 'مکمل' : 'Complete!'}
          </Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controlRow}>
        <TouchableOpacity
          style={[styles.controlBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={handleReset}
        >
          <Text style={[styles.controlText, { color: theme.text }]}>
            {t(language, 'ibadah.reset')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlBtn, { backgroundColor: theme.primary }]}
          onPress={handleNext}
        >
          <Text style={[styles.controlText, { color: '#fff' }]}>
            {t(language, 'common.next')} →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Session Total */}
      <Text style={[styles.sessionTotal, { color: theme.textTertiary }]}>
        {language === 'ar' ? 'مجموع الجلسة' : language === 'ur' ? 'سیشن کل' : 'Session total'}: {totalSession}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backText: { fontSize: fontSizes.bodySmall, fontWeight: '600', width: 60 },
  headerTitle: { fontSize: fontSizes.body, fontWeight: '700' },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  presetChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  presetText: { fontSize: fontSizes.caption, fontWeight: '600' },
  counterArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  arabicDhikr: { fontSize: 32, marginBottom: spacing.xs },
  enDhikr: { fontSize: fontSizes.body, marginBottom: spacing.xl },
  tapCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: spacing.lg,
  },
  countText: { color: '#fff', fontSize: 48, fontWeight: '800' },
  targetText: { color: 'rgba(255,255,255,0.7)', fontSize: fontSizes.body },
  progressBar: {
    width: '80%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: { height: '100%', borderRadius: 3 },
  doneText: { fontSize: fontSizes.heading3, fontWeight: '700', marginTop: spacing.sm },
  controlRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  controlBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    minWidth: 120,
    alignItems: 'center',
  },
  controlText: { fontSize: fontSizes.body, fontWeight: '700' },
  sessionTotal: { textAlign: 'center', fontSize: fontSizes.caption },
});
