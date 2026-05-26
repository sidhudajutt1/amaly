import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';
import { useTheme } from '../src/hooks/useTheme';
import { t } from '../src/i18n';

const { width } = Dimensions.get('window');
const MIN_SPLASH_MS = 2500;

export default function SplashScreen() {
  const isLoading = useAppStore((s) => s.isLoading);
  const onboardingCompleted = useAppStore((s) => s.settings.onboardingCompleted);
  const language = useAppStore((s) => s.settings.language);
  const { theme, isDark } = useTheme();

  const [minElapsed, setMinElapsed] = useState(false);
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(nameOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => setMinElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && minElapsed) {
      router.replace(onboardingCompleted ? '/(tabs)/today' : '/onboarding');
    }
  }, [isLoading, minElapsed, onboardingCompleted]);

  const glowOpacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.glowCircle, { opacity: glowOpacity, backgroundColor: theme.primary }]} />

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={[styles.logoOuter, { backgroundColor: `${theme.primary}26`, borderColor: `${theme.primary}59` }]}>
          <View style={[styles.logoInner, { backgroundColor: theme.primary }]}>
            <Text style={styles.logoArabic}>{'\u0639'}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: nameOpacity, alignItems: 'center' }}>
        <Text style={[styles.appNameArabic, { color: isDark ? theme.primaryLight : theme.text }]}>{'\u0639\u064E\u0645\u064E\u0644\u0650\u064A'}</Text>
        <Text style={[styles.appNameLatin, { color: theme.primary }]}>AMALY</Text>
        <Text style={[styles.tagline, { color: theme.textSecondary }]}>{t(language, 'splash.tagline')}</Text>
      </Animated.View>

      <View style={styles.dotsRow} accessibilityLabel={t(language, 'common.loading')}>
        {[0, 1, 2].map((i) => (
          <LoadingDot key={i} delay={i * 250} color={theme.primary} />
        ))}
      </View>
    </View>
  );
}

function LoadingDot({ delay, color }: { delay: number; color: string }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return <Animated.View style={[styles.dot, { opacity, backgroundColor: color }]} />;
}

const LOGO_SIZE = width * 0.28;
const GLOW_SIZE = LOGO_SIZE * 2.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
  },
  logoContainer: {
    marginBottom: 28,
  },
  logoOuter: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  logoInner: {
    width: LOGO_SIZE * 0.72,
    height: LOGO_SIZE * 0.72,
    borderRadius: (LOGO_SIZE * 0.72) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoArabic: {
    fontSize: LOGO_SIZE * 0.38,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -4,
  },
  appNameArabic: {
    fontSize: 36,
    fontWeight: '300',
    marginBottom: 4,
  },
  appNameLatin: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 6,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 80,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
