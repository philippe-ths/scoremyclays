import type { PowerSyncBackendConnector, PowerSyncCredentials, AbstractPowerSyncDatabase } from '@powersync/common';
import { UpdateType } from '@powersync/common';
import { supabase } from './supabase';
import type { AuthSession } from '@supabase/supabase-js';

const powerSyncUrl = process.env.EXPO_PUBLIC_POWERSYNC_URL ?? '';

export class SupabaseConnector implements PowerSyncBackendConnector {
  /** Cache the current session so fetchCredentials doesn't need to call getSession() */
  currentSession: AuthSession | null = null;
  private errorListeners = new Set<(error: Error) => void>();

  public addErrorListener(listener: (error: Error) => void) {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  async fetchCredentials(): Promise<PowerSyncCredentials | null> {
    // Use cached session to avoid deadlock when called from onAuthStateChange
    const session = this.currentSession;

    if (!session) {
      return null;
    }

    return {
      endpoint: powerSyncUrl,
      token: session.access_token,
      expiresAt: session.expires_at
        ? new Date(session.expires_at * 1000)
        : undefined,
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) {
      return;
    }

    // Reference tables are read-only (seeded locally, synced from server).
    // Skip their CRUD ops — they'd fail RLS anyway.
    const SKIP_TABLES = new Set(['clubs', 'club_positions', 'club_stands']);

    for (const op of transaction.crud) {
      const table = op.table;
      const id = op.id;

      if (SKIP_TABLES.has(table)) continue;

      try {
        switch (op.op) {
          case UpdateType.PUT: {
            const data = { ...op.opData, id };
            const { error } = await supabase.from(table).upsert(data);
            if (error) throw new Error(`PUT ${table}/${id}: ${error.message}`);
            break;
          }
          case UpdateType.PATCH: {
            const { error } = await supabase.from(table).update(op.opData!).eq('id', id);
            if (error) throw new Error(`PATCH ${table}/${id}: ${error.message}`);
            break;
          }
          case UpdateType.DELETE: {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw new Error(`DELETE ${table}/${id}: ${error.message}`);
            break;
          }
        }
      } catch (error) {
        // Non-retryable errors (RLS violations, constraint errors):
        // log and continue so the transaction can be completed.
        // Rethrowing would block the entire CRUD queue forever.
        const err = error instanceof Error ? error : new Error(String(error));
        console.error(`Upload error (skipping): ${err.message}`);
        for (const listener of this.errorListeners) {
          listener(err);
        }
      }
    }

    await transaction.complete();
  }
}
