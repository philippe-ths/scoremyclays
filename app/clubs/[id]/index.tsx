import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { smcGetClubWithDetails } from '@/db/queries/smc-clubs';
import { color, radius, space } from '@/lib/design-system';
import { formatStandDetail, formatPositionTitle } from '@/lib/formatting';
import LoadingPlaceholder from '@/components/LoadingPlaceholder';
import type { Club, PositionWithStands } from '@/lib/types';
import {
  Body,
  BodySm,
  Button,
  Card,
  H2,
  H3,
  Meta,
  PhotoHeader,
  Screen,
} from '@/components/ui';

export default function ClubDetailScreen() {
  const { id: clubId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = usePowerSync();

  const [club, setClub] = useState<Club | null>(null);
  const [positions, setPositions] = useState<PositionWithStands[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!clubId) return;
    const result = await smcGetClubWithDetails(db, clubId);
    if (result) {
      setClub(result.club);
      setPositions(result.positions);
    }
    setIsLoading(false);
  }, [db, clubId]);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) return <LoadingPlaceholder />;
  if (!club) return <LoadingPlaceholder message="Ground not found" />;

  return (
    <Screen edges={['left', 'right']}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.floatingBack}>
        <View style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={color.fgInverse} />
        </View>
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PhotoHeader eyebrow="Ground" title={club.name} height={220} />

        <View style={styles.body}>
          {club.description ? (
            <Body tone="muted">{club.description}</Body>
          ) : null}

          <View style={styles.sectionHead}>
            <H2>Positions</H2>
            <Meta>{positions.length} Configured</Meta>
          </View>

          {positions.length === 0 ? (
            <BodySm tone="muted" align="center" style={{ marginTop: space[4] }}>
              No positions configured for this ground.
            </BodySm>
          ) : (
            <View style={{ gap: space[3] }}>
              {positions.map((position) => (
                <Card key={position.id}>
                  <H3>{formatPositionTitle(position)}</H3>
                  {position.stands.length === 0 ? (
                    <BodySm tone="meta" style={{ marginTop: space[2], fontStyle: 'italic' }}>
                      No stands configured.
                    </BodySm>
                  ) : (
                    <View style={styles.standList}>
                      {position.stands.map((stand) => (
                        <View key={stand.id} style={styles.standRow}>
                          <BodySm>
                            Stand {stand.stand_number} · {formatStandDetail(stand)}
                          </BodySm>
                        </View>
                      ))}
                    </View>
                  )}
                </Card>
              ))}
            </View>
          )}

          <Button
            label="Start Round at This Ground"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.push(`/(tabs)/new-round?clubId=${clubId}`)}
            style={{ marginTop: space[6] }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: space[12],
  },
  floatingBack: {
    position: 'absolute',
    top: space[3],
    left: space[4],
    zIndex: 2,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15,29,13,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: space[5],
    paddingTop: space[5],
    gap: space[4],
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: space[2],
  },
  standList: {
    gap: space[1],
    marginTop: space[2],
  },
  standRow: {
    paddingVertical: space[1],
    paddingLeft: space[3],
    borderLeftWidth: 2,
    borderLeftColor: color.primary,
    borderRadius: radius.sm,
  },
});
