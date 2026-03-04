import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { usePowerSync } from '@powersync/react';
import { Colors } from '@/lib/constants';
import type { User } from '@/lib/types';
import { searchUsersByDisplayName, searchUserByExactUserId } from '@/db/queries/users';

interface UserSearchProps {
  onSelectUser: (user: User) => void;
  excludeUserId?: string; // User ID to exclude (e.g., current user to prevent self-invite)
  currentUserInternalId?: string; // Internal ID (UUID) to exclude
}

export function UserSearch({ onSelectUser, excludeUserId, currentUserInternalId }: UserSearchProps) {
  const db = usePowerSync();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Search users as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setMessage(null);
      return;
    }

    const timer = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchUsers = async () => {
    setLoading(true);
    setMessage(null);

    try {
      let foundUsers: User[] = [];

      // If query starts with @, search for exact user_id match
      if (query.startsWith('@')) {
        const userIdHandle = query.slice(1);
        const user = await searchUserByExactUserId(db, userIdHandle);
        if (user) {
          foundUsers = [user];
        } else {
          setMessage(`No user found with User ID: @${userIdHandle}`);
        }
      } else {
        // Search by display name (only discoverable users)
        foundUsers = await searchUsersByDisplayName(db, query);
        if (foundUsers.length === 0) {
          setMessage('No users found. Try searching by exact User ID (e.g., @username).');
        }
      }

      // Filter out excluded users
      if (excludeUserId) {
        foundUsers = foundUsers.filter(u => u.user_id !== excludeUserId);
      }
      if (currentUserInternalId) {
        foundUsers = foundUsers.filter(u => u.id !== currentUserInternalId);
      }

      setResults(foundUsers);
    } catch (err) {
      console.error('Error searching users:', err);
      setMessage('Error searching users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or @userId"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
        />
        {loading && <ActivityIndicator size="small" color={Colors.primary} />}
      </View>

      {message && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => {
                onSelectUser(item);
                setQuery('');
                setResults([]);
              }}
            >
              <View style={styles.resultContent}>
                <Text style={styles.resultName}>{item.display_name}</Text>
                <Text style={styles.resultUserId}>@{item.user_id}</Text>
              </View>
              <Text style={styles.inviteButton}>Invite →</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 4,
  },
  messageContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#FBBF24',
  },
  messageText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.bgSecondary,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  resultUserId: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  inviteButton: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 12,
  },
});
