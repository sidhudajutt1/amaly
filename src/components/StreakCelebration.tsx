import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ThemeColors } from '../theme';
import type { Language } from '../types';
import { t } from '../i18n';

const { width } = Dimensions.get('window');
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface Props {
  visible: boolean;
  streak: number;
  language: Language;
  theme: ThemeColors;
  onDismiss: () => void;
}

export function StreakCelebration({ visible, streak, language, theme, onDismiss }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.4)).current;

  const todayIndex = (new Date().getDay() + 6) % 7;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.4, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      scale.setValue(0);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const streakLabel = language === 'ar'
    ? `اليوم ${streak}`
    : language === 'ur'
      ? `دن ${streak}`
      : `Day ${streak}`;

  const congratsText = language === 'ar'
    ? `الحمد لله! سلسلتك الآن ${streak} ${streak === 1 ? 'يوم' : 'أيام'}`
    : language === 'ur'
      ? `الحمدللہ! آپ کا سلسلہ اب ${streak} دن ہے`
      : `Alhamdulillah! Your streak is now ${streak} day${streak !== 1 ? 's' : ''}`;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <Animated.View style={[styles.glowCircle, { opacity: glow, backgroundColor: theme.primaryLight }]} />

        <Animated.View style={[styles.iconContainer, { transform: [{ scale }] }]}>
          <View style={[styles.iconBg, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <MaterialCommunityIcons name="book-open-page-variant" size={64} color="rgba(255,255,255,0.9)" />
          </View>
        </Animated.View>

        <Text style={styles.streakDay}>{streakLabel}</Text>
        <Text style={styles.congratsText}>{congratsText}</Text>

        <View style={styles.weekRow}>
          {DAYS.map((day, i) => (
            <View
              key={i}
              style={[
                styles.dayDot,
                { backgroundColor: i === todayIndex ? theme.primaryLight : 'rgba(255,255,255,0.2)' },
                i === todayIndex && styles.dayDotActive,
              ]}
            >
              <Text style={[styles.dayText, { color: i === todayIndex ? theme.primary : 'rgba(255,255,255,0.7)' }]}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss} activeOpacity={0.8}>
          <Text style={[styles.dismissText, { color: theme.primary }]}>
            {language === 'ar' ? 'الحمد لله' : language === 'ur' ? 'الحمدللہ' : 'Alhamdulillah'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
  },
  container: {
    width: width * 0.85,
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  glowCircle: {
    position: 'absolute',
    top: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakDay: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  congratsText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 12,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDotActive: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dismissBtn: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
  },
  dismissText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
