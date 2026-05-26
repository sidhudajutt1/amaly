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

  return (
    <SafeAreaProvider>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'auto'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="surah/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="dua/[categoryId]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="names/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="dhikr/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="calendar/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="goals/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="zakat/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="qibla/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notifications/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="hadith/[collectionId]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="prayer-guide/index" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const layoutStyles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
