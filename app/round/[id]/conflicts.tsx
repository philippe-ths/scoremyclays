import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePowerSync } from '@powersync/react';
import { smcGetRoundConflicts, smcResolveConflict, type ConflictedShotGroup } from '@/db/queries/smc-scoring';
import { smcGetRound } from '@/db/queries/smc-rounds';
import { smcGetSquadByRound, smcListShooterEntries } from '@/db/queries/smc-squads';
import { useAuth } from '@/providers/AuthProvider';
import { color, radius, space } from '@/lib/design-system';
import LoadingPlaceholder from '@/components/LoadingPlaceholder';
import type { ShooterEntry, TargetResultRecord } from '@/lib/types';
import {
  Body,
  BodySm,
  Button,
  Card,
  H1,
  H2,
  Screen,
  TopBar,
  Typography,
} from '@/components/ui';

type ResolvedMap = Record<string, string>;

export default function ConflictsScreen() {
  const { id: roundId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = usePowerSync();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [conflicts, setConflicts] = useState<ConflictedShotGroup[]>([]);
  const [shooters, setShooters] = useState<Record<string, ShooterEntry>>({});
  const [resolved, setResolved] = useState<ResolvedMap>({});

  useEffect(() => {
    (async () => {
      if (!roundId) return;
      const round = await smcGetRound(db, roundId);
      if (!round || round.created_by !== user?.id) {
        Alert.alert('Unauthorized', 'Only the round organizer can resolve conflicts.');
        router.back();
        return;
      }
      const squad = await smcGetSquadByRound(db, roundId);
      if (squad) {
        const shooterList = await smcListShooterEntries(db, squad.id);
        const map: Record<string, ShooterEntry> = {};
        shooterList.forEach((s) => {
          map[s.id] = s;
        });
        setShooters(map);
      }
      setConflicts(await smcGetRoundConflicts(db, roundId));
      setIsLoading(false);
    })();
  }, [db, roundId, router, user?.id]);

  const handleSelect = (groupKey: string, keepId: string) => {
    setResolved((prev) => ({ ...prev, [groupKey]: keepId }));
  };

  const handleCommit = async () => {
    if (Object.keys(resolved).length < conflicts.length) {
      Alert.alert('Incomplete', 'Please select the correct score for all conflicts.');
      return;
    }
    try {
      setIsLoading(true);
      for (const group of conflicts) {
        const groupKey = `${group.shooter_entry_id}_${group.target_number}_${group.bird_number}`;
        const keepId = resolved[groupKey];
        if (keepId) {
          const deleteIds = group.records.filter((r) => r.id !== keepId).map((r) => r.id);
          await smcResolveConflict(db, keepId, deleteIds);
        }
      }
      Alert.alert('Success', 'All conflicts resolved.');
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to resolve conflicts.');
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingPlaceholder message="Loading conflicts…" />;

  if (conflicts.length === 0) {
    return (
      <Screen>
        <TopBar title="Conflicts" onBack={() => router.back()} />
        <View style={styles.empty}>
          <Ionicons name="checkmark-circle-outline" size={64} color={color.hit} />
          <H2 align="center" style={{ marginTop: space[4] }}>
            No Conflicts Found
          </H2>
          <Button
            label="Go Back"
            variant="primary"
            size="md"
            onPress={() => router.back()}
            style={{ marginTop: space[6] }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Resolve Conflicts" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.intro}>
          <H1>Resolve Conflicts</H1>
          <Body tone="muted" style={{ marginTop: space[2] }}>
            Offline sync has produced multiple scores for the same shots. Select the correct score to keep.
          </Body>
        </View>

        {conflicts.map((group) => {
          const groupKey = `${group.shooter_entry_id}_${group.target_number}_${group.bird_number}`;
          const shooterName = shooters[group.shooter_entry_id]?.shooter_name || 'Unknown Shooter';
          return (
            <Card key={groupKey} style={{ marginBottom: space[4] }}>
              <Body weight="600">
                {shooterName} — Target {group.target_number}, Bird {group.bird_number}
              </Body>
              <View style={{ marginTop: space[3], gap: space[2] }}>
                {group.records.map((r: TargetResultRecord) => {
                  const isSelected = resolved[groupKey] === r.id;
                  const resultColor =
                    r.result === 'KILL'
                      ? color.hit
                      : r.result === 'LOSS'
                        ? color.miss
                        : color.noBird;
                  return (
                    <Pressable
                      key={r.id}
                      onPress={() => handleSelect(groupKey, r.id)}
                      style={[styles.option, isSelected && styles.optionSelected]}
                    >
                      <View style={{ flex: 1 }}>
                        <Typography
                          style={{
                            color: resultColor,
                            fontWeight: '700',
                            fontSize: 18,
                          }}
                        >
                          {r.result}
                        </Typography>
                        <BodySm tone="muted" style={{ marginTop: space[1] - 2 }}>
                          Recorded by:{' '}
                          {r.recorded_by === user?.id ? 'You' : r.recorded_by.substring(0, 8)}
                        </BodySm>
                      </View>
                      <View style={styles.radio}>
                        {isSelected ? <View style={styles.radioInner} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          );
        })}

        <Button
          label="Save & Resolve"
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleCommit}
          style={{ marginTop: space[4] }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: space[5],
    paddingBottom: space[12],
  },
  intro: {
    marginBottom: space[6],
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space[6],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: space[4],
    borderRadius: radius.md,
    backgroundColor: color.bgElevated,
    borderWidth: 1,
    borderColor: color.border1,
  },
  optionSelected: {
    borderColor: color.primary,
    backgroundColor: color.bgSunken,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: color.primary,
  },
});
