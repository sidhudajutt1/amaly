import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Svg, { Circle, Line, G, Text as SvgText } from 'react-native-svg';
import { useAppStore } from '../../src/store/useAppStore';
import { useTheme } from '../../src/hooks/useTheme';
import { getQiblaDirection, getDistanceToMakkah } from '../../src/services/prayerService';
import { fontSizes, spacing, borderRadius } from '../../src/theme';

export default function QiblaScreen() {
  const language = useAppStore((s) => s.settings.language);
  const locationLat = useAppStore((s) => s.settings.locationLat) ?? 21.4225;
  const locationLng = useAppStore((s) => s.settings.locationLng) ?? 39.8262;
  const locationName = useAppStore((s) => s.settings.locationName);
  const { theme } = useTheme();

  const qiblaAngle = Math.round(getQiblaDirection(locationLat, locationLng));
  const distance = getDistanceToMakkah(locationLat, locationLng);

  const compassSize = 280;
  const center = compassSize / 2;
  const radius = center - 30;

  const cardinalDirections = [
    { angle: 0, label: 'N' },
    { angle: 90, label: 'E' },
    { angle: 180, label: 'S' },
    { angle: 270, label: 'W' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {language === 'ar' ? 'اتجاه القبلة' : language === 'ur' ? 'قبلے کی سمت' : 'Qibla Direction'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Location */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.locationText, { color: theme.textSecondary }]}>
          {locationName || (language === 'ar' ? 'مكة المكرمة' : language === 'ur' ? 'مکہ المکرمہ' : 'Makkah')}
        </Text>
      </View>

      {/* Compass */}
      <View style={styles.compassContainer}>
        <Svg width={compassSize} height={compassSize}>
          {/* Outer ring */}
          <Circle cx={center} cy={center} r={radius} stroke={theme.border} strokeWidth={2} fill="none" />
          <Circle cx={center} cy={center} r={radius - 15} stroke={theme.border} strokeWidth={0.5} fill="none" />

          {/* Degree ticks */}
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

          {/* Cardinal labels */}
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

          {/* Qibla needle */}
          <G rotation={qiblaAngle} origin={`${center}, ${center}`}>
            <Line
              x1={center}
              y1={center}
              x2={center}
              y2={center - radius + 35}
              stroke={theme.primary}
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Arrow tip */}
            <Line
              x1={center - 8}
              y1={center - radius + 50}
              x2={center}
              y2={center - radius + 35}
              stroke={theme.primary}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Line
              x1={center + 8}
              y1={center - radius + 50}
              x2={center}
              y2={center - radius + 35}
              stroke={theme.primary}
              strokeWidth={3}
              strokeLinecap="round"
            />
          </G>

          {/* Center circle */}
          <Circle cx={center} cy={center} r={8} fill={theme.primary} />
          <Circle cx={center} cy={center} r={4} fill={theme.background} />
        </Svg>

        {/* Kaaba icon below compass */}
        <MaterialCommunityIcons name="mosque" size={24} color={theme.primary} style={styles.kaabaIcon} />
      </View>

      {/* Info cards */}
      <View style={styles.infoRow}>
        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.infoValue, { color: theme.primary }]}>{`${qiblaAngle}°`}</Text>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            {language === 'ar' ? 'الاتجاه' : language === 'ur' ? 'سمت' : 'Direction'}
          </Text>
        </View>
        <View style={[styles.infoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.infoValue, { color: theme.primary }]}>{`${distance} km`}</Text>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            {language === 'ar' ? 'المسافة' : language === 'ur' ? 'فاصلہ' : 'Distance'}
          </Text>
        </View>
      </View>

      <Text style={[styles.note, { color: theme.textTertiary }]}>
        {language === 'ar' ? 'الاتجاه محسوب من موقعك. للدقة القصوى، استخدم بوصلة فعلية.' : language === 'ur' ? 'سمت آپ کے مقام سے حساب کی گئی ہے۔ زیادہ درستی کے لیے فزیکل کمپاس استعمال کریں۔' : 'Direction calculated from your location. For best accuracy, use a physical compass.'}
      </Text>
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
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center', marginBottom: spacing.lg },
  locationText: { fontSize: fontSizes.bodySmall },
  compassContainer: { alignItems: 'center', marginVertical: spacing.lg },
  kaabaIcon: { marginTop: spacing.sm },
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
