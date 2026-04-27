import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, fontFamily, palette, space, tracking } from '@/lib/design-system';
import { Typography } from './Typography';

export interface PhotoHeaderProps {
  title: string;
  eyebrow?: string;
  height?: number;
  /** Optional override of the duotone start→end colours. */
  duotone?: [string, string, string];
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Photo header with a field-green duotone base and a bottom protection
 * gradient to keep text legible. The duotone approximates the CSS preview
 * (linear 135deg → field-500 → field-700 → field-950). A real photo layer
 * can be swapped in later; this remains the placeholder treatment until
 * brand photography is available.
 */
export function PhotoHeader({
  title,
  eyebrow,
  height = 200,
  duotone = [palette.field[400], palette.field[700], palette.field[950]],
  style,
  children,
}: PhotoHeaderProps) {
  return (
    <View style={[styles.wrap, { height }, style]}>
      <LinearGradient
        colors={duotone}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', 'rgba(15,29,13,0.85)']}
        locations={[0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        {eyebrow ? (
          <Typography
            style={{
              fontFamily: fontFamily.bodyBold,
              fontSize: 11,
              color: palette.field[200],
              letterSpacing: tracking.ui,
              textTransform: 'uppercase',
              marginBottom: space[1] + 2,
            }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography
          style={{
            fontFamily: fontFamily.display,
            fontSize: 30,
            color: color.fgInverse,
            lineHeight: 34,
            letterSpacing: -0.3,
          }}
          numberOfLines={2}
        >
          {title}
        </Typography>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    position: 'absolute',
    left: space[5],
    right: space[5],
    bottom: space[4] + 2,
    zIndex: 1,
  },
});
