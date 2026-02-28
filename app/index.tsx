import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';

export default function Index() {
  const isLoading = useAppStore((s) => s.isLoading);
  const onboardingCompleted = useAppStore((s) => s.settings.onboardingCompleted);

  useEffect(() => {
    if (!isLoading) {
      if (onboardingCompleted) {
        router.replace('/(tabs)/today');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isLoading, onboardingCompleted]);

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>نية</Text>
      <Text style={styles.appNameLatin}>Niyyah</Text>
      <ActivityIndicator size="large" color="#1B6B4A" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F0' },
  appName: { fontSize: 48, fontWeight: '300', color: '#1B6B4A', marginBottom: 4 },
  appNameLatin: { fontSize: 20, fontWeight: '300', letterSpacing: 3, color: '#1B6B4A', marginBottom: 32 },
  spinner: { marginTop: 16 },
});
