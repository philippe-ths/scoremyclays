import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { usePowerSync } from '@powersync/react';
import { smcListClubs } from '@/db/queries/smc-clubs';
import { space } from '@/lib/design-system';
import LoadingPlaceholder from '@/components/LoadingPlaceholder';
import type { Club } from '@/lib/types';
import {
  Body,
  BodySm,
  Card,
  H1,
  Meta,
  Screen,
  TextInput,
} from '@/components/ui';

export default function ClubsScreen() {
  const router = useRouter();
  const db = usePowerSync();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadClubs = useCallback(async () => {
    const results = await smcListClubs(db, search || undefined);
    setClubs(results);
    setIsLoading(false);
  }, [db, search]);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  return (
    <Screen>
      <View style={styles.header}>
        <H1>Grounds</H1>
        <Meta>Find a Club</Meta>
      </View>
      <View style={styles.searchWrap}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search grounds…"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
      {isLoading ? (
        <LoadingPlaceholder />
      ) : clubs.length === 0 ? (
        <View style={styles.centered}>
          <BodySm tone="muted">
            {search ? 'No grounds match your search.' : 'No grounds available.'}
          </BodySm>
        </View>
      ) : (
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: space[2] }} />}
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/clubs/${item.id}`)}>
              <Body weight="600">{item.name}</Body>
              {item.description ? (
                <BodySm tone="muted" numberOfLines={2} style={{ marginTop: space[1] }}>
                  {item.description}
                </BodySm>
              ) : null}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: space[5],
    paddingTop: space[3],
    paddingBottom: space[3],
  },
  searchWrap: {
    paddingHorizontal: space[5],
    paddingBottom: space[3],
  },
  list: {
    paddingHorizontal: space[5],
    paddingBottom: space[12],
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
