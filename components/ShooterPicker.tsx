import { ScrollView, StyleSheet, View } from 'react-native';
import { color, space } from '@/lib/design-system';
import { MIN_TAP_TARGET_SIZE } from '@/lib/constants';
import type { ShooterEntry, EnrichedShooterEntry } from '@/lib/types';
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

export type ShooterStatus = 'not-started' | 'in-progress' | 'completed';

export interface ShooterProgress {
  recorded: number;
  total: number;
}

interface ShooterPickerProps {
  standLabel: string;
  shooters: (ShooterEntry | EnrichedShooterEntry)[];
  shooterStatuses: Record<string, ShooterStatus>;
  shooterProgress: Record<string, ShooterProgress>;
  onSelectShooter: (shooter: ShooterEntry | EnrichedShooterEntry) => void;
  onBack?: () => void;
  onAllComplete?: () => void;
  allCompleteLabel?: string;
}

const BADGE_TONE: Record<ShooterStatus, 'neutral' | 'warning' | 'success'> = {
  'not-started': 'neutral',
  'in-progress': 'warning',
  completed: 'success',
};

const STATUS_LABELS: Record<ShooterStatus, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const STATUS_BORDER: Record<ShooterStatus, string> = {
  'not-started': color.border1,
  'in-progress': color.noBird,
  completed: color.hit,
};

export default function ShooterPicker({
  standLabel,
  shooters,
  shooterStatuses,
  shooterProgress,
  onSelectShooter,
  onBack,
  onAllComplete,
  allCompleteLabel,
}: ShooterPickerProps) {
  const allCompleted =
    shooters.length > 0 &&
    shooters.every((s) => (shooterStatuses[s.id] ?? 'not-started') === 'completed');

  return (
    <Screen>
      <TopBar title={standLabel} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <H2 style={{ marginBottom: space[4] }}>Choose a Shooter</H2>
        <View style={{ gap: space[2] }}>
          {shooters.map((shooter) => {
            const status = shooterStatuses[shooter.id] ?? 'not-started';
            const progress = shooterProgress[shooter.id];
            return (
              <Card
                key={shooter.id}
                onPress={() => onSelectShooter(shooter)}
                style={{
                  minHeight: MIN_TAP_TARGET_SIZE,
                  borderLeftColor: STATUS_BORDER[status],
                  borderLeftWidth: 4,
                }}
              >
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Body weight="600">{shooter.shooter_name}</Body>
                    {'user_handle' in shooter && shooter.user_handle ? (
                      <Meta style={{ marginTop: 1 }}>@{shooter.user_handle}</Meta>
                    ) : null}
                  </View>
                  <Badge label={STATUS_LABELS[status]} tone={BADGE_TONE[status]} />
                </View>
                <Meta style={{ marginTop: space[1] }}>
                  Position {shooter.position_in_squad}
                  {progress ? ` · ${progress.recorded}/${progress.total} targets` : ''}
                </Meta>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {allCompleted && onAllComplete ? (
        <View style={styles.footer}>
          <Button
            label={allCompleteLabel ?? 'Continue'}
            variant="primary"
            size="lg"
            fullWidth
            onPress={onAllComplete}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space[5],
    paddingBottom: space[12],
  },
  row: {
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
  },
});
