import { useRef, useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Share, Dimensions } from 'react-native';
import * as ExpoSharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { IslamicPattern } from '../../src/components/IslamicPattern';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getArabicFontFamily, getTranslationFontFamily } from '../../src/theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GreetingTemplate {
  id: string;
  titleKey: keyof typeof import('../../src/i18n/locales/en').en.greetings;
  messageEn: string;
  messageAr: string;
  messageUr: string;
  duaAr?: string;
}

const GREETINGS: GreetingTemplate[] = [
  {
    id: 'jummah',
    titleKey: 'jummahMubarak',
    messageEn: 'Jummah Mubarak! May this blessed day bring you peace and barakah.',
    messageAr: 'جمعة مباركة! نسأل الله أن يجعل هذا اليوم مباركاً عليك.',
    messageUr: 'جمعہ مبارک! اللہ آپ کے لیے اس دن کو برکت والا بنائے۔',
    duaAr: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
  },
  {
    id: 'ramadan',
    titleKey: 'ramadanKareem',
    messageEn: 'Ramadan Kareem! May Allah accept your fasting and prayers.',
    messageAr: 'رمضان كريم! تقبل الله صيامكم وصلاتكم.',
    messageUr: 'رمضان کریم! اللہ آپ کے روزے اور نمازیں قبول فرمائے۔',
    duaAr: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
  },
  {
    id: 'eid',
    titleKey: 'eidMubarak',
    messageEn: 'Eid Mubarak! May Allah bless you and your family.',
    messageAr: 'عيد مبارك! بارك الله فيكم وفي أهلكم.',
    messageUr: 'عید مبارک! اللہ آپ اور آپ کے گھر والوں کو برکت دے۔',
    duaAr: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنكُم',
  },
  {
    id: 'custom',
    titleKey: 'customAyah',
    messageEn: 'Indeed, Allah is with the patient.',
    messageAr: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    messageUr: 'بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔',
    duaAr: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
  },
];

export default function GreetingsScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const [selected, setSelected] = useState(GREETINGS[0]!);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<View>(null);

  const message =
    language === 'ar' ? selected.messageAr : language === 'ur' ? selected.messageUr : selected.messageEn;

  const handleShare = useCallback(async () => {
    setSharing(true);
    try {
      const isAvailable = await ExpoSharing.isAvailableAsync();
      if (isAvailable && cardRef.current) {
        const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
        await ExpoSharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t(language, 'greetings.shareVia') });
      } else {
        await Share.share({ message: `${message}\n\n— Amaly`, title: t(language, `greetings.${selected.titleKey}`) });
      }
    } catch {
      // cancelled
    } finally {
      setSharing(false);
    }
  }, [language, message, selected.titleKey]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={t(language, 'greetings.title')} language={language} theme={theme} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {GREETINGS.map((g) => (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.chip,
                {
                  backgroundColor: selected.id === g.id ? theme.primary : theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setSelected(g)}
            >
              <Text style={{ color: selected.id === g.id ? '#fff' : theme.text, fontWeight: '600', fontSize: fontSizes.caption }}>
                {t(language, `greetings.${g.titleKey}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View ref={cardRef} collapsable={false} style={[styles.card, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
          <IslamicPattern width={SCREEN_WIDTH - spacing.md * 4} height={160} color={theme.primary} opacity={0.08} variant="arch" />
          <MaterialCommunityIcons name="star-crescent" size={28} color={theme.primary} style={{ marginBottom: spacing.sm }} />
          <Text style={[styles.cardTitle, { color: theme.primary }]}>{t(language, `greetings.${selected.titleKey}`)}</Text>
          {selected.duaAr ? (
            <Text style={[styles.duaAr, { color: theme.textArabic, fontFamily: getArabicFontFamily(language) }]}>
              {selected.duaAr}
            </Text>
          ) : null}
          <Text
            style={[
              styles.cardMessage,
              { color: theme.text, fontFamily: getTranslationFontFamily(language), lineHeight: fontSizes.body * lineHeights.latin },
            ]}
          >
            {message}
          </Text>
          <Text style={[styles.brand, { color: theme.textTertiary }]}>— Amaly</Text>
        </View>

        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: theme.primary }]}
          onPress={handleShare}
          disabled={sharing}
        >
          <Text style={styles.shareText}>{t(language, 'greetings.shareVia')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  chips: { gap: 8, marginBottom: spacing.md },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 220,
  },
  cardTitle: { fontSize: fontSizes.heading2, fontWeight: '800', marginBottom: spacing.sm, textAlign: 'center' },
  duaAr: { fontSize: 22, textAlign: 'center', lineHeight: 22 * lineHeights.arabic, marginBottom: spacing.sm },
  cardMessage: { fontSize: fontSizes.body, textAlign: 'center', marginBottom: spacing.md },
  brand: { fontSize: fontSizes.caption },
  shareBtn: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  shareText: { color: '#fff', fontWeight: '700', fontSize: fontSizes.body },
});
