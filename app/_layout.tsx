import { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../src/store/useAppStore';
import { isRTL } from '../src/i18n';

export default function RootLayout() {
  const hydrate = useAppStore((s) => s.hydrate);
  const language = useAppStore((s) => s.settings.language);
  const theme = useAppStore((s) => s.settings.theme);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const shouldBeRTL = isRTL(language);
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.forceRTL(shouldBeRTL);
      I18nManager.allowRTL(shouldBeRTL);
    }
  }, [language]);

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'auto'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="surah/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}
