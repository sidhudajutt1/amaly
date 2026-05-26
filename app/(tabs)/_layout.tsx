import { Tabs, router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { t } from '../../src/i18n';
import { useTheme } from '../../src/hooks/useTheme';
import { usePrayerTimes } from '../../src/hooks/usePrayerTimes';
import { formatTime } from '../../src/services/prayerService';
import { toHijri, isRamadan } from '../../src/services/hijriService';
import { fontSizes, spacing } from '../../src/theme';

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  const size = focused ? 24 : 22;
  switch (name) {
    case 'today':
      return <Ionicons name={focused ? 'sunny' : 'sunny-outline'} size={size} color={color} />;
    case 'quran':
      return <MaterialCommunityIcons name={focused ? 'book-open-page-variant' : 'book-open-page-variant-outline'} size={size} color={color} />;
    case 'hadith':
      return <Ionicons name={focused ? 'library' : 'library-outline'} size={size} color={color} />;
    case 'ibadah':
      return <MaterialCommunityIcons name={focused ? 'hands-pray' : 'heart-outline'} size={size} color={color} />;
    case 'prayer':
      return <MaterialCommunityIcons name={focused ? 'mosque' : 'clock-outline'} size={size} color={color} />;
    case 'settings':
      return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />;
    default:
      return <Ionicons name="ellipse" size={size} color={color} />;
  }
}

function PrayerBar() {
  const language = useAppStore((s) => s.settings.language);
  const hijriAdjustment = useAppStore((s) => s.settings.hijriAdjustment);
  const { theme } = useTheme();
  const { prayerTimes, nextPrayer, countdown } = usePrayerTimes();

  const hijri = toHijri(new Date(), hijriAdjustment);
  const inRamadan = isRamadan(hijri);

  if (inRamadan && prayerTimes) {
    const fajrTime = formatTime(prayerTimes.fajr);
    const maghribTime = formatTime(prayerTimes.maghrib);

    return (
      <View style={[styles.prayerBar, styles.ramadanBar, { backgroundColor: theme.prayerBar }]}>
        <Text style={[styles.prayerBarText, { color: theme.prayerBarText }]}>
          {`${t(language, 'ramadan.suhoor')} ${fajrTime}`}
        </Text>
        <MaterialCommunityIcons name="moon-waning-crescent" size={14} color={theme.prayerBarText} />
        <Text style={[styles.prayerBarText, { color: theme.prayerBarText }]}>
          {`${t(language, 'ramadan.iftar')} ${maghribTime}`}
        </Text>
      </View>
    );
  }

  if (!prayerTimes) {
    const noLocationLabel = t(language, 'location.setForPrayerTimes');
    const isRTL = language === 'ar' || language === 'ur';
    return (
      <TouchableOpacity
        style={[styles.prayerBar, { backgroundColor: theme.prayerBar }]}
        onPress={() => router.push('/city-search')}
        accessibilityRole="button"
        accessibilityLabel={noLocationLabel}
        accessibilityHint={t(language, 'location.tapToSetCity')}
        activeOpacity={0.8}
      >
        <Text style={[styles.prayerBarText, { color: theme.prayerBarText, opacity: 0.9 }]}>
          {noLocationLabel}
        </Text>
        <Ionicons
          name={isRTL ? 'chevron-back' : 'chevron-forward'}
          size={14}
          color={theme.prayerBarText}
          style={{ opacity: 0.9, marginStart: 4 }}
        />
      </TouchableOpacity>
    );
  }

  const prayerNameKey = nextPrayer
    ? `prayer.${nextPrayer.name}` as const
    : 'prayer.fajr';
  const timeStr = nextPrayer ? formatTime(nextPrayer.time) : '--:--';
  const countdownStr = countdown
    ? `${countdown.hours}${t(language, 'prayer.hours')} ${countdown.minutes}${t(language, 'prayer.minutes')}`
    : '';

  return (
    <TouchableOpacity
      style={[styles.prayerBar, { backgroundColor: theme.prayerBar }]}
      onPress={() => router.push('/prayer')}
      accessibilityRole="button"
      accessibilityLabel={`${t(language, prayerNameKey)} ${timeStr}`}
      activeOpacity={0.85}
    >
      <Text style={[styles.prayerBarText, { color: theme.prayerBarText }]}>
        {`${t(language, prayerNameKey)} ${timeStr} — ${countdownStr}`}
      </Text>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const compactTabs = width < 380;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ paddingTop: insets.top }}>
        <PrayerBar />
      </View>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.tabBarActive,
          tabBarInactiveTintColor: theme.tabBarInactive,
          tabBarShowLabel: !compactTabs,
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopColor: theme.border,
            height: (compactTabs ? 52 : 60) + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: spacing.xs,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
          tabBarItemStyle: {
            paddingHorizontal: compactTabs ? 0 : 2,
          },
        }}
      >
        <Tabs.Screen
          name="today"
          options={{
            title: t(language, 'tabs.today'),
            tabBarAccessibilityLabel: t(language, 'tabs.today'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="today" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="quran"
          options={{
            title: t(language, 'tabs.quran'),
            tabBarAccessibilityLabel: t(language, 'tabs.quran'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="quran" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="hadith"
          options={{
            title: t(language, 'tabs.hadith'),
            tabBarAccessibilityLabel: t(language, 'tabs.hadith'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="hadith" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ibadah"
          options={{
            title: t(language, 'tabs.ibadah'),
            tabBarAccessibilityLabel: t(language, 'tabs.ibadah'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="ibadah" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="prayer"
          options={{
            title: t(language, 'tabs.prayer'),
            tabBarAccessibilityLabel: t(language, 'tabs.prayer'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="prayer" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t(language, 'settings.title'),
            tabBarAccessibilityLabel: t(language, 'settings.title'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="settings" focused={focused} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  prayerBar: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  prayerBarText: {
    fontSize: fontSizes.prayerBar,
    fontWeight: '600',
  },
  ramadanBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
});
