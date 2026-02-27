import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../src/store/useAppStore';
import { t } from '../../src/i18n';
import { useTheme } from '../../src/hooks/useTheme';
import { usePrayerTimes } from '../../src/hooks/usePrayerTimes';
import { formatTime } from '../../src/services/prayerService';
import { fontSizes, spacing } from '../../src/theme';

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
  const icons: Record<string, string> = {
    today: '🌅',
    quran: '📖',
    hadith: '📚',
    ibadah: '🤲',
    prayer: '🕌',
  };
  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.6 }}>
      {icons[name] || '●'}
    </Text>
  );
}

function PrayerBar() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const { nextPrayer, countdown } = usePrayerTimes();

  const prayerNameKey = nextPrayer
    ? `prayer.${nextPrayer.name}` as const
    : 'prayer.dhuhr';
  const timeStr = nextPrayer ? formatTime(nextPrayer.time) : '--:--';
  const countdownStr = countdown
    ? `${countdown.hours}${t(language, 'prayer.hours')} ${countdown.minutes}${t(language, 'prayer.minutes')}`
    : '';

  return (
    <View style={[styles.prayerBar, { backgroundColor: theme.prayerBar }]}>
      <Text style={[styles.prayerBarText, { color: theme.prayerBarText }]}>
        {t(language, prayerNameKey)} {timeStr} — {countdownStr}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const language = useAppStore((s) => s.settings.language);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

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
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopColor: theme.border,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            paddingTop: spacing.xs,
          },
          tabBarLabelStyle: {
            fontSize: fontSizes.tabLabel,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="today"
          options={{
            title: t(language, 'tabs.today'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="today" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="quran"
          options={{
            title: t(language, 'tabs.quran'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="quran" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="hadith"
          options={{
            title: t(language, 'tabs.hadith'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="hadith" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ibadah"
          options={{
            title: t(language, 'tabs.ibadah'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="ibadah" focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="prayer"
          options={{
            title: t(language, 'tabs.prayer'),
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name="prayer" focused={focused} color={color} />
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
  },
  prayerBarText: {
    fontSize: fontSizes.prayerBar,
    fontWeight: '600',
  },
});
