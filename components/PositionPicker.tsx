import { ScrollView, StyleSheet, View } from 'react-native';
import { color, radius, space } from '@/lib/design-system';
import type { PositionWithStands } from '@/lib/types';
import {
  Badge,
  Body,
  Button,
  Card,
  H2,
  Meta,
  Screen,
  TopBar,
} from '@/components/ui';

export type PositionStatus = 'not-started' | 'in-progress' | 'completed';

interface PositionPickerProps {
  positions: PositionWithStands[];
  positionStatuses: Record<string, PositionStatus>;
  onSelectPosition: (position: PositionWithStands) => void;
  onFinishRound: () => void;
}

const BADGE_TONE: Record<PositionStatus, 'neutral' | 'warning' | 'success'> = {
  'not-started': 'neutral',
  'in-progress': 'warning',
  completed: 'success',
};

const STATUS_LABELS: Record<PositionStatus, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const STATUS_BORDER: Record<PositionStatus, string> = {
  'not-started': color.border1,
  'in-progress': color.noBird,
  completed: color.hit,
};

export default function PositionPicker({
  positions,
  positionStatuses,
  onSelectPosition,
  onFinishRound,
}: PositionPickerProps) {
  return (
    <Screen>
      <TopBar title="Scoring" action={{ label: 'Finish Round', onPress: onFinishRound }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <H2 style={{ marginBottom: space[4] }}>Choose a Position</H2>
        <View style={{ gap: space[2] }}>
          {positions.map((position) => {
            const status = positionStatuses[position.id] ?? 'not-started';
            return (
              <Card
                key={position.id}
                onPress={() => onSelectPosition(position)}
                style={{ borderColor: STATUS_BORDER[status], borderLeftWidth: 4 }}
              >
                <View style={styles.cardHeader}>
                  <Body weight="600" style={{ flex: 1 }}>
                    Position {position.position_number}
                    {position.name ? ` — ${position.name}` : ''}
                  </Body>
                  <Badge label={STATUS_LABELS[status]} tone={BADGE_TONE[status]} />
                </View>
                <Meta style={{ marginTop: space[1] }}>
                  {position.stands.length} stand{position.stands.length !== 1 ? 's' : ''}
                </Meta>
              </Card>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Finish Round" variant="primary" size="lg" fullWidth onPress={onFinishRound} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space[5],
    paddingBottom: space[12],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  footer: {
    padding: space[5],
    paddingTop: space[3],
    backgroundColor: color.bgElevated,
    borderTopWidth: 1,
    borderTopColor: color.border1,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },
});
