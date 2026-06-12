import { ScrollView, StyleSheet, View } from 'react-native';
import { color, space } from '@/lib/design-system';
import { formatStandDetail } from '@/lib/formatting';
import type { ClubStand } from '@/lib/types';
import {
  Badge,
  Body,
  Card,
  Meta,
  Screen,
  TopBar,
} from '@/components/ui';

interface StandSelectorProps {
  positionName: string;
  stands: ClubStand[];
  completedStandIds: Set<string>;
  onSelectStand: (clubStand: ClubStand) => void;
  onBack: () => void;
}

export default function StandSelector({
  positionName,
  stands,
  completedStandIds,
  onSelectStand,
  onBack,
}: StandSelectorProps) {
  return (
    <Screen>
      <TopBar title={positionName} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ gap: space[2] }}>
          {stands.map((stand) => {
            const isCompleted = completedStandIds.has(stand.id);
            return (
              <Card
                key={stand.id}
                onPress={() => onSelectStand(stand)}
                style={{
                  borderColor: isCompleted ? color.hit : color.border1,
                  borderLeftWidth: isCompleted ? 4 : 1,
                  borderLeftColor: isCompleted ? color.hit : color.border1,
                }}
              >
                <View style={styles.header}>
                  <Body weight="600" style={{ flex: 1 }}>
                    Stand {stand.stand_number}
                  </Body>
                  {isCompleted ? <Badge label="Done" tone="success" /> : null}
                </View>
                <Meta style={{ marginTop: space[1] }}>{formatStandDetail(stand)}</Meta>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space[5],
    paddingBottom: space[12],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
});
