import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';

const { width } = Dimensions.get('window');
const MIN_SPLASH_MS = 1800;

export default function SplashScreen() {
  const isLoading = useAppStore((s) => s.isLoading);
  const onboardingCompleted = useAppStore((s) => s.settings.onboardingCompleted);

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
    <View style={styles.container}>
      <Animated.View style={[styles.glowCircle, { opacity: glowOpacity }]} />

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoOuter}>
          <View style={styles.logoInner}>
            <Text style={styles.logoArabic}>{'\u0646'}</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: nameOpacity, alignItems: 'center' }}>
        <Text style={styles.appNameArabic}>{'\u0646\u0650\u064A\u0651\u0629'}</Text>
        <Text style={styles.appNameLatin}>NIYYAH</Text>
        <Text style={styles.tagline}>Your Daily Islamic Companion</Text>
      </Animated.View>

      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <LoadingDot key={i} delay={i * 250} />
        ))}
      </View>
    </View>
  );
}

function LoadingDot({ delay }: { delay: number }) {
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

  return <Animated.View style={[styles.dot, { opacity }]} />;
}

const LOGO_SIZE = width * 0.28;
const GLOW_SIZE = LOGO_SIZE * 2.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#022C22',
  },
  glowCircle: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: '#059669',
  },
  logoContainer: {
    marginBottom: 28,
  },
  logoOuter: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(52, 211, 153, 0.35)',
  },
  logoInner: {
    width: LOGO_SIZE * 0.72,
    height: LOGO_SIZE * 0.72,
    borderRadius: (LOGO_SIZE * 0.72) / 2,
    backgroundColor: '#059669',
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
    color: '#D1FAE5',
    fontWeight: '300',
    marginBottom: 4,
  },
  appNameLatin: {
    fontSize: 16,
    color: '#34D399',
    fontWeight: '600',
    letterSpacing: 6,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(167, 243, 208, 0.6)',
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
    backgroundColor: '#34D399',
  },
});
