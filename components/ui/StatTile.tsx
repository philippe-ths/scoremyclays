import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { color, fontFamily, fontSize, radius, space } from '@/lib/design-system';
import { Label, Typography } from './Typography';

export interface StatTileProps {
  label: string;
  value: string | number;
  unit?: string;
  tone?: 'default' | 'accent';
  style?: StyleProp<ViewStyle>;
}

export function StatTile({ label, value, unit, tone = 'default', style }: StatTileProps) {
  const valueColor = tone === 'accent' ? color.accent : color.primary;
  return (
    <View style={[styles.tile, style]}>
      <Typography
        style={{
          fontFamily: fontFamily.monoBold,
          fontSize: 28,
          color: valueColor,
          lineHeight: 28,
        }}
      >
        {value}
        {unit ? (
          <Typography
            style={{
              fontFamily: fontFamily.mono,
              fontSize: fontSize.base - 1,
              color: color.fg3,
            }}
          >
            {' '}
            {unit}
          </Typography>
        ) : null}
      </Typography>
      <Label style={styles.label}>{label}</Label>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    padding: space[4],
    backgroundColor: color.bgElevated,
    borderWidth: 1,
    borderColor: color.border1,
    borderRadius: 14,
  },
  label: {
    marginTop: space[2] - 2,
  },
});
