import { UpdateType } from '@powersync/common';

// Mock supabase before importing connector
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      upsert: jest.fn().mockResolvedValue({ error: null }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
    }),
  },
}));

import { SupabaseConnector } from '@/lib/powersync-connector';
import { supabase } from '@/lib/supabase';

function createMockTransaction(crud: any[]) {
  return {
    crud,
    complete: jest.fn().mockResolvedValue(undefined),
  };
}

describe('SupabaseConnector', () => {
  let connector: SupabaseConnector;

  beforeEach(() => {
    connector = new SupabaseConnector();
    jest.clearAllMocks();
  });

  describe('fetchCredentials', () => {
    it('returns null when no session cached', async () => {
      connector.currentSession = null;
      const result = await connector.fetchCredentials();
      expect(result).toBeNull();
    });

    it('returns credentials from cached session', async () => {
      connector.currentSession = {
        access_token: 'test-token',
        expires_at: 1700000000,
      } as any;

      const result = await connector.fetchCredentials();

      expect(result).not.toBeNull();
      expect(result!.token).toBe('test-token');
    });
  });

  describe('uploadData', () => {
    it('skips read-only tables (clubs, club_positions, club_stands)', async () => {
      const mockDb = {
        getNextCrudTransaction: jest.fn().mockResolvedValue(
          createMockTransaction([
            { table: 'clubs', op: UpdateType.PUT, id: 'c1', opData: { name: 'Test' } },
            { table: 'club_positions', op: UpdateType.PUT, id: 'cp1', opData: {} },
            { table: 'club_stands', op: UpdateType.PUT, id: 'cs1', opData: {} },
            { table: 'rounds', op: UpdateType.PUT, id: 'r1', opData: { ground_name: 'Test Ground' } },
          ]),
        ),
      } as any;

      await connector.uploadData(mockDb);

      // Only 'rounds' should trigger a supabase call
      expect(supabase.from).toHaveBeenCalledWith('rounds');
      expect(supabase.from).not.toHaveBeenCalledWith('clubs');
      expect(supabase.from).not.toHaveBeenCalledWith('club_positions');
      expect(supabase.from).not.toHaveBeenCalledWith('club_stands');
    });

    it('handles PUT, PATCH, DELETE operations', async () => {
      const mockDb = {
        getNextCrudTransaction: jest.fn().mockResolvedValue(
          createMockTransaction([
            { table: 'rounds', op: UpdateType.PUT, id: 'r1', opData: { ground_name: 'Test' } },
            { table: 'rounds', op: UpdateType.PATCH, id: 'r2', opData: { status: 'COMPLETED' } },
            { table: 'rounds', op: UpdateType.DELETE, id: 'r3', opData: {} },
          ]),
        ),
      } as any;

      await connector.uploadData(mockDb);

      expect(supabase.from).toHaveBeenCalledTimes(3);
    });

    it('continues on error and notifies listeners', async () => {
      const errorListener = jest.fn();
      connector.addErrorListener(errorListener);

      const mockFrom = jest.fn().mockReturnValue({
        upsert: jest.fn().mockResolvedValue({ error: { message: 'RLS violation' } }),
      });
      (supabase as any).from = mockFrom;

      const mockDb = {
        getNextCrudTransaction: jest.fn().mockResolvedValue(
          createMockTransaction([
            { table: 'rounds', op: UpdateType.PUT, id: 'r1', opData: { ground_name: 'Test' } },
          ]),
        ),
      } as any;

      await connector.uploadData(mockDb);

      expect(errorListener).toHaveBeenCalledWith(expect.any(Error));
    });

    it('completes transaction even when no crud ops', async () => {
      const mockDb = {
        getNextCrudTransaction: jest.fn().mockResolvedValue(null),
      } as any;

      await connector.uploadData(mockDb);

      // Should not throw and should return without calling supabase
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });
});
