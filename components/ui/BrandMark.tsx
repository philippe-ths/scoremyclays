import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, G, Text as SvgText } from 'react-native-svg';
import { fontFamily, palette } from '@/lib/design-system';

export type BrandMarkVariant = 'icon' | 'clay' | 'logo';

export interface BrandMarkProps {
  variant?: BrandMarkVariant;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Brand marks — React Native recreations of the SVGs under
 * `assets/brand/`. Using `react-native-svg` so they render on native
 * and web without file-loader config.
 */
export function BrandMark({ variant = 'icon', size = 48, style }: BrandMarkProps) {
  if (variant === 'logo') {
    // Logo is 240×64 — scale by width, preserve aspect.
    const w = size;
    const h = Math.round((size * 64) / 240);
    return (
      <View style={style}>
        <Svg width={w} height={h} viewBox="0 0 240 64">
          <G transform="translate(4, 8)">
            <Ellipse cx="24" cy="24" rx="22" ry="7" fill={palette.field[700]} />
            <Ellipse cx="24" cy="22" rx="22" ry="7" fill={palette.field[600]} />
            <Ellipse cx="24" cy="20" rx="16" ry="4" fill={palette.field[400]} opacity={0.6} />
            <Circle cx="32" cy="20" r="2" fill={palette.clay[500]} opacity={0.9} />
          </G>
          <G transform="translate(60, 0)">
            <SvgText
              x="0"
              y="28"
              fontFamily={fontFamily.displayBlack}
              fontSize="22"
              fill={palette.field[700]}
              letterSpacing={-0.5}
            >
              ScoreMyClays
            </SvgText>
            <SvgText
              x="0"
              y="50"
              fontFamily={fontFamily.bodySemibold}
              fontSize="10"
              fill={palette.bone[500]}
              letterSpacing={2}
            >
              TRACK · IMPROVE · COMPETE
            </SvgText>
          </G>
        </Svg>
      </View>
    );
  }

  if (variant === 'clay') {
    return (
      <View style={[styles.square, style]}>
        <Svg width={size} height={size} viewBox="0 0 48 48">
          <Ellipse cx="24" cy="24" rx="20" ry="6" fill={palette.field[900]} />
          <Ellipse cx="24" cy="22" rx="20" ry="6" fill={palette.field[700]} />
          <Ellipse cx="24" cy="20" rx="14" ry="3.5" fill={palette.field[400]} opacity={0.7} />
          <Circle cx="32" cy="20" r="1.5" fill={palette.clay[500]} />
        </Svg>
      </View>
    );
  }

  // 'icon' — the circular app icon mark.
  return (
    <View style={[styles.square, style]}>
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Circle cx="24" cy="24" r="22" fill={palette.field[700]} />
        <Ellipse cx="24" cy="26" rx="14" ry="4" fill={palette.field[400]} />
        <Ellipse cx="24" cy="24" rx="14" ry="4" fill={palette.field[300]} />
        <Circle cx="30" cy="23" r="1.5" fill={palette.clay[500]} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    overflow: 'hidden',
  },
});
