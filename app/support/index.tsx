import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { t } from '../../src/i18n';
import { FEEDBACK_EMAIL } from '../../src/data/feedback';
import { requestAppReview, shareAmaly } from '../../src/services/appReview';
import { fontSizes, spacing, borderRadius, lineHeights } from '../../src/theme';
import { getTranslationFontFamily } from '../../src/theme/typography';

export default function SupportScreen() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();

  const openFeedback = () => {
    const subject = encodeURIComponent(t(language, 'settings.shareFeedback') + ' — Amaly');
    const body = encodeURIComponent(t(language, 'support.intro') + '\n\n');
    Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={t(language, 'support.title')} language={language} theme={theme} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
          <MaterialCommunityIcons name="hand-heart" size={36} color={theme.primary} />
          <Text style={[styles.quote, { color: theme.text, fontFamily: getTranslationFontFamily(language) }]}>
            {t(language, 'support.hadithQuote')}
          </Text>
          <Text style={[styles.quoteSource, { color: theme.textSecondary }]}>{t(language, 'support.hadithSource')}</Text>
          <Text style={[styles.intro, { color: theme.text, fontFamily: getTranslationFontFamily(language) }]}>
            {t(language, 'support.intro')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => void shareAmaly(language)}
          activeOpacity={0.7}
        >
          <Ionicons name="share-social-outline" size={22} color={theme.primary} />
          <View style={styles.actionCopy}>
            <Text style={[styles.actionTitle, { color: theme.text }]}>{t(language, 'support.shareApp')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={openFeedback}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme.primary} />
          <View style={styles.actionCopy}>
            <Text style={[styles.actionTitle, { color: theme.text }]}>{t(language, 'support.sendFeedback')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => void requestAppReview(language)}
          activeOpacity={0.7}
        >
          <Ionicons name="star-outline" size={22} color={theme.primary} />
          <View style={styles.actionCopy}>
            <Text style={[styles.actionTitle, { color: theme.text }]}>{t(language, 'support.rateApp')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.emailRow} onPress={() => Linking.openURL(`mailto:${FEEDBACK_EMAIL}`)}>
          <Ionicons name="mail-outline" size={18} color={theme.primary} />
          <Text style={{ color: theme.primary, marginStart: spacing.sm }}>{FEEDBACK_EMAIL}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  hero: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  quote: {
    fontSize: fontSizes.body,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.md,
    lineHeight: fontSizes.body * lineHeights.latin,
  },
  quoteSource: { fontSize: fontSizes.caption, marginTop: spacing.sm },
  intro: {
    fontSize: fontSizes.bodySmall,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: fontSizes.bodySmall * 1.6,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  actionCopy: { flex: 1 },
  actionTitle: { fontSize: fontSizes.body, fontWeight: '700' },
  emailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
});
