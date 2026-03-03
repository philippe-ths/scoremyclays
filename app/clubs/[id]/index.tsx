import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { getClubWithDetails } from '@/db/queries/clubs';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/constants';
import { formatStandDetail, formatPositionTitle } from '@/lib/formatting';
import LoadingPlaceholder from '@/components/LoadingPlaceholder';
import type { Club, PositionWithStands } from '@/lib/types';

export default function ClubDetailScreen() {
  const { id: clubId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = usePowerSync();

  const [club, setClub] = useState<Club | null>(null);
  const [positions, setPositions] = useState<PositionWithStands[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!clubId) return;
    const result = await getClubWithDetails(db, clubId);
    if (result) {
      setClub(result.club);
      setPositions(result.positions);
    }
    setIsLoading(false);
  }, [db, clubId]);

  useEffect(() => {
    load();
  }, [load]);

  function handleStartRound() {
    router.push(`/(tabs)/new-round?clubId=${clubId}`);
  }

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  if (!club) {
    return <LoadingPlaceholder message="Club not found" />;
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.clubName}>{club.name}</Text>
      {club.description ? (
        <Text style={styles.clubDescription}>{club.description}</Text>
      ) : null}

      <Text style={styles.sectionTitle}>
        Positions ({positions.length})
      </Text>

      {positions.map((position) => (
        <View key={position.id} style={styles.positionCard}>
          <Text style={styles.positionTitle}>
            {formatPositionTitle(position)}
          </Text>

          {position.stands.map((stand) => (
            <View key={stand.id} style={styles.standRow}>
              <Text style={styles.standDetail}>
                Stand {stand.stand_number} · {formatStandDetail(stand)}
              </Text>
            </View>
          ))}

          {position.stands.length === 0 && (
            <Text style={styles.emptyStands}>No stands configured</Text>
          )}
        </View>
      ))}

      {positions.length === 0 && (
        <Text style={styles.emptyText}>No positions configured for this club</Text>
      )}

      <TouchableOpacity style={styles.startBtn} onPress={handleStartRound}>
        <Text style={styles.startBtnText}>Start Round at This Club</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  clubName: {
    fontSize: FontSize['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  clubDescription: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  positionCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
  },
  positionTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  standRow: {
    paddingVertical: Spacing.xs,
    paddingLeft: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.xs,
  },
  standDetail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  emptyStands: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  startBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  startBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
