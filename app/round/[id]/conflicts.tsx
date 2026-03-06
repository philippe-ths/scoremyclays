import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { getRoundConflicts, resolveConflict, type ConflictedShotGroup } from '@/db/queries/scoring';
import { getRound } from '@/db/queries/rounds';
import { getSquadByRound, listShooterEntries } from '@/db/queries/squads';
import { useAuth } from '@/providers/AuthProvider';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/constants';
import LoadingPlaceholder from '@/components/LoadingPlaceholder';
import type { ShooterEntry, TargetResultRecord } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';

type ResolvedMap = Record<string, string>; // group key (shooter_target_bird) -> keepId

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
    loadConflicts();
  }, [db, roundId]);
  
  async function loadConflicts() {
    if (!roundId) return;
    
    // Authorization check
    const round = await getRound(db, roundId);
    if (!round || round.created_by !== user?.id) {
      Alert.alert('Unauthorized', 'Only the round organizer can resolve conflicts.');
      router.back();
      return;
    }

    const squad = await getSquadByRound(db, roundId);
    if (squad) {
      const shooterList = await listShooterEntries(db, squad.id);
      const shooterMap: Record<string, ShooterEntry> = {};
      shooterList.forEach(s => { shooterMap[s.id] = s; });
      setShooters(shooterMap);
    }

    const c = await getRoundConflicts(db, roundId);
    setConflicts(c);
    setIsLoading(false);
  }

  const handleSelect = (groupKey: string, keepId: string) => {
    setResolved(prev => ({ ...prev, [groupKey]: keepId }));
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
          const deleteIds = group.records.filter(r => r.id !== keepId).map(r => r.id);
          await resolveConflict(db, keepId, deleteIds);
        }
      }
      Alert.alert('Success', 'All conflicts resolved!');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to resolve conflicts.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPlaceholder message="Loading conflicts..." />;
  }

  if (conflicts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-circle-outline" size={64} color={Colors.hit} />
        <Text style={styles.emptyText}>No conflicts found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resolve Conflicts</Text>
      <Text style={styles.subtitle}>
        Offline sync has produced multiple scores for the same shots. Select the correct score to keep.
      </Text>
      
      {conflicts.map(group => {
        const groupKey = `${group.shooter_entry_id}_${group.target_number}_${group.bird_number}`;
        const shooterName = shooters[group.shooter_entry_id]?.shooter_name || 'Unknown Shooter';
        return (
          <View key={groupKey} style={styles.conflictCard}>
            <Text style={styles.cardHeader}>
              {shooterName} — Target {group.target_number}, Bird {group.bird_number}
            </Text>
            
            {group.records.map((r: TargetResultRecord) => {
              const isSelected = resolved[groupKey] === r.id;
              // Assuming r.recorded_by maps to user_id (not name yet)
              return (
                <TouchableOpacity 
                  key={r.id} 
                  style={[styles.recordOption, isSelected && styles.recordOptionSelected]}
                  onPress={() => handleSelect(groupKey, r.id)}
                >
                  <View style={styles.recordLeft}>
                    <Text style={[styles.recordResult, r.result === 'KILL' ? styles.killText : styles.missText]}>
                      {r.result}
                    </Text>
                    <Text style={styles.recordedByText}>
                      Recorded by: {r.recorded_by === user?.id ? 'You' : r.recorded_by.substring(0,8)}
                    </Text>
                  </View>
                  <View style={styles.radio}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}

      <TouchableOpacity style={styles.commitButton} onPress={handleCommit}>
        <Text style={styles.commitButtonText}>Save & Resolve</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.bgPrimary },
  container: { padding: Spacing.lg, paddingBottom: 60 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyText: { fontSize: FontSize.lg, color: Colors.textPrimary, marginVertical: Spacing.lg },
  backButton: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: BorderRadius.md },
  backButtonText: { color: Colors.bgPrimary, fontSize: FontSize.base, fontWeight: '600' },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { fontSize: FontSize.base, color: Colors.textSecondary, marginBottom: Spacing.xl },
  conflictCard: { backgroundColor: Colors.bgSecondary, padding: Spacing.md, borderRadius: BorderRadius.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary, marginBottom: Spacing.md },
  recordOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderRadius: BorderRadius.sm, backgroundColor: Colors.bgPrimary, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  recordOptionSelected: { borderColor: Colors.primary, backgroundColor: '#fff7ed' },
  recordLeft: { flex: 1 },
  recordResult: { fontSize: FontSize.lg, fontWeight: '700', marginBottom: 4 },
  killText: { color: Colors.hit },
  missText: { color: Colors.miss },
  recordedByText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  commitButton: { backgroundColor: Colors.primary, padding: Spacing.lg, borderRadius: BorderRadius.lg, alignItems: 'center', marginTop: Spacing.lg },
  commitButtonText: { color: Colors.bgPrimary, fontSize: FontSize.lg, fontWeight: '700' },
});
