import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { color, fontFamily } from '@/lib/design-system';
import { Meta } from './Typography';

export interface CircularStatProps {
  value: number; // 0–100
  size?: number;
  stroke?: number;
  ringColor?: string;
  label?: string;
  sublabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function CircularStat({
  value,
  size = 140,
  stroke = 12,
  ringColor = color.primary,
  label,
  sublabel,
  style,
}: CircularStatProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c - (c * clamped) / 100;
  const center = size / 2;

  return (
    <View style={[styles.wrap, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={center}
          cy={center}
          r={r}
          stroke={color.border1}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={r}
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c}`}
          strokeDashoffset={dash}
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />
        <SvgText
          x={center}
          y={center + size * 0.08}
          textAnchor="middle"
          fontFamily={fontFamily.monoBold}
          fontSize={size * 0.22}
          fill={ringColor}
        >
          {`${Math.round(clamped)}%`}
        </SvgText>
        {label ? (
          <SvgText
            x={center}
            y={center + size * 0.28}
            textAnchor="middle"
            fontFamily={fontFamily.bodySemibold}
            fontSize={size * 0.07}
            fill={color.fg3}
          >
            {label}
          </SvgText>
        ) : null}
      </Svg>
      {sublabel ? <Meta style={styles.sublabel}>{sublabel}</Meta> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  sublabel: {
    marginTop: 4,
  },
});
