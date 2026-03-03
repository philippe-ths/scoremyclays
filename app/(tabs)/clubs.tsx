import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { listClubs } from '@/db/queries/clubs';
import { Colors, Spacing, FontSize, BorderRadius } from '@/lib/constants';
import LoadingPlaceholder from '@/components/LoadingPlaceholder';
import type { Club } from '@/lib/types';

export default function ClubsScreen() {
  const router = useRouter();
  const db = usePowerSync();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadClubs = useCallback(async () => {
    const results = await listClubs(db, search || undefined);
    setClubs(results);
    setIsLoading(false);
  }, [db, search]);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  function handleClubPress(clubId: string) {
    router.push(`/clubs/${clubId}`);
  }

  function renderClub({ item }: { item: Club }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleClubPress(item.id)}
      >
        <Text style={styles.clubName}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.clubDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.root}>
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholder="Search clubs..."
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {isLoading ? (
        <LoadingPlaceholder />
      ) : clubs.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            {search ? 'No clubs match your search' : 'No clubs available'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id}
          renderItem={renderClub}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  searchInput: {
    margin: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.bgSecondary,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
  },
  clubName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  clubDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
});
