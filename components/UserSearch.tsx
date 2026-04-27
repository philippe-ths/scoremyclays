import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { usePowerSync } from '@powersync/react';
import { color, radius, space } from '@/lib/design-system';
import type { User } from '@/lib/types';
import { smcSearchUsersByDisplayName, smcSearchUsersByUserId } from '@/db/queries/smc-users';
import {
  Body,
  BodySm,
  Card,
  Meta,
  TextInput,
  Typography,
} from '@/components/ui';

interface UserSearchProps {
  onSelectUser: (user: User) => void;
  excludeUserId?: string;
  currentUserInternalId?: string;
}

export function UserSearch({ onSelectUser, excludeUserId, currentUserInternalId }: UserSearchProps) {
  const db = usePowerSync();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setMessage(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      setMessage(null);
      try {
        let found: User[] = [];
        if (query.startsWith('@')) {
          const handle = query.slice(1);
          found = await smcSearchUsersByUserId(db, handle);
          if (found.length === 0) setMessage(`No shooter found matching @${handle}.`);
        } else {
          found = await smcSearchUsersByDisplayName(db, query);
          if (found.length === 0) {
            setMessage('No shooters found. Try searching by exact User ID (e.g. @username).');
          }
        }
        if (excludeUserId) found = found.filter((u) => u.user_id !== excludeUserId);
        if (currentUserInternalId) found = found.filter((u) => u.id !== currentUserInternalId);
        setResults(found);
      } catch (err) {
        console.error('Error searching users:', err);
        setMessage('Error searching. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, db, excludeUserId, currentUserInternalId]);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="Search by name or @userId"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
        </View>
        {loading ? <ActivityIndicator size="small" color={color.primary} /> : null}
      </View>

      {message ? (
        <View style={styles.messageBox}>
          <BodySm style={{ color: '#78350f' }}>{message}</BodySm>
        </View>
      ) : null}

      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: space[2] }} />}
          renderItem={({ item }) => (
            <Card
              onPress={() => {
                onSelectUser(item);
                setQuery('');
                setResults([]);
              }}
              style={styles.resultItem}
            >
              <View style={{ flex: 1 }}>
                <Body weight="600">{item.display_name}</Body>
                <Meta style={{ marginTop: 1 }}>@{item.user_id}</Meta>
              </View>
              <Typography tone="primary" weight="600">
                Invite →
              </Typography>
            </Card>
          )}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space[3],
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  messageBox: {
    backgroundColor: color.noBirdBg,
    paddingHorizontal: space[3],
    paddingVertical: space[2] + 2,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: color.noBird,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
