import { useEffect } from 'react';
import { I18nManager, Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '../src/store/useAppStore';
import { isRTL } from '../src/i18n';
import { useFontsLoaded } from '../src/hooks/useFontsLoaded';
import { useTheme } from '../src/hooks/useTheme';

export default function RootLayout() {
  const hydrate = useAppStore((s) => s.hydrate);
  const language = useAppStore((s) => s.settings.language);
  const themeMode = useAppStore((s) => s.settings.theme);
  const fontsLoaded = useFontsLoaded();
  const { theme } = useTheme();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const shouldBeRTL = isRTL(language);
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      I18nManager.allowRTL(shouldBeRTL);
    }
  }, [language]);

  if (!fontsLoaded) {
    return (
      <View style={[layoutStyles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const slideIn = isRTL(language) ? 'slide_from_left' : 'slide_from_right';

  return (
    <SafeAreaProvider>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'auto'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="surah/[id]" options={{ animation: slideIn }} />
        <Stack.Screen name="settings/index" options={{ animation: slideIn }} />
        <Stack.Screen name="dua/[categoryId]" options={{ animation: slideIn }} />
        <Stack.Screen name="names/index" options={{ animation: slideIn }} />
        <Stack.Screen name="dhikr/index" options={{ animation: slideIn }} />
        <Stack.Screen name="calendar/index" options={{ animation: slideIn }} />
        <Stack.Screen name="goals/index" options={{ animation: slideIn }} />
        <Stack.Screen name="zakat/index" options={{ animation: slideIn }} />
        <Stack.Screen name="qibla/index" options={{ animation: slideIn }} />
        <Stack.Screen name="notifications/index" options={{ animation: slideIn }} />
        <Stack.Screen name="hadith/[collectionId]" options={{ animation: slideIn }} />
        <Stack.Screen name="prayer-guide/index" options={{ animation: slideIn }} />
        <Stack.Screen name="about/index" options={{ animation: slideIn }} />
        <Stack.Screen name="privacy/index" options={{ animation: slideIn }} />
        <Stack.Screen name="city-search/index" options={{ animation: slideIn }} />
        <Stack.Screen name="juz/index" options={{ animation: slideIn }} />
        <Stack.Screen name="subjects/index" options={{ animation: slideIn }} />
        <Stack.Screen name="subjects/[id]" options={{ animation: slideIn }} />
        <Stack.Screen name="mushaf/index" options={{ animation: slideIn }} />
        <Stack.Screen name="word-by-word/index" options={{ animation: slideIn }} />
        <Stack.Screen name="growth/index" options={{ animation: slideIn }} />
        <Stack.Screen name="archive/index" options={{ animation: slideIn }} />
        <Stack.Screen name="greetings/index" options={{ animation: slideIn }} />
        <Stack.Screen name="fasting-guide/index" options={{ animation: slideIn }} />
        <Stack.Screen name="support/index" options={{ animation: slideIn }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const layoutStyles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
