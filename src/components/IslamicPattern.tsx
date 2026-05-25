import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Defs, ClipPath, Rect } from 'react-native-svg';

interface Props {
  width: number;
  height: number;
  color: string;
  opacity?: number;
  variant?: 'arch' | 'border' | 'corner';
}

export function IslamicPattern({ width: w, height: h, color, opacity = 0.08, variant = 'arch' }: Props) {
  if (variant === 'border') {
    return (
      <Svg width={w} height={8} style={styles.borderPattern}>
        {Array.from({ length: Math.ceil(w / 16) }).map((_, i) => (
          <G key={i}>
            <Circle cx={i * 16 + 8} cy={4} r={3} fill={color} opacity={opacity * 3} />
            {i > 0 && (
              <Path
                d={`M${i * 16 - 4} 4 Q${i * 16 + 4} -2 ${i * 16 + 12} 4`}
                stroke={color}
                strokeWidth={1}
                fill="none"
                opacity={opacity * 3}
              />
            )}
          </G>
        ))}
      </Svg>
    );
  }

  if (variant === 'corner') {
    return (
      <Svg width={60} height={60} style={styles.cornerPattern}>
        <Path
          d="M0 60 Q0 0 60 0"
          stroke={color}
          strokeWidth={1.5}
          fill="none"
          opacity={opacity * 4}
        />
        <Path
          d="M0 45 Q0 15 45 0"
          stroke={color}
          strokeWidth={1}
          fill="none"
          opacity={opacity * 3}
        />
        <Path
          d="M0 30 Q0 30 30 0"
          stroke={color}
          strokeWidth={0.5}
          fill="none"
          opacity={opacity * 2}
        />
      </Svg>
    );
  }

  const archCx = w / 2;
  const archR = Math.min(w * 0.4, h * 0.6);

  return (
    <Svg width={w} height={h} style={styles.archPattern}>
      <Defs>
        <ClipPath id="cardClip">
          <Rect x={0} y={0} width={w} height={h} rx={16} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#cardClip)">
        <Path
          d={`M${archCx - archR} ${h} Q${archCx - archR} ${h - archR * 1.4} ${archCx} ${h - archR * 1.4} Q${archCx + archR} ${h - archR * 1.4} ${archCx + archR} ${h}`}
          stroke={color}
          strokeWidth={1.5}
          fill="none"
          opacity={opacity * 2}
        />
        <Path
          d={`M${archCx - archR * 0.7} ${h} Q${archCx - archR * 0.7} ${h - archR} ${archCx} ${h - archR} Q${archCx + archR * 0.7} ${h - archR} ${archCx + archR * 0.7} ${h}`}
          stroke={color}
          strokeWidth={1}
          fill="none"
          opacity={opacity * 1.5}
        />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (Math.PI / 8) * (i + 1);
          const starR = archR * 0.15;
          const cx = archCx + Math.cos(angle * 2) * archR * 0.35;
          const cy = h - archR * 0.7 + Math.sin(angle) * archR * 0.25;
          return (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={starR * 0.3}
              fill={color}
              opacity={opacity * 2}
            />
          );
        })}
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  archPattern: { position: 'absolute', bottom: 0, left: 0 },
  borderPattern: { alignSelf: 'center' },
  cornerPattern: { position: 'absolute', top: 0, right: 0 },
});
