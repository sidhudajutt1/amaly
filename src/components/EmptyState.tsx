import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path, G, Rect, Line } from 'react-native-svg';
import { fontSizes, spacing, borderRadius } from '../theme';

interface Props {
  illustration: 'quran' | 'mosque' | 'search' | 'star';
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  color: string;
  textColor: string;
  subtitleColor: string;
  surfaceColor: string;
}

function QuranIllustration({ color, size }: { color: string; size: number }) {
  const c = size / 2;
  return (
    <Svg width={size} height={size}>
      <Circle cx={c} cy={c} r={c - 4} fill={color + '15'} />
      <G transform={`translate(${c - 24}, ${c - 30})`}>
        <Rect x={0} y={0} width={48} height={60} rx={4} fill={color + '30'} />
        <Line x1={8} y1={16} x2={40} y2={16} stroke={color} strokeWidth={1.5} opacity={0.5} />
        <Line x1={8} y1={24} x2={36} y2={24} stroke={color} strokeWidth={1.5} opacity={0.4} />
        <Line x1={8} y1={32} x2={40} y2={32} stroke={color} strokeWidth={1.5} opacity={0.3} />
        <Line x1={8} y1={40} x2={32} y2={40} stroke={color} strokeWidth={1.5} opacity={0.25} />
        <Path d="M24 6 L24 12" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
        <Circle cx={24} cy={4} r={2} fill={color} opacity={0.5} />
      </G>
    </Svg>
  );
}

function MosqueIllustration({ color, size }: { color: string; size: number }) {
  const c = size / 2;
  return (
    <Svg width={size} height={size}>
      <Circle cx={c} cy={c} r={c - 4} fill={color + '15'} />
      <G transform={`translate(${c - 28}, ${c - 24})`}>
        <Path d="M28 8 Q28 0 28 0 Q20 6 12 0 Q12 0 12 8" fill="none" stroke={color} strokeWidth={2} opacity={0.6} />
        <Circle cx={28} cy={4} r={2} fill={color} opacity={0.5} />
        <Rect x={8} y={8} width={40} height={36} rx={2} fill={color + '25'} />
        <Path d="M8 20 Q28 6 48 20" fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
        <Rect x={20} y={28} width={16} height={16} rx={8} ry={8} fill={color + '30'} />
        <Line x1={2} y1={44} x2={54} y2={44} stroke={color} strokeWidth={2} opacity={0.4} />
      </G>
    </Svg>
  );
}

function StarIllustration({ color, size }: { color: string; size: number }) {
  const c = size / 2;
  return (
    <Svg width={size} height={size}>
      <Circle cx={c} cy={c} r={c - 4} fill={color + '15'} />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8 - Math.PI / 2;
        const r1 = 16;
        const r2 = 28;
        const inner = i % 2 === 0;
        const r = inner ? r2 : r1;
        return (
          <Circle
            key={i}
            cx={c + Math.cos(angle) * r}
            cy={c + Math.sin(angle) * r}
            r={inner ? 4 : 2.5}
            fill={color}
            opacity={inner ? 0.5 : 0.3}
          />
        );
      })}
      <Circle cx={c} cy={c} r={6} fill={color} opacity={0.4} />
    </Svg>
  );
}

function SearchIllustration({ color, size }: { color: string; size: number }) {
  const c = size / 2;
  return (
    <Svg width={size} height={size}>
      <Circle cx={c} cy={c} r={c - 4} fill={color + '15'} />
      <Circle cx={c - 4} cy={c - 4} r={18} fill="none" stroke={color} strokeWidth={2.5} opacity={0.5} />
      <Line x1={c + 8} y1={c + 8} x2={c + 20} y2={c + 20} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}

const ILLUSTRATIONS = {
  quran: QuranIllustration,
  mosque: MosqueIllustration,
  star: StarIllustration,
  search: SearchIllustration,
};

export function EmptyState({
  illustration, title, subtitle, actionLabel, onAction,
  color, textColor, subtitleColor, surfaceColor,
}: Props) {
  const Illust = ILLUSTRATIONS[illustration];
  return (
    <View style={styles.container}>
      <Illust color={color} size={120} />
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.action, { backgroundColor: color }]}
          onPress={onAction}
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  title: { fontSize: fontSizes.heading3, fontWeight: '700', marginTop: spacing.lg, textAlign: 'center' },
  subtitle: { fontSize: fontSizes.body, marginTop: spacing.sm, textAlign: 'center', lineHeight: fontSizes.body * 1.5 },
  action: { marginTop: spacing.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.md },
  actionText: { color: '#fff', fontSize: fontSizes.body, fontWeight: '700' },
});
