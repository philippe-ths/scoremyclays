import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, fontFamily, fontSize, radius, space } from '@/lib/design-system';
import { Typography } from './Typography';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  index: { active: 'home', inactive: 'home-outline' },
  'new-round': { active: 'add-circle', inactive: 'add-circle-outline' },
  history: { active: 'time', inactive: 'time-outline' },
  profile: { active: 'person-circle', inactive: 'person-circle-outline' },
};

const LABELS: Record<string, string> = {
  index: 'Home',
  'new-round': 'New',
  history: 'History',
  profile: 'Profile',
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const visible = state.routes.filter((r) => ICONS[r.name]);

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(space[2], insets.bottom),
        },
      ]}
    >
      {visible.map((route) => {
        const routeIndex = state.routes.findIndex((r) => r.key === route.key);
        const isActive = state.index === routeIndex;
        const icons = ICONS[route.name];
        const label = LABELS[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.item}
          >
            <Ionicons
              name={isActive ? icons.active : icons.inactive}
              size={24}
              color={isActive ? color.primary : color.fg3}
            />
            <Typography
              style={{
                fontFamily: isActive ? fontFamily.bodyBold : fontFamily.bodyMedium,
                fontSize: fontSize.xs - 1,
                color: isActive ? color.primary : color.fg3,
                marginTop: 2,
              }}
            >
              {label}
            </Typography>
            <View
              style={[
                styles.indicator,
                { opacity: isActive ? 1 : 0 },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: color.bgElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.border1,
    paddingTop: space[2],
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[1] + 2,
  },
  indicator: {
    width: 18,
    height: 3,
    backgroundColor: color.primary,
    borderRadius: radius.sm - 4,
    marginTop: 2,
  },
});
