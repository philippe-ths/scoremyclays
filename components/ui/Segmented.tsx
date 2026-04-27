import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { color, radius, shadow, space } from '@/lib/design-system';
import { Typography } from './Typography';

export interface SegmentedProps<T extends string> {
  items: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function Segmented<T extends string>({ items, value, onChange, style }: SegmentedProps<T>) {
  return (
    <View style={[styles.track, style]}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <Pressable
            key={it.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(it.value)}
            style={[
              styles.item,
              active ? [styles.itemActive, shadow.xs] : null,
            ]}
          >
            <Typography
              variant="bodySm"
              tone={active ? 'default' : 'muted'}
              weight="600"
            >
              {it.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: color.bgSunken,
    borderRadius: radius.pill,
    padding: space[1],
    gap: 2,
  },
  item: {
    flex: 1,
    paddingVertical: space[2],
    paddingHorizontal: space[3],
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemActive: {
    backgroundColor: color.bgElevated,
  },
});
