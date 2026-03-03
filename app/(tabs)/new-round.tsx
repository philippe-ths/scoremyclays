import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/providers/AuthProvider';
import { createRound } from '@/db/queries/rounds';
import { createSquad, addShooterEntry } from '@/db/queries/squads';
import { listClubs, getClub } from '@/db/queries/clubs';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/constants';
import type { Club } from '@/lib/types';

const TARGET_OPTIONS = [25, 50, 75, 100];

export default function NewRoundScreen() {
  const router = useRouter();
  const db = usePowerSync();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ clubId?: string }>();

  const [groundName, setGroundName] = useState('');
  const [totalTargets, setTotalTargets] = useState(50);
  const [isCreating, setIsCreating] = useState(false);

  // Club selection state
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubSearch, setClubSearch] = useState('');
  const [clubResults, setClubResults] = useState<Club[]>([]);
  const [showClubDropdown, setShowClubDropdown] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Load club if arriving from club detail screen
  useEffect(() => {
    if (params.clubId) {
      (async () => {
        const club = await getClub(db, params.clubId!);
        if (club) {
          setSelectedClub(club);
          setGroundName(club.name);
          setClubSearch(club.name);
        }
      })();
    }
  }, [db, params.clubId]);

  // Search clubs as user types
  const searchClubs = useCallback(async (query: string) => {
    setClubSearch(query);
    if (query.trim().length === 0) {
      setClubResults([]);
      setShowClubDropdown(false);
      return;
    }
    const results = await listClubs(db, query);
    setClubResults(results);
    setShowClubDropdown(results.length > 0);
  }, [db]);

  function handleSelectClub(club: Club) {
    setSelectedClub(club);
    setClubSearch(club.name);
    setGroundName(club.name);
    setShowClubDropdown(false);
  }

  function handleClearClub() {
    setSelectedClub(null);
    setClubSearch('');
    setGroundName('');
    setShowClubDropdown(false);
  }

  async function handleCreate() {
    if (!user) return;
    const trimmed = groundName.trim();
    if (!trimmed) {
      Alert.alert('Ground name required', 'Please enter the name of the shooting ground or select a club.');
      return;
    }

    setIsCreating(true);
    try {
      const roundId = Crypto.randomUUID();
      const squadId = Crypto.randomUUID();
      const shooterEntryId = Crypto.randomUUID();

      await createRound(db, {
        id: roundId,
        created_by: user.id,
        ground_name: trimmed,
        date: today,
        total_targets: totalTargets,
        club_id: selectedClub?.id ?? null,
      });

      await createSquad(db, { id: squadId, round_id: roundId });

      await addShooterEntry(db, {
        id: shooterEntryId,
        squad_id: squadId,
        user_id: user.id,
        shooter_name: user.display_name,
        position_in_squad: 1,
      });

      setGroundName('');
      setSelectedClub(null);
      setClubSearch('');
      router.push(`/round/${roundId}/setup`);
    } catch (e) {
      Alert.alert('Error', 'Failed to create round. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Club Selection */}
      <Text style={styles.label}>Club (optional)</Text>
      <View style={styles.clubSearchContainer}>
        {selectedClub ? (
          <View style={styles.selectedClubRow}>
            <Text style={styles.selectedClubName}>{selectedClub.name}</Text>
            <TouchableOpacity onPress={handleClearClub}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput
            style={styles.input}
            value={clubSearch}
            onChangeText={searchClubs}
            placeholder="Search for a club..."
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
        {showClubDropdown && (
          <View style={styles.dropdown}>
            {clubResults.map((club) => (
              <TouchableOpacity
                key={club.id}
                style={styles.dropdownItem}
                onPress={() => handleSelectClub(club)}
              >
                <Text style={styles.dropdownItemText}>{club.name}</Text>
                {club.description ? (
                  <Text style={styles.dropdownItemSub} numberOfLines={1}>{club.description}</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {!selectedClub && (
        <>
          <Text style={styles.label}>Shooting Ground</Text>
          <TextInput
            style={styles.input}
            value={groundName}
            onChangeText={setGroundName}
            placeholder="e.g. West London Shooting School"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </>
      )}

      <Text style={styles.label}>Date</Text>
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>{today}</Text>
      </View>

      {!selectedClub && (
        <>
          <Text style={styles.label}>Total Targets</Text>
          <View style={styles.targetRow}>
            {TARGET_OPTIONS.map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.targetBtn, totalTargets === n && styles.targetBtnActive]}
                onPress={() => setTotalTargets(n)}
              >
                <Text style={[styles.targetBtnText, totalTargets === n && styles.targetBtnTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity
        style={[styles.createBtn, isCreating && styles.createBtnDisabled]}
        onPress={handleCreate}
        disabled={isCreating}
      >
        <Text style={styles.createBtnText}>{isCreating ? 'Creating...' : 'Create Round'}</Text>
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
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgSecondary,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: Colors.bgTertiary,
  },
  dateText: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  targetRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  targetBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
  },
  targetBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  targetBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  targetBtnTextActive: {
    color: '#FFFFFF',
  },
  createBtn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  createBtnDisabled: {
    opacity: 0.6,
  },
  createBtnText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clubSearchContainer: {
    position: 'relative',
    zIndex: 10,
  },
  selectedClubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: Colors.bgSecondary,
  },
  selectedClubName: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  clearText: {
    fontSize: FontSize.sm,
    color: Colors.miss,
    marginLeft: Spacing.sm,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    backgroundColor: Colors.bgPrimary,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  dropdownItemSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
