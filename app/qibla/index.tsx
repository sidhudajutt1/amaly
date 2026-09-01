import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Svg, { Circle, Line, G, Text as SvgText } from 'react-native-svg';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { getQiblaDirection, getDistanceToMakkah } from '../../src/services/prayerService';
import { t } from '../../src/i18n';
import { formatLocationName, formatDistanceKm } from '../../src/utils/locationDisplay';
import { fontSizes, spacing, borderRadius } from '../../src/theme';

function useHeading(): number | null {
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let sub: any = null;
    let mounted = true;

    (async () => {
      try {
        const { Magnetometer } = await import('expo-sensors');
        Magnetometer.setUpdateInterval(100);
        sub = Magnetometer.addListener((data) => {
          if (!mounted) return;
          let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          angle = (angle + 360) % 360;
          setHeading(angle);
        });
      } catch {
        // expo-sensors not available
      }
    })();

    return () => {
      mounted = false;
      if (sub) sub.remove();
    };
  }, []);

  return heading;
}

export default function QiblaScreen() {
  const language = useAppStore((s) => s.settings.language);
  const locationLat = useAppStore((s) => s.settings.locationLat);
  const locationLng = useAppStore((s) => s.settings.locationLng) ?? 39.8262;
  const lat = locationLat ?? 21.4225;
  const lng = locationLng ?? 39.8262;
  const locationName = useAppStore((s) => s.settings.locationName);
  const { theme } = useTheme();

  const usingDefaultLocation = locationLat === undefined;
  const qiblaAngle = Math.round(getQiblaDirection(lat, lng));
  const distance = getDistanceToMakkah(lat, lng);

  const heading = useHeading();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const prevHeading = useRef(0);

  useEffect(() => {
    if (heading === null) return;
    const rotation = -heading;
    const diff = rotation - prevHeading.current;
    let adjustedDiff = diff;
    if (adjustedDiff > 180) adjustedDiff -= 360;
    if (adjustedDiff < -180) adjustedDiff += 360;
    prevHeading.current = prevHeading.current + adjustedDiff;
    Animated.timing(rotateAnim, {
      toValue: prevHeading.current,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [heading]);

  const compassSize = 280;
  const center = compassSize / 2;
  const radius = center - 30;

  const cardinalDirections = [
    { angle: 0, label: 'N' },
    { angle: 90, label: 'E' },
    { angle: 180, label: 'S' },
    { angle: 270, label: 'W' },
  ];

  const compassRotation = rotateAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const isLive = heading !== null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name={language === 'ar' || language === 'ur' ? 'arrow-forward' : 'arrow-back'} size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {t(language, 'qibla.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.locationText, { color: theme.textSecondary }]}>
          {locationName ? formatLocationName(locationName, language) : t(language, 'qibla.defaultMakkah')}
        </Text>
      </View>

      {usingDefaultLocation && (
        <TouchableOpacity
          style={[styles.defaultHint, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
          onPress={() => router.push('/city-search')}
          accessibilityRole="button"
        >
          <Ionicons name="information-circle-outline" size={18} color={theme.primary} />
          <Text style={[styles.defaultHintText, { color: theme.primary }]}>
            {t(language, 'qibla.defaultLocationHint')}
          </Text>
        </TouchableOpacity>
      )}

      {isLive && (
        <View style={[styles.liveBadge, { backgroundColor: theme.success + '20' }]}>
          <View style={[styles.liveIndicator, { backgroundColor: theme.success }]} />
          <Text style={[styles.liveText, { color: theme.success }]}>
            {t(language, 'qibla.liveCompass')}
          </Text>
        </View>
      )}

      <View style={styles.compassContainer} accessibilityLabel={`Qibla direction: ${qiblaAngle} degrees`}>
        <Animated.View style={{ transform: [{ rotate: compassRotation }] }}>
          <Svg width={compassSize} height={compassSize}>
            <Circle cx={center} cy={center} r={radius} stroke={theme.border} strokeWidth={2} fill="none" />
            <Circle cx={center} cy={center} r={radius - 15} stroke={theme.border} strokeWidth={0.5} fill="none" />

            {Array.from({ length: 72 }).map((_, i) => {
              const angle = i * 5;
              const isCardinal = angle % 90 === 0;
              const isMajor = angle % 30 === 0;
              const outerR = radius;
              const innerR = isCardinal ? radius - 20 : isMajor ? radius - 12 : radius - 7;
              const rad = (angle - 90) * (Math.PI / 180);
              return (
                <Line
                  key={i}
                  x1={center + innerR * Math.cos(rad)}
                  y1={center + innerR * Math.sin(rad)}
                  x2={center + outerR * Math.cos(rad)}
                  y2={center + outerR * Math.sin(rad)}
                  stroke={isCardinal ? theme.text : theme.textTertiary}
                  strokeWidth={isCardinal ? 2 : 1}
                />
              );
            })}

            {cardinalDirections.map((d) => {
              const rad = (d.angle - 90) * (Math.PI / 180);
              const labelR = radius - 30;
              return (
                <SvgText
                  key={d.label}
                  x={center + labelR * Math.cos(rad)}
                  y={center + labelR * Math.sin(rad) + 5}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight="bold"
                  fill={d.label === 'N' ? '#E53935' : theme.text}
                >
                  {d.label}
                </SvgText>
              );
            })}

            <G rotation={qiblaAngle} origin={`${center}, ${center}`}>
              <Line
                x1={center} y1={center}
                x2={center} y2={center - radius + 35}
                stroke={theme.primary} strokeWidth={3} strokeLinecap="round"
              />
              <Line
                x1={center - 8} y1={center - radius + 50}
                x2={center} y2={center - radius + 35}
                stroke={theme.primary} strokeWidth={3} strokeLinecap="round"
              />
              <Line
                x1={center + 8} y1={center - radius + 50}
                x2={center} y2={center - radius + 35}
                stroke={theme.primary} strokeWidth={3} strokeLinecap="round"
              />
              <SvgText
                x={center}
                y={center - radius + 28}
                textAnchor="middle"
                fontSize={11}
                fontWeight="bold"
                fill={theme.primary}
              >
                ☪
              </SvgText>
            </G>

            <Circle cx={center} cy={center} r={8} fill={theme.primary} />
            <Circle cx={center} cy={center} r={4} fill={theme.background} />
          </Svg>
        </Animated.View>
      </View>

      <View style={styles.infoRow}>
        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.infoValue, { color: theme.primary }]}>{`${qiblaAngle}°`}</Text>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            {t(language, 'qibla.direction')}
          </Text>
        </View>
        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.infoValue, { color: theme.primary }]}>{formatDistanceKm(distance, language)}</Text>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            {t(language, 'qibla.distance')}
          </Text>
        </View>
      </View>

      {!isLive && (
        <Text style={[styles.note, { color: theme.textTertiary }]}>
          {t(language, 'qibla.compassNote')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  title: { fontSize: fontSizes.heading2, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center', marginBottom: spacing.sm },
  locationText: { fontSize: fontSizes.bodySmall },
  defaultHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  defaultHintText: { flex: 1, fontSize: fontSizes.caption, lineHeight: fontSizes.caption * 1.5 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  liveIndicator: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontSize: fontSizes.caption, fontWeight: '600' },
  compassContainer: { alignItems: 'center', marginVertical: spacing.md },
  infoRow: { flexDirection: 'row', gap: spacing.md, justifyContent: 'center', marginTop: spacing.lg },
  infoCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoValue: { fontSize: fontSizes.heading2, fontWeight: '700' },
  infoLabel: { fontSize: fontSizes.caption, marginTop: 4 },
  note: { fontSize: fontSizes.caption, textAlign: 'center', marginTop: spacing.xl, lineHeight: 20 },
});
